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

  // --- Product Category Filter (Version 1 Product Page) ---
  const filterButtons = document.querySelectorAll('.filter-btn');
  const productCards = document.querySelectorAll('.product-card');

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

  // --- Product Quick-View Modal (<dialog>) ---
  const modal = document.getElementById('product-modal');
  const modalCloseBtn = document.getElementById('modal-close-btn');
  const detailButtons = document.querySelectorAll('.product-detail-btn');

  if (modal && detailButtons.length > 0) {
    const modalImg = document.getElementById('modal-img');
    const modalCategory = document.getElementById('modal-category');
    const modalPack = document.getElementById('modal-pack');
    const modalTitle = document.getElementById('modal-title');
    const modalClaim = document.getElementById('modal-claim');
    const modalDesc = document.getElementById('modal-desc');
    const modalSpecs = document.getElementById('modal-specs');

    detailButtons.forEach(btn => {
      btn.addEventListener('click', () => {
        const card = btn.closest('.product-card');
        if (!card) return;

        const imgEl = card.querySelector('.product-cutout-img');
        const catEl = card.querySelector('.product-category-tag');
        const packEl = card.querySelector('.product-pack-badge');
        const titleEl = card.querySelector('.product-title');
        const claimEl = card.querySelector('.product-claim');
        const descEl = card.querySelector('.product-desc');
        const featureEls = card.querySelectorAll('.product-features li');
        const extraTip = card.getAttribute('data-tip') || '';

        if (modalImg && imgEl) {
          modalImg.src = imgEl.getAttribute('src');
          modalImg.alt = imgEl.getAttribute('alt');
        }
        if (modalCategory && catEl) modalCategory.textContent = catEl.textContent;
        if (modalPack && packEl) {
          modalPack.textContent = packEl.textContent;
          modalPack.className = packEl.className;
        }
        if (modalTitle && titleEl) modalTitle.textContent = titleEl.textContent;
        if (modalClaim && claimEl) modalClaim.textContent = claimEl.textContent;
        if (modalDesc && descEl) {
          modalDesc.textContent = extraTip ? `${descEl.textContent} ${extraTip}` : descEl.textContent;
        }
        if (modalSpecs) {
          modalSpecs.innerHTML = '';
          featureEls.forEach(li => {
            const item = document.createElement('li');
            item.textContent = li.textContent;
            modalSpecs.appendChild(item);
          });
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

