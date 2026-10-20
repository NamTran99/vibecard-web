// ==========================================================================
// 🎬 VIBECARD 6-PHASE ONBOARDING CONTROLLER (< 300 LINES)
// ==========================================================================

let typewriterTimer = null;
let voiceSimTimer = null;
let heroCycleTimer = null;
let laborTimers = [];

document.addEventListener('DOMContentLoaded', () => {
  initThemeMode();
  renderScreen(0, 'forward');

  // Keyboard ergonomics (Space to flip, Arrows to swipe/navigate, Enter to advance)
  document.addEventListener('keydown', (e) => {
    if (e.target && ['INPUT', 'TEXTAREA', 'SELECT'].includes(e.target.tagName)) return;
    const curMeta = OnboardingState.screensMeta[OnboardingState.currentScreen];
    if (curMeta && curMeta.id === 'flashcard_recall') {
      if (e.code === 'Space') { e.preventDefault(); window.flipOnboardingCard(); return; }
      if (e.code === 'ArrowLeft') { e.preventDefault(); window.swipeOnboardingCard('left'); return; }
      if (e.code === 'ArrowRight') { e.preventDefault(); window.swipeOnboardingCard('right'); return; }
    }
    if (e.code === 'Enter') {
      e.preventDefault();
      window.handleNextStep();
    }
  });

  // Auto-fade Splash Screen after 850ms
  setTimeout(() => {
    const splash = document.getElementById('splashOverlay');
    if (splash) splash.classList.add('is-hidden');
  }, 850);
});

function initThemeMode() {
  const saved = localStorage.getItem('mindcard-theme-mode-v2') || 'light';
  applyTheme(saved === 'dark' ? 'dark' : 'light');
}

function toggleThemeMode() {
  const isLight = document.documentElement.classList.contains('light');
  const next = isLight ? 'dark' : 'light';
  applyTheme(next);
  try { localStorage.setItem('mindcard-theme-mode-v2', next); } catch (e) {}
  if (window.SoundEffects) SoundEffects.playSelect();
}

function applyTheme(mode) {
  document.documentElement.classList.remove('dark', 'light');
  document.documentElement.classList.add(mode);
  const btn = document.getElementById('themeToggleBtn');
  if (btn && window.VcIcons) {
    btn.innerHTML = mode === 'dark' ? VcIcons.sun(16) : VcIcons.moon(16);
  }
}

function clearTimers() {
  if (typewriterTimer) { clearInterval(typewriterTimer); typewriterTimer = null; }
  if (voiceSimTimer) { clearTimeout(voiceSimTimer); voiceSimTimer = null; }
  if (heroCycleTimer) { clearInterval(heroCycleTimer); heroCycleTimer = null; }
  if (laborTimers.length) {
    laborTimers.forEach(t => clearTimeout(t));
    laborTimers = [];
  }
}

function updateHeroWordDOM(wordId) {
  OnboardingState.heroWordId = wordId;
  const wObj = OnboardingData.microStory.words[wordId];
  if (!wObj) return;
  document.querySelectorAll('.hero-live-word').forEach(el => {
    el.classList.toggle('is-active', el.textContent.trim() === wordId);
  });
  const pop = document.getElementById('heroLivePopover');
  const wEl = document.getElementById('heroFcWord');
  const ipaEl = document.getElementById('heroFcIpa');
  const meanEl = document.getElementById('heroFcMeaning');
  const colEl = document.getElementById('heroFcColloc');
  if (wEl) wEl.textContent = wObj.word;
  if (ipaEl) ipaEl.textContent = wObj.ipa;
  if (meanEl) meanEl.textContent = `${wObj.pos} · ${wObj.meaning}`;
  if (colEl) colEl.textContent = wObj.collocation;
  if (pop) {
    pop.onclick = () => window.speakText(wObj.word);
    pop.classList.remove('anim-popover-morph');
    void pop.offsetWidth;
    pop.classList.add('anim-popover-morph');
  }
}

// Native TTS + Web Audio synth fallback
window.speakText = function (text) {
  if (window.SoundEffects) SoundEffects.playSelect();
  if ('speechSynthesis' in window) {
    try {
      window.speechSynthesis.cancel();
      const utter = new SpeechSynthesisUtterance(text);
      const langObj = OnboardingState.getSelectedLanguageObj();
      utter.lang = text.includes('serendipity') || text.includes('cozy') || text.includes('lantern')
        ? 'en-US'
        : (langObj.ttsLang || 'en-US');
      utter.rate = 0.94;
      window.speechSynthesis.speak(utter);
    } catch (e) {}
  }
};

