'use strict';

const $ = (selector, ctx = document) => ctx.querySelector(selector);
const $$ = (selector, ctx = document) => [...ctx.querySelectorAll(selector)];

function showToast(msg) {
  const toast = $('#copied-toast');
  toast.textContent = msg;
  toast.classList.add('is-visible');
  setTimeout(() => toast.classList.remove('is-visible'), 2000);
}

(function initDarkMode() {
  const btn = $('.js-dark-toggle');
  let isDark = false;

  btn.addEventListener('click', function () {
    isDark = !isDark;

    document.body.classList.toggle('is-dark', isDark);

    btn.textContent = isDark ? '☀️' : '🌙';
  });
})();

(function initMobileNav() {
  const toggle = $('.js-nav-toggle');
  const menu   = $('#mobile-menu');
  let isOpen = false;

  toggle.addEventListener('click', function () {
    isOpen = !isOpen;

    toggle.classList.toggle('is-open', isOpen);
    menu.classList.toggle('is-open', isOpen);

    toggle.setAttribute('aria-expanded', String(isOpen));
    menu.setAttribute('aria-hidden', String(!isOpen));
  });
})();

(function initCounter() {
  let count = 0;

  const display = $('#counter-display');
  const incBtn  = $('.js-counter-inc');
  const decBtn  = $('.js-counter-dec');
  const resetBtn = $('.js-counter-reset');

  function render() {
    display.textContent = count;

    display.style.color = count > 0
      ? 'var(--green)'
      : count < 0
        ? 'var(--red)'
        : 'var(--accent)';

    display.classList.add('is-animating');
    setTimeout(() => display.classList.remove('is-animating'), 150);
  }

  incBtn.addEventListener('click', function () {
    count++;    
    render();   
  });

  decBtn.addEventListener('click', function () {
    count--;
    render();
  });

  resetBtn.addEventListener('click', function () {
    count = 0;
    render();
  });

  render(); 
})();

(function initCharCounter() {
  const textarea = $('.js-char-input');
  const countEl  = $('.js-char-count');
  const barFill  = $('.js-char-bar');
  const MAX = 280;

  textarea.addEventListener('input', function () {
    const len = textarea.value.length;
    const pct = (len / MAX) * 100;

    countEl.textContent = `${len} / ${MAX}`;

    barFill.style.width = pct + '%';

    const isWarning = pct >= 70 && pct < 90;
    const isDanger  = pct >= 90;

    textarea.classList.toggle('is-warning', isWarning);
    textarea.classList.toggle('is-danger', isDanger);
    countEl.classList.toggle('is-warning', isWarning);
    countEl.classList.toggle('is-danger', isDanger);

    barFill.style.background = isDanger
      ? 'var(--red)'
      : isWarning
        ? 'var(--amber)'
        : 'var(--green)';
  });
})();

(function initToggles() {
  const toggles   = $$('.js-toggle');
  const statusEl  = $('#toggle-status');

  toggles.forEach(function (toggle) {
    toggle.addEventListener('change', function () {
      const label   = toggle.dataset.label;
      const enabled = toggle.checked;

      statusEl.textContent = `${label} turned ${enabled ? 'on ✓' : 'off ✕'}`;

      clearTimeout(toggle._timer);
      toggle._timer = setTimeout(() => { statusEl.textContent = ''; }, 2500);
    });
  });
})();
(function initAccordion() {
  const headers = $$('.js-accordion');

  headers.forEach(function (header) {
    header.addEventListener('keydown', function (e) {
      if (e.key === 'Enter' || e.key === ' ') {
        e.preventDefault();
        header.click();
      }
    });

    header.addEventListener('click', function () {
      const item    = header.closest('.accordion-item');
      const isOpen  = item.classList.contains('is-open');

      $$('.accordion-item').forEach(function (el) {
        el.classList.remove('is-open');
        el.querySelector('.accordion-header').setAttribute('aria-expanded', 'false');
      });

      if (!isOpen) {
        item.classList.add('is-open');
        header.setAttribute('aria-expanded', 'true');
      }
    });
  });
})();

