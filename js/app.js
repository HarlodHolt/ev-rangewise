/* ♜ EV RangeWise — App Logic */

let evData = [];
let answers = {};

// Quiz questions
const questions = [
  {
    id: 'budget',
    title: 'What\'s your budget?',
    hint: 'Price range before on-road costs',
    options: [
      { value: 'budget', label: 'Up to $40k', emoji: '💰', desc: 'Entry-level EVs' },
      { value: 'mid', label: '$40k – $60k', emoji: '💵', desc: 'Mid-range sweet spot' },
      { value: 'premium', label: '$60k – $80k', emoji: '💎', desc: 'Premium options' },
      { value: 'luxury', label: '$80k+', emoji: '👑', desc: 'Luxury and performance' },
    ]
  },
  {
    id: 'bodyType',
    title: 'What body style suits you?',
    hint: 'Think about your daily needs and parking',
    options: [
      { value: 'hatch', label: 'Hatchback', emoji: '🚗', desc: 'City-friendly, easy to park' },
      { value: 'sedan', label: 'Sedan', emoji: '🚙', desc: 'Classic boot, better highway' },
      { value: 'suv', label: 'SUV', emoji: '🚐', desc: 'Space, ground clearance, towing' },
      { value: 'any', label: 'No preference', emoji: '🤷', desc: 'Show me everything' },
    ]
  },
  {
    id: 'commute',
    title: 'What\'s your daily commute?',
    hint: 'Round trip per day',
    options: [
      { value: 'short', label: 'Under 30km', emoji: '🏠', desc: 'Local errands, short trips' },
      { value: 'medium', label: '30–80km', emoji: '🏢', desc: 'Typical city commute' },
      { value: 'long', label: '80–150km', emoji: '🛣️', desc: 'Long commute or lots of driving' },
      { value: 'extreme', label: '150km+', emoji: '🏔️', desc: 'Serious daily distance' },
    ]
  },
  {
    id: 'roadtrips',
    title: 'How often do you do road trips?',
    hint: 'Trips over 300km one-way',
    options: [
      { value: 'never', label: 'Rarely or never', emoji: '🏙️', desc: 'Mostly around town' },
      { value: 'occasional', label: 'A few times a year', emoji: '🌊', desc: 'Weekend getaways' },
      { value: 'frequent', label: 'Monthly or more', emoji: '🧳', desc: 'Regular traveller' },
    ]
  },
  {
    id: 'charging',
    title: 'Where will you charge?',
    hint: 'Home charging availability changes everything',
    options: [
      { value: 'house', label: 'House with garage', emoji: '🏡', desc: 'Can install a wall charger' },
      { value: 'apartment', label: 'Apartment / street parking', emoji: '🏢', desc: 'Public charging mostly' },
      { value: 'work', label: 'Charge at work', emoji: '🏢', desc: 'Work has charging available' },
    ]
  },
  {
    id: 'family',
    title: 'What\'s your household size?',
    hint: 'Including yourself',
    options: [
      { value: 'solo', label: 'Just me', emoji: '🙋', desc: 'Solo or couple' },
      { value: 'small', label: '2–3 people', emoji: '👫', desc: 'Small family' },
      { value: 'medium', label: '4 people', emoji: '👨‍👩‍👧‍👦', desc: 'Typical family' },
      { value: 'large', label: '5+ people', emoji: '👨‍👩‍👧‍👧', desc: 'Need 7-seater' },
    ]
  },
  {
    id: 'towing',
    title: 'Do you need to tow?',
    hint: 'Trailers, boats, caravans',
    options: [
      { value: 'no', label: 'No towing', emoji: '🚫', desc: 'Passenger use only' },
      { value: 'light', label: 'Light towing', emoji: '🛒', desc: 'Up to 750kg (small trailer)' },
      { value: 'heavy', label: 'Heavy towing', emoji: '🚛', desc: 'Over 750kg (boat, caravan)' },
    ]
  },
];

async function loadData() {
  try {
    const res = await fetch('js/data/evs.json');
    const data = await res.json();
    evData = data.vehicles;
  } catch (e) {
    console.error('Failed to load EV data', e);
  }
}

function init() {
  loadData().then(() => {
    document.getElementById('start-btn').addEventListener('click', startQuiz);
    document.getElementById('restart-btn').addEventListener('click', resetQuiz);
    document.getElementById('restart-btn-2')?.addEventListener('click', resetQuiz);
  });
}

/* Screens */
function show(id) {
  document.querySelectorAll('.screen').forEach(s => s.classList.add('hidden'));
  document.getElementById(id).classList.remove('hidden');
}

/* Quiz */
let currentQuestion = 0;

function startQuiz() {
  answers = {};
  currentQuestion = 0;
  show('quiz-screen');
  renderQuestion();
}

function renderQuestion() {
  const q = questions[currentQuestion];
  
  // Progress
  const steps = document.querySelectorAll('.progress-step');
  steps.forEach((s, i) => {
    s.className = 'progress-step';
    if (i === currentQuestion) s.classList.add('active');
    else if (i < currentQuestion) s.classList.add('done');
  });

  // Question
  document.getElementById('q-title').textContent = q.title;
  document.getElementById('q-hint').textContent = q.hint;

  const opts = document.getElementById('q-options');
  opts.innerHTML = '';
  q.options.forEach(o => {
    const btn = document.createElement('button');
    btn.className = 'option-btn';
    if (answers[q.id] === o.value) btn.classList.add('selected');
    btn.innerHTML = `<span class="emoji">${o.emoji}</span> <span><strong>${o.label}</strong><br><small>${o.desc}</small></span>`;
    btn.addEventListener('click', () => selectOption(q.id, o.value, btn));
    opts.appendChild(btn);
  });

  // Nav buttons
  const backBtn = document.getElementById('btn-back');
  const nextBtn = document.getElementById('btn-next');
  const submitBtn = document.getElementById('btn-submit');

  backBtn.classList.toggle('hidden', currentQuestion === 0);
  nextBtn.classList.toggle('hidden', currentQuestion >= questions.length - 1);
  submitBtn.classList.toggle('hidden', currentQuestion < questions.length - 1);
}

