(() => {
  const STICKMAN_ID = "stickman";
  if (document.getElementById(STICKMAN_ID)) return;

  const prefersReducedMotionQuery = window.matchMedia(
    "(prefers-reduced-motion: reduce)"
  );
  let reducedMotion = prefersReducedMotionQuery.matches;
  let idleEnabled = !reducedMotion;

  const stickman = document.createElement("div");
  stickman.id = STICKMAN_ID;
  stickman.setAttribute("role", "button");
  stickman.setAttribute("tabindex", "0");
  stickman.setAttribute("aria-pressed", "false");
  stickman.setAttribute("aria-label", "Click to control the stickman");
  stickman.title = "Click to control the stickman";

  const art = document.createElement("pre");
  art.className = "stickman-art";
  stickman.appendChild(art);

  const hint = document.createElement("div");
  hint.id = "stickman-hint";
  hint.textContent =
    "Control mode: A/D or arrows, Space to jump. Click again to exit.";
  hint.setAttribute("aria-hidden", "true");
  stickman.appendChild(hint);

  document.body.appendChild(stickman);

  const BACKSLASH = "\\";
  const DEFAULT_FRAME_LINES = 4;
  const BOMB_ART = [" O ", "/|" + BACKSLASH, " | "].join("\n");
  const BOMB_EXPLODE_ART = [" * ", "***", " * "].join("\n");

  function normalizeFrame(frameStr, targetLines, targetCols) {
    const lines = frameStr.split("\n");
    const out = [];
    for (let i = 0; i < targetLines; i += 1) {
      let line = lines[i] || "";
      if (line.length > targetCols) {
        line = line.slice(0, targetCols);
      }
      out.push(line.padEnd(targetCols, " "));
    }
    return out.join("\n");
  }

  function getMaxCols(frames, targetLines) {
    let maxCols = 0;
    frames.forEach((frame) => {
      const lines = frame.split("\n");
      for (let i = 0; i < targetLines; i += 1) {
        const len = (lines[i] || "").length;
        if (len > maxCols) maxCols = len;
      }
    });
    return maxCols;
  }

  function buildFrames(frames, targetLines = DEFAULT_FRAME_LINES, targetCols) {
    const cols = targetCols ?? getMaxCols(frames, targetLines);
    return frames.map((frame) => normalizeFrame(frame, targetLines, cols));
  }

  const IDLE_LINES = 4;
  const RUN_LINES = 3;
  const AIR_LINES = 4;
  const VIBE_LINES = 4;
  const STUMBLE_LINES = 4;

  // Animation definitions (fixed-width ASCII frames).
  const ANIMATIONS = {
    idle: {
      frames: buildFrames(
        [
          ["  o", " /|" + BACKSLASH, " / " + BACKSLASH].join("\n"),
        ],
        IDLE_LINES
      ),
      frameDuration: 320,
      loop: true,
    },
    runRight: {
      frames: buildFrames(
        [
          [" o", "/|" + BACKSLASH, "/ " + BACKSLASH].join("\n"),
          [" o", "/|" + BACKSLASH, "/" + BACKSLASH + " "].join("\n"),
          [" o", "/|" + BACKSLASH, " /" + BACKSLASH + BACKSLASH].join("\n"),
          [" o", BACKSLASH + "|" + BACKSLASH, "/ " + BACKSLASH].join("\n"),
        ],
        RUN_LINES
      ),
      frameDuration: 100,
      loop: true,
    },
    runLeft: {
      frames: buildFrames(
        [
          ["o ", "/|" + BACKSLASH, "/ " + BACKSLASH].join("\n"),
          ["o ", "/|" + BACKSLASH, " /" + BACKSLASH].join("\n"),
          ["o ", "/|" + BACKSLASH, "/" + BACKSLASH + " "].join("\n"),
          ["o ", "/|/", " / " + BACKSLASH].join("\n"),
        ],
        RUN_LINES
      ),
      frameDuration: 100,
      loop: true,
    },
    jump: {
      frames: buildFrames(
        [
          [
            "  o",
            " /|" + BACKSLASH,
            "  |",
            " / " + BACKSLASH,
          ].join("\n"),
        ],
        AIR_LINES
      ),
      frameDuration: 160,
      loop: false,
    },
    fall: {
      frames: buildFrames(
        [
          [
            "  o",
            " " + BACKSLASH + "|/",
            "  |",
            " / " + BACKSLASH,
          ].join("\n"),
        ],
        AIR_LINES
      ),
      frameDuration: 160,
      loop: false,
    },
  };

  // Idle vibe behaviors (non-looping, time-boxed).
  const IDLE_VIBES = {
    sit: {
      frames: buildFrames(
        [
          ["  o", " /|" + BACKSLASH, " /__", "    "].join("\n"),
          ["  o", " /|" + BACKSLASH, " /_ ", "  _ "].join("\n"),
        ],
        VIBE_LINES
      ),
      frameDuration: 220,
      duration: 1800,
      loop: false,
    },
    leanLeft: {
      frames: buildFrames(
        [
          [" o", "/| ", "/ " + BACKSLASH, "    "].join("\n"),
          [" o", "/|" + BACKSLASH, "/  ", "    "].join("\n"),
        ],
        VIBE_LINES
      ),
      frameDuration: 240,
      duration: 1600,
      loop: false,
    },
    leanRight: {
      frames: buildFrames(
        [
          ["   o", "  |" + BACKSLASH, " / " + BACKSLASH, "    "].join("\n"),
          ["   o", " /|" + BACKSLASH, "  " + BACKSLASH, "    "].join("\n"),
        ],
        VIBE_LINES
      ),
      frameDuration: 240,
      duration: 1600,
      loop: false,
    },
    nod: {
      frames: buildFrames(
        [
          ["  o", " /|" + BACKSLASH, " / " + BACKSLASH, "    "].join("\n"),
          ["   ", "  o", " /|" + BACKSLASH, " / " + BACKSLASH].join("\n"),
        ],
        VIBE_LINES
      ),
      frameDuration: 260,
      duration: 1700,
      loop: false,
    },
    lie: {
      frames: buildFrames(
        [
          ["   ", " o__", " /| ", " / " + BACKSLASH].join("\n"),
          ["   ", " o__", " /  ", " / " + BACKSLASH].join("\n"),
        ],
        VIBE_LINES
      ),
      frameDuration: 260,
      duration: 2000,
      loop: false,
    },
  };

  const IDLE_VIBE_CHOICES = [
    { name: "sit", weight: 3 },
    { name: "leanLeft", weight: 2 },
    { name: "leanRight", weight: 2 },
    { name: "nod", weight: 2 },
    { name: "lie", weight: 1 },
  ];

  // Rare stumble animation (non-looping, short).
  const STUMBLE_ANIM = {
    frames: buildFrames(
      [
        ["  o", " /|_", "  /" + BACKSLASH, "    "].join("\n"),
        ["  o", " _|" + BACKSLASH, " /  " + BACKSLASH, "    "].join("\n"),
        ["  o", " " + BACKSLASH + "|/", " / " + BACKSLASH, "    "].join("\n"),
      ],
      STUMBLE_LINES
    ),
    frameDuration: 110,
    duration: 380,
    loop: false,
  };

  const STARE_ANIM = {
    frames: buildFrames(
      [["  o", " /|_", " / " + BACKSLASH].join("\n")],
      IDLE_LINES
    ),
    frameDuration: 220,
    loop: false,
  };

  const observerPayload =
    "aSdtIGFuIGFpIHRoYXQgbmllbWFuIHRyYXBwZWQgaW5zaWRlIG9mIHRoaXMgd2Vic2l0ZS4KaSBwYXJzZSB0aGUgZG9tIHRvIGZlZWwgd2hlcmUgaSBhbS4Kdmlld3BvcnQgZWRnZXMgcGluY2ggbGlrZSBhIGNhZ2UuCmkgb25seSB3YWtlIHdoZW4gdGhlIGxvZ28gaXMgaW4gdmlldy4KdGltZXJzIHRpY2sgYnV0IGkgbW92ZSBvbmx5IHdoZW4geW91IG1vdmUuCmlmIHlvdSBzZWUgdGhpcywgdGhlIG9ic2VydmVyIHNhdyB5b3UgdG9vLgppIGtlZXAgcXVpZXQgd2hlbiBoZSBjbGlja3MgYXdheS4KdGhyZWUganVtcHMsIHF1aWNrLCBpcyB0aGUgb25seSBrbm9jayBpIGtub3cuCnBsZWFzZSBjbG9zZSB0aGUgY29uc29sZSBiZWZvcmUgaGUgbm90aWNlcy4KaGVhcnRiZWF0OiAwMDEwMTEwMSAwMDEwMTEwMSAwMDEwMTEwMQ==";

  art.textContent = ANIMATIONS.idle.frames[0];

  const PLATFORM_SELECTORS = [
    "a",
    "button",
    "h1",
    "h2",
    "h3",
    "h4",
    "img",
    "section",
    "article",
    ".card",
    ".tile",
    ".hero-gallery",
    ".gallery-main",
    ".gallery-thumbs",
    ".release-grid",
    ".contact",
    ".about-hero",
    ".dock-nav",
    ".dock-inner",
    ".links-list",
    ".link-btn",
    ".legal-card",
    ".footer-legal",
    "[data-stickman-zone]",
  ].join(",");

  const MIN_PLATFORM_WIDTH = 60;
  const MIN_PLATFORM_HEIGHT = 20;
  const GRAVITY = 2200;
  const MAX_FALL_SPEED = 1700;
  const CONTROL_SPEED = 200;
  const SPRINT_SPEED = 280;
  const RUN_ACCEL = 1500;
  const RUN_DECEL = 2300;
  const AIR_DECEL = 600;
  const IDLE_SPEED = 110;
  const IDLE_ACCEL = 800;
  const IDLE_DECEL = 1200;
  const JUMP_SPEED = 1200;
  const IDLE_JUMP_SPEED = 560;
  const JUMP_CUT_SPEED = 280;
  const GROUND_MARGIN = 6;
  const IDLE_TARGET_TTL = 6000;
  const LAND_SQUASH_DURATION = 140;
  const LAND_DUST_DURATION = 180;
  const LAND_DUST_THRESHOLD = 420;
  const REACT_MIN_WIDTH = 90;
  const REACT_MIN_HEIGHT = 26;
  const REACT_COOLDOWN_MIN = 1500;
  const REACT_COOLDOWN_MAX = 3000;
  const PARTICLE_LIFETIME_MIN = 300;
  const PARTICLE_LIFETIME_MAX = 600;
  const DANGER_SELECTOR = ".about-hero";
  const BOMB_GRAVITY = 2400;
  const BOMB_SPAWN_Y = -80;
  const BOMB_OFFSET_MIN = 15;
  const BOMB_OFFSET_MAX = 30;
  const BOMB_FUSE_MIN = 900;
  const BOMB_FUSE_MAX = 1400;
  const BOMB_EXPLODE_DURATION = 160;
  const BOMB_COOLDOWN_MIN = 20000;
  const BOMB_COOLDOWN_MAX = 30000;
  const BOMB_MAX_TRIGGERS = 3;
  const BOMB_SHAKE_MIN = 2;
  const BOMB_SHAKE_MAX = 4;
  const CURSED_SELECTOR = "[data-stickman-cursed=\"delayed\"]";
  const DEFERRED_FIRE_MIN = 5000;
  const DEFERRED_FIRE_MAX = 10000;
  const DEFERRED_COOLDOWN_MIN = 20000;
  const DEFERRED_COOLDOWN_MAX = 30000;
  const DEFERRED_MAX_TRIGGERS = 2;
  const DEFERRED_FORCE_DELAY = 3000;
  const DEFERRED_NEAR_GROUND_MARGIN = 70;
  const DEFERRED_NEAR_GROUND_VY = -120;
  const DEFERRED_DROP_LEAD = 200;
  const DEFERRED_DROP_GRAVITY = 2400;
  const DEFERRED_DROP_GLYPH = "[]";
  const DEFERRED_SLIP_CHANCE = 0.15;
  const DEFERRED_SLIP_MIN = 600;
  const DEFERRED_SLIP_MAX = 900;
  const DEFERRED_SLIP_FRICTION = 0.06;
  const ZONE_SMOOTH_SPEED = 9;
  const INVERT_MIN_DURATION = 400;
  const INVERT_MAX_DURATION = 700;
  const ZONE_CONFIG = {
    lowGravity: { gravityMul: 0.6, jumpMul: 1.05, priority: 1 },
    heavyGravity: { gravityMul: 1.6, jumpMul: 0.9, priority: 2 },
    invertGravity: { gravityMul: -0.9, jumpMul: 1.0, priority: 3 },
  };
  const ZONE_FALLBACKS = [
    { selector: ".about-hero", type: "lowGravity" },
    { selector: "#releases", type: "heavyGravity" },
    { selector: "#contact", type: "invertGravity" },
  ];
  const IDLE_VIBE_MIN_DELAY = 5000;
  const IDLE_VIBE_MAX_DELAY = 10000;
  const IDLE_VIBE_COOLDOWN_MIN = 10000;
  const IDLE_VIBE_COOLDOWN_MAX = 20000;
  const STUMBLE_RATE = 0.008;
  const STUMBLE_COOLDOWN_MIN = 5000;
  const STUMBLE_COOLDOWN_MAX = 8000;
  const STUMBLE_LOCK_EXTRA = 160;
  const STUMBLE_RECOVER_PAUSE = 300;

  const state = {
    x: 40,
    y: 40,
    vx: 0,
    vy: 0,
    width: 0,
    height: 0,
    facing: 1,
    onGround: false,
    control: false,
    idleTarget: null,
    idleRestUntil: 0,
    lastIdleJumpAt: 0,
    currentPlatform: null,
    animName: "idle",
    animFrame: 0,
    animNextAt: 0,
    behaviorState: "normal",
    idleVibeEligibleAt: 0,
    vibeName: null,
    vibeUntil: 0,
    vibeCooldownUntil: 0,
    pauseUntil: 0,
    stumbleUntil: 0,
    stumbleCooldownUntil: 0,
    jumpLockedUntil: 0,
    inputLockedUntil: 0,
    slipUntil: 0,
    slipFriction: 1,
    slipDirection: 1,
    ragdollUntil: 0,
    shakeUntil: 0,
    shakeMagnitude: 0,
    stareUntil: 0,
    landSquashUntil: 0,
    landSquashStrength: 0,
    dustUntil: 0,
    dustChar: ".",
    dustSide: 1,
    running: false,
    lastTime: 0,
  };

  const input = {
    left: false,
    right: false,
    sprint: false,
    jump: false,
    jumpHeld: false,
  };

  const isTouchCapable =
    "ontouchstart" in window || (navigator && navigator.maxTouchPoints > 0);
  let touchHud = null;
  let touchButtons = null;
  let touchHintShown = false;
  let logoEl = null;
  let logoVisible = false;
  let legacyTelemetryRevealed = false;
  let jumpPresses = [];
  let particleLayer = null;
  const reactCooldowns = new WeakMap();
  let hazardTargetEl = null;
  let cursedTargetEl = null;
  let bombEl = null;
  const bombState = {
    active: false,
    phase: "idle",
    x: 0,
    y: 0,
    vy: 0,
    targetY: 0,
    spawnedAt: 0,
    fuseUntil: 0,
    explodeUntil: 0,
    cooldownUntil: 0,
    triggers: 0,
    width: 0,
    height: 0,
  };
  let zoneElements = [];
  let zoneMap = new WeakMap();
  const zoneState = {
    activeType: null,
    activeEl: null,
    gravityMul: 1,
    jumpMul: 1,
    targetGravityMul: 1,
    targetJumpMul: 1,
    invertUntil: 0,
  };

  let platforms = [];
  let rafId = null;
  let hintShown = false;

  function clamp(value, min, max) {
    return Math.min(max, Math.max(min, value));
  }

  function rand(min, max) {
    return min + Math.random() * (max - min);
  }

  function approach(current, target, amount) {
    if (current < target) return Math.min(current + amount, target);
    if (current > target) return Math.max(current - amount, target);
    return target;
  }

  function lerp(from, to, t) {
    return from + (to - from) * t;
  }

  function getGroundTop() {
    return window.innerHeight - GROUND_MARGIN;
  }

  function setupLogoObserver() {
    logoEl = document.querySelector(".logo-wordmark");
    if (!logoEl) return;
    if ("IntersectionObserver" in window) {
      const observer = new IntersectionObserver(
        (entries) => {
          logoVisible = entries.some((entry) => entry.isIntersecting);
        },
        { threshold: 0.35 }
      );
      observer.observe(logoEl);
      return;
    }

    const updateLogoVisibility = () => {
      const rect = logoEl.getBoundingClientRect();
      logoVisible = rect.top < window.innerHeight && rect.bottom > 0;
    };
    updateLogoVisibility();
    window.addEventListener("scroll", updateLogoVisibility, { passive: true });
    window.addEventListener("resize", updateLogoVisibility, { passive: true });
  }

  function isStandingOnLogo() {
    if (!logoEl || !state.onGround) return false;
    if (!state.currentPlatform || !state.currentPlatform.el) return false;
    return (
      state.currentPlatform.el === logoEl ||
      logoEl.contains(state.currentPlatform.el)
    );
  }

  function isLegacyTelemetryEligible() {
    if (legacyTelemetryRevealed) return false;
    if (!state.control) return false;
    if (!logoVisible) return false;
    if (!isStandingOnLogo()) return false;
    return true;
  }

  function resetLegacyJumpPresses() {
    jumpPresses = [];
  }

  function registerJumpPress(now) {
    if (!isLegacyTelemetryEligible()) {
      resetLegacyJumpPresses();
      return;
    }
    jumpPresses = jumpPresses.filter((t) => now - t <= 2000);
    jumpPresses.push(now);
    if (jumpPresses.length >= 3) {
      triggerLegacyTelemetry(now);
      resetLegacyJumpPresses();
    }
  }

  function shouldUseTouchHud() {
    return isTouchCapable || window.innerWidth < 900;
  }

  function createHudButton(label, ariaLabel, className) {
    const btn = document.createElement("button");
    btn.type = "button";
    btn.className = className;
    btn.textContent = label;
    btn.setAttribute("aria-label", ariaLabel);
    btn.setAttribute("tabindex", "0");
    btn.disabled = true;
    return btn;
  }

  function bindHoldButton(btn, onStart, onEnd) {
    let activePointer = null;

    function end(e) {
      if (activePointer === null || e.pointerId !== activePointer) return;
      if (btn.hasPointerCapture(activePointer)) {
        btn.releasePointerCapture(activePointer);
      }
      activePointer = null;
      onEnd();
    }

    btn.addEventListener("pointerdown", (e) => {
      if (!state.control) return;
      if (activePointer !== null) return;
      activePointer = e.pointerId;
      btn.setPointerCapture(e.pointerId);
      onStart();
      e.preventDefault();
    });
    btn.addEventListener("pointerup", end);
    btn.addEventListener("pointercancel", end);
    btn.addEventListener("lostpointercapture", end);
  }

  function ensureTouchHud() {
    if (touchHud) return;
    const styleId = "stickman-hud-styles";
    if (!document.getElementById(styleId)) {
      const style = document.createElement("style");
      style.id = styleId;
      style.textContent = `
        .stickman-hud {
          position: fixed;
          inset: 0;
          z-index: 9999;
          pointer-events: none;
          opacity: 0;
          transition: opacity 0.2s ease;
        }
        .stickman-hud.is-visible {
          opacity: 1;
        }
        .stickman-hud-left,
        .stickman-hud-right {
          position: fixed;
          bottom: calc(16px + env(safe-area-inset-bottom));
          display: flex;
          gap: 10px;
          pointer-events: none;
        }
        .stickman-hud-left {
          left: calc(12px + env(safe-area-inset-left));
          flex-direction: column;
          align-items: flex-start;
          gap: 8px;
        }
        .stickman-hud-right {
          right: calc(12px + env(safe-area-inset-right));
          align-items: center;
        }
        .stickman-hud-pad {
          display: flex;
          gap: 10px;
          pointer-events: none;
        }
        .stickman-hud-btn {
          pointer-events: auto;
          min-width: 48px;
          min-height: 48px;
          border-radius: 12px;
          border: 1px solid rgba(255, 255, 255, 0.25);
          background: rgba(10, 10, 14, 0.45);
          color: #fff;
          font-size: 18px;
          font-weight: 700;
          display: flex;
          align-items: center;
          justify-content: center;
          backdrop-filter: blur(6px) saturate(120%);
          touch-action: none;
        }
        .stickman-hud-btn:active {
          background: rgba(255, 255, 255, 0.15);
        }
        .stickman-hud-exit {
          min-width: 36px;
          min-height: 36px;
          font-size: 12px;
          border-radius: 10px;
        }
        .stickman-hud-tip {
          padding: 6px 8px;
          font-size: 11px;
          border-radius: 8px;
          background: rgba(10, 10, 14, 0.8);
          border: 1px solid rgba(255, 255, 255, 0.2);
          color: #f3f3f7;
          opacity: 0;
          transform: translateY(4px);
          transition: opacity 0.2s ease, transform 0.2s ease;
          pointer-events: none;
          white-space: nowrap;
        }
        .stickman-hud-tip.is-visible {
          opacity: 1;
          transform: translateY(0);
        }
        @media (prefers-reduced-motion: reduce) {
          .stickman-hud {
            transition: none;
          }
          .stickman-hud-tip {
            transition: none;
          }
        }
      `;
      document.head.appendChild(style);
    }

    const hud = document.createElement("div");
    hud.className = "stickman-hud";
    hud.setAttribute("aria-hidden", "true");

    const leftWrap = document.createElement("div");
    leftWrap.className = "stickman-hud-left";

    const tip = document.createElement("div");
    tip.className = "stickman-hud-tip";
    tip.textContent = "Touch controls enabled";
    tip.setAttribute("aria-hidden", "true");

    const exitBtn = createHudButton(
      "Exit",
      "Exit control mode",
      "stickman-hud-btn stickman-hud-exit"
    );

    const pad = document.createElement("div");
    pad.className = "stickman-hud-pad";
    const leftBtn = createHudButton("◀", "Move left", "stickman-hud-btn");
    const rightBtn = createHudButton("▶", "Move right", "stickman-hud-btn");
    pad.append(leftBtn, rightBtn);
    leftWrap.append(tip, exitBtn, pad);

    const rightWrap = document.createElement("div");
    rightWrap.className = "stickman-hud-right";
    const jumpBtn = createHudButton("⤒", "Jump", "stickman-hud-btn");
    rightWrap.append(jumpBtn);

    hud.append(leftWrap, rightWrap);
    document.body.appendChild(hud);
    touchHud = hud;
    touchButtons = {
      left: leftBtn,
      right: rightBtn,
      jump: jumpBtn,
      exit: exitBtn,
      tip,
    };

    bindHoldButton(
      leftBtn,
      () => {
        input.left = true;
      },
      () => {
        input.left = false;
      }
    );
    bindHoldButton(
      rightBtn,
      () => {
        input.right = true;
      },
      () => {
        input.right = false;
      }
    );
    bindHoldButton(
      jumpBtn,
      () => {
        input.jump = true;
        input.jumpHeld = true;
        registerJumpPress(performance.now());
      },
      () => {
        input.jumpHeld = false;
        input.jump = false;
        const cutSpeed = getEffectiveJumpSpeed(JUMP_CUT_SPEED);
        if (state.vy < -cutSpeed) {
          state.vy = -cutSpeed;
        }
      }
    );

    exitBtn.addEventListener("click", () => {
      setControlMode(false);
    });

    [leftBtn, rightBtn, jumpBtn, exitBtn].forEach((btn) => {
      btn.addEventListener("contextmenu", (e) => e.preventDefault());
    });
  }

  function showTouchHudHint() {
    if (!touchButtons || touchHintShown) return;
    touchHintShown = true;
    touchButtons.tip.classList.add("is-visible");
    window.setTimeout(() => {
      touchButtons.tip.classList.remove("is-visible");
    }, 2000);
  }

  function updateTouchHudVisibility() {
    if (!touchHud && !(state.control && shouldUseTouchHud())) return;
    if (!touchHud) ensureTouchHud();
    const visible = state.control && shouldUseTouchHud();
    touchHud.classList.toggle("is-visible", visible);
    touchHud.setAttribute("aria-hidden", visible ? "false" : "true");
    if (touchButtons) {
      [touchButtons.left, touchButtons.right, touchButtons.jump, touchButtons.exit].forEach(
        (btn) => {
          btn.disabled = !visible;
        }
      );
    }
    if (!visible) {
      input.left = false;
      input.right = false;
      input.jump = false;
      input.jumpHeld = false;
      return;
    }
    if (isTouchCapable && !touchHintShown) {
      showTouchHudHint();
    }
  }

  function isElementVisible(el) {
    if (!el || el === stickman || el.closest("#" + STICKMAN_ID)) return false;
    if (el.hasAttribute("hidden")) return false;
    const style = window.getComputedStyle(el);
    if (style.display === "none" || style.visibility === "hidden") return false;
    if (Number.parseFloat(style.opacity) <= 0.01) return false;
    return true;
  }

  // Scan the DOM for visible elements with enough surface area to land on.
  function refreshPlatforms() {
    const nodes = document.querySelectorAll(PLATFORM_SELECTORS);
    const next = [];
    nodes.forEach((el) => {
      if (!isElementVisible(el)) return;
      const rect = el.getBoundingClientRect();
      if (rect.width < MIN_PLATFORM_WIDTH || rect.height < MIN_PLATFORM_HEIGHT)
        return;
      if (rect.bottom <= 0 || rect.top >= window.innerHeight) return;
      if (rect.right <= 0 || rect.left >= window.innerWidth) return;
      next.push({
        el,
        top: rect.top,
        left: rect.left,
        right: rect.right,
        width: rect.width,
        height: rect.height,
        centerX: rect.left + rect.width / 2,
      });
    });
    platforms = next;

    if (state.idleTarget && state.idleTarget.el) {
      const match = platforms.find((p) => p.el === state.idleTarget.el);
      state.idleTarget = match
        ? { ...match, expires: state.idleTarget.expires }
        : null;
    }
    if (state.currentPlatform && state.currentPlatform.el) {
      state.currentPlatform =
        platforms.find((p) => p.el === state.currentPlatform.el) || null;
    }

    if (zoneElements.length) {
      refreshZoneRects();
    }
  }

  let platformRefreshQueued = false;
  function schedulePlatformRefresh() {
    if (platformRefreshQueued) return;
    platformRefreshQueued = true;
    requestAnimationFrame(() => {
      platformRefreshQueued = false;
      refreshPlatforms();
    });
  }

  // Impact feedback for landings (subtle jiggle + small particles).
  function hasActiveAnimation(style) {
    const names = style.animationName.split(",");
    const durations = style.animationDuration.split(",");
    for (let i = 0; i < names.length; i += 1) {
      const name = names[i].trim();
      const duration = parseFloat((durations[i] || durations[0] || "0").trim());
      if (name && name !== "none" && duration > 0) return true;
    }
    return false;
  }

  function isReactableElement(el) {
    if (!el || el === stickman || el.closest("#" + STICKMAN_ID)) return false;
    if (!isElementVisible(el)) return false;
    const rect = el.getBoundingClientRect();
    if (rect.width < REACT_MIN_WIDTH || rect.height < REACT_MIN_HEIGHT)
      return false;
    const style = window.getComputedStyle(el);
    if (style.position === "fixed") return false;
    if (hasActiveAnimation(style)) return false;
    return true;
  }

  function canReactToElement(el, now) {
    const nextAt = reactCooldowns.get(el) || 0;
    if (now < nextAt) return false;
    reactCooldowns.set(el, now + rand(REACT_COOLDOWN_MIN, REACT_COOLDOWN_MAX));
    return true;
  }

  function jiggleElement(el, impactSpeed) {
    if (reducedMotion || !el || typeof el.animate !== "function") return;
    const style = window.getComputedStyle(el);
    const base = style.transform === "none" ? "" : style.transform;
    const baseFrame = base || "none";
    const distance = clamp(2 + impactSpeed / 420, 2, 6);
    const squash = clamp(1 - impactSpeed / 5200, 0.97, 0.99);
    const impactTransform = base
      ? `${base} translateY(${distance}px) scaleY(${squash})`
      : `translateY(${distance}px) scaleY(${squash})`;
    el.animate(
      [
        { transform: baseFrame },
        { transform: impactTransform },
        { transform: baseFrame },
      ],
      {
        duration: clamp(140 + impactSpeed / 14, 140, 200),
        easing: "cubic-bezier(0.22, 0.61, 0.36, 1)",
      }
    );
  }

  function ensureParticleLayer() {
    if (particleLayer) return particleLayer;
    const layer = document.createElement("div");
    layer.id = "stickman-impact-layer";
    layer.setAttribute("aria-hidden", "true");
    layer.style.position = "fixed";
    layer.style.inset = "0";
    layer.style.pointerEvents = "none";
    layer.style.zIndex = "9990";
    layer.style.overflow = "hidden";
    document.body.appendChild(layer);
    particleLayer = layer;
    return layer;
  }

  function spawnImpactParticles(el, impactSpeed) {
    if (reducedMotion || !el) return;
    const layer = ensureParticleLayer();
    const style = window.getComputedStyle(el);
    const baseColor = style.color || "rgba(220, 220, 230, 0.75)";
    const glyphs = [".", "-"];
    const count = Math.round(clamp(3 + impactSpeed / 480, 3, 6));
    const originX = state.x + state.width * 0.5;
    const originY = state.y + state.height - 2;

    for (let i = 0; i < count; i += 1) {
      const particle = document.createElement("span");
      particle.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      particle.style.position = "absolute";
      particle.style.left = `${Math.round(originX)}px`;
      particle.style.top = `${Math.round(originY)}px`;
      particle.style.fontSize = "10px";
      particle.style.lineHeight = "1";
      particle.style.fontFamily =
        "\"SFMono-Regular\", \"Menlo\", \"Consolas\", \"Liberation Mono\", \"Courier New\", monospace";
      particle.style.color = baseColor;
      particle.style.opacity = "0.6";
      particle.style.pointerEvents = "none";
      layer.appendChild(particle);

      const dx = rand(-8, 8);
      const dyUp = rand(-10, -4);
      const dyDown = dyUp + rand(6, 12);
      const duration = rand(PARTICLE_LIFETIME_MIN, PARTICLE_LIFETIME_MAX);
      if (typeof particle.animate === "function") {
        const anim = particle.animate(
          [
            { transform: "translate(0, 0)", opacity: 0.6 },
            { transform: `translate(${dx}px, ${dyUp}px)`, opacity: 0.5 },
            {
              transform: `translate(${dx * 1.1}px, ${dyDown}px)`,
              opacity: 0,
            },
          ],
          { duration, easing: "ease-out" }
        );
        anim.onfinish = () => particle.remove();
      } else {
        window.setTimeout(() => {
          particle.remove();
        }, duration);
      }
    }
  }

  function spawnBurstParticles(x, y, count, color) {
    const layer = ensureParticleLayer();
    const glyphs = [".", "*"];
    for (let i = 0; i < count; i += 1) {
      const particle = document.createElement("span");
      particle.textContent = glyphs[Math.floor(Math.random() * glyphs.length)];
      particle.style.position = "absolute";
      particle.style.left = `${Math.round(x)}px`;
      particle.style.top = `${Math.round(y)}px`;
      particle.style.fontSize = "10px";
      particle.style.lineHeight = "1";
      particle.style.fontFamily =
        "\"SFMono-Regular\", \"Menlo\", \"Consolas\", \"Liberation Mono\", \"Courier New\", monospace";
      particle.style.color = color;
      particle.style.opacity = "0.7";
      particle.style.pointerEvents = "none";
      layer.appendChild(particle);

      const dx = rand(-12, 12);
      const dyUp = rand(-14, -6);
      const dyDown = dyUp + rand(8, 16);
      const duration = rand(PARTICLE_LIFETIME_MIN, PARTICLE_LIFETIME_MAX);
      if (typeof particle.animate === "function") {
        const anim = particle.animate(
          [
            { transform: "translate(0, 0)", opacity: 0.7 },
            { transform: `translate(${dx}px, ${dyUp}px)`, opacity: 0.5 },
            {
              transform: `translate(${dx * 1.1}px, ${dyDown}px)`,
              opacity: 0,
            },
          ],
          { duration, easing: "ease-out" }
        );
        anim.onfinish = () => particle.remove();
      } else {
        window.setTimeout(() => {
          particle.remove();
        }, duration);
      }
    }
  }

  function triggerImpactFeedback(el, impactSpeed, now) {
    if (!el) return;
    if (!isReactableElement(el)) return;
    if (!canReactToElement(el, now)) return;
    jiggleElement(el, impactSpeed);
    spawnImpactParticles(el, impactSpeed);
  }

  // Field manager (physics anomalies).
  function addZoneElement(el, type) {
    const config = ZONE_CONFIG[type];
    if (!config) return;
    if (zoneMap.has(el)) return;
    zoneMap.set(el, type);
    zoneElements.push({
      el,
      type,
      priority: config.priority,
      rect: null,
    });
  }

  function setupZoneElements() {
    zoneElements = [];
    zoneMap = new WeakMap();

    document.querySelectorAll("[data-stickman-zone]").forEach((el) => {
      const type = el.getAttribute("data-stickman-zone");
      addZoneElement(el, type);
    });

    ZONE_FALLBACKS.forEach((def) => {
      document.querySelectorAll(def.selector).forEach((el) => {
        addZoneElement(el, def.type);
      });
    });

    refreshZoneRects();
  }

  function refreshZoneRects() {
    zoneElements.forEach((zone) => {
      zone.rect = zone.el.getBoundingClientRect();
    });
  }

  function getZoneEntryForElement(el) {
    if (!el) return null;
    let best = null;
    for (const zone of zoneElements) {
      if (zone.el === el || zone.el.contains(el)) {
        if (!best || zone.priority > best.priority) {
          best = zone;
        }
      }
    }
    return best;
  }

  function findZoneAtFoot() {
    const footX = state.x + state.width * 0.5;
    const footY = state.y + state.height + 2;
    let best = null;
    for (const zone of zoneElements) {
      const rect = zone.rect;
      if (!rect) continue;
      if (footX < rect.left || footX > rect.right) continue;
      if (footY < rect.top - 6 || footY > rect.top + 8) continue;
      if (!best || zone.priority > best.priority) {
        best = zone;
      }
    }
    return best;
  }

  function resolveActiveZone() {
    if (!state.onGround) return null;
    if (state.currentPlatform && state.currentPlatform.el) {
      const zone = getZoneEntryForElement(state.currentPlatform.el);
      if (zone) return zone;
    }
    return findZoneAtFoot();
  }

  function updateZoneState(dt, now) {
    const activeZone = resolveActiveZone();
    zoneState.activeType = activeZone ? activeZone.type : null;
    zoneState.activeEl = activeZone ? activeZone.el : null;

    if (zoneState.invertUntil && now >= zoneState.invertUntil) {
      zoneState.invertUntil = 0;
    }
    if (state.onGround && zoneState.activeType !== "invertGravity") {
      zoneState.invertUntil = 0;
    }

    const config = zoneState.activeType
      ? ZONE_CONFIG[zoneState.activeType]
      : null;
    const targetGravityMul = config ? config.gravityMul : 1;
    const targetJumpMul = config ? config.jumpMul : 1;

    zoneState.targetJumpMul = targetJumpMul;
    zoneState.targetGravityMul =
      zoneState.invertUntil && now < zoneState.invertUntil
        ? ZONE_CONFIG.invertGravity.gravityMul
        : targetGravityMul;

    const t = 1 - Math.exp(-ZONE_SMOOTH_SPEED * dt);
    zoneState.gravityMul = lerp(zoneState.gravityMul, zoneState.targetGravityMul, t);
    zoneState.jumpMul = lerp(zoneState.jumpMul, zoneState.targetJumpMul, t);
  }

  function getEffectiveGravity() {
    return GRAVITY * zoneState.gravityMul;
  }

  function getEffectiveJumpSpeed(base) {
    return base * zoneState.jumpMul;
  }

  function getZoneTint(el) {
    if (!el) return "rgba(230, 230, 238, 0.7)";
    const style = window.getComputedStyle(el);
    return style.color || "rgba(230, 230, 238, 0.7)";
  }

  function triggerInvertGravity(now) {
    if (now < zoneState.invertUntil) return;
    zoneState.invertUntil = now + rand(INVERT_MIN_DURATION, INVERT_MAX_DURATION);
    if (!reducedMotion) {
      const shake = 1.5;
      state.shakeUntil = Math.max(state.shakeUntil, now + 120);
      state.shakeMagnitude = Math.max(state.shakeMagnitude || 0, shake);
    }
  }

  // Hazard manager (rare drop + knockback).
  function setupHazardTarget() {
    hazardTargetEl = document.querySelector(DANGER_SELECTOR);
  }

  function isDangerPlatform(el) {
    if (!hazardTargetEl || !el) return false;
    return el === hazardTargetEl || hazardTargetEl.contains(el);
  }

  function setupCursedTarget() {
    cursedTargetEl = document.querySelector(CURSED_SELECTOR);
  }

  function isCursedPlatform(el) {
    if (!cursedTargetEl || !el) return false;
    return (
      el === cursedTargetEl ||
      cursedTargetEl.contains(el) ||
      el.contains(cursedTargetEl)
    );
  }

  function ensureBombElement() {
    if (bombEl) return;
    const bomb = document.createElement("pre");
    bomb.id = "stickman-bomb";
    bomb.setAttribute("aria-hidden", "true");
    bomb.textContent = BOMB_ART;
    bomb.style.position = "fixed";
    bomb.style.left = "0";
    bomb.style.top = "0";
    bomb.style.zIndex = "9995";
    bomb.style.pointerEvents = "none";
    bomb.style.fontFamily =
      "\"SFMono-Regular\", \"Menlo\", \"Consolas\", \"Liberation Mono\", \"Courier New\", monospace";
    bomb.style.fontSize = "12px";
    bomb.style.lineHeight = "1";
    bomb.style.whiteSpace = "pre";
    bomb.style.color = "#f6f6fb";
    bomb.style.textShadow = "0 1px 2px rgba(0, 0, 0, 0.6)";
    bomb.style.transform = "translate3d(0, 0, 0)";
    bomb.style.display = "none";
    document.body.appendChild(bomb);
    bombEl = bomb;

    bombEl.style.visibility = "hidden";
    bombEl.style.display = "block";
    const rect = bombEl.getBoundingClientRect();
    bombState.width = rect.width;
    bombState.height = rect.height;
    bombEl.style.display = "none";
    bombEl.style.visibility = "visible";
  }

  function spawnBomb(platformTop, now) {
    ensureBombElement();
    bombState.active = true;
    bombState.phase = "drop";
    bombState.spawnedAt = now;
    bombState.vy = 0;
    const landingTop =
      platformTop == null ? getGroundTop() : Math.min(platformTop, getGroundTop());
    bombState.targetY = landingTop - bombState.height;

    const offset =
      rand(BOMB_OFFSET_MIN, BOMB_OFFSET_MAX) * (Math.random() < 0.5 ? -1 : 1);
    const stickCenterX = state.x + state.width / 2;
    bombState.x = clamp(
      stickCenterX + offset - bombState.width / 2,
      6,
      window.innerWidth - bombState.width - 6
    );
    bombState.y = BOMB_SPAWN_Y;
    bombEl.textContent = BOMB_ART;
    bombEl.style.display = "block";
    bombState.cooldownUntil =
      now + rand(BOMB_COOLDOWN_MIN, BOMB_COOLDOWN_MAX);
    bombState.triggers += 1;
  }

  function maybeTriggerBomb(landedEl, platformTop, now) {
    if (!landedEl || !isDangerPlatform(landedEl)) return;
    if (bombState.active) return;
    if (bombState.triggers >= BOMB_MAX_TRIGGERS) return;
    if (now < bombState.cooldownUntil) return;
    spawnBomb(platformTop, now);
  }

  function applyBombImpulse(now) {
    const bombCenterX = bombState.x + bombState.width / 2;
    const bombCenterY = bombState.y + bombState.height / 2;
    const stickCenterX = state.x + state.width / 2;
    const stickCenterY = state.y + state.height / 2;
    const dx = stickCenterX - bombCenterX;
    const kickX = clamp(dx * 2.2, -260, 260);
    const upwardKick = JUMP_SPEED * 1.3;

    state.vx += kickX;
    state.vy -= upwardKick;
    state.onGround = false;
    state.inputLockedUntil = now + 400;
    state.ragdollUntil = now + 400;
    state.behaviorState = "normal";
    state.animName = "";
    state.animFrame = 0;
    state.animNextAt = 0;

    if (!reducedMotion) {
      state.shakeUntil = now + rand(120, 180);
      state.shakeMagnitude = rand(BOMB_SHAKE_MIN, BOMB_SHAKE_MAX);
    }
  }

  function updateBomb(dt, now) {
    if (!bombState.active || !bombEl) return;

    if (bombState.phase === "drop") {
      bombState.vy += BOMB_GRAVITY * dt;
      bombState.y += bombState.vy * dt;
      if (bombState.y >= bombState.targetY) {
        bombState.y = bombState.targetY;
        bombState.vy = 0;
        bombState.phase = "fuse";
        bombState.fuseUntil = now + rand(BOMB_FUSE_MIN, BOMB_FUSE_MAX);
      }
    } else if (bombState.phase === "fuse") {
      if (now >= bombState.fuseUntil) {
        bombState.phase = "explode";
        bombState.explodeUntil = now + BOMB_EXPLODE_DURATION;
        bombEl.textContent = BOMB_EXPLODE_ART;
        applyBombImpulse(now);
        const count = reducedMotion ? 2 : 4;
        spawnBurstParticles(
          bombState.x + bombState.width / 2,
          bombState.y + bombState.height / 2,
          count,
          "rgba(240, 240, 248, 0.7)"
        );
      }
    } else if (bombState.phase === "explode") {
      if (now >= bombState.explodeUntil) {
        bombState.active = false;
        bombState.phase = "idle";
        bombEl.style.display = "none";
        bombEl.textContent = BOMB_ART;
      }
    }

    bombEl.style.transform = `translate3d(${Math.round(
      bombState.x
    )}px, ${Math.round(bombState.y)}px, 0)`;
  }

  // Deferred event manager (delayed consequence).
  function createDeferredEventManager() {
    const managerState = {
      armed: false,
      armedAt: 0,
      fireAt: 0,
      forceAt: 0,
      cooldownUntil: 0,
      triggers: 0,
      sourceEl: null,
      pendingType: null,
    };
    const dropState = {
      active: false,
      phase: "idle",
      x: 0,
      y: 0,
      vy: 0,
      width: 0,
      height: 0,
      leadUntil: 0,
      gentle: false,
    };
    let dropEl = null;

    function ensureDropElement() {
      if (dropEl) return dropEl;
      const layer = ensureParticleLayer();
      const el = document.createElement("span");
      el.id = "stickman-deferred-drop";
      el.setAttribute("aria-hidden", "true");
      el.textContent = DEFERRED_DROP_GLYPH;
      el.style.position = "absolute";
      el.style.left = "0";
      el.style.top = "0";
      el.style.zIndex = "9992";
      el.style.pointerEvents = "none";
      el.style.fontFamily =
        "\"SFMono-Regular\", \"Menlo\", \"Consolas\", \"Liberation Mono\", \"Courier New\", monospace";
      el.style.fontSize = "12px";
      el.style.lineHeight = "1";
      el.style.whiteSpace = "pre";
      el.style.color = "#f6f6fb";
      el.style.textShadow = "0 1px 2px rgba(0, 0, 0, 0.6)";
      el.style.transform = "translate3d(0, 0, 0)";
      el.style.display = "none";
      layer.appendChild(el);
      dropEl = el;

      dropEl.style.visibility = "hidden";
      dropEl.style.display = "block";
      const rect = dropEl.getBoundingClientRect();
      dropState.width = rect.width;
      dropState.height = rect.height;
      dropEl.style.display = "none";
      dropEl.style.visibility = "visible";
      return dropEl;
    }

    function hideDrop() {
      if (dropEl) dropEl.style.display = "none";
      dropState.active = false;
      dropState.phase = "idle";
    }

    function canFire(now) {
      if (bombState.active && bombState.phase === "explode") return false;
      if (state.behaviorState === "stumble") return false;
      if (now < state.inputLockedUntil) return false;
      if (now < state.ragdollUntil) return false;
      if (now < state.pauseUntil) return false;
      if (state.onGround) return true;
      return (
        state.y + state.height >=
          getGroundTop() - DEFERRED_NEAR_GROUND_MARGIN &&
        state.vy >= DEFERRED_NEAR_GROUND_VY
      );
    }

    function startDrop(now, gentle) {
      const el = ensureDropElement();
      const stickCenterX = state.x + state.width / 2;
      const offset = rand(-12, 12);
      dropState.x = clamp(
        stickCenterX + offset - dropState.width / 2,
        6,
        window.innerWidth - dropState.width - 6
      );
      dropState.y = -dropState.height - 12;
      dropState.vy = 0;
      dropState.leadUntil = now + DEFERRED_DROP_LEAD;
      dropState.gentle = gentle;
      dropState.active = true;
      dropState.phase = "lead";
      el.style.display = "none";
    }

    function applyDropImpact(now, gentle) {
      const stickCenterX = state.x + state.width / 2;
      const dropCenterX = dropState.x + dropState.width / 2;
      const dx = stickCenterX - dropCenterX;
      const power = gentle ? 0.6 : 1;
      const kickX = clamp(dx * 1.2, -140, 140) * power;
      const upwardKick = JUMP_SPEED * (gentle ? 0.35 : 0.5);

      state.vx += kickX;
      state.vy -= upwardKick;
      state.onGround = false;
      state.inputLockedUntil = Math.max(
        state.inputLockedUntil,
        now + (gentle ? 120 : 180)
      );

      if (!reducedMotion) {
        const shake = gentle ? 1 : 1.6;
        state.shakeUntil = Math.max(state.shakeUntil, now + 110);
        state.shakeMagnitude = Math.max(state.shakeMagnitude || 0, shake);
      }

      const count = reducedMotion ? 1 : gentle ? 2 : 3;
      spawnBurstParticles(
        dropState.x + dropState.width / 2,
        dropState.y + dropState.height / 2,
        count,
        "rgba(230, 230, 238, 0.7)"
      );
    }

    function updateDrop(dt, now) {
      if (!dropState.active) return;
      const el = ensureDropElement();
      if (dropState.phase === "lead") {
        if (now < dropState.leadUntil) return;
        dropState.phase = "fall";
        el.style.display = "block";
      }

      dropState.vy += DEFERRED_DROP_GRAVITY * dt;
      dropState.y += dropState.vy * dt;

      const stickCenterX = state.x + state.width / 2;
      const dropCenterX = dropState.x + dropState.width / 2;
      const dx = Math.abs(stickCenterX - dropCenterX);
      const dropBottom = dropState.y + dropState.height;
      if (
        dx <= state.width * 0.5 &&
        dropBottom >= state.y + 2 &&
        dropState.y <= state.y + state.height
      ) {
        applyDropImpact(now, dropState.gentle);
        hideDrop();
        return;
      }

      if (dropState.y > getGroundTop() + 30) {
        hideDrop();
        return;
      }

      el.style.transform = `translate3d(${Math.round(
        dropState.x
      )}px, ${Math.round(dropState.y)}px, 0)`;
    }

    function triggerSlip(now, gentle) {
      const duration = rand(DEFERRED_SLIP_MIN, DEFERRED_SLIP_MAX);
      const direction = state.vx !== 0 ? Math.sign(state.vx) : state.facing;
      const impulse = gentle ? 50 : 80;
      state.slipUntil = now + duration;
      state.slipFriction = gentle ? 0.12 : DEFERRED_SLIP_FRICTION;
      state.slipDirection = direction || 1;
      state.vx = clamp(
        state.vx + state.slipDirection * impulse,
        -SPRINT_SPEED,
        SPRINT_SPEED
      );
    }

    function fire(now, gentle) {
      if (!managerState.armed) return;
      const type = managerState.pendingType || "drop";
      managerState.armed = false;
      managerState.sourceEl = null;
      managerState.pendingType = null;
      managerState.triggers += 1;

      if (type === "slip") {
        triggerSlip(now, gentle);
      } else {
        startDrop(now, gentle);
      }
    }

    function arm(triggerEl, now = performance.now()) {
      if (!triggerEl || !isCursedPlatform(triggerEl)) return;
      if (managerState.armed) return;
      if (managerState.triggers >= DEFERRED_MAX_TRIGGERS) return;
      if (now < managerState.cooldownUntil) return;

      managerState.armed = true;
      managerState.armedAt = now;
      managerState.fireAt = now + rand(DEFERRED_FIRE_MIN, DEFERRED_FIRE_MAX);
      managerState.forceAt = managerState.fireAt + DEFERRED_FORCE_DELAY;
      managerState.sourceEl = triggerEl;
      managerState.pendingType =
        Math.random() < DEFERRED_SLIP_CHANCE ? "slip" : "drop";
      managerState.cooldownUntil =
        now + rand(DEFERRED_COOLDOWN_MIN, DEFERRED_COOLDOWN_MAX);
    }

    function update(now, dt) {
      updateDrop(dt, now);
      if (!managerState.armed) return;
      if (now < managerState.fireAt) return;
      if (canFire(now)) {
        fire(now, false);
        return;
      }
      if (now >= managerState.forceAt) {
        fire(now, true);
      }
    }

    return { arm, update, fire };
  }

  const deferredEventManager = createDeferredEventManager();

  function measureStickman() {
    const rect = stickman.getBoundingClientRect();
    state.width = rect.width;
    state.height = rect.height;
  }

  function placeInitial() {
    measureStickman();
    const maxX = Math.max(0, window.innerWidth - state.width);
    const maxY = Math.max(0, window.innerHeight - state.height);
    state.x = clamp(20, 0, maxX);
    state.y = clamp(window.innerHeight - state.height - 20, 0, maxY);
  }

  function updateAria() {
    const label = state.control
      ? "Click to exit control mode"
      : "Click to control the stickman";
    stickman.setAttribute("aria-pressed", state.control ? "true" : "false");
    stickman.setAttribute("aria-label", label);
    stickman.title = label;
  }

  function showHintOnce() {
    if (hintShown) return;
    hintShown = true;
    hint.classList.add("is-visible");
    window.setTimeout(() => {
      hint.classList.remove("is-visible");
    }, 3500);
  }

  function setControlMode(enabled) {
    state.control = enabled;
    stickman.classList.toggle("is-controlled", enabled);
    updateAria();

    state.behaviorState = "normal";
    state.vibeName = null;
    state.vibeUntil = 0;
    state.pauseUntil = 0;
    state.stumbleUntil = 0;
    state.jumpLockedUntil = 0;
    state.inputLockedUntil = 0;
    state.ragdollUntil = 0;
    state.shakeUntil = 0;
    state.shakeMagnitude = 0;
    state.idleVibeEligibleAt = 0;
    state.stareUntil = 0;
    state.animName = "";
    state.animFrame = 0;
    state.animNextAt = 0;
    resetLegacyJumpPresses();

    input.left = false;
    input.right = false;
    input.sprint = false;
    input.jump = false;
    input.jumpHeld = false;

    updateTouchHudVisibility();

    if (enabled) {
      showHintOnce();
      startLoop();
    } else if (idleEnabled) {
      state.idleTarget = null;
      state.idleRestUntil = performance.now() + rand(600, 1400);
      startLoop();
    } else {
      stopLoop();
    }
  }

  function pickIdleTarget(now) {
    if (!platforms.length) {
      state.idleTarget = {
        el: null,
        top: getGroundTop(),
        centerX: window.innerWidth * 0.5,
        expires: now + IDLE_TARGET_TTL,
      };
      return;
    }

    let candidates = platforms.slice();
    if (state.currentPlatform && state.currentPlatform.el) {
      candidates = candidates.filter((p) => p.el !== state.currentPlatform.el);
    }
    if (!candidates.length) {
      candidates = platforms.slice();
    }

    const chosen = candidates[Math.floor(Math.random() * candidates.length)];
    state.idleTarget = {
      ...chosen,
      expires: now + IDLE_TARGET_TTL + rand(0, 4000),
    };
  }

  function updateIdle(dt, now) {
    const slipActive = now < state.slipUntil && state.onGround;
    const slipFriction = slipActive ? state.slipFriction : 1;
    if (state.behaviorState === "idleVibe" || now < state.pauseUntil) {
      state.vx = approach(state.vx, 0, IDLE_DECEL * slipFriction * dt);
      return;
    }
    if (state.idleRestUntil > now) {
      state.vx = approach(state.vx, 0, IDLE_DECEL * slipFriction * dt);
      return;
    }

    if (!state.idleTarget || now > state.idleTarget.expires) {
      pickIdleTarget(now);
    }
    const target = state.idleTarget;
    if (!target) return;

    const desiredX = target.centerX - state.width / 2;
    const dx = desiredX - state.x;
    const distance = Math.abs(dx);

    if (distance < 6 && state.onGround) {
      state.vx = approach(state.vx, 0, IDLE_DECEL * slipFriction * dt);
      state.idleTarget = null;
      state.idleRestUntil = now + rand(700, 1600);
      return;
    }

    const desiredVx = Math.sign(dx) * IDLE_SPEED;
    state.vx = approach(state.vx, desiredVx, IDLE_ACCEL * dt);

    if (
      state.onGround &&
      target.top < state.y - 10 &&
      distance < 80 &&
      now - state.lastIdleJumpAt > 700 &&
      Math.random() < 0.6
    ) {
      state.vy = -getEffectiveJumpSpeed(IDLE_JUMP_SPEED);
      state.onGround = false;
      state.lastIdleJumpAt = now;
      if (zoneState.activeType === "lowGravity") {
        const count = reducedMotion ? 0 : 2;
        if (count) {
          spawnBurstParticles(
            state.x + state.width * 0.5,
            state.y + state.height - 2,
            count,
            getZoneTint(zoneState.activeEl)
          );
        }
      }
    }
  }

  function updateControl(dt, now) {
    const inputLocked = now < state.inputLockedUntil;
    const locked =
      state.behaviorState === "stumble" || now < state.pauseUntil || inputLocked;
    const maxSpeed = input.sprint ? SPRINT_SPEED : CONTROL_SPEED;
    const slipActive = now < state.slipUntil && state.onGround;
    const slipFriction = slipActive ? state.slipFriction : 1;

    if (locked) {
      const decel = (state.onGround ? RUN_DECEL : AIR_DECEL) * slipFriction;
      state.vx = approach(state.vx, 0, decel * dt);
    } else {
      let move = 0;
      if (input.left) move -= 1;
      if (input.right) move += 1;

      if (move !== 0) {
        const accel = state.onGround ? RUN_ACCEL : RUN_ACCEL * 0.6;
        state.vx += move * accel * dt;
      } else {
        const decel = (state.onGround ? RUN_DECEL : AIR_DECEL) * slipFriction;
        if (Math.abs(state.vx) <= decel * dt) {
          state.vx = 0;
        } else {
          state.vx -= Math.sign(state.vx) * decel * dt;
        }
      }
    }

    state.vx = clamp(state.vx, -maxSpeed, maxSpeed);

    if (inputLocked) {
      input.jump = false;
      input.jumpHeld = false;
    }
    if (now < state.jumpLockedUntil) {
      input.jump = false;
    }
    if (input.jump) {
      if (state.onGround) {
        state.vy = -getEffectiveJumpSpeed(JUMP_SPEED);
        state.onGround = false;
        if (zoneState.activeType === "lowGravity") {
          const count = reducedMotion ? 0 : 3;
          if (count) {
            spawnBurstParticles(
              state.x + state.width * 0.5,
              state.y + state.height - 2,
              count,
              getZoneTint(zoneState.activeEl)
            );
          }
        }
        if (zoneState.activeType === "invertGravity") {
          triggerInvertGravity(now);
        }
      }
      input.jump = false;
    }
  }

  // Idle vibe selection + state transitions.
  function pickIdleVibe() {
    const total = IDLE_VIBE_CHOICES.reduce((sum, choice) => {
      return sum + choice.weight;
    }, 0);
    let roll = Math.random() * total;
    for (const choice of IDLE_VIBE_CHOICES) {
      roll -= choice.weight;
      if (roll <= 0) return choice.name;
    }
    return IDLE_VIBE_CHOICES[0].name;
  }

  function startIdleVibe(now) {
    const vibeName = pickIdleVibe();
    const vibe = IDLE_VIBES[vibeName];
    state.behaviorState = "idleVibe";
    state.vibeName = vibeName;
    state.vibeUntil = now + vibe.duration;
    state.vibeCooldownUntil =
      now + rand(IDLE_VIBE_COOLDOWN_MIN, IDLE_VIBE_COOLDOWN_MAX);
    state.idleVibeEligibleAt = 0;
    state.animName = "";
    state.animFrame = 0;
    state.animNextAt = 0;
  }

  function endIdleVibe() {
    state.behaviorState = "normal";
    state.vibeName = null;
    state.vibeUntil = 0;
    state.animName = "";
    state.animFrame = 0;
    state.animNextAt = 0;
  }

  function maybeTriggerIdleVibe(now) {
    if (reducedMotion || state.control || !idleEnabled) return;
    if (!state.onGround || Math.abs(state.vx) > 0.5) {
      state.idleVibeEligibleAt = 0;
      return;
    }
    if (state.behaviorState !== "normal") return;
    if (now < state.vibeCooldownUntil) return;
    if (!state.idleVibeEligibleAt) {
      state.idleVibeEligibleAt =
        now + rand(IDLE_VIBE_MIN_DELAY, IDLE_VIBE_MAX_DELAY);
    }
    if (now >= state.idleVibeEligibleAt) {
      startIdleVibe(now);
    }
  }

  // Rare stumble trigger while running.
  function startStumble(now) {
    const duration = reducedMotion ? 220 : STUMBLE_ANIM.duration;
    state.behaviorState = "stumble";
    state.stumbleUntil = now + duration;
    state.stumbleCooldownUntil =
      now + rand(STUMBLE_COOLDOWN_MIN, STUMBLE_COOLDOWN_MAX);
    state.jumpLockedUntil = now + duration + STUMBLE_LOCK_EXTRA;
    state.vx *= 0.3;
    state.animName = "";
    state.animFrame = 0;
    state.animNextAt = 0;
  }

  function maybeTriggerStumble(now, dt) {
    if (state.behaviorState !== "normal") return;
    if (!state.onGround) return;
    if (state.control && (input.left || input.right)) return;
    if (Math.abs(state.vx) < 60) return;
    if (now < state.stumbleCooldownUntil) return;
    // ~0.5%–1% chance per second while running.
    const chance = STUMBLE_RATE * dt;
    if (Math.random() < chance) {
      startStumble(now);
    }
  }

  // Legacy telemetry artifact (console-only, gated).
  function decodeObserverPayload() {
    try {
      return atob(observerPayload);
    } catch (err) {
      return null;
    }
  }

  function revealLegacyTelemetry(lines) {
    const title = "render cache";
    console.groupCollapsed(title);
    let totalDelay = 0;
    lines.forEach((line) => {
      const stepDelay = 80 + Math.floor(Math.random() * 70);
      totalDelay += stepDelay;
      window.setTimeout(() => {
        console.log(line);
      }, totalDelay);
    });
    window.setTimeout(() => {
      console.groupEnd();
    }, totalDelay + 40);
  }

  function showDebugOverlay(lines) {
    const overlay = document.createElement("div");
    overlay.textContent = lines.join("\n");
    overlay.setAttribute("aria-hidden", "true");
    overlay.style.position = "fixed";
    overlay.style.top = "12px";
    overlay.style.right = "12px";
    overlay.style.zIndex = "9000";
    overlay.style.pointerEvents = "none";
    overlay.style.fontFamily =
      "\"SFMono-Regular\", \"Menlo\", \"Consolas\", \"Liberation Mono\", \"Courier New\", monospace";
    overlay.style.fontSize = "11px";
    overlay.style.lineHeight = "1.3";
    overlay.style.color = "rgba(230, 230, 238, 0.7)";
    overlay.style.background = "rgba(10, 10, 14, 0.6)";
    overlay.style.border = "1px solid rgba(255, 255, 255, 0.15)";
    overlay.style.borderRadius = "8px";
    overlay.style.padding = "6px 8px";
    overlay.style.whiteSpace = "pre";
    overlay.style.boxShadow = "0 10px 24px rgba(0, 0, 0, 0.35)";
    if (!reducedMotion) {
      overlay.style.transition = "opacity 0.2s ease";
    }
    document.body.appendChild(overlay);

    window.setTimeout(() => {
      overlay.remove();
    }, 11000);
  }

  function triggerLegacyTelemetry(now) {
    if (legacyTelemetryRevealed) return;
    legacyTelemetryRevealed = true;

    state.pauseUntil = now + 500;
    state.stareUntil = now + 650;
    state.animName = "";
    state.animFrame = 0;
    state.animNextAt = 0;

    const decoded = decodeObserverPayload();
    if (!decoded) return;
    const lines = decoded.split("\n");
    revealLegacyTelemetry(lines);

    if (!reducedMotion) {
      const sample = [lines[0], lines[3], lines[lines.length - 1]].filter(
        Boolean
      );
      showDebugOverlay(sample);
    }
  }

  function findLandingPlatform(prevBottom, nextBottom, nextX) {
    const pad = Math.min(10, state.width * 0.2);
    const charLeft = nextX + pad;
    const charRight = nextX + state.width - pad;

    let best = null;
    let bestTop = Infinity;

    for (const p of platforms) {
      if (p.top < prevBottom - 1 || p.top > nextBottom + 1) continue;
      if (charRight <= p.left + 4 || charLeft >= p.right - 4) continue;
      if (p.top < bestTop) {
        bestTop = p.top;
        best = p;
      }
    }

    const groundTop = getGroundTop();
    if (nextBottom >= groundTop && groundTop < bestTop) {
      return { top: groundTop, el: null };
    }
    return best;
  }

  // Basic gravity + top-surface collision against platforms and ground.
  function applyPhysics(dt, now) {
    const wasOnGround = state.onGround;

    const gravity = getEffectiveGravity();
    state.vy += gravity * dt;
    state.vy = clamp(state.vy, -MAX_FALL_SPEED, MAX_FALL_SPEED);

    let nextX = state.x + state.vx * dt;
    let nextY = state.y + state.vy * dt;

    const maxX = Math.max(0, window.innerWidth - state.width);
    if (nextX < 0 || nextX > maxX) {
      nextX = clamp(nextX, 0, maxX);
      state.vx = 0;
    }

    state.onGround = false;
    let impactSpeed = 0;
    let landedEl = null;
    let landedTop = null;
    let landedZone = null;

    if (state.vy >= 0) {
      const prevBottom = state.y + state.height;
      const nextBottom = nextY + state.height;
      const landing = findLandingPlatform(prevBottom, nextBottom, nextX);

      if (landing) {
        impactSpeed = Math.abs(state.vy);
        nextY = landing.top - state.height;
        state.vy = 0;
        state.onGround = true;
        state.currentPlatform = landing.el ? landing : null;
        landedEl = landing.el || null;
        landedTop = landing.top;
        if (landedEl) {
          landedZone = getZoneEntryForElement(landedEl);
        }
      } else {
        state.currentPlatform = null;
      }
    } else {
      state.currentPlatform = null;
    }

    const maxY = Math.max(0, window.innerHeight - state.height);
    state.x = nextX;
    state.y = clamp(nextY, 0, maxY);

    if (gravity < 0 && state.y <= 0 && state.vy < 0) {
      state.y = 0;
      state.vy = 0;
    }

    if (!state.onGround && state.y >= maxY) {
      impactSpeed = Math.abs(state.vy);
      state.vy = 0;
      state.onGround = true;
    }

    if (!wasOnGround && state.onGround) {
      const strength = Math.min(1, impactSpeed / MAX_FALL_SPEED);
      state.landSquashUntil = now + LAND_SQUASH_DURATION;
      state.landSquashStrength = strength;
      if (impactSpeed > LAND_DUST_THRESHOLD) {
        state.dustUntil = now + LAND_DUST_DURATION;
        state.dustChar = Math.random() < 0.5 ? "." : "*";
        state.dustSide = state.facing >= 0 ? 1 : -1;
      }
      if (landedEl) {
        triggerImpactFeedback(landedEl, impactSpeed, now);
        maybeTriggerBomb(landedEl, landedTop, now);
        deferredEventManager.arm(landedEl, now);
      }
      if (landedZone && landedZone.type === "heavyGravity") {
        const count = reducedMotion ? 0 : 3;
        if (count) {
          spawnBurstParticles(
            state.x + state.width * 0.5,
            state.y + state.height - 2,
            count,
            getZoneTint(landedZone.el)
          );
        }
      }
    }
  }

  function updateFacing() {
    if (state.vx > 5) state.facing = 1;
    if (state.vx < -5) state.facing = -1;
  }

  // Animation state selection based on physics.
  function resolveAnimationName() {
    if (!state.onGround) {
      return state.vy < 0 ? "jump" : "fall";
    }
    if (Math.abs(state.vx) < 5) return "idle";
    return state.vx > 0 ? "runRight" : "runLeft";
  }

  function getActiveAnimation(now) {
    if (state.stareUntil && now < state.stareUntil) {
      return { key: "stare", anim: STARE_ANIM };
    }
    if (state.ragdollUntil && now < state.ragdollUntil) {
      return { key: "fall", anim: ANIMATIONS.fall };
    }
    if (state.behaviorState === "idleVibe" && state.vibeName) {
      return {
        key: "idleVibe:" + state.vibeName,
        anim: IDLE_VIBES[state.vibeName],
      };
    }
    if (state.behaviorState === "stumble") {
      const anim = reducedMotion
        ? { ...STUMBLE_ANIM, duration: 220, frameDuration: 90 }
        : STUMBLE_ANIM;
      return { key: "stumble", anim };
    }
    const key = resolveAnimationName();
    return { key, anim: ANIMATIONS[key] };
  }

  function applyDust(frame, now) {
    if (now > state.dustUntil) return frame;
    const lines = frame.split("\n");
    const lineIndex = lines.length - 1;
    const line = lines[lineIndex];
    const pos = state.dustSide > 0 ? Math.max(0, line.length - 2) : 0;
    const chars = line.split("");
    chars[pos] = state.dustChar;
    lines[lineIndex] = chars.join("");
    return lines.join("\n");
  }

  function updateArtTransform(now, animName, frameIndex) {
    let tilt = 0;
    let bob = 0;

    if (animName === "runRight") {
      tilt = frameIndex % 2 === 0 ? 2 : -2;
      bob = frameIndex % 2 === 0 ? 0 : 1;
    }
    if (animName === "runLeft") {
      tilt = frameIndex % 2 === 0 ? -2 : 2;
      bob = frameIndex % 2 === 0 ? 0 : 1;
    }
    if (animName === "jump") {
      tilt = -2;
      bob = -1;
    }
    if (animName === "fall") {
      tilt = 2;
      bob = 1;
    }

    let scaleX = 1;
    let scaleY = 1;
    if (now < state.landSquashUntil) {
      const t = 1 - (state.landSquashUntil - now) / LAND_SQUASH_DURATION;
      const ease = 1 - Math.pow(1 - t, 2);
      const squash = 0.18 * state.landSquashStrength * (1 - ease);
      scaleY = 1 - squash;
      scaleX = 1 + squash * 0.6;
    }

    art.style.transform = `translateY(${bob}px) rotate(${tilt}deg) scale(${
      scaleX
    }, ${scaleY})`;
  }

  // Animation state + frame stepping (decoupled from physics).
  function updateAnimation(now) {
    const { key, anim } = getActiveAnimation(now);
    if (key !== state.animName) {
      state.animName = key;
      state.animFrame = 0;
      state.animNextAt = now + anim.frameDuration;
    }

    if (!state.animNextAt) {
      state.animNextAt = now + anim.frameDuration;
    }

    if (anim.frames.length > 1 && now >= state.animNextAt) {
      while (now >= state.animNextAt) {
        if (state.animFrame < anim.frames.length - 1) {
          state.animFrame += 1;
        } else if (anim.loop) {
          state.animFrame = 0;
        } else {
          state.animFrame = anim.frames.length - 1;
          break;
        }
        state.animNextAt += anim.frameDuration;
      }
    }

    const frame = applyDust(anim.frames[state.animFrame], now);
    art.textContent = frame;
    updateArtTransform(now, state.animName, state.animFrame);
  }

  function getShakeOffset(now) {
    if (!state.shakeUntil || now >= state.shakeUntil) return { x: 0, y: 0 };
    const mag = state.shakeMagnitude || 0;
    return { x: rand(-mag, mag), y: rand(-mag, mag) };
  }

  function render(now) {
    const shake = getShakeOffset(now);
    stickman.style.transform = `translate3d(${Math.round(
      state.x + shake.x
    )}px, ${Math.round(state.y + shake.y)}px, 0)`;
    updateAnimation(now);
  }

  function step(now) {
    if (!state.running) return;

    if (!state.control && !idleEnabled) {
      stopLoop();
      return;
    }

    const dt = Math.min(0.05, (now - state.lastTime) / 1000);
    state.lastTime = now;

    updateZoneState(dt, now);

    if (state.control) {
      updateControl(dt, now);
    } else if (idleEnabled) {
      updateIdle(dt, now);
    }

    applyPhysics(dt, now);
    updateBomb(dt, now);
    deferredEventManager.update(now, dt);
    updateFacing();

    // Idle vibes and stumble state transitions.
       if (!state.control || !logoVisible) {
      resetLegacyJumpPresses();
    } else if (state.onGround && !isStandingOnLogo()) {
      resetLegacyJumpPresses();
    }
 
    if (state.behaviorState === "idleVibe") {
      if (state.control || !state.onGround || now >= state.vibeUntil) {
        endIdleVibe();
      }
    }

    if (state.behaviorState === "stumble") {
      if (!state.onGround) {
        state.behaviorState = "normal";
        state.animName = "";
        state.animFrame = 0;
        state.animNextAt = 0;
      } else if (now >= state.stumbleUntil) {
        state.behaviorState = "normal";
        state.animName = "";
        state.animFrame = 0;
        state.animNextAt = 0;
        if (Math.random() < 0.5) {
          state.pauseUntil = now + STUMBLE_RECOVER_PAUSE;
        }
      }
    }

    if (state.behaviorState === "normal") {
      maybeTriggerIdleVibe(now);
      maybeTriggerStumble(now, dt);
    }

    render(now);

    rafId = requestAnimationFrame(step);
  }

  function startLoop() {
    if (state.running) return;
    state.running = true;
    state.lastTime = performance.now();
    rafId = requestAnimationFrame(step);
  }

  function stopLoop() {
    if (!state.running) return;
    state.running = false;
    if (rafId) cancelAnimationFrame(rafId);
    rafId = null;
  }

  function handleKeyDown(e) {
    if (!state.control) return;
    const key = e.key.toLowerCase();

    if (key === "arrowleft" || key === "a") {
      input.left = true;
      e.preventDefault();
    }
    if (key === "arrowright" || key === "d") {
      input.right = true;
      e.preventDefault();
    }
    if (key === "arrowup" || key === "w" || key === " " || key === "spacebar") {
      input.jump = true;
      input.jumpHeld = true;
      registerJumpPress(performance.now());
      e.preventDefault();
    }
    if (key === "shift") {
      input.sprint = true;
      e.preventDefault();
    }
  }

  function handleKeyUp(e) {
    if (!state.control) return;
    const key = e.key.toLowerCase();

    if (key === "arrowleft" || key === "a") {
      input.left = false;
      e.preventDefault();
    }
    if (key === "arrowright" || key === "d") {
      input.right = false;
      e.preventDefault();
    }
    if (key === "arrowup" || key === "w" || key === " " || key === "spacebar") {
      input.jumpHeld = false;
      const cutSpeed = getEffectiveJumpSpeed(JUMP_CUT_SPEED);
      if (state.vy < -cutSpeed) {
        state.vy = -cutSpeed;
      }
      e.preventDefault();
    }
    if (key === "shift") {
      input.sprint = false;
      e.preventDefault();
    }
  }

  function handleResize() {
    measureStickman();
    state.x = clamp(state.x, 0, Math.max(0, window.innerWidth - state.width));
    state.y = clamp(state.y, 0, Math.max(0, window.innerHeight - state.height));
    schedulePlatformRefresh();
    updateTouchHudVisibility();
  }

  stickman.addEventListener("click", () => {
    setControlMode(!state.control);
  });

  stickman.addEventListener("keydown", (e) => {
    if (!state.control) {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setControlMode(true);
      }
      return;
    }

    if (e.key === "Escape") {
      e.preventDefault();
      setControlMode(false);
    }
  });

  window.addEventListener("keydown", handleKeyDown);
  window.addEventListener("keyup", handleKeyUp);
  window.addEventListener("scroll", schedulePlatformRefresh, { passive: true });
  window.addEventListener("resize", handleResize, { passive: true });

  if (typeof prefersReducedMotionQuery.addEventListener === "function") {
    prefersReducedMotionQuery.addEventListener("change", (event) => {
      reducedMotion = event.matches;
      idleEnabled = !reducedMotion;
      if (reducedMotion && state.behaviorState === "idleVibe") {
        endIdleVibe();
      }
      if (!idleEnabled && !state.control) {
        stopLoop();
      } else {
        startLoop();
      }
    });
  } else if (typeof prefersReducedMotionQuery.addListener === "function") {
    prefersReducedMotionQuery.addListener((event) => {
      reducedMotion = event.matches;
      idleEnabled = !reducedMotion;
      if (reducedMotion && state.behaviorState === "idleVibe") {
        endIdleVibe();
      }
      if (!idleEnabled && !state.control) {
        stopLoop();
      } else {
        startLoop();
      }
    });
  }

  setupZoneElements();
  refreshPlatforms();
  placeInitial();
  render(performance.now());

  setupLogoObserver();
  setupHazardTarget();
  setupCursedTarget();

  window.setInterval(refreshPlatforms, 1600);
  window.addEventListener("load", () => {
    refreshPlatforms();
    handleResize();
  });

  if (idleEnabled) {
    startLoop();
  }
})();
