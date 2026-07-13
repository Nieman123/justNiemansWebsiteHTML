// --- Gallery items ---
const GALLERY_ITEMS = [
  ["assets/gallery/1.webp", "Memories at The Getaway"],
  ["assets/gallery/2.webp", "Afters?"],
  ["assets/gallery/3.webp", "Looking for the next track."],
  ["assets/gallery/7.webp", "At Electric Forest 2025."],
  ["assets/gallery/5.webp", "Memories at The Getaway"],
  // [thumb_or_image_src, caption, optional_video_src]
  [
    "optimized/shell-thumb-720.webp",
    "Shell crowd moment",
    "assets/video/shell.mp4",
  ],
];

const DEFAULT_SITE_CONTENT = Object.freeze({
  homepage: {
    events: [],
    releases: [
      {
        id: "release-levitate",
        title: "LEVITATE (JUST NIEMAN REMIX)",
        imageUrl: "assets/levitate.webp",
        imageAlt: "Cover art for SYITE - Levitate (Just Nieman Remix)",
        linkUrl:
          "https://soundcloud.com/just-nieman/syite-levitate-just-nieman-remix",
        linkLabel: "CLICK TO LISTEN",
      },
      {
        id: "release-its-not-that-deep",
        title: "IT'S NOT THAT DEEP",
        imageUrl: "assets/its-not-that-deep.webp",
        imageAlt: "Cover art for It's Not That Deep",
        linkUrl:
          "https://distrokid.com/hyperfollow/justnieman/its-not-that-deep",
        linkLabel: "CLICK TO LISTEN",
      },
      {
        id: "release-norf-flip",
        title: "NORF (JUST NIEMAN FLIP)",
        imageUrl: "assets/norf-flip.png",
        imageAlt: "Cover art for NORF (Just Nieman Flip)",
        linkUrl: "https://soundcloud.com/just-nieman/norf-flip",
        linkLabel: "CLICK TO LISTEN",
      },
      {
        id: "release-my-music",
        title: "MY MUSIC",
        imageUrl: "assets/my-music.webp",
        imageAlt: "Cover art for My Music",
        linkUrl: "https://distrokid.com/hyperfollow/justnieman/my-music",
        linkLabel: "CLICK TO LISTEN",
      },
      {
        id: "release-lives",
        title: "LIVES",
        imageUrl: "assets/lives.webp",
        imageAlt: "Cover art for Lives",
        linkUrl: "https://distrokid.com/hyperfollow/justnieman/lives",
        linkLabel: "CLICK TO LISTEN",
      },
      {
        id: "release-personal",
        title: "PERSONAL",
        imageUrl: "assets/personal.webp",
        imageAlt: "Cover art for Personal",
        linkUrl: "https://distrokid.com/hyperfollow/justnieman/personal",
        linkLabel: "CLICK TO LISTEN",
      },
    ],
  },
  links: {
    items: [
      {
        id: "link-soundcloud",
        label: "SoundCloud",
        url: "https://soundcloud.com/just-nieman",
        imageUrl: "assets/soundcloud-logo.png",
        imageAlt: "SoundCloud",
        variant: "icon",
      },
      {
        id: "link-instagram",
        label: "Follow me on Insta",
        url: "https://instagram.com/justnieman",
        imageUrl: "assets/Instagram.webp",
        imageAlt: "Instagram",
        variant: "icon",
      },
      {
        id: "link-levitate",
        label: 'Stream "SYITE - LEVITATE (Just Nieman Remix)"',
        url: "https://soundcloud.com/just-nieman/syite-levitate-just-nieman-remix",
        imageUrl: "assets/levitate.webp",
        imageAlt: "SYITE - LEVITATE (Just Nieman Remix) cover",
        variant: "artwork",
      },
      {
        id: "link-its-not-that-deep",
        label: 'Stream "It\'s Not That Deep"',
        url: "https://distrokid.com/hyperfollow/justnieman/its-not-that-deep",
        imageUrl: "assets/its-not-that-deep.webp",
        imageAlt: "It's Not That Deep cover",
        variant: "artwork",
      },
      {
        id: "link-my-music",
        label: 'Stream "My Music"',
        url: "https://distrokid.com/hyperfollow/justnieman/my-music",
        imageUrl: "assets/my-music.webp",
        imageAlt: "My Music cover",
        variant: "artwork",
      },
      {
        id: "link-personal",
        label: 'Stream "Personal"',
        url: "https://distrokid.com/hyperfollow/justnieman/personal",
        imageUrl: "assets/personal.webp",
        imageAlt: "Personal cover",
        variant: "artwork",
      },
      {
        id: "link-lives",
        label: 'Stream "Lives"',
        url: "https://distrokid.com/hyperfollow/justnieman/lives",
        imageUrl: "assets/lives.webp",
        imageAlt: "Lives cover",
        variant: "artwork",
      },
    ],
  },
});

const FIREBASE_SDK_VERSION = "10.12.5";

