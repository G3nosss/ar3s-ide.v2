// Futuristic Homepage Interactions

// Scroll-triggered animations for product cards
const observerOptions = {
  threshold: 0.1,
  rootMargin: '0px 0px -100px 0px'
};

const cardObserver = new IntersectionObserver((entries) => {
  entries.forEach(entry => {
    if (entry.isIntersecting) {
      entry.target.style.opacity = '1';
      entry.target.style.transform = 'translateY(0)';
    }
  });
}, observerOptions);

// Observe all product cards
document.addEventListener('DOMContentLoaded', () => {
  const productCards = document.querySelectorAll('.product-card');
  productCards.forEach(card => {
    // Reset animation for scroll trigger
    card.style.opacity = '0';
    card.style.transform = 'translateY(30px)';
    card.style.transition = 'opacity 0.6s ease, transform 0.6s cubic-bezier(0.23, 1, 0.32, 1)';
    
    // Apply delay based on index
    const index = card.getAttribute('data-index');
    card.style.transitionDelay = `${index * 0.15}s`;
    
    cardObserver.observe(card);
  });

  // Glowing card effect on mouse move
  productCards.forEach(card => {
    card.addEventListener('mousemove', (e) => {
      const rect = card.getBoundingClientRect();
      const x = ((e.clientX - rect.left) / rect.width) * 100;
      const y = ((e.clientY - rect.top) / rect.height) * 100;
      
      const cardGlow = card.querySelector('.card-glow');
      if (cardGlow) {
        cardGlow.style.setProperty('--mouse-x', `${x}%`);
        cardGlow.style.setProperty('--mouse-y', `${y}%`);
      }
    });
  });

  // Glitch effect on hero title (subtle)
  const glitchElement = document.querySelector('.glitch');
  if (glitchElement) {
    setInterval(() => {
      if (Math.random() > 0.95) {
        glitchElement.style.textShadow = `
          ${Math.random() * 2 - 1}px ${Math.random() * 2 - 1}px 0 rgba(0, 217, 255, 0.7),
          ${Math.random() * 2 - 1}px ${Math.random() * 2 - 1}px 0 rgba(124, 77, 255, 0.7)
        `;
        setTimeout(() => {
          glitchElement.style.textShadow = 'none';
        }, 50);
      }
    }, 100);
  }

  // Parallax effect on hero section
  const hero = document.querySelector('.hero');
  if (hero) {
    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const heroContent = hero.querySelector('.hero-content');
      if (heroContent && scrolled < 500) {
        heroContent.style.transform = `translateY(${scrolled * 0.3}px)`;
        heroContent.style.opacity = 1 - scrolled / 500;
      }
    });
  }

  // Smooth scroll for navigation
  document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
      e.preventDefault();
      const target = document.querySelector(this.getAttribute('href'));
      if (target) {
        target.scrollIntoView({
          behavior: 'smooth',
          block: 'start'
        });
      }
    });
  });

  // Add scan line effect to header
  const header = document.querySelector('.header');
  if (header) {
    const scanLine = document.createElement('div');
    scanLine.className = 'scan-line';
    scanLine.style.cssText = `
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, var(--accent), transparent);
      animation: scan 3s linear infinite;
      pointer-events: none;
      opacity: 0.3;
    `;
    
    // Add keyframes for scan animation
    const style = document.createElement('style');
    style.textContent = `
      @keyframes scan {
        0% { transform: translateX(-100%); }
        100% { transform: translateX(100%); }
      }
    `;
    document.head.appendChild(style);
    
    header.style.position = 'relative';
    header.style.overflow = 'hidden';
    header.appendChild(scanLine);
  }

  // Stats counter animation
  const animateCounter = (element, target, duration = 2000) => {
    const start = 0;
    const increment = target / (duration / 16);
    let current = start;
    
    const timer = setInterval(() => {
      current += increment;
      if (current >= target) {
        element.textContent = target === 100 ? '100%' : target === Infinity ? '∞' : target;
        clearInterval(timer);
      } else {
        element.textContent = Math.floor(current);
      }
    }, 16);
  };

  // Observe hero stats
  const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const statValues = entry.target.querySelectorAll('.stat-value');
        statValues.forEach((stat, index) => {
          const text = stat.textContent.trim();
          if (text === '4') {
            setTimeout(() => animateCounter(stat, 4, 1000), index * 200);
          } else if (text === '100%') {
            setTimeout(() => {
              stat.textContent = '0%';
              animateCounter(stat, 100, 1500);
            }, index * 200);
          }
        });
        statsObserver.unobserve(entry.target);
      }
    });
  }, { threshold: 0.5 });

  const heroStats = document.querySelector('.hero-stats');
  if (heroStats) {
    statsObserver.observe(heroStats);
  }

  // Loading sequence
  document.body.style.opacity = '0';
  setTimeout(() => {
    document.body.style.transition = 'opacity 0.5s ease';
    document.body.style.opacity = '1';
  }, 100);
});

// Tech HUD cursor effect (optional, can be removed if too heavy)
document.addEventListener('mousemove', (e) => {
  // Only activate on product cards
  const card = e.target.closest('.product-card');
  if (card) {
    const rect = card.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;
    
    card.style.setProperty('--mouse-x', `${x}px`);
    card.style.setProperty('--mouse-y', `${y}px`);
  }
});
