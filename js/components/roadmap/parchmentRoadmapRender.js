// ========================================================
// 🗺️ WINDING 3D SQUARE '?' STEPPING-STONE ROADMAP RENDERER
// Ceiling: < 350 lines | Zero-Clutter Map + Interactive Popovers
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

// Tọa độ X (%) tạo đường cong chữ S uốn lượn cho 5 chặng mỗi vòng (nhường khoảng trống bên cạnh cho Lumi)
const WINDING_LOOP_X = [
    [46, 25, 21, 29, 48], // Vòng 1: Uốn sang trái, Lumi & Lửa trại ở bên phải
    [52, 73, 77, 69, 50]  // Vòng 2: Uốn sang phải, Lumi Nhà Thám Hiểm ở bên trái
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
    // Chạm vào bất kỳ ô vuông nào sẽ bật/tắt Bong bóng nổi (Popover: Xòe 3 lá bài hoặc Xem trước & Học ngay)
    return `toggleRoadmapNodePopover(${node.num}, ${chId}, event)`;
}

function renderWindingConnectorSvg(x1, x2, isLit, isActiveNext) {
    const cls = isLit ? 'is-lit' : (isActiveNext ? 'is-active-bridge' : 'is-dim');
    return `
        <div class="sq-bridge-wrap ${cls}" aria-hidden="true">
            <svg class="sq-bridge-svg" viewBox="0 0 100 52" preserveAspectRatio="none">
                <path class="sq-bridge-glow" d="M ${x1} 0 C ${x1} 26, ${x2} 26, ${x2} 52" vector-effect="non-scaling-stroke" />
                <path class="sq-bridge-dash" d="M ${x1} 0 C ${x1} 26, ${x2} 26, ${x2} 52" vector-effect="non-scaling-stroke" />
            </svg>
        </div>`;
}