const ADMIN_SECTION_CONFIG = Object.freeze({
  events: {
    itemLabel: "Event",
    listId: "adminEventsList",
    addButtonId: "addEventBtn",
    saveButtonId: "saveEventsBtn",
    statusId: "eventsSaveStatus",
    emptyText: "No upcoming events yet. Add one to publish it on the homepage.",
    imageUpload: {
      folder: "events",
      buttonLabel: "Upload event image",
      emptyLabel: "No event image uploaded yet.",
    },
    createEmptyItem: () => ({
      id: createItemId("event"),
      title: "",
      date: "",
      venue: "",
      location: "",
      note: "",
      imageUrl: "",
      imageAlt: "",
      linkUrl: "",
      linkLabel: "Get tickets",
    }),
    normalize: normalizeEventItem,
    finalize: finalizeEventItem,
    isBlank: isEventBlank,
    validate(item, index) {
      if (!item.title) {
        return `Event ${index + 1} needs a title.`;
      }
      if (!item.date) {
        return `Event ${index + 1} needs a date.`;
      }
      return "";
    },
    save: (db, items) =>
      getHomepageDoc(db).set(
        {
          events: items,
          updatedAt: getServerTimestamp(),
        },
        { merge: true }
      ),
    fields: [
      {
        key: "title",
        label: "Event title",
        placeholder: "Warehouse set with Pluto Events",
        wide: true,
      },
      {
        key: "date",
        label: "Date",
        placeholder: "April 12, 2026",
      },
      {
        key: "venue",
        label: "Venue",
        placeholder: "Eulogy",
      },
      {
        key: "location",
        label: "Location",
        placeholder: "Asheville, NC",
      },
      {
        key: "imageUrl",
        label: "Event image path or URL",
        type: "url",
        placeholder: "https://...",
        wide: true,
      },
      {
        key: "imageAlt",
        label: "Event image alt text",
        placeholder: "Crowd at the warehouse set",
        wide: true,
      },
      {
        key: "linkLabel",
        label: "Button label",
        placeholder: "Get tickets",
      },
      {
        key: "linkUrl",
        label: "Ticket or event URL",
        type: "url",
        placeholder: "https://...",
        wide: true,
      },
      {
        key: "note",
        label: "Note",
        type: "textarea",
        rows: 3,
        placeholder: "Optional details for the card.",
        wide: true,
      },
    ],
  },
  releases: {
    itemLabel: "Release",
    listId: "adminReleasesList",
    addButtonId: "addReleaseBtn",
    saveButtonId: "saveReleasesBtn",
    statusId: "releasesSaveStatus",
    emptyText: "No releases published yet. Add one to populate the homepage.",
    imageUpload: {
      folder: "releases",
      buttonLabel: "Upload release artwork",
      emptyLabel: "No release artwork uploaded yet.",
    },
    createEmptyItem: () => ({
      id: createItemId("release"),
      title: "",
      imageUrl: "",
      imageAlt: "",
      linkUrl: "",
      linkLabel: "CLICK TO LISTEN",
    }),
    normalize: normalizeReleaseItem,
    finalize: finalizeReleaseItem,
    isBlank: isReleaseBlank,
    validate(item, index) {
      if (!item.title) {
        return `Release ${index + 1} needs a title.`;
      }
      if (!item.imageUrl) {
        return `Release ${index + 1} needs an image path or URL.`;
      }
      if (!item.linkUrl) {
        return `Release ${index + 1} needs a listen URL.`;
      }
      return "";
    },
    save: (db, items) =>
      getHomepageDoc(db).set(
        {
          releases: items,
          updatedAt: getServerTimestamp(),
        },
        { merge: true }
      ),
    fields: [
      {
        key: "title",
        label: "Release title",
        placeholder: "NEW TRACK",
        wide: true,
      },
      {
        key: "imageUrl",
        label: "Artwork path or URL",
        type: "url",
        placeholder: "assets/my-release.webp",
        wide: true,
      },
      {
        key: "imageAlt",
        label: "Artwork alt text",
        placeholder: "Cover art for New Track",
        wide: true,
      },
      {
        key: "linkLabel",
        label: "Button label",
        placeholder: "CLICK TO LISTEN",
      },
      {
        key: "linkUrl",
        label: "Listen URL",
        type: "url",
        placeholder: "https://...",
        wide: true,
      },
    ],
  },
  links: {
    itemLabel: "Link",
    listId: "adminLinksList",
    addButtonId: "addLinkBtn",
    saveButtonId: "saveLinksBtn",
    statusId: "linksSaveStatus",
    emptyText: "No links configured yet. Add one to populate /links.",
    imageUpload: {
      folder: "links",
      buttonLabel: "Upload artwork or icon",
      emptyLabel: "Upload square album art or a platform icon.",
    },
    createEmptyItem: () => ({
      id: createItemId("link"),
      label: "",
      url: "",
      imageUrl: "",
      imageAlt: "",
      variant: "artwork",
    }),
    normalize: normalizeLinkItem,
    finalize: finalizeLinkItem,
    isBlank: isLinkBlank,
    validate(item, index) {
      if (!item.label) {
        return `Link ${index + 1} needs a label.`;
      }
      if (!item.url) {
        return `Link ${index + 1} needs a URL.`;
      }
      if (!item.imageUrl) {
        return `Link ${index + 1} needs an image path or URL.`;
      }
      return "";
    },
    save: (db, items) =>
      getLinksDoc(db).set(
        {
          items,
          updatedAt: getServerTimestamp(),
        },
        { merge: true }
      ),
    fields: [
      {
        key: "label",
        label: "Link label",
        placeholder: 'Stream "New Release"',
        wide: true,
      },
      {
        key: "url",
        label: "Destination URL",
        type: "url",
        placeholder: "https://...",
        wide: true,
      },
      {
        key: "imageUrl",
        label: "Image URL",
        type: "url",
        placeholder: "Filled automatically after upload",
        helper: "You can also paste a hosted image URL here.",
        wide: true,
      },
      {
        key: "imageAlt",
        label: "Image alt text",
        placeholder: "Release cover",
        wide: true,
      },
      {
        key: "variant",
        label: "Image style",
        type: "select",
        helper: "Artwork fills the square. Icons keep more breathing room.",
        options: [
          { value: "artwork", label: "Artwork" },
          { value: "icon", label: "Icon" },
        ],
      },
    ],
  },
});

function cloneDefaults() {
  return JSON.parse(JSON.stringify(DEFAULT_SITE_CONTENT));
}

function trimString(value) {
  return typeof value === "string" ? value.trim() : "";
}

function createItemId(prefix) {
  if (window.crypto && typeof window.crypto.randomUUID === "function") {
    return `${prefix}-${window.crypto.randomUUID()}`;
  }
  return `${prefix}-${Date.now().toString(36)}-${Math.random()
    .toString(36)
    .slice(2, 8)}`;
}

function sanitizeFileName(name) {
  const cleaned = trimString(name)
    .toLowerCase()
    .replace(/[^a-z0-9._-]+/g, "-")
    .replace(/-+/g, "-")
    .replace(/^-|-$/g, "");
  return cleaned || "upload";
}

function normalizeEventItem(item = {}) {
  return {
    id: trimString(item.id) || createItemId("event"),
    title: trimString(item.title),
    date: trimString(item.date),
    venue: trimString(item.venue),
    location: trimString(item.location),
    note: trimString(item.note),
    imageUrl: trimString(item.imageUrl),
    imageAlt: trimString(item.imageAlt),
    linkUrl: trimString(item.linkUrl),
    linkLabel: trimString(item.linkLabel),
  };
}

function finalizeEventItem(item = {}) {
  const normalized = normalizeEventItem(item);
  return {
    ...normalized,
    imageAlt: normalized.imageAlt || `Event image for ${normalized.title}`,
    linkLabel: normalized.linkLabel || "Get tickets",
  };
}

function normalizeReleaseItem(item = {}) {
  return {
    id: trimString(item.id) || createItemId("release"),
    title: trimString(item.title),
    imageUrl: trimString(item.imageUrl),
    imageAlt: trimString(item.imageAlt),
    linkUrl: trimString(item.linkUrl),
    linkLabel: trimString(item.linkLabel),
  };
}

