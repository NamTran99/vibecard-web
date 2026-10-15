        // Open Deck Detail View
        function openDeckDetailView(deckKey) {
            currentDetailDeckKey = deckKey;
            activeDetailLevelFilter = null;
            detailSearchQuery = '';
            const searchInput = document.getElementById('libDetailSearchInput');
            if (searchInput) searchInput.value = '';

            const deck = libraryDecks.find(d => d.deckKey === deckKey);
            if (!deck) return;

            document.getElementById('libHubView').classList.add('hidden');
            document.getElementById('libDeckListView').classList.add('hidden');
            const detailView = document.getElementById('libDeckDetailView');
            detailView.classList.remove('hidden');
            detailView.classList.add('flex');

            // Set Header details
            const titleEl = document.getElementById('libDetailDeckTitle');
            if (titleEl) titleEl.innerText = deck.title;

            const lessonBtn = document.getElementById('libDetailTopicLessonBtn');
            if (lessonBtn) {
                if (deck.topicId) {
                    lessonBtn.classList.remove('hidden');
                } else {
                    lessonBtn.classList.add('hidden');
                }
            }

            renderDeckDetailCards();
            const tab2 = document.getElementById('tabScreen-2');
            if (tab2) tab2.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Close Deck Detail View
        function closeDeckDetailView() {
            document.getElementById('libDeckDetailView').classList.add('hidden');
            document.getElementById('libDeckDetailView').classList.remove('flex');
            // If catalog was open before, return to catalog, otherwise to hub
            openDeckCatalogView();
        }

        // Filter cards inside detail by level
        function filterDetailCardsByLevel(level) {
            activeDetailLevelFilter = level;
            [null, 1, 2, 3, 4].forEach(l => {
                const id = l === null ? 'libDetailChip-all' : `libDetailChip-${l}`;
                const el = document.getElementById(id);
                if (!el) return;
                if (l === level) {
                    el.className = 'px-3 py-1 rounded-full bg-[#B8D166] text-[#283500] font-black text-[11.5px] shrink-0 cursor-pointer shadow-sm';
                } else {
                    el.className = 'px-3 py-1 rounded-full bg-[#20211C] text-[#C4CAA9] border border-[#46483C]/50 font-bold text-[11.5px] shrink-0 cursor-pointer';
                }
            });
            renderDeckDetailCards();
        }

        // Search inside deck cards
        function handleDeckCardSearch(query) {
            detailSearchQuery = (query || '').trim().toLowerCase();
            renderDeckDetailCards();
        }

        // Render Deck Detail Cards List
        function renderDeckDetailCards() {
            const container = document.getElementById('libDetailCardsContainer');
            if (!container) return;

            const deck = libraryDecks.find(d => d.deckKey === currentDetailDeckKey);
            if (!deck) return;

            const total = deck.cards.length;
            const fluent = deck.cards.filter(c => c.leitnerLevel === 4).length;
            const mastery = Math.round((fluent / (total || 1)) * 100);

            // Update Meta Subtitle
            const metaSub = document.getElementById('libDetailDeckMeta');
            if (metaSub) metaSub.innerText = `${total} flashcards • Đã thuộc ${mastery}%`;

            // Update Detail Chip Counts
            const cAll = document.getElementById('libDetailCountAll');
            const c1 = document.getElementById('libDetailCount1');
            const c2 = document.getElementById('libDetailCount2');
            const c3 = document.getElementById('libDetailCount3');
            const c4 = document.getElementById('libDetailCount4');
            if (cAll) cAll.innerText = total;
            if (c1) c1.innerText = deck.cards.filter(c => c.leitnerLevel === 1).length;
            if (c2) c2.innerText = deck.cards.filter(c => c.leitnerLevel === 2).length;
            if (c3) c3.innerText = deck.cards.filter(c => c.leitnerLevel === 3).length;
            if (c4) c4.innerText = deck.cards.filter(c => c.leitnerLevel === 4).length;

            const reviewBtnText = document.getElementById('libDetailReviewBtnText');
            if (reviewBtnText) reviewBtnText.innerText = `Ôn tất cả bộ thẻ (${total} thẻ)`;

            // Filter cards
            let cards = deck.cards;
            if (activeDetailLevelFilter !== null) {
                cards = cards.filter(c => c.leitnerLevel === activeDetailLevelFilter);
            }
            if (detailSearchQuery) {
                cards = cards.filter(c => 
                    c.term.toLowerCase().includes(detailSearchQuery) || 
                    c.meaning.toLowerCase().includes(detailSearchQuery)
                );
            }

            if (cards.length === 0) {
                container.innerHTML = `
                    <div class="py-12 text-center text-[#909283] text-sm">
                        Không tìm thấy flashcard nào phù hợp.
                    </div>
                `;
                return;
            }

            const levelBadges = {
                1: { label: 'Nhập môn', color: 'var(--m3-secondary)', bg: 'var(--m3-secondary-container)', border: 'transparent' },
                2: { label: 'Làm quen', color: 'var(--m3-primary)', bg: 'var(--m3-primary-container)', border: 'transparent' },
                3: { label: 'Ghi nhớ', color: 'var(--m3-tertiary)', bg: 'var(--m3-tertiary-container)', border: 'transparent' },
                4: { label: 'Thông thạo', color: 'var(--m3-amber-glow)', bg: 'var(--m3-amber-container)', border: 'transparent' }
            };

            container.innerHTML = cards.map((card, idx) => {
                const lvl = levelBadges[card.leitnerLevel] || levelBadges[1];
                return `
                    <div class="lib-flip-card-container">
                        <div id="libCard-${idx}" class="lib-flip-card-inner relative rounded-2xl bg-[#1B1C17] border border-[#46483C]/70 p-4 shadow-sm hover:border-[#B8D166]/40 transition-colors">
                            
                            <!-- Header info row -->
                            <div class="flex items-center justify-between mb-2">
                                <span class="text-[11px] font-black text-[#909283]">#${String(idx + 1).padStart(2, '0')} / ${String(cards.length).padStart(2, '0')}</span>
                                <div class="flex items-center gap-1.5">
                                    <span class="px-2.5 py-0.5 rounded-full text-[10.5px] font-black border" 
                                          style="color: ${lvl.color}; background: ${lvl.bg}; border-color: ${lvl.border};">
                                        ${lvl.label}
                                    </span>
                                    <button onclick="speakWord('${card.term}')" 
                                            class="w-7 h-7 rounded-full bg-[#20211C] hover:bg-[#2A2B24] active:scale-90 text-[#B8D166] flex items-center justify-center transition-transform" 
                                            title="Phát âm">
                                        <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/></svg>
                                    </button>
                                </div>
                            </div>

                            <!-- Term & IPA -->
                            <div class="mb-2">
                                <h4 class="text-[20px] font-black text-white tracking-tight">${card.term}</h4>
                                <span class="text-[12.5px] font-mono text-[#D4EE7F]">${card.ipa}</span>
                            </div>

                            <!-- Meaning -->
                            <p class="text-[13.5px] text-[#E5E3DB] font-medium leading-relaxed mb-2.5">
                                ${card.meaning}
                            </p>

                            <!-- Example sentence -->
                            <div class="p-2.5 rounded-xl bg-[#20211C] border border-[#46483C]/40 text-[12px] text-[#A1D0C5] italic mb-3">
                                "${card.example}"
                            </div>

                            <!-- Actions & Status Updates -->
                            <div class="flex items-center justify-between pt-2 border-t border-[#46483C]/40 text-xs">
                                <button onclick="toggleCardFlip('libCard-${idx}')" 
                                        class="text-[#909283] hover:text-white flex items-center gap-1 font-bold">
                                    <svg class="w-3.5 h-3.5" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M21.5 2v6h-6M21.34 15.57a10 10 0 1 1-.57-8.38l5.67-5.67"/></svg>
                                    <span>Lật ảnh</span>
                                </button>
                                
                                <div class="flex items-center gap-2">
                                    <button onclick="updateCardLeitner('${deck.deckKey}', '${card.term}', 1)" 
                                            class="px-2.5 py-1 rounded-lg bg-[var(--m3-secondary-container)] text-[var(--m3-on-surface)] border border-transparent text-[11px] font-bold active:scale-95 transition-all">
                                        ⚡ Cần ôn
                                    </button>
                                    <button onclick="updateCardLeitner('${deck.deckKey}', '${card.term}', 4)" 
                                            class="px-2.5 py-1 rounded-lg bg-[var(--m3-amber-container)] text-[var(--m3-on-surface)] border border-transparent text-[11px] font-bold active:scale-95 transition-all">
                                        ✓ Đã nhớ
                                    </button>
                                </div>
                            </div>

                        </div>
                    </div>
                `;
            }).join('');
        }
