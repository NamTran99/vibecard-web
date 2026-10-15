(function(window) {
    'use strict';

    window.LumiWakeupEffects = {
        createShockwave: function() {
            const stage = document.querySelector('.lumi-stage-container');
            if (!stage) return;
            const wave = document.createElement('div');
            wave.className = 'lumi-tap-shockwave';
            stage.appendChild(wave);
            setTimeout(() => wave.remove(), 750);
        },

        createSparksBurst: function(count = 16) {
            const stage = document.querySelector('.lumi-stage-container');
            if (!stage) return;
            for (let i = 0; i < count; i++) {
                const spark = document.createElement('div');
                spark.className = 'lumi-burst-spark';
                const angle = Math.random() * Math.PI * 2;
                const distance = Math.random() * 85 + 35;
                spark.style.setProperty('--tx', `${(Math.cos(angle) * distance).toFixed(1)}px`);
                spark.style.setProperty('--ty', `${(Math.sin(angle) * distance).toFixed(1)}px`);
                spark.style.left = '50%';
                spark.style.top = '50%';
                stage.appendChild(spark);
                setTimeout(() => spark.remove(), 820);
            }
        },

        generateSparklesHTML: function() {
            let html = '';
            for (let i = 0; i < 18; i++) {
                const top = Math.random() * 80 + 10;
                const left = Math.random() * 80 + 10;
                const delay = (Math.random() * 3).toFixed(2);
                const size = Math.floor(Math.random() * 4) + 2;
                html += `<span class="lumi-floating-star" style="top: ${top}%; left: ${left}%; width: ${size}px; height: ${size}px; animation-delay: ${delay}s;"></span>`;
            }
            return html;
        },

        playDreamChime: function(notes) {
            if (!notes || notes.length === 0) return;
            try {
                const AudioContext = window.AudioContext || window.webkitAudioContext;
                if (!AudioContext) return;
                const ctx = new AudioContext();
                const now = ctx.currentTime;

                notes.forEach((freq, index) => {
                    const osc = ctx.createOscillator();
                    const gain = ctx.createGain();
                    const start = now + index * 0.08;

                    osc.type = 'sine';
                    osc.frequency.setValueAtTime(freq, start);
                    gain.gain.setValueAtTime(0, start);
                    gain.gain.linearRampToValueAtTime(0.22, start + 0.03);
                    gain.gain.exponentialRampToValueAtTime(0.001, start + 1.1);

                    osc.connect(gain);
                    gain.connect(ctx.destination);
                    osc.start(start);
                    osc.stop(start + 1.2);
                });
            } catch (e) {
                console.log('Web Audio note chime:', e);
            }
        },

        fireCutFlash: function() {
            const flash = document.getElementById('lumiCutFlash');
            if (!flash) return;
            flash.classList.remove('is-firing');
            // Force reflow so the animation restarts even on rapid re-entry.
            void flash.offsetWidth;
            flash.classList.add('is-firing');
        }
    };

})(window);
