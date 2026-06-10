import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';

const ALL_IDS = [
  'journal', 'rc10', 'anchor1', 'anchor2', 'recall',
  'alarm', 'moon', 'wbtb-up', 'saa-restart', 'ssild', 'mild', 'asleep5',
];

function getTodayKey() {
  return 'vitsleep_checklist_' + new Date().toISOString().split('T')[0];
}

function loadChecked() {
  try {
    const raw = localStorage.getItem(getTodayKey());
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

export default function ChecklistWidget() {
  const navigate = useNavigate();
  const checked  = loadChecked();
  const done     = Object.keys(checked).length;
  const total    = ALL_IDS.length;
  const pct      = Math.round((done / total) * 100);

  return (
    <div
      className="card"
      style={{ marginBottom: 20, cursor: 'pointer' }}
      onClick={() => navigate('/checklist')}
    >
      <div className="flex items-center justify-between mb-2">
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '1rem' }}>✅</span>
          <span className="font-semibold" style={{ fontSize: '0.92rem' }}>
            Daily Practice
          </span>
        </div>
        <div className="flex items-center gap-2">
          <span
            style={{
              fontSize: '0.78rem',
              color: done === total ? 'rgba(180,255,180,0.9)' : 'var(--text-muted)',
              fontWeight: 600,
            }}
          >
            {done}/{total}
          </span>
          <ChevronRight size={14} color="var(--text-muted)" />
        </div>
      </div>

      {/* Bar */}
      <div
        style={{
          height: 4,
          background: 'var(--border)',
          borderRadius: 2,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${pct}%`,
            background: done === total
              ? 'rgba(180,255,180,0.8)'
              : 'var(--text-primary)',
            borderRadius: 2,
            transition: 'width 0.4s var(--ease-dream)',
          }}
        />
      </div>

      <p
        className="text-muted text-xs"
        style={{ marginTop: 6 }}
      >
        {done === 0
          ? 'Start with the morning dream journal'
          : done === total
            ? 'All done — sleep well tonight'
            : `${total - done} item${total - done !== 1 ? 's' : ''} left for today`}
      </p>
    </div>
  );
}
