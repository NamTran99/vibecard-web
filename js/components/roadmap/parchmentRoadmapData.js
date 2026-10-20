// ========================================================
// 🗺️ ROADMAP TIMELINE CONTROLLER (tham chiếu Mobbin: Moonly iOS)
// Mỗi chương = 10 bài chia 2 section (vòng), mỗi section có 1 nhân vật
// được tô màu thêm 1/5 sau mỗi bài hoàn thành.
// ========================================================

let currentRoadmapChapterIdx = 0;

// Metadata hiển thị theo loại bài học (nhãn + thời lượng) cho thẻ timeline
const roadmapNodeTypeMeta = {
    star:  { label: 'Khởi động',       minutes: 3 },
    video: { label: 'Hội thoại video', minutes: 5 },
    book:  { label: 'Đọc hiểu',        minutes: 5 },
    audio: { label: 'Luyện nghe',      minutes: 4 },
    chest: { label: 'Rương thưởng',    minutes: 0 },
    boss:  { label: 'Thử thách cuối',  minutes: 8 }
};

// Tên 2 section (2 vòng) của từng chương, index theo chapter.id
const roadmapSectionTitles = [
    ['Bìa rừng đom đóm', 'Lối mòn cổ thụ'],
    ['Sân ga nửa đêm', 'Toa tàu bí ẩn'],
    ['Khởi động giọng hát', 'Sân khấu cực quang'],
    ['Cánh đồng ngàn sao', 'Bầu trời đom đóm']
];

// Mỗi section (vòng) gồm 5 bài; 1 bài hoàn thành = tô thêm 1/5 nhân vật
const ROADMAP_LESSONS_PER_LOOP = 5;

// SVG nhỏ dùng trong chấm & node section
const ROADMAP_ICON_CHECK = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3.6" stroke-linecap="round" stroke-linejoin="round"><path d="M5 12.5l4.5 4.5L19 7.5"/></svg>';
const ROADMAP_ICON_SPARKLE = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M12 2c.6 5.5 4.5 9.4 10 10-5.5.6-9.4 4.5-10 10-.6-5.5-4.5-9.4-10-10 5.5-.6 9.4-4.5 10-10z"/></svg>';
const ROADMAP_ICON_LOCK = '<svg viewBox="0 0 24 24" fill="currentColor"><path d="M17 9V7a5 5 0 0 0-10 0v2H5v12h14V9h-2zm-8-2a3 3 0 0 1 6 0v2H9V7z"/></svg>';
const ROADMAP_ICON_PLAY = '<svg viewBox="0 0 20 20"><path d="M6.3 2.84A1.5 1.5 0 004 4.11v11.78a1.5 1.5 0 002.3 1.27l9.34-5.89a1.5 1.5 0 000-2.54L6.3 2.84z"/></svg>';
const ROADMAP_ICON_LUMI_PAW = '<svg viewBox="0 0 20 20" width="15" height="15" fill="currentColor" aria-hidden="true"><path d="M4 8.5 C3 6.5 4.5 3 7 2 C8.8 1.3 11.2 1.3 13 2 C15.5 3 17 6.5 16 8.5 C15 10.3 12.5 11 10 11 C7.5 11 5 10.3 4 8.5 Z"/><ellipse cx="4.5" cy="14.5" rx="1.8" ry="2.6" transform="rotate(20 4.5 14.5)"/><ellipse cx="8" cy="17" rx="1.8" ry="2.8" transform="rotate(6 8 17)"/><ellipse cx="12" cy="17" rx="1.8" ry="2.8" transform="rotate(-6 12 17)"/><ellipse cx="15.5" cy="14.5" rx="1.8" ry="2.6" transform="rotate(-20 15.5 14.5)"/></svg>';

function renderRailPawsHtml(down, downOn, isActive, downLong) {
    if (!down) return '';
    const cls = [
        'mb-rail-paws',
        downOn ? 'is-on' : (isActive ? 'is-active-stride' : 'is-fading-trail'),
        downLong ? 'is-long' : ''
    ].filter(Boolean).join(' ');
    return `
        <div class="${cls}" aria-hidden="true">
            <span class="mb-trail-line"></span>
            <span class="mb-paw mb-paw-1">${ROADMAP_ICON_LUMI_PAW}</span>
            <span class="mb-trail-sparkle mb-sparkle-1">✦</span>
            <span class="mb-paw mb-paw-2">${ROADMAP_ICON_LUMI_PAW}</span>
            <span class="mb-trail-sparkle mb-sparkle-2">✦</span>
            <span class="mb-paw mb-paw-3">${ROADMAP_ICON_LUMI_PAW}</span>
        </div>`;
}
window.renderRailPawsHtml = renderRailPawsHtml;

