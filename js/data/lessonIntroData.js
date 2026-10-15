// ========================================================
// 📚 LESSON INTRO DATA REPOSITORY
// Module: js/data/lessonIntroData.js
// Ceiling: < 350 lines | Role: Sample Chapters & Curriculum Data
// ========================================================

(function (window) {
    'use strict';

    window.lessonIntroData = [
        {
            chapterNumber: 1,
            title: "Mưa Dưới Mái Hiên",
            subtitle: "Quán cà phê góc phố",
            category: "CHƯƠNG 1 • QUÁN NHỎ DƯỚI MƯA",
            lessonType: "dialogue",
            breadcrumb: "Hội thoại",
            desc: "Trú mưa bên hiên quán nhỏ & gọi một ly latte ấm nóng. Cùng Lumi khám phá văn hóa trò chuyện tinh tế và phản xạ từ vựng của người bản xứ.",
            image: "assets/cards/lumi_rain_coffee_eaves.jpg",
            thumbnail: "assets/cards/lumi_rain_coffee_eaves.jpg",
            duration: "15 min",
            progressPill: "Bài 1/12",
            progressPercent: 67,
            auraColor: "rgba(82, 102, 0, 0.45)",
            auraColorLight: "rgba(184, 209, 102, 0.35)",
            miniPlayerBg: "#2B3400",
            miniPlayerBgDark: "#1A2200",
            vocab: [
                { word: "drizzle", ipa: "/ˈdrɪz.əl/", meaning: "mưa phùn lất phất", type: "Danh từ", example: { en: "A gentle drizzle began to fall as we stepped outside.", vi: "Một cơn mưa phùn nhẹ bắt đầu rơi khi chúng tôi bước ra ngoài." } },
                { word: "shelter", ipa: "/ˈʃel.tər/", meaning: "chỗ trú mưa, nơi ẩn náu", type: "Danh từ", example: { en: "They took shelter under the cafe eaves to stay dry.", vi: "Họ trú tạm dưới mái hiên quán cà phê để tránh ướt." } },
                { word: "greeting", ipa: "/ˈɡriː.tɪŋ/", meaning: "lời chào hỏi thân tình", type: "Danh từ", example: { en: "A warm greeting from the barista brightened my day.", vi: "Lời chào ấm áp từ người pha chế làm bừng sáng ngày của tôi." } },
                { word: "downpour", ipa: "/ˈdaʊn.pɔːr/", meaning: "cơn mưa rào xối xả", type: "Danh từ", example: { en: "The sudden downpour soaked the streets in minutes.", vi: "Cơn mưa rào bất chợt làm ướt sũng các con phố chỉ trong vài phút." } },
                { word: "eaves", ipa: "/iːvz/", meaning: "mái hiên trú tạm", type: "Danh từ", example: { en: "Raindrops dripped steadily from the wooden eaves.", vi: "Những giọt mưa nhỏ đều đều từ mái hiên gỗ." } },
                { word: "coincidence", ipa: "/kəʊˈɪn.sɪ.dəns/", meaning: "sự tình cờ, duyên ngộ", type: "Danh từ", example: { en: "It was a pure coincidence that we met here.", vi: "Thật là một sự tình cờ thuần túy khi chúng ta gặp nhau ở đây." } },
                { word: "stranger", ipa: "/ˈstreɪn.dʒər/", meaning: "người lạ mặt", type: "Danh từ", example: { en: "A kind stranger offered to share her umbrella.", vi: "Một người lạ tốt bụng đã ngỏ ý chia sẻ chiếc ô của mình." } },
                { word: "drenched", ipa: "/drentʃt/", meaning: "ướt sũng dưới mưa", type: "Tính từ", example: { en: "His coat was completely drenched by the storm.", vi: "Chiếc áo khoác của anh ấy đã ướt sũng vì cơn bão." } },
                { word: "awkward", ipa: "/ˈɔː.kwəd/", meaning: "ngượng ngùng, bối rối", type: "Tính từ", example: { en: "There was an awkward silence before she spoke.", vi: "Có một thoáng im lặng ngượng ngùng trước khi cô ấy lên tiếng." } },
                { word: "glance", ipa: "/ɡlɑːns/", meaning: "ánh nhìn thoáng qua", type: "Danh từ", example: { en: "He stole a quick glance at the rain outside.", vi: "Anh ấy liếc nhìn nhanh ra làn mưa bên ngoài." } },
                { word: "encounter", ipa: "/ɪnˈkaʊn.tər/", meaning: "cuộc gặp gỡ định mệnh", type: "Danh từ", example: { en: "An unexpected encounter turned into a lasting friendship.", vi: "Một cuộc gặp bất ngờ đã biến thành tình bạn lâu dài." } },
                { word: "clearing", ipa: "/ˈklɪə.rɪŋ/", meaning: "bầu trời tạnh ráo", type: "Danh từ", example: { en: "The rain stopped and the sky was clearing up.", vi: "Cơn mưa đã dứt và bầu trời dần quang đãng trở lại." } }
            ],
            episodes: [
                { num: 1, title: "Chào hỏi dưới mưa", duration: "2 min", xp: "+30 XP", done: true },
                { num: 2, title: "Tìm chỗ ngồi ấm cúng", duration: "2 min", xp: "+30 XP", done: true },
                { num: 3, title: "Đọc thực đơn mùa đông", duration: "3 min", xp: "+35 XP", active: true, done: false },
                { num: 4, title: "Gọi một ly latte nóng", duration: "3 min", xp: "+35 XP", locked: true },
                { num: 5, title: "Hỏi mật khẩu Wifi", duration: "2 min", xp: "+25 XP", locked: true }
            ]
        },
        {
            chapterNumber: 2,
            title: "Nhầm Chuyến Xe",
            subtitle: "Chuyến tàu nửa đêm",
            category: "CHƯƠNG 2 • CHUYẾN TÀU ĐÊM",
            lessonType: "dialogue",
            breadcrumb: "Hội thoại",
            desc: "Lên nhầm chuyến tàu đêm đến thành phố ánh sao. Học cách hỏi thông tin vé, đọc biển báo ga và xoay sở các tình huống bất ngờ.",
            image: "assets/cards/lumi_train_station_night.jpg",
            thumbnail: "assets/cards/lumi_train_station_night.jpg",
            duration: "18 min",
            progressPill: "Bài 1/10",
            progressPercent: 0,
            auraColor: "rgba(30, 58, 138, 0.35)",
            auraColorLight: "rgba(59, 130, 246, 0.2)",
            vocab: [
                { word: "locomotive", ipa: "/ˌləʊ.kəˈməʊ.tɪv/", meaning: "đầu máy xe lửa", type: "Danh từ", example: { en: "The vintage locomotive rolled into the misty station.", vi: "Đầu máy xe lửa cổ điển lăn bánh vào sân ga mờ sương." } },
                { word: "platform", ipa: "/ˈplæt.fɔːm/", meaning: "sân ga, ke tàu", type: "Danh từ", example: { en: "Passengers waited patiently on Platform 9.", vi: "Hành khách kiên nhẫn đợi ở ke số 9." } },
                { word: "mist", ipa: "/mɪst/", meaning: "màn sương mù nhẹ", type: "Danh từ", example: { en: "A cool midnight mist wrapped around the rails.", vi: "Màn sương lạnh lúc nửa đêm bao trùm lấy đường ray." } },
                { word: "departure", ipa: "/dɪˈpɑː.tʃər/", meaning: "giờ khởi hành", type: "Danh từ", example: { en: "Check the departure board for your train gate.", vi: "Hãy kiểm tra bảng khởi hành để biết cổng tàu của bạn." } },
                { word: "conductor", ipa: "/kənˈdʌk.tər/", meaning: "nhân viên soát vé", type: "Danh từ", example: { en: "The conductor clipped the tickets at the door.", vi: "Người soát vé bấm lỗ vé ở cửa toa." } },
                { word: "compartment", ipa: "/kəmˈpɑːt.mənt/", meaning: "khoang tàu hành khách", type: "Danh từ", example: { en: "We found a quiet compartment near the back.", vi: "Chúng tôi tìm được một khoang yên tĩnh gần phía đuôi." } },
                { word: "itinerary", ipa: "/aɪˈtɪn.ər.ər.i/", meaning: "lịch trình chuyến đi", type: "Danh từ", example: { en: "Keep your travel itinerary saved on your phone.", vi: "Hãy lưu lịch trình chuyến đi trên điện thoại của bạn." } },
                { word: "delayed", ipa: "/dɪˈleɪd/", meaning: "bị trì hoãn, trễ chuyến", type: "Tính từ", example: { en: "Due to heavy fog, the midnight train was delayed.", vi: "Do sương mù dày đặc, chuyến tàu đêm đã bị trễ." } },
                { word: "luggage", ipa: "/ˈlʌɡ.ɪdʒ/", meaning: "hành lý tư trang", type: "Danh từ", example: { en: "Please place your luggage on the overhead rack.", vi: "Xin hãy để hành lý lên giá để đồ phía trên." } },
                { word: "destination", ipa: "/ˌdes.tɪˈneɪ.ʃən/", meaning: "điểm đến cuối cùng", type: "Danh từ", example: { en: "We reached our final destination at sunrise.", vi: "Chúng tôi đến được điểm đến cuối cùng lúc bình minh." } }
            ],
            episodes: [
                { num: 1, title: "Đọc bảng giờ tàu chạy", duration: "3 min", xp: "+30 XP", active: true, done: false },
                { num: 2, title: "Hỏi nhân viên soát vé", duration: "3 min", xp: "+30 XP", locked: true },
                { num: 3, title: "Tìm toa giường nằm", duration: "4 min", xp: "+35 XP", locked: true },
                { num: 4, title: "Chuyển tuyến khẩn cấp", duration: "4 min", xp: "+40 XP", locked: true },
                { num: 5, title: "Mua đồ ăn nhẹ trên tàu", duration: "3 min", xp: "+30 XP", locked: true }
            ]
        },
        {
            chapterNumber: 3,
            title: "Thử Thách Âm Điệu",
            subtitle: "Đấu trường cực quang",
            category: "CHƯƠNG 3 • ĐẤU TRƯỜNG CỰC QUANG",
            lessonType: "dialogue",
            breadcrumb: "Hội thoại",
            desc: "Bắt nhịp ngữ điệu bản xứ dưới bầu trời cực quang rực sáng. Thử thách bắt tai, nhại giọng theo thang âm chuẩn của diễn viên lồng tiếng.",
            image: "assets/cards/lumi_melody_arena.jpg",
            thumbnail: "assets/cards/lumi_melody_arena.jpg",
            duration: "20 min",
            progressPill: "Bài 7/20",
            progressPercent: 35,
            auraColor: "rgba(13, 148, 136, 0.35)",
            auraColorLight: "rgba(20, 184, 166, 0.2)",
            vocab: [
                { word: "aurora", ipa: "/ɔːˈrɔː.rə/", meaning: "cực quang phương bắc", type: "Danh từ", example: { en: "The vivid aurora danced across the winter sky.", vi: "Dải cực quang rực rỡ nhảy múa trên bầu trời mùa đông." } },
                { word: "resonate", ipa: "/ˈrez.ən.eɪt/", meaning: "ngân vang, vang vọng", type: "Động từ", example: { en: "Her gentle voice resonated through the entire dome.", vi: "Giọng nói dịu dàng của cô ấy ngân vang khắp mái vòm." } },
                { word: "harmony", ipa: "/ˈhɑː.mə.ni/", meaning: "sự hòa âm, giai điệu", type: "Danh từ", example: { en: "Their voices blended in perfect harmony.", vi: "Giọng hát của họ hòa quyện vào nhau tạo nên sự hòa âm hoàn hảo." } },
                { word: "cadence", ipa: "/ˈkeɪ.dəns/", meaning: "nhịp điệu thanh âm", type: "Danh từ", example: { en: "He spoke with a melodic native cadence.", vi: "Anh ấy nói với nhịp điệu bản xứ êm tai." } },
                { word: "pitch", ipa: "/pɪtʃ/", meaning: "độ cao cung bậc giọng", type: "Danh từ", example: { en: "Raise your pitch slightly at the end of questions.", vi: "Hãy lên giọng nhẹ ở cuối các câu hỏi." } },
                { word: "intonation", ipa: "/ˌɪn.təˈneɪ.ʃən/", meaning: "ngữ điệu câu nói", type: "Danh từ", example: { en: "Natural intonation makes English sound expressive.", vi: "Ngữ điệu tự nhiên giúp tiếng Anh truyền cảm hơn." } },
                { word: "articulate", ipa: "/ɑːˈtɪk.jə.lət/", meaning: "phát âm tròn vành rõ chữ", type: "Tính từ", example: { en: "Practice speaking slowly to stay articulate.", vi: "Luyện nói chậm rãi để phát âm tròn vành rõ chữ." } },
                { word: "echo", ipa: "/ˈek.əʊ/", meaning: "tiếng vang dội", type: "Danh từ", example: { en: "An echo bounced back from the mountain wall.", vi: "Tiếng vang dội lại từ vách núi đá." } },
                { word: "modulation", ipa: "/ˌmɒdʒ.əˈleɪ.ʃən/", meaning: "sự chuyển giọng linh hoạt", type: "Danh từ", example: { en: "Voice modulation keeps the listener fully engaged.", vi: "Sự chuyển giọng linh hoạt thu hút sự tập trung của người nghe." } },
                { word: "timber", ipa: "/ˈtɪm.bər/", meaning: "âm sắc giọng nói", type: "Danh từ", example: { en: "He has a rich and warm vocal timber.", vi: "Anh ấy sở hữu một âm sắc giọng nói trầm ấm và cuốn hút." } }
            ],
            episodes: [
                { num: 1, title: "Khởi động thanh quản", duration: "2 min", xp: "+25 XP", done: true },
                { num: 2, title: "Ngữ điệu câu hỏi đảo", duration: "3 min", xp: "+35 XP", done: true },
                { num: 3, title: "Nối âm phụ âm nguyên âm", duration: "4 min", xp: "+45 XP", active: true, done: false },
                { num: 4, title: "Tốc độ 1.5x bản xứ", duration: "4 min", xp: "+50 XP", locked: true }
            ]
        },
        {
            chapterNumber: 4,
            title: "Đêm Hội Đom Đóm",
            subtitle: "Thung lũng đom đóm",
            category: "CHƯƠNG 4 • THUNG LŨNG ĐOM ĐÓM",
            lessonType: "story",
            breadcrumb: "Truyện",
            desc: "Dạo bước giữa cánh đồng đêm lấp lánh đom đóm. Thu lượm các từ vựng cảm xúc, phong cảnh thanh bình và ký ức êm dịu.",
            image: "assets/cards/pixar_night_farm_scenery.jpg",
            thumbnail: "assets/cards/pixar_night_farm_scenery.jpg",
            duration: "25 min",
            progressPill: "Bài 3/14",
            progressPercent: 15,
            auraColor: "rgba(101, 163, 13, 0.35)",
            auraColorLight: "rgba(132, 204, 22, 0.2)",
            vocab: [
                { word: "bioluminescent", ipa: "/ˌbaɪ.əʊˌluː.mɪˈnes.ənt/", meaning: "phát quang sinh học", type: "Tính từ", example: { en: "Bioluminescent fireflies lit up the summer valley.", vi: "Những chú đom đóm phát quang sinh học thắp sáng thung lũng mùa hè." } },
                { word: "constellation", ipa: "/ˌkɒn.stəˈleɪ.ʃən/", meaning: "chòm sao, dải sao", type: "Danh từ", example: { en: "We mapped the constellations in the clear night sky.", vi: "Chúng tôi ngắm nhìn các chòm sao trên bầu trời đêm trong vắt." } },
                { word: "serene", ipa: "/səˈriːn/", meaning: "thanh bình, êm ả", type: "Tính từ", example: { en: "The lake was completely serene beneath the moonlight.", vi: "Mặt hồ hoàn toàn thanh bình dưới ánh trăng soi." } },
                { word: "luminous", ipa: "/ˈluː.mɪ.nəs/", meaning: "tỏa sáng rạng rỡ", type: "Tính từ", example: { en: "A luminous glow spread across the green meadow.", vi: "Một ánh sáng rạng rỡ lan tỏa khắp đồng cỏ xanh." } },
                { word: "whisper", ipa: "/ˈwɪs.pər/", meaning: "lời thì thầm của gió", type: "Danh từ", example: { en: "The soft whisper of the night breeze comforted us.", vi: "Tiếng thì thầm dịu dàng của làn gió đêm vỗ về chúng tôi." } },
                { word: "tranquil", ipa: "/ˈtræŋ.kwɪl/", meaning: "tĩnh lặng, an yên", type: "Tính từ", example: { en: "They enjoyed a tranquil moment by the fire.", vi: "Họ tận hưởng một khoảnh khắc an yên bên đống lửa." } },
                { word: "nocturnal", ipa: "/nɒkˈtɜː.nəl/", meaning: "thuộc về ban đêm", type: "Tính từ", example: { en: "Fireflies are among the most charming nocturnal creatures.", vi: "Đom đóm là một trong những loài sinh vật ban đêm đáng yêu nhất." } },
                { word: "glimmer", ipa: "/ˈɡlɪm.ər/", meaning: "tia sáng lấp lánh", type: "Danh từ", example: { en: "Tiny glimmers flickered between the tall grasses.", vi: "Những tia sáng nhỏ lấp lánh giữa những ngọn cỏ cao." } },
                { word: "solitude", ipa: "/ˈsɒl.ɪ.tʃuːd/", meaning: "khoảng lặng bình yên", type: "Danh từ", example: { en: "She found peaceful solitude in the meadow.", vi: "Cô ấy tìm thấy khoảng lặng bình yên giữa đồng cỏ." } },
                { word: "enchanting", ipa: "/ɪnˈtʃɑːn.tɪŋ/", meaning: "mê hoặc, say đắm lòng người", type: "Tính từ", example: { en: "It was an enchanting evening that we will never forget.", vi: "Đó là một buổi tối đầy mê hoặc mà chúng tôi sẽ không bao giờ quên." } }
            ],
            episodes: [
                { num: 1, title: "Lạc bước giữa cánh đồng", duration: "3 min", xp: "+30 XP", done: true },
                { num: 2, title: "Ánh sáng đom đóm", duration: "3 min", xp: "+30 XP", done: true },
                { num: 3, title: "Trăng soi bóng nước", duration: "4 min", xp: "+40 XP", active: true, done: false },
                { num: 4, title: "Khúc hát côn trùng", duration: "3 min", xp: "+35 XP", locked: true }
            ]
        }
    ];

})(window);
