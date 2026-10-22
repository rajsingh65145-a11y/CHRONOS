import { useState } from 'react';
import '../styles/timeline.css';

function TimelineNav({ activeEra, eras, onSelectEra }) {
  const [isHarmonicsActive, setIsHarmonicsActive] = useState(false);
  const [isSingularityLocked, setIsSingularityLocked] = useState(true);

  const eraIndexMap = { ancient: 0, present: 1, future: 2 };
  const currentIndex = eraIndexMap[activeEra.id] ?? 1;

  const handleSliderChange = (e) => {
    const val = Number(e.target.value);
    const targetEra = eras[val];
    if (targetEra && targetEra.id !== activeEra.id) {
      onSelectEra(targetEra.id);
    }
  };

  const progressPercentage = (currentIndex / (eras.length - 1)) * 100;

  return (
    <section className="timeline-section" aria-label="Chronometric Timeline">
      <div className="glass-panel timeline-container">
        <div className="timeline-header-row">
          <div className="timeline-title-group">
            <span className="timeline-status-badge">
              CHRONOMETRIC SCRUBBER // ACTIVE EPOCH: {activeEra.epoch}
            </span>
            <h2 className="title-section">Temporal Continuum Axis</h2>
          </div>
          <span className="text-mono">
            COORDINATE SHIFT: {activeEra.coordinates.split('//')[0]}
          </span>
        </div>

        <div className="timeline-track-wrapper">
          <input
            type="range"
            min="0"
            max={eras.length - 1}
            step="1"
            value={currentIndex}
            onChange={handleSliderChange}
            className="timeline-range-input"
            aria-label="Scrub temporal eras"
          />

          <div className="timeline-visual-bar" aria-hidden="true">
            <div
              className="timeline-progress-fill"
              style={{ width: `${progressPercentage}%` }}
            />
          </div>

          <div className="timeline-nodes-row" aria-hidden="true">
            {eras.map((era, idx) => {
              const isActive = era.id === activeEra.id;
              return (
                <button
                  key={era.id}
                  type="button"
                  className={`timeline-epoch-node ${isActive ? 'active' : ''}`}
                  onClick={() => onSelectEra(era.id)}
                >
                  <div className="epoch-node-marker">
                    <span className="epoch-node-dot" />
                    <span>0{idx + 1} // {era.epoch}</span>
                  </div>
                  <span className="epoch-node-name">{era.name}</span>
                </button>
              );
            })}
          </div>
        </div>

        <div className="telemetry-controls-grid">
          <div className="control-widget">
            <span className="control-widget-label">TELLURIC HARMONICS</span>
            <div className="control-widget-action">
              <span className="control-value-readout">
                {isHarmonicsActive ? activeEra.frequency : 'STANDBY'}
              </span>
              <button
                type="button"
                className={`control-toggle-btn ${
                  isHarmonicsActive ? 'active' : ''
                }`}
                onClick={() => setIsHarmonicsActive(!isHarmonicsActive)}
              >
                {isHarmonicsActive ? 'MUTED' : 'ENGAGE'}
              </button>
            </div>
          </div>

          <div className="control-widget">
            <span className="control-widget-label">SINGULARITY STABILITY</span>
            <div className="control-widget-action">
              <span className="control-value-readout">
                {isSingularityLocked ? 'LOCKED // 99.9%' : 'DRIFT WARNING'}
              </span>
              <button
                type="button"
                className={`control-toggle-btn ${
                  isSingularityLocked ? 'active' : ''
                }`}
                onClick={() => setIsSingularityLocked(!isSingularityLocked)}
              >
                {isSingularityLocked ? 'SECURE' : 'OVERRIDE'}
              </button>
            </div>
          </div>

          <div className="control-widget">
            <span className="control-widget-label">TEMPORAL FLUX VELOCITY</span>
            <div className="control-widget-action">
              <span className="control-value-readout">1.0X TACHYON SPEED</span>
              <span className="text-mono">SYNC OK</span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}

export default TimelineNav;