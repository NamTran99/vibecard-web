// ==========================================================================
// 📚 VIBECARD ONBOARDING DATA — /HUMAN-CRAFTED-UI EDITION
// Show, Don't Tell: Live Bilingual Excerpts, Real Story Quotes, Crisp SVG Flags
// ==========================================================================

const VcFlags = {
  EN: `<svg viewBox="0 0 28 20" width="34" height="24" style="border-radius:5px;display:block;box-shadow:0 0 0 1px rgba(0,0,0,0.08);"><rect width="28" height="20" fill="#012169"/><path d="M0 0L28 20M28 0L0 20" stroke="#FFF" stroke-width="3.2"/><path d="M0 0L28 20M28 0L0 20" stroke="#C8102E" stroke-width="1.6"/><path d="M14 0V20M0 10H28" stroke="#FFF" stroke-width="5.2"/><path d="M14 0V20M0 10H28" stroke="#C8102E" stroke-width="3"/></svg>`,
  JA: `<svg viewBox="0 0 28 20" width="34" height="24" style="border-radius:5px;display:block;box-shadow:0 0 0 1px rgba(0,0,0,0.08);"><rect width="28" height="20" fill="#FFFFFF"/><circle cx="14" cy="10" r="5.6" fill="#BC002D"/></svg>`,
  KO: `<svg viewBox="0 0 28 20" width="34" height="24" style="border-radius:5px;display:block;box-shadow:0 0 0 1px rgba(0,0,0,0.08);"><rect width="28" height="20" fill="#FFFFFF"/><circle cx="14" cy="10" r="5" fill="#CD2E3A"/><path d="M9 10a5 5 0 0 0 10 0 2.5 2.5 0 0 0-5 0 2.5 2.5 0 0 1-5 0z" fill="#0047A0"/><g stroke="#111" stroke-width="1.1"><line x1="6" y1="4.5" x2="8.5" y2="7"/><line x1="22" y1="4.5" x2="19.5" y2="7"/><line x1="6" y1="15.5" x2="8.5" y2="13"/><line x1="22" y1="15.5" x2="19.5" y2="13"/></g></svg>`,
  ZH: `<svg viewBox="0 0 28 20" width="34" height="24" style="border-radius:5px;display:block;box-shadow:0 0 0 1px rgba(0,0,0,0.08);"><rect width="28" height="20" fill="#DE2910"/><polygon points="6,3.2 6.9,5.8 9.6,5.8 7.4,7.4 8.2,10 6,8.4 3.8,10 4.6,7.4 2.4,5.8 5.1,5.8" fill="#FFDE00"/><circle cx="11.5" cy="3.2" r="0.9" fill="#FFDE00"/><circle cx="13.2" cy="5.2" r="0.9" fill="#FFDE00"/><circle cx="13.2" cy="7.8" r="0.9" fill="#FFDE00"/><circle cx="11.5" cy="9.8" r="0.9" fill="#FFDE00"/></svg>`,
  FR: `<svg viewBox="0 0 28 20" width="34" height="24" style="border-radius:5px;display:block;box-shadow:0 0 0 1px rgba(0,0,0,0.08);"><rect width="9.33" height="20" fill="#002395"/><rect x="9.33" width="9.34" height="20" fill="#FFFFFF"/><rect x="18.67" width="9.33" height="20" fill="#ED2939"/></svg>`,
  ES: `<svg viewBox="0 0 28 20" width="34" height="24" style="border-radius:5px;display:block;box-shadow:0 0 0 1px rgba(0,0,0,0.08);"><rect width="28" height="20" fill="#AA151B"/><rect y="5" width="28" height="10" fill="#F1BF00"/></svg>`,
  DE: `<svg viewBox="0 0 28 20" width="34" height="24" style="border-radius:5px;display:block;box-shadow:0 0 0 1px rgba(0,0,0,0.08);"><rect width="28" height="6.67" fill="#111111"/><rect y="6.67" width="28" height="6.67" fill="#DD0000"/><rect y="13.33" width="28" height="6.67" fill="#FFCE00"/></svg>`
};

// 5-Bar Proficiency Signal Graphic (Matches Image 2 Duolingo Level Bars in VibeCard Emerald)
function renderSignalBars(activeBars = 1, totalBars = 5) {
  const heights = [7, 11, 15, 19, 23];
  const barsSvg = heights.slice(0, totalBars).map((h, i) => {
    const x = 2 + i * 6;
    const y = 25 - h;
    const isActive = i < activeBars;
    return `<rect class="sig-bar ${isActive ? 'is-filled' : ''}" x="${x}" y="${y}" width="4.2" height="${h}" rx="2.1" />`;
  }).join('');
  return `<svg class="vc-signal-bars" width="32" height="26" viewBox="0 0 32 26" aria-hidden="true">${barsSvg}</svg>`;
}

