// ========================================================
// 🗺️ MYSTERY ROADMAP DATA CATALOG (GENRE & AGE RATINGS)
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

    window.MYSTERY_GENRE_CATALOG = GENRE_CATALOG;
})(window);
