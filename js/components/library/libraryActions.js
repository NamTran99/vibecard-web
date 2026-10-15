        // Toggle card flip
        function toggleCardFlip(cardId) {
            const el = document.getElementById(cardId);
            if (el) el.classList.toggle('is-flipped');
        }

        // Update card Leitner level
        function updateCardLeitner(deckKey, term, newLevel) {
            const deck = libraryDecks.find(d => d.deckKey === deckKey);
            if (!deck) return;
            const card = deck.cards.find(c => c.term.toLowerCase() === term.toLowerCase());
            if (!card) return;
            card.leitnerLevel = newLevel;
            renderDeckDetailCards();
            renderLibraryUI();
            const msg = newLevel === 4 ? `Đã chuyển "${term}" sang Thông thạo! 🌟` : `Đã chuyển "${term}" vào Hộp ôn tập! ⚡`;
            if (typeof showDictToast === 'function') {
                showDictToast(msg);
            }
        }

        // Open topic lesson from library
        function openTopicFromLibrary() {
            if (typeof openLessonImportDialog === 'function') {
                openLessonImportDialog();
            } else {
                switchBottomNav(0);
            }
        }

        // Start Review for due cards across library
        function startDueCardsReview(e) {
            if (e) e.stopPropagation();
            const dueCards = getLibraryDueCards();
            if (dueCards.length === 0) {
                if (typeof showDictToast === 'function') showDictToast('🎉 Tuyệt vời! Bạn không còn thẻ nào cần ôn hôm nay.');
                return;
            }
            launchReviewSession('Ôn tập hôm nay (SRS)', dueCards);
        }

        // Launch review for specific deck
        function launchDeckReview(deckKey) {
            const deck = libraryDecks.find(d => d.deckKey === deckKey);
            if (!deck || deck.cards.length === 0) return;
            launchReviewSession(deck.title, deck.cards);
        }

        // Launch review for current detail deck
        function reviewCurrentDetailDeck() {
            if (!currentDetailDeckKey) return;
            launchDeckReview(currentDetailDeckKey);
        }

        // Launch review modal with given cards
        function launchReviewSession(title, cards) {
            reviewSessionWords = cards.map(c => ({
                word: c.term,
                ipa: c.ipa || '',
                type: c.type || 'Danh từ',
                meaningVi: c.meaning,
                image: c.image || 'assets/cards/pixar_night_farm_scenery.jpg',
                meanings: [{ text: c.meaning, image: c.image || 'assets/cards/pixar_night_farm_scenery.jpg' }],
                example: c.example || '',
                level: 'B2'
            }));
            currentReviewIndex = 0;

            const titleEl = document.getElementById('reviewDeckTitleText');
            if (titleEl) titleEl.innerText = title;

            const deckModal = document.getElementById('reviewDeckModal');
            if (deckModal) {
                deckModal.classList.remove('hidden');
                setTimeout(() => {
                    deckModal.classList.remove('opacity-0');
                }, 10);
                if (typeof renderCurrentReviewCard === 'function') {
                    renderCurrentReviewCard();
                }
            }
        }

        // Spaced Repetition SRS Info Modal Handlers
        function openSpacedRepetitionInfoModal() {
            const modal = document.getElementById('spacedRepetitionModal');
            const content = document.getElementById('spacedRepetitionContent');
            if (modal && content) {
                modal.classList.remove('hidden');
                setTimeout(() => {
                    modal.classList.remove('opacity-0');
                    content.classList.remove('translate-y-full');
                }, 10);
            }
        }

        function closeSpacedRepetitionInfoModal() {
            const modal = document.getElementById('spacedRepetitionModal');
            const content = document.getElementById('spacedRepetitionContent');
            if (modal && content) {
                modal.classList.add('opacity-0');
                content.classList.add('translate-y-full');
                setTimeout(() => {
                    modal.classList.add('hidden');
                }, 300);
            }
        }
        // ===================================================================
