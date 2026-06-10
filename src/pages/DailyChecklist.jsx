import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Check } from 'lucide-react';
import { useRCStore, useToastStore } from '../store/index.js';

// ── Checklist data ─────────────────────────────────────
// Split into daytime and night sections.
// Some items link to a page in the app.
const DAYTIME_ITEMS = [
  {
    id: 'journal',
    label: 'Written dream journal',
    sub: 'First thing on waking — stay still, recall, then write',
    link: '/dream/new',
    linkLabel: 'Open journal',
  },
  {
    id: 'rc10',
    label: '10–15 reality checks',
    sub: 'Anchored to actions: doorways, mirrors, phone pickups — not a timer',
    link: '/techniques/reality-checks',
    linkLabel: 'Log checks',
  },
  {
    id: 'anchor1',
    label: 'Anchor training × 20',
    sub: 'Play "You are dreaming" → pinch nose → say the phrase → repeat',
    link: '/techniques/audio-cue',
    linkLabel: 'Open trainer',
  },
  {
    id: 'anchor2',
    label: 'Anchor training × 20 (second session)',
    sub: '~2 hours after the first session',
    link: '/techniques/audio-cue',
    linkLabel: 'Open trainer',
  },
  {
    id: 'recall',
    label: 'Dream recall practice',
    sub: 'Voice note or written — anything you remember from last night',
    link: '/recall',
    linkLabel: 'Open recorder',
  },
];

const NIGHT_ITEMS = [
  {
    id: 'alarm',
    label: 'WBTB alarm set (+4 hours)',
    sub: 'Smart wake-up ON, 30-min window. CAPTCHA OFF',
    link: '/techniques/wbtb',
    linkLabel: 'Set alarm',
  },
  {
    id: 'moon',
    label: 'SaA tracking started (moon icon)',
    sub: 'Press before sleep — Lucid Dreaming: Later = 1h, Vibrate ON, Repeat = 3',
    link: null,
  },
  {
    id: 'wbtb-up',
    label: 'Woke up, stayed up 10–15 min',
    sub: 'No bright light, no phone screen. Bathroom + water only',
    link: null,
  },
  {
    id: 'saa-restart',
    label: 'SaA restarted after WBTB',
    sub: 'Moon icon → Lucid Dreaming on, Later = 1h → phone face-down',
    link: '/techniques/wbtb',
    linkLabel: 'Settings guide',
  },
  {
    id: 'ssild',
    label: 'SSILD (3–4 cycles)',
    sub: 'Vision 10s → Hearing 10s → Body 10s — passive, no effort',
    link: '/techniques/ssild-timer',
    linkLabel: 'Open timer',
  },
  {
    id: 'mild',
    label: 'MILD intention set',
    sub: 'Repeat 5–10×: "I will hear the signal in my dream and know I am sleeping"',
    link: null,
  },
  {
    id: 'asleep5',
    label: 'Fell asleep within ~5 minutes',
    sub: 'The single strongest predictor of success — check this tomorrow morning',
    link: null,
  },
];

// ── Storage helpers ────────────────────────────────────
// Resets at midnight using date-based key
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

function saveChecked(checked) {
  try {
    localStorage.setItem(getTodayKey(), JSON.stringify(checked));
  } catch {}
}

