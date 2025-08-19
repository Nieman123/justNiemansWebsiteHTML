(function(){
  // --- Flowing purple background (metaball gradients) ---
  (function(){
    const holder = document.querySelector('.site-bg') || document.body;
    const c = document.createElement('canvas');
    c.id = 'bg-canvas';
    holder.appendChild(c);
    const ctx = c.getContext('2d');
    c.setAttribute('aria-hidden','true'); c.setAttribute('role','presentation');

    let W = 0, H = 0, DPR = Math.min(2, window.devicePixelRatio || 1);
    function resize(){
      W = Math.floor(window.innerWidth * DPR);
      H = Math.floor(window.innerHeight * DPR);
      c.width = W; c.height = H;
      c.style.width = '100%'; c.style.height = '100%';
    }
    resize();
    window.addEventListener('resize', resize);

    const RAND = (min,max)=> min + Math.random()*(max-min);
    const TAU = Math.PI*2;
    const BLOBS = Array.from({length: 8}, (_,i)=>({
      r: RAND(140, 260) * DPR,
      x: RAND(0, W),
      y: RAND(0, H),
      sp: RAND(.0008, .0016),
      ang: RAND(0, TAU),
      off: RAND(0, 1000),
      hue: RAND(270, 305), // purple range
    }));

    let mouseX = 0.5, mouseY = 0.5;
    window.addEventListener('mousemove', (e)=>{
      mouseX = e.clientX / window.innerWidth;
      mouseY = e.clientY / window.innerHeight;
    });

    function ease(a,b,t){ return a + (b-a)*t; }

    let t0 = performance.now();

    let running = true;
    document.addEventListener('visibilitychange', () => {
      running = !document.hidden;
      if (running) requestAnimationFrame(frame);
    });

    function frame(now){
      if (!running) return;
      const dt = (now - t0) * 0.001; // seconds
      t0 = now;

      ctx.clearRect(0,0,W,H);
      ctx.globalCompositeOperation = 'lighter';

      for(const b of BLOBS){
        // Lazy pseudo-noise orbiting
        b.ang += b.sp * (1 + 0.4*Math.sin((now*0.0003)+b.off));
        const rad = 0.18 + 0.08*Math.sin((now*0.0002)+b.off);
        const cx = ease(b.x, (0.5 + 0.35*Math.cos(b.ang+b.off))*W, 0.06);
        const cy = ease(b.y, (0.5 + 0.35*Math.sin(b.ang-b.off))*H, 0.06);
        b.x = cx + (mouseX-0.5)*W*0.002;
        b.y = cy + (mouseY-0.5)*H*0.002;

        const g = ctx.createRadialGradient(b.x, b.y, 0, b.x, b.y, b.r*(0.9+rad));
        const h1 = b.hue;
        const h2 = b.hue + 25;
        g.addColorStop(0, `hsla(${h1}, 95%, 62%, .65)`);
        g.addColorStop(.55, `hsla(${h2}, 85%, 45%, .28)`);
        g.addColorStop(1, 'hsla(260, 70%, 8%, 0)');

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, TAU);
        ctx.fill();
      }

      ctx.globalCompositeOperation = 'source-over';
      requestAnimationFrame(frame);
    }

    if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
      requestAnimationFrame(frame);
    }
  })();
  })();
// --- Gallery items ---
const GALLERY_ITEMS = [
  ['assets/gallery/1.jpg', 'Memories at The Getaway'],
  ['assets/gallery/2.jpg', 'Afters?'],
  ['assets/gallery/3.jpg', 'Looking for the next track.'],
  ['assets/gallery/7.jpg', 'At Electric Forest 2025.'],
  ['assets/gallery/5.jpg', 'Memories at The Getaway'],
  ['assets/gallery/2.webp', 'At Static Age Loft'],
  // [thumb_or_image_src, caption, optional_video_src]
  ['assets/video/shell-thumb.jpg', 'Shell crowd moment', 'assets/video/shell.mp4']
];

