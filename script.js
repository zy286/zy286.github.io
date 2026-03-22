/* ============================================================
   ZIHAN YAN — INTERACTIVE PIXEL WEBSITE SCRIPTS
   ============================================================ */

/* ── STARFIELD ───────────────────────────────────────────── */
(function initStarfield() {
  const canvas = document.getElementById('starfield');
  const ctx = canvas.getContext('2d');
  let stars = [], W, H;

  function resize() {
    W = canvas.width  = window.innerWidth;
    H = canvas.height = window.innerHeight;
  }

  function makeStars(n) {
    stars = [];
    for (let i = 0; i < n; i++) {
      stars.push({
        x: Math.random() * W,
        y: Math.random() * H,
        z: Math.random(),
        size: Math.floor(Math.random() * 2) + 1,
        color: Math.random() < .15 ? '#b44fff' : Math.random() < .25 ? '#ffb300' : '#e0e0ff',
        twinkle: Math.random() * Math.PI * 2,
        speed: 0.1 + Math.random() * 0.2,
      });
    }
  }

  let mouseX = 0, mouseY = 0;
  window.addEventListener('mousemove', e => { mouseX = e.clientX; mouseY = e.clientY; });

  function draw(t) {
    ctx.fillStyle = 'rgba(7,7,15,0.18)';
    ctx.fillRect(0, 0, W, H);

    const parallaxX = (mouseX / W - .5) * 8;
    const parallaxY = (mouseY / H - .5) * 8;

    for (const s of stars) {
      s.twinkle += 0.02;
      const alpha = 0.4 + 0.6 * Math.abs(Math.sin(s.twinkle));
      ctx.fillStyle = s.color;
      ctx.globalAlpha = alpha * (0.3 + 0.7 * s.z);
      const px = s.x + parallaxX * s.z;
      const py = s.y + parallaxY * s.z;
      ctx.fillRect(Math.round(px), Math.round(py), s.size, s.size);

      // slowly drift
      s.y += s.speed * 0.15;
      if (s.y > H) { s.y = 0; s.x = Math.random() * W; }
    }
    ctx.globalAlpha = 1;
    requestAnimationFrame(draw);
  }

  window.addEventListener('resize', () => { resize(); makeStars(200); });
  resize();
  makeStars(200);
  requestAnimationFrame(draw);
})();

