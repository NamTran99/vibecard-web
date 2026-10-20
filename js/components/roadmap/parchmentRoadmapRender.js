// ========================================================
// 🗺️ WINDING 3D SQUARE '?' STEPPING-STONE ROADMAP RENDERER
// Ceiling: < 350 lines | Zero Text-Line Collisions & 80/20 Hierarchy
// ========================================================

function roadmapJsArg(str) {
    return String(str || '').replace(/\\/g, '\\\\').replace(/'/g, "\\'").replace(/"/g, '&quot;');
}

function roadmapAttr(str) {
    return String(str || '').replace(/&/g, '&amp;').replace(/"/g, '&quot;').replace(/</g, '&lt;');
}

function resolveRoadmapNodeState(chapter, index) {
    const node = chapter.nodes[index];
    if (!node) return 'locked';
    if (node.status === 'completed' || node.status === 'active' || node.status === 'locked') return node.status;
    const prev = chapter.nodes[index - 1];
    return prev && prev.status === 'completed' ? 'active' : 'locked';
}

// Đường cong chữ S uốn lượn mở rộng bụng đường cong để đặt 2 nhân vật hoạt họa ở giữa 2 đường cong mỗi chặng
const WINDING_LOOP_X = [
    [44, 21, 16, 24, 44],
    [56, 79, 84, 76, 56]
];

function getNodeHorizontalPercent(loop, localIdx) {
    const curve = WINDING_LOOP_X[loop % 2] || WINDING_LOOP_X[0];
    return curve[localIdx] !== undefined ? curve[localIdx] : 50;
}

function hasRoadmapStoryOverlay(chapter, node, state) {
    if (!node || node.type === 'chest' || node.type === 'boss') return false;
    const chId = chapter.id || 0;
    const isDeck = (typeof window.isRoadmapSlotInDeckMode === 'function')
        && window.isRoadmapSlotInDeckMode(chId, node.num);
    if (isDeck) return false;
    const assigned = (typeof window.getAssignedRoadmapStory === 'function')
        ? window.getAssignedRoadmapStory(chId, node.num) : null;
    if (assigned && assigned.story) return true;
    return state === 'completed';
}

function getRoadmapNodeAction(chapter, index) {
    const node = chapter.nodes[index];
    const state = resolveRoadmapNodeState(chapter, index);
    const unlocked = state !== 'locked';
    const chId = chapter.id || 0;

    if (node.type === 'chest' && unlocked) return `claimRoadmapBonusChest(${chId})`;
    if (node.type === 'chest' || node.type === 'boss') {
        return `openRoadmapMilestonePreview('${node.type}', ${node.num}, ${chId})`;
    }
    return `toggleRoadmapNodePopover(${node.num}, ${chId}, event)`;
}

function renderWindingConnectorSvg(x1, x2, isLit, isActiveNext, isPulseFlow) {
    const cls = [
        isLit ? 'is-lit' : (isActiveNext ? 'is-active-bridge' : 'is-dim'),
        isPulseFlow ? 'is-pulse-flow' : ''
    ].filter(Boolean).join(' ');
    const d = `M ${x1} 0 C ${x1} 20, ${x2} 20, ${x2} 40`;
    return `
        <div class="sq-bridge-wrap ${cls}" aria-hidden="true">
            <svg class="sq-bridge-svg" viewBox="0 0 100 40" preserveAspectRatio="none">
                <path class="sq-bridge-ribbon" d="${d}" vector-effect="non-scaling-stroke" />
                <path class="sq-stone-shadow" d="${d}" vector-effect="non-scaling-stroke" />
                <path class="sq-bridge-line" d="${d}" vector-effect="non-scaling-stroke" />
            </svg>
        </div>`;
}

// Render 1 Ô Vuông 3D '?' (Không in chữ dưới đáy ô để dây nối sạch 100% như Duolingo)
function renderWindingSquareNode(chapter, gIdx, loop, localIdx, order) {
    const node = chapter.nodes[gIdx];
    const state = resolveRoadmapNodeState(chapter, gIdx);
    const type = node.type || 'star';
    const isSpecial = (type === 'chest' || type === 'boss');
    const chId = chapter.id || 0;
    const xPct = getNodeHorizontalPercent(loop, localIdx);
    const onClick = getRoadmapNodeAction(chapter, gIdx);

    const assigned = (typeof window.getAssignedRoadmapStory === 'function')
        ? window.getAssignedRoadmapStory(chId, node.num) : null;
    const customStory = assigned ? assigned.story : null;
    const overlaid = hasRoadmapStoryOverlay(chapter, node, state);
    const displayTitle = customStory ? customStory.title : node.title;
    const displayImg = customStory ? customStory.img : node.img;
    const justUnlocked = roadmapUiState.justUnlockedNum === node.num ? 'is-just-unlocked' : '';
    const isJustLanded = (window.__justRevealedSlot === `${chId}_${node.num}`);
    const justMounted = isJustLanded ? 'is-cover-stamp' : '';
    const springTileCls = isJustLanded ? 'is-spring-land' : '';
    const rippleHtml = isJustLanded ? '<span class="sq-landing-ripple" aria-hidden="true"></span>' : '';
    const isPopoverOpen = (window.__openRoadmapPopoverKey === `${chId}_${node.num}`);
    const numLabel = node.num < 10 ? `0${node.num}` : `${node.num}`;

    // 1. MỐC RƯƠNG KHO BÁU (CHẶNG 5) & TRÙM CUỐI (CHẶNG 10)
    if (isSpecial) {
        const isBoss = type === 'boss';
        const chestImg = isBoss ? 'assets/cards/lumi_progress_celebration.jpg' : 'assets/cards/reward_gift_box.jpg';
        return `
            <div class="sq-node-row is-milestone state-${state}" style="--x:${xPct}%; --i:${order}" ${state === 'active' ? 'data-roadmap-active="1"' : ''}>
                <div class="sq-node-anchor">
                    <span class="sq-loot-aura ${isBoss ? 'is-boss-aura' : ''}" aria-hidden="true"></span>
                    <span class="sq-milestone-crest" aria-hidden="true">${isBoss ? '👑' : '🔑'}</span>
                    <div class="sq-tile sq-tile-milestone ${state === 'locked' ? 'is-locked-muted' : ''}"
                         data-node-num="${node.num}" role="button" tabindex="0" onclick="${onClick}"
                         title="${isBoss ? 'Thử thách cuối · +300 XP' : 'Rương thưởng · +150 XP'}">
                        <img src="${chestImg}" alt="" class="sq-milestone-img" loading="lazy" />
                        <div class="sq-milestone-shade"></div>
                        <span class="sq-milestone-glint" aria-hidden="true"></span>
                        <span class="sq-milestone-num">${numLabel}</span>
                        <span class="sq-loot-xp-pill">${isBoss ? '★ BOSS' : '🎁 +150 XP'}</span>
                    </div>
                </div>
            </div>`;
    }

    // Khi có ảnh truyện đè lên ô '?', tấm ảnh nằm gọn trên bệ ô '?' (chỉ giữ chấm hoàn thành màu xanh ở góc dưới phải)
    const overlayHtml = overlaid ? `
        <div class="sq-story-overlay ${justMounted}">
            <img src="${displayImg}" alt="${roadmapAttr(displayTitle)}" class="sq-story-img" loading="lazy" decoding="async" />
            ${state === 'completed' ? `<span class="sq-done-dot" aria-label="Đã hoàn thành">${ROADMAP_ICON_CHECK}</span>` : ''}
        </div>` : '';

    const popoverHtml = (isPopoverOpen && typeof window.renderSquareNodePopover === 'function')
        ? window.renderSquareNodePopover(chapter, node, state, overlaid, customStory, xPct)
        : '';

    const qFaceHtml = (typeof window.renderAnimatedMysteryTileSvg === 'function')
        ? `<div class="sq-q-face">${window.renderAnimatedMysteryTileSvg(numLabel, state === 'active', order)}</div>`
        : `<div class="sq-q-face"><span class="sq-bare-num">${numLabel}</span><span class="sq-big-q">?</span></div>`;

    // 2. BÀI CẦN HỌC HIỆN TẠI (TO GẤP RƯỠI Ô ĐÃ HỌC, BỆ SÁNG NỔI BẬT, KHÔNG LẶP CHỮ DƯỚI ĐÁY)
    if (state === 'active') {
        return `
            <div class="sq-node-row is-active-hero ${isPopoverOpen ? 'has-open-popover' : ''}" style="--x:${xPct}%; --i:${order}" data-roadmap-active="1">
                <div class="sq-node-anchor">
                    <div class="sq-active-callout" onclick="${onClick}">
                        <span class="sq-live-dot"></span>
                        <span>Học tiếp · Chặng ${node.num}</span>
                    </div>
                    <div class="sq-active-stage">
                        <div class="sq-active-halo" aria-hidden="true"></div>
                        <div class="sq-active-q-backing" aria-hidden="true"><span>?</span></div>
                        <div class="sq-player-wisp" aria-hidden="true" title="Vị trí hiện tại của bạn">
                            <svg viewBox="0 0 32 32" fill="none"><circle cx="16" cy="18" r="10" fill="rgba(184,209,102,0.28)"/><path d="M16 4 C21 10, 24 14, 24 19 C24 23.5, 20.5 27, 16 27 C11.5 27, 8 23.5, 8 19 C8 14, 11 10, 16 4 Z" fill="#B8D166"/><path d="M16 9 C19 13, 20.5 16, 20.5 19.5 C20.5 22, 18.5 24, 16 24 C13.5 24, 11.5 22, 11.5 19.5 C11.5 16, 13 13, 16 9 Z" fill="#FEF08A"/><circle cx="14" cy="19" r="1.4" fill="#182000"/><circle cx="18" cy="19" r="1.4" fill="#182000"/></svg>
                        </div>
                        ${rippleHtml}
                        <div class="sq-tile sq-tile-active ${overlaid ? 'has-story-cover' : 'is-mystery-q'} ${justUnlocked} ${springTileCls}"
                             data-node-num="${node.num}" role="button" tabindex="0" onclick="${onClick}"
                             title="${overlaid ? roadmapAttr(displayTitle) : `Chặng ${node.num}: Chạm để chọn truyện`}">
                            ${qFaceHtml}
                            ${overlayHtml}
                        </div>
                    </div>
                    ${popoverHtml}
                </div>
            </div>`;
    }

    // 3. Ô ĐÃ HOÀN THÀNH (THU NHỎ 64PX, DỊU MÀU) & Ô ĐANG KHÓA '?' (68PX) — SẠCH CHỮ 100%
    return `
        <div class="sq-node-row state-${state} ${isPopoverOpen ? 'has-open-popover' : ''}" style="--x:${xPct}%; --i:${order}">
            <div class="sq-node-anchor">
                <div class="sq-active-stage">
                    ${rippleHtml}
                    <div class="sq-tile sq-tile-${state} ${overlaid ? 'has-story-cover' : 'is-mystery-q'} ${springTileCls}"
                         data-node-num="${node.num}" role="button" tabindex="0" onclick="${onClick}"
                         title="${overlaid ? roadmapAttr(displayTitle) : `Chặng ${node.num} · Ô vuông ?`}">
                        ${qFaceHtml}
                        ${overlayHtml}
                    </div>
                </div>
                ${popoverHtml}
            </div>
        </div>`;
}

function renderRoadmapSection(chapter, loop, characters, orderStart) {
    const start = loop * ROADMAP_LESSONS_PER_LOOP, end = start + ROADMAP_LESSONS_PER_LOOP;
    const sectionNodes = chapter.nodes.slice(start, end);
    const completed = sectionNodes.filter(n => n.status === 'completed').length;
    const hasActive = sectionNodes.some((n, i) => resolveRoadmapNodeState(chapter, start + i) === 'active');
    const fillPct = Math.min(100, completed * 20), mastered = fillPct >= 100;
    const started = completed > 0 || hasActive;
    const fillKey = `${chapter.id}-${loop}`;
    const prevPct = roadmapUiState.lastFill[fillKey] ?? fillPct;
    const justDoneHere = sectionNodes.some(n => n.num === roadmapUiState.justCompletedNum);
    const titles = roadmapSectionTitles[chapter.id] || [];
    const sectionTitle = titles[loop] || `Phần ${loop + 1}`;
    const sideCls = (loop % 2 === 0) ? 'is-right' : 'is-left';
    const chId = chapter.id || 0;

    const energyOrbsHtml = justDoneHere ? `
        <div class="sq-energy-burst ${sideCls}" aria-hidden="true">
            <span class="sq-energy-orb orb-1"></span><span class="sq-energy-orb orb-2"></span><span class="sq-energy-orb orb-3"></span>
        </div>` : '';

    let trackHtml = '';
    sectionNodes.forEach((n, localIdx) => {
        const gIdx = start + localIdx;
        trackHtml += renderWindingSquareNode(chapter, gIdx, loop, localIdx, orderStart + localIdx + 1);
        if (localIdx < sectionNodes.length - 1) {
            const x1 = getNodeHorizontalPercent(loop, localIdx);
            const x2 = getNodeHorizontalPercent(loop, localIdx + 1);
            const stateCurr = resolveRoadmapNodeState(chapter, gIdx);
            const stateNext = resolveRoadmapNodeState(chapter, gIdx + 1);
            const isFlowing = (window.__justRevealedSlot === `${chId}_${n.num}`);
            trackHtml += renderWindingConnectorSvg(x1, x2, stateCurr === 'completed', stateNext === 'active', isFlowing);
        }
    });

    const sceneryHtml = (typeof window.renderRoadmapGameSceneryHtml === 'function')
        ? window.renderRoadmapGameSceneryHtml(loop) : '';
    const companionHtml = (typeof window.renderRoadmapAnimatedCompanionHtml === 'function')
        ? window.renderRoadmapAnimatedCompanionHtml({
            chapterId: chId, loop, sideCls, fillKey, fillPct, prevPct,
            completed, started, mastered, justDoneHere
        }) : '';

    const zoneBridgeHtml = loop > 0 ? `
        <div class="sq-zone-bridge-wrap ${started ? 'is-unlocked' : ''}" aria-hidden="true">
            <svg class="sq-zone-bridge-svg" viewBox="0 0 80 42" fill="none">
                <path d="M 24 2 L 24 40 M 56 2 L 56 40" stroke="#5C3A21" stroke-width="3" stroke-linecap="round"/>
                <rect x="20" y="6" width="40" height="5.5" rx="2" fill="#4A321F" stroke="#6E4B2E" stroke-width="0.8"/>
                <rect x="20" y="15" width="40" height="5.5" rx="2" fill="#543923" stroke="#785233" stroke-width="0.8"/>
                <rect x="20" y="24" width="40" height="5.5" rx="2" fill="#4A321F" stroke="#6E4B2E" stroke-width="0.8"/>
                <rect x="20" y="33" width="40" height="5.5" rx="2" fill="#543923" stroke="#785233" stroke-width="0.8"/>
                <circle cx="20" cy="4" r="3" fill="#B8D166" opacity="0.8"/><circle cx="60" cy="4" r="3" fill="#B8D166" opacity="0.8"/>
            </svg>
        </div>` : '';

    return `
        <section class="mb-section sq-winding-section ${!started && loop > 0 ? 'is-future-loop' : ''}" data-loop="${loop + 1}">
            ${zoneBridgeHtml}
            <div class="sq-section-header" style="--i:${orderStart}">
                <span class="sq-section-hairline"></span>
                <span class="sq-section-title"><i>✦</i> Phần ${loop + 1} · ${sectionTitle} <i>✦</i></span>
                <span class="sq-section-hairline"></span>
            </div>
            <div class="sq-winding-stage">
                ${sceneryHtml}
                ${energyOrbsHtml}
                ${companionHtml}
                <div class="sq-winding-nodes">${trackHtml}</div>
            </div>
        </section>`;
}

function renderRoadmapLockedNotice(chapter) {
    const prev = roadmapChaptersData[chapter.id - 1];
    const prevName = prev ? prev.title : 'chương trước';
    const backBtn = prev ? `<button type="button" class="mb-locked-btn" onclick="selectRoadmapChapter(${prev.id})">Về chương trước</button>` : '';
    return `<div class="mb-locked-notice" style="--i:0"><span class="mb-locked-icon" aria-hidden="true">${ROADMAP_ICON_LOCK}</span><div class="mb-locked-text"><strong>Chương đang khóa</strong><span>Hoàn thành "${prevName}" để mở.</span></div>${backBtn}</div>`;
}

function buildRoadmapTimelineHtml(chapter, opts = {}) {
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

    const locked = typeof isRoadmapChapterLocked === 'function' ? isRoadmapChapterLocked(chapter) : false;
    const loops = Math.ceil(chapter.nodes.length / ROADMAP_LESSONS_PER_LOOP);
    let html = `<div class="mb-timeline rm-clean-stage sq-roadmap-map select-none ${opts.animateIn ? 'mb-animate-in' : ''} ${locked ? 'is-chapter-locked' : ''}" onclick="if(event.target===this && typeof window.closeRoadmapNodePopover==='function') window.closeRoadmapNodePopover();">`;
    if (locked) html += renderRoadmapLockedNotice(chapter);
    for (let loop = 0; loop < loops; loop++) {
        html += renderRoadmapSection(chapter, loop, characters, 1 + loop * (ROADMAP_LESSONS_PER_LOOP + 1));
    }
    return html + '</div>';
}
window.buildRoadmapTimelineHtml = buildRoadmapTimelineHtml;

function renderRoadmapNodes(chapter, opts = {}) {
    const nodesContainer = document.getElementById('roadmapNodesContainer');
    if (!nodesContainer) return;
    nodesContainer.innerHTML = buildRoadmapTimelineHtml(chapter, opts);
    renderRoadmapNextBar(chapter);
    roadmapRaf(() => roadmapRaf(() => applyRoadmapFillAnimations(nodesContainer)));
}

function applyRoadmapFillAnimations(root) {
    if (!root || typeof root.querySelectorAll !== 'function') return;
    root.querySelectorAll('.mb-char[data-fill-key]').forEach((el) => {
        const key = el.getAttribute('data-fill-key');
        const target = Number(el.getAttribute('data-fill-target')) || 0;
        const color = el.querySelector('.mb-char-color');
        if (color) color.style.clipPath = `inset(${100 - target}% 0 0 0)`;
        roadmapUiState.lastFill[key] = target;
        if (el.getAttribute('data-just-done') === '1') setTimeout(() => showRoadmapCharacterBubble(el), 650);
    });
}
window.applyRoadmapFillAnimations = applyRoadmapFillAnimations;

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
        ? `<img src="${customStory ? customStory.img : activeNode.img}" alt="" class="sq-dock-img" />`
        : `<div class="sq-dock-q">?</div>`;
    const ctaHtml = overlaid
        ? `<button type="button" class="sq-dock-cta" onclick="event.stopPropagation(); launchRevealedLesson(${activeNode.num}, ${chId})">Học ngay</button>`
        : `<button type="button" class="sq-dock-cta" onclick="event.stopPropagation(); openRoadmapGenrePickerSheet(${activeNode.num}, ${chId}, 'classic')">Chọn truyện</button>`;

    const dockMarkup = `
        <div class="sq-thumb-dock-inner" onclick="if(typeof scrollRoadmapToActive==='function') scrollRoadmapToActive(true); toggleRoadmapNodePopover(${activeNode.num}, ${chId}, event);">
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