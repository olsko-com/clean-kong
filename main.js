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
});
