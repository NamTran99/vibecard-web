        // ================= TYPEWRITER EFFECT LOGIC =================
        const typePhrases = [
            "Từ vựng, idioms, ngữ cảnh...",
            "Gõ 'resilient' để xem chi tiết",
            "Tra từ vựng theo chủ đề",
            "Mở khoá sức mạnh AI..."
        ];
        let typePhraseIndex = 0;
        let charIndex = 0;
        let isDeleting = false;
        let typewriterTimeout = null;
        let isTypewriterActive = true;

        function runTypewriter() {
            if (!isTypewriterActive) return;
            
            const input = document.getElementById('dictInput');
            if (!input) return;
            
            const currentPhrase = typePhrases[typePhraseIndex];
            
            if (isDeleting) {
                input.placeholder = currentPhrase.substring(0, charIndex - 1);
                charIndex--;
            } else {
                input.placeholder = currentPhrase.substring(0, charIndex + 1);
                charIndex++;
            }
            
            let typingSpeed = isDeleting ? 30 : 70;
            
            if (!isDeleting && charIndex === currentPhrase.length) {
                typingSpeed = 2000;
                isDeleting = true;
            } else if (isDeleting && charIndex === 0) {
                isDeleting = false;
                typePhraseIndex = (typePhraseIndex + 1) % typePhrases.length;
                typingSpeed = 500;
            }
            
            typewriterTimeout = setTimeout(runTypewriter, typingSpeed);
        }

        function stopTypewriter() {
            isTypewriterActive = false;
            if (typewriterTimeout) clearTimeout(typewriterTimeout);
        }

        function startTypewriter() {
            isTypewriterActive = true;
            charIndex = 0;
            isDeleting = false;
            typewriterTimeout = setTimeout(runTypewriter, 600);
        }

        setTimeout(runTypewriter, 1200);