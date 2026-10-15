// ========================================================
// 📖 DICTIONARY CONTROLLER (SCREEN LIFECYCLE & LOOKUP DISPATCHER)
// Module: js/components/dictionary/dictionaryController.js
// Ceiling: < 350 lines | Role: Controller
// ========================================================

(function (window) {
    'use strict';

    // Global state pointers
    window.currentActiveWord = window.currentActiveWord || 'resilient';
    window.bookmarkedWords = window.bookmarkedWords || new Set(['resilient']);
    let currentLookupToken = 0;

    function openDictionaryScreen(word = '', instant = false) {
        if (typeof stopTypewriter === 'function') stopTypewriter();
        if (typeof updateBottomNavState === 'function') updateBottomNavState(1);

        const screen = document.getElementById('screenDictionary');
        if (!screen) return;

        screen.classList.remove('hidden');
        if (instant) {
            screen.style.transition = 'none';
            screen.classList.remove('translate-x-full');
            void screen.offsetWidth;
            screen.style.transition = '';
        } else {
            requestAnimationFrame(() => {
                screen.classList.remove('translate-x-full');
            });
        }

        switchDictViewMode('lookup');
        const searchInput = document.getElementById('fullDictSearchInput');

        if (word && word.trim().length > 0) {
            const targetWord = word.trim();
            executeFullLookup(targetWord);
            if (searchInput) searchInput.value = targetWord;
        } else {
            showDictEmptyState();
            if (searchInput) {
                searchInput.value = '';
                setTimeout(() => searchInput.focus(), 200);
            }
        }
    }

    function closeDictionaryScreen() {
        if (typeof updateBottomNavState === 'function') {
            updateBottomNavState(window.currentNavIndex || 0);
        }
        const screen = document.getElementById('screenDictionary');
        if (screen) {
            screen.classList.add('translate-x-full');
            setTimeout(() => {
                screen.classList.add('hidden');
            }, 300);
        }
        if (document.referrer && (document.referrer.includes('home_screen') || document.referrer.includes('home.html'))) {
            window.location.href = 'home_screen.html';
            return;
        }
        if (typeof startTypewriter === 'function') startTypewriter();
    }

    function switchDictViewMode(mode) {
        const lookupView = document.getElementById('dictViewLookup');
        const listView = document.getElementById('dictViewList');
        const btnLookup = document.getElementById('dictModeTabLookup');
        const btnList = document.getElementById('dictModeTabList');

        // Reset both buttons to inactive state
        if (btnLookup) {
            btnLookup.className = "relative pb-3 pt-1.5 px-4 flex items-center gap-2 font-bold text-[13px] text-[var(--m3-on-surface-variant)] hover:text-[var(--m3-on-surface)] transition-all cursor-pointer";
            btnLookup.innerHTML = `
                <span class="w-2 h-2 rounded-full bg-[var(--m3-primary)] opacity-0"></span>
                <span>Tra từ</span>
            `;
        }
        if (btnList) {
            btnList.className = "relative pb-3 pt-1.5 px-4 flex items-center gap-2 font-bold text-[13px] text-[var(--m3-on-surface-variant)] hover:text-[var(--m3-on-surface)] transition-all cursor-pointer";
            const badgeValue = document.getElementById('dictListCountBadge')?.innerText || '0';
            btnList.innerHTML = `
                <svg viewBox="0 0 100 100" class="w-4 h-4 text-[var(--m3-on-surface-variant)]" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">
                    <path d="M 26 32 Q 50 30, 74 33 M 27 50 Q 50 52, 73 49 M 25 68 Q 50 70, 75 67"/>
                </svg>
                <span>Danh sách</span>
                <span id="dictListCountBadge" class="min-w-[19px] h-[19px] px-1.5 rounded-full bg-[var(--m3-surface-variant)] text-[var(--m3-on-surface-variant)] text-[10px] font-black flex items-center justify-center transition-all">${badgeValue}</span>
            `;
        }

        if (mode === 'list') {
            if (lookupView) lookupView.classList.add('hidden');
            if (listView) listView.classList.remove('hidden');
            
            if (btnList) {
                btnList.className = "relative pb-3 pt-1.5 px-4 flex items-center gap-2 font-black text-[13.5px] text-[var(--m3-on-surface)] tracking-wide transition-all cursor-pointer";
                const badgeValue = document.getElementById('dictListCountBadge')?.innerText || '0';
                btnList.innerHTML = `
                    <svg viewBox="0 0 100 100" class="w-4 h-4 text-[var(--m3-primary)]" fill="none" stroke="currentColor" stroke-width="9" stroke-linecap="round" stroke-linejoin="round">
                        <path d="M 26 32 Q 50 30, 74 33 M 27 50 Q 50 52, 73 49 M 25 68 Q 50 70, 75 67"/>
                    </svg>
                    <span>Danh sách</span>
                    <span id="dictListCountBadge" class="min-w-[19px] h-[19px] px-1.5 rounded-full bg-[#3C4D00] border border-[var(--m3-primary)]/40 text-[var(--m3-primary-container)] text-[10px] font-black flex items-center justify-center shadow-[0_0_8px_rgba(184,209,102,0.25)] transition-all">${badgeValue}</span>
                    <div class="absolute bottom-0 left-2 right-2 h-[2.5px] bg-gradient-to-r from-[#B8D166] via-[#D4EE7F] to-[#B8D166] rounded-full shadow-[0_0_10px_rgba(184,209,102,0.7)]"></div>
                `;
            }
            if (typeof updateStagedWordsUI === 'function') updateStagedWordsUI();
        } else {
            if (lookupView) lookupView.classList.remove('hidden');
            if (listView) listView.classList.add('hidden');
            
            if (btnLookup) {
                btnLookup.className = "relative pb-3 pt-1.5 px-4 flex items-center gap-2 font-black text-[13.5px] text-[var(--m3-on-surface)] tracking-wide transition-all cursor-pointer";
                btnLookup.innerHTML = `
                    <span class="w-2 h-2 rounded-full bg-[var(--m3-primary)] shadow-[0_0_8px_#B8D166]"></span>
                    <span>Tra từ</span>
                    <div class="absolute bottom-0 left-2 right-2 h-[2.5px] bg-gradient-to-r from-[#B8D166] via-[#D4EE7F] to-[#B8D166] rounded-full shadow-[0_0_10px_rgba(184,209,102,0.7)]"></div>
                `;
            }
        }
    }

    function getWordTypeVi(type) {
        if (!type) return 'Tính từ (Adjective)';
        const t = type.toLowerCase();
        if (t.includes('adj')) return 'Tính từ (Adjective)';
        if (t.includes('noun') || t.includes('danh')) return 'Danh từ (Noun)';
        if (t.includes('verb') || t.includes('động')) return 'Động từ (Verb)';
        if (t.includes('adv') || t.includes('trạng') || t.includes('phó')) return 'Trạng từ (Adverb)';
        if (t.includes('idiom') || t.includes('phrase') || t.includes('cụm')) return 'Thành ngữ (Idiom)';
        return type;
    }

    function getSemanticStyleForType(type) {
        const t = (type || '').toLowerCase();
        if (t.includes('noun') || t.includes('danh')) {
            return {
                badgeBg: 'bg-[#3D2E0B]',
                badgeText: 'text-[#FDE68A]',
                badgeBorder: 'border-[#FBBF24]/30',
                dotBg: 'bg-[#FBBF24]',
                dotShadow: 'shadow-[0_0_6px_rgba(251,191,36,0.6)]',
                accentStripe: 'bg-[#FBBF24] shadow-[0_0_6px_rgba(251,191,36,0.5)]',
                chipBg: 'bg-[#3D2E0B]',
                chipText: 'text-[#FDE68A]',
                chipBorder: 'border-[#FBBF24]/40'
            };
        }
        if (t.includes('idiom') || t.includes('phrase') || t.includes('cụm')) {
            return {
                badgeBg: 'bg-[#444930]',
                badgeText: 'text-[#E0E6C3]',
                badgeBorder: 'border-[#C4CAA9]/40',
                dotBg: 'bg-[#C4CAA9]',
                dotShadow: 'shadow-[0_0_6px_rgba(196,202,169,0.6)]',
                accentStripe: 'bg-[#C4CAA9] shadow-[0_0_6px_rgba(196,202,169,0.5)]',
                chipBg: 'bg-[#444930]',
                chipText: 'text-[#E0E6C3]',
                chipBorder: 'border-[#C4CAA9]/40'
            };
        }
        if (t.includes('verb') || t.includes('động')) {
            return {
                badgeBg: 'bg-[#3C4D00]',
                badgeText: 'text-[#D4EE7F]',
                badgeBorder: 'border-[#B8D166]/40',
                dotBg: 'bg-[#B8D166]',
                dotShadow: 'shadow-[0_0_6px_rgba(184,209,102,0.6)]',
                accentStripe: 'bg-[#B8D166] shadow-[0_0_6px_rgba(184,209,102,0.5)]',
                chipBg: 'bg-[#3C4D00]',
                chipText: 'text-[#D4EE7F]',
                chipBorder: 'border-[#B8D166]/40'
            };
        }
        return {
            badgeBg: 'bg-[#214E46]',
            badgeText: 'text-[#BDECE1]',
            badgeBorder: 'border-[#A1D0C5]/40',
            dotBg: 'bg-[#A1D0C5]',
            dotShadow: 'shadow-[0_0_6px_rgba(161,208,197,0.6)]',
            accentStripe: 'bg-[#A1D0C5] shadow-[0_0_6px_rgba(161,208,197,0.5)]',
            chipBg: 'bg-[#214E46]',
            chipText: 'text-[#BDECE1]',
            chipBorder: 'border-[#A1D0C5]/50'
        };
    }

    function setTabLoadingUI(tabKey, isLoading, count = null) {
        const skel = document.getElementById(`tabSkeleton-${tabKey}`);
        const body = document.getElementById(`tabBody-${tabKey}`);
        const badge = document.getElementById(`tabBadge-${tabKey}`);
        if (isLoading) {
            if (skel) skel.classList.remove('hidden');
            if (body) body.classList.add('hidden');
            if (badge) {
                const pingColor = tabKey === 'collocations' ? 'bg-[#A1D0C5]' : (tabKey === 'synonyms' ? 'bg-[#C4CAA9]' : 'bg-[#D4EE7F]');
                badge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full ${pingColor} animate-ping ml-0.5"></span>`;
            }
        } else {
            if (skel) skel.classList.add('hidden');
            if (body) {
                body.classList.remove('hidden');
                body.classList.add('animate-fadeIn');
            }
            if (badge) {
                badge.innerHTML = (count !== null && count !== undefined) ? `<span class="text-[10px] text-[#909283]">(${count})</span>` : '';
            }
        }
    }

    function executeFullLookup(rawWord) {
        if (!rawWord || rawWord.trim().length === 0) {
            showDictEmptyState();
            return;
        }
        const word = rawWord.trim().toLowerCase();
        window.currentActiveWord = word;

        const emptyView = document.getElementById('dictEmptyStateView');
        const wordView = document.getElementById('dictWordDetailView');
        const recentRow = document.getElementById('recentSearchesRow');
        const bottomBar = document.getElementById('dictLookupBottomBar');
        if (emptyView) emptyView.classList.add('hidden');
        if (wordView) wordView.classList.remove('hidden');
        if (recentRow) recentRow.classList.remove('hidden');
        if (bottomBar) bottomBar.classList.remove('hidden');

        // Add to recent history
        if (window.recentHistory && !window.recentHistory.includes(word)) {
            window.recentHistory.unshift(word);
            if (window.recentHistory.length > 8) window.recentHistory.pop();
        }
        if (typeof renderRecentHistory === 'function') renderRecentHistory();

        const dictData = (typeof fullDictData !== 'undefined') ? fullDictData : {};
        const data = dictData[word] || (typeof generateSmartDictEntry === 'function' ? generateSmartDictEntry(word) : { word });

        // Update search input UI
        const input = document.getElementById('fullDictSearchInput');
        if (input) input.value = word;
        const clearBtn = document.getElementById('clearSearchBtn');
        if (clearBtn) clearBtn.classList.remove('hidden');
        const dropdown = document.getElementById('autocompleteDropdown');
        if (dropdown) dropdown.classList.add('hidden');
        const shortcuts = document.getElementById('searchShortcuts');
        if (shortcuts) shortcuts.classList.add('hidden');

        // Delegate to Detail View Renderer
        if (typeof renderWordDetailView === 'function') {
            renderWordDetailView(data, ++currentLookupToken);
        }

        if (typeof speakWord === 'function') speakWord(word);
        if (typeof updateStagedWordsUI === 'function') updateStagedWordsUI();
    }

    // ========================================================
    // 📋 COPY CURRENT WORD TO CLIPBOARD (FIXES BROKEN BUTTON)
    // ========================================================
    async function copyCurrentWord() {
        const word = window.currentActiveWord || document.getElementById('detailWord')?.innerText.trim() || 'resilient';
        try {
            if (navigator.clipboard && navigator.clipboard.writeText) {
                await navigator.clipboard.writeText(word);
            } else {
                const ta = document.createElement('textarea');
                ta.value = word;
                document.body.appendChild(ta);
                ta.select();
                document.execCommand('copy');
                document.body.removeChild(ta);
            }
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(1);
            if (typeof showDictToast === 'function') {
                showDictToast(`📋 Đã sao chép từ "${word}" vào bộ nhớ tạm!`);
            }
        } catch (err) {
            if (typeof showDictToast === 'function') {
                showDictToast(`Từ vựng: ${word}`);
            }
        }
    }

    // ========================================================
    // ⭐ BOOKMARK & FLASHCARD STAGING DISPATCHER
    // ========================================================
    function toggleBookmarkCurrentWord() {
        const word = window.currentActiveWord;
        if (!word) return;

        const isBookmarked = window.bookmarkedWords.has(word);
        const bookmarkIcon = document.getElementById('bookmarkIcon');
        const bookmarkBtn = document.getElementById('bookmarkBtn');

        if (isBookmarked) {
            window.bookmarkedWords.delete(word);
            if (bookmarkIcon) bookmarkIcon.setAttribute('fill', 'none');
            if (bookmarkBtn) bookmarkBtn.classList.remove('bg-[#3D2E0B]', 'text-[#FDE68A]');
            if (typeof showDictToast === 'function') showDictToast(`Đã bỏ lưu "${word}"`);
        } else {
            window.bookmarkedWords.add(word);
            if (bookmarkIcon) bookmarkIcon.setAttribute('fill', 'currentColor');
            if (bookmarkBtn) bookmarkBtn.classList.add('bg-[#3D2E0B]', 'text-[#FDE68A]');
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(5);
            if (typeof showDictToast === 'function') showDictToast(`⭐ Đã lưu "${word}" vào sổ tay!`);
        }
    }

    function toggleAddWordToStagedList() {
        const word = window.currentActiveWord || 'resilient';
        const dictData = (typeof fullDictData !== 'undefined') ? fullDictData : {};
        const data = dictData[word] || (typeof generateSmartDictEntry === 'function' ? generateSmartDictEntry(word) : { word, meaningVi: 'Nghĩa từ vựng' });

        if (typeof window.stagedWords === 'undefined') window.stagedWords = [];
        const exists = window.stagedWords.some(item => item.word.toLowerCase() === word.toLowerCase());

        if (exists) {
            window.stagedWords = window.stagedWords.filter(item => item.word.toLowerCase() !== word.toLowerCase());
            if (typeof showDictToast === 'function') showDictToast(`Đã bỏ "${word}" khỏi danh sách gom thẻ.`);
        } else {
            window.stagedWords.push({
                word: data.word,
                type: data.type || 'Từ vựng',
                level: (data.level || 'B2').split(' ')[0],
                ipa: data.ipa || `/${word}/`,
                meaningVi: data.meaningVi || 'Nghĩa từ vựng',
                example: (data.examples && data.examples[0]) ? data.examples[0].en : '',
                exampleVi: (data.examples && data.examples[0]) ? data.examples[0].vi : '',
                image: (data.meanings && data.meanings[0] && data.meanings[0].image) ? data.meanings[0].image : ''
            });
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) SoundEngine.play(4);
            if (typeof showDictToast === 'function') showDictToast(`🏷️ Đã gom "${word}" vào bộ tạo Flashcard!`);
        }

        if (typeof updateStagedWordsUI === 'function') updateStagedWordsUI();
    }

    let isEnToVi = true;
    let swapAngle = 0;
    function swapLanguageMode() {
        isEnToVi = !isEnToVi;
        swapAngle += 180;
        const icon = document.getElementById('swapLangIcon');
        if (icon) icon.style.transform = `rotate(${swapAngle}deg)`;

        const flagSrc = document.getElementById('flagSource');
        const codeSrc = document.getElementById('codeSource');
        const flagTgt = document.getElementById('flagTarget');
        const codeTgt = document.getElementById('codeTarget');
        
        const primaryClass = "text-[13.5px] font-black tracking-widest text-[#B8D166] drop-shadow-[0_0_8px_rgba(184,209,102,0.4)] transition-colors";
        const amberClass = "text-[13.5px] font-black tracking-widest text-[#FBBF24] drop-shadow-[0_0_8px_rgba(251,191,36,0.4)] transition-colors";

        if (isEnToVi) {
            if (flagSrc) flagSrc.innerText = '🇺🇸';
            if (codeSrc) { codeSrc.innerText = 'EN'; codeSrc.className = primaryClass; }
            if (flagTgt) flagTgt.innerText = '🇻🇳';
            if (codeTgt) { codeTgt.innerText = 'VI'; codeTgt.className = amberClass; }
            if (typeof showDictToast === 'function') showDictToast('Chế độ tra: Anh ➔ Việt 🇺🇸 ➔ 🇻🇳');
        } else {
            if (flagSrc) flagSrc.innerText = '🇻🇳';
            if (codeSrc) { codeSrc.innerText = 'VI'; codeSrc.className = amberClass; }
            if (flagTgt) flagTgt.innerText = '🇺🇸';
            if (codeTgt) { codeTgt.innerText = 'EN'; codeTgt.className = primaryClass; }
            if (typeof showDictToast === 'function') showDictToast('Chế độ tra: Việt ➔ Anh 🇻🇳 ➔ 🇺🇸');
        }
    }

    function updateLookupMeaningImageUI(word) {
        // Preserved to prevent errors
    }

    // Attach to window
    window.openDictionaryScreen = openDictionaryScreen;
    window.closeDictionaryScreen = closeDictionaryScreen;
    window.switchDictViewMode = switchDictViewMode;
    window.swapLanguageMode = swapLanguageMode;
    window.getWordTypeVi = getWordTypeVi;
    window.getSemanticStyleForType = getSemanticStyleForType;
    window.setTabLoadingUI = setTabLoadingUI;
    window.executeFullLookup = executeFullLookup;
    window.copyCurrentWord = copyCurrentWord;
    window.toggleBookmarkCurrentWord = toggleBookmarkCurrentWord;
    window.toggleAddWordToStagedList = toggleAddWordToStagedList;
    window.updateLookupMeaningImageUI = updateLookupMeaningImageUI;

})(window);
