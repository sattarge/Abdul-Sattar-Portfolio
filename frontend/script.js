
/* ---- LOADER ---- */
window.addEventListener('load', () => {
  setTimeout(() => {
    document.getElementById('loader').classList.add('hidden');
  }, 1200);
});

/* ---- CURSOR ---- */
const cursor = document.getElementById('cursor');
const ring = document.getElementById('cursor-ring');
let mx = 0, my = 0, rx = 0, ry = 0;
document.addEventListener('mousemove', e => {
  mx = e.clientX; my = e.clientY;
  cursor.style.left = mx + 'px'; cursor.style.top = my + 'px';
});
(function animRing() {
  rx += (mx - rx) * 0.14; ry += (my - ry) * 0.14;
  ring.style.left = rx + 'px'; ring.style.top = ry + 'px';
  requestAnimationFrame(animRing);
})();
document.querySelectorAll('a,button,.choice-btn,.project-card,.skill-card,.service-card,.contact-item').forEach(el => {
  el.addEventListener('mouseenter', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(2.2)';
    ring.style.width = '50px'; ring.style.height = '50px';
    ring.style.borderColor = 'rgba(168,85,247,.6)';
  });
  el.addEventListener('mouseleave', () => {
    cursor.style.transform = 'translate(-50%,-50%) scale(1)';
    ring.style.width = '36px'; ring.style.height = '36px';
    ring.style.borderColor = 'rgba(0,212,255,.5)';
  });
});

/* ---- PARTICLES ---- */
(function() {
  const canvas = document.getElementById('particles');
  const ctx = canvas.getContext('2d');
  let w, h, pts = [];
  function resize() { w = canvas.width = window.innerWidth; h = canvas.height = window.innerHeight; }
  window.addEventListener('resize', resize); resize();
  const N = 100;
  for (let i = 0; i < N; i++) pts.push({
    x: Math.random()*w, y: Math.random()*h,
    vx: (Math.random()-1)*.2, vy: (Math.random()-.5)*.5,
    r: Math.random()*1.5+.5,
    a: Math.random()*2.5,
  });
  function draw() {
    ctx.clearRect(0,0,w,h);
    pts.forEach(p => {
      p.x += p.vx; p.y += p.vy;
      if(p.x<0)p.x=w; if(p.x>w)p.x=0;
      if(p.y<0)p.y=h; if(p.y>h)p.y=0;
      ctx.beginPath();
      ctx.arc(p.x,p.y,p.r,0,Math.PI*2);
      ctx.fillStyle = `rgba(0,212,255,${p.a*.4})`;
      ctx.fill();
    });
    for(let i=0;i<pts.length;i++)
      for(let j=i+1;j<pts.length;j++){
        const dx=pts[i].x-pts[j].x, dy=pts[i].y-pts[j].y;
        const d=Math.sqrt(dx*dx+dy*dy);
        if(d<100){
          ctx.beginPath();
          ctx.moveTo(pts[i].x,pts[i].y); ctx.lineTo(pts[j].x,pts[j].y);
          ctx.strokeStyle=`rgba(124,58,237,${(2-d/100)*.12})`;
          ctx.lineWidth=1; ctx.stroke();
        }
      }
    requestAnimationFrame(draw);
  }
  draw();
})();

/* ---- TYPING ANIMATION ---- */
const roles = [
  'BS Software Engineering Student',
  'Frontend Web Developer',
  'Learning AI & Programming',
  'Open for Freelance Work'
];
let ri = 0, ci = 0, deleting = false;
const typedEl = document.getElementById('typed-text');
function type() {
  const word = roles[ri];
  if (!deleting) {
    typedEl.textContent = word.slice(0, ++ci);
    if (ci === word.length) { deleting = true; setTimeout(type, 1800); return; }
  } else {
    typedEl.textContent = word.slice(0, --ci);
    if (ci === 0) { deleting = false; ri = (ri+1) % roles.length; }
  }
  setTimeout(type, deleting ? 40 : 80);
}
type();

/* ---- NAVBAR ---- */
const nav = document.getElementById('navbar');
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('section');
window.addEventListener('scroll', () => {
  nav.classList.toggle('scrolled', scrollY > 30);
  // Active link
  let current = '';
  sections.forEach(s => { if(scrollY >= s.offsetTop - 100) current = s.id; });
  navLinks.forEach(a => {
    a.classList.toggle('active', a.getAttribute('href') === '#' + current);
  });
  // Back to top
  document.getElementById('back-top').classList.toggle('visible', scrollY > 400);
});
document.getElementById('back-top').addEventListener('click', () => window.scrollTo({top:0,behavior:'smooth'}));

/* ---- HAMBURGER ---- */
const hamburger = document.getElementById('hamburger');
const navList = document.getElementById('nav-links');
hamburger.addEventListener('click', () => {
  hamburger.classList.toggle('open');
  navList.classList.toggle('open');
});
navList.querySelectorAll('a').forEach(a => a.addEventListener('click', () => {
  hamburger.classList.remove('open'); navList.classList.remove('open');
}));

/* ---- SCROLL REVEAL ---- */
const observer = new IntersectionObserver((entries) => {
  entries.forEach(e => {
    if(e.isIntersecting) {
      const delay = e.target.dataset.delay || 0;
      setTimeout(() => e.target.classList.add('visible'), +delay);
      // Skill bars
      e.target.querySelectorAll('.skill-bar-fill').forEach(bar => {
        bar.style.width = bar.dataset.pct + '%';
      });
    }
  });
}, { threshold: 0.12 });
document.querySelectorAll('.reveal').forEach(el => observer.observe(el));

/* ---- CONTACT FORM ---- */
document.getElementById('send-btn').addEventListener('click', () => {
  const name = document.getElementById('f-name').value.trim();
  const email = document.getElementById('f-email').value.trim();
  const msg = document.getElementById('f-msg').value.trim();
  if(!name || !email || !msg) { alert('Please fill in all fields.'); return; }
  const btn = document.getElementById('send-btn');
  btn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Sending...';
  btn.disabled = true;
  setTimeout(() => {
    btn.style.display = 'none';
    document.getElementById('form-success').style.display = 'block';
    document.getElementById('f-name').value = '';
    document.getElementById('f-email').value = '';
    document.getElementById('f-msg').value = '';
  }, 1500);
});


document.getElementById("send-btn").addEventListener("click", async () => {

  const name = document.getElementById("f-name").value;
  const email = document.getElementById("f-email").value;
  const message = document.getElementById("f-msg").value;

  try {

    const response = await fetch("https://abdul-sattar-portfolio.vercel.app/send-email", {
      method: "POST",
      headers: {
        "Content-Type": "application/json"
      },
      body: JSON.stringify({
        name,
        email,
        message
      })
    });

    const data = await response.json();

    if (data.success) {
      alert("Message Sent Successfully!");
    } else {
      alert(data.error);
    }

  } catch (error) {
    console.log(error);
    alert("Server Error");
  }

});