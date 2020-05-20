/*
 *  Copyright (c) 2018 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 

 but totally modified 2020 by kaolin partners & ayvexllc

 this is attempt to integrate standard webRTC screen share into our videoconf room



 --init stuff
 this.enableStartCapture = true;
 this.enableStopCapture = false;
 this.enableDownloadRecording = false;
 this.stream = null;
 this.chunks = [];
 this.mediaRecorder = null;
 this.status = 'Inactive';
 this.recording = null;


 video {
 --video-width: 100%;
 width: var(--video-width);
 height: calc(var(--video-width) * (16 / 9));
 }
 </style>
 <video ?controls="${this.recording !== null}" playsinline autoplay loop muted .src="${this.recording}"></video>
 <div>
 <p>Status: ${this.status}</p>
 <button ?disabled="${!this.enableStartCapture}" @click="${e => this.startCapturing(e)}">Start screen capture</button>
 <button ?disabled="${!this.enableStopCapture}" @click="${e => this.stopCapturing(e)}">Stop screen capture</button>
 <button ?disabled="${!this.enableDownloadRecording}" @click="${e => this.downloadRecording(e)}">Download recording</button>
 <a id="downloadLink" type="video/webm" style="display: none"></a>
 </div>`;
*/


class Cap {

//bugbug can we lose the polyfill??
function _startScreenCapture() {
    if (navigator.getDisplayMedia) {
	return navigator.getDisplayMedia({video: true});
    } else if (navigator.mediaDevices.getDisplayMedia) {
	return navigator.mediaDevices.getDisplayMedia({video: true});
    } else {
	return navigator.mediaDevices.getUserMedia({video: {mediaSource: 'screen'}});
    }
}

function startCapturing(e) {
    log('Start capturing.');
    this.status = 'Screen recording started.';
    this.enableStartCapture = false;
    this.enableStopCapture = true;
    this.enableDownloadRecording = false;
    this.requestUpdate('buttons');

    if (this.recording) {
	window.URL.revokeObjectURL(this.recording);
    }

    this.chunks = [];
    this.recording = null;
    this.stream = startScreenCapture();


    //bugbug you are here, get rid of "this" next?  replace with foo???




    
    this.stream.addEventListener('inactive', e => {
	log('Capture stream inactive - stop recording!');
	this.stopCapturing(e);
    });
    this.mediaRecorder = new MediaRecorder(this.stream, {mimeType: 'video/webm'});
    this.mediaRecorder.addEventListener('dataavailable', event => {
	if (event.data && event.data.size > 0) {
            this.chunks.push(event.data);
	}
    });
    this.mediaRecorder.start(10);
}

stopCapturing(e) {
    log('Stop capturing.');
    this.status = 'Screen recorded completed.';
    this.enableStartCapture = true;
    this.enableStopCapture = false;
    this.enableDownloadRecording = true;

    this.mediaRecorder.stop();
    this.mediaRecorder = null;
    this.stream.getTracks().forEach(track => track.stop());
    this.stream = null;

    this.recording = window.URL.createObjectURL(new Blob(this.chunks, {type: 'video/webm'}));
}

downloadRecording(e) {
    log('Download recording.');
    this.enableStartCapture = true;
    this.enableStopCapture = false;
    this.enableDownloadRecording = false;

    const downloadLink = this.shadowRoot.querySelector('a#downloadLink');
    downloadLink.addEventListener('progress', e => log(e));
    downloadLink.href = this.recording;
    downloadLink.download = 'screen-recording.webm';
    downloadLink.click();
}
