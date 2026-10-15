// Trạng thái hiển thị của phiên hiện tại (chỉ phục vụ UI, không đổi dữ liệu bài học)
const roadmapUiState = {
    lastFill: {},            // `${chapterId}-${loop}` -> % đã hiển thị lần trước để animate phần tô thêm
    justCompletedNum: null,  // số thứ tự bài vừa hoàn thành để highlight thẻ + cho nhân vật lên tiếng
    listenersBound: false
};

const roadmapRaf = typeof requestAnimationFrame === 'function'
    ? requestAnimationFrame
    : (fn) => setTimeout(fn, 16);

function getRoadmapCompletedCount(chapter) {
    return chapter.nodes.filter(n => n.status === 'completed').length;
}

// Chương bị khóa khi chưa có bài nào hoàn thành hoặc đang học
function isRoadmapChapterLocked(chapter) {
    return !chapter.nodes.some((n, i) =>
        n.status === 'completed' || resolveRoadmapNodeState(chapter, i) === 'active');
}

// -------------------------------------------------------------
// 💾 LOCALSTORAGE PERSISTENCE: LƯU & KHÔI PHỤC TIẾN ĐỘ ROADMAP
// -------------------------------------------------------------
const ROADMAP_STORAGE_KEY = 'mindcard-roadmap-progress-v1';

function saveRoadmapProgress() {
    try {
        if (typeof localStorage === 'undefined') return;
        const payload = {
            currentChapter: currentRoadmapChapterIdx,
            chapters: roadmapChaptersData.map(ch => ({
                id: ch.id,
                activeNodeIndex: ch.activeNodeIndex,
                nodes: ch.nodes.map(n => ({
                    num: n.num,
                    status: n.status
                }))
            }))
        };
        localStorage.setItem(ROADMAP_STORAGE_KEY, JSON.stringify(payload));
    } catch (e) {
        console.warn('Cannot save roadmap progress:', e);
    }
}

function loadRoadmapProgress() {
    try {
        if (typeof localStorage === 'undefined') return false;
        const raw = localStorage.getItem(ROADMAP_STORAGE_KEY);
        if (!raw) return false;
        const data = JSON.parse(raw);
        if (!data || !Array.isArray(data.chapters)) return false;

        data.chapters.forEach(savedCh => {
            const ch = roadmapChaptersData.find(c => c.id === savedCh.id);
            if (!ch) return;
            if (typeof savedCh.activeNodeIndex === 'number') {
                ch.activeNodeIndex = savedCh.activeNodeIndex;
            }
            if (Array.isArray(savedCh.nodes)) {
                savedCh.nodes.forEach(savedNode => {
                    const node = ch.nodes.find(n => n.num === savedNode.num);
                    if (node && savedNode.status) {
                        node.status = savedNode.status;
                    }
                });
            }
            ch.progressText = getRoadmapProgressLabel(ch);
        });

        if (typeof data.currentChapter === 'number' && data.currentChapter >= 0 && data.currentChapter < roadmapChaptersData.length) {
            currentRoadmapChapterIdx = data.currentChapter;
        }
        return true;
    } catch (e) {
        console.warn('Cannot load roadmap progress:', e);
        return false;
    }
}

window.saveRoadmapProgress = saveRoadmapProgress;
window.loadRoadmapProgress = loadRoadmapProgress;