(function(){
  const mainA = document.getElementById('g-main-a');
  const mainB = document.getElementById('g-main-b');
  const cap   = document.getElementById('g-cap');
  const thumbsWrap = document.getElementById('gallery-thumbs');
  const galleryMain = document.querySelector('.gallery-main');
  const unmuteBtn = document.getElementById('unmuteBtn');

  let i = 0;
  let active = mainA;
  let standby = mainB;
  let timer = null;
  let resumeTimeout = null;

  function showUnmuteBtn(show){ if(unmuteBtn) unmuteBtn.hidden = !show; }
  function handleUnmute(){
    const vid = galleryMain.querySelector('.slide-vid');
    if(vid){ vid.muted = false; vid.play(); }
    showUnmuteBtn(false);
    pauseThenResume();
  }
  if(unmuteBtn){ unmuteBtn.addEventListener('click', handleUnmute); }

  function removeExistingVideo(){
    const existingVideo = galleryMain.querySelector('.slide-vid');
    if(existingVideo){
      existingVideo.pause();
      existingVideo.remove();
    }
    showUnmuteBtn(false);
  }

  function buildThumbs(){
    if(!thumbsWrap) return;
    thumbsWrap.innerHTML = '';
    GALLERY_ITEMS.forEach((item, idx)=>{
      const t = new Image();
      t.src = item[0];
      t.alt = item[1];
      t.className = 'thumb' + (idx===i ? ' active' : '');
      // If this gallery item specifies a video, tag the thumb
      if (Array.isArray(item) && item[2]){
        t.dataset.video = item[2];
        t.classList.add('video-thumb');
      }
      t.setAttribute('role','listitem');
      t.setAttribute('loading', 'lazy');
      // Note: If thumbnail elements have data-video attributes, they should be set in HTML or elsewhere
      t.addEventListener('click', ()=>{
          if(t.dataset.video){
            removeExistingVideo();
            // Demote the currently active image for a smooth transition
            const activeEl = galleryMain.querySelector('.slide-img.is-active');
            if(activeEl){
              activeEl.classList.remove('is-active');
              activeEl.classList.add('to-left');
              setTimeout(()=>activeEl.classList.remove('to-left'), 500);
            }
            const video = document.createElement('video');
            video.src = t.dataset.video;
            video.className = 'slide-vid slide-media is-active';
            video.muted = true;
            video.loop = true;
            video.playsInline = true;
            video.autoplay = true;
            video.setAttribute('aria-label', t.alt || 'Video');
            galleryMain.appendChild(video);
            showUnmuteBtn(true);
            // Update active index and UI state
            i = idx;
            pauseThenResume();
            setCaption(t.alt || '');
            markActiveThumb();
          } else {
            removeExistingVideo();
            goTo(idx);
            pauseThenResume();
          }
      });
      thumbsWrap.appendChild(t);
    });
  }

  function setCaption(idxOrText){
    if(!cap) return;
    if(typeof idxOrText === 'number'){
      cap.textContent = GALLERY_ITEMS[idxOrText][1];
    } else {
      cap.textContent = idxOrText;
    }
  }

  // Slide animation swap (right → in, left → out)
  function slideSwap(nextIdx){
    if(!active || !standby) return;
    const next = GALLERY_ITEMS[nextIdx % GALLERY_ITEMS.length];

    standby.classList.remove('is-active','to-left');
    standby.src = next[0];
    standby.alt = next[1];
    void standby.offsetWidth; // reflow
    standby.classList.add('is-active');

    active.classList.remove('is-active');
    active.classList.add('to-left');

    const onDone = () => {
      active.classList.remove('to-left');
      const tmp = active; active = standby; standby = tmp;
      active.removeEventListener('transitionend', onDone);
    };
    active.addEventListener('transitionend', onDone);

    setCaption(nextIdx);
  }

  function markActiveThumb(){
    if(!thumbsWrap) return;
    Array.from(thumbsWrap.children).forEach((el, idx)=>{
      el.classList.toggle('active', idx===i);
    });
  }

  function renderInitial(){
    const item = GALLERY_ITEMS[i];
    if(active){
      active.src = item[0];
      active.alt = item[1];
      active.classList.add('is-active');
    }
    setCaption(i);
    buildThumbs();
    markActiveThumb();
  }

  function goTo(idx){ 
    if(idx===i) return; 
    slideSwap(idx); 
    i = idx; 
    markActiveThumb(); 
  }
  function next(){ 
    removeExistingVideo();
    goTo((i+1) % GALLERY_ITEMS.length); 
  }
  function startTimer(){
    if(timer || window.matchMedia('(prefers-reduced-motion: reduce)').matches) return;
    timer = setInterval(next, 7000);
  }
  function stopTimer(){ if(timer){ clearInterval(timer); timer=null; } }
  function pauseThenResume(){
    stopTimer();
    if(resumeTimeout){ clearTimeout(resumeTimeout); }
    resumeTimeout = setTimeout(()=>{ resumeTimeout=null; startTimer(); }, 30000);
  }

  // About toggle (starts collapsed; button stays visible)
  const about = document.querySelector('.about-hero');
  const toggle = document.getElementById('aboutToggle');
  let expanded = false;
  function applyAbout(){
    if(!about || !toggle) return;
    about.classList.toggle('expanded', expanded);
    toggle.textContent = expanded ? 'Show Less' : 'Show More';
    toggle.setAttribute('aria-expanded', expanded ? 'true' : 'false');
  }

  renderInitial();
  startTimer();
  if(toggle){ toggle.addEventListener('click', ()=>{ expanded = !expanded; applyAbout(); }); }
})();

// Track site interaction events with Google Analytics
document.addEventListener('click', (e) => {
  const el = e.target.closest('a, button, .thumb');
  if (!el || typeof gtag !== 'function') return;
  let label = el.getAttribute('href') || el.getAttribute('alt') || el.id || (el.textContent || '').trim();
  gtag('event', 'interaction', {
    event_category: 'site',
    event_label: label
  });
});

// Ensure UTM tagging on Links page
(function(){
  if (!document.body.classList.contains('links-body')) return;
  const params = new URLSearchParams({ utm_source: 'links', utm_medium: 'website', utm_campaign: 'links_page' });
  document.querySelectorAll('.links-list a[href^="http"]').forEach(a => {
    try{
      const u = new URL(a.href);
      // Only append if not already present
      if (!u.searchParams.has('utm_source')){
        params.forEach((v,k)=>{ u.searchParams.set(k, v); });
        a.href = u.toString();
      }
    }catch(e){ /* ignore malformed */ }
  });
})();

// Mobile dock toggle
(function(){
  const btn = document.getElementById('dockToggle');
  const nav = document.getElementById('dockNav');
  if(!btn || !nav) return;
  btn.addEventListener('click', () => {
    const open = document.body.classList.toggle('dock-open');
    btn.setAttribute('aria-expanded', open);
  });
  nav.querySelectorAll('a').forEach(a => {
    a.addEventListener('click', () => {
      document.body.classList.remove('dock-open');
      btn.setAttribute('aria-expanded', 'false');
    });
  });
})();
