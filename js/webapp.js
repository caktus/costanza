/* global MozActivity, alert, getUserMedia, document, window, navigator */
"use strict";
(function () {
    var recording = false,
        captureBuffer = null,
        toggleButton = document.querySelector("#record-toggle"),
        audioContext = new window.AudioContext(),
        microphone, captureNode, outputBuffer, outputNode;

    navigator.getUserMedia({audio: true},
        function (stream) {
            microphone = audioContext.createMediaStreamSource(stream);
            captureNode = audioContext.createScriptProcessor(4096, 2, 2);
            microphone.connect(captureNode);
            captureNode.connect(audioContext.destination);
        },
        function (err) {
            console.log('The following error occured: ' + err);
        }
    );

    toggleButton.onclick = function () {
        if (!recording) {
            toggleButton.innerHTML = 'Stop Recording';
            recording = true;
            captureNode.onaudioprocess = function (e) {
                var currentBuffer = e.inputBuffer.getChannelData(0),
                    newBuffer, newlen;
                if (captureBuffer === null) {
                    captureBuffer = currentBuffer;
                } else {
                    newlen = captureBuffer.length + currentBuffer.length;
                    newBuffer = new Float32Array(newlen);
                    newBuffer.set(captureBuffer, 0);
                    newBuffer.set(currentBuffer, captureBuffer.length);
                    captureBuffer = newBuffer;
                }
            };
        } else {
            toggleButton.innerHTML = 'Start Recording';
            recording = false;
            captureNode.onaudioprocess = null;
            if (captureBuffer !== null) {
                outputBuffer = audioContext.createBuffer(1, captureBuffer.length, audioContext.sampleRate);
                outputBuffer.getChannelData(0).set(captureBuffer, 0);
                outputNode = audioContext.createBufferSource();
                outputNode.buffer = outputBuffer;
                outputNode.connect(audioContext.destination);
                outputNode.start();
            }
        }
    };

})();
