// ==========================================================================
// 🎨 VIBECARD ONBOARDING TEMPLATES — STORYBOOK & ENTERTAINMENT EDITION
// ==========================================================================

const OnboardingTemplates = {
  // Helper: Cozy Lumi Storyteller Header
  whisperHeader(textHtml, textId = 'sideBubbleText', avatarSrc = '../assets/cards/lumi_farmer_night.png', imgId = '') {
    return `
      <div class="lumi-whisper-header">
        <div class="lumi-lantern-avatar">
          <img ${imgId ? `id="${imgId}"` : ''} src="${avatarSrc}" alt="Lumi" />
        </div>
        <div class="lumi-whisper-body">
          <div class="lumi-whisper-kicker">
            <span>✦</span><span>CÁO NHỎ LUMI</span>
          </div>
          <div id="${textId}" class="lumi-whisper-text">${textHtml}</div>
        </div>
      </div>`;
  },

  // Screen 2 of 24: Welcome Screen
  welcome() {
    return `
      <div class="welcome-stage">
        <div class="welcome-scenery-frame">
          <img class="welcome-scenery-bg" src="../assets/cards/pixar_night_farm_scenery.jpg" alt="VibeCard Fairytale World" />
          <div class="welcome-scenery-scrim"></div>
          <div class="welcome-badge-floating">✦ THẾ GIỚI TRUYỆN NGỤ NGÔN & TỪ VỰNG</div>
          <span class="firefly-dot" style="top:28%;left:22%;"></span>
          <span class="firefly-dot" style="top:46%;left:54%;animation-delay:0.8s;"></span>
          <span class="firefly-dot" style="top:22%;right:24%;animation-delay:1.5s;"></span>
          <div class="welcome-lumi-lantern anim-mascot-float">
            <img src="../assets/cards/lumi_farmer_night.png" alt="Lumi Mascot" />
          </div>
        </div>
        <div class="welcome-editorial-copy">
          <div class="welcome-kicker">VIBECARD • HỌC NHẸ NHÀNG NHƯ ĐỌC TRUYỆN</div>
          <h1 class="welcome-headline">
            Góp nhặt từ vựng qua những <em>trang truyện sống động</em> & giai điệu hay.
          </h1>
          <p class="welcome-subcopy">
            Không áp lực thi cử, không nhồi nhét khô khan. Đọc truyện ngụ ngôn, tô màu nhân vật và khám phá ngôn ngữ bất cứ lúc nào bạn thích.
          </p>
        </div>
      </div>`;
  },

  // Screen 3 of 24: Lumi Greeting
  mascotGreet() {
    return `
      <div class="center-stage">
        <div class="grimoire-medallion anim-mascot-hop">
          <span class="firefly-dot" style="top:14px;left:18px;"></span>
          <span class="firefly-dot" style="bottom:18px;right:16px;animation-delay:1.1s;"></span>
          <img src="../assets/cards/lumi_farmer_night.png" alt="Lumi Greeting" />
        </div>
        <div class="grimoire-quote-card anim-bubble-pop">
          <div class="grimoire-quote-eyebrow">✦ LỜI CHÀO TỪ KHU RỪNG TRUYỆN KỂ</div>
          <div id="centerBubbleText" class="grimoire-quote-body"></div>
        </div>
      </div>`;
  },

  // Screen 4 & 5 of 24: Lumi Prologue
  mascotPitch() {
    return `
      <div class="center-stage">
        <div class="grimoire-medallion anim-mascot-hop">
          <span class="firefly-dot" style="top:10px;left:24px;"></span>
          <span class="firefly-dot" style="top:16px;right:18px;animation-delay:0.6s;"></span>
          <span class="firefly-dot" style="bottom:14px;left:20px;animation-delay:1.2s;"></span>
          <img src="../assets/cards/lumi_avatar_portrait_clean.png" alt="Lumi Portrait" style="border-radius:26px;" />
        </div>
        <div class="grimoire-quote-card anim-bubble-pop">
          <div class="grimoire-quote-eyebrow">✦ LÀM QUEN CÙNG NHAU</div>
          <div id="centerBubbleText" class="grimoire-quote-body"></div>
        </div>
      </div>`;
  },

  // Screen 6, 7, 8 of 24: 2-Column Collectible Language Bento Grid
  languageSelect(selectedCode) {
    return `
      ${this.whisperHeader('Bạn muốn cùng mình đọc truyện và phiêu lưu bằng <b>ngôn ngữ nào</b>?')}
      <div class="language-bento-grid">
        ${OnboardingData.languages.map(lang => `
          <div class="lang-bento-card ${selectedCode === lang.code ? 'is-selected' : ''}"
               onclick="pickLanguage('${lang.code}', '${lang.flag}', '${lang.name}', this)">
            <div class="lang-bento-top">
              <span class="lang-flag-glyph">${lang.flag}</span>
              <span class="lang-learners-tag">${lang.learners} bạn đọc</span>
            </div>
            <div>
              <div class="lang-bento-title">${lang.name}</div>
              <div class="lang-bento-sub">${lang.sub}</div>
            </div>
          </div>
        `).join('')}
      </div>`;
  },

  // Screen 9 of 24: Storybook Preparing Auto-Advance Transition
  courseBuilding(langObj) {
    return `
      <div class="center-stage">
        <div class="grimoire-medallion anim-grimoire-card" style="width:154px;height:154px;">
          <span class="firefly-dot" style="top:12px;left:16px;"></span>
          <span class="firefly-dot" style="bottom:14px;right:14px;animation-delay:0.9s;"></span>
          <img src="../assets/library/lumi_reading_fox.webp" alt="Preparing Stories" />
        </div>
        <div class="grimoire-quote-card">
          <div class="grimoire-quote-eyebrow">✦ ĐANG MỞ KHO TRUYỆN NGỤ NGÔN...</div>
          <div class="grimoire-quote-body" style="font-size:16.5px;">
            Đang chuẩn bị góc đọc truyện <b>${langObj.name}</b> thú vị cùng <b>${langObj.learners} người bạn</b> trên VibeCard...
          </div>
        </div>
      </div>`;
  },

  // Screen 10 & 11 of 24: Attribution 2-Column Cozy Bento Grid
  sourceSelect(selectedSourceId) {
    return `
      ${this.whisperHeader('Cơn gió nào đã đưa bạn ghé thăm <b>góc nhỏ của tụi mình</b> thế?')}
      <div class="language-bento-grid">
        ${OnboardingData.sources.map(src => `
          <div class="lang-bento-card ${selectedSourceId === src.id ? 'is-selected' : ''}"
               onclick="pickSingleOption('sourceId', '${src.id}', this)">
            <div class="lang-bento-top">
              <div class="option-leading-glyph">${src.icon}</div>
            </div>
            <div>
              <div class="lang-bento-title" style="font-size:14px;">${src.label}</div>
              <div class="lang-bento-sub">${src.sub}</div>
            </div>
          </div>
        `).join('')}
      </div>`;
  },

  // Screen 12 & 13 of 24: Botanical Stages
  levelSelect(langObj, selectedLevelId) {
    return `
      ${this.whisperHeader(`Hiện tại bạn cảm thấy thế nào khi bắt gặp <b>${langObj.name}</b>?`, 'sideBubbleText', '../assets/library/lumi_reading_fox.webp')}
      <div class="vibe-card-stack">
        ${OnboardingData.levels.map(lv => `
          <div class="tactile-option-card ${selectedLevelId === lv.id ? 'is-selected' : ''}"
               onclick="pickSingleOption('levelId', '${lv.id}', this)">
            <img class="option-seed-art" src="${lv.seedImg}" alt="${lv.cefr}" />
            <div class="option-content">
              <div class="option-title">${lv.label}</div>
              <div class="option-subtitle">${lv.sub}</div>
            </div>
            <span class="option-trailing-meta">${lv.cefr}</span>
          </div>
        `).join('')}
      </div>`;
  },

  // Screen 14 of 24: Dynamic Level Response
  levelResponse(levelObj) {
    return `
      <div class="center-stage">
        <div class="grimoire-medallion anim-mascot-hop">
          <img src="${levelObj.seedImg}" alt="Memory Seed" />
        </div>
        <div class="grimoire-quote-card anim-bubble-pop">
          <div class="grimoire-quote-eyebrow">✦ HÀNH TRÌNH ĐỌC TRUYỆN • ${levelObj.cefr}</div>
          <div class="grimoire-quote-body">${levelObj.lumiReply}</div>
        </div>
      </div>`;
  },

  // Screen 15 & 16 of 24: Visual Illustrated Vibe Cards
  goalSelect(langObj, selectedGoalId, initialBubble) {
    return `
      ${this.whisperHeader(initialBubble, 'reactiveGoalBubble', '../assets/cards/lumi_farmer_night.png', 'goalMascotImg')}
      <div class="vibe-card-stack">
        ${OnboardingData.goals.map(g => `
          <div class="tactile-option-card ${selectedGoalId === g.id ? 'is-selected' : ''}"
               onclick="pickGoalWithReactiveBubble('${g.id}', this)">
            <img class="vibe-scene-thumb" src="${g.sceneImg}" alt="${g.label}" />
            <div class="option-content">
              <span class="vibe-tag-Chip">${g.vibeTag}</span>
              <div class="option-title">${g.label}</div>
              <div class="option-subtitle">${g.sub}</div>
            </div>
          </div>
        `).join('')}
      </div>`;
  },

  // Screen 17 of 24: Playful Pacing Intro
  routineIntro() {
    return `
      <div class="center-stage">
        <div class="grimoire-medallion anim-mascot-hop">
          <img src="../assets/cards/lumi_progress_celebration.jpg" alt="Lumi Joy" style="border-radius:28px;object-fit:cover;" />
        </div>
        <div class="grimoire-quote-card anim-bubble-pop">
          <div class="grimoire-quote-eyebrow">✦ NHỊP ĐỘ THƯ THÁI MỖI NGÀY</div>
          <div class="grimoire-quote-body">
            Chẳng cần cày cuốc vất vả đâu! Chỉ cần <b>vài phút rảnh rỗi trong ngày</b> để đọc vài trang truyện cùng mình là đủ.
          </div>
        </div>
      </div>`;
  },

  // Screen 18 & 19 of 24: Daily Pacing Selection
  dailyGoalSelect(selectedMinutes) {
    return `
      ${this.whisperHeader('Mỗi ngày bạn muốn dành khoảng bao lâu để <b>đọc truyện & khám phá từ mới</b>?', 'sideBubbleText', '../assets/library/lumi_reading_fox.webp')}
      <div class="vibe-card-stack">
        ${OnboardingData.dailyGoals.map(d => `
          <div class="tactile-option-card ${selectedMinutes === d.minutes ? 'is-selected' : ''}"
               onclick="pickDailyGoal(${d.minutes}, this)">
            <div class="option-content">
              <div class="option-title">${d.label}</div>
              <div class="option-subtitle">${d.sub}</div>
            </div>
            <span class="option-trailing-meta">${d.tag}</span>
          </div>
        `).join('')}
      </div>`;
  },

  // Screen 20 of 24: First-Week Story Harvest
  weeklyImpact(dailyObj) {
    return `
      ${this.whisperHeader('Chỉ với vài phút giải trí mỗi ngày, sau <b>tuần đầu tiên</b> bạn đã gom được từng này món quà nè:')}
      <div class="harvest-artifact-card anim-bubble-pop">
        <div class="harvest-stat-grid">
          <div class="harvest-stat-box">
            <div class="harvest-stat-num">+${dailyObj.wordsPerWeek} từ</div>
            <div class="harvest-stat-label">Ngấm tự nhiên qua ngữ cảnh câu chuyện</div>
          </div>
          <div class="harvest-stat-box">
            <div class="harvest-stat-num">Quà tuần 1</div>
            <div class="harvest-stat-label">${dailyObj.characterReward}</div>
          </div>
        </div>
        <div class="artifact-bento-item" style="background:var(--m3-surface-container-low);">
          <img class="artifact-thumb-squircle" src="../assets/cards/billy_possum_cover.png" alt="Billy Possum" />
          <div class="option-content">
            <div class="option-title">Trọn vẹn truyện: Cuộc Phiêu Lưu Của Billy Possum</div>
            <div class="option-subtitle">Vừa nghe giọng đọc truyền cảm vừa tô màu bức tranh đầu tiên trong bộ sưu tập.</div>
          </div>
        </div>
      </div>`;
  },

  // Screen 21 & 22 of 24: Reminder Priming
  notificationPrompt(notificationsAllowed) {
    return `
      ${this.whisperHeader('Khi có chương truyện mới hoặc thẻ từ thú vị, mình <b>nhắn gọi bạn</b> một tiếng nhẹ nhàng nhé!')}
      <div class="notif-mock-wrapper">
        <div class="notif-mock-card">
          <div class="notif-mock-body">
            <div class="notif-mock-title">“VibeCard” Muốn Gửi Lời Nhắn Từ Cáo Lumi</div>
            <div class="notif-mock-desc">Báo tin khi có chương truyện mới, nhắc lật thẻ nhẹ nhàng và giữ chuỗi ngày khám phá cùng nhau.</div>
          </div>
          <div class="notif-mock-actions">
            <button type="button" class="notif-btn ${notificationsAllowed === false ? 'is-chosen' : ''}"
                    onclick="pickNotificationPermission(false)">Để sau</button>
            <button type="button" class="notif-btn is-allow ${notificationsAllowed === true ? 'is-chosen' : ''}"
                    onclick="pickNotificationPermission(true)">Đồng ý nhé</button>
          </div>
        </div>
        <div style="width:100%;max-width:315px;display:flex;justify-content:flex-end;padding-right:62px;margin-top:12px;">
          <svg class="anim-arrow-bounce" width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="var(--vc-amber-glow)" stroke-width="2.6">
            <path stroke-linecap="round" stroke-linejoin="round" d="M12 19V5m0 0l-6 6m6-6l6 6"/>
          </svg>
        </div>
      </div>`;
  },

  // Screen 23 of 24: 3-Month Showcase
  threeMonthBenefits() {
    return `
      ${this.whisperHeader('Ba niềm vui nho nhỏ sẽ đến với bạn khi <b>đồng hành cùng VibeCard</b>:', 'sideBubbleText', '../assets/library/lumi_reading_fox.webp')}
      <div class="artifact-bento-list">
        ${OnboardingData.threeMonthPillars.map(p => `
          <div class="artifact-bento-item">
            <img class="artifact-thumb-squircle" src="${p.art}" alt="${p.title}" />
            <div class="option-content">
              <div style="font-size:10px;font-weight:800;letter-spacing:0.08em;color:var(--vc-amber-glow);margin-bottom:2px;">${p.kicker}</div>
              <div class="option-title">${p.title}</div>
              <div class="option-subtitle">${p.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>`;
  },

  // Screen 24 of 24: The Crossroads Starting Point Selection
  startPathSelect(selectedPathId) {
    return `
      ${this.whisperHeader('Cánh cổng khu rừng đã mở! Bạn muốn <b>ghé thăm góc nào</b> trước tiên?')}
      <div class="crossroads-list">
        ${OnboardingData.startingPaths.map(path => `
          <div class="crossroads-card tactile-option-card ${selectedPathId === path.id ? 'is-selected' : ''}"
               onclick="pickSingleOption('startPathId', '${path.id}', this)">
            ${path.recommended ? '<span class="recommended-pill">✦ LỰA CHỌN THÚ VỊ NHẤT</span>' : ''}
            <img class="artifact-thumb-squircle" src="${path.art}" alt="${path.title}" />
            <div class="option-content">
              <div class="option-title" style="font-size:15px;">${path.title}</div>
              <div class="option-subtitle" style="margin-top:4px;">${path.desc}</div>
            </div>
          </div>
        `).join('')}
      </div>`;
  }
};

window.OnboardingTemplates = OnboardingTemplates;
