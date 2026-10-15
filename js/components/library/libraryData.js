// ========================================================
// 📚 LIBRARY & SRS LEITNER VOCABULARY DECKS DATA
// ========================================================

// ===================================================================
        // NATIVE M3-07 DARK OLIVE GREEN LIBRARY & SRS LEITNER CONTROLLER
        // ===================================================================
        let libraryDecks = [
            {
                deckKey: 'deck-farm-night',
                title: 'Nông trại đêm hè',
                sourceFilter: 'STORY',
                sourceLabel: 'Truyện',
                accentColor: '#B8D166',
                badge: 'MỚI',
                meta: '10 phút trước',
                latestUpdatedAt: Date.now() - 10 * 60 * 1000,
                coverUri: 'assets/cards/pixar_night_farm_scenery.jpg',
                topicId: 'topic_001',
                cards: [
                    {
                        term: 'firefly',
                        ipa: '/ˈfaɪər.flaɪ/',
                        type: 'Danh từ',
                        meaning: 'Đom đóm phát sáng lập lòe trong đêm thanh vắng',
                        example: 'Hundreds of fireflies lit up the summer night farm with golden glow.',
                        image: 'assets/cards/pixar_night_farm_scenery.jpg',
                        leitnerLevel: 4
                    },
                    {
                        term: 'harvest',
                        ipa: '/ˈhɑːr.vɪst/',
                        type: 'Danh từ',
                        meaning: 'Mùa vụ thu hoạch lúa mì và nông sản bội thu',
                        example: 'Farmers gather the golden grain during the autumn harvest.',
                        image: 'assets/cards/lumi_farmer_night.png',
                        leitnerLevel: 3
                    },
                    {
                        term: 'serene',
                        ipa: '/səˈriːn/',
                        type: 'Tính từ',
                        meaning: 'Thanh bình, tĩnh lặng và yên ả không chút gợn sóng',
                        example: 'The countryside feels wonderfully serene under starry skies.',
                        image: 'assets/cards/pixar_night_farm_scenery.jpg',
                        leitnerLevel: 4
                    },
                    {
                        term: 'meadow',
                        ipa: '/ˈmed.oʊ/',
                        type: 'Danh từ',
                        meaning: 'Đồng cỏ xanh tươi trải dài bên sườn đồi thoai thoải',
                        example: 'Dewdrops glisten on the wild grass across the misty meadow.',
                        image: 'assets/cards/pixar_night_farm_scenery.jpg',
                        leitnerLevel: 2
                    },
                    {
                        term: 'barn',
                        ipa: '/bɑːrn/',
                        type: 'Danh từ',
                        meaning: 'Kho thóc, chuồng trại nông thôn lát gỗ mộc mạc',
                        example: 'The wooden barn was warmly lit by an old kerosene lantern.',
                        image: 'assets/cards/pixar_night_farm_scenery.jpg',
                        leitnerLevel: 1
                    }
                ]
            },
            {
                deckKey: 'deck-coffee-rain',
                title: 'Cà phê mưa ngâu',
                sourceFilter: 'AUDIO',
                sourceLabel: 'Audio',
                accentColor: '#A1D0C5',
                badge: null,
                meta: '2 giờ trước',
                latestUpdatedAt: Date.now() - 2 * 3600 * 1000,
                coverUri: 'assets/cards/lumi_rain_coffee_eaves.jpg',
                topicId: 'topic_002',
                cards: [
                    {
                        term: 'aroma',
                        ipa: '/əˈroʊ.mə/',
                        type: 'Danh từ',
                        meaning: 'Hương thơm nồng nàn đặc trưng của cà phê rang xay',
                        example: 'The rich aroma of freshly roasted espresso filled the room.',
                        image: 'assets/cards/lumi_rain_coffee_eaves.jpg',
                        leitnerLevel: 4
                    },
                    {
                        term: 'drizzle',
                        ipa: '/ˈdrɪz.əl/',
                        type: 'Danh từ',
                        meaning: 'Cơn mưa phùn lất phất tí tách ngoài hiên nhỏ',
                        example: 'A gentle afternoon drizzle tapped softly against the café glass.',
                        image: 'assets/cards/lumi_rain_coffee_eaves.jpg',
                        leitnerLevel: 3
                    },
                    {
                        term: 'ambiance',
                        ipa: '/ˈæm.bi.əns/',
                        type: 'Danh từ',
                        meaning: 'Bầu không khí, cảm giác ấm cúng của quán nhỏ',
                        example: 'The warm jazz tune created an intimate, relaxing coffee ambiance.',
                        image: 'assets/cards/lumi_rain_coffee_eaves.jpg',
                        leitnerLevel: 3
                    },
                    {
                        term: 'linger',
                        ipa: '/ˈlɪŋ.ɡər/',
                        type: 'Động từ',
                        meaning: 'Vương vấn, nấn ná đọng lại dư vị ngọt ngào',
                        example: 'The sweet caramel aftertaste continued to linger on the tongue.',
                        image: 'assets/cards/lumi_rain_coffee_eaves.jpg',
                        leitnerLevel: 2
                    }
                ]
            },
            {
                deckKey: 'deck-night-train',
                title: 'Chuyến tàu đêm',
                sourceFilter: 'OCR',
                sourceLabel: 'OCR',
                accentColor: '#38BDF8',
                badge: null,
                meta: 'Hôm qua',
                latestUpdatedAt: Date.now() - 24 * 3600 * 1000,
                coverUri: 'assets/cards/lumi_train_station_night.jpg',
                topicId: 'topic_003',
                cards: [
                    {
                        term: 'platform',
                        ipa: '/ˈplæt.fɔːrm/',
                        type: 'Danh từ',
                        meaning: 'Sân ga, thềm ga hành khách đợi tàu cập bến',
                        example: 'Passengers hurried along the chilly platform to catch the train.',
                        image: 'assets/cards/lumi_train_station_night.jpg',
                        leitnerLevel: 4
                    },
                    {
                        term: 'journey',
                        ipa: '/ˈdʒɜːr.ni/',
                        type: 'Danh từ',
                        meaning: 'Cuộc hành trình dài đầy trải nghiệm và khám phá',
                        example: 'Every great journey begins with a courageous single step.',
                        image: 'assets/cards/lumi_train_station_night.jpg',
                        leitnerLevel: 4
                    },
                    {
                        term: 'departure',
                        ipa: '/dɪˈpɑːr.tʃər/',
                        type: 'Danh từ',
                        meaning: 'Giờ khởi hành xuất bến của chuyến tàu lúc nửa đêm',
                        example: 'The whistle signaled the train’s midnight departure into the mist.',
                        image: 'assets/cards/lumi_train_station_night.jpg',
                        leitnerLevel: 3
                    },
                    {
                        term: 'commuter',
                        ipa: '/kəˈmjuː.tər/',
                        type: 'Danh từ',
                        meaning: 'Người đi lại thường xuyên bằng phương tiện công cộng',
                        example: 'Weary commuters read novels quietly under the dim carriage lights.',
                        image: 'assets/cards/lumi_train_station_night.jpg',
                        leitnerLevel: 2
                    },
                    {
                        term: 'scenery',
                        ipa: '/ˈsiː.nər.i/',
                        type: 'Danh từ',
                        meaning: 'Phong cảnh non nước hữu tình vút qua khung cửa sổ',
                        example: 'The moonlit mountain scenery flashed past the speeding window.',
                        image: 'assets/cards/lumi_train_station_night.jpg',
                        leitnerLevel: 1
                    }
                ]
            },
            {
                deckKey: 'deck-ielts-vocab',
                title: 'IELTS Band 7.0 Vocabulary',
                sourceFilter: 'TEXT',
                sourceLabel: 'Văn bản',
                accentColor: 'var(--m3-primary)',
                badge: null,
                meta: '2 ngày trước',
                latestUpdatedAt: Date.now() - 48 * 3600 * 1000,
                coverUri: 'assets/cards/lumi_melody_arena.jpg',
                topicId: null,
                cards: [
                    {
                        term: 'ubiquitous',
                        ipa: '/juːˈbɪk.wə.təs/',
                        type: 'Tính từ',
                        meaning: 'Phổ biến, hiện diện khắp mọi nơi trong đời sống',
                        example: 'Digital technology has become ubiquitous in modern education.',
                        image: 'assets/cards/resilient.jpg',
                        leitnerLevel: 3
                    },
                    {
                        term: 'meticulous',
                        ipa: '/məˈtɪk.jə.ləs/',
                        type: 'Tính từ',
                        meaning: 'Tỉ mỉ, cẩn trọng từng chi tiết nhỏ với độ chính xác cao',
                        example: 'She was meticulous in documenting every experimental finding.',
                        image: 'assets/cards/meticulous.jpg',
                        leitnerLevel: 4
                    },
                    {
                        term: 'pragmatic',
                        ipa: '/præɡˈmæt.ɪk/',
                        type: 'Tính từ',
                        meaning: 'Thực tế, có tính ứng dụng cao thay vì lý thuyết suông',
                        example: 'We must adopt a pragmatic approach to solve resource constraints.',
                        image: 'assets/cards/serendipity.jpg',
                        leitnerLevel: 3
                    },
                    {
                        term: 'resilient',
                        ipa: '/rɪˈzɪl.jənt/',
                        type: 'Tính từ',
                        meaning: 'Kiên cường, mau hồi phục sau những vấp ngã thử thách',
                        example: 'Young learners are remarkably resilient when guided with empathy.',
                        image: 'assets/cards/resilient.jpg',
                        leitnerLevel: 2
                    },
                    {
                        term: 'eloquent',
                        ipa: '/ˈel.ə.kwənt/',
                        type: 'Tính từ',
                        meaning: 'Hùng biện lưu loát, truyền cảm và giàu sức thuyết phục',
                        example: 'Her eloquent speech moved the entire audience to applause.',
                        image: 'assets/cards/lumi_melody_arena.jpg',
                        leitnerLevel: 1
                    },
                    {
                        term: 'serendipity',
                        ipa: '/ˌser.ənˈdɪp.ə.t̬i/',
                        type: 'Danh từ',
                        meaning: 'Sự tình cờ may mắn mang lại phát hiện quý báu',
                        example: 'Discovering this charming old book was pure serendipity.',
                        image: 'assets/cards/serendipity.jpg',
                        leitnerLevel: 4
                    }
                ]
            }
        ];

        let activeCatalogSourceFilter = 'ALL';
        let activeCatalogLevelFilter = null;
        let currentDetailDeckKey = null;
        let activeDetailLevelFilter = null;
        let detailSearchQuery = '';
