import React from 'react';
import { useNavigate } from 'react-router-dom';
import { useOnboardingStore, useSettingsStore } from '../../store/index.js';
import { ChevronRight } from 'lucide-react';

export default function OnboardingBanner() {
  const navigate = useNavigate();
  const { currentOnboardingDay } = useSettingsStore();
  const { isDayComplete } = useOnboardingStore();

  const day = currentOnboardingDay || 1;
  const progress = (day - 1) / 7;
  const width = `${Math.round(progress * 100)}%`;

  return (
    <div
      className="card"
      style={{ marginBottom: 20, cursor: 'pointer' }}
      onClick={() => navigate('/onboarding')}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="section-title">7-Day Program</span>
        <ChevronRight size={16} color="var(--text-muted)" />
      </div>
      <div className="flex items-center gap-3">
        <div style={{ flex: 1 }}>
          <div className="font-medium" style={{ marginBottom: 6, fontSize: '0.9rem' }}>
            Day {day} of 7 — {isDayComplete(day) ? 'Completed ✓' : 'In Progress'}
          </div>
          <div style={{
            height: 3, background: 'var(--border)', borderRadius: 2, overflow: 'hidden'
          }}>
            <div style={{
              height: '100%', width, background: 'var(--text-primary)',
              borderRadius: 2,
              transition: 'width 0.5s var(--ease-dream)'
            }} />
          </div>
        </div>
      </div>
      <p className="text-muted text-xs" style={{ marginTop: 8 }}>
        Continue your lucid dreaming training →
      </p>
    </div>
  );
}
