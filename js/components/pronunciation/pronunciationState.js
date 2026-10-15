/**
 * ===================================================================
 * 🎙️ PRONUNCIATION ASSESSMENT STUDIO (LUYỆN PHÁT ÂM AI)
 * ===================================================================
 * Dual AI Engine Architecture:
 * - 🥇 Microsoft Azure Cognitive Services Speech S0 (Phoneme IPA Granularity)
 * - 🥈 SpeechAce / Conversaflex (CEFR Level & Vietnamese Learner Mispronunciations)
 *
 * Implements M3-07 Dark Olive Green design system, fluid animations,
 * zero-server offline simulation, and native TTS speech synthesis.
 */

(function () {
    'use strict';

    // 2. Component Internal State
    let activeEngine = 'azure'; // 'azure' | 'speechace'
    let activeTargetIdx = 0;
    let customTargetItem = null;
    let recordingState = 'idle'; // 'idle' | 'recording' | 'analyzing' | 'evaluated'
    let recordingTimer = null;
    let recordingSeconds = 0;
    let mediaRecorder = null;
    let recordedChunks = [];
    let recordedAudioBlob = null;
    let isPlayingUserVoice = false;

    // Helper: Show toast notification safely
    function notify(msg) {
        if (typeof window.showEntranceToast === 'function') {
            window.showEntranceToast(msg);
        } else {
            console.log('[Pronunciation Toast]:', msg);
        }
    }

    // Helper: Play SFX safely
    function playSfx(id) {
        if (typeof window.SoundEngine !== 'undefined' && window.SoundEngine.play) {
            window.SoundEngine.play(id);
        }
    }

    // 3. Get Current Target Data
    function getCurrentTarget() {
        if (customTargetItem) return customTargetItem;
        return window.PRONUNCIATION_PRESETS[activeTargetIdx] || window.PRONUNCIATION_PRESETS[0];
    }})();
