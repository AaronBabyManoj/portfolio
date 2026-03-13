/* ==========================================
   QURIFOLIO — script.js
   ALL WOW FEATURES:
   · Loading screen · Custom cursor · Particle canvas
   · Text scramble · Scroll-reveal · Stats counter
   · Skill bars · Project filter · 3D card tilt
   · Navbar scroll · Dark/light toggle · Magnetic btns
   · Testimonial marquee · Contact form
   · AI Chatbot (Gemini) · Terminal Mode
   · Snake Mini Game · Konami Easter egg + Confetti
   ========================================== */



// ═══════════════════════════════════════════
// PREMIUM LOADING SCREEN (CYBER INITIALIZATION)
// ═══════════════════════════════════════════
const loader = document.getElementById('loader');
const loaderBar = document.getElementById('loaderBar');
const loaderPct = document.getElementById('loaderPct');
const statusTerminal = document.getElementById('statusTerminal');
const loaderCanvas = document.getElementById('loaderCanvas');

// 1. Loader BG (Matrix data stream)
if (loaderCanvas) {
    const ctx = loaderCanvas.getContext('2d');
    let width = loaderCanvas.width = window.innerWidth;
    let height = loaderCanvas.height = window.innerHeight;
    const columns = Math.floor(width / 20);
    const drops = new Array(columns).fill(0);

    function drawMatrix() {
        ctx.fillStyle = 'rgba(0, 0, 0, 0.05)';
        ctx.fillRect(0, 0, width, height);
        ctx.fillStyle = '#F97316';
        ctx.font = '15px monospace';
        for (let i = 0; i < drops.length; i++) {
            const text = String.fromCharCode(Math.random() * 128);
            ctx.fillText(text, i * 20, drops[i] * 20);
            if (drops[i] * 20 > height && Math.random() > 0.975) drops[i] = 0;
            drops[i]++;
        }
    }
    const matrixInt = setInterval(drawMatrix, 50);
    // Move resize logic to main orchestrator below
}

// 2. Status Terminal logs
const statusLogs = [
    "> INITIALIZING_CORE_KERNAL... [OK]",
    "> LOADING_CYBER_PROTOCOLS... [OK]",
    "> ESTABLISHING_SECURE_CONNECTION... [OK]",
    "> DECRYPTING_BIOMETRIC_DATA... [OK]",
    "> PORTFOLIO_ASSETS_SYNCING... [OK]",
    "> SECURITY_LAYER_ACTIVE... [OK]",
    "> SYSTEM_READY_FOR_ACCESS."
];
let logIdx = 0;
const logInt = setInterval(() => {
    if (logIdx < statusLogs.length) {
        const line = document.createElement('div');
        line.className = 'status-line' + (logIdx === statusLogs.length - 1 ? ' accent' : '');
        line.textContent = statusLogs[logIdx];
        statusTerminal.appendChild(line);
        statusTerminal.scrollTop = statusTerminal.scrollHeight;
        logIdx++;
    } else {
        clearInterval(logInt);
    }
}, 500);

// 3. Percentage Tracking
let pct = 0;
const loadInterval = setInterval(() => {
    const jump = Math.random() * 10 + 2;
    pct = Math.min(pct + jump, 100);
    if (loaderBar) loaderBar.style.width = pct + '%';
    if (loaderPct) loaderPct.textContent = Math.round(pct) + '%';
    
    if (pct >= 100) {
        clearInterval(loadInterval);
        setTimeout(() => {
            loader.classList.add('hide');
            // Clean up loader resources
            if (typeof matrixInt !== 'undefined') clearInterval(matrixInt);
            // Allow interactions once loader is gone
            document.body.style.overflow = 'auto';
        }, 800);
    }
}, 180);

// Prevent scrolling while loading
document.body.style.overflow = 'hidden';

// ═══════════════════════════════════════════
// CUSTOM CURSOR — GPU-optimised
// ═══════════════════════════════════════════
const cursorDot = document.getElementById('cursorDot');
const cursorRing = document.getElementById('cursorRing');

let mouseX = 0, mouseY = 0;
let ringX = 0, ringY = 0;
let cursorRAF = null;

// Is it a touch device?
const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0);
if (isTouch) {
    if (cursorDot) cursorDot.style.display = 'none';
    if (cursorRing) cursorRing.style.display = 'none';
}

function updateCursor() {
    if (isTouch) return;
    cursorDot.style.transform = `translate3d(${mouseX}px, ${mouseY}px, 0)`;
    ringX += (mouseX - ringX) * 0.15;
    ringY += (mouseY - ringY) * 0.15;
    cursorRing.style.transform = `translate3d(${ringX}px, ${ringY}px, 0)`;
    cursorRAF = requestAnimationFrame(updateCursor);
}
if (!isTouch) updateCursor();

// ═══════════════════════════════════════════
// SCROLL PROGRESS BAR
// ═══════════════════════════════════════════
// ═══════════════════════════════════════════
// EVENT ORCHESTRATION (Scroll & Mouse)
// ═══════════════════════════════════════════
let lastScrollY = window.scrollY;
let scrollTicking = false;

