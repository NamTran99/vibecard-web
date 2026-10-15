// ========================================================
// 🔍 DICTIONARY SEARCH, AUTOCOMPLETE & VOICE LOOKUP
// Module: js/components/dictionary/dictionarySearch.js
// Ceiling: < 320 lines | Role: Search Engine & Input Handlers
// ========================================================

(function (window) {
    'use strict';

    window.recentHistory = window.recentHistory || ['resilient', 'break the ice', 'serendipity', 'ubiquitous', 'ephemeral'];

    const autocompleteVocabList = [
        'resilient', 'resolve', 'resourceful', 'respectful', 'restoration',
        'serendipity', 'serene', 'seamless', 'scrutinize', 'break the ice',
        'brilliant', 'breathtaking', 'eloquent', 'ephemeral', 'empathy',
        'elevate', 'ubiquitous', 'unprecedented', 'profound', 'pragmatic',
        'plausible', 'meticulous', 'milestone', 'aesthetic', 'grit',
        'piece of cake', 'once in a blue moon', 'hit the nail on the head',
        'leverage', 'synergy', 'viable'
    ];

    function onSearchInput(val) {
        const clearBtn = document.getElementById('clearSearchBtn');
        const dropdown = document.getElementById('autocompleteDropdown');
        const shortcuts = document.getElementById('searchShortcuts');
        const actionBtn = document.getElementById('dictSearchActionBtn');

        if (!val || val.trim().length === 0) {
            if (clearBtn) clearBtn.classList.add('hidden');
            if (dropdown) dropdown.classList.add('hidden');
            if (shortcuts) shortcuts.classList.remove('hidden');
            if (actionBtn) actionBtn.classList.remove('has-query');
            if (typeof showDictEmptyState === 'function') showDictEmptyState();
            return;
        }

        if (clearBtn) clearBtn.classList.remove('hidden');
        if (shortcuts) shortcuts.classList.add('hidden');
        if (actionBtn) actionBtn.classList.add('has-query');

        const q = val.trim().toLowerCase();
        const dictData = (typeof fullDictData !== 'undefined') ? fullDictData : {};
        const allWords = [...new Set([
            ...autocompleteVocabList,
            ...Object.keys(dictData)
        ])];

        const prefixMatches = allWords.filter(w => w.toLowerCase().startsWith(q));
        const subMatches = allWords.filter(w => !w.toLowerCase().startsWith(q) && w.toLowerCase().includes(q));
        const combined = [...new Set([...prefixMatches, ...subMatches])].slice(0, 8);

        if (combined.length > 0) {
            let html = combined.map(word => `
                <div onclick="executeFullLookup('${word.replace(/'/g, "\\'")}')" class="px-5 py-3.5 border-b border-[#46483C]/40 hover:bg-[#252621] active:bg-[#30312B] transition-colors cursor-pointer flex items-center justify-between group">
                    <span class="text-[15.5px] text-[#E5E3DB] group-hover:text-[#D4EE7F] font-normal tracking-wide">${word}</span>
                    <span class="text-xs text-[#909283] group-hover:text-[#B8D166] transition-colors">Tra từ ➔</span>
                </div>
            `).join('');

            html += `
                <div onclick="openManualMeaningModal('${q.replace(/'/g, "\\'")}')" class="px-5 py-3.5 bg-[#1B1C17] border-t border-[#46483C] hover:bg-[#20211C] transition-colors cursor-pointer flex items-center justify-between group sticky bottom-0">
                    <div class="flex items-center gap-2.5">
                        <span class="text-[#B8D166] text-sm">✍️</span>
                        <div>
                            <span class="text-[13px] text-[#E5E3DB] font-bold">Không tìm thấy nghĩa phù hợp?</span>
                            <span class="text-[11px] text-[#C7C8B8] block">Tự nhập nghĩa mới cho "${val.trim()}"</span>
                        </div>
                    </div>
                    <span class="text-xs text-[#909283] group-hover:text-[#B8D166] transition-colors">➔</span>
                </div>
            `;
            if (dropdown) {
                dropdown.innerHTML = html;
                dropdown.classList.remove('hidden');
            }
        } else {
            if (dropdown) {
                dropdown.innerHTML = `
                    <div class="px-5 py-7 text-center space-y-3">
                        <div class="w-10 h-10 rounded-2xl bg-[#20211C] border border-[#46483C] flex items-center justify-center text-lg mx-auto text-[#909283]">
                            🔍
                        </div>
                        <div>
                            <div class="text-[13.5px] font-bold text-[#E5E3DB]">Chưa có kết quả từ điển cho "${val.trim()}"</div>
                            <p class="text-[11px] text-[#C7C8B8] mt-0.5">Bạn có thể tự viết nghĩa & tạo thẻ Flashcard ngay</p>
                        </div>
                        <button onclick="openManualMeaningModal('${q.replace(/'/g, "\\'")}')" class="py-2 px-3.5 rounded-xl bg-[#B8D166] hover:bg-[#B8D166] hover:brightness-105 text-[#283500] font-black text-xs inline-flex items-center gap-1.5 shadow-md active:scale-95 transition-all cursor-pointer">
                            <span>✍️</span>
                            <span>Tự nhập nghĩa cho "${val.trim()}"</span>
                        </button>
                    </div>
                `;
                dropdown.classList.remove('hidden');
            }
        }
    }

    function clearSearchInput() {
        const input = document.getElementById('fullDictSearchInput');
        if (input) input.value = '';
        const actionBtn = document.getElementById('dictSearchActionBtn');
        if (actionBtn) actionBtn.classList.remove('has-query');
        if (typeof showDictEmptyState === 'function') showDictEmptyState();
        if (input) input.focus();
    }

    // ========================================================
    // 🎙️ VOICE SEARCH VIA WEB SPEECH RECOGNITION (FIXES BUTTON)
    // ========================================================
    let isListeningVoice = false;

    function triggerDedicatedVoiceLookup() {
        if (!('webkitSpeechRecognition' in window) && !('SpeechRecognition' in window)) {
            if (typeof showDictToast === 'function') {
                showDictToast('Trình duyệt chưa hỗ trợ nhận diện giọng nói!');
            }
            return;
        }

        if (isListeningVoice) return;
        isListeningVoice = true;

        const SpeechRec = window.SpeechRecognition || window.webkitSpeechRecognition;
        const recognition = new SpeechRec();
        recognition.lang = 'en-US';
        recognition.continuous = false;
        recognition.interimResults = false;

        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
        if (typeof showDictToast === 'function') {
            showDictToast('🎙️ Đang lắng nghe... Hãy nói từ tiếng Anh!');
        }

        const input = document.getElementById('fullDictSearchInput');
        if (input) input.placeholder = 'Đang lắng nghe...';

        recognition.onresult = function (event) {
            isListeningVoice = false;
            if (input) input.placeholder = 'Nhập từ vựng, cụm từ cần tra...';
            const spokenWord = event.results[0][0].transcript.toLowerCase().trim().replace(/[.,!?;:]/g, '');
            if (spokenWord) {
                if (input) input.value = spokenWord;
                if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(4);
                if (typeof executeFullLookup === 'function') {
                    executeFullLookup(spokenWord);
                }
            }
        };

        recognition.onerror = function (err) {
            isListeningVoice = false;
            if (input) input.placeholder = 'Nhập từ vựng, cụm từ cần tra...';
            if (typeof showDictToast === 'function') {
                showDictToast('Không nghe rõ, vui lòng thử lại!');
            }
        };

        recognition.onend = function () {
            isListeningVoice = false;
            if (input) input.placeholder = 'Nhập từ vựng, cụm từ cần tra...';
        };

        try {
            recognition.start();
        } catch (e) {
            isListeningVoice = false;
        }
    }

    // ========================================================
    // 📋 CLIPBOARD PASTE TO SEARCH
    // ========================================================
    async function pasteClipboardToSearch() {
        try {
            if (navigator.clipboard && navigator.clipboard.readText) {
                const text = await navigator.clipboard.readText();
                if (text && text.trim().length > 0) {
                    if (typeof executeFullLookup === 'function') executeFullLookup(text.trim());
                    if (typeof showDictToast === 'function') showDictToast(`📋 Đã dán: "${text.trim()}"`);
                    return;
                }
            }
        } catch (err) {}

        const manual = prompt('Dán hoặc nhập từ cần tra cứu:');
        if (manual && manual.trim().length > 0) {
            if (typeof executeFullLookup === 'function') executeFullLookup(manual.trim());
        }
    }

    // ========================================================
    // 🕒 RECENT SEARCHES HISTORY MANAGEMENT
    // ========================================================
    function renderRecentHistory() {
        const container = document.getElementById('recentSearchPillsContainer');
        if (!container) return;
        container.innerHTML = window.recentHistory.map(w => `
            <button onclick="executeFullLookup('${w.replace(/'/g, "\\'")}')" class="px-2.5 py-1 rounded-xl bg-[#20211C] hover:bg-[#3C4D00]/50 text-[#C7C8B8] hover:text-[#D4EE7F] border border-[#46483C] hover:border-[#B8D166]/40 text-[11px] font-semibold shrink-0 transition-all">
                ${w}
            </button>
        `).join('');
    }

    function toggleDictHistory() {
        const dropdown = document.getElementById('autocompleteDropdown');
        if (!dropdown) return;
        dropdown.innerHTML = `
            <div class="p-2 border-b border-[#46483C] flex justify-between items-center text-[10px] font-bold text-[#909283] uppercase">
                <span>Lịch sử tra cứu gần đây</span>
                <button onclick="clearAllHistory()" class="min-w-[44px] h-[44px] flex items-center justify-end text-[#FFB4A9] hover:text-[#FFDAD4]" style="-webkit-tap-highlight-color: transparent;">Xóa hết</button>
            </div>
            ${window.recentHistory.map(w => `
                <div onclick="executeFullLookup('${w.replace(/'/g, "\\'")}')" class="flex items-center justify-between p-2 rounded-xl hover:bg-[#20211C] cursor-pointer text-xs text-[#E5E3DB]">
                    <span>🕒 ${w}</span>
                    <span class="text-[#909283] text-[10px]">Tra lại ➔</span>
                </div>
            `).join('')}
        `;
        dropdown.classList.remove('hidden');
    }

    
    function clearAllHistory() {
        window.recentHistory = [];
        renderRecentHistory();
        if (typeof renderEmptyStateRecentHistory === 'function') {
            renderEmptyStateRecentHistory();
        }
        const dropdown = document.getElementById('autocompleteDropdown');

        if (dropdown) dropdown.classList.add('hidden');
        if (typeof showDictToast === 'function') showDictToast('Đã xóa toàn bộ lịch sử tra cứu!');
    }

    // Close autocomplete on click outside
    document.addEventListener('click', (e) => {
        const searchBarWrapper = document.getElementById('searchBarWrapper');
        const dropdown = document.getElementById('autocompleteDropdown');
        if (searchBarWrapper && !searchBarWrapper.contains(e.target) && dropdown && !dropdown.contains(e.target)) {
            dropdown.classList.add('hidden');
        }
    });

    // Attach to window
    window.onSearchInput = onSearchInput;
    window.clearSearchInput = clearSearchInput;
    window.triggerDedicatedVoiceLookup = triggerDedicatedVoiceLookup;
    window.pasteClipboardToSearch = pasteClipboardToSearch;
    window.renderRecentHistory = renderRecentHistory;
    window.toggleDictHistory = toggleDictHistory;
    window.clearAllHistory = clearAllHistory;

})(window);
