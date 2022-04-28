/*
 *  Copyright (c) 2015 The WebRTC project authors. All Rights Reserved.
 *
 *  Use of this source code is governed by a BSD-style license
 *  that can be found in the LICENSE file in the root of the source
 *  tree.
 */
'use strict';

const delay = ms => new Promise(res => setTimeout(res, ms));

var socket = io('http://localhost:5000', {
  origin: "https://example.com",
  methods: ["GET", "POST"]
});

socket.on('connect', function(){
  console.log("Connected...!", socket.connected)
});

socket.on('response_back', function(image){
  console.log("New image received");
  const image_id = document.getElementById('image');
  image_id.src = image;
});

// Put variables in global scope to make them available to the browser console.
const constraints = window.constraints = {
  video: true
};

async function handleSuccess(stream) {
  const video = document.getElementById('videoElement');
  video.height = 480;
  video.width = 640;
  const videoTracks = stream.getVideoTracks();
  console.log('Got stream with constraints:', constraints);
  console.log(`Using video device: ${videoTracks[0].label}`);
  window.stream = stream; // make variable available to browser console
  video.srcObject = stream;
  video.play();
  await delay(5000);
  // const video = document.querySelector('video');
  console.log("Source height: " + video.videoHeight + ", width: " + video.videoWidth)
  let src = new cv.Mat(video.videoHeight, video.videoWidth, cv.CV_8UC4);
  let dst = new cv.Mat(video.videoHeight, video.videoWidth, cv.CV_8UC1);
  let cap = new cv.VideoCapture(video);

  const FPS = 5;
  
  setInterval(() => {
      cap.read(src);
  
      var type = "image/png"
      cv.imshow("canvasOutput", src);
      var data = document.getElementById("canvasOutput").toDataURL(type);
      data = data.replace('data:' + type + ';base64,', '');
      // cv.cvtColor(src, dst, cv.COLOR_RGB2GRAY);
      // cv.imshow('canvasOutput', dst);
      socket.emit('image', data);
      console.log("Image sent")
  }, 200);
}

function handleError(error) {
  if (error.name === 'ConstraintNotSatisfiedError') {
    const v = constraints.video;
    errorMsg(`The resolution ${v.width.exact}x${v.height.exact} px is not supported by your device.`);
  } else if (error.name === 'PermissionDeniedError') {
    errorMsg('Permissions have not been granted to use your camera and ' +
      'microphone, you need to allow the page access to your devices in ' +
      'order for the demo to work.');
  }
  errorMsg(`getUserMedia error: ${error.name}`, error);
}

function errorMsg(msg, error) {
  const errorElement = document.querySelector('#errorMsg');
  errorElement.innerHTML += `<p>${msg}</p>`;
  if (typeof error !== 'undefined') {
    console.error(error);
  }
}

async function init(e) {
  try {
    const stream = await navigator.mediaDevices.getUserMedia(constraints);
    handleSuccess(stream);
    e.target.disabled = true;
  } catch (e) {
    handleError(e);
  }
}

cv['onRuntimeInitialized']=()=>{
};

document.querySelector('#showVideo').addEventListener('click', e => init(e));