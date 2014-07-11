/* global MozActivity, alert, getUserMedia, document, window, navigator */
"use strict";
(function () {
    var toggleButton = document.querySelector("#record-toggle"),
        recording = false,
        recorder = new Recorder();

    toggleButton.onclick = function () {
        if (!recording) {
            toggleButton.innerHTML = 'Stop Recording';
            recording = true;
            recorder.start();
        } else {
            toggleButton.innerHTML = 'Start Recording';
            recording = false;
            recorder.stop();
            recorder.play();
        }
    };

})();