function finalizeReleaseItem(item = {}) {
  const normalized = normalizeReleaseItem(item);
  return {
    ...normalized,
    imageAlt: normalized.imageAlt || `Cover art for ${normalized.title}`,
    linkLabel: normalized.linkLabel || "CLICK TO LISTEN",
  };
}

function normalizeLinkItem(item = {}) {
  return {
    id: trimString(item.id) || createItemId("link"),
    label: trimString(item.label),
    url: trimString(item.url),
    imageUrl: trimString(item.imageUrl),
    imageAlt: trimString(item.imageAlt),
    variant: trimString(item.variant) === "icon" ? "icon" : "artwork",
  };
}

function finalizeLinkItem(item = {}) {
  const normalized = normalizeLinkItem(item);
  return {
    ...normalized,
    imageAlt: normalized.imageAlt || normalized.label,
  };
}

function isEventBlank(item) {
  return (
    !item.title &&
    !item.date &&
    !item.venue &&
    !item.location &&
    !item.note &&
    !item.imageUrl &&
    !item.imageAlt &&
    !item.linkUrl &&
    (!item.linkLabel || item.linkLabel === "Get tickets")
  );
}

function isReleaseBlank(item) {
  return (
    !item.title &&
    !item.imageUrl &&
    !item.imageAlt &&
    !item.linkUrl &&
    (!item.linkLabel || item.linkLabel === "CLICK TO LISTEN")
  );
}

function isLinkBlank(item) {
  return !item.label && !item.url && !item.imageUrl && !item.imageAlt;
}

function canRenderEvent(item) {
  return Boolean(item.title && item.date);
}

function canRenderRelease(item) {
  return Boolean(item.title && item.imageUrl && item.linkUrl);
}

function canRenderLink(item) {
  return Boolean(item.label && item.url && item.imageUrl);
}

function createElement(tagName, className, text) {
  const el = document.createElement(tagName);
  if (className) {
    el.className = className;
  }
  if (typeof text === "string") {
    el.textContent = text;
  }
  return el;
}

function setAnchorDestination(anchor, url) {
  const href = trimString(url);
  anchor.href = href || "#";
  if (/^https?:\/\//i.test(href)) {
    anchor.target = "_blank";
    anchor.rel = "noopener";
  } else {
    anchor.removeAttribute("target");
    anchor.removeAttribute("rel");
  }
}

function loadScript(src) {
  return new Promise((resolve, reject) => {
    const existing = document.querySelector(`script[src="${src}"]`);
    if (existing) {
      if (existing.dataset.loaded === "true") {
        resolve(existing);
        return;
      }
      existing.addEventListener("load", () => resolve(existing), { once: true });
      existing.addEventListener(
        "error",
        () => reject(new Error(`Failed to load script: ${src}`)),
        { once: true }
      );
      return;
    }

    const script = document.createElement("script");
    script.src = src;
    script.async = true;
    script.addEventListener(
      "load",
      () => {
        script.dataset.loaded = "true";
        resolve(script);
      },
      { once: true }
    );
    script.addEventListener(
      "error",
      () => reject(new Error(`Failed to load script: ${src}`)),
      { once: true }
    );
    document.head.appendChild(script);
  });
}

function canUseHostedFirebase() {
  const { hostname } = window.location;
  return (
    hostname === "just.niemans.website" ||
    hostname.endsWith(".web.app") ||
    hostname.endsWith(".firebaseapp.com")
  );
}

function loadFirebaseSdk() {
  if (
    window.firebase &&
    Array.isArray(window.firebase.apps) &&
    window.firebase.apps.length
  ) {
    return Promise.resolve(window.firebase);
  }

  if (!canUseHostedFirebase()) {
    return Promise.resolve(null);
  }

  if (window.__justNiemanFirebasePromise) {
    return window.__justNiemanFirebasePromise;
  }

  const base = `/__/firebase/${FIREBASE_SDK_VERSION}`;

  window.__justNiemanFirebasePromise = loadScript(
    `${base}/firebase-app-compat.js`
  )
    .then(() =>
      Promise.all([
        loadScript(`${base}/firebase-auth-compat.js`),
        loadScript(`${base}/firebase-firestore-compat.js`),
        loadScript(`${base}/firebase-storage-compat.js`),
      ])
    )
    .then(() => loadScript("/__/firebase/init.js"))
    .then(() => {
      if (
        window.firebase &&
        Array.isArray(window.firebase.apps) &&
        window.firebase.apps.length
      ) {
        return window.firebase;
      }
      return null;
    })
    .catch((error) => {
      console.error("Firebase SDK failed to load.", error);
      return null;
    });

  return window.__justNiemanFirebasePromise;
}

function getServerTimestamp() {
  if (
    window.firebase &&
    window.firebase.firestore &&
    window.firebase.firestore.FieldValue
  ) {
    return window.firebase.firestore.FieldValue.serverTimestamp();
  }
  return new Date().toISOString();
}

function getHomepageDoc(db) {
  return db.collection("siteContent").doc("homepage");
}

function getLinksDoc(db) {
  return db.collection("siteContent").doc("links");
}

function renderReleaseGrid(items, container) {
  if (!container) return;

  const releases = items.map(finalizeReleaseItem).filter(canRenderRelease);
  container.replaceChildren();

  if (!releases.length) {
    const emptyCard = createElement("article", "card event-card event-empty");
    emptyCard.appendChild(
      createElement("p", "event-date", "Fresh releases are on the way.")
    );
    emptyCard.appendChild(
      createElement(
        "p",
        "event-note",
        "Use the admin page to publish new music here."
      )
    );
    container.appendChild(emptyCard);
    return;
  }

  releases.forEach((release) => {
    const article = createElement("article", "card dynamic-card");
    article.appendChild(createElement("header", "card-header", release.title));

    const img = createElement("img", "card-art");
    img.src = release.imageUrl;
    img.alt = release.imageAlt;
    img.loading = "lazy";
    img.decoding = "async";
    img.width = 300;
    img.height = 300;
    article.appendChild(img);

    const link = createElement("a", "btn ghost", release.linkLabel);
    setAnchorDestination(link, release.linkUrl);
    article.appendChild(link);

    container.appendChild(article);
  });
}

