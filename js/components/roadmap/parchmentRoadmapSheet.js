// -------------------------------------------------------------
// 📑 M3 CHAPTER PICKER BOTTOM SHEET CONTROLLER (OPTION 2)
// -------------------------------------------------------------
function openRoadmapChapterSheet() {
    renderRoadmapChapterSheetList();
    const sheet = document.getElementById('roadmapChapterSheet');
    const chevron = document.getElementById('roadmapDropdownChevron');
    if (!sheet) return;

    sheet.classList.remove('hidden');
    void sheet.offsetWidth;
    sheet.classList.add('is-open');
    if (chevron) chevron.style.transform = 'rotate(180deg)';

    if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
        SoundEngine.play(1);
    }
}

function closeRoadmapChapterSheet() {
    const sheet = document.getElementById('roadmapChapterSheet');
    const chevron = document.getElementById('roadmapDropdownChevron');
    if (!sheet) return;

    sheet.classList.remove('is-open');
    if (chevron) chevron.style.transform = '';

    setTimeout(() => {
        sheet.classList.add('hidden');
    }, 260);
}

function renderRoadmapChapterSheetList() {
    const container = document.getElementById('roadmapChapterCardsList');
    if (!container) return;

    let html = '';
    roadmapChaptersData.forEach((ch, i) => {
        const isSelected = i === currentRoadmapChapterIdx;
        const locked = isRoadmapChapterLocked(ch);
        const done = getRoadmapCompletedCount(ch);
        const total = ch.nodes.length;
        const pct = Math.round((done / total) * 100);

        const cardCls = isSelected 
            ? 'mb-sheet-card is-selected' 
            : locked 
                ? 'mb-sheet-card is-locked' 
                : 'mb-sheet-card';

        const statusBadge = isSelected
            ? `<span class="px-2.5 py-0.5 rounded-full bg-[var(--rm-primary,#526600)] text-[var(--rm-on-primary,#FFFFFF)] text-[11px] font-black shrink-0">✓ Đang xem</span>`
            : locked
                ? `<span class="px-2.5 py-0.5 rounded-full bg-black/10 dark:bg-white/10 text-[var(--rm-on-surface-variant,#46483C)] dark:text-[#909283] text-[11px] font-bold shrink-0">🔒 Khóa</span>`
                : `<span class="px-2.5 py-0.5 rounded-full bg-[var(--rm-primary-container,#D4EE7F)] text-[var(--rm-on-primary-container,#161F00)] dark:text-[#D4EE7F] text-[11px] font-extrabold shrink-0">${done}/${total} bài</span>`;

        const progressBar = !locked
            ? `<div class="w-full h-1.5 rounded-full bg-black/10 dark:bg-white/10 overflow-hidden mt-2">
                   <div class="h-full bg-[var(--rm-primary,#526600)] dark:bg-[#B8D166] rounded-full transition-all duration-300" style="width: ${pct}%"></div>
               </div>`
            : `<span class="text-[11px] text-[var(--rm-on-surface-variant,#46483C)] dark:text-[#909283] block mt-1">Hoàn thành Chương ${i} để mở khóa</span>`;

        html += `
            <div class="${cardCls}" onclick="handleChapterSheetSelect(${i})">
                <div class="mb-sheet-thumb ${locked ? 'is-locked' : ''}">
                    <img src="${ch.image}" alt="${ch.title}" />
                    ${locked ? '<div class="mb-sheet-lock-icon">🔒</div>' : ''}
                </div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between gap-1 mb-0.5">
                        <span class="text-[10.5px] font-black uppercase tracking-wider text-[var(--rm-primary,#526600)] dark:text-[#B8D166]" style="font-family: 'Cinzel', serif;">Chương ${i + 1}</span>
                        ${statusBadge}
                    </div>
                    <h4 class="text-[15px] font-bold text-[var(--rm-on-surface,#1B1C17)] dark:text-[#E5E3DB] truncate" style="font-family: 'Playfair Display', serif;">${ch.title}</h4>
                    ${progressBar}
                </div>
            </div>
        `;
    });

    container.innerHTML = html;
}

function handleChapterSheetSelect(idx) {
    const ch = roadmapChaptersData[idx];
    if (isRoadmapChapterLocked(ch)) {
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
            SoundEngine.play(8);
        }
        if (typeof showDictToast === 'function') {
            showDictToast(`🔒 "${ch.title}" đang khóa! Hãy hoàn thành chương trước nhé.`);
        }
        return;
    }

    if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
        SoundEngine.play(1);
    }
    selectRoadmapChapter(idx);
    closeRoadmapChapterSheet();
}

