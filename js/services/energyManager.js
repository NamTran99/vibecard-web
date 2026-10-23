/**
 * ==========================================================================
 * ⚡ LUMI ENERGY / BATTERY SYSTEM (DUOLINGO-STYLE HYBRID MONETIZATION)
 * Standard: Material Design 3 (M3-07 Dark Olive Green) & Human-Crafted UI
 * Ceiling: < 350 lines
 * ==========================================================================
 */

(function (window) {
    'use strict';

    const STORAGE_KEY = 'mindcard_lumi_energy_state_v1';
    const MAX_ENERGY = 5;
    const REFILL_INTERVAL_MS = 15 * 60 * 1000; // 15 minutes per 1 Energy cell

    let energyState = {
        energy: MAX_ENERGY,
        maxEnergy: MAX_ENERGY,
        isPro: false,
        nextRefillAt: null, // timestamp (ms) when next +1 energy arrives
        totalLessonsStarted: 0
    };

    let countdownTimer = null;
    let pendingLessonCallback = null;
    let currentSessionDeducted = false;

    function markLessonSessionStarted(wasDeducted) {
        currentSessionDeducted = Boolean(wasDeducted);
    }

    function onLessonCompletedDeduct() {
        reconcileElapsedRefills();
        if (energyState.isPro) {
            currentSessionDeducted = false;
            return;
        }
        // Nếu bài học vừa hoàn thành chưa bị trừ Pin lúc mở (VD: mở thẳng qua URL #story, hoặc bấm nút Hoàn thành bài nhanh),
        // thì trừ -1 Pin ngay khi hoàn thành bài học!
        if (!currentSessionDeducted && energyState.energy > 0) {
            energyState.energy = Math.max(0, energyState.energy - 1);
            energyState.totalLessonsStarted = (energyState.totalLessonsStarted || 0) + 1;
            if (energyState.energy < MAX_ENERGY && !energyState.nextRefillAt) {
                energyState.nextRefillAt = Date.now() + REFILL_INTERVAL_MS;
            }
            saveEnergyState();
            renderAllEnergyUI();
            showEnergyDrainFloatingBadge();
        }
        currentSessionDeducted = false;
    }

    function loadEnergyState() {
        try {
            const raw = localStorage.getItem(STORAGE_KEY);
            if (raw) {
                const parsed = JSON.parse(raw);
                if (parsed && typeof parsed === 'object') {
                    energyState.energy = typeof parsed.energy === 'number' ? Math.max(0, Math.min(MAX_ENERGY, parsed.energy)) : MAX_ENERGY;
                    energyState.isPro = Boolean(parsed.isPro);
                    energyState.nextRefillAt = parsed.nextRefillAt || null;
                    energyState.totalLessonsStarted = parsed.totalLessonsStarted || 0;
                }
            }
        } catch (e) {}
        reconcileElapsedRefills();
    }

    function saveEnergyState() {
        try {
            localStorage.setItem(STORAGE_KEY, JSON.stringify(energyState));
        } catch (e) {}
        if (window.AppStore && typeof window.AppStore.updateState === 'function') {
            window.AppStore.updateState({
                lumiEnergy: energyState.energy,
                lumiMaxEnergy: MAX_ENERGY,
                isProUser: energyState.isPro
            });
        }
    }

    function reconcileElapsedRefills() {
        if (energyState.isPro || energyState.energy >= MAX_ENERGY) {
            energyState.energy = MAX_ENERGY;
            energyState.nextRefillAt = null;
            return;
        }
        const now = Date.now();
        if (!energyState.nextRefillAt) {
            energyState.nextRefillAt = now + REFILL_INTERVAL_MS;
            saveEnergyState();
            return;
        }
        if (now >= energyState.nextRefillAt) {
            const elapsed = now - energyState.nextRefillAt;
            const gained = 1 + Math.floor(elapsed / REFILL_INTERVAL_MS);
            energyState.energy = Math.min(MAX_ENERGY, energyState.energy + gained);
            if (energyState.energy >= MAX_ENERGY) {
                energyState.nextRefillAt = null;
            } else {
                const remainder = elapsed % REFILL_INTERVAL_MS;
                energyState.nextRefillAt = now + (REFILL_INTERVAL_MS - remainder);
            }
            saveEnergyState();
        }
    }

    function formatRemainingTime(ms) {
        const totalSec = Math.max(0, Math.ceil(ms / 1000));
        const mins = Math.floor(totalSec / 60);
        const secs = totalSec % 60;
        return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`;
    }

    function startCountdownLoop() {
        if (countdownTimer) clearInterval(countdownTimer);
        countdownTimer = setInterval(() => {
            const prevEnergy = energyState.energy;
            reconcileElapsedRefills();
            if (energyState.energy !== prevEnergy) {
                renderAllEnergyUI();
            } else {
                updateEnergyTimersText();
            }
        }, 1000);
    }

    function getBoltSvg(className = 'w-3.5 h-3.5') {
        return `<svg class="${className}" viewBox="0 0 24 24" fill="currentColor" aria-hidden="true"><path d="M13 2L4.09 12.63a1 1 0 00.77 1.64H11l-1 7.73L18.91 11.37a1 1 0 00-.77-1.64H13l1-7.73z"/></svg>`;
    }

    function updateEnergyTimersText() {
        const timerEls = document.querySelectorAll('[data-lumi-energy-timer]');
        if (!timerEls.length) return;

        if (energyState.isPro) {
            timerEls.forEach(el => { el.textContent = 'Năng lượng vô hạn ∞'; });
            return;
        }
        if (energyState.energy >= MAX_ENERGY || !energyState.nextRefillAt) {
            timerEls.forEach(el => { el.textContent = 'Pin đã sạc đầy 5/5'; });
            return;
        }
        const remaining = energyState.nextRefillAt - Date.now();
        const formatted = formatRemainingTime(remaining);
        timerEls.forEach(el => {
            const mode = el.getAttribute('data-lumi-energy-timer');
            el.textContent = mode === 'compact' ? formatted : `+1 pin sau ${formatted}`;
        });
    }

    function renderBatteryCellsHTML(containerId) {
        const container = document.getElementById(containerId);
        if (!container) return;

        let html = '';
        for (let i = 0; i < MAX_ENERGY; i++) {
            const isCharged = energyState.isPro || i < energyState.energy;
            const isNextCharging = !energyState.isPro && i === energyState.energy;
            const stateClass = energyState.isPro
                ? 'lumi-cell-pro'
                : isCharged
                    ? (energyState.energy === 1 ? 'lumi-cell-critical' : 'lumi-cell-active')
                    : (isNextCharging ? 'lumi-cell-charging' : 'lumi-cell-empty');

            html += `
                <div class="lumi-battery-cell ${stateClass}" data-cell-idx="${i}">
                    ${isCharged ? getBoltSvg('w-3.5 h-3.5') : (isNextCharging ? '<span class="lumi-cell-pulse-dot"></span>' : '')}
                </div>
            `;
        }
        container.innerHTML = html;
    }

    function renderAllEnergyUI() {
        const isPro = energyState.isPro;
        const count = energyState.energy;
        const labelText = isPro ? '∞' : `${count}/${MAX_ENERGY}`;
        const shortText = isPro ? '∞' : `${count}`;

        // 1. Top HUD Pill & Story Reader Header Pill
        const countEl = document.getElementById('topEnergyCountText');
        if (countEl) countEl.textContent = shortText;

        const storyCountEl = document.getElementById('storyHeaderEnergyText');
        if (storyCountEl) storyCountEl.textContent = labelText;

        const topBtn = document.getElementById('topEnergyPillBtn');
        if (topBtn) {
            topBtn.classList.toggle('is-empty', !isPro && count === 0);
            topBtn.classList.toggle('is-low', !isPro && count === 1);
            topBtn.classList.toggle('is-pro', isPro);
        }

        const storyPill = document.getElementById('storyHeaderEnergyPill');
        if (storyPill) {
            storyPill.classList.toggle('is-empty', !isPro && count === 0);
            storyPill.classList.toggle('is-low', !isPro && count === 1);
            storyPill.classList.toggle('is-pro', isPro);
        }

        // 2. Profile Screen Card
        const profileEnergyVal = document.getElementById('profileEnergyValueText');
        if (profileEnergyVal) profileEnergyVal.textContent = isPro ? 'Vô hạn ∞' : `${count} / ${MAX_ENERGY} Pin`;

        // 3. Sheet Header & Status
        const sheetBadge = document.getElementById('lumiEnergySheetBadge');
        if (sheetBadge) sheetBadge.textContent = isPro ? 'PRO ∞' : `${count}/${MAX_ENERGY} PIN`;

        const sheetTitle = document.getElementById('lumiEnergySheetTitle');
        const sheetSubtitle = document.getElementById('lumiEnergySheetSubtitle');
        const practiceBtn = document.getElementById('lumiEnergyPracticeBtn');
        const continueBtn = document.getElementById('lumiEnergyContinueLessonBtn');

        if (sheetTitle && sheetSubtitle) {
            if (isPro) {
                sheetTitle.textContent = 'Pin Lumi Vô Hạn đã kích hoạt!';
                sheetSubtitle.textContent = 'Bạn đang sử dụng gói VibeCard PRO — tự do học mọi câu chuyện không giới hạn năng lượng.';
            } else if (count === 0) {
                sheetTitle.textContent = 'Cáo Lumi đã cạn sạch Pin rồi!';
                sheetSubtitle.textContent = 'Mỗi bài học mới tiêu hao 1 Pin năng lượng. Hãy nạp lại Pin hoặc nâng cấp PRO để học tiếp ngay nhé.';
            } else if (count <= 2) {
                sheetTitle.textContent = `Còn ${count}/${MAX_ENERGY} Pin Năng Lượng`;
                sheetSubtitle.textContent = 'Pin đang yếu dần! Bạn có thể ôn tập nhanh bộ thẻ để nạp thêm +1 Pin miễn phí.';
            } else {
                sheetTitle.textContent = `Pin Năng Lượng Lumi (${count}/${MAX_ENERGY})`;
                sheetSubtitle.textContent = 'Mỗi bài học mới dùng 1 Pin. Tự động sạc lại +1 Pin sau mỗi 15 phút.';
            }
        }

        if (practiceBtn) {
            const isFull = isPro || count >= MAX_ENERGY;
            practiceBtn.disabled = isFull;
            practiceBtn.classList.toggle('opacity-50', isFull);
            practiceBtn.classList.toggle('pointer-events-none', isFull);
            const practiceSub = document.getElementById('lumiEnergyPracticeSub');
            if (practiceSub) {
                practiceSub.textContent = isFull ? 'Pin của bạn đã đầy 5/5' : 'Lật 3 thẻ từ vựng để sạc ngay +1 Pin';
            }
        }

        const watchAdBtn = document.getElementById('lumiEnergyWatchAdBtn');
        if (watchAdBtn) {
            const isFull = isPro || count >= MAX_ENERGY;
            watchAdBtn.disabled = isFull;
            watchAdBtn.classList.toggle('opacity-50', isFull);
            watchAdBtn.classList.toggle('pointer-events-none', isFull);
            const watchAdSub = document.getElementById('lumiEnergyWatchAdSub');
            if (watchAdSub) {
                watchAdSub.textContent = isFull ? 'Pin đã đầy 5/5 • Không cần xem quảng cáo' : 'Xem video ngắn 5s • Nhận ngay +1 Pin';
            }
        }

        if (continueBtn) {
            const canContinue = Boolean(pendingLessonCallback) && (isPro || count > 0);
            continueBtn.classList.toggle('hidden', !canContinue);
        }

        renderBatteryCellsHTML('lumiEnergySheetCells');
        renderBatteryCellsHTML('profileEnergyCellsBar');
        updateEnergyTimersText();
    }

    function showEnergyDrainFloatingBadge() {
        const existing = document.getElementById('lumiEnergyDrainToast');
        if (existing) existing.remove();

        const toast = document.createElement('div');
        toast.id = 'lumiEnergyDrainToast';
        toast.className = 'lumi-energy-drain-toast';
        const remaining = energyState.isPro ? '∞' : `${energyState.energy}/${MAX_ENERGY}`;
        toast.innerHTML = `
            <span class="lumi-drain-icon">${getBoltSvg('w-4 h-4')}</span>
            <span class="lumi-drain-delta">-1 Pin</span>
            <span class="lumi-drain-sep">•</span>
            <span class="lumi-drain-rem">Còn ${remaining}</span>
        `;
        document.body.appendChild(toast);
        requestAnimationFrame(() => toast.classList.add('is-visible'));
        setTimeout(() => {
            toast.classList.remove('is-visible');
            setTimeout(() => toast.remove(), 260);
        }, 2100);
    }

    /**
     * Gatekeeper khi bắt đầu một bài học
     */
    function consumeEnergyForLesson(options = {}, onAllowed = null) {
        reconcileElapsedRefills();

        if (options && options.isReviewMode) {
            if (typeof onAllowed === 'function') onAllowed();
            return true;
        }

        if (energyState.isPro) {
            if (typeof onAllowed === 'function') onAllowed();
            return true;
        }

        if (energyState.energy <= 0) {
            pendingLessonCallback = typeof onAllowed === 'function' ? onAllowed : null;
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
                try { SoundEngine.play(8); } catch (e) {}
            }
            openLumiEnergySheet('depleted');
            return false;
        }

        // Deduct 1 Energy
        energyState.energy = Math.max(0, energyState.energy - 1);
        energyState.totalLessonsStarted = (energyState.totalLessonsStarted || 0) + 1;
        currentSessionDeducted = true;
        if (energyState.energy < MAX_ENERGY && !energyState.nextRefillAt) {
            energyState.nextRefillAt = Date.now() + REFILL_INTERVAL_MS;
        }
        saveEnergyState();
        renderAllEnergyUI();
        showEnergyDrainFloatingBadge();

        if (typeof onAllowed === 'function') {
            onAllowed();
        }
        return true;
    }

    function refillEnergy(amount = 1, reasonToast = '') {
        reconcileElapsedRefills();
        energyState.energy = Math.min(MAX_ENERGY, energyState.energy + amount);
        if (energyState.energy >= MAX_ENERGY) {
            energyState.nextRefillAt = null;
        }
        saveEnergyState();
        renderAllEnergyUI();

        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
            try { SoundEngine.play(1); } catch (e) {}
        }
        if (reasonToast && typeof window.showDictToast === 'function') {
            window.showDictToast(reasonToast);
        }
    }

    function activateProUnlimitedEnergy() {
        energyState.isPro = true;
        energyState.energy = MAX_ENERGY;
        energyState.nextRefillAt = null;
        saveEnergyState();
        renderAllEnergyUI();

        if (typeof window.closeProSheet === 'function') window.closeProSheet();
        closeLumiEnergySheet();

        if (typeof confetti === 'function') {
            try { confetti({ particleCount: 55, spread: 65, origin: { y: 0.7 } }); } catch (e) {}
        }
        if (typeof window.showDictToast === 'function') {
            window.showDictToast('👑 Đã kích hoạt VibeCard PRO: Pin Năng Lượng Vô Hạn (∞)!');
        }

        if (pendingLessonCallback) {
            const cb = pendingLessonCallback;
            pendingLessonCallback = null;
            setTimeout(() => cb(), 320);
        }
    }

    function practiceFlashcardsToRefillEnergy() {
        closeLumiEnergySheet();
        refillEnergy(1, '⚡ Đã nạp +1 Pin Năng Lượng! Mở bộ thẻ ôn tập nhanh...');

        if (typeof window.openLessonFlashcardReview === 'function') {
            window.openLessonFlashcardReview({
                title: 'Ôn tập Nạp Pin Lumi (+1 ⚡)',
                openDirectReview: true,
                fromStoryReader: false
            });
        }
    }

    // ---------------------------------------------------------
    // 🎬 REWARDED AD DEMO PLAYER (5-SECOND ADMOB UI PREVIEW)
    // ---------------------------------------------------------
    let rewardAdInterval = null;
    let isRewardAdCompleted = false;

    function watchRewardedAdToRefillEnergy() {
        if (energyState.isPro || energyState.energy >= MAX_ENERGY) return;

        const adModal = document.getElementById('lumiRewardAdDemoModal');
        const timerBadge = document.getElementById('rewardAdDemoTimerText');
        const progressBar = document.getElementById('rewardAdDemoProgressFill');
        const claimBtn = document.getElementById('rewardAdDemoClaimBtn');
        const closeBtn = document.getElementById('rewardAdDemoCloseBtn');
        const statusPill = document.getElementById('rewardAdDemoStatusPill');

        if (!adModal) {
            refillEnergy(1, '🎬 Đã xem xong quảng cáo: Nhận +1 Pin Năng Lượng Lumi!');
            return;
        }

        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
            try { SoundEngine.play(1); } catch (e) {}
        }

        isRewardAdCompleted = false;
        let secLeft = 5;
        const totalSec = 5;

        if (timerBadge) timerBadge.textContent = `Nhận thưởng sau ${secLeft}s`;
        if (progressBar) {
            progressBar.style.transition = 'none';
            progressBar.style.width = '0%';
        }
        if (claimBtn) {
            claimBtn.disabled = true;
            claimBtn.className = 'w-full h-[48px] rounded-2xl bg-white/10 text-white/45 font-extrabold text-[14px] flex items-center justify-center gap-2 transition-all cursor-not-allowed';
            claimBtn.innerHTML = `<span>Đang phát quảng cáo (${secLeft}s)...</span>`;
        }
        if (closeBtn) closeBtn.classList.add('opacity-40');
        if (statusPill) {
            statusPill.textContent = 'QUẢNG CÁO NHẬN THƯỞNG • +1 PIN ⚡';
            statusPill.className = 'px-2.5 py-1 rounded-full bg-black/55 border border-white/15 text-[10.5px] font-black text-[#FDE68A] tracking-wider';
        }

        adModal.classList.remove('hidden');
        void adModal.offsetWidth;
        adModal.classList.remove('opacity-0');

        requestAnimationFrame(() => {
            if (progressBar) {
                progressBar.style.transition = `width ${totalSec}s linear`;
                progressBar.style.width = '100%';
            }
        });

        if (rewardAdInterval) clearInterval(rewardAdInterval);
        rewardAdInterval = setInterval(() => {
            secLeft--;
            if (secLeft > 0) {
                if (timerBadge) timerBadge.textContent = `Nhận thưởng sau ${secLeft}s`;
                if (claimBtn) claimBtn.innerHTML = `<span>Đang phát quảng cáo (${secLeft}s)...</span>`;
            } else {
                clearInterval(rewardAdInterval);
                rewardAdInterval = null;
                isRewardAdCompleted = true;

                if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
                    try { SoundEngine.play(4); } catch (e) {}
                }
                if (timerBadge) timerBadge.textContent = '✓ Đã đủ điều kiện nhận +1 Pin';
                if (closeBtn) closeBtn.classList.remove('opacity-40');
                if (statusPill) {
                    statusPill.textContent = '✓ HOÀN THÀNH • ĐÃ MỞ KHÓA +1 PIN ⚡';
                    statusPill.className = 'px-2.5 py-1 rounded-full bg-[#3C4D00] border border-[#B8D166]/60 text-[10.5px] font-black text-[#D4EE7F] tracking-wider';
                }
                if (claimBtn) {
                    claimBtn.disabled = false;
                    claimBtn.className = 'w-full h-[48px] rounded-2xl bg-[#B8D166] hover:brightness-105 active:scale-[0.98] text-[#263300] font-black text-[14.5px] flex items-center justify-center gap-2 shadow-[0_8px_24px_rgba(184,209,102,0.35)] transition-all cursor-pointer';
                    claimBtn.innerHTML = `
                        ${getBoltSvg('w-4 h-4')}
                        <span>Nhận +1 Pin & Học tiếp ngay</span>
                    `;
                }
            }
        }, 1000);
    }

    function claimRewardedAdEnergyDemo() {
        if (!isRewardAdCompleted) return;
        closeRewardedAdDemo(true);
        refillEnergy(1, '🎉 Đã nhận +1 Pin Năng Lượng từ Quảng cáo nhận thưởng!');

        if (pendingLessonCallback) {
            const cb = pendingLessonCallback;
            pendingLessonCallback = null;
            closeLumiEnergySheet();
            setTimeout(() => consumeEnergyForLesson({}, cb), 240);
        }
    }

    function closeRewardedAdDemo(silent = false) {
        if (rewardAdInterval) {
            clearInterval(rewardAdInterval);
            rewardAdInterval = null;
        }
        const adModal = document.getElementById('lumiRewardAdDemoModal');
        if (adModal) {
            adModal.classList.add('opacity-0');
            setTimeout(() => adModal.classList.add('hidden'), 180);
        }
        if (!silent && !isRewardAdCompleted && typeof window.showDictToast === 'function') {
            window.showDictToast('⚠️ Đã đóng quảng cáo sớm nên chưa nhận được +1 Pin.');
        }
        if (!silent && isRewardAdCompleted) {
            refillEnergy(1, '🎉 Đã nhận +1 Pin Năng Lượng từ Quảng cáo nhận thưởng!');
        }
    }

    function simulateDrainAllEnergyForDemo() {
        energyState.isPro = false;
        energyState.energy = 0;
        energyState.nextRefillAt = Date.now() + REFILL_INTERVAL_MS;
        saveEnergyState();
        renderAllEnergyUI();
        if (typeof window.showDictToast === 'function') {
            window.showDictToast('🧪 Demo: Đã đưa Pin Lumi về 0/5! Hãy thử bấm Xem Quảng Cáo (+1 Pin).');
        }
    }

    function openLumiEnergySheet(mode = 'inspect') {
        reconcileElapsedRefills();
        renderAllEnergyUI();
        const modal = document.getElementById('lumiEnergySheetModal');
        const content = document.getElementById('lumiEnergySheetContent');
        if (!modal || !content) return;

        modal.setAttribute('data-mode', mode);
        modal.classList.remove('hidden');
        void modal.offsetWidth;
        modal.classList.remove('opacity-0');
        content.classList.remove('translate-y-full');
    }

    function closeLumiEnergySheet() {
        const modal = document.getElementById('lumiEnergySheetModal');
        const content = document.getElementById('lumiEnergySheetContent');
        if (!modal || !content) return;

        modal.classList.add('opacity-0');
        content.classList.add('translate-y-full');
        setTimeout(() => {
            modal.classList.add('hidden');
        }, 220);
    }

    function continuePendingLessonFromSheet() {
        if (energyState.isPro || energyState.energy > 0) {
            const cb = pendingLessonCallback;
            pendingLessonCallback = null;
            closeLumiEnergySheet();
            if (cb) setTimeout(() => consumeEnergyForLesson({}, cb), 200);
        }
    }

    // Initialize on load
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            loadEnergyState();
            renderAllEnergyUI();
            startCountdownLoop();
        });
    } else {
        loadEnergyState();
        renderAllEnergyUI();
        startCountdownLoop();
    }

    // Public APIs
    window.LumiEnergy = {
        getState: () => ({ ...energyState }),
        consumeForLesson: consumeEnergyForLesson,
        onLessonCompleted: onLessonCompletedDeduct,
        markSessionStarted: markLessonSessionStarted,
        refill: refillEnergy,
        activatePro: activateProUnlimitedEnergy,
        practiceToRefill: practiceFlashcardsToRefillEnergy,
        watchAdToRefill: watchRewardedAdToRefillEnergy,
        claimRewardAd: claimRewardedAdEnergyDemo,
        closeRewardAd: closeRewardedAdDemo,
        simulateZero: simulateDrainAllEnergyForDemo,
        openSheet: openLumiEnergySheet,
        closeSheet: closeLumiEnergySheet,
        continuePending: continuePendingLessonFromSheet,
        renderUI: renderAllEnergyUI
    };

    window.openLumiEnergySheet = openLumiEnergySheet;
    window.closeLumiEnergySheet = closeLumiEnergySheet;
    window.practiceFlashcardsToRefillEnergy = practiceFlashcardsToRefillEnergy;
    window.watchRewardedAdToRefillEnergy = watchRewardedAdToRefillEnergy;
    window.claimRewardedAdEnergyDemo = claimRewardedAdEnergyDemo;
    window.closeRewardedAdDemo = closeRewardedAdDemo;
    window.activateProUnlimitedEnergy = activateProUnlimitedEnergy;
    window.simulateDrainAllEnergyForDemo = simulateDrainAllEnergyForDemo;
    window.continuePendingLessonFromSheet = continuePendingLessonFromSheet;

})(window);