// ── CheckRow ──────────────────────────────────────────
function CheckRow({ item, checked, onToggle, navigate }) {
  return (
    <div
      style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 14,
        padding: '14px 0',
        borderBottom: '1px solid var(--border)',
        opacity: checked ? 0.5 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      {/* Checkbox */}
      <button
        onClick={() => onToggle(item.id)}
        style={{
          width: 26,
          height: 26,
          borderRadius: 8,
          border: checked
            ? '1px solid var(--border-bright)'
            : '1px solid var(--border)',
          background: checked ? 'var(--text-primary)' : 'var(--bg-elevated)',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: 'pointer',
          flexShrink: 0,
          marginTop: 1,
          transition: 'all 0.15s var(--ease-dream)',
        }}
      >
        {checked && <Check size={14} color="var(--bg-primary)" strokeWidth={3} />}
      </button>

      {/* Text */}
      <div style={{ flex: 1 }}>
        <div
          className="font-medium"
          style={{
            fontSize: '0.92rem',
            textDecoration: checked ? 'line-through' : 'none',
            color: checked ? 'var(--text-muted)' : 'var(--text-primary)',
            marginBottom: 3,
          }}
        >
          {item.label}
        </div>
        <p
          className="text-muted"
          style={{ fontSize: '0.78rem', lineHeight: 1.55 }}
        >
          {item.sub}
        </p>
        {item.link && !checked && (
          <button
            onClick={() => navigate(item.link)}
            style={{
              marginTop: 6,
              background: 'none',
              border: '1px solid var(--border)',
              borderRadius: 'var(--radius-full)',
              color: 'var(--text-secondary)',
              fontSize: '0.75rem',
              padding: '3px 10px',
              cursor: 'pointer',
              fontFamily: 'var(--font-body)',
              transition: 'all 0.15s',
            }}
          >
            {item.linkLabel} →
          </button>
        )}
      </div>
    </div>
  );
}

// ── Section ────────────────────────────────────────────
function Section({ title, icon, items, checked, onToggle, navigate }) {
  const doneCount = items.filter(i => checked[i.id]).length;
  const allDone   = doneCount === items.length;

  return (
    <div style={{ marginBottom: 28 }}>
      <div
        className="flex items-center justify-between"
        style={{ marginBottom: 4 }}
      >
        <div className="flex items-center gap-2">
          <span style={{ fontSize: '1.1rem' }}>{icon}</span>
          <span className="section-title" style={{ marginBottom: 0 }}>{title}</span>
        </div>
        <span
          style={{
            fontSize: '0.75rem',
            color: allDone ? 'rgba(180,255,180,0.8)' : 'var(--text-muted)',
            fontWeight: 600,
            transition: 'color 0.3s',
          }}
        >
          {doneCount}/{items.length}
        </span>
      </div>

      {/* Progress bar */}
      <div
        style={{
          height: 2,
          background: 'var(--border)',
          borderRadius: 1,
          marginBottom: 4,
          overflow: 'hidden',
        }}
      >
        <div
          style={{
            height: '100%',
            width: `${(doneCount / items.length) * 100}%`,
            background: allDone ? 'rgba(180,255,180,0.8)' : 'var(--text-primary)',
            borderRadius: 1,
            transition: 'width 0.4s var(--ease-dream)',
          }}
        />
      </div>

      <div className="card" style={{ padding: '0 16px' }}>
        {items.map(item => (
          <CheckRow
            key={item.id}
            item={item}
            checked={!!checked[item.id]}
            onToggle={onToggle}
            navigate={navigate}
          />
        ))}
      </div>
    </div>
  );
}

