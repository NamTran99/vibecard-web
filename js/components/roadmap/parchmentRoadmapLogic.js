// ========================================================
// 🗺️ ROADMAP SCROLL, CAMERA GLIDE & INTERACTION LOGIC
// Ceiling: < 350 lines | Smooth 60fps Path Run-Down
// ========================================================

function animateRoadmapScrollTo(scrollArea, targetTop, duration = 860) {
    if (!scrollArea) return;
    if (scrollArea._glideRaf) cancelAnimationFrame(scrollArea._glideRaf);
    const startTop = scrollArea.scrollTop;
    const diff = targetTop - startTop;
    if (Math.abs(diff) < 4) {
        scrollArea.scrollTop = targetTop;
        return;
    }
    const startTime = performance.now();
    const easeOutCubic = (t) => 1 - Math.pow(1 - t, 3);
    const step = (now) => {
        const p = Math.min(1, (now - startTime) / duration);
        scrollArea.scrollTop = startTop + diff * easeOutCubic(p);
        if (p < 1) {
            scrollArea._glideRaf = requestAnimationFrame(step);
        } else {
            scrollArea._glideRaf = null;
        }
    };
    scrollArea._glideRaf = requestAnimationFrame(step);
}

// Cuộn mượt theo dòng chảy từ Chặng 1 xuống Bài đang học (Active Hero)
function scrollRoadmapToActive(smooth = true) {
    const scrollArea = document.getElementById('scrollAreaRoadmap');
    if (!scrollArea) return;
    const target = scrollArea.querySelector('[data-roadmap-active="1"]');
    let top = 0;
    if (target) {
        const delta = target.getBoundingClientRect().top - scrollArea.getBoundingClientRect().top;
        const currentAbsTop = scrollArea.scrollTop + delta;
        const cardHeight = target.offsetHeight || 96;
        const areaHeight = scrollArea.clientHeight || 580;
        if (currentAbsTop > 320) {
            top = Math.max(0, Math.round(currentAbsTop - (areaHeight * 0.54 - cardHeight * 0.35)));
        }
    }
    if (smooth) {
        animateRoadmapScrollTo(scrollArea, top, 880);
    } else if (typeof scrollArea.scrollTo === 'function') {
        scrollArea.scrollTo({ top, behavior: 'auto' });
    } else {
        scrollArea.scrollTop = top;
    }
}
window.scrollRoadmapToActive = scrollRoadmapToActive;

function playRoadmapPathRunDown(glideCamera = true) {
    const nodesContainer = document.getElementById('roadmapNodesContainer');
    const scrollArea = document.getElementById('scrollAreaRoadmap');
    if (nodesContainer) {
        const mapEl = nodesContainer.querySelector('.sq-roadmap-map') || nodesContainer;
        mapEl.classList.remove('is-running-down');
        void mapEl.offsetWidth;
        mapEl.classList.add('is-running-down');
        clearTimeout(nodesContainer._runDownTimer);
        nodesContainer._runDownTimer = setTimeout(() => mapEl.classList.remove('is-running-down'), 2400);
    }
    if (glideCamera && scrollArea) {
        scrollArea.scrollTop = 0;
        setTimeout(() => scrollRoadmapToActive(true), 220);
    }
}
window.playRoadmapPathRunDown = playRoadmapPathRunDown;

function scrollRoadmapToSection(loopNum) {
    const scrollArea = document.getElementById('scrollAreaRoadmap');
    if (!scrollArea) return;
    const section = scrollArea.querySelector(`.mb-section[data-loop="${loopNum}"]`);
    if (!section) return;
    const delta = section.getBoundingClientRect().top - scrollArea.getBoundingClientRect().top;
    animateRoadmapScrollTo(scrollArea, Math.max(0, scrollArea.scrollTop + delta - 16), 720);
}

