
// Nhận thưởng rương kho báu: mở quà + cộng XP + lưu tiến độ
function claimRoadmapBonusChest(chapterIdx = currentRoadmapChapterIdx) {
    const ch = roadmapChaptersData[chapterIdx] || roadmapChaptersData[0];
    const chestNode = ch.nodes.find(n => n.type === 'chest');
    
    if (chestNode && chestNode.status === 'completed') {
        if (typeof showDictToast === 'function') {
            showDictToast('✨ Rương này bạn đã nhận rồi (+150 XP)!');
        }
        return;
    }

    if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
        SoundEngine.play(1);
    }

    // Hoàn thành rương và mở bài kế tiếp
    if (chestNode) {
        chestNode.status = 'completed';
        const chestIdx = ch.nodes.indexOf(chestNode);
        if (chestIdx + 1 < ch.nodes.length) {
            ch.nodes[chestIdx + 1].status = 'active';
            ch.activeNodeIndex = chestIdx + 1;
        }
        ch.progressText = getRoadmapProgressLabel(ch);
        saveRoadmapProgress();

        // Render lại và hiệu ứng
        selectRoadmapChapter(chapterIdx, { keepScroll: true });
    }

    if (typeof showDictToast === 'function') {
        showDictToast('🎁 Chúc mừng! Bạn nhận được +150 XP từ Rương Kho Báu!');
    }
}

// Đánh dấu bài kế tiếp là hoàn thành và chạy chuỗi phản hồi UI:
// highlight thẻ → cuộn tới nhân vật → tô thêm 1/5 → nhân vật lên tiếng → ăn mừng nếu đủ 5/5
function advanceRoadmapProgress(chapterIdx = currentRoadmapChapterIdx) {
    const ch = roadmapChaptersData[chapterIdx];
    if (!ch) return;

    const nextIdx = ch.nodes.findIndex(n => n.status !== 'completed');
    if (nextIdx < 0) return;

    // Kiểm tra nếu Pin đã cạn (0/5) và chưa bị trừ ở phiên này thì chặn lại
    if (window.LumiEnergy && typeof window.LumiEnergy.getState === 'function') {
        const st = window.LumiEnergy.getState();
        if (!st.isPro && st.energy <= 0 && typeof window.openLumiEnergySheet === 'function') {
            window.openLumiEnergySheet('depleted');
            return;
        }
    }

    const nextUnit = ch.nodes[nextIdx];
    nextUnit.status = 'completed';
    if (nextIdx + 1 < ch.nodes.length) {
        ch.nodes[nextIdx + 1].status = 'active';
        ch.activeNodeIndex = nextIdx + 1;
    } else {
        ch.activeNodeIndex = -1;
    }
    ch.progressText = getRoadmapProgressLabel(ch);
    saveRoadmapProgress();

    // Đảm bảo trừ -1 Pin nếu người dùng bấm Hoàn thành bài nhanh mà chưa đi qua bước mở bài
    if (window.LumiEnergy && typeof window.LumiEnergy.onLessonCompleted === 'function') {
        window.LumiEnergy.onLessonCompleted();
    }

    const loop = Math.floor(nextIdx / ROADMAP_LESSONS_PER_LOOP);
    const loopStart = loop * ROADMAP_LESSONS_PER_LOOP;
    const loopDone = ch.nodes.slice(loopStart, loopStart + ROADMAP_LESSONS_PER_LOOP)
        .every(n => n.status === 'completed');

    roadmapUiState.justCompletedNum = nextUnit.num;
    if (nextIdx + 1 < ch.nodes.length) {
        roadmapUiState.justUnlockedNum = ch.nodes[nextIdx + 1].num;
    }
    if (chapterIdx === currentRoadmapChapterIdx) {
        selectRoadmapChapter(chapterIdx, { keepScroll: true });
        scrollRoadmapToSection(loop + 1);

        // Kích hoạt nhân vật nhún nhảy & nói câu cảm ơn sau 600ms
        setTimeout(() => {
            const charEl = document.querySelector(`.mb-section[data-loop="${loop + 1}"] .mb-char`);
            if (charEl) handleCharacterTap(charEl);
        }, 600);

        // Tự động cuộn nhẹ đến bài học mới được mở khóa sau 1400ms
        if (nextIdx + 1 < ch.nodes.length) {
            setTimeout(() => scrollRoadmapToActive(true), 1400);
        }
    }
    setTimeout(() => {
        roadmapUiState.justCompletedNum = null;
        roadmapUiState.justUnlockedNum = null;
    }, 2200);

    if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
        SoundEngine.play(1);
    }

    if (typeof showDictToast === 'function') {
        showDictToast(`🎉 Hoàn thành Bài ${nextUnit.num}: "${nextUnit.title}"! Nhân vật được tô thêm 1/5 màu ✨`);
    }

    if (loopDone) {
        setTimeout(() => showRoadmapCelebration(ch, loop), 1600);
    }
}

// Tên gọi rõ nghĩa để màn bài học gọi khi người dùng học xong
const completeRoadmapLesson = advanceRoadmapProgress;

