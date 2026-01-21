// Homepage scroll-triggered animations and interactive effects
// Lightweight implementation without external libraries

(function() {
  'use strict';

  // Intersection Observer for scroll-triggered animations
  const observerOptions = {
    root: null,
    rootMargin: '0px',
    threshold: 0.1
  };

  // Animate product cards on scroll
  function initScrollAnimations() {
    const productCards = document.querySelectorAll('.product-card');
    
    const observer = new IntersectionObserver((entries) => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('animate-in');
          observer.unobserve(entry.target);
        }
      });
    }, observerOptions);

    productCards.forEach(card => {
      observer.observe(card);
    });
  }

  // Parallax effect for hero section
  function initParallaxEffect() {
    const hero = document.querySelector('.hero');
    if (!hero) return;

    window.addEventListener('scroll', () => {
      const scrolled = window.pageYOffset;
      const parallaxSpeed = 0.5;
      
      if (scrolled < window.innerHeight) {
        hero.style.transform = `translateY(${scrolled * parallaxSpeed}px)`;
        hero.style.opacity = 1 - (scrolled / window.innerHeight) * 0.5;
      }
    });
  }

  // Glitch effect on brand hover
  function initGlitchEffect() {
    const brand = document.querySelector('.brand');
    if (!brand) return;

    const originalText = brand.textContent;
    
    brand.addEventListener('mouseenter', () => {
      let iterations = 0;
      const maxIterations = 10;
      const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789!@#$%^&*()';
      
      const interval = setInterval(() => {
        brand.textContent = originalText
          .split('')
          .map((char, index) => {
            if (index < iterations) {
              return originalText[index];
            }
            return chars[Math.floor(Math.random() * chars.length)];
          })
          .join('');
        
        iterations += 1;
        
        if (iterations > maxIterations) {
          clearInterval(interval);
          brand.textContent = originalText;
        }
      }, 50);
    });
  }

  // Cursor glow effect
  function initCursorGlow() {
    const cursor = document.createElement('div');
    cursor.className = 'cursor-glow';
    cursor.style.cssText = `
      position: fixed;
      width: 20px;
      height: 20px;
      border-radius: 50%;
      background: radial-gradient(circle, rgba(0, 217, 255, 0.6), transparent);
      pointer-events: none;
      z-index: 9999;
      opacity: 0;
      transition: opacity 0.3s ease;
      mix-blend-mode: screen;
    `;
    document.body.appendChild(cursor);

    let mouseX = 0;
    let mouseY = 0;
    let cursorX = 0;
    let cursorY = 0;

    document.addEventListener('mousemove', (e) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      cursor.style.opacity = '1';
    });

    document.addEventListener('mouseleave', () => {
      cursor.style.opacity = '0';
    });

    // Smooth cursor movement
    function animateCursor() {
      cursorX += (mouseX - cursorX) * 0.15;
      cursorY += (mouseY - cursorY) * 0.15;
      
      cursor.style.transform = `translate(${cursorX - 10}px, ${cursorY - 10}px)`;
      requestAnimationFrame(animateCursor);
    }
    
    animateCursor();
  }

  // Add scan line effect
  function initScanLines() {
    const scanLine = document.createElement('div');
    scanLine.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 2px;
      background: linear-gradient(90deg, transparent, rgba(0, 217, 255, 0.8), transparent);
      pointer-events: none;
      z-index: 9998;
      animation: scan 8s linear infinite;
      opacity: 0.3;
    `;
    
    const style = document.createElement('style');
    style.textContent = `
      @keyframes scan {
        from { transform: translateY(0); }
        to { transform: translateY(100vh); }
      }
    `;
    document.head.appendChild(style);
    document.body.appendChild(scanLine);
  }

  // Matrix rain effect (lightweight, minimal)
  function initMatrixRain() {
    const canvas = document.createElement('canvas');
    canvas.style.cssText = `
      position: fixed;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
      pointer-events: none;
      z-index: -1;
      opacity: 0.05;
    `;
    document.body.appendChild(canvas);

    const ctx = canvas.getContext('2d');
    canvas.width = window.innerWidth;
    canvas.height = window.innerHeight;

    const columns = Math.floor(canvas.width / 20);
    const drops = Array(columns).fill(0);

    function draw() {
      ctx.fillStyle = 'rgba(5, 8, 13, 0.05)';
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      ctx.fillStyle = '#00d9ff';
      ctx.font = '14px monospace';

      drops.forEach((y, i) => {
        const text = Math.random() > 0.5 ? '1' : '0';
        const x = i * 20;
        ctx.fillText(text, x, y);

        if (y > canvas.height && Math.random() > 0.95) {
          drops[i] = 0;
        }
        drops[i] += 20;
      });
    }

    setInterval(draw, 50);

    window.addEventListener('resize', () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    });
  }

  // Smooth scroll for navigation
  function initSmoothScroll() {
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
      anchor.addEventListener('click', function(e) {
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
  }

  // Card hover 3D tilt effect
  function initCardTilt() {
    const cards = document.querySelectorAll('.product-card');
    
    cards.forEach(card => {
      card.addEventListener('mousemove', (e) => {
        const rect = card.getBoundingClientRect();
        const x = e.clientX - rect.left;
        const y = e.clientY - rect.top;
        
        const centerX = rect.width / 2;
        const centerY = rect.height / 2;
        
        const rotateX = (y - centerY) / 10;
        const rotateY = (centerX - x) / 10;
        
        card.style.transform = `
          translateY(-8px) 
          scale(1.02) 
          perspective(1000px) 
          rotateX(${rotateX}deg) 
          rotateY(${rotateY}deg)
        `;
      });
      
      card.addEventListener('mouseleave', () => {
        card.style.transform = '';
      });
    });
  }

  // Typing effect for hero subtitle
  function initTypingEffect() {
    const subtitle = document.querySelector('.hero-subtitle');
    if (!subtitle) return;

    const text = subtitle.textContent;
    subtitle.textContent = '';
    subtitle.style.visibility = 'visible';
    
    let index = 0;
    
    function type() {
      if (index < text.length) {
        subtitle.textContent += text.charAt(index);
        index++;
        setTimeout(type, 50);
      }
    }
    
    setTimeout(type, 1000);
  }

  // Initialize all effects when DOM is ready
  function init() {
    initScrollAnimations();
    initParallaxEffect();
    initGlitchEffect();
    initCursorGlow();
    initScanLines();
    initMatrixRain();
    initSmoothScroll();
    initCardTilt();
    initTypingEffect();
  }

  // Run initialization
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', init);
  } else {
    init();
  }
})();
