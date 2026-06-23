import React from 'react';
import { getComponentBySlug } from '../design-system-data.js';
import { Button } from '../components/Button.jsx';
import { Input } from '../components/Input.jsx';
import { Tag } from '../components/Tag.jsx';

const livePreviewMap = {
  button: () => (
    <div className="story-row">
      <Button>Primary</Button>
      <Button type="outline">Outline</Button>
      <Button type="ghost">Ghost</Button>
      <Button theme="danger">Danger</Button>
    </div>
  ),
  input: () => (
    <div className="story-stack story-stack--column">
      <div className="story-row">
        <Input />
        <Input semantic="danger" suffixText="Error" suffixIcon="!" />
      </div>
      <div className="story-row">
        <Input state="focused" />
        <Input state="filled" value="Filled value" />
      </div>
    </div>
  ),
  tag: () => (
    <div className="story-row">
      <Tag theme="pink">Pink</Tag>
      <Tag type="outline" theme="indigo">Outline</Tag>
      <Tag type="dashed" theme="orange">Dashed</Tag>
      <Tag type="link" theme="neutral">Link</Tag>
    </div>
  ),
};

function renderLayoutValue(value) {
  if (value && typeof value === 'object') {
    if (typeof value.ref === 'string' && value.value !== undefined) {
      return `${value.ref} -> ${JSON.stringify(value.value)}`;
    }
    return JSON.stringify(value);
  }

  return String(value);
}

export function ComponentSpecPage({ slug }) {
  const component = getComponentBySlug(slug);

  if (!component) {
    return <div className="spec-page-shell">Component spec not found: {slug}</div>;
  }

  const layoutEntries = Object.entries(component.layout || {});
  const Preview = livePreviewMap[slug] || null;

  return (
    <div className="spec-page-shell">
      <div className="spec-hero">
        <div>
          <p className="eyebrow">Component Spec</p>
          <h1>{component.name}</h1>
          <p className="spec-copy">{component.description}</p>
        </div>
        <div className="spec-metric-stack">
          <div className="spec-metric">
            <strong>{component.variantCount}</strong>
            <span>Total variants</span>
          </div>
          <div className="spec-metric">
            <strong>{component.variantAxisCount}</strong>
            <span>Variant axes</span>
          </div>
          <div className="spec-metric">
            <strong>{component.implementationStatus}</strong>
            <span>Implementation state</span>
          </div>
        </div>
      </div>

      <div className="spec-link-row">
        {component.docsUrl ? (
          <a href={component.docsUrl} target="_blank" rel="noreferrer">
            Ant Design docs
          </a>
        ) : null}
        {component.figmaUrl ? (
          <a href={component.figmaUrl} target="_blank" rel="noreferrer">
            Figma component
          </a>
        ) : null}
      </div>

      <div className="spec-layout-grid">
        <section className="spec-panel">
          <h2>Variant axes</h2>
          <div className="token-chip-grid">
            {component.variants.map((variant) => (
              <div className="token-chip" key={`${component.slug}-${variant.name}`}>
                <span>{variant.name}</span>
                <strong>{variant.count}</strong>
              </div>
            ))}
          </div>
        </section>

        <section className="spec-panel">
          <h2>Layout bindings</h2>
          <div className="bullet-list">
            {layoutEntries.map(([key, value]) => (
              <p key={`${component.slug}-${key}`}>
                <span>{key}</span>
                {renderLayoutValue(value)}
              </p>
            ))}
          </div>
        </section>
      </div>

      <div className="spec-layout-grid">
        <section className="spec-panel">
          <h2>Anatomy</h2>
          <div className="bullet-list">
            {component.anatomy.map((layer) => (
              <p key={`${component.slug}-${layer.name}`}>
                <span>{layer.name}</span>
                {layer.role}
              </p>
            ))}
          </div>
        </section>

        <section className="spec-panel">
          <h2>Style resolution</h2>
          <div className="bullet-list">
            {(component.styleResolution.length ? component.styleResolution : ['No explicit styleResolution rules on this spec.']).map((rule) => (
              <p key={`${component.slug}-${rule}`}>{rule}</p>
            ))}
          </div>
        </section>
      </div>

      <section className="spec-panel">
        <h2>Referenced tokens</h2>
        <div className="ref-list">
          {component.refs.map((ref) => (
            <code key={`${component.slug}-${ref}`}>{ref}</code>
          ))}
        </div>
      </section>

      <section className="spec-panel">
        <h2>Implementation bridge</h2>
        <p className="spec-copy">
          {component.implementationStatus === 'implemented'
            ? 'This spec is now linked to the local React implementation so the page can render a live preview beside the JSON-driven documentation.'
            : 'This repo currently exposes the spec only. When a React component lands in `src/components`, this page can render a live instance beside the spec.'}
        </p>
        {Preview ? <div className="spec-preview-shell"><Preview /></div> : null}
      </section>
    </div>
  );
}
