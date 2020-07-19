/*
 *  Copyright (c) 2017 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */

'use strict';


// Config variables: change them to point to your own servers
//REUGLAR-------const SIGNALING_SERVER_URL = 'https://third.ayvexllc.com:3003/'; // this needs be your domain    
const SIGNALING_SERVER_URL = 'https://second.ayvexllc.com:3002/'; // this needs be your domain    
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







const startButton = document.getElementById('startButton');
const callButton = document.getElementById('callButton');
const upgradeButton = document.getElementById('upgradeButton');
const hangupButton = document.getElementById('hangupButton');
callButton.disabled = true;
hangupButton.disabled = true;
upgradeButton.disabled = true;
startButton.onclick = start;
callButton.onclick = call;
upgradeButton.onclick = upgrade;
hangupButton.onclick = hangup;

let startTime;
const localVideo = document.getElementById('localVideo');
const remoteVideo = document.getElementById('remoteVideo');

localVideo.addEventListener('loadedmetadata', function() {
    log(`Local video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
});

remoteVideo.addEventListener('loadedmetadata', function() {
    log(`Remote video videoWidth: ${this.videoWidth}px,  videoHeight: ${this.videoHeight}px`);
});

remoteVideo.onresize = () => {
    log(`Remote video size changed to ${remoteVideo.videoWidth}x${remoteVideo.videoHeight}`);
    console.warn('RESIZE', remoteVideo.videoWidth, remoteVideo.videoHeight);
    // We'll use the first onsize callback as an indication that video has started
    // playing out.
    if (startTime) {
	const elapsedTime = window.performance.now() - startTime;
	log(`Setup time: ${elapsedTime.toFixed(3)}ms`);
	startTime = null;
    }
};

let localStream;
let pc1;
let pc2;
const offerOptions = {
    offerToReceiveAudio: 1,
    offerToReceiveVideo: 0
};

function getName(pc) {
    return (pc === pc1) ? 'pc1' : 'pc2';
}

function getOtherPc(pc) {
    return (pc === pc1) ? pc2 : pc1;
}

function gotStream(stream) {
    log('Received local stream');
    localVideo.srcObject = stream;
    localStream = stream;
    callButton.disabled = false;
}

function start() {
    log('Requesting local stream');
    startButton.disabled = true;
    navigator.mediaDevices
	.getUserMedia({
            audio: true,
            video: false
	})
	.then(gotStream)
	.catch(e => alert(`getUserMedia() error: ${e.name}`));
}

function call() {
    callButton.disabled = true;
    upgradeButton.disabled = false;
    hangupButton.disabled = false;
    log('Starting call');
    startTime = window.performance.now();
    const audioTracks = localStream.getAudioTracks();
    if (audioTracks.length > 0) {
	log(`Using audio device: ${audioTracks[0].label}`);
    }
    //const servers = null;
    pc1 = new RTCPeerConnection(PC_CONFIG);
    log('Created local peer connection object pc1');
    pc1.onicecandidate = e => onIceCandidate(pc1, e);
    pc2 = new RTCPeerConnection(PC_CONFIG);
    log('Created remote peer connection object pc2');
    pc2.onicecandidate = e => onIceCandidate(pc2, e);
    pc1.oniceconnectionstatechange = e => onIceStateChange(pc1, e);
    pc2.oniceconnectionstatechange = e => onIceStateChange(pc2, e);
    pc2.ontrack = gotRemoteStream;

    localStream.getTracks().forEach(track => pc1.addTrack(track, localStream));
    log('Added local stream to pc1');

    log('pc1 createOffer start');
    pc1.createOffer(offerOptions).then(onCreateOfferSuccess, onCreateSessionDescriptionError);
}

function onCreateSessionDescriptionError(error) {
    log(`Failed to create session description: ${error.toString()}`);
}

function onCreateOfferSuccess(desc) {
    log(`Offer from pc1\n${desc.sdp}`);
    log('pc1 setLocalDescription start');
    pc1.setLocalDescription(desc).then(() => onSetLocalSuccess(pc1), onSetSessionDescriptionError);
    log('pc2 setRemoteDescription start');
    pc2.setRemoteDescription(desc).then(() => onSetRemoteSuccess(pc2), onSetSessionDescriptionError);
    log('pc2 createAnswer start');
    // Since the 'remote' side has no media stream we need
    // to pass in the right constraints in order for it to
    // accept the incoming offer of audio and video.
    pc2.createAnswer().then(onCreateAnswerSuccess, onCreateSessionDescriptionError);
}

function onSetLocalSuccess(pc) {
    log(`${getName(pc)} setLocalDescription complete`);
}

function onSetRemoteSuccess(pc) {
    log(`${getName(pc)} setRemoteDescription complete`);
}

function onSetSessionDescriptionError(error) {
    log(`Failed to set session description: ${error.toString()}`);
}

function gotRemoteStream(e) {
    log('gotRemoteStream', e.track, e.streams[0]);

    // reset srcObject to work around minor bugs in Chrome and Edge.
    remoteVideo.srcObject = null;
    remoteVideo.srcObject = e.streams[0];
}

function onCreateAnswerSuccess(desc) {
    log(`Answer from pc2:
${desc.sdp}`);
    log('pc2 setLocalDescription start');
    pc2.setLocalDescription(desc).then(() => onSetLocalSuccess(pc2), onSetSessionDescriptionError);
    log('pc1 setRemoteDescription start');
    pc1.setRemoteDescription(desc).then(() => onSetRemoteSuccess(pc1), onSetSessionDescriptionError);
}

function onIceCandidate(pc, event) {
    getOtherPc(pc)
	.addIceCandidate(event.candidate)
	.then(() => onAddIceCandidateSuccess(pc), err => onAddIceCandidateError(pc, err));
    log(`${getName(pc)} ICE candidate:\n${event.candidate ? event.candidate.candidate : '(null)'}`);
}

function onAddIceCandidateSuccess(pc) {
    log(`${getName(pc)} addIceCandidate success`);
}

function onAddIceCandidateError(pc, error) {
    log(`${getName(pc)} failed to add ICE Candidate: ${error.toString()}`);
}

function onIceStateChange(pc, event) {
    if (pc) {
	log(`${getName(pc)} ICE state: ${pc.iceConnectionState}`);
	log('ICE state change event: ', event);
    }
}

function upgrade() {
    upgradeButton.disabled = true;
    //ayvex modding to do screen cap.
    navigator.mediaDevices
	.getDisplayMedia({video: true})  //instead of getUserMedia
	.then(stream => {
            const videoTracks = stream.getVideoTracks();
            if (videoTracks.length > 0) {
		log(`Using video device: ${videoTracks[0].label}`);
            }
            localStream.addTrack(videoTracks[0]);
            localVideo.srcObject = null;
            localVideo.srcObject = localStream;
            pc1.addTrack(videoTracks[0], localStream);
            return pc1.createOffer();
	})
	.then(offer => pc1.setLocalDescription(offer))
	.then(() => pc2.setRemoteDescription(pc1.localDescription))
	.then(() => pc2.createAnswer())
	.then(answer => pc2.setLocalDescription(answer))
	.then(() => pc1.setRemoteDescription(pc2.localDescription));
}

function hangup() {
    log('Ending call');
    pc1.close();
    pc2.close();
    pc1 = null;
    pc2 = null;

    const videoTracks = localStream.getVideoTracks();
    videoTracks.forEach(videoTrack => {
	videoTrack.stop();
	localStream.removeTrack(videoTrack);
    });
    localVideo.srcObject = null;
    localVideo.srcObject = localStream;

    hangupButton.disabled = true;
    callButton.disabled = false;
}
