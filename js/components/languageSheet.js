// ========================================================
// 🌐 LANGUAGE PICKER BOTTOM SHEET MODAL
// ========================================================

// --- Native Language Switcher Sheet (mobile-web-pwa) ---
        function openLanguageSheet() {
            const modal = document.getElementById('languageBottomSheetModal');
            const content = document.getElementById('languageBottomSheetContent');
            if (!modal || !content) return;
            modal.classList.remove('hidden');
            void modal.offsetWidth;
            modal.classList.remove('opacity-0');
            content.classList.remove('translate-y-full');
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
                SoundEngine.play(1);
            }
        }

        function closeLanguageSheet() {
            const modal = document.getElementById('languageBottomSheetModal');
            const content = document.getElementById('languageBottomSheetContent');
            if (!modal || !content) return;
            modal.classList.add('opacity-0');
            content.classList.add('translate-y-full');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }

        const DICT_BOOK_I18N = {
            'EN': {
                meaning: { text: 'Meaning', width: 48, fontSize: 8.5 },
                ipa:     { text: '/aɪ.piː/', width: 44, fontSize: 8.5 },
                example: { text: 'Example', width: 48, fontSize: 8.5 },
                root:    { text: 'Root',    width: 36, fontSize: 9 }
            },
            'JA': {
                meaning: { text: '意味',   width: 36, fontSize: 9 },
                ipa:     { text: '/かな/', width: 42, fontSize: 8.5 },
                example: { text: '例文',   width: 36, fontSize: 9 },
                root:    { text: '語源',   width: 36, fontSize: 9 }
            },
            'KO': {
                meaning: { text: '의미',   width: 36, fontSize: 9 },
                ipa:     { text: '/발음/', width: 42, fontSize: 8.5 },
                example: { text: '예문',   width: 36, fontSize: 9 },
                root:    { text: '어원',   width: 36, fontSize: 9 }
            },
            'ZH': {
                meaning: { text: '释义',   width: 36, fontSize: 9 },
                ipa:     { text: '拼音',   width: 36, fontSize: 9 },
                example: { text: '例句',   width: 36, fontSize: 9 },
                root:    { text: '词根',   width: 36, fontSize: 9 }
            },
            'VI': {
                meaning: { text: 'Nghĩa',  width: 40, fontSize: 9 },
                ipa:     { text: '/aɪ.piː/', width: 44, fontSize: 8.5 },
                example: { text: 'Ví dụ',  width: 44, fontSize: 9 },
                root:    { text: 'Gốc từ', width: 42, fontSize: 9 }
            },
            'FR': {
                meaning: { text: 'Sens',    width: 36, fontSize: 9 },
                ipa:     { text: '/aɪ.piː/', width: 44, fontSize: 8.5 },
                example: { text: 'Exemple', width: 48, fontSize: 8.5 },
                root:    { text: 'Racine',  width: 44, fontSize: 8.5 }
            },
            'ES': {
                meaning: { text: 'Significado', width: 52, fontSize: 7.5 },
                ipa:     { text: '/aɪ.piː/',    width: 44, fontSize: 8.5 },
                example: { text: 'Ejemplo',     width: 46, fontSize: 8.5 },
                root:    { text: 'Raíz',        width: 36, fontSize: 9 }
            },
            'DE': {
                meaning: { text: 'Bedeutung',  width: 52, fontSize: 7.5 },
                ipa:     { text: '/aɪ.piː/',    width: 44, fontSize: 8.5 },
                example: { text: 'Beispiel',    width: 48, fontSize: 8.5 },
                root:    { text: 'Stamm',       width: 40, fontSize: 8.5 }
            }
        };

        function updateDictionaryBookLanguage(code) {
            const data = DICT_BOOK_I18N[code] || DICT_BOOK_I18N['EN'];
            
            // 1. Meaning Badge
            const rectMeaning = document.getElementById('dictBookRectMeaning');
            const textMeaning = document.getElementById('dictBookTextMeaning');
            if (rectMeaning && textMeaning) {
                rectMeaning.setAttribute('width', data.meaning.width);
                rectMeaning.setAttribute('x', -data.meaning.width / 2);
                textMeaning.textContent = data.meaning.text;
                textMeaning.setAttribute('font-size', data.meaning.fontSize);
            }

            // 2. IPA / Pronunciation Badge
            const rectIPA = document.getElementById('dictBookRectIPA');
            const textIPA = document.getElementById('dictBookTextIPA');
            if (rectIPA && textIPA) {
                rectIPA.setAttribute('width', data.ipa.width);
                rectIPA.setAttribute('x', -data.ipa.width / 2);
                textIPA.textContent = data.ipa.text;
                textIPA.setAttribute('font-size', data.ipa.fontSize);
            }

            // 3. Example Badge
            const rectExample = document.getElementById('dictBookRectExample');
            const textExample = document.getElementById('dictBookTextExample');
            if (rectExample && textExample) {
                rectExample.setAttribute('width', data.example.width);
                rectExample.setAttribute('x', -data.example.width / 2);
                textExample.textContent = data.example.text;
                textExample.setAttribute('font-size', data.example.fontSize);
            }

            // 4. Root Badge
            const rectRoot = document.getElementById('dictBookRectRoot');
            const textRoot = document.getElementById('dictBookTextRoot');
            if (rectRoot && textRoot) {
                rectRoot.setAttribute('width', data.root.width);
                rectRoot.setAttribute('x', -data.root.width / 2);
                textRoot.textContent = data.root.text;
                textRoot.setAttribute('font-size', data.root.fontSize);
            }

            // Micro-interaction bounce on SVG
            const cardArt = document.querySelector('#dictBookBadgeMeaning')?.closest('svg');
            if (cardArt) {
                cardArt.style.transition = 'transform 0.28s cubic-bezier(0.34, 1.56, 0.64, 1)';
                cardArt.style.transform = 'scale(1.05)';
                setTimeout(() => {
                    cardArt.style.transform = 'scale(1)';
                }, 280);
            }
        }
        window.updateDictionaryBookLanguage = updateDictionaryBookLanguage;

        function applyTargetLanguageUI(code) {
            const allItems = document.querySelectorAll('.lang-select-item');
            allItems.forEach(item => {
                const badgeEl = item.querySelector('.lang-learning-badge');
                if (item.dataset.langCode === code) {
                    item.className = "lang-select-item w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#3C4D00]/30 border border-[#B8D166]/50 text-left active:scale-[0.98] transition-all group cursor-pointer";
                    const indicator = item.querySelector('.lang-check-indicator');
                    if (indicator) indicator.innerHTML = '<div class="w-6 h-6 rounded-full bg-[#B8D166] flex items-center justify-center text-[#283500]"><svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg></div>';
                    if (badgeEl) badgeEl.classList.remove('hidden');
                } else {
                    item.className = "lang-select-item w-full flex items-center justify-between p-3.5 rounded-2xl bg-[#20211C] hover:bg-[#252621] border border-[#46483C]/40 text-left active:scale-[0.98] transition-all group cursor-pointer";
                    const indicator = item.querySelector('.lang-check-indicator');
                    if (indicator) indicator.innerHTML = '<span class="text-[12px] font-semibold text-[#C6C8B8]/60 group-hover:text-[#E4E3DB]">Chọn</span>';
                    if (badgeEl) badgeEl.classList.add('hidden');
                }
            });
        }
        window.applyTargetLanguageUI = applyTargetLanguageUI;

        function selectTargetLanguage(flag, code, name) {
            const flagEl = document.getElementById('topLangFlag');
            const codeEl = document.getElementById('topLangCode');
            if (flagEl) flagEl.innerText = flag;
            if (codeEl) codeEl.innerText = code;
            
            try {
                localStorage.setItem('mindcard-target-lang', code);
                localStorage.setItem('mindcard-target-flag', flag);
            } catch (e) {}

            updateDictionaryBookLanguage(code);
            applyTargetLanguageUI(code);

            closeLanguageSheet();

            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
                SoundEngine.play(7);
            }
        }
        window.selectTargetLanguage = selectTargetLanguage;

        // --- Native Flashcard PRO Sheet (mobile-web-pwa) ---
        function openProSheet() {
            const modal = document.getElementById('proBottomSheetModal');
            const content = document.getElementById('proBottomSheetContent');
            if (!modal || !content) return;
            modal.classList.remove('hidden');
            void modal.offsetWidth;
            modal.classList.remove('opacity-0');
            content.classList.remove('translate-y-full');
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
                SoundEngine.play(1);
            }
        }

        function closeProSheet() {
            const modal = document.getElementById('proBottomSheetModal');
            const content = document.getElementById('proBottomSheetContent');
            if (!modal || !content) return;
            modal.classList.add('opacity-0');
            content.classList.add('translate-y-full');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }
