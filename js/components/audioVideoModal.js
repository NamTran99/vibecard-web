// ========================================================
// 🎧 AUDIO / VIDEO TRANSCRIPT & FLOW CONTROLLER
// Module: js/components/audioVideoModal.js
// Ceiling: < 350 lines | Role: 3-step Audio transcript workflow
// ========================================================

(function () {
    'use strict';

    let currentAudioStep = 1;
    let selectedAudioFile = null;

    window.openAudioVideoScreen = function () {
        const screen = document.getElementById('screenAudioVideo');
        if (!screen) return;

        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
            SoundEngine.play(1);
        }

        if (!selectedAudioFile) {
            resetAudioStep1UI();
        }

        setAudioFlowStep(1);

        screen.classList.remove('hidden');
        requestAnimationFrame(() => {
            screen.classList.remove('translate-x-full');
        });
    };

    window.closeAudioVideoScreen = function () {
        const screen = document.getElementById('screenAudioVideo');
        if (!screen) return;

        if (typeof stopAudioPlayback === 'function') {
            stopAudioPlayback();
        }

        screen.classList.add('translate-x-full');
        setTimeout(() => {
            screen.classList.add('hidden');
        }, 320);
    };

    window.triggerAudioFileInput = function () {
        const input = document.getElementById('audioVideoNativeFileInput');
        if (input) input.click();
    };

    window.handleAudioVideoFilePicked = function (event) {
        const file = event.target.files && event.target.files[0];
        if (!file) return;

        selectedAudioFile = {
            name: file.name,
            size: formatFileSize(file.size),
            duration: '2:15',
            isDemo: false
        };

        renderAudioLoadedInHero();
        if (typeof showEntranceToast === 'function') {
            showEntranceToast(`🎧 Đã nhận file: "${file.name}"!`);
        }
    };

    window.handleAudioDemoClick = function () {
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
            SoundEngine.play(1);
        }

        selectedAudioFile = {
            name: 'English_Daily_Podcast_Ep42.mp3',
            size: '3.8 MB',
            duration: '2:45',
            isDemo: true
        };

        renderAudioLoadedInHero();

        if (typeof showEntranceToast === 'function') {
            showEntranceToast('✨ Đã tải mẫu Audio Tiếng Anh B2 (Podcast 2:45)!');
        }
    };

    function formatFileSize(bytes) {
        if (!bytes) return '3.2 MB';
        const mb = bytes / (1024 * 1024);
        return mb.toFixed(1) + ' MB';
    }

    function resetAudioStep1UI() {
        selectedAudioFile = null;
        const heroCard = document.getElementById('audioStep1HeroCard');
        if (!heroCard) return;

        heroCard.innerHTML = `
            <div id="audioHeroIconCircle" class="w-20 h-20 rounded-full flex items-center justify-center mb-4 transition-transform group-hover:scale-105">
                <svg viewBox="0 0 32 32" class="w-8 h-8" fill="currentColor">
                    <rect x="7" y="11" width="3.5" height="10" rx="1.75"/>
                    <rect x="12" y="6" width="3.5" height="20" rx="1.75"/>
                    <rect x="17" y="12" width="3.5" height="8" rx="1.75"/>
                    <rect x="22" y="8" width="3.5" height="16" rx="1.75"/>
                </svg>
            </div>
            <h3 id="audioHeroTitle" class="text-[16.5px] font-bold mb-1.5">Chọn 1 file audio hoặc video</h3>
            <p id="audioHeroSubtitle" class="text-[13px] max-w-[270px] leading-relaxed">App sẽ tách transcript rồi cho bạn chọn từ như flow ảnh.</p>
        `;

        const actionsArea = document.getElementById('audioStep1ActionsArea');
        if (actionsArea) {
            actionsArea.innerHTML = `
                <button id="audioDemoBtn" onclick="handleAudioDemoClick()" class="audio-btn-secondary w-full h-[48px] active:scale-[0.98] flex items-center justify-center gap-2 mt-4 cursor-pointer">
                    <svg class="w-4 h-4" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.2L21.6 12l-7.2 2.4L12 21.6l-2.4-7.2L2.4 12l7.2-2.4L12 2z"/></svg>
                    <span>Demo</span>
                </button>
                <button id="audioPrimaryPickBtn" onclick="triggerAudioFileInput()" class="audio-btn-primary w-full h-[52px] active:scale-[0.98] flex items-center justify-center gap-2.5 mt-3 cursor-pointer">
                    <svg viewBox="0 0 32 32" class="w-5 h-5" fill="currentColor">
                        <rect x="7" y="11" width="3.5" height="10" rx="1.75"/>
                        <rect x="12" y="6" width="3.5" height="20" rx="1.75"/>
                        <rect x="17" y="12" width="3.5" height="8" rx="1.75"/>
                        <rect x="22" y="8" width="3.5" height="16" rx="1.75"/>
                    </svg>
                    <span>Chọn audio hoặc video</span>
                </button>
            `;
        }
    }

    function renderAudioLoadedInHero() {
        if (!selectedAudioFile) return;

        const heroCard = document.getElementById('audioStep1HeroCard');
        if (heroCard) {
            heroCard.innerHTML = `
                <div class="audio-loaded-card w-full flex items-center gap-3.5 p-3.5 mb-3">
                    <div class="audio-loaded-icon-box w-12 h-12 flex items-center justify-center shrink-0">
                        <svg viewBox="0 0 32 32" class="w-6 h-6 animate-pulse" fill="currentColor">
                            <rect x="6" y="10" width="3" height="12" rx="1.5"/>
                            <rect x="11" y="5" width="3" height="22" rx="1.5"/>
                            <rect x="16" y="12" width="3" height="8" rx="1.5"/>
                            <rect x="21" y="7" width="3" height="18" rx="1.5"/>
                        </svg>
                    </div>
                    <div class="flex-1 text-left min-w-0">
                        <h4 class="audio-loaded-name truncate">${selectedAudioFile.name}</h4>
                        <div class="flex items-center gap-2 mt-1">
                            <span class="audio-loaded-badge px-2 py-0.5">✓ Sẵn sàng</span>
                            <span class="audio-loaded-meta font-medium">${selectedAudioFile.duration} • ${selectedAudioFile.size}</span>
                        </div>
                    </div>
                </div>

                <div class="audio-waveform-box w-full flex items-center justify-center gap-1.5 h-12 px-4 py-2 mb-2">
                    <span class="audio-waveform-bar w-1 h-3 rounded-full animate-pulse" style="animation-delay: 0.1s"></span>
                    <span class="audio-waveform-bar w-1 h-6 rounded-full animate-pulse" style="animation-delay: 0.3s"></span>
                    <span class="audio-waveform-bar w-1 h-8 rounded-full animate-pulse" style="animation-delay: 0.15s"></span>
                    <span class="audio-waveform-bar w-1 h-4 rounded-full animate-pulse" style="animation-delay: 0.4s"></span>
                    <span class="audio-waveform-bar w-1 h-7 rounded-full animate-pulse" style="animation-delay: 0.25s"></span>
                    <span class="audio-waveform-bar w-1 h-5 rounded-full animate-pulse" style="animation-delay: 0.35s"></span>
                    <span class="audio-waveform-bar w-1 h-9 rounded-full animate-pulse" style="animation-delay: 0.2s"></span>
                    <span class="audio-waveform-bar w-1 h-4 rounded-full animate-pulse" style="animation-delay: 0.45s"></span>
                </div>
                <p class="audio-loaded-hint text-center">Nhấn nút bên dưới để Lumi phân tích transcript ngay.</p>
            `;
        }

        const actionsArea = document.getElementById('audioStep1ActionsArea');
        if (actionsArea) {
            actionsArea.innerHTML = `
                <button onclick="goToAudioStep(2)" class="audio-btn-primary w-full h-[52px] active:scale-[0.98] flex items-center justify-center gap-2 mt-4 cursor-pointer">
                    <span>Tiếp tục tách transcript</span>
                    <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                        <line x1="5" y1="12" x2="19" y2="12"></line>
                        <polyline points="12 5 19 12 12 19"></polyline>
                    </svg>
                </button>
                <button onclick="triggerAudioFileInput()" class="audio-btn-secondary w-full h-[46px] active:scale-[0.98] flex items-center justify-center gap-2 mt-2.5 cursor-pointer">
                    <span>Chọn file khác</span>
                </button>
            `;
        }
    }

    window.goToAudioStep = function (step) {
        if (typeof SoundEngine !== 'undefined' && SoundEngine.play) {
            SoundEngine.play(1);
        }
        setAudioFlowStep(step);
    };

    function setAudioFlowStep(step) {
        currentAudioStep = step;

        const titleEl = document.getElementById('audioScreenTitle');
        const badgeTextEl = document.getElementById('audioStepBadgeText');
        const totalTextEl = document.getElementById('audioStepTotalText');
        const subtitleEl = document.getElementById('audioScreenSubtitle');

        const step1Container = document.getElementById('audioStep1Container');
        const step2Container = document.getElementById('audioStep2Container');
        const step3Container = document.getElementById('audioStep3Container');

        if (badgeTextEl) badgeTextEl.textContent = `STEP ${step}`;
        if (totalTextEl) totalTextEl.textContent = ` / 3`;

        if (step === 1) {
            if (titleEl) titleEl.textContent = 'Chọn audio';
            if (subtitleEl) subtitleEl.textContent = 'Bắt đầu bằng 1 file audio rõ lời.';
            if (step1Container) step1Container.classList.remove('hidden');
            if (step2Container) step2Container.classList.add('hidden');
            if (step3Container) step3Container.classList.add('hidden');
        } else if (step === 2) {
            if (titleEl) titleEl.textContent = 'Xem transcript';
            if (subtitleEl) subtitleEl.textContent = 'Lumi đã bóc tách toàn bộ hội thoại & gán nhãn từ khóa.';
            if (step1Container) step1Container.classList.add('hidden');
            if (step2Container) step2Container.classList.remove('hidden');
            if (step3Container) step3Container.classList.add('hidden');
            renderStep2Transcript();
        } else if (step === 3) {
            if (titleEl) titleEl.textContent = 'Chọn từ vựng';
            if (subtitleEl) subtitleEl.textContent = 'Tick chọn các từ bạn muốn tạo Flashcard tự động.';
            if (step1Container) step1Container.classList.add('hidden');
            if (step2Container) step2Container.classList.add('hidden');
            if (step3Container) step3Container.classList.remove('hidden');
            if (typeof renderStep3Candidates === 'function') {
                renderStep3Candidates();
            }
        }

        const scrollArea = document.getElementById('audioScreenScrollContent');
        if (scrollArea) scrollArea.scrollTo({ top: 0, behavior: 'smooth' });
    }

    function renderStep2Transcript() {
        const step2Container = document.getElementById('audioStep2Container');
        if (!step2Container) return;

        const fileName = selectedAudioFile ? selectedAudioFile.name : 'English_Daily_Podcast_Ep42.mp3';

        step2Container.innerHTML = `
            <div class="audio-player-card w-full p-4 flex flex-col gap-2.5 mb-4 shadow-sm">
                <div class="flex items-center justify-between">
                    <div class="flex items-center gap-2.5 min-w-0">
                        <button id="audioPlayToggleBtn" onclick="toggleAudioPlayback()" class="audio-play-btn w-9 h-9 flex items-center justify-center font-black active:scale-90 transition-transform cursor-pointer shadow-xs shrink-0">
                            <svg id="audioPlayIcon" viewBox="0 0 24 24" class="w-4 h-4" fill="currentColor">
                                <polygon points="6 4 20 12 6 20 6 4"></polygon>
                            </svg>
                        </button>
                        <div class="truncate">
                            <p class="audio-track-title truncate">${fileName}</p>
                            <p id="audioPlaybackTimerText" class="audio-track-timer font-medium">0:00 / 2:45</p>
                        </div>
                    </div>
                    <span class="audio-whisper-badge px-2.5 py-1 text-[10.5px] font-bold shrink-0">
                        ⚡ Whisper AI 99.2%
                    </span>
                </div>
                <div class="audio-track-bar w-full h-1.5 rounded-full overflow-hidden cursor-pointer" onclick="seekAudioTrack(event)">
                    <div id="audioProgressBar" class="audio-track-progress h-full rounded-full transition-all duration-200" style="width: 12%"></div>
                </div>
            </div>

            <div class="audio-ai-banner w-full p-3.5 flex items-center gap-3 mb-4">
                <span class="text-xl shrink-0">✨</span>
                <p class="audio-ai-banner-text text-[12.5px] font-medium leading-relaxed">
                    AI đã phân tích ngữ cảnh và tìm thấy <b class="audio-ai-banner-highlight">6 từ vựng hữu ích</b> (B2-C1) trong đoạn hội thoại này.
                </p>
            </div>

            <div class="audio-transcript-card w-full p-4.5 flex flex-col gap-3 text-left mb-5">
                <div class="audio-transcript-header flex items-center justify-between pb-2">
                    <span class="audio-transcript-title text-[12px] font-bold uppercase tracking-wider">Bản ghi lời thoại (Transcript)</span>
                    <span class="audio-transcript-hint text-[11px] font-semibold">Nhấn vào từ in đậm để xem nhanh</span>
                </div>

                <div class="audio-transcript-content text-[13.5px] leading-relaxed space-y-3 font-normal">
                    <p>
                        <span class="audio-timestamp-pill text-[11px] font-bold px-1.5 py-0.5 mr-1.5">00:04</span>
                        In the face of unexpected challenges, people who are naturally 
                        <span class="transcript-keyword cursor-pointer font-bold px-1.5 py-0.5" onclick="quickLookAudioWord('resilient', 'Kiên cường, phục hồi nhanh')">resilient</span> 
                        tend to thrive rather than succumb to anxiety.
                    </p>
                    <p>
                        <span class="audio-timestamp-pill text-[11px] font-bold px-1.5 py-0.5 mr-1.5">00:48</span>
                        Sometimes, life presents us with moments of pure 
                        <span class="transcript-keyword cursor-pointer font-bold px-1.5 py-0.5" onclick="quickLookAudioWord('serendipity', 'Sự tình cờ may mắn')">serendipity</span>, 
                        opening doors we never even knew existed before.
                    </p>
                    <p>
                        <span class="audio-timestamp-pill text-[11px] font-bold px-1.5 py-0.5 mr-1.5">01:25</span>
                        Every achievement requires 
                        <span class="transcript-keyword cursor-pointer font-bold px-1.5 py-0.5" onclick="quickLookAudioWord('meticulous', 'Tỉ mỉ, cẩn thận')">meticulous</span> 
                        planning and unyielding 
                        <span class="transcript-keyword cursor-pointer font-bold px-1.5 py-0.5" onclick="quickLookAudioWord('perseverance', 'Sự kiên trì, bền bỉ')">perseverance</span>. 
                        When speakers are truly 
                        <span class="transcript-keyword cursor-pointer font-bold px-1.5 py-0.5" onclick="quickLookAudioWord('eloquent', 'Hùng biện, lưu loát')">eloquent</span>, 
                        they eliminate all 
                        <span class="transcript-keyword cursor-pointer font-bold px-1.5 py-0.5" onclick="quickLookAudioWord('ambiguity', 'Sự mơ hồ')">ambiguity</span> 
                        from their core message.
                    </p>
                </div>
            </div>

            <button onclick="goToAudioStep(3)" class="audio-btn-primary w-full h-[52px] active:scale-[0.98] flex items-center justify-center gap-2 cursor-pointer">
                <span>Phân tích & Chọn từ vựng (6 từ)</span>
                <svg viewBox="0 0 24 24" class="w-5 h-5" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
                    <line x1="5" y1="12" x2="19" y2="12"></line>
                    <polyline points="12 5 19 12 12 19"></polyline>
                </svg>
            </button>
            <button onclick="goToAudioStep(1)" class="audio-btn-secondary w-full h-[46px] active:scale-[0.98] flex items-center justify-center gap-2 mt-2.5 cursor-pointer">
                <span>Quay lại Bước 1</span>
            </button>
        `;
    }

    window.quickLookAudioWord = function (word, meaning) {
        if (typeof showEntranceToast === 'function') {
            showEntranceToast(`📖 ${word}: ${meaning}`);
        }
    };

    window.openAudioVideoDialog = function () {
        window.openAudioVideoScreen();
    };

})();
