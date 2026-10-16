
// Cuộn tới bài đang học (nếu ở Vòng 1 thì giữ ở đỉnh trang để không cắt đôi Hero Banner)
function scrollRoadmapToActive(smooth = true) {
    const scrollArea = document.getElementById('scrollAreaRoadmap');
    if (!scrollArea || typeof scrollArea.scrollTo !== 'function') return;
    const target = scrollArea.querySelector('[data-roadmap-active="1"]');
    let top = 0;
    if (target) {
        const delta = target.getBoundingClientRect().top - scrollArea.getBoundingClientRect().top;
        const currentAbsTop = scrollArea.scrollTop + delta;
        if (currentAbsTop > 540) {
            const cardHeight = target.offsetHeight || 88;
            const areaHeight = scrollArea.clientHeight || 500;
            top = Math.max(0, currentAbsTop - (areaHeight / 2 - cardHeight / 2));
        }
    }
    scrollArea.scrollTo({ top, behavior: smooth ? 'smooth' : 'auto' });
}

function scrollRoadmapToSection(loopNum) {
    const scrollArea = document.getElementById('scrollAreaRoadmap');
    if (!scrollArea || typeof scrollArea.scrollTo !== 'function') return;
    const section = scrollArea.querySelector(`.mb-section[data-loop="${loopNum}"]`);
    if (!section) return;
    const delta = section.getBoundingClientRect().top - scrollArea.getBoundingClientRect().top;
    scrollArea.scrollTo({ top: Math.max(0, scrollArea.scrollTop + delta - 16), behavior: 'smooth' });
}

function updateRoadmapTopBarOnScroll() {
    const scrollArea = document.getElementById('scrollAreaRoadmap');
    const screen = document.getElementById('screenParchmentRoadmap');
    const topBar = document.getElementById('roadmapTopBar');
    if (!scrollArea || !screen || !topBar) return;
    const y = scrollArea.scrollTop;
    const heroBox = document.getElementById('roadmapHeroContentBox');
    if (heroBox) {
        const fade = Math.max(0, Math.min(1, 1 - Math.max(0, y - 8) / 72));
        heroBox.style.opacity = String(fade);
        heroBox.style.pointerEvents = fade < 0.15 ? 'none' : 'auto';
        heroBox.style.transform = `translateY(${Math.min(12, Math.max(0, (y - 8) * 0.15)).toFixed(1)}px)`;
    }
    if (y > 90) {
        screen.classList.add('mb-condensed');
        topBar.classList.add('is-scrolled');
    } else if (y < 76) {
        screen.classList.remove('mb-condensed');
        topBar.classList.remove('is-scrolled');
    }
}
window.updateRoadmapTopBarOnScroll = updateRoadmapTopBarOnScroll;

// Gắn listener 1 lần: header thu gọn khi cuộn + phím Enter/Space cho thẻ & nhân vật
function bindRoadmapListeners() {
    if (roadmapUiState.listenersBound) return;
    const screen = document.getElementById('screenParchmentRoadmap');
    const scrollArea = document.getElementById('scrollAreaRoadmap');
    const nodesContainer = document.getElementById('roadmapNodesContainer');
    if (!screen || !scrollArea || !nodesContainer || typeof scrollArea.addEventListener !== 'function') return;
    roadmapUiState.listenersBound = true;

    // Ngưỡng trễ (8px/56px) tránh header nhấp nháy + Smart Hide on Scroll cho thanh Tiếp theo
    let lastRoadmapScrollY = 0;
    scrollArea.addEventListener('scroll', () => {
        updateRoadmapTopBarOnScroll();
        const currentY = scrollArea.scrollTop;
        const dy = currentY - lastRoadmapScrollY;
        const nextBar = document.getElementById('roadmapNextBar');
        if (nextBar) {
            if (dy > 12 && currentY > 60) {
                nextBar.classList.add('is-hidden-scroll');
            } else if (dy < -12) {
                nextBar.classList.remove('is-hidden-scroll');
            }
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
    // Reflow để animation nảy chạy lại khi chạm liên tục
    void el.offsetWidth;
    el.classList.add('is-talking');
    el._bubbleTimer = setTimeout(() => el.classList.remove('is-talking'), 2800);
}

// Chạm nhân vật: nảy lên + bong bóng thoại theo tiến độ
function handleCharacterTap(el) {
    if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
        SoundEngine.play(1);
    }
    showRoadmapCharacterBubble(el);
}

// Màn ăn mừng khi 1 nhân vật được tô đủ 5/5
function getActiveRoadmapScreen() {
    const mys = document.getElementById('screenMysteryRoadmap');
    if (mys && !mys.classList.contains('hidden')) return mys;
    return document.getElementById('screenParchmentRoadmap') || document.body;
}

function showRoadmapCelebration(chapter, loop) {
    const screen = getActiveRoadmapScreen();
    if (!screen || typeof document.createElement !== 'function') return;
    const char = (chapter.characters || [])[loop] || { name: 'Thần Rừng Lumi', img: 'assets/create/lumi_fox.png' };

    closeRoadmapCelebration();
    const overlay = document.createElement('div');
    overlay.id = 'roadmapCelebration';
    overlay.className = 'mb-celebrate';
    overlay.setAttribute('role', 'dialog');
    overlay.setAttribute('aria-modal', 'true');

    const confetti = Array.from({ length: 14 }, (_, i) => `<span style="--c:${i}"></span>`).join('');
    const hasNextLoop = (loop + 1) * ROADMAP_LESSONS_PER_LOOP < chapter.nodes.length;

    overlay.innerHTML = `
        <div class="mb-celebrate-backdrop" onclick="closeRoadmapCelebration()"></div>
        <div class="mb-celebrate-card">
            <div class="mb-celebrate-confetti" aria-hidden="true">${confetti}</div>
            <div class="mb-celebrate-glow" aria-hidden="true"></div>
            <img class="mb-celebrate-img" src="${char.img}" alt="${char.name}" />
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
                <button type="button" class=" py-2 px-4 rounded-full text-xs font-bold text-[var(--rm-on-surface-variant)] hover:text-[var(--rm-on-surface)]" onclick="closeRoadmapCelebration()">
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

