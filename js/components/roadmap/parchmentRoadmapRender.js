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
    if ((node.type === 'chest' || node.type === 'boss') && !unlocked) {
        return `openRoadmapMilestonePreview('${node.type}', ${node.num}, ${chapter.id || 0})`;
    }
    const isDeckMode = (typeof window.isRoadmapSlotInDeckMode === 'function')
        && window.isRoadmapSlotInDeckMode(chapter.id || 0, node.num);
    const assigned = (typeof window.getAssignedRoadmapStory === 'function')
        ? window.getAssignedRoadmapStory(chapter.id || 0, node.num) : null;
    if (state === 'active' && node.type !== 'chest' && node.type !== 'boss' && isDeckMode) {
        return `openRoadmapGenrePickerSheet(${node.num}, ${chapter.id || 0}, 'classic')`;
    }
    if (assigned && assigned.story && unlocked) {
        return `launchRevealedLesson(${node.num}, ${chapter.id || 0})`;
    }
    return `handleParchmentNodeClick(${node.num}, '${roadmapJsArg(node.title)}', ${unlocked}, ${chapter.id})`;
}

// Render 1 thẻ đã hoàn thành dạng Grid Card gọn đẹp (dùng cho lưới 2 cột)
function renderCompletedGridCard(chapter, index) {
    const node = chapter.nodes[index];
    const onClick = getRoadmapNodeAction(chapter, index);
    const assigned = (typeof window.getAssignedRoadmapStory === 'function')
        ? window.getAssignedRoadmapStory(chapter.id || 0, node.num) : null;
    const customStory = assigned ? assigned.story : null;
    const displayTitle = customStory ? customStory.title : node.title;
    const displayImg = customStory ? customStory.img : node.img;
    const dMeta = (typeof window.resolveRoadmapDifficulty === 'function')
        ? window.resolveRoadmapDifficulty(node, customStory)
        : { short: 'Dễ', badgeCls: 'age-badge-3' };

    return `
        <div class="rm-done-card" data-node-num="${node.num}" role="button" tabindex="0" onclick="${onClick}">
            <div class="rm-done-thumb">
                <img src="${displayImg}" alt="" loading="lazy" decoding="async" />
                <span class="rm-done-check">✓</span>
            </div>
            <div class="rm-done-info">
                <div class="rm-done-top">
                    <span class="rm-done-step">Chặng ${node.num}</span>
                    <span class="rm-completed-stars" aria-label="3 sao">★★★</span>
                </div>
                <h4 class="rm-done-title">${displayTitle}</h4>
                <span class="age-badge ${dMeta.badgeCls} rm-done-diff">${dMeta.short}</span>
            </div>
        </div>`;
}

