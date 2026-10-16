// ========================================================
// 📚 10 BOOK COVER STYLES LIVE SWITCHER & COMPARISON MODAL
// Ceiling: < 350 lines | Lets user preview & pick 1 of 10 styles
// ========================================================

(function (window) {
    'use strict';

    const BOOK_STYLES_CATALOG = [
        { id: 1,  short: 'Kiểu 1',  name: 'Apple Books Clean',      desc: 'Bìa cứng phẳng tối giản chuẩn iOS, rãnh gáy xuyên sáng' },
        { id: 2,  short: 'Kiểu 2',  name: '3D Isometric Tilt',      desc: 'Sách dựng nghiêng 3D lộ xấp trang giấy kem bên phải' },
        { id: 3,  short: 'Kiểu 3',  name: 'Penguin Editorial',      desc: 'Bìa sách kèm dải băng giấy kem (Obi Band) in tên truyện' },
        { id: 4,  short: 'Kiểu 4',  name: 'Leather Grimoire',       desc: 'Sách cổ tích gáy bọc da nâu có gân nổi & khung viền vàng' },
        { id: 5,  short: 'Kiểu 5',  name: 'Spiral Field Journal',   desc: 'Sổ tay nhật ký đóng gáy lò xo kim loại bên trái' },
        { id: 6,  short: 'Kiểu 6',  name: 'Layered Book Stack',     desc: 'Chồng sách xếp lớp 3D nghiêng nhẹ phía sau bìa chính' },
        { id: 7,  short: 'Kiểu 7',  name: 'Light Novel & Ribbon',   desc: 'Sách Nhật Bản có tem dọc góc trên & ruy-băng đỏ đáy sách' },
        { id: 8,  short: 'Kiểu 8',  name: 'Lumi Arcane Tome',       desc: 'Sách phép thuật phát sáng viền trang giấy xanh lục bảo' },
        { id: 9,  short: 'Kiểu 9',  name: 'Gallery Dust-Jacket',    desc: 'Khung bìa giấy mỹ thuật kem lồng tranh (Tipped-in Plate)' },
        { id: 10, short: 'Kiểu 10', name: 'Cinema Numeral Folio',   desc: 'Poster tràn viền kèm số thứ tự 01-04 khổ lớn chạm rỗng' }
    ];

    const BOOKS_DATA = [
        { idx: 0, vol: 'TẬP 01', num: '01', jp: '第一巻', title: 'Mưa Dưới Mái Hiên', img: 'assets/cards/lumi_rain_coffee_eaves.jpg' },
        { idx: 1, vol: 'TẬP 02', num: '02', jp: '第二巻', title: 'Nhầm Chuyến Xe',    img: 'assets/cards/lumi_train_station_night.jpg' },
        { idx: 2, vol: 'TẬP 03', num: '03', jp: '第三巻', title: 'Thử Thách Âm Điệu', img: 'assets/cards/lumi_melody_arena.jpg' },
        { idx: 3, vol: 'TẬP 04', num: '04', jp: '第四巻', title: 'Đêm Hội Đom Đóm',   img: 'assets/cards/pixar_night_farm_scenery.jpg' }
    ];

    let activeBookStyle = Number(localStorage.getItem('vibe_book_style_id') || 2);

    function renderBookInnerHtml(b, styleId) {
        let extra = '';
        if (styleId === 3) {
            extra = `<div class="vibe-book-extra-band">
                <span style="font-size:8.5px;font-weight:900;letter-spacing:0.14em;color:#B45309;text-transform:uppercase;">${b.vol}</span>
                <div style="font-size:12px;font-weight:800;line-height:1.15;color:#181914;white-space:nowrap;overflow:hidden;text-overflow:ellipsis;">${b.title}</div>
            </div>`;
        } else if (styleId === 7) {
            extra = `<div class="vibe-book-extra-tag">${b.jp}</div>`;
        } else if (styleId === 9) {
            extra = `<div class="vibe-book-extra-caption">LUMI EDITION · ${b.vol}</div>`;
        } else if (styleId === 10) {
            extra = `<div class="vibe-book-extra-num">${b.num}</div>`;
        }
        return `
            <div class="vibe-book-spine"></div>
            <div class="vibe-book-pages-right"></div>
            <div class="vibe-book-foil-frame"></div>
            <div class="vibe-book-sheen"></div>
            ${extra}
            <img src="${b.img}" alt="${b.title}" class="w-full h-full object-cover relative z-10" loading="lazy">
        `;
    }

    function applyBookCoverStyle(styleId) {
        activeBookStyle = Number(styleId) || 1;
        try { localStorage.setItem('vibe_book_style_id', String(activeBookStyle)); } catch (_) {}

        const carousel = document.getElementById('storyCarouselContainer');
        if (carousel) {
            const wrapper = carousel.parentElement;
            if (wrapper) wrapper.setAttribute('data-book-style', String(activeBookStyle));
            BOOKS_DATA.forEach(b => {
                const card = document.getElementById(`storyCard-${b.idx}`);
                if (!card) return;
                const cover = card.querySelector('.vibe-book-cover');
                if (cover) cover.innerHTML = renderBookInnerHtml(b, activeBookStyle);
            });
        }

        document.querySelectorAll('.book-style-pill').forEach(btn => {
            const id = Number(btn.getAttribute('data-style-id'));
            btn.classList.toggle('is-active', id === activeBookStyle);
        });
    }

    function ensureSwitcherBar() {
        const carousel = document.getElementById('storyCarouselContainer');
        if (!carousel || !carousel.parentElement) return;
        const wrapper = carousel.parentElement;

        if (!document.getElementById('bookStyleSwitcherBar')) {
            const bar = document.createElement('div');
            bar.id = 'bookStyleSwitcherBar';
            bar.className = 'book-style-switcher-bar';
            bar.innerHTML = `
                <button type="button" class="book-style-grid-btn" onclick="openAllBookStylesModal()">
                    ✨ Xem cả 10 kiểu
                </button>
                ${BOOK_STYLES_CATALOG.map(s => `
                    <button type="button" class="book-style-pill ${s.id === activeBookStyle ? 'is-active' : ''}"
                            data-style-id="${s.id}" onclick="applyBookCoverStyle(${s.id})" title="${s.name} — ${s.desc}">
                        ${s.short}: ${s.name}
                    </button>
                `).join('')}
            `;
            wrapper.insertBefore(bar, carousel);
        }
        applyBookCoverStyle(activeBookStyle);
        if (window.location.search.indexOf('pickbook=1') !== -1) {
            setTimeout(openAllBookStylesModal, 250);
        }
    }

    function openAllBookStylesModal() {
        let modal = document.getElementById('allBookStylesComparisonModal');
        if (!modal) {
            modal = document.createElement('div');
            modal.id = 'allBookStylesComparisonModal';
            modal.style.cssText = 'position:fixed;inset:0;z-index:9999;background:rgba(10,12,8,0.88);backdrop-filter:blur(14px);display:flex;flex-direction:column;padding:18px 16px;overflow-y:auto;';
            document.body.appendChild(modal);
        }
        const sample = BOOKS_DATA[0];
        modal.innerHTML = `
            <div style="max-width:440px;width:100%;margin:0 auto;">
                <div style="display:flex;align-items:center;justify-content:space-between;margin-bottom:14px;">
                    <div>
                        <div style="font-size:10px;font-weight:800;letter-spacing:0.14em;color:#B8D166;text-transform:uppercase;">BỘ SƯU TẬP THIẾT KẾ</div>
                        <h3 style="margin:2px 0 0;font-size:20px;font-weight:800;color:#F2F1EA;">Chọn 1 trong 10 Kiểu Sách</h3>
                    </div>
                    <button type="button" onclick="document.getElementById('allBookStylesComparisonModal').remove()"
                            style="width:36px;height:36px;border-radius:999px;border:none;background:rgba(255,255,255,0.12);color:#fff;font-size:16px;cursor:pointer;">✕</button>
                </div>
                <div style="display:grid;grid-template-columns:repeat(2,1fr);gap:14px;padding-bottom:32px;">
                    ${BOOK_STYLES_CATALOG.map(s => `
                        <div data-book-style="${s.id}" onclick="applyBookCoverStyle(${s.id}); document.getElementById('allBookStylesComparisonModal').remove();"
                             style="background:#1B1E16;border:1.5px solid ${s.id === activeBookStyle ? '#B8D166' : 'rgba(255,255,255,0.08)'};border-radius:20px;padding:12px;cursor:pointer;display:flex;flex-direction:column;gap:10px;">
                            <div style="width:78%;margin:4px auto 0;">
                                <div class="vibe-book-cover">
                                    ${renderBookInnerHtml(sample, s.id)}
                                </div>
                            </div>
                            <div>
                                <div style="display:flex;align-items:center;justify-content:space-between;">
                                    <span style="font-size:10.5px;font-weight:800;color:#B8D166;">${s.short.toUpperCase()}</span>
                                    ${s.id === activeBookStyle ? '<span style="font-size:10px;font-weight:800;background:#B8D166;color:#182000;padding:1px 7px;border-radius:99px;">Đang chọn</span>' : ''}
                                </div>
                                <div style="font-size:13.5px;font-weight:800;color:#fff;margin-top:2px;">${s.name}</div>
                                <div style="font-size:11px;color:rgba(242,241,234,0.6);line-height:1.35;margin-top:2px;">${s.desc}</div>
                            </div>
                        </div>
                    `).join('')}
                </div>
            </div>
        `;
    }

    window.applyBookCoverStyle = applyBookCoverStyle;
    window.openAllBookStylesModal = openAllBookStylesModal;

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', ensureSwitcherBar);
    } else {
        ensureSwitcherBar();
    }
})(window);
