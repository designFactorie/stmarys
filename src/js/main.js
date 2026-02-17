
import '../css/style.css';
import '../css/components.css';

/**
 * Floating Icons System
 */
class FloatingIcons {
  constructor() {
    this.container = document.getElementById('floating-icons-container');
    this.icons = [
      { text: 'Study', icon: 'fa-book-open' },
      { text: 'Music', icon: 'fa-music' },
      { text: 'Math', icon: 'fa-calculator' }, // Using calculator as proxy for Divide
      { text: 'Growth', icon: 'fa-seedling' },
      { text: 'Science', icon: 'fa-flask' },
      { text: 'Play', icon: 'fa-gamepad' },
      { text: 'Rocket', icon: 'fa-rocket' }
    ];
    this.init();
  }

  init() {
    // Create fewer icons (approx 50% reduction)
    const count = 8;
    // Define a 2x4 grid to spread them out
    const gridRows = 4;
    const gridCols = 2;
    const rowH = 100 / gridRows;
    const colW = 100 / gridCols;

    // Shuffle zones
    let zones = [];
    for (let r = 0; r < gridRows; r++) {
      for (let c = 0; c < gridCols; c++) {
        zones.push({ r, c });
      }
    }
    // Shuffle array
    zones.sort(() => Math.random() - 0.5);

    for (let i = 0; i < count; i++) {
      // If we have more icons than zones, just reuse random zones, but we matched count=8 to zones=8
      const zone = zones[i % zones.length];
      this.createIcon(zone, rowH, colW);
    }
  }

  createIcon(zone, rowH, colW) {
    const item = this.icons[Math.floor(Math.random() * this.icons.length)];
    const el = document.createElement('div');
    el.className = 'floating-icon';
    el.innerHTML = `<i class="fas ${item.icon}"></i>`;

    // Position within the assigned zone with some padding
    const padding = 5; // keep away from very edges of zone
    const minX = zone.c * colW + padding;
    const maxX = (zone.c + 1) * colW - padding;
    const minY = zone.r * rowH + padding;
    const maxY = (zone.r + 1) * rowH - padding;

    const startX = minX + Math.random() * (maxX - minX);
    const startY = minY + Math.random() * (maxY - minY);

    el.style.left = `${startX}vw`;
    el.style.top = `${startY}vh`;

    // Random animation duration
    const duration = 15 + Math.random() * 15; // 15-30s

    // Random float direction
    // We'll use CSS Animation API in JS to create unique paths for each?
    // Or just simple keyframes. Let's use simple keyframes logic inject
    // Actually, simple float up/down/around with long duration is okay.
    // To make it truly random "float across viewport", let's animate movement.

    this.animateIcon(el, duration);
    this.container.appendChild(el);
  }

  animateIcon(el, duration) {
    // Use Web Animations API for smooth random movement
    const keyframes = [];
    const points = 5;
    for (let i = 0; i <= points; i++) {
      keyframes.push({
        transform: `translate(${Math.random() * 100 - 50}px, ${Math.random() * 100 - 50}px) rotate(${Math.random() * 360}deg)`
      });
    }
    // Loop back to start for smooth loop? Or just random walk.
    // Let's do a simple complex float.

    el.animate([
      { transform: 'translate(0, 0) rotate(0deg)' },
      { transform: `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) rotate(45deg)` },
      { transform: `translate(${Math.random() * 200 - 100}px, ${Math.random() * 200 - 100}px) rotate(-45deg)` },
      { transform: 'translate(0, 0) rotate(0deg)' }
    ], {
      duration: duration * 1000,
      iterations: Infinity,
      easing: 'ease-in-out'
    });
  }
}

/**
 * Navigation Logic
 */
