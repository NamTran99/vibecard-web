// ========================================================
// 🎨 CREATE STUDIO SCREEN (TAB 1) - BENTO & OCR/AUDIO IMPORT
// ========================================================

let lumiTapCount = 0;
function tapLumiCharacter(el) {
    if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
        SoundEngine.play(1);
    }
    const target = el ? (el.querySelector('.lumi-mascot-img') || el.querySelector('img') || el) : null;
    if (target) {
        target.classList.remove('lumi-wiggling');
        void target.offsetWidth;
        target.classList.add('lumi-wiggling');
        setTimeout(() => target.classList.remove('lumi-wiggling'), 520);
    }

    lumiTapCount++;
    if (lumiTapCount % 3 === 0 && typeof triggerLumiWakeup === 'function') {
        setTimeout(() => triggerLumiWakeup(true), 250);
        return;
    }

    if (typeof showEntranceToast === 'function' && typeof lumiSmartTips !== 'undefined') {
        showEntranceToast(lumiSmartTips[currentLumiTipIdx % lumiSmartTips.length]);
        currentLumiTipIdx++;
    }
}

        function openOcrDialog() {
            const input = document.getElementById('ocrImageInput');
            if (input) {
                input.click();
            } else {
                showEntranceToast("📸 Đang mở máy ảnh quét chữ OCR...");
            }
        }

        function handleOcrImageSelected(input) {
            if (input && input.files && input.files[0]) {
                const fileName = input.files[0].name;
                showEntranceToast(`✨ Lumi đang quét "${fileName}" & tạo thẻ...`);
                setTimeout(() => {
                    showEntranceToast("🎉 Đã nhận diện 6 từ vựng mới từ ảnh!");
                }, 1200);
            }
        }

        function openAudioVideoDialog() {
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
            if (typeof openAudioVideoScreen === 'function') {
                openAudioVideoScreen();
            } else {
                showEntranceToast("🎬 Đang khởi tạo bộ bóc tách transcript từ Audio/Video...");
            }
        }

        function openTextImportDialog() {
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
            showEntranceToast("📝 Dán văn bản hoặc hội thoại để Lumi tự tạo flashcards!");
        }

        function openLessonImportDialog() {
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
            switchBottomNav(0);
            showEntranceToast("📚 Đã chuyển về lộ trình bài học để tạo thẻ!");
        }

        function openAudioVoiceDialog() {
            if (typeof openPronunciationAssessmentModal === 'function') {
                openPronunciationAssessmentModal();
            } else {
                if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
                showEntranceToast("🎙️ Giọng nói AI: Khởi động phòng thu luyện phát âm...");
            }
        }

        function openWebReaderDialog() {
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
            showEntranceToast("🌐 Đọc báo song ngữ: Mở trình đọc tin tức trích xuất từ mới!");
        }

        function openAnkiImportDialog() {
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
            showEntranceToast("📥 Nhập bộ thẻ: Hỗ trợ tệp Quizlet, Anki (.apkg), CSV và Excel!");
        }

        function openDifficultWordsDialog() {
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
            showEntranceToast("⚡ Từ khó nhớ: Đang tải danh sách các từ bạn thường quên nhất!");
        }

        function openReviewDialog() {
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
            showEntranceToast("🔄 Ôn định kỳ: 18 thẻ đến hạn ôn hôm nay theo thuật toán SRS!");
        }

        function openSpeedReviewDialog() {
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
            showEntranceToast("⏱️ Ôn siêu tốc: Trả lời nhanh trong 3 giây mỗi thẻ để tăng phản xạ!");
        }

        function openGrammarReviewDialog() {
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
            showEntranceToast("📖 Ôn ngữ pháp: Tổng hợp cấu trúc câu & thì thường gặp!");
        }

        function openAiDeckDialog() {
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
            openDictionaryScreen('');
            if (typeof showToast === 'function') {
                showToast('✨ Chọn chủ đề bất kỳ để Lumi tự động tạo thẻ nhé!');
            }
        }

        function openLocalVideoDialog() {
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
            showEntranceToast("🎬 Video bản xứ: Bóc tách từ vựng từ video người bản xứ!");
        }

        function openListeningDialog() {
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
            showEntranceToast("🎧 Luyện nghe: Bóc tách transcript & bài tập phản xạ âm thanh!");
        }

        function openPronunciationDialog() {
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
            showEntranceToast("🎙️ Luyện phát âm: AI phân tích khẩu hình & chấm điểm IPA!");
        }

        function openResponsesDialog() {
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
            showEntranceToast("💬 Phản xạ hội thoại: Có 2 tình huống giao tiếp mới từ AI!");
        }

        function setCreateViewMode(mode) {
            const circleContainer = document.getElementById('createCircleContainer');
            const bentoContainer = document.getElementById('createBentoContainer');
            const btnCircle = document.getElementById('createViewModeCircle');
            const btnBento = document.getElementById('createViewModeBento');

            if (!circleContainer || !bentoContainer) return;

            if (mode === 'bento') {
                circleContainer.classList.add('hidden');
                bentoContainer.classList.remove('hidden');
                if (btnBento && btnCircle) {
                    btnBento.className = 'px-2.5 py-1 rounded-full text-[11px] font-black transition-all bg-primary text-onPrimary shadow-sm cursor-pointer';
                    btnCircle.className = 'px-2.5 py-1 rounded-full text-[11px] font-black transition-all text-[#909283] hover:text-[#E5E3DB] cursor-pointer';
                }
            } else {
                bentoContainer.classList.add('hidden');
                circleContainer.classList.remove('hidden');
                if (btnBento && btnCircle) {
                    btnCircle.className = 'px-2.5 py-1 rounded-full text-[11px] font-black transition-all bg-primary text-onPrimary shadow-sm cursor-pointer';
                    btnBento.className = 'px-2.5 py-1 rounded-full text-[11px] font-black transition-all text-[#909283] hover:text-[#E5E3DB] cursor-pointer';
                }
            }
        }

