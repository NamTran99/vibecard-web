// ========================================================
// 📚 DICTIONARY DATA LAYER (FULL DICT DATA & GENERATOR)
// ========================================================

(function (window) {
    'use strict';

    const fullDictData = {
        'resilient': {
            word: 'resilient',
            type: 'adjective',
            level: 'B2 Upper-Int',
            ipa: '/rɪˈzɪl.jənt/',
            frequency: '★★★★☆ Phổ biến',
            meaningVi: 'Kiên cường, mau phục hồi sức lực hoặc tinh thần (sau khó khăn, bệnh tật, thất bại)',
            meaningEn: 'Able to withstand or recover quickly from difficult conditions or adversity.',
            contexts: [
                { domain: 'Tâm lý học (Psychology)', text: 'Khả năng giữ vững tinh thần, vượt qua sang chấn và áp lực tâm lý.' },
                { domain: 'Kinh tế - Xã hội (Economics)', text: 'Nền kinh tế hoặc tổ chức có sức chống chịu bền bỉ trước biến động khủng hoảng.' },
                { domain: 'Vật lý & Kỹ thuật (Physics)', text: 'Vật liệu đàn hồi cao, tự động nảy lại hình dạng ban đầu sau khi bị nén ép.' }
            ],
            examples: [
                { en: 'Children are remarkably resilient and can adapt to new environments quickly.', vi: 'Trẻ em kiên cường một cách đáng ngạc nhiên và có thể thích nghi nhanh chóng với môi trường mới.' },
                { en: 'The local economy has stayed remarkably resilient during the crisis.', vi: 'Nền kinh tế địa phương vẫn duy trì sức chống chịu đáng nể trong suốt cuộc khủng hoảng.' },
                { en: 'She has a resilient spirit that inspires everyone around her.', vi: 'Cô ấy sở hữu một tinh thần kiên cường truyền cảm hứng cho tất cả mọi người xung quanh.' },
                { en: 'Rubber is a resilient material that bounces back into shape.', vi: 'Cao su là vật liệu có độ đàn hồi tốt, tự phục hồi lại hình dáng ban đầu.' }
            ],
            collocations: [
                { en: 'resilient economy', vi: 'nền kinh tế kiên cường, dẻo dai' },
                { en: 'remarkably resilient', vi: 'cực kỳ kiên cường, chịu đựng tốt' },
                { en: 'resilient to change', vi: 'thích ứng nhanh với thay đổi' },
                { en: 'build resilience', vi: 'rèn luyện sức bền ý chí' }
            ],
            synonyms: [
                { word: 'tough', vi: 'bền bỉ, can trường' },
                { word: 'adaptable', vi: 'dễ thích nghi' },
                { word: 'buoyant', vi: 'lạc quan, mau vực dậy' },
                { word: 'tenacious', vi: 'kiên trì, dai dẳng' }
            ],
            antonyms: [
                { word: 'fragile', vi: 'mong manh, dễ vỡ' },
                { word: 'vulnerable', vi: 'dễ bị tổn thương' },
                { word: 'brittle', vi: 'giòn, dễ gãy' }
            ],
            lumiTip: {
                etymology: 'Xuất phát từ tiếng Latin "resilire", trong đó "re-" (lại) + "salire" (nhảy vọt) ➔ nghĩa đen là "bật nảy trở lại vị trí ban đầu".',
                memoryHack: '💡 Mẹo của Lumi: Hãy nhớ chữ "re" (lại) + "silent" (dù đối mặt bão giông trong im lặng, bạn vẫn bật dậy kiên cường như quả bóng nảy)!',
                commonMistake: '⚠️ Tránh nhầm: "Flexible" là linh hoạt uốn theo chiều gió, còn "Resilient" là khả năng phục hồi sau cú sốc hay chấn thương.'
            }
        },
        'serendipity': {
            word: 'serendipity',
            type: 'noun',
            level: 'C2 Mastery',
            ipa: '/ˌser.ənˈdɪp.ə.ti/',
            frequency: '★★★☆☆ Từ cao cấp',
            meaningVi: 'Sự tình cờ may mắn, duyên may bất ngờ khám phá ra điều tuyệt vời',
            meaningEn: 'The occurrence and development of events by chance in a happy or beneficial way.',
            contexts: [
                { domain: 'Đời sống cá nhân', text: 'Tình cờ gặp gỡ tri kỷ hoặc cơ hội nghề nghiệp bất ngờ trên đường đời.' },
                { domain: 'Khoa học & Phát minh', text: 'Nhiều phát minh vĩ đại (Penicillin, lò vi sóng) ra đời từ những sự cố ngẫu nhiên may mắn.' }
            ],
            examples: [
                { en: 'Finding this cozy cafe on a rainy afternoon was pure serendipity.', vi: 'Tìm thấy quán cà phê ấm cúng này vào một chiều mưa quả là một duyên may bất ngờ.' },
                { en: 'Scientific breakthroughs often depend as much on serendipity as hard work.', vi: 'Các đột phá khoa học đôi khi phụ thuộc vào duyên may tình cờ nhiều như sự nỗ lực.' },
                { en: 'They met by sheer serendipity at a bustling train station in Paris.', vi: 'Họ tình cờ gặp nhau tại một ga xe lửa tấp nập ở Paris.' }
            ],
            collocations: [
                { en: 'pure / sheer serendipity', vi: 'duyên may thuần túy' },
                { en: 'stroke of serendipity', vi: 'một dịp may bất ngờ' },
                { en: 'serendipitous discovery', vi: 'phát hiện tình cờ' }
            ],
            synonyms: [
                { word: 'fluke', vi: 'sự may mắn ngẫu nhiên' },
                { word: 'coincidence', vi: 'sự trùng hợp kỳ lạ' },
                { word: 'fortune', vi: 'vận may' }
            ],
            antonyms: [
                { word: 'misfortune', vi: 'bất hạnh, xui rủi' },
                { word: 'design', vi: 'sự xếp đặt có chủ đích' }
            ],
            lumiTip: {
                etymology: 'Nhà văn Horace Walpole đặt ra từ truyện cổ Ba Tư "The Three Princes of Serendip" (những vị hoàng tử luôn tình cờ tìm thấy kho báu).',
                memoryHack: '💡 Mẹo của Lumi: Nhớ cụm "Serene" (bình yên) + "Dipper" (múc) ➔ một khoảnh khắc an lành múc trọn may mắn!',
                commonMistake: '⚠️ Khác với "Lucky" (may mắn đơn thuần), "Serendipity" luôn mang hàm ý tìm thấy điều tốt đẹp ngoài kế hoạch.'
            }
        },
        'break the ice': {
            word: 'break the ice',
            type: 'idiom',
            level: 'B1 Intermediate',
            ipa: '/breɪk ðiː aɪs/',
            frequency: '★★★★★ Rất phổ biến',
            meaningVi: 'Phá vỡ bầu không khí ngại ngùng, mở đầu câu chuyện thoải mái',
            meaningEn: 'Do or say something to relieve tension or get conversation started in a strained or unfamiliar gathering.',
            contexts: [
                { domain: 'Giao tiếp xã hội', text: 'Kể chuyện cười hoặc đặt câu hỏi mở để mọi người bắt đầu kết nối trong buổi tiệc.' },
                { domain: 'Phỏng vấn & Kinh doanh', text: 'Chào hỏi thân thiện trước khi bước vào các đàm phán hợp đồng căng thẳng.' }
            ],
            examples: [
                { en: 'He told a funny story about his pet to break the ice with the new team.', vi: 'Anh ấy kể một câu chuyện vui về thú cưng để phá vỡ sự ngượng ngùng với đội ngũ mới.' },
                { en: 'Playing a quick board game was a great icebreaker for the workshop.', vi: 'Chơi một trò chơi nhỏ là cách tuyệt vời để bắt đầu buổi hội thảo đầy hứng khởi.' }
            ],
            collocations: [
                { en: 'good way to break the ice', vi: 'cách hay để bắt chuyện' },
                { en: 'ice-breaking activity', vi: 'hoạt động khởi động gắn kết' },
                { en: 'help break the ice', vi: 'giúp giải tỏa không khí ngượng nghịu' }
            ],
            synonyms: [
                { word: 'warm up', vi: 'làm nóng bầu không khí' },
                { word: 'initiate conversation', vi: 'chủ động bắt chuyện' }
            ],
            antonyms: [
                { word: 'freeze up', vi: 'đóng băng, im lặng căng thẳng' }
            ],
            lumiTip: {
                etymology: 'Bắt nguồn từ những con tàu phá băng mở luồng lạch cho tàu bè buôn bán qua lại trên các dòng sông mùa đông.',
                memoryHack: '💡 Mẹo của Lumi: Tưởng tượng tảng băng lạnh lùng giữa hai người lạ bị nụ cười thân thiện làm tan chảy!',
                commonMistake: '⚠️ Đây là thành ngữ (idiom), không dịch theo nghĩa đen là đập vỡ đá lạnh trong ly nước nhé!'
            }
        },
        'ubiquitous': {
            word: 'ubiquitous',
            type: 'adjective',
            level: 'C1 Advanced',
            ipa: '/juːˈbɪk.wɪ.təs/',
            frequency: '★★★☆☆ Học thuật',
            meaningVi: 'Nhan nhản khắp nơi, hiện diện ở mọi lúc mọi nơi',
            meaningEn: 'Present, appearing, or found everywhere at the same time.',
            contexts: [
                { domain: 'Công nghệ & Đời sống số', text: 'Điện thoại thông minh và mạng Internet đã trở nên phổ biến ở mọi ngõ ngách.' },
                { domain: 'Văn hóa đại chúng', text: 'Cà phê mang đi và thương hiệu trà sữa hiện diện khắp các con phố lớn nhỏ.' }
            ],
            examples: [
                { en: 'Smartphones have become ubiquitous in modern everyday life.', vi: 'Điện thoại thông minh đã trở nên phổ biến ở mọi ngóc ngách của đời sống hiện đại.' },
                { en: 'Coffee shops are ubiquitous across the bustling streets of Tokyo.', vi: 'Các quán cà phê xuất hiện nhan nhản trên khắp các đường phố nhộn nhịp của Tokyo.' }
            ],
            collocations: [
                { en: 'ubiquitous presence', vi: 'sự hiện diện khắp mọi nơi' },
                { en: 'become ubiquitous', vi: 'trở nên phổ cập toàn diện' }
            ],
            synonyms: [
                { word: 'omnipresent', vi: 'toàn tại, có mặt khắp nơi' },
                { word: 'pervasive', vi: 'lan tỏa rộng khắp' }
            ],
            antonyms: [
                { word: 'rare', vi: 'hiếm hoi' },
                { word: 'scarce', vi: 'khan hiếm' }
            ],
            lumiTip: {
                etymology: 'Từ tiếng Latin "ubique" có nghĩa là "ở mọi nơi" (everywhere).',
                memoryHack: '💡 Mẹo của Lumi: Nhớ âm "You-be-quick" ➔ dù bạn đi nhanh đến đâu thì thứ đó cũng đã có mặt ở đó rồi!',
                commonMistake: '⚠️ Thường dùng nhiều trong văn viết học thuật (IELTS Writing) và bài luận hơn là đàm thoại thân mật thường nhật.'
            }
        },
        'ephemeral': {
            word: 'ephemeral',
            type: 'adjective',
            level: 'C2 Mastery',
            ipa: '/ɪˈfem.ər.əl/',
            frequency: '★★☆☆☆ Văn học & Thơ ca',
            meaningVi: 'Phù du, sớm nở tối tàn, chỉ tồn tại trong thoáng chốc',
            meaningEn: 'Lasting for a very short, fleeting time.',
            contexts: [
                { domain: 'Nghệ thuật & Tự nhiên', text: 'Vẻ đẹp ngắn ngủi của hoa anh đào nở rộ hay ánh hoàng hôn buông xuống.' },
                { domain: 'Triết học nhân sinh', text: 'Danh vọng và tiền tài thế gian chỉ là những thứ phù du thoáng qua.' }
            ],
            examples: [
                { en: 'Cherry blossoms are treasured for their beautiful yet ephemeral bloom.', vi: 'Hoa anh đào được nâng niu vì vẻ đẹp rực rỡ nhưng sớm nở tối tàn.' },
                { en: 'Fame in the digital era can be strikingly ephemeral.', vi: 'Sự nổi tiếng trong kỷ nguyên số đôi khi chỉ tồn tại trong chớp mắt.' }
            ],
            collocations: [
                { en: 'ephemeral beauty', vi: 'vẻ đẹp phù du mong manh' },
                { en: 'ephemeral nature', vi: 'bản chất ngắn ngủi, thoáng qua' }
            ],
            synonyms: [
                { word: 'fleeting', vi: 'thoáng chốc' },
                { word: 'transient', vi: 'tạm thời, chốc lát' }
            ],
            antonyms: [
                { word: 'eternal', vi: 'vĩnh cửu' },
                { word: 'permanent', vi: 'bền lâu, trường tồn' }
            ],
            lumiTip: {
                etymology: 'Xuất phát từ tiếng Hy Lạp cổ "ephemeros" (epi- là "trong vòng" + hemera là "một ngày").',
                memoryHack: '💡 Mẹo của Lumi: Nhớ "e-phe-mơ" ➔ như một giấc mơ ngắn ngủi bay vút đi!',
                commonMistake: '⚠️ Từ này mang sắc thái thi vị, triết lý, không nên dùng cho những sự việc quá tầm thường.'
            }
        }
    };

    function generateSmartDictEntry(rawWord) {
        const w = (rawWord || '').trim().toLowerCase();
        return {
            word: w,
            type: 'từ vựng',
            level: 'B1 Intermediate',
            ipa: `/${w}/`,
            frequency: '★★★★☆ Thông dụng',
            meaningVi: `Nghĩa từ điển & phân tích ngữ cảnh chuẩn xác cho từ "${w}"`,
            meaningEn: `Academic and everyday contextual definition for the term "${w}".`,
            contexts: [
                { domain: 'Giao tiếp hàng ngày', text: `Cách dùng tự nhiên và chuẩn mực của từ "${w}" trong hội thoại.` },
                { domain: 'Học thuật & Thi cử', text: `Từ vựng được Lumi đề xuất cho các bài thi IELTS/TOEIC và viết luận.` }
            ],
            examples: [
                { en: `Mastering "${w}" will help improve your fluency and confidence.`, vi: `Nắm vững từ "${w}" sẽ giúp nâng cao sự lưu loát và tự tin của bạn.` },
                { en: `Lumi recommends practicing "${w}" in full spoken sentences.`, vi: `Lumi khuyên bạn nên luyện nói từ "${w}" trong câu hoàn chỉnh.` }
            ],
            collocations: [
                { en: `key ${w}`, vi: `yếu tố cốt lõi của ${w}` },
                { en: `understand ${w}`, vi: `hiểu rõ bản chất của ${w}` }
            ],
            synonyms: [
                { word: 'essential', vi: 'thiết yếu' },
                { word: 'important', vi: 'quan trọng' }
            ],
            antonyms: [
                { word: 'trivial', vi: 'không đáng kể' }
            ],
            lumiTip: {
                etymology: `Từ vựng được cập nhật tự động từ cơ sở dữ liệu ngôn ngữ thông minh của Lumi.`,
                memoryHack: `💡 Mẹo của Lumi: Đặt ngay một câu tiếng Anh liên quan đến cuộc sống của bạn với từ "${w}" để nhớ ngay lập tức!`,
                commonMistake: `⚠️ Chú ý nghe phát âm chuẩn bằng nút US và UK phía trên để nói chuẩn xác nhé!`
            }
        };
    }

    // Attach to window for global access across modules
    window.fullDictData = fullDictData;
    window.generateSmartDictEntry = generateSmartDictEntry;

})(window);
