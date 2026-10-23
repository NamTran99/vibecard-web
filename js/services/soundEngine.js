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
            // Disabled UI transition & settings click sound effects
            return;
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