function updateTopBarUI(idx) {
  const meta = OnboardingState.screensMeta[idx];
  const backBtn = document.getElementById('navBackBtn');
  const progWrap = document.getElementById('progressBarWrap');
  const progFill = document.getElementById('progressBarFill');
  const isInterstitial = meta && !meta.showProgress;

  if (backBtn) backBtn.classList.toggle('is-invisible', idx === 0 || isInterstitial);
  if (progWrap && progFill && meta) {
    progWrap.classList.toggle('is-hidden', !meta.showProgress);
    progFill.style.width = `${meta.progress}%`;
  }
}

// Auto-advance Duolingo-style "COURSE BUILDING..." interstitial after 5s (no early skip)
function scheduleCourseBuildingAdvance() {
  laborTimers.push(setTimeout(() => {
    const cur = OnboardingState.currentScreen;
    const curId = OnboardingState.screensMeta[cur]?.id;
    if (curId === 'loading_step_1' || curId === 'loading_step_2') {
      if (window.SoundEffects) SoundEffects.playContinue();
      renderScreen(cur + 1, 'forward');
    }
  }, 5000));
}

// Animation #5: Final Sequential 3-State Plan-Builder Checklist (No % numbers)
function runLaborChecklistAnimation() {
  const r1 = document.getElementById('laborRow1');
  const i1 = document.getElementById('laborIcon1');
  const r2 = document.getElementById('laborRow2');
  const i2 = document.getElementById('laborIcon2');

  laborTimers.push(setTimeout(() => {
    if (r1) { r1.className = 'labor-row is-completed'; }
    if (i1 && window.VcIcons) { i1.innerHTML = VcIcons.check(11); }
    if (r2) { r2.className = 'labor-row is-processing'; }
  }, 600));

  laborTimers.push(setTimeout(() => {
    if (r2) { r2.className = 'labor-row is-completed'; }
    if (i2 && window.VcIcons) { i2.innerHTML = VcIcons.check(11); }
  }, 1250));
}

// Animation #3: Interactive Pointer/Touch Drag Tilt Physics on Flashcard
function bindFlashcardDragPhysics() {
  const cardEl = document.getElementById('activeOnboardingCard');
  if (!cardEl) return;
  let startX = null;
  let currentDx = 0;

  cardEl.addEventListener('pointerdown', (e) => {
    if (e.target.closest('button')) return;
    startX = e.clientX;
    currentDx = 0;
  });

  cardEl.addEventListener('pointermove', (e) => {
    if (startX === null) return;
    currentDx = e.clientX - startX;
    if (Math.abs(currentDx) > 8) {
      const deg = Math.max(-12, Math.min(12, currentDx * 0.06));
      cardEl.style.transform = `translate3d(${currentDx * 0.55}px, 0, 0) rotate(${deg}deg)`;
      cardEl.classList.toggle('is-dragging-right', currentDx > 36);
      cardEl.classList.toggle('is-dragging-left', currentDx < -36);
    }
  });

  const endDrag = () => {
    if (startX === null) return;
    const dx = currentDx;
    startX = null;
    currentDx = 0;
    cardEl.style.transform = '';
    cardEl.classList.remove('is-dragging-right', 'is-dragging-left');
    if (dx > 68) {
      window.swipeOnboardingCard('right');
    } else if (dx < -68) {
      window.swipeOnboardingCard('left');
    }
  };

  cardEl.addEventListener('pointerup', endDrag);
  cardEl.addEventListener('pointercancel', endDrag);
}