// Render thẻ bài học đơn lẻ (Đang học, Rương/Trùm, hoặc Ô tự chọn) — Không cột đường ray
function renderRoadmapLessonRow(chapter, index, flags, order) {
    const node = chapter.nodes[index];
    const state = resolveRoadmapNodeState(chapter, index);
    const type = node.type || 'star';
    const meta = roadmapNodeTypeMeta[type] || roadmapNodeTypeMeta.star;
    const onClick = getRoadmapNodeAction(chapter, index);
    const assigned = (typeof window.getAssignedRoadmapStory === 'function')
        ? window.getAssignedRoadmapStory(chapter.id || 0, node.num) : null;
    const customStory = assigned ? assigned.story : null;
    const isDeckMode = (typeof window.isRoadmapSlotInDeckMode === 'function')
        && window.isRoadmapSlotInDeckMode(chapter.id || 0, node.num);
    const isSpecial = (type === 'chest' || type === 'boss');

    const justDone = roadmapUiState.justCompletedNum === node.num ? 'is-just-done' : '';
    const justUnlocked = roadmapUiState.justUnlockedNum === node.num ? 'is-just-unlocked' : '';
    const displayTitle = customStory ? customStory.title : node.title;
    const displayImg = customStory ? customStory.img : node.img;
    const dMeta = (typeof window.resolveRoadmapDifficulty === 'function')
        ? window.resolveRoadmapDifficulty(node, customStory)
        : ((window.DIFFICULTY_META && customStory && window.DIFFICULTY_META[customStory.difficulty]) || { short: 'Vừa', badgeCls: 'age-badge-15' });
    const rawDuration = customStory ? customStory.duration : `${meta.minutes || 5}p`;
    const shortDur = String(rawDuration).replace(/\s*phút/i, 'p');

    if (state === 'completed') {
        return `<div class="rm-single-done-wrap" style="--i:${order}">${renderCompletedGridCard(chapter, index)}</div>`;
    }

    // Trạng thái Đang mở nhưng ở chế độ 3 lá bài úp (Deck Mode)
    if (state === 'active' && !isSpecial && isDeckMode) {
        return `
            <div class="mb-row mb-state-active mb-state-mystery ${justDone}" style="--i:${order}" data-roadmap-active="1">
                <div class="mb-card mb-card-mystery ${justUnlocked}" data-node-num="${node.num}" role="button" tabindex="0" onclick="openRoadmapGenrePickerSheet(${node.num}, ${chapter.id || 0}, 'classic')">
                    <div class="mystery-shimmer-sweep"></div>
                    <div class="mb-card-body relative z-10">
                        <div class="flex items-center gap-1.5"><span class="rm-active-step-pill">CHẶNG ${node.num} · ĐANG HỌC</span></div>
                        <h4 class="mb-card-title mb-hero-title">Rút câu chuyện của bạn</h4>
                        <div class="rm-hero-cta-row"><span class="mb-card-cta rm-deck-draw-btn">+ Chọn truyện ngay</span></div>
                    </div>
                    <div class="mb-thumb mb-thumb-mystery-fan relative z-10" aria-hidden="true">
                        <div class="mystery-fan-card fan-left"><span>🦊</span></div>
                        <div class="mystery-fan-card fan-right"><span>✈️</span></div>
                        <div class="mystery-fan-card fan-center"><span>✦</span></div>
                    </div>
                </div>
            </div>`;
    }

    // ② THẺ ĐANG HỌC — SPOTLIGHT BOOK STAGE (Bìa sách 3D lớn bên trái + Nội dung thoáng bên phải)
    if (state === 'active' && !isSpecial) {
        const flipCls = (window.__justRevealedSlot === `${chapter.id || 0}_${node.num}`) ? 'is-flip-reveal' : '';
        return `
            <div class="mb-row mb-state-active mb-type-${type} ${justDone}" style="--i:${order}" data-roadmap-active="1">
                <div class="mb-card mb-card-active-hero ${justUnlocked} ${flipCls}" data-node-num="${node.num}" role="button" tabindex="0" onclick="${onClick}">
                    <div class="mb-thumb mb-thumb-hero-book">
                        <div class="hero-book-cover"><img src="${displayImg}" alt="" loading="lazy" decoding="async" /><span class="hero-book-spine"></span></div>
                        <span class="hero-book-pages"></span>
                    </div>
                    <div class="mb-card-body">
                        <div class="flex items-center justify-between gap-1.5">
                            <div class="flex items-center gap-1.5">
                                <span class="rm-active-step-pill">CHẶNG ${node.num}</span>
                                <span class="age-badge ${dMeta.badgeCls}">${dMeta.short}</span>
                                <span class="mb-card-kicker text-[10.5px]">${shortDur}</span>
                            </div>
                            <div class="flex items-center gap-1">
                                <button type="button" onclick="event.stopPropagation(); if(typeof window.resetRoadmapSlotToDeck==='function') window.resetRoadmapSlotToDeck(${node.num}, ${chapter.id || 0});" class="rm-icon-chip is-deck" title="Úp lại bộ bài" aria-label="Úp bài">🃏</button>
                                <button type="button" onclick="event.stopPropagation(); openRoadmapGenrePickerSheet(${node.num}, ${chapter.id || 0}, 'classic')" class="rm-swap-pill-btn" title="Đổi câu chuyện khác">🎲 Đổi</button>
                            </div>
                        </div>
                        <h4 class="mb-card-title mb-hero-title">${displayTitle}</h4>
                        <div class="rm-hero-cta-row">
                            <span class="mb-card-cta rm-hero-play-btn">${ROADMAP_ICON_PLAY} Học ngay</span>
                            <span class="rm-hero-xp-hint">+20% ⚡</span>
                        </div>
                    </div>
                </div>
            </div>`;
    }

    // ④ RƯƠNG KHO BÁU & TRÙM CUỐI (Thẻ thưởng sang trọng)
    if (isSpecial) {
        const isBoss = type === 'boss';
        const badgeText = isBoss ? '👑 CHẶNG 10 · +300 XP' : `🎁 CHẶNG ${node.num} · +150 XP`;
        const milestoneTitle = isBoss ? 'Thử Thách Trùm Cuối' : 'Rương Kho Báu';
        const chestImg = isBoss ? 'assets/cards/lumi_progress_celebration.jpg' : 'assets/cards/reward_gift_box.jpg';
        return `
            <div class="mb-row mb-state-${state} mb-type-${type} ${justDone}" style="--i:${order}" ${state === 'active' ? 'data-roadmap-active="1"' : ''}>
                <div class="mb-card mb-card-milestone ${isBoss ? 'is-boss' : 'is-chest'} ${justUnlocked}" data-node-num="${node.num}" role="button" tabindex="0" onclick="${onClick}">
                    <div class="mb-thumb mb-thumb-milestone">
                        <img src="${chestImg}" alt="" loading="lazy" decoding="async" />
                        <span class="rm-milestone-emblem">${isBoss ? '👑' : '🎁'}</span>
                        <span class="rm-milestone-lock-pill">${state === 'locked' ? '🔒' : '✨'}</span>
                    </div>
                    <div class="mb-card-body">
                        <div class="flex items-center gap-1.5"><span class="rm-milestone-badge">${badgeText}</span></div>
                        <h4 class="mb-card-title">${milestoneTitle}</h4>
                    </div>
                    <span class="rm-milestone-arrow" aria-hidden="true">›</span>
                </div>
            </div>`;
    }

    // ③ CHẶNG TỰ CHỌN CHƯA MỞ (LẺ): Thẻ kính phẳng hiện đại (không viền nét đứt)
    const flavor = (typeof window.getRoadmapSlotFlavor === 'function')
        ? window.getRoadmapSlotFlavor(node.num)
        : { icon: '☕', cards: ['☕', '🌧️', '🌿'], diffShort: 'Dễ', badgeCls: 'age-badge-3', themeTag: 'Đời thường' };
    return `
        <div class="mb-row mb-state-locked" style="--i:${order}">
            <div class="mb-card mb-card-locked-slot" data-node-num="${node.num}" role="button" tabindex="0" onclick="${onClick}">
                <div class="rm-slot-inline-row">
                    <span class="rm-slot-step-pill">🔒 Chặng ${node.num}</span>
                    <span class="age-badge ${flavor.badgeCls}">${flavor.diffShort}</span>
                    <span class="rm-slot-inline-label">Chủ đề: ${flavor.themeTag}</span>
                </div>
                <div class="rm-slot-genre-stack" aria-hidden="true">
                    <span class="rm-genre-mini-card c1">${flavor.cards[0]}</span><span class="rm-genre-mini-card c2">${flavor.cards[1]}</span><span class="rm-genre-mini-card c3">${flavor.cards[2]}</span>
                </div>
            </div>
        </div>`;
}