function renderEventGrid(items, container) {
  if (!container) return;

  const events = items.map(finalizeEventItem).filter(canRenderEvent);
  container.replaceChildren();

  if (!events.length) {
    const emptyCard = createElement("article", "card event-card event-empty");
    emptyCard.appendChild(
      createElement("p", "event-date", "Nothing announced just yet.")
    );
    emptyCard.appendChild(
      createElement(
        "p",
        "event-note",
        "New dates will show up here as soon as they are locked."
      )
    );
    container.appendChild(emptyCard);
    return;
  }

  events.forEach((eventItem) => {
    const article = createElement("article", "card event-card");
    if (eventItem.imageUrl) {
      const img = createElement("img", "event-art");
      img.src = eventItem.imageUrl;
      img.alt = eventItem.imageAlt || `Event image for ${eventItem.title}`;
      img.loading = "lazy";
      img.decoding = "async";
      img.width = 720;
      img.height = 405;
      article.appendChild(img);
    }

    article.appendChild(createElement("header", "card-header", eventItem.title));
    article.appendChild(createElement("p", "event-date", eventItem.date));

    if (eventItem.venue) {
      article.appendChild(createElement("p", "event-venue", eventItem.venue));
    }
    if (eventItem.location) {
      article.appendChild(
        createElement("p", "event-location muted", eventItem.location)
      );
    }
    if (eventItem.note) {
      article.appendChild(createElement("p", "event-note", eventItem.note));
    }
    if (eventItem.linkUrl) {
      const link = createElement("a", "btn ghost", eventItem.linkLabel);
      setAnchorDestination(link, eventItem.linkUrl);
      article.appendChild(link);
    }

    container.appendChild(article);
  });
}

function renderLinksList(items, container) {
  if (!container) return;

  const links = items.map(finalizeLinkItem).filter(canRenderLink);
  container.replaceChildren();

  if (!links.length) {
    const emptyMessage = createElement(
      "p",
      "links-empty",
      "Fresh links are on the way."
    );
    container.appendChild(emptyMessage);
    return;
  }

  links.forEach((item) => {
    const anchor = createElement("a", "link-btn");
    setAnchorDestination(anchor, item.url);

    const img = createElement(
      "img",
      item.variant === "icon" ? "link-ic link-icon" : "link-ic"
    );
    img.src = item.imageUrl;
    img.alt = item.imageAlt;
    img.loading = "lazy";
    img.decoding = "async";
    img.width = item.variant === "icon" ? 64 : 300;
    img.height = item.variant === "icon" ? 64 : 300;
    anchor.appendChild(img);

    anchor.appendChild(createElement("span", "", item.label));
    container.appendChild(anchor);
  });

  applyLinksPageAttribution(container);
}

function applyLinksPageAttribution(root = document) {
  if (!document.body.classList.contains("links-body")) return;
  const params = new URLSearchParams({
    utm_source: "links",
    utm_medium: "website",
    utm_campaign: "links_page",
  });

  root.querySelectorAll('a[href^="http"]').forEach((anchor) => {
    try {
      const url = new URL(anchor.href);
      if (!url.searchParams.has("utm_source")) {
        params.forEach((value, key) => {
          url.searchParams.set(key, value);
        });
        anchor.href = url.toString();
      }
    } catch (error) {
      // Ignore malformed URLs entered in admin until they are fixed.
    }
  });
}

function applyHomepageSnapshot(snapshot) {
  if (!snapshot || !snapshot.exists) return;

  const data = snapshot.data() || {};
  const releaseGrid = document.getElementById("releaseGrid");
  const eventGrid = document.getElementById("eventGrid");

  if (Object.prototype.hasOwnProperty.call(data, "events")) {
    const events = Array.isArray(data.events) ? data.events : [];
    renderEventGrid(events.map(normalizeEventItem), eventGrid);
  }

  if (Object.prototype.hasOwnProperty.call(data, "releases")) {
    const releases = Array.isArray(data.releases) ? data.releases : [];
    renderReleaseGrid(releases.map(normalizeReleaseItem), releaseGrid);
  }
}

function applyLinksSnapshot(snapshot) {
  if (!snapshot || !snapshot.exists) return;

  const data = snapshot.data() || {};
  if (!Object.prototype.hasOwnProperty.call(data, "items")) {
    return;
  }

  const linksList = document.getElementById("linksList");
  const items = Array.isArray(data.items) ? data.items : [];
  renderLinksList(items.map(normalizeLinkItem), linksList);
}

async function initPublicFirestoreContent() {
  const hasHomepageTargets =
    document.getElementById("eventGrid") || document.getElementById("releaseGrid");
  const hasLinksTarget = document.getElementById("linksList");

  applyLinksPageAttribution();

  if (!hasHomepageTargets && !hasLinksTarget) {
    return;
  }

  const firebaseNamespace = await loadFirebaseSdk();
  if (
    !firebaseNamespace ||
    !firebaseNamespace.firestore ||
    !Array.isArray(firebaseNamespace.apps) ||
    !firebaseNamespace.apps.length
  ) {
    return;
  }

  const db = firebaseNamespace.firestore();
  const requests = [];

  if (hasHomepageTargets) {
    requests.push(
      getHomepageDoc(db)
        .get()
        .then((snapshot) => {
          applyHomepageSnapshot(snapshot);
        })
        .catch((error) => {
          console.error("Unable to load homepage content from Firestore.", error);
        })
    );
  }

  if (hasLinksTarget) {
    requests.push(
      getLinksDoc(db)
        .get()
        .then((snapshot) => {
          applyLinksSnapshot(snapshot);
        })
        .catch((error) => {
          console.error("Unable to load links content from Firestore.", error);
        })
    );
  }

  await Promise.all(requests);
}

function getAdminElements() {
  return {
    root: document.getElementById("adminApp"),
    signInBtn: document.getElementById("adminSignIn"),
    signOutBtn: document.getElementById("adminSignOut"),
    authStatus: document.getElementById("adminAuthStatus"),
    sessionMeta: document.getElementById("adminSessionMeta"),
    editors: document.getElementById("adminEditors"),
  };
}

function setStatusMessage(target, text, tone) {
  if (!target) return;
  target.textContent = text;
  target.classList.toggle("is-error", tone === "error");
  target.classList.toggle("is-success", tone === "success");
}

