// ==========================================================================
// 🎭 PHASE 3 & 4: STEALTH MICRO-STORY DEMO & 1-TAP FLASHCARD RECALL
// Human-Crafted UI Edition: Crisp 1.5px SVG Icons, Tabular Nums, <kbd> Hints
// ==========================================================================

const VcIcons = {
  svg(paths, size = 15) {
    return `<svg class="vc-svg-icon" width="${size}" height="${size}" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true">${paths}</svg>`;
  },
  volume(s = 15) {
    return this.svg('<polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/><path d="M15.54 8.46a5 5 0 0 1 0 7.07"/><path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>', s);
  },
  mic(s = 15) {
    return this.svg('<path d="M12 2a3 3 0 0 0-3 3v7a3 3 0 0 0 6 0V5a3 3 0 0 0-3-3Z"/><path d="M19 10v2a7 7 0 0 1-14 0v-2"/><line x1="12" x2="12" y1="19" y2="22"/>', s);
  },
  book(s = 15) {
    return this.svg('<path d="M2 3h6a4 4 0 0 1 4 4v14a3 3 0 0 0-3-3H2z"/><path d="M22 3h-6a4 4 0 0 0-4 4v14a3 3 0 0 1 3-3h7z"/>', s);
  },
  layers(s = 15) {
    return this.svg('<polygon points="12 2 2 7 12 12 22 7 12 2"/><polyline points="2 17 12 22 22 17"/><polyline points="2 12 12 17 22 12"/>', s);
  },
  check(s = 13) {
    return this.svg('<polyline points="20 6 9 17 4 12"/>', s);
  },
  undo(s = 14) {
    return this.svg('<path d="M3 7v6h6"/><path d="M21 17a9 9 0 0 0-9-9 9 9 0 0 0-6 2.3L3 13"/>', s);
  },
  eye(s = 14) {
    return this.svg('<path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/>', s);
  },
  eyeOff(s = 14) {
    return this.svg('<path d="M9.88 9.88a3 3 0 1 0 4.24 4.24"/><path d="M10.73 5.08A10.43 10.43 0 0 1 12 5c7 0 10 7 10 7a13.16 13.16 0 0 1-1.67 2.68"/><path d="M6.61 6.61A13.526 13.526 0 0 0 2 12s3 7 10 7a9.74 9.74 0 0 0 5.39-1.61"/><line x1="2" x2="22" y1="2" y2="22"/>', s);
  },
  star(filled = false, s = 15) {
    return `<svg class="vc-svg-icon" width="${size = s}" height="${s}" viewBox="0 0 24 24" fill="${filled ? 'currentColor' : 'none'}" stroke="currentColor" stroke-width="1.65" stroke-linecap="round" stroke-linejoin="round" aria-hidden="true"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>`;
  },
  bell(s = 15) {
    return this.svg('<path d="M6 8a6 6 0 0 1 12 0c0 7 3 9 3 9H3s3-2 3-9"/><path d="M10.3 21a1.94 1.94 0 0 0 3.4 0"/>', s);
  },
  widget(s = 15) {
    return this.svg('<rect width="7" height="7" x="3" y="3" rx="1"/><rect width="7" height="7" x="14" y="3" rx="1"/><rect width="7" height="7" x="14" y="14" rx="1"/><rect width="7" height="7" x="3" y="14" rx="1"/>', s);
  },
  compass(s = 15) {
    return this.svg('<circle cx="12" cy="12" r="10"/><polygon points="16.24 7.76 14.12 14.12 7.76 16.24 9.88 9.88 16.24 7.76"/>', s);
  },
  clock(s = 14) {
    return this.svg('<circle cx="12" cy="12" r="10"/><polyline points="12 6 12 12 16 14"/>', s);
  },
  arrowRight(s = 15) {
    return this.svg('<path d="M5 12h14"/><path d="m12 5 7 7-7 7"/>', s);
  },
  sun(s = 16) {
    return this.svg('<circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/>', s);
  },
  moon(s = 16) {
    return this.svg('<path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/>', s);
  },
  pointer(s = 12) {
    return this.svg('<path d="M18 11V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2"/><path d="M14 10V4a2 2 0 0 0-2-2a2 2 0 0 0-2 2v2"/><path d="M10 10.5V6a2 2 0 0 0-2-2a2 2 0 0 0-2 2v8"/><path d="M18 8a2 2 0 1 1 4 0v6a8 8 0 0 1-8 8h-2c-2.8 0-4.5-.86-5.99-2.34l-3.6-3.6a2 2 0 0 1 2.83-2.82L7 15"/>', s);
  }
};

window.VcIcons = VcIcons;