// 10 Chương Lộ Trình với 10 Units / Chương & 2 Nhân Vật Tô Màu (từ roadmap.json)
let roadmapChaptersData = (typeof window !== 'undefined' && Array.isArray(window.REAL_ROADMAP_CHAPTERS) && window.REAL_ROADMAP_CHAPTERS.length > 0)
    ? window.REAL_ROADMAP_CHAPTERS
    : [
    {
        id: 0,
        chapterTag: "CHƯƠNG 1 • KHU RỪNG NGỤ NGÔN",
        title: "Khu Rừng Ngụ Ngôn",
        progressText: "2/10 bài · 20%",
        desc: "Khám phá ngụ ngôn ngắn, học từ vựng qua câu chuyện và bài học ý nghĩa.",
        image: "assets/cards/fable_forest_hero_banner.jpg",
        activeNodeIndex: 2,
        characters: [
            {
                loop: 1,
                name: "Thần Rừng Lumi",
                role: "Người Dẫn Lối Vòng 1",
                img: "assets/cards/lumi_avatar_portrait_clean.png",
                quote: "Tô sáng từng vạch màu để đánh thức phép thuật rừng sâu!"
            },
            {
                loop: 2,
                name: "Billy Possum",
                role: "Bạn Đồng Hành Vòng 2",
                img: "assets/cards/billy_possum_crop_test.png",
                quote: "Cố lên! Vòng 2 sẽ mở ra câu chuyện huyền ảo!"
            }
        ],
        nodes: [
            { num: 1, day: 1, topicId: "topic_001", title: "Cơn Mưa Tình Cờ", subtitle: "Bắt chuyện tự nhiên và đề xuất hỗ trợ", type: "video", status: "completed", img: "assets/cards/lumi_rain_coffee_eaves.jpg", scenario: "Một cơn mưa rào đổ xuống đột ngột khiến Minh và Lan phải cùng trú tạm dưới mái hiên tối tăm của một nhà hát trung tâm thành phố.", purpose: "Biết cách bắt chuyện tự nhiên, chia sẻ thông tin cá nhân và đề xuất hỗ trợ khi gặp người lạ.", lessonType: "dialogue", tags: { age: "15+", genre: "dialogue_daily", origin: "vietnam", moral: "collaboration", mood: "adventurous" }, display_badges: ["15+", "Đời thường", "Du lịch", "Linh hoạt"] },
            { num: 2, day: 2, topicId: "topic_002", title: "Chiếc Thẻ Nhầm Tên", subtitle: "Xác nhận danh tính và phối hợp", type: "video", status: "completed", img: "assets/cards/lumi_review_flashcards.jpg", scenario: "Sảnh đăng ký của một hội nghị công nghệ quốc tế ngay trước bài khai mạc.", purpose: "Xác nhận danh tính, xử lý nhầm lẫn nhạy cảm và phối hợp khi thời gian gấp.", lessonType: "dialogue", tags: { age: "18+", genre: "dialogue_work", origin: "vietnam", moral: "collaboration", mood: "witty" }, display_badges: ["18+", "Công sở", "Hợp tác", "Thực chiến"] },
            { num: 3, day: 3, topicId: "topic_003", title: "Ngụ ngôn: Rùa và Thỏ", subtitle: "Bài học về sự kiên trì", type: "book", status: "active", img: "assets/cards/lumi_farmer_strawhat.jpg", scenario: "Một lời thách thức bất ngờ giữa thung lũng mùa xuân đã châm ngòi cho cuộc đua vô tiền khoáng hậu giữa chú Thỏ kiêu ngạo và chú Rùa điềm tĩnh.", purpose: "Sự kiên trì bền bỉ làm chủ con đường.", lessonType: "story", tags: { age: "3+", genre: "fable", origin: "western", moral: "persistence", mood: "cozy" }, display_badges: ["3+", "Ngụ ngôn Aesop", "Kiên trì", "Ấm áp"] },
            { num: 4, day: 4, topicId: "topic_004", title: "Tàu Trễ", subtitle: "Ứng phó hoãn chuyến tàu", type: "video", status: "locked", img: "assets/cards/lesson_004_chuyen_tau_nua_dem_lofi_vi.jpg", scenario: "Ke ga số 3 vắng lặng giữa đêm khuya khi chuyến tàu cuối cùng bị hoãn.", purpose: "Hỏi thăm lịch tàu và ứng phó tình huống khẩn.", lessonType: "dialogue", tags: { age: "15+", genre: "dialogue_daily", origin: "vietnam", moral: "collaboration", mood: "adventurous" }, display_badges: ["15+", "Đời thường", "Du lịch", "Linh hoạt"] },
            { num: 5, day: 5, topicId: "topic_005", title: "Ảnh Cũ", subtitle: "Rương kho báu +150 XP", type: "chest", status: "chest", img: "assets/cards/deck_saved_banner.jpg", scenario: "Bức ảnh kỷ niệm bị rơi dưới góc bàn.", purpose: "Giao tiếp lịch thiệp và trao trả đồ thất lạc.", lessonType: "dialogue", tags: { age: "10+", genre: "dialogue_daily", origin: "vietnam", moral: "kindness", mood: "cozy" }, display_badges: ["10+", "Rương báu 🎁", "Gắn kết", "Ấm áp"] },
            { num: 6, day: 6, topicId: "topic_006", title: "Ngụ ngôn: Quạ và Bình Nước", subtitle: "Sự thông minh và kiên nhẫn", type: "book", status: "locked", img: "assets/cards/lumi_melody_arena.jpg", scenario: "Dưới cái nắng gay gắt như thiêu như đốt, chú Quạ khát khô cổ họng tìm thấy một chiếc bình đựng nước sâu đáy hẹp miệng.", purpose: "Giải quyết khó khăn bằng trí tuệ và kiên nhẫn.", lessonType: "story", tags: { age: "3+", genre: "fable", origin: "western", moral: "wisdom", mood: "witty" }, display_badges: ["3+", "Ngụ ngôn Aesop", "Trí tuệ", "Bình tĩnh"] },
            { num: 7, day: 7, topicId: "topic_007", title: "Sai Hóa Đơn", subtitle: "Trao đổi hóa đơn nhã nhặn", type: "video", status: "locked", img: "assets/cards/pixar_night_farm_scenery.jpg", scenario: "Hóa đơn thanh toán tại quán ăn có món lạ.", purpose: "Lịch thiệp đối chiếu lại hóa đơn.", lessonType: "dialogue", tags: { age: "15+", genre: "dialogue_daily", origin: "vietnam", moral: "collaboration", mood: "adventurous" }, display_badges: ["15+", "Đời thường", "Du lịch", "Linh hoạt"] },
            { num: 8, day: 8, topicId: "topic_008", title: "Lộn Bàn Ăn", subtitle: "Xử lý nhầm chỗ ngồi khéo léo", type: "video", status: "locked", img: "assets/cards/lumi_farmer_night.png", scenario: "Ngồi nhầm bàn ăn đã có người đặt trước trong giờ cao điểm.", purpose: "Xử lý tình huống nhầm lẫn nhã nhặn.", lessonType: "dialogue", tags: { age: "15+", genre: "dialogue_daily", origin: "vietnam", moral: "collaboration", mood: "adventurous" }, display_badges: ["15+", "Đời thường", "Du lịch", "Linh hoạt"] },
            { num: 9, day: 9, topicId: "topic_009", title: "Ngụ ngôn: Cậu Bé Chăn Cừu", subtitle: "Giá trị của sự trung thực", type: "book", status: "locked", img: "assets/cards/lumi_review_flashcards.jpg", scenario: "Những ngày chăn cừu dài dằng dặc trên đồi cỏ đã khiến cậu bé nghĩ ra một trò đùa tai hại.", purpose: "Bài học sâu sắc về sự trung thực và lòng tin.", lessonType: "story", tags: { age: "3+", genre: "fable", origin: "western", moral: "honesty", mood: "touching" }, display_badges: ["3+", "Ngụ ngôn Aesop", "Trung thực", "Bài học sâu sắc"] },
            { num: 10, day: 10, topicId: "topic_010", title: "Trước Giờ Lên Sóng", subtitle: "Thử thách trùm cuối 👑", type: "boss", status: "boss", img: "assets/cards/lumi_progress_celebration.jpg", scenario: "Hậu trường studio truyền hình trước giờ phát sóng trực tiếp đầy kịch tính.", purpose: "Phối hợp gấp rút trước sự kiện quan trọng.", lessonType: "dialogue", tags: { age: "18+", genre: "dialogue_work", origin: "vietnam", moral: "courage", mood: "adventurous" }, display_badges: ["18+", "Chung kết 👑", "Thử thách", "Kịch tính"] }
        ]
    },
    {
        id: 1,
        chapterTag: "CHƯƠNG 2 • NGÔI LÀNG CỔ TÍCH",
        title: "Ngôi Làng Cổ Tích",
        progressText: "0/10 bài (Khóa)",
        desc: "Làm quen với các tình huống giao tiếp đời thường trong không gian ấm cúng.",
        image: "assets/cards/lumi_train_station_night.jpg",
        activeNodeIndex: -1,
        characters: [
            {
                loop: 1,
                name: "Bác Soát Vé Lumi",
                role: "Người Dẫn Lối Vòng 1",
                img: "assets/cards/lumi_avatar_portrait_clean.png",
                quote: "Chào mừng bạn đến ngôi làng cổ tích!"
            },
            {
                loop: 2,
                name: "Billy Bụi Đời",
                role: "Bạn Đồng Hành Vòng 2",
                img: "assets/cards/billy_possum_crop_test.png",
                quote: "Rất nhiều câu chuyện thú vị đang chờ!"
            }
        ],
        nodes: [
            { num: 1, day: 11, topicId: "topic_011", title: "Mua Quà Gấp", subtitle: "Chọn quà và đóng gói nhanh", type: "video", status: "locked", img: "assets/cards/lumi_train_station_night.jpg", scenario: "Tiệm quà lưu niệm tại khu phố cổ." },
            { num: 2, day: 12, topicId: "topic_012", title: "Ngụ ngôn: Sư Tử và Chuột", subtitle: "Lòng tốt được đền đáp", type: "book", status: "locked", img: "assets/cards/lumi_farmer_night.png", scenario: "Khu rừng rậm và sự đền đáp bất ngờ." },
            { num: 3, day: 13, topicId: "topic_013", title: "Món Quà Dưới Mưa", subtitle: "Bày tỏ lòng cảm ơn", type: "video", status: "locked", img: "assets/cards/lumi_rain_coffee_eaves.jpg", scenario: "Gặp lại người bạn cũ dưới cơn mưa chiều." },
            { num: 4, day: 14, topicId: "topic_014", title: "Bát Mì Lạc", subtitle: "Yêu cầu đổi món đúng thực đơn", type: "video", status: "locked", img: "assets/cards/lumi_melody_arena.jpg", scenario: "Quán mì ramen nhỏ trong hẻm." },
            { num: 5, day: 15, topicId: "topic_015", title: "Ngụ ngôn: Cáo và Chùm Nho", subtitle: "Rương Làng Cổ +200 XP", type: "chest", status: "chest", img: "assets/cards/reward_gift_box.jpg", scenario: "Giàn nho mọng nước trên cao." },
            { num: 6, day: 16, topicId: "topic_016", title: "Ly Cà Phê Nhầm", subtitle: "Xác nhận lại thức uống", type: "video", status: "locked", img: "assets/cards/pixar_night_farm_scenery.jpg", scenario: "Quầy order tấp nập buổi sáng." },
            { num: 7, day: 17, topicId: "topic_017", title: "Gọi Nhầm Đồ", subtitle: "Trao đổi với nhân viên", type: "video", status: "locked", img: "assets/cards/lumi_review_flashcards.jpg", scenario: "Bàn tiệc ngoài trời." },
            { num: 8, day: 18, topicId: "topic_018", title: "Cổ tích: Khăn Đỏ", subtitle: "Cảnh giác và tuân theo lời dặn", type: "book", status: "locked", img: "assets/cards/lumi_farmer_strawhat.jpg", scenario: "Con đường băng qua rừng đến nhà bà ngoại." },
            { num: 9, day: 19, topicId: "topic_019", title: "Sai Tiền Ăn", subtitle: "Kiểm tra tiền thối", type: "video", status: "locked", img: "assets/cards/lumi_train_station_night.jpg", scenario: "Thanh toán lúc rời quán." },
            { num: 10, day: 20, topicId: "topic_020", title: "Lạc Sau Trạm Xe", subtitle: "Thử thách trùm cuối 👑", type: "boss", status: "boss", img: "assets/cards/lumi_progress_celebration.jpg", scenario: "Khu đô thị mới với nhiều ngã rẽ." }
        ]
    }
];
