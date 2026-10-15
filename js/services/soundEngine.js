// ========================================================
// 🔊 SOUND ENGINE, PRONUNCIATION TTS & AUDIO UTILITIES
// Single Responsibility: Web Audio Synthesizer & TTS Engine
// ========================================================

(function (window) {
    'use strict';

    // 1. Web Audio Context Lazy Initialization
    let audioCtx = null;

    function initAudio() {
        if (!audioCtx) {
            const AudioContext = window.AudioContext || window.webkitAudioContext;
            if (AudioContext) {
                audioCtx = new AudioContext();
            }
        }
        if (audioCtx && audioCtx.state === 'suspended') {
            audioCtx.resume();
        }
    }

    // ========================================================
    // 🎛️ 10 SYNTHESIZED SOUND WAVE ENGINE (PURE WEB AUDIO)
    // Zero MP3 asset dependencies, 100% offline & instant (< 5ms)
    // ========================================================
    const SoundEngine = {
        play(type) {
            try {
                initAudio();
                if (!audioCtx) return;
                const now = audioCtx.currentTime;

                if (type === 1) { // 1. Gió nhẹ (Gentle Swoosh - Lướt)
                    const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.3, audioCtx.sampleRate);
                    const data = buffer.getChannelData(0);
                    for (let i = 0; i < buffer.length; i++) data[i] = Math.random() * 2 - 1;
                    const noise = audioCtx.createBufferSource(); noise.buffer = buffer;
                    const filter = audioCtx.createBiquadFilter(); filter.type = 'bandpass';
                    filter.frequency.setValueAtTime(1000, now); filter.frequency.exponentialRampToValueAtTime(200, now + 0.2);
                    const gain = audioCtx.createGain(); gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(0.2, now + 0.05); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.2);
                    noise.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
                    noise.start(now);
                } else if (type === 2) { // 2. Kiếm chém (Sharp Swoosh)
                    const buffer = audioCtx.createBuffer(1, audioCtx.sampleRate * 0.15, audioCtx.sampleRate);
                    const data = buffer.getChannelData(0);
                    for (let i = 0; i < buffer.length; i++) data[i] = Math.random() * 2 - 1;
                    const noise = audioCtx.createBufferSource(); noise.buffer = buffer;
                    const filter = audioCtx.createBiquadFilter(); filter.type = 'bandpass'; filter.Q.value = 5;
                    filter.frequency.setValueAtTime(3000, now); filter.frequency.exponentialRampToValueAtTime(500, now + 0.1);
                    const gain = audioCtx.createGain(); gain.gain.setValueAtTime(0, now); gain.gain.linearRampToValueAtTime(0.4, now + 0.02); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.1);
                    noise.connect(filter); filter.connect(gain); gain.connect(audioCtx.destination);
                    noise.start(now);
                } else if (type === 3) { // 3. Cú đấm (Low Thud)
                    const osc = audioCtx.createOscillator(); osc.type = 'sine';
                    osc.frequency.setValueAtTime(150, now); osc.frequency.exponentialRampToValueAtTime(30, now + 0.15);
                    const gain = audioCtx.createGain(); gain.gain.setValueAtTime(0.5, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.15);
                    osc.connect(gain); gain.connect(audioCtx.destination);
                    osc.start(now); osc.stop(now + 0.15);
                } else if (type === 4) { // 4. Ting 1 (Duolingo Style)
                    const playNote = (f, t, d) => {
                        const osc = audioCtx.createOscillator(); osc.type = 'sine';
                        const gain = audioCtx.createGain(); gain.gain.setValueAtTime(0.2, t); gain.gain.exponentialRampToValueAtTime(0.01, t + d);
                        osc.frequency.setValueAtTime(f, t);
                        osc.connect(gain); gain.connect(audioCtx.destination);
                        osc.start(t); osc.stop(t + d);
                    };
                    playNote(1046.50, now, 0.3); // C6
                    playNote(1318.51, now + 0.1, 0.5); // E6
                } else if (type === 5) { // 5. Mario Coin (8-bit)
                    const playNote = (f, t, d) => {
                        const osc = audioCtx.createOscillator(); osc.type = 'square';
                        const gain = audioCtx.createGain(); gain.gain.setValueAtTime(0.1, t); gain.gain.exponentialRampToValueAtTime(0.01, t + d);
                        osc.frequency.setValueAtTime(f, t);
                        osc.connect(gain); gain.connect(audioCtx.destination);
                        osc.start(t); osc.stop(t + d);
                    };
                    playNote(987.77, now, 0.1); // B5
                    playNote(1318.51, now + 0.1, 0.4); // E6
                } else if (type === 6) { // 6. Thủy tinh (Crystal Glass)
                    const playNote = (f, t, d) => {
                        const osc = audioCtx.createOscillator(); osc.type = 'sine';
                        const gain = audioCtx.createGain(); gain.gain.setValueAtTime(0.1, t); gain.gain.linearRampToValueAtTime(0, t + d);
                        osc.frequency.setValueAtTime(f, t);
                        osc.connect(gain); gain.connect(audioCtx.destination);
                        osc.start(t); osc.stop(t + d);
                    };
                    playNote(2000, now, 0.8);
                    playNote(3000, now + 0.05, 0.8);
                    playNote(4000, now + 0.1, 0.8);
                } else if (type === 7) { // 7. Bong bóng (Bubble Pop)
                    const osc = audioCtx.createOscillator(); osc.type = 'sine';
                    osc.frequency.setValueAtTime(400, now); osc.frequency.exponentialRampToValueAtTime(100, now + 0.05);
                    const gain = audioCtx.createGain(); gain.gain.setValueAtTime(0.3, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                    osc.connect(gain); gain.connect(audioCtx.destination);
                    osc.start(now); osc.stop(now + 0.05);
                } else if (type === 8) { // 8. Gõ mộc (Wood Click)
                    const osc = audioCtx.createOscillator(); osc.type = 'triangle';
                    osc.frequency.setValueAtTime(300, now); osc.frequency.exponentialRampToValueAtTime(50, now + 0.05);
                    const gain = audioCtx.createGain(); gain.gain.setValueAtTime(0.2, now); gain.gain.exponentialRampToValueAtTime(0.01, now + 0.05);
                    osc.connect(gain); gain.connect(audioCtx.destination);
                    osc.start(now); osc.stop(now + 0.05);
                } else if (type === 9) { // 9. Phép thuật (Magic Sparkle)
                    const playNote = (f, t) => {
                        const osc = audioCtx.createOscillator(); osc.type = 'sine';
                        const gain = audioCtx.createGain(); gain.gain.setValueAtTime(0.1, t); gain.gain.exponentialRampToValueAtTime(0.01, t + 0.2);
                        osc.frequency.setValueAtTime(f, t);
                        osc.connect(gain); gain.connect(audioCtx.destination);
                        osc.start(t); osc.stop(t + 0.2);
                    };
                    playNote(523.25, now); // C5
                    playNote(659.25, now + 0.05); // E5
                    playNote(783.99, now + 0.10); // G5
                    playNote(1046.50, now + 0.15); // C6
                } else if (type === 10) { // 10. Báo lỗi (Error Buzzer)
                    const osc = audioCtx.createOscillator(); osc.type = 'sawtooth';
                    osc.frequency.setValueAtTime(150, now);
                    const gain = audioCtx.createGain(); gain.gain.setValueAtTime(0.1, now); gain.gain.linearRampToValueAtTime(0, now + 0.2);
                    osc.connect(gain); gain.connect(audioCtx.destination);
                    osc.start(now); osc.stop(now + 0.2);
                }
            } catch (err) {
                console.warn('[SoundEngine] Audio playback error:', err);
            }
        }
    };

    // ========================================================
    // 📢 SOUND BOARD MODAL CONTROLLER
    // ========================================================
    function openSoundBoard() {
        const modal = document.getElementById('soundBoardModal');
        if (modal) modal.classList.remove('hidden');
    }

    function closeSoundBoard() {
        const modal = document.getElementById('soundBoardModal');
        if (modal) modal.classList.add('hidden');
    }

    // ========================================================
    // 🗣️ TTS SPEECH SYNTHESIS & VOICE ANIMATIONS
    // ========================================================
    let activeSpeakingTimer = null;
    let activeLoadingTimer = null;
    let toastTimeout = null;

    function showDictToast(msg) {
        const toast = document.getElementById('dictToast');
        const msgEl = document.getElementById('dictToastMsg');
        if (!toast || !msgEl) return;
        msgEl.innerText = msg;
        toast.classList.remove('opacity-0', '-translate-y-4', 'pointer-events-none');
        toast.classList.add('opacity-100', 'translate-y-0');
        if (toastTimeout) clearTimeout(toastTimeout);
        toastTimeout = setTimeout(() => {
            toast.classList.remove('opacity-100', 'translate-y-0');
            toast.classList.add('opacity-0', '-translate-y-4', 'pointer-events-none');
        }, 2500);
    }

    function resetVoiceButtonsAnimation() {
        if (activeSpeakingTimer) {
            clearTimeout(activeSpeakingTimer);
            activeSpeakingTimer = null;
        }
        if (activeLoadingTimer) {
            clearTimeout(activeLoadingTimer);
            activeLoadingTimer = null;
        }

        const btnMain = document.getElementById('btnMainVoice');
        const svgMainPlay = document.getElementById('svgMainPlay');
        const svgMainStop = document.getElementById('svgMainStop');
        const svgMainLoad = document.getElementById('svgMainLoad');

        if (btnMain) {
            btnMain.classList.remove('bg-rose-500', 'border-rose-700', 'text-white', 'opacity-80');
            btnMain.classList.add('bg-[#214E46]', 'border-[#163530]', 'text-[#BDECE1]');
        }
        if (svgMainPlay) svgMainPlay.classList.remove('hidden');
        if (svgMainStop) svgMainStop.classList.add('hidden');
        if (svgMainLoad) svgMainLoad.classList.add('hidden');

        const slowBtn = document.getElementById('slowAudioBtn');
        const svgSlowPlay = document.getElementById('svgSlowPlay');
        const svgSlowStop = document.getElementById('svgSlowStop');
        const svgSlowLoad = document.getElementById('svgSlowLoad');
        const slowText = document.getElementById('slowAudioText');

        if (slowBtn) {
            slowBtn.classList.remove('bg-rose-500', 'border-rose-700', 'text-white', 'opacity-80');
            slowBtn.classList.add('bg-[#3D2E0B]', 'border-[#291e07]', 'text-[#FDE68A]');
        }
        if (svgSlowPlay) svgSlowPlay.classList.remove('hidden');
        if (svgSlowStop) svgSlowStop.classList.add('hidden');
        if (svgSlowLoad) svgSlowLoad.classList.add('hidden');
        if (slowText) {
            slowText.classList.remove('text-white');
            slowText.classList.add('text-[#FDE68A]');
        }

        const waveWrapper = document.getElementById('audioWaveWrapper');
        const globalWave = document.getElementById('globalAudioWave');
        if (waveWrapper) {
            waveWrapper.style.gridTemplateRows = '0fr';
            waveWrapper.style.marginTop = '0';
        }
        if (globalWave) {
            globalWave.classList.remove('opacity-100', 'translate-y-0');
            globalWave.classList.add('opacity-0', 'translate-y-4');
        }

        const detailWord = document.getElementById('detailWord');
        const detailIpa = document.getElementById('detailIpa');
        if (detailWord) {
            detailWord.classList.remove('text-[#A1D0C5]', 'text-[#B8D166]', 'text-amber-400', 'text-[#FBBF24]', 'drop-shadow-[0_0_8px_rgba(161,208,197,0.6)]', 'drop-shadow-[0_0_8px_rgba(184,209,102,0.5)]', 'drop-shadow-[0_0_8px_rgba(251,191,36,0.5)]', 'drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]');
        }
        if (detailIpa) {
            detailIpa.classList.remove('text-[#BDECE1]', 'text-[#D4EE7F]', 'text-amber-400', 'text-[#FDE68A]', 'opacity-100');
        }

        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
        }
    }

    function playPronunciation(isSlow = false, word = null) {
        if (activeSpeakingTimer || activeLoadingTimer) {
            resetVoiceButtonsAnimation();
            return;
        }

        const wordToSpeak = word || (document.getElementById('detailWord') ? document.getElementById('detailWord').innerText.trim() : 'resilient');
        if (!wordToSpeak) return;

        const rate = isSlow ? 0.7 : 0.95;
        const durationMs = Math.max(1500, Math.min(4200, (wordToSpeak.length * 140) / rate));

        if (isSlow) {
            const svgSlowPlay = document.getElementById('svgSlowPlay');
            const svgSlowLoad = document.getElementById('svgSlowLoad');
            if (svgSlowPlay) svgSlowPlay.classList.add('hidden');
            if (svgSlowLoad) svgSlowLoad.classList.remove('hidden');
            const slowBtn = document.getElementById('slowAudioBtn');
            if (slowBtn) slowBtn.classList.add('opacity-80');
        } else {
            const svgMainPlay = document.getElementById('svgMainPlay');
            const svgMainLoad = document.getElementById('svgMainLoad');
            if (svgMainPlay) svgMainPlay.classList.add('hidden');
            if (svgMainLoad) svgMainLoad.classList.remove('hidden');
            const btnMain = document.getElementById('btnMainVoice');
            if (btnMain) btnMain.classList.add('opacity-80');
        }

        activeLoadingTimer = setTimeout(() => {
            activeLoadingTimer = null;

            const detailWord = document.getElementById('detailWord');
            const detailIpa = document.getElementById('detailIpa');
            const waveWrapper = document.getElementById('audioWaveWrapper');
            const globalWave = document.getElementById('globalAudioWave');

            if (waveWrapper) {
                waveWrapper.style.gridTemplateRows = '1fr';
                waveWrapper.style.marginTop = '1rem';
            }
            if (globalWave) {
                globalWave.classList.remove('opacity-0', 'translate-y-4');
                globalWave.classList.add('opacity-100', 'translate-y-0');
            }

            if (isSlow) {
                const slowBtn = document.getElementById('slowAudioBtn');
                const svgSlowLoad = document.getElementById('svgSlowLoad');
                const svgSlowStop = document.getElementById('svgSlowStop');
                const slowText = document.getElementById('slowAudioText');

                if (slowBtn) {
                    slowBtn.classList.remove('opacity-80', 'bg-[#3D2E0B]', 'border-[#291e07]', 'text-[#FDE68A]');
                    slowBtn.classList.add('bg-rose-500', 'border-rose-700', 'text-white');
                }
                if (svgSlowLoad) svgSlowLoad.classList.add('hidden');
                if (svgSlowStop) svgSlowStop.classList.remove('hidden');
                if (slowText) {
                    slowText.classList.remove('text-[#FDE68A]');
                    slowText.classList.add('text-white');
                }
                if (detailWord) detailWord.classList.add('text-[#FBBF24]', 'drop-shadow-[0_0_8px_rgba(251,191,36,0.6)]');
                if (detailIpa) detailIpa.classList.add('text-[#FDE68A]', 'opacity-100');
            } else {
                const btnMain = document.getElementById('btnMainVoice');
                const svgMainLoad = document.getElementById('svgMainLoad');
                const svgMainStop = document.getElementById('svgMainStop');

                if (btnMain) {
                    btnMain.classList.remove('opacity-80', 'bg-[#214E46]', 'border-[#163530]', 'text-[#BDECE1]');
                    btnMain.classList.add('bg-rose-500', 'border-rose-700', 'text-white');
                }
                if (svgMainLoad) svgMainLoad.classList.add('hidden');
                if (svgMainStop) svgMainStop.classList.remove('hidden');

                if (detailWord) detailWord.classList.add('text-[#A1D0C5]', 'drop-shadow-[0_0_8px_rgba(161,208,197,0.6)]');
                if (detailIpa) detailIpa.classList.add('text-[#BDECE1]', 'opacity-100');
            }

            const startTime = Date.now();
            let finished = false;
            const finishCallback = () => {
                if (finished) return;
                const elapsed = Date.now() - startTime;
                if (elapsed < durationMs) {
                    if (!activeSpeakingTimer) {
                        activeSpeakingTimer = setTimeout(() => {
                            finished = true;
                            resetVoiceButtonsAnimation();
                        }, durationMs - elapsed);
                    }
                    return;
                }
                finished = true;
                resetVoiceButtonsAnimation();
            };

            if ('speechSynthesis' in window) {
                try {
                    window.speechSynthesis.cancel();
                    const utter = new SpeechSynthesisUtterance(wordToSpeak);
                    utter.lang = 'en-US';
                    utter.rate = rate;
                    utter.onend = finishCallback;
                    utter.onerror = finishCallback;
                    window.speechSynthesis.speak(utter);
                } catch (e) {
                    finishCallback();
                }
            }
            activeSpeakingTimer = setTimeout(finishCallback, durationMs);
        }, 500);
    }

    function toggleSlowAudio() {
        playPronunciation(true);
    }

    function speakWordAccent(text, lang = 'en-US', isSlow = false) {
        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utter = new SpeechSynthesisUtterance(text);
            utter.lang = lang;
            utter.rate = isSlow ? 0.7 : 0.95;
            window.speechSynthesis.speak(utter);
        }
    }

    function speakWord(word) {
        const detailWord = document.getElementById('detailWord');
        if (detailWord && word && detailWord.innerText.trim().toLowerCase() === word.trim().toLowerCase()) {
            playPronunciation(false, word);
        } else {
            speakWordAccent(word, 'en-US', false);
        }
    }

    // Attach to window
    window.SoundEngine = SoundEngine;
    window.openSoundBoard = openSoundBoard;
    window.closeSoundBoard = closeSoundBoard;
    window.showDictToast = showDictToast;
    window.playPronunciation = playPronunciation;
    window.toggleSlowAudio = toggleSlowAudio;
    window.speakWordAccent = speakWordAccent;
    window.speakWord = speakWord;
    window.resetVoiceButtonsAnimation = resetVoiceButtonsAnimation;

})(window);
