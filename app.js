// IELTS Academic Writing Task 1 - Interactive App Engine

let currentBandLevel = '65';
let timerInterval = null;
let timeLeft = 20 * 60; // 20 minutes in seconds
let isTimerRunning = false;

// Sentence Lab Data
const sentenceLabData = {
  '5': {
    badge: 'Band 5.0 (Basic / Repetitive)',
    badgeClass: 'bg-amber-600',
    sentence: '"Renewables was 15 TWh in 2000 and it went up a lot to 85 TWh in 2020."',
    vocab: 'Uses low-level informal vocabulary like <em>"went up a lot"</em> and basic linkers (<em>"and it..."</em>).',
    grammar: 'Subject-verb agreement issue (<em>"Renewables was..."</em> instead of were/generation was) and single simple compound structure.'
  },
  '6': {
    badge: 'Band 6.0 (Clear & Accurate)',
    badgeClass: 'bg-amber-500',
    sentence: '"In 2000, renewables started at 15 TWh, and then it increased significantly to reach 85 TWh by 2020."',
    vocab: 'Improved lexical items (<em>"increased significantly", "started at"</em>), but still slightly mechanical.',
    grammar: 'Correct past tenses and prepositions (<em>"started at", "increased to", "by 2020"</em>).'
  },
  '65': {
    badge: 'Band 6.5 (Academic & Varied)',
    badgeClass: 'bg-blue-600',
    sentence: '"Renewable energy began at a modest 15 TWh in 2000 before surging dramatically by 70 TWh to reach a peak of 85 TWh at the end of the period."',
    vocab: 'Rich collocations: <em>"modest 15 TWh"</em>, <em>"surging dramatically"</em>, and <em>"at the end of the period"</em>.',
    grammar: 'Participle clause (<em>"before surging..."</em>) and calculation of net change (<em>"by 70 TWh"</em>).'
  },
  '7': {
    badge: 'Band 7.0+ (Sophisticated Synthesis)',
    badgeClass: 'bg-emerald-600',
    sentence: '"Having initiated the period at a negligible 15 TWh, renewable electricity output underwent an almost six-fold surge, culminating in a dominant 85 TWh by 2020."',
    vocab: 'Advanced academic phrasing: <em>"negligible"</em>, <em>"six-fold surge"</em>, <em>"culminating in a dominant..."</em>.',
    grammar: 'Perfect participle clause (<em>"Having initiated..."</em>), noun-phrase trend transformation, and natural mathematical synthesis.'
  }
};

document.addEventListener('DOMContentLoaded', () => {
  // Initialize Lucide Icons
  if (window.lucide) {
    lucide.createIcons();
  }

  // Initialize Line Graph with Chart.js
  initLineChart();

  // ScrollSpy for Sidebar Active link
  initScrollSpy();

  // Check saved dark mode preference
  if (localStorage.getItem('theme') === 'dark' || (!('theme' in localStorage) && window.matchMedia('(prefers-color-scheme: dark)').matches)) {
    document.documentElement.classList.add('dark');
  } else {
    document.documentElement.classList.remove('dark');
  }
});

// Chart.js Configuration
let lineChartInstance = null;
function initLineChart() {
  const ctx = document.getElementById('lineChartCanvas');
  if (!ctx) return;

  const labels = ['2000', '2005', '2010', '2015', '2020'];

  lineChartInstance = new Chart(ctx, {
    type: 'line',
    data: {
      labels: labels,
      datasets: [
        {
          label: 'Renewables',
          data: [15, 28, 48, 68, 85],
          borderColor: '#10b981', // emerald-500
          backgroundColor: 'rgba(16, 185, 129, 0.12)',
          borderWidth: 3.5,
          pointBackgroundColor: '#10b981',
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.3,
          fill: true
        },
        {
          label: 'Natural Gas',
          data: [40, 52, 58, 50, 45],
          borderColor: '#0284c7', // sky-600
          backgroundColor: 'transparent',
          borderWidth: 3,
          pointBackgroundColor: '#0284c7',
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.3,
          borderDash: [4, 4]
        },
        {
          label: 'Coal',
          data: [65, 55, 38, 22, 10],
          borderColor: '#f43f5e', // rose-500
          backgroundColor: 'transparent',
          borderWidth: 3,
          pointBackgroundColor: '#f43f5e',
          pointRadius: 5,
          pointHoverRadius: 7,
          tension: 0.3
        }
      ]
    },
    options: {
      responsive: true,
      maintainAspectRatio: false,
      interaction: {
        mode: 'index',
        intersect: false
      },
      plugins: {
        legend: {
          display: false
        },
        tooltip: {
          backgroundColor: '#0f172a',
          titleFont: { family: 'Plus Jakarta Sans', size: 12, weight: 'bold' },
          bodyFont: { family: 'Plus Jakarta Sans', size: 11 },
          padding: 10,
          cornerRadius: 8,
          callbacks: {
            label: function (context) {
              return `${context.dataset.label}: ${context.parsed.y} TWh`;
            }
          }
        }
      },
      scales: {
        y: {
          min: 0,
          max: 100,
          ticks: {
            stepSize: 20,
            callback: function (value) {
              return value + ' TWh';
            },
            font: { family: 'Plus Jakarta Sans', size: 11 }
          },
          grid: {
            color: 'rgba(226, 232, 240, 0.6)'
          }
        },
        x: {
          grid: {
            display: false
          },
          ticks: {
            font: { family: 'Plus Jakarta Sans', size: 11, weight: 'bold' }
          }
        }
      }
    }
  });
}