function buildAdminField(field, value) {
  const wrapper = createElement(
    "label",
    field.wide ? "admin-field admin-field-wide" : "admin-field"
  );
  wrapper.appendChild(createElement("span", "admin-field-label", field.label));

  let input;
  if (field.type === "textarea") {
    input = document.createElement("textarea");
    input.rows = field.rows || 3;
  } else if (field.type === "select") {
    input = document.createElement("select");
    (field.options || []).forEach((option) => {
      const optionEl = document.createElement("option");
      optionEl.value = option.value;
      optionEl.textContent = option.label;
      input.appendChild(optionEl);
    });
  } else {
    input = document.createElement("input");
    input.type = field.type || "text";
  }

  input.name = field.key;
  input.value = value || "";
  input.placeholder = field.placeholder || "";
  input.setAttribute("data-field", "true");
  wrapper.appendChild(input);

  if (field.helper) {
    wrapper.appendChild(
      createElement("span", "admin-field-helper", field.helper)
    );
  }

  return wrapper;
}

function renderAdminImagePreview(container, url, alt, emptyLabel, variant) {
  if (!container) return;

  container.replaceChildren();
  container.classList.toggle("is-icon", variant === "icon");

  if (!trimString(url)) {
    container.appendChild(
      createElement("span", "admin-image-placeholder", emptyLabel)
    );
    return;
  }

  const img = createElement("img", "admin-image-thumb");
  img.src = url;
  img.alt = trimString(alt) || "Uploaded image preview";
  img.loading = "lazy";
  img.decoding = "async";
  container.appendChild(img);
}

function buildAdminImageTools(kind, item, context) {
  const config = ADMIN_SECTION_CONFIG[kind];
  if (!config.imageUpload) return null;

  const wrap = createElement("div", "admin-image-tools");
  wrap.appendChild(
    createElement("p", "admin-image-tools-label", "Artwork")
  );

  const row = createElement("div", "admin-image-tools-row");
  const preview = createElement("div", "admin-image-preview");
  preview.setAttribute("data-admin-image-preview", "true");
  row.appendChild(preview);

  const controls = createElement("div", "admin-image-tools-actions");

  if (context.storage) {
    const uploadTrigger = createElement(
      "button",
      "btn ghost admin-upload-btn",
      config.imageUpload.buttonLabel
    );
    uploadTrigger.type = "button";
    uploadTrigger.dataset.adminUploadTrigger = "true";
    uploadTrigger.setAttribute("data-admin-upload-control", "true");
    controls.appendChild(uploadTrigger);

    const fileInput = document.createElement("input");
    fileInput.type = "file";
    fileInput.accept = "image/jpeg,image/png,image/webp,image/avif,image/gif";
    fileInput.hidden = true;
    fileInput.dataset.adminImageFile = "true";
    row.appendChild(fileInput);
  }

  controls.appendChild(
    createElement(
      "p",
      "admin-upload-hint",
      "Square JPG, PNG, WebP, AVIF, or GIF. Maximum 8 MB."
    )
  );

  const clearButton = createElement(
    "button",
    "admin-mini-btn",
    "Clear image"
  );
  clearButton.type = "button";
  clearButton.dataset.adminClearImage = "true";
  clearButton.setAttribute("data-admin-upload-control", "true");
  controls.appendChild(clearButton);

  row.appendChild(controls);
  wrap.appendChild(row);

  renderAdminImagePreview(
    preview,
    item.imageUrl,
    item.imageAlt,
    config.imageUpload.emptyLabel,
    item.variant
  );

  return wrap;
}

function syncAdminImagePreview(itemNode, kind) {
  const config = ADMIN_SECTION_CONFIG[kind];
  if (!config.imageUpload || !itemNode) return;

  const preview = itemNode.querySelector("[data-admin-image-preview]");
  const imageUrlInput = itemNode.querySelector('input[name="imageUrl"]');
  const imageAltInput = itemNode.querySelector('input[name="imageAlt"]');
  const variantInput = itemNode.querySelector('[name="variant"]');

  renderAdminImagePreview(
    preview,
    imageUrlInput ? imageUrlInput.value : "",
    imageAltInput ? imageAltInput.value : "",
    config.imageUpload.emptyLabel,
    variantInput ? variantInput.value : "artwork"
  );
}

function toggleAdminUploadControls(itemNode, disabled) {
  if (!itemNode) return;
  itemNode.querySelectorAll("[data-admin-upload-control]").forEach((control) => {
    control.disabled = disabled;
  });
}

async function uploadAdminImage(kind, itemNode, file, context, status) {
  const config = ADMIN_SECTION_CONFIG[kind];
  if (!context.storage || !context.isAuthorized) {
    setStatusMessage(
      status,
      "Sign in with an approved admin account before uploading images.",
      "error"
    );
    return;
  }

  if (!file || !file.type || !file.type.startsWith("image/")) {
    setStatusMessage(status, "Choose an image file to upload.", "error");
    return;
  }

  if (file.size > 8 * 1024 * 1024) {
    setStatusMessage(status, "Choose an image smaller than 8 MB.", "error");
    return;
  }

  const idInput = itemNode.querySelector('input[name="id"]');
  const imageUrlInput = itemNode.querySelector('input[name="imageUrl"]');
  const imageAltInput = itemNode.querySelector('input[name="imageAlt"]');
  const titleInput = itemNode.querySelector(
    'input[name="title"], input[name="label"]'
  );
  const uploadTrigger = itemNode.querySelector(
    "button[data-admin-upload-trigger]"
  );

  if (!idInput || !imageUrlInput || !imageAltInput) {
    setStatusMessage(
      status,
      "Image upload fields are missing from this item.",
      "error"
    );
    return;
  }

  if (!trimString(idInput.value)) {
    idInput.value = createItemId(kind);
  }

  const storagePath = `site-content/${config.imageUpload.folder}/${idInput.value}/${Date.now()}-${sanitizeFileName(
    file.name
  )}`;

  toggleAdminUploadControls(itemNode, true);
  if (uploadTrigger) {
    uploadTrigger.dataset.defaultLabel = uploadTrigger.textContent;
    uploadTrigger.textContent = "Uploading...";
    uploadTrigger.setAttribute("aria-busy", "true");
  }
  setStatusMessage(status, "Uploading image...", "");

  try {
    const snapshot = await context.storage.ref(storagePath).put(file, {
      contentType: file.type,
      cacheControl: "public,max-age=31536000,immutable",
    });
    imageUrlInput.value = await snapshot.ref.getDownloadURL();

    if (!trimString(imageAltInput.value)) {
      const title = titleInput ? trimString(titleInput.value) : "";
      imageAltInput.value = title
        ? `${config.itemLabel} image for ${title}`
        : `${config.itemLabel} image`;
    }

    syncAdminImagePreview(itemNode, kind);
    setStatusMessage(
      status,
      "Image uploaded. Save changes to publish it.",
      "success"
    );
  } catch (error) {
    console.error(`Unable to upload ${kind} image.`, error);
    setStatusMessage(
      status,
      "Image upload failed. Check Firebase Storage setup and rules.",
      "error"
    );
  } finally {
    toggleAdminUploadControls(itemNode, false);
    if (uploadTrigger) {
      uploadTrigger.textContent = uploadTrigger.dataset.defaultLabel;
      uploadTrigger.removeAttribute("aria-busy");
    }
  }
}