// Render khay 4 Lá Bài Bí Ẩn (Chặng 6 -> 9) dạng Deck Grid phẳng sang trọng
function renderLockedSteppingStonesRow(chapter, lockedNodes, order) {
    const stonesHtml = lockedNodes.map((n, idx) => {
        const fl = (typeof window.getRoadmapSlotFlavor === 'function')
            ? window.getRoadmapSlotFlavor(n.num)
            : { icon: '✦', diffShort: 'Vừa', badgeCls: 'age-badge-15', themeTag: 'Tự chọn' };
        const act = `handleParchmentNodeClick(${n.num}, '${roadmapJsArg(n.title)}', false, ${chapter.id || 0})`;
        const conn = idx < lockedNodes.length - 1 ? '<span class="rm-stone-connector" aria-hidden="true"></span>' : '';
        return `
            <button type="button" class="rm-stone-node" onclick="${act}" title="Chặng ${n.num} · ${fl.themeTag} (${fl.diffShort})">
                <span class="rm-stone-step">🔒 ${n.num}</span>
                <span class="rm-stone-icon">${fl.icon}</span>
                <span class="rm-stone-tag">${fl.themeTag}</span>
            </button>${conn}`;
    }).join('');

    return `
        <div class="mb-row mb-state-locked" style="--i:${order}">
            <div class="mb-card mb-card-stepping-stones" role="group" aria-label="Chặng ${lockedNodes[0].num} đến ${lockedNodes[lockedNodes.length - 1].num}">
                <div class="rm-stones-track">${stonesHtml}</div>
            </div>
        </div>`;
}

function getRoadmapCharacterLine(char, completed, started, justDone) {
    const remaining = ROADMAP_LESSONS_PER_LOOP - completed;
    if (completed >= ROADMAP_LESSONS_PER_LOOP) return char.quote || 'Cảm ơn bạn đã đánh thức 100% sắc màu cho mình!';
    if (justDone) return `Tuyệt! Mình vừa có thêm 20% màu. Còn ${remaining} chặng nữa thôi!`;
    if (started) return `Học xong ${remaining} bài nữa là Lumi sáng rực 100% và mở Rương +150 XP!`;
    return 'Mình đang đợi bạn đánh thức ở vòng này…';
}

