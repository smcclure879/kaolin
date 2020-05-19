// Config variables: change them to point to your own servers
//REUGLAR-------const SIGNALING_SERVER_URL = 'https://third.ayvexllc.com:3003/'; // this needs be your domain    
const SIGNALING_SERVER_URL = 'https://third.ayvexllc.com:3003/'; // this needs be your domain    
const TURN_SERVER_URL = 'first.ayvexllc.com:3478'; // this can be not your domain do not include turn:  why???
//also  maybe use  'stun.l.google.com:19302' // 'localhost:3478';
const TURN_SERVER_USERNAME = 'user';
const TURN_SERVER_CREDENTIAL = 'pazz';

var room = '--uninit--';
// WebRTC config: you don't have to change this for the example to work
// If you are testing on localhost, you can just use PC_CONFIG = {}
const PC_CONFIG = {
    iceServers: [
	{
	    urls: 'turn:' + TURN_SERVER_URL + '?transport=tcp',
	    username: TURN_SERVER_USERNAME,
	    credential: TURN_SERVER_CREDENTIAL
	},
	{
	    urls: 'turn:' + TURN_SERVER_URL + '?transport=udp',
	    username: TURN_SERVER_USERNAME,
	    credential: TURN_SERVER_CREDENTIAL
	}
    ]
};



const log =  x =>  {    document.querySelector("#log").value += (x+"\n");   }
//log(""+PC_CONFIG.iceServers[0].urls);

// Signaling methods
let socket = io(SIGNALING_SERVER_URL, { autoConnect: false });
socket.on('data', (data) => {
    log('Data received: ',data);
    handleSignalingData(data);
});


function onReadyOrConnect() {
    log('Ready.point7');
    // Connection with signaling server is ready, and so is local stream
    createPeerConnection();
    log('pc created. point9  bugbug');
    sendOffer();
}


let setRoom = () => {
    if (!room) {
	alert('you need to pick a room. setRoom');
	return;
    }
    socket.emit('thisRoom',room);
};


//should go server:whichRoom? client:thisRoom! server:ready!

//bugbug did not work...
socket.on('ready', onReadyOrConnect);
//socket.on('connect', onReadyOrConnect );  //bugbug added
socket.on('connect_error', (err) => { log('did we get here.point5?'+err); } );  //bugbug added
socket.on('error', (err) => { log('did we get here.point6?'+err); } );  //bugbug added
socket.on('whichRoom', setRoom );
let sendData = (data) => {
    log("sending"+dumps(data).substr(0,40));
    socket.emit('data', data);
};

// WebRTC methods
let pc;
let localStream;
let remoteStreamElement = document.querySelector('#remoteStream');
let localStreamElement  = document.querySelector('#localStream' );
let getLocalStream = () => {
    log("point2");
    navigator.mediaDevices.getUserMedia({ audio: true, video: true })
	.then((stream) => {
	    log('Stream found');
	    localStream = stream;
	    localStreamElement.srcObject = stream;
	    localStreamElement.play();

	    //console.log('Got stream with constraints:', constraints);
	    //console.log(`Using video device: ${videoTracks[0].label}`);

	    // Connect after making sure that local stream is availble
	    socket.connect();
	    log('did we connect point3');
	})
	.catch(error => {
	    log('Stream not found: ', error);
	});
}

let createPeerConnection = () => {
    try {
	log("bugbug2228a");
	pc = new RTCPeerConnection(PC_CONFIG);
	log("bugbug2228b");
	pc.onicecandidate = onIceCandidate;
	pc.onaddstream = onAddStream;
	pc.addStream(localStream);
	log('PeerConnection created');
    } catch (error) {
	log('PeerConnection failed: ', error);
    }
};

let sendOffer = () => {
    log('Send offer');
    pc.createOffer().then(
	setAndSendLocalDescription,
	(error) => { log('Send offer failed: ', error); }
    );
};

let sendAnswer = () => {
    log('Send answer');
    pc.createAnswer().then(
	setAndSendLocalDescription,
	(error) => { ('Send answer failed: ', error); }
    );
};

let setAndSendLocalDescription = (sessionDescription) => {
    log('bugbug2237b');
    pc.setLocalDescription(sessionDescription);
    log('Local description set');
    sendData(sessionDescription);
};


let onIceCandidate = (event) => {
    if (event.candidate) {
	log('ICE candidate');
	sendData({
	    type: 'candidate',
	    candidate: event.candidate
	});
    }
};

let onAddStream = (event) => {
    log('Add stream');
    remoteStreamElement.srcObject = event.stream;
};
const dumps = JSON.stringify;

let handleSignalingData = (data) => {
    log("bugbug1555a"+dumps(data).substr(0,20));
    switch (data.type) {
    case 'offer':
	createPeerConnection();
	pc.setRemoteDescription(new RTCSessionDescription(data));
	sendAnswer();
	break;
    case 'answer':
	log('got answer bugbug2238c');
	pc.setRemoteDescription(new RTCSessionDescription(data));
	break;
    case 'candidate':
	log('got ice candidate bugbug2238d');
	pc.addIceCandidate(new RTCIceCandidate(data.candidate));
	break;
    case 'whichRoom':
	log('was asked whichRoom'+room);  //bugbug get from UI?  this is during startup only?
	setRoom();
    }
};



function main() {
    // Start connection
    getLocalStream();
}



let maybeRoom = window.location.pathname;


// roomButton.onclick=function(evt){
//     alert("onclick bugbug2306");
//     room = document.querySelector("#roomName").value;
//     setRoom();
// }

if (/^\/[a-z]{4,8}$/.test(maybeRoom)){
    room=maybeRoom;
    main();
}else{
    alert("bad room");
}