function buildAdminItem(kind, item, index, total, context) {
  const config = ADMIN_SECTION_CONFIG[kind];
  const article = createElement("article", "admin-item");
  article.dataset.index = String(index);

  const idInput = document.createElement("input");
  idInput.type = "hidden";
  idInput.name = "id";
  idInput.value = item.id || createItemId(kind);
  idInput.setAttribute("data-field", "true");
  article.appendChild(idInput);

  const top = createElement("div", "admin-item-top");
  const itemName = trimString(item.label) || trimString(item.title);
  const title = itemName || `${config.itemLabel} ${index + 1}`;
  const heading = createElement("div", "admin-item-heading");
  heading.appendChild(
    createElement(
      "span",
      "admin-item-order",
      String(index + 1).padStart(2, "0")
    )
  );
  heading.appendChild(createElement("h3", "admin-item-title", title));
  top.appendChild(heading);

  const controls = createElement("div", "admin-item-controls");
  const moveUp = createElement("button", "admin-mini-btn", "Up");
  moveUp.type = "button";
  moveUp.dataset.adminAction = "move-up";
  moveUp.disabled = index === 0;
  moveUp.setAttribute("aria-label", `Move ${title} up`);
  controls.appendChild(moveUp);

  const moveDown = createElement("button", "admin-mini-btn", "Down");
  moveDown.type = "button";
  moveDown.dataset.adminAction = "move-down";
  moveDown.disabled = index === total - 1;
  moveDown.setAttribute("aria-label", `Move ${title} down`);
  controls.appendChild(moveDown);

  const remove = createElement("button", "admin-mini-btn admin-mini-btn-danger", "Remove");
  remove.type = "button";
  remove.dataset.adminAction = "remove";
  remove.setAttribute("aria-label", `Remove ${title}`);
  controls.appendChild(remove);

  top.appendChild(controls);
  article.appendChild(top);

  const content = createElement(
    "div",
    config.imageUpload ? "admin-item-content has-image" : "admin-item-content"
  );
  const imageTools = buildAdminImageTools(kind, item, context);
  if (imageTools) {
    content.appendChild(imageTools);
  }

  const fieldGrid = createElement("div", "admin-fields");
  config.fields.forEach((field) => {
    fieldGrid.appendChild(buildAdminField(field, item[field.key]));
  });
  content.appendChild(fieldGrid);
  article.appendChild(content);

  return article;
}

function renderAdminList(kind, items, context) {
  const config = ADMIN_SECTION_CONFIG[kind];
  const list = document.getElementById(config.listId);
  if (!list) return;

  list.replaceChildren();

  if (!items.length) {
    list.appendChild(createElement("p", "admin-empty", config.emptyText));
    return;
  }

  items.forEach((item, index) => {
    list.appendChild(buildAdminItem(kind, item, index, items.length, context));
  });
}

function collectAdminItems(kind) {
  const config = ADMIN_SECTION_CONFIG[kind];
  const list = document.getElementById(config.listId);
  if (!list) return [];

  const items = [];
  list.querySelectorAll(".admin-item").forEach((article) => {
    const payload = {};
    article.querySelectorAll("[data-field]").forEach((field) => {
      payload[field.name] = field.value;
    });
    items.push(config.normalize(payload));
  });

  return items;
}

function renderAllAdminLists(context) {
  Object.keys(ADMIN_SECTION_CONFIG).forEach((kind) => {
    renderAdminList(kind, context.state[kind], context);
  });
}

function getUserLabel(user) {
  return user.email || user.displayName || user.uid;
}

async function loadAdminState(context) {
  const defaults = cloneDefaults();

  const [homepageSnapshot, linksSnapshot] = await Promise.all([
    getHomepageDoc(context.db).get(),
    getLinksDoc(context.db).get(),
  ]);

  const homepageData = homepageSnapshot.exists ? homepageSnapshot.data() || {} : {};
  const linksData = linksSnapshot.exists ? linksSnapshot.data() || {} : {};

  context.state.events = Object.prototype.hasOwnProperty.call(
    homepageData,
    "events"
  )
    ? (Array.isArray(homepageData.events) ? homepageData.events : []).map(
        normalizeEventItem
      )
    : defaults.homepage.events.map(normalizeEventItem);

  context.state.releases = Object.prototype.hasOwnProperty.call(
    homepageData,
    "releases"
  )
    ? (Array.isArray(homepageData.releases) ? homepageData.releases : []).map(
        normalizeReleaseItem
      )
    : defaults.homepage.releases.map(normalizeReleaseItem);

  context.state.links = Object.prototype.hasOwnProperty.call(linksData, "items")
    ? (Array.isArray(linksData.items) ? linksData.items : []).map(
        normalizeLinkItem
      )
    : defaults.links.items.map(normalizeLinkItem);

  renderAllAdminLists(context);
}

function syncAdminStateFromDom(kind, context) {
  context.state[kind] = collectAdminItems(kind);
}

function reorderItem(items, fromIndex, toIndex) {
  const copy = items.slice();
  const [item] = copy.splice(fromIndex, 1);
  copy.splice(toIndex, 0, item);
  return copy;
}

