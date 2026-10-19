import { useState, useRef } from 'react';
import '../styles/scenes.css';

function EraDioramaArtwork({ eraId }) {
  if (eraId === 'ancient') {
    return (
      <div
        className="diorama-art-layer diorama-ancient diorama-parallax-layer"
        aria-hidden="true"
      >
        <div className="ancient-eclipse-sun" />
        <div className="ancient-lava-fissure" />
        <div className="ancient-volcano-ridge" />
        <div className="ancient-monolith mono-left" />
        <div className="ancient-monolith mono-center" />
        <div className="ancient-monolith mono-right" />
      </div>
    );
  }

  if (eraId === 'future') {
    return (
      <div
        className="diorama-art-layer diorama-future diorama-parallax-layer"
        aria-hidden="true"
      >
        <div className="future-dyson-star" />
        <div className="future-dyson-ring ring-1" />
        <div className="future-dyson-ring ring-2" />
        <div className="future-citadel-pod" />
      </div>
    );
  }

  // Default: Present Day (2026 CE)
  return (
    <div
      className="diorama-art-layer diorama-present diorama-parallax-layer"
      aria-hidden="true"
    >
      <div className="present-orbital-arc" />
      <div className="present-data-beam b1" />
      <div className="present-data-beam b2" />
      <div className="present-data-beam b3" />
      <div className="present-city-skyline">
        <div className="city-tower t1" />
        <div className="city-tower t2" />
        <div className="city-tower t3" />
        <div className="city-tower t4" />
        <div className="city-tower t5" />
        <div className="city-tower t6" />
      </div>
    </div>
  );
}

