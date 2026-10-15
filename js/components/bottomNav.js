// ========================================================
// 🧭 LIQUID BOTTOM NAVIGATION & DOODLE ICON ANIMATIONS
// ========================================================

const navIconAnimClasses = ['anim-nav-home', 'anim-nav-create', 'anim-nav-library', 'anim-nav-profile'];

// Cached DOM Elements for high-performance sub-millisecond tab switching
const BottomNavDOM = {
    screens: [],
    buttons: [],
    labels: [],
    icons: [],
    dictScreen: null,
    scrollContainer: null,
    initialized: false,

    init() {
        if (this.initialized) return;
        this.dictScreen = document.getElementById('screenDictionary');
        this.scrollContainer = document.querySelector('.scroll-container');

        for (let i = 0; i < 4; i++) {
            this.screens[i] = document.getElementById(`tabScreen-${i}`);
            this.buttons[i] = document.getElementById(`bottomNavBtn-${i}`);
            this.labels[i] = document.getElementById(`bottomNavLabel-${i}`);
            this.icons[i] = document.getElementById(`bottomNavIcon-${i}`);
        }
        this.initialized = true;
    }
};

function updateBottomNavState(index) {
    BottomNavDOM.init();

    // Toggle active expanding pill state on buttons
    for (let i = 0; i < 4; i++) {
        const btn = BottomNavDOM.buttons[i];
        if (!btn) continue;

        if (i === index) {
            btn.classList.add('active');
            btn.setAttribute('aria-selected', 'true');
        } else {
            btn.classList.remove('active');
            btn.setAttribute('aria-selected', 'false');
        }
    }
}

let currentNavIndex = 0;

function switchBottomNav(index) {
    BottomNavDOM.init();
    currentNavIndex = index;
    updateBottomNavState(index);

    // Toggle screens 0, 1, 2, 3
    for (let i = 0; i < 4; i++) {
        const screen = BottomNavDOM.screens[i];
        if (screen) {
            if (i === index) {
                screen.classList.remove('hidden');
                if (i > 0) screen.classList.add('flex');
            } else {
                screen.classList.add('hidden');
                if (i > 0) screen.classList.remove('flex');
            }
        }
    }

    // Close full-overlay dictionary if switching away
    const dictScreen = BottomNavDOM.dictScreen;
    if (dictScreen && !dictScreen.classList.contains('hidden') && !dictScreen.classList.contains('translate-x-full')) {
        dictScreen.classList.add('translate-x-full');
        setTimeout(() => {
            dictScreen.classList.add('hidden');
        }, 300);
    }

    if (index === 2) {
        if (typeof renderLibraryUI === 'function') {
            renderLibraryUI();
        }
    }

    if (index === 1) {
        if (typeof playCreateScreenEntrance === 'function') {
            playCreateScreenEntrance();
        } else {
            const screen1 = BottomNavDOM.screens[1];
            if (screen1) {
                const items = screen1.querySelectorAll('.anim-create-item');
                items.forEach((item, idx) => {
                    item.style.animation = 'none';
                    void item.offsetWidth;
                    item.style.animation = `createItemCascade 0.4s cubic-bezier(0.16, 1, 0.3, 1) ${idx * 60}ms backwards`;
                });
            }
        }
    }

    if (index === 0) {
        const scrollContainer = BottomNavDOM.scrollContainer;
        if (scrollContainer) scrollContainer.scrollTo({ top: 0, behavior: 'smooth' });
    }
}

const lumiSmartTips = [
    "🦊 Lumi: Bấm vào thẻ Tra từ điển để bóc tách ngữ cảnh, IPA và lưu thẻ 1-chạm nhé!",
    "🦊 Lumi: Chụp ảnh trang sách hoặc tài liệu để quét chữ OCR tạo thẻ tức thì!",
    "🦊 Lumi: Dán link video Youtube để Lumi bóc tách từ vựng kèm phụ đề nhé!",
    "🦊 Lumi: Bạn có thể nhấn vào nút ＋ ở bất kỳ thẻ từ nào để lưu vào sổ từ vựng!",
    "🦊 Lumi: Học đều đặn 5 từ mỗi ngày cùng Lumi sẽ giúp bạn nhớ sâu gấp 3 lần!"
];
let currentLumiTipIdx = 0;
