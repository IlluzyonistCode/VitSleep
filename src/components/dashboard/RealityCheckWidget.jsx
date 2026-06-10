import React from 'react';
import { useNavigate } from 'react-router-dom';

export default function RealityCheckWidget({ count, onCheck, enabled }) {
  const navigate = useNavigate();
  const target = 10;
  const percent = Math.min(100, (count / target) * 100);

  const circumference = 2 * Math.PI * 28;
  const dashOffset = circumference - (percent / 100) * circumference;

  return (
    <div className="card" style={{ marginBottom: 20 }}>
      <div className="flex items-center gap-4">
        {/* Progress ring */}
        <div style={{ position: 'relative', flexShrink: 0 }}>
          <svg width="72" height="72" className="progress-ring">
            <circle
              cx="36" cy="36" r="28"
              fill="none"
              stroke="var(--border)"
              strokeWidth="3"
            />
            <circle
              cx="36" cy="36" r="28"
              fill="none"
              stroke="var(--text-primary)"
              strokeWidth="3"
              strokeDasharray={circumference}
              strokeDashoffset={dashOffset}
              strokeLinecap="round"
              style={{ transition: 'stroke-dashoffset 0.5s var(--ease-dream)' }}
            />
          </svg>
          <div style={{
            position: 'absolute', inset: 0,
            display: 'flex', alignItems: 'center', justifyContent: 'center',
            flexDirection: 'column'
          }}>
            <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', lineHeight: 1 }}>{count}</span>
            <span className="text-muted" style={{ fontSize: '0.6rem', letterSpacing: '0.05em' }}>/{target}</span>
          </div>
        </div>

        {/* Info */}
        <div style={{ flex: 1 }}>
          <div className="font-semibold" style={{ marginBottom: 4 }}>Reality Checks</div>
          <div className="text-muted text-sm" style={{ marginBottom: 12 }}>
            {count === 0 ? 'No checks today yet' :
             count < target ? `${target - count} more to hit today's goal` :
             'Daily goal reached!'}
          </div>
          <button
            className="btn btn-secondary btn-sm"
            onClick={onCheck}
          >
            + Log Check
          </button>
        </div>

        {/* Settings shortcut */}
        <button
          className="btn-ghost btn btn-icon"
          onClick={() => navigate('/techniques/reality-checks')}
          style={{ flexShrink: 0, fontSize: '1.2rem' }}
          title="Reality Check Settings"
        >
          🤚
        </button>
      </div>
    </div>
  );
}
