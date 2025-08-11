// --- Gallery items (from your list) ---
const GALLERY_ITEMS = [
  ['assets/gallery/1.jpg', 'Memories at The Getaway'],
  ['assets/gallery/2.jpg', 'Afters?'],
  ['assets/gallery/3.jpg', 'Loading up a track that will be just right.'],
  ['assets/gallery/4.jpg', 'Times at Water Street (White Rabbit)'],
  ['assets/gallery/5.jpg', 'Memories at The Getaway'],
  ['assets/gallery/2.webp', 'At Static Age Loft'],
];

(function(){
  const main = document.getElementById('g-main');
  const cap  = document.getElementById('g-cap');
  const sideTop = document.getElementById('g-side-top');
  const sideBottom = document.getElementById('g-side-bottom');
  let i = 0;

  function setImages(idx){
    const a = GALLERY_ITEMS[(idx) % GALLERY_ITEMS.length];
    const b = GALLERY_ITEMS[(idx+1) % GALLERY_ITEMS.length];
    const c = GALLERY_ITEMS[(idx+2) % GALLERY_ITEMS.length];
    if(main){ main.src = a[0]; main.alt = a[1]; }
    if(cap){ cap.textContent = a[1]; }
    if(sideTop){ sideTop.src = b[0]; sideTop.alt = b[1]; }
    if(sideBottom){ sideBottom.src = c[0]; sideBottom.alt = c[1]; }
  }
  setImages(i);

  // Rotate every 5s
  if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){
    setInterval(()=>{ i = (i+1) % GALLERY_ITEMS.length; setImages(i); }, 5000);
  }

  // About expand/collapse (defaults to expanded on desktop)
  const about = document.querySelector('.about');
  const toggle = document.getElementById('aboutToggle');
  let collapsed = false;

  function applyCollapse(){
    if(!about) return;
    if(collapsed){
      about.style.maxHeight = '220px';
      about.style.overflow = 'hidden';
      toggle.textContent = 'Show More';
      toggle.setAttribute('aria-expanded','false');
      about.classList.add('clipped');
    }else{
      about.style.maxHeight = '';
      about.style.overflow = '';
      toggle.textContent = 'Show Less';
      toggle.setAttribute('aria-expanded','true');
      about.classList.remove('clipped');
    }
  }

  // Auto-collapse on narrow screens initially
  if(window.innerWidth < 720){ collapsed = true; applyCollapse(); }
  if(toggle){ toggle.addEventListener('click', ()=>{ collapsed = !collapsed; applyCollapse(); }); }
})();
// --- Gallery items (from your list) ---
const GALLERY_ITEMS = [
  ['assets/gallery/1.jpg', 'Memories at The Getaway'],
  ['assets/gallery/2.jpg', 'Afters?'],
  ['assets/gallery/3.jpg', 'Loading up a track that will be just right.'],
  ['assets/gallery/4.jpg', 'Times at Water Street (White Rabbit)'],
  ['assets/gallery/5.jpg', 'Memories at The Getaway'],
  ['assets/gallery/2.webp', 'At Static Age Loft'],
];

(function(){
  const mainA = document.getElementById('g-main-a');
  const mainB = document.getElementById('g-main-b');
  const cap   = document.getElementById('g-cap');
  const thumbsWrap = document.getElementById('gallery-thumbs');

  let i = 0;              // active index
  let active = mainA;     // visible image element
  let standby = mainB;    // off-screen image element
  let timer = null;

  // Build thumbnails dynamically (handles >3 thumbs)
  function buildThumbs(){
    if(!thumbsWrap) return;
    thumbsWrap.innerHTML = '';
    GALLERY_ITEMS.forEach((item, idx)=>{
      const t = new Image();
      t.src = item[0];
      t.alt = item[1];
      t.className = 'thumb' + (idx===i ? ' active' : '');
      t.setAttribute('role','listitem');
      t.addEventListener('click', ()=>{ goTo(idx); pauseThenResume(); });
      thumbsWrap.appendChild(t);
    });
  }

  function setCaption(idx){ if(cap) cap.textContent = GALLERY_ITEMS[idx][1]; }

  // Slide animation swap
  function slideSwap(nextIdx){
    if(!active || !standby) return;
    const next = GALLERY_ITEMS[nextIdx % GALLERY_ITEMS.length];

    // prepare standby
    standby.classList.remove('is-active','to-left');
    standby.src = next[0];
    standby.alt = next[1];
    void standby.offsetWidth; // reflow to ensure starting transform

    // animate
    standby.classList.add('is-active');           // slides in from right
    active.classList.remove('is-active');
    active.classList.add('to-left');              // slides out to left

    const onDone = () => {
      active.classList.remove('to-left');
      const tmp = active; active = standby; standby = tmp; // swap
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

  function goTo(idx){ if(idx===i) return; slideSwap(idx); i = idx; markActiveThumb(); }
  function next(){ goTo((i+1) % GALLERY_ITEMS.length); }
  function startTimer(){ if(!window.matchMedia('(prefers-reduced-motion: reduce)').matches){ timer = setInterval(next, 5000); } }
  function stopTimer(){ if(timer){ clearInterval(timer); timer=null; } }
  function pauseThenResume(){ stopTimer(); setTimeout(startTimer, 12000); }

  // About toggle (button always visible, default collapsed)
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