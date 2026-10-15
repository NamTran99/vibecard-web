        // Render Deck Catalog List with Stacked Layers
        function renderDeckCatalogList() {
            const container = document.getElementById('libDeckCardsList');
            if (!container) return;

            let filtered = libraryDecks;
            if (activeCatalogSourceFilter !== 'ALL') {
                filtered = filtered.filter(d => d.sourceFilter === activeCatalogSourceFilter);
            }
            if (activeCatalogLevelFilter !== null) {
                filtered = filtered.filter(d => d.cards.some(c => c.leitnerLevel === activeCatalogLevelFilter));
            }

            if (filtered.length === 0) {
                container.innerHTML = `
                    <div class="py-12 flex flex-col items-center justify-center text-center">
                        <div class="w-16 h-16 rounded-2xl bg-[#20211C] border border-[#46483C]/50 flex items-center justify-center mb-3 text-2xl">
                            🔍
                        </div>
                        <h4 class="text-[16px] font-bold text-white mb-1">Không có bộ thẻ phù hợp</h4>
                        <p class="text-[12.5px] text-[#909283] max-w-[240px] mb-4">Thử thay đổi bộ lọc nguồn hoặc mức độ ghi nhớ.</p>
                        <button onclick="applyCatalogFilter('source', 'ALL'); applyCatalogFilter('level', null);" 
                                class="px-4 py-2 rounded-xl bg-[#2A2B24] text-[#B8D166] text-xs font-bold border border-[#B8D166]/30">
                            Xóa bộ lọc
                        </button>
                    </div>
                `;
                return;
            }

            container.innerHTML = filtered.map(deck => {
                const total = deck.cards.length;
                const intro = deck.cards.filter(c => c.leitnerLevel === 1).length;
                const familiar = deck.cards.filter(c => c.leitnerLevel === 2).length;
                const memory = deck.cards.filter(c => c.leitnerLevel === 3).length;
                const fluent = deck.cards.filter(c => c.leitnerLevel === 4).length;
                const percent = Math.round((fluent / (total || 1)) * 100);

                return `
                    <div class="deck-card-stack-wrap">
                        <!-- Stacked depth layers -->
                        <div class="deck-card-stack-layer-2"></div>
                        <div class="deck-card-stack-layer-1"></div>

                        <!-- Main Deck Card -->
                        <div class="deck-card-main p-4 rounded-3xl bg-[#1B1C17] border border-[#46483C]/70 shadow-lg space-y-3.5">
                            
                            <!-- Top Info Row -->
                            <div class="flex items-start gap-3.5">
                                <div class="w-20 h-20 rounded-2xl bg-[#20211C] border border-[#46483C]/50 overflow-hidden shrink-0 shadow-inner">
                                    <img src="${deck.coverUri}" alt="${deck.title}" class="w-full h-full object-cover" />
                                </div>
                                <div class="flex-1 min-w-0">
                                    <div class="flex items-center justify-between gap-1 mb-1">
                                        <h4 class="text-[16px] font-bold text-white truncate">${deck.title}</h4>
                                        <button onclick="showDictToast('Tùy chọn: ${deck.title}')" class="text-[#909283] hover:text-white px-1.5 py-0.5 text-base">⋮</button>
                                    </div>
                                    <div class="flex items-center gap-2 mb-1.5">
                                        <span class="px-2 py-0.5 rounded-md bg-[#2A2B24] text-[10.5px] font-bold text-[#C4CAA9] border border-[#46483C]/50">
                                            ${deck.sourceLabel}
                                        </span>
                                        <span class="text-[11.5px] text-[#909283] font-medium">• ${total} thẻ</span>
                                        <span class="text-[11.5px] text-[#909283] font-medium">• ♨ ${deck.meta}</span>
                                    </div>
                                    
                                    <!-- Micro Leitner Levels Counter -->
                                    <div class="flex items-center gap-2 text-[10.5px] font-bold">
                                        <span class="flex items-center gap-0.5 text-[var(--m3-secondary)]">
                                            <span class="w-1.5 h-1.5 rounded-full bg-[var(--m3-secondary)]"></span>${intro}
                                        </span>
                                        <span class="flex items-center gap-0.5 text-[var(--m3-primary)]">
                                            <span class="w-1.5 h-1.5 rounded-full bg-[var(--m3-primary)]"></span>${familiar}
                                        </span>
                                        <span class="flex items-center gap-0.5 text-[var(--m3-tertiary)]">
                                            <span class="w-1.5 h-1.5 rounded-full bg-[var(--m3-tertiary)]"></span>${memory}
                                        </span>
                                        <span class="flex items-center gap-0.5 text-[var(--m3-amber-glow)]">
                                            <span class="w-1.5 h-1.5 rounded-full bg-[var(--m3-amber-glow)]"></span>${fluent}
                                        </span>
                                    </div>
                                </div>
                            </div>

                            <!-- Mastery Progress Line -->
                            <div class="flex items-center gap-3">
                                <div class="flex-1 h-1.5 rounded-full bg-[#20211C] overflow-hidden">
                                    <div class="h-full bg-[var(--m3-primary)] rounded-full" style="width: ${percent}%;"></div>
                                </div>
                                <span class="text-[11px] font-black text-[var(--m3-amber-glow)] shrink-0">${percent}%</span>
                            </div>

                            <!-- Actions Row -->
                            <div class="grid grid-cols-2 gap-2.5 pt-1 border-t border-[#46483C]/40">
                                <button onclick="openDeckDetailView('${deck.deckKey}')" 
                                        class="h-10 rounded-xl bg-[#20211C] hover:bg-[#2A2B24] active:scale-95 text-[#C4CAA9] hover:text-white font-bold text-[12.5px] flex items-center justify-center border border-[#46483C]/60 transition-all cursor-pointer">
                                    Xem thẻ
                                </button>
                                <button onclick="launchDeckReview('${deck.deckKey}')" 
                                        class="h-10 rounded-xl bg-[#B8D166] hover:brightness-105 active:scale-95 text-[#283500] font-black text-[12.5px] flex items-center justify-center gap-1.5 shadow-[0_2px_10px_rgba(184,209,102,0.3)] transition-all cursor-pointer">
                                    <svg class="w-3.5 h-3.5 fill-current" viewBox="0 0 24 24"><polygon points="5 3 19 12 5 21 5 3"/></svg>
                                    <span>Ôn tập</span>
                                </button>
                            </div>

                        </div>
                    </div>
                `;
            }).join('');
        }
