
    // 6. Word Chips Horizontal Scroller
    function renderWordChipScroller() {
        const container = document.getElementById('prWordChipsList');
        if (!container) return;

        let html = '';
        window.PRONUNCIATION_PRESETS.forEach((item, idx) => {
            const isActive = !customTargetItem && idx === activeTargetIdx;
            const shortLabel = item.id === 'sentence_practice' ? '📝 Câu IELTS' : item.word;
            html += `
                <button type="button" 
                        class="pr-chip ${isActive ? 'is-active' : ''}" 
                        onclick="selectPronunciationTarget(${idx})">
                    <span>${shortLabel}</span>
                </button>
            `;
        });

        // Add "+ Tùy chọn" custom chip
        html += `
            <button type="button" 
                    class="pr-chip ${customTargetItem ? 'is-active' : ''}" 
                    onclick="promptCustomPronunciationWord()">
                <svg class="w-3.5 h-3.5" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
                <span>Tự nhập từ</span>
            </button>
        `;

        container.innerHTML = html;
    }

    window.selectPronunciationTarget = function (idx) {
        customTargetItem = null;
        activeTargetIdx = idx;
        playSfx(1);
        resetRecordingStateUI();
        renderWordChipScroller();
        renderTargetWordCard();
    };

    // 7. Custom Word Input
    window.promptCustomPronunciationWord = function () {
        const userInput = prompt('Nhập từ vựng hoặc câu tiếng Anh bạn muốn kiểm tra phát âm:', 'authenticity');
        if (!userInput || !userInput.trim()) return;

        const cleanWord = userInput.trim();
        customTargetItem = {
            id: 'custom_' + Date.now(),
            word: cleanWord,
            ipa: '/custom.input/',
            pos: 'custom entry',
            meaning: `Từ tự nhập: "${cleanWord}". Hệ thống AI sẽ phân tích âm phổ và kiểm tra âm vị học.`,
            example: `Practice pronouncing "${cleanWord}" with clear word stress and natural ending sounds.`,
            scoreAzure: {
                overall: 85,
                accuracy: 87,
                fluency: 83,
                completeness: 100,
                prosody: 84,
                phonemes: [
                    { ph: cleanWord.slice(0, 3), score: 88, status: 'good', desc: 'Âm đầu tự nhiên' },
                    { ph: cleanWord.slice(3, -2) || 'mid', score: 86, status: 'good', desc: 'Nguyên âm chuẩn xác' },
                    { ph: cleanWord.slice(-2) || 'end', score: 81, status: 'warn', desc: 'Chú ý âm đuôi và bật hơi rõ ràng' }
                ]
            },
            scoreSpeechAce: {
                overall: 84,
                cefr: 'B2 Upper-Intermediate',
                accuracy: 86,
                fluency: 82,
                completeness: 100,
                prosody: 83,
                soundMostLike: {
                    detected: cleanWord.toLowerCase(),
                    expected: cleanWord.toLowerCase(),
                    issues: ['Âm tiết rõ ràng, cần lưu ý nối âm khi vào câu hoàn chỉnh.']
                },
                coachTip: `💡 <b>Mẹo luyện tập</b>: Bạn đang luyện từ tự nhập "<b>${cleanWord}</b>". Hãy lắng nghe phát âm mẫu và chú ý vị trí đặt lưỡi cũng như trọng âm chính của từ!`
            }
        };

        playSfx(1);
        resetRecordingStateUI();
        renderWordChipScroller();
        renderTargetWordCard();
    };

    // 8. Render Target Card
    function renderTargetWordCard() {
        const item = getCurrentTarget();
        const wordEl = document.getElementById('prTargetWord');
        const ipaEl = document.getElementById('prTargetIpa');
        const posEl = document.getElementById('prTargetPos');
        const meaningEl = document.getElementById('prTargetMeaning');
        const exampleEl = document.getElementById('prTargetExample');

        if (wordEl) {
            wordEl.textContent = item.text ? item.text : item.word;
            wordEl.style.fontSize = (item.text || item.word.length > 12) ? '20px' : '30px';
        }
        if (ipaEl) ipaEl.textContent = item.ipa;
        if (posEl) posEl.textContent = item.pos;
        if (meaningEl) meaningEl.textContent = item.meaning;
        if (exampleEl) {
            exampleEl.textContent = item.example ? `"${item.example}"` : '';
        }
    }

    // 9. Native TTS Reference Audio Playback
    window.playNativeSpeakerAudio = function () {
        const item = getCurrentTarget();
        const textToSpeak = item.text || item.word;
        playSfx(1);

        const speakerIcon = document.getElementById('prSpeakerIcon');
        if (speakerIcon) {
            speakerIcon.classList.add('animate-bounce');
            setTimeout(() => speakerIcon.classList.remove('animate-bounce'), 1200);
        }

        if ('speechSynthesis' in window) {
            window.speechSynthesis.cancel();
            const utterance = new SpeechSynthesisUtterance(textToSpeak);
            utterance.lang = 'en-US';
            utterance.rate = 0.88; // Slightly relaxed pace for pristine pronunciation demo
            utterance.pitch = 1.0;

            const voices = window.speechSynthesis.getVoices();
            const usVoice = voices.find(v => v.lang === 'en-US' || v.name.includes('Natural') || v.name.includes('Samantha') || v.name.includes('Google US'));
            if (usVoice) utterance.voice = usVoice;

            window.speechSynthesis.speak(utterance);
        } else {
            notify('🔊 Đang phát âm mẫu bản xứ...');
        }
    };