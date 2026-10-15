// ========================================================
// 📖 LESSON INTRODUCTION SCREEN (GIỚI THIỆU BÀI HỌC)
// Replicates 1:1 mobile layout from reference design
// (Pill Header, Hero Cover Squircle, Burnt-Amber CTA,
//  Hook paragraph, Episode Tracklist, Floating Dual Dock)
// ========================================================

(function () {
    window.currentChapterIdx = 0;
    let isPlayingLessonPreview = false;
    let previewAudioTimer = null;
    const savedChapters = new Set(); // Empty by default so Save button matches Image 2

    function getLessonData(idx) {
        const data = window.lessonIntroData || [];
        return data[idx] || data[0] || {};
    }

    window.openLessonIntroScreen = function (chapterIdx = 0, customData = null) {
        if (typeof window.openStoryReaderScreen === 'function') {
            window.openStoryReaderScreen(customData);
            return;
        }
        const data = window.lessonIntroData || [];
        window.currentChapterIdx = (chapterIdx >= 0 && chapterIdx < data.length) ? chapterIdx : 0;
        const ch = customData ? Object.assign({}, data[window.currentChapterIdx] || {}, customData) : data[window.currentChapterIdx];
        if (customData) {
            window._currentActiveLessonData = ch;
        }

        const screen = document.getElementById('screenLessonIntro');
        if (!screen) return;

        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
            SoundEngine.play(1);
        }

        // Render data
        renderLessonIntroUI(ch);

        // Slide into view
        screen.style.display = '';
        screen.classList.remove('hidden');
        requestAnimationFrame(() => {
            screen.classList.remove('translate-x-full');
        });
        bindIntroPlayListeners();
    };

    window.closeLessonIntroScreen = function () {
        const screen = document.getElementById('screenLessonIntro');
        if (!screen) return;

        if (isPlayingLessonPreview) {
            stopLessonAudioPreview();
        }

        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
            SoundEngine.play(8);
        }

        screen.classList.add('translate-x-full');
        setTimeout(() => {
            screen.classList.add('hidden');
            screen.style.display = 'none';
        }, 300);
    };

    function renderLessonIntroUI(ch) {
        // Top status pill (2 statuses: 'Hội thoại' or 'Truyện')
        const currentTypeKey = ch.lessonType === 'dialogue' ? 'dialogue' : 'story';
        updateLessonTypeUI(currentTypeKey);

        // Cover artwork
        const coverImg = document.getElementById('introCoverImg');
        if (coverImg) coverImg.src = ch.image;

        // Volumetric ambient glow
        const auraEl = document.getElementById('introVolumetricAura');
        if (auraEl) {
            const isLight = document.documentElement.classList.contains('light');
            auraEl.style.backgroundColor = isLight ? ch.auraColorLight : ch.auraColor;
        }

        // Meta tag & Title
        const catEl = document.getElementById('introCategoryTag');
        const titleEl = document.getElementById('introChapterTitle');
        if (catEl) catEl.textContent = ch.category;
        if (titleEl) titleEl.textContent = ch.title;

        // Determine whether lesson is in review mode, in-progress (Tiếp tục) or brand new (Bắt đầu)
        const hasDone = ch.episodes && ch.episodes.some(ep => ep.done);
        const hasProgress = hasDone || (typeof ch.progressPercent === 'number' && ch.progressPercent > 0);
        const activeEp = (ch.episodes && ch.episodes.find(ep => ep.active)) || (ch.episodes && ch.episodes[0]);
        const activeNum = activeEp ? activeEp.num : 1;

        let primaryText = hasProgress ? "Tiếp tục" : "Bắt đầu";
        let primarySubText = `• Bài ${activeNum}`;
        if (ch.isReviewMode) {
            primaryText = "Ôn lại ↺";
            primarySubText = "• Củng cố từ vựng";
        }

        // Top Hero CTA button label & duration
        const heroPlayCtaLabel = document.getElementById('introPlayCtaLabel');
        const durationEl = document.getElementById('introDurationLabel');
        if (heroPlayCtaLabel) heroPlayCtaLabel.textContent = primaryText;
        if (durationEl) durationEl.textContent = `• ${ch.duration}`;

        // Bottom Sticky Action Dock Primary Button
        const bottomPrimaryLabel = document.getElementById('introBottomPrimaryLabel');
        const bottomPrimarySub = document.getElementById('introBottomPrimarySub');
        if (bottomPrimaryLabel) bottomPrimaryLabel.textContent = primaryText;
        if (bottomPrimarySub) bottomPrimarySub.textContent = primarySubText;

        // Excerpt & hook description
        const descEl = document.getElementById('introStoryDesc');
        if (descEl) descEl.textContent = ch.desc;

        // Progress pill
        const pillEl = document.getElementById('introPillIndex');
        if (pillEl) pillEl.textContent = ch.progressPill;

        // Save dock button state
        updateSaveButtonState();

        // Render episodes / playlist
        if (typeof renderEpisodesTracklist === 'function') {
            renderEpisodesTracklist(ch);
        }

        // Render core vocab chips
        if (typeof renderVocabChips === 'function') {
            renderVocabChips(ch);
        }

        // Initialize Vocab Goal Selector UI (5, 10, 15, Tất cả)
        if (typeof initLessonVocabSelector === 'function') {
            initLessonVocabSelector(ch);
        }
    }

    function updateSaveButtonState() {
        const saveDockBtn = document.getElementById('introSaveDockBtn');
        const isSaved = savedChapters.has(window.currentChapterIdx);

        if (saveDockBtn) {
            saveDockBtn.textContent = isSaved ? "Saved ✓" : "Save";
            if (isSaved) {
                saveDockBtn.classList.add('border-2', 'border-[#8D3B0E]', 'text-[#8D3B0E]');
            } else {
                saveDockBtn.classList.remove('border-2', 'border-[#8D3B0E]', 'text-[#8D3B0E]');
            }
        }
    }

    window.saveCourseLessonIntro = function () {
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
            SoundEngine.play(1);
        }

        const ch = getLessonData(window.currentChapterIdx);
        if (savedChapters.has(currentChapterIdx)) {
            savedChapters.delete(currentChapterIdx);
            if (typeof showDictToast === 'function') {
                showDictToast(`Đã bỏ lưu "${ch.title}" khỏi Thư viện.`);
            }
        } else {
            savedChapters.add(currentChapterIdx);
            if (typeof showDictToast === 'function') {
                showDictToast(`🎉 Đã lưu "${ch.title}" vào Thư viện của bạn!`);
            }
        }

        updateSaveButtonState();
    };

    window.copyCourseLessonIntro = function () {
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
            SoundEngine.play(1);
        }

        const ch = getLessonData(window.currentChapterIdx);
        const vocabText = ch.vocab.map(v => `${v.word} ${v.ipa}: ${v.meaning}`).join('\n');
        const textToCopy = `📖 ${ch.title} (${ch.category})\n${ch.desc}\n\nTừ vựng then chốt:\n${vocabText}`;

        if (navigator.clipboard && navigator.clipboard.writeText) {
            navigator.clipboard.writeText(textToCopy).then(() => {
                if (typeof showDictToast === 'function') {
                    showDictToast('📋 Đã sao chép nội dung & từ vựng bài học!');
                }
            }).catch(() => {
                fallbackCopy(textToCopy);
            });
        } else {
            fallbackCopy(textToCopy);
        }
    };

    function fallbackCopy(text) {
        const ta = document.createElement('textarea');
        ta.value = text;
        ta.style.position = 'fixed';
        ta.style.opacity = '0';
        document.body.appendChild(ta);
        ta.select();
        try {
            document.execCommand('copy');
            if (typeof showDictToast === 'function') {
                showDictToast('📋 Đã sao chép nội dung & từ vựng bài học!');
            }
        } catch (e) {}
        document.body.removeChild(ta);
    }

    window.startCourseLessonIntro = function (lessonNum) {
        if (lessonNum && typeof lessonNum === 'object' && typeof lessonNum.preventDefault === 'function') {
            try {
                lessonNum.preventDefault();
                lessonNum.stopPropagation();
            } catch (e) {}
            lessonNum = null;
        }

        try {
            const ch = window._currentActiveLessonData || getLessonData(window.currentChapterIdx) || {};
            const nextEp = (ch.episodes && ch.episodes.find(e => !e.done)) || (ch.episodes && ch.episodes.find(e => e.active)) || (ch.episodes && ch.episodes[0]);
            const num = (typeof lessonNum === 'number') ? lessonNum : (nextEp ? nextEp.num : 1);
            const hasDone = ch.episodes && ch.episodes.some(ep => ep.done);
            const hasProgress = hasDone || (typeof ch.progressPercent === 'number' && ch.progressPercent > 0);
            const actionVerb = hasProgress ? 'Tiếp tục' : 'Bắt đầu';
            const targetCount = window.selectedLessonVocabCount || (ch.vocab ? ch.vocab.length : 12);

            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
                SoundEngine.play(1);
            }

            const activeWords = (ch.vocab && ch.vocab.length > 0) ? ch.vocab.slice(0, targetCount) : [];
            const lessonPayload = Object.assign({}, window._currentActiveLessonData || ch, {
                targetVocabCount: targetCount,
                activeVocab: activeWords.length > 0 ? activeWords : (ch.vocab || [])
            });
            window._currentActiveLessonData = lessonPayload;

            // 1. Luôn mở màn hình Đọc truyện (Story to Card Reader) chuẩn flow Android:
            // Đọc bài, tương tác với từ vựng highlight, phân loại từ, sau đó mới sang Flashcard ôn tập!
            if (typeof window.openStoryReaderScreen === 'function') {
                window.openStoryReaderScreen(lessonPayload);
            } else if (typeof openStoryReaderScreen === 'function') {
                openStoryReaderScreen(lessonPayload);
            }

            // 2. Ẩn dứt khoát màn hình intro ở tầng dưới
            const screen = document.getElementById('screenLessonIntro');
            if (screen) {
                screen.classList.add('hidden', 'translate-x-full');
                screen.style.display = 'none';
            }
            if (isPlayingLessonPreview) {
                stopLessonAudioPreview();
            }

            if (typeof showDictToast === 'function') {
                showDictToast(`🚀 ${actionVerb} học ${lessonPayload.activeVocab.length} từ: ${ch.title || 'bài học'}`);
            }
        } catch (err) {
            console.error('[startCourseLessonIntro] Error:', err);
            if (typeof window.openStoryReaderScreen === 'function') {
                window.openStoryReaderScreen();
            }
        }
    };

    function bindIntroPlayListeners() {
        const playBtn = document.getElementById('introPlayCtaBtn');
        const bottomBtn = document.getElementById('introBottomPrimaryBtn');
        if (playBtn && !playBtn._hasClickListener) {
            playBtn._hasClickListener = true;
            playBtn.addEventListener('click', function (e) {
                window.startCourseLessonIntro(e);
            });
            playBtn.addEventListener('touchend', function (e) {
                e.preventDefault();
                window.startCourseLessonIntro(e);
            }, { passive: false });
        }
        if (bottomBtn && !bottomBtn._hasClickListener) {
            bottomBtn._hasClickListener = true;
            bottomBtn.addEventListener('click', function (e) {
                window.startCourseLessonIntro(e);
            });
            bottomBtn.addEventListener('touchend', function (e) {
                e.preventDefault();
                window.startCourseLessonIntro(e);
            }, { passive: false });
        }
    }

    window.toggleIntroAudioPreview = function () {
        if (isPlayingLessonPreview) {
            stopLessonAudioPreview();
        } else {
            playLessonAudioPreview();
        }
    };

    function playLessonAudioPreview() {
        isPlayingLessonPreview = true;
        const durationEl = document.getElementById('introDurationLabel');
        const playIcon = document.getElementById('introPlayIcon');
        const bottomAudioIcon = document.getElementById('introBottomAudioIcon');
        const bottomAudioBtn = document.getElementById('introBottomAudioBtn');

        if (durationEl) durationEl.textContent = "• Đang phát...";
        if (playIcon) {
            playIcon.innerHTML = '<rect x="6" y="4" width="4" height="16" fill="currentColor"></rect><rect x="14" y="4" width="4" height="16" fill="currentColor"></rect>';
        }
        if (bottomAudioIcon) {
            bottomAudioIcon.innerHTML = '<rect x="6" y="4" width="4" height="16" fill="currentColor"></rect><rect x="14" y="4" width="4" height="16" fill="currentColor"></rect>';
        }
        if (bottomAudioBtn) {
            bottomAudioBtn.classList.add('bg-[#B8D166]/25', 'text-[#3B6900]', 'dark:text-[#B8D166]', 'border-[#B8D166]/50');
        }

        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
            SoundEngine.play(1);
        }

        if (typeof showDictToast === 'function') {
            showDictToast('🔊 Đang phát đoạn đối thoại trích đoạn...');
        }

        previewAudioTimer = setTimeout(() => {
            stopLessonAudioPreview();
        }, 5000);
    }

    function stopLessonAudioPreview() {
        isPlayingLessonPreview = false;
        if (previewAudioTimer) clearTimeout(previewAudioTimer);
        const ch = getLessonData(window.currentChapterIdx);
        const durationEl = document.getElementById('introDurationLabel');
        const playIcon = document.getElementById('introPlayIcon');
        const bottomAudioIcon = document.getElementById('introBottomAudioIcon');
        const bottomAudioBtn = document.getElementById('introBottomAudioBtn');

        if (durationEl && ch) durationEl.textContent = `• ${ch.duration}`;
        if (playIcon) {
            playIcon.innerHTML = '<polygon points="6 4 18 12 6 20 6 4" fill="currentColor"/>';
        }
        if (bottomAudioIcon) {
            bottomAudioIcon.innerHTML = '<polygon points="6 4 18 12 6 20 6 4" fill="currentColor"/>';
        }
        if (bottomAudioBtn) {
            bottomAudioBtn.classList.remove('bg-[#B8D166]/25', 'text-[#3B6900]', 'dark:text-[#B8D166]', 'border-[#B8D166]/50');
        }
    }

    window.handleIntroDockTab = function (tab) {
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
            SoundEngine.play(1);
        }
        if (tab === 'library') {
            if (typeof showDictToast === 'function') {
                showDictToast('📚 Mở Thư viện bài học cá nhân');
            }
        } else if (tab === 'discover') {
            window.closeLessonIntroScreen();
            setTimeout(() => {
                if (typeof switchBottomTab === 'function') {
                    switchBottomTab(1); // Explore / Hub
                }
            }, 250);
        } else if (tab === 'search') {
            window.closeLessonIntroScreen();
            setTimeout(() => {
                if (typeof openDictionaryScreen === 'function') {
                    openDictionaryScreen();
                }
            }, 250);
        }
    };

    window.showIntroMoreOptions = function () {
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
            SoundEngine.play(1);
        }
        if (typeof showDictToast === 'function') {
            showDictToast('⚙️ Tùy chọn: Chia sẻ • Tải ngoại tuyến • Đặt lại tiến độ');
        }
    };

    window.toggleIntroFavorite = function () {
        window.saveCourseLessonIntro();
    };

    // Backward compatibility redirects: Chuyển thẳng sang Màn hình Đọc truyện Story to Card chuẩn 1:1 Android Pixel
    window.openStoryBookReader = function (chapterIdx = 0) {
        if (typeof window.openStoryReaderScreen === 'function') {
            window.openStoryReaderScreen();
            return;
        }
        window.openLessonIntroScreen(chapterIdx);
    };

    window.closeStoryBookReader = function () {
        if (typeof window.closeStoryReaderScreen === 'function') {
            window.closeStoryReaderScreen();
            return;
        }
        window.closeLessonIntroScreen();
    };

})();
