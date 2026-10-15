(function(window) {
    'use strict';

    window.StoryReaderState = {
        currentStory: window.DEFAULT_STORY_DATA,
        currentPartIndex: 0,
        currentWordIndex: 0,
        isTranslationVisible: false,
        isAudioPlaying: false,
        activeUtterance: null,
        isFlipping: false,
        isTargetCardExpanded: false,
        wordClassifications: {},
        extraVocabularyItems: {},
        phraseDraftTokens: [],
        activePopupWord: null,
        settings: {
            audioSpeed: 1.0,
            autoTranslate: false,
            fontSizeMultiplier: 1.0
        }
    };
})(window);
