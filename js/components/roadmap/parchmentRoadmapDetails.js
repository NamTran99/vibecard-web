// -------------------------------------------------------------
// 📚 TỪ VỰNG & MÔ TẢ THEO NGỮ CẢNH TỪNG BÀI HỌC (40 UNITS)
// -------------------------------------------------------------
const ROADMAP_LESSON_DETAILS = {
    // CHƯƠNG 1: Mưa Dưới Mái Hiên
    "0_1": {
        desc: "Một cơn mưa rào đổ xuống đột ngột khiến Minh và Lan phải cùng trú tạm dưới mái hiên tối tăm của một nhà hát trung tâm thành phố.",
        vocab: [
            { word: "drizzle", ipa: "/ˈdrɪz.əl/", meaning: "mưa phùn lất phất" },
            { word: "shelter", ipa: "/ˈʃel.tər/", meaning: "chỗ trú mưa, nơi ẩn náu" },
            { word: "greeting", ipa: "/ˈɡriː.tɪŋ/", meaning: "lời chào hỏi thân tình" },
            { word: "downpour", ipa: "/ˈdaʊn.pɔːr/", meaning: "cơn mưa rào xối xả" },
            { word: "eaves", ipa: "/iːvz/", meaning: "mái hiên trú tạm" },
            { word: "coincidence", ipa: "/kəʊˈɪn.sɪ.dəns/", meaning: "sự tình cờ, duyên ngộ" },
            { word: "stranger", ipa: "/ˈstreɪn.dʒər/", meaning: "người lạ mặt" },
            { word: "drenched", ipa: "/drentʃt/", meaning: "ướt sũng dưới mưa" },
            { word: "awkward", ipa: "/ˈɔː.kwəd/", meaning: "ngượng ngùng, bối rối" },
            { word: "glance", ipa: "/ɡlɑːns/", meaning: "ánh nhìn thoáng qua" },
            { word: "encounter", ipa: "/ɪnˈkaʊn.tər/", meaning: "cuộc gặp gỡ định mệnh" },
            { word: "clearing", ipa: "/ˈklɪə.rɪŋ/", meaning: "bầu trời tạnh ráo" }
        ]
    },
    "0_2": {
        desc: "Bước vào quán cà phê ấm cúng. Học cách gọi đồ uống, tùy chọn sữa hạt và trò chuyện với barista.",
        vocab: [
            { word: "espresso", ipa: "/esˈpres.əʊ/", meaning: "cà phê cô đặc nguyên chất" },
            { word: "steamed milk", ipa: "/stiːmd mɪlk/", meaning: "sữa đánh nóng mịn" },
            { word: "aroma", ipa: "/əˈrəʊ.mə/", meaning: "hương thơm nồng nàn" }
        ]
    },
    "0_3": {
        desc: "Mượn tạm chiếc ô hoa văn từ quán nhỏ. Thực hành cấu trúc nhờ vả lịch thiệp và hẹn ngày hoàn trả.",
        vocab: [
            { word: "borrow", ipa: "/ˈbɒr.əʊ/", meaning: "mượn tạm một món đồ" },
            { word: "courtesy", ipa: "/ˈkɜː.tə.si/", meaning: "sự nhã nhặn, lịch sự" },
            { word: "return", ipa: "/rɪˈtɜːn/", meaning: "hoàn trả, mang trả lại" }
        ]
    },
    "0_4": {
        desc: "Ngồi bên hiên cửa sổ lắng nghe từng giọt mưa rơi. Luyện phản xạ nối âm, ngữ điệu chậm rãi và từ tượng thanh.",
        vocab: [
            { word: "raindrop", ipa: "/ˈreɪn.drɒp/", meaning: "giọt nước mưa rơi" },
            { word: "rhythm", ipa: "/ˈrɪð.əm/", meaning: "nhịp điệu thanh âm" },
            { word: "tranquil", ipa: "/ˈtræŋ.kwɪl/", meaning: "yên bình, tĩnh lặng" }
        ]
    },
    "0_5": {
        desc: "Phần thưởng rương kho báu kết thúc Vòng 1. Tích lũy điểm kinh nghiệm và mở khóa bạn đồng hành Billy Possum.",
        vocab: [
            { word: "treasure", ipa: "/ˈtreʒ.ər/", meaning: "kho báu quý giá" },
            { word: "milestone", ipa: "/ˈmaɪl.stəʊn/", meaning: "cột mốc quan trọng" },
            { word: "reward", ipa: "/rɪˈwɔːd/", meaning: "phần thưởng xứng đáng" }
        ]
    },
    "0_6": {
        desc: "Cùng Billy Possum che ô bước ra phố lớn. Học từ vựng chỉ đường, băng qua lối đi bộ và ánh đèn neon.",
        vocab: [
            { word: "puddle", ipa: "/ˈpʌd.əl/", meaning: "vũng nước nhỏ trên phố" },
            { word: "crosswalk", ipa: "/ˈkrɒs.wɔːk/", meaning: "vạch qua đường cho người đi bộ" },
            { word: "neon glow", ipa: "/ˈniː.ɒn ɡləʊ/", meaning: "ánh sáng đèn neon mờ ảo" }
        ]
    },
    "0_7": {
        desc: "Hỏi thăm bác bảo vệ lối dẫn ra ga tàu điện ngầm. Nắm vững cụm từ hỏi phương hướng và khoảng cách.",
        vocab: [
            { word: "direction", ipa: "/daɪˈrek.ʃən/", meaning: "phương hướng, chỉ đường" },
            { word: "subway station", ipa: "/ˈsʌb.weɪ ˈsteɪ.ʃən/", meaning: "nhà ga tàu điện ngầm" },
            { word: "avenue", ipa: "/ˈæv.ə.njuː/", meaning: "đại lộ rộng lớn" }
        ]
    },
    "0_8": {
        desc: "Chuyến tàu cuối cùng chuẩn bị đóng cửa. Học các câu thông báo khẩn, vội vã mua vé và bước lên toa.",
        vocab: [
            { word: "last train", ipa: "/lɑːst treɪn/", meaning: "chuyến tàu cuối cùng trong ngày" },
            { word: "carriage", ipa: "/ˈkær.ɪdʒ/", meaning: "toa hành khách" },
            { word: "depart", ipa: "/dɪˈpɑːt/", meaning: "khởi hành, rời ga" }
        ]
    },
    "0_9": {
        desc: "Ngồi bên cửa sổ toa tàu ngắm phố đêm dần xa. Luyện tập độc thoại nội tâm và ghi nhật ký hành trình.",
        vocab: [
            { word: "whisper", ipa: "/ˈwɪs.pər/", meaning: "thì thầm, lời khẽ" },
            { word: "reflection", ipa: "/rɪˈflek.ʃən/", meaning: "hình ảnh phản chiếu trên kính" },
            { word: "nostalgia", ipa: "/nɒsˈtæl.dʒə/", meaning: "nỗi hoài niệm êm dịu" }
        ]
    },
    "0_10": {
        desc: "Thử thách trùm cuối kết thúc Chương 1! Tổng hợp 10 bài học qua bài đàm thoại thực tế kéo dài 8 phút.",
        vocab: [
            { word: "mastery", ipa: "/ˈmɑː.stər.i/", meaning: "sự thành thạo, tinh thông" },
            { word: "challenge", ipa: "/ˈtʃæl.ɪndʒ/", meaning: "thử thách đỉnh cao" },
            { word: "farewell", ipa: "/ˌfeəˈwel/", meaning: "lời chào tạm biệt thân thương" }
        ]
    }
};

