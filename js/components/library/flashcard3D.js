        // ================= FLASHCARD 3D LOGIC =================
        let isFlashcardFlipped = false;

        function openFlashcardPreview(stagedIndex) {
            const item = stagedWords[stagedIndex];
            if (!item) return;

            document.getElementById('fcFrontWord').innerText = item.word;
            document.getElementById('fcFrontType').innerText = item.type;
            const meaning = (item.meanings && item.meanings.length > 0) ? item.meanings[0] : {};
            document.getElementById('fcFrontExample').innerText = meaning.example || item.example || "Không có ví dụ nào được cung cấp cho từ này.";
            
            document.getElementById('fcBackWord').innerText = item.word;
            document.getElementById('fcBackMeaning').innerText = meaning.text || item.meaningVi || "";
            
            let usage = "thường dùng trong văn viết và giao tiếp trang trọng.";
            if (item.type.includes('Verb')) usage = "thường dùng sau chủ ngữ hoặc trợ động từ.";
            if (item.type.includes('Adjective')) usage = "thường đứng trước danh từ để bổ nghĩa.";
            document.getElementById('fcBackUsage').innerText = usage;

            isFlashcardFlipped = false;
            document.getElementById('flashcard3D').style.transform = 'rotateY(0deg)';

            const modal = document.getElementById('flashcardModal');
            modal.classList.remove('hidden');
            setTimeout(() => {
                modal.classList.remove('opacity-0');
                modal.classList.add('opacity-100');
            }, 10);
        }

        function closeFlashcardPreview() {
            const modal = document.getElementById('flashcardModal');
            modal.classList.remove('opacity-100');
            modal.classList.add('opacity-0');
            setTimeout(() => {
                modal.classList.add('hidden');
            }, 300);
        }

        
        
        // ================= CARD GESTURES (LONG PRESS & FLIP) =================
        function resetChargeEffect(card) {
            if (card.children.length >= 2 && card.children[0].classList.contains('card-charging-active')) {
                card.children[0].classList.remove('card-charging-active');
                card.children[1].classList.remove('card-charging-active');
                card.children[0].classList.add('card-charging-reset');
                card.children[1].classList.add('card-charging-reset');
                setTimeout(() => {
                    card.children[0].classList.remove('card-charging-reset');
                    card.children[1].classList.remove('card-charging-reset');
                }, 400);
            }
            // Remove overlay
            const overlay = card.querySelector('.charge-edit-overlay');
            if (overlay) {
                overlay.style.opacity = '0';
                const content = overlay.querySelector('.charge-content');
                if (content) {
                    content.style.transform = 'scale(1.2)';
                    content.style.opacity = '0';
                }
                setTimeout(() => overlay.remove(), 400);
            }
        }

        function handleCardPointerDown(e, card, mode, word, meaningVi, type) {
            if (e && e.target && e.target.closest('button, a, input, select, textarea, .card-tab-content-box, .sliding-pill, [onclick*="stopPropagation"], .example-translate-btn')) {
                return;
            }
            card.dataset.pressY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
            card.dataset.isPressed = 'true';
            card.dataset.pressTime = Date.now();
            card._isLongPress = false;
            
            // Trigger visual charge
            if (card.children.length >= 2) {
                card.children[0].classList.remove('card-charging-reset');
                card.children[1].classList.remove('card-charging-reset');
                card.children[0].classList.add('card-charging-active');
                card.children[1].classList.add('card-charging-active');
                
                // Add Edit Transition Overlay
                if (mode === 'staged') {
                    const frontFace = card.children[0];
                    let overlay = frontFace.querySelector('.charge-edit-overlay');
                    if (!overlay) {
                        overlay = document.createElement('div');
                        overlay.className = 'charge-edit-overlay absolute inset-0 bg-[#0D0E0B]/85 backdrop-blur-md z-50 rounded-[32px] flex items-center justify-center opacity-0 pointer-events-none';
                        overlay.style.transition = 'opacity 0.6s cubic-bezier(0.4, 0, 0.2, 1)';
                        overlay.innerHTML = `
                            <!-- Ánh sáng lướt qua (Light Sweep) -->
                            <div class="charge-sweep absolute top-0 -left-[50%] w-[50%] h-[150%] bg-gradient-to-r from-transparent via-[#B8D166]/50 to-transparent -skew-x-[25deg] pointer-events-none" style="transform: translateX(-150%); transition: transform 0.6s cubic-bezier(0.2, 0, 0, 1);"></div>
                            
                            <div class="charge-content flex flex-col items-center opacity-0 z-10" style="transform: scale(0.6); transition: all 0.6s cubic-bezier(0.4, 0, 0.2, 1);">
                                <div class="w-16 h-16 rounded-full bg-[#3C4D00] flex items-center justify-center text-[#D4EE7F] ring-1 ring-[#B8D166]/40 mb-3 shadow-[0_0_40px_rgba(184,209,102,0.3)]">
                                    <svg class="w-8 h-8" fill="none" stroke="currentColor" stroke-width="2" viewBox="0 0 24 24"><path stroke-linecap="round" stroke-linejoin="round" d="M16.862 4.487l1.687-1.688a1.875 1.875 0 112.652 2.652L6.832 19.82a4.5 4.5 0 01-1.89 1.147l-2.84 1.05a.75.75 0 01-.95-.95l1.05-2.84a4.5 4.5 0 011.147-1.89l13.528-13.528z"/><path stroke-linecap="round" stroke-linejoin="round" d="M19.5 7.125L16.862 4.487"/></svg>
                                </div>
                                <span class="text-[#D4EE7F] font-black text-[12px] tracking-[0.2em] uppercase">Chuẩn bị sửa</span>
                            </div>
                        `;
                        frontFace.appendChild(overlay);
                        
                        requestAnimationFrame(() => {
                            overlay.style.opacity = '1';
                            
                            // Trigger sweep
                            const sweep = overlay.querySelector('.charge-sweep');
                            if (sweep) sweep.style.transform = 'translateX(400%)';
                            
                            const content = overlay.querySelector('.charge-content');
                            content.style.transform = 'scale(1)';
                            content.style.opacity = '1';
                        });
                    }
                }
            }

            card._timer = setTimeout(() => {
                card._isLongPress = true;
                resetChargeEffect(card);
                
                if (navigator.vibrate) navigator.vibrate([20, 30, 20]);
                if (mode === 'staged') {
                    if (typeof openManualMeaningModal === 'function') openManualMeaningModal(word, meaningVi, type);
                } else {
                    if (typeof showDictToast === 'function') showDictToast('Vui lòng quay lại Danh sách để sửa nội dung thẻ nhé!');
                }
            }, 600);
        }
        
        function handleCardPointerUp(e, card) {
            card.dataset.isPressed = '';
            clearTimeout(card._timer);
            if (!card._isLongPress) resetChargeEffect(card);
        }
        
        function handleCardPointerMove(e, card) {
            if (!card.dataset.isPressed) return;
            const currentY = e.clientY || (e.touches && e.touches[0].clientY) || 0;
            if (Math.abs(currentY - card.dataset.pressY) > 10) {
                card.dataset.isPressed = '';
                clearTimeout(card._timer);
                if (!card._isLongPress) resetChargeEffect(card);
            }
        }
        
        function handleCardPointerLeave(e, card) {
            card.dataset.isPressed = '';
            clearTimeout(card._timer);
            if (!card._isLongPress) resetChargeEffect(card);
            
        }
        function handleCardClick(e, card) {
            if (e && e.target && e.target.closest('button, a, input, select, textarea, .card-tab-content-box, .sliding-pill, [onclick*="stopPropagation"], .example-translate-btn')) {
                return;
            }
            const pressTime = parseInt(card.dataset.pressTime) || 0;
            const duration = Date.now() - pressTime;
            
            if (card._isLongPress || duration > 250) {
                card._isLongPress = false;
                return;
            }
            const toBack = !card.style.transform.includes('rotateY(180deg)'); 
            if(typeof playFlip === 'function') playFlip(toBack); 
            card.style.transform = toBack ? 'scale(1.05) rotateX(0deg) rotateY(180deg)' : 'scale(1.02) rotateX(0deg) rotateY(0deg)'; 
            
            // Toggle pointer-events on front & back face so inactive face never intercepts clicks
            if (card.children.length >= 2) {
                card.children[0].style.pointerEvents = toBack ? 'none' : 'auto';
                card.children[1].style.pointerEvents = toBack ? 'auto' : 'none';
            }

            setTimeout(() => { 
                card.style.transform = toBack ? 'scale(1.0) rotateX(0deg) rotateY(180deg)' : 'scale(1.0) rotateX(0deg) rotateY(0deg)'; 
            }, 300); 
            if(navigator.vibrate) navigator.vibrate(10);
        }

        // ================= HOLOGRAPHIC TILT EFFECT =================
        function handleCardTilt(e, card) {
            if(card.style.transform && card.style.transform.includes('rotateY(180deg)')) return;
            
            card.classList.remove('tilt-reset');
            const rect = card.getBoundingClientRect();
            
            const x = (e.clientX - rect.left) / rect.width - 0.5;
            const y = (e.clientY - rect.top) / rect.height - 0.5;
            
            const tiltX = y * -20; 
            const tiltY = x * 20;
            
            // Need to preserve rotateY if it's 0deg, but for front face it's fine to just set it
            card.style.transform = `rotateX(${tiltX}deg) rotateY(${tiltY}deg)`;
            
            const overlay = card.querySelector('.holographic-overlay');
            if (overlay) {
                const posX = (x + 0.5) * 100;
                const posY = (y + 0.5) * 100;
                overlay.style.setProperty('--pos-x', `${posX}%`);
                overlay.style.setProperty('--pos-y', `${posY}%`);
            }
        }

        function resetCardTilt(card) {
            if(card.style.transform && card.style.transform.includes('rotateY(180deg)')) return;
            
            card.classList.add('tilt-reset');
            card.style.transform = 'rotateX(0deg) rotateY(0deg)';
            
            const overlay = card.querySelector('.holographic-overlay');
            if (overlay) {
                overlay.style.setProperty('--pos-x', `50%`);
                overlay.style.setProperty('--pos-y', `50%`);
            }
        }

        function flipFlashcard() {
            isFlashcardFlipped = !isFlashcardFlipped;
            const card = document.getElementById('flashcard3D');
            if (isFlashcardFlipped) {
                card.style.transform = 'rotateY(180deg)';
            } else {
                card.style.transform = 'rotateY(0deg)';
            }
        }
        // =======================================================

        
        // ================= FLUID TABS LOGIC =================
        function switchFlashcardTabFluid(btn, cardIdx, tabName, posIndex, sourceArrayName) {
            event.stopPropagation();
            const container = btn.parentElement;
            
            // Move sliding pill
            const pill = container.querySelector('.sliding-pill');
            if (pill) {
                pill.style.transform = `translateX(${posIndex * 100}%)`;
            }
            
            // Update button styles
            const buttons = container.querySelectorAll('button');
            buttons.forEach((b, i) => {
                if(i === posIndex) {
                    b.classList.remove('text-white/40', 'hover:text-white/70');
                    b.classList.add('text-white');
                } else {
                    b.classList.remove('text-white');
                    b.classList.add('text-white/40', 'hover:text-white/70');
                }
            });
            
            // Update content text
            const contentBox = container.nextElementSibling;
            if (!contentBox) return;
            const contentP = contentBox.querySelector('p');
            if (!contentP) return;
            
            // Get item from correct array
            const item = sourceArrayName === 'review' ? reviewSessionWords[cardIdx] : stagedWords[cardIdx];
            if (!item) return;
            
            let meaning = {};
            if (typeof item.meaning === 'string') {
                try {
                    meaning = (item.meaning.startsWith('{') || item.meaning.startsWith('[')) ? JSON.parse(item.meaning) : { text: item.meaning };
                } catch (_) {
                    meaning = { text: item.meaning };
                }
            } else if (item.meanings && item.meanings.length > 0) {
                meaning = item.meanings[0];
            } else {
                meaning = item.meaning || {};
            }
            
            contentBox.classList.remove('opacity-100');
            contentBox.classList.add('opacity-0', 'scale-95');
            
            setTimeout(() => {
                if (tabName === 'example') {
                    contentBox.innerHTML = `
                        <div class="absolute top-0 left-3 text-[64px] font-serif text-white/[0.03] leading-none pointer-events-none select-none transition-transform group-hover:scale-110">"</div>
                        ${renderExampleContent(item, meaning, cardIdx, sourceArrayName)}
                    `;
                } else if (tabName === 'mnemonic') {
                    const wordLower = item.word ? item.word.toLowerCase() : '';
                    let mnemonicHtml = meaning.mnemonic || '';
                    if (!mnemonicHtml) {
                        if (wordLower === 'resilient') {
                            mnemonicHtml = 'Mẹo nhớ: <span class="text-[var(--m3-primary)] font-bold">RỄ cây SI LIỀN</span> lại rất nhanh dù bị đứt -> Rất kiên cường.';
                        } else if (wordLower === 'meticulous') {
                            mnemonicHtml = 'Mẹo nhớ: <span class="text-[var(--m3-primary)] font-bold">MÊ TÌM TỈ MỈ</span> từng hạt cát -> Tỉ mỉ, chu đáo từng chút một.';
                        } else if (wordLower === 'serendipity') {
                            mnemonicHtml = 'Mẹo nhớ: <span class="text-[var(--m3-primary)] font-bold">Sợ Rớt Đi Thi</span> nhưng vô tình lại đỗ Thủ khoa -> Sự may mắn tình cờ.';
                        } else {
                            mnemonicHtml = 'Mẹo nhớ: Tưởng tượng từ <span class="text-[var(--m3-primary)] font-bold">' + item.word + '</span> gắn với âm thanh hoặc hình ảnh quen thuộc để nhớ lâu hơn!';
                        }
                    }
                    contentBox.innerHTML = `
                        <p class="text-[13px] font-medium text-white/80 text-center leading-relaxed relative z-10 px-2">
                            ${mnemonicHtml}
                        </p>
                    `;
                } else if (tabName === 'synonym') {
                    const data = (typeof fullDictData !== 'undefined' ? fullDictData[item.word ? item.word.toLowerCase() : ''] : null) || (typeof generateSmartDictEntry === 'function' ? generateSmartDictEntry(item.word) : null);
                    let syns = [];
                    if (meaning.synonyms && meaning.synonyms.length > 0) {
                        syns = meaning.synonyms;
                    } else if (data && data.synonyms && data.synonyms.length > 0) {
                        syns = data.synonyms.map(s => s.word);
                    }
                    if (syns.length > 0) {
                        contentBox.innerHTML = `
                            <div class="flex flex-wrap items-center justify-center gap-1.5 relative z-10 px-1">
                                ${syns.map(s => `<span class="px-2.5 py-1 rounded-full bg-[#214E46] border border-[#A1D0C5]/30 text-[#BDECE1] text-[12px] font-medium">${s}</span>`).join('')}
                            </div>
                        `;
                    } else {
                        contentBox.innerHTML = `
                            <p class="text-[13px] font-medium text-white/50 text-center leading-relaxed relative z-10 px-2">
                                Chưa có dữ liệu từ đồng nghĩa.
                            </p>
                        `;
                    }
                }
                contentBox.classList.remove('opacity-0', 'scale-95');
                contentBox.classList.add('opacity-100');
            }, 150);
        }
        // ================= FLASHCARD BACK TABS LOGIC =================

        function switchFlashcardTab(btn, cardIdx, tabName) {
            event.stopPropagation();
            
            const tabsContainer = btn.parentElement;
            
            // Reset all buttons in this container
            const buttons = tabsContainer.querySelectorAll('button');
            buttons.forEach(b => {
                b.className = "flex-1 min-w-[70px] py-1.5 rounded-lg text-white/40 font-medium text-[12px] hover:text-white/70 transition-all cursor-pointer";
            });
            
            // Set active button
            btn.className = "flex-1 min-w-[70px] py-1.5 rounded-lg bg-white/10 text-white font-medium text-[12px] shadow-sm transition-all cursor-pointer";
            
            // Find content box
            const contentBox = tabsContainer.nextElementSibling;
            if (!contentBox) return;
            const contentP = contentBox.querySelector('p');
            if (!contentP) return;
            
            const item = stagedWords[cardIdx];
            if (!item) return;
            
            const meaning = item.meanings && item.meanings.length > 0 ? item.meanings[0] : {};
            
            // Add fade animation
            contentP.style.opacity = '0';
            setTimeout(() => {
                if (tabName === 'usage') {
                    let usage = "thường dùng trong văn viết và ngữ cảnh học thuật";
                    if (item.type.includes('Verb')) usage = "thường dùng sau chủ ngữ hoặc trợ động từ.";
                    if (item.type.includes('Adjective')) usage = "thường đứng trước danh từ để bổ nghĩa.";
                    contentP.innerText = usage;
                } else if (tabName === 'mnemonic') {
                    const wordLower = item.word.toLowerCase();
                    if (wordLower === 'resilient') {
                        contentP.innerHTML = 'Mẹo nhớ: <span class="text-[var(--m3-primary)] font-bold">RỄ cây SI LIỀN</span> lại rất nhanh dù bị đứt -> Rất kiên cường.';
                    } else if (wordLower === 'ubiquitous') {
                        contentP.innerHTML = 'Mẹo nhớ: <span class="text-[var(--m3-primary)] font-bold">U BI QUY TỤ</span> ở khắp mọi nơi -> Có mặt ở khắp nơi.';
                    } else if (wordLower === 'serendipity') {
                        contentP.innerHTML = 'Mẹo nhớ: <span class="text-[var(--m3-primary)] font-bold">Sợ Rớt Đi Thi</span> nhưng vô tình lại đậu Thủ khoa -> Sự may mắn tình cờ.';
                    } else {
                        contentP.innerHTML = 'Mẹo nhớ: Hãy tưởng tượng từ <span class="text-[var(--m3-primary)] font-bold">' + item.word + '</span> giống như một thứ gì đó quen thuộc để não bộ ghi nhớ lâu hơn!';
                    }
                } else if (tabName === 'synonym') {
                    const data = (typeof fullDictData !== 'undefined' ? fullDictData[item.word.toLowerCase()] : null) || (typeof generateSmartDictEntry === 'function' ? generateSmartDictEntry(item.word.toLowerCase()) : null);
                    if (data && data.synonyms && data.synonyms.length > 0) {
                        contentP.innerText = data.synonyms.map(s => s.word).join(', ');
                    } else {
                        contentP.innerText = "Chưa có dữ liệu đồng nghĩa.";
                    }
                }
                contentP.style.transition = 'opacity 0.2s';
                contentP.style.opacity = '1';
            }, 150);
        }