// Khởi tạo ban đầu khi tài liệu đã sẵn sàng
if (typeof document !== 'undefined') {
    const initRoadmap = () => {
        bindRoadmapListeners();
        loadRoadmapProgress();
        selectRoadmapChapter(currentRoadmapChapterIdx, { animateIn: true });
    };
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', initRoadmap);
    } else {
        setTimeout(initRoadmap, 100);
    }
}

// -------------------------------------------------------------
// 🧪 HỖ TRỢ TEST & GIẢ LẬP TIẾN ĐỘ ROADMAP
// -------------------------------------------------------------
window.advanceRoadmapProgress = advanceRoadmapProgress;
window.completeRoadmapLesson = advanceRoadmapProgress;

window.simulateCompleteCurrentLesson = function () {
    if (typeof window.closeLessonIntroScreen === 'function') {
        window.closeLessonIntroScreen();
    }
    setTimeout(() => {
        advanceRoadmapProgress(currentRoadmapChapterIdx);
    }, 280);
};

window.resetRoadmapProgressForTest = function () {
    try {
        localStorage.removeItem(ROADMAP_STORAGE_KEY);
    } catch (e) {}
    roadmapChaptersData.forEach((ch, chIdx) => {
        ch.nodes.forEach((n, nIdx) => {
            if (chIdx === 0 && nIdx < 2) {
                n.status = 'completed';
            } else if (chIdx === 0 && nIdx === 2) {
                n.status = 'active';
            } else if (n.type === 'chest') {
                n.status = 'chest';
            } else if (n.type === 'boss') {
                n.status = 'boss';
            } else {
                n.status = 'locked';
            }
        });
        ch.activeNodeIndex = chIdx === 0 ? 2 : -1;
        ch.progressText = getRoadmapProgressLabel(ch);
    });
    currentRoadmapChapterIdx = 0;
    saveRoadmapProgress();
    selectRoadmapChapter(0, { animateIn: true });
    if (typeof showDictToast === 'function') {
        showDictToast('↺ Đã reset tiến độ Roadmap về mặc định (2/10 bài)!');
    }
};

window.roadmapChaptersData = roadmapChaptersData;
window.selectRoadmapChapter = selectRoadmapChapter;
window.handleParchmentNodeClick = handleParchmentNodeClick;
window.claimRoadmapBonusChest = claimRoadmapBonusChest;
window.advanceRoadmapProgress = advanceRoadmapProgress;
window.completeRoadmapLesson = advanceRoadmapProgress;
window.simulateCompleteCurrentLesson = simulateCompleteCurrentLesson;
window.resetRoadmapProgressForTest = resetRoadmapProgressForTest;
window.saveRoadmapProgress = saveRoadmapProgress;
window.loadRoadmapProgress = loadRoadmapProgress;
window.openRoadmapChapterSheet = openRoadmapChapterSheet;
window.closeRoadmapChapterSheet = closeRoadmapChapterSheet;
window.handleChapterSheetSelect = handleChapterSheetSelect;

// Tương tác Easter Egg khi người chơi chạm vào Đạo Cụ Môi Trường (Nấm, Đá Cổ Ngữ, Đèn Đá, Pha Lê)
window.triggerRoadmapPropEasterEgg = function (el, label, event) {
    if (event && typeof event.stopPropagation === 'function') event.stopPropagation();
    if (!el) return;
    el.classList.remove('is-prop-bouncing');
    void el.offsetWidth;
    el.classList.add('is-prop-bouncing');

    const oldToast = el.querySelector('.sq-prop-toast');
    if (oldToast) oldToast.remove();

    const toast = document.createElement('div');
    toast.className = 'sq-prop-toast';
    toast.innerHTML = `<span class="sq-prop-spark-a">✦</span>${label || '+5 ✦'}<span class="sq-prop-spark-b">✦</span>`;
    el.appendChild(toast);

    setTimeout(() => {
        el.classList.remove('is-prop-bouncing');
        if (toast.parentNode) toast.remove();
    }, 1150);
};

// Tự động đồng bộ roadmap data từ JSON nếu có
async function syncRoadmapWithJson() {
    if (typeof fetch !== 'function') return;
    try {
        const resp = await fetch('js/roadmapChaptersData.json?v=20261020_v22_fableforest');
        if (resp.ok) {
            const data = await resp.json();
            if (Array.isArray(data) && data.length > 0) {
                roadmapChaptersData = data;
                window.roadmapChaptersData = data;
                if (typeof loadRoadmapProgress === 'function') {
                    loadRoadmapProgress();
                }
                const sheet = document.getElementById('roadmapChapterSheet');
                if (sheet && !sheet.classList.contains('hidden')) {
                    renderRoadmapChapterSheetList();
                }
            }
        }
    } catch (_) {}
}

if (typeof window !== 'undefined') {
    window.syncRoadmapWithJson = syncRoadmapWithJson;
    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', syncRoadmapWithJson);
    } else {
        syncRoadmapWithJson();
    }
}

