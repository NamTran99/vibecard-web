// ==========================================================================
// 🧠 ONBOARDING REACTIVE STATE & MAIN APP STORAGE SYNC
// ==========================================================================

const OnboardingState = {
  currentScreen: 0, // 0..14 (15 interactive screens after Splash)
  totalScreens: 15,

  // Screen metadata for progress bar & step inspector
  // Progress bar only appears from Screen 3 (Language Selection) onwards, just like Mobbin Screen 6..24
  screensMeta: [
    { id: 'welcome', title: '1. Welcome Entry (Screen 2/24)', progress: 0, showProgress: false },
    { id: 'intro_hi', title: '2. Lumi Chào Hỏi (Screen 3/24)', progress: 0, showProgress: false },
    { id: 'intro_7q', title: '3. 7 Câu Hỏi Nhanh (Screen 4-5/24)', progress: 0, showProgress: false },
    { id: 'pick_lang', title: '4. Chọn Ngôn Ngữ (Screen 6-8/24)', progress: 12, showProgress: true },
    { id: 'building', title: '5. Đang Dựng Lộ Trình (Screen 9/24)', progress: 20, showProgress: false },
    { id: 'pick_source', title: '6. Nguồn Biết App (Screen 10-11/24)', progress: 26, showProgress: true },
    { id: 'pick_level', title: '7. Trình Độ Hiện Tại (Screen 12-13/24)', progress: 38, showProgress: true },
    { id: 'ack_level', title: '8. Lumi Phản Hồi Trình Độ (Screen 14/24)', progress: 44, showProgress: true },
    { id: 'pick_goal', title: '9. Lý Do Học Tập (Screen 15-16/24)', progress: 52, showProgress: true },
    { id: 'intro_routine', title: '10. Thiết Lập Thói Quen (Screen 17/24)', progress: 60, showProgress: true },
    { id: 'pick_daily', title: '11. Mục Tiêu Mỗi Ngày (Screen 18-19/24)', progress: 68, showProgress: true },
    { id: 'reward_week1', title: '12. Thành Quả Tuần Đầu (Screen 20/24)', progress: 74, showProgress: true },
    { id: 'notif_prime', title: '13. Bật Nhắc Nhở Ôn Tập (Screen 21-22/24)', progress: 82, showProgress: true },
    { id: 'achieve_3m', title: '14. Thành Tựu 3 Tháng (Screen 23/24)', progress: 90, showProgress: true },
    { id: 'pick_start', title: '15. Chọn Điểm Khởi Đầu (Screen 24/24)', progress: 97, showProgress: true }
  ],

  // User selections (Start null on question screens so button starts disabled like Mobbin!)
  answers: {
    langCode: null,
    langFlag: '🇺🇸',
    langName: 'Tiếng Anh',
    sourceId: null,
    levelId: null,
    goalId: null,
    dailyMinutes: null,
    notificationsAllowed: null,
    startPathId: 'fable_roadmap'
  },

  getSelectedLanguageObj() {
    const code = this.answers.langCode || 'EN';
    return OnboardingData.languages.find(l => l.code === code) || OnboardingData.languages[0];
  },

  getSelectedLevelObj() {
    const id = this.answers.levelId || 'lv1';
    return OnboardingData.levels.find(l => l.id === id) || OnboardingData.levels[0];
  },

  getSelectedGoalObj() {
    const id = this.answers.goalId || 'story';
    return OnboardingData.goals.find(g => g.id === id) || OnboardingData.goals[0];
  },

  getSelectedDailyObj() {
    const mins = this.answers.dailyMinutes || 10;
    return OnboardingData.dailyGoals.find(d => d.minutes === mins) || OnboardingData.dailyGoals[1];
  },

  // Sync user onboarding profile with main app's localStorage keys
  syncToAppStorage() {
    try {
      const langObj = this.getSelectedLanguageObj();
      localStorage.setItem('mindcard-target-lang', langObj.code);
      localStorage.setItem('mindcard-target-flag', langObj.flag);
      localStorage.setItem('vibecard-onboarding-completed', 'true');
      localStorage.setItem('vibecard-onboarding-profile', JSON.stringify({
        ...this.answers,
        completedAt: new Date().toISOString()
      }));
    } catch (e) {}
  }
};

window.OnboardingState = OnboardingState;
