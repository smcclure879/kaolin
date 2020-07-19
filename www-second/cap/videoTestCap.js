// Config variables: change them to point to your own servers
//REUGLAR-------const SIGNALING_SERVER_URL = 'https://third.ayvexllc.com:3003/'; // this needs be your domain	 
const SIGNALING_SERVER_URL = 'https://third.ayvexllc.com:3003/'; // this needs be your domain	 
const TURN_SERVER_URL = 'first.ayvexllc.com:3478'; // this can be not your domain do not include turn:	why???
//also	maybe use  'stun.l.google.com:19302' // 'localhost:3478';
const TURN_SERVER_USERNAME = 'user';
const TURN_SERVER_CREDENTIAL = 'pazz';


let maybeRoom = '/lightblue';  //bugbug window.location.pathname;

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
const grab = document.getElementById.bind(document);
const logText = grab("log");
const log =  x =>  {	logText.value += (x+"\n");    logText.scrollTop = logText.scrollHeight;	   } ;
const log2 = (x,y) => { log( x + " " + shorten(40,y)); } ;
//bugbugconst dom = document.querySelector;

//log(""+PC_CONFIG.iceServers[0].urls);



class Kale {
    constructor(roomName,localElementName,remoteElementName,logElementName){

	this.logText = grab(logElementName);
	if ( this.logText == null ) throw "bad logElementName";

	this.localStreamElement	 = grab(localElementName);
	if ( this.localStreamElement == null )	throw "bad localElementName";
	this.remoteStreamElement = grab(remoteElementName);
	if ( this.remoteStreamElement == null ) throw "bad remoteElementName";


	//this is a logging FUNCTION.  so you can 
	this.log =  x => {    this.logText.value += (x+"\n");	 this.logText.scrollTop = this.logText.scrollHeight;	} ;
	this.log2= (x,y) => {  this.log( x +" "+ shorten(40, y));  } ;
	this.log3= (x,y) => {  this.log( x +" "+ shorten(1200,y)); } ;
	this.room=roomName;
	//bugbug share validation with the caller ???
	
	var roomColor=this.room.substr(1);
	if (Kale.isValidColor(roomColor)){
	    document.body.style.backgroundColor=roomColor;
	}
	
	this.pc = null;
	this.socket = null;
	this.localStream = null;
	this.remoteStream = null;

    }

    static streamGetter(streamType){
	if (streamType=='mic')
	    return navigator.mediaDevices.getUserMedia({ audio: true, video: false });
	else if (streamType=='cam')
	    return navigator.mediaDevices.getUserMedia({ audio: true, video: true });
	else if (streamType=='cap')
	    return navigator.mediaDevices.getDisplayMedia({ video: true });
	else
	    throw "unknown stream type:"+streamType;
    };

    
    setRoom(){
	//SPEC for how the dialog works.......	 server:whichRoom?     client:thisRoom!	     server:ready!
	if (!this.socket) {
	    this.log("bad call to setRoom with no socket"+new Error().stack);
	    return;
	}
	this.log("setting room");
	this.socket.emit('thisRoom',this.room);
    }

    
    onReadyOrConnect() {
	this.log('Ready.point7');
	// Connection with signaling server is ready, and so is local stream
	this.createPeerConnection();
	this.log('pc created. point9  bugbug');
	this.sendOffer();
    }


    initSocket(){
	this.socket = io(SIGNALING_SERVER_URL, { autoConnect: false });
	this.socket.on('data', (data) => {
	    this.log('Data received: ',data);
	    this.handleSignalingData(data);
	});

	this.socket.on('ready', this.onReadyOrConnect.bind(this));	 //bugbug does this ever get called?
	//this.socket.on('connect', this.onReadyOrConnect );  //bugbug added
	this.socket.on('connect_error', (err) => { this.log('did we get here.point5?'+err); } );  //bugbug added
	this.socket.on('error', (err) => { this.log('did we get here.point6?'+err); } );  //bugbug added
	this.socket.on('whichRoom', (ev)=>{  this.setRoom();  });

    }

    sendData(data){
	this.log("sending"+dumps(data).substr(0,40));
	this.socket.emit('data', data);
    };


    
    
    startEverything(streamType){
	this.initSocket();
	this.log("point2");
	Kale.streamGetter(streamType)
	    .then((stream) => {
		this.log('Stream found');
		this.localStream = stream;
		this.localStreamElement.srcObject = stream;
		this.localStreamElement.play();

		this.socket.connect();
		this.log('did we connect point3');
	    })
	    .catch(error => {
		this.log('bugbug0619z:Stream not found: ', error);
	    });
    }