function initNavigation() {
  const nav = document.querySelector('nav');
  const menuBtn = document.querySelector('.mobile-menu-btn');
  const navLinks = document.querySelector('.nav-links');

  // Sticky Scroll Effect
  window.addEventListener('scroll', () => {
    if (window.scrollY > 50) {
      nav.classList.add('scrolled');
    } else {
      nav.classList.remove('scrolled');
    }
  });

  // Mobile Menu
  menuBtn.addEventListener('click', () => {
    navLinks.classList.toggle('active');
    // Change icon?
    const icon = menuBtn.querySelector('i');
    if (navLinks.classList.contains('active')) {
      icon.classList.remove('fa-bars');
      icon.classList.add('fa-times');
    } else {
      icon.classList.remove('fa-times');
      icon.classList.add('fa-bars');
    }
  });

  // Highlight active link functionality based on URL
  const currentPath = window.location.pathname;
  const links = document.querySelectorAll('.nav-links a');
  links.forEach(link => {
    if (link.getAttribute('href') === currentPath) {
      link.classList.add('active');
    } else {
      // Also handle root
      if (currentPath === '/' && link.getAttribute('href') === '/') return; // Already active in HTML but let's ensure
      link.classList.remove('active');
    }
  });
}

/**
 * Testimonial Carousel
 */
class TestimonialCarousel {
  constructor() {
    this.container = document.querySelector('.testimonial-carousel');
    if (!this.container) return;

    this.testimonials = [
      {
        name: 'Mohammad Imraan',
        stars: 5,
        text: 'One of the best school in dasarahalli It is very desciplined with good lecture and teachers they maintain proper'
      },
      {
        name: 'Rekha Harshini',
        stars: 5,
        text: 'Feeling happy.. Good school 🏫.My daughter learning in this school, they are giving very good education... And'
      },
      {
        name: 'Varun Pathak',
        stars: 5,
        text: 'A school at a very good location with beautiful premises and education friendly environment. St.'
      },
      {
        name: 'Shiva Ranade',
        stars: 5,
        text: "Great experience by St. Mary's convent school. The school is at good location and the"
      },
      {
        name: 'Bahadur Chauhan',
        stars: 5,
        text: "St. Mary's convent school is the best school in town for the bright"
      }
    ];

    this.currentIndex = 0;
    this.intervalId = null;
    this.render();
    this.startAutoScroll();

    // Pause on hover
    this.track.addEventListener('mouseenter', () => this.stopAutoScroll());
    this.track.addEventListener('mouseleave', () => this.startAutoScroll());
  }

  render() {
    this.container.innerHTML = '';
    // Styling the container as a window
    this.container.style.overflow = 'hidden';
    this.container.style.position = 'relative';
    this.container.style.background = 'transparent';
    this.container.style.boxShadow = 'none';
    this.container.style.backdropFilter = 'none';
    this.container.style.border = 'none';
    this.container.style.display = 'block'; // Override glass-panel flex/grid

    // Create Track
    this.track = document.createElement('div');
    this.track.className = 'testimonial-track';
    this.track.style.display = 'flex';
    this.track.style.gap = '2rem';
    this.track.style.transition = 'transform 0.5s ease-in-out';
    this.track.style.width = '150%'; // Increased by 50%

    // Determine number of items to show based on screen size (simple logic for now, could be improved with ResizeObserver)
    // We target 3 items on Desktop.

    this.testimonials.forEach(item => {
      const el = document.createElement('div');
      el.className = 'glass-panel testimonial-card';
      // Style for 3 columns on full width container
      el.style.flex = '0 0 20.8%'; // Further reduced by 15%
      // Responsive check happens in CSS ideally, but here inline:
      if (window.innerWidth < 768) {
        el.style.flex = '0 0 85%';
        el.style.marginLeft = '7.5%';
      } else if (window.innerWidth < 1024) {
        el.style.flex = '0 0 60%';
      }

      el.style.padding = '2.5rem';
      el.style.textAlign = 'left';
      el.style.display = 'flex';
      el.style.flexDirection = 'column';
      el.style.gap = '1.5rem';
      el.style.minHeight = '450px'; // Increased by 25% (allows text to wrap fully)
      el.style.justifyContent = 'center';

      // Stars
      let starsHtml = '';
      for (let i = 0; i < 5; i++) {
        starsHtml += `<i class="fas fa-star" style="color: #FFD700; margin-right: 4px; font-size: 1.2rem;"></i>`;
      }

      el.innerHTML = `
        <h4 style="font-size: 1.4rem; color: var(--font-color-dark); margin:0;">${item.name}</h4>
        <div class="stars">${starsHtml}</div>
        <p style="font-size: 1rem; color: #555; line-height: 1.8; margin:0;">${item.text}</p>
      `;

      this.track.appendChild(el);
    });

    this.container.appendChild(this.track);

    // Add mobile resize listener
    window.addEventListener('resize', () => {
      const cards = this.track.querySelectorAll('.testimonial-card');
      cards.forEach(card => {
        if (window.innerWidth < 768) {
          card.style.flex = '0 0 85%';
        } else if (window.innerWidth < 1024) {
          card.style.flex = '0 0 60%';
        } else {
          card.style.flex = '0 0 20.8%';
        }
      });
      this.updateSlidePosition(); // Re-adjust offset
    });
  }

