
function roadmapJsArg(str) {
    return String(str).replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

function roadmapAttr(str) {
    return String(str).replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function resolveRoadmapNodeState(chapter, index) {
    const node = chapter.nodes[index];
    if (node.status === 'completed' || node.status === 'active' || node.status === 'locked') {
        return node.status;
    }
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

// Render 1 thẻ bài học kèm chấm trên đường ray (Hỗ trợ Create Your Own Roadmap)
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
    ].join(' ');
    const justDone = roadmapUiState.justCompletedNum === node.num ? 'is-just-done' : '';
    const justUnlocked = roadmapUiState.justUnlockedNum === node.num ? 'is-just-unlocked' : '';
    const railUnlocking = roadmapUiState.justCompletedNum === node.num ? 'is-unlocking' : '';
    const pawsHtml = renderRailPawsHtml(flags.down, flags.downOn, state === 'active', flags.downLong);

    if (state === 'active' && !isSpecial && !customStory) {
        return `
            <div class="mb-row ${railClasses} mb-state-active mb-state-mystery ${justDone}" style="--i:${order}" data-roadmap-active="1">
                <div class="mb-rail ${railUnlocking}" onclick="${onClick}" role="button" tabindex="-1">
                    <span class="mb-dot mb-dot-mystery">+</span>${pawsHtml}
                </div>
                <div class="mb-card mb-card-mystery ${justUnlocked}" data-node-num="${node.num}" role="button" tabindex="0" onclick="${onClick}">
                    <div class="mystery-shimmer-sweep"></div>
                    <div class="mb-card-body relative z-10">
                        <div class="flex items-center gap-1.5">
                            <span class="age-badge age-badge-15">🎲 TỰ CHỌN</span>
                            <span class="mb-card-kicker font-black" style="color: var(--rm-amber-text, #D97706);">Chặng ${node.num}</span>
                        </div>
                        <h4 class="mb-card-title font-extrabold text-[15px] leading-tight">Chọn câu chuyện</h4>
                        <span class="mb-card-cta" style="background:#FBBF24; color:#1C1E17; font-weight:800;">+ Chọn truyện ✨</span>
                    </div>
                    <div class="mb-thumb mb-thumb-mystery relative z-10"><span class="mystery-qmark-icon">+</span></div>
                </div>
            </div>`;
    }

    if (state === 'locked' && !isSpecial) {
        return `
            <div class="mb-row ${railClasses} mb-state-locked" style="--i:${order}">
                <div class="mb-rail" onclick="${onClick}" role="button" tabindex="-1"><span class="mb-dot"></span>${pawsHtml}</div>
                <div class="mb-card" data-node-num="${node.num}" role="button" tabindex="0" onclick="${onClick}" aria-disabled="true">
                    <div class="mb-card-body">
                        <span class="mb-card-kicker">Chặng ${node.num}</span>
                        <h4 class="mb-card-title">Chặng tự chọn</h4>
                    </div>
                    <div class="mb-thumb mb-thumb-slot-locked"><span class="slot-locked-icon">🔒</span></div>
                </div>
            </div>`;
    }

    const displayTitle = customStory ? customStory.title : node.title;
    const displayImg = customStory ? customStory.img : node.img;
    const gMeta = (window.GENRE_META && customStory && window.GENRE_META[customStory.genre]) || null;
    const kicker = type === 'chest'
        ? `<span>🎁 ${node.subtitle || '+150 XP'}</span>`
        : type === 'boss'
            ? `<span>👑 ${meta.minutes} phút</span>`
            : customStory
                ? `<span class="age-badge age-badge-15">${customStory.age}</span><span>${gMeta ? `${gMeta.icon} ${gMeta.name}` : customStory.duration}</span>`
                : `<span>${meta.minutes} phút</span>`;

    const switchBtn = (state === 'active' && !isSpecial && customStory)
        ? `<button type="button" onclick="event.stopPropagation(); openRoadmapGenrePickerSheet(${node.num}, ${chapter.id || 0}, 'classic')" class="text-[10.5px] font-bold hover:underline" style="color: var(--rm-amber-text, #D97706);">Đổi ↺</button>`
        : '';

    const cta = state === 'active' && type !== 'chest'
        ? `<span class="mb-card-cta">Học ngay ${ROADMAP_ICON_PLAY}</span>`
        : state === 'active' ? '<span class="mb-card-cta">Nhận thưởng</span>' : '';

    const badge = state === 'locked' ? '<div class="mb-thumb-badge" aria-hidden="true">🔒</div>' : '';
    const crown = type === 'boss' ? '<span class="mb-crown" aria-hidden="true">👑</span>' : '';
    const dotInner = state === 'completed'
        ? ROADMAP_ICON_CHECK
        : state === 'active' ? '<span class="mb-active-lumi-companion" title="Lumi đang đồng hành cùng bạn!">🦊</span>' : '';

    return `
        <div class="mb-row ${railClasses} mb-state-${state} mb-type-${type} ${justDone}" style="--i:${order}" ${state === 'active' ? 'data-roadmap-active="1"' : ''}>
            <div class="mb-rail ${railUnlocking}" onclick="${onClick}" role="button" tabindex="-1"><span class="mb-dot">${dotInner}</span>${pawsHtml}</div>
            <div class="mb-card ${justUnlocked}" data-node-num="${node.num}" role="button" tabindex="0" onclick="${onClick}" ${state === 'locked' ? 'aria-disabled="true"' : ''}>
                <div class="mb-card-body">
                    <div class="flex items-center justify-between gap-1"><span class="mb-card-kicker">${kicker}</span>${switchBtn}</div>
                    <h4 class="mb-card-title">${displayTitle}</h4>${cta}
                </div>
                <div class="mb-thumb"><img src="${displayImg}" alt="" loading="lazy" decoding="async" />${badge}${crown}</div>
            </div>
        </div>`;
}

function getRoadmapCharacterLine(char, completed, started, justDone) {
    const remaining = ROADMAP_LESSONS_PER_LOOP - completed;
    if (completed >= ROADMAP_LESSONS_PER_LOOP) return char.quote || 'Cảm ơn bạn đã tô màu cho mình!';
    if (justDone) return `Tuyệt! Mình vừa có thêm 1/5 màu. Còn ${remaining} bài nữa thôi!`;
    if (started) return `Còn ${remaining} bài nữa là mình có màu đầy đủ!`;
    return 'Mình đang đợi bạn ở vòng này…';
}

function renderRoadmapSection(chapter, loop, characters, orderStart) {
    const start = loop * ROADMAP_LESSONS_PER_LOOP;
    const end = start + ROADMAP_LESSONS_PER_LOOP;
    const sectionNodes = chapter.nodes.slice(start, end);
    const completed = sectionNodes.filter(n => n.status === 'completed').length;
    const hasActive = sectionNodes.some((n, i) => resolveRoadmapNodeState(chapter, start + i) === 'active');
    const fillPct = Math.min(100, completed * 20);
    const mastered = fillPct >= 100;
    const started = completed > 0 || hasActive;
    const isFirstSection = loop === 0;
    const isLastSection = end >= chapter.nodes.length;
    const fillKey = `${chapter.id}-${loop}`;
    const prevPct = roadmapUiState.lastFill[fillKey] ?? 0;
    const justDoneHere = sectionNodes.some(n => n.num === roadmapUiState.justCompletedNum);
    const titles = roadmapSectionTitles[chapter.id] || [];
    const sectionTitle = titles[loop] || `Vòng ${loop + 1}`;
    const char = characters[loop] || characters[0];
    const prevSectionDone = !isFirstSection && chapter.nodes[start - 1] && chapter.nodes[start - 1].status === 'completed';
    const nodeIcon = mastered ? ROADMAP_ICON_CHECK : (started ? ROADMAP_ICON_SPARKLE : ROADMAP_ICON_LOCK);
    const segments = Array.from({ length: ROADMAP_LESSONS_PER_LOOP }, (_, i) => {
        const on = i < completed ? 'on' : '';
        const pop = justDoneHere && i === completed - 1 ? 'pop' : '';
        return `<span class="${on} ${pop}"></span>`;
    }).join('');

    const headClasses = [!isFirstSection ? 'mb-up' : '', prevSectionDone ? 'mb-up-on' : '', 'mb-down', started ? 'mb-down-on' : ''].join(' ');
    const line = getRoadmapCharacterLine(char, completed, started, justDoneHere);
    const showLine = prevPct > 0 && prevPct < 100;
    const headPawsHtml = renderRailPawsHtml(true, started, false, false);

    let html = `
        <section class="mb-section" data-loop="${loop + 1}">
            <div class="mb-row mb-head-row ${headClasses}" style="--i:${orderStart}">
                <div class="mb-rail"><span class="mb-section-node ${started ? '' : 'is-locked'}">${nodeIcon}</span>${headPawsHtml}</div>
                <div class="mb-head">
                    <div class="mb-head-text">
                        <span class="mb-head-eyebrow">Vòng ${loop + 1}</span>
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
                    </div>
                </div>
            </div>`;

    sectionNodes.forEach((node, i) => {
        const globalIdx = start + i;
        const isLastInSection = i === sectionNodes.length - 1;
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
    return `
        <div class="mb-locked-notice" style="--i:0">
            <span class="mb-locked-icon" aria-hidden="true">${ROADMAP_ICON_LOCK}</span>
            <div class="mb-locked-text"><strong>Chương đang khóa</strong><span>Hoàn thành "${prevName}" để mở.</span></div>
            ${backBtn}
        </div>`;
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
        const color = el.querySelector('.mb-char-color');
        const lineEl = el.querySelector('.mb-char-line');
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
    if (isRoadmapChapterLocked(chapter)) {
        bar.classList.remove('is-visible');
        const floatingLumi = document.getElementById('roadmapLumiFab');
        if (floatingLumi && floatingLumi.parentElement) floatingLumi.parentElement.classList.remove('hidden');
        return;
    }

    const activeIdx = getRoadmapActiveIndex(chapter);
    if (activeIdx < 0) {
        const next = roadmapChaptersData[chapter.id + 1];
        bar.innerHTML = `
            <button type="button" class="mb-nextbar-inner is-done" ${next ? `onclick="selectRoadmapChapter(${next.id})"` : ''}>
                <span class="mb-nextbar-emoji" aria-hidden="true">🎉</span>
                <span class="mb-nextbar-text">
                    <span class="mb-nextbar-kicker">Hoàn thành chương</span>
                    <span class="mb-nextbar-title">${next ? `Sang: ${next.title}` : 'Đã đi hết hành trình!'}</span>
                </span>
            </button>`;
        bar.classList.add('is-visible');
        return;
    }

    const node = chapter.nodes[activeIdx];
    const isSpecial = (node.type === 'chest' || node.type === 'boss');
    const assigned = (typeof window.getAssignedRoadmapStory === 'function')
        ? window.getAssignedRoadmapStory(chapter.id || 0, node.num) : null;
    const customStory = assigned ? assigned.story : null;
    const actionCall = getRoadmapNodeAction(chapter, activeIdx);
    const barKicker = (!isSpecial && !customStory) ? `Chặng ${node.num} · Tự chọn` : `Chặng ${node.num} · Tiếp theo`;
    const barTitle = (!isSpecial && !customStory) ? '+ Chọn truyện học ngay' : (customStory ? customStory.title : node.title);
    const goIcon = (!isSpecial && !customStory) ? '+' : ROADMAP_ICON_PLAY;

    bar.innerHTML = `
        <div class="mb-nextbar-inner" onclick="${actionCall}">
            <button type="button" class="mb-nextbar-lumi-btn" onclick="event.stopPropagation(); if(typeof openAITutorChat === 'function') openAITutorChat(); else if(typeof showDictToast === 'function') showDictToast('💬 Trợ lý Lumi sẵn sàng đồng hành cùng bạn!');" title="Trợ lý Lumi">
                <span class="mb-nextbar-lumi-avatar">🦊</span><span class="mb-nextbar-lumi-badge">2</span>
            </button>
            <div class="mb-nextbar-text">
                <span class="mb-nextbar-kicker">${barKicker}</span>
                <span class="mb-nextbar-title">${barTitle}</span>
            </div>
            <button type="button" class="mb-nextbar-go" aria-label="Học tiếp" onclick="event.stopPropagation(); ${actionCall}">${goIcon}</button>
        </div>`;
    bar.classList.add('is-visible');
    const floatingLumi = document.getElementById('roadmapLumiFab');
    if (floatingLumi && floatingLumi.parentElement) floatingLumi.parentElement.classList.add('hidden');
}