(function () {
  // --- Flowing purple background (metaball gradients) ---
  (function () {
    const holder = document.querySelector(".site-bg") || document.body;
    const c = document.createElement("canvas");
    c.id = "bg-canvas";
    holder.appendChild(c);
    const ctx = c.getContext("2d");
    c.setAttribute("aria-hidden", "true");
    c.setAttribute("role", "presentation");

    let W = 0,
      H = 0,
      DPR = Math.min(2, window.devicePixelRatio || 1);
    function resize() {
      W = Math.floor(window.innerWidth * DPR);
      H = Math.floor(window.innerHeight * DPR);
      c.width = W;
      c.height = H;
      c.style.width = "100%";
      c.style.height = "100%";
    }
    resize();
    window.addEventListener("resize", resize, { passive: true });

    const RAND = (min, max) => min + Math.random() * (max - min);
    const TAU = Math.PI * 2;
    const BLOBS = Array.from({ length: 8 }, (_, i) => ({
      r: RAND(140, 260) * DPR,
      x: RAND(0, W),
      y: RAND(0, H),
      sp: RAND(0.0008, 0.0016),
      ang: RAND(0, TAU),
      off: RAND(0, 1000),
      hue: RAND(270, 305), // purple range
    }));

    let mouseX = 0.5,
      mouseY = 0.5;
    window.addEventListener(
      "mousemove",
      (e) => {
        mouseX = e.clientX / window.innerWidth;
        mouseY = e.clientY / window.innerHeight;
      },
      { passive: true }
    );

    function ease(a, b, t) {
      return a + (b - a) * t;
    }

    let t0 = performance.now();

    let running = true;
    document.addEventListener("visibilitychange", () => {
      running = !document.hidden;
      if (running) requestAnimationFrame(frame);
    });

    function frame(now) {
      if (!running) return;
      const dt = (now - t0) * 0.001; // seconds
      t0 = now;

      ctx.clearRect(0, 0, W, H);
      ctx.globalCompositeOperation = "lighter";

      for (const b of BLOBS) {
        // Lazy pseudo-noise orbiting
        b.ang += b.sp * (1 + 0.4 * Math.sin(now * 0.0003 + b.off));
        const rad = 0.18 + 0.08 * Math.sin(now * 0.0002 + b.off);
        const cx = ease(b.x, (0.5 + 0.35 * Math.cos(b.ang + b.off)) * W, 0.06);
        const cy = ease(b.y, (0.5 + 0.35 * Math.sin(b.ang - b.off)) * H, 0.06);
        b.x = cx + (mouseX - 0.5) * W * 0.002;
        b.y = cy + (mouseY - 0.5) * H * 0.002;

        const g = ctx.createRadialGradient(
          b.x,
          b.y,
          0,
          b.x,
          b.y,
          b.r * (0.9 + rad),
        );
        const h1 = b.hue;
        const h2 = b.hue + 25;
        g.addColorStop(0, `hsla(${h1}, 95%, 62%, .65)`);
        g.addColorStop(0.55, `hsla(${h2}, 85%, 45%, .28)`);
        g.addColorStop(1, "hsla(260, 70%, 8%, 0)");

        ctx.fillStyle = g;
        ctx.beginPath();
        ctx.arc(b.x, b.y, b.r, 0, TAU);
        ctx.fill();
      }

      ctx.globalCompositeOperation = "source-over";
      requestAnimationFrame(frame);
    }

    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      requestAnimationFrame(frame);
    }
  })();
})();
// --- Gallery items ---
const GALLERY_ITEMS = [
  ["assets/gallery/1.webp", "Memories at The Getaway"],
  ["assets/gallery/2.webp", "Afters?"],
  ["assets/gallery/3.webp", "Looking for the next track."],
  ["assets/gallery/7.webp", "At Electric Forest 2025."],
  ["assets/gallery/5.webp", "Memories at The Getaway"],
  ["assets/gallery/6.webp", "The Pluto Crew and I"],
  // [thumb_or_image_src, caption, optional_video_src]
  [
    "optimized/shell-thumb-720.webp",
    "Shell crowd moment",
    "assets/video/shell.mp4",
  ],
];