/* ── PIXEL CAT COMPANION ─────────────────────────────────── */
(function initCat() {
  const canvas = document.getElementById('cat-canvas');
  const ctx = canvas.getContext('2d');
  const SCALE = 4;  // each "pixel" = 4px
  const CAT_H = 280;  // tall enough for bubble above cat
  const W = canvas.width  = window.innerWidth;
  const H = canvas.height = CAT_H;
  canvas.style.width  = '100vw';
  canvas.style.height = CAT_H + 'px';

  window.addEventListener('resize', () => {
    canvas.width = window.innerWidth;
  });

  // Pixel art cat frames [body color = 0, eye = 1, nose = 2, empty = transparent]
  // 0=body, 1=eye, 2=nose, 3=highlight, _=empty
  const PAL = {
    0: '#aaa',   // body
    1: '#ffee55',// eye
    2: '#ff99aa',// nose
    3: '#ddd',   // highlight
    4: '#555',   // shadow
    b: '#333',   // black
    _: null,
  };

  const walkFrames = [
    // frame 1 (tail up)
    [
      '_,_,_,b,b,_,_,_',
      '_,b,b,0,0,b,b,_',
      'b,0,0,1,1,0,0,b',
      'b,0,0,2,0,0,0,b',
      '_,b,0,0,0,0,b,_',
      '_,_,b,b,b,b,_,_',
      '_,b,0,0,0,0,b,_',
      '_,b,0,b,b,0,b,_',
      '_,b,0,_,_,0,b,_',
      '_,_,b,_,_,b,_,_',
    ],
    // frame 2 (tail mid)
    [
      '_,_,b,b,_,_,_,_',
      '_,b,0,0,b,b,_,_',
      'b,0,1,1,0,0,b,_',
      'b,0,2,0,0,0,b,_',
      '_,b,0,0,0,b,_,_',
      '_,_,b,b,b,_,_,_',
      '_,b,0,0,0,b,_,_',
      '_,b,b,0,0,0,b,_',
      '_,_,b,0,_,0,b,_',
      '_,_,b,_,_,b,_,_',
    ],
    // frame 3 (tail down / mid)
    [
      '_,_,_,b,b,_,_,_',
      '_,b,b,0,0,b,b,_',
      'b,0,0,1,1,0,0,b',
      'b,0,0,2,0,0,0,b',
      '_,b,0,0,0,0,b,_',
      '_,_,b,b,b,b,_,_',
      '_,b,0,0,0,0,b,_',
      '_,b,0,b,0,b,0,b',
      '_,b,0,_,0,_,0,b',
      '_,_,b,_,b,_,b,_',
    ],
  ];

  const sitFrame = [
    '_,_,b,b,_,b,_,_',
    '_,b,0,0,b,_,_,_',
    'b,0,1,1,0,b,_,_',
    'b,0,2,0,0,b,_,_',
    '_,b,0,0,b,_,_,_',
    '_,_,b,b,_,_,_,_',
    '_,b,0,0,0,b,_,_',
    'b,0,0,0,0,0,b,_',
    'b,0,0,0,0,0,b,_',
    '_,b,b,b,b,b,_,_',
  ];

  const sleepFrame = [
    '_,_,_,b,b,_,_,_',
    '_,b,b,0,0,b,b,_',
    'b,0,4,4,4,4,0,b',
    'b,0,_,3,_,3,0,b',
    '_,b,0,0,0,0,b,_',
    '_,_,b,b,b,b,_,_',
    'b,0,0,0,0,0,0,b',
    'b,0,0,0,0,0,0,b',
    '_,b,b,b,b,b,b,_',
    '_,_,_,_,_,_,_,_',
  ];

  function parseFrame(f) {
    return f.map(row => row.split(','));
  }

  function drawCat(frame, x, y, flip) {
    const pixels = parseFrame(frame);
    ctx.save();
    if (flip) {
      ctx.scale(-1, 1);
      x = -x - pixels[0].length * SCALE;
    }
    for (let row = 0; row < pixels.length; row++) {
      for (let col = 0; col < pixels[row].length; col++) {
        const c = PAL[pixels[row][col]];
        if (!c) continue;
        ctx.fillStyle = c;
        ctx.fillRect(
          Math.round(x + col * SCALE),
          Math.round(y + row * SCALE),
          SCALE, SCALE
        );
      }
    }
    ctx.restore();
  }

  // Cat state
  let cat = {
    x: 100, y: CAT_H - 42,
    vx: 1.2,
    frame: 0,
    frameTimer: 0,
    state: 'walk',  // walk | sit | sleep
    stateTimer: 0,
    maxState: 200,
  };

  // Z-z-z particles when sleeping
  let zzz = [];

  function drawZzz() {
    for (let z of zzz) {
      ctx.globalAlpha = z.alpha;
      ctx.fillStyle = '#b44fff';
      ctx.font = `${z.size}px 'Press Start 2P', monospace`;
      ctx.fillText('z', z.x, z.y);
      z.y -= 0.5;
      z.x += 0.3;
      z.alpha -= 0.005;
    }
    zzz = zzz.filter(z => z.alpha > 0);
    ctx.globalAlpha = 1;
  }

  // Speech bubble
  let bubble = null;
  const catJokes = [
    'dS/dt ≥ 0 :3',
    'I am in a\nsuperposition\nof states',
    'Black holes\nhave purrfect\nentropy',
    'Meow-xiwell\nequations!',
    'Schrödinger\nshould have\npicked a dog',
    'Every photon\nhas a purrpose',
    'The horizon\nentropy grows\n...like my fur',
    'GR is just\ncurved spacetime\nand vibes',
  ];
  let bubbleTimer = 0;

  function drawBubble(x, y) {
    if (!bubble) return;
    bubbleTimer--;
    if (bubbleTimer <= 0) { bubble = null; return; }

    const lines = bubble.split('\n');
    const maxW = Math.max(...lines.map(l => l.length)) * 7 + 12;
    const bh = lines.length * 14 + 10;
    let bx = x - maxW / 2;
    let by = y - bh - 14;

    ctx.fillStyle = '#0d0d24';
    ctx.strokeStyle = '#00e5ff';
    ctx.lineWidth = 2;
    ctx.beginPath();
    ctx.roundRect(bx, by, maxW, bh, 4);
    ctx.fill();
    ctx.stroke();

    // tail
    ctx.beginPath();
    ctx.moveTo(x, by + bh);
    ctx.lineTo(x - 6, by + bh + 10);
    ctx.lineTo(x + 6, by + bh + 10);
    ctx.closePath();
    ctx.fillStyle = '#0d0d24';
    ctx.fill();
    ctx.strokeStyle = '#00e5ff';
    ctx.stroke();

    ctx.fillStyle = '#00e5ff';
    ctx.font = '9px Share Tech Mono';
    lines.forEach((l, i) => ctx.fillText(l, bx + 6, by + 14 + i * 14));
  }

  // Make cat clickable via click on document
  document.addEventListener('click', (e) => {
    const cx = cat.x + 16;
    const cy = H - 42 + 20;
    const bx = e.clientX;
    const by = e.clientY + window.scrollY - (document.documentElement.scrollHeight - H);
    // simple proximity check (cat is at bottom of viewport)
    const bclientY = e.clientY;
    if (bclientY > window.innerHeight - 90 &&
        Math.abs(e.clientX - (cat.x + 16)) < 50) {
      bubble = catJokes[Math.floor(Math.random() * catJokes.length)];
      bubbleTimer = 180;
      cat.state = 'sit';
      cat.stateTimer = 0;
      cat.maxState = 160;
    }
  });

  function tick() {
    ctx.clearRect(0, 0, canvas.width, H);

    // ground line
    ctx.fillStyle = 'rgba(0,229,255,0.08)';
    ctx.fillRect(0, CAT_H - 2, canvas.width, 2);

    cat.stateTimer++;

    // State transitions
    if (cat.state === 'walk') {
      if (Math.random() < 0.003 || cat.stateTimer > cat.maxState) {
        cat.state = Math.random() < 0.5 ? 'sit' : 'sleep';
        cat.stateTimer = 0;
        cat.maxState = 120 + Math.random() * 200;
      }
    } else {
      if (cat.stateTimer > cat.maxState) {
        cat.state = 'walk';
        cat.stateTimer = 0;
        cat.maxState = 180 + Math.random() * 300;
        cat.vx = (Math.random() < 0.5 ? -1 : 1) * (0.8 + Math.random() * 1.5);
      }
    }

    const flip = cat.vx < 0;

    if (cat.state === 'walk') {
      cat.x += cat.vx;
      cat.frameTimer++;
      if (cat.frameTimer > 10) {
        cat.frame = (cat.frame + 1) % walkFrames.length;
        cat.frameTimer = 0;
      }
      // bounce off edges
      if (cat.x < -10) { cat.x = -10; cat.vx = Math.abs(cat.vx); }
      if (cat.x > canvas.width - 30) { cat.x = canvas.width - 30; cat.vx = -Math.abs(cat.vx); }
      drawCat(walkFrames[cat.frame], cat.x, cat.y, flip);
    } else if (cat.state === 'sit') {
      drawCat(sitFrame, cat.x, cat.y, false);
    } else {
      drawCat(sleepFrame, cat.x, cat.y, false);
      if (Math.random() < 0.03) {
        zzz.push({ x: cat.x + 28, y: cat.y + 5, alpha: 1, size: 8 + Math.random() * 6 });
      }
      drawZzz();
    }

    drawBubble(cat.x + 16, cat.y);

    requestAnimationFrame(tick);
  }
  tick();
})();

