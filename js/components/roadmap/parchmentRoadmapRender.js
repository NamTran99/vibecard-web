function roadmapJsArg(str) {
    return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

function roadmapAttr(str) {
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function resolveRoadmapNodeState(chapter, index) {
    const node = chapter.nodes[index];
    if (node.status === 'completed' || node.status === 'active' || node.status === 'locked') return node.status;
    const prev = chapter.nodes[index - 1];
    return prev && prev.status === 'completed' ? 'active' : 'locked';
}

function getRoadmapNodeAction(chapter, index) {
    const node = chapter.nodes[index];
    const state = resolveRoadmapNodeState(chapter, index);
    const unlocked = state !== 'locked';
    if (node.type === 'chest' && unlocked) return 'claimRoadmapBonusChest()';
    const assigned = (typeof window.getAssignedRoadmapStory === 'function')
        ? window.getAssignedRoadmapStory(chapter.id || 0, node.num) : null;
    if (state === 'active' && node.type !== 'chest' && node.type !== 'boss' && !assigned) {
        return `openRoadmapGenrePickerSheet(${node.num}, ${chapter.id || 0}, 'classic')`;
    }
    if (assigned && assigned.story && unlocked) {
        return `launchRevealedLesson(${node.num}, ${chapter.id || 0})`;
    }
    return `handleParchmentNodeClick(${node.num}, '${roadmapJsArg(node.title)}', ${unlocked}, ${chapter.id})`;
}

// Render 1 thẻ bài học kèm chấm trên đường ray (Đồng bộ 5 nâng cấp v4.0)
function renderRoadmapLessonRow(chapter, index, flags, order) {
    const node = chapter.nodes[index];
    const state = resolveRoadmapNodeState(chapter, index);
    const type = node.type || 'star';
    const meta = roadmapNodeTypeMeta[type] || roadmapNodeTypeMeta.star;
    const onClick = getRoadmapNodeAction(chapter, index);
    const assigned = (typeof window.getAssignedRoadmapStory === 'function')
        ? window.getAssignedRoadmapStory(chapter.id || 0, node.num) : null;
    const customStory = assigned ? assigned.story : null;
    const isSpecial = (type === 'chest' || type === 'boss');

    const railClasses = [
        flags.up ? 'mb-up' : '', flags.upOn ? 'mb-up-on' : '',
        flags.down ? 'mb-down' : '', flags.downOn ? 'mb-down-on' : '',
        flags.downLong ? 'mb-down-long' : ''
    ].filter(Boolean).join(' ');
    const justDone = roadmapUiState.justCompletedNum === node.num ? 'is-just-done' : '';
    const justUnlocked = roadmapUiState.justUnlockedNum === node.num ? 'is-just-unlocked' : '';
    const railUnlocking = roadmapUiState.justCompletedNum === node.num ? 'is-unlocking' : '';
    const pawsHtml = renderRailPawsHtml(flags.down, flags.downOn, state === 'active', flags.downLong);

    const displayTitle = customStory ? customStory.title : node.title;
    const displayImg = customStory ? customStory.img : node.img;
    const gMeta = (window.GENRE_META && customStory && window.GENRE_META[customStory.genre]) || null;
    const dMeta = (typeof window.resolveRoadmapDifficulty === 'function')
        ? window.resolveRoadmapDifficulty(node, customStory)
        : ((window.DIFFICULTY_META && customStory && window.DIFFICULTY_META[customStory.difficulty]) || { short: 'Độ khó: Vừa', badgeCls: 'age-badge-15' });
    const durationStr = customStory ? customStory.duration : `${meta.minutes || 5} phút`;

    if (state === 'completed') {
        return `
            <div class="mb-row ${railClasses} mb-state-completed mb-type-${type} ${justDone}" style="--i:${order}">
                <div class="mb-rail ${railUnlocking}" onclick="${onClick}" role="button" tabindex="-1"><span class="mb-dot">${ROADMAP_ICON_CHECK}</span>${pawsHtml}</div>
                <div class="mb-card mb-card-completed-strip ${justUnlocked}" data-node-num="${node.num}" role="button" tabindex="0" onclick="${onClick}">
                    <div class="mb-card-body">
                        <div class="flex items-center gap-1.5"><span class="age-badge ${dMeta.badgeCls}">${dMeta.short}</span><span class="rm-done-pill">✓ Đã học · ${durationStr}</span></div>
                        <h4 class="mb-card-title">${displayTitle}</h4>
                    </div>
                    <div class="mb-thumb mb-thumb-compact"><img src="${displayImg}" alt="" loading="lazy" decoding="async" /></div>
                </div>
            </div>`;
    }

    if (state === 'active' && !isSpecial && !customStory) {
        return `
            <div class="mb-row ${railClasses} mb-state-active mb-state-mystery ${justDone}" style="--i:${order}" data-roadmap-active="1">
                <div class="mb-rail ${railUnlocking}" onclick="${onClick}" role="button" tabindex="-1">
                    <span class="mb-dot mb-dot-lumi-token"><img src="assets/create/lumi_fox.png" alt="Lumi" class="mb-dot-lumi-avatar" /></span>${pawsHtml}
                </div>
                <div class="mb-card mb-card-mystery ${justUnlocked}" data-node-num="${node.num}" role="button" tabindex="0" onclick="${onClick}">
                    <div class="mystery-shimmer-sweep"></div>
                    <div class="mb-card-body relative z-10">
                        <div class="flex items-center gap-1.5"><span class="rm-active-step-pill">CHẶNG ${node.num} · ĐANG MỞ</span><span class="age-badge age-badge-15">TỰ CHỌN</span></div>
                        <h4 class="mb-card-title mb-hero-title">Rút câu chuyện của bạn</h4>
                        <div class="rm-hero-cta-row"><span class="mb-card-cta" style="background:#FBBF24; color:#1C1E17; font-weight:800;">🃏 Chọn câu chuyện</span><span class="rm-hero-xp-hint">+20% Lumi</span></div>
                    </div>
                    <div class="mb-thumb mb-thumb-mystery-fan relative z-10" aria-hidden="true">
                        <div class="mystery-fan-card fan-left"></div><div class="mystery-fan-card fan-right"></div><div class="mystery-fan-card fan-center"><span>✦</span></div>
                    </div>
                </div>
            </div>`;
    }

    if (state === 'active' && !isSpecial) {
        return `
            <div class="mb-row ${railClasses} mb-state-active mb-type-${type} ${justDone}" style="--i:${order}" data-roadmap-active="1">
                <div class="mb-rail ${railUnlocking}" onclick="${onClick}" role="button" tabindex="-1">
                    <span class="mb-dot mb-dot-lumi-token"><img src="assets/create/lumi_fox.png" alt="Lumi" class="mb-dot-lumi-avatar" /></span>${pawsHtml}
                </div>
                <div class="mb-card mb-card-active-hero ${justUnlocked}" data-node-num="${node.num}" role="button" tabindex="0" onclick="${onClick}">
                    <div class="mb-card-body">
                        <div class="flex items-center justify-between gap-1">
                            <div class="flex items-center gap-1.5"><span class="age-badge ${dMeta.badgeCls}">${dMeta.short}</span><span class="mb-card-kicker text-[10.5px]">${gMeta ? `${gMeta.name} · ${durationStr}` : durationStr}</span></div>
                            <button type="button" onclick="event.stopPropagation(); openRoadmapGenrePickerSheet(${node.num}, ${chapter.id || 0}, 'classic')" class="rm-swap-story-chip" title="Đổi câu chuyện khác">🎲 Đổi truyện</button>
                        </div>
                        <h4 class="mb-card-title mb-hero-title">${displayTitle}</h4>
                        <div class="rm-hero-cta-row"><span class="mb-card-cta rm-hero-play-btn">${ROADMAP_ICON_PLAY} Học ngay</span><span class="rm-hero-xp-hint">⚡ +20% Lumi</span></div>
                    </div>
                    <div class="mb-thumb mb-thumb-hero-book">
                        <div class="hero-book-cover"><img src="${displayImg}" alt="" loading="lazy" decoding="async" /><span class="hero-book-spine"></span></div>
                        <span class="hero-book-pages"></span>
                    </div>
                </div>
            </div>`;
    }

    if (isSpecial) {
        const isBoss = type === 'boss';
        const badgeText = isBoss ? '👑 TRÙM CUỐI · +300 XP' : `🎁 RƯƠNG BÁU · ${node.subtitle || '+150 XP'}`;
        const subHint = state === 'active'
            ? (isBoss ? 'Sẵn sàng khiêu chiến ngay!' : 'Chạm để mở rương thưởng!')
            : (isBoss ? `Hoàn thành Chặng ${node.num - 1} để khiêu chiến` : `Mở khóa khi hoàn thành Chặng ${node.num - 1}`);
        const dotInner = state === 'active' ? '<span class="mb-dot-lumi-token"><img src="assets/create/lumi_fox.png" alt="Lumi" class="mb-dot-lumi-avatar" /></span>' : '';
        return `
            <div class="mb-row ${railClasses} mb-state-${state} mb-type-${type} ${justDone}" style="--i:${order}" ${state === 'active' ? 'data-roadmap-active="1"' : ''}>
                <div class="mb-rail ${railUnlocking}" onclick="${onClick}" role="button" tabindex="-1"><span class="mb-dot">${dotInner}</span>${pawsHtml}</div>
                <div class="mb-card mb-card-milestone ${isBoss ? 'is-boss' : 'is-chest'} ${justUnlocked}" data-node-num="${node.num}" role="button" tabindex="0" onclick="${onClick}" ${state === 'locked' ? 'aria-disabled="true"' : ''}>
                    <div class="mb-card-body">
                        <div class="flex items-center gap-1.5"><span class="rm-milestone-badge">${badgeText}</span></div>
                        <h4 class="mb-card-title">${displayTitle}</h4><span class="rm-milestone-sub">${subHint}</span>
                    </div>
                    <div class="mb-thumb mb-thumb-milestone">
                        <img src="${displayImg}" alt="" loading="lazy" decoding="async" />
                        ${state === 'locked' ? '<span class="rm-milestone-lock-pill">🔒</span>' : '<span class="rm-milestone-lock-pill is-open">✨</span>'}
                    </div>
                </div>
            </div>`;
    }

    return `
        <div class="mb-row ${railClasses} mb-state-locked" style="--i:${order}">
            <div class="mb-rail" onclick="${onClick}" role="button" tabindex="-1"><span class="mb-dot"></span>${pawsHtml}</div>
            <div class="mb-card mb-card-locked-slot" data-node-num="${node.num}" role="button" tabindex="0" onclick="${onClick}" aria-disabled="true">
                <div class="mb-card-body">
                    <div class="flex items-center gap-1.5"><span class="rm-slot-step-badge">Chặng ${node.num}</span><span class="rm-slot-unlock-hint">Mở sau Chặng ${node.num - 1}</span></div>
                    <h4 class="mb-card-title rm-slot-title">Ô truyện tự chọn</h4>
                </div>
                <div class="rm-slot-genre-stack" aria-hidden="true">
                    <span class="rm-genre-mini-card c1">📖</span><span class="rm-genre-mini-card c2">✈️</span><span class="rm-genre-mini-card c3">🔒</span>
                </div>
            </div>
        </div>`;
}

function getRoadmapCharacterLine(char, completed, started, justDone) {
    const remaining = ROADMAP_LESSONS_PER_LOOP - completed;
    if (completed >= ROADMAP_LESSONS_PER_LOOP) return char.quote || 'Cảm ơn bạn đã đánh thức 100% sắc màu cho mình!';
    if (justDone) return `Tuyệt! Mình vừa có thêm 20% màu. Còn ${remaining} chặng nữa thôi!`;
    if (started) return `Hoàn thành thêm ${remaining} chặng nữa để đánh thức 100% sắc màu của mình nhé!`;
    return 'Mình đang đợi bạn đánh thức ở vòng này…';
}

function renderRoadmapSection(chapter, loop, characters, orderStart) {
    const start = loop * ROADMAP_LESSONS_PER_LOOP, end = start + ROADMAP_LESSONS_PER_LOOP;
    const sectionNodes = chapter.nodes.slice(start, end);
    const completed = sectionNodes.filter(n => n.status === 'completed').length;
    const hasActive = sectionNodes.some((n, i) => resolveRoadmapNodeState(chapter, start + i) === 'active');
    const fillPct = Math.min(100, completed * 20), mastered = fillPct >= 100;
    const started = completed > 0 || hasActive;
    const isFirstSection = loop === 0, isLastSection = end >= chapter.nodes.length;
    const fillKey = `${chapter.id}-${loop}`;
    const prevPct = roadmapUiState.lastFill[fillKey] ?? fillPct;
    const justDoneHere = sectionNodes.some(n => n.num === roadmapUiState.justCompletedNum);
    const titles = roadmapSectionTitles[chapter.id] || [];
    const sectionTitle = titles[loop] || `Vòng ${loop + 1}`;
    const char = characters[loop] || characters[0];
    const prevSectionDone = !isFirstSection && chapter.nodes[start - 1] && chapter.nodes[start - 1].status === 'completed';
    const nodeIcon = mastered ? ROADMAP_ICON_CHECK : (started ? ROADMAP_ICON_SPARKLE : ROADMAP_ICON_LOCK);
    const segments = Array.from({ length: ROADMAP_LESSONS_PER_LOOP }, (_, i) => `<span class="${i < completed ? 'on' : ''} ${justDoneHere && i === completed - 1 ? 'pop' : ''}"></span>`).join('');

    const headClasses = [!isFirstSection ? 'mb-up' : '', prevSectionDone ? 'mb-up-on' : '', 'mb-down', started ? 'mb-down-on' : ''].join(' ');
    const line = getRoadmapCharacterLine(char, completed, started, justDoneHere);
    const showLine = prevPct > 0 && prevPct < 100;
    const headPawsHtml = renderRailPawsHtml(true, started, false, false);
    const pctLabel = mastered ? '✨ 100% Thức tỉnh' : (started ? `⚡ ${fillPct}% Đánh thức` : '🔒 0% Đánh thức');

    let html = `
        <section class="mb-section" data-loop="${loop + 1}">
            <div class="mb-row mb-head-row ${headClasses}" style="--i:${orderStart}">
                <div class="mb-rail"><span class="mb-section-node ${started ? '' : 'is-locked'}">${nodeIcon}</span>${headPawsHtml}</div>
                <div class="mb-head">
                    <div class="mb-head-text">
                        <span class="mb-head-eyebrow">Vòng ${loop + 1} · ${char.name}</span>
                        <h3 class="mb-head-title">${sectionTitle}</h3>
                        <div class="mb-segbar-row">
                            <div class="mb-segbar ${mastered ? 'is-mastered' : ''}" role="img" aria-label="Đã tô ${completed} trên ${ROADMAP_LESSONS_PER_LOOP}">${segments}</div>
                            <span class="mb-segbar-count">${completed}/${ROADMAP_LESSONS_PER_LOOP}</span>
                        </div>
                    </div>
                    <div class="mb-char ${mastered ? 'is-mastered' : ''} ${started ? '' : 'is-waiting'}"
                         role="button" tabindex="0" data-fill-key="${fillKey}" data-fill-target="${fillPct}" data-just-done="${justDoneHere ? 1 : 0}"
                         onclick="handleCharacterTap(this)">
                        <div class="mb-char-bubble" role="status">${line}</div>
                        <div class="mb-char-shadow"></div>
                        <img class="mb-char-gray" src="${char.img}" alt="" />
                        <img class="mb-char-color" src="${char.img}" alt="" style="clip-path: inset(${100 - prevPct}% 0 0 0);" />
                        <div class="mb-char-line" style="bottom: calc(${prevPct}% - 1px); opacity: ${showLine ? 1 : 0};"></div>
                        <span class="mb-char-pct-pill ${mastered ? 'is-mastered' : ''}">${pctLabel}</span>
                    </div>
                </div>
            </div>`;

    sectionNodes.forEach((node, i) => {
        const globalIdx = start + i, isLastInSection = i === sectionNodes.length - 1;
        const prevCompleted = chapter.nodes[globalIdx - 1] && chapter.nodes[globalIdx - 1].status === 'completed';
        html += renderRoadmapLessonRow(chapter, globalIdx, {
            up: true, upOn: i === 0 ? started : prevCompleted,
            down: !(isLastInSection && isLastSection), downOn: node.status === 'completed',
            downLong: isLastInSection && !isLastSection
        }, orderStart + 1 + i);
    });
    return html + '</section>';
}

function renderRoadmapLockedNotice(chapter) {
    const prev = roadmapChaptersData[chapter.id - 1];
    const prevName = prev ? prev.title : 'chương trước';
    const backBtn = prev ? `<button type="button" class="mb-locked-btn" onclick="selectRoadmapChapter(${prev.id})">Về chương trước</button>` : '';
    return `<div class="mb-locked-notice" style="--i:0"><span class="mb-locked-icon" aria-hidden="true">${ROADMAP_ICON_LOCK}</span><div class="mb-locked-text"><strong>Chương đang khóa</strong><span>Hoàn thành "${prevName}" để mở.</span></div>${backBtn}</div>`;
}

function renderRoadmapNodes(chapter, opts = {}) {
    const nodesContainer = document.getElementById('roadmapNodesContainer');
    if (!nodesContainer) return;
    const rawCharacters = chapter.characters || [
        { name: 'Thần Rừng Lumi', img: 'assets/create/lumi_fox.png' },
        { name: 'Lumi Nhà Thám Hiểm', img: 'assets/library/lumi_reading_fox.webp' }
    ];
    const characters = rawCharacters.map((c, idx) => {
        const isLegacyImg = !c.img || c.img.includes('lumi_avatar_portrait_clean') || c.img.includes('billy_possum_crop_test');
        return Object.assign({}, c, {
            name: (c.name === 'Billy Possum') ? 'Lumi Nhà Thám Hiểm' : (c.name || 'Thần Rừng Lumi'),
            img: isLegacyImg ? (idx % 2 === 0 ? 'assets/create/lumi_fox.png' : 'assets/library/lumi_reading_fox.webp') : c.img
        });
    });

    const locked = isRoadmapChapterLocked(chapter);
    const loops = Math.ceil(chapter.nodes.length / ROADMAP_LESSONS_PER_LOOP);
    let html = `<div class="mb-timeline ${opts.animateIn ? 'mb-animate-in' : ''} ${locked ? 'is-chapter-locked' : ''}">`;
    if (locked) html += renderRoadmapLockedNotice(chapter);
    for (let loop = 0; loop < loops; loop++) {
        html += renderRoadmapSection(chapter, loop, characters, 1 + loop * (ROADMAP_LESSONS_PER_LOOP + 1));
    }
    nodesContainer.innerHTML = html + '</div>';
    roadmapRaf(() => roadmapRaf(() => applyRoadmapFillAnimations(nodesContainer)));
}

function applyRoadmapFillAnimations(root) {
    if (!root || typeof root.querySelectorAll !== 'function') return;
    root.querySelectorAll('.mb-char[data-fill-key]').forEach((el) => {
        const key = el.getAttribute('data-fill-key');
        const target = Number(el.getAttribute('data-fill-target')) || 0;
        const color = el.querySelector('.mb-char-color'), lineEl = el.querySelector('.mb-char-line');
        if (color) color.style.clipPath = `inset(${100 - target}% 0 0 0)`;
        if (lineEl) {
            lineEl.style.bottom = `calc(${target}% - 1px)`;
            lineEl.style.opacity = target > 0 && target < 100 ? '1' : '0';
        }
        roadmapUiState.lastFill[key] = target;
        if (el.getAttribute('data-just-done') === '1') setTimeout(() => showRoadmapCharacterBubble(el), 650);
    });
}

function renderRoadmapNextBar(chapter) {
    const screen = document.getElementById('screenParchmentRoadmap');
    if (!screen || typeof document.createElement !== 'function') return;
    let bar = document.getElementById('roadmapNextBar');
    if (!bar) {
        bar = document.createElement('div');
        bar.id = 'roadmapNextBar';
        bar.className = 'mb-nextbar';
        screen.appendChild(bar);
    }
    if (isRoadmapChapterLocked(chapter)) { bar.classList.remove('is-visible'); return; }

    const activeIdx = getRoadmapActiveIndex(chapter);
    if (activeIdx < 0) {
        const next = roadmapChaptersData[chapter.id + 1];
        bar.innerHTML = `<button type="button" class="mb-nextbar-inner is-done" ${next ? `onclick="selectRoadmapChapter(${next.id})"` : ''}><span class="mb-nextbar-emoji" aria-hidden="true">🎉</span><span class="mb-nextbar-text"><span class="mb-nextbar-kicker">Hoàn thành chương</span><span class="mb-nextbar-title">${next ? `Sang: ${next.title}` : 'Đã đi hết hành trình!'}</span></span></button>`;
        bar.classList.add('is-visible');
        return;
    }

    const node = chapter.nodes[activeIdx];
    const isSpecial = (node.type === 'chest' || node.type === 'boss');
    const assigned = (typeof window.getAssignedRoadmapStory === 'function') ? window.getAssignedRoadmapStory(chapter.id || 0, node.num) : null;
    const customStory = assigned ? assigned.story : null;
    const actionCall = getRoadmapNodeAction(chapter, activeIdx);
    const barKicker = (!isSpecial && !customStory) ? `Chặng ${node.num} · Tự chọn` : `Chặng ${node.num} · Đang học`;
    const barTitle = (!isSpecial && !customStory) ? '🃏 Chọn câu chuyện học ngay' : (customStory ? customStory.title : node.title);
    const goIcon = (!isSpecial && !customStory) ? '+' : ROADMAP_ICON_PLAY;

    bar.innerHTML = `
        <div class="mb-nextbar-inner" onclick="${actionCall}">
            <button type="button" class="mb-nextbar-lumi-btn" onclick="event.stopPropagation(); if(typeof openAITutorChat === 'function') openAITutorChat(); else if(typeof showDictToast === 'function') showDictToast('💬 Trợ lý Lumi sẵn sàng đồng hành cùng bạn!');" title="Trợ lý Lumi">
                <img src="assets/create/lumi_fox.png" alt="Lumi" class="mb-nextbar-lumi-img" /><span class="mb-nextbar-lumi-badge">✨</span>
            </button>
            <div class="mb-nextbar-text"><span class="mb-nextbar-kicker">${barKicker}</span><span class="mb-nextbar-title">${barTitle}</span></div>
            <button type="button" class="mb-nextbar-go" aria-label="Học tiếp" onclick="event.stopPropagation(); ${actionCall}">${goIcon}</button>
        </div>`;
    bar.classList.add('is-visible');
}