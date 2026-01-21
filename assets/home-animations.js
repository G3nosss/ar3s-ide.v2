// Simple animation library inspired by framer-motion
(function() {
  'use strict';

  // Intersection Observer for scroll-triggered animations
  const observerOptions = {
    root: null,
    rootMargin: '-100px',
    threshold: 0.1
  };

  // Animate elements on scroll
  function setupScrollAnimations() {
    const cards = document.querySelectorAll('.product-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry, index) => {
        if (entry.isIntersecting) {
          entry.target.style.animation = `fadeInUp 0.6s ease-out ${index * 0.15}s forwards`;
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    cards.forEach(card => {
      card.style.opacity = '0';
      card.style.transform = 'translateY(50px) scale(0.9)';
      observer.observe(card);
    });
  }

  // Brand glow animation
  function animateBrandGlow() {
    const brand = document.querySelector('.brand');
    if (!brand) return;

    let glowIntensity = 10;
    let increasing = true;

    setInterval(() => {
      if (increasing) {
        glowIntensity += 0.5;
        if (glowIntensity >= 20) increasing = false;
      } else {
        glowIntensity -= 0.5;
        if (glowIntensity <= 10) increasing = true;
      }
      brand.style.textShadow = `0 0 ${glowIntensity}px #00ffff, 0 0 ${glowIntensity * 2}px #00ffff`;
    }, 50);
  }

  // Power indicator pulse
  function animatePowerIndicator() {
    const indicator = document.querySelector('.hero > div:nth-child(4) > div');
    if (!indicator) return;

    let shadowSize = 10;
    let increasing = true;

    setInterval(() => {
      if (increasing) {
        shadowSize += 1;
        if (shadowSize >= 20) increasing = false;
      } else {
        shadowSize -= 1;
        if (shadowSize <= 10) increasing = true;
      }
      indicator.style.boxShadow = `0 0 ${shadowSize}px rgba(0, 255, 255, ${0.3 + shadowSize / 100})`;
    }, 100);
  }

  // Icon rotation animation
  function animateIcons() {
    const icons = document.querySelectorAll('.product-card-icon');
    
    icons.forEach(icon => {
      let rotation = 0;
      let scale = 1;
      let increasing = true;

      setInterval(() => {
        if (increasing) {
          scale += 0.005;
          if (scale >= 1.1) increasing = false;
        } else {
          scale -= 0.005;
          if (scale <= 1) increasing = true;
        }
        
        rotation = (rotation + 0.5) % 360;
        if (rotation >= 5 && rotation <= 10) {
          icon.style.transform = `rotate(${rotation - 5}deg) scale(${scale})`;
        } else if (rotation >= 185 && rotation <= 190) {
          icon.style.transform = `rotate(${190 - rotation}deg) scale(${scale})`;
        } else {
          icon.style.transform = `scale(${scale})`;
        }
      }, 2000 / 60); // 60fps
    });
  }

  // Header slide in
  function animateHeader() {
    const header = document.querySelector('.header');
    if (!header) return;

    header.style.transform = 'translateY(-100px)';
    header.style.opacity = '0';
    
    setTimeout(() => {
      header.style.transition = 'all 0.8s ease-out';
      header.style.transform = 'translateY(0)';
      header.style.opacity = '1';
    }, 100);
  }

  // Hero elements animation
  function animateHero() {
    const heroAccent = document.querySelector('.hero-accent');
    const heroTitle = document.querySelector('.hero-title');
    const heroSubtitle = document.querySelector('.hero-subtitle');
    const heroCTA = document.querySelector('.hero > div:nth-child(4)');

    const elements = [
      { el: heroAccent, delay: 300 },
      { el: heroTitle, delay: 500 },
      { el: heroSubtitle, delay: 800 },
      { el: heroCTA, delay: 1100 }
    ];

    elements.forEach(({ el, delay }) => {
      if (!el) return;
      el.style.opacity = '0';
      el.style.transform = 'translateY(30px)';
      
      setTimeout(() => {
        el.style.transition = 'all 0.8s ease-out';
        el.style.opacity = '1';
        el.style.transform = 'translateY(0)';
      }, delay);
    });
  }

  // Section title animation
  function animateSectionTitle() {
    const title = document.querySelector('.section-title');
    if (!title) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeInUp 0.6s ease-out forwards';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    title.style.opacity = '0';
    title.style.transform = 'translateY(30px)';
    observer.observe(title);
  }

  // Footer animation
  function animateFooter() {
    const footer = document.querySelector('.footer');
    if (!footer) return;

    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.style.animation = 'fadeIn 0.8s ease-out forwards';
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    footer.style.opacity = '0';
    observer.observe(footer);
  }

  // Add CSS animations
  const style = document.createElement('style');
  style.textContent = `
    @keyframes fadeInUp {
      from {
        opacity: 0;
        transform: translateY(50px) scale(0.9);
      }
      to {
        opacity: 1;
        transform: translateY(0) scale(1);
      }
    }

    @keyframes fadeIn {
      from {
        opacity: 0;
      }
      to {
        opacity: 1;
      }
    }

    .product-card {
      transition: all 0.3s ease !important;
    }

    .product-card:hover {
      transform: translateY(-8px) !important;
    }
  `;
  document.head.appendChild(style);

  // Initialize all animations when DOM is ready
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }

  function init() {
    animateHeader();
    animateHero();
    animateSectionTitle();
    setupScrollAnimations();
    animateFooter();
    animateBrandGlow();
    animatePowerIndicator();
    
    // Wait for icons to load
    setTimeout(animateIcons, 1000);
  }
})();
