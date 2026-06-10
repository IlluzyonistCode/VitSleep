import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Plus, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { useDreamStore, useRCStore, useSettingsStore, useToastStore } from '../store/index.js';
import { TIPS, LUCIDITY_LABELS } from '../data/content.js';
import RealityCheckWidget from '../components/dashboard/RealityCheckWidget.jsx';
import StreakCard from '../components/dashboard/StreakCard.jsx';
import OnboardingBanner from '../components/dashboard/OnboardingBanner.jsx';
import DreamGoals from '../components/ui/DreamGoals.jsx';
import ChecklistWidget from '../components/dashboard/ChecklistWidget.jsx';

function greet() {
  const h = new Date().getHours();
  if (h < 5) return 'Still awake?';
  if (h < 12) return 'Good morning';
  if (h < 17) return 'Good afternoon';
  if (h < 21) return 'Good evening';
  return 'Good night';
}

function DreamCard({ dream }) {
  const navigate = useNavigate();
  const lucidityLabel = LUCIDITY_LABELS[dream.lucidityLevel];
  const dateStr = (() => {
    const d = new Date(dream.date);
    const today = new Date();
    const yesterday = new Date(today);
    yesterday.setDate(today.getDate() - 1);
    if (d.toDateString() === today.toDateString()) return 'Today';
    if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
    return format(d, 'MMM d');
  })();

  return (
    <div
      className="card"
      onClick={() => navigate(`/journal/dream/${dream.id}`)}
      style={{ cursor: 'pointer', marginBottom: 10 }}
    >
      <div className="flex items-center justify-between mb-2">
        <span className="text-xs text-muted">{dateStr}</span>
        <span className={`lucidity-badge lucidity-${dream.lucidityLevel}`}>
          {lucidityLabel.label}
        </span>
      </div>
      <div className="font-semibold" style={{ fontSize: '0.95rem', marginBottom: 4 }}>
        {dream.title || 'Untitled Dream'}
      </div>
      {dream.content && (
        <p className="text-secondary text-sm truncate">{dream.content}</p>
      )}
      {dream.tags?.length > 0 && (
        <div className="flex gap-2 mt-2" style={{ flexWrap: 'wrap' }}>
          {dream.tags.slice(0, 3).map(t => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Dashboard() {
  const navigate = useNavigate();
  const { dreams, getStats } = useDreamStore();
  const { todayChecks, addCheck } = useRCStore();
  const { username, onboardingComplete, rcEnabled } = useSettingsStore();
  const { show } = useToastStore();

  const [tip] = useState(() => TIPS[Math.floor(Math.random() * TIPS.length)]);
  const stats = getStats();
  const recentDreams = dreams.slice(0, 4);

  const handleQuickCheck = async () => {
    await addCheck();
    show('Reality check logged ✓');
  };

  return (
    <div className="page">
      {/* Header */}
      <div className="page-header">
        <div className="flex items-center justify-between">
          <div>
            <p className="text-muted text-sm">{format(new Date(), 'EEEE, MMMM d')}</p>
            <h1 style={{ marginTop: 2 }}>{greet()},<br />{username}</h1>
          </div>
          <div
            style={{
              width: 46, height: 46, borderRadius: '50%',
              background: 'var(--bg-card)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '1.2rem', cursor: 'pointer', flexShrink: 0
            }}
            onClick={() => navigate('/settings')}
          >
            {username[0]?.toUpperCase()}
          </div>
        </div>
      </div>

      {/* Onboarding Banner */}
      {!onboardingComplete && <OnboardingBanner />}

      {/* Streak */}
      <StreakCard streak={stats.streak} total={stats.total} lucid={stats.lucid} />

      {/* Quick Record */}
      <div style={{ marginBottom: 20 }}>
        <button
          className="btn btn-primary btn-lg btn-full"
          onClick={() => navigate('/dream/new')}
          style={{ borderRadius: 'var(--radius-lg)', fontSize: '1rem', marginBottom: 10 }}
        >
          <Plus size={20} />
          Record a Dream
        </button>
        <button
          className="btn btn-secondary btn-full"
          onClick={() => navigate('/recall')}
          style={{ borderRadius: 'var(--radius-lg)', fontSize: '0.9rem' }}
        >
          🎙️ Quick Voice Note
        </button>
      </div>

      {/* Reality Check Widget */}
      <RealityCheckWidget
        count={todayChecks.length}
        onCheck={handleQuickCheck}
        enabled={rcEnabled}
      />

      {/* Daily checklist progress widget */}
      <ChecklistWidget />

      {/* Dream Goals widget */}
      <DreamGoals compact />

      {/* Recent Dreams */}
      {recentDreams.length > 0 && (
        <div className="section">
          <div className="flex items-center justify-between mb-3">
            <span className="section-title">Recent Dreams</span>
            <button
              className="btn-ghost btn btn-sm"
              onClick={() => navigate('/journal')}
              style={{ padding: '4px 8px', gap: 4, fontSize: '0.82rem' }}
            >
              See all <ChevronRight size={14} />
            </button>
          </div>
          {recentDreams.map(d => <DreamCard key={d.id} dream={d} />)}
        </div>
      )}

      {/* Empty state */}
      {dreams.length === 0 && (
        <div className="empty-state" style={{ paddingTop: 20 }}>
          <div style={{ fontSize: '3.5rem', opacity: 0.2 }}>🌙</div>
          <h3>Your dream journal awaits</h3>
          <p>Record your first dream to begin your lucid dreaming journey.</p>
        </div>
      )}

      {/* Tip of the Day */}
      <div
        className="card"
        style={{
          marginBottom: 16,
          background: 'rgba(255,255,255,0.03)',
          borderStyle: 'dashed',
        }}
      >
        <div className="flex gap-3" style={{ alignItems: 'flex-start' }}>
          <span style={{ fontSize: '1.2rem', marginTop: 2, flexShrink: 0 }}>💡</span>
          <div>
            <div className="section-title" style={{ marginBottom: 4 }}>Tip of the Day</div>
            <p className="text-secondary text-sm" style={{ lineHeight: 1.6 }}>{tip}</p>
          </div>
        </div>
      </div>

      {/* Stats mini */}
      {stats.total > 0 && (
        <div
          className="card"
          style={{ marginBottom: 16, cursor: 'pointer' }}
          onClick={() => navigate('/stats')}
        >
          <div className="flex items-center justify-between">
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>{stats.total}</div>
              <div className="text-muted text-xs">Dreams</div>
            </div>
            <div style={{ width: 1, height: 40, background: 'var(--border)' }} />
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>{stats.lucid}</div>
              <div className="text-muted text-xs">Lucid</div>
            </div>
            <div style={{ width: 1, height: 40, background: 'var(--border)' }} />
            <div style={{ textAlign: 'center', flex: 1 }}>
              <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem' }}>{stats.lucidPercent}%</div>
              <div className="text-muted text-xs">Rate</div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
