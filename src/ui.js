// ═══════════════════════════ STATE ═══════════════════════════

const CIRC = 2 * Math.PI * 58;
document.getElementById('ringCircle').style.strokeDasharray = CIRC;

let words = [], wordBuf = [], hist = [];
let cntA = 0, cntN = 0, cntW = 0, cntP = 0;
let lastLetter = '', stabCount = 0, lastInsert = 0;
const STABILITY = 5, COOLDOWN = 900;

// ═══════════════════════════ BUILD REFERENCE GRIDS ═══════════════════

const ag = document.getElementById('agrid');
ALPHA.forEach(l => {
  const d = document.createElement('div');
  d.className = 'ac';
  d.id = 'ac-' + l;
  d.textContent = l;
  ag.appendChild(d);
});

const ng = document.getElementById('ngrid');
NUMBERS.forEach((w, i) => {
  const d = document.createElement('div');
  d.className = 'nc';
  d.id = 'nc-' + w;
  d.innerHTML = `<span class="dig">${NUM_DISPLAY[w]}</span><span class="wrd">${w}</span>`;
  ng.appendChild(d);
});

const wg = document.getElementById('wgrid');
WORDS.forEach(w => {
  const d = document.createElement('div');
  d.className = 'wc';
  d.id = 'wc-' + w;
  d.textContent = w.replace(/_/g, ' ').toLowerCase();
  wg.appendChild(d);
});

const pg = document.getElementById('pgrid');
PHRASES.forEach(p => {
  const d = document.createElement('div');
  d.className = 'pc';
  d.textContent = p.replace(/_/g, ' ').toLowerCase();
  pg.appendChild(d);
});

// ═══════════════════════════ REFERENCE TABS ═══════════════════════════

function switchRef(tab, btn) {
  document.querySelectorAll('.rtab').forEach(b => b.classList.remove('on'));
  document.querySelectorAll('.rcontent').forEach(c => c.classList.remove('on'));
  btn.classList.add('on');
  document.getElementById('ref-' + tab).classList.add('on');
}

// ═══════════════════════════ MODE SWITCHER ═══════════════════════════

function setMode(m) {
  activeMode = m;
  document.querySelectorAll('.mode-btn').forEach(b => b.className = 'mode-btn');
  const mb = document.getElementById('mb-' + m);
  mb.className = 'mode-btn active-' + (m === 'all' ? 'all' : m);
  const cfg = MODE_CONFIG[m];
  const mi = document.getElementById('modeIndicator');
  mi.textContent = cfg.label;
  mi.style.borderColor = cfg.color;
  mi.style.color = cfg.text.replace('var(','').replace(')','');
  document.getElementById('totalBadge').textContent = cfg.total + ' classes active';
  // Update ring gradient
  const s1 = document.getElementById('rg1'), s2 = document.getElementById('rg2');
  if (m === 'num')    { s1.setAttribute('stop-color','#f59e0b'); s2.setAttribute('stop-color','#ef9f27'); }
  else if (m === 'word')   { s1.setAttribute('stop-color','#00aaff'); s2.setAttribute('stop-color','#0077cc'); }
  else if (m === 'phrase') { s1.setAttribute('stop-color','#7c3aed'); s2.setAttribute('stop-color','#a78bfa'); }
  else                { s1.setAttribute('stop-color','#00aaff'); s2.setAttribute('stop-color','#00e5a0'); }
}

// ═══════════════════════════ RING ═══════════════════════════

function setRing(pct) {
  document.getElementById('ringCircle').style.strokeDashoffset = CIRC * (1 - pct / 100);
}

// ═══════════════════════════ DETECTION UI ═══════════════════════════

function updateUI(l, conf, stab) {
  const dl = document.getElementById('detLetter');
  const dc = document.getElementById('detConf');
  const tb = document.getElementById('typeBadge');
  const sf = document.getElementById('stabFill');
  const sv = document.getElementById('stabVal');
  const hs = document.getElementById('handStatus');
  const hl = document.getElementById('hlabel');

  document.querySelectorAll('.ac').forEach(c => c.classList.remove('lit'));
  document.querySelectorAll('.nc').forEach(c => c.classList.remove('lit'));
  document.querySelectorAll('.wc').forEach(c => c.classList.remove('lit'));

  if (!l) {
    dl.textContent = '—'; dl.className = 'det-letter empty';
    dc.textContent = '0%'; dc.className = 'det-conf';
    tb.textContent = 'WAITING'; tb.className = 'type-badge';
    setRing(0); sf.style.width = '0%'; sv.textContent = '0 / 5';
    hs.className = 'hand-status'; hl.textContent = 'No hand detected';
    return;
  }

  hs.className = 'hand-status on'; hl.textContent = 'Hand detected';
  const type = getType(l);
  const disp = type === 'num' ? NUM_DISPLAY[l] : l.replace(/_/g, ' ');
  dl.textContent = disp;
  dl.className = 'det-letter ' + (type === 'alpha' ? '' : type);
  const pct = Math.round(conf);
  dc.textContent = pct + '%'; dc.className = 'det-conf' + (pct > 80 ? ' hi' : '');
  setRing(pct);
  const labels = { alpha:'ALPHABET', num:'NUMBER', word:'WORD', phrase:'PHRASE' };
  tb.textContent = labels[type]; tb.className = 'type-badge tb-' + type;
  const stabPct = Math.min((stab / STABILITY) * 100, 100);
  sf.style.width = stabPct + '%'; sv.textContent = Math.min(stab, STABILITY) + ' / ' + STABILITY;

  if (type === 'alpha')  { const el = document.getElementById('ac-' + l); if (el) el.classList.add('lit'); }
  else if (type === 'num')  { const el = document.getElementById('nc-' + l); if (el) el.classList.add('lit'); }
  else if (type === 'word') { const el = document.getElementById('wc-' + l); if (el) el.classList.add('lit'); }
}

