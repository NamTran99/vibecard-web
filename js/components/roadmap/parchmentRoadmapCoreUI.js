// Nhãn tiến độ luôn tính từ dữ liệu để không lệch với nhân vật/thanh 5 đoạn
function getRoadmapProgressLabel(chapter) {
    if (isRoadmapChapterLocked(chapter)) return 'Khóa';
    const done = getRoadmapCompletedCount(chapter);
    const total = chapter.nodes.length;
    return `${done}/${total} bài`;
}

function getRoadmapActiveIndex(chapter) {
    return chapter.nodes.findIndex((_, i) => resolveRoadmapNodeState(chapter, i) === 'active');
}

// Mở giao diện Roadmap
function openParchmentRoadmap(chapterIdx = 0) {
    const screen = document.getElementById('screenParchmentRoadmap');
    if (!screen) return;

    bindRoadmapListeners();
    selectRoadmapChapter(chapterIdx, { animateIn: true });

    screen.classList.remove('hidden');
    roadmapRaf(() => {
        screen.classList.remove('translate-x-full');
    });

    if (typeof updateRoadmapTopBarOnScroll === 'function') {
        updateRoadmapTopBarOnScroll();
    }

    setTimeout(() => scrollRoadmapToActive(true), 280);
}

// Đóng giao diện Roadmap
function closeParchmentRoadmap() {
    const screen = document.getElementById('screenParchmentRoadmap');
    if (!screen) return;
    closeRoadmapCelebration();
    screen.classList.add('translate-x-full');
    setTimeout(() => {
        screen.classList.add('hidden');
        const topBar = document.getElementById('roadmapTopBar');
        if (topBar) topBar.classList.remove('is-scrolled');
        screen.classList.remove('mb-condensed');
    }, 320);
}

// Chọn chương

// -------------------------------------------------------------
// 🌌 HIỆU ỨNG KHÔNG KHÍ KHÔNG GIAN THEO 4 CHƯƠNG (AMBIENT FX)
// -------------------------------------------------------------
function renderRoadmapAmbientEffects(chapterIdx) {
    const container = document.getElementById('roadmapAmbientContainer');
    if (!container) return;

    // Cross-fade chuyển đổi hạt không khí mượt mà
    container.style.transition = 'opacity 0.25s ease';
    container.style.opacity = '0';

    setTimeout(() => {
        let html = '';
        if (chapterIdx === 0 || chapterIdx === 3) {
            // Chương I (Khu Rừng Ngụ Ngôn) & Chương IV: 16 hạt đom đóm vàng-lục bảo & bào tử nấm lam phát quang
            for (let i = 0; i < 16; i++) {
                const left = (6 + Math.random() * 88).toFixed(1);
                const top = (140 + Math.random() * 620).toFixed(0);
                const dur1 = (2.2 + Math.random() * 1.8).toFixed(2);
                const dur2 = (4.8 + Math.random() * 3.8).toFixed(2);
                const del = (Math.random() * 3).toFixed(2);
                const cls = (i % 3 === 0) ? 'ambient-firefly ambient-cyan-spore' : 'ambient-firefly';
                html += `<div class="${cls}" style="left:${left}%; top:${top}px; animation-duration:${dur1}s, ${dur2}s; animation-delay:${del}s;"></div>`;
            }
        } else if (chapterIdx === 1) {
            // Chương II: Hơi nước đầu máy & đốm sáng ga đêm (12 đốm sáng)
            for (let i = 0; i < 12; i++) {
                const left = (10 + Math.random() * 80).toFixed(1);
                const top = (120 + Math.random() * 600).toFixed(0);
                const dur = (3.2 + Math.random() * 2.8).toFixed(2);
                const del = (Math.random() * 2.5).toFixed(2);
                html += `<div class="ambient-steam-puff" style="left:${left}%; top:${top}px; animation-duration:${dur}s; animation-delay:${del}s;"></div>`;
            }
        } else if (chapterIdx === 2) {
            // Chương III: Nốt nhạc cực quang âm điệu (10 nốt nhạc bay lượn)
            const notes = ['🎵', '🎶', '♩', '♪', '✨'];
            for (let i = 0; i < 10; i++) {
                const note = notes[i % notes.length];
                const left = (8 + Math.random() * 84).toFixed(1);
                const top = (100 + Math.random() * 550).toFixed(0);
                const dur = (3 + Math.random() * 2.5).toFixed(2);
                const del = (Math.random() * 3).toFixed(2);
                html += `<div class="ambient-aurora-note" style="left:${left}%; top:${top}px; animation-duration:${dur}s; animation-delay:${del}s;">${note}</div>`;
            }
        } else if (chapterIdx === 3) {
            // Chương IV: Đom đóm chao lượn phát sáng (14 đốm phát quang)
            for (let i = 0; i < 14; i++) {
                const left = (6 + Math.random() * 88).toFixed(1);
                const top = (80 + Math.random() * 600).toFixed(0);
                const dur1 = (2.2 + Math.random() * 2).toFixed(2);
                const dur2 = (5 + Math.random() * 4).toFixed(2);
                const del = (Math.random() * 3).toFixed(2);
                html += `<div class="ambient-firefly" style="left:${left}%; top:${top}px; animation-duration:${dur1}s, ${dur2}s; animation-delay:${del}s;"></div>`;
            }
        }
        container.innerHTML = html;
        container.style.opacity = '1';
    }, 200);
}
