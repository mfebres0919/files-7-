/* ============================================================
   RIDGELINE POOLS v2 — quote.js
   Multi-step quote form — Meridian-inspired JS-driven cards
   ============================================================ */

(function () {
  'use strict';

  /* ── Elements ── */
  const stepsContainer = document.getElementById('quoteSteps');
  const nextBtn        = document.getElementById('quoteNext');
  const backBtn        = document.getElementById('quoteBack');
  const progressLabel  = document.getElementById('quoteProgressLabel');
  const progressPct    = document.getElementById('quoteProgressPct');
  const progressFill   = document.getElementById('quoteProgressFill');
  const progressCard   = document.getElementById('quoteProgressCard');
  const successEl      = document.getElementById('quoteSuccess');
  const quoteCard      = document.getElementById('quoteCard');

  if (!stepsContainer) return;

  /* ── State ── */
  let currentStep  = 0;
  let answers      = {};
  let steps        = [];

  /* ══════════════════════════════════════════════
     STEP DEFINITIONS
  ══════════════════════════════════════════════ */

  const step0 = {
    id: 'service',
    question: 'What Can We Help You With?',
    hint: 'Select the service that best describes your project.',
    type: 'service',
    required: true,
    options: [
      { value: 'custom',      label: 'New Custom Pool',      desc: 'Brand new gunite pool designed around your home and lifestyle.',                         icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.813 15.904L9 18.75l-.813-2.846a4.5 4.5 0 00-3.09-3.09L2.25 12l2.846-.813a4.5 4.5 0 003.09-3.09L9 5.25l.813 2.846a4.5 4.5 0 003.09 3.09L15.75 12l-2.846.813a4.5 4.5 0 00-3.09 3.09z"/>' },
      { value: 'renovation',  label: 'Pool Renovation',      desc: 'Refresh or fully remodel your existing pool — plaster, coping, equipment and more.',    icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.42 15.17L17.25 21A2.652 2.652 0 0021 17.25l-5.877-5.877M11.42 15.17l2.496-3.03c.317-.384.74-.626 1.208-.766M11.42 15.17l-4.655 5.653a2.548 2.548 0 11-3.586-3.586l6.837-5.63m5.108-.233c.55-.164 1.163-.188 1.743-.14a4.5 4.5 0 004.486-6.336l-3.276 3.277a3.004 3.004 0 01-2.25-2.25l3.276-3.276a4.5 4.5 0 00-6.336 4.486c.091 1.076-.071 2.264-.904 2.95l-.102.085m-1.745 1.437L5.909 7.5H4.5L2.25 3.75l1.5-1.5L7.5 4.5v1.409l4.26 4.26m-1.745 1.437l1.745-1.437m6.615 8.206L15.75 15.75M4.867 19.125h.008v.008h-.008v-.008z"/>' },
      { value: 'luxury',      label: 'Luxury Add-Ons',       desc: 'Fire bowls, outdoor kitchens, water features, pergolas — elevate what you already have.', icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M11.48 3.499a.562.562 0 011.04 0l2.125 5.111a.563.563 0 00.475.345l5.518.442c.499.04.701.663.321.988l-4.204 3.602a.563.563 0 00-.182.557l1.285 5.385a.562.562 0 01-.84.61l-4.725-2.885a.563.563 0 00-.586 0L6.982 20.54a.562.562 0 01-.84-.61l1.285-5.386a.562.562 0 00-.182-.557l-4.204-3.602a.563.563 0 01.321-.988l5.518-.442a.563.563 0 00.475-.345L11.48 3.5z"/>' },
      { value: 'maintenance', label: 'Maintenance & Upkeep', desc: 'Weekly, bi-weekly, or monthly service plans to keep your pool clean and running.',       icon: '<path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M9.594 3.94c.09-.542.56-.94 1.11-.94h2.593c.55 0 1.02.398 1.11.94l.213 1.281c.063.374.313.686.645.87.074.04.147.083.22.127.325.196.72.257 1.075.124l1.217-.456a1.125 1.125 0 011.37.49l1.296 2.247a1.125 1.125 0 01-.26 1.431l-1.003.827c-.293.241-.438.613-.43.992a7.723 7.723 0 010 .255c-.008.378.137.75.43.991l1.004.827c.424.35.534.955.26 1.43l-1.298 2.247a1.125 1.125 0 01-1.369.491l-1.217-.456c-.355-.133-.75-.072-1.076.124a6.47 6.47 0 01-.22.128c-.331.183-.581.495-.644.869l-.213 1.281c-.09.543-.56.94-1.11.94h-2.594c-.55 0-1.019-.398-1.11-.94l-.213-1.281c-.062-.374-.312-.686-.644-.87a6.52 6.52 0 01-.22-.127c-.325-.196-.72-.257-1.076-.124l-1.217.456a1.125 1.125 0 01-1.369-.49l-1.297-2.247a1.125 1.125 0 01.26-1.431l1.004-.827c.292-.24.437-.613.43-.991a6.932 6.932 0 010-.255c.007-.38-.138-.751-.43-.992l-1.004-.827a1.125 1.125 0 01-.26-1.43l1.297-2.247a1.125 1.125 0 011.37-.491l1.216.456c.356.133.751.072 1.076-.124.072-.044.146-.086.22-.128.332-.183.582-.495.644-.869l.214-1.28z"/><path stroke-linecap="round" stroke-linejoin="round" stroke-width="1.5" d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"/>' },
    ]
  };

  /* ── Service-specific questions ── */
  const serviceQuestions = {

    /* Custom Build: pool style + existing pool. Features/add-ons handled separately. */
    custom: [
      {
        id: 'pool_style', question: 'What type of pool are you envisioning?',
        hint: 'Choose the style that best matches your vision.',
        type: 'single', required: false,
        options: [
          { value: 'freeform',  label: 'Freeform / Natural' },
          { value: 'geometric', label: 'Geometric / Modern' },
          { value: 'lap',       label: 'Lap Pool' },
          { value: 'resort',    label: 'Resort-Style' },
          { value: 'unsure',    label: 'Not Sure Yet — Open to Ideas' },
        ]
      },
      {
        id: 'existing_pool', question: 'Is there currently a pool on the property?',
        type: 'single', required: false,
        options: [
          { value: 'no',  label: 'No — Starting Fresh' },
          { value: 'yes', label: 'Yes — Needs to Be Removed' },
        ]
      },
    ],

    /* Renovation: age, what needs work, spa status */
    renovation: [
      {
        id: 'pool_age', question: 'How old is your current pool?',
        type: 'single', required: false,
        options: [
          { value: 'under5',  label: 'Under 5 Years' },
          { value: '5-10',    label: '5–10 Years' },
          { value: '10-20',   label: '10–20 Years' },
          { value: 'over20',  label: '20+ Years' },
          { value: 'unknown', label: 'Not Sure' },
        ]
      },
      {
        id: 'reno_needs', question: 'What needs attention?',
        hint: 'Select everything that applies.',
        type: 'multi', required: false,
        options: [
          { value: 'plaster',   label: 'Plaster / Surface' },
          { value: 'coping',    label: 'Coping / Tile' },
          { value: 'equipment', label: 'Equipment / Pump' },
          { value: 'leaking',   label: 'Leaking' },
          { value: 'deck',      label: 'Deck / Surround' },
          { value: 'full',      label: 'Full Remodel' },
        ]
      },
      {
        id: 'has_spa', question: 'Does your pool currently have a spa?',
        type: 'single', required: false,
        options: [
          { value: 'yes',     label: 'Yes' },
          { value: 'no',      label: 'No' },
          { value: 'add-one', label: 'No — But I\'d Like to Add One' },
        ]
      },
    ],

    /* Luxury Add-Ons: just features. No budget (varies per feature), no "existing vs new" (obvious). */
    luxury: [
      {
        id: 'addons', question: 'Which features are you looking to add?',
        hint: 'Select all that interest you.',
        type: 'multi', required: false,
        options: [
          { value: 'outdoor-kitchen', label: 'Outdoor Kitchen' },
          { value: 'fire-bowls',      label: 'Fire Bowls' },
          { value: 'water-wall',      label: 'Water Wall' },
          { value: 'grotto',          label: 'Grotto' },
          { value: 'pergola',         label: 'Pergola / Cabana' },
          { value: 'automation',      label: 'Smart Pool Automation' },
          { value: 'spa',             label: 'Spa / Hot Tub' },
        ]
      },
    ],

    /* Maintenance: pool type, frequency, issues (with Other + text). No budget. */
    maintenance: [
      {
        id: 'pool_type', question: 'What type of pool do you have?',
        type: 'single', required: false,
        options: [
          { value: 'gunite',     label: 'Gunite / Plaster' },
          { value: 'fiberglass', label: 'Fiberglass' },
          { value: 'unsure',     label: 'Not Sure' },
        ]
      },
      {
        id: 'service_freq', question: 'How often do you need service?',
        type: 'single', required: false,
        options: [
          { value: 'weekly',   label: 'Weekly' },
          { value: 'biweekly', label: 'Every 2 Weeks' },
          { value: 'monthly',  label: 'Monthly' },
          { value: 'onetime',  label: 'One-Time Service' },
        ]
      },
      {
        id: 'maint_issues', question: 'Are you experiencing any current issues?',
        hint: 'Select all that apply.',
        type: 'multi', required: false,
        hasOther: true, /* shows text input when "other" is selected */
        options: [
          { value: 'green',     label: 'Green / Cloudy Water' },
          { value: 'equipment', label: 'Equipment Problem' },
          { value: 'algae',     label: 'Algae Buildup' },
          { value: 'other',     label: 'Other' },
          { value: 'none',      label: 'No Issues — Just Preventive' },
        ]
      },
    ],
  };

  /* ── Shared steps ──
     budget excluded for: luxury (price varies per feature), maintenance (service call not a project)
  ── */
  const sharedBase = [
    {
      id: 'yard_size', question: 'How big is your backyard?',
      hint: 'An approximate size helps us plan before we visit.',
      type: 'single', required: false,
      options: [
        { value: 'small',  label: 'Small — Under 800 sq ft' },
        { value: 'medium', label: 'Medium — 800 to 2,000 sq ft' },
        { value: 'large',  label: 'Large — 2,000 to 5,000 sq ft' },
        { value: 'xlarge', label: 'Very Large — 5,000+ sq ft' },
      ]
    },
    {
      id: 'yard_features', question: 'Does your yard have any of these?',
      hint: 'These affect site preparation and cost estimates.',
      type: 'multi', required: false,
      options: [
        { value: 'slope', label: 'Slope or Grade' },
        { value: 'trees', label: 'Large Trees' },
        { value: 'hoa',   label: 'HOA Restrictions' },
        { value: 'rock',  label: 'Rock / Caliche Soil' },
        { value: 'none',  label: 'None of These' },
      ]
    },
  ];

  const budgetStep = {
    id: 'budget', question: 'What\'s your approximate budget?',
    hint: 'Custom builds at Ridgeline start at $85,000. Being upfront helps us give you accurate information.',
    type: 'budget',
  };

  const sharedTail = [
    {
      id: 'timeline', question: 'When would you like to get started?',
      type: 'single', required: false,
      options: [
        { value: 'asap',        label: 'As Soon As Possible' },
        { value: '1-3months',   label: '1–3 Months' },
        { value: '3-6months',   label: '3–6 Months' },
        { value: 'next-spring', label: 'Next Spring' },
        { value: 'flexible',    label: 'Flexible — Just Exploring' },
      ]
    },
    {
      id: 'referral', question: 'How did you hear about us?',
      type: 'single', required: false,
      options: [
        { value: 'google',    label: 'Google Search' },
        { value: 'referral',  label: 'Friend or Family' },
        { value: 'instagram', label: 'Instagram / Facebook' },
        { value: 'nextdoor',  label: 'Nextdoor' },
        { value: 'saw-work',  label: 'Saw Our Work in Person' },
        { value: 'other',     label: 'Other' },
      ]
    },
    {
      id: 'contact',
      question: 'Last Step — How Do We Reach You?',
      hint: 'We\'ll follow up within 24 hours. No spam, no pressure.',
      type: 'contact',
    },
  ];

  /* Build full step list per service */
  function buildSteps(service) {
    const noBudget = ['luxury', 'maintenance'];
    const middle = noBudget.includes(service)
      ? sharedBase
      : [...sharedBase, budgetStep];
    return [step0, ...serviceQuestions[service], ...middle, ...sharedTail];
  }

  /* Start with just step 0 */
  steps = [step0];

  /* ══════════════════════════════════════════════
     RENDER CURRENT STEP
  ══════════════════════════════════════════════ */

  function render() {
    const step = steps[currentStep];
    stepsContainer.innerHTML = '';

    /* Question */
    const questionEl = document.createElement('p');
    questionEl.className = 'quote-step-question';
    questionEl.textContent = step.question;
    stepsContainer.appendChild(questionEl);

    /* Hint */
    if (step.hint) {
      const hintEl = document.createElement('p');
      hintEl.className = 'quote-step-hint';
      hintEl.textContent = step.hint;
      stepsContainer.appendChild(hintEl);
    }

    /* Input type */
    if      (step.type === 'service') renderServiceGrid(step);
    else if (step.type === 'single' || step.type === 'multi') renderOptions(step);
    else if (step.type === 'budget')  renderBudget();
    else if (step.type === 'contact') renderContact();

    updateProgress();

    backBtn.style.visibility = currentStep === 0 ? 'hidden' : 'visible';

    if (currentStep === steps.length - 1) {
      nextBtn.innerHTML = 'Submit Request <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M7 17L17 7M17 7H7M17 7v10"/></svg>';
    } else {
      nextBtn.innerHTML = 'Next <svg class="btn-icon" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor"><path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M9 5l7 7-7 7"/></svg>';
    }

    stepsContainer.style.animation = 'none';
    stepsContainer.offsetHeight;
    stepsContainer.style.animation = 'fadeUp 0.35s cubic-bezier(0.22,1,0.36,1) forwards';
  }

  /* ── Service grid ── */
  function renderServiceGrid(step) {
    const grid = document.createElement('div');
    grid.className = 'quote-service-grid';

    step.options.forEach((opt) => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'quote-service-card' + (answers[step.id] === opt.value ? ' is-selected' : '');
      card.dataset.value = opt.value;
      card.innerHTML = `
        <div class="quote-service-icon">
          <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">${opt.icon}</svg>
        </div>
        <span class="quote-service-title">${opt.label}</span>
        <span class="quote-service-desc">${opt.desc}</span>
      `;
      card.addEventListener('click', () => {
        grid.querySelectorAll('.quote-service-card').forEach((c) => c.classList.remove('is-selected'));
        card.classList.add('is-selected');
        answers[step.id] = opt.value;
      });
      grid.appendChild(card);
    });

    stepsContainer.appendChild(grid);
  }

  /* ── Single / multi option rows ── */
  function renderOptions(step) {
    const container = document.createElement('div');
    container.className = 'quote-options';

    const isMulti = step.type === 'multi';
    const saved   = answers[step.id] || (isMulti ? [] : null);

    step.options.forEach((opt) => {
      const isSelected = isMulti
        ? (Array.isArray(saved) && saved.includes(opt.value))
        : saved === opt.value;

      const btn = document.createElement('button');
      btn.type = 'button';
      btn.className = 'quote-option' + (isMulti ? ' is-multi' : '') + (isSelected ? ' is-selected' : '');
      btn.dataset.value = opt.value;
      btn.innerHTML = `
        <span class="quote-option-dot"></span>
        <span class="quote-option-label">${opt.label}</span>
      `;

      btn.addEventListener('click', () => {
        if (isMulti) {
          btn.classList.toggle('is-selected');
          if (!Array.isArray(answers[step.id])) answers[step.id] = [];
          const idx = answers[step.id].indexOf(opt.value);
          if (idx === -1) answers[step.id].push(opt.value);
          else answers[step.id].splice(idx, 1);

          /* Show/hide "Other" text input if this step has hasOther */
          if (step.hasOther && opt.value === 'other') {
            const otherInput = container.querySelector('.quote-other-input');
            if (otherInput) {
              otherInput.style.display = btn.classList.contains('is-selected') ? 'block' : 'none';
            }
          }
        } else {
          container.querySelectorAll('.quote-option').forEach((b) => b.classList.remove('is-selected'));
          btn.classList.add('is-selected');
          answers[step.id] = opt.value;
        }
      });

      container.appendChild(btn);

      /* "Other" text input — rendered immediately after the Other button */
      if (step.hasOther && opt.value === 'other') {
        const otherWrap = document.createElement('div');
        otherWrap.className = 'quote-other-input';
        otherWrap.style.display = (Array.isArray(saved) && saved.includes('other')) ? 'block' : 'none';
        otherWrap.innerHTML = `
          <input type="text" placeholder="Please describe the issue..."
                 value="${answers.maint_issues_other || ''}"
                 class="quote-other-text">
        `;
        otherWrap.querySelector('input').addEventListener('input', (e) => {
          answers.maint_issues_other = e.target.value;
        });
        container.appendChild(otherWrap);
      }
    });

    stepsContainer.appendChild(container);
  }

  /* ── Budget slider ── */
  function renderBudget() {
    const saved = answers.budget || 125000;
    const wrapper = document.createElement('div');
    wrapper.innerHTML = `
      <p class="budget-display" id="budgetDisplay">$${Number(saved).toLocaleString()}<span class="accent">+</span></p>
      <input type="range" id="budgetRange" min="85000" max="500000" step="5000" value="${saved}"
             aria-label="Budget" aria-valuemin="85000" aria-valuemax="500000">
      <div class="budget-range-labels">
        <span>$85k</span><span>$200k</span><span>$350k</span><span>$500k+</span>
      </div>
    `;
    const display = wrapper.querySelector('#budgetDisplay');
    const range   = wrapper.querySelector('#budgetRange');
    range.addEventListener('input', () => {
      const val = parseInt(range.value);
      answers.budget = val;
      display.innerHTML = '$' + val.toLocaleString() + '<span class="accent">+</span>';
    });
    answers.budget = answers.budget || 125000;
    stepsContainer.appendChild(wrapper);
  }

  /* ── Contact info ── */
  function renderContact() {
    const saved = answers.contact || {};
    const wrapper = document.createElement('div');
    wrapper.className = 'quote-inputs';
    wrapper.innerHTML = `
      <div class="quote-input-row">
        <div class="quote-input-field">
          <label for="q-first">First Name *</label>
          <input type="text" id="q-first" name="first_name" placeholder="Marcus" autocomplete="given-name" value="${saved.first_name || ''}">
        </div>
        <div class="quote-input-field">
          <label for="q-last">Last Name *</label>
          <input type="text" id="q-last" name="last_name" placeholder="Ridgeline" autocomplete="family-name" value="${saved.last_name || ''}">
        </div>
      </div>
      <div class="quote-input-field">
        <label for="q-email">Email Address *</label>
        <input type="email" id="q-email" name="email" placeholder="you@email.com" autocomplete="email" value="${saved.email || ''}">
      </div>
      <div class="quote-input-row">
        <div class="quote-input-field">
          <label for="q-phone">Phone Number *</label>
          <input type="tel" id="q-phone" name="phone" placeholder="(512) 000-0000" autocomplete="tel" value="${saved.phone || ''}">
        </div>
        <div class="quote-input-field">
          <label for="q-zip">ZIP Code *</label>
          <input type="text" id="q-zip" name="zip" placeholder="78701" inputmode="numeric" value="${saved.zip || ''}">
        </div>
      </div>
    `;
    wrapper.querySelectorAll('input').forEach((inp) => {
      inp.addEventListener('input', () => {
        if (!answers.contact) answers.contact = {};
        answers.contact[inp.name] = inp.value;
      });
    });
    stepsContainer.appendChild(wrapper);
  }

  /* ══════════════════════════════════════════════
     PROGRESS BAR
  ══════════════════════════════════════════════ */

  function updateProgress() {
    if (!progressLabel || !progressPct || !progressFill || !progressCard) return;

    if (currentStep === 0) {
      progressCard.style.display = 'none';
      return;
    }

    progressCard.style.display = 'flex';

    const total   = steps.length;
    const pct     = Math.round((currentStep / (total - 1)) * 100);
    const display = Math.min(pct, 100);

    progressLabel.textContent = `Step ${currentStep + 1} of ${total}`;
    progressPct.textContent   = display + '%';
    progressFill.style.width  = display + '%';
    progressFill.parentElement.setAttribute('aria-valuenow', display);

    /* Move progress card inside the quote card, just before .quote-nav */
    const nav = quoteCard ? quoteCard.querySelector('.quote-nav') : null;
    if (nav && progressCard.parentNode !== quoteCard) {
      quoteCard.insertBefore(progressCard, nav);
    }
  }

  /* ══════════════════════════════════════════════
     NAVIGATION
  ══════════════════════════════════════════════ */

  function advance() {
    const step = steps[currentStep];

    if (step.type === 'service') {
      if (!answers.service) { shake(stepsContainer); return; }
      steps = buildSteps(answers.service);
    }

    if (currentStep === steps.length - 1) { submit(); return; }

    currentStep++;
    render();
  }

  function goBack() {
    if (currentStep === 0) return;
    currentStep--;
    render();
  }

  function submit() {
    const first = document.getElementById('q-first');
    const email = document.getElementById('q-email');
    const phone = document.getElementById('q-phone');

    if (first && !first.value.trim())        { first.focus(); shake(first); return; }
    if (email && !email.value.includes('@')) { email.focus(); shake(email); return; }
    if (phone && !phone.value.trim())        { phone.focus(); shake(phone); return; }

    if (quoteCard)    quoteCard.style.display    = 'none';
    if (progressCard) progressCard.style.display = 'none';
    if (successEl)    successEl.style.display    = 'flex';
    window.scrollTo({ top: 0, behavior: 'smooth' });
  }

  function shake(el) {
    el.style.animation = 'none';
    el.offsetHeight;
    el.style.animation = 'shake 0.4s ease';
  }

  if (nextBtn) nextBtn.addEventListener('click', advance);
  if (backBtn) backBtn.addEventListener('click', goBack);

  /* ── Injected styles ── */
  const style = document.createElement('style');
  style.textContent = `
    @keyframes shake {
      0%,100% { transform:translateX(0); }
      20%      { transform:translateX(-6px); }
      40%      { transform:translateX(6px); }
      60%      { transform:translateX(-4px); }
      80%      { transform:translateX(4px); }
    }
    @keyframes fadeUp {
      from { opacity:0; transform:translateY(12px); }
      to   { opacity:1; transform:translateY(0); }
    }
    #quoteSteps { animation: fadeUp 0.35s cubic-bezier(0.22,1,0.36,1) forwards; }
    .quote-success { display:none; flex-direction:column; align-items:center; text-align:center; }

    /* Other text input */
    .quote-other-input {
      padding: 0.75rem 0 0.25rem;
    }
    .quote-other-text {
      width: 100%;
      background: var(--grey-50);
      border: 1.5px solid var(--maroon);
      border-radius: 8px;
      padding: 0.875rem 1rem;
      font-family: var(--font-body);
      font-size: 0.95rem;
      color: var(--text-primary);
      outline: none;
    }
    .quote-other-text::placeholder { color: var(--grey-300); }
    .quote-other-text:focus { background: var(--white); }
  `;
  document.head.appendChild(style);

/* ── Enter key advances to next step ── */
document.addEventListener('keydown', (e) => {
  if (e.key === 'Enter' && nextBtn && !nextBtn.disabled) {
    nextBtn.click();
  }
});

  /* ── Init ── */
  if (progressCard) progressCard.style.display = 'none';
  render();

})();