// Switch between visual tabs (Line, Table, Combined)
function switchPromptTab(tabName) {
  const tabs = ['line', 'table', 'combined'];
  
  tabs.forEach(tab => {
    const btn = document.getElementById(`tab-btn-${tab}`);
    const content = document.getElementById(`tab-content-${tab}`);
    
    if (tab === tabName) {
      btn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all bg-white dark:bg-slate-700 text-indigo-700 dark:text-indigo-300 shadow-xs flex items-center gap-1.5';
      content.classList.remove('hidden');
      content.classList.add('animate-fadeIn');
    } else {
      btn.className = 'px-3.5 py-1.5 rounded-lg text-xs font-bold transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white flex items-center gap-1.5';
      content.classList.add('hidden');
      content.classList.remove('animate-fadeIn');
    }
  });

  if (window.lucide) {
    lucide.createIcons();
  }
}

// Interactive Sentence Upgrade Lab Selector
function setLabBand(band) {
  currentBandLevel = band;
  const data = sentenceLabData[band];
  if (!data) return;

  // Update Buttons
  ['5', '6', '65', '7'].forEach(b => {
    const btn = document.getElementById(`lab-btn-${b}`);
    if (b === band) {
      btn.className = 'lab-btn px-4 py-2 rounded-lg text-xs font-bold transition-all bg-white dark:bg-slate-700 text-sky-600 dark:text-sky-300 shadow-xs';
    } else {
      btn.className = 'lab-btn px-4 py-2 rounded-lg text-xs font-bold transition-all text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white';
    }
  });

  // Update Output Card
  const badge = document.getElementById('lab-score-badge');
  badge.textContent = `Current View: ${data.badge}`;
  badge.className = `${data.badgeClass} text-white text-xs font-extrabold px-3 py-1 rounded-full uppercase tracking-wider`;

  document.getElementById('lab-sentence').innerHTML = data.sentence;
  document.getElementById('lab-vocab-note').innerHTML = data.vocab;
  document.getElementById('lab-gram-note').innerHTML = data.grammar;

  const card = document.getElementById('lab-output-card');
  card.classList.remove('animate-fadeIn');
  void card.offsetWidth; // Trigger reflow
  card.classList.add('animate-fadeIn');
}

