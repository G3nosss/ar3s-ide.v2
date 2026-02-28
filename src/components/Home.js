import React from 'react';
import HeroScroll from './HeroScroll';

const Home = () => {
  return (
    <div style={{ margin: 0, padding: 0, background: '#000', color: '#fff' }}>
      {/* ── Apple-style scroll hero ── */}
      <HeroScroll />

      {/* ── Rest of landing page content below ── */}
      <section
        id="features"
        style={{ textAlign: 'center', padding: '6rem 2rem' }}
      >
        <h2>Features</h2>
        <p style={{ color: 'rgba(255,255,255,0.6)' }}>
          Add your feature sections here.
        </p>
      </section>
    </div>
  );
};

export default Home;
