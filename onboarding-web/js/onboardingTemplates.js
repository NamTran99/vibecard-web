// ==========================================================================
// 🎨 VIBECARD ONBOARDING TEMPLATES — /HUMAN-CRAFTED-UI EDITION
// Show, Don't Tell: Live Interactive Story Excerpts & Tethered Cards (Zero Marketing Slop)
// ==========================================================================

const OnboardingTemplates = {
  // Duolingo-Inspired Mascot + Left-Pointing Speech Bubble (Adapted to VibeCard Lumi & Warm Paper)
  whisperHeader(textHtml, textId = 'sideBubbleText', avatarSrc = '../assets/cards/lumi_farmer_night.png', imgId = '') {
    return `
      <div class="lumi-whisper-header">
        <div class="lumi-mascot-fig anim-mascot-float">
          <img ${imgId ? `id="${imgId}"` : ''} src="${avatarSrc}" alt="Lumi" />
        </div>
        <div class="lumi-speech-bubble">
          <span class="lumi-bubble-tail" aria-hidden="true"></span>
          <div id="${textId}" class="lumi-whisper-text">${textHtml}</div>
        </div>
      </div>`;
  },

  // SCREEN 1: 65%-70% Hero + Live Interactive Book Excerpt tethered to Popover Card
  welcome() {
    const wId = OnboardingState.heroWordId || 'serendipity';
    const wObj = OnboardingData.microStory.words[wId] || OnboardingData.microStory.words.serendipity;

    return `
      <div class="welcome-stage">
        <div class="welcome-scenery-frame">
          <img class="welcome-scenery-bg anim-hero-pan" src="../assets/cards/pixar_night_farm_scenery.jpg" alt="VibeCard Story World" />
          <div class="welcome-scenery-scrim"></div>
          <span class="hero-firefly ff-1" aria-hidden="true"></span>
          <span class="hero-firefly ff-2" aria-hidden="true"></span>
          <span class="hero-firefly ff-3" aria-hidden="true"></span>
          <span class="hero-firefly ff-4" aria-hidden="true"></span>
          <div class="welcome-badge-floating anim-hero-item-1">${VcIcons.book(12)}<span>Ch. 00 · Quán trà đêm mưa</span></div>

          <!-- Real Interactive Product Artifact: Live Story Line + Tethered Lookup Card -->
          <div class="hero-artifact-stack anim-hero-item-2">
            <div class="hero-live-reader-card">
              “Finding this
              <span class="hero-live-word ${wId === 'cozy' ? 'is-active' : ''}" onclick="previewHeroWord('cozy', event)">cozy</span>
              shop was pure
              <span class="hero-live-word ${wId === 'serendipity' ? 'is-active' : ''}" onclick="previewHeroWord('serendipity', event)">serendipity</span>, like a warm
              <span class="hero-live-word ${wId === 'lantern' ? 'is-active' : ''}" onclick="previewHeroWord('lantern', event)">lantern</span>.”
            </div>

            <div class="hero-mini-flashcard anim-popover-morph" id="heroLivePopover" onclick="speakText('${wObj.word}')" title="Chạm để nghe phát âm">
              <div class="hero-mini-fc-top">
                <span class="hero-mini-fc-word" id="heroFcWord">${wObj.word}</span>
                <span class="hero-mini-fc-ipa">${VcIcons.volume(11)}<span id="heroFcIpa">${wObj.ipa}</span></span>
              </div>
              <div class="hero-mini-fc-meaning" id="heroFcMeaning">${wObj.pos} · ${wObj.meaning}</div>
              <div class="hero-mini-fc-quote" id="heroFcColloc">${wObj.collocation}</div>
            </div>
          </div>

          <div class="welcome-proof-pill anim-hero-item-3">${VcIcons.star(true, 12)}<b>4.9</b><span>· 148.2K bạn đọc</span></div>
          <div class="welcome-lumi-lantern anim-mascot-float">
            <img src="../assets/cards/lumi_farmer_night.png" alt="Lumi Mascot" />
          </div>
        </div>

        <div class="welcome-editorial-copy anim-hero-item-3">
          <h1 class="welcome-headline">
            Học ngoại ngữ qua <em>những câu truyện</em>
          </h1>
          <p class="welcome-subcopy">
            Chạm vào từ vựng ngay trong mạch truyện để nghe phát âm và ghi nhớ tự nhiên.
          </p>
        </div>
      </div>`;
  },

  // QUESTION 1 (Matches Image 1): Conversational Bubble + Section Heading + Full-Width Vertical Flag Rows
  languageSelect(selectedCode) {
    return `
      <div class="step-fill-stage">
        ${this.whisperHeader('Bạn muốn học ngôn ngữ nào?')}

        <div class="duo-section-heading">
          <span>Dành cho người nói tiếng Việt</span>
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polyline points="18 15 12 9 6 15"/></svg>
        </div>

        <div class="duo-option-list">
          ${OnboardingData.languages.map(lang => `
            <div class="duo-option-card lang-bento-card ${selectedCode === lang.code ? 'is-selected' : ''}"
                 onclick="pickLanguage('${lang.code}', '', '${lang.name}', this)">
              <span class="duo-flag-slot">${lang.flagSvg}</span>
              <span class="duo-option-label">${lang.name}</span>
            </div>`).join('')}
        </div>
      </div>`;
  },

  // QUESTION 2 (Matches Image 2): "Bạn biết [Ngôn ngữ] đến mức nào rồi?" + 5-Bar Signal Strength Icons
  levelSelect(langObj, selectedLevelId) {
    const langName = (langObj && langObj.name) ? langObj.name : 'Tiếng Anh';
    return `
      <div class="step-fill-stage">
        ${this.whisperHeader(`Bạn biết <b>${langName}</b> đến mức nào rồi?`)}

        <div class="duo-option-list is-spacious-list">
          ${OnboardingData.levels.map(lv => `
            <div class="duo-option-card level-full-card ${selectedLevelId === lv.id ? 'is-selected' : ''}"
                 onclick="pickLevelPill('${lv.id}', this)">
              <span class="duo-signal-slot">${window.renderSignalBars(lv.bars, 5)}</span>
              <span class="duo-option-label">${lv.getLabel(langName)}</span>
            </div>`).join('')}
        </div>
      </div>`;
  },

  // Centerpiece Mascot Reading on Book Stack (Matches Duolingo COURSE BUILDING... illustration)
  courseBuildingScene() {
    return `
      <div class="course-building-art-wrap">
        <div class="course-building-pedestal"></div>
        <img class="course-building-mascot" src="../assets/cards/lumi_farmer_night.png" alt="Lumi đang xây dựng lộ trình" />
        <svg class="course-building-books-svg" width="144" height="84" viewBox="0 0 144 84" fill="none" aria-hidden="true">
          <!-- Bottom Coral Storybook -->
          <path d="M26 54 L76 68 L120 50 L70 38 Z" fill="#FF7A70" />
          <path d="M26 54 L76 68 L120 50 L120 59 L76 77 L26 63 Z" fill="#E65A50" />
          <path d="M30 55 L75 68 L117 51 L117 56 L75 73 L30 60 Z" fill="#FFFDF9" />
          <!-- Middle Amber Storybook -->
          <path d="M22 41 L74 56 L118 37 L66 25 Z" fill="#FFC833" />
          <path d="M22 41 L74 56 L118 37 L118 46 L74 65 L22 50 Z" fill="#E5AC19" />
          <path d="M26 42 L73 56 L114 38 L114 43 L73 61 L26 47 Z" fill="#FFFDF9" />
          <!-- Top Open Emerald/Cobalt Book in front of Lumi -->
          <path d="M40 16 C52 14 64 19 72 26 C80 19 92 14 104 16 L100 40 C88 38 78 42 72 48 C66 42 56 38 44 40 Z" fill="#FFFDF9" />
          <path d="M38 18 C50 16 64 21 72 28 L72 50 C64 43 50 39 38 41 Z" fill="#2EBD85" />
          <path d="M106 18 C94 16 80 21 72 28 L72 50 C80 43 94 39 106 41 Z" fill="#1F9E6C" />
          <path d="M42 14 C54 13 65 18 72 25 C79 18 90 13 102 14" stroke="#FFFDF9" stroke-width="2.5" stroke-linecap="round" />
        </svg>
      </div>`;
  },

  // INTERLEAVED COURSE BUILDING SCREEN 1 (5s Fixed Duration — No Progress Bar, No Early Skip)
  loadingStep1() {
    const langObj = OnboardingState.getSelectedLanguageObj();
    const levelObj = OnboardingState.getSelectedLevelObj();

    return `
      <div class="course-building-stage">
        ${this.courseBuildingScene()}
        <div class="course-building-kicker">ĐANG XÂY DỰNG LỘ TRÌNH...</div>
        <p class="course-building-copy">
          Chuẩn bị cùng <b>hơn 120.000 người đọc</b> chinh phục <b>${langObj.name}</b> từ mức <b>${levelObj.shortTag.toLowerCase()}</b> với VibeCard!
        </p>

        <div class="course-outcome-box">
          <div class="course-outcome-kicker">DỰ KIẾN KẾT QUẢ ĐẦU RA</div>
          <div class="course-outcome-item">
            <span class="course-outcome-badge">7 NGÀY</span>
            <span class="course-outcome-text">Đọc trọn vẹn <b>7 chương truyện</b> & ghi nhớ tự nhiên <b>~35 từ vựng</b> ngay trong mạch truyện.</span>
          </div>
          <div class="course-outcome-item">
            <span class="course-outcome-badge is-highlight">30 NGÀY</span>
            <span class="course-outcome-text">Chỉ với <b>10 phút/ngày</b>, bạn sẽ nắm vững <b>~150 từ vựng</b> trong ngữ cảnh sau 1 tháng.</span>
          </div>
        </div>
      </div>`;
  },

  // QUESTION 3: Story Genres Tab (Conversational Prompt + Tall Photography Cards — Outline Only Selection)
  genreSelect(selectedGenreId) {
    return `
      <div class="step-fill-stage">
        ${this.whisperHeader('Bạn thích đọc thể loại truyện nào nhất?')}
        <div class="genre-bento-grid is-spacious">
          ${OnboardingData.genres.map(g => `
            <div class="genre-bento-card ${selectedGenreId === g.id ? 'is-selected' : ''}"
                 onclick="pickGenreWithReactiveBubble('${g.id}', this)">
              <div class="genre-thumb-wrap is-tall">
                <img src="${g.sceneImg}" alt="${g.title}" />
                <span class="genre-chapter-pill">${g.chapterMeta}</span>
              </div>
              <div class="genre-card-body">
                <div class="lang-bento-title">${g.title}</div>
                <div class="lang-bento-sub">${g.sub}</div>
              </div>
            </div>`).join('')}
        </div>
      </div>`;
  },

  // QUESTION 4: Daily Time Commitment — Conversational Prompt + Clock Icons (No Adjectives)
  dailyGoalSelect(selectedMinutes) {
    return `
      <div class="step-fill-stage">
        ${this.whisperHeader('Mỗi ngày bạn muốn dành <b>bao nhiêu phút</b> đọc truyện?')}
        <div class="duo-option-list">
          ${OnboardingData.dailyGoals.map(d => `
            <div class="duo-option-card tactile-option-card ${selectedMinutes === d.minutes ? 'is-selected' : ''}"
                 onclick="pickDailyGoal(${d.minutes}, this)">
              <span class="duo-signal-slot">${window.renderClockIcon(d.minutes)}</span>
              <span class="duo-option-label">${d.label}</span>
              <span class="duo-option-right-tag">${d.cards}</span>
            </div>`).join('')}
        </div>
      </div>`;
  },

  // INTERLEAVED COURSE BUILDING SCREEN 2 (5s Fixed Duration — No Progress Bar, No Early Skip)
  loadingStep2() {
    const genreObj = OnboardingState.getSelectedGenreObj();
    const dailyObj = OnboardingState.getSelectedDailyObj();
    const cardsPerDay = parseInt(dailyObj.cards, 10) || 5;
    const weeklyWords = cardsPerDay * 7;
    const monthlyWords = cardsPerDay * 30;

    return `
      <div class="course-building-stage">
        ${this.courseBuildingScene()}
        <div class="course-building-kicker">ĐANG CẬP NHẬT HỒ SƠ...</div>
        <p class="course-building-copy">
          Đang xếp tuyển tập truyện <b>${genreObj.title}</b> với nhịp đọc <b>${dailyObj.minutes} phút mỗi ngày</b> vào tủ sách của bạn!
        </p>

        <div class="course-outcome-box">
          <div class="course-outcome-kicker">LỘ TRÌNH ĐẦU RA CÁ NHÂN HÓA</div>
          <div class="course-outcome-item">
            <span class="course-outcome-badge">7 NGÀY</span>
            <span class="course-outcome-text">Hoàn thành <b>7 chương ${genreObj.title}</b> & mở khóa <b>+${weeklyWords} thẻ từ</b> ngữ cảnh.</span>
          </div>
          <div class="course-outcome-item">
            <span class="course-outcome-badge is-highlight">30 NGÀY</span>
            <span class="course-outcome-text">Chỉ với <b>${dailyObj.minutes} phút/ngày</b>, bạn sẽ nắm vững <b>~${monthlyWords} từ vựng</b> trong ngữ cảnh sau 1 tháng.</span>
          </div>
        </div>
      </div>`;
  },

  // FINAL SCREEN: Personalized Roadmap + 30-Day Outcome Chart + Free vs Plus Energy Tier (Zero Bottom Flashcards, Tight Layout)
  deferredSignup() {
    const langObj = OnboardingState.getSelectedLanguageObj();
    const genreObj = OnboardingState.getSelectedGenreObj();
    const levelObj = OnboardingState.getSelectedLevelObj();
    const dailyObj = OnboardingState.getSelectedDailyObj();
    const selectedPlan = OnboardingState.answers.planTier || 'plus';

    const cardsPerDay = parseInt(dailyObj.cards, 10) || 5;
    const weeklyWords = cardsPerDay * 7;
    const monthlyWords = cardsPerDay * 30;

    return `
      <div class="signup-paywall-stage">
        <div class="signup-header-card anim-bubble-pop">
          <div class="signup-kicker">HỒ SƠ ĐỌC TRUYỆN CÁ NHÂN ĐÃ LƯU</div>
          <h2 class="signup-headline">Lộ trình của bạn đã hoàn tất</h2>
          <div class="endowed-summary-grid">
            <div class="endowed-pill"><span style="width:20px;display:inline-flex;">${langObj.flagSvg}</span><span>${langObj.name}</span></div>
            <div class="endowed-pill">${VcIcons.book(13)}<span>${genreObj.title}</span></div>
            <div class="endowed-pill"><span style="display:inline-flex;transform:scale(0.78);transform-origin:left center;">${window.renderSignalBars(levelObj.bars, 5)}</span><span>${levelObj.shortTag}</span></div>
            <div class="endowed-pill">${VcIcons.clock(13)}<span>${dailyObj.minutes} phút/ngày</span></div>
          </div>
        </div>

        <!-- 30-Day Outcome Commitment & Growth Bar Chart -->
        <div class="outcome-chart-card">
          <div class="outcome-chart-top">
            <div class="outcome-chart-kicker">CAM KẾT ĐẦU RA · ${dailyObj.minutes} PHÚT MỖI TỐI</div>
            <div class="outcome-chart-headline">Nắm vững <b>+${monthlyWords} từ vựng/tháng</b> với ${dailyObj.minutes} phút đọc truyện mỗi tối</div>
          </div>
          <div class="outcome-bars-grid">
            <div class="outcome-bar-col">
              <span class="outcome-bar-val">3 từ</span>
              <div class="outcome-bar-track"><div class="outcome-bar-fill" style="height:28%;"></div></div>
              <span class="outcome-bar-label">Hôm nay</span>
            </div>
            <div class="outcome-bar-col">
              <span class="outcome-bar-val">+${weeklyWords} từ</span>
              <div class="outcome-bar-track"><div class="outcome-bar-fill is-mid" style="height:58%;"></div></div>
              <span class="outcome-bar-label">Sau 7 ngày</span>
            </div>
            <div class="outcome-bar-col is-target">
              <span class="outcome-bar-val is-accent">+${monthlyWords} từ</span>
              <div class="outcome-bar-track"><div class="outcome-bar-fill is-peak" style="height:100%;"></div></div>
              <span class="outcome-bar-label">Sau 30 ngày</span>
            </div>
          </div>
        </div>

        <!-- Free (50 Energy Limit + 30s Ads) vs. Plus (Unlimited Energy + 0 Ads + Risk Reversal) -->
        <div class="energy-tier-card">
          <div class="energy-tier-kicker">CHẾ ĐỘ NĂNG LƯỢNG ĐỌC TRUYỆN</div>
          <div class="energy-tier-grid">
            <div class="energy-tier-option ${selectedPlan === 'free' ? 'is-selected' : ''}"
                 onclick="selectOnboardingPlanTier('free', this)">
              <div class="energy-tier-title-row">
                <span class="energy-tier-name">Bản Miễn Phí</span>
                <span class="energy-tier-price">0đ</span>
              </div>
              <div class="energy-tier-desc">
                <div>⚡ <b>Giới hạn 50⚡/ngày</b> (~1 chương truyện)</div>
                <div>📺 Chèn <b>quảng cáo 30s</b> khi qua chương</div>
              </div>
            </div>

            <div class="energy-tier-option is-plus ${selectedPlan === 'plus' ? 'is-selected' : ''}"
                 onclick="selectOnboardingPlanTier('plus', this)">
              <span class="energy-tier-recommend-badge">KHUYÊN DÙNG</span>
              <div class="energy-tier-title-row">
                <span class="energy-tier-name">VibeCard Plus</span>
                <span class="energy-tier-price is-accent">7 ngày 0đ</span>
              </div>
              <div class="energy-tier-desc">
                <div>♾️ <b>Vô hạn năng lượng</b> đọc & chạm từ</div>
                <div>🚫 <b>0 Quảng cáo</b> làm đứt mạch cảm xúc</div>
              </div>
            </div>
          </div>
          <div class="energy-risk-shield">
            🛡️ <b>0đ hôm nay</b> · Sau 7 ngày chỉ <b>1.600đ/ngày</b> (49k/tháng) · Nhắc trước 2 ngày, hủy 1 chạm
          </div>
        </div>
      </div>`;
  }
};

window.OnboardingTemplates = OnboardingTemplates;