// ── Main page ─────────────────────────────────────────
export default function DailyChecklist() {
  const navigate     = useNavigate();
  const { show }     = useToastStore();
  const [checked, setChecked] = useState(loadChecked);

  // Persist on every change
  useEffect(() => {
    saveChecked(checked);
  }, [checked]);

  const toggle = (id) => {
    setChecked(prev => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id]  = true;
        const all = [...DAYTIME_ITEMS, ...NIGHT_ITEMS];
        const now = all.filter(i => ({ ...prev, [id]: true })[i.id]).length;
        if (now === all.length) show('All done for today 🌙');
      }
      return next;
    });
  };

  const totalDone  = Object.keys(checked).length;
  const totalItems = DAYTIME_ITEMS.length + NIGHT_ITEMS.length;
  const allDone    = totalDone === totalItems;

  return (
    <div className="page">
      <div className="page-header">
        <button
          className="btn btn-ghost btn-icon"
          style={{ marginBottom: 16 }}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
        </button>
        <h1>Daily Practice</h1>
        <p className="text-secondary mt-2" style={{ lineHeight: 1.55, fontSize: '0.95rem' }}>
          Your complete protocol — daytime preparation and the full night sequence. Resets at midnight.
        </p>
      </div>

      {/* Overall progress */}
      <div
        className="card"
        style={{ marginBottom: 24, textAlign: 'center', padding: '20px 16px' }}
      >
        <div
          style={{
            fontFamily: 'var(--font-display)',
            fontSize: '2.8rem',
            lineHeight: 1,
            marginBottom: 6,
          }}
        >
          {totalDone}/{totalItems}
        </div>
        <p
          className="text-muted text-sm"
          style={{ marginBottom: 12 }}
        >
          {allDone
            ? 'Everything done. Sleep well. 🌙'
            : totalDone === 0
              ? 'Start with the morning journal.'
              : `${totalItems - totalDone} item${totalItems - totalDone !== 1 ? 's' : ''} remaining`}
        </p>
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
              width: `${(totalDone / totalItems) * 100}%`,
              background: allDone
                ? 'rgba(180,255,180,0.8)'
                : 'var(--text-primary)',
              borderRadius: 2,
              transition: 'width 0.4s var(--ease-dream)',
            }}
          />
        </div>
      </div>

      {/* Daytime section */}
      <Section
        title="During the Day"
        icon="☀️"
        items={DAYTIME_ITEMS}
        checked={checked}
        onToggle={toggle}
        navigate={navigate}
      />

      {/* Night section */}
      <Section
        title="Night Sequence"
        icon="🌙"
        items={NIGHT_ITEMS}
        checked={checked}
        onToggle={toggle}
        navigate={navigate}
      />

      {/* Protocol reminder card */}
      <div
        className="card"
        style={{
          marginBottom: 20,
          background: 'rgba(255,255,255,0.025)',
          borderStyle: 'dashed',
        }}
      >
        <div className="section-title mb-3">Night sequence order</div>
        {[
          { step: 1, text: 'Press moon icon in SaA (Later = 1h, Vibrate ON)' },
          { step: 2, text: 'Put phone face-down immediately' },
          { step: 3, text: 'SSILD — 3–4 cycles, passive, no effort' },
          { step: 4, text: 'MILD — repeat intention 5–10 times' },
          { step: 5, text: 'Fall asleep within ~5 minutes' },
        ].map(item => (
          <div
            key={item.step}
            className="flex gap-3"
            style={{ marginBottom: 10, alignItems: 'flex-start' }}
          >
            <div
              style={{
                width: 20,
                height: 20,
                borderRadius: '50%',
                background: 'var(--bg-elevated)',
                border: '1px solid var(--border)',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '0.65rem',
                fontWeight: 700,
                color: 'var(--text-muted)',
                flexShrink: 0,
                marginTop: 1,
              }}
            >
              {item.step}
            </div>
            <p
              className="text-secondary text-sm"
              style={{ lineHeight: 1.5 }}
            >
              {item.text}
            </p>
          </div>
        ))}
        <div
          className="card"
          style={{
            marginTop: 12,
            background: 'rgba(255,180,80,0.05)',
            border: '1px solid rgba(255,180,80,0.18)',
            padding: '10px 12px',
          }}
        >
          <p className="text-secondary text-xs" style={{ lineHeight: 1.6 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Order matters:</strong>{' '}
            start SaA first (so it's already tracking), then do SSILD while
            the phone is out of your hands. Don't open the phone after SSILD —
            it breaks the hypnagogic state.
          </p>
        </div>
      </div>

      {/* Reset button */}
      <button
        className="btn btn-ghost btn-full"
        style={{ marginBottom: 20, color: 'var(--text-muted)', fontSize: '0.85rem' }}
        onClick={() => {
          setChecked({});
          show('Checklist reset');
        }}
      >
        Reset today's list
      </button>
    </div>
  );
}
