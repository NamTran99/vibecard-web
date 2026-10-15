
    // 4. Open & Close Modal Lifecycle
    window.openPronunciationAssessmentModal = function (presetIdx = 0, customData = null) {
        const modal = document.getElementById('screenPronunciation');
        if (!modal) return;

        playSfx(1);

        if (customData) {
            customTargetItem = customData;
        } else {
            customTargetItem = null;
            activeTargetIdx = (presetIdx >= 0 && presetIdx < window.PRONUNCIATION_PRESETS.length) ? presetIdx : 0;
        }

        recordingState = 'idle';
        resetRecordingStateUI();
        renderWordChipScroller();
        renderTargetWordCard();

        modal.classList.remove('hidden');
        requestAnimationFrame(() => {
            modal.classList.remove('translate-x-full');
        });
    };

    window.closePronunciationAssessmentModal = function () {
        const modal = document.getElementById('screenPronunciation');
        if (!modal) return;

        playSfx(8);
        stopAllAudio();
        stopRecordingSession();

        modal.classList.add('translate-x-full');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 300);
    };

    // 5. Engine Switcher
    window.setPronunciationEngine = function (engine) {
        if (engine !== 'azure' && engine !== 'speechace') return;
        activeEngine = engine;
        playSfx(1);

        // Update button states
        const btnAzure = document.getElementById('prEngineBtnAzure');
        const btnSpeechAce = document.getElementById('prEngineBtnSpeechAce');
        if (btnAzure && btnSpeechAce) {
            if (activeEngine === 'azure') {
                btnAzure.classList.add('is-active');
                btnSpeechAce.classList.remove('is-active');
            } else {
                btnSpeechAce.classList.add('is-active');
                btnAzure.classList.remove('is-active');
            }
        }

        // Re-render results if already evaluated
        if (recordingState === 'evaluated') {
            renderAssessmentResultsWrapper();
        }
    };