function selectOption(id, value, btn) {
  answers[id] = value;
  document.querySelectorAll('.option-btn').forEach(b => b.classList.remove('selected'));
  btn.classList.add('selected');

  // Auto-advance after brief pause
  setTimeout(() => {
    if (currentQuestion < questions.length - 1) {
      nextQuestion();
    }
  }, 250);
}

function nextQuestion() {
  if (currentQuestion < questions.length - 1) {
    currentQuestion++;
    renderQuestion();
  }
}

function prevQuestion() {
  if (currentQuestion > 0) {
    currentQuestion--;
    renderQuestion();
  }
}

function submitQuiz() {
  // Check all answered
  const missing = questions.filter(q => !answers[q.id]);
  if (missing.length > 0) {
    currentQuestion = questions.indexOf(missing[0]);
    renderQuestion();
    return;
  }
  computeResults();
}

/* Results Engine */
function computeResults() {
  const scored = evData.map(ev => {
    let score = 0;
    let reasons = [];

    // Budget
    if (answers.budget === 'budget' && ev.price <= 40000) { score += 20; reasons.push('Budget-friendly'); }
    else if (answers.budget === 'mid' && ev.price >= 40000 && ev.price <= 60000) { score += 20; reasons.push('In your price range'); }
    else if (answers.budget === 'premium' && ev.price >= 60000 && ev.price <= 80000) { score += 20; reasons.push('Premium match'); }
    else if (answers.budget === 'luxury' && ev.price >= 80000) { score += 20; reasons.push('Luxury pick'); }

    // Body type
    if (answers.bodyType !== 'any' && ev.bodyType === answers.bodyType) { score += 15; reasons.push('Right body style'); }

    // Range - match to commute + road trips
    const minRange = answers.commute === 'extreme' ? 450 : answers.commute === 'long' ? 350 : answers.commute === 'medium' ? 250 : 150;
    if (answers.roadtrips === 'frequent' && ev.realWorldRange.mixed >= 400) { score += 15; reasons.push('Road trip ready'); }
    else if (answers.roadtrips === 'occasional' && ev.realWorldRange.mixed >= 300) { score += 10; reasons.push('Weekend capable'); }
    if (ev.realWorldRange.mixed >= minRange) { score += 10; reasons.push('Covers your commute'); }

    // Charging
    if (answers.charging === 'apartment' && ev.charging.maxDC >= 150) { score += 10; reasons.push('Fast DC charging — great for apartment living'); }
    if (answers.charging === 'apartment' && ev.realWorldRange.mixed >= 350) { score += 5; reasons.push('Good range — fewer charges needed'); }

    // Family
    if (answers.family === 'large' && ev.seats >= 7) { score += 20; reasons.push('7-seater'); }
    else if (answers.family === 'medium' && ev.seats >= 5) { score += 10; reasons.push('5 seater'); }
    else if (answers.family === 'solo' && ev.price < 40000) { score += 5; }

    // Towing
    if (answers.towing === 'heavy' && ev.towCapacity >= 1600) { score += 20; reasons.push('Heavy towing capable'); }
    else if (answers.towing === 'light' && ev.towCapacity > 0) { score += 15; reasons.push('Can tow light loads'); }
    else if (answers.towing === 'no') { score += 5; }

    return { ...ev, score, reasons };
  });

  scored.sort((a, b) => b.score - a.score);
  displayResults(scored);
}

function displayResults(scored) {
  show('results-screen');
  const container = document.getElementById('results-list');
  container.innerHTML = '';

  const topThree = scored.slice(0, 3);

  topThree.forEach((ev, i) => {
    const card = document.createElement('div');
    card.className = 'result-card';

    card.innerHTML = `
      <div class="result-info">
        ${i === 0 ? '<div class="match-badge">🏆 Best Match</div>' : ''}
        <h3>${ev.make} ${ev.model}</h3>
        <div class="variant">${ev.variant}</div>
        <div class="specs">
          <span class="spec-tag">💰 <strong>$${(ev.price / 1000).toFixed(0)}k</strong></span>
          <span class="spec-tag">🔋 <strong>${ev.realWorldRange.mixed}km</strong> mixed</span>
          <span class="spec-tag">⚡ <strong>${ev.charging.maxDC}kW</strong> DC</span>
          <span class="spec-tag">🧑 <strong>${ev.seats}</strong> seats</span>
          ${ev.towCapacity > 0 ? `<span class="spec-tag">🪝 <strong>${ev.towCapacity}kg</strong> tow</span>` : ''}
        </div>
      </div>
      <div class="result-range">
        <div class="num">${ev.realWorldRange.mixed}</div>
        <div class="label">mixed km</div>
        <div style="font-size:0.75rem;color:var(--muted);margin-top:4px;">WLTP: ${ev.wlptRange}km</div>
      </div>
    `;

    container.appendChild(card);
  });
}

function resetQuiz() {
  answers = {};
  currentQuestion = 0;
  show('hero-screen');
}

/* Event listeners */
document.addEventListener('DOMContentLoaded', init);
