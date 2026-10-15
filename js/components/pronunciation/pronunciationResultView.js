(function(window) {
    'use strict';

    window.PronunciationResultView = {
        renderAssessmentResults: function(item, activeEngine) {
            const resultsContainer = document.getElementById('prResultsContainer');
            const micBtn = document.getElementById('prMicBtn');
            const micHint = document.getElementById('prMicHint');

            if (!resultsContainer) return;

            // Reset Mic button icon
            if (micBtn) {
                micBtn.innerHTML = `
                    <svg class="w-8 h-8 fill-current" viewBox="0 0 24 24">
                        <path d="M12 14c1.66 0 3-1.34 3-3V5c0-1.66-1.34-3-3-3S9 3.34 9 5v6c0 1.66 1.34 3 3 3z"/>
                        <path d="M17 11c0 2.76-2.24 5-5 5s-5-2.24-5-5H5c0 3.53 2.61 6.43 6 6.92V21h2v-3.08c3.39-.49 6-3.39 6-6.92h-2z"/>
                    </svg>
                `;
            }
            if (micHint) {
                micHint.innerHTML = '<span>Hoàn tất đánh giá! Chạm nút mic để thu âm lại.</span>';
            }

            const isAzure = (activeEngine === 'azure');
            const scoreData = isAzure ? item.scoreAzure : item.scoreSpeechAce;
            const overallScore = scoreData.overall;

            // Engine badge & CEFR indicator
            const engineBadgeText = isAzure ? 'MS Azure Speech S0' : 'SpeechAce Conversaflex';
            const cefrBadgeHtml = (!isAzure && scoreData.cefr)
                ? `<div class="px-2.5 py-0.5 rounded-full bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 text-[11px] font-extrabold">${scoreData.cefr}</div>`
                : `<div class="px-2.5 py-0.5 rounded-full bg-primary/10 text-primary border border-primary/30 text-[11px] font-extrabold">IPA Precision Mode</div>`;

            // 4 Dimension Progress Bars
            const dimGridHtml = `
                <div class="pr-dim-grid">
                    <div class="pr-dim-item">
                        <div class="pr-dim-label">
                            <svg class="w-3.5 h-3.5 text-primary" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M9 12.75L11.25 15 15 9.75M21 12a9 9 0 11-18 0 9 9 0 0118 0z"/></svg>
                            <span>Accuracy</span>
                        </div>
                        <div class="pr-dim-val">${scoreData.accuracy}%</div>
                        <div class="pr-progress-track">
                            <div class="pr-progress-bar" style="width: ${scoreData.accuracy}%"></div>
                        </div>
                    </div>

                    <div class="pr-dim-item">
                        <div class="pr-dim-label">
                            <svg class="w-3.5 h-3.5 text-sky-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3.75 13.5l10.5-11.25L12 10.5h8.25L9.75 21.75 12 13.5H3.75z"/></svg>
                            <span>Fluency</span>
                        </div>
                        <div class="pr-dim-val">${scoreData.fluency}%</div>
                        <div class="pr-progress-track">
                            <div class="pr-progress-bar" style="width: ${scoreData.fluency}%; background: #0284C7;"></div>
                        </div>
                    </div>

                    <div class="pr-dim-item">
                        <div class="pr-dim-label">
                            <svg class="w-3.5 h-3.5 text-amber-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M3 13.125C3 12.504 3.504 12 4.125 12h2.25c.621 0 1.125.504 1.125 1.125v6.75C7.5 20.496 6.996 21 6.375 21h-2.25A1.125 1.125 0 013 19.875v-6.75zM9.75 8.625c0-.621.504-1.125 1.125-1.125h2.25c.621 0 1.125.504 1.125 1.125v11.25c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V8.625zM16.5 4.125c0-.621.504-1.125 1.125-1.125h2.25C20.496 3 21 3.504 21 4.125v15.75c0 .621-.504 1.125-1.125 1.125h-2.25a1.125 1.125 0 01-1.125-1.125V4.125z"/></svg>
                            <span>Prosody</span>
                        </div>
                        <div class="pr-dim-val">${scoreData.prosody}%</div>
                        <div class="pr-progress-track">
                            <div class="pr-progress-bar" style="width: ${scoreData.prosody}%; background: #D97706;"></div>
                        </div>
                    </div>

                    <div class="pr-dim-item">
                        <div class="pr-dim-label">
                            <svg class="w-3.5 h-3.5 text-emerald-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                            <span>Complete</span>
                        </div>
                        <div class="pr-dim-val">${scoreData.completeness}%</div>
                        <div class="pr-progress-track">
                            <div class="pr-progress-bar" style="width: ${scoreData.completeness}%; background: #16A34A;"></div>
                        </div>
                    </div>
                </div>
            `;

            // Phoneme breakdown list (Azure) OR SpeechAce Vietnamese Learner breakdown
            let detailHtml = '';
            if (isAzure && scoreData.phonemes) {
                let pillsHtml = scoreData.phonemes.map(ph => `
                    <div class="pr-phoneme-pill is-${ph.status}" title="${ph.desc}">
                        <span class="pr-ph-symbol">${ph.ph}</span>
                        <span class="pr-ph-score">${ph.score}</span>
                    </div>
                `).join('');

                detailHtml = `
                    <div class="pr-phoneme-container">
                        <div class="flex items-center justify-between">
                            <span class="text-[12px] font-bold uppercase tracking-wider text-black/70 dark:text-white/70">Phân tích âm vị học (Phonemes)</span>
                            <span class="text-[11px] text-primary font-semibold">Chạm vào âm để xem chi tiết</span>
                        </div>
                        <div class="pr-phoneme-list">
                            ${pillsHtml}
                        </div>
                    </div>
                `;
            } else if (!isAzure && scoreData.soundMostLike) {
                const sml = scoreData.soundMostLike;
                const issuesHtml = sml.issues.map(iss => `<li class="mt-1 flex items-start gap-1.5"><span class="text-amber-500 font-bold">•</span><span>${iss}</span></li>`).join('');

                detailHtml = `
                    <div class="pr-phoneme-container">
                        <div class="text-[12px] font-bold uppercase tracking-wider text-black/70 dark:text-white/70 mb-2">Bóc tách lỗi phát âm người Việt</div>
                        <div class="p-3 rounded-xl bg-black/5 dark:bg-white/5 border border-black/10 dark:border-white/10 text-[12.5px] space-y-1.5">
                            <div class="flex justify-between">
                                <span class="opacity-75">Giọng bạn phát ra giống:</span>
                                <span class="font-mono font-bold text-red-500">${sml.detected}</span>
                            </div>
                            <div class="flex justify-between">
                                <span class="opacity-75">Chuẩn bản xứ mong muốn:</span>
                                <span class="font-mono font-bold text-emerald-500">${sml.expected}</span>
                            </div>
                            <ul class="text-[12px] pt-1 text-black/80 dark:text-white/80 border-t border-black/10 dark:border-white/10">
                                ${issuesHtml}
                            </ul>
                        </div>
                    </div>
                `;
            }

            // Coach tip box
            const coachTipText = scoreData.coachTip || 'Lumi đang phân tích kết quả...';

            // Assembly
            resultsContainer.innerHTML = `
                <div class="pr-results-card">
                    <!-- Top Result Summary: Radial Gauge + Title -->
                    <div class="flex items-center gap-4">
                        <!-- Radial Gauge -->
                        <div class="pr-radial-gauge">
                            <svg class="pr-radial-svg" viewBox="0 0 100 100">
                                <circle class="pr-radial-bg" cx="50" cy="50" r="42"/>
                                <circle id="prRadialFillCircle" class="pr-radial-fill" cx="50" cy="50" r="42"/>
                            </svg>
                            <div class="pr-radial-score-text">
                                <span class="text-[28px] font-black tracking-tight" style="color: var(--pr-primary);">${overallScore}</span>
                                <span class="text-[10px] font-bold uppercase opacity-60">Điểm AI</span>
                            </div>
                        </div>

                        <!-- Right Column: Level & Engine -->
                        <div class="flex-1 space-y-1.5">
                            <div class="flex items-center gap-2">
                                ${cefrBadgeHtml}
                            </div>
                            <h4 class="text-[17px] font-black leading-tight text-black dark:text-white">
                                ${overallScore >= 90 ? 'Phát âm Tuyệt Hảo! 🎉' : (overallScore >= 80 ? 'Rất Tự Nhiên & Rõ Ràng! 👏' : 'Cần Chú Ý Âm Đuôi & Trọng Âm! 🎯')}
                            </h4>
                            <p class="text-[11.5px] opacity-70 leading-normal">
                                Động cơ: <b class="text-primary">${engineBadgeText}</b>
                            </p>
                        </div>
                    </div>

                    <!-- 4 Dimensions -->
                    ${dimGridHtml}

                    <!-- Granular Breakdown -->
                    ${detailHtml}

                    <!-- Lumi Coach Box -->
                    <div class="pr-coach-box">
                        <img src="assets/lumi/lumi_awake.png" alt="Lumi Fox Coach" class="pr-coach-avatar">
                        <div class="pr-coach-text">
                            ${coachTipText}
                        </div>
                    </div>

                    <!-- Bottom Action Row -->
                    <div class="pr-action-row">
                        <button type="button" class="pr-btn-outline" onclick="playNativeSpeakerAudio()">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M19.114 5.636a9 9 0 010 12.728M16.463 8.288a5.25 5.25 0 010 7.424M6.75 8.25l4.72-4.72a.75.75 0 011.28.53v15.88a.75.75 0 01-1.28.53l-4.72-4.72H4.51c-.88 0-1.704-.507-1.938-1.354A9.01 9.01 0 012.25 12c0-.83.112-1.633.322-2.396C2.806 8.757 3.63 8.25 4.51 8.25H6.75z"/></svg>
                            <span>Nghe mẫu</span>
                        </button>

                        <button type="button" class="pr-btn-outline" onclick="replayUserRecordedVoice()">
                            <svg class="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M5.25 5.653c0-.856.917-1.398 1.667-.986l11.54 6.348a1.125 1.125 0 010 1.971l-11.54 6.347a1.125 1.125 0 01-1.667-.985V5.653z"/></svg>
                            <span>Nghe lại bạn</span>
                        </button>

                        <button type="button" class="pr-btn-primary" onclick="saveTargetToFlashcards()">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="2.5" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M12 4.5v15m7.5-7.5h-15"/></svg>
                            <span>Lưu thẻ</span>
                        </button>
                    </div>
                </div>
            `;

            resultsContainer.classList.remove('hidden');

            // Animate Radial Gauge SVG offset
            requestAnimationFrame(() => {
                const circle = document.getElementById('prRadialFillCircle');
                if (circle) {
                    // Circumference for r=42 is 2 * PI * 42 = 263.89 ~ 264
                    const maxDash = 264;
                    const offset = maxDash - (overallScore / 100) * maxDash;
                    circle.style.strokeDashoffset = `${offset}`;
                }
            });
        }
    };
})(window);
