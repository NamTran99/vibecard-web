// ========================================================
// 🌓 THEME MANAGER (DARK / LIGHT / SYSTEM SPEC)
// ========================================================

// =======================================================
        // M3 THEME SWITCHER CONTROLLER (DARK / LIGHT / SYSTEM)
        // =======================================================
        function openThemeSheet() {
            const modal = document.getElementById('themeBottomSheetModal');
            const content = document.getElementById('themeBottomSheetContent');
            if (!modal || !content) return;
            updateThemeSheetUI();
            modal.classList.remove('hidden');
            void modal.offsetWidth;
            modal.classList.remove('opacity-0');
            content.classList.remove('translate-y-full');
            
        }

        function closeThemeSheet() {
            const modal = document.getElementById('themeBottomSheetModal');
            const content = document.getElementById('themeBottomSheetContent');
            if (!modal || !content) return;
            modal.classList.add('opacity-0');
            content.classList.add('translate-y-full');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }

        function setThemeMode(mode) {
            try {
                localStorage.setItem('mindcard-theme-mode', mode);
            } catch (e) {}
            applyThemeMode(mode);
            updateThemeSheetUI();
            
            setTimeout(() => {
                closeThemeSheet();
            }, 260);
        }

        function applyThemeMode(mode) {
            let isDark = true;
            if (mode === 'light') {
                isDark = false;
            } else if (mode === 'system') {
                isDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
            } else {
                isDark = true;
            }

            if (isDark) {
                document.documentElement.classList.remove('light');
                document.documentElement.classList.add('dark');
            } else {
                document.documentElement.classList.remove('dark');
                document.documentElement.classList.add('light');
            }

            const subtextEl = document.getElementById('themeSettingSubtext');
            const badgeEl = document.getElementById('themeSettingBadge');
            const iconSvg = document.getElementById('themeSettingIconSvg');

            const modeLabels = {
                'dark': { text: 'Giao diện Tối · Bảo vệ mắt', badge: 'Tối', icon: '<path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>' },
                'light': { text: 'Giao diện Sáng · Nền giấy ấm', badge: 'Sáng', icon: '<circle cx="12" cy="12" r="5"></circle><line x1="12" y1="1" x2="12" y2="3"></line><line x1="12" y1="21" x2="12" y2="23"></line><line x1="4.22" y1="4.22" x2="5.64" y2="5.64"></line><line x1="18.36" y1="18.36" x2="19.78" y2="19.78"></line><line x1="1" y1="12" x2="3" y2="12"></line><line x1="21" y1="12" x2="23" y2="12"></line><line x1="4.22" y1="19.78" x2="5.64" y2="18.36"></line><line x1="18.36" y1="5.64" x2="19.78" y2="4.22"></line>' },
                'system': { text: 'Tự động theo thiết bị', badge: 'Hệ thống', icon: '<circle cx="12" cy="12" r="3"></circle><path d="M19.4 15a1.65 1.65 0 0 0 .33 1.82l.06.06a2 2 0 0 1 0 2.83 2 2 0 0 1-2.83 0l-.06-.06a1.65 1.65 0 0 0-1.82-.33 1.65 1.65 0 0 0-1 1.51V21a2 2 0 0 1-2 2 2 2 0 0 1-2-2v-.09A1.65 1.65 0 0 0 9 19.4a1.65 1.65 0 0 0-1.82.33l-.06.06a2 2 0 0 1-2.83 0 2 2 0 0 1 0-2.83l.06-.06a1.65 1.65 0 0 0 .33-1.82 1.65 1.65 0 0 0-1.51-1H3a2 2 0 0 1-2-2 2 2 0 0 1 2-2h.09A1.65 1.65 0 0 0 4.6 9a1.65 1.65 0 0 0-.33-1.82l-.06-.06a2 2 0 0 1 0-2.83 2 2 0 0 1 2.83 0l.06.06a1.65 1.65 0 0 0 1.82.33H9a1.65 1.65 0 0 0 1-1.51V3a2 2 0 0 1 2-2 2 2 0 0 1 2 2v.09a1.65 1.65 0 0 0 1 1.51 1.65 1.65 0 0 0 1.82-.33l.06-.06a2 2 0 0 1 2.83 0 2 2 0 0 1 0 2.83l-.06.06a1.65 1.65 0 0 0-.33 1.82V9a1.65 1.65 0 0 0 1.51 1H21a2 2 0 0 1 2 2 2 2 0 0 1-2 2h-.09a1.65 1.65 0 0 0-1.51 1z"></path>' }
            };

            const currentMeta = modeLabels[mode] || modeLabels['dark'];
            if (subtextEl) subtextEl.textContent = currentMeta.text;
            if (badgeEl) badgeEl.textContent = currentMeta.badge;
            if (iconSvg) iconSvg.innerHTML = currentMeta.icon;

            // Synchronize All Quick Toggle Buttons Across UI
            updateQuickThemeButtons(isDark);
        }

        function updateQuickThemeButtons(isDark) {
            // 0. External segmented Dark / Light buttons outside mobile phone frame
            const extDarkBtn = document.getElementById('extThemeBtnDark');
            const extLightBtn = document.getElementById('extThemeBtnLight');
            if (extDarkBtn && extLightBtn) {
                extDarkBtn.classList.toggle('active', Boolean(isDark));
                extLightBtn.classList.toggle('active', !isDark);
            }

            // 1. Desktop floating theme toggle button (legacy fallback)
            const topSlot = document.getElementById('topThemeIconSlot');
            const topBtn = document.getElementById('topThemeToggleBtn');
            const topLabel = document.getElementById('topThemeTextLabel');
            if (topSlot) {
                if (isDark) {
                    if (topBtn) topBtn.title = "Đang ở chế độ Tối • Chạm để đổi sang Sáng";
                    if (topLabel) topLabel.textContent = "Giao diện Tối";
                } else {
                    if (topBtn) topBtn.title = "Đang ở chế độ Sáng • Chạm để đổi sang Tối";
                    if (topLabel) topLabel.textContent = "Giao diện Sáng";
                }
            }

            // 2. Dictionary Screen top bar button
            const dictSlot = document.getElementById('dictThemeIconSlot');
            const dictBtn = document.getElementById('dictThemeToggleBtn');
            if (dictSlot) {
                if (isDark) {
                    dictSlot.innerHTML = `
                        <svg class="w-4 h-4 text-amber-400 group-hover:rotate-45 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                            <circle cx="12" cy="12" r="5"></circle>
                            <line x1="12" y1="1" x2="12" y2="3"></line>
                            <line x1="12" y1="21" x2="12" y2="23"></line>
                        </svg>
                    `;
                    if (dictBtn) dictBtn.title = "Chuyển sang chế độ Sáng";
                } else {
                    dictSlot.innerHTML = `
                        <svg class="w-4 h-4 text-primary group-hover:-rotate-12 transition-transform duration-300" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2" stroke-linecap="round" stroke-linejoin="round">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                        </svg>
                    `;
                    if (dictBtn) dictBtn.title = "Chuyển sang chế độ Tối";
                }
            }

            // 3. Profile Screen Quick Toggle Switch
            const profileThumb = document.getElementById('profileThemeSwitchThumb');
            const profileSwitch = document.getElementById('profileThemeQuickSwitch');
            if (profileThumb && profileSwitch) {
                if (isDark) {
                    profileThumb.style.transform = 'translateX(0px)';
                    profileSwitch.classList.remove('bg-primary/25');
                    profileSwitch.classList.add('bg-surfaceContainerHighest');
                    profileThumb.innerHTML = `
                        <svg class="w-3 h-3" style="color: #141C00;" viewBox="0 0 24 24" fill="currentColor">
                            <path d="M21 12.79A9 9 0 1 1 11.21 3 7 7 0 0 0 21 12.79z"></path>
                        </svg>
                    `;
                } else {
                    profileThumb.style.transform = 'translateX(22px)';
                    profileSwitch.classList.remove('bg-surfaceContainerHighest');
                    profileSwitch.classList.add('bg-primary/25');
                    profileThumb.innerHTML = `
                        <svg class="w-3 h-3" style="color: #FFFFFF;" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3">
                            <circle cx="12" cy="12" r="5"></circle>
                        </svg>
                    `;
                }
            }
        }

        function toggleThemeModeQuick() {
            let current = 'dark';
            try {
                current = localStorage.getItem('mindcard-theme-mode') || 'dark';
            } catch (e) {}

            let nextMode = 'light';
            if (current === 'light') {
                nextMode = 'dark';
            } else if (current === 'dark') {
                nextMode = 'light';
            } else {
                const isSystemDark = window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches;
                nextMode = isSystemDark ? 'light' : 'dark';
            }

            setThemeMode(nextMode);

            
        }

        function updateThemeSheetUI() {
            let currentMode = 'dark';
            try {
                currentMode = localStorage.getItem('mindcard-theme-mode') || 'dark';
            } catch (e) {}

            ['dark', 'light', 'system'].forEach(m => {
                const optionEl = document.getElementById('themeOption-' + m);
                const checkEl = document.getElementById('themeCheck-' + m);
                if (!optionEl || !checkEl) return;

                if (m === currentMode) {
                    optionEl.classList.remove('border-outlineVariant');
                    optionEl.classList.add('border-primary', 'bg-primaryContainer/20');
                    checkEl.innerHTML = `
                        <div class="w-6 h-6 rounded-full bg-primary flex items-center justify-center text-onPrimary shadow-sm">
                            <svg class="w-4 h-4" fill="none" stroke="currentColor" stroke-width="3" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M4.5 12.75l6 6 9-13.5"/></svg>
                        </div>
                    `;
                } else {
                    optionEl.classList.remove('border-primary', 'bg-primaryContainer/20');
                    optionEl.classList.add('border-outlineVariant');
                    checkEl.innerHTML = `<span class="text-[12px] font-semibold text-textTertiary group-hover:text-textPrimary">Chọn</span>`;
                }
            });
        }