// Progressive Clock / Stopwatch Icon with Time-Slice Wedge (5m, 10m, 15m, 20m)
function renderClockIcon(minutes = 10) {
  let sectorSvg = '';
  let arcSvg = '';
  let handX = 19.5;
  let handY = 15;

  if (minutes <= 5) {
    // 1/4 dial (12 o'clock to 3 o'clock)
    sectorSvg = `<path d="M14 15 L14 7.2 A7.8 7.8 0 0 1 21.8 15 Z" fill="rgba(46, 189, 133, 0.24)" />`;
    arcSvg = `<path d="M14 5 A10 10 0 0 1 24 15" fill="none" stroke="#2EBD85" stroke-width="2.2" stroke-linecap="round" />`;
    handX = 19.2;
    handY = 15;
  } else if (minutes <= 10) {
    // 1/2 dial (12 o'clock to 6 o'clock)
    sectorSvg = `<path d="M14 15 L14 7.2 A7.8 7.8 0 0 1 14 22.8 Z" fill="rgba(46, 189, 133, 0.28)" />`;
    arcSvg = `<path d="M14 5 A10 10 0 0 1 14 25" fill="none" stroke="#2EBD85" stroke-width="2.2" stroke-linecap="round" />`;
    handX = 14;
    handY = 20.2;
  } else if (minutes <= 15) {
    // 3/4 dial (12 o'clock to 9 o'clock)
    sectorSvg = `<path d="M14 15 L14 7.2 A7.8 7.8 0 1 1 6.2 15 Z" fill="rgba(46, 189, 133, 0.32)" />`;
    arcSvg = `<path d="M14 5 A10 10 0 1 1 4 15" fill="none" stroke="#2EBD85" stroke-width="2.2" stroke-linecap="round" />`;
    handX = 8.8;
    handY = 15;
  } else {
    // Full dial (20 mins intensive)
    sectorSvg = `<circle cx="14" cy="15" r="7.8" fill="rgba(46, 189, 133, 0.36)" />`;
    arcSvg = `<circle cx="14" cy="15" r="10" fill="none" stroke="#2EBD85" stroke-width="2.2" />`;
    handX = 18.5;
    handY = 11.5;
  }

  return `
    <svg class="vc-clock-icon" width="30" height="30" viewBox="0 0 28 28" aria-hidden="true">
      <path d="M11 2h6M14 2v2.4M20.8 5.8l1.5-1.5" stroke="#2EBD85" stroke-width="2" stroke-linecap="round" />
      <circle cx="14" cy="15" r="10" fill="none" stroke="currentColor" stroke-width="2" opacity="0.22" />
      ${sectorSvg}
      ${arcSvg}
      <line x1="14" y1="15" x2="14" y2="9.4" stroke="#2EBD85" stroke-width="2" stroke-linecap="round" />
      <line x1="14" y1="15" x2="${handX}" y2="${handY}" stroke="#2EBD85" stroke-width="2" stroke-linecap="round" />
      <circle cx="14" cy="15" r="1.8" fill="#2EBD85" />
    </svg>`;
}

window.VcFlags = VcFlags;
window.renderSignalBars = renderSignalBars;
window.renderClockIcon = renderClockIcon;

