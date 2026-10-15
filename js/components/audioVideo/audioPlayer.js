// ========================================================
// 📻 AUDIO PLAYER WIDGET CONTROLLER
// Module: js/components/audioVideo/audioPlayer.js
// Ceiling: < 350 lines | Role: Mini player playback & seeking
// ========================================================

(function (window) {
    'use strict';

    let isPlayingAudio = false;
    let audioPlaybackTimer = null;
    let playbackSeconds = 0;
    const totalAudioSeconds = 165; // 2:45

    function toggleAudioPlayback() {
        isPlayingAudio = !isPlayingAudio;
        const icon = document.getElementById('audioPlayIcon');
        const progressBar = document.getElementById('audioProgressBar');
        const timerText = document.getElementById('audioPlaybackTimerText');

        if (isPlayingAudio) {
            if (icon) {
                icon.innerHTML = '<rect x="6" y="4" width="4" height="16"></rect><rect x="14" y="4" width="4" height="16"></rect>';
            }
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);

            audioPlaybackTimer = setInterval(() => {
                playbackSeconds += 1;
                if (playbackSeconds > totalAudioSeconds) playbackSeconds = 0;
                const pct = (playbackSeconds / totalAudioSeconds) * 100;
                if (progressBar) progressBar.style.width = `${pct}%`;
                if (timerText) {
                    const mins = Math.floor(playbackSeconds / 60);
                    const secs = playbackSeconds % 60;
                    timerText.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs} / 2:45`;
                }
            }, 1000);
        } else {
            stopAudioPlayback();
        }
    }

    function stopAudioPlayback() {
        isPlayingAudio = false;
        if (audioPlaybackTimer) {
            clearInterval(audioPlaybackTimer);
            audioPlaybackTimer = null;
        }
        const icon = document.getElementById('audioPlayIcon');
        if (icon) {
            icon.innerHTML = '<polygon points="6 4 20 12 6 20 6 4"></polygon>';
        }
    }

    function seekAudioTrack(event) {
        const rect = event.currentTarget.getBoundingClientRect();
        const clickX = event.clientX - rect.left;
        const pct = Math.max(0, Math.min(1, clickX / rect.width));
        playbackSeconds = Math.floor(pct * totalAudioSeconds);
        const progressBar = document.getElementById('audioProgressBar');
        if (progressBar) progressBar.style.width = `${pct * 100}%`;
        const timerText = document.getElementById('audioPlaybackTimerText');
        if (timerText) {
            const mins = Math.floor(playbackSeconds / 60);
            const secs = playbackSeconds % 60;
            timerText.textContent = `${mins}:${secs < 10 ? '0' : ''}${secs} / 2:45`;
        }
    }

    window.toggleAudioPlayback = toggleAudioPlayback;
    window.stopAudioPlayback = stopAudioPlayback;
    window.seekAudioTrack = seekAudioTrack;

})(window);