/* ── BLACK HOLE ANIMATION ─────────────────────────────────── */
(function initBlackHole() {
  const canvas = document.getElementById('blackhole-canvas');
  if (!canvas) return;
  const ctx = canvas.getContext('2d');
  const W = 360, H = 360;
  const cx = W / 2, cy = H / 2;
  let angle = 0;

  function drawBH(t) {
    ctx.clearRect(0, 0, W, H);

    // Accretion disk (outer glow rings)
    for (let r = 160; r > 80; r -= 3) {
      const alpha = (160 - r) / 160 * 0.06;
      const hue = r > 130 ? 200 : r > 110 ? 30 : 0;
      ctx.beginPath();
      ctx.arc(cx, cy, r, 0, Math.PI * 2);
      ctx.strokeStyle = `hsla(${hue}, 100%, 60%, ${alpha})`;
      ctx.lineWidth = 3;
      ctx.stroke();
    }

    // Pixelated accretion disk rings
    const diskR = [145, 130, 118, 108, 97];
    const diskColors = ['#00e5ff', '#ffb300', '#ff6644', '#ff4444', '#aa44ff'];
    diskR.forEach((r, i) => {
      const pixelStep = 6;
      const circumference = 2 * Math.PI * r;
      const nPixels = Math.floor(circumference / pixelStep);
      for (let p = 0; p < nPixels; p++) {
        const theta = (p / nPixels) * Math.PI * 2 + angle * (i % 2 === 0 ? 1 : -1) * (0.5 + i * 0.15);
        const px = cx + r * Math.cos(theta);
        const py = cy + r * Math.sin(theta) * 0.35;  // flatten to ellipse
        const brightness = 0.3 + 0.7 * Math.abs(Math.sin(theta * 3 + t * 0.002));
        ctx.globalAlpha = brightness * (1 - i * 0.12);
        ctx.fillStyle = diskColors[i];
        ctx.fillRect(Math.round(px - 2), Math.round(py - 2), 4, 4);
      }
    });
    ctx.globalAlpha = 1;

    // Photon ring (bright pixel ring)
    const photonR = 85;
    for (let theta = 0; theta < Math.PI * 2; theta += 0.15) {
      const px = cx + photonR * Math.cos(theta + angle * 0.8);
      const py = cy + photonR * Math.sin(theta + angle * 0.8) * 0.4;
      ctx.fillStyle = '#ffffff';
      ctx.globalAlpha = 0.3 + 0.7 * Math.abs(Math.sin(theta * 5));
      ctx.fillRect(Math.round(px - 1), Math.round(py - 1), 3, 3);
    }
    ctx.globalAlpha = 1;

    // Event horizon (black circle with glow)
    const gradient = ctx.createRadialGradient(cx, cy, 0, cx, cy, 78);
    gradient.addColorStop(0, '#000000');
    gradient.addColorStop(0.85, '#000000');
    gradient.addColorStop(0.92, 'rgba(0,0,0,0.95)');
    gradient.addColorStop(1, 'rgba(0,0,0,0)');
    ctx.beginPath();
    ctx.arc(cx, cy, 80, 0, Math.PI * 2);
    ctx.fillStyle = gradient;
    ctx.fill();

    // Pixel grid inside event horizon (Hawking radiation visual)
    ctx.globalAlpha = 0.08;
    ctx.fillStyle = '#b44fff';
    for (let gx = cx - 70; gx < cx + 70; gx += 8) {
      for (let gy = cy - 70; gy < cy + 70; gy += 8) {
        if ((gx - cx) ** 2 + (gy - cy) ** 2 < 72 ** 2) {
          if (Math.random() < 0.15) {
            ctx.fillRect(gx, gy, 4, 4);
          }
        }
      }
    }
    ctx.globalAlpha = 1;

    // Pixel gravitational lensing arcs
    ctx.strokeStyle = 'rgba(0,229,255,0.4)';
    ctx.lineWidth = 1;
    for (let arc = 0; arc < 3; arc++) {
      ctx.beginPath();
      const startAngle = angle * 0.3 + arc * 2.1;
      ctx.arc(cx, cy, 92 + arc * 8, startAngle, startAngle + Math.PI * 0.6);
      ctx.stroke();
    }

    angle += 0.008;
    requestAnimationFrame(drawBH);
  }
  requestAnimationFrame(drawBH);
})();

