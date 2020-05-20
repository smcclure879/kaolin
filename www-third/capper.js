/*
 *  Copyright (c) 2018 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 

 with many mods by kaolin partners/ayvex

*/

class Capper {
    constructor() {
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
	this.capStop.enabled=false;

	/*if (this.recording) {
	  window.URL.revokeObjectURL(this.recording);
	  }*/

	this.chunks = [];
	this.recording = null;
	this.stream = await this.startScreenCapture();
	this.stream.addEventListener('inactive', e => {
	    log('Capture stream inactive - stop recording!');
	    this.stopCapturing(e);
	});
	/*this.mediaRecorder = new MediaRecorder(this.stream, {mimeType: 'video/webm'});
	  this.mediaRecorder.addEventListener('dataavailable', event => {
	  if (event.data && event.data.size > 0) {
          this.chunks.push(event.data);
	  }
	  });
	  this.mediaRecorder.start(10);
	*/
    }
    
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
document.querySelector("#capStart").onclick= (e) => {
    log("capper");
    capper.startCapturing();
};


var capper = new Capper();
document.querySelector("#capStart").capper=capper;


