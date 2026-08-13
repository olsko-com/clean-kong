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

  // --- Premium 3D Tilt Effect (Mouse Tracking) ---
  const hero = document.getElementById('home');
  const spongeWrapper = document.getElementById('sponge-wrapper');

  if (hero && spongeWrapper) {
    hero.addEventListener('mousemove', (e) => {
      // Calculate mouse position relative to the center of the hero section (-0.5 to 0.5)
      const { width, height, left, top } = hero.getBoundingClientRect();
      const mouseX = (e.clientX - left) / width - 0.5;
      const mouseY = (e.clientY - top) / height - 0.5;

      // Max rotation angles (in degrees)
      const maxRotateX = 12; 
      const maxRotateY = 12; 

      const rotateX = -mouseY * maxRotateX;
      const rotateY = mouseX * maxRotateY;

      // Subtle parallax shift (in pixels)
      const translateX = mouseX * 15;
      const translateY = mouseY * 15;

      // Apply 3D perspective, rotation, and translation
      spongeWrapper.style.transform = `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg) translate3d(${translateX}px, ${translateY}px, 0)`;
    });

    // Reset smoothly when mouse leaves the hero area
    hero.addEventListener('mouseleave', () => {
      spongeWrapper.style.transform = 'perspective(1000px) rotateX(0deg) rotateY(0deg) translate3d(0, 0, 0)';
      spongeWrapper.style.transition = 'transform 0.8s cubic-bezier(0.25, 0.8, 0.25, 1)';
    });

    // Disable transition during movement for real-time responsiveness
    hero.addEventListener('mouseenter', () => {
      spongeWrapper.style.transition = 'none';
    });
  }
});