window.addEventListener('scroll', () => {
    lastScrollY = window.scrollY;
    if (!scrollTicking) {
        requestAnimationFrame(() => {
            // Update scroll bar
            if (scrollBar) {
                const scrollPx = document.documentElement.scrollTop || document.body.scrollTop;
                const scrollHeight = document.documentElement.scrollHeight - document.documentElement.clientHeight;
                const progress = (scrollPx / scrollHeight) * 100;
                scrollBar.style.width = progress + '%';
            }
            scrollTicking = false;
        });
        scrollTicking = true;
    }
}, { passive: true });

let mouseTicking = false;
document.addEventListener('mousemove', e => {
    mouseX = e.clientX;
    mouseY = e.clientY;
    mouse.x = e.clientX;
    mouse.y = e.clientY;
    
    if (!mouseTicking) {
        requestAnimationFrame(() => {
            // Hero spotlight (only when over hero)
            if (spotlight && heroRect && mouseY >= heroRect.top && mouseY <= heroRect.bottom) {
                heroEl.style.setProperty('--mx', ((mouseX / window.innerWidth) * 100).toFixed(1) + '%');
                heroEl.style.setProperty('--my', (((mouseY - heroRect.top) / heroRect.height) * 100).toFixed(1) + '%');
            }
            mouseTicking = false;
        });
        mouseTicking = true;
    }
}, { passive: true });

// Debounced Resize Orchestrator
let resizeTimeout;
window.addEventListener('resize', () => {
    clearTimeout(resizeTimeout);
    resizeTimeout = setTimeout(() => {
        heroRect = heroEl ? heroEl.getBoundingClientRect() : null;
        resizeCanvas();
        if (typeof camera !== 'undefined' && typeof renderer !== 'undefined') {
            camera.aspect = window.innerWidth / window.innerHeight;
            camera.updateProjectionMatrix();
            renderer.setSize(window.innerWidth, window.innerHeight);
        }
    }, 150);
}, { passive: true });



// ═══════════════════════════════════════════
// PARTICLE CANVAS — optimised: 45 particles, dist² fast-reject
// ═══════════════════════════════════════════
const canvas = document.getElementById('particleCanvas');
const ctx = canvas.getContext('2d');
let particles = [];
let mouse = { x: -9999, y: -9999 };

function resizeCanvas() {
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;
}
resizeCanvas();
window.addEventListener('resize', resizeCanvas, { passive: true });

const MAX_DIST = 100;
const MAX_DIST_SQ = MAX_DIST * MAX_DIST; // avoid sqrt in inner loop
const MOUSE_DIST_SQ = 120 * 120;