(function () {
  const mainA = document.getElementById("g-main-a");
  const mainB = document.getElementById("g-main-b");
  const cap = document.getElementById("g-cap");
  const thumbsWrap = document.getElementById("gallery-thumbs");
  const galleryMain = document.querySelector(".gallery-main");
  let unmuteBtn;

  let i = 0;
  let active = mainA;
  let standby = mainB;
  let timer = null;
  let resumeTimeout = null;

  function showUnmuteBtn(show, muted = true) {
    if (!show) {
      if (unmuteBtn) {
        unmuteBtn.classList.add("is-muted");
        unmuteBtn.setAttribute("aria-label", "Unmute video");
        unmuteBtn.remove();
      }
      return;
    }
    if (!unmuteBtn) {
      unmuteBtn = document.createElement("button");
      unmuteBtn.id = "unmuteBtn";
      unmuteBtn.className = "unmute-btn is-muted";
      unmuteBtn.setAttribute("aria-label", "Unmute video");
      unmuteBtn.innerHTML = `
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" aria-hidden="true" class="ic-muted">
          <path d="M80 416L128 416L262.1 535.2C268.5 540.9 276.7 544 285.2 544C304.4 544 320 528.4 320 509.2L320 130.8C320 111.6 304.4 96 285.2 96C276.7 96 268.5 99.1 262.1 104.8L128 224L80 224C53.5 224 32 245.5 32 272L32 368C32 394.5 53.5 416 80 416zM399 239C389.6 248.4 389.6 263.6 399 272.9L446 319.9L399 366.9C389.6 376.3 389.6 391.5 399 400.8C408.4 410.1 423.6 410.2 432.9 400.8L479.9 353.8L526.9 400.8C536.3 410.2 551.5 410.2 560.8 400.8C570.1 391.4 570.2 376.2 560.8 366.9L513.8 319.9L560.8 272.9C570.2 263.5 570.2 248.3 560.8 239C551.4 229.7 536.2 229.6 526.9 239L479.9 286L432.9 239C423.5 229.6 408.3 229.6 399 239z"/>
        </svg>
        <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 640" aria-hidden="true" class="ic-unmuted">
          <path d="M533.6 96.5C523.3 88.1 508.2 89.7 499.8 100C491.4 110.3 493 125.4 503.3 133.8C557.5 177.8 592 244.8 592 320C592 395.2 557.5 462.2 503.3 506.3C493 514.7 491.5 529.8 499.8 540.1C508.1 550.4 523.3 551.9 533.6 543.6C598.5 490.7 640 410.2 640 320C640 229.8 598.5 149.2 533.6 96.5zM473.1 171C462.8 162.6 447.7 164.2 439.3 174.5C430.9 184.8 432.5 199.9 442.8 208.3C475.3 234.7 496 274.9 496 320C496 365.1 475.3 405.3 442.8 431.8C432.5 440.2 431 455.3 439.3 465.6C447.6 475.9 462.8 477.4 473.1 469.1C516.3 433.9 544 380.2 544 320.1C544 260 516.3 206.3 473.1 171.1zM412.6 245.5C402.3 237.1 387.2 238.7 378.8 249C370.4 259.3 372 274.4 382.3 282.8C393.1 291.6 400 305 400 320C400 335 393.1 348.4 382.3 357.3C372 365.7 370.5 380.8 378.8 391.1C387.1 401.4 402.3 402.9 412.6 394.6C434.1 376.9 448 350.1 448 320C448 289.9 434.1 263.1 412.6 245.5zM80 416L128 416L262.1 535.2C268.5 540.9 276.7 544 285.2 544C304.4 544 320 528.4 320 509.2L320 130.8C320 111.6 304.4 96 285.2 96C276.7 96 268.5 99.1 262.1 104.8L128 224L80 224C53.5 224 32 245.5 32 272L32 368C32 394.5 53.5 416 80 416z"/>
        </svg>
      `;
      unmuteBtn.addEventListener("click", toggleMute);
    }
    unmuteBtn.classList.toggle("is-muted", muted);
    unmuteBtn.setAttribute("aria-label", muted ? "Unmute video" : "Mute video");
    if (!unmuteBtn.isConnected) {
      galleryMain.appendChild(unmuteBtn);
    }
  }
  function toggleMute() {
    const vid = galleryMain.querySelector(".slide-vid");
    if (!vid) return;
    vid.muted = !vid.muted;
    if (!vid.muted) {
      setTimeout(() => {
        vid.play().catch(() => {});
      }, 0);
    }
    showUnmuteBtn(true, vid.muted);
    pauseThenResume();
  }

  function removeExistingVideo() {
    const existingVideo = galleryMain.querySelector(".slide-vid");
    if (existingVideo) {
      existingVideo.pause();
      existingVideo.remove();
    }
    showUnmuteBtn(false, true);
  }

  function buildThumbs() {
    if (!thumbsWrap) return;
    thumbsWrap.innerHTML = "";
    GALLERY_ITEMS.forEach((item, idx) => {
      const pic = document.createElement("picture");
      const match = item[0].match(/assets\/gallery\/(\d)\.webp$/);
      if (match && match[1] !== "1") {
        const source = document.createElement("source");
        source.type = "image/avif";
        source.srcset = `optimized/gallery-${match[1]}-120.avif`;
        pic.appendChild(source);
      }
      const img = new Image();
      img.src = item[0];
      img.alt = item[1];
      img.className = "thumb" + (idx === i ? " active" : "");
      img.setAttribute("role", "listitem");
      img.loading = "lazy";
      img.decoding = "async";
      img.width = 68;
      img.height = 120;
      if (Array.isArray(item) && item[2] && !match) {
        img.dataset.video = item[2];
        img.classList.add("video-thumb");
      }
      img.addEventListener("click", () => {
        if (img.dataset.video) {
          removeExistingVideo();
          const activeEl = galleryMain.querySelector(".slide-img.is-active");
          if (activeEl) {
            activeEl.classList.remove("is-active");
            activeEl.classList.add("to-left");
            setTimeout(() => activeEl.classList.remove("to-left"), 500);
          }
          const video = document.createElement("video");
          video.className = "slide-vid slide-media is-active";
          video.muted = true;
          video.loop = true;
          video.playsInline = true;
          video.autoplay = true;
          video.poster = "optimized/shell-thumb-720.webp";
          video.setAttribute("aria-label", img.alt || "Video");
          const s1 = document.createElement("source");
          s1.src = "optimized/video/shell-av1.webm";
          s1.type = "video/webm";
          video.appendChild(s1);
          const s2 = document.createElement("source");
          s2.src = "optimized/video/shell-vp9.webm";
          s2.type = "video/webm";
          video.appendChild(s2);
          const s3 = document.createElement("source");
          s3.src = img.dataset.video;
          s3.type = "video/mp4";
          video.appendChild(s3);
          galleryMain.appendChild(video);
          showUnmuteBtn(true, true);
          i = idx;
          pauseThenResume();
          setCaption(img.alt || "");
          markActiveThumb();
        } else {
          removeExistingVideo();
          goTo(idx);
          pauseThenResume();
        }
      });
      pic.appendChild(img);
      thumbsWrap.appendChild(pic);
    });
  }

  function setCaption(idxOrText) {
    if (!cap) return;
    if (typeof idxOrText === "number") {
      cap.textContent = GALLERY_ITEMS[idxOrText][1];
    } else {
      cap.textContent = idxOrText;
    }
  }

  // Slide animation swap (right → in, left → out)
  function slideSwap(nextIdx) {
    if (!active || !standby) return;
    const next = GALLERY_ITEMS[nextIdx % GALLERY_ITEMS.length];

    standby.classList.remove("is-active", "to-left");
    standby.src = next[0];
    standby.alt = next[1];
    void standby.offsetWidth; // reflow
    standby.classList.add("is-active");

    active.classList.remove("is-active");
    active.classList.add("to-left");

    const onDone = () => {
      active.classList.remove("to-left");
      const tmp = active;
      active = standby;
      standby = tmp;
      active.removeEventListener("transitionend", onDone);
    };
    active.addEventListener("transitionend", onDone);

    setCaption(nextIdx);
  }

  function markActiveThumb() {
    if (!thumbsWrap) return;
    thumbsWrap.querySelectorAll(".thumb").forEach((el, idx) => {
      el.classList.toggle("active", idx === i);
    });
  }

  function renderInitial() {
    const item = GALLERY_ITEMS[i];
    if (active) {
      active.src = item[0];
      active.alt = item[1];
      active.classList.add("is-active");
    }
    setCaption(i);
    buildThumbs();
    markActiveThumb();
    showUnmuteBtn(false, true);
  }

  function goTo(idx) {
    if (idx === i) return;
    slideSwap(idx);
    i = idx;
    markActiveThumb();
    showUnmuteBtn(false, true);
  }
  function next() {
    removeExistingVideo();
    goTo((i + 1) % GALLERY_ITEMS.length);
  }
  function startTimer() {
    if (timer || window.matchMedia("(prefers-reduced-motion: reduce)").matches)
      return;
    timer = setInterval(next, 7000);
  }
  function stopTimer() {
    if (timer) {
      clearInterval(timer);
      timer = null;
    }
  }
  function pauseThenResume() {
    stopTimer();
    if (resumeTimeout) {
      clearTimeout(resumeTimeout);
    }
    resumeTimeout = setTimeout(() => {
      resumeTimeout = null;
      startTimer();
    }, 30000);
  }

  // About toggle (starts collapsed; button stays visible)
  const about = document.querySelector(".about-hero");
  const toggle = document.getElementById("aboutToggle");
  let expanded = false;
  function applyAbout() {
    if (!about || !toggle) return;
    about.classList.toggle("expanded", expanded);
    toggle.textContent = expanded ? "Show Less" : "Show More";
    toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
  }

  renderInitial();
  startTimer();
  if (toggle) {
    toggle.addEventListener("click", () => {
      expanded = !expanded;
      applyAbout();
    });
  }
})();

