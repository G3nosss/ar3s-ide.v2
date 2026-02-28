import React, { useEffect, useRef, useCallback } from 'react';

const TOTAL_FRAMES = 120;
const FRAME_PATH = (i) =>
  `/assets/mk4-hero/frame_${String(i).padStart(3, '0')}.webp`;

const HeroScroll = () => {
  const containerRef = useRef(null);
  const canvasRef = useRef(null);
  const imagesRef = useRef([]);
  const currentFrameRef = useRef(0);
  const rafRef = useRef(null);

  // ─── Preload all frames ───────────────────────────────────────────────────
  useEffect(() => {
    const images = [];
    let loadedCount = 0;

    for (let i = 1; i <= TOTAL_FRAMES; i++) {
      const img = new Image();
      img.src = FRAME_PATH(i);
      img.onload = () => {
        loadedCount++;
        // Draw the first frame as soon as it is ready
        if (loadedCount === 1 && canvasRef.current) {
          drawFrame(0);
        }
      };
      images.push(img);
    }

    imagesRef.current = images;

    // Cleanup
    return () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ─── Draw a specific frame index to the canvas ───────────────────────────
  const drawFrame = useCallback((index) => {
    const canvas = canvasRef.current;
    const img = imagesRef.current[index];
    if (!canvas || !img || !img.complete) return;

    const ctx = canvas.getContext('2d');

    // Keep canvas resolution in sync with its rendered size
    const { offsetWidth: w, offsetHeight: h } = canvas;
    if (canvas.width !== w || canvas.height !== h) {
      canvas.width = w;
      canvas.height = h;
    }

    // Cover-fit the image (similar to CSS object-fit: cover)
    const scale = Math.max(w / img.naturalWidth, h / img.naturalHeight);
    const drawW = img.naturalWidth * scale;
    const drawH = img.naturalHeight * scale;
    const offsetX = (w - drawW) / 2;
    const offsetY = (h - drawH) / 2;

    ctx.clearRect(0, 0, w, h);
    ctx.drawImage(img, offsetX, offsetY, drawW, drawH);
  }, []);

  // ─── Scroll handler ───────────────────────────────────────────────────────
  useEffect(() => {
    const handleScroll = () => {
      const container = containerRef.current;
      if (!container) return;

      const { top, height } = container.getBoundingClientRect();
      const scrollableHeight = height - window.innerHeight;

      // scrollProgress: 0 (top) → 1 (bottom of runway)
      const scrollProgress = Math.min(
        Math.max(-top / scrollableHeight, 0),
        1
      );

      const frameIndex = Math.min(
        Math.round(scrollProgress * (TOTAL_FRAMES - 1)),
        TOTAL_FRAMES - 1
      );

      if (frameIndex !== currentFrameRef.current) {
        currentFrameRef.current = frameIndex;

        if (rafRef.current) cancelAnimationFrame(rafRef.current);
        rafRef.current = requestAnimationFrame(() => drawFrame(frameIndex));
      }
    };

    window.addEventListener('scroll', handleScroll, { passive: true });
    handleScroll(); // run once on mount to set initial frame

    return () => {
      window.removeEventListener('scroll', handleScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
    };
  }, [drawFrame]);

  // ─── Handle canvas resize ─────────────────────────────────────────────────
  useEffect(() => {
    const handleResize = () => drawFrame(currentFrameRef.current);
    window.addEventListener('resize', handleResize, { passive: true });
    return () => window.removeEventListener('resize', handleResize);
  }, [drawFrame]);

  // ─── Render ───────────────────────────────────────────────────────────────
  return (
    /* Tall scroll runway — 300 vh gives the scroll "room" to play */
    <div
      ref={containerRef}
      style={{ position: 'relative', height: '300vh' }}
    >
      {/* Sticky wrapper — canvas stays pinned while parent scrolls */}
      <div
        style={{
          position: 'sticky',
          top: 0,
          width: '100%',
          height: '100vh',
          overflow: 'hidden',
        }}
      >
        {/* Canvas layer */}
        <canvas
          ref={canvasRef}
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            display: 'block',
            background: '#000',
          }}
        />

        {/* ── Glassmorphism overlay ── */}
        <div
          style={{
            position: 'absolute',
            inset: 0,
            display: 'flex',
            flexDirection: 'column',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 10,
            background:
              'radial-gradient(ellipse at center, transparent 30%, rgba(0,0,0,0.55) 100%)',
            pointerEvents: 'none',
          }}
        >
          {/* Glass card */}
          <div
            style={{
              pointerEvents: 'auto',
              display: 'flex',
              flexDirection: 'column',
              alignItems: 'center',
              gap: '1.5rem',
              padding: '2.5rem 3.5rem',
              borderRadius: '1.5rem',
              background: 'rgba(10, 10, 10, 0.45)',
              backdropFilter: 'blur(18px) saturate(160%)',
              WebkitBackdropFilter: 'blur(18px) saturate(160%)',
              border: '1px solid rgba(255, 255, 255, 0.10)',
              boxShadow:
                '0 8px 32px rgba(0, 0, 0, 0.6), inset 0 1px 0 rgba(255,255,255,0.06)',
            }}
          >
            {/* Headline */}
            <h1
              style={{
                margin: 0,
                fontSize: 'clamp(2.5rem, 6vw, 5rem)',
                fontWeight: 700,
                letterSpacing: '0.12em',
                color: '#ffffff',
                textTransform: 'uppercase',
                background:
                  'linear-gradient(135deg, #ffffff 0%, #a0a0a0 60%, #ffffff 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
                backgroundClip: 'text',
              }}
            >
              AR3S IDE
            </h1>

            {/* Sub-tagline */}
            <p
              style={{
                margin: 0,
                fontSize: 'clamp(0.85rem, 1.5vw, 1.1rem)',
                color: 'rgba(255,255,255,0.55)',
                letterSpacing: '0.08em',
                textAlign: 'center',
              }}
            >
              The next generation embedded development environment
            </p>

            {/* CTA Button */}
            <a
              href="#features"
              style={{
                display: 'inline-flex',
                alignItems: 'center',
                gap: '0.5rem',
                marginTop: '0.5rem',
                padding: '0.75rem 2rem',
                borderRadius: '2rem',
                fontSize: '0.9rem',
                fontWeight: 600,
                letterSpacing: '0.06em',
                textDecoration: 'none',
                color: '#ffffff',
                background:
                  'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
                border: '1px solid rgba(255,255,255,0.20)',
                boxShadow: '0 2px 12px rgba(0,0,0,0.4)',
                transition: 'all 0.25s ease',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background =
                  'linear-gradient(135deg, rgba(255,255,255,0.25) 0%, rgba(255,255,255,0.10) 100%)';
                e.currentTarget.style.borderColor =
                  'rgba(255,255,255,0.40)';
                e.currentTarget.style.transform = 'translateY(-2px)';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.background =
                  'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)';
                e.currentTarget.style.borderColor =
                  'rgba(255,255,255,0.20)';
                e.currentTarget.style.transform = 'translateY(0)';
              }}
            >
              Explore ↓
            </a>
          </div>
        </div>
      </div>
    </div>
  );
};

export default HeroScroll;