function updateRoadmapTopBarOnScroll() {
    const scrollArea = document.getElementById('scrollAreaRoadmap');
    const screen = document.getElementById('screenParchmentRoadmap');
    const topBar = document.getElementById('roadmapTopBar');
    if (!scrollArea || !screen || !topBar) return;
    const y = scrollArea.scrollTop;
    if (y > 140) {
        screen.classList.add('mb-condensed');
        topBar.classList.add('is-scrolled');
    } else if (y < 120) {
        screen.classList.remove('mb-condensed');
        topBar.classList.remove('is-scrolled');
    }
}
window.updateRoadmapTopBarOnScroll = updateRoadmapTopBarOnScroll;

function bindRoadmapListeners() {
    if (roadmapUiState.listenersBound) return;
    const screen = document.getElementById('screenParchmentRoadmap');
    const scrollArea = document.getElementById('scrollAreaRoadmap');
    const nodesContainer = document.getElementById('roadmapNodesContainer');
    if (!screen || !scrollArea || !nodesContainer || typeof scrollArea.addEventListener !== 'function') return;
    roadmapUiState.listenersBound = true;

    let lastRoadmapScrollY = 0;
    scrollArea.addEventListener('scroll', () => {
        updateRoadmapTopBarOnScroll();
        const currentY = scrollArea.scrollTop;
        const dy = currentY - lastRoadmapScrollY;
        const nextBar = document.getElementById('roadmapNextBar');
        if (nextBar) {
            if (dy > 12 && currentY > 60) nextBar.classList.add('is-hidden-scroll');
            else if (dy < -12) nextBar.classList.remove('is-hidden-scroll');
        }
        lastRoadmapScrollY = currentY;
    }, { passive: true });
    updateRoadmapTopBarOnScroll();

    nodesContainer.addEventListener('keydown', (e) => {
        if (e.key !== 'Enter' && e.key !== ' ') return;
        const target = e.target.closest && e.target.closest('[role="button"]');
        if (!target) return;
        e.preventDefault();
        target.click();
    });

    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape') closeRoadmapCelebration();
    });
}

function showRoadmapCharacterBubble(el) {
    if (!el || !el.classList) return;
    clearTimeout(el._bubbleTimer);
    el.classList.remove('is-talking');
    void el.offsetWidth;
    el.classList.add('is-talking');
    el._bubbleTimer = setTimeout(() => el.classList.remove('is-talking'), 2800);
}

function handleCharacterTap(el) {
    if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
    showRoadmapCharacterBubble(el);
    if (el && typeof el.querySelectorAll === 'function') {
        clearTimeout(el._speedBoostTimer);
        el.querySelectorAll('svg *').forEach(node => {
            if (typeof node.getAnimations === 'function') {
                node.getAnimations().forEach(anim => { anim.playbackRate = 1.85; });
            }
        });
        el._speedBoostTimer = setTimeout(() => {
            el.querySelectorAll('svg *').forEach(node => {
                if (typeof node.getAnimations === 'function') {
                    node.getAnimations().forEach(anim => { anim.playbackRate = 1.0; });
                }
            });
        }, 2200);
    }
}

function getActiveRoadmapScreen() {
    const mys = document.getElementById('screenMysteryRoadmap');
    if (mys && !mys.classList.contains('hidden')) return mys;
    return document.getElementById('screenParchmentRoadmap') || document.body;
}

