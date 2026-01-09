(function () {
  const DISCOVERY_KEY = "cache_discovered";
  const DEFAULT_DELAY = 45000;
  const DISCOVERED_DELAY = 5000;
  const VISIBLE_CLASS = "is-visible";

  const prefersReducedMotion = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  ).matches;

  function shouldEnable() {
    if (!document.body) return false;
    if (document.body.classList.contains("has-cache-fab")) return true;
    const path = window.location.pathname;
    return path === "/" || path === "" || path.endsWith("/index.html");
  }

  function isStickmanControlled(el) {
    if (!el) return false;
    if (el.classList.contains("is-controlled")) return true;
    return el.getAttribute("aria-pressed") === "true";
  }

  function isDiscovered() {
    try {
      return localStorage.getItem(DISCOVERY_KEY) === "true";
    } catch (e) {
      return false;
    }
  }

  function markDiscovered() {
    try {
      localStorage.setItem(DISCOVERY_KEY, "true");
    } catch (e) {
      /* ignore */
    }
  }

  function buildFab() {
    const existing = document.querySelector(".cache-fab");
    if (existing) return existing;

    const btn = document.createElement("a");
    btn.className = "cache-fab";
    btn.href = "/cache.html";
    btn.setAttribute("aria-label", "Open cache");
    btn.innerHTML = `
      <svg class="cache-fab__icon" viewBox="0 0 24 24" aria-hidden="true">
        <ellipse cx="12" cy="5.5" rx="7" ry="3.5" fill="none" stroke="currentColor" stroke-width="1.6" />
        <path d="M5 5.5v9c0 1.9 3.1 3.5 7 3.5s7-1.6 7-3.5v-9" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
        <path d="M5 10.5c0 1.9 3.1 3.5 7 3.5s7-1.6 7-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
        <path d="M5 15c0 1.9 3.1 3.5 7 3.5s7-1.6 7-3.5" fill="none" stroke="currentColor" stroke-width="1.6" stroke-linecap="round" />
      </svg>
      <span class="cache-fab__text">cache</span>
    `;
    btn.addEventListener("click", () => {
      markDiscovered();
    });

    document.body.appendChild(btn);
    return btn;
  }

  function ensureParticleLayer() {
    let layer = document.querySelector(".cache-fab-particles");
    if (layer) return layer;
    layer = document.createElement("div");
    layer.className = "cache-fab-particles";
    layer.setAttribute("aria-hidden", "true");
    document.body.appendChild(layer);
    return layer;
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function spawnParticles(button) {
    if (prefersReducedMotion) return;
    const rect = button.getBoundingClientRect();
    const cx = rect.left + rect.width / 2;
    const cy = rect.top + rect.height / 2;
    const count = Math.floor(rand(22, 30));
    const layer = ensureParticleLayer();

    for (let i = 0; i < count; i += 1) {
      const particle = document.createElement("span");
      particle.className = "cache-particle";
      const size = rand(4, 8);
      const colors = [
        "rgba(255, 255, 255, 0.95)",
        "rgba(168, 85, 247, 0.9)",
        "rgba(6, 182, 212, 0.9)",
      ];
      particle.style.width = `${size}px`;
      particle.style.height = `${size}px`;
      particle.style.background =
        colors[Math.floor(rand(0, colors.length))];
      particle.style.left = `${Math.round(cx)}px`;
      particle.style.top = `${Math.round(cy)}px`;
      layer.appendChild(particle);

      const angle = rand(0, Math.PI * 2);
      const distance = rand(18, 54);
      const dx = Math.cos(angle) * distance;
      const dy = Math.sin(angle) * distance;
      const duration = rand(700, 1400);
      const delay = rand(0, 120);

      if (typeof particle.animate === "function") {
        const anim = particle.animate(
          [
            {
              transform: "translate(-50%, -50%) translate(0, 0) scale(1)",
              opacity: 0.9,
            },
            {
              transform: `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(0.6)`,
              opacity: 0,
            },
          ],
          {
            duration,
            delay,
            easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
            fill: "forwards",
          }
        );
        anim.onfinish = () => particle.remove();
      } else {
        particle.style.transition = `transform ${duration}ms ease, opacity ${duration}ms ease`;
        setTimeout(() => {
          particle.style.transform = `translate(-50%, -50%) translate(${dx}px, ${dy}px) scale(0.6)`;
          particle.style.opacity = "0";
        }, delay);
        setTimeout(() => particle.remove(), duration + delay + 20);
      }
    }
  }

  function showFab() {
    const btn = buildFab();
    if (btn.classList.contains(VISIBLE_CLASS)) return;
    requestAnimationFrame(() => {
      btn.classList.add(VISIBLE_CLASS);
      spawnParticles(btn);
    });
  }

  function waitForStickmanControl(onReady) {
    const stickman = document.getElementById("stickman");
    if (!stickman) return;
    if (isStickmanControlled(stickman)) {
      onReady();
      return;
    }
    const observer = new MutationObserver(() => {
      if (isStickmanControlled(stickman)) {
        observer.disconnect();
        onReady();
      }
    });
    observer.observe(stickman, {
      attributes: true,
      attributeFilter: ["class", "aria-pressed"],
    });
  }

  function init() {
    if (!shouldEnable()) return;
    const delay = isDiscovered() ? DISCOVERED_DELAY : DEFAULT_DELAY;
    waitForStickmanControl(() => {
      window.setTimeout(showFab, delay);
    });
  }

  if (document.readyState === "loading") {
    document.addEventListener("DOMContentLoaded", init, { once: true });
  } else {
    init();
  }
})();
