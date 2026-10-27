// Sulzer Assistant — pre-filled demo chatbot
// Drop-in widget: loads from chatbot.js, no dependencies, no API key.

(function () {
  'use strict';

  // ── Brand colours (match the demo page) ──────────────────────────────────
  const C = {
    navy:    '#0c1c2e',
    blue:    '#1d59af',
    blueHov: '#174d9e',
    lightBg: '#eef4fb',
    border:  '#cfe0f4',
    textMid: '#5d6b7a',
    white:   '#ffffff',
  };

  // ── Q&A knowledge base ────────────────────────────────────────────────────
  const QA = [
    {
      q: 'Which brands can you replace?',
      a: 'We have direct replacements for <strong>Flygt, Grundfos, KSB, Wilo, Ebara,</strong> and <strong>Tsurumi</strong> sewage pumps. Select your brand from the dropdown above, or search by part number or RSK code.',
    },
    {
      q: 'What is a drop-in replacement?',
      a: 'A <strong>drop-in</strong> replacement mounts directly onto your existing guide-rail base — no modifications needed. Some pumps require a Sulzer guide-rail adapter claw instead; we flag this clearly in the comparison card.',
    },
    {
      q: 'How do I find my replacement?',
      a: 'Two ways: enter your <strong>part number or RSK code</strong> in the search box (e.g. <em>581 30 22</em> or <em>98044186</em>), or use the brand and model dropdowns. Your recommended Sulzer replacement appears instantly.',
    },
    {
      q: 'What is the ABS XFP range?',
      a: 'The <strong>ABS XFP</strong> is Sulzer\'s premium submersible sewage pump range. It features the Contrablock Plus impeller for clog-resistant operation, <strong>IE3 Premium Efficiency</strong> motors, and IP68 protection — available from DN 80 to DN 300.',
    },
    {
      q: 'How much energy can I save?',
      a: 'Our IE3 motors typically save <strong>10–20 %</strong> over older IE1/IE2 pumps. Use the <strong>Energy Savings Calculator</strong> at the bottom of the page — enter your operating hours and electricity rate for an exact annual figure.',
    },
    {
      q: 'Where can I order?',
      a: 'Order via the <strong>Sulzer webstore</strong> (sense.sulzer.com) or through your local distributor. In Germany, <strong>GC Gruppe</strong> is our preferred partner. Click the buttons on the replacement card to get started.',
    },
    {
      q: 'What is IE3 efficiency?',
      a: '<strong>IE3 "Premium Efficiency"</strong> is the top motor rating under IEC 60034-30. Compared to IE1/IE2 motors in older pumps, IE3 runs cooler, lasts longer, and typically saves hundreds of euros per pump per year.',
    },
    {
      q: 'What is the Contrablock impeller?',
      a: '<strong>Contrablock Plus</strong> is Sulzer\'s patented clog-resistant impeller. Its geometry pulls fibrous material and rags away from the seal face, dramatically cutting blockage call-outs and maintenance costs in sewage applications.',
    },
  ];

  const GREETING = "Hello! I'm the <strong>Sulzer Assistant</strong>. How can I help you find the right pump replacement today?";

  // ── Fuzzy match: find the best Q&A for a typed question ──────────────────
  function findAnswer(input) {
    const norm = (s) => s.toLowerCase().replace(/[^a-z0-9 ]/g, '');
    const words = norm(input).split(/\s+/).filter(Boolean);
    if (!words.length) return null;

    let best = null, bestScore = 0;
    for (const item of QA) {
      const haystack = norm(item.q) + ' ' + norm(item.a);
      const score = words.reduce((n, w) => n + (haystack.includes(w) ? 1 : 0), 0);
      if (score > bestScore) { bestScore = score; best = item; }
    }
    // Require at least one matching word (avoid totally off-topic matches)
    return bestScore >= 1 ? best : null;
  }

  // ── Build DOM ─────────────────────────────────────────────────────────────
  function buildWidget() {
    // Inject styles
    const style = document.createElement('style');
    style.textContent = `
      #sulzer-chat-btn {
        position:fixed; bottom:28px; right:28px; z-index:9999;
        width:56px; height:56px; border-radius:50%;
        background:${C.blue}; border:none; cursor:pointer;
        box-shadow:0 4px 18px rgba(29,89,175,.45);
        display:flex; align-items:center; justify-content:center;
        transition:background .15s, transform .15s;
      }
      #sulzer-chat-btn:hover { background:${C.blueHov}; transform:scale(1.07); }
      #sulzer-chat-btn svg { width:26px; height:26px; fill:${C.white}; pointer-events:none; }

      #sulzer-chat-badge {
        position:absolute; top:-3px; right:-3px;
        width:14px; height:14px; border-radius:50%;
        background:#e53935; border:2px solid #fff;
        display:none;
      }

      #sulzer-chat-window {
        position:fixed; bottom:96px; right:28px; z-index:9998;
        width:340px; max-height:540px;
        background:${C.white}; border-radius:16px;
        box-shadow:0 12px 40px rgba(12,28,46,.22);
        display:flex; flex-direction:column;
        overflow:hidden; font-family:"Helvetica Neue",Helvetica,Arial,sans-serif;
        transform:scale(.92) translateY(12px); opacity:0;
        transition:transform .2s ease, opacity .2s ease;
        pointer-events:none;
      }
      #sulzer-chat-window.open {
        transform:scale(1) translateY(0); opacity:1; pointer-events:all;
      }

      #sulzer-chat-header {
        background:${C.navy}; color:${C.white};
        padding:14px 18px; display:flex; align-items:center; gap:12px; flex:none;
      }
      #sulzer-chat-header svg { width:22px; height:22px; fill:${C.white}; flex:none; }
      .sulzer-chat-avatar {
        width:36px; height:36px; border-radius:50%; background:${C.blue};
        display:flex; align-items:center; justify-content:center; flex:none;
      }
      .sulzer-chat-avatar svg { width:20px; height:20px; fill:${C.white}; }
      .sulzer-chat-hinfo { flex:1; min-width:0; }
      .sulzer-chat-hname { font-size:14px; font-weight:700; line-height:1.2; }
      .sulzer-chat-hstatus { font-size:11px; color:#9fb3c7; margin-top:2px; }
      #sulzer-chat-close {
        background:none; border:none; cursor:pointer; padding:4px;
        color:#9fb3c7; display:flex; align-items:center; flex:none;
      }
      #sulzer-chat-close:hover { color:#fff; }
      #sulzer-chat-close svg { width:16px; height:16px; fill:currentColor; }

      #sulzer-chat-body {
        flex:1; overflow-y:auto; padding:16px 14px 8px; display:flex;
        flex-direction:column; gap:10px; min-height:0;
        scroll-behavior:smooth;
      }
      #sulzer-chat-body::-webkit-scrollbar { width:4px; }
      #sulzer-chat-body::-webkit-scrollbar-thumb { background:#d3dae1; border-radius:4px; }

      .sulzer-msg { display:flex; gap:8px; align-items:flex-end; max-width:100%; }
      .sulzer-msg.user { flex-direction:row-reverse; }
      .sulzer-msg-bubble {
        max-width:78%; padding:10px 13px; border-radius:14px;
        font-size:13px; line-height:1.5; color:${C.navy};
        background:#f0f4f8;
      }
      .sulzer-msg.user .sulzer-msg-bubble {
        background:${C.blue}; color:${C.white};
        border-bottom-right-radius:4px;
      }
      .sulzer-msg.bot .sulzer-msg-bubble { border-bottom-left-radius:4px; }

      .sulzer-msg-dot {
        width:28px; height:28px; border-radius:50%;
        background:${C.blue}; display:flex; align-items:center;
        justify-content:center; flex:none; align-self:flex-end;
      }
      .sulzer-msg-dot svg { width:15px; height:15px; fill:${C.white}; }

      .sulzer-suggestions {
        padding:0 14px 10px; display:flex; flex-wrap:wrap; gap:6px;
      }
      .sulzer-sug-btn {
        background:${C.lightBg}; color:${C.blue}; border:1px solid ${C.border};
        border-radius:999px; padding:6px 12px; font-size:12px; font-weight:600;
        cursor:pointer; font-family:inherit; transition:background .12s;
        white-space:normal; text-align:left; line-height:1.3;
      }
      .sulzer-sug-btn:hover { background:#ddeefb; }

      #sulzer-chat-input-row {
        padding:10px 14px 14px; display:flex; gap:8px; flex:none;
        border-top:1px solid #e3e8ed;
      }
      #sulzer-chat-input {
        flex:1; padding:10px 13px; font-size:13px; border:1px solid #cfd8e1;
        border-radius:9px; outline:none; font-family:inherit; color:${C.navy};
        resize:none; height:38px; line-height:1.4;
      }
      #sulzer-chat-input:focus { border-color:${C.blue}; }
      #sulzer-chat-send {
        background:${C.blue}; border:none; border-radius:9px;
        width:38px; height:38px; cursor:pointer; display:flex;
        align-items:center; justify-content:center; flex:none;
        transition:background .12s;
      }
      #sulzer-chat-send:hover { background:${C.blueHov}; }
      #sulzer-chat-send svg { width:16px; height:16px; fill:${C.white}; }

      .sulzer-typing { display:flex; gap:4px; align-items:center; padding:6px 0; }
      .sulzer-typing span {
        width:7px; height:7px; background:#c0cbd6; border-radius:50%;
        animation:sulzer-bounce .9s infinite ease-in-out;
      }
      .sulzer-typing span:nth-child(2) { animation-delay:.18s; }
      .sulzer-typing span:nth-child(3) { animation-delay:.36s; }
      @keyframes sulzer-bounce {
        0%,80%,100% { transform:translateY(0); }
        40% { transform:translateY(-6px); }
      }
    `;
    document.head.appendChild(style);

    // Chat button
    const btn = document.createElement('button');
    btn.id = 'sulzer-chat-btn';
    btn.setAttribute('aria-label', 'Open Sulzer Assistant');
    btn.innerHTML = `
      <svg viewBox="0 0 24 24">
        <rect x="11" y="2" width="2" height="3" rx="1"/>
        <circle cx="12" cy="2" r="1.5"/>
        <rect x="3" y="8" width="2" height="4" rx="1"/>
        <rect x="19" y="8" width="2" height="4" rx="1"/>
        <rect x="5" y="5" width="14" height="13" rx="2.5"/>
        <circle cx="9" cy="10.5" r="1.8" style="fill:#1d59af"/>
        <circle cx="15" cy="10.5" r="1.8" style="fill:#1d59af"/>
        <rect x="8" y="13.5" width="8" height="2" rx="1" style="fill:#1d59af"/>
      </svg>
      <span id="sulzer-chat-badge"></span>
    `;
    document.body.appendChild(btn);

    // Chat window
    const win = document.createElement('div');
    win.id = 'sulzer-chat-window';
    win.setAttribute('role', 'dialog');
    win.setAttribute('aria-label', 'Sulzer Assistant');
    win.innerHTML = `
      <div id="sulzer-chat-header">
        <div class="sulzer-chat-avatar">
          <svg viewBox="0 0 171 28"><path d="M8.4,0C2.1,0,0,4.3,0,7.1C0,9.5,0,9.9,0,11c0,3,2.8,6.4,6.9,6.4c3.6,0,8,0,8.7,0c1,0,1.2,0.6,1.2,1c0,0.4,0,0.7,0,1c0,0.5-0.4,1-1.2,1c-1,0-15.2,0-15.2,0v7.2c0,0,11.6,0,18.5,0c5,0,7.9-4.4,7.9-7.3c0-2,0-2.7,0-4c0-4.1-4.1-6.9-8.2-6.9c-3.6,0-7.5,0-8.2,0c-0.9,0-1.2-0.6-1.2-1s0-0.4,0-0.7c0-0.5,0.4-1,1.2-1c1,0,15.2,0,15.2,0V0C25.6,0,9.6,0,8.4,0z M30.3,0c0,1.5,0,17.7,0,19.1c0,4.5,3.3,8.9,11,8.9c4.5,0,2,0,6.5,0c8.1,0,10.8-4,10.8-8.9c0-1.3,0-17.6,0-19.1c-2.8,0-9.7,0-9.7,0s0,17.2,0,18.1c0,1.3-0.6,2.4-2.5,2.4h-4.1c-1.9,0-2.5-1-2.5-2.4c0-0.9,0-18.1,0-18.1S33.1,0,30.3,0z M62.7,0v27.7h20.9v-7.2H72.2V0H62.7z M86.1,0.1v6.9h12.7L85.9,20.4v7.2H111v-7.2H98l12.5-13.6V0.1H86.1z M114.7,0.1v27.6h23.4v-7.2h-14.1v-3.6h11.2v-6.8h-11.2V6.8h13.3V0.1H114.7z M141.5,0.1v27.6h8.9V17.4h0.8l8.9,10.2H171c0,0-8.4-9.5-9.2-10.5c1.8,0,6.3-2.4,6.3-7.4V7.4c0-2-1.5-7.3-9-7.3H141.5z M150.2,6.8h6.8c2.1,0,2.1,1.3,2.1,2.3c0,1.5-0.7,2-1.9,2h-6.9V6.8z"/></svg>
        </div>
        <div class="sulzer-chat-hinfo">
          <div class="sulzer-chat-hname">Sulzer Assistant</div>
          <div class="sulzer-chat-hstatus">● Online</div>
        </div>
        <button id="sulzer-chat-close" aria-label="Close chat">
          <svg viewBox="0 0 24 24"><path d="M19 6.41L17.59 5 12 10.59 6.41 5 5 6.41 10.59 12 5 17.59 6.41 19 12 13.41 17.59 19 19 17.59 13.41 12z"/></svg>
        </button>
      </div>
      <div id="sulzer-chat-body"></div>
      <div class="sulzer-suggestions" id="sulzer-suggestions"></div>
      <div id="sulzer-chat-input-row">
        <input id="sulzer-chat-input" type="text" placeholder="Ask a question…" autocomplete="off" />
        <button id="sulzer-chat-send" aria-label="Send">
          <svg viewBox="0 0 24 24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"/></svg>
        </button>
      </div>
    `;
    document.body.appendChild(win);

    return { btn, win };
  }

  // ── Widget logic ──────────────────────────────────────────────────────────
  function initWidget() {
    const { btn, win } = buildWidget();
    const body       = win.querySelector('#sulzer-chat-body');
    const closeBtn   = win.querySelector('#sulzer-chat-close');
    const input      = win.querySelector('#sulzer-chat-input');
    const sendBtn    = win.querySelector('#sulzer-chat-send');
    const sugArea    = win.querySelector('#sulzer-suggestions');
    const badge      = btn.querySelector('#sulzer-chat-badge');

    let isOpen = false;
    let greetingSent = false;

    // Suggested questions shown after greeting
    const SUGGESTIONS = [
      'Which brands can you replace?',
      'What is the ABS XFP range?',
      'How much energy can I save?',
      'What is a drop-in replacement?',
      'Where can I order?',
    ];

    function open() {
      isOpen = true;
      win.classList.add('open');
      badge.style.display = 'none';
      btn.setAttribute('aria-label', 'Close Sulzer Assistant');
      input.focus();
    }
    function close() {
      isOpen = false;
      win.classList.remove('open');
      btn.setAttribute('aria-label', 'Open Sulzer Assistant');
    }

    btn.addEventListener('click', () => isOpen ? close() : open());
    closeBtn.addEventListener('click', close);

    function scrollBottom() {
      setTimeout(() => { body.scrollTop = body.scrollHeight; }, 50);
    }

    function botAvatar() {
      return `<div class="sulzer-msg-dot">
        <svg viewBox="0 0 171 28"><path d="M8.4,0C2.1,0,0,4.3,0,7.1C0,9.5,0,9.9,0,11c0,3,2.8,6.4,6.9,6.4c3.6,0,8,0,8.7,0c1,0,1.2,0.6,1.2,1c0,0.4,0,0.7,0,1c0,0.5-0.4,1-1.2,1c-1,0-15.2,0-15.2,0v7.2c0,0,11.6,0,18.5,0c5,0,7.9-4.4,7.9-7.3c0-2,0-2.7,0-4c0-4.1-4.1-6.9-8.2-6.9c-3.6,0-7.5,0-8.2,0c-0.9,0-1.2-0.6-1.2-1s0-0.4,0-0.7c0-0.5,0.4-1,1.2-1c1,0,15.2,0,15.2,0V0C25.6,0,9.6,0,8.4,0z M30.3,0c0,1.5,0,17.7,0,19.1c0,4.5,3.3,8.9,11,8.9c4.5,0,2,0,6.5,0c8.1,0,10.8-4,10.8-8.9c0-1.3,0-17.6,0-19.1c-2.8,0-9.7,0-9.7,0s0,17.2,0,18.1c0,1.3-0.6,2.4-2.5,2.4h-4.1c-1.9,0-2.5-1-2.5-2.4c0-0.9,0-18.1,0-18.1S33.1,0,30.3,0z M62.7,0v27.7h20.9v-7.2H72.2V0H62.7z M86.1,0.1v6.9h12.7L85.9,20.4v7.2H111v-7.2H98l12.5-13.6V0.1H86.1z M114.7,0.1v27.6h23.4v-7.2h-14.1v-3.6h11.2v-6.8h-11.2V6.8h13.3V0.1H114.7z M141.5,0.1v27.6h8.9V17.4h0.8l8.9,10.2H171c0,0-8.4-9.5-9.2-10.5c1.8,0,6.3-2.4,6.3-7.4V7.4c0-2-1.5-7.3-9-7.3H141.5z M150.2,6.8h6.8c2.1,0,2.1,1.3,2.1,2.3c0,1.5-0.7,2-1.9,2h-6.9V6.8z"/></svg>
      </div>`;
    }

    function addBotMessage(html) {
      const row = document.createElement('div');
      row.className = 'sulzer-msg bot';
      row.innerHTML = `${botAvatar()}<div class="sulzer-msg-bubble">${html}</div>`;
      body.appendChild(row);
      scrollBottom();
    }

    function addUserMessage(text) {
      const row = document.createElement('div');
      row.className = 'sulzer-msg user';
      row.innerHTML = `<div class="sulzer-msg-bubble">${text}</div>`;
      body.appendChild(row);
      scrollBottom();
    }

    function showTyping() {
      const row = document.createElement('div');
      row.className = 'sulzer-msg bot';
      row.id = 'sulzer-typing-row';
      row.innerHTML = `${botAvatar()}<div class="sulzer-msg-bubble"><div class="sulzer-typing"><span></span><span></span><span></span></div></div>`;
      body.appendChild(row);
      scrollBottom();
      return row;
    }

    function removeTyping() {
      const el = document.getElementById('sulzer-typing-row');
      if (el) el.remove();
    }

    function showSuggestions(list) {
      sugArea.innerHTML = '';
      list.forEach((q) => {
        const b = document.createElement('button');
        b.className = 'sulzer-sug-btn';
        b.textContent = q;
        b.addEventListener('click', () => handleUserInput(q));
        sugArea.appendChild(b);
      });
    }
    function clearSuggestions() { sugArea.innerHTML = ''; }

    function handleUserInput(text) {
      const t = text.trim();
      if (!t) return;
      input.value = '';
      clearSuggestions();
      addUserMessage(t);

      const typingRow = showTyping();
      setTimeout(() => {
        removeTyping();
        const match = findAnswer(t);
        if (match) {
          addBotMessage(match.a);
        } else {
          addBotMessage("I'm not sure about that one — please contact a <strong>Sulzer distributor</strong> or visit <a href='https://www.sulzer.com' target='_blank' style='color:#1d59af'>sulzer.com</a> for specialist support.");
        }
        // Show a reduced suggestion set after each reply
        showSuggestions(SUGGESTIONS.filter((q) => q !== t).slice(0, 3));
      }, 700 + Math.random() * 400);
    }

    input.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleUserInput(input.value); }
    });
    sendBtn.addEventListener('click', () => handleUserInput(input.value));

    // ── Auto-open with greeting after 1 s ─────────────────────────────────
    setTimeout(() => {
      if (!greetingSent) {
        greetingSent = true;
        open();
        addBotMessage(GREETING);
        showSuggestions(SUGGESTIONS);
        // Show badge briefly then hide on open
        badge.style.display = 'block';
        setTimeout(() => { badge.style.display = 'none'; }, 100);
      }
    }, 1000);
  }

  // ── Init when DOM is ready ────────────────────────────────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initWidget);
  } else {
    initWidget();
  }
})();