function renderScreen(idx, direction = 'forward', skipAnim = false) {
  clearTimers();
  OnboardingState.currentScreen = idx;
  if (!skipAnim) updateTopBarUI(idx);

  const viewport = document.getElementById('stageViewport');
  const bottomBar = document.getElementById('bottomCtaBar');
  const primaryBtn = document.getElementById('primaryCtaBtn');
  const secondaryBtn = document.getElementById('secondaryCtaBtn');
  if (!viewport || !primaryBtn || !secondaryBtn || !bottomBar) return;

  if (!skipAnim) {
    viewport.className = `stage-viewport ${direction === 'forward' ? 'anim-step-forward' : 'anim-step-back'}`;
  }
  secondaryBtn.style.display = 'none';
  secondaryBtn.textContent = 'Tôi đã có tài khoản học viên';
  secondaryBtn.onclick = () => {
    try { sessionStorage.setItem('vibecard-skip-wakeup', 'true'); } catch (e) {}
    window.location.href = '../index.html?from=onboarding';
  };
  bottomBar.style.display = 'flex';
  primaryBtn.disabled = false;

  const langObj = OnboardingState.getSelectedLanguageObj();
  const ans = OnboardingState.answers;
  const stepId = OnboardingState.screensMeta[idx]?.id || 'welcome';

  switch (stepId) {
    case 'welcome': { // Screen 1: Visual Hook Welcome
      secondaryBtn.style.display = 'block';
      primaryBtn.textContent = 'Bắt đầu ngay';
      viewport.innerHTML = OnboardingTemplates.welcome();
      const order = OnboardingData.microStory.deckOrder;
      heroCycleTimer = setInterval(() => {
        const curIdx = order.indexOf(OnboardingState.heroWordId || 'serendipity');
        const nextWord = order[(curIdx + 1) % order.length];
        updateHeroWordDOM(nextWord);
      }, 2800);
      break;
    }

    case 'pick_lang': // Question 1: Language Selection (Image 1 Style)
      primaryBtn.textContent = 'Tiếp tục';
      primaryBtn.disabled = !ans.langCode;
      viewport.innerHTML = OnboardingTemplates.languageSelect(ans.langCode);
      break;

    case 'pick_level': // Question 2: Language Level with Signal Bars (Image 2 Style)
      primaryBtn.textContent = 'Tiếp tục';
      viewport.innerHTML = OnboardingTemplates.levelSelect(langObj, ans.levelId);
      break;

    case 'loading_step_1': // Interleaved Course Building Screen 1 (Duolingo Style — Zero %)
      bottomBar.style.display = 'none';
      viewport.innerHTML = OnboardingTemplates.loadingStep1();
      scheduleCourseBuildingAdvance();
      break;

    case 'story_demo': // Feature Showcase 1: Interactive Story Excerpt
      primaryBtn.textContent = 'Tiếp tục';
      viewport.innerHTML = OnboardingInteractiveDemo.renderStoryDemo();
      break;

    case 'pick_genre': // Question 3: Story Genres Tab
      primaryBtn.textContent = 'Tiếp tục';
      viewport.innerHTML = OnboardingTemplates.genreSelect(ans.genreId);
      break;

    case 'flashcard_recall': { // Feature Showcase 2: 3D Contextual Flashcard
      const fc = OnboardingState.flashcardState;
      const order = OnboardingData.microStory.deckOrder;
      primaryBtn.textContent = fc.cardIndex < order.length - 1
        ? `Thẻ tiếp theo (${fc.cardIndex + 2}/${order.length})`
        : 'Tiếp tục';
      viewport.innerHTML = OnboardingInteractiveDemo.renderFlashcardRecall();
      bindFlashcardDragPhysics();
      if (fc.autoPlayAudio && !skipAnim) {
        const curCard = OnboardingState.getCurrentDeckCard();
        setTimeout(() => window.speakText(curCard.word), 220);
      }
      break;
    }

    case 'pick_daily': // Question 4: Daily Time Commitment
      primaryBtn.textContent = 'Tiếp tục';
      viewport.innerHTML = OnboardingTemplates.dailyGoalSelect(ans.dailyMinutes);
      break;

    case 'loading_step_2': // Interleaved Course Building Screen 2 (Duolingo Style — Zero %)
      bottomBar.style.display = 'none';
      viewport.innerHTML = OnboardingTemplates.loadingStep2();
      scheduleCourseBuildingAdvance();
      break;

    case 'deferred_signup': { // Final Screen: Save Setup & Enter App Flow
      const curPlan = ans.planTier || 'plus';
      primaryBtn.textContent = curPlan === 'plus'
        ? 'Mở tủ sách (Dùng thử Plus 0đ)'
        : 'Mở tủ sách ngay (Bản miễn phí)';
      viewport.innerHTML = OnboardingTemplates.deferredSignup();
      if (!skipAnim && window.SoundEffects) SoundEffects.playFanfare();
      runLaborChecklistAnimation();
      break;
    }
  }
}

// --- Interactive Artifact & Question Handlers ---
window.previewHeroWord = function (wordId, evt) {
  if (evt) evt.stopPropagation();
  if (heroCycleTimer) { clearInterval(heroCycleTimer); heroCycleTimer = null; }
  updateHeroWordDOM(wordId);
  window.speakText(wordId);
};

