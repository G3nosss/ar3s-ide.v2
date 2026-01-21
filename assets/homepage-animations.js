// Homepage animations using vanilla JavaScript
// Using vanilla JS for better performance and no external dependencies

document.addEventListener('DOMContentLoaded', () => {
  // Animate hero content on load
  animateHeroContent();
  
  // Set up scroll-triggered product cards
  setupScrollAnimations();
  
  // Add glitch effect to title
  setupGlitchEffect();
});

function animateHeroContent() {
  const heroContent = document.getElementById('heroContent');
  if (!heroContent) return;
  
  // Fade in and slide up animation
  setTimeout(() => {
    heroContent.style.opacity = '0';
    heroContent.style.transform = 'translateY(30px)';
    heroContent.style.transition = 'opacity 0.8s ease, transform 0.8s ease';
    
    requestAnimationFrame(() => {
      heroContent.style.opacity = '1';
      heroContent.style.transform = 'translateY(0)';
    });
  }, 100);
}

function setupScrollAnimations() {
  const productCards = document.querySelectorAll('.product-card');
  
  const observerOptions = {
    threshold: 0.2,
    rootMargin: '0px 0px -50px 0px'
  };
  
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
      if (entry.isIntersecting) {
        const card = entry.target;
        const index = parseInt(card.dataset.index) || 0;
        
        // Stagger animation based on index
        setTimeout(() => {
          card.classList.add('visible');
          
          // Add slide-in animation
          card.style.transition = `
            opacity 0.6s ease ${index * 0.15}s,
            transform 0.6s ease ${index * 0.15}s
          `;
        }, 50);
        
        // Stop observing once animated
        observer.unobserve(card);
      }
    });
  }, observerOptions);
  
  productCards.forEach(card => {
    observer.observe(card);
  });
}

function setupGlitchEffect() {
  const glitchText = document.querySelector('.glitch-text');
  if (!glitchText) return;
  
  const originalText = glitchText.textContent;
  
  // Random glitch effect every few seconds
  setInterval(() => {
    if (Math.random() > 0.7) {
      glitchText.style.textShadow = `
        ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 rgba(255, 0, 255, 0.7),
        ${Math.random() * 10 - 5}px ${Math.random() * 10 - 5}px 0 rgba(0, 255, 255, 0.7)
      `;
      
      setTimeout(() => {
        glitchText.style.textShadow = '0 0 20px rgba(0, 217, 255, 0.8), 0 0 40px rgba(0, 217, 255, 0.4)';
      }, 100);
    }
  }, 3000);
}

// Add smooth scroll behavior
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

// Add hover sound effect simulation (visual feedback)
document.querySelectorAll('.product-card').forEach(card => {
  card.addEventListener('mouseenter', () => {
    card.style.transition = 'all 0.3s cubic-bezier(0.4, 0, 0.2, 1)';
  });
});

// Parallax effect for hero section
window.addEventListener('scroll', () => {
  const scrolled = window.pageYOffset;
  const heroGrid = document.querySelector('.hero-grid-bg');
  
  if (heroGrid && scrolled < window.innerHeight) {
    heroGrid.style.transform = `translate(${scrolled * 0.05}px, ${scrolled * 0.05}px)`;
  }
});
