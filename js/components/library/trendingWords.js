        // --- Shuffle Trending Words Logic (Tactile Discovery Mini Cards) ---
        const trendingWordPools = [
            [
                { word: 'resilient', level: 'B2', type: 'ADJ', ipa: '/rɪˈzɪl.jənt/', accent: 'primary', vi: 'kiên cường, bền bỉ' },
                { word: 'serendipity', level: 'C2', type: 'NOUN', ipa: '/ˌser.ənˈdɪp.ə.ti/', accent: 'amber', vi: 'may mắn bất ngờ' },
                { word: 'break the ice', level: 'B1', type: 'IDIOM', ipa: '/breɪk ðiː aɪs/', accent: 'tertiary', vi: 'phá vỡ e ngại' },
                { word: 'ephemeral', level: 'C2', type: 'ADJ', ipa: '/ɪˈfem.ər.əl/', accent: 'purple', vi: 'chóng tàn, phù du' }
            ],
            [
                { word: 'lucid', level: 'C1', type: 'ADJ', ipa: '/ˈluː.sɪd/', accent: 'tertiary', vi: 'minh bạch, sáng suốt' },
                { word: 'eloquent', level: 'C1', type: 'ADJ', ipa: '/ˈel.ə.kwənt/', accent: 'amber', vi: 'hùng hồn, truyền cảm' },
                { word: 'cut corners', level: 'B2', type: 'IDIOM', ipa: '/kʌt ˈkɔː.nərz/', accent: 'primary', vi: 'đốt cháy giai đoạn' },
                { word: 'tenacious', level: 'C2', type: 'ADJ', ipa: '/təˈneɪ.ʃəs/', accent: 'purple', vi: 'kiên trì, ngoan cường' }
            ],
            [
                { word: 'catalyst', level: 'C1', type: 'NOUN', ipa: '/ˈkæt.əl.ɪst/', accent: 'tertiary', vi: 'chất xúc tác, động lực' },
                { word: 'pragmatic', level: 'C1', type: 'ADJ', ipa: '/præɡˈmæt.ɪk/', accent: 'amber', vi: 'thực tế, sắc bén' },
                { word: 'spill the beans', level: 'B1', type: 'IDIOM', ipa: '/spɪl ðə biːnz/', accent: 'primary', vi: 'tiết lộ bí mật' },
                { word: 'ubiquitous', level: 'C2', type: 'ADJ', ipa: '/juːˈbɪk.wɪ.təs/', accent: 'purple', vi: 'phổ biến ở khắp nơi' }
            ]
        ];
        let currentWordPoolIndex = 0;

        function getTrendingAccentStyle(accent) {
            switch(accent) {
                case 'amber':
                    return {
                        bandCls: 'disc-band-amber bg-gradient-to-r from-[#3D2E0B]/90 via-[#2F2104]/70 to-transparent border-amber-400/25',
                        borderBottom: 'border-b-amber-400 hover:border-b-amber-300',
                        badgeCls: 'bg-[#3D2E0B]/90 text-amber-300 border-amber-400/40',
                        badgeDot: 'bg-amber-400',
                        accentHover: 'group-hover/card:text-amber-400',
                        glowHover: 'hover:shadow-[0_12px_28px_rgba(245,158,11,0.22)]',
                        audioHover: 'hover:bg-amber-400 hover:text-amber-950 hover:border-amber-400',
                        arrowColor: 'text-amber-400'
                    };
                case 'tertiary':
                    return {
                        bandCls: 'disc-band-tertiary bg-gradient-to-r from-[#214E46]/90 via-[#163832]/70 to-transparent border-[#A1D0C5]/25',
                        borderBottom: 'border-b-[#A1D0C5] hover:border-b-[#BDECE1]',
                        badgeCls: 'bg-[#163832]/90 text-[#BDECE1] border-[#A1D0C5]/40',
                        badgeDot: 'bg-[#A1D0C5]',
                        accentHover: 'group-hover/card:text-[#A1D0C5]',
                        glowHover: 'hover:shadow-[0_12px_28px_rgba(161,208,197,0.22)]',
                        audioHover: 'hover:bg-[#A1D0C5] hover:text-[#00201B] hover:border-[#A1D0C5]',
                        arrowColor: 'text-[#A1D0C5]'
                    };
                case 'purple':
                    return {
                        bandCls: 'disc-band-purple bg-gradient-to-r from-[#381E72]/90 via-[#271052]/70 to-transparent border-[#D0BCFF]/25',
                        borderBottom: 'border-b-[#D0BCFF] hover:border-b-[#E8DEF8]',
                        badgeCls: 'bg-[#381E72]/90 text-[#E8DEF8] border-[#D0BCFF]/40',
                        badgeDot: 'bg-[#D0BCFF]',
                        accentHover: 'group-hover/card:text-[#D0BCFF]',
                        glowHover: 'hover:shadow-[0_12px_28px_rgba(208,188,255,0.22)]',
                        audioHover: 'hover:bg-[#D0BCFF] hover:text-[#21005D] hover:border-[#D0BCFF]',
                        arrowColor: 'text-[#D0BCFF]'
                    };
                case 'primary':
                default:
                    return {
                        bandCls: 'disc-band-primary bg-gradient-to-r from-[#3C4D00]/90 via-[#2A3700]/70 to-transparent border-[#B8D166]/25',
                        borderBottom: 'border-b-[#B8D166] hover:border-b-[#D4EE7F]',
                        badgeCls: 'bg-[#283500]/80 text-[#D4EE7F] border-[#B8D166]/40',
                        badgeDot: 'bg-[#B8D166]',
                        accentHover: 'group-hover/card:text-[#B8D166]',
                        glowHover: 'hover:shadow-[0_12px_28px_rgba(184,209,102,0.22)]',
                        audioHover: 'hover:bg-[#B8D166] hover:text-[#283500] hover:border-[#B8D166]',
                        arrowColor: 'text-[#B8D166]'
                    };
            }
        }

        function renderTrendingCard(item, index = 0) {
            const st = getTrendingAccentStyle(item.accent);
            return `
            <div onclick="openDictionaryScreen('${item.word.replace(/'/g, "\\'")}')" 
                 class="discovery-ticket-card group/card relative flex flex-col justify-between rounded-[24px] border-b-[4px] ${st.borderBottom} ${st.glowHover} active:scale-[0.98] active:translate-y-1 active:border-b-[2px] transition-all duration-200 shrink-0 cursor-pointer text-left snap-start min-w-[200px] sm:min-w-[215px] max-w-[225px] overflow-hidden select-none anim-word-chip-${(index % 4) + 1}">
                
                <!-- Top Header Band: CEFR Badge + XP Gamification -->
                <div class="${st.bandCls} px-3.5 py-2.5 flex items-center justify-between border-b relative z-10">
                    <span class="disc-badge inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-full text-[10px] font-black uppercase tracking-wider ${st.badgeCls} border shadow-xs">
                        <span class="w-1.5 h-1.5 rounded-full ${st.badgeDot} animate-pulse"></span>
                        <span>${item.level} • ${item.type}</span>
                    </span>
                    <span class="disc-xp-chip text-[9.5px] font-black px-2 py-0.5 rounded-md bg-amber-400/20 text-amber-300 border border-amber-400/30 shadow-xs flex items-center gap-1">
                        <span>⚡</span><span>+15 XP</span>
                    </span>
                </div>

                <!-- Body: Word + Monospace IPA + Tactile Audio Button -->
                <div class="p-3.5 pb-2.5 flex-1 flex flex-col justify-between relative z-10">
                    <div class="flex items-start justify-between gap-2">
                        <div class="min-w-0 flex-1">
                            <span class="disc-title text-[18.5px] font-black ${st.accentHover} transition-colors block truncate leading-tight tracking-tight">
                                ${item.word}
                            </span>
                            <span class="disc-ipa text-[11px] font-mono block mt-0.5 tracking-tight truncate">
                                ${item.ipa}
                            </span>
                        </div>
                        <button onclick="event.stopPropagation(); playQuickWordAudio('${item.word.replace(/'/g, "\\'")}', this)" 
                                class="disc-audio-btn w-7 h-7 rounded-full border ${st.audioHover} flex items-center justify-center shrink-0 transition-all duration-200 active:scale-85 shadow-xs group/audio" 
                                title="Nghe phát âm chuẩn">
                            <svg class="w-3.5 h-3.5 group-hover/audio:scale-110 transition-transform" fill="currentColor" viewBox="0 0 24 24">
                                <path d="M3 9v6h4l5 5V4L7 9H3zm13.5 3c0-1.77-1.02-3.29-2.5-4.03v8.05c1.48-.73 2.5-2.25 2.5-4.02zM14 3.23v2.06c2.89.86 5 3.54 5 6.71s-2.11 5.85-5 6.71v2.06c4.01-.91 7-4.49 7-8.77s-2.99-7.86-7-8.77z"/>
                            </svg>
                        </button>
                    </div>

                    <!-- Ticket Perforated Divider & Meaning Shelf -->
                    <div class="disc-dashed mt-3 pt-2.5 border-t border-dashed flex items-center justify-between gap-1.5">
                        <span class="disc-meaning text-[12px] font-bold ${st.accentHover} line-clamp-1 transition-colors leading-snug">
                            ${item.vi}
                        </span>
                        <svg class="w-3.5 h-3.5 ${st.arrowColor} opacity-0 group-hover/card:opacity-100 transition-all transform group-hover/card:translate-x-0.5 shrink-0" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2.5" d="M9 5l7 7-7 7"/>
                        </svg>
                    </div>
                </div>
            </div>
            `;
        }

        function playQuickWordAudio(word, btn) {
            if (typeof speakWordAccent === 'function') {
                speakWordAccent(word, 'en-US', false);
            }
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
                SoundEngine.play(4);
            }
            if (btn) {
                btn.classList.add('scale-125', 'bg-primary', 'text-onPrimary');
                setTimeout(() => {
                    btn.classList.remove('scale-125', 'bg-primary', 'text-onPrimary');
                }, 300);
            }
        }

        function shuffleTrendingWords() {
            currentWordPoolIndex = (currentWordPoolIndex + 1) % trendingWordPools.length;
            const pool = trendingWordPools[currentWordPoolIndex];
            const listEl = document.getElementById('trendingWordList');
            if (!listEl) return;
            
            listEl.style.opacity = '0';
            listEl.style.transform = 'translateY(6px)';
            
            setTimeout(() => {
                listEl.innerHTML = pool.map((item, idx) => renderTrendingCard(item, idx)).join('');
                listEl.style.opacity = '1';
                listEl.style.transform = 'translateY(0)';
            }, 180);
        }

        // --- 4 Unique Dictionary Styles Switcher ---
        const dictStyleNames = [
            "1. Cyber Arcade",
            "2. Aurora Crystal",
            "3. Magic Grimoire",
            "4. Neo-Tactile HUD"
        ];
        let currentDictStyle = 1;

        function switchDictStyle(styleNum) {
            currentDictStyle = styleNum;
            for (let i = 1; i <= 4; i++) {
                const el = document.getElementById('dictStyle' + i);
                const tab = document.getElementById('styleTab' + i);
                if (el) {
                    if (i === styleNum) {
                        el.classList.remove('hidden');
                        el.classList.add('animate-fadeIn');
                    } else {
                        el.classList.add('hidden');
                        el.classList.remove('animate-fadeIn');
                    }
                }
                if (tab) {
                    if (i === styleNum) {
                        tab.className = "style-tab py-1.5 px-1 rounded-xl text-[10.5px] font-black text-center transition-all bg-gradient-to-r from-amber-400 to-orange-500 text-black shadow-md cursor-pointer";
                    } else {
                        tab.className = "style-tab py-1.5 px-1 rounded-xl text-[10.5px] font-bold text-white/60 hover:text-white text-center transition-all cursor-pointer";
                    }
                }
            }
            const badge = document.getElementById('activeStyleBadge');
            if (badge) badge.innerText = dictStyleNames[styleNum - 1];
        }
