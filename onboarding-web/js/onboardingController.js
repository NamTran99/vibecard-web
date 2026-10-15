// ==========================================================================
// 🎬 VIBECARD BESPOKE ONBOARDING CONTROLLER (< 300 LINES)
// ==========================================================================

let typewriterTimer = null;
let autoAdvanceTimer = null;

document.addEventListener('DOMContentLoaded', () => {
  initThemeMode();
  renderScreen(0, 'forward');

  // Auto-fade Night Farm Splash Screen (Screen 1 of 24) after 1.15s
  setTimeout(() => {
    const splash = document.getElementById('splashOverlay');
    if (splash) splash.classList.add('is-hidden');
  }, 1150);
});

function initThemeMode() {
  const saved = localStorage.getItem('mindcard-theme-mode') || 'dark';
  applyTheme(saved === 'light' ? 'light' : 'dark');
}

function toggleThemeMode() {
  const isLight = document.documentElement.classList.contains('light');
  const next = isLight ? 'dark' : 'light';
  applyTheme(next);
  try { localStorage.setItem('mindcard-theme-mode', next); } catch (e) {}
  if (window.SoundEffects) SoundEffects.playSelect();
}

function applyTheme(mode) {
  document.documentElement.classList.remove('dark', 'light');
  document.documentElement.classList.add(mode);
  const btn = document.getElementById('themeToggleBtn');
  if (btn) btn.textContent = mode === 'dark' ? '☀️' : '🌙';
}

function clearTimers() {
  if (typewriterTimer) { clearInterval(typewriterTimer); typewriterTimer = null; }
  if (autoAdvanceTimer) { clearTimeout(autoAdvanceTimer); autoAdvanceTimer = null; }
}

function typewriteBubble(elementId, fullHtml, lockCtaWhileTyping = false, onComplete = null) {
  clearTimers();
  const el = document.getElementById(elementId);
  const cta = document.getElementById('primaryCtaBtn');
  if (!el) return;

  const plainText = fullHtml.replace(/<[^>]*>/g, '');
  if (lockCtaWhileTyping && cta) cta.disabled = true;

  let idx = 0;
  el.textContent = '';
  typewriterTimer = setInterval(() => {
    idx += 2;
    if (idx >= plainText.length) {
      clearInterval(typewriterTimer);
      typewriterTimer = null;
      el.innerHTML = fullHtml;
      if (lockCtaWhileTyping && cta) cta.disabled = false;
      if (onComplete) onComplete();
    } else {
      el.textContent = plainText.slice(0, idx);
      if (idx % 4 === 0 && window.SoundEffects) SoundEffects.playTick();
    }
  }, 22);
}

function updateTopBarUI(idx) {
  const meta = OnboardingState.screensMeta[idx];
  const backBtn = document.getElementById('navBackBtn');
  const progWrap = document.getElementById('progressBarWrap');
  const progFill = document.getElementById('progressBarFill');
  const progPct = document.getElementById('progressPercentLabel');
  const stepBadge = document.getElementById('stepInspectorBadge');

  if (backBtn) {
    backBtn.classList.toggle('is-invisible', idx === 0 || idx === 4);
  }
  if (progWrap && progFill) {
    progWrap.classList.toggle('is-hidden', !meta.showProgress);
    progFill.style.width = `${meta.progress}%`;
  }
  if (progPct) {
    progPct.textContent = `${meta.progress}%`;
  }
  if (stepBadge) {
    stepBadge.textContent = `${idx + 1}/${OnboardingState.totalScreens}`;
  }
}