const GENERAL_VOCAB_POOL = [
    { word: "curiosity", ipa: "/ˌkjʊə.riˈɒs.ə.ti/", meaning: "sự tò mò, khám phá" },
    { word: "persistence", ipa: "/pəˈsɪs.təns/", meaning: "sự kiên trì, bền bỉ" },
    { word: "fluency", ipa: "/ˈfluː.ən.si/", meaning: "sự lưu loát, trôi chảy" },
    { word: "confidence", ipa: "/ˈkɒn.fɪ.dəns/", meaning: "sự tự tin, bản lĩnh" },
    { word: "context", ipa: "/ˈkɒn.tekst/", meaning: "ngữ cảnh giao tiếp" },
    { word: "intonation", ipa: "/ˌɪn.təˈneɪ.ʃən/", meaning: "ngữ điệu tự nhiên" },
    { word: "expression", ipa: "/ɪkˈspreʃ.ən/", meaning: "cách diễn đạt tự nhiên" },
    { word: "mastery", ipa: "/ˈmɑː.stər.i/", meaning: "sự thành thạo, tinh thông" }
];

function getRoadmapLessonDetail(chapterIdx, nodeNum, fallbackTitle) {
    const ch = roadmapChaptersData[chapterIdx] || roadmapChaptersData[0];
    const node = ch?.nodes?.find(n => n.num === nodeNum);
    let result = null;

    if (node && (node.scenario || node.purpose)) {
        result = {
            desc: node.scenario || node.purpose,
            vocab: (node.vocab && node.vocab.length) ? [...node.vocab] : []
        };
    } else {
        const key = `${chapterIdx}_${nodeNum}`;
        if (ROADMAP_LESSON_DETAILS[key]) {
            result = {
                desc: ROADMAP_LESSON_DETAILS[key].desc,
                vocab: [...ROADMAP_LESSON_DETAILS[key].vocab]
            };
        } else {
            result = {
                desc: `Chinh phục bài học "${fallbackTitle}". Luyện tập từ vựng then chốt, ngữ pháp ứng dụng và phản xạ nghe nói.`,
                vocab: []
            };
        }
    }

    // Đảm bảo luôn có ít nhất 10-12 từ vựng phong phú để người học tự do chọn 5, 10 hoặc Tất cả
    if (result.vocab.length < 10) {
        const existingWords = new Set(result.vocab.map(v => v.word.toLowerCase()));
        for (const extra of GENERAL_VOCAB_POOL) {
            if (!existingWords.has(extra.word.toLowerCase())) {
                result.vocab.push(extra);
                if (result.vocab.length >= 10) break;
            }
        }
    }

    return result;
}

