let currentStep = 0;
const totalSteps = 6; // Increased to 6

const carousel = document.getElementById('carousel');
const segments = document.querySelectorAll('.progress-segment');
const backBtn = document.getElementById('back-btn');
const nextBtn = document.getElementById('next-btn');
const skipBtn = document.getElementById('skip-btn');
const bottomBar = document.getElementById('bottom-bar');
const progressBar = document.getElementById('progress-bar');
const appContainer = document.querySelector('.app-container');

const nextLabels = [
  "Thử bài test xếp lớp →",
  "Vẽ hành trình cho tôi →",
  "Xem cách bản đồ hoạt động",
  "Xem kết quả của tôi",
  "Mở khoá hành trình →",
  "Tiếp tục"
];

// Interactive Flashcard Logic
const flashcardData = {
  "Du lịch & Giao tiếp": [
    { word: "Boarding Pass", type: "Noun", phonetic: "/ˈbɔːdɪŋ pɑːs/", meaning: "Thẻ lên máy bay", prompt: "Please have your [boarding pass] ready.", img: "../app/src/main/res/drawable-nodpi/planet_earth_real.jpg" },
    { word: "Luggage", type: "Noun", phonetic: "/ˈlʌɡɪdʒ/", meaning: "Hành lý", prompt: "Where can I claim my [luggage]?", img: "../app/src/main/res/drawable-nodpi/home_quick_image.jpg" },
    { word: "Delayed", type: "Adj", phonetic: "/dɪˈleɪd/", meaning: "Bị hoãn chuyến", prompt: "The flight was [delayed] due to weather.", img: "../app/src/main/res/drawable-nodpi/home_office_lesson.jpg" }
  ],
  "Công việc & Phỏng vấn": [
    { word: "Deadline", type: "Noun", phonetic: "/ˈdedlaɪn/", meaning: "Hạn chót", prompt: "We must meet the tight [deadline].", img: "../app/src/main/res/drawable-nodpi/home_office_lesson.jpg" },
    { word: "Promote", type: "Verb", phonetic: "/prəˈməʊt/", meaning: "Thăng chức", prompt: "She was [promoted] to manager.", img: "../app/src/main/res/drawable-nodpi/home_quick_manual.jpg" },
    { word: "Revenue", type: "Noun", phonetic: "/ˈrevənjuː/", meaning: "Doanh thu", prompt: "The company's [revenue] increased by 20%.", img: "../app/src/main/res/drawable-nodpi/home_story_ai.jpg" }
  ],
  "Thi cử (IELTS/TOEIC)": [
    { word: "Fundamental", type: "Adj", phonetic: "/ˌfʌndəˈmentl/", meaning: "Cơ bản, cốt lõi", prompt: "This is a [fundamental] principle.", img: "../app/src/main/res/drawable-nodpi/home_avatar_robot.jpg" },
    { word: "Evaluate", type: "Verb", phonetic: "/ɪˈvæljueɪt/", meaning: "Đánh giá", prompt: "We need to [evaluate] the results.", img: "../app/src/main/res/drawable-nodpi/lesson_learning_flow.webp" },
    { word: "Hypothesis", type: "Noun", phonetic: "/haɪˈpɒθəsɪs/", meaning: "Giả thuyết", prompt: "The [hypothesis] was proven wrong.", img: "../app/src/main/res/drawable-nodpi/library_review_hero_art.webp" }
  ]
};

let currentCards = [];
let cardIndex = 0;
let selectedGoalName = "Công việc & Phỏng vấn";

function initFlashcards() {
  const container = document.getElementById('fc-container');
  container.innerHTML = '';
  document.getElementById('fc-controls').style.display = 'flex';
  document.getElementById('fc-result').style.display = 'none';
  
  currentCards = flashcardData[selectedGoalName] || flashcardData["Công việc & Phỏng vấn"];
  cardIndex = 0;

  // Create cards in reverse order so first is on top
  [...currentCards].reverse().forEach((card, i) => {
    const fc = document.createElement('div');
    fc.className = 'flashcard';
    fc.id = `fc-${currentCards.length - 1 - i}`;
    
    // Stack effect
    const zIndex = i;
    const translateY = (currentCards.length - 1 - i) * 8;
    const scale = 1 - (currentCards.length - 1 - i) * 0.05;
    
    fc.style.zIndex = zIndex;
    fc.style.transform = `translateY(${translateY}px) scale(${scale})`;
    
    // Format prompt text to highlight bracketed word
    const formattedPrompt = card.prompt.replace(/\[(.*?)\]/g, '<span class="fc-prompt-highlight">$1</span>');
    
    fc.innerHTML = `
      <div class="flashcard-inner">
        <!-- FRONT -->
        <div class="flashcard-front">
          <div class="fc-word-front">${card.word.toLowerCase()}</div>
          <div class="fc-type-chip">${card.type}</div>
          <div class="fc-image-container">
            <img src="${card.img}" class="fc-image" alt="${card.word}">
          </div>
          <div class="fc-prompt-box">${formattedPrompt}</div>
          <div class="fc-tap-hint">CHẠM ĐỂ LẬT</div>
        </div>
        
        <!-- BACK -->
        <div class="flashcard-back">
          <div class="fc-back-header">MEANING</div>
          <div class="fc-word-back">${card.word.toLowerCase()}</div>
          <div class="fc-meaning">${card.meaning}</div>
          <div class="fc-phonetic-pill">${card.phonetic}</div>
          
          <div class="fc-example-tab">VÍ DỤ</div>
          <div class="fc-example-box">
            <div class="fc-example-en">${card.prompt.replace(/\[|\]/g, '')}</div>
          </div>
        </div>
      </div>
    `;
    
    // Click to flip
    fc.addEventListener('click', () => {
      fc.classList.toggle('is-flipped');
    });
    
    container.appendChild(fc);
  });
}

