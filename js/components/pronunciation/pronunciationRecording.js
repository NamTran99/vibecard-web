(function() {
    'use strict';

    // 10. Recording Session & Microphone Management
    window.togglePronunciationRecording = function () {
        if (recordingState === 'idle') {
            startRecordingSession();
        } else if (recordingState === 'recording') {
            stopRecordingSession();
        }
    };

    function startRecordingSession() {
        recordingState = 'recording';
        recordingSeconds = 0;
        playSfx(3);

        const micBtn = document.getElementById('prMicBtn');
        const micHint = document.getElementById('prMicHint');
        const waveContainer = document.getElementById('prWaveContainer');
        const resultsContainer = document.getElementById('prResultsContainer');

        if (micBtn) {
            micBtn.classList.add('is-recording');
            micBtn.innerHTML = `
                <svg class="w-8 h-8 fill-current" viewBox="0 0 24 24">
                    <rect x="6" y="6" width="12" height="12" rx="2.5"/>
                </svg>
            `;
        }
        if (micHint) {
            micHint.innerHTML = '<span class="text-red-500 font-extrabold animate-pulse">● Đang ghi âm: 00:00</span> — Chạm để hoàn tất';
        }
        if (waveContainer) {
            waveContainer.classList.add('is-active');
        }
        if (resultsContainer) {
            resultsContainer.classList.add('hidden');
        }

        // Live timer
        clearInterval(recordingTimer);
        recordingTimer = setInterval(() => {
            recordingSeconds++;
            const secStr = recordingSeconds < 10 ? `0${recordingSeconds}` : `${recordingSeconds}`;
            if (micHint) {
                micHint.innerHTML = `<span class="text-red-500 font-extrabold animate-pulse">● Đang ghi âm: 00:${secStr}</span> — Chạm để hoàn tất`;
            }
            if (recordingSeconds >= 8) {
                stopRecordingSession();
            }
        }, 1000);

        // Hardware mic recording attempt (Graceful Fallback)
        if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
            navigator.mediaDevices.getUserMedia({ audio: true })
                .then(stream => {
                    recordedChunks = [];
                    try {
                        mediaRecorder = new MediaRecorder(stream);
                        mediaRecorder.ondataavailable = e => {
                            if (e.data && e.data.size > 0) recordedChunks.push(e.data);
                        };
                        mediaRecorder.onstop = () => {
                            recordedAudioBlob = new Blob(recordedChunks, { type: 'audio/webm' });
                            stream.getTracks().forEach(t => t.stop());
                        };
                        mediaRecorder.start();
                    } catch (err) {
                        console.log('[Mic Recorder]: MediaRecorder fallback', err);
                    }
                })
                .catch(err => {
                    console.log('[Mic Permission]: Running simulated microphone capture', err);
                });
        }
    }

    function stopRecordingSession() {
        if (recordingState !== 'recording') return;

        clearInterval(recordingTimer);
        playSfx(1);

        if (mediaRecorder && mediaRecorder.state !== 'inactive') {
            try { mediaRecorder.stop(); } catch (e) { }
        }

        // Transition to Analyzing
        recordingState = 'analyzing';
        const micBtn = document.getElementById('prMicBtn');
        const micHint = document.getElementById('prMicHint');
        const waveContainer = document.getElementById('prWaveContainer');

        if (micBtn) {
            micBtn.classList.remove('is-recording');
            micBtn.innerHTML = `
                <svg class="w-7 h-7 animate-spin text-[#161F00]" fill="none" viewBox="0 0 24 24">
                    <circle class="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" stroke-width="4"></circle>
                    <path class="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z"></path>
                </svg>
            `;
        }
        if (micHint) {
            micHint.innerHTML = '<span class="text-[#526600] dark:text-[#B8D166] font-bold">Lumi AI đang phân tích âm phổ & đối chiếu phoneme...</span>';
        }
        if (waveContainer) {
            waveContainer.classList.remove('is-active');
        }

        // Simulate Neural Engine Processing (~1.1s)
        setTimeout(() => {
            recordingState = 'evaluated';
            playSfx(7); // Victory chime
            renderAssessmentResultsWrapper();
        }, 1100);
    }

    function renderAssessmentResultsWrapper() {
        const item = getCurrentTarget();
        if (window.PronunciationResultView) {
            window.PronunciationResultView.renderAssessmentResults(item, activeEngine);
        }
    }

    // 12. Replay User Voice
    window.replayUserRecordedVoice = function () {
        playSfx(1);
        if (recordedAudioBlob) {
            const url = URL.createObjectURL(recordedAudioBlob);
            const audio = new Audio(url);
            audio.play();
            notify('🎙️ Đang phát lại bản ghi âm của bạn...');
        } else {
            // Simulated audio chirp fallback
            notify('🎙️ Đang phát lại giọng thu âm của bạn (Mô phỏng)...');
            if ('speechSynthesis' in window) {
                const item = getCurrentTarget();
                const utterance = new SpeechSynthesisUtterance(item.text || item.word);
                utterance.pitch = 1.2;
                utterance.rate = 0.95;
                window.speechSynthesis.speak(utterance);
            }
        }
    };

    // 13. Save to Flashcard Deck
    window.saveTargetToFlashcards = function () {
        const item = getCurrentTarget();
        playSfx(1);

        // Store into localStorage to simulate persistence
        try {
            const existingSaved = JSON.parse(localStorage.getItem('saved_pronunciation_cards') || '[]');
            existingSaved.unshift({
                id: 'pr_' + Date.now(),
                word: item.text || item.word,
                ipa: item.ipa,
                meaning: item.meaning,
                savedAt: new Date().toISOString(),
                score: activeEngine === 'azure' ? item.scoreAzure.overall : item.scoreSpeechAce.overall
            });
            localStorage.setItem('saved_pronunciation_cards', JSON.stringify(existingSaved.slice(0, 50)));
        } catch (e) {
            console.log('[Storage]:', e);
        }

        notify(`🎉 Đã lưu "${item.text || item.word}" vào Thư viện Thẻ ôn phát âm!`);
    };

    // Helper: Reset recording UI state
    function resetRecordingStateUI() {
        recordingState = 'idle';
        clearInterval(recordingTimer);
        const micBtn = document.getElementById('prMicBtn');
        const micHint = document.getElementById('prMicHint');
        const waveContainer = document.getElementById('prWaveContainer');
        const resultsContainer = document.getElementById('prResultsContainer');

        if (micBtn) {
            micBtn.classList.remove('is-recording');
            micBtn.innerHTML = `
                <svg class="w-8 h-8 fill-current" viewBox="0 0 24 24">
                    <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                    <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                </svg>
            `;
        }
        if (micHint) {
            micHint.innerHTML = '<span>Chạm micro để bắt đầu thu âm và chấm điểm AI</span>';
        }
        if (waveContainer) {
            waveContainer.classList.remove('is-active');
        }
        if (resultsContainer) {
            resultsContainer.classList.add('hidden');
            resultsContainer.innerHTML = '';
        }
    }

    function stopAllAudio() {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }

    // Expose helpers globally
    window.renderPronunciationModalUI = renderTargetWordCard;
})();