// Track site interaction events with Google Analytics
document.addEventListener("click", (e) => {
  const el = e.target.closest("a, button, .thumb");
  if (!el || typeof gtag !== "function") return;
  let label =
    el.getAttribute("href") ||
    el.getAttribute("alt") ||
    el.id ||
    (el.textContent || "").trim();
  gtag("event", "interaction", {
    event_category: "site",
    event_label: label,
  });
});

// Ensure UTM tagging on Links page
(function () {
  if (!document.body.classList.contains("links-body")) return;
  const params = new URLSearchParams({
    utm_source: "links",
    utm_medium: "website",
    utm_campaign: "links_page",
  });
  document.querySelectorAll('.links-list a[href^="http"]').forEach((a) => {
    try {
      const u = new URL(a.href);
      // Only append if not already present
      if (!u.searchParams.has("utm_source")) {
        params.forEach((v, k) => {
          u.searchParams.set(k, v);
        });
        a.href = u.toString();
      }
    } catch (e) {
      /* ignore malformed */
    }
  });
})();

// Mobile dock toggle
(function () {
  const btn = document.getElementById("dockToggle");
  const nav = document.getElementById("dockNav");
  if (!btn || !nav) return;
  btn.addEventListener("click", () => {
    const open = document.body.classList.toggle("dock-open");
    btn.setAttribute("aria-expanded", open);
  });
  nav.querySelectorAll("a").forEach((a) => {
    a.addEventListener("click", () => {
      document.body.classList.remove("dock-open");
      btn.setAttribute("aria-expanded", "false");
    });
  });
})();
