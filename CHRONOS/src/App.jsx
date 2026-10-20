import { useState, useEffect, useRef, useCallback } from 'react';
import { ERAS_DATA } from './data/erasData';
import VortexCore, { PortalOpeningGate } from './components/TimePortal';
import EraScenes from './components/EraScenes';
import ScrollStory from './components/ScrollStory';
import TimelineNav from './components/TimeLineNav';
import './styles/layout.css';
import './styles/transition.css';
import './styles/responsive.css';  

function App() {
  const [activeEraId, setActiveEraId] = useState('present');
  const [isPortalGateOpen, setIsPortalGateOpen] = useState(true);
  const [isJumping, setIsJumping] = useState(false);
  const [reducedMotion, setReducedMotion] = useState(() => {
    if (typeof window !== 'undefined' && window.matchMedia) {
      return window.matchMedia('(prefers-reduced-motion: reduce)').matches;
    }
    return false;
  });

  const appRef = useRef(null);
  const jumpTimerRef = useRef(null);

  const currentEra =
    ERAS_DATA.find((era) => era.id === activeEraId) || ERAS_DATA[1];

  const handleSelectEra = useCallback(
    (nextEraId) => {
      if (nextEraId === activeEraId) return;
      setActiveEraId(nextEraId);

      if (jumpTimerRef.current) {
        window.clearTimeout(jumpTimerRef.current);
      }

      if (!reducedMotion) {
        setIsJumping(true);
        jumpTimerRef.current = window.setTimeout(() => {
          setIsJumping(false);
        }, 500);
      }
    },
    [activeEraId, reducedMotion]
  );

  useEffect(() => {
    return () => {
      if (jumpTimerRef.current) {
        window.clearTimeout(jumpTimerRef.current);
      }
    };
  }, []);

  useEffect(() => {
    document.title = `CHRONOS // ${currentEra.name} (${currentEra.epoch})`;
  }, [currentEra]);

  useEffect(() => {
    document.body.style.overflow = isPortalGateOpen ? 'hidden' : '';
    return () => {
      document.body.style.overflow = '';
    };
  }, [isPortalGateOpen]);

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (
        event.target.tagName === 'INPUT' ||
        event.target.tagName === 'TEXTAREA'
      ) {
        return;
      }

      if (event.key === '1') handleSelectEra('ancient');
      if (event.key === '2') handleSelectEra('present');
      if (event.key === '3') handleSelectEra('future');

      const currentIndex = ERAS_DATA.findIndex(
        (era) => era.id === activeEraId
      );
      if (event.key === 'ArrowRight') {
        const nextIndex = (currentIndex + 1) % ERAS_DATA.length;
        handleSelectEra(ERAS_DATA[nextIndex].id);
      } else if (event.key === 'ArrowLeft') {
        const prevIndex =
          (currentIndex - 1 + ERAS_DATA.length) % ERAS_DATA.length;
        handleSelectEra(ERAS_DATA[prevIndex].id);
      }
    };

    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [activeEraId, handleSelectEra]);

  useEffect(() => {
    let ticking = false;

    const updateScrollTelemetry = () => {
      if (!appRef.current) return;
      const scrollTop = window.scrollY;
      const maxScroll =
        document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxScroll > 0 ? Math.min(scrollTop / maxScroll, 1) : 0;
      const gridShift = reducedMotion ? 0 : (scrollTop * 0.12) % 64;

      appRef.current.style.setProperty(
        '--scroll-progress',
        progress.toFixed(4)
      );
      appRef.current.style.setProperty(
        '--scroll-grid-shift',
        `${-gridShift.toFixed(1)}px`
      );
      ticking = false;
    };

    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(updateScrollTelemetry);
        ticking = true;
      }
    };

    updateScrollTelemetry();
    window.addEventListener('scroll', handleScroll, { passive: true });
    window.addEventListener('resize', handleScroll, { passive: true });

    return () => {
      window.removeEventListener('scroll', handleScroll);
      window.removeEventListener('resize', handleScroll);
    };
  }, [reducedMotion]);

  useEffect(() => {
    const revealElements = document.querySelectorAll('.reveal-block');

    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            entry.target.classList.add('is-visible');
          }
        });
      },
      {
        threshold: 0.12,
        rootMargin: '0px 0px -40px 0px'
      }
    );

    revealElements.forEach((el) => observer.observe(el));

    return () => observer.disconnect();
  }, [isPortalGateOpen, activeEraId]);

  return (
    <div
      ref={appRef}
      className="chronos-app"
      data-era={currentEra.id}
      data-motion={reducedMotion ? 'reduced' : 'full'}
    >
      <a href="#chronos-main-content" className="skip-to-content">
        SKIP TO TEMPORAL STAGE
      </a>

      <div className="sr-only" aria-live="polite" aria-atomic="true">
        Active Temporal Era: {currentEra.name}, Epoch {currentEra.epoch}.
      </div>

      <div className="scroll-progress-track" aria-hidden="true">
        <div className="scroll-progress-bar" />
      </div>

      <div
        className={`era-transition-curtain ${isJumping ? 'is-active' : ''}`}
        aria-hidden="true"
      />

      {isPortalGateOpen && (
        <PortalOpeningGate
          activeEra={currentEra}
          eras={ERAS_DATA}
          onSelectEra={handleSelectEra}
          onCompleteBreach={() => setIsPortalGateOpen(false)}
        />
      )}

      <div className="ambient-canvas" aria-hidden="true">
        <div className="ambient-nebula" />
        <div className="ambient-grid" />
        <div className="ambient-vignette" />
      </div>

      <header className="chronos-hud-top">
        <div className="hud-container">
          <div className="hud-brand">
            <span className="hud-core-dot" />
            <span className="hud-logo-text">CHRONOS</span>
          </div>

          <div className="hud-telemetry">
            <span className="hud-coordinate-pill">
              {currentEra.coordinates}
            </span>
            <span className="text-mono hud-epoch-readout">
              EPOCH // {currentEra.epoch}
            </span>

            <button
              type="button"
              className={`btn-hud-motion ${reducedMotion ? 'active' : ''}`}
              aria-pressed={reducedMotion}
              onClick={() => setReducedMotion((prev) => !prev)}
              title="Toggle Reduced Motion & Eco GPU Mode"
            >
              {reducedMotion ? 'MOTION: LOW' : 'MOTION: FULL'}
            </button>

            <button
              type="button"
              className="btn-hud-portal"
              onClick={() => setIsPortalGateOpen(true)}
            >
              PORTAL GATE
            </button>
          </div>
        </div>
      </header>

      <main id="chronos-main-content" className="chronos-main">
        <section className="portal-hero-section reveal-block is-visible">
          <div className="portal-hero-copy">
            <div className="portal-telemetry-strip">
              <span className="text-mono">
                SINGULARITY LOCK // ERA {currentEra.index}
              </span>
              <span className="telemetry-tag">{currentEra.atmosphere}</span>
            </div>

            <h1 className="title-display">{currentEra.name}</h1>
            <p className="text-body">{currentEra.description}</p>

            <div
              className="era-switcher-bar"
              role="group"
              aria-label="Select Temporal Era"
            >
              {ERAS_DATA.map((era) => (
                <button
                  key={era.id}
                  type="button"
                  aria-pressed={activeEraId === era.id}
                  className={`btn-chronos ${
                    activeEraId === era.id ? 'active' : ''
                  }`}
                  onClick={() => handleSelectEra(era.id)}
                >
                  <span>{era.index}</span>
                  <span>{era.name}</span>
                </button>
              ))}
            </div>
          </div>

          <VortexCore
            activeEra={currentEra}
            eras={ERAS_DATA}
            onSelectEra={handleSelectEra}
            isJumping={isJumping}
            showOrbitalNodes={true}
          />
        </section>

        {/* EraScenes with Key Prop to naturally reset state without useEffect */}
        <EraScenes
          key={currentEra.id}
          activeEra={currentEra}
          eras={ERAS_DATA}
          onSelectEra={handleSelectEra}
        />

        <ScrollStory
          activeEraId={currentEra.id}
          onSelectEra={handleSelectEra}
        />

        <div className="reveal-block">
          <TimelineNav
            activeEra={currentEra}
            eras={ERAS_DATA}
            onSelectEra={handleSelectEra}
          />
        </div>
      </main>

      <footer className="chronos-footer">
        <div className="footer-container">
          <div className="footer-left">
            <span className="text-mono">
              CHRONOS TEMPORAL ENGINE // ALL SYSTEMS NOMINAL
            </span>
            <span className="artifact-summary">
              Designed for Multi-Era Chronometric Exploration — Ancient Earth,
              Present Day &amp; Future 3026.
            </span>
          </div>

          <div
            className="keyboard-shortcuts-bar"
            aria-label="Keyboard Navigation Shortcuts"
          >
            <span className="shortcut-item">
              <kbd className="kbd-key">1</kbd>
              <kbd className="kbd-key">2</kbd>
              <kbd className="kbd-key">3</kbd>
              <span>SELECT ERA</span>
            </span>
            <span className="shortcut-item">
              <kbd className="kbd-key">←</kbd>
              <kbd className="kbd-key">→</kbd>
              <span>CYCLE TIMELINE</span>
            </span>
            <span className="shortcut-item">
              <kbd className="kbd-key">ESC</kbd>
              <span>BYPASS GATE</span>
            </span>
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;