class Particle {
    constructor() { this.reset(); }
    reset() {
        this.x = Math.random() * canvas.width;
        this.y = Math.random() * canvas.height;
        this.r = Math.random() * 2 + 0.5;
        this.vx = (Math.random() - .5) * .4;
        this.vy = (Math.random() - .5) * .4;
        this.alpha = Math.random() * .45 + .1;
    }
    update() {
        const dx = this.x - mouse.x;
        const dy = this.y - mouse.y;
        if (dx * dx + dy * dy < MOUSE_DIST_SQ) {
            const dist = Math.sqrt(dx * dx + dy * dy) || 1;
            this.x += dx / dist * 1.2;
            this.y += dy / dist * 1.2;
        }
        this.x += this.vx;
        this.y += this.vy;
        if (this.x < 0 || this.x > canvas.width || this.y < 0 || this.y > canvas.height) this.reset();
    }
    draw() {
        ctx.beginPath();
        ctx.arc(this.x, this.y, this.r, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(249,115,22,${this.alpha})`;
        ctx.fill();
    }
}

const PARTICLE_COUNT = 45; // reduced from 90
for (let i = 0; i < PARTICLE_COUNT; i++) particles.push(new Particle());

function animateParticles() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    // Update + draw dots
    for (let i = 0; i < particles.length; i++) {
        particles[i].update();
        particles[i].draw();
    }
    // Draw connecting lines — dist² fast-reject avoids sqrt for far pairs
    ctx.lineWidth = 0.5;
    for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
            const dx = particles[i].x - particles[j].x;
            const dy = particles[i].y - particles[j].y;
            const dSq = dx * dx + dy * dy;
            if (dSq < MAX_DIST_SQ) {
                ctx.beginPath();
                ctx.moveTo(particles[i].x, particles[i].y);
                ctx.lineTo(particles[j].x, particles[j].y);
                ctx.strokeStyle = `rgba(249,115,22,${0.12 * (1 - dSq / MAX_DIST_SQ)})`;
                ctx.stroke();
            }
        }
    }
    requestAnimationFrame(animateParticles);
}
animateParticles();

// ═══════════════════════════════════════════
// TEXT SCRAMBLE — Hero role
// ═══════════════════════════════════════════
const roles = ['CYBER', 'FORENSICS', 'ETHICAL', 'SECURITY', 'AI-POWERED'];
let roleIdx = 0;
const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789@#$%';
const scrambleEl = document.getElementById('scrambleText');

function scrambleTo(target) {
    if (!scrambleEl) return;
    let iteration = 0;
    const full = target.length;
    clearInterval(scrambleEl._interval);
    scrambleEl._interval = setInterval(() => {
        scrambleEl.textContent = target.split('').map((c, i) => {
            if (i < Math.floor(iteration)) return c === ' ' ? ' ' : c;
            return c === ' ' ? ' ' : chars[Math.floor(Math.random() * chars.length)];
        }).join('');
        iteration += 1.2;
        if (iteration >= full + 3) {
            clearInterval(scrambleEl._interval);
            scrambleEl.textContent = target;
        }
    }, 40);
}

scrambleTo(roles[roleIdx]);
setInterval(() => {
    roleIdx = (roleIdx + 1) % roles.length;
    scrambleTo(roles[roleIdx]);
}, 3500);

// ═══════════════════════════════════════════
// SCROLL — single throttled RAF-gated handler
// ═══════════════════════════════════════════
const navbar = document.getElementById('navbar');
const navLinksEl = document.getElementById('navLinks');
const navLinksItems = document.querySelectorAll('.nav-link');
const scrollSections = document.querySelectorAll('section[id]');
const backTop = document.getElementById('backTop');
const scrollNum = document.querySelector('.scroll-inner-num');

let scrollRAF = false;
function onScroll() {
    if (scrollRAF) return;
    scrollRAF = true;
    requestAnimationFrame(() => {
        const sy = window.scrollY;
        if (navbar) navbar.classList.toggle('scrolled', sy > 50);
        if (backTop) backTop.classList.toggle('show', sy > 400);
        if (scrollNum) scrollNum.textContent = Math.min(Math.round(sy / 10), 99);
        
        // Active nav link tracking (Precise)
        let currentSection = '';
        scrollSections.forEach(s => {
            const top = s.offsetTop - 120;
            if (sy >= top) currentSection = s.id;
        });
        
        navLinksItems.forEach(l => {
            l.classList.toggle('active', l.getAttribute('href') === '#' + currentSection);
        });
        
        scrollRAF = false;
    });
}
window.addEventListener('scroll', onScroll, { passive: true });

// Hamburger menu
const hamburgerBtn = document.getElementById('hamburger');
if (hamburgerBtn && navLinksEl) {
    hamburgerBtn.addEventListener('click', () => {
        hamburgerBtn.classList.toggle('active');
        navLinksEl.classList.toggle('open');
        document.body.style.overflow = navLinksEl.classList.contains('open') ? 'hidden' : 'auto';
    });

    navLinksItems.forEach(a => a.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        navLinksEl.classList.remove('open');
        document.body.style.overflow = 'auto';
    }));

    document.getElementById('navClose')?.addEventListener('click', () => {
        hamburgerBtn.classList.remove('active');
        navLinksEl.classList.remove('open');
        document.body.style.overflow = 'auto';
    });
}
document.getElementById('backTop')?.addEventListener('click', () => window.scrollTo({ top: 0, behavior: 'smooth' }));

// ═══════════════════════════════════════════
// DARK / LIGHT MODE
// ═══════════════════════════════════════════
const themeToggle = document.getElementById('themeToggle');
const html = document.documentElement;
const savedTheme = localStorage.getItem('theme') || 'light';
html.setAttribute('data-theme', savedTheme);
themeToggle.textContent = savedTheme === 'dark' ? '☀' : '◐';

themeToggle?.addEventListener('click', () => {
    const t = html.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    html.setAttribute('data-theme', t);
    localStorage.setItem('theme', t);
    themeToggle.textContent = t === 'dark' ? '☀' : '◐';
});

// ═══════════════════════════════════════════
// SCROLL REVEAL
// ═══════════════════════════════════════════
const revealObserver = new IntersectionObserver(entries => {
    entries.forEach((e, i) => {
        if (e.isIntersecting) {
            // Check if parent has reveal-stagger
            const stagger = e.target.parentElement.classList.contains('reveal-stagger');
            setTimeout(() => {
                e.target.classList.add('visible');
            }, stagger ? i * 80 : 0);
            revealObserver.unobserve(e.target);
        }
    });
}, { threshold: 0.1, rootMargin: '0px 0px -20px 0px' });

document.querySelectorAll('.reveal, .reveal-left, .reveal-right, .reveal-pop, .reveal-up, .reveal-scale').forEach(el => revealObserver.observe(el));




// ═══════════════════════════════════════════
// STATS COUNTER
// ═══════════════════════════════════════════
function animateCount(el) {
    const target = +el.dataset.target;
    const dur = 1800;
    const start = performance.now();
    function tick(now) {
        const prog = Math.min((now - start) / dur, 1);
        const ease = 1 - Math.pow(1 - prog, 3);
        el.textContent = Math.round(ease * target);
        if (prog < 1) requestAnimationFrame(tick);
    }
    requestAnimationFrame(tick);
}

const statsObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.count-up').forEach(el => animateCount(el));
            statsObserver.unobserve(e.target);
        }
    });
}, { threshold: .3 });
document.querySelector('.stats-list') && statsObserver.observe(document.querySelector('.stats-list'));

// ═══════════════════════════════════════════
// SKILL BARS
// ═══════════════════════════════════════════
const skillObserver = new IntersectionObserver(entries => {
    entries.forEach(e => {
        if (e.isIntersecting) {
            e.target.querySelectorAll('.skill-fill').forEach(bar => {
                setTimeout(() => bar.style.width = bar.dataset.w + '%', 200);
            });
            skillObserver.unobserve(e.target);
        }
    });
}, { threshold: .2 });
document.querySelector('.skills-grid') && skillObserver.observe(document.querySelector('.skills-grid'));

// ═══════════════════════════════════════════
// 3D CARD TILT — throttled with RAF
// ═══════════════════════════════════════════
document.querySelectorAll('.tilt-card').forEach(card => {
    let tiltRAF = null;
    card.addEventListener('mousemove', e => {
        if (tiltRAF) return; // skip if frame already pending
        tiltRAF = requestAnimationFrame(() => {
            const r = card.getBoundingClientRect();
            const x = (e.clientX - r.left) / r.width - .5;
            const y = (e.clientY - r.top) / r.height - .5;
            card.style.transform = `perspective(800px) rotateY(${x * 12}deg) rotateX(${-y * 12}deg) scale(1.03)`;
            const glare = card.querySelector('.card-glare');
            if (glare) {
                glare.style.setProperty('--gx', ((e.clientX - r.left) / r.width * 100).toFixed(1) + '%');
                glare.style.setProperty('--gy', ((e.clientY - r.top) / r.height * 100).toFixed(1) + '%');
            }
            tiltRAF = null;
        });
    }, { passive: true });
    card.addEventListener('mouseleave', () => {
        if (tiltRAF) { cancelAnimationFrame(tiltRAF); tiltRAF = null; }
        card.style.transform = 'perspective(800px) rotateY(0deg) rotateX(0deg) scale(1)';
    });
});

// ═══════════════════════════════════════════
// PROJECT FILTER
// ═══════════════════════════════════════════
document.querySelectorAll('.filter-btn').forEach(btn => {
    btn.addEventListener('click', () => {
        document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
        btn.classList.add('active');
        const f = btn.dataset.filter;
        document.querySelectorAll('.proj-card').forEach(c => {
            const show = f === 'all' || c.dataset.cat === f;
            c.style.opacity = '0'; c.style.transform = 'scale(.9)';
            setTimeout(() => {
                c.classList.toggle('hidden', !show);
                if (show) {
                    setTimeout(() => { c.style.opacity = '1'; c.style.transform = 'scale(1)'; }, 10);
                }
            }, 200);
        });
    });
});
// Smooth transition style on cards
document.querySelectorAll('.proj-card').forEach(c => {
    c.style.transition = 'opacity .3s, transform .3s, box-shadow .3s';
});

// ═══════════════════════════════════════════
// MAGNETIC BUTTONS — throttled with RAF
// ═══════════════════════════════════════════
document.querySelectorAll('.magnetic-btn').forEach(btn => {
    let magRAF = null;
    btn.addEventListener('mousemove', e => {
        if (magRAF) return;
        magRAF = requestAnimationFrame(() => {
            const r = btn.getBoundingClientRect();
            const x = e.clientX - r.left - r.width / 2;
            const y = e.clientY - r.top - r.height / 2;
            btn.style.transform = `translate(${x * .22}px, ${y * .22}px)`;
            magRAF = null;
        });
    }, { passive: true });
    btn.addEventListener('mouseleave', () => {
        if (magRAF) { cancelAnimationFrame(magRAF); magRAF = null; }
        btn.style.transform = '';
    });
});

// ═══════════════════════════════════════════
// CONTACT FORM & SECURITY
// ═══════════════════════════════════════════
function sanitizeHTML(str) {
    const div = document.createElement('div');
    div.textContent = str;
    return div.innerHTML;
}

const contactForm = document.getElementById('contactForm');
if (contactForm) {
    contactForm.addEventListener('submit', (e) => {
        const inputs = contactForm.querySelectorAll('input:not([type="hidden"]), textarea');
        inputs.forEach(input => {
            input.value = sanitizeHTML(input.value.trim());
        });
        // Form proceeds to FormSubmit.co via native action
    });
}

// ═══════════════════════════════════════════
// TERMINAL MODE
// ═══════════════════════════════════════════
const terminalBtn = document.getElementById('terminalBtn');
const terminalOverlay = document.getElementById('terminalOverlay');
const termClose = document.getElementById('termClose');
const termBody = document.getElementById('termBody');
const termIn = document.getElementById('termIn');

let termHistory = [];
let termHistIdx = -1;

const COMMANDS = {
    help: () => `
<span class="hi">Available Commands:</span>
  <span class="ok">about</span>      — Learn about Aaron
  <span class="ok">skills</span>     — View tech stack & expertise
  <span class="ok">projects</span>   — List featured projects
  <span class="ok">experience</span> — Work history & timeline
  <span class="ok">contact</span>    — Contact information
  <span class="ok">social</span>     — Social media links
  <span class="ok">game</span>       — 🐍 Play Snake game
  <span class="ok">matrix</span>     — 🌧️ Enter the matrix...
  <span class="ok">clear</span>      — Clear terminal
  <span class="ok">theme</span>      — Toggle dark/light mode
  <span class="ok">exit</span>       — Close terminal
`,
    about: () => `
<span class="hi">─── ABOUT AARON ─────────────────────</span>
  <span class="ok">Name:</span>       Aaron Baby Manoj
  <span class="ok">Role:</span>       Cybersecurity Professional
  <span class="ok">Location:</span>   Available Worldwide 🌍
  <span class="ok">Experience:</span> Hands-On Lab & Research
  <span class="ok">Certifications:</span> 8+ Earned
  <span class="ok">Tools:</span>      15+ Mastered

  Aspiring Cybersecurity professional with a strong
  foundation in network security, digital forensics,
  and vulnerability assessment.
`,
    skills: () => `
<span class="hi">─── TECH STACK & EXPERTISE ───────────</span>
  <span class="ok">Security:</span>  Network Sec · Forensics · Vuln Assessment
  <span class="ok">Tools:</span>     Nmap · Wireshark · Autopsy · Burp Suite
  <span class="ok">OS:</span>        Linux Administration · Windows
  <span class="ok">Dev/AI:</span>    Python · Shell Scripting · Local LLMs

  <span class="out">Run <span class="hi">projects</span> to see work built with these.</span>
`,
    projects: () => `
<span class="hi">─── FEATURED PROJECTS ────────────────</span>
  <span class="ok">[1]</span> AI-Based Firewall          <span class="out">— Development</span>
      Prompt Filtering w/ Local LLMs
  
  <span class="ok">[2]</span> IoMT Embedded Security     <span class="out">— Research</span>
      Published in IJCRT

  <span class="out">Visit the Projects section for live demos.</span>
`,
    experience: () => `
<span class="hi">─── EXPERIENCE & JOURNEY ─────────────</span>
  <span class="ok">Jan 2025–Mar 2025</span>  Project Contributor
                     AI-Based Firewall Team
                     Real-time prompt filtering



  <span class="ok">Ongoing</span>            RHCSA Training
                     Red Hat Linux Administration
                     System & storage management

  <span class="ok">Ongoing</span>            CompTIA CySA+ Training
                     Cybersecurity Analyst
                     Behavioral analytics & threat intel

  <span class="ok">2022–2026</span>          B.Tech CS (Cybersecurity)
                     St. Joseph's College
                     Ethical Hacking, Cyber Law
`,
    contact: () => `
<span class="hi">─── CONTACT ──────────────────────────</span>
  <span class="ok">Email:</span>    aaronbabymanoj@gmail.com
  <span class="ok">Status:</span>   <span style="color:#22c55e">● Open to opportunities</span>

  Type <span class="hi">social</span> for social media links.
  Or scroll to the Contact section above ↑
`,
    social: () => `
<span class="hi">─── SOCIAL LINKS ─────────────────────</span>
  <span class="ok">LinkedIn:</span>  linkedin.com/in/aaron-baby-manoj-a1434025a
`,
    game: () => { setTimeout(() => openGame(), 300); return '<span class="ok">Launching Snake game... 🐍</span>'; },
    matrix: () => { startMatrix(); return '<span class="ok">Entering the matrix... 🌧️ Press ESC to exit.</span>'; },
    clear: () => { clearTerminal(); return ''; },
    theme: () => { document.getElementById('themeToggle').click(); return '<span class="ok">Theme toggled!</span>'; },
    exit: () => { toggleTerminal(); return ''; },
};

function toggleTerminal() {
    terminalOverlay.classList.toggle('open');
    if (terminalOverlay.classList.contains('open')) setTimeout(() => termIn.focus(), 350);
}

function clearTerminal() {
    termBody.innerHTML = '';
}

function printLine(html) {
    const div = document.createElement('div');
    div.className = 'term-line';
    div.innerHTML = html;
    termBody.appendChild(div);
    termBody.scrollTop = termBody.scrollHeight;
}

termIn?.addEventListener('keydown', e => {
    if (e.key === 'Enter') {
        const raw = termIn.value.trim().toLowerCase();
        if (!raw) return;
        termHistory.unshift(raw);
        termHistIdx = -1;
        printLine(`<span class="prompt">aaron@portfolio:~$ </span><span class="cmd">${raw}</span>`);
        termIn.value = '';
        const fn = COMMANDS[raw];
        if (fn) {
            const out = fn();
            if (out) printLine(`<span class="out">${out}</span>`);
        } else {
            printLine(`<span class="err">Command not found: ${raw}. Type <span style="color:var(--orange)">help</span> for commands.</span>`);
        }
    }
    if (e.key === 'ArrowUp') {
        termHistIdx = Math.min(termHistIdx + 1, termHistory.length - 1);
        termIn.value = termHistory[termHistIdx] || '';
        e.preventDefault();
    }
    if (e.key === 'ArrowDown') {
        termHistIdx = Math.max(termHistIdx - 1, -1);
        termIn.value = termHistIdx === -1 ? '' : termHistory[termHistIdx];
        e.preventDefault();
    }
    if (e.key === 'Tab') {
        e.preventDefault();
        const partial = termIn.value.trim().toLowerCase();
        const match = Object.keys(COMMANDS).find(k => k.startsWith(partial));
        if (match) termIn.value = match;
    }
});

terminalBtn?.addEventListener('click', toggleTerminal);
termClose?.addEventListener('click', toggleTerminal);
terminalOverlay?.addEventListener('click', e => { if (e.target === terminalOverlay) toggleTerminal(); });

// Game nav button (navbar)
document.getElementById('gameNavBtn')?.addEventListener('click', openGame);

// ═══════════════════════════════════════════
// MATRIX RAIN EASTER EGG
// ═══════════════════════════════════════════
let matrixActive = false;
let matrixCanvas, matrixCtx, matrixInterval;

function startMatrix() {
    if (matrixActive) return;
    matrixActive = true;
    matrixCanvas = document.createElement('canvas');
    matrixCanvas.style.cssText = 'position:fixed;inset:0;z-index:9995;pointer-events:all';
    matrixCanvas.width = window.innerWidth;
    matrixCanvas.height = window.innerHeight;
    document.body.appendChild(matrixCanvas);
    matrixCtx = matrixCanvas.getContext('2d');
    const cols = Math.floor(matrixCanvas.width / 14);
    const drops = Array(cols).fill(1);
    matrixInterval = setInterval(() => {
        matrixCtx.fillStyle = 'rgba(0,0,0,.05)';
        matrixCtx.fillRect(0, 0, matrixCanvas.width, matrixCanvas.height);
        matrixCtx.fillStyle = '#F97316';
        matrixCtx.font = '13px Space Mono, monospace';
        drops.forEach((y, i) => {
            const c = String.fromCharCode(0x30A0 + Math.random() * 96);
            matrixCtx.fillText(c, i * 14, y * 14);
            if (y * 14 > matrixCanvas.height && Math.random() > .975) drops[i] = 0;
            drops[i]++;
        });
    }, 40);
    // press ESC to exit
    const escHandler = e => {
        if (e.key === 'Escape') { stopMatrix(); document.removeEventListener('keydown', escHandler); }
    };
    document.addEventListener('keydown', escHandler);
    matrixCanvas.addEventListener('click', stopMatrix);
}

function stopMatrix() {
    if (!matrixActive) return;
    clearInterval(matrixInterval);
    matrixCanvas.remove();
    matrixActive = false;
}

// ═══════════════════════════════════════════
// SNAKE MINI GAME
// ═══════════════════════════════════════════
const gameOverlay = document.getElementById('gameOverlay');
const gameX = document.getElementById('gameX');
const gameStart = document.getElementById('gameStart');
const snakeCanvas = document.getElementById('snakeCanvas');
const snakeCtx = snakeCanvas.getContext('2d');

let snake, food, dir, nextDir, gameRunning, gameInterval, score, bestScore;
bestScore = parseInt(localStorage.getItem('snakeBest') || '0');
document.getElementById('snakeBest').textContent = bestScore;

const CELL = 20;
const COLS = snakeCanvas.width / CELL;
const ROWS = snakeCanvas.height / CELL;

function initSnake() {
    snake = [{ x: 10, y: 10 }];
    dir = { x: 1, y: 0 };
    nextDir = { x: 1, y: 0 };
    score = 0;
    document.getElementById('snakeScore').textContent = 0;
    placeFood();
    drawGame();
}

function placeFood() {
    do {
        food = { x: Math.floor(Math.random() * COLS), y: Math.floor(Math.random() * ROWS) };
    } while (snake.some(s => s.x === food.x && s.y === food.y));
}

function drawGame() {
    snakeCtx.fillStyle = '#0a0a0a';
    snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    // Grid
    snakeCtx.strokeStyle = 'rgba(249,115,22,.04)';
    for (let i = 0; i < COLS; i++) {
        snakeCtx.beginPath(); snakeCtx.moveTo(i * CELL, 0); snakeCtx.lineTo(i * CELL, snakeCanvas.height); snakeCtx.stroke();
    }
    for (let j = 0; j < ROWS; j++) {
        snakeCtx.beginPath(); snakeCtx.moveTo(0, j * CELL); snakeCtx.lineTo(snakeCanvas.width, j * CELL); snakeCtx.stroke();
    }
    // Food
    snakeCtx.fillStyle = '#F97316';
    snakeCtx.shadowBlur = 12; snakeCtx.shadowColor = '#F97316';
    snakeCtx.fillRect(food.x * CELL + 2, food.y * CELL + 2, CELL - 4, CELL - 4);
    snakeCtx.shadowBlur = 0;
    // Snake
    snake.forEach((seg, i) => {
        snakeCtx.fillStyle = i === 0 ? '#ffffff' : `hsl(${25 - i * 1.5}, 90%, ${60 - i * 0.8}%)`;
        snakeCtx.beginPath();
        snakeCtx.roundRect(seg.x * CELL + 1, seg.y * CELL + 1, CELL - 2, CELL - 2, 4);
        snakeCtx.fill();
    });
}

function gameStep() {
    dir = { ...nextDir };
    const head = { x: snake[0].x + dir.x, y: snake[0].y + dir.y };
    if (head.x < 0 || head.x >= COLS || head.y < 0 || head.y >= ROWS ||
        snake.some(s => s.x === head.x && s.y === head.y)) {
        endGame(); return;
    }
    snake.unshift(head);
    if (head.x === food.x && head.y === food.y) {
        score++;
        document.getElementById('snakeScore').textContent = score;
        if (score > bestScore) {
            bestScore = score;
            localStorage.setItem('snakeBest', bestScore);
            document.getElementById('snakeBest').textContent = bestScore;
        }
        placeFood();
    } else {
        snake.pop();
    }
    drawGame();
}

function endGame() {
    clearInterval(gameInterval);
    gameRunning = false;
    snakeCtx.fillStyle = 'rgba(0,0,0,.7)';
    snakeCtx.fillRect(0, 0, snakeCanvas.width, snakeCanvas.height);
    snakeCtx.fillStyle = '#F97316';
    snakeCtx.font = 'bold 28px Space Grotesk, sans-serif';
    snakeCtx.textAlign = 'center';
    snakeCtx.fillText('GAME OVER', snakeCanvas.width / 2, snakeCanvas.height / 2 - 20);
    snakeCtx.fillStyle = '#fff';
    snakeCtx.font = '16px Space Mono, monospace';
    snakeCtx.fillText(`Score: ${score}`, snakeCanvas.width / 2, snakeCanvas.height / 2 + 15);
    snakeCtx.fillText('Press START to play again', snakeCanvas.width / 2, snakeCanvas.height / 2 + 45);
    gameStart.textContent = '▶ PLAY AGAIN';
}

function openGame() {
    gameOverlay.classList.add('open');
    initSnake();
}

gameStart?.addEventListener('click', () => {
    if (gameRunning) return;
    gameRunning = true;
    gameStart.textContent = '⏸ PLAYING...';
    initSnake();
    clearInterval(gameInterval);
    const speed = Math.max(80, 120 - score * 2);
    gameInterval = setInterval(gameStep, 120);
});

gameX?.addEventListener('click', () => {
    clearInterval(gameInterval);
    gameRunning = false;
    gameOverlay.classList.remove('open');
});
gameOverlay?.addEventListener('click', e => {
    if (e.target === gameOverlay) {
        clearInterval(gameInterval);
        gameRunning = false;
        gameOverlay.classList.remove('open');
    }
});

document.addEventListener('keydown', e => {
    if (!gameRunning) return;
    const map = {
        ArrowUp: { x: 0, y: -1 }, w: { x: 0, y: -1 }, W: { x: 0, y: -1 },
        ArrowDown: { x: 0, y: 1 }, s: { x: 0, y: 1 }, S: { x: 0, y: 1 },
        ArrowLeft: { x: -1, y: 0 }, a: { x: -1, y: 0 }, A: { x: -1, y: 0 },
        ArrowRight: { x: 1, y: 0 }, d: { x: 1, y: 0 }, D: { x: 1, y: 0 },
    };
    const nd = map[e.key];
    if (nd && !(nd.x === -dir.x && nd.y === -dir.y)) {
        nextDir = nd;
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight'].includes(e.key)) e.preventDefault();
    }
});

// ═══════════════════════════════════════════════
// KONAMI CODE → CONFETTI EXPLOSION
// ═══════════════════════════════════════════════
const KONAMI = [38, 38, 40, 40, 37, 39, 37, 39, 66, 65];
let konamiIdx = 0;
document.addEventListener('keydown', e => {
    if (e.keyCode === KONAMI[konamiIdx]) {
        konamiIdx++;
        if (konamiIdx === KONAMI.length) { konamiIdx = 0; launchConfetti(); }
    } else {
        konamiIdx = 0;
    }
});

const confettiCanvas = document.getElementById('confettiCanvas');
const confCtx = confettiCanvas.getContext('2d');
let confettiPieces = [];

function resizeConfetti() {
    confettiCanvas.width = window.innerWidth;
    confettiCanvas.height = window.innerHeight;
}
resizeConfetti();
window.addEventListener('resize', resizeConfetti);

function launchConfetti() {
    confettiPieces = [];
    for (let i = 0; i < 200; i++) {
        confettiPieces.push({
            x: Math.random() * confettiCanvas.width,
            y: -Math.random() * confettiCanvas.height * .5,
            vx: (Math.random() - .5) * 8,
            vy: Math.random() * 6 + 3,
            rot: Math.random() * 360,
            vrot: (Math.random() - .5) * 8,
            w: Math.random() * 14 + 6,
            h: Math.random() * 7 + 4,
            color: ['#F97316', '#fff', '#1A1A1A', '#FEBC2E', '#28c840', '#ff5f57', '#a78bfa'][Math.floor(Math.random() * 7)]
        });
    }
    animateConfetti();
}

function animateConfetti() {
    confCtx.clearRect(0, 0, confettiCanvas.width, confettiCanvas.height);
    confettiPieces = confettiPieces.filter(p => p.y < confettiCanvas.height + 20);
    if (!confettiPieces.length) return;
    confettiPieces.forEach(p => {
        p.x += p.vx; p.y += p.vy;
        p.vy += .12; p.rot += p.vrot;
        confCtx.save();
        confCtx.translate(p.x, p.y);
        confCtx.rotate(p.rot * Math.PI / 180);
        confCtx.fillStyle = p.color;
        confCtx.fillRect(-p.w / 2, -p.h / 2, p.w, p.h);
        confCtx.restore();
    });
    requestAnimationFrame(animateConfetti);
}

// ═══════════════════════════════════════════════
// ESC KEY — close any overlay
// ═══════════════════════════════════════════════
document.addEventListener('keydown', e => {
    if (e.key === 'Escape') {
        terminalOverlay.classList.remove('open');
        gameOverlay.classList.remove('open');
        if (gameRunning) { clearInterval(gameInterval); gameRunning = false; }
    }
});

// ═══════════════════════════════════════════════
// INIT — print initial terminal welcome is already in HTML
// ═══════════════════════════════════════════════
console.log('%c ✦ QURIFOLIO ', 'background:#F97316;color:#fff;font-size:20px;font-weight:bold;padding:8px 16px;border-radius:8px;');
console.log('%c Type the Konami Code on the page for a surprise! (↑↑↓↓←→←→BA)', 'color:#F97316;font-size:12px;');

// ═══════════════════════════════════════════
// 3D BACKGROUND (Three.js WebGL Particle Nexus)
// ═══════════════════════════════════════════
const bgCanvas = document.getElementById('bg3d');
if (bgCanvas && typeof THREE !== 'undefined') {
    const scene = new THREE.Scene();

    // Very subtle fog to fade out distant nodes
    scene.fog = new THREE.FogExp2(0x0a0a0a, 0.0015);

    const camera = new THREE.PerspectiveCamera(75, window.innerWidth / window.innerHeight, 1, 2000);
    camera.position.z = 600;

    const renderer = new THREE.WebGLRenderer({ canvas: bgCanvas, antialias: true, alpha: true });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2)); // Limit pixel ratio for performance
    renderer.setSize(window.innerWidth, window.innerHeight);

    // Create thousands of vertices for a data-grid feel
    const particleCount = window.innerWidth > 768 ? 2000 : 800;
    const geometry = new THREE.BufferGeometry();
    const vertices = [];

    for (let i = 0; i < particleCount; i++) {
        // Distribute particles in a massive cube
        const x = (Math.random() - 0.5) * 2000;
        const y = (Math.random() - 0.5) * 2000;
        const z = (Math.random() - 0.5) * 2000;
        vertices.push(x, y, z);
    }
    geometry.setAttribute('position', new THREE.Float32BufferAttribute(vertices, 3));

    // Styling the particles with the cyberpunk orange theme
    const material = new THREE.PointsMaterial({
        color: 0xF97316,       // Orange accent
        size: 3,
        transparent: true,
        opacity: 0.6,
        sizeAttenuation: true, // Particles get smaller as they move farther away
        blending: THREE.AdditiveBlending // Glow effect when they overlap
    });

    const particles = new THREE.Points(geometry, material);
    scene.add(particles);

    // Mouse tracking for parallax effect
    let mouseX = 0;
    let mouseY = 0;
    let targetX = 0;
    let targetY = 0;

    const windowHalfX = window.innerWidth / 2;
    const windowHalfY = window.innerHeight / 2;

    document.addEventListener('mousemove', (event) => {
        mouseX = (event.clientX - windowHalfX);
        mouseY = (event.clientY - windowHalfY);
    });

    // Handle Window Resize
    window.addEventListener('resize', () => {
        camera.aspect = window.innerWidth / window.innerHeight;
        camera.updateProjectionMatrix();
        renderer.setSize(window.innerWidth, window.innerHeight);
    });

    // Main animation loop
    function animate3d() {
        if (document.visibilityState === 'hidden') {
            requestAnimationFrame(animate3d);
            return;
        }
        requestAnimationFrame(animate3d);

        // Smoothly interpolate camera target
        targetX = mouseX * 0.5;
        targetY = mouseY * 0.5;

        // Apply mouse parallax shift to camera
        camera.position.x += (targetX - camera.position.x) * 0.02;
        camera.position.y += (-targetY - camera.position.y) * 0.02;
        camera.lookAt(scene.position);

        // Very slow ambient rotation of the entire network
        particles.rotation.y += 0.0005;
        particles.rotation.x -= 0.0002;

        renderer.render(scene, camera);
    }
    animate3d();
}