function showRoadmapCelebration(chapter, loop) {
    const screen = getActiveRoadmapScreen();
    if (!screen || typeof document.createElement !== 'function') return;
    const animChar = (typeof window.getRoadmapAnimatedCharacter === 'function')
        ? window.getRoadmapAnimatedCharacter(chapter.id || 0, loop) : null;
    const char = animChar || (chapter.characters || [])[loop] || { name: 'Bea · Lửa Trại', img: 'assets/create/lumi_fox.png' };

    closeRoadmapCelebration();
    const overlay = document.createElement('div');
    overlay.id = 'roadmapCelebration';
    overlay.className = 'mb-celebrate';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    const confetti = Array.from({ length: 14 }, (_, i) => `<span style="--c:${i}"></span>`).join('');
    const hasNextLoop = (loop + 1) * ROADMAP_LESSONS_PER_LOOP < chapter.nodes.length;
    const visualHtml = animChar
        ? `<div class="w-40 h-40 mx-auto relative flex items-center justify-center">${animChar.svg}</div>`
        : `<img class="mb-celebrate-img" src="${char.img}" alt="${char.name}" />`;

    overlay.innerHTML = `
        <div class="mb-celebrate-backdrop" onclick="closeRoadmapCelebration()"></div>
        <div class="mb-celebrate-card">
            <div class="mb-celebrate-confetti" aria-hidden="true">${confetti}</div>
            <div class="mb-celebrate-glow" aria-hidden="true"></div>
            ${visualHtml}
            <div class="mb-celebrate-badge my-2 text-3xl" aria-hidden="true">🏆 ✨</div>
            <span class="mb-celebrate-kicker">Vòng ${loop + 1} hoàn thành · +150 XP</span>
            <h3 class="mb-celebrate-title">${char.name} đã thức tỉnh 100%!</h3>
            <p class="mb-celebrate-quote">“${char.quote || 'Cảm ơn bạn đã đánh thức trọn vẹn sắc màu cho mình!'}”</p>
            <button type="button" class="mb-celebrate-btn" onclick="closeRoadmapCelebration(${hasNextLoop ? loop + 2 : 0})">
                ${hasNextLoop ? 'Sang vòng tiếp theo' : 'Tiếp tục hành trình'}
            </button>
        </div>`;
    screen.appendChild(overlay);
    roadmapRaf(() => overlay.classList.add('is-open'));
}

function openRoadmapMilestonePreview(type = 'chest', nodeNum = 5, chapterId = 0) {
    const screen = getActiveRoadmapScreen();
    if (!screen) return;
    closeRoadmapCelebration();
    const isBoss = type === 'boss';
    const img = isBoss ? 'assets/cards/lumi_progress_celebration.jpg' : 'assets/cards/reward_gift_box.jpg';
    const badge = isBoss ? '👑 TRÙM CUỐI CHƯƠNG · +300 XP' : '🎁 RƯƠNG KHO BÁU VÒNG 1 · +150 XP';
    const title = isBoss ? 'Thử Thách Trùm Cuối Chương' : 'Rương Kho Báu Thần Rừng Lumi';
    const desc = isBoss
        ? 'Hoàn thành Chặng 9 để mở khóa trận chiến ôn tập tổng hợp, đánh thức 100% Lumi Nhà Thám Hiểm và nhận +300 XP!'
        : 'Hoàn thành đủ các bài trong Vòng 1 để Lumi sáng rực 100% sắc màu và mở khóa Rương Kho Báu +150 XP!';

    const overlay = document.createElement('div');
    overlay.id = 'roadmapCelebration';
    overlay.className = 'mb-celebrate';
    overlay.setAttribute('role', 'dialog');
    overlay.innerHTML = `
        <div class="mb-celebrate-backdrop" onclick="closeRoadmapCelebration()"></div>
        <div class="mb-celebrate-card">
            <div class="mb-celebrate-glow" aria-hidden="true"></div>
            <img class="mb-celebrate-img rounded-2xl border-2 border-amber-400/60 shadow-lg" src="${img}" alt="" />
            <span class="rm-milestone-badge my-2">${badge}</span>
            <h3 class="mb-celebrate-title">${title}</h3>
            <p class="mb-celebrate-quote">${desc}</p>
            <div class="flex flex-col gap-2 w-full mt-2">
                <button type="button" class="mb-celebrate-btn" onclick="closeRoadmapCelebration(); if(typeof advanceRoadmapProgress==='function') advanceRoadmapProgress(${chapterId || 0});">
                    ⚡ Học nhanh +1 bài (+20% Lumi)
                </button>
                <button type="button" class="py-2 px-4 rounded-full text-xs font-bold text-[var(--rm-on-surface-variant)] hover:text-[var(--rm-on-surface)]" onclick="closeRoadmapCelebration()">
                    Đóng
                </button>
            </div>
        </div>`;
    screen.appendChild(overlay);
    roadmapRaf(() => overlay.classList.add('is-open'));
}
window.openRoadmapMilestonePreview = openRoadmapMilestonePreview;

