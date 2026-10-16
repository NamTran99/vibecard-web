// ========================================================
// 🗺️ CREATE YOUR OWN ROADMAP CONTROLLER (3D SQUARE '?' SLOTS v5.0)
// Ceiling: < 350 lines | Standard: Material Design 3 Dark Olive Green
// ========================================================

(function (window) {
    'use strict';

    const STORAGE_KEY = 'vibecard_custom_roadmap_slots_v5_sq';
    let mysteryState = { activeNodeNum: 3, revealedStories: {}, deckModeSlots: {} };
    let mysteryListenersBound = false;
    let currentPickingSlot = { chapterId: 0, nodeNum: 3, source: 'classic' };

    function getSlotKey(chapterId, nodeNum) {
        return `${chapterId || 0}_${nodeNum}`;
    }

    function getAssignedStory(chapterId, nodeNum) {
        const key = getSlotKey(chapterId, nodeNum);
        if (mysteryState.deckModeSlots && mysteryState.deckModeSlots[key] === true) return null;
        return mysteryState.revealedStories[key] || mysteryState.revealedStories[nodeNum] || null;
    }

    function isRoadmapSlotInDeckMode(chapterId, nodeNum) {
        const key = getSlotKey(chapterId, nodeNum);
        if (mysteryState.deckModeSlots && mysteryState.deckModeSlots[key] === true) return true;
        if (mysteryState.deckModeSlots && mysteryState.deckModeSlots[key] === false) return false;
        return false;
    }

    function loadSavedState() {
        try {
            const parsed = JSON.parse(localStorage.getItem(STORAGE_KEY) || 'null');
            if (parsed && typeof parsed === 'object') {
                mysteryState = Object.assign({ activeNodeNum: 3, revealedStories: {}, deckModeSlots: {} }, parsed);
            }
        } catch (e) {}
    }

    function saveState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(mysteryState));
        } catch (e) {}
    }
    loadSavedState();

    function refreshAllRoadmapViews(chapterId = 0) {
        if (typeof window.selectRoadmapChapter === 'function') {
            window.selectRoadmapChapter(chapterId, { keepScroll: true });
        }
        renderMysteryRoadmapTimeline(chapterId);
    }

    function resetRoadmapSlotToDeck(nodeNum = 3, chapterId = 0) {
        const key = getSlotKey(chapterId, nodeNum);
        if (!mysteryState.deckModeSlots) mysteryState.deckModeSlots = {};
        mysteryState.deckModeSlots[key] = true;
        delete mysteryState.revealedStories[key];
        delete mysteryState.revealedStories[nodeNum];
        saveState();
        refreshAllRoadmapViews(chapterId);
        if (typeof showDictToast === 'function') {
            showDictToast(`❓ Đã gỡ ảnh truyện ở Chặng ${nodeNum} về lại ô vuông ?`);
        }
    }

    function ensureSheetMountedOnBody() {
        const sheet = document.getElementById('roadmapGenrePickerSheet');
        if (sheet && sheet.parentElement !== document.body) document.body.appendChild(sheet);
        return sheet;
    }

    function bindMysteryScrollListener() {
        if (mysteryListenersBound) return;
        const scrollArea = document.getElementById('scrollAreaMysteryRoadmap');
        const topBar = document.getElementById('mysteryRoadmapTopBar');
        if (!scrollArea) return;
        mysteryListenersBound = true;
        scrollArea.addEventListener('scroll', () => {
            const y = scrollArea.scrollTop;
            const heroBox = document.getElementById('mysteryHeroContentBox');
            if (heroBox) {
                const fade = Math.max(0, Math.min(1, 1 - Math.max(0, y - 8) / 72));
                heroBox.style.opacity = String(fade);
                heroBox.style.pointerEvents = fade < 0.15 ? 'none' : 'auto';
                heroBox.style.transform = `translateY(${Math.min(12, Math.max(0, (y - 8) * 0.15)).toFixed(1)}px)`;
            }
            if (topBar) {
                if (y > 90) topBar.classList.add('is-scrolled');
                else if (y < 76) topBar.classList.remove('is-scrolled');
            }
        }, { passive: true });
    }

    function openMysteryRoadmap() {
        loadSavedState();
        const screen = document.getElementById('screenMysteryRoadmap');
        if (!screen) return;
        const classicScreen = document.getElementById('screenParchmentRoadmap');
        if (classicScreen && !classicScreen.classList.contains('hidden')) classicScreen.classList.add('hidden');
        bindMysteryScrollListener();
        renderMysteryAmbientRain();
        const chIdx = (typeof window.currentRoadmapChapterIdx === 'number') ? window.currentRoadmapChapterIdx : 0;
        refreshAllRoadmapViews(chIdx);
        screen.classList.remove('hidden');
        requestAnimationFrame(() => screen.classList.remove('translate-x-full'));
        const scrollArea = document.getElementById('scrollAreaMysteryRoadmap');
        const topBar = document.getElementById('mysteryRoadmapTopBar');
        const heroBox = document.getElementById('mysteryHeroContentBox');
        if (scrollArea) scrollArea.scrollTop = 0;
        if (topBar) topBar.classList.remove('is-scrolled');
        if (heroBox) { heroBox.style.opacity = '1'; heroBox.style.pointerEvents = 'auto'; heroBox.style.transform = 'translateY(0)'; }
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
    }

    function closeMysteryRoadmap() {
        const screen = document.getElementById('screenMysteryRoadmap');
        if (!screen) return;
        screen.classList.add('translate-x-full');
        setTimeout(() => {
            screen.classList.add('hidden');
            const topBar = document.getElementById('mysteryRoadmapTopBar');
            if (topBar) topBar.classList.remove('is-scrolled');
        }, 300);
    }

    function switchToClassicRoadmap() {
        const chIdx = (typeof window.currentRoadmapChapterIdx === 'number') ? window.currentRoadmapChapterIdx : 0;
        closeMysteryRoadmap();
        setTimeout(() => { if (typeof window.openParchmentRoadmap === 'function') window.openParchmentRoadmap(chIdx); }, 220);
    }

    function renderMysteryAmbientRain() {
        const container = document.getElementById('mysteryAmbientContainer');
        if (!container) return;
        container.innerHTML = Array.from({ length: 16 }, () => `<div class="ambient-rain-drop" style="left:${(Math.random() * 100).toFixed(1)}%; top:${(Math.random() * -80).toFixed(0)}px; animation-duration:${(0.85 + Math.random() * 0.65).toFixed(2)}s; animation-delay:${(Math.random() * 2).toFixed(2)}s;"></div>`).join('');
    }

    function renderMysteryRoadmapTimeline(chapterIdx) {
        const container = document.getElementById('mysteryRoadmapNodesContainer');
        if (!container) return;
        const idx = (typeof chapterIdx === 'number') ? chapterIdx : ((typeof window.currentRoadmapChapterIdx === 'number') ? window.currentRoadmapChapterIdx : 0);
        const chapter = (typeof window.roadmapChaptersData !== 'undefined' && window.roadmapChaptersData[idx]) ? window.roadmapChaptersData[idx] : { id: 0, nodes: [] };
        if (typeof window.buildRoadmapTimelineHtml === 'function') {
            container.innerHTML = window.buildRoadmapTimelineHtml(chapter, { animateIn: true });
            if (typeof window.applyRoadmapFillAnimations === 'function') {
                requestAnimationFrame(() => window.applyRoadmapFillAnimations(container));
            }
        }
    }

    function openRoadmapGenrePickerSheet(nodeNum = 3, chapterId = 0, source = 'classic') {
        currentPickingSlot = { chapterId, nodeNum, source };
        const sheet = ensureSheetMountedOnBody();
        if (!sheet) return;
        const badge = document.getElementById('pickerSheetNodeBadge');
        if (badge) badge.textContent = `Ô VUÔNG #${nodeNum}`;
        if (typeof window.renderMysteryGenreCardsList === 'function') window.renderMysteryGenreCardsList();
        sheet.classList.remove('hidden');
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
    }

    function closeRoadmapGenrePickerSheet() {
        const sheet = document.getElementById('roadmapGenrePickerSheet');
        if (sheet) sheet.classList.add('hidden');
    }

    function bindStoryToCurrentSlot(matchedStory) {
        if (!matchedStory) return;
        closeRoadmapGenrePickerSheet();
        const { chapterId, nodeNum } = currentPickingSlot;
        const key = getSlotKey(chapterId, nodeNum);
        if (!mysteryState.deckModeSlots) mysteryState.deckModeSlots = {};
        mysteryState.deckModeSlots[key] = false;
        mysteryState.revealedStories[key] = { story: matchedStory };
        mysteryState.revealedStories[nodeNum] = { story: matchedStory };
        window.__justRevealedSlot = key;
        setTimeout(() => { if (window.__justRevealedSlot === key) window.__justRevealedSlot = null; }, 1100);
        saveState();
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(4);
        refreshAllRoadmapViews(chapterId);
        if (typeof showDictToast === 'function') {
            showDictToast(`✨ Đã đặt truyện "${matchedStory.title}" đè lên ô ? Chặng ${nodeNum}!`);
        }
    }

    function handlePickStoryById(storyId) {
        const pool = (typeof window.getFullStoryPool === 'function') ? window.getFullStoryPool() : [];
        bindStoryToCurrentSlot(pool.find(s => String(s.id) === String(storyId)) || pool[0]);
    }

    function handleRandomStoryPick() {
        const list = (typeof window.getFilteredStories === 'function' && window.getFilteredStories().length > 0)
            ? window.getFilteredStories() : ((typeof window.getFullStoryPool === 'function') ? window.getFullStoryPool() : []);
        bindStoryToCurrentSlot(list[Math.floor(Math.random() * list.length)]);
    }

    function launchRevealedLesson(nodeNum = 3, chapterId = 0) {
        const assigned = getAssignedStory(chapterId, nodeNum);
        const chapter = (typeof window.roadmapChaptersData !== 'undefined' && window.roadmapChaptersData[chapterId || 0]) || { nodes: [] };
        const fallbackNode = (chapter.nodes || []).find(n => n.num === nodeNum);
        const isCompleted = fallbackNode && fallbackNode.status === 'completed';
        const story = (assigned && assigned.story) ? assigned.story : (isCompleted ? fallbackNode : null);
        if (!story) {
            openRoadmapGenrePickerSheet(nodeNum, chapterId, 'classic');
            return;
        }
        const lessonPayload = {
            chapterNumber: nodeNum, title: story.title, subtitle: story.subtitle || `Chặng ${nodeNum}`,
            category: `CHẶNG ${nodeNum} • ${story.age || 'TỰ CHỌN'}`, desc: story.scenario,
            image: story.img, thumbnail: story.img, duration: story.duration || '5 phút',
            progressPill: `Chặng ${nodeNum}/10`, progressPercent: nodeNum * 10
        };
        if (typeof window.openStoryReaderScreen === 'function') { window.openStoryReaderScreen(lessonPayload); return; }
        if (typeof window.openLessonIntroScreen === 'function') window.openLessonIntroScreen(chapterId, lessonPayload);
    }

    Object.assign(window, {
        getAssignedRoadmapStory: getAssignedStory, isRoadmapSlotInDeckMode, resetRoadmapSlotToDeck,
        renderMysteryRoadmapTimeline, openMysteryRoadmap, closeMysteryRoadmap, switchToClassicRoadmap,
        openRoadmapGenrePickerSheet, closeRoadmapGenrePickerSheet,
        handlePickStoryById, handleRandomStoryPick, handleSelectGenreAndReveal: handleRandomStoryPick, launchRevealedLesson
    });
})(window);
