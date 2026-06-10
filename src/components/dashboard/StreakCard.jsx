import React from 'react';

export default function StreakCard({ streak, total, lucid }) {
  return (
    <div
      className="card"
      style={{
        marginBottom: 20,
        background: 'linear-gradient(135deg, rgba(255,255,255,0.04) 0%, rgba(255,255,255,0.01) 100%)',
        overflow: 'hidden',
        position: 'relative',
      }}
    >
      {/* Decorative orb */}
      <div style={{
        position: 'absolute', top: -30, right: -20,
        width: 140, height: 140,
        background: 'radial-gradient(circle, rgba(255,255,255,0.05) 0%, transparent 70%)',
        borderRadius: '50%', pointerEvents: 'none'
      }} />

      <div className="flex items-center gap-4">
        <div>
          <div className="streak-number">{streak}</div>
          <div className="text-muted text-xs" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>
            day{streak !== 1 ? 's' : ''} in a row
          </div>
        </div>
        <div style={{ width: 1, height: 60, background: 'var(--border)', flexShrink: 0 }} />
        <div style={{ flex: 1 }}>
          {streak === 0 && (
            <p className="text-secondary text-sm" style={{ lineHeight: 1.5 }}>
              Record your first dream to start your streak.
            </p>
          )}
          {streak >= 1 && streak < 7 && (
            <p className="text-secondary text-sm" style={{ lineHeight: 1.5 }}>
              Keep going — 7 days builds a lasting habit.
            </p>
          )}
          {streak >= 7 && (
            <p className="text-secondary text-sm" style={{ lineHeight: 1.5 }}>
              A week of dreams. Your recall is sharpening.
            </p>
          )}
          {streak >= 30 && (
            <p className="text-secondary text-sm" style={{ lineHeight: 1.5 }}>
              30 days. You are a dedicated dreamer.
            </p>
          )}
        </div>
      </div>
    </div>
  );
}