window.pickLanguage = function (code, flag, name, cardEl) {
  OnboardingState.answers.langCode = code;
  OnboardingState.answers.langFlag = flag;
  OnboardingState.answers.langName = name;
  highlightSelectedCard(cardEl, '.duo-option-card');
  if (window.SoundEffects) SoundEffects.playSelect();
};

window.pickGenreWithReactiveBubble = function (genreId, cardEl) {
  OnboardingState.answers.genreId = genreId;
  highlightSelectedCard(cardEl, '.genre-bento-card');
  const curGenre = OnboardingState.getSelectedGenreObj();
  const thumbEl = document.getElementById('genreShowcaseThumb');
  const metaEl = document.getElementById('genreShowcaseMeta');
  const titleEl = document.getElementById('genreShowcaseTitle');
  if (thumbEl) thumbEl.src = curGenre.sceneImg;
  if (metaEl) metaEl.textContent = `${curGenre.chapterMeta} · ĐÃ MỞ SẴN CHƯƠNG 0`;
  if (titleEl) titleEl.textContent = `${curGenre.title} — ${curGenre.sub}`;
  if (window.SoundEffects) SoundEffects.playSelect();
};

window.pickLevelPill = function (levelId, cardEl) {
  OnboardingState.answers.levelId = levelId;
  highlightSelectedCard(cardEl, '.duo-option-card');
  if (window.SoundEffects) SoundEffects.playSelect();
};

window.pickDailyGoal = function (mins, cardEl) {
  OnboardingState.answers.dailyMinutes = mins;
  highlightSelectedCard(cardEl, '.tactile-option-card');
  const badgeEl = document.getElementById('dailyGoalSummaryBadge');
  if (badgeEl) badgeEl.textContent = `${mins} phút / ngày`;
  if (window.SoundEffects) SoundEffects.playSelect();
};

window.tapStoryTargetWord = function (wordId, evt) {
  if (evt) evt.stopPropagation();
  const st = OnboardingState.storyState;
  st.activeWordId = wordId;
  st.coachmarkDismissed = true;
  if (!st.tappedWords.includes(wordId)) st.tappedWords.push(wordId);
  st.isFlipped = true;
  st.justFlipped = true;
  if (window.SoundEffects) SoundEffects.playSelect();
  window.speakText(wordId);
  renderScreen(OnboardingState.currentScreen, 'forward', true);
};

window.flipStoryDemoCard = function (evt) {
  if (evt && evt.target && evt.target.closest('button')) return;
  const st = OnboardingState.storyState;
  st.isFlipped = !st.isFlipped;
  st.justFlipped = true;
  st.coachmarkDismissed = true;
  if (window.SoundEffects) SoundEffects.playSelect();
  if (st.isFlipped && st.activeWordId) {
    window.speakText(st.activeWordId);
  }
  renderScreen(OnboardingState.currentScreen, 'forward', true);
};

window.flipOnboardingCard = function () {
  const fc = OnboardingState.flashcardState;
  fc.isFlipped = !fc.isFlipped;
  fc.justFlipped = true;
  fc.justPromoted = false;
  if (window.SoundEffects) SoundEffects.playSelect();
  renderScreen(OnboardingState.currentScreen, 'forward', true);
};

window.selectOnboardingCardIndex = function (idx) {
  const fc = OnboardingState.flashcardState;
  const order = OnboardingData.microStory.deckOrder;
  const clamped = Math.max(0, Math.min(order.length - 1, idx));
  fc.cardIndex = clamped;
  fc.isFlipped = false;
  fc.justFlipped = false;
  fc.justPromoted = true;
  if (window.SoundEffects) SoundEffects.playSelect();
  renderScreen(OnboardingState.currentScreen, 'forward', true);
  if (fc.autoPlayAudio) window.speakText(OnboardingState.getCurrentDeckCard().word);
};

window.swipeOnboardingCard = function (dir) {
  const fc = OnboardingState.flashcardState;
  const order = OnboardingData.microStory.deckOrder;
  if (dir === 'left' && fc.cardIndex > 0) {
    window.selectOnboardingCardIndex(fc.cardIndex - 1);
    return;
  }
  if (fc.cardIndex < order.length - 1) {
    window.selectOnboardingCardIndex(fc.cardIndex + 1);
  } else {
    renderScreen(OnboardingState.currentScreen + 1, 'forward');
  }
};

