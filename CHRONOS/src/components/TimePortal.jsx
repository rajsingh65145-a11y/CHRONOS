import { useState, useRef, useEffect } from 'react';
import '../styles/portal.css';

function VortexCore({
  activeEra,
  eras,
  onSelectEra,
  isJumping,
  showOrbitalNodes = true
}) {
  const vortexRef = useRef(null);

  const handleMouseMove = (event) => {
    if (!vortexRef.current) return;
    const rect = vortexRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;

    const deltaX = (event.clientX - centerX) / (rect.width / 2);
    const deltaY = (event.clientY - centerY) / (rect.height / 2);

    const tiltX = (-deltaY * 12).toFixed(2);
    const tiltY = (deltaX * 12).toFixed(2);

    vortexRef.current.style.setProperty('--tilt-x', `${tiltX}deg`);
    vortexRef.current.style.setProperty('--tilt-y', `${tiltY}deg`);
  };

  const handleMouseLeave = () => {
    if (!vortexRef.current) return;
    vortexRef.current.style.setProperty('--tilt-x', '0deg');
    vortexRef.current.style.setProperty('--tilt-y', '0deg');
  };

  return (
    <div
      className="portal-Interactive-wrapper"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
    >
      <div
        ref={vortexRef}
        className={`vortex-assembly ${isJumping ? 'era-jumping' : ''}`}
      >
        <div className="portal-ambient-halo" aria-hidden="true" />

        <svg
          className="portal-dial-svg"
          viewBox="0 0 200 200"
          aria-hidden="true"
        >
          <circle
            cx="100"
            cy="100"
            r="96"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.6"
            strokeDasharray="2 6"
          />
          <circle
            cx="100"
            cy="100"
            r="90"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.2"
            strokeDasharray="18 10 4 10"
          />
          <circle
            cx="100"
            cy="100"
            r="83"
            fill="none"
            stroke="currentColor"
            strokeWidth="0.5"
            strokeDasharray="1 4"
          />
        </svg>

        <div className="portal-accretion-disk" aria-hidden="true" />
        <div className="portal-energy-stream" aria-hidden="true" />

        <div className="portal-gyro-ring ring-alpha" aria-hidden="true" />
        <div className="portal-gyro-ring ring-beta" aria-hidden="true" />
        <div className="portal-gyro-ring ring-gamma" aria-hidden="true" />

        <div className="portal-singularity-core">
          <span className="core-epoch-label">{activeEra.epoch}</span>
          <span className="core-era-Readout">{activeEra.name}</span>
          <span className="core-freq-readout">{activeEra.frequency}</span>
        </div>

        {showOrbitalNodes &&
          eras.map((era) => {
            const isSelected = activeEra.id === era.id;
            return (
              <button
                key={era.id}
                type="button"
                aria-pressed={isSelected}
                className={`portal-orbital-node node-${era.id} ${
                  isSelected ? 'active' : ''
                }`}
                onClick={() => onSelectEra(era.id)}
                aria-label={`Select ${era.name} (${era.epoch})`}
              >
                <span className="node-indicator-dot" />
                <span>
                  {era.index} // {era.name}
                </span>
              </button>
            );
          })}
      </div>
    </div>
  );
}

export function PortalOpeningGate({
  activeEra,
  eras,
  onSelectEra,
  onCompleteBreach
}) {
  const [isWarping, setIsWarping] = useState(false);
  const warpTimerRef = useRef(null);

  const triggerPortalBreach = () => {
    if (isWarping) return;
    setIsWarping(true);
    warpTimerRef.current = window.setTimeout(() => {
      onCompleteBreach();
    }, 750);
  };

  useEffect(() => {
    const handleKeyDown = (event) => {
      if (event.key === 'Escape') {
        if (warpTimerRef.current) window.clearTimeout(warpTimerRef.current);
        onCompleteBreach();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => {
      window.removeEventListener('keydown', handleKeyDown);
      if (warpTimerRef.current) window.clearTimeout(warpTimerRef.current);
    };
  }, [onCompleteBreach]);

  return (
    <div
      className={`portal-intro-overlay ${isWarping ? 'is-warping' : ''}`}
      role="dialog"
      aria-modal="true"
      aria-label="Chronos Temporal Portal Gate"
    >
      <div className="intro-flash-layer" aria-hidden="true" />

      <div className="cinema-letterbox top" aria-hidden="true">
        <span>CHRONOS // SINGULARITY ENGINE V3.026</span>
        <span>PRESS [ESC] TO BYPASS GATE</span>
      </div>

      <div className="intro-top-meta">
        <div className="intro-status-pill">
          <span className="status-pulse-dot" />
          <span>EINSTEIN-ROSEN BRIDGE READY // TARGET: {activeEra.epoch}</span>
        </div>
      </div>

      <VortexCore
        activeEra={activeEra}
        eras={eras}
        onSelectEra={onSelectEra}
        isJumping={isWarping}
        showOrbitalNodes={true}
      />

      <div className="intro-bottom-controls">
        <h1 className="intro-title">CHRONOS</h1>
        <p className="intro-subtitle">
          SELECT AN ORBITAL EPOCH NODE OR BREACH THE SINGULARITY TO ENTER THE
          TIMELINE
        </p>
        <button
          type="button"
          className="btn-portal-breach"
          onClick={triggerPortalBreach}
        >
          {isWarping
            ? 'WARPING THROUGH SPACETIME...'
            : `ENTER ${activeEra.name.toUpperCase()}`}
        </button>
      </div>

      <div className="cinema-letterbox bottom" aria-hidden="true">
        <span>COORDINATES // {activeEra.coordinates}</span>
        <span>FREQ // {activeEra.frequency}</span>
      </div>
    </div>
  );
}

export default VortexCore;