// Render toàn bộ chương theo 1 Mạch Liền (One-Flow Story Stage — Chỉ 1 thẻ Lumi ở đầu, 2 cột thẻ đã học)
function renderRoadmapSection(chapter, loop, characters, orderStart) {
    const start = loop * ROADMAP_LESSONS_PER_LOOP, end = start + ROADMAP_LESSONS_PER_LOOP;
    const sectionNodes = chapter.nodes.slice(start, end);
    const completed = sectionNodes.filter(n => n.status === 'completed').length;
    const hasActive = sectionNodes.some((n, i) => resolveRoadmapNodeState(chapter, start + i) === 'active');
    const fillPct = Math.min(100, completed * 20), mastered = fillPct >= 100;
    const started = completed > 0 || hasActive;
    const isLastSection = end >= chapter.nodes.length;
    const fillKey = `${chapter.id}-${loop}`;
    const prevPct = roadmapUiState.lastFill[fillKey] ?? fillPct;
    const justDoneHere = sectionNodes.some(n => n.num === roadmapUiState.justCompletedNum);
    const titles = roadmapSectionTitles[chapter.id] || [];
    const sectionTitle = titles[loop] || `Phần ${loop + 1}`;
    const char = characters[loop] || characters[0];
    const segments = Array.from({ length: ROADMAP_LESSONS_PER_LOOP }, (_, i) => `<span class="${i < completed ? 'on' : ''} ${justDoneHere && i === completed - 1 ? 'pop' : ''}"></span>`).join('');
    const rewardIcon = loop === 0 ? '🎁' : '👑';
    const line = getRoadmapCharacterLine(char, completed, started, justDoneHere);
    const showLine = prevPct > 0 && prevPct < 100;
    const pctLabel = mastered ? '✨ 100%' : (started ? `⚡ ${fillPct}%` : '🔒 0%');

    let html = `<section class="mb-section" data-loop="${loop + 1}">`;

    // Chỉ hiện Thẻ Đồng Hành Lumi lớn ở Vòng đang học (hoặc Vòng 1); nếu Vòng 2 chưa mở chỉ hiện dải phân cách gọn
    if (started || loop === 0) {
        html += `
            <div class="mb-row mb-head-row" style="--i:${orderStart}">
                <div class="mb-head">
                    <div class="mb-head-text">
                        <span class="mb-head-eyebrow">ĐỒNG HÀNH CÙNG LUMI</span>
                        <h3 class="mb-head-title">${sectionTitle}</h3>
                        <div class="mb-segbar-row">
                            <div class="mb-segbar ${mastered ? 'is-mastered' : ''}" role="img" aria-label="Đã tô ${completed} trên ${ROADMAP_LESSONS_PER_LOOP}">${segments}</div>
                            <span class="mb-segbar-arrow" aria-hidden="true">→</span>
                            <span class="mb-segbar-chest ${mastered ? 'is-unlocked' : ''}">${rewardIcon}</span>
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
    } else {
        html += `
            <div class="rm-stage-divider" style="--i:${orderStart}">
                <span class="rm-stage-divider-line"></span>
                <span class="rm-stage-divider-pill">🔒 Chặng 6 – 10 · ${sectionTitle}</span>
                <span class="rm-stage-divider-line"></span>
            </div>`;
    }

    // Gom các bài đã học liên tiếp thành Lưới 2 Cột (2-Column Completed Grid)
    const completedIndices = [];
    const remainingIndices = [];
    sectionNodes.forEach((n, i) => {
        const gIdx = start + i;
        if (resolveRoadmapNodeState(chapter, gIdx) === 'completed' && n.type !== 'chest' && n.type !== 'boss') {
            completedIndices.push(gIdx);
        } else {
            remainingIndices.push({ node: n, gIdx, localIdx: i });
        }
    });

    if (completedIndices.length > 0) {
        html += `<div class="rm-done-grid" style="--i:${orderStart + 1}">${completedIndices.map(gIdx => renderCompletedGridCard(chapter, gIdx)).join('')}</div>`;
    }

    const nonSpecialLocked = !started && remainingIndices.length > 2
        && remainingIndices.slice(0, -1).every(item => resolveRoadmapNodeState(chapter, item.gIdx) === 'locked' && item.node.type !== 'chest' && item.node.type !== 'boss');

    if (nonSpecialLocked) {
        html += renderLockedSteppingStonesRow(chapter, remainingIndices.slice(0, -1).map(x => x.node), orderStart + 2);
        const lastItem = remainingIndices[remainingIndices.length - 1];
        html += renderRoadmapLessonRow(chapter, lastItem.gIdx, {}, orderStart + 3);
    } else {
        remainingIndices.forEach((item, idx) => {
            html += renderRoadmapLessonRow(chapter, item.gIdx, {}, orderStart + 2 + idx);
        });
    }
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
    let html = `<div class="mb-timeline rm-clean-stage ${opts.animateIn ? 'mb-animate-in' : ''} ${locked ? 'is-chapter-locked' : ''}">`;
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

// Ẩn thanh nổi NextBar dưới đáy để không bị lặp lại với Spotlight Hero Card ở giữa màn hình
function renderRoadmapNextBar() {
    const bar = document.getElementById('roadmapNextBar');
    if (bar) bar.classList.remove('is-visible');
}