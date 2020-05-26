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



const dumps = JSON.stringify;
const shorten = (L,x) => {
    if (typeof x == 'undefined') {
	return 'UnDeFiNeD';
    } else {
	x=dumps(x);
	return x.length<L ?  x : x.substr(0,L);
    }
};
const logText = document.querySelector("#log");
const log =  x =>  {    logText.value += (x+"\n");    logText.scrollTop = logText.scrollHeight;    } ;
const log2 = (x,y) => { log( x + " " + shorten(40,y)); } ;
//bugbugconst dom = document.querySelector;

//log(""+PC_CONFIG.iceServers[0].urls);



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

//SPEC for how the dialog works.......   server:whichRoom?     client:thisRoom!      server:ready!

let socket = null;
// Signaling methods
const initSocket = () => {
    socket = io(SIGNALING_SERVER_URL, { autoConnect: false });
    socket.on('data', (data) => {
	log('Data received: ',data);
	handleSignalingData(data);
    });

    //bugbug did not work...
    socket.on('ready', onReadyOrConnect);
    //socket.on('connect', onReadyOrConnect );  //bugbug added
    socket.on('connect_error', (err) => { log('did we get here.point5?'+err); } );  //bugbug added
    socket.on('error', (err) => { log('did we get here.point6?'+err); } );  //bugbug added
    socket.on('whichRoom', setRoom );
    sendData =  (data) => {
	log("sending"+dumps(data).substr(0,40));
	socket.emit('data', data);
    };
};


// WebRTC methods
let pc = null;
let localStream = null;
let remoteStream = null;
let remoteStreamElement = document.querySelector('#remoteStream');
//let remoteStreamElement2 = document.querySelector('#remoteStream2');
let localStreamElement  = document.querySelector('#localStream' );

const streamGetter = (streamType) => {
    if (streamType=='mic')
	return navigator.mediaDevices.getUserMedia({ audio: true, video: false });
    else if (streamType=='cam')
	return navigator.mediaDevices.getUserMedia({ audio: true, video: true });
    else if (streamType=='cap')
	return navigator.mediaDevices.getDisplayMedia({ video: true });
    else
	throw "unknown stream type:"+streamType;
};

const startEverything = (streamType) => {
    initSocket();
    log("point2");
    streamGetter(streamType)
	.then((stream) => {
	    log('Stream found');
	    localStream = stream;
	    localStreamElement.srcObject = stream;
	    localStreamElement.play();

	    

	    //bugbug did this work for screen cap??
	    //activateCapper(stream);

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
		
	pc.onconnectionstatechange = ev => { log2("-------connChange:",ev);  } ; 
	pc.onaddstream             = ev => { log2("------bugbug1434j=",ev);  onAddStream(ev) };
	//mozilla claims to want....but probls in chrome....
	pc.ontrack                 = ev => { log2("-------ontrack,bugbug1709i",ev.streams); onAddTrack(ev); };  
	//pc.addEventListener("track", ev => { log2("-------trackEvt,bugbug2020m,streams=",ev.streams);   /*onTrack(ev);*/	});
	
	pc.addStream(localStream);

	log('PeerConnection created');

    } catch (error) {
	log('******** PeerConnection failed: ', error);
    }
};

const teardown =  () => {
    sendData({type:'leave'});
    socket.disconnect();
    localStream = null;
    //localStreamElement.stop();
    localStreamElement.srcObject = null;
    remoteStream = null;
    remoteStreamElement.srcObject = null;

    pc.onicecandidate = null;
    pc.onconnectionstatechange = null;
    pc.onaddstream             = null;
    pc.ontrack                 = null;
    pc.close();	

}

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
	log('sending ICE candidate');
	sendData({
	    type: 'candidate',
	    candidate: event.candidate
	});
    }
};
//bugbug let --> const for all fn's !!!!
//bugbug who should be calling this?  what event ?  went to see
const onAddStream = (event) => {
    //bugbug is this a remote or local stream??? 
    log2('-----bugbug1650b Add stream (better not be nothing):',event.stream.id);
    remoteStream = event.stream;
    remoteStreamElement.srcObject = remoteStream;
    //remoteStreamElement2.play();
    addResizeEvents();
};
const onAddTrack = ev => {
    log2('------addTrack bugbug2341a',ev.track.id);
    remoteStream = ev.track.stream;
    remoteStreamElement.srcObject = remoteStream;
    addResizeEvents(); // cannot do this remoteStream is still null why???
};


const addResizeEvents =  () => {
   /*bugbug never worked

     localStream.addEventListener('loadedmetadata', function() {
	log(`Local video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
    });


    if (!remoteStream) return;
    
    remoteStream.addEventListener('loadedmetadata', function() {
	console.log(`Remote video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
    });
    
    remoteStream.addEventListener('resize', () => {
	log(`Remote video size changed to ${remoteVideo.videoWidth}x${remoteVideo.videoHeight}`);
    });
   */
};

const handleSignalingData = (data) => {
    log2("bugbug1555a:",data);
    switch (data.type) {
    case 'offer':
	createPeerConnection();
	pc.setRemoteDescription(new RTCSessionDescription(data));
	addResizeEvents();
	sendAnswer();
	break;
    case 'answer':
	log('got answer bugbug2238c');
	pc.setRemoteDescription(new RTCSessionDescription(data));
	addResizeEvents();
	break;
    case 'candidate':
	log('got ice candidate bugbug2238d');
	pc.addIceCandidate(new RTCIceCandidate(data.candidate));
	addResizeEvents();
	break;
    case 'whichRoom':
	log('was asked whichRoom'+room);  //bugbug get from UI?  this is during startup only?
	addResizeEvents();
	setRoom();
    }
};


function isValidColor(strColor) {
    var s = new Option().style;
    s.color = strColor;
    
    // return 'false' if color wasn't assigned
    return s.color == strColor.toLowerCase();
}

function main(maybeRoom,streamType) {
    
    if (/^\/[a-z]{3,16}$/.test(maybeRoom)){
	room=maybeRoom;
	var roomColor=room.substr(1);
	if (isValidColor(roomColor)){
	    document.body.style.backgroundColor=roomColor;
	}
	
	startEverything(streamType);  //mic(rophone),cam(era),cap(ture)  PICK ONE
	
    }else{
	alert("bad room name");
    }

}




let maybeRoom = '/olive'; //bugbug supposed to be:  window.location.pathname;
let capStart = document.querySelector('#capStart');

capStart.addEventListener("click", (ev) => {
    teardown();
    alert("bugbug-cap");
    capStart.disabled=true;
    capStop.disabled=false;
    setTimeout(  ()=>{main(maybeRoom,'cap');},  3000  );
} );

document.addEventListener("DOMContentLoaded", (ev) => {
    capStart.disabled=false;
    capStop.disabled=true;
    main(maybeRoom,'cam');
});

