        // Calculate Leitner Statistics
        function getLibraryStats() {
            let intro = 0, familiar = 0, memory = 0, fluent = 0;
            let totalCards = 0;
            libraryDecks.forEach(deck => {
                deck.cards.forEach(c => {
                    totalCards++;
                    if (c.leitnerLevel === 1) intro++;
                    else if (c.leitnerLevel === 2) familiar++;
                    else if (c.leitnerLevel === 3) memory++;
                    else if (c.leitnerLevel === 4) fluent++;
                });
            });
            const total = totalCards || 1;
            const masteryRate = Math.round((fluent / total) * 100);
            return { intro, familiar, memory, fluent, total: totalCards, masteryRate };
        }

        // Get due cards (level 1 & 2, and sample of level 3)
        function getLibraryDueCards() {
            const due = [];
            libraryDecks.forEach(deck => {
                deck.cards.forEach(c => {
                    if (c.leitnerLevel <= 2 || c.leitnerLevel === 3) {
                        due.push({
                            ...c,
                            deckTitle: deck.title,
                            deckKey: deck.deckKey
                        });
                    }
                });
            });
            return due;
        }
