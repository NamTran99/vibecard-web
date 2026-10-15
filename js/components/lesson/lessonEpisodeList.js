// ========================================================
// 📜 LESSON EPISODES TRACKLIST & VOCABULARY CHIPS
// Module: js/components/lesson/lessonEpisodeList.js
// Ceiling: < 350 lines | Role: Renders tracklist and key vocab
// Design: Material Design 3 (M3-07 Dark Olive Green & Fairytale Warmth)
// ========================================================

(function (window) {
    'use strict';

    function renderEpisodesTracklist(ch) {
        const container = document.getElementById('introEpisodesList');
        if (!container || !ch.episodes) return;

        container.innerHTML = ch.episodes.map((ep, idx) => {
            const isLast = idx === ch.episodes.length - 1;
            const dividerCls = isLast ? '' : 'border-b border-black/[0.06] dark:border-white/[0.07]';

            if (ep.done) {
                return `
                    <div onclick="startCourseLessonIntro(${ep.num})" class="px-4 py-3.5 flex items-center justify-between gap-3 text-left transition-colors hover:bg-black/[0.03] dark:hover:bg-white/[0.04] active:bg-black/[0.06] dark:active:bg-white/[0.08] cursor-pointer group ${dividerCls}">
                        <div class="flex items-center gap-3 min-w-0">
                            <span class="w-6 h-6 rounded-full bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 border border-emerald-500/30 font-black text-[11px] flex items-center justify-center shrink-0">
                                ✓
                            </span>
                            <div class="truncate">
                                <h4 class="text-[13.5px] font-bold text-[#1B1C17] dark:text-[#E5E3DB] truncate group-hover:text-[#526600] dark:group-hover:text-[#B8D166] transition-colors">
                                    Bài ${ep.num}: ${ep.title}
                                </h4>
                                <span class="text-[11px] text-[#77786B] dark:text-[#C7C8B8] font-medium">${ep.duration} • Hoàn thành</span>
                            </div>
                        </div>
                        <span class="text-[11px] font-bold text-[#78350F] dark:text-[#FDE68A] bg-[#FEF3C7] dark:bg-[#3D2E0B] px-2.5 py-0.5 rounded-full border border-amber-500/30 shrink-0 shadow-xs">
                            ${ep.xp}
                        </span>
                    </div>
                `;
            } else if (ep.active) {
                return `
                    <div onclick="startCourseLessonIntro(${ep.num})" class="px-4 py-3.5 flex items-center justify-between gap-3 text-left transition-colors bg-[#526600]/10 dark:bg-[#B8D166]/15 border-l-4 border-l-[#526600] dark:border-l-[#B8D166] cursor-pointer group ${dividerCls}">
                        <div class="flex items-center gap-3 min-w-0">
                            <span class="w-6 h-6 rounded-full bg-[#526600] text-white dark:bg-[#B8D166] dark:text-[#161F00] font-black text-[10px] flex items-center justify-center shrink-0 shadow-[0_2px_8px_rgba(184,209,102,0.45)]">
                                <svg class="w-3 h-3 fill-current ml-0.5" viewBox="0 0 24 24"><polygon points="6 4 18 12 6 20 6 4"/></svg>
                            </span>
                            <div class="truncate">
                                <div class="flex items-center gap-1.5">
                                    <h4 class="text-[13.5px] font-black text-[#526600] dark:text-[#B8D166] truncate">
                                        Bài ${ep.num}: ${ep.title}
                                    </h4>
                                    <span class="w-2 h-2 rounded-full bg-[#526600] dark:bg-[#B8D166] animate-pulse shrink-0"></span>
                                </div>
                                <span class="text-[11px] text-[#78350F] dark:text-[#FDE68A] font-semibold">${ep.duration} • Đang học</span>
                            </div>
                        </div>
                        <span class="px-2.5 py-1 rounded-full bg-[#526600] text-white dark:bg-[#B8D166] dark:text-[#161F00] text-[11px] font-black shrink-0 tracking-tight shadow-xs group-hover:scale-105 transition-transform">
                            Học tiếp →
                        </span>
                    </div>
                `;
            } else {
                return `
                    <div class="px-4 py-3.5 flex items-center justify-between gap-3 text-left opacity-55 ${dividerCls}">
                        <div class="flex items-center gap-3 min-w-0">
                            <span class="w-6 h-6 rounded-full bg-black/5 dark:bg-white/10 text-[#77786B] dark:text-[#C7C8B8] text-[10px] flex items-center justify-center shrink-0">
                                🔒
                            </span>
                            <div class="truncate">
                                <h4 class="text-[13px] font-medium text-[#46483C] dark:text-[#C7C8B8] truncate">
                                    Bài ${ep.num}: ${ep.title}
                                </h4>
                                <span class="text-[11px] text-[#77786B] dark:text-[#909283]">${ep.duration} • Chưa mở</span>
                            </div>
                        </div>
                        <span class="text-[11px] text-[#77786B] dark:text-[#909283] shrink-0 font-medium">
                            ${ep.xp}
                        </span>
                    </div>
                `;
            }
        }).join('');
    }

    function renderVocabChips(ch, targetCount) {
        const container = document.getElementById('introVocabChips');
        if (!container || !ch.vocab) return;

        const count = (typeof targetCount === 'number' && targetCount > 0)
            ? targetCount
            : (window.selectedLessonVocabCount || ch.vocab.length);

        // Update badge count if present
        const badgeEl = document.getElementById('introVocabCountBadge');
        if (badgeEl) {
            badgeEl.textContent = count >= ch.vocab.length ? `Tất cả ${ch.vocab.length} từ` : `${count}/${ch.vocab.length} từ`;
        }

        container.innerHTML = ch.vocab.map((v, idx) => {
            const isTarget = idx < count;
            const stateCls = isTarget ? 'is-target' : 'is-dimmed';
            const numStr = String(idx + 1).padStart(2, '0');
            const safeWord = (v.word || '').replace(/'/g, "\\'");

            return `
                <div onclick="speakWord('${safeWord}')" class="m3-vocab-card ${stateCls}" role="button" tabindex="0" title="Chạm để nghe phát âm: ${v.word}">
                    <div class="flex items-center gap-3 min-w-0 flex-1">
                        <span class="m3-vocab-idx">${numStr}</span>
                        <div class="flex flex-col min-w-0 flex-1">
                            <div class="flex items-center gap-2 flex-wrap">
                                <span class="m3-vocab-word">${v.word}</span>
                                ${v.ipa ? `<span class="m3-vocab-ipa">${v.ipa}</span>` : ''}
                                ${!isTarget ? `<span class="m3-vocab-badge-extra">Mở rộng</span>` : ''}
                            </div>
                            <span class="m3-vocab-meaning truncate">${v.meaning}</span>
                        </div>
                    </div>
                    <button type="button" class="m3-vocab-speaker" aria-label="Phát âm ${v.word}" onclick="event.stopPropagation(); speakWord('${safeWord}')" title="Phát âm: ${v.word}">
                        <svg class="w-3.5 h-3.5 fill-current pointer-events-none" viewBox="0 0 24 24">
                            <polygon points="11 5 6 9 2 9 2 15 6 15 11 19 11 5"/>
                            <path d="M15.54 8.46a5 5 0 0 1 0 7.07"/>
                            <path d="M19.07 4.93a10 10 0 0 1 0 14.14"/>
                        </svg>
                    </button>
                </div>
            `;
        }).join('');
    }

    window.renderEpisodesTracklist = renderEpisodesTracklist;
    window.renderVocabChips = renderVocabChips;

})(window);
