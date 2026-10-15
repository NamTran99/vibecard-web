// ========================================================
// 📑 DICTIONARY DETAIL VIEW & TABS RENDERER
// Module: js/components/dictionary/dictionaryDetailView.js
// Ceiling: < 350 lines | Role: Detailed Word Layout & Tabs
// ========================================================

(function (window) {
    'use strict';

    function renderWordDetailView(data, lookupToken) {
        if (!data) return;

        // 1. Header typography & details
        const detailWordEl = document.getElementById('detailWord');
        if (detailWordEl) {
            detailWordEl.innerText = data.word;
            const wordLen = (data.word || '').length;
            if (wordLen > 28) {
                detailWordEl.className = "text-lg font-black text-[#E5E3DB] tracking-tight leading-snug break-words whitespace-normal";
            } else if (wordLen > 18) {
                detailWordEl.className = "text-xl font-black text-[#E5E3DB] tracking-tight leading-snug break-words whitespace-normal";
            } else if (wordLen > 12) {
                detailWordEl.className = "text-2xl font-black text-[#E5E3DB] tracking-tight leading-snug break-words whitespace-normal";
            } else {
                detailWordEl.className = "text-[28px] font-black text-[#E5E3DB] tracking-tight leading-snug break-words whitespace-normal";
            }
        }

        const typeEl = document.getElementById('detailType');
        if (typeEl) typeEl.innerText = data.type || 'Từ vựng';
        const levelEl = document.getElementById('detailLevel');
        if (levelEl) levelEl.innerText = data.level || 'B2';
        const ipaEl = document.getElementById('detailIpa');
        if (ipaEl) ipaEl.innerText = data.ipa || '';

        const freqEl = document.getElementById('detailFrequency');
        if (freqEl) {
            const cleanFreq = (data.frequency || 'Phổ biến').replace(/[★☆]/g, '').trim();
            freqEl.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-[#FBBF24] shadow-[0_0_6px_#FBBF24]"></span><span>${cleanFreq}</span>`;
        }

        // Bookmark icon state
        const bookmarkIcon = document.getElementById('bookmarkIcon');
        const bookmarkBtn = document.getElementById('bookmarkBtn');
        if (bookmarkIcon && bookmarkBtn && window.bookmarkedWords) {
            if (window.bookmarkedWords.has(data.word)) {
                bookmarkIcon.setAttribute('fill', 'currentColor');
                bookmarkBtn.classList.add('bg-[#3D2E0B]', 'text-[#FDE68A]');
            } else {
                bookmarkIcon.setAttribute('fill', 'none');
                bookmarkBtn.classList.remove('bg-[#3D2E0B]', 'text-[#FDE68A]');
            }
        }

        // Set Tab Loading Skeletons
        if (typeof setTabLoadingUI === 'function') {
            setTabLoadingUI('definitions', true);
            setTabLoadingUI('collocations', true);
        }

        // Render Tab 1: Definitions (~500ms feel)
        setTimeout(() => {
            const tabBody = document.getElementById('tabBody-definitions');
            const meaningsArray = data.meanings || [
                {
                    type: (typeof getWordTypeVi === 'function') ? getWordTypeVi(data.type) : (data.type || 'Tính từ'),
                    meaningVi: data.meaningVi || '',
                    meaningEn: data.meaningEn || ''
                }
            ];

            let html = '';
            meaningsArray.forEach((m, index) => {
                const sem = (typeof getSemanticStyleForType === 'function') ? getSemanticStyleForType(m.type) : { badgeBg: 'bg-[#214E46]', badgeText: 'text-[#BDECE1]', badgeBorder: 'border-[#A1D0C5]/40', dotBg: 'bg-[#A1D0C5]', dotShadow: 'shadow-[0_0_6px_rgba(161,208,197,0.6)]', accentStripe: 'bg-[#A1D0C5]' };
                html += `
                <div class="rounded-[20px] p-4 bg-[#20211C] border-[3px] border-[#46483C] border-b-[6px] border-b-[#1B1C17] relative overflow-hidden mb-3">
                    <div class="flex items-center justify-between relative z-10 mb-2">
                        <span class="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg ${sem.badgeBg} border ${sem.badgeBorder} shadow-sm">
                            <span class="w-1.5 h-1.5 rounded-full ${sem.dotBg} ${sem.dotShadow}"></span>
                            <span class="text-[10px] font-black ${sem.badgeText} uppercase tracking-widest pt-[1px]">${m.type}</span>
                        </span>
                        <button onclick="toggleAddWordToStagedList()" class="group flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-[#444930] hover:brightness-110 border border-[#C4CAA9]/40 transition-all cursor-pointer active:scale-95 shadow-sm">
                            <svg class="w-3.5 h-3.5 text-[#C4CAA9]" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4v16m8-8H4"/></svg>
                            <span class="text-[11px] font-bold text-[#E0E6C3] pt-[1px]">Gom vào thẻ</span>
                        </button>
                    </div>

                    <p class="text-[15.5px] font-bold text-[#E5E3DB] leading-snug tracking-tight mt-1 mb-1 relative z-10">
                        ${m.meaningVi}
                    </p>

                    ${data.examples && data.examples[index] ? `
                    <div class="mt-4 pt-3.5 border-t border-[#46483C] relative z-10">
                        <div class="flex items-start gap-3">
                            <div class="w-[3.5px] h-[18px] ${sem.accentStripe} rounded-full mt-[3px] shrink-0"></div>
                            <div class="space-y-1.5 flex-1 min-w-0">
                                <p class="text-[13.5px] text-[#E5E3DB] font-medium italic leading-relaxed tracking-wide">
                                    "${data.examples[index].en}"
                                </p>
                                <p class="text-[13px] text-[#C7C8B8] font-medium leading-relaxed">
                                    ${data.examples[index].vi}
                                </p>
                            </div>
                            <button onclick="speakWordAccent('${data.examples[index].en.replace(/'/g, "\\'")}', 'en-US')" class="w-8 h-8 rounded-full bg-[#20211C] active:bg-[#444930] text-[#909283] active:text-[#E0E6C3] border border-[#46483C] flex items-center justify-center shrink-0 transition-all active:scale-90" title="Nghe câu này">
                                <svg viewBox="0 0 100 100" class="w-4 h-4 pl-0.5" fill="none" stroke="currentColor" stroke-width="8" stroke-linecap="round" stroke-linejoin="round"><path d="M 25 40 L 40 40 L 55 25 L 55 75 L 40 60 L 25 60 Z M 65 35 C 75 45, 75 55, 65 65 M 75 25 C 90 40, 90 60, 75 75"/></svg>
                            </button>
                        </div>
                    </div>
                    ` : ''}
                </div>
                `;
            });

            if (tabBody) tabBody.innerHTML = html;
            if (typeof setTabLoadingUI === 'function') setTabLoadingUI('definitions', false);
        }, 500);

        // Render Tab 2: Collocations
        setTimeout(() => {
            const collocBox = document.getElementById('detailCollocationsContainer');
            if (collocBox && data.collocations) {
                collocBox.innerHTML = data.collocations.map(col => `
                    <div class="p-3 rounded-xl bg-[#20211C] border border-[#46483C]/70 flex items-center justify-between hover:bg-[#252621] transition-colors">
                        <div class="flex items-center gap-2.5">
                            <span class="w-6 h-6 rounded-lg bg-[#214E46] text-[#A1D0C5] flex items-center justify-center text-xs font-bold shrink-0">🌿</span>
                            <span class="text-xs font-bold text-[#E5E3DB]">${col.en}</span>
                        </div>
                        <span class="text-[11px] text-[#C7C8B8] font-medium">${col.vi}</span>
                    </div>
                `).join('');
            }
            if (typeof setTabLoadingUI === 'function') setTabLoadingUI('collocations', false, data.collocations ? data.collocations.length : 0);
        }, 800);

        // Synonyms & Antonyms
        const synBox = document.getElementById('detailSynonymsContainer');
        if (synBox && data.synonyms) {
            synBox.innerHTML = data.synonyms.map(s => `
                <button onclick="executeFullLookup('${s.word}')" class="m3-chip-synonym flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer">
                    <span class="syn-word">${s.word}</span>
                    <span class="syn-vi text-[10px] font-normal">(${s.vi})</span>
                </button>
            `).join('');
        }

        const antBox = document.getElementById('detailAntonymsContainer');
        if (antBox && data.antonyms) {
            antBox.innerHTML = data.antonyms.map(a => `
                <button onclick="executeFullLookup('${a.word}')" class="m3-chip-antonym flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-semibold hover:scale-105 active:scale-95 transition-all shadow-sm cursor-pointer">
                    <span class="ant-word">${a.word}</span>
                    <span class="ant-vi text-[10px] font-normal">(${a.vi})</span>
                </button>
            `).join('');
        }

        // Tab Lumi AI Tips
        if (data.lumiTip) {
            const etymEl = document.getElementById('lumiEtymology');
            if (etymEl) etymEl.innerText = data.lumiTip.etymology || '';
            const hackEl = document.getElementById('lumiMemoryHack');
            if (hackEl) hackEl.innerText = data.lumiTip.memoryHack || '';
            const mistEl = document.getElementById('lumiCommonMistake');
            if (mistEl) mistEl.innerHTML = data.lumiTip.commonMistake || '';
        }
    }

    function switchDictTab(tabName) {
        document.querySelectorAll('.dict-tab-btn').forEach(btn => {
            btn.classList.remove('active-tab', 'font-bold', 'bg-[#3C4D00]', 'text-[#D4EE7F]', 'border-[#B8D166]/50', 'bg-[#214E46]', 'text-[#BDECE1]', 'border-[#A1D0C5]/50', 'bg-[#444930]', 'text-[#E0E6C3]', 'border-[#C4CAA9]/50', 'bg-[#3D2E0B]', 'text-[#FDE68A]', 'border-[#FBBF24]/50');
            btn.classList.add('text-[#C7C8B8]', 'bg-[#20211C]', 'border', 'border-[#46483C]/70', 'font-semibold');
        });

        const activeBtn = document.getElementById(`tabBtn-${tabName}`);
        if (activeBtn) {
            activeBtn.classList.remove('text-[#C7C8B8]', 'bg-[#20211C]', 'border-[#46483C]/70', 'font-semibold');
            if (tabName === 'definitions') {
                activeBtn.classList.add('active-tab', 'bg-[#3C4D00]', 'text-[#D4EE7F]', 'border', 'border-[#B8D166]/50', 'font-bold');
            } else if (tabName === 'collocations') {
                activeBtn.classList.add('active-tab', 'bg-[#214E46]', 'text-[#BDECE1]', 'border', 'border-[#A1D0C5]/50', 'font-bold');
            } else if (tabName === 'synonyms') {
                activeBtn.classList.add('active-tab', 'bg-[#444930]', 'text-[#E0E6C3]', 'border', 'border-[#C4CAA9]/50', 'font-bold');
            } else {
                activeBtn.classList.add('active-tab', 'bg-[#3D2E0B]', 'text-[#FDE68A]', 'border', 'border-[#FBBF24]/50', 'font-bold');
            }
        }

        document.querySelectorAll('.dict-tab-content').forEach(content => content.classList.add('hidden'));
        const activeContent = document.getElementById(`tabContent-${tabName}`);
        if (activeContent) activeContent.classList.remove('hidden');
    }

    // ========================================================
    // 💡 EMPTY STATE & LUMI ONBOARDING TIP
    // ========================================================
    function checkLumiTipVisibility() {
        const card = document.getElementById('dictLumiGreetingCard');
        if (!card) return false;
        try {
            if (localStorage.getItem('mindcard_hide_lumi_tip') === 'true') {
                card.classList.add('hidden');
                return false;
            }
        } catch (e) {}
        card.classList.remove('hidden');
        return true;
    }

    function dismissLumiTip(neverShowAgain = false) {
        const card = document.getElementById('dictLumiGreetingCard');
        if (!card) return;
        if (neverShowAgain) {
            try {
                localStorage.setItem('mindcard_hide_lumi_tip', 'true');
            } catch (e) {}
            if (typeof showDictToast === 'function') {
                showDictToast('✨ Đã ghi nhớ: Sẽ không hiển thị mẹo này lần sau.');
            }
        }
        card.classList.add('hidden');
    }

    
    function renderEmptyStateRecentHistory() {
        const list = document.getElementById('emptyRecentSearchesList');
        const section = document.getElementById('emptyRecentSection');
        if (!list || !section) return;
        
        if (!window.recentHistory || window.recentHistory.length === 0) {
            section.classList.add('hidden');
            return;
        }
        
        section.classList.remove('hidden');
        
        function getPosInfo(type, meaningStr, w) {
            const t = (type || '').toLowerCase();
            const m = (meaningStr || '').toLowerCase();
            if (t.includes('noun') || m.includes('danh từ')) return { label: 'DANH TỪ', color: '#F59E0B' }; // Amber
            if (t.includes('verb') || m.includes('động từ')) return { label: 'ĐỘNG TỪ', color: '#EF4444' }; // Red
            if (t.includes('adj') || m.includes('tính từ')) return { label: 'TÍNH TỪ', color: '#2DD4BF' }; // Cyan
            if (t.includes('adv') || m.includes('trạng từ')) return { label: 'TRẠNG TỪ', color: '#8B5CF6' }; // Purple
            if (t.includes('phrase') || t.includes('idiom') || (w && w.includes(' '))) return { label: 'CỤM TỪ', color: '#A3E635' }; // Lime
            if (t.includes('interjection') || m.includes('thán từ')) return { label: 'THÁN TỪ', color: '#84CC16' }; // Light Green
            return { label: 'TỪ VỰNG', color: '#6B7280' }; // Gray
        }

        list.innerHTML = window.recentHistory.slice(0, 5).map(w => {
            let meaning = 'Đang tải...';
            let type = '';
            if (window.fullDictData && window.fullDictData[w]) {
                meaning = window.fullDictData[w].meaningVi || window.fullDictData[w].meaningEn || 'Đang tải...';
                type = window.fullDictData[w].type || '';
            } else if (window.generateSmartDictEntry) {
                const temp = window.generateSmartDictEntry(w);
                meaning = temp.meaningVi || temp.meaningEn || 'Đang tải...';
                type = temp.type || '';
            }
            
            // Hardcode standard mock values if missing
            if (w === 'photovoltaic') { meaning = 'quang điện'; type = 'adjective'; }
            else if (w === 'embedding') { meaning = 'việc chèn'; type = 'noun'; }
            else if (w === 'hello') { meaning = 'xin chào'; type = 'interjection'; }
            else if (w === 'loss aversion') { meaning = 'sợ mất mát'; type = 'phrase'; }
            else if (w === 'break the ice') { meaning = 'phá băng'; type = 'idiom'; }
            else if (w === 'resilient') { meaning = 'kiên cường'; type = 'adjective'; }
            
            const info = getPosInfo(type, meaning, w);

            return `
                <div onclick="executeFullLookup('${w}')" class="flex items-center justify-between p-4 rounded-[24px] bg-[#181816] border border-[#2A2A28] relative overflow-hidden hover:bg-[#20201E] active:scale-[0.98] transition-all cursor-pointer shadow-sm group">
                    <div class="absolute left-0 top-0 bottom-0 w-[4px]" style="background-color: ${info.color}"></div>
                    
                    <div class="flex flex-col ml-1.5 flex-1 min-w-0 pr-2">
                        <div class="flex items-center gap-2">
                            <span class="text-[16px] font-bold text-[#E5E3DB] truncate">${w}</span>
                            <span class="px-2 py-0.5 rounded-md text-[9px] font-black shrink-0 uppercase tracking-wide" style="background-color: ${info.color}15; color: ${info.color}">${info.label}</span>
                        </div>
                        <span class="text-[13px] text-[#A3A095] mt-0.5 line-clamp-1">${meaning}</span>
                    </div>

                    <button onclick="event.stopPropagation(); removeRecentSearch('${w}')" class="w-8 h-8 rounded-full bg-white/5 group-hover:bg-white/10 text-white/40 group-hover:text-white/70 flex items-center justify-center transition-colors shrink-0">
                        <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M6 18L18 6M6 6l12 12"></path></svg>
                    </button>
                </div>
            `;
        }).join('');
    }

    function showDictEmptyState() {
        window.currentActiveWord = '';
        checkLumiTipVisibility();
        const emptyView = document.getElementById('dictEmptyStateView');
        const wordView = document.getElementById('dictWordDetailView');
        const recentRow = document.getElementById('recentSearchesRow');
        const clearBtn = document.getElementById('clearSearchBtn');
        const dropdown = document.getElementById('autocompleteDropdown');
        const shortcuts = document.getElementById('searchShortcuts');

        if (emptyView) emptyView.classList.remove('hidden');
        if (wordView) wordView.classList.add('hidden');
        if (recentRow) recentRow.classList.add('hidden');
        if (clearBtn) clearBtn.classList.add('hidden');
        if (dropdown) dropdown.classList.add('hidden');
        if (shortcuts) shortcuts.classList.remove('hidden');

        
        if (typeof updateStagedWordsUI === 'function') updateStagedWordsUI();
        
        renderEmptyStateRecentHistory();
        triggerTopics5sLoading();
    }


    let topicLoadingTimeout = null;
    let topicLoadingInterval = null;

    function triggerTopics5sLoading() {
        const skeletonView = document.getElementById('dictTopicsSkeletonView');
        const realContent = document.getElementById('dictTopicsRealContent');
        const timerEl = document.getElementById('topicLoadingTimer');
        const progressBar = document.getElementById('topicLoadingProgressBar');
        const statusBadge = document.getElementById('topicHeaderStatusBadge');
        const refreshIcon = document.getElementById('iconRefreshTopics');
        const refreshText = document.getElementById('textRefreshTopics');

        if (!skeletonView || !realContent) return;

        if (topicLoadingTimeout) clearTimeout(topicLoadingTimeout);
        if (topicLoadingInterval) clearInterval(topicLoadingInterval);

        skeletonView.classList.remove('hidden');
        skeletonView.style.opacity = '1';
        realContent.classList.add('hidden');

        if (statusBadge) {
            statusBadge.innerHTML = `<span class="w-1.5 h-1.5 rounded-full bg-[#B8D166] animate-ping inline-block mr-1"></span><span>Đang tải (5s)...</span>`;
            statusBadge.className = "text-[10px] font-bold text-[#D4EE7F] bg-[#3C4D00] px-2.5 py-0.5 rounded-full flex items-center";
        }

        if (timerEl) timerEl.innerText = "5s";
        if (progressBar) {
            progressBar.style.transition = 'none';
            progressBar.style.width = '0%';
            void progressBar.offsetWidth;
            progressBar.style.transition = 'width 5000ms cubic-bezier(0.1, 0.5, 0.1, 1)';
            progressBar.style.width = '100%';
        }

        if (refreshIcon) refreshIcon.classList.add('animate-spin');
        if (refreshText) refreshText.innerText = 'Đang đổi...';

        let timeLeft = 5;
        topicLoadingInterval = setInterval(() => {
            timeLeft--;
            if (timerEl) timerEl.innerText = `${Math.max(0, timeLeft)}s`;
            if (timeLeft <= 0) clearInterval(topicLoadingInterval);
        }, 1000);

        topicLoadingTimeout = setTimeout(() => {
            skeletonView.style.transition = 'opacity 300ms ease-out';
            skeletonView.style.opacity = '0';
            setTimeout(() => {
                skeletonView.classList.add('hidden');
                realContent.classList.remove('hidden');
                if (refreshIcon) refreshIcon.classList.remove('animate-spin');
                if (refreshText) refreshText.innerText = 'Đổi bộ';
                if (statusBadge) {
                    statusBadge.innerHTML = `• Tuyển chọn`;
                    statusBadge.className = "text-[11px] font-bold text-[var(--m3-primary)] tracking-wide";
                }
            }, 300);
        }, 5000);
    }

    // Attach to window
    window.renderWordDetailView = renderWordDetailView;
    window.switchDictTab = switchDictTab;
    window.checkLumiTipVisibility = checkLumiTipVisibility;
    window.dismissLumiTip = dismissLumiTip;
    window.showDictEmptyState = showDictEmptyState;
    window.triggerTopics5sLoading = triggerTopics5sLoading;

})(window);
