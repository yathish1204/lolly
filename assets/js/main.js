// FAQ - Toggler
document.addEventListener("DOMContentLoaded", () => {
  const faqToggles = document.querySelectorAll(
    ".faq-toggle, .accordion-header",
  );

  const PlusSvg = `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;
  const MinusSvg = `<svg class="w-4 h-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.5" stroke-linecap="round" stroke-linejoin="round"><line x1="5" y1="12" x2="19" y2="12"></line></svg>`;

  faqToggles.forEach((toggle) => {
    toggle.addEventListener("click", () => {
      const item = toggle.closest(".faq-item");
      const answer = item.querySelector(".faq-answer, .accordion-body");
      const icon = toggle.querySelector(".faq-icon, .accordion-icon");
      const isExpanded = toggle.getAttribute("aria-expanded") === "true";

      // Close all other open accordion items
      faqToggles.forEach((otherToggle) => {
        if (otherToggle !== toggle) {
          otherToggle.setAttribute("aria-expanded", "false");
          const otherAnswer = otherToggle
            .closest(".faq-item")
            .querySelector(".faq-answer, .accordion-body");
          const otherIcon = otherToggle.querySelector(
            ".faq-icon, .accordion-icon",
          );
          if (otherAnswer) {
            otherAnswer.style.maxHeight = "0px";
            otherAnswer.classList.add("opacity-0");
          }
          if (otherIcon) {
            otherIcon.innerHTML = PlusSvg;
            otherIcon.classList.remove("bg-lolly-purple", "text-white");
            otherIcon.classList.add("bg-slate-100", "text-slate-700");
          }
        }
      });

      // Toggle current item
      if (isExpanded) {
        toggle.setAttribute("aria-expanded", "false");
        answer.style.maxHeight = "0px";
        answer.classList.add("opacity-0");
        icon.innerHTML = PlusSvg;
        icon.classList.remove("bg-lolly-purple", "text-white");
        icon.classList.add("bg-slate-100", "text-white");
      } else {
        toggle.setAttribute("aria-expanded", "true");
        answer.style.maxHeight = answer.scrollHeight + "px";
        answer.classList.remove("opacity-0");
        icon.innerHTML = MinusSvg;
        icon.classList.remove("bg-slate-100", "text-white");
        icon.classList.add("bg-lolly-purple", "text-white");
      }
    });
  });
});

// Meet Ana - Chat Animation
document.addEventListener("DOMContentLoaded", () => {
  const userMsg = document.getElementById("ana-user-msg");
  const thinkingBubble = document.getElementById("ana-thinking-bubble");
  const responseCard = document.getElementById("ana-response-card");

  function runAnaChatSequence() {
    if (!userMsg || !thinkingBubble || !responseCard) return;

    userMsg.classList.add("opacity-0", "translate-y-3");
    thinkingBubble.classList.add("opacity-0", "translate-y-3");
    responseCard.classList.add("hidden", "opacity-0", "translate-y-3");

    // User message
    setTimeout(() => {
      userMsg.classList.remove("opacity-0", "translate-y-3");
    }, 400);

    // "Ana is thinking..." loading indicator
    setTimeout(() => {
      thinkingBubble.classList.remove("opacity-0", "translate-y-3");
    }, 1200);

    // Response card
    setTimeout(() => {
      thinkingBubble.classList.add("opacity-0");
      setTimeout(() => {
        thinkingBubble.classList.add("hidden");
        responseCard.classList.remove("hidden");
        setTimeout(() => {
          responseCard.classList.remove("opacity-0", "translate-y-3");
        }, 50);
      }, 300);
    }, 3000);
  }

  // Trigger animation on page load
  const observer = new IntersectionObserver(
    (entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          runAnaChatSequence();
          observer.disconnect();
        }
      });
    },
    { threshold: 0.3 },
  );

  const section = document.getElementById("meet-ana");
  if (section) observer.observe(section);
});

// Mobile Drawer Functionality
document.addEventListener("DOMContentLoaded", () => {
  const toggleBtn = document.getElementById("menu-toggle-btn");
  const closeBtn = document.getElementById("menu-close-btn");
  const drawer = document.getElementById("mobile-drawer");
  const desktopNavLinks = document.querySelectorAll(".nav-link");
  const mobileNavLinks = document.querySelectorAll(".mobile-nav-link");
  const allNavLinks = [...desktopNavLinks, ...mobileNavLinks];

  function openDrawer() {
    drawer.classList.remove(
      "translate-x-full",
      "pointer-events-none",
      "opacity-0",
    );
    drawer.classList.add("translate-x-0", "pointer-events-auto", "opacity-100");
    document.body.classList.add("overflow-hidden");
  }

  function closeDrawer() {
    drawer.classList.remove(
      "translate-x-0",
      "pointer-events-auto",
      "opacity-100",
    );
    drawer.classList.add(
      "translate-x-full",
      "pointer-events-none",
      "opacity-0",
    );
    document.body.classList.remove("overflow-hidden");
  }

  if (toggleBtn) toggleBtn.addEventListener("click", openDrawer);
  if (closeBtn) closeBtn.addEventListener("click", closeDrawer);

  function setActiveNavLink(targetHref) {
    allNavLinks.forEach((link) => {
      const href = link.getAttribute("href");
      if (targetHref && href === targetHref) {
        link.classList.add("active");
        link.setAttribute("aria-current", "page");
      } else if (href && href.startsWith("#")) {
        link.classList.remove("active");
        link.removeAttribute("aria-current");
      }
    });
  }

  // Track sections corresponding to the nav links
  const navSectionIds = [
    "why-it-matters",
    "how-it-works",
    "meet-ana",
    "built-for-teams",
  ];
  const navSections = navSectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  let isNavClickScrolling = false;
  let navClickTimeout = null;

  function updateActiveNavOnScroll() {
    if (isNavClickScrolling) return;

    const scrollThreshold = window.innerWidth >= 640 ? 140 : 100;
    let currentSectionId = null;

    const firstSection = navSections[0];
    if (
      firstSection &&
      firstSection.getBoundingClientRect().top > scrollThreshold
    ) {
      setActiveNavLink(null);
      return;
    }

    // Identify which section is currently active
    for (let i = 0; i < navSections.length; i++) {
      const section = navSections[i];
      const rect = section.getBoundingClientRect();
      if (
        rect.top <= scrollThreshold + 2 &&
        rect.bottom > scrollThreshold - 2
      ) {
        currentSectionId = "#" + section.id;
        break;
      }
    }

    setActiveNavLink(currentSectionId);
  }

  // Click handler with scroll suppression to avoid flicker
  allNavLinks.forEach((link) => {
    link.addEventListener("click", () => {
      const href = link.getAttribute("href");
      if (href && href.startsWith("#") && href.length > 1) {
        setActiveNavLink(href);
        isNavClickScrolling = true;
        clearTimeout(navClickTimeout);
        navClickTimeout = setTimeout(() => {
          isNavClickScrolling = false;
          updateActiveNavOnScroll();
        }, 800);
      }
      if (link.classList.contains("mobile-nav-link")) {
        closeDrawer();
      }
    });
  });

  // Passive scroll listener with requestAnimationFrame throttling
  let isNavTicking = false;
  window.addEventListener(
    "scroll",
    () => {
      if (!isNavTicking) {
        window.requestAnimationFrame(() => {
          updateActiveNavOnScroll();
          isNavTicking = false;
        });
        isNavTicking = true;
      }
    },
    { passive: true },
  );

  // Initial check on page load
  if (window.location.hash) {
    setActiveNavLink(window.location.hash);
  } else {
    updateActiveNavOnScroll();
  }
});

// Sticky Scrolling functionality
document.addEventListener("DOMContentLoaded", () => {
  const teamsData = [
    {
      title: "Influencer Teams",
      desc: "See the full history and performance of every creator relationship.",
    },
    {
      title: "Brand Teams",
      desc: "Identify creators worth nurturing, reactivating, and investing in.",
    },
    {
      title: "Content Teams",
      desc: "Track creator content, assets, usage, and rights in context.",
    },
    {
      title: "Marketing Leaders",
      desc: "Understand creator value and ROI across campaigns and channels.",
    },
    {
      title: "Partnership Teams",
      desc: "Build stronger relationships using engagement and performance insights.",
    },
  ];

  const track = document.getElementById("teams-scroll-track");
  const titleEl = document.getElementById("teams-detail-title");
  const descEl = document.getElementById("teams-detail-desc");
  const progressLine = document.getElementById("teams-mobile-progress-line");
  const desktopBtns = document.querySelectorAll(".team-nav-btn");
  const mobileCircles = document.querySelectorAll(".team-step-circle");
  const panels = document.querySelectorAll(".team-panel");

  let currentActiveIndex = 0;
  let isClickScrolling = false;

  function activateTeam(index, fromUserClick = false) {
    if (index < 0 || index >= teamsData.length) return;
    currentActiveIndex = index;

    // Update Title & Description
    if (titleEl) titleEl.textContent = teamsData[index].title;
    if (descEl) descEl.textContent = teamsData[index].desc;

    // Update Desktop / Tablet Navigation Buttons
    desktopBtns.forEach((btn, idx) => {
      const arrow = btn.querySelector(".team-nav-arrow");
      if (idx === index) {
        btn.classList.add(
          "bg-light-purple",
          "active",
          "text-slate-900",
          "shadow-xs",
        );
        btn.classList.remove("text-slate-700", "hover:bg-slate-50");
        if (arrow) arrow.classList.remove("opacity-0");
      } else {
        btn.classList.remove(
          "bg-light-purple",
          "active",
          "bg-[#F0EBFF]",
          "text-slate-900",
          "shadow-xs",
        );
        btn.classList.add("text-slate-700", "hover:bg-slate-50");
        if (arrow) arrow.classList.add("opacity-0");
      }
    });

    // Update Mobile Vertical Stepper Items & Pill Indicators
    mobileCircles.forEach((circle, idx) => {
      const pill = circle.querySelector(".team-step-pill");
      if (idx === index) {
        circle.classList.add("text-lolly-purple", "font-bold", "scale-105");
        circle.classList.remove("text-slate-400", "font-semibold");
        if (pill) {
          pill.classList.remove("opacity-0", "scale-y-50");
          pill.classList.add("opacity-100", "scale-y-100");
        }
      } else {
        circle.classList.remove("text-lolly-purple", "font-bold", "scale-105");
        circle.classList.add("text-slate-400", "font-semibold");
        if (pill) {
          pill.classList.remove("opacity-100", "scale-y-100");
          pill.classList.add("opacity-0", "scale-y-50");
        }
      }
    });

    if (progressLine) {
      progressLine.style.height = `${(index / (teamsData.length - 1)) * 100}%`;
    }

    // Update Panels with cross-fade transition
    panels.forEach((panel, idx) => {
      if (idx === index) {
        panel.classList.remove("opacity-0", "pointer-events-none", "z-0");
        panel.classList.add(
          "opacity-100",
          "translate-y-0",
          "pointer-events-auto",
          "z-10",
        );
      } else {
        panel.classList.remove(
          "opacity-100",
          "translate-y-0",
          "pointer-events-auto",
          "z-10",
        );
        panel.classList.add("opacity-0", "pointer-events-none", "z-0");
      }
    });

    // If clicked, smoothly sync scroll position in the track
    if (fromUserClick && track) {
      isClickScrolling = true;
      const rect = track.getBoundingClientRect();
      const scrollTop =
        window.pageYOffset || document.documentElement.scrollTop;
      const trackTop = rect.top + scrollTop;
      const headerOffset = window.innerWidth >= 640 ? 96 : 80;
      const stickyContainer = document.getElementById("teams-sticky-container");
      const containerHeight = stickyContainer
        ? stickyContainer.offsetHeight
        : window.innerHeight;
      const maxScroll = rect.height - containerHeight - headerOffset;
      if (maxScroll > 0) {
        const targetY =
          trackTop -
          headerOffset +
          ((index + 0.35) / teamsData.length) * maxScroll;
        window.scrollTo({ top: targetY, behavior: "smooth" });
        setTimeout(() => {
          isClickScrolling = false;
        }, 700);
      } else {
        isClickScrolling = false;
      }
    }
  }

  // Add click listeners to desktop buttons
  desktopBtns.forEach((btn) => {
    btn.addEventListener("click", () => {
      const idx = parseInt(btn.getAttribute("data-team-index"), 10);
      activateTeam(idx, true);
    });
  });

  // Add click listeners to mobile step circles
  mobileCircles.forEach((circle) => {
    circle.addEventListener("click", () => {
      const idx = parseInt(circle.getAttribute("data-team-index"), 10);
      activateTeam(idx, true);
    });
  });

  // Scroll-driven listener for sticky container
  let ticking = false;
  function handleScroll() {
    if (!track || isClickScrolling) return;

    const rect = track.getBoundingClientRect();
    const headerOffset = window.innerWidth >= 640 ? 96 : 80;
    const stickyContainer = document.getElementById("teams-sticky-container");
    const containerHeight = stickyContainer
      ? stickyContainer.offsetHeight
      : window.innerHeight;
    const maxScroll = rect.height - containerHeight - headerOffset;
    if (maxScroll <= 0) return;

    const currentScrolled = headerOffset - rect.top;
    if (currentScrolled < 0) {
      if (currentActiveIndex !== 0) activateTeam(0, false);
    } else if (currentScrolled >= maxScroll) {
      if (currentActiveIndex !== teamsData.length - 1) {
        activateTeam(teamsData.length - 1, false);
      }
    } else {
      const progress = currentScrolled / maxScroll;
      const step = Math.min(
        teamsData.length - 1,
        Math.floor(progress * teamsData.length),
      );
      if (step !== currentActiveIndex) {
        activateTeam(step, false);
      }
    }
  }

  window.addEventListener(
    "scroll",
    () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    },
    { passive: true },
  );
});
