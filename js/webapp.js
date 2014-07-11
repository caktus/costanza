/* global MozActivity, Recorder, document, window, navigator */
"use strict";
(function () {
    var toggleButton = document.querySelector("#record-toggle"),
        playbackButton = document.querySelector("#playback"),
        recording = false,
        recorder = new Recorder();

    toggleButton.onclick = function () {
        if (!recording) {
            toggleButton.innerHTML = 'Stop Recording';
            playbackButton.style.display = "none";
            recording = true;
            recorder.start();
        } else {
            toggleButton.innerHTML = 'Start Recording';
            playbackButton.style.display = "block";
            recording = false;
            recorder.stop();
        }
    };

    playbackButton.onclick = function () {
        recorder.play();
    };
})();
