/* global console, window, navigator */
"use strict";
// Compatibility Code
navigator.getUserMedia = (navigator.getUserMedia ||
                       navigator.webkitGetUserMedia ||
                       navigator.mozGetUserMedia ||
                       navigator.msGetUserMedia);
var Recorder = (function () {

    function Recorder() {
        this.audioContext = new window.AudioContext();
        this.captureBuffer = null;
        this.captureNode = null;
        this.init();
    }

    Recorder.prototype = {
        init: function () {
            var self = this;
            navigator.getUserMedia({audio: true},
                function (stream) {
                    var microphone = self.audioContext.createMediaStreamSource(stream);
                    self.captureNode = self.audioContext.createScriptProcessor(4096, 2, 2);
                    microphone.connect(self.captureNode);
                    self.captureNode.connect(self.audioContext.destination);
                },
                function (err) {
                    console.log('The following error occured: ' + err);
                }
            );
        },
        start: function () {
            var self = this;
            this.captureBuffer = null;
            this.captureNode.onaudioprocess = function (e) {
                var currentBuffer = e.inputBuffer.getChannelData(0),
                    newBuffer, newlen;
                if (self.captureBuffer === null) {
                    self.captureBuffer = currentBuffer;
                } else {
                    newlen = self.captureBuffer.length + currentBuffer.length;
                    newBuffer = new Float32Array(newlen);
                    newBuffer.set(self.captureBuffer, 0);
                    newBuffer.set(currentBuffer, self.captureBuffer.length);
                    self.captureBuffer = newBuffer;
                }
            };
        },
        stop: function () {
            this.captureNode.onaudioprocess = null;
        },
        play: function () {
            var outputBuffer, outputNode;
            if (this.captureBuffer !== null) {
                outputBuffer = this.audioContext.createBuffer(1, this.captureBuffer.length, this.audioContext.sampleRate);
                outputBuffer.getChannelData(0).set(this.captureBuffer, 0);
                outputNode = this.audioContext.createBufferSource();
                outputNode.buffer = outputBuffer;
                outputNode.connect(this.audioContext.destination);
                outputNode.start();
            }
        }
    };

    return Recorder;
})();
