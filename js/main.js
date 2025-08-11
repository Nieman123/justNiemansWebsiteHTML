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