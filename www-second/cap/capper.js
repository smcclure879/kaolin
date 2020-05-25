/*
 *  Copyright (c) 2018 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 

 with many mods by kaolin partners/ayvex

*/

class Capper {
    constructor(origStream) {

	this.originalStream = origStream;
	
	this.capStart = document.querySelector("#capStart");
	capStart.disabled=false;
	
	this.capStop = document.querySelector("#capStop");
	capStop.disabled = true;

	this.capStat = document.querySelector("#capStat");
	this.capStat.innerText = 'Inactive';

	this.stream = null;
	this.chunks = [];

	//this.enableDownloadRecording = false;
	//this.mediaRecorder = null;
	//this.recording = null;
    }

    setStatus(x) {
	this.capStat.innerText = x;
    }

    startScreenCapture() {  //static ?  bugbug
	if (navigator.getDisplayMedia) {
	    return navigator.getDisplayMedia({video: true});
	} else if (navigator.mediaDevices.getDisplayMedia) {
	    return navigator.mediaDevices.getDisplayMedia({video: true});
	} else {
	    return navigator.mediaDevices.getUserMedia({video: {mediaSource: 'screen'}});
	}
    }

    async startCapturing(e) {
	log('Start capturing.');
	this.setStatus('Screen recording started.');
	this.capStart.disabled=true;
	this.capStop.disabled=false;

	/*if (this.recording) {
	  window.URL.revokeObjectURL(this.recording);
	  }*/

	this.chunks = [];
	this.recording = null;
	log("point a1");
	this.stream = await this.startScreenCapture();
	log("point a2");
	this.stream.addEventListener('inactive', e => {
	    log('Capture stream inactive - stop recording!');
	    this.stopCapturing(e);
	});


	//bugbug try to insure we actually have stream?????
	//localStream = stream;
	localStreamElement.srcObject = this.stream;
	await localStreamElement.play();

	log2("point a3",this.stream.id); //bugbug  getTracks());

	//didn't work??  remote point 1650i receives but empty track
	//pc.addStream(this.stream);
	//....so try...
	//new negotiation strategy
	if (this.stream.getTracks().length!=1) throw "bugbug0151x";
	let track = this.stream.getTracks()[0];
	///bugbug dups the below   this.originalStream.addTrack(track);
	if (pc.addTrack) {
	    log("----adding track");
	    pc.addTrack(track, this.originalStream);
	    track.start();
	} else {
	    // If you have code listening for negotiationneeded events:
	    log("----dispatching negotiate");
	    setTimeout(() => pc.dispatchEvent(new Event('negotiationneeded')));
	}

	//bugbug did this work?
	//pc.createOffer();
/*

the other demo about upgrade would have us do this....?
const videoTracks = stream.getVideoTracks();
        if (videoTracks.length > 0) {
          console.log(`Using video device: ${videoTracks[0].label}`);
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
*/
	/*this.mediaRecorder = new MediaRecorder(this.stream, {mimeType: 'video/webm'});
	  this.mediaRecorder.addEventListener('dataavailable', event => {
	  if (event.data && event.data.size > 0) {
          this.chunks.push(event.data);
	  }
	  });
	  this.mediaRecorder.start(10);
	*/

	
    }         //            <-----end fn startCapturing()

    
    stopCapturing(e) {
	log('Stop capturing.');
	this.setStatus( 'Screen recorded completed.' );
	this.capStart.disabled=false;
	this.capStop.disabled =true;
	
	//this.enableDownloadRecording = true;
	//this.mediaRecorder.stop();
	//this.mediaRecorder = null;
	
	this.stream.getTracks().forEach(track => track.stop());
	this.stream = null;

	//this.recording = window.URL.createObjectURL(new Blob(this.chunks, {type: 'video/webm'}));
    }

    /*downloadRecording(e) {
      log('Download recording.');
      this.enableStartCapture = true;
      this.enableStopCapture = false;
      this.enableDownloadRecording = false;

      const downloadLink = this.shadowRoot.querySelector('a#downloadLink');
      downloadLink.addEventListener('progress', e => log(e));
      downloadLink.href = this.recording;
      downloadLink.download = 'screen-recording.webm';
      downloadLink.click();
      }*/
}

//customElements.define('screen-sharing', ScreenSharing);
let capper = null;
function activateCapper(stream) {
    capper = new Capper(stream);
    document.querySelector("#capStart").capper=capper;  //embed ourself for now in the "start" button.  bugbug sneaky
    document.querySelector("#capStart").onclick= (e) => {
	log("capper");
	capper.startCapturing();
    };
}