const OnboardingData = {
  // Phase 2.1: Target Languages (Full-width vertical list like Image 1)
  languages: [
    {
      code: 'EN',
      name: 'Tiếng Anh',
      flagSvg: VcFlags.EN,
      ttsLang: 'en-US'
    },
    {
      code: 'JA',
      name: 'Tiếng Nhật',
      flagSvg: VcFlags.JA,
      ttsLang: 'ja-JP'
    },
    {
      code: 'KO',
      name: 'Tiếng Hàn',
      flagSvg: VcFlags.KO,
      ttsLang: 'ko-KR'
    },
    {
      code: 'ZH',
      name: 'Tiếng Trung',
      flagSvg: VcFlags.ZH,
      ttsLang: 'zh-CN'
    },
    {
      code: 'FR',
      name: 'Tiếng Pháp',
      flagSvg: VcFlags.FR,
      ttsLang: 'fr-FR'
    },
    {
      code: 'ES',
      name: 'Tiếng Tây Ban Nha',
      flagSvg: VcFlags.ES,
      ttsLang: 'es-ES'
    },
    {
      code: 'DE',
      name: 'Tiếng Đức',
      flagSvg: VcFlags.DE,
      ttsLang: 'de-DE'
    }
  ],

  // Story Genre Cards
  genres: [
    {
      id: 'slice_of_life',
      title: 'Đời thường ấm áp',
      sub: 'Quán trà đêm mưa',
      chapterMeta: 'Ch. 01 · 3 phút',
      sceneImg: '../assets/cards/lumi_rain_coffee_eaves.jpg'
    },
    {
      id: 'mystery',
      title: 'Trinh thám bí ẩn',
      sub: 'Chuyến tàu 23:15',
      chapterMeta: 'Ch. 01 · 4 phút',
      sceneImg: '../assets/cards/lumi_train_station_night.jpg'
    },
    {
      id: 'fantasy',
      title: 'Ngụ ngôn cổ tích',
      sub: 'Khu rừng đom đóm',
      chapterMeta: 'Ch. 01 · 3 phút',
      sceneImg: '../assets/cards/billy_possum_cover.png'
    },
    {
      id: 'travel',
      title: 'Du ký lữ hành',
      sub: 'Phố cổ sương mờ',
      chapterMeta: 'Ch. 01 · 5 phút',
      sceneImg: '../assets/cards/lumi_melody_arena.jpg'
    }
  ],

  // Conversational Level Cards with Signal Bars (Matches Image 2 — Zero A1/B1 Codes)
  levels: [
    {
      id: 'lv1',
      bars: 1,
      shortTag: 'Mới bắt đầu',
      getLabel: (langName) => `Mới bắt đầu học ${langName}`
    },
    {
      id: 'lv2',
      bars: 2,
      shortTag: 'Biết từ cơ bản',
      getLabel: () => 'Biết một vài từ thông dụng'
    },
    {
      id: 'lv3',
      bars: 3,
      shortTag: 'Giao tiếp cơ bản',
      getLabel: () => 'Có thể giao tiếp những câu cơ bản'
    },
    {
      id: 'lv4',
      bars: 4,
      shortTag: 'Đa dạng chủ đề',
      getLabel: () => 'Hiểu và nói được nhiều chủ đề khác nhau'
    },
    {
      id: 'lv5',
      bars: 5,
      shortTag: 'Hiểu sâu chi tiết',
      getLabel: () => 'Đọc hiểu sâu hầu hết các chủ đề chi tiết'
    }
  ],

  // Daily Rhythm (Clean visual metrics with signal bars)
  dailyGoals: [
    { minutes: 5, bars: 1, label: '5 phút / ngày', tag: 'Nhẹ nhàng', chapters: '1 cảnh ngắn', cards: '3 thẻ từ' },
    { minutes: 10, bars: 2, label: '10 phút / ngày', tag: 'Đều đặn', chapters: '1 chương', cards: '5 thẻ từ' },
    { minutes: 15, bars: 3, label: '15 phút / ngày', tag: 'Tiến bộ nhanh', chapters: '2 chương', cards: '10 thẻ từ' },
    { minutes: 20, bars: 4, label: '20 phút / ngày', tag: 'Chuyên sâu', chapters: '3 chương', cards: '15 thẻ từ' }
  ],

  // Phase 3 & Phase 4: Interactive Story Excerpt & Contextual Deck
  microStory: {
    chapterBadge: 'Ch. 00 · Quán trà đêm mưa',
    missionPill: 'Chạm từ gạch chân để mở nghĩa',
    sceneImg: '../assets/cards/lumi_rain_coffee_eaves.jpg',
    speakerName: 'Lumi · Tokyo, 21:40',
    audioSentence: 'Finding this cozy tea shop under the rain was pure serendipity, glowing like a warm lantern.',
    viTranslation: 'Tìm thấy quán trà ấm cúng này dưới cơn mưa quả là một cơ duyên tình cờ, tỏa sáng như chiếc đèn lồng ấm áp.',
    words: {
      cozy: {
        id: 'cozy',
        word: 'cozy',
        ipa: '/ˈkəʊ.zi/',
        pos: 'adj.',
        meaning: 'Ấm cúng, dễ chịu và bình yên',
        collocation: 'a cozy little tea shop — một quán trà nhỏ ấm cúng',
        quote: '“Finding this <b>cozy</b> tea shop under the rain...”',
        quoteVi: '“Tìm thấy quán trà ấm cúng này dưới cơn mưa...”',
        art: '../assets/cards/lumi_rain_coffee_eaves.jpg',
        mastery: 12
      },
      serendipity: {
        id: 'serendipity',
        word: 'serendipity',
        ipa: '/ˌser.ənˈdɪp.ə.ti/',
        pos: 'noun',
        meaning: 'Cơ duyên tình cờ mang lại niềm vui bất ngờ',
        collocation: 'pure serendipity — cơ duyên tình cờ tuyệt đẹp',
        quote: '“...under the rain was pure <b>serendipity</b>...”',
        quoteVi: '“...dưới cơn mưa quả là một cơ duyên tình cờ tuyệt đẹp...”',
        art: '../assets/cards/serendipity.jpg',
        mastery: 18
      },
      lantern: {
        id: 'lantern',
        word: 'lantern',
        ipa: '/ˈlæn.tən/',
        pos: 'noun',
        meaning: 'Chiếc đèn lồng thắp sáng trong đêm',
        collocation: 'glowing like a warm lantern — tỏa sáng như đèn lồng ấm',
        quote: '“...glowing like a warm <b>lantern</b>.”',
        quoteVi: '“...tỏa sáng như một chiếc đèn lồng ấm áp.”',
        art: '../assets/cards/lumi_farmer_night.png',
        mastery: 25
      }
    },
    deckOrder: ['serendipity', 'cozy', 'lantern']
  }
};

window.OnboardingData = OnboardingData;