/* ── TYPEWRITER ───────────────────────────────────────────── */
(function initTypewriter() {
  const el = document.getElementById('hero-type');
  if (!el) return;
  const phrases = [
    'PhD Candidate @ Cambridge 🎓',
    'Theoretical Physicist ⚛️',
    'AI Researcher 🤖',
    'Pianist 🎹',
    'Cat Enthusiast 🐱',
  ];
  let pi = 0, ci = 0, deleting = false, wait = 0;

  function type() {
    const phrase = phrases[pi];
    if (wait > 0) { wait--; setTimeout(type, 80); return; }

    if (!deleting) {
      el.textContent = phrase.slice(0, ci + 1);
      ci++;
      if (ci === phrase.length) { deleting = true; wait = 40; }
      setTimeout(type, 70);
    } else {
      el.textContent = phrase.slice(0, ci - 1);
      ci--;
      if (ci === 0) {
        deleting = false;
        pi = (pi + 1) % phrases.length;
        wait = 10;
      }
      setTimeout(type, 35);
    }
  }
  type();
})();

/* ── ENTROPY COUNTER ──────────────────────────────────────── */
(function initEntropy() {
  const el = document.getElementById('entropy-val');
  if (!el) return;
  let s = 0;
  setInterval(() => {
    s += 0.001 + Math.random() * 0.004;
    el.textContent = s.toFixed(3);
  }, 200);
})();

/* ── SCROLL ANIMATIONS ────────────────────────────────────── */
(function initScrollReveal() {
  const targets = document.querySelectorAll(
    '.section, .research-card, .edu-item'
  );
  const observer = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
      if (e.isIntersecting) {
        setTimeout(() => e.target.classList.add('visible'), i * 60);
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.08 });
  targets.forEach(t => observer.observe(t));
})();

/* ── NAV HIGHLIGHT ────────────────────────────────────────── */
(function initNavHighlight() {
  const sections = ['hero', 'news', 'about', 'research', 'publications', 'contact'];
  const links = document.querySelectorAll('.nav-links a');

  window.addEventListener('scroll', () => {
    const scrollY = window.scrollY + 100;
    let active = 'hero';
    sections.forEach(id => {
      const el = document.getElementById(id);
      if (el && el.offsetTop <= scrollY) active = id;
    });
    links.forEach(a => {
      a.style.color = a.getAttribute('href') === '#' + active ? 'var(--cyan)' : '';
    });
  });
})();

/* ── PIXEL PARTICLE ON CLICK ──────────────────────────────── */
document.addEventListener('click', (e) => {
  const colors = ['#00e5ff', '#b44fff', '#ffb300', '#00ff88', '#ff44aa'];
  for (let i = 0; i < 8; i++) {
    const p = document.createElement('div');
    p.className = 'pixel-particle';
    p.style.left  = e.clientX + 'px';
    p.style.top   = e.clientY + 'px';
    const tx = (Math.random() - .5) * 80 + 'px';
    const ty = (Math.random() - .5) * 80 + 'px';
    p.style.setProperty('--tx', tx);
    p.style.setProperty('--ty', ty);
    p.style.background = colors[Math.floor(Math.random() * colors.length)];
    document.body.appendChild(p);
    setTimeout(() => p.remove(), 800);
  }
});

/* ── SCHRÖDINGER'S CAT ────────────────────────────────────── */
function toggleSchrodinger() {
  const result = document.getElementById('schrod-result');
  const box = document.getElementById('schrodinger-box');
  result.classList.remove('hidden');
  const outcomes = [
    { emoji: '🐱', text: 'ALIVE!\nEntropy: LOW', color: 'var(--green)' },
    { emoji: '💀', text: 'DEAD!\nEntropy: HIGH', color: 'var(--red)' },
    { emoji: '🌀', text: 'SUPERPOSITION\n...still...', color: 'var(--purple)' },
    { emoji: '🐱💫', text: 'QUANTUM\nFLUCTUATION!', color: 'var(--cyan)' },
  ];
  const o = outcomes[Math.floor(Math.random() * outcomes.length)];
  result.innerHTML = `<div style="font-size:2rem">${o.emoji}</div>
    <div style="font-family:var(--pixel);font-size:.35rem;color:${o.color};line-height:2;white-space:pre">${o.text}</div>`;
}