function bindAdminListControls(kind, context) {
  const config = ADMIN_SECTION_CONFIG[kind];
  const list = document.getElementById(config.listId);
  const addButton = document.getElementById(config.addButtonId);
  const saveButton = document.getElementById(config.saveButtonId);
  const status = document.getElementById(config.statusId);

  if (!list || !addButton || !saveButton || !status) return;

  list.addEventListener("click", (event) => {
    const uploadTrigger = event.target.closest("button[data-admin-upload-trigger]");
    if (uploadTrigger) {
      const itemNode = uploadTrigger.closest(".admin-item");
      const fileInput = itemNode
        ? itemNode.querySelector('input[data-admin-image-file="true"]')
        : null;
      if (fileInput) {
        fileInput.click();
      } else {
        setStatusMessage(
          status,
          "Image uploads are available only when Firebase Storage is ready.",
          "error"
        );
      }
      return;
    }

    const clearTrigger = event.target.closest("button[data-admin-clear-image]");
    if (clearTrigger) {
      const itemNode = clearTrigger.closest(".admin-item");
      if (!itemNode) return;

      const imageUrlInput = itemNode.querySelector('input[name="imageUrl"]');
      const imageAltInput = itemNode.querySelector('input[name="imageAlt"]');
      if (imageUrlInput) {
        imageUrlInput.value = "";
      }
      if (imageAltInput) {
        imageAltInput.value = "";
      }
      syncAdminImagePreview(itemNode, kind);
      setStatusMessage(
        status,
        "Image cleared. Save changes to publish it.",
        "success"
      );
      return;
    }

    const actionButton = event.target.closest("button[data-admin-action]");
    if (!actionButton) return;

    const itemNode = actionButton.closest(".admin-item");
    if (!itemNode) return;

    syncAdminStateFromDom(kind, context);

    const index = Number(itemNode.dataset.index);
    const action = actionButton.dataset.adminAction;

    if (action === "remove") {
      context.state[kind].splice(index, 1);
    } else if (action === "move-up" && index > 0) {
      context.state[kind] = reorderItem(context.state[kind], index, index - 1);
    } else if (
      action === "move-down" &&
      index < context.state[kind].length - 1
    ) {
      context.state[kind] = reorderItem(context.state[kind], index, index + 1);
    }

    renderAdminList(kind, context.state[kind], context);
    setStatusMessage(status, "", "");
  });

  list.addEventListener("input", (event) => {
    const target = event.target;
    if (
      !target ||
      !target.matches ||
      !target.matches(
        'input[name="imageUrl"], input[name="imageAlt"], input[name="title"], input[name="label"], select[name="variant"]'
      )
    ) {
      return;
    }

    syncAdminImagePreview(target.closest(".admin-item"), kind);
  });

  list.addEventListener("change", (event) => {
    const target = event.target;
    if (
      !target ||
      !target.matches ||
      !target.matches('input[data-admin-image-file="true"]')
    ) {
      return;
    }

    const [file] = target.files || [];
    const itemNode = target.closest(".admin-item");
    if (!itemNode) return;

    void uploadAdminImage(kind, itemNode, file, context, status).finally(() => {
      target.value = "";
    });
  });

  addButton.addEventListener("click", () => {
    syncAdminStateFromDom(kind, context);
    context.state[kind].push(config.createEmptyItem());
    renderAdminList(kind, context.state[kind], context);
    setStatusMessage(status, "", "");
  });

  saveButton.addEventListener("click", async () => {
    if (!context.db || !context.isAuthorized) {
      setStatusMessage(
        status,
        "Sign in with an approved admin account before saving.",
        "error"
      );
      return;
    }

    const collectedItems = collectAdminItems(kind);
    const cleanedItems = collectedItems.filter((item) => !config.isBlank(item));

    for (let index = 0; index < cleanedItems.length; index += 1) {
      const message = config.validate(cleanedItems[index], index);
      if (message) {
        setStatusMessage(status, message, "error");
        return;
      }
    }

    const payload = cleanedItems.map(config.finalize);
    saveButton.disabled = true;
    const defaultSaveLabel = saveButton.textContent;
    saveButton.textContent = "Saving...";
    saveButton.setAttribute("aria-busy", "true");
    setStatusMessage(status, "Saving...", "");

    try {
      await config.save(context.db, payload);
      context.state[kind] = payload.map(config.normalize);
      renderAdminList(kind, context.state[kind], context);
      setStatusMessage(status, "Saved.", "success");
    } catch (error) {
      console.error(`Unable to save ${kind}.`, error);
      setStatusMessage(
        status,
        "Save failed. Check Firebase rules and try again.",
        "error"
      );
    } finally {
      saveButton.disabled = false;
      saveButton.textContent = defaultSaveLabel;
      saveButton.removeAttribute("aria-busy");
    }
  });
}

async function handleAdminAuthState(user, context, elements) {
  if (!user) {
    context.isAuthorized = false;
    context.state = {
      events: [],
      releases: [],
      links: [],
    };
    elements.editors.hidden = true;
    elements.signInBtn.hidden = false;
    elements.signOutBtn.hidden = true;
    setStatusMessage(
      elements.authStatus,
      "Sign in with your approved Google account to start editing.",
      ""
    );
    elements.sessionMeta.textContent = "";
    return;
  }

  elements.signInBtn.hidden = true;
  elements.signOutBtn.hidden = false;
  setStatusMessage(elements.authStatus, "Checking admin access...", "");
  elements.sessionMeta.textContent = `Signed in as ${getUserLabel(user)}`;

  try {
    const adminSnapshot = await context.db.collection("adminUsers").doc(user.uid).get();
    if (!adminSnapshot.exists) {
      context.isAuthorized = false;
      elements.editors.hidden = true;
      setStatusMessage(
        elements.authStatus,
        `This account is not allowed yet. Add a Firestore document at adminUsers/${user.uid}.`,
        "error"
      );
      elements.sessionMeta.textContent = `Signed in as ${getUserLabel(
        user
      )} | UID: ${user.uid}`;
      return;
    }

    context.isAuthorized = true;
    await loadAdminState(context);
    elements.editors.hidden = false;
    setStatusMessage(elements.authStatus, "Admin access confirmed.", "success");
  } catch (error) {
    context.isAuthorized = false;
    elements.editors.hidden = true;
    console.error("Unable to verify admin access.", error);
    setStatusMessage(
      elements.authStatus,
      "Admin check failed. Verify Firestore rules and Auth setup.",
      "error"
    );
  }
}

