const STORY_CHAPTERS = [
  {
    id: 'chapter-ancient',
    eraId: 'ancient',
    step: 'CHAPTER I // THE ORIGIN SIGNAL',
    epoch: '65,000,000 BCE',
    title: 'The Basalt Resonance Awakening',
    narrative:
      'Long before human civilization, a crystalline singularity embedded itself deep within the Pangaea super-rift. Volcanic heat charged its fractal monoliths, broadcasting a 14.2 Hz gravimetric pulse forward through spacetime.',
    ctaLabel: 'EXPERIENCE ANCIENT EARTH'
  },
  {
    id: 'chapter-present',
    eraId: 'present',
    step: 'CHAPTER II // THE ANTHROPOCENE DECRYPTION',
    epoch: '2026 CE',
    title: 'Project Chronos & The Quantum Lock',
    narrative:
      'In 2026, orbital telemetry rings and cryo-quantum spires detected the ancient 14.2 Hz echo buried beneath the Pacific trench. By harmonizing fiber-optic carrier waves with the monolith frequency, humanity opened the first Einstein-Rosen bridge.',
    ctaLabel: 'EXPERIENCE PRESENT DAY'
  },
  {
    id: 'chapter-future',
    eraId: 'future',
    step: 'CHAPTER III // THE DYSON ASCENSION',
    epoch: '3026 CE',
    title: 'Architects of the Folded Continuum',
    narrative:
      'A thousand years later, post-planetary civilization harnessed the entire output of a star via the Helios Dyson Ring. Using tachyon fold-gates, citizens of 3026 sent the original basalt monolith back to 65,000,000 BCE—completing the eternal causal loop.',
    ctaLabel: 'EXPERIENCE FUTURE 3026'
  }
];

function ScrollStory({ activeEraId, onSelectEra }) {
  const handleChapterSelect = (eraId) => {
    onSelectEra(eraId);
    const stageEl = document.getElementById('chronos-holo-stage');
    if (stageEl) {
      stageEl.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  };

  return (
    <section
      className="story-spine-section reveal-block"
      aria-label="Causal Loop Storytelling"
    >
      <div className="story-spine-header">
        <span className="text-mono">
          CAUSAL LOOP ARCHIVE // SCROLL TO TRACE THE PARADOX
        </span>
        <h2 className="title-section">The Eternal Chronos Paradox</h2>
      </div>

      <div className="story-timeline-axis">
        {STORY_CHAPTERS.map((chapter, index) => {
          const isCurrent = chapter.eraId === activeEraId;
          return (
            <article
              key={chapter.id}
              className={`glass-panel story-chapter-card reveal-block reveal-delay-${
                index + 1
              } ${isCurrent ? 'active-chapter' : ''}`}
            >
              <span className="story-spine-node" aria-hidden="true" />

              <div className="story-chapter-content">
                <div className="story-chapter-meta">
                  <span className="text-mono">{chapter.step}</span>
                  <span className="story-chapter-badge">{chapter.epoch}</span>
                </div>
                <h3 className="story-chapter-title">{chapter.title}</h3>
                <p className="story-chapter-desc">{chapter.narrative}</p>
              </div>

              <button
                type="button"
                className={`btn-chronos ${isCurrent ? 'active' : ''}`}
                onClick={() => handleChapterSelect(chapter.eraId)}
              >
                {isCurrent ? 'ACTIVE CHAPTER' : chapter.ctaLabel}
              </button>
            </article>
          );
        })}
      </div>
    </section>
  );
}

export default ScrollStory;