// Render 1 Ô Vuông 3D '?' (hoặc Rương/Trùm) sạch chữ trên mặt bản đồ + Bong bóng nổi khi chạm
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
    const justMounted = (window.__justRevealedSlot === `${chId}_${node.num}`) ? 'is-cover-stamp' : '';
    const isPopoverOpen = (window.__openRoadmapPopoverKey === `${chId}_${node.num}`);

    // 1. MỐC RƯƠNG KHO BÁU (CHẶNG 5) & TRÙM CUỐI (CHẶNG 10)
    if (isSpecial) {
        const isBoss = type === 'boss';
        const chestImg = isBoss ? 'assets/cards/lumi_progress_celebration.jpg' : 'assets/cards/reward_gift_box.jpg';
        const tagText = isBoss ? '👑 +300 XP' : '🎁 +150 XP';
        return `
            <div class="sq-node-row is-milestone state-${state}" style="--x:${xPct}%; --i:${order}" ${state === 'active' ? 'data-roadmap-active="1"' : ''}>
                <div class="sq-node-anchor">
                    <div class="sq-tile sq-tile-milestone ${isBoss ? 'is-boss' : 'is-chest'} ${state === 'locked' ? 'is-locked-muted' : ''}"
                         data-node-num="${node.num}" role="button" tabindex="0" onclick="${onClick}">
                        <div class="sq-tile-inner">
                            <img src="${chestImg}" alt="" class="sq-milestone-img" loading="lazy" />
                            <span class="sq-milestone-icon">${isBoss ? '👑' : '🎁'}</span>
                            <span class="sq-step-tag">#${node.num}</span>
                            <span class="sq-lock-corner">${state === 'locked' ? '🔒' : '✨'}</span>
                        </div>
                    </div>
                    <span class="sq-node-caption is-gold">${tagText}</span>
                </div>
            </div>`;
    }

    const flavor = (typeof window.getRoadmapSlotFlavor === 'function')
        ? window.getRoadmapSlotFlavor(node.num)
        : { icon: '✦', diffShort: 'Vừa', badgeCls: 'age-badge-15', themeTag: 'Tự chọn' };

    // Lớp ảnh bìa câu chuyện đè lên trên nền dấu '?' khi đã chọn truyện
    const overlayHtml = overlaid ? `
        <div class="sq-story-overlay ${justMounted}">
            <img src="${displayImg}" alt="${roadmapAttr(displayTitle)}" class="sq-story-img" loading="lazy" decoding="async" />
            <div class="sq-story-vignette"></div>
            <span class="sq-peeking-q" title="Ảnh truyện đang đè lên ô ?">?</span>
            ${state === 'completed'
                ? '<span class="sq-done-badge" title="Đã hoàn thành">✓</span>'
                : `<button type="button" class="sq-corner-btn is-reset" title="Gỡ ảnh về lại ô ?" onclick="event.stopPropagation(); if(typeof window.resetRoadmapSlotToDeck==='function') window.resetRoadmapSlotToDeck(${node.num}, ${chId});">?</button>`
            }
            <button type="button" class="sq-corner-btn is-swap" title="Đổi câu chuyện khác" onclick="event.stopPropagation(); openRoadmapGenrePickerSheet(${node.num}, ${chId}, 'classic')">🎲</button>
        </div>` : '';

    // Bong bóng nổi (Popover: Xòe 3 lá bài nếu là ô '?', hoặc Xem trước 3 từ vựng + Nút Học ngay nếu đã có ảnh)
    const popoverHtml = (isPopoverOpen && typeof window.renderSquareNodePopover === 'function')
        ? window.renderSquareNodePopover(chapter, node, state, overlaid, customStory, xPct)
        : '';

    // 2. BÀI CẦN HỌC HIỆN TẠI (ACTIVE SPOTLIGHT SQUARE TILE — KHÔNG CÓ HỘP CHỮ Rườm Rà DƯỚI CHÂN)
    if (state === 'active') {
        const activeSubPill = overlaid
            ? `<span class="sq-node-caption is-active-story">${displayTitle}</span>`
            : `<span class="sq-node-caption is-active-q">✦ Chạm rút truyện</span>`;
        return `
            <div class="sq-node-row is-active-hero ${isPopoverOpen ? 'has-open-popover' : ''}" style="--x:${xPct}%; --i:${order}" data-roadmap-active="1">
                <div class="sq-node-anchor">
                    <div class="sq-active-callout" onclick="${onClick}">
                        <span class="sq-pawn-icon">${ROADMAP_ICON_LUMI_PAW}</span>
                        <span>BÀI CẦN HỌC · #${node.num}</span>
                    </div>
                    <div class="sq-active-orbit-wrap">
                        <svg class="sq-orbit-svg" viewBox="0 0 120 120" aria-hidden="true">
                            <rect x="6" y="6" width="108" height="108" rx="30" ry="30" class="sq-orbit-track" />
                            <rect x="6" y="6" width="108" height="108" rx="30" ry="30" class="sq-orbit-segments" />
                        </svg>
                        <div class="sq-tile sq-tile-active ${overlaid ? 'has-story-cover' : 'is-mystery-q'} ${justUnlocked}"
                             data-node-num="${node.num}" role="button" tabindex="0" onclick="${onClick}">
                            <span class="sq-corner-stud s1"></span><span class="sq-corner-stud s2"></span>
                            <span class="sq-corner-stud s3"></span><span class="sq-corner-stud s4"></span>
                            <div class="sq-tile-inner">
                                <div class="sq-q-face">
                                    <span class="sq-step-tag is-active">#${node.num}</span>
                                    <span class="sq-big-q">?</span>
                                    <span class="sq-q-sub">Rút thẻ</span>
                                </div>
                                ${overlayHtml}
                            </div>
                        </div>
                    </div>
                    ${activeSubPill}
                    ${popoverHtml}
                </div>
            </div>`;
    }

    // 3. Ô VUÔNG ĐÃ HOÀN THÀNH HOẶC ĐANG KHÓA (SẠCH CHỮ, CHẠM ĐỂ XÒE BÀI / XEM TRƯỚC)
    const miniCaption = state === 'completed'
        ? `<span class="sq-node-stars">★★★</span>`
        : (overlaid ? `<span class="sq-node-caption is-preselected">${displayTitle}</span>` : '');

    return `
        <div class="sq-node-row state-${state} ${isPopoverOpen ? 'has-open-popover' : ''}" style="--x:${xPct}%; --i:${order}">
            <div class="sq-node-anchor">
                <div class="sq-tile sq-tile-${state} ${overlaid ? 'has-story-cover' : 'is-mystery-q'}"
                     data-node-num="${node.num}" role="button" tabindex="0" onclick="${onClick}">
                    <span class="sq-corner-stud s1"></span><span class="sq-corner-stud s2"></span>
                    <span class="sq-corner-stud s3"></span><span class="sq-corner-stud s4"></span>
                    <div class="sq-tile-inner">
                        <div class="sq-q-face">
                            <span class="sq-step-tag">#${node.num}</span>
                            <span class="sq-big-q">?</span>
                            <span class="sq-q-flavor">${flavor.icon}</span>
                        </div>
                        ${overlayHtml}
                    </div>
                </div>
                ${miniCaption}
                ${popoverHtml}
            </div>
        </div>`;
}

