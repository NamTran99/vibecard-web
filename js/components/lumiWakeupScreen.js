/**
 * 🦊 LUMI WAKEUP EXPERIENCE (MAGICAL ONBOARDING / WAKE-UP SPLASH)
 *
 * Three stacked clips, cut by scripts/build_lumi_wakeup_clips.py:
 * - lumiSleepVideo  : eyes-closed breathing, native ping-pong loop
 * - lumiNoticeVideo : Tap 1, one continuous take (eyes open -> looks at user -> smile -> yawn -> drowsy idle)
 * - lumiJoyVideo    : Tap 2, happy sitting pose with stardust + smiling idle
 *
 * Tap 1 crossfades between two near-identical sleeping frames, so no cut is visible.
 * Tap 2 is the only real camera cut; a bloom flash peaks exactly on the swap to hide it.
 */

(function(window) {
    'use strict';

    class LumiWakeupManager {
        constructor() {
            this.wakeStage = 0; // 0: Sleeping, 1: Noticed the user (drowsy), 2: Fully awake
            this.isAwake = false;
            this.isAnimating = false;
            this.useVideoMode = true;
            this.autoExitTimer = null;
            this.listenersBound = false;
        }

        init() {
            const screen = document.getElementById('screenLumiWakeup');
            if (!screen) return;

            // Default hidden on startup unless user explicitly clicks "Đánh thức Lumi"
            screen.classList.add('hidden');
            this.bindClipListeners();

            // Browsers pause background-tab media; resume whichever clip is on screen.
            document.addEventListener('visibilitychange', () => {
                if (document.hidden || !this.useVideoMode || screen.classList.contains('hidden')) return;
                const clip = this.getActiveClip();
                if (clip && clip.paused) clip.play().catch(() => {});
            });
        }

        getClips() {
            return {
                sleep: document.getElementById('lumiSleepVideo'),
                notice: document.getElementById('lumiNoticeVideo'),
                joy: document.getElementById('lumiJoyVideo')
            };
        }

        getActiveClip() {
            const clips = this.getClips();
            return [clips.sleep, clips.notice, clips.joy].find(c => c && c.classList.contains('is-visible')) || null;
        }

        getAllImages() {
            return [
                document.getElementById('lumiSleepingImg'),
                document.getElementById('lumiStirringImg'),
                document.getElementById('lumiStretchingImg'),
                document.getElementById('lumiAwakeImg')
            ];
        }

        bindClipListeners() {
            if (this.listenersBound) return;
            const { notice, joy } = this.getClips();
            const tail = window.LumiWakeupData.IDLE_TAIL;
            // One seek per clip end (every few seconds) to replay the idle tail, never per frame.
            if (notice) {
                notice.addEventListener('ended', () => {
                    if (this.wakeStage !== 1) return;
                    notice.currentTime = tail.notice;
                    notice.play().catch(() => {});
                });
            }
            if (joy) {
                joy.addEventListener('ended', () => {
                    if (this.wakeStage !== 2) return;
                    joy.currentTime = tail.joy;
                    joy.play().catch(() => {});
                });
            }
            this.listenersBound = true;
        }

        showClip(name, instant = false) {
            const clips = this.getClips();
            Object.entries(clips).forEach(([key, clip]) => {
                if (!clip) return;
                clip.classList.toggle('is-instant', instant);
                clip.classList.toggle('is-visible', key === name);
            });
            if (instant) {
                // Restore the crossfade for later transitions once this swap has painted.
                requestAnimationFrame(() => requestAnimationFrame(() => {
                    Object.values(clips).forEach(clip => clip && clip.classList.remove('is-instant'));
                }));
            }
        }

        resetClip(clip) {
            if (!clip) return;
            clip.pause();
            clip.currentTime = 0;
        }

        startSleepingIdle() {
            this.wakeStage = 0;
            this.isAwake = false;
            this.isAnimating = false;
            clearTimeout(this.autoExitTimer);

            const clips = this.getClips();
            const imgs = this.getAllImages();
            const modeBtn = document.getElementById('lumiMediaModeBtn');
            const screen = document.getElementById('screenLumiWakeup');

            if (this.useVideoMode && clips.sleep) {
                if (screen) screen.classList.add('lumi-video-active');
                Object.values(clips).forEach(clip => clip && clip.classList.remove('hidden'));
                this.resetClip(clips.notice);
                this.resetClip(clips.joy);
                this.showClip('sleep', true);
                clips.sleep.play().catch(e => console.log('Sleep clip play:', e));

                imgs.forEach(img => { if (img) img.classList.add('hidden'); });
                if (modeBtn) modeBtn.innerHTML = '🎬 VIDEO (BẬT)';
            } else {
                if (screen) screen.classList.remove('lumi-video-active');
                Object.values(clips).forEach(clip => {
                    if (!clip) return;
                    clip.pause();
                    clip.classList.add('hidden');
                });

                imgs.forEach((img, idx) => {
                    if (!img) return;
                    img.classList.remove('hidden');
                    img.style.transition = 'opacity 0.4s ease, transform 0.4s ease';
                    img.style.opacity = idx === 0 ? '1' : '0';
                    img.style.transform = idx === 0 ? 'scale(1)' : 'scale(0.96)';
                });
                if (modeBtn) modeBtn.innerHTML = '🦊 ẢNH TĨNH';
            }

            const initial = window.LumiWakeupData.stages[0];
            const quoteEl = document.getElementById('lumiWakeupQuote');
            const quoteSubEl = document.getElementById('lumiWakeupQuoteSub');
            const tapPrompt = document.getElementById('lumiWakeupTapPrompt');
            const lightBurst = document.getElementById('lumiLightBurst');
            const aura = document.getElementById('lumiWakeupAura');
            const sparkles = document.getElementById('lumiSparkles');

            if (lightBurst) {
                lightBurst.style.opacity = '0';
                lightBurst.style.transform = 'scale(0.5)';
            }
            if (aura) {
                aura.style.transform = 'translate(-50%, -50%) ' + initial.auraScale;
                aura.style.background = initial.auraBg;
            }
            if (sparkles && window.LumiWakeupEffects) sparkles.innerHTML = window.LumiWakeupEffects.generateSparklesHTML();
            if (quoteEl) {
                quoteEl.style.opacity = '1';
                quoteEl.innerHTML = initial.quoteTitle;
            }
            if (quoteSubEl) {
                quoteSubEl.style.opacity = '1';
                quoteSubEl.innerText = initial.quoteSub;
                quoteSubEl.className = 'lumi-quote-sub ' + initial.quoteSubClass;
            }
            if (tapPrompt) tapPrompt.innerHTML = initial.promptHtml;
        }

        handleWakeupTap() {
            if (this.isAnimating) return;

            if (this.isAwake) {
                this.enterApp();
                return;
            }

            const clips = this.getClips();
            const videoReady = this.useVideoMode && clips.sleep && clips.notice && clips.joy;
            const effects = window.LumiWakeupEffects;

            if (this.wakeStage === 0) {
                this.wakeStage = 1;
                this.isAnimating = true;
                const stageData = window.LumiWakeupData.stages[1];

                if (effects) {
                    effects.playDreamChime(stageData.chimeNotes);
                    effects.createShockwave();
                    effects.createSparksBurst(16);
                }

                if (videoReady) {
                    // The notice take starts on the same sleeping pose the loop shows,
                    // so a short crossfade reads as Lumi simply continuing to breathe and stir.
                    clips.notice.currentTime = 0;
                    clips.notice.play().catch(e => console.log('Notice clip play:', e));
                    this.showClip('notice');
                    setTimeout(() => clips.sleep.pause(), 400);
                } else {
                    const imgs = this.getAllImages();
                    if (imgs[0]) imgs[0].style.opacity = '0';
                    if (imgs[1]) imgs[1].style.opacity = '1';
                }

                this.updateStageUI(stageData);
                setTimeout(() => { this.isAnimating = false; }, 350);
                return;
            }

            if (this.wakeStage === 1) {
                this.wakeStage = 2;
                this.isAwake = true;
                this.isAnimating = true;
                const stageData = window.LumiWakeupData.stages[2];

                if (effects) {
                    effects.playDreamChime(stageData.chimeNotes);
                    effects.createShockwave();
                    effects.createSparksBurst(28);
                }

                if (videoReady) {
                    // Start the joy clip hidden right away so its frames are decoding and in motion
                    // by the time the flash peaks and it becomes visible.
                    clips.joy.currentTime = 0;
                    clips.joy.play().catch(e => console.log('Joy clip play:', e));
                    if (effects) effects.fireCutFlash();
                    setTimeout(() => {
                        this.showClip('joy', true);
                        clips.notice.pause();
                    }, window.LumiWakeupData.FLASH_PEAK_MS);
                } else {
                    const imgs = this.getAllImages();
                    imgs.forEach((img, idx) => { if (img) img.style.opacity = idx === 3 ? '1' : '0'; });
                }

                const lightBurst = document.getElementById('lumiLightBurst');
                if (lightBurst) {
                    lightBurst.style.opacity = '1';
                    lightBurst.style.transform = 'scale(1.85)';
                    setTimeout(() => {
                        lightBurst.style.opacity = '0.45';
                        lightBurst.style.transform = 'scale(1.35)';
                    }, 600);
                }

                this.updateStageUI(stageData);
                sessionStorage.setItem('lumi_has_woken', 'true');

                clearTimeout(this.autoExitTimer);
                this.autoExitTimer = setTimeout(() => this.enterApp(), window.LumiWakeupData.AUTO_ENTER_MS);

                setTimeout(() => { this.isAnimating = false; }, 350);
            }
        }

        updateStageUI(stageData) {
            const aura = document.getElementById('lumiWakeupAura');
            if (aura) {
                aura.style.transform = 'translate(-50%, -50%) ' + stageData.auraScale;
                aura.style.background = stageData.auraBg;
            }

            const quoteEl = document.getElementById('lumiWakeupQuote');
            const quoteSubEl = document.getElementById('lumiWakeupQuoteSub');

            if (quoteEl) {
                quoteEl.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
                quoteEl.style.opacity = '0';
                quoteEl.style.transform = 'translateY(-3px)';
                setTimeout(() => {
                    quoteEl.innerHTML = stageData.quoteTitle;
                    quoteEl.style.opacity = '1';
                    quoteEl.style.transform = 'translateY(0)';
                }, 180);
            }

            if (quoteSubEl) {
                quoteSubEl.style.transition = 'opacity 0.2s ease, transform 0.2s ease';
                quoteSubEl.style.opacity = '0';
                quoteSubEl.style.transform = 'translateY(-2px)';
                setTimeout(() => {
                    quoteSubEl.innerText = stageData.quoteSub;
                    quoteSubEl.className = 'lumi-quote-sub ' + stageData.quoteSubClass;
                    quoteSubEl.style.opacity = '1';
                    quoteSubEl.style.transform = 'translateY(0)';
                }, 180);
            }

            const tapPrompt = document.getElementById('lumiWakeupTapPrompt');
            if (tapPrompt) tapPrompt.innerHTML = stageData.promptHtml;
        }

        enterApp() {
            clearTimeout(this.autoExitTimer);
            Object.values(this.getClips()).forEach(clip => clip && clip.pause());

            const screen = document.getElementById('screenLumiWakeup');
            if (!screen) return;

            screen.style.transition = 'opacity 0.65s cubic-bezier(0.16, 1, 0.3, 1), transform 0.65s cubic-bezier(0.16, 1, 0.3, 1)';
            screen.style.opacity = '0';
            screen.style.transform = 'scale(1.05)';
            screen.style.pointerEvents = 'none';

            setTimeout(() => {
                screen.classList.add('hidden');
                screen.style.opacity = '';
                screen.style.transform = '';
                screen.style.pointerEvents = '';
            }, 700);
        }

        open(forceReset = true) {
            const screen = document.getElementById('screenLumiWakeup');
            if (!screen) return;

            screen.classList.remove('hidden');
            screen.style.opacity = '0';
            screen.style.transform = 'scale(0.96)';

            requestAnimationFrame(() => {
                screen.style.transition = 'opacity 0.5s ease, transform 0.5s cubic-bezier(0.16, 1, 0.3, 1)';
                screen.style.opacity = '1';
                screen.style.transform = 'scale(1)';
            });

            if (forceReset) this.startSleepingIdle();
        }

        toggleMediaMode() {
            this.useVideoMode = !this.useVideoMode;
            const clips = this.getClips();
            const imgs = this.getAllImages();
            const modeBtn = document.getElementById('lumiMediaModeBtn');
            const screen = document.getElementById('screenLumiWakeup');
            const stageClip = ['sleep', 'notice', 'joy'][this.wakeStage];

            if (this.useVideoMode) {
                if (screen) screen.classList.add('lumi-video-active');
                Object.values(clips).forEach(clip => clip && clip.classList.remove('hidden'));
                this.showClip(stageClip, true);
                const clip = clips[stageClip];
                if (clip) clip.play().catch(() => {});
                imgs.forEach(img => { if (img) img.classList.add('hidden'); });
                if (modeBtn) modeBtn.innerHTML = '🎬 VIDEO (BẬT)';
            } else {
                if (screen) screen.classList.remove('lumi-video-active');
                Object.values(clips).forEach(clip => {
                    if (!clip) return;
                    clip.pause();
                    clip.classList.add('hidden');
                });
                const visibleIdx = [0, 1, 3][this.wakeStage];
                imgs.forEach((img, idx) => {
                    if (!img) return;
                    img.classList.remove('hidden');
                    img.style.opacity = idx === visibleIdx ? '1' : '0';
                    img.style.transform = 'scale(1)';
                });
                if (modeBtn) modeBtn.innerHTML = '🦊 ẢNH TĨNH';
            }
        }
    }

    window.LumiWakeup = new LumiWakeupManager();

    window.handleLumiWakeupTap = function() {
        if (window.LumiWakeup) window.LumiWakeup.handleWakeupTap();
    };

    window.triggerLumiWakeup = function(force) {
        if (window.LumiWakeup) window.LumiWakeup.open(force !== false);
    };

    window.skipLumiWakeup = function() {
        if (window.LumiWakeup) window.LumiWakeup.enterApp();
    };

    window.toggleLumiMediaMode = function() {
        if (window.LumiWakeup) window.LumiWakeup.toggleMediaMode();
    };

    if (document.readyState === 'loading') {
        document.addEventListener('DOMContentLoaded', () => {
            if (window.LumiWakeup) window.LumiWakeup.init();
        });
    } else if (window.LumiWakeup) {
        window.LumiWakeup.init();
    }

})(window);
