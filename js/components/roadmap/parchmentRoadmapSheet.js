// -------------------------------------------------------------
// 📑 M3 CHAPTER PICKER BOTTOM SHEET CONTROLLER (OPTION 2)
// -------------------------------------------------------------
function openRoadmapChapterSheet() {
    renderRoadmapChapterSheetList();
    const sheet = document.getElementById('roadmapChapterSheet');
    const chevron = document.getElementById('roadmapDropdownChevron');
    if (!sheet) return;
    if (sheet.parentElement !== document.body) document.body.appendChild(sheet);

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
                        <span class="text-[10.5px] font-black uppercase tracking-wider text-[var(--rm-primary,#526600)] dark:text-[#B8D166]">Chương ${i + 1}</span>
                        ${statusBadge}
                    </div>
                    <h4 class="text-[15px] font-extrabold text-[var(--rm-on-surface,#1B1C17)] dark:text-[#E5E3DB] truncate">${ch.title}</h4>
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
    const doneCount = getRoadmapCompletedCount(ch);
    const totalCount = (ch.nodes || []).length || 10;
    const progChipText = `${doneCount}/${totalCount} chặng`;
    const progPct = Math.max(0, Math.min(100, Math.round((doneCount / totalCount) * 100)));

    // 1. Single-Row Dropdown Header & Floating Chapter Card Progress
    ['roadmapHeaderEyebrow', 'mysteryHeaderEyebrow'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = `CHƯƠNG ${idx + 1}`;
    });
    ['roadmapHeaderTitle', 'mysteryHeaderTitle'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = ch.title;
    });
    ['roadmapHeroProgressChip', 'mysteryHeroProgressChip'].forEach(id => {
        const el = document.getElementById(id);
        if (el) el.innerText = progChipText;
    });
    const progFillEl = document.getElementById('roadmapHeroProgressFill');
    if (progFillEl) progFillEl.style.width = `${progPct}%`;
    const progressEl = document.getElementById('roadmapProgressText');
    if (progressEl) progressEl.innerText = getRoadmapProgressLabel(ch);

    // 2. Tabs: giữ tương thích nếu cần
    for (let i = 0; i < roadmapChaptersData.length; i++) {
        const tab = document.getElementById(`roadmapTab-${i}`);
        if (!tab) continue;
        const lockedCls = isRoadmapChapterLocked(roadmapChaptersData[i]) ? ' is-locked' : '';
        if (i === idx) {
            tab.className = "roadmap-ch-tab active px-3.5 py-1.5 rounded-full text-xs font-black shrink-0 transition-all cursor-pointer tracking-wide" + lockedCls;
            tab.setAttribute && tab.setAttribute('aria-current', 'true');
        } else {
            tab.className = "roadmap-ch-tab px-3.5 py-1.5 rounded-full text-xs font-bold shrink-0 transition-all cursor-pointer tracking-wide" + lockedCls;
            tab.removeAttribute && tab.removeAttribute('aria-current');
        }
    }

    function formatHeroTagHtml(chObj, chIdx) {
        if (!chObj) return '';
        const chNum = (typeof chIdx === 'number') ? (chIdx + 1) : ((typeof chObj.id === 'number') ? chObj.id + 1 : 1);
        return `<span class="roadmap-tag-pill"><span class="roadmap-tag-sparkle">✦</span><span>CHƯƠNG ${chNum}</span></span>`;
    }

    // 3. Banner chương (Đồng bộ cả #roadmapHeroHeader và #mysteryRoadmapHeroHeader)
    const applyHeroSwap = (headerId, imgId, tagId, headingId, descId) => {
        const heroHeader = document.getElementById(headerId);
        const bannerImg = document.getElementById(imgId);
        const cardTag = document.getElementById(tagId);
        const chapterHeading = document.getElementById(headingId);
        const cardDesc = document.getElementById(descId);
        const finishSwap = () => {
            if (bannerImg) bannerImg.src = ch.image;
            if (cardTag) cardTag.innerHTML = formatHeroTagHtml(ch, idx);
            if (chapterHeading) chapterHeading.innerText = ch.title;
            if (cardDesc) cardDesc.innerText = ch.desc;
            if (heroHeader) requestAnimationFrame(() => setTimeout(() => heroHeader.classList.remove('is-switching'), 50));
        };
        if (switching && heroHeader && bannerImg) {
            heroHeader.classList.add('is-switching');
            const imgPreload = new Image();
            imgPreload.onload = finishSwap;
            imgPreload.onerror = finishSwap;
            imgPreload.src = ch.image;
        } else {
            finishSwap();
        }
    };
    applyHeroSwap('roadmapHeroHeader', 'roadmapBannerImg', 'roadmapCardTag', 'roadmapChapterHeading', 'roadmapCardDesc');
    applyHeroSwap('mysteryRoadmapHeroHeader', 'mysteryRoadmapBannerImg', 'mysteryRoadmapCardTag', 'mysteryRoadmapChapterHeading', 'mysteryRoadmapCardDesc');

    // 4. Cập nhật sheet nếu đang mở
    const sheet = document.getElementById('roadmapChapterSheet');
    if (sheet && !sheet.classList.contains('hidden')) {
        renderRoadmapChapterSheetList();
    }

    // 5. Timeline + thanh "Bài tiếp theo" trên cả 2 màn hình
    renderRoadmapNodes(ch, { animateIn: opts.animateIn || switching });
    renderRoadmapNextBar(ch);
    renderRoadmapAmbientEffects(idx);
    if (typeof window.renderMysteryRoadmapTimeline === 'function') {
        window.renderMysteryRoadmapTimeline(idx);
    }
    if (!opts.keepScroll) scrollRoadmapToActive(false);
}