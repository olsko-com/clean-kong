/**
 * Clean Kong - Interactive Behavior
 */

document.addEventListener('DOMContentLoaded', () => {
  // --- DOM Elements ---
  const header = document.getElementById('main-header');
  const navToggle = document.getElementById('mobile-nav-toggle');
  const primaryNav = document.getElementById('primary-navigation');
  const navLinks = document.querySelectorAll('.nav-link');
  const sections = document.querySelectorAll('main > section');

  // --- Scroll Effect on Header ---
  const handleHeaderScroll = () => {
    if (window.scrollY > 30) {
      header.classList.add('scrolled');
    } else {
      header.classList.remove('scrolled');
    }
  };

  window.addEventListener('scroll', handleHeaderScroll);
  // Initial check on load
  handleHeaderScroll();

  // --- Responsive Mobile Nav Toggle ---
  const toggleMobileNav = () => {
    const isExpanded = navToggle.getAttribute('aria-expanded') === 'true';
    
    // Toggle state
    navToggle.setAttribute('aria-expanded', !isExpanded);
    primaryNav.classList.toggle('open');
    
    // Prevent scrolling behind menu when open
    document.body.style.overflow = isExpanded ? '' : 'hidden';
  };

  navToggle.addEventListener('click', toggleMobileNav);

  // Close menu when clicking a link
  navLinks.forEach(link => {
    link.addEventListener('click', () => {
      if (primaryNav.classList.contains('open')) {
        toggleMobileNav();
      }
    });
  });

  // Close menu if user presses Escape key
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && primaryNav.classList.contains('open')) {
      toggleMobileNav();
    }
  });

  // Close menu when clicking outside of it
  document.addEventListener('click', (e) => {
    const isClickInsideNav = primaryNav.contains(e.target);
    const isClickOnToggle = navToggle.contains(e.target);
    
    if (!isClickInsideNav && !isClickOnToggle && primaryNav.classList.contains('open')) {
      toggleMobileNav();
    }
  });

  // --- Active Nav Link Sync on Scroll (Intersection Observer) ---
  const observerOptions = {
    root: null, // viewport
    rootMargin: '-20% 0px -70% 0px', // check when elements enter middle screen
    threshold: 0
  };

  const observerCallback = (entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const id = entry.target.getAttribute('id');
        
        // Remove active from all links
        navLinks.forEach(link => {
          link.classList.remove('active');
          if (link.getAttribute('href') === `#${id}`) {
            link.classList.add('active');
          }
        });
      }
    });
  };

  const observer = new IntersectionObserver(observerCallback, observerOptions);
  sections.forEach(section => observer.observe(section));

  // --- Product Category Filter (Version 1 & Version 2) ---
  const filterButtons = document.querySelectorAll('.filter-btn, .v2-filter-link');
  const productCards = document.querySelectorAll('.product-card, .v2-product-item');

  if (filterButtons.length > 0 && productCards.length > 0) {
    filterButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const filterValue = btn.getAttribute('data-filter');

        filterButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        productCards.forEach(card => {
          const category = card.getAttribute('data-category');
          if (filterValue === 'all' || category === filterValue) {
            card.removeAttribute('hidden');
          } else {
            card.setAttribute('hidden', '');
          }
        });
      });
    });
  }

  // --- Version 2 View Mode Switcher (Grid vs Lookbook) ---
  const viewButtons = document.querySelectorAll('.v2-view-btn');
  const v2Grid = document.querySelector('.v2-open-grid');

  if (viewButtons.length > 0 && v2Grid) {
    viewButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const mode = btn.getAttribute('data-view');
        viewButtons.forEach(b => b.classList.remove('active'));
        btn.classList.add('active');

        if (mode === 'lookbook') {
          v2Grid.classList.add('v2-lookbook-mode');
        } else {
          v2Grid.classList.remove('v2-lookbook-mode');
        }
      });
    });
  }

  // --- Product Quick-View Modal (<dialog>) ---
  const modal = document.getElementById('product-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const detailTriggers = document.querySelectorAll('.product-detail-btn, .v2-detail-link, .v2-cutout-stage');

  if (modal && detailTriggers.length > 0) {
    const modalImg = document.getElementById('modal-img');
    const modalCategory = document.getElementById('modal-category');
    const modalPack = document.getElementById('modal-pack');
    const modalTitle = document.getElementById('modal-title');
    const modalClaim = document.getElementById('modal-claim');
    const modalDesc = document.getElementById('modal-desc');
    const modalSpecs = document.getElementById('modal-specs');

    const mockupMap = {
      'Clean-Kong-SmileCleanDuoSwamme1frei.webp': 'Clean-Kong-Smile-Clean-Duo-Swämme-1.jpg',
      'Clean-KongDuoPowerschwammefreigestellt.webp': 'Clean-Kong-DuoPowerschwämme.jpg',
      'Clean-Kong-Nano-GlanzCleanPadsfrei.webp': 'Clean-Kong-Nano-Glanz-Clean-Pads.jpg',
      'Clean-Kong-Magic-Mikrofaser-Geschirrhandtucherfreigestellt.webp': 'Clean-Kong-Magic-Mikrofaser-Geschirrhandtücher.jpg',
      'Clean-Kong-Multi-CleanMikrofasertucherfrei.webp': 'Clean-Kong-Multi-Clean-Mikrofasertücher.jpg',
      'Clean-Kong-Spray-MatePinkfrei.webp': 'Clean-Kong-Spray-Mate-Pink.jpg',
      'Clean-Kong-Spray-MateMintfrei.webp': 'Clean-Kong-Spray-Mate-Mint.jpg',
      'Clean-Kong-Sweep-TechPinkfrei.webp': 'Clean-Kong-Sweep-Tech-Pink.jpg',
      'Clean-Kong-Sweep-TechMintfrei.webp': 'Clean-Kong-Sweep-Tech-Mint.jpg',
      'Clean-Kong-Wet-Dry-WischsystemPinkfrei.webp': 'Clean-Kong-Wet-Dry-Wischsystem-Pink.jpg',
      'Clean-Kong-Wet-Dry-WischsystemMintfrei.webp': 'Clean-Kong-Wet-Dry-Wischsystem-Mint.jpg'
    };

    detailTriggers.forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.product-card, .v2-product-item');
        if (!card) return;

        const imgEl = card.querySelector('.product-cutout-img, .v2-cutout-img');
        const catEl = card.querySelector('.product-category-tag, .v2-meta-cat');
        const packEl = card.querySelector('.product-pack-badge, .v2-meta-edition');
        const titleEl = card.querySelector('.product-title, .v2-item-title');
        const claimEl = card.querySelector('.product-claim, .v2-item-claim');
        const descEl = card.querySelector('.product-desc, .v2-item-desc');
        const featureEls = card.querySelectorAll('.product-features li');
        const inlineSpecs = card.getAttribute('data-specs') || '';
        const extraTip = card.getAttribute('data-tip') || '';

        if (modalImg && imgEl) {
          const rawSrc = imgEl.getAttribute('src') || '';
          const customMockup = card.getAttribute('data-mockup');
          const fileName = rawSrc.split('/').pop();
          const basePrefix = rawSrc.includes('../assets/') ? '../assets/' : 'assets/';

          if (customMockup) {
            modalImg.src = customMockup;
          } else if (mockupMap[fileName]) {
            modalImg.src = `${basePrefix}Produkte_Mockups/${mockupMap[fileName]}`;
          } else {
            modalImg.src = rawSrc;
          }
          modalImg.alt = imgEl.getAttribute('alt');
        }
        if (modalCategory) {
          modalCategory.textContent = catEl ? catEl.textContent : (card.getAttribute('data-cat-label') || 'CleanKong');
        }
        if (modalPack && packEl) {
          modalPack.textContent = packEl.textContent;
          modalPack.className = 'product-pack-badge';
        }
        if (modalTitle && titleEl) modalTitle.textContent = titleEl.textContent;
        if (modalClaim) {
          modalClaim.textContent = claimEl ? claimEl.textContent : (card.getAttribute('data-claim') || '');
        }
        if (modalDesc && descEl) {
          modalDesc.textContent = extraTip ? `${descEl.textContent} ${extraTip}` : descEl.textContent;
        }
        if (modalSpecs) {
          modalSpecs.innerHTML = '';
          if (featureEls.length > 0) {
            featureEls.forEach(li => {
              const item = document.createElement('li');
              item.textContent = li.textContent;
              modalSpecs.appendChild(item);
            });
          } else if (inlineSpecs) {
            inlineSpecs.split('|').forEach(spec => {
              const item = document.createElement('li');
              item.textContent = `✓ ${spec.trim()}`;
              modalSpecs.appendChild(item);
            });
          }
        }

        modal.showModal();
      });
    });

    if (modalCloseBtn) {
      modalCloseBtn.addEventListener('click', () => modal.close());
    }

    modal.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const clickedInDialog =
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width;
      if (!clickedInDialog) {
        modal.close();
      }
    });
  }
});

