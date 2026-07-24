const navToggle = document.getElementById("navToggle");
const mainNav = document.querySelector(".main-nav");

navToggle.addEventListener("click", () => {
  mainNav.classList.toggle("open");
});

mainNav.querySelectorAll("a").forEach((link) => {
  link.addEventListener("click", () => {
    mainNav.classList.remove("open");
  });
});

const filterContainer = document.getElementById("projectFilters");
const filterAllRow = document.getElementById("filterAllRow");
const projectCards = document.querySelectorAll(".project-card");

function tagToTypeName(tag) {
  const specialCases = {
    "C++": "CPlusPlus",
    "C#": "CSharp",
  };
  if (specialCases[tag]) {
    return specialCases[tag];
  }
  return tag.replace(/[^a-zA-Z0-9]/g, "");
}

const FILTER_CATEGORIES = [
  { label: "Engines", tags: ["Unreal Engine 5", "Unity", "RPG Maker 2003", "School Engine"] },
  { label: "Languages and APIs", tags: ["C++", "C#", "Python", "Vulkan"] },
  { label: "Role", tags: ["Programming", "Graphics Programming", "AI Programming", "Engine Programming", "Gameplay Programming", "Game Design", "Client Work", "Team Project"] },
  { label: "Status", tags: ["In Progress", "Files Unavailable"] },
];

const STATUS_TAGS = ["In Progress", "Files Unavailable"];

if (filterContainer && projectCards.length) {
  const tagSet = new Set();
  projectCards.forEach((card) => {
    card.querySelectorAll(".tag-list-mono li").forEach((li) => {
      tagSet.add(li.textContent.trim());
    });
  });

  const allBtn = document.createElement("button");
  allBtn.className = "filter-btn filter-all active";
  allBtn.type = "button";
  allBtn.textContent = "All";
  allBtn.dataset.tag = "all";
  if (filterAllRow) {
    filterAllRow.appendChild(allBtn);
  }

  const categorized = new Set();

  FILTER_CATEGORIES.forEach((category) => {
    const tagsPresent = category.tags.filter((tag) => tagSet.has(tag));
    if (!tagsPresent.length) {
      return;
    }
    const group = document.createElement("div");
    group.className = "filter-category";

    const label = document.createElement("span");
    label.className = "filter-category-label";
    label.textContent = category.label;
    group.appendChild(label);

    const row = document.createElement("div");
    row.className = "filter-category-tags";
    tagsPresent.forEach((tag) => {
      const btn = document.createElement("button");
      btn.className = STATUS_TAGS.includes(tag) ? "filter-btn filter-btn-status" : "filter-btn";
      btn.type = "button";
      btn.textContent = tag;
      btn.dataset.tag = tag;
      row.appendChild(btn);
      categorized.add(tag);
    });
    group.appendChild(row);
    filterContainer.appendChild(group);
  });

  const leftoverTags = Array.from(tagSet).filter((tag) => !categorized.has(tag)).sort();
  if (leftoverTags.length) {
    const group = document.createElement("div");
    group.className = "filter-category";
    const label = document.createElement("span");
    label.className = "filter-category-label";
    label.textContent = "Other";
    group.appendChild(label);
    const row = document.createElement("div");
    row.className = "filter-category-tags";
    leftoverTags.forEach((tag) => {
      const btn = document.createElement("button");
      btn.className = "filter-btn";
      btn.type = "button";
      btn.textContent = tag;
      btn.dataset.tag = tag;
      row.appendChild(btn);
    });
    group.appendChild(row);
    filterContainer.appendChild(group);
  }

  const selectedTags = new Set();

  function updateCommandText() {
    const commandText = document.getElementById("filterCommandText");
    if (!commandText) {
      return;
    }
    if (selectedTags.size === 0) {
      commandText.textContent = "FindObjectsByType<GameObject>()";
      return;
    }
    const typeNames = Array.from(selectedTags).map(tagToTypeName).join(", ");
    commandText.textContent = "FindObjectsByType<" + typeNames + ">()";
  }

  function applyFilters() {
    projectCards.forEach((card) => {
      if (selectedTags.size === 0) {
        card.classList.remove("hidden");
        return;
      }
      const cardTags = Array.from(card.querySelectorAll(".tag-list-mono li")).map((li) => li.textContent.trim());
      const matches = cardTags.some((tag) => selectedTags.has(tag));
      card.classList.toggle("hidden", !matches);
    });

    document.querySelectorAll(".project-tier").forEach((tier) => {
      const visibleCount = tier.querySelectorAll(".project-card:not(.hidden)").length;
      tier.classList.toggle("hidden", visibleCount === 0);
    });
  }

  function updateButtonStates() {
    allBtn.classList.toggle("active", selectedTags.size === 0);
    filterContainer.querySelectorAll(".filter-btn:not(.filter-all)").forEach((btn) => {
      btn.classList.toggle("active", selectedTags.has(btn.dataset.tag));
    });
  }

  function handleFilterClick(event) {
    const btn = event.target.closest(".filter-btn");
    if (!btn) {
      return;
    }

    if (btn.dataset.tag === "all") {
      selectedTags.clear();
    } else if (selectedTags.has(btn.dataset.tag)) {
      selectedTags.delete(btn.dataset.tag);
    } else {
      selectedTags.add(btn.dataset.tag);
    }

    updateButtonStates();
    applyFilters();
    updateCommandText();
  }

  filterContainer.addEventListener("click", handleFilterClick);
  if (filterAllRow) {
    filterAllRow.addEventListener("click", handleFilterClick);
  }
}