window.pickCardTheme = function (themeId) {
  OnboardingState.answers.cardTheme = themeId;
  const surfaceMap = { cream: '#F3EFE6', sage: '#E6F2F0', coral: '#F9ECE8' };
  if (document.documentElement.classList.contains('light') && surfaceMap[themeId]) {
    document.documentElement.style.setProperty('--m3-surface', surfaceMap[themeId]);
  }
  if (window.SoundEffects) SoundEffects.playSelect();
  renderScreen(OnboardingState.currentScreen, 'forward', true);
};

window.toggleHomeWidget = function () {
  OnboardingState.answers.widgetAdded = !OnboardingState.answers.widgetAdded;
  if (window.SoundEffects) SoundEffects.playFanfare();
  renderScreen(OnboardingState.currentScreen, 'forward', true);
};

window.toggleReminderPermission = function () {
  OnboardingState.answers.notificationsAllowed = !OnboardingState.answers.notificationsAllowed;
  if (window.SoundEffects) SoundEffects.playSelect();
  renderScreen(OnboardingState.currentScreen, 'forward', true);
};

window.selectOnboardingPlanTier = function (tier, cardEl) {
  OnboardingState.answers.planTier = tier;
  highlightSelectedCard(cardEl, '.energy-tier-option');
  const primaryBtn = document.getElementById('primaryCtaBtn');
  if (primaryBtn) {
    primaryBtn.textContent = tier === 'plus'
      ? 'Mở tủ sách (Dùng thử Plus 0đ)'
      : 'Mở tủ sách ngay (Bản miễn phí)';
  }
  if (window.SoundEffects) SoundEffects.playSelect();
};

window.completeOnboardingWithAuth = function (provider) {
  if (window.SoundEffects) SoundEffects.playFanfare();
  OnboardingState.syncToAppStorage(provider);
  try { sessionStorage.setItem('vibecard-skip-wakeup', 'true'); } catch (e) {}
  window.location.href = '../index.html?from=onboarding';
};

function highlightSelectedCard(cardEl, selector) {
  const parent = cardEl.parentElement;
  if (parent) {
    parent.querySelectorAll(selector).forEach(c => c.classList.remove('is-selected'));
  }
  cardEl.classList.add('is-selected');
  const primaryBtn = document.getElementById('primaryCtaBtn');
  if (primaryBtn) primaryBtn.disabled = false;
}

window.handleNextStep = function () {
  const cur = OnboardingState.currentScreen;
  const curId = OnboardingState.screensMeta[cur]?.id;
  if (curId === 'flashcard_recall') {
    const fc = OnboardingState.flashcardState;
    const order = OnboardingData.microStory.deckOrder;
    if (fc.cardIndex < order.length - 1) {
      window.selectOnboardingCardIndex(fc.cardIndex + 1);
      return;
    }
  }
  if (cur < OnboardingState.totalScreens - 1) {
    if (window.SoundEffects) SoundEffects.playContinue();
    renderScreen(cur + 1, 'forward');
  } else {
    completeOnboardingWithAuth('enter_flow');
  }
};

window.handlePrevStep = function () {
  const cur = OnboardingState.currentScreen;
  if (cur <= 0) return;
  if (window.SoundEffects) SoundEffects.playSelect();
  const prevId = OnboardingState.screensMeta[cur - 1]?.id;
  if ((prevId === 'loading_step_1' || prevId === 'loading_step_2') && cur - 2 >= 0) {
    renderScreen(cur - 2, 'back');
    return;
  }
  renderScreen(cur - 1, 'back');
};

window.openQuickStepJumper = function () {
  const sheet = document.getElementById('stepJumperModal');
  const list = document.getElementById('stepJumperList');
  if (!sheet || !list) return;
  list.innerHTML = OnboardingState.screensMeta.map((m, i) => `
    <button type="button"
            onclick="jumpToStep(${i})"
            style="width:100%;text-align:left;padding:10px 14px;border-radius:14px;border:1px solid var(--m3-outline-variant);background:${i === OnboardingState.currentScreen ? 'var(--vc-selected-bg)' : 'var(--m3-surface-container)'};color:var(--m3-on-surface);font-size:13px;font-weight:700;cursor:pointer;">
      ${m.title}
    </button>
  `).join('');
  sheet.style.display = 'flex';
};

window.closeQuickStepJumper = function () {
  const sheet = document.getElementById('stepJumperModal');
  if (sheet) sheet.style.display = 'none';
};

window.jumpToStep = function (i) {
  closeQuickStepJumper();
  renderScreen(i, 'forward');
};
