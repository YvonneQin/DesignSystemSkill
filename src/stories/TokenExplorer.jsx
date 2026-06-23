import React, { useState } from 'react';
import { getTokenSearchRecords } from '../design-system-data.js';

const allRecords = getTokenSearchRecords();
const filterOptions = ['all', 'token', 'component', 'component-ref'];

export function TokenExplorer() {
  const [query, setQuery] = useState('');
  const [kind, setKind] = useState('all');

  const normalizedQuery = query.trim().toLowerCase();
  const filtered = allRecords.filter((record) => {
    if (kind !== 'all' && record.kind !== kind) {
      return false;
    }

    if (!normalizedQuery) {
      return true;
    }

    return record.searchText.includes(normalizedQuery);
  });

  return (
    <div className="explorer-shell">
      <div className="explorer-toolbar">
        <div>
          <p className="eyebrow">Token Explorer</p>
          <h2>Search by ref, group, component, or token name</h2>
        </div>
        <div className="explorer-controls">
          <input
            aria-label="Search tokens"
            className="explorer-input"
            type="search"
            placeholder="Search `colorPrimary`, `Button`, `radius`, `Neutral/foreground`..."
            value={query}
            onChange={(event) => setQuery(event.target.value)}
          />
          <div className="filter-pill-row">
            {filterOptions.map((option) => (
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
      </div>

      <div className="explorer-summary">
        <strong>{filtered.length}</strong>
        <span>matching records</span>
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
        {filtered.map((record, index) => (
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
  );
}