(function initTodo() {
  const input   = $('.js-todo-input');
  const addBtn  = $('.js-todo-add');
  const list    = $('#todo-list');
  const emptyEl = $('#todo-empty');
  const statsEl = $('#todo-stats');

  let tasks = [];

  function updateStats() {
    const total = tasks.length;
    const done  = tasks.filter(t => t.done).length;

    if (total === 0) {
      statsEl.textContent = '';
      emptyEl.style.display = 'block';
    } else {
      emptyEl.style.display = 'none';
      statsEl.textContent = `${done} of ${total} complete`;
    }
  }

  function addTask() {
    const text = input.value.trim();
    if (!text) return;

    const id = Date.now();
    tasks.push({ id, text, done: false });

    const li   = document.createElement('li');
    li.className = 'todo-item';
    li.dataset.id = id;

    const cb   = document.createElement('input');
    cb.type = 'checkbox';
    cb.className = 'js-todo-check';
    cb.setAttribute('aria-label', `Mark "${text}" complete`);

    const span = document.createElement('span');
    span.className = 'todo-text';
    span.textContent = text;  

    const del  = document.createElement('button');
    del.className = 'todo-delete js-todo-delete';
    del.textContent = '×';
    del.setAttribute('aria-label', `Delete "${text}"`);

    li.appendChild(cb);
    li.appendChild(span);
    li.appendChild(del);

    list.insertBefore(li, emptyEl);

    cb.addEventListener('change', function () {
      const task = tasks.find(t => t.id === id);
      task.done = cb.checked;
      li.classList.toggle('is-done', task.done);
      updateStats();
    });

    del.addEventListener('click', function () {
      tasks = tasks.filter(t => t.id !== id);
      li.remove();
      updateStats();
    });

    input.value = '';
    input.focus();
    updateStats();
  }

  addBtn.addEventListener('click', addTask);

  input.addEventListener('keydown', function (e) {
    if (e.key === 'Enter') addTask();
  });

  updateStats();
})();

(function initColorPalette() {
  const picker   = $('#base-color');
  const swatchEl = $('#color-swatches');

  function hexToHsl(hex) {
    let r = parseInt(hex.slice(1,3),16)/255;
    let g = parseInt(hex.slice(3,5),16)/255;
    let b = parseInt(hex.slice(5,7),16)/255;
    const max = Math.max(r,g,b), min = Math.min(r,g,b);
    let h, s, l = (max+min)/2;
    if (max === min) { h = s = 0; }
    else {
      const d = max - min;
      s = l > 0.5 ? d/(2-max-min) : d/(max+min);
      switch(max){
        case r: h=(g-b)/d+(g<b?6:0); break;
        case g: h=(b-r)/d+2; break;
        case b: h=(r-g)/d+4; break;
      }
      h /= 6;
    }
    return [Math.round(h*360), Math.round(s*100), Math.round(l*100)];
  }

  function hslToHex(h,s,l) {
    s /= 100; l /= 100;
    const k = n => (n+h/30)%12;
    const a = s*Math.min(l,1-l);
    const f = n => l - a*Math.max(-1,Math.min(k(n)-3,Math.min(9-k(n),1)));
    const hex = x => Math.round(f(x)*255).toString(16).padStart(2,'0');
    return '#'+hex(0)+hex(8)+hex(4);
  }

  function generatePalette() {
    const [h, s] = hexToHsl(picker.value);
    const lightnesses = [85, 70, 55, 35, 20];

    swatchEl.innerHTML = '';

    lightnesses.forEach(function (l) {
      const color = hslToHex(h, s, l);

      const div   = document.createElement('div');
      div.className = 'swatch';
      div.style.background = color;
      div.title = color;

      const label = document.createElement('span');
      label.className = 'swatch-label';
      label.textContent = color;  

      div.appendChild(label);

      div.addEventListener('click', function () {
        navigator.clipboard.writeText(color).then(() => {
          showToast(`Copied ${color}`);
        }).catch(() => {
          showToast(`${color}`);
        });
      });

      swatchEl.appendChild(div);
    });
  }

  picker.addEventListener('input', generatePalette);
  generatePalette(); 
})();

