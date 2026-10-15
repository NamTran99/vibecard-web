        // Lumi Mascot Interactive Companionship
        const lumiCheerQuotes = [
            '"Chào Nam! Ôn nốt <span class=\'text-amber-300 font-bold\'>4 từ vựng</span> để giữ chuỗi 🔥 14 ngày nhé!"',
            '"Cố lên Nam ơi! Mỗi ngày 10 phút cùng Lumi là nói tiếng Anh tự nhiên ngay! 🦊❤️"',
            '"Lumi đã xếp lịch ôn Spaced Repetition cho bạn rồi nè! Đạt <span class=\'text-amber-300 font-bold\'>67%</span> rồi đó! 🧠✨"',
            '"Bạn học rất chăm chỉ, Lumi tặng bạn 1 cái đập tay & <span class=\'text-amber-300 font-bold\'>+30 XP</span> nhé! 🐾🌟"'
        ];
        let cheerIndex = 0;
        function lumiCheer() {
            cheerIndex = (cheerIndex + 1) % lumiCheerQuotes.length;
            const quoteEl = document.getElementById('lumiDailyQuote');
            if (!quoteEl) return;
            quoteEl.style.opacity = '0';
            quoteEl.style.transform = 'translateY(3px)';
            setTimeout(() => {
                quoteEl.innerHTML = lumiCheerQuotes[cheerIndex];
                quoteEl.style.opacity = '1';
                quoteEl.style.transform = 'translateY(0)';
            }, 180);
        }

        function startDailyReview() {
            if ('speechSynthesis' in window) {
                const utter = new SpeechSynthesisUtterance("Awesome! Let's review 4 vocabulary words with Lumi!");
                utter.lang = 'en-US';
                utter.rate = 0.95;
                window.speechSynthesis.speak(utter);
            }
            showDictToast("🦊 Đang mở 4 từ vựng ôn tập hôm nay (+30 XP)...");
            setTimeout(() => {
                openDictionaryScreen('resilient');
            }, 500);
        }

        const mascotWords = ['resilient', 'serendipity', 'ephemeral', 'profound', 'ubiquitous', 'break the ice'];
        function lumiAsk() {
            const randomWord = mascotWords[Math.floor(Math.random() * mascotWords.length)];
            const bubble = document.getElementById('lumiDictBubble');
            if (bubble) {
                bubble.innerHTML = `<span>🦊</span> Để Lumi mở từ điển tra từ "${randomWord}" nhé!`;
            }
            setTimeout(() => {
                openDictionaryScreen(randomWord);
            }, 300);
        }

        // --- Interactive Lumi Chat System ---
        function openLumiChat() {
            const modal = document.getElementById('lumiChatModal');
            modal.classList.remove('hidden');
            document.getElementById('lumiChatInput').focus();
            if ('speechSynthesis' in window) {
                const utter = new SpeechSynthesisUtterance("Hi Nam! Lumi is ready to practice English with you!");
                utter.lang = 'en-US';
                utter.rate = 0.9;
                window.speechSynthesis.speak(utter);
            }
        }

        function closeLumiChat() {
            document.getElementById('lumiChatModal').classList.add('hidden');
        }

        // --- Flagship Entrance Animation Handover & Replay ---
        function showEntranceToast(msg) {
            let toast = document.getElementById('entranceToast');
            if (!toast) {
                toast = document.createElement('div');
                toast.id = 'entranceToast';
                toast.className = 'fixed top-6 left-1/2 -translate-x-1/2 z-50 px-4 py-2 rounded-full bg-[#252621]/95 text-[#D4EE7F] text-xs font-bold border border-[#B8D166]/40 shadow-[0_8px_24px_rgba(0,0,0,0.8)] backdrop-blur-xl pointer-events-none anim-toast flex items-center gap-2';
                document.body.appendChild(toast);
            }
            toast.innerHTML = `<span class="w-2 h-2 rounded-full bg-[#B8D166] animate-ping"></span><span>${msg}</span>`;
            toast.classList.remove('hidden', 'anim-toast');
            void toast.offsetWidth;
            toast.classList.add('anim-toast');
            setTimeout(() => {
                if (toast) toast.classList.add('hidden');
            }, 1800);
        }

        let entranceTimeout = null;
        function replayHeroEntrance(isManual = true) {
            if (isManual) {
                showEntranceToast("✨ Đang phát lại hiệu ứng vào màn...");
            }
            
            if (typeof currentNavIndex !== 'undefined' && currentNavIndex === 1) {
                if (typeof playCreateScreenEntrance === 'function') {
                    playCreateScreenEntrance();
                    return;
                }
            }
            
            const elements = [
                { id: 'topStatusHUD', cls: 'anim-hud-enter' },
                { id: 'farmHeroScenery', cls: 'anim-scenery-enter' },
                { id: 'lanternIgnitionFlare', cls: 'anim-lantern-flare' },
                { id: 'topProGleam', cls: 'anim-pro-enter-gleam' },
                { id: 'pixarMoonGroup', cls: 'anim-moon-enter' },
                { id: 'lumiHeroMascot', cls: 'anim-lumi-enter' },
                { id: 'lumiSpeechBubble', cls: 'anim-bubble-enter' },
                { id: 'lumiHomeCard', cls: 'anim-card-enter' },
                { id: 'bottomNavPill', cls: 'anim-bottom-nav-enter' }
            ];

            const selectors = [
                { sel: '.anim-specular-sheen', cls: 'anim-specular-sheen' },
                { sel: '.anim-inner-1', cls: 'anim-inner-1' },
                { sel: '.anim-inner-2', cls: 'anim-inner-2' },
                { sel: '.anim-inner-3', cls: 'anim-inner-3' },
                { sel: '.anim-word-chip-1', cls: 'anim-word-chip-1' },
                { sel: '.anim-word-chip-2', cls: 'anim-word-chip-2' },
                { sel: '.anim-word-chip-3', cls: 'anim-word-chip-3' },
                { sel: '.animate-slide-up', cls: 'animate-slide-up' }
            ];
            
            const lumiHero = document.getElementById('lumiHeroMascot');
            if (lumiHero) {
                lumiHero.classList.remove('anim-lumi-idle');
            }

            elements.forEach(item => {
                const el = document.getElementById(item.id);
                if (el) {
                    el.classList.remove(item.cls);
                    void el.offsetWidth;
                    el.classList.add(item.cls);
                }
            });

            selectors.forEach(item => {
                const els = document.querySelectorAll(item.sel);
                els.forEach(el => {
                    el.classList.remove(item.cls);
                    void el.offsetWidth;
                    el.classList.add(item.cls);
                });
            });

            if (entranceTimeout) clearTimeout(entranceTimeout);
            if (lumiHero) {
                entranceTimeout = setTimeout(() => {
                    lumiHero.classList.remove('anim-lumi-enter');
                    lumiHero.classList.add('anim-lumi-idle');
                }, 1400);
            }
        }

        function initFlagshipEntrance() {
            requestAnimationFrame(() => {
                setTimeout(() => {
                    replayHeroEntrance(false);
                }, 60);
            });
        }

        function sendLumiTopic(topic) {
            const container = document.getElementById('lumiChatMessages');
            // User message
            container.innerHTML += `
                <div class="flex justify-end">
                    <div class="bg-gradient-to-r from-amber-400 to-orange-500 text-[#180802] font-semibold text-[13px] px-3.5 py-2 rounded-2xl rounded-tr-sm shadow-md max-w-[80%]">
                        Lumi ơi, mình cùng luyện chủ đề ${topic} nhé!
                    </div>
                </div>
            `;
            container.scrollTop = container.scrollHeight;

            // Lumi typing indicator & reply
            setTimeout(() => {
                let reply = "";
                if (topic.includes('Coffee')) {
                    reply = "Tuyệt vời! Lumi sẽ đóng vai barista tại quán cafe New York nhé! ☕<br><br><b>Barista Lumi:</b> <i>\"Hello! Welcome to Lumi Brews. What can I get started for you today?\"</i><br><br><span class='text-[11px] text-amber-300'>💡 Gợi ý trả lời: \"I'd like an iced latte with oat milk, please.\"</span>";
                } else if (topic.includes('Airport')) {
                    reply = "Okay! Bạn đang ở quầy check-in sân bay quốc tế nhé! ✈️<br><br><b>Officer Lumi:</b> <i>\"Good morning! May I see your passport and ticket, please?\"</i><br><br><span class='text-[11px] text-amber-300'>💡 Gợi ý trả lời: \"Here you go! Is the flight on schedule?\"</span>";
                } else if (topic.includes('IELTS')) {
                    reply = "Chiến luôn IELTS Speaking Part 1 nào! 🎓<br><br><b>Examiner Lumi:</b> <i>\"Let's talk about your hometown. What is the most fascinating thing about your city?\"</i>";
                } else {
                    reply = "Yay! Mình rất thích trò chuyện tự do cùng bạn! Hôm nay bạn cảm thấy thế nào? Kể cho Lumi nghe bằng một câu tiếng Anh xem nào! 🐾✨";
                }

                container.innerHTML += `
                    <div class="flex items-start gap-2.5 animate-fadeIn">
                        <div class="w-7 h-7 rounded-xl bg-[var(--m3-amber-container)] border border-transparent flex items-center justify-center shrink-0 text-xs">
                            🦊
                        </div>
                        <div class="bg-white/[0.08] border border-white/10 text-white text-[13px] p-3 rounded-2xl rounded-tl-sm leading-relaxed max-w-[85%] shadow-md">
                            ${reply}
                        </div>
                    </div>
                `;
                container.scrollTop = container.scrollHeight;
                speakWord("Hello! Let's practice English together!");
            }, 500);
        }

        function sendLumiMessage(text) {
            if (!text || text.trim().length === 0) return;
            const container = document.getElementById('lumiChatMessages');
            const input = document.getElementById('lumiChatInput');
            input.value = '';

            container.innerHTML += `
                <div class="flex justify-end animate-fadeIn">
                    <div class="bg-gradient-to-r from-amber-400 to-orange-500 text-[#180802] font-semibold text-[13px] px-3.5 py-2 rounded-2xl rounded-tr-sm shadow-md max-w-[80%]">
                        ${text}
                    </div>
                </div>
            `;
            container.scrollTop = container.scrollHeight;

            setTimeout(() => {
                container.innerHTML += `
                    <div class="flex items-start gap-2.5 animate-fadeIn">
                        <div class="w-7 h-7 rounded-xl bg-[var(--m3-amber-container)] border border-transparent flex items-center justify-center shrink-0 text-xs">
                            🦊
                        </div>
                        <div class="bg-white/[0.08] border border-white/10 text-white text-[13px] p-3 rounded-2xl rounded-tl-sm leading-relaxed max-w-[85%] shadow-md">
                            Lumi hiểu ý bạn rồi! Câu trả lời rất tự nhiên luôn nha 🌟<br>
                            <span class="text-amber-300 font-medium">Lumi gợi ý thêm một cụm từ nâng cao:</span> <i>\"That sounds fantastic!\"</i>
                        </div>
                    </div>
                `;
                container.scrollTop = container.scrollHeight;
            }, 600);
        }

        function voiceToLumiChat() {
            if ('webkitSpeechRecognition' in window || 'SpeechRecognition' in window) {
                const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
                const rec = new SpeechRecognition();
                rec.lang = 'en-US';
                rec.start();
                const input = document.getElementById('lumiChatInput');
                input.placeholder = '🎙️ Lumi đang lắng nghe bạn nói...';
                rec.onresult = function(event) {
                    const text = event.results[0][0].transcript;
                    input.value = text;
                    sendLumiMessage(text);
                };
                rec.onerror = function() {
                    input.placeholder = 'Nhắn hoặc nói với Lumi...';
                };
            } else {
                sendLumiMessage("Hello Lumi, how are you today?");
            }
        }

        // Dynamic Switcher for Lumi Next-Gen UI (Aurora, Stealth, Companion)
        function setLumiUiStyle(style) {
            const styles = ['aurora', 'stealth', 'companion'];
            const modeAurora = document.getElementById('lumiMode_aurora');
            const modeStealth = document.getElementById('lumiMode_stealth');
            const modeCompanion = document.getElementById('lumiMode_companion');

            // Reset chip button active states
            styles.forEach(s => {
                const btn = document.getElementById(`lumiStyleBtn_${s}`);
                if (btn) {
                    if (s === style) {
                        btn.className = "px-2 py-0.5 rounded-full text-[9.5px] font-black bg-[#3C4D00] text-[#D4EE7F] border border-[#B8D166]/40 shrink-0 cursor-pointer transition-all shadow-[0_0_10px_rgba(184,209,102,0.2)]";
                    } else {
                        btn.className = "px-2 py-0.5 rounded-full text-[9.5px] font-semibold text-white/50 hover:text-white bg-white/5 border border-white/10 shrink-0 cursor-pointer transition-all";
                    }
                }
            });

            // Toggle mode containers
            if (modeAurora) modeAurora.classList.toggle('hidden', style !== 'aurora');
            if (modeStealth) modeStealth.classList.toggle('hidden', style !== 'stealth');
            if (modeCompanion) modeCompanion.classList.toggle('hidden', style !== 'companion');
        }
        window.setLumiUiStyle = setLumiUiStyle;

        // Open dictionary on page load if ?dict=true or ?word=...
        window.addEventListener('DOMContentLoaded', () => {
            const params = new URLSearchParams(window.location.search);
            if (params.has('lumistyle')) {
                setLumiUiStyle(params.get('lumistyle'));
            }
            if (params.has('style')) {
                const s = parseInt(params.get('style'));
                if (s >= 1 && s <= 4) switchDictStyle(s);
            }
            if (params.has('staged')) {
                const val = params.get('staged');
                if (val === 'none' || val === '0' || val === '') {
                    stagedWords = [];
                } else {
                    const wordsList = val.split(',').map(s => s.trim()).filter(Boolean);
                    stagedWords = wordsList.map(w => {
                        const data = fullDictData[w.toLowerCase()] || generateSmartDictEntry(w);
                        return {
                            word: data.word,
                            type: data.type || 'noun',
                            level: data.level ? data.level.split(' ')[0] : 'B2',
                            ipa: data.ipa || '',
                            meaningVi: data.meaningVi || 'Định nghĩa từ vựng',
                            example: (data.examples && data.examples[0]) ? data.examples[0].en : ''
                        };
                    });
                }
                updateStagedWordsUI();
            }
            if (params.has('dict') || params.has('word')) {
                const word = params.get('word') !== null ? params.get('word') : '';
                const tab = params.get('tab');
                const view = params.get('view');
                openDictionaryScreen(word, true);
                if (tab) switchDictTab(tab);
                if (view) switchDictViewMode(view);
                if (params.has('created')) {
                    switchDictViewMode('list');
                    createFlashcardsFromList();
                }
            }
        });