// ========================================================
// 🎯 CIRCULAR ACTION ITEM TACTILE INTERACTION
// ========================================================
function selectCircleItem(id, actionFn, arg) {
    if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);

    // Provide immediate physical tactile bounce on the card button
    const card = document.getElementById(`circleItem-${id}`);
    if (card) {
        const btn = card.querySelector('.circle-item-btn');
        if (btn) {
            btn.style.transform = 'translateY(4px) scale(0.96)';
            setTimeout(() => {
                btn.style.transform = '';
            }, 160);
        }
    }

    // Trigger destination action directly
    if (typeof actionFn === 'function') {
        if (arg !== undefined) actionFn(arg);
        else actionFn();
    }
}

// ========================================================
// 🎬 FLUID ENTRANCE ORCHESTRATOR FOR TIỆN ÍCH (TAB 1)
// ========================================================
function playCreateScreenEntrance() {
    const screen1 = document.getElementById('tabScreen-1');
    if (!screen1) return;

    // Reset scroll smoothly to top on entrance
    screen1.scrollTop = 0;

    // 1. Header Display Title & Subtext Glide
    const headerTitle = screen1.querySelector('#createHubHeader h1');
    const headerSub = screen1.querySelector('#createHubHeader p');
    if (headerTitle) {
        headerTitle.style.animation = 'none';
        void headerTitle.offsetWidth;
        headerTitle.style.animation = 'createHeaderGlide 0.36s cubic-bezier(0.16, 1, 0.3, 1) backwards';
    }
    if (headerSub) {
        headerSub.style.animation = 'none';
        void headerSub.offsetWidth;
        headerSub.style.animation = 'createHeaderGlide 0.38s cubic-bezier(0.16, 1, 0.3, 1) 40ms backwards';
    }

    // 2. Mascot Lumi Welcoming Spring Greeting
    const mascotImg = screen1.querySelector('.lumi-mascot-img') || screen1.querySelector('#createHubHeader img');
    if (mascotImg) {
        mascotImg.style.animation = 'none';
        void mascotImg.offsetWidth;
        mascotImg.style.animation = 'lumiWelcomeSpring 0.48s cubic-bezier(0.2, 0.9, 0.3, 1.2) backwards';
        setTimeout(() => {
            if (mascotImg) mascotImg.style.animation = '';
        }, 520);
    }

    // 3. Staggered Group Cards & Harmonic Row Waves
    const groupCards = screen1.querySelectorAll('.circle-group-card');
    groupCards.forEach((card, cardIdx) => {
        card.style.animation = 'none';
        void card.offsetWidth;
        const cardDelay = cardIdx * 75; // 0ms, 75ms, 150ms
        card.style.animation = `groupCardGlide 0.40s cubic-bezier(0.2, 0.9, 0.3, 1) ${cardDelay}ms backwards`;

        // Section category indicator dot pulse-ping
        const dot = card.querySelector('h3 span.rounded-full');
        if (dot) {
            dot.style.animation = 'none';
            void dot.offsetWidth;
            dot.style.animation = `categoryDotPing 0.38s cubic-bezier(0.34, 1.56, 0.64, 1) ${cardDelay + 80}ms backwards`;
        }

        // Inner buttons: Coordinated horizontal wave per row (4 columns per row)
        const buttons = card.querySelectorAll('.circle-item-card');
        buttons.forEach((btn, btnIdx) => {
            btn.style.animation = 'none';
            void btn.offsetWidth;
            const rowIdx = Math.floor(btnIdx / 4);
            const colIdx = btnIdx % 4;
            const btnDelay = cardDelay + 35 + (rowIdx * 55) + (colIdx * 18);
            btn.style.animation = `circleItemLift 0.36s cubic-bezier(0.22, 1, 0.36, 1) ${btnDelay}ms backwards`;
        });
    });

    // 4. Support Bento view if active
    const bentoItems = screen1.querySelectorAll('.anim-create-item');
    bentoItems.forEach((item, idx) => {
        item.style.animation = 'none';
        void item.offsetWidth;
        item.style.animation = `createItemCascade 0.38s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 55}ms backwards`;
    });
}





function toggleCreateViewMode() {
    if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
    const container = document.getElementById('createCircleContainer');
    const icon = document.getElementById('viewToggleIcon');
    if (container) {
        container.classList.toggle('create-list-mode');
        
        // Update icon based on mode
        if (container.classList.contains('create-list-mode')) {
            icon.innerHTML = '<rect x="3" y="3" width="7" height="7" rx="1.5"></rect><rect x="14" y="3" width="7" height="7" rx="1.5"></rect><rect x="14" y="14" width="7" height="7" rx="1.5"></rect><rect x="3" y="14" width="7" height="7" rx="1.5"></rect>';
        } else {
            icon.innerHTML = '<path stroke-linecap="round" stroke-linejoin="round" d="M4 6h16M4 12h16M4 18h16"></path>';
        }
    }
}