// Speak sentence using Web Speech API
function speakSentence() {
  const sentence = sentenceLabData[currentBandLevel].sentence.replace(/"/g, '');
  if ('speechSynthesis' in window) {
    window.speechSynthesis.cancel(); // Stop ongoing speech
    const utterance = new SpeechSynthesisUtterance(sentence);
    utterance.lang = 'en-GB'; // British English for IELTS
    utterance.rate = 0.95;
    window.speechSynthesis.speak(utterance);
  } else {
    alert('Audio speech synthesis is not supported on this browser.');
  }
}

// Copy phrase to clipboard
function copyToClipboard(text, element) {
  navigator.clipboard.writeText(text).then(() => {
    const toast = document.getElementById('toast-message');
    toast.classList.remove('hidden');
    
    // Add visual feedback to card
    element.classList.add('ring-2', 'ring-sky-500');
    
    setTimeout(() => {
      toast.classList.add('hidden');
      element.classList.remove('ring-2', 'ring-sky-500');
    }, 2000);
  });
}

// Toggle teacher notes annotations in Band Comparison section
let showNotes = true;
function toggleAnnotations() {
  showNotes = !showNotes;
  const notes = document.querySelectorAll('.teacher-note');
  const btn = document.getElementById('anno-btn');

  notes.forEach(note => {
    if (showNotes) {
      note.classList.remove('hidden');
    } else {
      note.classList.add('hidden');
    }
  });

  btn.classList.toggle('bg-amber-100', showNotes);
  btn.classList.toggle('text-amber-800', showNotes);
}

// Interactive Quiz Handler
function answerQuiz(questionNum, chosenOption, isCorrect) {
  const box = document.getElementById(`q${questionNum}-box`);
  const feedback = document.getElementById(`q${questionNum}-feedback`);
  const buttons = box.querySelectorAll('.q-opt');

  buttons.forEach(btn => {
    btn.disabled = true;
    btn.classList.remove('bg-white', 'hover:bg-slate-100');
    btn.classList.add('opacity-50');
  });

  feedback.classList.remove('hidden');

  if (isCorrect) {
    feedback.className = 'text-xs p-3.5 rounded-xl font-medium bg-emerald-50 dark:bg-emerald-950/30 text-emerald-900 dark:text-emerald-200 border border-emerald-200 dark:border-emerald-800 mt-3 animate-fadeIn';
    if (questionNum === 1) {
      feedback.innerHTML = '<strong>&check; Correct! (Band 7 Strategy)</strong> An Overview must state the general trends (leading source vs plummeted) without mentioning specific numbers or giving personal opinions.';
    } else if (questionNum === 2) {
      feedback.innerHTML = '<strong>&check; Correct! (Preposition Mastery)</strong> We say "rose from X <strong>to</strong> Y" (destination number) and "an increase <strong>of</strong> 70" (noun form takes "of", verb form takes "by").';
    } else if (questionNum === 3) {
      feedback.innerHTML = '<strong>&check; Correct! (Table Grouping)</strong> In IELTS Task 1, listing all figures leads to Band 5. Selecting main features and grouping them into categories earns Band 7+.';
    }
  } else {
    feedback.className = 'text-xs p-3.5 rounded-xl font-medium bg-rose-50 dark:bg-rose-950/30 text-rose-900 dark:text-rose-200 border border-rose-200 dark:border-rose-800 mt-3 animate-fadeIn';
    if (questionNum === 1) {
      feedback.innerHTML = '<strong>&cross; Incorrect:</strong> Never put specific numbers in the overview, and NEVER write reasons or personal opinions like "because green energy is good". Task 1 is strictly factual!';
    } else if (questionNum === 2) {
      feedback.innerHTML = '<strong>&cross; Incorrect:</strong> Remember the rule: "rose from [start] <strong>to</strong> [finish]" and "an increase <strong>of</strong> [gap]" (as a noun).';
    } else if (questionNum === 3) {
      feedback.innerHTML = '<strong>&cross; Incorrect:</strong> Listing every number wastes precious time and lowers your Task Achievement score. Group and report only key points!';
    }
  }

  if (window.lucide) {
    lucide.createIcons();
  }
}

// Live Exam Sandbox & Word Counter
function analyzeEssay() {
  const text = document.getElementById('essay-input').value.trim();
  const words = text ? text.split(/\s+/).length : 0;
  const paragraphs = text ? text.split(/\n+/).filter(p => p.trim().length > 0).length : 0;

  const wordBadge = document.getElementById('word-count-badge');
  wordBadge.textContent = `${words} / 150 words`;

  if (words < 150) {
    wordBadge.className = 'bg-rose-100 dark:bg-rose-950 text-rose-700 dark:text-rose-300 px-2 py-0.5 rounded-full font-mono font-bold';
  } else if (words <= 200) {
    wordBadge.className = 'bg-emerald-100 dark:bg-emerald-950 text-emerald-700 dark:text-emerald-300 px-2 py-0.5 rounded-full font-mono font-bold';
  } else {
    wordBadge.className = 'bg-amber-100 dark:bg-amber-950 text-amber-700 dark:text-amber-300 px-2 py-0.5 rounded-full font-mono font-bold';
  }

  document.getElementById('para-count-badge').textContent = `${paragraphs} / 4`;

  // Forbidden Words Checker
  const forbidden = [
    { pattern: /\bi think\b/i, message: 'Forbidden opinion: Avoid "I think". Task 1 is purely objective data reporting.' },
    { pattern: /\bin my opinion\b/i, message: 'Forbidden opinion: Avoid "in my opinion".' },
    { pattern: /\bwent up a lot\b/i, message: 'Informal phrase: Replace "went up a lot" with "increased significantly" or "surged".' },
    { pattern: /\bwent down fast\b/i, message: 'Informal phrase: Replace "went down fast" with "plummeted" or "decreased sharply".' },
    { pattern: /\bbecause\b/i, message: 'Caution: Explaining causes with "because" is penalized unless directly mentioned in the prompt.' }
  ];

  const alertBox = document.getElementById('forbidden-alert');
  const alertText = document.getElementById('forbidden-text');
  let matchedWarning = null;

  for (let item of forbidden) {
    if (item.pattern.test(text)) {
      matchedWarning = item.message;
      break;
    }
  }

  if (matchedWarning) {
    alertText.textContent = matchedWarning;
    alertBox.classList.remove('hidden');
  } else {
    alertBox.classList.add('hidden');
  }
}

// Load Model Essay into Sandbox
function loadSampleEssay() {
  const sample = `The line graph illustrates electricity generation measured in terawatt hours (TWh) across three energy sources in an EU nation over a 20-year period starting in 2000.

Overall, it is noticeable that renewable energy experienced substantial growth, overtaking all other sources by 2020. In stark contrast, coal witnessed a dramatic downward trend, while natural gas showed moderate fluctuations.

Looking at the growing sectors, renewable energy began at a modest 15 TWh in 2000 before surging dramatically by 70 TWh to reach a peak of 85 TWh at the end of the period. Similarly, natural gas generation, which started at 40 TWh, climbed to a high of 58 TWh in 2010 prior to settling at 45 TWh in 2020.

In sharp contrast, coal was initially the dominant fuel source at 65 TWh in 2000. However, its output plummeted continuously over the two decades, finishing at a negligible 10 TWh in 2020. Consequently, coal went from being the leading electricity generator to the least utilized source by the conclusion of the survey.`;

  const input = document.getElementById('essay-input');
  input.value = sample;
  analyzeEssay();
}

// 20-Minute Timer Logic
function startTimer() {
  const btn = document.getElementById('timer-start-btn');
  if (isTimerRunning) {
    clearInterval(timerInterval);
    btn.textContent = 'Resume';
    btn.className = 'bg-amber-600 hover:bg-amber-700 text-white text-xs px-2.5 py-1 rounded-lg font-bold';
    isTimerRunning = false;
  } else {
    isTimerRunning = true;
    btn.textContent = 'Pause';
    btn.className = 'bg-rose-600 hover:bg-rose-700 text-white text-xs px-2.5 py-1 rounded-lg font-bold';
    timerInterval = setInterval(() => {
      if (timeLeft > 0) {
        timeLeft--;
        updateTimerDisplay();
      } else {
        clearInterval(timerInterval);
        isTimerRunning = false;
        alert('20 Minutes Completed! Stop writing and review your Task 1 essay.');
      }
    }, 1000);
  }
}

function resetTimer() {
  clearInterval(timerInterval);
  isTimerRunning = false;
  timeLeft = 20 * 60;
  updateTimerDisplay();
  const btn = document.getElementById('timer-start-btn');
  btn.textContent = 'Start';
  btn.className = 'bg-blue-600 hover:bg-blue-700 text-white text-xs px-2.5 py-1 rounded-lg font-bold';
}

function updateTimerDisplay() {
  const m = Math.floor(timeLeft / 60).toString().padStart(2, '0');
  const s = (timeLeft % 60).toString().padStart(2, '0');
  document.getElementById('timer-display').textContent = `${m}:${s}`;
}

// Dark Mode Toggle
function toggleDarkMode() {
  const isDark = document.documentElement.classList.toggle('dark');
  localStorage.setItem('theme', isDark ? 'dark' : 'light');
}

// Mobile Nav Toggle
function toggleMobileNav() {
  const sidebar = document.getElementById('sidebar-nav');
  const backdrop = document.getElementById('mobile-backdrop');
  sidebar.classList.toggle('-translate-x-full');
  backdrop.classList.toggle('hidden');
}

function handleNavClick() {
  if (window.innerWidth < 768) {
    toggleMobileNav();
  }
}

// ScrollSpy Navigation
function initScrollSpy() {
  const sections = document.querySelectorAll('section[id]');
  const navLinks = document.querySelectorAll('.nav-link');

  window.addEventListener('scroll', () => {
    let current = '';
    const scrollPos = window.scrollY + 140;

    sections.forEach(section => {
      const sectionTop = section.offsetTop;
      const sectionHeight = section.offsetHeight;
      if (scrollPos >= sectionTop && scrollPos < sectionTop + sectionHeight) {
        current = section.getAttribute('id');
      }
    });

    navLinks.forEach(link => {
      link.classList.remove('active');
      if (link.getAttribute('href') === `#${current}`) {
        link.classList.add('active');
      }
    });
  });
}