    createPeerConnection(){
	try {
	    this.log("bugbug2228a");
	    this.pc = new RTCPeerConnection(PC_CONFIG);
	    this.log("bugbug2228b");
	    
	    this.pc.onicecandidate = this.onIceCandidate.bind(this);
	    this.log("bugbug2228c");
	    this.pc.onconnectionstatechange = ev => { log2("-------connChange:",ev);  } ; 
	    this.pc.onaddstream		    = ev => { log2("------bugbug1434j=",ev);  this.onAddStream(ev) };
	    //mozilla claims to want....but probls in chrome....
	    this.pc.ontrack		    = ev => { log2("-------ontrack,bugbug1709i",ev.streams); this.onAddTrack(ev); };	 
	    //this.pc.addEventListener("track", ev => { log2("-------trackEvt,bugbug2020m,streams=",ev.streams);   /*onTrack(ev);*/	});
	    this.log("bugbug2228d");
	    this.pc.addStream(this.localStream);
	    
	    this.log('PeerConnection created');

	} catch (error) {
	    this.log3('******** PeerConnection failed: ', new Error().stack);
	    this.log2('** ** err continues', error);
	}
    }

    teardown(){
	this.sendData({type:'leave'});
	this.socket.disconnect();
	this.localStream = null;
	//this.localStreamElement.stop();
	this.localStreamElement.srcObject = null;
	this.remoteStream = null;
	this.remoteStreamElement.srcObject = null;

	if (this.pc) {
	    this.pc.onicecandidate = null;
	    this.pc.onconnectionstatechange = null;
	    this.pc.onaddstream		= null;
	    this.pc.ontrack			= null;
	    this.pc.close();
	}
	this.pc = null;

    }
    
    sendOffer(){
	this.log('Send offer');
	this.pc.createOffer().then(
	    this.setAndSendLocalDescription.bind(this),
	    (error) => { this.log('Send offer failed: ', error); }
	);
    }

    sendAnswer(){
	this.log('Send answer');
	this.pc.createAnswer().then(
	    this.setAndSendLocalDescription.bind(this),
	    (error) => { this.log2('Send answer failed: ', error); }
	);
    }

    setAndSendLocalDescription(sessionDescription){
	this.log('bugbug2237b');
	this.pc.setLocalDescription(sessionDescription);
	this.log('Local description set');
	this.sendData(sessionDescription);
    };


    onIceCandidate(event){
	if (event.candidate) {
	    this.log('sending ICE candidate');
	    this.sendData({
		type: 'candidate',
		candidate: event.candidate
	    });
	}
    }
    
    //bugbug let --> const for all fn's !!!!
    //bugbug who should be calling this?  what event ?	went to see
    onAddStream(event){
	//bugbug is this a remote or local stream??? 
	this.log2('-----bugbug1650b Add stream (better not be nothing):',event.stream.id);
	this.remoteStream = event.stream;
	this.remoteStreamElement.srcObject = this.remoteStream;
	//remoteStreamElement2.play();
	this.addResizeEvents();
    }
    
    onAddTrack(ev){
	this.log2('------addTrack bugbug2341a',ev.track.id);
	this.remoteStream = ev.track.stream;
	this.remoteStreamElement.srcObject = this.remoteStream;
	this.addResizeEvents(); // cannot do this remoteStream is still null why???
    }


    addResizeEvents(){
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
    }

    handleSignalingData(data){
	this.log2("bugbug1555a:",data);
	switch (data.type) {
	case 'offer':
	    this.createPeerConnection();
	    this.pc.setRemoteDescription(new RTCSessionDescription(data));
	    this.addResizeEvents();
	    this.sendAnswer();
	    break;
	case 'answer':
	    this.log('got answer bugbug2238c');
	    this.pc.setRemoteDescription(new RTCSessionDescription(data));
	    this.addResizeEvents();
	    break;
	case 'candidate':
	    this.log('got ice candidate bugbug2238d');
	    this.pc.addIceCandidate(new RTCIceCandidate(data.candidate));
	    this.addResizeEvents();
	    break;
	case 'whichRoom':
	    this.log('was asked whichRoom'+room);  //bugbug get from UI?  this is during startup only?
	    this.addResizeEvents();
	    this.setRoom();
	    break;
	default:
	    this.log2( "unknown data type", dumps(data) );
	    return;
	}
    }

    static isValidColor(strColor) {
	let s = new Option().style;
	s.color = strColor;
	return s.color == strColor.toLowerCase();  //color change of invisible object only takes if valid color	 bugbug how to allow more colors like number codes or richer color names 
    }

    main(maybeRoom,streamType) {
	if (! /^\/[a-z]{3,16}$/.test(maybeRoom)) throw "bad room name";
	this.room=maybeRoom;
	this.startEverything(streamType);  //mic(rophone),cam(era),cap(ture)  PICK ONE
    }
}


//let capStart = document.getElementById('capStart');
let k1 = new Kale(maybeRoom,"localStream","remoteStream","log");
let k2 = new Kale(maybeRoom,"localStream2","remoteStream2","log2");


capStart.addEventListener("click", (ev) => {
    //k.teardown();
    alert("bugbug-cap");
    capStart.disabled=true;
    capStop.disabled=false;
    setTimeout(	 ()=>{k.main(maybeRoom,'cap');},  3000	);
} );

document.addEventListener("DOMContentLoaded", (ev) => {
    capStart.disabled=false;
    capStop.disabled=true;
    k.main(maybeRoom,'cam');
});

