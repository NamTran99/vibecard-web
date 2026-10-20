// ==========================================================================
// 🧠 ONBOARDING REACTIVE STATE — /HUMAN-CRAFTED-UI EDITION
// ==========================================================================

const OnboardingState = {
  currentScreen: 0, // 0..9 (10 screens)
  totalScreens: 10,
  heroWordId: 'serendipity',

  // Interleaved Flow: Intro -> Questions -> Course Building 1 -> Feature 1 -> Question -> Feature 2 -> Question -> Course Building 2 -> Final Ready
  screensMeta: [
    { id: 'welcome', title: '1. Giới thiệu ứng dụng', progress: 10, showProgress: true },
    { id: 'pick_lang', title: '2. Hỏi ngôn ngữ muốn học', progress: 22, showProgress: true },
    { id: 'pick_level', title: '3. Hỏi mức độ thông thạo', progress: 35, showProgress: true },
    { id: 'loading_step_1', title: '4. Đang xây dựng lộ trình (Chặng 1)', progress: 42, showProgress: false },
    { id: 'story_demo', title: '5. Tính năng: Đọc truyện & Chạm từ', progress: 52, showProgress: true },
    { id: 'pick_genre', title: '6. Hỏi thể loại truyện yêu thích', progress: 65, showProgress: true },
    { id: 'flashcard_recall', title: '7. Tính năng: Thẻ nhớ ngữ cảnh 3D', progress: 78, showProgress: true },
    { id: 'pick_daily', title: '8. Hỏi mục tiêu đọc mỗi ngày', progress: 88, showProgress: true },
    { id: 'loading_step_2', title: '9. Đang cập nhật hồ sơ (Chặng 2)', progress: 94, showProgress: false },
    { id: 'deferred_signup', title: '10. Hoàn tất lộ trình', progress: 100, showProgress: true }
  ],

  // Conversational Profiling Answers
  answers: {
    langCode: 'EN',
    langFlag: '🇬🇧',
    langName: 'Tiếng Anh',
    genreId: 'slice_of_life',
    levelId: 'lv2',
    dailyMinutes: 10,
    cardTheme: 'cream',
    notificationsAllowed: true,
    widgetAdded: false,
    reminderTime: '20:30',
    authMethod: null
  },

  // Phase 3: Interactive Story Reader State (Single 3D Flippable Story/Word Card)
  storyState: {
    activeWordId: 'serendipity',
    isFlipped: false,
    justFlipped: false,
    coachmarkDismissed: false,
    tappedWords: ['serendipity']
  },

  // Phase 4: 1-Tap Recall State
  flashcardState: {
    cardIndex: 0,
    isFlipped: false,
    knowCount: 1,
    learningCount: 0,
    history: [],
    starredIds: ['serendipity'],
    autoPlayAudio: true,
    voiceStatus: 'idle',
    swipeAnim: ''
  },

  getSelectedLanguageObj() {
    const code = this.answers.langCode || 'EN';
    return OnboardingData.languages.find(l => l.code === code) || OnboardingData.languages[0];
  },

  getSelectedGenreObj() {
    const id = this.answers.genreId || 'slice_of_life';
    return OnboardingData.genres.find(g => g.id === id) || OnboardingData.genres[1];
  },

  getSelectedLevelObj() {
    const id = this.answers.levelId || 'lv2';
    return OnboardingData.levels.find(l => l.id === id) || OnboardingData.levels[1];
  },

  getSelectedDailyObj() {
    const mins = this.answers.dailyMinutes || 10;
    return OnboardingData.dailyGoals.find(d => d.minutes === mins) || OnboardingData.dailyGoals[1];
  },

  getCurrentDeckCard() {
    const order = OnboardingData.microStory.deckOrder;
    const idx = Math.min(this.flashcardState.cardIndex, order.length - 1);
    const wordId = order[idx];
    return OnboardingData.microStory.words[wordId];
  },

  syncToAppStorage(authProvider = 'guest') {
    try {
      const langObj = this.getSelectedLanguageObj();
      this.answers.authMethod = authProvider;
      localStorage.setItem('mindcard-target-lang', langObj.code);
      localStorage.setItem('mindcard-target-flag', langObj.flag);
      localStorage.setItem('vibecard-onboarding-completed', 'true');
      localStorage.setItem('vibecard-onboarding-profile', JSON.stringify({
        ...this.answers,
        masteredWords: OnboardingData.microStory.deckOrder,
        knowCount: this.flashcardState.knowCount,
        completedAt: new Date().toISOString()
      }));
    } catch (e) {}
  }
};

window.OnboardingState = OnboardingState;
