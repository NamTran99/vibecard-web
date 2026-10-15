(function(window) {
    'use strict';

    window.LumiWakeupData = {
        IDLE_TAIL: {
            notice: (9.6 - 1.6) + 1 / 24,
            joy: (8.7 - 6.8) + 1 / 24
        },
        FLASH_PEAK_MS: 150,
        AUTO_ENTER_MS: 4200,
        stages: [
            {
                stage: 0,
                quoteTitle: 'Mỗi ngày là một hành trình kỳ diệu.<br><span class="font-normal opacity-90 text-[#E5E3DB]">Hãy chạm nhẹ để đánh thức nguồn sáng.</span>',
                quoteSub: 'Lumi vẫn đang say giấc nồng giữa những vì sao',
                quoteSubClass: 'text-[#8E9285]',
                promptHtml: '<span class="lumi-pulse-dot"></span>CHẠM ĐỂ ĐÁNH THỨC LUMI (1/2)',
                auraScale: 'scale(1)',
                auraBg: 'radial-gradient(circle, rgba(184, 209, 102, 0.22) 0%, rgba(201, 100, 45, 0.12) 55%, transparent 75%)',
                chimeNotes: []
            },
            {
                stage: 1,
                quoteTitle: 'Ưm... bạn đến rồi à?<br><span class="font-normal text-[#D4EE7F]">Lumi vẫn còn ngái ngủ một chút...</span>',
                quoteSub: '“Lumi hé mắt nhìn bạn, mỉm cười rồi ngáp một cái thật dài”',
                quoteSubClass: 'text-[#D4EE7F]',
                promptHtml: '<span class="lumi-pulse-dot"></span>CHẠM LẦN NỮA ĐỂ ĐÁNH THỨC HẲN (2/2)',
                auraScale: 'scale(1.35)',
                auraBg: 'radial-gradient(circle, rgba(184, 209, 102, 0.35) 0%, rgba(245, 158, 11, 0.2) 50%, transparent 75%)',
                chimeNotes: [523.25, 659.25, 783.99] // C5, E5, G5
            },
            {
                stage: 2,
                quoteTitle: 'Lumi đã thức giấc rạng rỡ rồi! ✨<br><span class="text-[#B8D166] font-bold">Sẵn sàng cùng bạn chinh phục hôm nay</span>',
                quoteSub: '“Chào bạn! Cùng Lumi nạp đầy năng lượng học tập nhé!”',
                quoteSubClass: 'text-[#B8D166]',
                promptHtml: '<span class="lumi-btn-enter">BẮT ĐẦU HỌC TẬP <svg style="width: 14px; height: 14px;" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 5l7 7-7 7"/></svg></span>',
                auraScale: 'scale(1.75)',
                auraBg: 'radial-gradient(circle, rgba(184, 209, 102, 0.52) 0%, rgba(201, 100, 45, 0.3) 50%, transparent 75%)',
                chimeNotes: [523.25, 659.25, 783.99, 987.77, 1046.50, 1318.51] // Dreamy pentatonic cascade
            }
        ]
    };
})(window);