/* ── PUBLICATIONS FROM BIB ─────────────────────────────────── */
(function initPublicationsFromBib() {
  const list = document.getElementById('pub-list');
  if (!list) return;

  function escapeHtml(s) {
    return String(s)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;');
  }

  function escapeAttr(s) {
    return escapeHtml(s).replace(/'/g, '&#39;');
  }

  function stripBibBraces(s) {
    let t = String(s).trim();
    while (t.startsWith('{') && t.endsWith('}')) {
      t = t.slice(1, -1).trim();
    }
    return t;
  }

  function parseBibFields(body) {
    const fields = {};
    let pos = 0;
    while (pos < body.length) {
      while (pos < body.length && /[\s,]/.test(body[pos])) pos++;
      if (pos >= body.length) break;
      const eq = body.indexOf('=', pos);
      if (eq === -1) break;
      const name = body.slice(pos, eq).trim();
      pos = eq + 1;
      while (pos < body.length && /\s/.test(body[pos])) pos++;
      let value = '';
      if (pos >= body.length) break;
      if (body[pos] === '{') {
        let d = 1;
        pos++;
        const v0 = pos;
        while (pos < body.length && d > 0) {
          if (body[pos] === '{') d++;
          else if (body[pos] === '}') d--;
          pos++;
        }
        value = body.slice(v0, pos - 1);
      } else if (body[pos] === '"') {
        pos++;
        const v0 = pos;
        while (pos < body.length && body[pos] !== '"') pos++;
        value = body.slice(v0, pos);
        pos++;
      } else {
        const m = body.slice(pos).match(/^([^,\n]+)/);
        value = m ? m[1].trim() : '';
        pos += m ? m[0].length : 0;
      }
      fields[name] = value.trim();
    }
    return fields;
  }

  function parseBibTeX(raw) {
    const out = [];
    let i = 0;
    while (i < raw.length) {
      const at = raw.indexOf('@', i);
      if (at === -1) break;
      const brace = raw.indexOf('{', at);
      if (brace === -1) break;
      const type = raw.slice(at + 1, brace).trim().toLowerCase();
      if (type === 'comment' || type === 'preamble' || type === 'string') {
        i = brace + 1;
        let d = 1;
        while (i < raw.length && d > 0) {
          if (raw[i] === '{') d++;
          else if (raw[i] === '}') d--;
          i++;
        }
        continue;
      }
      i = brace + 1;
      const keyMatch = raw.slice(i).match(/^\s*([^,\s]+)\s*,/);
      if (!keyMatch) {
        i = at + 1;
        continue;
      }
      const key = keyMatch[1];
      i += keyMatch[0].length;
      /* 匹配整条 entry 的闭合 }：忽略双引号字符串内的 { }（否则 author = "..." 中的括号会破坏深度） */
      let depth = 1;
      const bodyStart = i;
      let inString = false;
      let strEscape = false;
      while (i < raw.length && depth > 0) {
        const c = raw[i];
        if (inString) {
          if (strEscape) {
            strEscape = false;
            i++;
            continue;
          }
          if (c === '\\') {
            strEscape = true;
            i++;
            continue;
          }
          if (c === '"') inString = false;
          i++;
          continue;
        }
        if (c === '"') {
          inString = true;
          i++;
          continue;
        }
        if (c === '{') depth++;
        else if (c === '}') depth--;
        i++;
      }
      if (depth !== 0) {
        i = at + 1;
        continue;
      }
      const body = raw.slice(bodyStart, i - 1);
      const fields = {};
      Object.entries(parseBibFields(body)).forEach(([k, v]) => {
        fields[k.toLowerCase()] = v;
      });
      out.push({ type, key, fields });
    }
    return out;
  }

  const MONTHS = ['', 'Jan.', 'Feb.', 'Mar.', 'Apr.', 'May', 'Jun.', 'Jul.', 'Aug.', 'Sep.', 'Oct.', 'Nov.', 'Dec.'];

  function formatMonthYear(f) {
    const y = f.year || '';
    const m = f.month;
    if (m === undefined || m === null || m === '') return y;
    const n = parseInt(String(m).replace(/[^0-9]/g, ''), 10);
    if (!n || n < 1 || n > 12) return y;
    return `${MONTHS[n]} ${y}`.trim();
  }

  function shortenJournal(j) {
    if (/Journal of Fluid Mechanics/i.test(j)) return 'J. Fluid Mech.';
    return j;
  }

  function abbreviateAuthorName(a) {
    const t = a.trim();
    if (!t.includes(',')) {
      const parts = t.split(/\s+/).filter(Boolean);
      if (parts.length === 2) return `${parts[0].charAt(0)}. ${parts[1]}`;
      return t;
    }
    const comma = t.indexOf(',');
    const last = t.slice(0, comma).trim();
    const rest = t.slice(comma + 1).trim();
    const bits = rest.split(/\s+/).filter(Boolean);
    const initials = bits.map(w => {
      if (w.length <= 2 && /\./.test(w)) return w;
      return w.charAt(0) + '.';
    }).join(' ');
    return `${initials} ${last}`.trim();
  }

  function formatAuthorsHtml(authorStr) {
    if (!authorStr) return '';
    const raw = stripBibBraces(authorStr);
    const parts = raw.split(/\s+and\s+/i).map(a => a.trim()).filter(Boolean);
    const names = parts.map(abbreviateAuthorName);
    let joined;
    if (names.length === 1) joined = names[0];
    else if (names.length === 2) joined = `${names[0]} & ${names[1]}`;
    else joined = `${names.slice(0, -1).join(', ')} & ${names[names.length - 1]}`;
    const esc = escapeHtml(joined);
    return esc
      .replace(/Z\. Yan/g, '<span class="pub-me">Z. Yan</span>')
      .replace(/Zihan Yan/g, '<span class="pub-me">Zihan Yan</span>');
  }

  function buildJournalLineHtml(f) {
    if (f.pubnote) {
      return escapeHtml(stripBibBraces(f.pubnote));
    }
    if (f.venue) {
      const tag = escapeHtml(stripBibBraces(f.venue).replace(/\\&/g, '&'));
      const rest = formatMonthYear(f);
      return `<span class="journal-tag">${tag}</span> ${escapeHtml(rest)}`;
    }
    if (f.journal) {
      let tag = shortenJournal(stripBibBraces(f.journal));
      const vol = f.volume || '';
      const num = f.number || '';
      const pages = f.pages || '';
      const year = f.year || '';
      const isPRD = /Phys\.\s*Rev\.\s*D|Phys\. Rev\. D/i.test(tag);
      const isJFM = /J\.\s*Fluid\s*Mech\./i.test(tag);
      let rest = '';
      if (isPRD && vol && num && year) {
        rest = `vol. ${vol}, no. ${num}, ${year}`;
      } else if (isJFM && vol && pages && year) {
        rest = `vol. ${vol}, ${pages}, ${year}`;
      } else if (vol && pages && year) {
        rest = `vol. ${vol}, p. ${pages}, ${year}`;
      } else if (year) {
        rest = year;
      }
      return `<span class="journal-tag">${escapeHtml(tag)}</span> ${escapeHtml(rest)}`;
    }
    if (f.booktitle) {
      const rest = formatMonthYear(f);
      return `<span class="journal-tag">${escapeHtml('Proceedings')}</span> ${escapeHtml(rest)}`;
    }
    const rest = formatMonthYear(f);
    return `<span class="journal-tag">Preprint</span> ${escapeHtml(rest || '')}`.trim();
  }

  function buildLinksHtml(f) {
    const parts = [];
    const eprint = f.eprint ? stripBibBraces(f.eprint) : '';
    if (eprint) {
      parts.push(
        `<a href="https://arxiv.org/abs/${escapeAttr(eprint)}" class="arxiv-link" target="_blank" rel="noopener noreferrer">arXiv: ${escapeHtml(eprint)}</a>`
      );
    }
    const doiRaw = f.doi ? stripBibBraces(f.doi) : '';
    if (doiRaw) {
      parts.push(
        `<a href="https://doi.org/${escapeAttr(doiRaw)}" class="arxiv-link" target="_blank" rel="noopener noreferrer">DOI: ${escapeHtml(doiRaw)}</a>`
      );
    }
    if (parts.length === 0) return '';
    return `<div class="pub-links">${parts.join('')}</div>`;
  }

  function renderPubEntry(entry, index) {
    const f = entry.fields;
    const rawCat = f.category != null ? String(f.category).trim() : '';
    const cat = (rawCat ? stripBibBraces(rawCat) : 'none').toLowerCase();
    const leadRaw = f.lead ? stripBibBraces(f.lead).toLowerCase() : '';
    const lead = leadRaw === 'true' || leadRaw === '1' || leadRaw === 'yes';
    const title = escapeHtml(stripBibBraces(f.title || ''));
    const authors = formatAuthorsHtml(f.author || '');
    const journalLine = buildJournalLineHtml(f);
    const links = buildLinksHtml(f);
    const leadHtml = lead ? '<div class="pub-leading">★ LEAD</div>' : '';
    return `
    <div class="pub-entry pixel-box" data-cat="${escapeAttr(cat)}">
      <div class="pub-num">[${index}]</div>
      <div class="pub-body">
        <div class="pub-title">${title}</div>
        <div class="pub-authors">${authors}</div>
        <div class="pub-journal">${journalLine}</div>
        ${links}
      </div>
      ${leadHtml}
    </div>`;
  }

  /* 滚动 reveal 对异步插入的条目在部分环境下不可靠；.pub-entry 默认 opacity:0，必须加 .visible */
  function revealPubEntries() {
    document.querySelectorAll('#pub-list .pub-entry').forEach((el, idx) => {
      setTimeout(() => el.classList.add('visible'), idx * 60);
    });
  }

  function showPubError(msg) {
    list.innerHTML =
      `<div class="pub-entry pixel-box visible"><div class="pub-body"><div class="pub-title">无法加载 publications</div>` +
      `<div class="pub-authors" style="color:var(--red)">${escapeHtml(msg)}</div>` +
      `<div class="pub-journal" style="margin-top:.5rem;font-size:.8rem">请用本地 HTTP 打开（例如在项目目录运行 <code style="color:var(--cyan)">python3 -m http.server</code>），不要用 file:// 直接双击打开 HTML；并确认 <code style="color:var(--cyan)">publications.bib</code> 与 index 同目录。</div></div></div>`;
  }

  const bibUrl = new URL('publications.bib', window.location.href).href;
  fetch(bibUrl)
    .then(r => {
      if (!r.ok) throw new Error('HTTP ' + r.status);
      return r.text();
    })
    .then(text => {
      try {
        const entries = parseBibTeX(text.trim());
        if (!entries.length) {
          showPubError('publications.bib 解析得到 0 条文献，请检查文件格式。');
          return;
        }
        list.innerHTML = entries.map((e, i) => renderPubEntry(e, i + 1)).join('');
        revealPubEntries();
      } catch (e) {
        showPubError(e.message || String(e));
      }
    })
    .catch(err => {
      showPubError(err.message || String(err));
    });
})();

/* ── PUBLICATION FILTER ───────────────────────────────────── */
function filterPubs(cat, btn) {
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  document.querySelectorAll('.pub-entry').forEach(p => {
    if (cat === 'all' || p.dataset.cat === cat) {
      p.classList.remove('hidden-pub');
    } else {
      p.classList.add('hidden-pub');
    }
  });
}

/* ── RESEARCH CARD EXPAND ─────────────────────────────────── */
function expandResearch(card) {
  document.querySelectorAll('.research-card.expanded').forEach(c => {
    if (c !== card) c.classList.remove('expanded');
  });
  card.classList.toggle('expanded');
}

/* ── MUSIC PLAYER ─────────────────────────────────────────── */

function togglePlayer() {
  const body = document.getElementById('player-body');
  const btn = document.getElementById('player-toggle');
  const wasHidden = body.style.display === 'none';
  body.style.display = wasHidden ? 'block' : 'none';
  btn.textContent = wasHidden ? '▾' : '▴';
}

/** 顶部标签：未播放 = MUSIC HERE - PLAY IT!，播放中 = NOW PLAYING */
function syncPlayerHeaderLabel() {
  const audio = document.getElementById('bg-audio');
  const label = document.getElementById('player-label');
  if (!audio || !label) return;
  label.textContent = audio.paused ? 'MUSIC HERE - PLAY IT!' : 'NOW PLAYING';
}

function syncMusicUi() {
  const audio = document.getElementById('bg-audio');
  const btn = document.getElementById('play-btn');
  const vinyl = document.getElementById('vinyl');
  if (!audio || !btn || !vinyl) return;
  const playing = !audio.paused;
  btn.textContent = playing ? '⏸' : '▶';
  vinyl.classList.toggle('spinning', playing);
  syncPlayerHeaderLabel();
}

function toggleMusic() {
  const audio = document.getElementById('bg-audio');
  if (!audio) return;

  if (audio.paused) {
    audio.play().catch(e => console.warn('Audio play failed:', e));
  } else {
    audio.pause();
  }
}

function setVolume(v) {
  const audio = document.getElementById('bg-audio');
  const vol = parseFloat(v);
  if (audio && !Number.isNaN(vol)) audio.volume = vol;
}

function formatPlayerTime(sec) {
  if (!Number.isFinite(sec) || sec < 0) return '0:00';
  const s = Math.floor(sec % 60);
  const m = Math.floor(sec / 60);
  return `${m}:${s.toString().padStart(2, '0')}`;
}

document.addEventListener('DOMContentLoaded', () => {
  const audio = document.getElementById('bg-audio');
  const vol = document.getElementById('vol');
  const seek = document.getElementById('seek');
  const elCur = document.getElementById('player-time-current');
  const elDur = document.getElementById('player-time-duration');
  if (!audio || !vol) return;

  audio.volume = parseFloat(vol.value) || 0.4;
  syncPlayerHeaderLabel();
  audio.addEventListener('play', syncMusicUi);
  audio.addEventListener('pause', syncMusicUi);
  audio.addEventListener('ended', syncMusicUi);

  if (!seek) return;

  let seeking = false;

  function syncSeekMax() {
    const d = audio.duration;
    if (Number.isFinite(d) && d > 0) {
      seek.max = String(d);
      if (elDur) elDur.textContent = formatPlayerTime(d);
    }
  }

  audio.addEventListener('loadedmetadata', syncSeekMax);
  audio.addEventListener('durationchange', syncSeekMax);

  function updateProgressFromAudio() {
    if (seeking) return;
    const t = audio.currentTime;
    if (Number.isFinite(t)) seek.value = String(t);
    if (elCur) elCur.textContent = formatPlayerTime(t);
  }

  audio.addEventListener('timeupdate', updateProgressFromAudio);

  seek.addEventListener('pointerdown', () => { seeking = true; });
  seek.addEventListener('input', () => {
    const t = parseFloat(seek.value);
    if (Number.isFinite(t)) {
      audio.currentTime = t;
      if (elCur) elCur.textContent = formatPlayerTime(t);
    }
  });
  seek.addEventListener('change', () => {
    seeking = false;
    const t = parseFloat(seek.value);
    if (Number.isFinite(t)) audio.currentTime = t;
  });
  window.addEventListener('pointerup', () => {
    if (seeking) {
      seeking = false;
      updateProgressFromAudio();
    }
  });
});

/* ── CAT WISDOM QUOTES ────────────────────────────────────── */
const catWisdoms = [
  '"The entropy of a black hole is proportional to its area. Much like how cat hair covers all available surfaces." — Z. Yan 🐱',
  '"In quantum gravity, nothing is certain. In quantum cats, everything is uncertain AND they knock things off tables." 🐱',
  '"A black hole has no hair. A cat has infinite hair. Therefore: cats are the opposite of black holes." 🐱',
  '"The second law of thermodynamics: entropy always increases. The first law of cats: always land on feet." 🐱',
  '"Even Hawking radiation is less mysterious than why cats stare at blank walls." 🐱',
  '"Diffeomorphism invariance means the laws of physics look the same from any reference frame. Cats disagree with all frames." 🐱',
  '"The path integral over all spacetime geometries is complicated. The path a cat takes to knock over your coffee is more complicated." 🐱',
];
let wisdomIndex = 0;

function newCatQuote() {
  const el = document.getElementById('cq-text');
  if (!el) return;
  wisdomIndex = (wisdomIndex + 1) % catWisdoms.length;
  el.style.opacity = 0;
  setTimeout(() => {
    el.textContent = catWisdoms[wisdomIndex];
    el.style.transition = 'opacity .4s';
    el.style.opacity = 1;
  }, 200);
}

// Init first quote
document.addEventListener('DOMContentLoaded', () => {
  const el = document.getElementById('cq-text');
  if (el) el.textContent = catWisdoms[0];
});

/* ── MOBILE NAV (≤500px) ─────────────────────────────────── */
(function initMobileNav() {
  const btn = document.getElementById('nav-menu-toggle');
  const panel = document.getElementById('nav-mobile-panel');
  if (!btn || !panel) return;

  const icon = btn.querySelector('.nav-menu-toggle__icon');

  function setOpen(open) {
    if (open) {
      panel.classList.add('is-open');
      btn.setAttribute('aria-expanded', 'true');
      btn.setAttribute('aria-label', 'Close menu');
      panel.setAttribute('aria-hidden', 'false');
      btn.classList.add('is-open');
      if (icon) icon.textContent = '\u00D7';
      document.body.style.overflow = 'hidden';
    } else {
      panel.classList.remove('is-open');
      btn.setAttribute('aria-expanded', 'false');
      btn.setAttribute('aria-label', 'Open menu');
      panel.setAttribute('aria-hidden', 'true');
      btn.classList.remove('is-open');
      if (icon) icon.textContent = '\u2261';
      document.body.style.overflow = '';
    }
  }

  function closeMenu() {
    setOpen(false);
  }

  btn.addEventListener('click', () => {
    setOpen(!panel.classList.contains('is-open'));
  });

  panel.querySelectorAll('a[href^="#"]').forEach((a) => {
    a.addEventListener('click', closeMenu);
  });

  window.addEventListener('keydown', (e) => {
    if (e.key === 'Escape') closeMenu();
  });

  window.addEventListener('resize', () => {
    if (window.innerWidth > 500) closeMenu();
  });
})();

/* ── FOOTER CAT PARADE ────────────────────────────────────── */
(function initFooterCats() {
  const el = document.getElementById('footer-cats');
  if (!el) return;
  const cats = ['🐱', '😺', '😸', '🙀', '😻', '😹', '🐈', '🐈‍⬛'];
  let row = '';
  for (let i = 0; i < 20; i++) row += cats[Math.floor(Math.random() * cats.length)];
  el.textContent = row;
})();

/* ── PIXEL CURSOR TRAIL ───────────────────────────────────── */
(function initCursorTrail() {
  const colors = ['#00e5ff', '#b44fff', '#ffb300'];
  let last = { x: 0, y: 0 };
  window.addEventListener('mousemove', (e) => {
    if (Math.abs(e.clientX - last.x) + Math.abs(e.clientY - last.y) < 16) return;
    last = { x: e.clientX, y: e.clientY };
    const dot = document.createElement('div');
    dot.style.cssText = `
      position:fixed; width:4px; height:4px; pointer-events:none;
      left:${e.clientX}px; top:${e.clientY}px; z-index:9998;
      background:${colors[Math.floor(Math.random() * colors.length)]};
      image-rendering:pixelated;
      animation:particleFade .5s forwards;
    `;
    document.body.appendChild(dot);
    setTimeout(() => dot.remove(), 500);
  });
})();
