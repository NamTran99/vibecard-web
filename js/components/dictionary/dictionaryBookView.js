// ========================================================
// 📖 DICTIONARY BOOK VIEW & 3D FLIP SOUNDS
// Module: js/components/dictionary/dictionaryBookView.js
// Ceiling: < 300 lines | Role: Book View & Interactive Flip
// ========================================================

(function (window) {
    'use strict';

    let currentBookTab = 'all';

    function renderDictionaryBookView() {
        const container = document.getElementById('dictBookListContainer');
        if (!container) return;

        const dictData = (typeof fullDictData !== 'undefined') ? fullDictData : {};
        const words = Object.keys(dictData);

        container.innerHTML = words.map((w, idx) => {
            const item = dictData[w];
            return `
            <div onclick="executeFullLookup('${w.replace(/'/g, "\\'")}')" class="p-4 rounded-2xl bg-[#20211C] border border-[#46483C] hover:border-[#B8D166]/50 transition-all cursor-pointer flex items-center justify-between mb-2.5">
                <div class="flex items-center gap-3">
                    <span class="w-8 h-8 rounded-xl bg-[#252621] text-[#B8D166] font-bold text-xs flex items-center justify-center shrink-0">${idx + 1}</span>
                    <div>
                        <div class="flex items-center gap-2">
                            <span class="text-sm font-black text-[#E5E3DB]">${item.word}</span>
                            <span class="text-[10px] font-bold text-[#A1D0C5] bg-[#214E46] px-2 py-0.5 rounded">${item.type}</span>
                        </div>
                        <p class="text-xs text-[#C7C8B8] mt-0.5 line-clamp-1">${item.meaningVi}</p>
                    </div>
                </div>
                <span class="text-xs text-[#909283]">➔</span>
            </div>
            `;
        }).join('');
    }

    function switchDictBookTab(tab) {
        currentBookTab = tab;
        const tabBtns = document.querySelectorAll('.dict-book-tab-btn');
        tabBtns.forEach(btn => {
            btn.classList.remove('active', 'bg-[#3C4D00]', 'text-[#D4EE7F]', 'font-bold');
            btn.classList.add('text-[#909283]');
        });
        const activeBtn = document.getElementById(`dictBookTabBtn-${tab}`);
        if (activeBtn) {
            activeBtn.classList.add('active', 'bg-[#3C4D00]', 'text-[#D4EE7F]', 'font-bold');
            activeBtn.classList.remove('text-[#909283]');
        }
        renderDictionaryBookView();
    }

    function updateDictionaryBookLanguage(lang) {
        const langEl = document.getElementById('dictBookLangLabel');
        if (langEl) langEl.innerText = lang || 'EN';
    }

    // 3D Card Sound Utility Helpers
    function playDing() {
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
            SoundEngine.play(4); // Duolingo Ting
        }
    }

    function playSwoosh() {
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
            SoundEngine.play(1); // Gentle Swoosh
        }
    }

    function playFlip(toBack) {
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
            SoundEngine.play(8); // Wood Click for flip
        }
    }

    // Attach to window
    window.renderDictionaryBookView = renderDictionaryBookView;
    window.switchDictBookTab = switchDictBookTab;
    window.updateDictionaryBookLanguage = updateDictionaryBookLanguage;
    window.playDing = playDing;
    window.playSwoosh = playSwoosh;
    window.playFlip = playFlip;

})(window);