function getRoadmapCharacterLine(char, completed, started, justDone) {
    const remaining = ROADMAP_LESSONS_PER_LOOP - completed;
    if (completed >= ROADMAP_LESSONS_PER_LOOP) return char.quote || 'Cảm ơn bạn đã đánh thức 100% sắc màu cho mình!';
    if (justDone) return `Tuyệt! Hạt sáng vừa truyền thêm 20% màu cho mình!`;
    if (started) return `Chạm vào ô vuông ? để rút truyện & truyền sáng cho Lumi nhé!`;
    return 'Mình đang đợi bạn đánh thức ở chặng này…';
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
    const char = characters[loop] || characters[0];
    const line = getRoadmapCharacterLine(char, completed, started, justDoneHere);
    const showLine = prevPct > 0 && prevPct < 100;
    const pctLabel = mastered ? '✨ 100%' : (started ? `⚡ ${fillPct}%` : '🔒 0%');
    const sideCls = (loop % 2 === 0) ? 'is-right' : 'is-left';

    const starsHtml = Array.from({ length: 5 }, (_, i) => {
        const isOn = i < completed;
        const isPop = justDoneHere && i === completed - 1;
        return `<span class="sq-companion-star ${isOn ? 'is-on' : ''} ${isPop ? 'is-star-pop' : ''}">★</span>`;
    }).join('');

    // Hạt ánh sáng năng lượng bay từ ô vuông vừa học xong sang tô màu Lumi (#3)
    const energyOrbsHtml = justDoneHere ? `
        <div class="sq-energy-burst ${sideCls}" aria-hidden="true">
            <span class="sq-energy-orb orb-1">✦</span>
            <span class="sq-energy-orb orb-2">⚡</span>
            <span class="sq-energy-orb orb-3">✦</span>
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
            trackHtml += renderWindingConnectorSvg(x1, x2, stateCurr === 'completed', stateNext === 'active');
        }
    });

    return `
        <section class="mb-section sq-winding-section ${!started && loop > 0 ? 'is-future-loop' : ''}" data-loop="${loop + 1}">
            <div class="sq-section-pill-row" style="--i:${orderStart}">
                <span class="sq-section-line"></span>
                <span class="sq-section-pill">${started ? '🌿' : '🔒'} Vòng ${loop + 1} · ${sectionTitle}</span>
                <span class="sq-section-line"></span>
            </div>
            <div class="sq-winding-stage">
                ${energyOrbsHtml}
                <div class="sq-companion-island ${sideCls}">
                    <div class="sq-tether-beam ${started ? 'is-active' : ''}" aria-hidden="true"></div>
                    <div class="mb-char sq-char-stage ${mastered ? 'is-mastered' : ''} ${started ? '' : 'is-waiting'} ${justDoneHere ? 'is-receiving-energy' : ''}"
                         role="button" tabindex="0" data-fill-key="${fillKey}" data-fill-target="${fillPct}" data-just-done="${justDoneHere ? 1 : 0}"
                         onclick="handleCharacterTap(this)" title="Chạm vào ${roadmapAttr(char.name)}">
                        <div class="mb-char-bubble" role="status">${line}</div>
                        <div class="sq-campfire-glow" aria-hidden="true"></div>
                        <img class="mb-char-gray" src="${char.img}" alt="" />
                        <img class="mb-char-color" src="${char.img}" alt="" style="clip-path: inset(${100 - prevPct}% 0 0 0);" />
                        <div class="mb-char-line" style="bottom: calc(${prevPct}% - 1px); opacity: ${showLine ? 1 : 0};"></div>
                        <span class="sq-campfire-prop" aria-hidden="true">${loop === 0 ? '🔥' : '🏮'}</span>
                        <span class="mb-char-pct-pill ${mastered ? 'is-mastered' : ''}">${pctLabel}</span>
                    </div>
                    <div class="sq-companion-stars" aria-label="Tiến độ ${completed} trên 5 sao">${starsHtml}</div>
                    <span class="sq-companion-name">${char.name}</span>
                </div>
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
    let html = `<div class="mb-timeline rm-clean-stage sq-roadmap-map ${opts.animateIn ? 'mb-animate-in' : ''} ${locked ? 'is-chapter-locked' : ''}" onclick="if(event.target===this && typeof window.closeRoadmapNodePopover==='function') window.closeRoadmapNodePopover();">`;
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
window.applyRoadmapFillAnimations = applyRoadmapFillAnimations;

function renderRoadmapNextBar() {
    const bar = document.getElementById('roadmapNextBar');
    if (bar) bar.classList.remove('is-visible');
}