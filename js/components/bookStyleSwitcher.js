// ========================================================
// 📚 BESPOKE 3D ISOMETRIC HARDCOVER & LAYERED PAGE STACK
// Ceiling: < 350 lines | Finalized Book Cover Initializer
// ========================================================

(function (window) {
    'use strict';

    const BOOKS_DATA = [
        { idx: 0, title: 'Mưa Dưới Mái Hiên', img: 'assets/cards/lumi_rain_coffee_eaves.jpg' },
        { idx: 1, title: 'Nhầm Chuyến Xe',    img: 'assets/cards/lumi_train_station_night.jpg' },
        { idx: 2, title: 'Thử Thách Âm Điệu', img: 'assets/cards/lumi_melody_arena.jpg' },
        { idx: 3, title: 'Đêm Hội Đom Đóm',   img: 'assets/cards/pixar_night_farm_scenery.jpg' }
    ];

    function initBespoke3DBooks() {
        const oldModal = document.getElementById('allBookStylesComparisonModal');
        if (oldModal) oldModal.remove();
        const oldBar = document.getElementById('bookStyleSwitcherBar');
        if (oldBar) oldBar.remove();

        BOOKS_DATA.forEach(b => {
            const card = document.getElementById(`storyCard-${b.idx}`);
            if (!card) return;
            const cover = card.querySelector('.vibe-book-cover');
            if (!cover) return;
            cover.style.setProperty('--book-bg', `url('${b.img}')`);
            if (!cover.querySelector('.stack-layer-1')) {
                cover.innerHTML = `
                    <div class="stack-layer-2"></div>
                    <div class="stack-layer-1"></div>
                    <div class="vibe-book-spine"></div>
                    <div class="vibe-book-foil-frame"></div>
                    <div class="vibe-book-sheen"></div>
                    <img src="${b.img}" alt="${b.title}" class="w-full h-full object-cover relative z-10" loading="lazy">
                `;
            }
        });
    }

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initBespoke3DBooks);
    } else {
        initBespoke3DBooks();
    }
})(window);