window.swipeCard = function(direction) {
  if (cardIndex >= currentCards.length) return;
  
  const card = document.getElementById(`fc-${cardIndex}`);
  if (!card) return;

  const translationX = direction === 'left' ? -300 : 300;
  const rotation = direction === 'left' ? -15 : 15;
  
  card.style.transform = `translate(${translationX}px, -50px) rotate(${rotation}deg) scale(0.9)`;
  card.style.opacity = '0';
  
  cardIndex++;
  
  // Re-adjust remaining cards
  for (let i = cardIndex; i < currentCards.length; i++) {
    const remainingCard = document.getElementById(`fc-${i}`);
    if (remainingCard) {
      const remainingStackIndex = i - cardIndex;
      const translateY = remainingStackIndex * 8;
      const scale = 1 - remainingStackIndex * 0.05;
      remainingCard.style.transform = `translateY(${translateY}px) scale(${scale})`;
    }
  }

  // Show result if all swiped
  if (cardIndex >= currentCards.length) {
    setTimeout(() => {
      document.getElementById('fc-controls').style.display = 'none';
      document.getElementById('fc-result').style.display = 'block';
    }, 300);
  }
}

function updateUI() {
  // Translate carousel
  carousel.style.transform = `translateX(-${currentStep * (100 / 6)}%)`;

  // Update progress bar
  segments.forEach((seg, idx) => {
    if (idx <= currentStep) {
      seg.classList.add('active');
    } else {
      seg.classList.remove('active');
    }
  });

  // Back button visibility
  if (currentStep === 0) {
    backBtn.style.visibility = 'hidden';
  } else {
    backBtn.style.visibility = 'visible';
  }

  // Next button text
  nextBtn.innerText = nextLabels[currentStep];

  // If entering Interactive step (Step 1), initialize cards
  if (currentStep === 1 && cardIndex === 0) {
    initFlashcards();
  }

  // Paywall mode (Step 5 now)
  if (currentStep === 5) {
    bottomBar.style.display = 'none';
    progressBar.style.opacity = '0';
    skipBtn.style.display = 'none';
    appContainer.style.backgroundColor = 'var(--bg-paywall)';
  } else {
    bottomBar.style.display = 'flex';
    progressBar.style.opacity = '1';
    skipBtn.style.display = 'block';
    appContainer.style.backgroundColor = 'var(--bg-main)';
  }
}

function nextStep() {
  if (currentStep < totalSteps - 1) {
    currentStep++;
    updateUI();
  }
}

function prevStep() {
  if (currentStep > 0) {
    currentStep--;
    updateUI();
  }
}

// Skip directly to paywall
skipBtn.addEventListener('click', () => {
  currentStep = 5;
  updateUI();
});

// Interactive selections
window.selectGoal = function(element) {
  // Prevent double clicks
  if (element.classList.contains('scanning')) return;

  document.querySelectorAll('.ai-goal-card').forEach(el => {
    el.classList.remove('selected', 'scanning');
  });
  
  element.classList.add('selected', 'scanning');
  selectedGoalName = element.querySelector('.goal-title').innerText;
  
  // Reset flashcards
  cardIndex = 0;
  
  // Fake AI scanning effect
  const originalText = nextLabels[currentStep];
  nextBtn.innerText = "Đang phân tích...";
  nextBtn.style.opacity = '0.5';
  nextBtn.style.pointerEvents = 'none';
  
  setTimeout(() => {
    if (element.classList.contains('scanning')) {
      element.classList.remove('scanning');
      nextBtn.innerText = originalText;
      nextBtn.style.opacity = '1';
      nextBtn.style.pointerEvents = 'auto';
    }
  }, 1000);
}

window.selectPlan = function(element) {
  document.querySelectorAll('.plan-card').forEach(el => el.classList.remove('selected'));
  element.classList.add('selected');
}

// Init
updateUI();