function closeRoadmapCelebration(goToLoop = 0) {
    const overlay = typeof document.getElementById === 'function' && document.getElementById('roadmapCelebration');
    if (!overlay) return;
    overlay.classList.remove('is-open');
    setTimeout(() => overlay.remove && overlay.remove(), 260);
    if (goToLoop) setTimeout(() => scrollRoadmapToSection(goToLoop), 200);
}

function renderRoadmapNextBar(chapter) {
    const ch = chapter || (typeof roadmapChaptersData !== 'undefined' && roadmapChaptersData[currentRoadmapChapterIdx]) || (roadmapChaptersData && roadmapChaptersData[0]);
    if (!ch || !Array.isArray(ch.nodes)) return;
    const activeIdx = ch.nodes.findIndex((_, i) => resolveRoadmapNodeState(ch, i) === 'active');
    const activeNode = activeIdx >= 0 ? ch.nodes[activeIdx] : ch.nodes[0];
    if (!activeNode) return;

    const chId = ch.id || 0;
    const assigned = (typeof window.getAssignedRoadmapStory === 'function')
        ? window.getAssignedRoadmapStory(chId, activeNode.num) : null;
    const customStory = assigned ? assigned.story : null;
    const overlaid = hasRoadmapStoryOverlay(ch, activeNode, 'active');
    const title = overlaid ? (customStory ? customStory.title : activeNode.title) : `Chặng ${activeNode.num} · Chưa chọn truyện`;
    const sub = overlaid
        ? `Chặng ${activeNode.num} · ${(customStory && customStory.duration) || '4 phút'} · +20% Lumi`
        : 'Chạm để chọn câu chuyện đè lên ô ?';
    const thumbHtml = overlaid
        ? `<img src="${resolveCalmPastelNodeImg(activeNode, customStory)}" alt="" class="sq-dock-img" />`
        : `<div class="sq-dock-q">?</div>`;
    const ctaHtml = overlaid
        ? `<button type="button" class="sq-dock-cta" onclick="event.stopPropagation(); launchRevealedLesson(${activeNode.num}, ${chId})">Học ngay</button>`
        : `<button type="button" class="sq-dock-cta" onclick="event.stopPropagation(); openRoadmapGenrePickerSheet(${activeNode.num}, ${chId}, 'classic')">Chọn truyện</button>`;

    const dockMarkup = `
        <div class="sq-thumb-dock-inner" onclick="if(typeof playRoadmapPathRunDown==='function') playRoadmapPathRunDown(true); toggleRoadmapNodePopover(${activeNode.num}, ${chId}, event);">
            <div class="sq-dock-thumb">${thumbHtml}</div>
            <div class="sq-dock-info">
                <span class="sq-dock-title">${title}</span>
                <span class="sq-dock-sub">${sub}</span>
            </div>
            ${ctaHtml}
        </div>`;

    ['screenParchmentRoadmap', 'screenMysteryRoadmap'].forEach(screenId => {
        const screen = document.getElementById(screenId);
        if (!screen) return;
        let dock = screen.querySelector('.sq-thumb-dock');
        if (!dock) {
            dock = document.createElement('div');
            dock.className = 'sq-thumb-dock';
            screen.appendChild(dock);
        }
        dock.innerHTML = dockMarkup;
    });
}
window.renderRoadmapNextBar = renderRoadmapNextBar;
