// Since we're using CDN, we need to use vanilla JS with React globals
const { useState, useEffect, useRef } = React;
const { motion, useScroll, useTransform, useInView } = Motion;

// Product Card Component with scroll animations
function ProductCard({ product, index }) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.a
      ref={ref}
      href={product.href}
      className="product-card"
      initial={{ opacity: 0, y: 50, scale: 0.9 }}
      animate={isInView ? { 
        opacity: 1, 
        y: 0, 
        scale: 1 
      } : {}}
      transition={{ 
        duration: 0.6, 
        delay: index * 0.15,
        ease: "easeOut"
      }}
      whileHover={{ 
        scale: 1.05,
        transition: { duration: 0.2 }
      }}
    >
      <div className="hud-corner top-left"></div>
      <div className="hud-corner top-right"></div>
      <div className="hud-corner bottom-left"></div>
      <div className="hud-corner bottom-right"></div>
      
      <motion.div 
        className="product-card-icon"
        animate={{ 
          rotate: [0, 5, -5, 0],
          scale: [1, 1.1, 1]
        }}
        transition={{ 
          duration: 2,
          repeat: Infinity,
          repeatDelay: 3
        }}
      >
        <i className={product.icon}></i>
      </motion.div>
      <h3 className="product-card-title">{product.title}</h3>
      <p className="product-card-description">{product.description}</p>
    </motion.a>
  );
}

// Header Component
function Header() {
  return (
    <motion.header 
      className="header"
      initial={{ y: -100, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.8, ease: "easeOut" }}
    >
      <motion.div 
        className="brand"
        animate={{
          textShadow: [
            "0 0 10px #00ffff, 0 0 20px #00ffff",
            "0 0 20px #00ffff, 0 0 40px #0088ff",
            "0 0 10px #00ffff, 0 0 20px #00ffff"
          ]
        }}
        transition={{
          duration: 2,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      >
        AR3S
      </motion.div>
      <nav className="nav">
        <a href="/index.html">Home</a>
        <a href="/pages/ide.html">IDE</a>
        <a href="/pages/simulator.html">Simulator</a>
        <a href="/pages/esp-flasher.html">ESP Flasher</a>
        <a href="/pages/esp-custom.html">Custom Flasher</a>
        <a href="/pages/stm-flasher.html">STM Flasher</a>
      </nav>
    </motion.header>
  );
}

// Hero Section
function Hero() {
  return (
    <section className="hero">
      <motion.div
        className="hero-accent"
        initial={{ opacity: 0, scale: 0.8 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        &gt; SYSTEM ONLINE
      </motion.div>
      
      <motion.h1 
        className="hero-title glitch-hover"
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 0.5 }}
      >
        AR3S IDE SUITE
      </motion.h1>
      
      <motion.p 
        className="hero-subtitle"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.8, delay: 0.8 }}
      >
        Advanced Robotics Engineering System • Write, simulate, and flash firmware — 
        all from your browser with cutting-edge technology.
      </motion.p>

      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.8, delay: 1.1 }}
        style={{ marginTop: '2rem' }}
      >
        <motion.div
          animate={{
            boxShadow: [
              "0 0 10px rgba(0, 255, 255, 0.3)",
              "0 0 20px rgba(0, 255, 255, 0.6)",
              "0 0 10px rgba(0, 255, 255, 0.3)"
            ]
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }}
          style={{
            display: 'inline-block',
            padding: '1rem 2rem',
            border: '2px solid #00ffff',
            borderRadius: '4px',
            background: 'rgba(0, 255, 255, 0.1)',
            color: '#00ffff',
            fontSize: '0.9rem',
            letterSpacing: '0.1em',
            fontWeight: 'bold'
          }}
        >
          ⚡ POWERED BY WEB SERIAL & WEB USB
        </motion.div>
      </motion.div>
    </section>
  );
}

// Products Section
function ProductsSection() {
  const products = [
    {
      title: "AR3S IDE",
      description: "Professional dark-themed code editor with syntax highlighting. Save, download, and prepare firmware artifacts with ease.",
      href: "/pages/ide.html",
      icon: "fas fa-code"
    },
    {
      title: "Simulator",
      description: "Test circuits without hardware using advanced Wokwi integration. Debug and validate before deployment.",
      href: "/pages/simulator.html",
      icon: "fas fa-microchip"
    },
    {
      title: "ESP Custom Flasher",
      description: "Upload your own .bin firmware and flash ESP32/ESP8266 directly from the browser via WebSerial API.",
      href: "/pages/esp-custom.html",
      icon: "fas fa-bolt"
    },
    {
      title: "STM Flasher",
      description: "Flash STM32 boards with WebUSB/WebSerial. Real-time status logs and reliable connection handling.",
      href: "/pages/stm-flasher.html",
      icon: "fas fa-robot"
    }
  ];

  return (
    <section className="products-section">
      <motion.h2 
        className="section-title"
        initial={{ opacity: 0, y: 30 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true }}
        transition={{ duration: 0.6 }}
      >
        &lt; TECH ARSENAL /&gt;
      </motion.h2>
      
      <div className="products-grid">
        {products.map((product, index) => (
          <ProductCard key={index} product={product} index={index} />
        ))}
      </div>
    </section>
  );
}

// Footer Component
function Footer() {
  return (
    <motion.footer 
      className="footer"
      initial={{ opacity: 0 }}
      whileInView={{ opacity: 1 }}
      viewport={{ once: true }}
      transition={{ duration: 0.8 }}
    >
      <div className="footer-content">
        <div className="footer-text">
          © 2026 Ar3s
        </div>
        <div className="footer-icons">
          <motion.a 
            href="https://github.com/G3nosss" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-icon"
            whileHover={{ 
              scale: 1.2,
              rotate: 360,
              transition: { duration: 0.5 }
            }}
          >
            <i className="fab fa-github"></i>
          </motion.a>
          <motion.a 
            href="https://instagram.com/g3nosss" 
            target="_blank" 
            rel="noopener noreferrer"
            className="footer-icon"
            whileHover={{ 
              scale: 1.2,
              rotate: -360,
              transition: { duration: 0.5 }
            }}
          >
            <i className="fab fa-instagram"></i>
          </motion.a>
        </div>
      </div>
    </motion.footer>
  );
}

// Scanning line effect
function ScanLine() {
  return <div className="scan-line"></div>;
}

// Main App
function App() {
  return (
    <>
      <ScanLine />
      <Header />
      <Hero />
      <ProductsSection />
      <Footer />
    </>
  );
}

// Render the app
const root = ReactDOM.createRoot(document.getElementById('root'));
root.render(<App />);