// Xử lý khi click vào thẻ bài học
function handleParchmentNodeClick(nodeId, title, unlocked, chapterIdx = 0) {
    const ch = roadmapChaptersData[chapterIdx] || roadmapChaptersData[0];
    const node = ch.nodes.find(n => n.num === nodeId);

    // Xử lý bài bị khóa: Rung lắc + toast hướng dẫn + tự động cuộn đến bài đang học
    if (!unlocked) {
        const card = document.querySelector(`.mb-card[data-node-num="${nodeId}"]`);
        if (card) {
            card.classList.remove('mb-shake');
            void card.offsetWidth;
            card.classList.add('mb-shake');
            setTimeout(() => card.classList.remove('mb-shake'), 400);
        }

        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
            SoundEngine.play(8);
        }

        const activeNode = ch.nodes.find(n => n.status === 'active');
        const guideText = activeNode ? `Hãy hoàn thành bài "${activeNode.title}" trước nhé!` : 'Hãy hoàn thành bài trước để mở khóa.';
        if (typeof showDictToast === 'function') {
            showDictToast(`🔒 "${title}" chưa mở! ${guideText}`);
        }

        // Tự động cuộn nhẹ tới bài đang học sau 350ms
        setTimeout(() => scrollRoadmapToActive(true), 350);
        return;
    }

    // Mở đúng bài học cụ thể (thay vì bài chung)
    if (node) {
        const typeMeta = roadmapNodeTypeMeta[node.type] || roadmapNodeTypeMeta.star;
        const detail = getRoadmapLessonDetail(chapterIdx, node.num, node.title);
        const lessonCustomData = {
            chapterNumber: chapterIdx + 1,
            title: node.title,
            subtitle: `${ch.title} • Bài ${node.num}`,
            category: `BÀI ${node.num} • ${typeMeta.label.toUpperCase()}`,
            lessonType: node.type === 'video' ? 'dialogue' : 'story',
            breadcrumb: node.type === 'video' ? 'Hội thoại' : 'Bài đọc',
            desc: detail.desc,
            image: node.img,
            duration: `${typeMeta.minutes || 4} phút`,
            progressPill: node.status === 'completed' ? 'Ôn tập củng cố ↺' : 'Đang học',
            progressPercent: node.status === 'completed' ? 100 : 40,
            isReviewMode: node.status === 'completed',
            vocab: detail.vocab,
            episodes: [
                { num: 1, title: `${node.title} - Phần 1: Khám phá từ vựng`, duration: "2 min", xp: "+30 XP", done: node.status === 'completed', active: node.status === 'active' },
                { num: 2, title: `${node.title} - Phần 2: Đàm thoại ngữ cảnh`, duration: "2 min", xp: "+50 XP", done: node.status === 'completed', active: false, locked: node.status !== 'completed' }
            ]
        };

        // Ưu tiên mở trực tiếp Màn hình Đọc truyện Story to Card chuẩn 1:1 Android Native
        if (typeof window.openStoryReaderScreen === 'function') {
            window.openStoryReaderScreen(lessonCustomData);
            return;
        }
        if (typeof window.openLessonIntroScreen === 'function') {
            window.openLessonIntroScreen(chapterIdx, lessonCustomData);
            return;
        }
    }

    if (typeof openStoryBookReader === 'function') {
        openStoryBookReader(chapterIdx);
    } else if (typeof showDictToast === 'function') {
        showDictToast(`🚀 Đang mở bài học: ${title}`);
    }
}