export default function EraScenes({ activeEra, eras, onSelectEra }) {
  const [selectedArtifactIndex, setSelectedArtifactIndex] = useState(0);
  const stageViewportRef = useRef(null);

  const artifacts = activeEra.artifacts || [];
  const currentArtifact =
    artifacts[selectedArtifactIndex] || artifacts[0] || {};

  const handleEraCardSelect = (eraId) => {
    setSelectedArtifactIndex(0);
    onSelectEra(eraId);
  };

  const handleSceneMouseMove = (event) => {
    if (!stageViewportRef.current) return;
    const rect = stageViewportRef.current.getBoundingClientRect();
    const normX = (event.clientX - rect.left) / rect.width - 0.5;
    const normY = (event.clientY - rect.top) / rect.height - 0.5;
    stageViewportRef.current.style.setProperty(
      '--scene-px',
      (-normX * 1.6).toFixed(3)
    );
    stageViewportRef.current.style.setProperty(
      '--scene-py',
      (-normY * 1.6).toFixed(3)
    );
  };

  const handleSceneMouseLeave = () => {
    if (!stageViewportRef.current) return;
    stageViewportRef.current.style.setProperty('--scene-px', '0');
    stageViewportRef.current.style.setProperty('--scene-py', '0');
  };

  return (
    <div className="scenes-wrapper">
      <section
        id="chronos-holo-stage"
        className="world-stage-section reveal-block"
        aria-label={`${activeEra.name} Interactive Environment`}
      >
        <div className="stage-header-bar">
          <div className="stage-header-left">
            <span className="text-mono">
              HOLO-STAGE SIMULATION // SECTOR {activeEra.index}
            </span>
            <h2 className="title-section">
              {activeEra.name} — {activeEra.tagline}
            </h2>
          </div>

          <div className="stage-metrics-strip">
            <div className="metric-chip">
              <span className="metric-chip-label">GRAVITY</span>
              <span className="metric-chip-val">
                {activeEra.metrics.gravity}
              </span>
            </div>
            <div className="metric-chip">
              <span className="metric-chip-label">TEMPORAL DRIFT</span>
              <span className="metric-chip-val">
                {activeEra.metrics.temporalDrift}
              </span>
            </div>
            <div className="metric-chip">
              <span className="metric-chip-label">HAZARD CLASS</span>
              <span className="metric-chip-val">
                {activeEra.metrics.hazardLevel}
              </span>
            </div>
          </div>
        </div>

        <div className="world-stage-grid">
          <div
            ref={stageViewportRef}
            className="diorama-viewport"
            onMouseMove={handleSceneMouseMove}
            onMouseLeave={handleSceneMouseLeave}
          >
            <EraDioramaArtwork eraId={activeEra.id} />

            <div className="diorama-hud-top">
              <span className="diorama-live-tag">
                LIVE FEED // {activeEra.epoch}
              </span>
              <span className="diorama-live-tag">
                DAY CYCLE: {activeEra.metrics.dayLength}
              </span>
            </div>

            {artifacts.map((item, idx) => (
              <button
                key={item.id}
                type="button"
                aria-pressed={selectedArtifactIndex === idx}
                className={`scene-hotspot-pin pin-pos-${idx} ${
                  selectedArtifactIndex === idx ? 'active' : ''
                }`}
                onClick={() => setSelectedArtifactIndex(idx)}
              >
                <span className="pin-beacon" />
                <span>{item.code}</span>
              </button>
            ))}

            <div className="diorama-hud-bottom">
              <span className="text-mono">{activeEra.coordinates}</span>
              <span className="text-mono">MOVE CURSOR FOR PARALLAX</span>
            </div>
          </div>

          <aside className="glass-panel inspector-console">
            <div className="inspector-top">
              <span className="text-mono">
                TEMPORAL ANOMALY INSPECTOR // 0{selectedArtifactIndex + 1} OF 0
                {artifacts.length}
              </span>

              <div
                className="artifact-tabs"
                role="tablist"
                aria-label="Anomaly Hotspots"
              >
                {artifacts.map((item, idx) => (
                  <button
                    key={item.id}
                    type="button"
                    role="tab"
                    aria-selected={selectedArtifactIndex === idx}
                    className={`artifact-tab-btn ${
                      selectedArtifactIndex === idx ? 'active' : ''
                    }`}
                    onClick={() => setSelectedArtifactIndex(idx)}
                  >
                    {item.code}
                  </button>
                ))}
              </div>

              <div className="artifact-detail-box">
                <span className="text-mono">{currentArtifact.coords}</span>
                <h3 className="artifact-title">{currentArtifact.title}</h3>
                <p className="artifact-summary">{currentArtifact.summary}</p>
                <div className="artifact-energy-bar">
                  <span>ENERGY SIGNATURE</span>
                  <span>{currentArtifact.energy}</span>
                </div>
              </div>
            </div>

            <div className="chronicle-log-box">
              <span className="text-mono">ARCHIVAL FIELD LOG</span>
              <p className="chronicle-text">{activeEra.chronicle}</p>
            </div>
          </aside>
        </div>
      </section>

      <section
        className="worlds-atlas-section reveal-block"
        aria-label="All Three Temporal Worlds"
      >
        <div className="stage-header-left">
          <span className="text-mono">
            MULTIVERSE MATRIX // ALL THREE EPOCHS
          </span>
          <h2 className="title-section">Chronos World Atlas</h2>
        </div>

        <div className="atlas-cards-stack">
          {eras.map((era, idx) => {
            const isCurrent = era.id === activeEra.id;
            return (
              <article
                key={era.id}
                data-card-era={era.id}
                className={`glass-panel atlas-world-card reveal-block reveal-delay-${
                  idx + 1
                } ${isCurrent ? 'is-current' : ''}`}
                onClick={() => handleEraCardSelect(era.id)}
              >
                <div className="atlas-card-top">
                  <div className="atlas-index-row">
                    <span className="text-mono">
                      WORLD {era.index} // {era.epoch}
                    </span>
                    {isCurrent && (
                      <span className="text-mono">[ACTIVE LOCK]</span>
                    )}
                  </div>

                  <h3 className="atlas-era-title">{era.name}</h3>
                  <p className="artifact-summary">{era.description}</p>
                </div>

                <ul className="atlas-artifact-list">
                  {era.artifacts.map((art) => (
                    <li key={art.id} className="atlas-atlas-item">
                      <span className="atlas-bullet" />
                      <span>{art.title}</span>
                    </li>
                  ))}
                </ul>

                <button
                  type="button"
                  className={`btn-chronos ${isCurrent ? 'active' : ''}`}
                  onClick={(e) => {
                    e.stopPropagation();
                    handleEraCardSelect(era.id);
                  }}
                >
                  {isCurrent
                    ? `LOCKED IN ${era.name}`
                    : `WARP TO ${era.name}`}
                </button>
              </article>
            );
          })}
        </div>
      </section>
    </div>
  );
}