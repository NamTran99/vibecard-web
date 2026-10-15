(function(window) {
    'use strict';

    // Câu chuyện ngụ ngôn chuẩn 1:1 theo Android Native (Rùa và Thỏ - The Tortoise and the Hare)
    window.DEFAULT_STORY_DATA = {
        id: "lesson_003",
        title: "Ngụ ngôn: Rùa và Thỏ",
        totalParts: 4,
        parts: [
            {
                order: 1,
                title: "Mở đầu",
                imageUrl: "Cloud_Deploy/cloudflare_worker/admin/story-images/codex-realistic-parts/lesson_003_part_01.webp",
                imageFocus: "center 52%",
                contentEn: "On a beautiful morning, the valley was filled with birdsong welcoming the warm sunlight. Hare dashed past and intentionally braked abruptly right in front of Tortoise, mocking his slow steps. Tortoise took no offense, merely raising his head with a calm smile and steady confidence. He leisurely proposed that they race to the old oak tree at the end of the road. The little woodland animals were deeply astonished, while Hare threw his head back and laughed loudly, convinced victory was already in his hands.",
                contentVi: "Vào một buổi sáng tuyệt đẹp, thung lũng ngập tràn tiếng chim hót đón ánh nắng ấm áp. Thỏ lao vút qua rồi cố tình phanh gấp ngay trước mặt Rùa, chế giễu từng bước đi chậm chạp. Rùa không hề bận lòng, chỉ khẽ ngẩng đầu với một nụ cười điềm tĩnh và sự tự tin vững vàng. Chú thong thả đề nghị cả hai cùng chạy đua tới cây sồi già cuối con đường. Muông thú trong rừng vô cùng sửng sốt, còn Thỏ ngửa cổ cười lớn, đinh ninh chiến thắng đã nắm chắc trong tay.",
                targetWords: [
                    {
                        term: "beautiful morning",
                        pos: "PHRASE",
                        phonetic: "/ˈbjuː.tɪ.fəl ˈmɔː.nɪŋ/",
                        meaning: "Buổi sáng tuyệt đẹp",
                        definition: "A lovely, peaceful and bright start of the day.",
                        example: "On a beautiful morning, the valley was filled with birdsong.",
                        exampleTr: "Vào một buổi sáng tuyệt đẹp, thung lũng ngập tràn tiếng chim ca."
                    },
                    {
                        term: "braked abruptly",
                        pos: "VERB",
                        phonetic: "/breɪkt əˈbrʌpt.li/",
                        meaning: "Phanh gấp, dừng đột ngột",
                        definition: "Stopped movement very suddenly and sharply.",
                        example: "Hare dashed past and intentionally braked abruptly.",
                        exampleTr: "Thỏ lao vút qua rồi cố tình phanh gấp lại."
                    },
                    {
                        term: "calm smile",
                        pos: "PHRASE",
                        phonetic: "/kɑːm smaɪl/",
                        meaning: "Nụ cười điềm tĩnh",
                        definition: "A tranquil and confident facial expression.",
                        example: "Tortoise took no offense, merely raising his head with a calm smile.",
                        exampleTr: "Rùa không giận, chỉ khẽ ngẩng đầu với nụ cười điềm tĩnh."
                    },
                    {
                        term: "leisurely",
                        pos: "ADV",
                        phonetic: "/ˈleʒ.ə.li/",
                        meaning: "Thong thả, ung dung",
                        definition: "Acting in an unhurried, relaxed and peaceful manner.",
                        example: "He leisurely proposed that they race to the old oak tree.",
                        exampleTr: "Chú thong thả đề nghị cả hai cùng chạy đua."
                    },
                    {
                        term: "deeply astonished",
                        pos: "PHRASE",
                        phonetic: "/ˈdiːp.li əˈstɒn.ɪʃt/",
                        meaning: "Vô cùng sửng sốt, kinh ngạc",
                        definition: "Extremely surprised and utterly amazed.",
                        example: "The little woodland animals were deeply astonished by the challenge.",
                        exampleTr: "Muông thú trong rừng vô cùng sửng sốt trước lời thách đấu."
                    }
                ]
            },
            {
                order: 2,
                title: "Xuất phát",
                imageUrl: "Cloud_Deploy/cloudflare_worker/admin/story-images/codex-realistic-parts/lesson_003_part_02.webp",
                imageFocus: "center 54%",
                contentEn: "The starting signal fired, and Hare leaped forward like an arrow released from a taut bowstring. Within moments, his figure had vanished into a whirlwind of golden dust at the bend. Tortoise, unhurried and unflinching, took his very first heavy, measured stride. The spectators watched in silence as the steady creature moved steadily ahead.",
                contentVi: "Tiếng hiệu lệnh vang lên, Thỏ phóng vụt đi như mũi tên rời khỏi dây cung căng. Trong chớp mắt, bóng dáng nó đã biến mất sau lốc bụi vàng nơi khúc quanh. Rùa, không vội vã cũng chẳng nao núng, cất bước chân nặng nhọc nhưng vững chãi đầu tiên. Khán giả im lặng dõi theo sinh vật kiên định từng bước tiến về phía trước.",
                targetWords: [
                    {
                        term: "leaped forward",
                        pos: "VERB",
                        phonetic: "/liːpt ˈfɔː.wəd/",
                        meaning: "Lao vụt về phía trước",
                        definition: "Jumped or bounded forward with high speed.",
                        example: "Hare leaped forward like an arrow released from a bow.",
                        exampleTr: "Thỏ phóng vụt đi như một mũi tên rời cung."
                    },
                    {
                        term: "measured stride",
                        pos: "PHRASE",
                        phonetic: "/ˈmeʒ.əd straɪd/",
                        meaning: "Bước chân vững vàng, có tính toán",
                        definition: "A steady, deliberate and controlled step.",
                        example: "Tortoise took his very first heavy, measured stride.",
                        exampleTr: "Rùa cất bước chân nặng nhọc nhưng vô cùng vững chãi."
                    }
                ]
            },
            {
                order: 3,
                title: "Cơn buồn ngủ",
                imageUrl: "Cloud_Deploy/cloudflare_worker/admin/story-images/codex-realistic-parts/lesson_003_part_03.webp",
                imageFocus: "center 58%",
                contentEn: "Halfway through the course, Hare looked back and saw no sign of his slow competitor. Feeling overwhelmingly arrogant, he decided to take a brief nap beneath the cool shade of a clover patch. The gentle breeze lulled him into a profound slumber, completely unaware that time was slipping away.",
                contentVi: "Đến nửa đường đua, Thỏ ngoái nhìn lại và chẳng thấy tăm hơi đối thủ chậm chạp đâu. Cảm thấy đắc thắng và kiêu ngạo tột cùng, nó quyết định chợp mắt dưới bóng râm mát rượi của vạt cỏ ba lá. Làn gió nhẹ nhàng ru nó vào giấc ngủ say sưa, hoàn toàn không hay biết thời gian đang trôi qua.",
                targetWords: [
                    {
                        term: "arrogant",
                        pos: "ADJ",
                        phonetic: "/ˈær.ə.ɡənt/",
                        meaning: "Kiêu ngạo, tự phụ",
                        definition: "Having an exaggerated sense of one's own abilities.",
                        example: "Feeling overwhelmingly arrogant, Hare lay down to sleep.",
                        exampleTr: "Cảm thấy kiêu ngạo tột cùng, Thỏ nằm xuống ngủ."
                    },
                    {
                        term: "profound slumber",
                        pos: "PHRASE",
                        phonetic: "/prəˈfaʊnd ˈslʌm.bər/",
                        meaning: "Giấc ngủ say sưa, mê mệt",
                        definition: "A very deep and peaceful sleep.",
                        example: "The gentle breeze lulled him into a profound slumber.",
                        exampleTr: "Làn gió nhẹ ru nó vào giấc ngủ say sưa."
                    }
                ]
            },
            {
                order: 4,
                title: "Chiến thắng",
                imageUrl: "Cloud_Deploy/cloudflare_worker/admin/story-images/codex-realistic-parts/lesson_003_part_04.webp",
                imageFocus: "center 55%",
                contentEn: "Tortoise persevered, step after painful step, without a single moment of hesitation. When Hare finally jolted awake, the triumphant cheers of the crowd were already echoing across the finish line. Tortoise had touched the ancient oak tree, proving that slow and steady truly wins the race.",
                contentVi: "Rùa kiên trì tiến lên, từng bước chân bền bỉ không một khoảnh khắc do dự. Khi Thỏ cuối cùng giật mình bừng tỉnh, tiếng reo hò chiến thắng của muông thú đã vang dội khắp vạch đích. Rùa đã chạm tay vào cây sồi già, minh chứng rằng chậm mà chắc chắn sẽ luôn dẫn tới thành công.",
                targetWords: [
                    {
                        term: "persevered",
                        pos: "VERB",
                        phonetic: "/ˌpɜː.sɪˈvɪəd/",
                        meaning: "Kiên trì, bền chí vượt khó",
                        definition: "Continued in a course of action even in the face of difficulty.",
                        example: "Tortoise persevered without a single moment of hesitation.",
                        exampleTr: "Rùa bền bỉ tiến lên không một chút ngần ngại."
                    },
                    {
                        term: "triumphant cheers",
                        pos: "PHRASE",
                        phonetic: "/traɪˈʌm.fənt tʃɪəz/",
                        meaning: "Tiếng reo hò chiến thắng",
                        definition: "Joyful shouts celebrating a glorious victory.",
                        example: "The triumphant cheers of the crowd echoed through the valley.",
                        exampleTr: "Tiếng reo hò chiến thắng vang vọng khắp thung lũng."
                    }
                ]
            }
        ]
    };
})(window);