async function initAdminPage() {
  const elements = getAdminElements();
  if (!elements.root) return;

  const context = {
    auth: null,
    db: null,
    storage: null,
    isAuthorized: false,
    state: {
      events: [],
      releases: [],
      links: [],
    },
  };

  Object.keys(ADMIN_SECTION_CONFIG).forEach((kind) => {
    bindAdminListControls(kind, context);
  });

  const firebaseNamespace = await loadFirebaseSdk();
  if (
    !firebaseNamespace ||
    !firebaseNamespace.auth ||
    !firebaseNamespace.firestore ||
    !Array.isArray(firebaseNamespace.apps) ||
    !firebaseNamespace.apps.length
  ) {
    elements.signInBtn.disabled = true;
    setStatusMessage(
      elements.authStatus,
      "Firebase Auth is available here only when the site is served from Firebase Hosting.",
      "error"
    );
    return;
  }

  context.auth = firebaseNamespace.auth();
  context.db = firebaseNamespace.firestore();
  try {
    context.storage =
      typeof firebaseNamespace.storage === "function"
        ? firebaseNamespace.storage()
        : null;
  } catch (error) {
    console.error("Firebase Storage is not available.", error);
    context.storage = null;
  }

  elements.signInBtn.addEventListener("click", async () => {
    const provider = new firebaseNamespace.auth.GoogleAuthProvider();
    provider.setCustomParameters({ prompt: "select_account" });

    try {
      setStatusMessage(elements.authStatus, "Opening Google sign-in...", "");
      await context.auth.signInWithPopup(provider);
    } catch (error) {
      if (error && error.code === "auth/popup-blocked") {
        await context.auth.signInWithRedirect(provider);
        return;
      }
      if (error && error.code === "auth/popup-closed-by-user") {
        setStatusMessage(
          elements.authStatus,
          "Sign-in popup was closed before the login finished.",
          "error"
        );
        return;
      }
      console.error("Google sign-in failed.", error);
      setStatusMessage(
        elements.authStatus,
        "Google sign-in failed. Check your Firebase Auth provider settings.",
        "error"
      );
    }
  });

  elements.signOutBtn.addEventListener("click", async () => {
    try {
      await context.auth.signOut();
    } catch (error) {
      console.error("Unable to sign out.", error);
      setStatusMessage(
        elements.authStatus,
        "Sign-out failed. Refresh and try again.",
        "error"
      );
    }
  });

  context.auth.onAuthStateChanged((user) => {
    handleAdminAuthState(user, context, elements);
  });
}

(function () {
  const mainA = document.getElementById("g-main-a");
  const mainB = document.getElementById("g-main-b");
  const cap = document.getElementById("g-cap");
  const thumbsWrap = document.getElementById("gallery-thumbs");
  const galleryMain = document.querySelector(".gallery-main");
  const about = document.querySelector(".about-hero");
  const toggle = document.getElementById("aboutToggle");
  let unmuteBtn;

  let expanded = false;
  function applyAbout() {
    if (!about || !toggle) return;
    about.classList.toggle("expanded", expanded);
    toggle.textContent = expanded ? "Show Less" : "Show More";
    toggle.setAttribute("aria-expanded", expanded ? "true" : "false");
  }
  if (toggle) {
    toggle.addEventListener("click", () => {
      expanded = !expanded;
      applyAbout();
    });
  }

  if (!mainA || !mainB || !cap || !thumbsWrap || !galleryMain) return;

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
    thumbsWrap.innerHTML = "";
    GALLERY_ITEMS.forEach((item, idx) => {
      const thumbItem = document.createElement("div");
      thumbItem.className = "thumb-item";
      thumbItem.setAttribute("role", "listitem");
      const pic = document.createElement("picture");
      const match = item[0].match(
        /assets\/gallery\/(\d+)\.(?:webp|avif|png|jpg|jpeg)$/i
      );
      if (match && match[1] !== "1") {
        const source = document.createElement("source");
        source.type = "image/avif";
        source.srcset = `optimized/gallery-${match[1]}-120.avif`;
        pic.appendChild(source);
      }

      const thumb = document.createElement("button");
      thumb.type = "button";
      thumb.className = "thumb" + (idx === i ? " active" : "");
      thumb.setAttribute(
        "aria-label",
        item[2] ? `Play video: ${item[1]}` : `Show image: ${item[1]}`
      );
      thumb.setAttribute("aria-pressed", idx === i ? "true" : "false");
      if (Array.isArray(item) && item[2] && !match) {
        thumb.dataset.video = item[2];
        thumb.classList.add("video-thumb");
      }

      const img = new Image();
      img.src = item[0];
      img.alt = "";
      img.loading = "lazy";
      img.decoding = "async";
      img.width = 120;
      img.height = 120;

      thumb.addEventListener("click", () => {
        if (thumb.dataset.video) {
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
          video.width = 360;
          video.height = 640;
          video.setAttribute("aria-label", item[1] || "Video");
          const s1 = document.createElement("source");
          s1.src = "optimized/video/shell-av1.webm";
          s1.type = "video/webm";
          video.appendChild(s1);
          const s2 = document.createElement("source");
          s2.src = "optimized/video/shell-vp9.webm";
          s2.type = "video/webm";
          video.appendChild(s2);
          const s3 = document.createElement("source");
          s3.src = thumb.dataset.video;
          s3.type = "video/mp4";
          video.appendChild(s3);
          galleryMain.appendChild(video);
          showUnmuteBtn(true, true);
          i = idx;
          pauseThenResume();
          setCaption(item[1] || "");
          markActiveThumb();
        } else {
          removeExistingVideo();
          goTo(idx);
          pauseThenResume();
        }
      });
      pic.appendChild(img);
      thumb.appendChild(pic);
      thumbItem.appendChild(thumb);
      thumbsWrap.appendChild(thumbItem);
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

  function slideSwap(nextIdx) {
    if (!active || !standby) return;
    const next = GALLERY_ITEMS[nextIdx % GALLERY_ITEMS.length];

    standby.classList.remove("is-active", "to-left");
    standby.src = next[0];
    standby.alt = next[1];
    void standby.offsetWidth;
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
    thumbsWrap.querySelectorAll(".thumb").forEach((el, idx) => {
      const isActive = idx === i;
      el.classList.toggle("active", isActive);
      el.setAttribute("aria-pressed", isActive ? "true" : "false");
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

  renderInitial();
  startTimer();
})();

document.addEventListener("click", (e) => {
  const el = e.target.closest("a, button, .thumb");
  if (!el || typeof gtag !== "function") return;
  const label =
    el.getAttribute("href") ||
    el.getAttribute("aria-label") ||
    el.getAttribute("alt") ||
    el.id ||
    (el.textContent || "").trim();
  gtag("event", "interaction", {
    event_category: "site",
    event_label: label,
  });
});

(function () {
  const btn = document.getElementById("dockToggle");
  const nav = document.getElementById("dockNav");
  if (!btn || !nav) return;
  btn.addEventListener("click", () => {
    const open = document.body.classList.toggle("dock-open");
    btn.setAttribute("aria-expanded", open);
  });
  nav.querySelectorAll("a").forEach((anchor) => {
    anchor.addEventListener("click", () => {
      document.body.classList.remove("dock-open");
      btn.setAttribute("aria-expanded", "false");
    });
  });
})();

void initPublicFirestoreContent();
void initAdminPage();
