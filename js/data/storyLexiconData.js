/**
 * ==========================================================================
 * 📚 STORY CONTEXTUAL LEXICON DATA (TỪ ĐIỂN NGỮ CẢNH TRUYỆN ĐỌC)
 * Tách riêng tầng Data theo chuẩn .agents/rules/web-development-rules.md
 * ==========================================================================
 */

(function (window) {
    'use strict';

    window.BUILTIN_STORY_LEXICON = {
        "the": {
            ipa: "/ðə/", pos: "MẠO TỪ XÁC ĐỊNH",
            meaning: "Cái, con, vùng, ánh (xác định)",
            explanation: "Đi trong cụm «the valley» (thung lũng ấy) và «the warm sunlight» (ánh nắng ấm áp) để chỉ sự vật cụ thể trong bối cảnh câu chuyện.",
            dictMeanings: [
                { meaning: "Cái, con, người, vật ấy", pos: "MẠO TỪ", sense: "Dùng trước danh từ chỉ đối tượng đã được người đọc và người kể biết rõ." },
                { meaning: "Nhất, càng... càng (so sánh)", pos: "PHÓ TỪ", sense: "Dùng trước tính từ/trạng từ so sánh hơn hoặc so sánh nhất (ví dụ: the best)." }
            ]
        },
        "on": {
            ipa: "/ɒn/", pos: "GIỚI TỪ",
            meaning: "Vào (buổi sáng / ngày cụ thể)",
            explanation: "Đi trong cụm «On a beautiful morning» để chỉ mốc thời gian vào một buổi sáng đẹp trời.",
            dictMeanings: [
                { meaning: "Vào (ngày, buổi cụ thể)", pos: "GIỚI TỪ", sense: "Dùng chỉ thời điểm các buổi hoặc ngày đặc biệt (On a beautiful morning, On Sunday)." },
                { meaning: "Ở trên, tiếp xúc bề mặt", pos: "GIỚI TỪ", sense: "Chỉ vị trí nằm trên một bề mặt (on the table, on the path)." }
            ]
        },
        "a": {
            ipa: "/ə/", pos: "MẠO TỪ BẤT ĐỊNH",
            meaning: "Một (chưa xác định)",
            explanation: "Đi trong cụm «a beautiful morning» để giới thiệu một buổi sáng đẹp trời lần đầu được nhắc tới.",
            dictMeanings: [
                { meaning: "Một (bất kỳ, chưa xác định)", pos: "MẠO TỪ", sense: "Dùng trước danh từ đếm được số ít bắt đầu bằng phụ âm." }
            ]
        },
        "beautiful": {
            ipa: "/ˈbjuː.tɪ.fəl/", pos: "TÍNH TỪ",
            meaning: "Tuyệt đẹp, tươi đẹp, rực rỡ",
            explanation: "Miêu tả khung cảnh buổi sáng trong trẻo và tràn đầy sức sống («a beautiful morning»).",
            dictMeanings: [
                { meaning: "Đẹp, tuyệt đẹp, làm say đắm", pos: "TÍNH TỪ", sense: "Pleasing the senses or mind aesthetically." },
                { meaning: "Tuyệt vời, dễ chịu (thời tiết)", pos: "TÍNH TỪ", sense: "Very pleasant or sunny weather." }
            ]
        },
        "morning": {
            ipa: "/ˈmɔː.nɪŋ/", pos: "DANH TỪ",
            meaning: "Buổi sáng, ban mai",
            explanation: "Khoảng thời gian đầu ngày khi mặt trời vừa lên và chim chóc bắt đầu ca hót.",
            dictMeanings: [
                { meaning: "Buổi sáng, sáng sớm", pos: "DANH TỪ", sense: "The period of time between midnight and noon, especially from sunrise to noon." }
            ]
        },
        "warm": {
            ipa: "/wɔːm/", pos: "TÍNH TỪ",
            meaning: "Ấm áp, dịu nhẹ",
            explanation: "Đi trong cụm «the warm sunlight» — miêu tả ánh nắng ban mai dịu ngọt, sưởi ấm cả thung lũng.",
            dictMeanings: [
                { meaning: "Ấm, ấm áp (nhiệt độ, ánh nắng)", pos: "TÍNH TỪ", sense: "Of or at a fairly or comfortably high temperature." },
                { meaning: "Nồng hậu, trìu mến (tình cảm)", pos: "TÍNH TỪ", sense: "Having or showing enthusiasm, affection, or kindness." }
            ]
        },
        "sunlight": {
            ipa: "/ˈsʌn.laɪt/", pos: "DANH TỪ",
            meaning: "Ánh nắng mặt trời, nắng sớm",
            explanation: "Ánh sáng tự nhiên tỏa ra từ mặt trời buổi ban mai chiếu xuống thung lũng.",
            dictMeanings: [
                { meaning: "Ánh nắng mặt trời, ánh thái dương", pos: "DANH TỪ", sense: "Light from the sun." }
            ]
        },
        "filled": {
            ipa: "/fɪld/", pos: "ĐỘNG TỪ / TÍNH TỪ",
            meaning: "Ngập tràn, tràn ngập, lấp đầy",
            explanation: "Trong cụm «was filled with birdsong»: cả thung lũng tràn ngập tiếng chim hót buổi sớm.",
            dictMeanings: [
                { meaning: "Ngập tràn, lấp đầy không gian", pos: "ĐỘNG TỪ", sense: "Caused a space or area to become full of sound or light." },
                { meaning: "Đầy ắp, chứa đầy", pos: "TÍNH TỪ", sense: "Full of a particular thing or quality." }
            ]
        },
        "intentionally": {
            ipa: "/ɪnˈten.ʃən.əl.i/", pos: "TRẠNG TỪ",
            meaning: "Cố tình, có chủ đích",
            explanation: "Được thực hiện một cách có kế hoạch, cố ý chứ không phải tình cờ (Thỏ cố tình phanh gấp trước mặt Rùa để trêu chọc).",
            dictMeanings: [
                { meaning: "Cố tình, cố ý, có chủ tâm", pos: "TRẠNG TỪ", sense: "In a way that is planned or intended; deliberately." },
                { meaning: "Một cách có ý thức", pos: "TRẠNG TỪ", sense: "With full awareness of what one is doing." }
            ]
        },
        "valley": {
            ipa: "/ˈvæl.i/", pos: "DANH TỪ",
            meaning: "Thung lũng",
            explanation: "Vùng đất thấp nằm giữa những ngọn đồi hoặc dãy núi, nơi tiếng chim hót vang vọng buổi sớm.",
            dictMeanings: [
                { meaning: "Thung lũng", pos: "DANH TỪ", sense: "A low area of land between hills or mountains." },
                { meaning: "Lưu vực sông", pos: "DANH TỪ", sense: "An extensive area of land drained by a river." }
            ]
        },
        "birdsong": {
            ipa: "/ˈbɜːd.sɒŋ/", pos: "DANH TỪ",
            meaning: "Tiếng chim hót, khúc ca của loài chim",
            explanation: "Âm thanh du dương của các loài chim hót chào đón ánh bình minh trong thung lũng.",
            dictMeanings: [
                { meaning: "Tiếng chim hót, tiếng chim ca", pos: "DANH TỪ", sense: "The musical vocalizations of birds in nature." }
            ]
        },
        "welcoming": {
            ipa: "/ˈwel.kəm.ɪŋ/", pos: "ĐỘNG TỪ",
            meaning: "Đón chào, chào đón",
            explanation: "Trong cụm «welcoming the warm sunlight»: hân hoan đón nhận ánh nắng ấm áp buổi sớm.",
            dictMeanings: [
                { meaning: "Đón chào, chào mừng", pos: "ĐỘNG TỪ", sense: "Greeting or receiving gladly and warmly." },
                { meaning: "Thân thiện, niềm nở", pos: "TÍNH TỪ", sense: "Behaving in a polite or friendly way to a guest." }
            ]
        },
        "dashed": {
            ipa: "/dæʃt/", pos: "ĐỘNG TỪ",
            meaning: "Lao vút qua, phóng nhanh",
            explanation: "Chạy hoặc di chuyển cực nhanh theo một hướng một cách vội vã, phô trương tốc độ.",
            dictMeanings: [
                { meaning: "Lao vút đi, phóng nhanh", pos: "ĐỘNG TỪ", sense: "Ran or traveled somewhere in a great hurry." },
                { meaning: "Đập vỡ, làm tiêu tan", pos: "ĐỘNG TỪ", sense: "Destroyed or frustrated hopes or expectations." }
            ]
        },
        "mocking": {
            ipa: "/ˈmɒk.ɪŋ/", pos: "ĐỘNG TỪ",
            meaning: "Chế giễu, cười cợt, nhạo báng",
            explanation: "Trêu chọc và coi thường những bước đi chậm chạp của Rùa một cách kiêu ngạo.",
            dictMeanings: [
                { meaning: "Chế giễu, nhạo báng, cười cợt", pos: "ĐỘNG TỪ", sense: "Teasing or laughing at in a scornful or contemptuous manner." }
            ]
        },
        "offense": {
            ipa: "/əˈfens/", pos: "DANH TỪ",
            meaning: "Sự phật lòng, sự tức giận",
            explanation: "Trong cụm «took no offense»: không hề tự ái, bận lòng hay giận dữ trước lời trêu chọc.",
            dictMeanings: [
                { meaning: "Sự xúc phạm, sự phật ý", pos: "DANH TỪ", sense: "Annoyance or resentment brought about by a perceived insult." },
                { meaning: "Sự vi phạm, lỗi lầm", pos: "DANH TỪ", sense: "A breach of a law or rule." }
            ]
        },
        "merely": {
            ipa: "/ˈmɪə.li/", pos: "TRẠNG TỪ",
            meaning: "Chỉ, đơn thuần là",
            explanation: "Nhấn mạnh hành động nhẹ nhàng, điềm đạm của Rùa: chỉ khẽ ngẩng đầu mỉm cười.",
            dictMeanings: [
                { meaning: "Chỉ, đơn thuần, không hơn", pos: "TRẠNG TỪ", sense: "Just; only; without anything more." }
            ]
        },
        "confidence": {
            ipa: "/ˈkɒn.fɪ.dəns/", pos: "DANH TỪ",
            meaning: "Sự tự tin vững vàng",
            explanation: "Niềm tin kiên định vào bản thân dù bị đối thủ đánh giá thấp.",
            dictMeanings: [
                { meaning: "Sự tự tin, lòng tin tưởng", pos: "DANH TỪ", sense: "The feeling or belief that one can rely on someone or something." }
            ]
        },
        "proposed": {
            ipa: "/prəˈpəʊzd/", pos: "ĐỘNG TỪ",
            meaning: "Đề nghị, đưa ra lời thách đấu",
            explanation: "Đưa ra một ý kiến hoặc kế hoạch (đề nghị cuộc chạy đua tới cây sồi già).",
            dictMeanings: [
                { meaning: "Đề nghị, đề xuất", pos: "ĐỘNG TỪ", sense: "Put forward an idea or plan for consideration." }
            ]
        },
        "woodland": {
            ipa: "/ˈwʊd.lənd/", pos: "DANH TỪ",
            meaning: "Rừng cây, miền rừng",
            explanation: "Khu vực đất có nhiều cây cối rậm rạp, nơi các loài thú nhỏ sinh sống.",
            dictMeanings: [
                { meaning: "Rừng cây, vùng đất rừng", pos: "DANH TỪ", sense: "Land covered with trees; forest." }
            ]
        },
        "convinced": {
            ipa: "/kənˈvɪnst/", pos: "TÍNH TỪ",
            meaning: "Đinh ninh, tin chắc",
            explanation: "Hoàn toàn tin tưởng chắc chắn rằng chiến thắng đã nằm gọn trong tầm tay.",
            dictMeanings: [
                { meaning: "Tin chắc, đinh ninh", pos: "TÍNH TỪ", sense: "Completely certain about something." }
            ]
        },
        "vanished": {
            ipa: "/ˈvæn.ɪʃt/", pos: "ĐỘNG TỪ",
            meaning: "Biến mất hoàn toàn",
            explanation: "Khuất bóng rất nhanh sau làn bụi vàng ở khúc cua đường đua.",
            dictMeanings: [
                { meaning: "Biến mất, tan biến", pos: "ĐỘNG TỪ", sense: "Disappeared suddenly and completely." }
            ]
        },
        "whirlwind": {
            ipa: "/ˈwɜːl.wɪnd/", pos: "DANH TỪ",
            meaning: "Cơn lốc xoáy",
            explanation: "Cuồng bụi xoáy cuốn lên phía sau bước chạy cực nhanh của Thỏ.",
            dictMeanings: [
                { meaning: "Cơn lốc xoáy, gió cuốn", pos: "DANH TỪ", sense: "A column of air moving rapidly round and round." }
            ]
        },
        "unflinching": {
            ipa: "/ʌnˈflɪn.tʃɪŋ/", pos: "TÍNH TỪ",
            meaning: "Không chút nao núng, kiên định",
            explanation: "Giữ vững tinh thần bình tĩnh, không hề sợ hãi hay chùn bước trước tốc độ của đối thủ.",
            dictMeanings: [
                { meaning: "Không nao núng, không chùn bước", pos: "TÍNH TỪ", sense: "Not showing fear or hesitation in the face of difficulty." }
            ]
        },
        "spectators": {
            ipa: "/spekˈteɪ.təz/", pos: "DANH TỪ",
            meaning: "Khán giả, người đứng xem",
            explanation: "Các loài thú trong rừng đang đứng cổ vũ và theo dõi cuộc đua.",
            dictMeanings: [
                { meaning: "Khán giả, người xem", pos: "DANH TỪ", sense: "People who watch at a show, game, or other event." }
            ]
        },
        "competitor": {
            ipa: "/kəmˈpet.ɪ.tər/", pos: "DANH TỪ",
            meaning: "Đối thủ cạnh tranh",
            explanation: "Người cùng tham gia tranh tài trong cuộc đua (ở đây chỉ chú Rùa).",
            dictMeanings: [
                { meaning: "Đối thủ, người tranh tài", pos: "DANH TỪ", sense: "A person who takes part in a sporting contest." }
            ]
        },
        "overwhelmingly": {
            ipa: "/ˌəʊ.vəˈwel.mɪŋ.li/", pos: "TRẠNG TỪ",
            meaning: "Tột cùng, tràn ngập, áp đảo",
            explanation: "Mức độ cực kỳ mạnh mẽ (cảm thấy kiêu ngạo và đắc thắng tột độ).",
            dictMeanings: [
                { meaning: "Một cách áp đảo, tột cùng", pos: "TRẠNG TỪ", sense: "To a very great degree or with a great majority." }
            ]
        },
        "hesitation": {
            ipa: "/ˌhez.ɪˈteɪ.ʃən/", pos: "DANH TỪ",
            meaning: "Sự do dự, sự chần chừ",
            explanation: "Sự ngập ngừng trước khi làm điều gì đó (Rùa tiến bước không một chút do dự).",
            dictMeanings: [
                { meaning: "Sự do dự, sự lưỡng lự", pos: "DANH TỪ", sense: "The action of pausing before saying or doing something." }
            ]
        },
        "jolted": {
            ipa: "/ˈdʒəʊl.tɪd/", pos: "ĐỘNG TỪ",
            meaning: "Giật mình thon thót, bừng tỉnh",
            explanation: "Tỉnh giấc một cách đột ngột vì bất ngờ nghe tiếng reo hò ở vạch đích.",
            dictMeanings: [
                { meaning: "Giật mình, nảy lên đột ngột", pos: "ĐỘNG TỪ", sense: "Moved or caused to move with a sudden jerk." }
            ]
        }
    };
})(window);
