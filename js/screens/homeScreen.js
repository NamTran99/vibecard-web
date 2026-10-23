// ========================================================
// 🏠 HOME SCREEN (TAB 0) - STORYBOOK & CAROUSEL CONTROLLER
// ========================================================

// ========================================================
        // 3D INTERACTIVE STORYBOOK SYSTEM & OPEN SPREAD READER
        // ========================================================
        let currentStoryPage = 0;
        const totalStoryPages = 3;
        const storyChapters = [
            {
                chapterNumber: 1,
                title: "Mưa Dưới Mái Hiên",
                subtitle: "Quán cà phê góc phố",
                category: "☕ Hội thoại đời sống • Mưa đêm Tokyo",
                desc: "Trú mưa bên hiên quán nhỏ & gọi một ly latte ấm nóng. Cùng Lumi khám phá văn hóa trò chuyện tinh tế của người bản xứ.",
                image: "assets/cards/lumi_rain_coffee_eaves.jpg",
                xp: "+350 XP",
                badge: "Đang học",
                progress: 67,
                currentLesson: "Bài 9: Cảm ơn & Tạm biệt",
                totalLessons: 12,
                completedLessons: 8,
                excerptEn: "Outside, the neon lights flickered through the heavy Tokyo rain. Lumi pulled his wool scarf tight, stepping under the cafe eaves. The barista smiled warmly as the aroma of roasted coffee beans drifted through the doorway.",
                excerptVi: "Bên ngoài, ánh đèn neon nhấp nháy qua làn mưa rào Tokyo. Lumi khép chặt chiếc khăn len, bước vào dưới mái hiên quán nhỏ. Người pha chế mỉm cười ấm áp khi hương thơm ngào ngạt của hạt cà phê rang lan tỏa khắp gian phòng.",
                vocab: [
                    { word: "drizzle", ipa: "/ˈdrɪz.əl/", meaning: "mưa phùn lất phất", type: "Danh từ" },
                    { word: "shelter", ipa: "/ˈʃel.tər/", meaning: "chỗ trú mưa, nơi ẩn náu", type: "Danh từ" },
                    { word: "greeting", ipa: "/ˈɡriː.tɪŋ/", meaning: "lời chào hỏi thân tình", type: "Danh từ" },
                    { word: "downpour", ipa: "/ˈdaʊn.pɔːr/", meaning: "cơn mưa rào xối xả", type: "Danh từ" },
                    { word: "eaves", ipa: "/iːvz/", meaning: "mái hiên trú tạm", type: "Danh từ" },
                    { word: "coincidence", ipa: "/kəʊˈɪn.sɪ.dəns/", meaning: "sự tình cờ, duyên ngộ", type: "Danh từ" },
                    { word: "stranger", ipa: "/ˈstreɪn.dʒər/", meaning: "người lạ mặt", type: "Danh từ" },
                    { word: "drenched", ipa: "/drentʃt/", meaning: "ướt sũng dưới mưa", type: "Tính từ" },
                    { word: "awkward", ipa: "/ˈɔː.kwəd/", meaning: "ngượng ngùng, bối rối", type: "Tính từ" },
                    { word: "glance", ipa: "/ɡlɑːns/", meaning: "ánh nhìn thoáng qua", type: "Danh từ" },
                    { word: "encounter", ipa: "/ɪnˈkaʊn.tər/", meaning: "cuộc gặp gỡ định mệnh", type: "Danh từ" },
                    { word: "clearing", ipa: "/ˈklɪə.rɪŋ/", meaning: "bầu trời tạnh ráo", type: "Danh từ" }
                ],
                roadmap: [
                    { num: 1, title: "Chào hỏi dưới mưa", done: true },
                    { num: 2, title: "Tìm chỗ ngồi ấm cúng", done: true },
                    { num: 3, title: "Đọc thực đơn mùa đông", done: true },
                    { num: 4, title: "Gọi một ly latte nóng", done: true },
                    { num: 5, title: "Hỏi mật khẩu Wifi quán", done: true },
                    { num: 6, title: "Bắt chuyện với người bên cạnh", done: true },
                    { num: 7, title: "Khen cà phê ngon", done: true },
                    { num: 8, title: "Hỏi hóa đơn thanh toán", done: true },
                    { num: 9, title: "Cảm ơn & Tạm biệt", active: true, done: false },
                    { num: 10, title: "Hỏi mượn chiếc dù", locked: true },
                    { num: 11, title: "Đường ra trạm tàu điện", locked: true },
                    { num: 12, title: "Tổng kết câu chuyện 1", locked: true }
                ]
            },
            {
                chapterNumber: 2,
                title: "Nhầm Chuyến Xe",
                subtitle: "Chuyến tàu nửa đêm",
                category: "🎫 Du lịch & Khám phá • Ga đêm 00:00",
                desc: "Lên nhầm chuyến tàu đêm đến thành phố ánh sao. Học cách hỏi thông tin vé, đọc biển báo ga và xoay sở tình huống bất ngờ.",
                image: "assets/cards/lumi_train_station_night.jpg",
                xp: "+400 XP",
                badge: "Chưa mở",
                progress: 0,
                currentLesson: "Khóa: Cần hoàn thành Chương 1",
                totalLessons: 10,
                completedLessons: 0,
                excerptEn: "The clock ticked past midnight at Platform 1. Steam hissed from the vintage locomotive as passengers hurried aboard into the swirling mist.",
                excerptVi: "Đồng hồ điểm qua nửa đêm tại Ke số 1. Hơi nước rít lên từ đầu máy xe lửa cổ điển khi những hành khách vội vã bước lên toa trong màn sương mờ ảo.",
                vocab: [
                    { word: "locomotive", ipa: "/ˌləʊ.kəˈməʊ.tɪv/", meaning: "đầu máy xe lửa" },
                    { word: "platform", ipa: "/ˈplæt.fɔːm/", meaning: "sân ga / ke tàu" },
                    { word: "mist", ipa: "/mɪst/", meaning: "màn sương mù nhẹ" }
                ],
                roadmap: [
                    { num: 1, title: "Đọc bảng giờ tàu chạy", locked: true },
                    { num: 2, title: "Hỏi nhân viên soát vé", locked: true },
                    { num: 3, title: "Tìm toa giường nằm", locked: true },
                    { num: 4, title: "Chuyển tuyến khẩn cấp", locked: true }
                ]
            },
            {
                chapterNumber: 3,
                title: "Thử Thách Âm Điệu",
                subtitle: "Đấu trường cực quang",
                category: "🎙️ Phát âm & Ngữ điệu • Trời cực quang",
                desc: "Bắt nhịp ngữ điệu bản xứ dưới trời cực quang. Thử thách bắt tai, nhại giọng theo thang âm chuẩn của diễn viên lồng tiếng.",
                image: "assets/cards/lumi_melody_arena.jpg",
                xp: "+500 XP",
                badge: "Đấu trường",
                progress: 35,
                currentLesson: "Sự kiện tuần: 7/20 câu",
                totalLessons: 20,
                completedLessons: 7,
                excerptEn: "Under the emerald aurora borealis, the amphitheater resonated with pure vocal harmonies echoing across the frosty fjords.",
                excerptVi: "Dưới dải cực quang ngọc lục bảo rực sáng, nhà hát ngoài trời ngân vang những thanh âm hòa nhịp vọng lại qua vịnh băng giá lạnh.",
                vocab: [
                    { word: "aurora", ipa: "/ɔːˈrɔː.rə/", meaning: "cực quang phương bắc" },
                    { word: "resonate", ipa: "/ˈrez.ən.eɪt/", meaning: "ngân vang / vang vọng" },
                    { word: "harmony", ipa: "/ˈhɑː.mə.ni/", meaning: "sự hòa âm / giai điệu" }
                ],
                roadmap: [
                    { num: 1, title: "Khởi động thanh quản", done: true },
                    { num: 2, title: "Ngữ điệu câu hỏi đảo", done: true },
                    { num: 3, title: "Nối âm phụ âm nguyên âm", active: true },
                    { num: 4, title: "Tốc độ 1.5x bản xứ", locked: true }
                ]
            },
            {
                chapterNumber: 4,
                title: "Đêm Hội Đom Đóm",
                subtitle: "Thung lũng đom đóm",
                category: "🌾 Nông thôn yên bình • Đêm ngàn sao",
                desc: "Dạo bước giữa cánh đồng đêm lấp lánh đom đóm. Thu lượm các từ vựng cảm xúc, phong cảnh và ký ức êm dịu.",
                image: "assets/cards/pixar_night_farm_scenery.jpg",
                xp: "+600 XP",
                badge: "Ngoại truyện",
                progress: 15,
                currentLesson: "Chuẩn bị ra mắt tuần này",
                totalLessons: 14,
                completedLessons: 2,
                excerptEn: "Thousands of bioluminescent fireflies illuminated the quiet rice paddies, turning the rural midnight into a glowing constellation.",
                excerptVi: "Hàng ngàn chú đom đóm phát quang thắp sáng những thửa ruộng đêm thanh vắng, biến màn đêm miền quê thành một dải ngân hà lấp lánh.",
                vocab: [
                    { word: "bioluminescent", ipa: "/ˌbaɪ.əʊˌluː.mɪˈnes.ənt/", meaning: "phát quang sinh học" },
                    { word: "constellation", ipa: "/ˌkɒn.stəˈleɪ.ʃən/", meaning: "chòm sao / dải sao" },
                    { word: "serene", ipa: "/səˈriːn/", meaning: "thanh bình / êm ả" }
                ],
                roadmap: [
                    { num: 1, title: "Lạc bước giữa cánh đồng", done: true },
                    { num: 2, title: "Ánh sáng đom đóm", done: true },
                    { num: 3, title: "Trăng soi bóng nước", active: true },
                    { num: 4, title: "Khúc hát côn trùng", locked: true }
                ]
            }
        ];

        // ========================================================
        // STORY PEEK CAROUSEL CONTROLLER & GESTURES
        // ========================================================
        let currentStoryCarouselIdx = 0;
        const totalStoryCards = 4;

        function updateStoryCarouselDots(idx) {
            currentStoryCarouselIdx = Math.max(0, Math.min(idx, totalStoryCards - 1));
            for (let i = 0; i < totalStoryCards; i++) {
                const dot = document.getElementById(`storyDot-${i}`);
                if (!dot) continue;
                if (i === currentStoryCarouselIdx) {
                    dot.className = "h-2 w-7 bg-primary rounded-full transition-all duration-300 shadow-sm";
                } else {
                    dot.className = "h-2 w-2 bg-outlineVariant hover:bg-outline rounded-full transition-all duration-300";
                }
            }
            const counter = document.getElementById('storyCarouselCounter');
            if (counter) {
                counter.innerText = `${currentStoryCarouselIdx + 1} / ${totalStoryCards}`;
            }

            // Update desktop prev/next buttons
            const prevBtn = document.getElementById('carouselPrevBtn');
            const nextBtn = document.getElementById('carouselNextBtn');
            if (prevBtn) prevBtn.disabled = (currentStoryCarouselIdx === 0);
            if (nextBtn) nextBtn.disabled = (currentStoryCarouselIdx === totalStoryCards - 1);
        }

        function scrollStoryCarouselTo(idx) {
            const container = document.getElementById('storyCarouselContainer');
            const targetCard = document.getElementById(`storyCard-${idx}`);
            if (!container || !targetCard) return;

            const cardLeft = targetCard.offsetLeft;
            const containerWidth = container.clientWidth;
            const cardWidth = targetCard.clientWidth;
            const scrollPos = cardLeft - (containerWidth - cardWidth) / 2;

            container.scrollTo({
                left: Math.max(0, scrollPos),
                behavior: 'smooth'
            });
            updateStoryCarouselDots(idx);
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
                SoundEngine.play(1);
            }
        }

        function scrollStoryCarousel(direction) {
            let nextIdx = currentStoryCarouselIdx + direction;
            if (nextIdx < 0) nextIdx = 0;
            if (nextIdx >= totalStoryCards) nextIdx = totalStoryCards - 1;
            scrollStoryCarouselTo(nextIdx);
        }

        function initStoryCarousel() {
            const container = document.getElementById('storyCarouselContainer');
            if (!container) return;

            let isScrolling = null;
            container.addEventListener('scroll', () => {
                clearTimeout(isScrolling);
                isScrolling = setTimeout(() => {
                    const scrollLeft = container.scrollLeft;
                    const containerWidth = container.clientWidth;
                    const centerPoint = scrollLeft + containerWidth / 2;

                    let closestIdx = 0;
                    let minDiff = Infinity;

                    for (let i = 0; i < totalStoryCards; i++) {
                        const card = document.getElementById(`storyCard-${i}`);
                        if (!card) continue;
                        const cardCenter = card.offsetLeft + card.clientWidth / 2;
                        const diff = Math.abs(centerPoint - cardCenter);
                        if (diff < minDiff) {
                            minDiff = diff;
                            closestIdx = i;
                        }
                    }
                    updateStoryCarouselDots(closestIdx);
                }, 60);
            }, { passive: true });

            updateStoryCarouselDots(0);
        }

        // Backward compatibility wrappers
        function flipStoryBook(delta) { scrollStoryCarousel(delta); }
        function goToStoryBookPage(idx) { scrollStoryCarouselTo(idx); }
        function updateStoryBookUI() { updateStoryCarouselDots(currentStoryCarouselIdx); }
        function initStoryBookGestures() { initStoryCarousel(); }

        // Open Book Reader Modal (Story to Card Reader 1:1 Android Native)
        function openStoryBookReader(chapterIdx = 0) {
            const currentCh = (typeof storyChapters !== 'undefined' && storyChapters[chapterIdx]) ? storyChapters[chapterIdx] : null;
            
            const launchReader = () => {
                // Ưu tiên mở trực tiếp Màn hình Đọc truyện Story to Card chuẩn Android 1:1
                if (typeof window.openStoryReaderScreen === 'function') {
                    window.openStoryReaderScreen(currentCh);
                    return;
                }
                if (typeof openStoryReaderScreen === 'function') {
                    openStoryReaderScreen(currentCh);
                    return;
                }

                if (typeof openLessonIntroScreen === 'function') {
                    openLessonIntroScreen(chapterIdx, currentCh);
                    return;
                }
            };

            if (window.LumiEnergy && typeof window.LumiEnergy.consumeForLesson === 'function') {
                window.LumiEnergy.consumeForLesson({ isReviewMode: false }, launchReader);
                return;
            }
            launchReader();
            const ch = currentCh || (typeof storyChapters !== 'undefined' ? storyChapters[0] : null);
            const modal = document.getElementById('storybookSpreadModal');
            if (!modal) return;

            // Default to story tab on mobile
            switchSpreadModalTab('story');

            // Populate data
            const tagEl = document.getElementById('spreadChapterTag');
            const titleEl = document.getElementById('spreadTitle');
            const imgEl = document.getElementById('spreadImg');
            const enEl = document.getElementById('spreadExcerptEn');
            const viEl = document.getElementById('spreadExcerptVi');
            
            if (tagEl) tagEl.innerText = `Chương ${ch.chapterNumber} • ${ch.title}`;
            if (titleEl) titleEl.innerText = ch.title;
            if (imgEl) imgEl.src = ch.image;
            if (enEl) enEl.innerText = `"${ch.excerptEn}"`;
            if (viEl) viEl.innerText = `"${ch.excerptVi}"`;
            
            // Vocab chips
            const vocabContainer = document.getElementById('spreadVocabList');
            if (vocabContainer) {
                vocabContainer.innerHTML = ch.vocab.map(v => `
                    <div class="px-2.5 py-1.5 rounded-xl bg-white/[0.05] border border-white/10 flex items-center gap-2">
                        <span class="text-amber-300 font-bold text-xs">${v.word}</span>
                        <span class="text-[10px] text-textTertiary font-mono">${v.ipa}</span>
                        <span class="text-[11px] text-textSecondary">${v.meaning}</span>
                    </div>
                `).join('');
            }

            // Roadmap
            const roadmapContainer = document.getElementById('spreadRoadmapList');
            if (roadmapContainer) {
                roadmapContainer.innerHTML = ch.roadmap.map(item => {
                    if (item.done) {
                        return `
                            <div class="flex items-center gap-2.5 p-2 rounded-xl bg-primary/10 border border-primary/20 text-xs">
                                <span class="w-5 h-5 rounded-full bg-primary text-onPrimary font-bold text-[10px] flex items-center justify-center shrink-0">✓</span>
                                <span class="text-textPrimary font-semibold flex-1 truncate">Bài ${item.num}: ${item.title}</span>
                                <span class="text-primary text-[10.5px] font-bold">Xong</span>
                            </div>
                        `;
                    } else if (item.active) {
                        return `
                            <div class="flex items-center gap-2.5 p-2.5 rounded-xl bg-amber-400/15 border-2 border-amber-400 text-xs shadow-[0_0_15px_rgba(251,191,36,0.25)]">
                                <span class="w-6 h-6 rounded-full bg-amber-400 text-black font-black text-[11px] flex items-center justify-center shrink-0 animate-bounce">▶</span>
                                <div class="flex-1 truncate">
                                    <div class="text-amber-300 font-black text-xs">Bài ${item.num}: ${item.title}</div>
                                    <div class="text-[10px] text-amber-200/80">Đang học • Tiến độ 67%</div>
                                </div>
                                <span class="px-2 py-0.5 rounded-full bg-amber-400 text-black text-[10px] font-black uppercase">Tiếp tục</span>
                            </div>
                        `;
                    } else {
                        return `
                            <div class="flex items-center gap-2.5 p-2 rounded-xl bg-white/[0.02] border border-white/[0.05] text-xs text-textTertiary opacity-60">
                                <span class="w-5 h-5 rounded-full bg-white/10 text-white/50 text-[10px] flex items-center justify-center shrink-0">🔒</span>
                                <span class="flex-1 truncate">Bài ${item.num}: ${item.title}</span>
                                <span class="text-[10px]">Chưa mở</span>
                            </div>
                        `;
                    }
                }).join('');
            }

            modal.classList.remove('hidden');
            void modal.offsetWidth;
            modal.classList.remove('opacity-0');
            const spreadOpen = modal.querySelector('.book-spread-open');
            if (spreadOpen) {
                spreadOpen.classList.remove('scale-95');
                spreadOpen.classList.add('scale-100');
            }

            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
                SoundEngine.play(9); // magical book open chime
            }
        }

        function switchSpreadModalTab(tab) {
            const pageLeft = document.getElementById('spreadPageLeft');
            const pageRight = document.getElementById('spreadPageRight');
            const tabStory = document.getElementById('spreadTabStory');
            const tabRoadmap = document.getElementById('spreadTabRoadmap');
            if (!pageLeft || !pageRight || !tabStory || !tabRoadmap) return;

            if (tab === 'story') {
                pageLeft.classList.remove('hidden');
                pageRight.classList.add('hidden');
                pageRight.classList.remove('flex');
                pageRight.classList.add('md:flex');
                tabStory.className = "flex-1 py-1.5 text-xs font-bold rounded-lg bg-amber-400 text-black shadow-sm transition-all flex items-center justify-center gap-1.5";
                tabRoadmap.className = "flex-1 py-1.5 text-xs font-bold rounded-lg text-textSecondary hover:text-white transition-all flex items-center justify-center gap-1.5";
            } else {
                pageLeft.classList.add('hidden');
                pageLeft.classList.remove('flex');
                pageLeft.classList.add('md:flex');
                pageRight.classList.remove('hidden');
                pageRight.classList.add('flex');
                tabStory.className = "flex-1 py-1.5 text-xs font-bold rounded-lg text-textSecondary hover:text-white transition-all flex items-center justify-center gap-1.5";
                tabRoadmap.className = "flex-1 py-1.5 text-xs font-bold rounded-lg bg-amber-400 text-black shadow-sm transition-all flex items-center justify-center gap-1.5";
                setTimeout(() => {
                    const roadmapContainer = document.getElementById('spreadRoadmapList');
                    if (roadmapContainer) {
                        const activeItem = roadmapContainer.querySelector('.animate-bounce');
                        if (activeItem) activeItem.scrollIntoView({ block: 'center', behavior: 'smooth' });
                    }
                }, 80);
            }
        }

        function closeStoryBookReader() {
            const modal = document.getElementById('storybookSpreadModal');
            if (!modal) return;
            modal.classList.add('opacity-0');
            const spreadOpen = modal.querySelector('.book-spread-open');
            if (spreadOpen) {
                spreadOpen.classList.add('scale-95');
            }
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
            if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
                SoundEngine.play(8); // book close click
            }
        }

        // Expose to window for inline onclick handlers
        window.openStoryBookReader = openStoryBookReader;
        window.closeStoryBookReader = closeStoryBookReader;

        // Initialize story carousel when script loads or DOM is ready
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', () => {
                initStoryCarousel();
            });
        } else {
            initStoryCarousel();
        }
