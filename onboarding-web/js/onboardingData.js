// ==========================================================================
// 📚 VIBECARD ONBOARDING DATA — PLAYFUL STORYTELLING & ENTERTAINMENT EDITION
// ==========================================================================

const doodleSvg = (pathsHtml, blobColor = 'var(--vc-amber-soft)') => `
  <svg viewBox="0 0 100 100" width="34" height="34" fill="none" xmlns="http://www.w3.org/2000/svg">
    <path d="M48 10 C74 12, 91 30, 89 53 C87 77, 70 92, 49 90 C22 88, 10 72, 12 49 C14 26, 25 8, 48 10 Z" fill="${blobColor}" />
    ${pathsHtml}
  </svg>`;

const OnboardingData = {
  // 1. Target Languages (Fun & Entertainment-First Subtitles)
  languages: [
    { code: 'EN', name: 'Tiếng Anh', flag: '🇬🇧', sub: 'Truyện ngụ ngôn, Phim & Âm nhạc', learners: '148.2K' },
    { code: 'JA', name: 'Tiếng Nhật', flag: '🇯🇵', sub: 'Anime, Cổ tích & Văn hóa Nhật', learners: '64.5K' },
    { code: 'KO', name: 'Tiếng Hàn', flag: '🇰🇷', sub: 'K-Drama, Nhạc Indie & Đời sống', learners: '52.1K' },
    { code: 'ZH', name: 'Tiếng Trung', flag: '🇨🇳', sub: 'Truyện cổ phong & Phim ảnh', learners: '49.8K' },
    { code: 'FR', name: 'Tiếng Pháp', flag: '🇫🇷', sub: 'Giai điệu lãng mạn & Nghệ thuật', learners: '19.4K' },
    { code: 'ES', name: 'Tiếng Tây Ban Nha', flag: '🇪🇸', sub: 'Nhạc Latin, Lễ hội & Phiêu lưu', learners: '16.2K' },
    { code: 'DE', name: 'Tiếng Đức', flag: '🇩🇪', sub: 'Cổ tích Grimm & Khám phá Âu châu', learners: '14.7K' },
    { code: 'VI', name: 'Tiếng Việt', flag: '🇻🇳', sub: 'Kho tàng ngụ ngôn & Đồng dao', learners: '11.3K' }
  ],

  // 2. Attribution Sources (Screens 10–11)
  sources: [
    {
      id: 'tiktok',
      label: 'TikTok / Reels',
      sub: 'Lướt thấy video Cáo Lumi kể chuyện',
      icon: doodleSvg(`<path d="M56 24 Q55 52, 55 64 C55 75, 36 77, 35 64 C34 52, 48 50, 52 53 M56 24 C60 34, 68 38, 74 38" stroke="var(--m3-primary)" stroke-width="7.5" stroke-linecap="round" stroke-linejoin="round"/>`)
    },
    {
      id: 'friends',
      label: 'Bạn bè rủ rê',
      sub: 'Được hội bạn thân truyền tai nhau',
      icon: doodleSvg(`<path d="M38 38 Q48 36, 48 47 Q46 56, 38 56 Q29 56, 28 47 Q28 36, 38 38 Z M22 76 Q23 63, 38 62 Q52 63, 54 76 M63 34 Q72 33, 72 43 Q70 51, 63 51 M56 72 Q58 61, 69 60 Q78 61, 80 72" stroke="var(--vc-amber-glow)" stroke-width="6.8" stroke-linecap="round" stroke-linejoin="round"/>`)
    },
    {
      id: 'youtube',
      label: 'YouTube',
      sub: 'Xem kênh vlog học ngoại ngữ thú vị',
      icon: doodleSvg(`<path d="M22 35 Q50 30, 78 35 Q83 50, 78 66 Q50 71, 22 66 Q17 50, 22 35 Z" stroke="var(--m3-primary)" stroke-width="7" stroke-linejoin="round"/><path d="M44 42 Q55 47, 61 50 Q54 54, 44 59 Z" fill="var(--vc-amber-glow)" stroke="var(--vc-amber-glow)" stroke-width="4" stroke-linejoin="round"/>`)
    },
    {
      id: 'facebook',
      label: 'Facebook / Instagram',
      sub: 'Bắt gặp tranh vẽ khu rừng cổ tích',
      icon: doodleSvg(`<path d="M30 26 Q50 23, 70 26 Q77 48, 72 72 Q50 76, 28 72 Q23 48, 30 26 Z" stroke="var(--m3-primary)" stroke-width="6.8"/><circle cx="50" cy="50" r="11" stroke="var(--vc-amber-glow)" stroke-width="6.5"/><circle cx="64" cy="36" r="3.5" fill="var(--vc-amber-glow)"/>`)
    },
    {
      id: 'appstore',
      label: 'Google Play / App Store',
      sub: 'Tình cờ dạo chợ ứng dụng',
      icon: doodleSvg(`<path d="M50 23 Q55 37, 68 38 Q57 47, 61 62 Q50 53, 39 62 Q43 47, 32 38 Q45 37, 50 23 Z" stroke="var(--vc-amber-glow)" stroke-width="6.8" stroke-linejoin="round"/>`)
    },
    {
      id: 'google',
      label: 'Tình cờ tìm thấy trên Web',
      sub: 'Đang tìm cách đọc truyện song ngữ vui',
      icon: doodleSvg(`<path d="M46 26 Q66 24, 67 45 Q68 65, 46 66 Q26 67, 25 46 Q24 25, 46 26 Z M61 60 Q70 69, 77 75" stroke="var(--m3-primary)" stroke-width="7.2" stroke-linecap="round"/>`)
    }
  ],

  // 3. Botanical Stages (Screens 12–14)
  levels: [
    {
      id: 'lv1',
      cefr: 'Hạt Mầm Mới',
      label: 'Mình muốn bắt đầu lại từ trang đầu',
      sub: 'Vừa đọc truyện tranh vừa làm quen từng từ mới',
      seedImg: 'assets/levels/level_a0_seed.svg',
      lumiReply: 'Tuyệt vời! Tụi mình sẽ <b>bắt đầu bằng những mẩu chuyện siêu ngắn</b>, đọc tới đâu hiểu ngay tới đó nhé!'
    },
    {
      id: 'lv2',
      cefr: 'Chồi Non',
      label: 'Mình biết vài từ quen thuộc',
      sub: 'Đoán được ý chính nhưng muốn đọc mượt hơn',
      seedImg: 'assets/levels/level_a1_sprout.svg',
      lumiReply: 'Hay quá! Mình sẽ dệt những từ bạn đã biết vào <b>truyện chêm ngụ ngôn</b> để bạn đọc một mạch không cần tra từ điển!'
    },
    {
      id: 'lv3',
      cefr: 'Nhánh Xanh',
      label: 'Mình nghe hiểu được hội thoại đời thường',
      sub: 'Muốn xem phim, nghe nhạc và đọc truyện dài hơn',
      seedImg: 'assets/levels/level_a2_branch.svg',
      lumiReply: 'Đỉnh luôn! Những chương truyện rừng sâu và <b>trò chơi thử giọng cùng mình</b> sẽ làm bạn mê tít cho xem!'
    },
    {
      id: 'lv4',
      cefr: 'Tán Rộng',
      label: 'Mình đọc & trò chuyện khá thoải mái',
      sub: 'Muốn sưu tầm thêm nhiều cách diễn đạt tinh tế',
      seedImg: 'assets/levels/level_b1_canopy.svg',
      lumiReply: 'Quá xịn! Cùng mình đi săn những <b>cụm từ đẹp như thơ</b> trong kho truyện cổ tích và đời sống nhé!'
    },
    {
      id: 'lv5',
      cefr: 'Cổ Thụ',
      label: 'Mình muốn thưởng thức nguyên tác trọn vẹn',
      sub: 'Đọc tiểu thuyết, ẩn dụ văn học & kể chuyện tự nhiên',
      seedImg: 'assets/levels/level_b2_ancient.svg',
      lumiReply: 'Chào đón người kể chuyện đại tài! Toàn bộ <b>kho tàng cổ thư và thẻ bài bí ẩn</b> đã mở rộng chờ bạn khám phá.'
    }
  ],

  // 4. Entertaining & Cozy Vibe Goals with Rich Scene Artwork (Screens 15–16)
  goals: [
    {
      id: 'story',
      vibeTag: '📖 ĐỌC TRUYỆN & TÔ MÀU',
      label: 'Đọc truyện ngụ ngôn & sưu tầm nhân vật',
      sub: 'Theo chân Billy Possum, vừa đọc truyện chêm vừa mở khóa tranh tô màu',
      sceneImg: '../assets/cards/billy_possum_cover.png',
      reactiveBubble: 'Vừa theo dõi cốt truyện ngụ ngôn kỳ thú vừa tô màu nhân vật — cách ngấm từ vựng tự nhiên nhất!'
    },
    {
      id: 'chill',
      vibeTag: '☕ GÓC THƯ GIÃN',
      label: 'Biến giờ giải lao thành lúc thưởng thức truyện',
      sub: 'Nghe giọng đọc truyền cảm bất cứ khi nào rảnh, học nhẹ tênh như đang nghỉ ngơi',
      sceneImg: '../assets/cards/lumi_rain_coffee_eaves.jpg',
      reactiveBubble: 'Chỉ cần vài phút rảnh rỗi nhâm nhi tách cà phê và lật thẻ — tâm trí thư thái mà từ vựng vẫn vào đầu!'
    },
    {
      id: 'melody',
      vibeTag: '🎵 PHIM ẢNH & GIAI ĐIỆU',
      label: 'Xem phim, nghe nhạc & bắt trend không cần sub',
      sub: 'Hiểu trọn lời bài hát yêu thích và lời thoại phim tự nhiên',
      sceneImg: '../assets/cards/lumi_melody_arena.jpg',
      reactiveBubble: 'Mình sẽ đưa bạn vào Đấu Trường Giai Điệu — nơi từ vựng gắn liền với âm nhạc và cảm xúc!'
    },
    {
      id: 'travel',
      vibeTag: '🚂 XÁCH BALO & PHIÊU LƯU',
      label: 'Đi du lịch tự túc & trò chuyện khắp nơi',
      sub: 'Tự tin gọi món ở quán nhỏ, hỏi đường và kết bạn mới trên mọi hành trình',
      sceneImg: '../assets/cards/lumi_train_station_night.jpg',
      reactiveBubble: 'Chuyến tàu phiêu lưu đã sẵn sàng! Mình sẽ gói ghém những câu giao tiếp thực tế nhất vào balo cho bạn.'
    },
    {
      id: 'collect',
      vibeTag: '✨ SƯU TẦM TỪ ĐẸP',
      label: 'Chụp lại những câu chữ hay tình cờ bắt gặp',
      sub: 'Thấy trang sách, lời thoại hay biển hiệu đẹp là quét ảnh biến thành thẻ ngay',
      sceneImg: '../assets/cards/serendipity.jpg',
      reactiveBubble: 'Chỉ cần giơ máy ảnh lên chụp — mình sẽ biến mọi trang sách bạn yêu thích thành bộ thẻ lung linh!'
    }
  ],

  // 5. Daily Playful Pacing Tiers (Screens 18–20)
  dailyGoals: [
    { minutes: 5, label: '5 phút / ngày', sub: 'Đọc nhanh vài trang truyện lúc rảnh tay', tag: '🌱 Nhẹ nhàng', wordsPerWeek: 35, characterReward: 'Tô màu 1 nhân vật cổ tích' },
    { minutes: 10, label: '10 phút / ngày', sub: 'Trọn vẹn 1 chương truyện ngụ ngôn & lật thẻ', tag: '🍵 Vừa vặn', wordsPerWeek: 70, characterReward: 'Tô màu 2 nhân vật cổ tích' },
    { minutes: 15, label: '15 phút / ngày', sub: 'Đọc truyện, nghe giọng đọc & thử giọng cùng Lumi', tag: '🔥 Cuốn hút', wordsPerWeek: 110, characterReward: 'Tô màu 3 nhân vật & mở Rương Bí Ẩn' },
    { minutes: 20, label: '20 phút / ngày', sub: 'Đắm mình vào thế giới ngụ ngôn & săn thẻ hiếm', tag: '✨ Mê mẩn', wordsPerWeek: 150, characterReward: 'Mở khóa trọn bộ Chương I trong tuần đầu' }
  ],

  // 6. 3-Month Achievement Showcase (Screen 23)
  threeMonthPillars: [
    {
      art: '../assets/cards/billy_possum_cover.png',
      kicker: '📖 TRUYỆN CHÊM & SƯU TẦM NHÂN VẬT',
      title: 'Đọc hết hàng chục câu chuyện ngụ ngôn kỳ thú',
      desc: 'Từ mới được lồng khéo léo vào cốt truyện, đọc tới đâu tự khắc hiểu nghĩa tới đó.'
    },
    {
      art: '../assets/create/ic_create_source_ocr_new.png',
      kicker: '📸 BẮT GẶP TỪ ĐẸP Ở BẤT CỨ ĐÂU',
      title: 'Biến trang sách, lời nhạc & giọng nói thành thẻ nhớ',
      desc: 'Chụp ảnh một trang truyện hoặc câu hát tâm đắc — Lumi tự động tạo thẻ minh họa cho bạn.'
    },
    {
      art: '../assets/cards/lumi_progress_celebration.jpg',
      kicker: '🌿 THẤM TỪ TỰ NHIÊN MỖI NGÀY',
      title: 'Nhớ từ lâu dài không cần cày cuốc căng thẳng',
      desc: 'Chỉ vài phút giải trí lúc rảnh rỗi, từ vựng tự thấm sâu qua từng câu chuyện bạn đọc.'
    }
  ],

  // 7. Starting Point Crossroads (Screen 24)
  startingPaths: [
    {
      id: 'fable_roadmap',
      art: '../assets/cards/billy_possum_cover.png',
      title: 'Đọc ngay Chương I: Khu Rừng Ngụ Ngôn',
      desc: 'Theo chân chú chồn Billy Possum phiêu lưu rừng sâu và mở khóa những từ vựng đầu tiên.',
      recommended: true
    },
    {
      id: 'ai_studio',
      art: '../assets/create/ic_create_source_ocr_new.png',
      title: 'Ghé Góc Sáng Tạo & Tự Làm Bộ Thẻ Riêng',
      desc: 'Chụp ảnh trang sách yêu thích hoặc tự tạo góc sưu tầm từ vựng theo gu của bạn.',
      recommended: false
    }
  ]
};

window.OnboardingData = OnboardingData;
