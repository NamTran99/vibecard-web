// ========================================================
// 🗺️ MYSTERY ROADMAP DATA CATALOG & SHEET RENDERER
// Ceiling: < 350 lines | Standard: Material Design 3 Dark Olive Green
// ========================================================

(function (window) {
    'use strict';

    const GENRE_CATALOG = {
        kids_fable: {
            id: 'kids_fable',
            icon: '🐾',
            name: 'Đồng Thoại & Ngụ Ngôn',
            ageBadge: '3+',
            ageClass: 'age-badge-3',
            color: '#B8D166',
            desc: 'Ngụ ngôn ngắn, động vật thông thái, hạt giống tử tế & bài học ý nghĩa.',
            stories: [
                {
                    title: "Ngụ ngôn: Rùa và Thỏ",
                    subtitle: "Bài học về sự kiên trì",
                    age: "3+",
                    img: "assets/cards/lumi_farmer_strawhat.jpg",
                    scenario: "Cuộc đua vô tiền khoáng hậu giữa chú Thỏ kiêu ngạo và chú Rùa điềm tĩnh tại thung lũng mùa xuân.",
                    duration: "4 phút"
                },
                {
                    title: "Ngụ ngôn: Quạ và Bình Nước",
                    subtitle: "Sự thông minh và kiên nhẫn",
                    age: "3+",
                    img: "assets/cards/lumi_melody_arena.jpg",
                    scenario: "Chú Quạ khát nước khéo léo dùng sỏi để nâng mực nước trong chiếc bình sâu đáy.",
                    duration: "3 phút"
                }
            ]
        },
        travel_daily: {
            id: 'travel_daily',
            icon: '✈️',
            name: 'Du Ký & Đời Thường',
            ageBadge: '15+',
            ageClass: 'age-badge-15',
            color: '#FBBF24',
            desc: 'Trú mưa quán cà phê Tokyo, chuyến tàu đêm 00:00, hỏi đường & ẩm thực phố.',
            stories: [
                {
                    title: "Mưa Dưới Mái Hiên",
                    subtitle: "Quán cà phê góc phố Tokyo",
                    age: "15+",
                    img: "assets/cards/lumi_rain_coffee_eaves.jpg",
                    scenario: "Trú mưa bên hiên quán nhỏ & gọi một ly latte ấm nóng. Nét tinh tế trong giao tiếp bản xứ.",
                    duration: "5 phút"
                },
                {
                    title: "Chuyến Tàu Đêm Nửa Đêm",
                    subtitle: "Sân ga mù sương 00:00",
                    age: "15+",
                    img: "assets/cards/lumi_train_station_night.jpg",
                    scenario: "Hơi nước rít lên tại Ke ga số 1 khi đồng hồ điểm qua nửa đêm. Hỏi giờ và đọc biển báo tàu.",
                    duration: "5 phút"
                }
            ]
        },
        pro_business: {
            id: 'pro_business',
            icon: '💼',
            name: 'Công Sở & Đàm Phán',
            ageBadge: '18+',
            ageClass: 'age-badge-18',
            color: '#FB7185',
            desc: 'Phỏng vấn công nghệ, giải quyết xung đột dự án, đàm phán hợp đồng sắc bén.',
            stories: [
                {
                    title: "Bản Đàm Phán Đêm Muộn",
                    subtitle: "Ký kết thương vụ quốc tế",
                    age: "18+",
                    img: "assets/cards/lumi_review_flashcards.jpg",
                    scenario: "Thương thảo điều khoản hợp đồng gấp trước thời hạn đóng phiên giao dịch.",
                    duration: "7 phút"
                },
                {
                    title: "Chiếc Thẻ Nhầm Tên",
                    subtitle: "Sảnh đăng ký hội nghị AI",
                    age: "18+",
                    img: "assets/cards/pixar_night_farm_scenery.jpg",
                    scenario: "Xử lý tình huống nhầm lẫn thông tin đại biểu lịch thiệp tại hội nghị quốc tế.",
                    duration: "6 phút"
                }
            ]
        },
        mystery_random: {
            id: 'mystery_random',
            icon: '🎲',
            name: 'Chiếc Hộp Pandora',
            ageBadge: '🎲 Tùy biến',
            ageClass: 'age-badge-10',
            color: '#38BDF8',
            desc: 'Để số phận quyết định! Hệ thống sẽ chọn ngẫu nhiên một câu chuyện bất ngờ nhất.',
            stories: []
        }
    };

    function renderMysteryGenreCardsList() {
        const container = document.getElementById('genreCardsListContainer');
        if (!container) return;

        container.innerHTML = `
            <div class="genre-choice-card" onclick="handleSelectGenreAndReveal('kids_fable')">
                <div class="genre-choice-icon-box" style="background: rgba(184,209,102,0.16); border-color: rgba(184,209,102,0.4);">🐾</div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-0.5">
                        <span class="text-[15px] font-bold text-[var(--rm-on-surface)] tracking-tight">Đồng Thoại & Ngụ Ngôn</span>
                        <span class="age-badge age-badge-3">3+ • All Ages</span>
                    </div>
                    <p class="text-[11.5px] text-[var(--rm-on-surface-variant)] leading-relaxed">Bài học cuộc sống, động vật thông thái & ngữ cảnh ấm áp.</p>
                </div>
            </div>
            <div class="genre-choice-card" onclick="handleSelectGenreAndReveal('travel_daily')">
                <div class="genre-choice-icon-box" style="background: rgba(251,191,36,0.16); border-color: rgba(251,191,36,0.4);">✈️</div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-0.5">
                        <span class="text-[15px] font-bold text-[var(--rm-on-surface)] tracking-tight">Du Ký & Đời Thường</span>
                        <span class="age-badge age-badge-15">15+ • Thực Tế</span>
                    </div>
                    <p class="text-[11.5px] text-[var(--rm-on-surface-variant)] leading-relaxed">Quán cà phê Tokyo dưới mưa, bắt chuyện người lạ, hỏi giờ tàu.</p>
                </div>
            </div>
            <div class="genre-choice-card" onclick="handleSelectGenreAndReveal('pro_business')">
                <div class="genre-choice-icon-box" style="background: rgba(244,63,94,0.15); border-color: rgba(244,63,94,0.38);">💼</div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-0.5">
                        <span class="text-[15px] font-bold text-[var(--rm-on-surface)] tracking-tight">Công Sở & Đàm Phán</span>
                        <span class="age-badge age-badge-18">18+ • Người Lớn</span>
                    </div>
                    <p class="text-[11.5px] text-[var(--rm-on-surface-variant)] leading-relaxed">Thương thảo hợp đồng, giải quyết xung đột dự án & đối đáp sắc bén.</p>
                </div>
            </div>
            <div class="genre-choice-card genre-choice-card-random" onclick="handleSelectGenreAndReveal('mystery_random')">
                <div class="genre-choice-icon-box" style="background: rgba(56,189,248,0.18); border-color: rgba(56,189,248,0.45);">🎲</div>
                <div class="flex-1 min-w-0">
                    <div class="flex items-center justify-between mb-0.5">
                        <span class="text-[15px] font-black text-[var(--rm-on-surface)] tracking-tight">Chiếc Hộp Pandora</span>
                        <span class="age-badge age-badge-10">🎲 Random</span>
                    </div>
                    <p class="text-[11.5px] text-[var(--rm-on-surface-variant)] leading-relaxed">Để định mệnh lựa chọn! Tự động quét và khớp câu chuyện ngẫu nhiên.</p>
                </div>
            </div>
        `;
    }

    window.MYSTERY_GENRE_CATALOG = GENRE_CATALOG;
    window.renderMysteryGenreCardsList = renderMysteryGenreCardsList;
})(window);
