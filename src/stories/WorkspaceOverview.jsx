import React, { useState } from 'react';
import {
  getBasePaletteFamilies,
  getBorderTokens,
  getComponentCatalog,
  getEffectShowcase,
  getFoundationCollections,
  getOverviewStats,
  getTokenSearchRecords,
  getSemanticColorTokens,
  getTypographyShowcase,
} from '../design-system-data.js';

const stats = getOverviewStats();
const basePalettes = getBasePaletteFamilies();
const semanticTokens = getSemanticColorTokens();
const foundations = getFoundationCollections();
const borderTokens = getBorderTokens();
const typography = getTypographyShowcase();
const effects = getEffectShowcase();
const components = getComponentCatalog();
const searchRecords = getTokenSearchRecords();
const liveStoryIds = {
  button: 'components-button--visual-system',
  tag: 'components-tag--visual-system',
  input: 'components-input--visual-system',
};

function SectionHeader({ title, body, id }) {
  return (
    <div className="section-heading" id={id}>
      <div>
        <p className="section-kicker">{id}</p>
        <h2>{title}</h2>
      </div>
      <p>{body}</p>
    </div>
  );
}

export function WorkspaceOverview() {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');

  const normalizedQuery = query.trim().toLowerCase();
  const filteredRecords = searchRecords.filter((record) => {
    if (kind !== 'all' && record.kind !== kind) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return record.searchText.includes(normalizedQuery);
  }).slice(0, 24);

  return (
    <div className="workbench-shell">
      <aside className="sidebar">
        <div className="sidebar-panel">
          <p className="eyebrow">Design System Workbench</p>
          <h1>Token runtime + component spec atlas</h1>
          <p className="sidebar-copy">
            A Storybook surface for reviewing generated tokens, source scales, and component JSON
            specs in one place.
          </p>
          <nav className="sidebar-nav">
            <a href="#overview">Overview</a>
            <a href="#foundations">Foundations</a>
            <a href="#semantic">Semantic colors</a>
            <a href="#typography">Typography</a>
            <a href="#effects">Effects</a>
            <a href="#search">Search</a>
            <a href="#components">Components</a>
          </nav>
        </div>
      </aside>

      <main className="main-stage">
        <div className="page-width">
          <section className="hero-panel" id="overview">
            <div className="hero-copy">
              <p className="eyebrow">Repository dashboard</p>
              <h2>Built for token inspection, component audit, and drift review.</h2>
              <p>
                The page is driven by generated theme output plus raw token sources and component
                specs. That makes gaps visible: the combined theme currently exposes colors, radius,
                and border, while other scales still live in source JSON and should be reviewed
                there.
              </p>
            </div>
            <div className="stats">
              <div className="stat-card">
                <strong>{stats.tokenCount}</strong>
                <span>Generated tokens in `theme.json`</span>
              </div>
              <div className="stat-card">
                <strong>{stats.topLevelGroups}</strong>
                <span>Declared top-level groups</span>
              </div>
              <div className="stat-card">
                <strong>{stats.basePaletteCount}</strong>
                <span>Base color families</span>
              </div>
              <div className="stat-card">
                <strong>{stats.componentCount}</strong>
                <span>Component specs discovered</span>
              </div>
            </div>
          </section>

          <section className="section">
            <SectionHeader
              id="foundations"
              title="Foundation scales"
              body="Numeric scales are loaded from source JSON so the workbench remains useful even when the generated theme is intentionally partial."
            />

            <div className="foundation-grid">
              {foundations.map((collection) => (
                <article className="foundation-card" key={collection.name}>
                  <div className="foundation-top">
                    <strong>{collection.name}</strong>
                    <span>{collection.collection}</span>
                  </div>
                  <code>{collection.naming}</code>
                  <div className="token-chip-grid">
                    {collection.items.map((item) => (
                      <div className="token-chip" key={item.name}>
                        <span>{item.name}</span>
                        <strong>{item.value}</strong>
                      </div>
                    ))}
                  </div>
                </article>
              ))}
            </div>

            <div className="mini-section">
              <h3>Border primitives</h3>
              <div className="mini-card-grid">
                {borderTokens.map((token) => (
                  <article className="mini-card" key={token.name}>
                    <strong>{token.name}</strong>
                    <span>{String(token.value)}</span>
                    {token.figma ? <code>{token.figma}</code> : null}
                  </article>
                ))}
              </div>
            </div>

            <div className="mini-section">
              <h3>Base palettes</h3>
              <div className="palette-family-grid">
                {basePalettes.map((family) => (
                  <article className="palette-family-card" key={family.family}>
                    <div className="palette-family-top">
                      <strong>{family.family}</strong>
                      <span>{family.swatches.length} steps</span>
                    </div>
                    <div className="palette-strip">
                      {family.swatches.map((swatch) => (
                        <div
                          className="palette-step"
                          key={`${family.family}-${swatch.step}`}
                          style={{ background: swatch.light }}
                          title={`${family.family}/${swatch.step} ${swatch.light}`}
                        />
                      ))}
                    </div>
                  </article>
                ))}
              </div>
            </div>
          </section>

          <section className="section">
            <SectionHeader
              id="semantic"
              title="Semantic color tokens"
              body="Aliases are surfaced as alias paths so you can review intended mapping instead of only raw hex output."
            />
            <div className="swatch-grid">
              {semanticTokens.map((token) => (
                <article className="swatch-card" key={token.figma || token.name}>
                  <div className="semantic-preview">
                    <div className="semantic-tone">
                      <span>Light</span>
                      <div
                        className="swatch-color"
                        style={{
                          background: typeof token.lightValue === 'string' && token.lightValue.startsWith('#')
                            ? token.lightValue
                            : 'linear-gradient(135deg, #efe6d0, #e2d5b4)',
                        }}
                      />
                    </div>
                    <div className="semantic-tone">
                      <span>Dark</span>
                      <div
                        className="swatch-color"
                        style={{
                          background: typeof token.darkValue === 'string' && token.darkValue.startsWith('#')
                            ? token.darkValue
                            : 'linear-gradient(135deg, #47433a, #2d2a24)',
                        }}
                      />
                    </div>
                  </div>
                  <div className="swatch-meta">
                    <strong>{token.name}</strong>
                    <code>{String(token.lightValue)}</code>
                    <code>{String(token.darkValue)}</code>
                    <code>{token.figma}</code>
                  </div>
                </article>
              ))}
            </div>
          </section>

          <section className="section">
            <SectionHeader
              id="typography"
              title="Typography sets"
              body="A quick visual read of English and Chinese text styles to validate naming and scale continuity."
            />
            <div className="type-columns">
              {typography.map((group) => (
                <article className="type-column" key={group.label}>
                  <div className="type-column-top">
                    <strong>{group.label} styles</strong>
                    <span>{group.items.length} samples</span>
                  </div>
                  {group.items.map((style) => (
                    <div className="type-sample" key={style.ref}>
                      <div>
                        <strong>{style.name}</strong>
                        <code>{style.ref}</code>
                      </div>
                      <p
                        style={{
                          fontSize: `${style.fontSize}px`,
                          lineHeight: `${style.lineHeight}px`,
                          fontWeight: style.fontWeight,
                        }}
                      >
                        The quick brown fox jumps over the system.
                      </p>
                    </div>
                  ))}
                </article>
              ))}
            </div>
          </section>

          <section className="section">
            <SectionHeader
              id="effects"
              title="Effect tokens"
              body="Global and component-level shadow recipes are flattened for auditability."
            />
            <div className="effect-columns">
              <article className="effect-column">
                <div className="effect-column-top">
                  <strong>Global</strong>
                  <span>{effects.global.length} styles</span>
                </div>
                {effects.global.map((effect) => (
                  <div className="effect-card" key={effect.ref}>
                    <strong>{effect.name}</strong>
                    <code>{effect.ref}</code>
                    <p>{effect.layers} shadow layers</p>
                  </div>
                ))}
              </article>

              {effects.component.map((group) => (
                <article className="effect-column" key={group.component}>
                  <div className="effect-column-top">
                    <strong>{group.component}</strong>
                    <span>{group.items.length} styles</span>
                  </div>
                  {group.items.map((effect) => (
                    <div className="effect-card" key={effect.ref}>
                      <strong>{effect.name}</strong>
                      <code>{effect.ref}</code>
                      <p>{effect.layers} shadow layers</p>
                    </div>
                  ))}
                </article>
              ))}
            </div>
          </section>

          <section className="section">
            <SectionHeader
              id="search"
              title="Token and component search"
              body="Search refs, groups, component names, or token aliases. This gives you one fast lookup surface before drilling into the detailed stories."
            />
            <div className="search-panel">
              <div className="explorer-controls">
                <input
                  aria-label="Search tokens and components"
                  className="explorer-input"
                  type="search"
                  placeholder="Try `Button`, `Brand/Primary`, `paddingXs8`, `foreground`..."
                  value={query}
                  onChange={(event) => setQuery(event.target.value)}
                />
                <div className="filter-pill-row">
                  {['all', 'token', 'component', 'component-ref'].map((option) => (
                    <button
                      key={option}
                      className={option === kind ? 'filter-pill is-active' : 'filter-pill'}
                      type="button"
                      onClick={() => setKind(option)}
                    >
                      {option}
                    </button>
                  ))}
                </div>
              </div>
              <div className="explorer-table">
                <div className="explorer-row explorer-head">
                  <span>Kind</span>
                  <span>Group</span>
                  <span>Name</span>
                  <span>Ref</span>
                  <span>Component</span>
                  <span>Value</span>
                </div>
                {filteredRecords.map((record, index) => (
                  <div className="explorer-row" key={`${record.kind}-${record.ref}-${index}`}>
                    <span>{record.kind}</span>
                    <span>{record.group}</span>
                    <span>{record.name}</span>
                    <code>{record.ref}</code>
                    <span>{record.component || '—'}</span>
                    <span>{record.value}</span>
                  </div>
                ))}
              </div>
            </div>
          </section>

          <section className="section">
            <SectionHeader
              id="components"
              title="Component catalog"
              body="Every JSON component spec in `tokens/components` is indexed into a compact audit view with variant axes, anatomy, source links, and referenced tokens."
            />

            <div className="component-grid">
              {components.map((component) => (
                <article className="component-card" key={component.slug}>
                  <div className="component-card-top">
                    <div>
                      <p className="component-dna">{component.dna}</p>
                      <h3>{component.name}</h3>
                    </div>
                    <div className="component-metrics">
                      <strong>{component.variantCount}</strong>
                      <span>variants</span>
                    </div>
                  </div>

                  <p className="component-description">{component.description}</p>

                  <div className="component-link-row">
                    {component.docsUrl ? (
                      <a href={component.docsUrl} target="_blank" rel="noreferrer">
                        Docs
                      </a>
                    ) : null}
                    {component.figmaUrl ? (
                      <a href={component.figmaUrl} target="_blank" rel="noreferrer">
                        Figma
                      </a>
                    ) : null}
                    <a
                      href={
                        component.implementationStatus === 'implemented'
                          ? `?path=/story/${liveStoryIds[component.slug] || `components-specs--${component.slug}`}`
                          : `?path=/story/components-specs--${component.slug}`
                      }
                    >
                      Story
                    </a>
                  </div>

                  <div className="component-block">
                    <strong>Variant axes</strong>
                    <div className="token-chip-grid">
                      {component.variants.map((variant) => (
                        <div className="token-chip" key={`${component.slug}-${variant.name}`}>
                          <span>{variant.name}</span>
                          <strong>{variant.count}</strong>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="component-block">
                    <strong>Anatomy</strong>
                    <div className="bullet-list">
                      {component.anatomy.slice(0, 5).map((layer) => (
                        <p key={`${component.slug}-${layer.name}`}>
                          <span>{layer.name}</span>
                          {layer.role}
                        </p>
                      ))}
                    </div>
                  </div>

                  {component.styleResolution.length ? (
                    <div className="component-block">
                      <strong>Style resolution</strong>
                      <div className="bullet-list">
                        {component.styleResolution.slice(0, 4).map((rule) => (
                          <p key={rule}>{rule}</p>
                        ))}
                      </div>
                    </div>
                  ) : null}

                  {component.naming.example ? (
                    <div className="component-block">
                      <strong>Naming example</strong>
                      <code>{component.naming.example}</code>
                    </div>
                  ) : null}

                  <div className="component-block">
                    <strong>Referenced tokens</strong>
                    <div className="ref-list">
                      {component.refs.slice(0, 10).map((ref) => (
                        <code key={`${component.slug}-${ref}`}>{ref}</code>
                      ))}
                    </div>
                  </div>

                  <div className="component-block">
                    <strong>Implementation</strong>
                    <p className="component-description">
                      {component.implementationStatus === 'implemented'
                        ? 'A matching React component appears to exist and can be mounted next.'
                        : 'Spec only for now. When `src/components` gains a real implementation, this card can link to a live preview.'}
                    </p>
                  </div>
                </article>
              ))}
            </div>
          </section>
        </div>
      </main>
    </div>
  );
}