const progressBar = document.getElementById("scrollProgress");

function updateScrollProgress() {
  const scrollTop = window.scrollY;
  const docHeight = document.documentElement.scrollHeight - window.innerHeight;
  const pct = docHeight > 0 ? (scrollTop / docHeight) * 100 : 0;
  progressBar.style.width = pct + "%";
}

window.addEventListener("scroll", updateScrollProgress);
updateScrollProgress();

const revealTargets = document.querySelectorAll(".reveal");
const revealObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (entry.isIntersecting) {
      entry.target.classList.add("in-view");
      revealObserver.unobserve(entry.target);
    }
  });
}, { threshold: 0.15 });

revealTargets.forEach((el) => revealObserver.observe(el));

const navSections = document.querySelectorAll("section[id]");
const navLinks = document.querySelectorAll(".main-nav a");

const sectionObserver = new IntersectionObserver((entries) => {
  entries.forEach((entry) => {
    if (!entry.isIntersecting) {
      return;
    }
    navLinks.forEach((link) => {
      link.classList.toggle("active", link.getAttribute("href") === "#" + entry.target.id);
    });
  });
}, { rootMargin: "-40% 0px -50% 0px" });

navSections.forEach((section) => sectionObserver.observe(section));

const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;

document.querySelectorAll(".project-media[data-images]").forEach((frame) => {
  const img = frame.querySelector("img");
  if (!img || prefersReducedMotion) {
    return;
  }
  const extraFrames = frame.dataset.images.split(",").map((src) => src.trim()).filter(Boolean);
  const frames = [img.getAttribute("src"), ...extraFrames];
  if (frames.length < 2) {
    return;
  }
  let index = 0;
  setInterval(() => {
    index = (index + 1) % frames.length;
    img.style.opacity = "0";
    setTimeout(() => {
      img.setAttribute("src", frames[index]);
      img.style.opacity = "1";
    }, 350);
  }, 4000);
});

function typeText(el, text, speed) {
  return new Promise((resolve) => {
    el.textContent = "";
    el.classList.add("typing-cursor");
    let i = 0;
    let skipped = false;

    function finish() {
      if (skipped) {
        return;
      }
      skipped = true;
      el.textContent = text;
      el.classList.remove("typing-cursor");
      window.removeEventListener("keydown", finish);
      window.removeEventListener("click", finish);
      resolve();
    }

    function step() {
      if (skipped) {
        return;
      }
      if (i <= text.length) {
        el.textContent = text.slice(0, i);
        i++;
        setTimeout(step, speed);
      } else {
        finish();
      }
    }

    window.addEventListener("keydown", finish);
    window.addEventListener("click", finish);
    step();
  });
}

async function runBootSequence() {
  const roleEl = document.querySelector(".hero-role");
  const nameEl = document.querySelector(".hero-name");
  if (!roleEl || !nameEl) {
    return;
  }
  if (prefersReducedMotion) {
    roleEl.classList.remove("boot-pending");
    nameEl.classList.remove("boot-pending");
    return;
  }
  const roleText = roleEl.textContent;
  const nameText = nameEl.textContent;
  roleEl.classList.remove("boot-pending");
  await typeText(roleEl, roleText, 22);
  nameEl.classList.remove("boot-pending");
  await typeText(nameEl, nameText, 30);
}

runBootSequence();