(function initQuiz() {
  const questions = [
    {
      q: 'Which method safely injects text into the DOM without XSS risk?',
      options: ['element.innerHTML', 'element.textContent', 'document.write()', 'element.innerText'],
      correct: 1,
      feedback: 'Correct! textContent treats the value as plain text — innerHTML parses HTML and can execute injected scripts.'
    },
    {
      q: 'What does classList.toggle(\'is-open\') do?',
      options: [
        'Adds is-open to the element permanently',
        'Removes all classes from the element',
        'Adds is-open if absent, removes it if present',
        'Creates a new CSS class called is-open'
      ],
      correct: 2,
      feedback: 'Correct! toggle() flips the presence of the class — the professional standard for visual state changes.'
    },
    {
      q: 'In the IPO model, what is the "Output" phase?',
      options: [
        'User clicks a button',
        'JavaScript reads a variable',
        'A visible change that dynamically updates the environment',
        'The addEventListener is registered'
      ],
      correct: 2,
      feedback: 'Correct! Output is the DOM mutation — the visible change the user sees as a result of the logic.'
    },
    {
      q: 'Which variable declaration should you use for a DOM reference that never reassigns?',
      options: ['var', 'let', 'const', 'Any of the above'],
      correct: 2,
      feedback: 'Correct! const signals intent — "this binding will never change." Use let only when the value must mutate.'
    },
    {
      q: 'What is the correct approach for decoupling markup from JavaScript logic?',
      options: [
        'Use onclick="" attributes directly in HTML',
        'Style your JS hooks with CSS as well',
        'Use js- prefix for JS hooks and is- prefix for visual state',
        'Store all JS in a separate file with the same class names as CSS'
      ],
      correct: 2,
      feedback: 'Correct! js- classes are strictly for JavaScript hooks, is- classes define visual state. This contract keeps code maintainable.'
    }
  ];

  let currentQ  = 0;
  let answered  = false;
  let score     = 0;

  const qEl       = $('#quiz-question');
  const optsEl    = $('#quiz-options');
  const feedbackEl = $('#quiz-feedback');
  const progressEl = $('#quiz-progress');
  const nextBtn   = $('#quiz-next');

  function renderQuestion() {
    if (currentQ >= questions.length) {
      renderResult();
      return;
    }

    const q = questions[currentQ];
    answered = false;

    qEl.textContent = q.q;

    optsEl.innerHTML = '';
    feedbackEl.className = 'quiz-feedback';
    feedbackEl.textContent = '';
    nextBtn.style.display = 'none';

    q.options.forEach(function (text, idx) {
      const btn = document.createElement('button');
      btn.className = 'quiz-option';
      btn.textContent = text;  
      btn.dataset.idx = idx;

      btn.addEventListener('click', function () {
        if (answered) return;
        answered = true;

        const isCorrect = idx === q.correct;
        if (isCorrect) score++;

        $$('.quiz-option').forEach(function (opt, i) {
          opt.disabled = true;
          if (i === q.correct) opt.classList.add('is-revealed');
        });

        btn.classList.add(isCorrect ? 'is-correct' : 'is-wrong');

        feedbackEl.textContent = isCorrect ? '✓ ' + q.feedback : '✗ Wrong — ' + q.feedback;
        feedbackEl.className = 'quiz-feedback is-visible ' + (isCorrect ? 'is-correct' : 'is-wrong');

        nextBtn.style.display = 'inline-flex';
      });

      optsEl.appendChild(btn);
    });

    progressEl.textContent = `Question ${currentQ + 1} of ${questions.length}`;
  }

  function renderResult() {
    qEl.textContent = `Quiz complete — you scored ${score} out of ${questions.length}!`;
    optsEl.innerHTML = '';
    feedbackEl.className = 'quiz-feedback is-visible is-correct';
    feedbackEl.textContent = score >= 4
      ? '🎉 Excellent work! You have a strong grasp of DOM manipulation concepts.'
      : score >= 3
        ? '👍 Good job! Review the concepts you missed and try again.'
        : '📖 Keep studying the DOM and event listener patterns — you got this!';
    nextBtn.textContent = 'Restart Quiz';
    nextBtn.style.display = 'inline-flex';
    progressEl.textContent = `Score: ${score} / ${questions.length}`;
  }

  nextBtn.addEventListener('click', function () {
    if (currentQ >= questions.length) {
      currentQ = 0;
      score    = 0;
      nextBtn.textContent = 'Next →';
    } else {
      currentQ++;
    }
    renderQuestion();
  });

  renderQuestion();
})();


