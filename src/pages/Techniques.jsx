import React from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Target } from 'lucide-react';
import { TECHNIQUES } from '../data/content.js';
import { useOnboardingStore, useSettingsStore } from '../store/index.js';

const CATEGORY_LABELS = {
  'daytime':       'During the Day',
  'night':         'During the Night',
  'falling-asleep':'While Falling Asleep',
  'tool':          'Tools & Guides',
};

function DifficultyDots({ level }) {
  return (
    <div className="flex gap-1">
      {[1,2,3,4,5].map(i => (
        <div
          key={i}
          style={{
            width: 5, height: 5, borderRadius: '50%',
            background: i <= level ? 'var(--text-primary)' : 'var(--border)',
          }}
        />
      ))}
    </div>
  );
}

function TechniqueCard({ technique, unlocked, onPress }) {
  return (
    <div
      className="card"
      onClick={onPress}
      style={{
        cursor: 'pointer',
        marginBottom: 10,
        opacity: unlocked ? 1 : 0.5,
        position: 'relative',
        overflow: 'hidden',
      }}
    >
      <div className="flex items-center gap-3">
        <div style={{
          width: 52, height: 52, borderRadius: 'var(--radius-md)',
          background: 'var(--bg-elevated)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1.6rem', flexShrink: 0
        }}>
          {technique.icon}
        </div>
        <div style={{ flex: 1, overflow: 'hidden' }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="font-semibold" style={{ fontSize: '0.95rem' }}>{technique.name}</span>
            {!unlocked && <Lock size={12} color="var(--text-muted)" />}
          </div>
          <p className="text-secondary text-sm truncate">{technique.description}</p>
          <div className="flex items-center gap-3 mt-2">
            <DifficultyDots level={technique.difficulty} />
            <span className="text-muted text-xs">{technique.bestTime}</span>
          </div>
        </div>
        <ChevronRight size={16} color="var(--text-muted)" style={{ flexShrink: 0 }} />
      </div>
    </div>
  );
}

export default function Techniques() {
  const navigate = useNavigate();
  const { onboardingComplete, currentOnboardingDay } = useSettingsStore();

  const grouped = {};
  TECHNIQUES.forEach(t => {
    if (!grouped[t.category]) grouped[t.category] = [];
    grouped[t.category].push(t);
  });

  return (
    <div className="page">
      <div className="page-header">
        <h1>Techniques</h1>
        <p className="text-secondary mt-2" style={{ lineHeight: 1.5 }}>
          Methods for inducing and maintaining lucid dreams, from beginner to advanced.
        </p>
      </div>

      {/* Daily checklist shortcut */}
      <div
        className="card"
        style={{ marginBottom: 12, cursor: 'pointer' }}
        onClick={() => navigate('/checklist')}
      >
        <div className="flex items-center gap-3">
          <div style={{ fontSize: '1.8rem' }}>✅</div>
          <div style={{ flex: 1 }}>
            <div className="font-semibold" style={{ marginBottom: 2 }}>
              Daily Practice Checklist
            </div>
            <p className="text-muted text-sm">
              Complete protocol — daytime prep and full night sequence
            </p>
          </div>
          <ChevronRight size={16} color="var(--text-muted)" />
        </div>
      </div>

      {/* Dream Goals banner */}
      <div
        className="card"
        style={{ marginBottom: 12, cursor: 'pointer', borderStyle: 'dashed' }}
        onClick={() => navigate('/goals')}
      >
        <div className="flex items-center gap-3">
          <div style={{ fontSize: '1.8rem' }}>🎯</div>
          <div style={{ flex: 1 }}>
            <div className="font-semibold" style={{ marginBottom: 2 }}>Dream Goals</div>
            <p className="text-muted text-sm">What do you want to do in your next lucid dream?</p>
          </div>
          <ChevronRight size={16} color="var(--text-muted)" />
        </div>
      </div>

      {/* Dream Recall banner */}
      <div
        className="card"
        style={{ marginBottom: 12, cursor: 'pointer', borderStyle: 'dashed' }}
        onClick={() => navigate('/recall')}
      >
        <div className="flex items-center gap-3">
          <div style={{ fontSize: '1.8rem' }}>🎙️</div>
          <div style={{ flex: 1 }}>
            <div className="font-semibold" style={{ marginBottom: 2 }}>Dream Recall</div>
            <p className="text-muted text-sm">Voice recorder + method guide — journal vs voice vs mental review</p>
          </div>
          <ChevronRight size={16} color="var(--text-muted)" />
        </div>
      </div>

      {Object.entries(CATEGORY_LABELS).map(([cat, label]) => {
        const techs = grouped[cat];
        if (!techs?.length) return null;
        return (
          <div key={cat} className="section">
            <div className="section-title">{label}</div>
            {techs.map(t => (
              <TechniqueCard
                key={t.id}
                technique={t}
                unlocked={true}
                onPress={() => navigate(`/techniques/${t.id}`)}
              />
            ))}
          </div>
        );
      })}
    </div>
  );
}
