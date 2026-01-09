(function () {
  const holder = document.querySelector(".site-bg") || document.body;
  if (!holder || document.getElementById("bg-canvas")) return;

  const c = document.createElement("canvas");
  c.id = "bg-canvas";
  holder.appendChild(c);
  const ctx = c.getContext("2d");
  c.setAttribute("aria-hidden", "true");
  c.setAttribute("role", "presentation");

  let W = 0;
  let H = 0;
  let DPR = Math.min(2, window.devicePixelRatio || 1);

  function resize() {
    DPR = Math.min(2, window.devicePixelRatio || 1);
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
  const BLOBS = Array.from({ length: 8 }, () => ({
    r: RAND(140, 260) * DPR,
    x: RAND(0, W),
    y: RAND(0, H),
    sp: RAND(0.0008, 0.0016),
    ang: RAND(0, TAU),
    off: RAND(0, 1000),
    hue: RAND(270, 305),
  }));

  let mouseX = 0.5;
  let mouseY = 0.5;
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
    const dt = (now - t0) * 0.001;
    t0 = now;

    ctx.clearRect(0, 0, W, H);
    ctx.globalCompositeOperation = "lighter";

    for (const b of BLOBS) {
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
        b.r * (0.9 + rad)
      );
      const h1 = b.hue;
      const h2 = b.hue + 25;
      g.addColorStop(0, `hsla(${h1}, 95%, 62%, 0.65)`);
      g.addColorStop(0.55, `hsla(${h2}, 85%, 45%, 0.28)`);
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