function selectRoadmapChapter(idx, opts = {}) {
    if (idx < 0 || idx >= roadmapChaptersData.length) idx = 0;
    const switching = idx !== currentRoadmapChapterIdx;
    currentRoadmapChapterIdx = idx;
    const ch = roadmapChaptersData[idx];

    // 1. Single-Row Dropdown Header (Option 2)
    const eyebrowEl = document.getElementById('roadmapHeaderEyebrow');
    const titleEl = document.getElementById('roadmapHeaderTitle');
    const progressEl = document.getElementById('roadmapProgressText');
    if (eyebrowEl) eyebrowEl.innerText = `CHƯƠNG ${idx + 1}`;
    if (titleEl) titleEl.innerText = ch.title;
    if (progressEl) progressEl.innerText = getRoadmapProgressLabel(ch);

    // 2. Tabs: giữ tương thích nếu cần
    for (let i = 0; i < roadmapChaptersData.length; i++) {
        const tab = document.getElementById(`roadmapTab-${i}`);
        if (!tab) continue;
        const lockedCls = isRoadmapChapterLocked(roadmapChaptersData[i]) ? ' is-locked' : '';
        if (i === idx) {
            tab.className = "roadmap-ch-tab active px-3.5 py-1.5 rounded-full text-xs font-black shrink-0 transition-all cursor-pointer font-['Cinzel'] tracking-wide" + lockedCls;
            tab.setAttribute && tab.setAttribute('aria-current', 'true');
        } else {
            tab.className = "roadmap-ch-tab px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer font-['Cinzel'] tracking-wide" + lockedCls;
            tab.removeAttribute && tab.removeAttribute('aria-current');
        }
    }

    // Helper format tag chương sang dạng huy hiệu ngọc Fairytale
    function formatHeroTagHtml(chObj, chIdx) {
        if (!chObj) return '';
        const chNum = (typeof chIdx === 'number') ? (chIdx + 1) : ((typeof chObj.id === 'number') ? chObj.id + 1 : 1);
        return `
            <span class="roadmap-tag-pill">
                <span class="roadmap-tag-sparkle">✦</span>
                <span>CHƯƠNG ${chNum}</span>
            </span>
        `;
    }

    // 3. Banner chương (Hiệu ứng cross-fade mượt mà khi đổi chương)
    const heroHeader = document.getElementById('roadmapHeroHeader');
    const bannerImg = document.getElementById('roadmapBannerImg');
    const cardTag = document.getElementById('roadmapCardTag');
    const chapterHeading = document.getElementById('roadmapChapterHeading');
    const cardDesc = document.getElementById('roadmapCardDesc');

    if (switching && heroHeader && bannerImg) {
        heroHeader.classList.add('is-switching');
        const imgPreload = new Image();
        const finishSwap = () => {
            if (bannerImg) bannerImg.src = ch.image;
            if (cardTag) cardTag.innerHTML = formatHeroTagHtml(ch, idx);
            if (chapterHeading) chapterHeading.innerText = ch.title;
            if (cardDesc) cardDesc.innerText = ch.desc;
            requestAnimationFrame(() => {
                setTimeout(() => {
                    heroHeader.classList.remove('is-switching');
                }, 50);
            });
        };
        imgPreload.onload = finishSwap;
        imgPreload.onerror = finishSwap;
        imgPreload.src = ch.image;
    } else {
        if (bannerImg) bannerImg.src = ch.image;
        if (cardTag) cardTag.innerHTML = formatHeroTagHtml(ch, idx);
        if (chapterHeading) chapterHeading.innerText = ch.title;
        if (cardDesc) cardDesc.innerText = ch.desc;
    }

    // 4. Cập nhật sheet nếu đang mở
    const sheet = document.getElementById('roadmapChapterSheet');
    if (sheet && !sheet.classList.contains('hidden')) {
        renderRoadmapChapterSheetList();
    }

    // 5. Timeline + thanh "Bài tiếp theo"
    renderRoadmapNodes(ch, { animateIn: opts.animateIn || switching });
    renderRoadmapNextBar(ch);
    renderRoadmapAmbientEffects(idx);
    if (!opts.keepScroll) scrollRoadmapToActive(false);
}