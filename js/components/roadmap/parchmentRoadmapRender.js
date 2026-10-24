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
window.resolveRoadmapNodeState = resolveRoadmapNodeState;

// Đường cong chữ S uốn lượn gọn trong vùng đất liền để đặt 2 nhân vật hoạt họa ở giữa 2 đường cong mỗi chặng
const WINDING_LOOP_X = [
    [45, 25, 20, 27, 45],
    [55, 72, 76, 68, 52]
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
window.hasRoadmapStoryOverlay = hasRoadmapStoryOverlay;

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

function renderWindingConnectorSvg(x1, x2, isLit, isActiveNext, isPulseFlow, bridgeIdx = 0, orderIdx = 1) {
    const isFlowPath = isLit || isActiveNext;
    const cls = [
        isLit ? 'is-lit' : (isActiveNext ? 'is-active-bridge' : 'is-dim'),
        isFlowPath ? 'is-energy-stream' : '',
        isPulseFlow ? 'is-pulse-flow' : ''
    ].filter(Boolean).join(' ');
    const d = `M ${x1} 2 C ${x1} 33, ${x2} 31, ${x2} 62`;
    const streamPaths = isFlowPath ? `
                <path class="sq-bridge-glow-trail" d="${d}" pathLength="100" vector-effect="non-scaling-stroke" />
                <path class="sq-bridge-energy-beam" d="${d}" pathLength="100" vector-effect="non-scaling-stroke" />
                <path class="sq-bridge-comet-orb" d="${d}" pathLength="100" vector-effect="non-scaling-stroke" />` : '';
    return `
        <div class="sq-bridge-wrap ${cls}" style="--bridge-idx:${bridgeIdx}; --i:${orderIdx}" aria-hidden="true">
            <svg class="sq-bridge-svg" viewBox="0 0 100 64" preserveAspectRatio="none">
                <path class="sq-bridge-ribbon" d="${d}" vector-effect="non-scaling-stroke" />
                <path class="sq-stone-shadow" d="${d}" vector-effect="non-scaling-stroke" />
                <path class="sq-bridge-line" d="${d}" vector-effect="non-scaling-stroke" />${streamPaths}
            </svg>
        </div>`;
}

// Render 1 Ô Vuông 3D '?' (Không in chữ dưới đáy ô để dây nối sạch 100% như Duolingo)
function resolveCalmPastelNodeImg(node, customStory) {
    const num = Number(node && node.num) || 1;
    const calmPool = [
        'assets/cards/calm_story_01_rain.jpg',
        'assets/cards/calm_story_02_badge.jpg',
        'assets/cards/calm_story_03_tortoise_hare.jpg',
        'assets/cards/calm_story_04_train.jpg'
    ];
    const raw = String((customStory && customStory.img) || (node && node.img) || '');
    if (raw.includes('calm_story_')) return raw;
    return calmPool[(num - 1) % calmPool.length];
}
window.resolveCalmPastelNodeImg = resolveCalmPastelNodeImg;

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
    const displayImg = resolveCalmPastelNodeImg(node, customStory);
    const justUnlocked = roadmapUiState.justUnlockedNum === node.num ? 'is-just-unlocked' : '';
    const isJustLanded = (window.__justRevealedSlot === `${chId}_${node.num}`);
    const justMounted = isJustLanded ? 'is-cover-stamp' : '';
    const springTileCls = isJustLanded ? 'is-spring-land' : '';
    const rippleHtml = isJustLanded ? '<span class="sq-landing-ripple" aria-hidden="true"></span>' : '';
    const isPopoverOpen = (window.__openRoadmapPopoverKey === `${chId}_${node.num}`);
    const numLabel = node.num < 10 ? `0${node.num}` : `${node.num}`;

    // 1. MỐC HỘP QUÀ FLAT VECTOR (CHẶNG 5 & CHẶNG 10 GIỐNG ẢNH MẪU)
    if (isSpecial) {
        const isBoss = type === 'boss';
        const giftHtml = (typeof window.renderCalmGiftBoxMilestoneHtml === 'function')
            ? window.renderCalmGiftBoxMilestoneHtml(numLabel, isBoss, state, onClick)
            : '';
        return `
            <div class="sq-node-row is-milestone state-${state}" style="--x:${xPct}%; --i:${order}" ${state === 'active' ? 'data-roadmap-active="1"' : ''}>
                <div class="sq-node-anchor">${giftHtml}</div>
            </div>`;
    }

    // Khi có truyện đè lên ô '?', hiển thị nhân vật SVG 3/4 Isometric theo chủ đề câu chuyện
    const storyTarget = customStory || Object.assign({}, node, { id: `topic_00${Math.min(9, ((node.num - 1) % 9) + 1)}` });
    const charVis = (overlaid && typeof window.resolveStoryCharacterVisual === 'function')
        ? window.resolveStoryCharacterVisual(storyTarget, gIdx) : null;
    const overlayHtml = overlaid ? (charVis && charVis.svg ? `
        <div class="sq-story-overlay is-svg-tile ${justMounted}" style="${charVis.styleVars}">
            <div class="sq-tile-svg-rig">${charVis.svg}</div>
            ${state === 'completed' ? `<span class="sq-done-dot" aria-label="Đã hoàn thành">${ROADMAP_ICON_CHECK}</span>` : ''}
        </div>` : `
        <div class="sq-story-overlay ${justMounted}">
            <img src="${displayImg}" alt="${roadmapAttr(displayTitle)}" class="sq-story-img" loading="lazy" decoding="async" />
            ${state === 'completed' ? `<span class="sq-done-dot" aria-label="Đã hoàn thành">${ROADMAP_ICON_CHECK}</span>` : ''}
        </div>`) : '';

    const popoverHtml = (isPopoverOpen && typeof window.renderSquareNodePopover === 'function')
        ? window.renderSquareNodePopover(chapter, node, state, overlaid, customStory, xPct)
        : '';

    const qFaceHtml = (typeof window.renderAnimatedMysteryTileSvg === 'function')
        ? `<div class="sq-q-face">${window.renderAnimatedMysteryTileSvg(numLabel, state === 'active', order)}</div>`
        : `<div class="sq-q-face"><span class="sq-bare-num">${numLabel}</span><span class="sq-big-q">?</span></div>`;

    // 2. BÀI CẦN HỌC HIỆN TẠI (TO GẤP RƯỠI Ô ĐÃ HỌC, BỆ SÁNG NỔI BẬT, SPARKLES & HALO SONAR)
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
                        <div class="sq-active-sparkles" aria-hidden="true">
                            <span class="sq-active-spark spark-1">✦</span>
                            <span class="sq-active-spark spark-2">✦</span>
                            <span class="sq-active-spark spark-3">★</span>
                        </div>
                        <div class="sq-active-q-backing" aria-hidden="true"><span>?</span></div>
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
    const biome = (typeof window.resolveRoadmapChapterBiome === 'function')
        ? window.resolveRoadmapChapterBiome(chapter, chapter.id || 0) : null;
    const titles = (biome && biome.sections) || roadmapSectionTitles[chapter.id] || [];
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
        const nodeOrder = orderStart + localIdx + 1;
        trackHtml += renderWindingSquareNode(chapter, gIdx, loop, localIdx, nodeOrder);
        if (localIdx < sectionNodes.length - 1) {
            const x1 = getNodeHorizontalPercent(loop, localIdx);
            const x2 = getNodeHorizontalPercent(loop, localIdx + 1);
            const stateCurr = resolveRoadmapNodeState(chapter, gIdx);
            const stateNext = resolveRoadmapNodeState(chapter, gIdx + 1);
            const isFlowing = (window.__justRevealedSlot === `${chId}_${n.num}`);
            trackHtml += renderWindingConnectorSvg(x1, x2, stateCurr === 'completed', stateNext === 'active', isFlowing, gIdx, nodeOrder);
        }
    });

    const sceneryHtml = (typeof window.renderRoadmapGameSceneryHtml === 'function')
        ? window.renderRoadmapGameSceneryHtml(loop, chapter) : '';
    const companionHtml = (typeof window.renderRoadmapAnimatedCompanionHtml === 'function')
        ? window.renderRoadmapAnimatedCompanionHtml({
            chapterId: chId, loop, sideCls, fillKey, fillPct, prevPct,
            completed, started, mastered, justDoneHere
        }) : '';

    const zoneBridgeHtml = loop > 0 ? `
        <div class="sq-zone-bridge-wrap ${started ? 'is-unlocked' : ''}" aria-hidden="true">
            <svg class="sq-zone-bridge-svg" viewBox="0 0 80 62" fill="none">
                <path d="M 24 2 L 24 60 M 56 2 L 56 60" stroke="#789E9E" stroke-width="3" stroke-linecap="round"/>
                <rect x="20" y="6" width="40" height="5.5" rx="2.5" fill="#FFFFFF" stroke="#9BBEC0" stroke-width="1"/>
                <rect x="20" y="16" width="40" height="5.5" rx="2.5" fill="#EBF4F4" stroke="#9BBEC0" stroke-width="1"/>
                <rect x="20" y="26" width="40" height="5.5" rx="2.5" fill="#FFFFFF" stroke="#9BBEC0" stroke-width="1"/>
                <rect x="20" y="36" width="40" height="5.5" rx="2.5" fill="#EBF4F4" stroke="#9BBEC0" stroke-width="1"/>
                <rect x="20" y="46" width="40" height="5.5" rx="2.5" fill="#FFFFFF" stroke="#9BBEC0" stroke-width="1"/>
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
    const biome = (typeof window.resolveRoadmapChapterBiome === 'function')
        ? window.resolveRoadmapChapterBiome(chapter, chapter.id || 0) : null;
    const svgUri = (biome && typeof window.buildBiomeSvgDataUri === 'function')
        ? window.buildBiomeSvgDataUri(biome) : '';
    const biomeVars = biome
        ? `--rm-biome-bg:${biome.bg}; --rm-biome-sky:${biome.skyTop}; --rm-biome-pill-bg:${biome.pillBg}; --rm-biome-pill-text:${biome.pillText}; --rm-island-top:${biome.islandTop}; --rm-island-core:${biome.islandCore}; --rm-island-side:${biome.islandSide};`
        : '';
    const screenEl = typeof document !== 'undefined' && document.getElementById('screenParchmentRoadmap');
    if (screenEl && biome) {
        screenEl.style.setProperty('--rm-biome-bg', biome.bg);
        screenEl.style.setProperty('--rm-biome-sky', biome.skyTop);
    }
    let html = `<div class="mb-timeline rm-clean-stage sq-roadmap-map select-none ${opts.animateIn ? 'mb-animate-in' : ''} ${locked ? 'is-chapter-locked' : ''}" data-biome="${biome ? biome.id : 'forest'}" style="${biomeVars}" onclick="if(event.target===this && typeof window.closeRoadmapNodePopover==='function') window.closeRoadmapNodePopover();">`;
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
    const mapEl = nodesContainer.querySelector('.sq-roadmap-map');
    const biome = (typeof window.resolveRoadmapChapterBiome === 'function')
        ? window.resolveRoadmapChapterBiome(chapter, chapter.id || 0) : null;
    if (mapEl && biome && typeof window.buildBiomeSvgDataUri === 'function') {
        mapEl.style.setProperty('--rm-biome-svg', window.buildBiomeSvgDataUri(biome));
    }
    if (typeof window.renderRoadmapNextBar === 'function') window.renderRoadmapNextBar(chapter);
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