  startAutoScroll() {
    if (this.intervalId) clearInterval(this.intervalId);
    this.intervalId = setInterval(() => {
      this.currentIndex++;
      // Reset to 0 if we reach the end (taking visible items into account)
      let visibleItems = 3;
      if (window.innerWidth < 768) visibleItems = 1;
      else if (window.innerWidth < 1024) visibleItems = 2; // For tablet

      const maxIndex = this.testimonials.length - visibleItems;

      if (this.currentIndex > maxIndex) {
        this.currentIndex = 0;
      }
      this.updateSlidePosition();
    }, 4000); // 4 seconds
  }

  stopAutoScroll() {
    if (this.intervalId) clearInterval(this.intervalId);
  }

  updateSlidePosition() {
    const gap = 2; // rem
    // We need to calculate percentage or pixel move
    const isMobile = window.innerWidth < 768;
    const itemWidthPercent = isMobile ? 100 : 50;
    // Just using percent translation is easier if gap is handled in width calc
    // But with gap it's tricky.
    // Let's use simpler logic: 
    // A single slide width is (100% / visibleItems) roughly minus gap?
    // Actually, if we used flex: 0 0 calc(50% - 1rem) and gap in parent is 2rem.
    // Translating by (100% + 2rem) / 2 is complex.

    // Alternative: Get actual width of first card + gap
    const card = this.track.children[0];
    if (!card) return;

    const slideWidth = card.offsetWidth;
    // Get gap from computed style
    // const computedGap = parseFloat(getComputedStyle(this.track).gap) || 32; 
    // Hardcoded 2rem = 32px (approx)
    const computedGap = 32;

    const moveAmount = (slideWidth + computedGap) * this.currentIndex;

    this.track.style.transform = `translateX(-${moveAmount}px)`;
  }
}

/**
 * Gallery Filter Logic
 */
function initGallery() {
  const filters = document.querySelectorAll('.filter-btn');
  const items = document.querySelectorAll('.gallery-item');

  if (!filters.length) return; // Not filter page

  filters.forEach(btn => {
    btn.addEventListener('click', () => {
      // Remove active class
      filters.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');

      const filter = btn.getAttribute('data-filter');

      items.forEach(item => {
        const category = item.getAttribute('data-category');
        if (filter === 'all' || category === filter) {
          item.style.display = 'block';
          // Optional: Animate in
          item.animate([
            { transform: 'scale(0.8)', opacity: 0 },
            { transform: 'scale(1)', opacity: 1 }
          ], {
            duration: 300,
            easing: 'ease-out'
          });
        } else {
          item.style.display = 'none';
        }
      });
    });
  });
}

// Initialize
document.addEventListener('DOMContentLoaded', () => {
  new FloatingIcons();
  initNavigation();
  new TestimonialCarousel();
  initGallery();
});