// ═══════════════════════════ TEXT ASSEMBLY ═══════════════════════════

function insertGesture(l) {
  const type = getType(l);
  if (l === 'SPACE') {
    if (wordBuf.length) { words.push(wordBuf.join('')); wordBuf = []; }
  } else if (l === 'DELETE') {
    if (wordBuf.length) wordBuf.pop(); else if (words.length) words.pop();
  } else if (type === 'num') {
    wordBuf.push(NUM_DISPLAY[l]); cntN++;
  } else if (type === 'phrase') {
    words.push(l.replace(/_/g, ' ').replace(/\b\w/g, c => c.toUpperCase()));
    wordBuf = []; cntP++;
  } else if (type === 'word') {
    words.push(l.charAt(0) + l.slice(1).toLowerCase());
    wordBuf = []; cntW++;
  } else {
    wordBuf.push(l); cntA++;
  }
  renderText();
}

function renderText() {
  const td = document.getElementById('textDisp');
  const ch = document.getElementById('chips');
  const fw = words.join(' '), cw = wordBuf.join('');
  const full = (fw + (fw && cw ? ' ' : '') + cw).trim();
  if (!full) {
    td.className = 'text-disp empty';
    td.innerHTML = 'Show a gesture to begin…<span class="cur"></span>';
    ch.innerHTML = '';
  } else {
    td.className = 'text-disp has';
    td.innerHTML = full + '<span class="cur"></span>';
    ch.innerHTML = '';
    words.forEach(w => {
      const type =
        WORDS.map(x => x.charAt(0) + x.slice(1).toLowerCase()).includes(w) ? 'w' :
        PHRASES.some(p => p.replace(/_/g,' ').replace(/\b\w/g, c => c.toUpperCase()) === w) ? 'p' :
        /^\d+$/.test(w) ? 'n' : 'a';
      const c = document.createElement('div');
      c.className = 'chip chip-' + type; c.textContent = w; ch.appendChild(c);
    });
    if (cw) {
      const c = document.createElement('div');
      c.className = 'chip chip-a'; c.textContent = cw + '_'; ch.appendChild(c);
    }
  }
  document.getElementById('sA').textContent = cntA;
  document.getElementById('sN').textContent = cntN;
  document.getElementById('sW').textContent = cntW;
  document.getElementById('sP').textContent = cntP;
}

// ═══════════════════════════ HISTORY ═══════════════════════════

function addHist(l, conf) {
  const type = getType(l);
  const disp = type === 'num' ? NUM_DISPLAY[l] + ' (' + l + ')' : l.replace(/_/g, ' ');
  const t = new Date().toLocaleTimeString('en', { hour12: false });
  hist.unshift({ disp, conf, type, t });
  if (hist.length > 18) hist.pop();
  const list = document.getElementById('histList');
  list.innerHTML = hist.map(h => `
    <div class="hi">
      <div class="hi-icon hi-${h.type}">${h.disp.length <= 3 ? h.disp : h.disp[0]}</div>
      <div class="hi-meta">
        <div class="hi-name">${h.disp}</div>
        <div class="hi-c">${Math.round(h.conf)}% · ${h.type}</div>
      </div>
      <div class="hi-t">${h.t}</div>
    </div>`).join('');
}

// ═══════════════════════════ CONTROLS ═══════════════════════════

function clearAll() {
  words = []; wordBuf = []; cntA = cntN = cntW = cntP = 0;
  renderText();
}

function clearHist() {
  hist = [];
  document.getElementById('histList').innerHTML =
    '<div style="text-align:center;color:var(--dim);font-size:.75rem;padding:14px 0">No detections yet</div>';
}

function copyText(btn) {
  const t = document.getElementById('textDisp').innerText.replace(/\|$/, '').trim();
  if (t && !t.includes('Show a gesture')) {
    navigator.clipboard.writeText(t).then(() => {
      btn.textContent = '✓ Copied!';
      setTimeout(() => btn.textContent = '⎘ Copy', 1600);
    });
  }
}

function speakText() {
  const t = document.getElementById('textDisp').innerText.replace(/\|$/, '').trim();
  if (t && !t.includes('Show a gesture') && window.speechSynthesis) {
    const u = new SpeechSynthesisUtterance(t);
    u.rate = .9;
    speechSynthesis.speak(u);
  }
}
