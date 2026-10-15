        // Render main Library UI
        function renderLibraryUI() {
            const stats = getLibraryStats();
            const dueCards = getLibraryDueCards();

            // Update Hub Due Review Stats
            const dueCountEl = document.getElementById('libDueCountText');
            const dueTimeEl = document.getElementById('libDueTimeText');
            if (dueCountEl) dueCountEl.innerText = `${dueCards.length} thẻ`;
            if (dueTimeEl) dueTimeEl.innerText = `Khoảng ${Math.max(1, Math.round(dueCards.length / 3))} phút`;

            // Update Collection Count Badge
            const colBadge = document.getElementById('libCollectionBadge');
            if (colBadge) colBadge.innerText = `${libraryDecks.length} bộ`;

            // Update Memory Summary Card Stats
            const badgeMastery = document.getElementById('libMasteryRateBadge');
            if (badgeMastery) badgeMastery.innerText = `${stats.masteryRate}% Thuộc`;

            const countIntro = document.getElementById('libCountIntro');
            const countFamiliar = document.getElementById('libCountFamiliar');
            const countMemory = document.getElementById('libCountMemory');
            const countFluent = document.getElementById('libCountFluent');

            if (countIntro) countIntro.innerText = `${stats.intro} thẻ`;
            if (countFamiliar) countFamiliar.innerText = `${stats.familiar} thẻ`;
            if (countMemory) countMemory.innerText = `${stats.memory} thẻ`;
            if (countFluent) countFluent.innerText = `${stats.fluent} thẻ`;

            // Multi-segment progress bar percentages
            const t = stats.total || 1;
            const barIntro = document.getElementById('libBarIntro');
            const barFamiliar = document.getElementById('libBarFamiliar');
            const barMemory = document.getElementById('libBarMemory');
            const barFluent = document.getElementById('libBarFluent');

            if (barIntro) barIntro.style.width = `${(stats.intro / t) * 100}%`;
            if (barFamiliar) barFamiliar.style.width = `${(stats.familiar / t) * 100}%`;
            if (barMemory) barMemory.style.width = `${(stats.memory / t) * 100}%`;
            if (barFluent) barFluent.style.width = `${(stats.fluent / t) * 100}%`;

            // Update Catalog Quick Filter Badges
            const bL1 = document.getElementById('libBadgeL1');
            const bL2 = document.getElementById('libBadgeL2');
            const bL3 = document.getElementById('libBadgeL3');
            const bL4 = document.getElementById('libBadgeL4');
            if (bL1) bL1.innerText = stats.intro;
            if (bL2) bL2.innerText = stats.familiar;
            if (bL3) bL3.innerText = stats.memory;
            if (bL4) bL4.innerText = stats.fluent;

            const catalogMeta = document.getElementById('libCatalogMetaSub');
            if (catalogMeta) catalogMeta.innerText = `${libraryDecks.length} bộ thẻ • ${stats.total} từ vựng`;

            // Render Recent Decks Carousel on Hub
            renderRecentDecksCarousel();
        }

        // Render Recent Decks Horizontal Carousel
        function renderRecentDecksCarousel() {
            const container = document.getElementById('libRecentDecksContainer');
            if (!container) return;

            container.innerHTML = libraryDecks.map(deck => {
                const total = deck.cards.length;
                const fluent = deck.cards.filter(c => c.leitnerLevel === 4).length;
                const percent = Math.round((fluent / (total || 1)) * 100);

                return `
                    <div onclick="openDeckDetailView('${deck.deckKey}')" 
                         class="w-[172px] shrink-0 p-3.5 rounded-2xl bg-[#1B1C17] border border-[#46483C]/70 hover:border-[#B8D166]/50 active:scale-[0.97] transition-all cursor-pointer flex flex-col justify-between shadow-md relative group">
                        
                        <!-- Top Cover & Source Badge -->
                        <div class="relative w-full h-[96px] rounded-xl overflow-hidden mb-2.5 bg-[#20211C]">
                            <img src="${deck.coverUri}" alt="${deck.title}" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
                            <div class="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent"></div>
                            
                            <span class="absolute top-2 left-2 px-2 py-0.5 rounded-md bg-black/60 backdrop-blur-md text-[10px] font-bold text-white border border-white/10">
                                ${deck.sourceLabel}
                            </span>
                            
                            ${deck.badge ? `
                                <span class="absolute top-2 right-2 px-1.5 py-0.5 rounded-md bg-[#B8D166] text-[#283500] text-[9.5px] font-black shadow-sm">
                                    ${deck.badge}
                                </span>
                            ` : ''}

                            <div class="absolute bottom-1.5 left-2 right-2 flex items-center justify-between text-[10.5px] text-white/90 font-bold">
                                <span>${total} thẻ</span>
                                <span class="text-[var(--m3-primary)]">${percent}%</span>
                            </div>
                        </div>

                        <!-- Title & Meta -->
                        <div>
                            <h4 class="text-[14px] font-bold text-[#E5E3DB] truncate leading-snug">${deck.title}</h4>
                            <p class="text-[11px] text-[#909283] truncate mt-0.5 flex items-center gap-1">
                                <span>♨</span>
                                <span>${deck.meta}</span>
                            </p>
                        </div>

                        <!-- Micro Mastery Bar -->
                        <div class="w-full h-1 rounded-full bg-[#2A2B24] overflow-hidden mt-2.5">
                            <div class="h-full bg-[var(--m3-primary)]" style="width: ${percent}%;"></div>
                        </div>
                    </div>
                `;
            }).join('');
        }

        // Open Deck Catalog View
        function openDeckCatalogView(e) {
            if (e) e.stopPropagation();
            document.getElementById('libHubView').classList.add('hidden');
            document.getElementById('libDeckDetailView').classList.add('hidden');
            const catalog = document.getElementById('libDeckListView');
            catalog.classList.remove('hidden');
            catalog.classList.add('flex');
            renderDeckCatalogList();
            const tab2 = document.getElementById('tabScreen-2');
            if (tab2) tab2.scrollTo({ top: 0, behavior: 'smooth' });
        }

        // Close Deck Catalog View (return to Hub)
        function closeDeckCatalogView() {
            document.getElementById('libDeckListView').classList.add('hidden');
            document.getElementById('libDeckListView').classList.remove('flex');
            document.getElementById('libDeckDetailView').classList.add('hidden');
            const hub = document.getElementById('libHubView');
            hub.classList.remove('hidden');
            hub.classList.add('flex');
            renderLibraryUI();
        }

        // Apply Catalog Filter
        function applyCatalogFilter(type, value) {
            if (type === 'source') {
                activeCatalogSourceFilter = value;
                ['ALL', 'STORY', 'AUDIO', 'OCR', 'TEXT', 'MANUAL'].forEach(s => {
                    const el = document.getElementById(`libChip-${s}`);
                    if (!el) return;
                    if (s === value) {
                        el.className = 'px-3.5 py-1.5 rounded-full bg-[#B8D166] text-[#283500] font-black text-[12px] shrink-0 transition-all cursor-pointer shadow-sm';
                    } else {
                        el.className = 'px-3.5 py-1.5 rounded-full bg-[#20211C] text-[#C4CAA9] border border-[#46483C]/70 hover:border-[#B8D166] font-bold text-[12px] shrink-0 transition-all cursor-pointer';
                    }
                });
            } else if (type === 'level') {
                if (activeCatalogLevelFilter === value) {
                    activeCatalogLevelFilter = null; // Toggle off
                } else {
                    activeCatalogLevelFilter = value;
                }
                [1, 2, 3, 4].forEach(l => {
                    const el = document.getElementById(`libFilterBtn-l${l}`);
                    if (!el) return;
                    if (l === activeCatalogLevelFilter) {
                        el.classList.add('ring-2', 'ring-[#B8D166]', 'bg-[#2A2B24]');
                    } else {
                        el.classList.remove('ring-2', 'ring-[#B8D166]', 'bg-[#2A2B24]');
                    }
                });
            }
            renderDeckCatalogList();
        }

        // Filter Catalog by Level from Hub summary cards
        function filterCatalogByLevel(level) {
            openDeckCatalogView();
            applyCatalogFilter('level', level);
        }