(function initSearch() {
  const concepts = [
    { name: 'Document Object Model', sub: 'The browser\'s live HTML tree', icon: 'D' },
    { name: 'Event Listener', sub: 'addEventListener(type, handler)', icon: 'E' },
    { name: 'DOM Manipulation', sub: 'Reading and mutating nodes', icon: 'M' },
    { name: 'classList.toggle()', sub: 'Add / remove CSS state classes', icon: 'C' },
    { name: 'textContent', sub: 'Safe text injection — no XSS', icon: 'T' },
    { name: 'getElementById', sub: 'Select node by its id attribute', icon: 'G' },
    { name: 'querySelector', sub: 'CSS selector-based DOM query', icon: 'Q' },
    { name: 'createElement', sub: 'Build new DOM nodes in JS', icon: 'N' },
    { name: 'appendChild', sub: 'Insert node into the tree', icon: 'A' },
    { name: 'State Management', sub: 'JS variables reflecting UI reality', icon: 'S' },
    { name: 'IPO Loop', sub: 'Input → Process → Output cycle', icon: 'I' },
    { name: 'const / let / var', sub: 'Variable declaration keywords', icon: 'V' },
  ];

  const searchInput = $('.js-search');
  const resultsList = $('#search-results');
  const noResults   = $('#no-results');

  concepts.forEach(function (concept) {
    const li    = document.createElement('li');
    li.className = 'search-item';
    li.dataset.name = concept.name.toLowerCase();

    const icon  = document.createElement('div');
    icon.className = 'search-item-icon';
    icon.textContent = concept.icon; 

    const info  = document.createElement('div');
    const name  = document.createElement('div');
    name.className = 'search-item-name';
    name.textContent = concept.name;

    const sub   = document.createElement('div');
    sub.className = 'search-item-sub';
    sub.textContent = concept.sub;

    info.appendChild(name);
    info.appendChild(sub);
    li.appendChild(icon);
    li.appendChild(info);

    resultsList.appendChild(li);
  });

  const items = $$('.search-item');

  searchInput.addEventListener('input', function () {
    const query = searchInput.value.trim().toLowerCase();
    let visibleCount = 0;

    items.forEach(function (item, idx) {
      const concept  = concepts[idx];
      const haystack = concept.name.toLowerCase() + ' ' + concept.sub.toLowerCase();
      const matches  = query === '' || haystack.includes(query);

      item.classList.toggle('is-hidden', !matches);
      if (matches) visibleCount++;

      const nameEl = item.querySelector('.search-item-name');
      if (query && matches) {
        const re = new RegExp(`(${query.replace(/[.*+?^${}()|[\]\\]/g,'\\$&')})`, 'gi');
        nameEl.innerHTML = concept.name.replace(re, '<mark>$1</mark>');
      } else {
        nameEl.textContent = concept.name;   
      }
    });

    noResults.classList.toggle('is-visible', visibleCount === 0 && query !== '');
  });
})();