function renderScreen(idx, direction = 'forward') {
  clearTimers();
  OnboardingState.currentScreen = idx;
  updateTopBarUI(idx);

  const viewport = document.getElementById('stageViewport');
  const bottomBar = document.getElementById('bottomCtaBar');
  const primaryBtn = document.getElementById('primaryCtaBtn');
  const secondaryBtn = document.getElementById('secondaryCtaBtn');
  if (!viewport || !primaryBtn || !secondaryBtn || !bottomBar) return;

  viewport.className = `stage-viewport ${direction === 'forward' ? 'anim-step-forward' : 'anim-step-back'}`;
  secondaryBtn.style.display = 'none';
  bottomBar.style.display = 'flex';
  primaryBtn.textContent = 'Tiếp tục hành trình →';
  primaryBtn.disabled = false;

  const langObj = OnboardingState.getSelectedLanguageObj();
  const levelObj = OnboardingState.getSelectedLevelObj();
  const dailyObj = OnboardingState.getSelectedDailyObj();
  const ans = OnboardingState.answers;

  switch (idx) {
    case 0:
      secondaryBtn.style.display = 'block';
      primaryBtn.textContent = 'Bước vào khu rừng VibeCard →';
      viewport.innerHTML = OnboardingTemplates.welcome();
      break;
    case 1:
      viewport.innerHTML = OnboardingTemplates.mascotGreet();
      typewriteBubble('centerBubbleText', 'Xin chào lữ khách! Mình là <b>Thần Rừng Lumi</b> — người giữ đèn của những trang cổ thư ngôn ngữ.', false);
      break;
    case 2:
      viewport.innerHTML = OnboardingTemplates.mascotPitch();
      if (window.SoundEffects) SoundEffects.playFanfare();
      typewriteBubble('centerBubbleText', 'Chỉ <b>7 lời hỏi thăm ngắn</b> trước khi mình mở chương truyện ngụ ngôn đầu tiên dành riêng cho bạn!', true);
      break;
    case 3:
      primaryBtn.disabled = !ans.langCode;
      viewport.innerHTML = OnboardingTemplates.languageSelect(ans.langCode);
      break;
    case 4:
      bottomBar.style.display = 'none';
      viewport.innerHTML = OnboardingTemplates.courseBuilding(langObj);
      autoAdvanceTimer = setTimeout(() => handleNextStep(), 2200);
      break;
    case 5:
      primaryBtn.disabled = !ans.sourceId;
      viewport.innerHTML = OnboardingTemplates.sourceSelect(ans.sourceId);
      break;
    case 6:
      primaryBtn.disabled = !ans.levelId;
      viewport.innerHTML = OnboardingTemplates.levelSelect(langObj, ans.levelId);
      break;
    case 7:
      viewport.innerHTML = OnboardingTemplates.levelResponse(levelObj);
      break;
    case 8: {
      primaryBtn.disabled = !ans.goalId;
      const initBubble = ans.goalId
        ? OnboardingState.getSelectedGoalObj().reactiveBubble
        : `Bạn thích <b>thưởng thức ${langObj.name}</b> theo kiểu thư giãn nào nhất?`;
      viewport.innerHTML = OnboardingTemplates.goalSelect(langObj, ans.goalId, initBubble);
      break;
    }
    case 9:
      viewport.innerHTML = OnboardingTemplates.routineIntro();
      break;
    case 10:
      primaryBtn.textContent = 'Tôi cam kết nhịp độ này ✦';
      primaryBtn.disabled = !ans.dailyMinutes;
      viewport.innerHTML = OnboardingTemplates.dailyGoalSelect(ans.dailyMinutes);
      break;
    case 11:
      viewport.innerHTML = OnboardingTemplates.weeklyImpact(dailyObj);
      if (window.SoundEffects) SoundEffects.playFanfare();
      break;
    case 12:
      viewport.innerHTML = OnboardingTemplates.notificationPrompt(ans.notificationsAllowed);
      break;
    case 13:
      viewport.innerHTML = OnboardingTemplates.threeMonthBenefits();
      break;
    case 14:
      primaryBtn.textContent = 'Mở cổng hành trình ngay ✦';
      viewport.innerHTML = OnboardingTemplates.startPathSelect(ans.startPathId);
      break;
  }
}

// --- Interaction Handlers ---
window.pickLanguage = function (code, flag, name, cardEl) {
  OnboardingState.answers.langCode = code;
  OnboardingState.answers.langFlag = flag;
  OnboardingState.answers.langName = name;
  highlightSelectedCard(cardEl);
  if (window.SoundEffects) SoundEffects.playSelect();
};

window.pickSingleOption = function (key, val, cardEl) {
  OnboardingState.answers[key] = val;
  highlightSelectedCard(cardEl);
  if (window.SoundEffects) SoundEffects.playSelect();
};

window.pickDailyGoal = function (mins, cardEl) {
  OnboardingState.answers.dailyMinutes = mins;
  highlightSelectedCard(cardEl);
  if (window.SoundEffects) SoundEffects.playSelect();
};

window.pickGoalWithReactiveBubble = function (goalId, cardEl) {
  OnboardingState.answers.goalId = goalId;
  highlightSelectedCard(cardEl);
  if (window.SoundEffects) SoundEffects.playSelect();

  const goalObj = OnboardingData.goals.find(g => g.id === goalId);
  const bubbleEl = document.getElementById('reactiveGoalBubble');
  const mascotImg = document.getElementById('goalMascotImg');
  if (goalObj && bubbleEl) {
    bubbleEl.classList.remove('anim-bubble-pop');
    void bubbleEl.offsetWidth;
    bubbleEl.classList.add('anim-bubble-pop');
    bubbleEl.textContent = goalObj.reactiveBubble;
  }
  if (mascotImg) {
    mascotImg.classList.remove('anim-mascot-hop');
    void mascotImg.offsetWidth;
    mascotImg.classList.add('anim-mascot-hop');
  }
};

window.pickNotificationPermission = function (allowed) {
  OnboardingState.answers.notificationsAllowed = allowed;
  if (window.SoundEffects) SoundEffects.playSelect();
  setTimeout(() => handleNextStep(), 240);
};

function highlightSelectedCard(cardEl) {
  const parent = cardEl.parentElement;
  if (parent) {
    parent.querySelectorAll('.tactile-option-card, .lang-bento-card, .crossroads-card').forEach(c => c.classList.remove('is-selected'));
  }
  cardEl.classList.add('is-selected');
  const primaryBtn = document.getElementById('primaryCtaBtn');
  if (primaryBtn) primaryBtn.disabled = false;
}

window.handleNextStep = function () {
  const cur = OnboardingState.currentScreen;
  if (cur < OnboardingState.totalScreens - 1) {
    if (window.SoundEffects) SoundEffects.playContinue();
    renderScreen(cur + 1, 'forward');
  } else {
    if (window.SoundEffects) SoundEffects.playFanfare();
    OnboardingState.syncToAppStorage();
    window.location.href = '../index.html';
  }
};

window.handlePrevStep = function () {
  const cur = OnboardingState.currentScreen;
  if (cur <= 0) return;
  if (window.SoundEffects) SoundEffects.playSelect();
  const target = cur === 5 ? 3 : cur - 1;
  renderScreen(target, 'back');
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