const OnboardingInteractiveDemo = {
  // Phase 3: Interactive Story Reader Page — Compact Illustration + Single 3D Flippable Story/Word Card (Fits 100% in 1 Screen)
  renderStoryDemo() {
    const st = OnboardingState.storyState;
    const ms = OnboardingData.microStory;
    const activeWord = ms.words[st.activeWordId] || ms.words.serendipity;
    const tappedCount = st.tappedWords.length;
    const energyLeft = Math.max(35, 50 - tappedCount * 5);

    const renderWordToken = (wordKey, label) => {
      const isActive = st.activeWordId === wordKey;
      const isTapped = st.tappedWords.includes(wordKey);
      const showCoach = wordKey === 'serendipity' && !st.coachmarkDismissed;
      return `
        <span class="story-target-word ${isActive ? 'is-active' : ''} ${isTapped ? 'is-unlocked' : ''}"
              onclick="tapStoryTargetWord('${wordKey}', event)">
          ${label}
          ${showCoach ? `<span class="hand-coachmark" aria-hidden="true">${VcIcons.pointer(12)}<span>Chạm từ (-5⚡)</span></span>` : ''}
        </span>`;
    };

    return `
      <div class="story-demo-stage">
        ${OnboardingTemplates.whisperHeader('Khi đọc truyện, bạn chỉ cần <b>chạm vào từ gạch chân</b> để nghe phát âm và mở nghĩa ngay tại chỗ')}

        <!-- Compact Story Illustration Panel -->
        <div class="story-comic-panel">
          <img class="story-comic-img" src="${ms.sceneImg}" alt="Chapter 0 Tea Shop" />
          <div class="story-comic-scrim"></div>
          <div class="story-top-badges">
            <span class="story-mission-pill">${VcIcons.book(12)} <span>${ms.chapterBadge}</span></span>
            <span class="story-saved-counter-pill"><span class="energy-bolt">⚡</span><b>${energyLeft}/50</b> · Đã lưu <b>${tappedCount}/3</b></span>
          </div>
        </div>

        <!-- Single 3D Flippable Story & Word Flashcard (Flips Back and Forth on Tap) -->
        <div class="story-flip-wrap" style="perspective:1000px;">
          <div id="storyDemoFlipCard"
               class="story-flip-card ${st.justFlipped ? 'anim-card-3d-flip' : ''} ${st.isFlipped ? 'is-flipped' : ''}"
               onclick="flipStoryDemoCard(event)">

            ${!st.isFlipped ? `
              <!-- FRONT SIDE: Story Excerpt with Tappable Underlined Words -->
              <div class="story-flip-front">
                <div class="story-dialogue-top-row">
                  <button type="button"
                          class="story-speaker-btn"
                          onclick="event.stopPropagation(); speakText('${ms.audioSentence.replace(/'/g, "\\'")}')"
                          aria-label="Nghe câu thoại">
                    ${VcIcons.volume(18)}
                  </button>
                  <div class="story-speaker-meta">
                    <div class="story-speaker-tag">${ms.speakerName} · CHƯƠNG MỞ ĐẦU</div>
                    <div class="story-speaker-sub">Chạm từ gạch chân để nghe & lật nghĩa</div>
                  </div>
                </div>

                <p class="story-dialogue-line">
                  “Finding this ${renderWordToken('cozy', 'cozy')} tea shop under the rain was pure
                  ${renderWordToken('serendipity', 'serendipity')}, glowing like a warm
                  ${renderWordToken('lantern', 'lantern')}.”
                </p>

                <div class="fc-flip-banner story-flip-hint">
                  <span>Chạm từ gạch chân hoặc chạm thẻ để lật xem nghĩa</span>
                </div>
              </div>
            ` : `
              <!-- BACK SIDE: Flipped Word Meaning & Context Flashcard -->
              <div class="story-flip-back anim-bubble-pop">
                <div class="inline-word-header">
                  <div class="inline-word-title-group">
                    <span class="inline-headword">${activeWord.word}</span>
                    <button type="button"
                            class="ipa-pill-badge"
                            onclick="event.stopPropagation(); speakText('${activeWord.word}')">
                      ${VcIcons.volume(13)}
                      <span>${activeWord.ipa}</span>
                    </button>
                    <span class="pos-italic-tag">${activeWord.pos}</span>
                  </div>
                  <span class="word-saved-pill">${VcIcons.check(11)} <span>Đã lưu thẻ</span></span>
                </div>

                <div class="story-back-meaning-card">
                  <div class="inline-word-meaning">${activeWord.meaning}</div>
                  <div class="inline-word-collocation"><em>${activeWord.collocation}</em></div>
                </div>

                <p class="story-dialogue-vi">“${ms.viTranslation}”</p>

                <div class="fc-flip-banner is-flipped-banner story-flip-hint">
                  <span>✓ Đã xem nghĩa · Chạm vào thẻ để lật lại đoạn truyện</span>
                </div>
              </div>
            `}
          </div>
        </div>
      </div>`;
  },

  // Phase 4: 1-Tap Contextual Card Recall — Minimal Buttons, Large Full-Height 3D Card
  renderFlashcardRecall() {
    const fc = OnboardingState.flashcardState;
    const order = OnboardingData.microStory.deckOrder;
    const total = order.length;
    const curIdx = Math.min(fc.cardIndex, total - 1);
    const card = OnboardingState.getCurrentDeckCard();

    return `
      <div class="flashcard-stage-wrap">
        ${OnboardingTemplates.whisperHeader('Mỗi từ bạn chạm trong truyện sẽ <b>tự động tạo thành thẻ nhớ</b> kèm ngữ cảnh gốc')}

        <!-- 3-Word Deck Selector Tabs (Tap to jump between the 3 saved story words) -->
        <div class="fc-deck-tabs" role="tablist" aria-label="3 từ vựng vừa lưu">
          ${order.map((wId, idx) => {
            const wObj = OnboardingData.microStory.words[wId];
            const isCurrent = idx === curIdx;
            return `
              <button type="button"
                      class="fc-deck-tab ${isCurrent ? 'is-active' : ''}"
                      onclick="selectOnboardingCardIndex(${idx})">
                <span class="fc-deck-tab-num">${idx + 1}</span>
                <span class="fc-deck-tab-word">${wObj.word}</span>
              </button>`;
          }).join('')}
        </div>

        <!-- 3-Card Stacked Depth Container (Fills Viewport, Tap Anywhere on Card to 3D Flip) -->
        <div class="fc-stack-area" style="perspective:1000px;">
          <div class="fc-stack-shadow-2"></div>
          <div class="fc-stack-shadow-1"></div>

          <div id="activeOnboardingCard"
               class="fc-active-card ${fc.justFlipped ? 'anim-card-3d-flip' : ''} ${fc.justPromoted ? 'anim-deck-promote' : ''} ${fc.isFlipped ? 'is-flipped' : ''}"
               onclick="flipOnboardingCard(event)">

            <!-- Top Row: Context Badge + Single Large Audio Button -->
            <div class="fc-card-corners">
              <span class="fc-mastery-pill">${VcIcons.book(12)} <span>Ch. 00 · Quán trà đêm mưa (${curIdx + 1}/${total})</span></span>
              <button type="button" class="fc-icon-btn" onclick="event.stopPropagation(); speakText('${card.word}')" aria-label="Nghe phát âm">
                ${VcIcons.volume(18)}
              </button>
            </div>

            ${!fc.isFlipped ? `
              <!-- FRONT OF CARD: Story Artwork + Big Headword + Context Sentence -->
              <div class="fc-front-body">
                <div class="fc-front-art-wrap">
                  <img class="fc-front-art" src="${card.art}" alt="${card.word}" />
                  <span class="fc-front-pos-badge">${card.pos}</span>
                </div>
                <div class="fc-headword">${card.word}</div>
                <div class="fc-phonetics-row" onclick="event.stopPropagation(); speakText('${card.word}')">
                  <span class="ipa-pill-badge">${VcIcons.volume(14)} <span>${card.ipa}</span></span>
                </div>
                <blockquote class="fc-story-quote">${card.quote}</blockquote>
              </div>
              <div class="fc-flip-banner">
                <span>Chạm vào thẻ để lật xem nghĩa tiếng Việt</span>
              </div>
            ` : `
              <!-- BACK OF CARD: Meaning + Collocation + Bilingual Context -->
              <div class="fc-back-reveal anim-bubble-pop">
                <div class="fc-back-top-word">
                  <span class="fc-back-word-label">${card.word}</span>
                  <span class="fc-back-ipa-label">${card.ipa} · ${card.pos}</span>
                </div>

                <div class="fc-meaning-box">
                  <img class="fc-meaning-thumb" src="${card.art}" alt="${card.word}" />
                  <div class="fc-meaning-text">
                    <div class="fc-meaning-kicker">NGHĨA TRONG NGỮ CẢNH</div>
                    <div class="fc-meaning-vi">${card.meaning}</div>
                  </div>
                </div>

                <div class="fc-colloc-card">
                  <div class="fc-colloc-kicker">CỤM TỪ HAY GẶP & GHI NHỚ</div>
                  <div class="fc-meaning-colloc">${card.collocation}</div>
                </div>

                <blockquote class="fc-story-quote is-compact">${card.quote}</blockquote>
              </div>
              <div class="fc-flip-banner is-flipped-banner">
                <span>✓ Đã xem nghĩa · Chạm thẻ để lật lại mặt trước</span>
              </div>
            `}
          </div>
        </div>
      </div>`;
  }
};

window.OnboardingInteractiveDemo = OnboardingInteractiveDemo;
