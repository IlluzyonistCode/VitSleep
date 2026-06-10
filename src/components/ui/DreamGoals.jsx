import React, { useState } from 'react';
import { Plus, Trash2, Check, Star } from 'lucide-react';
import { create } from 'zustand';
import { persist } from 'zustand/middleware';

/* ── Store ─────────────────────────────────────── */
export const useGoalsStore = create(
  persist(
    (set, get) => ({
      goals: [],

      addGoal: (text, emoji = '✨') => {
        const goal = {
          id: crypto.randomUUID(),
          text,
          emoji,
          done: false,
          createdAt: new Date().toISOString(),
          doneAt: null,
        };
        set(s => ({ goals: [goal, ...s.goals] }));
      },

      toggleGoal: (id) => {
        set(s => ({
          goals: s.goals.map(g =>
            g.id === id
              ? { ...g, done: !g.done, doneAt: !g.done ? new Date().toISOString() : null }
              : g
          )
        }));
      },

      deleteGoal: (id) => {
        set(s => ({ goals: s.goals.filter(g => g.id !== id) }));
      },
    }),
    { name: 'vitsleep-goals' }
  )
);

/* ── Emoji picker (simple) ─────────────────────── */
const GOAL_EMOJIS = ['✨','🦅','🌊','🏔️','🌌','🕺','🤝','🔮','🌀','🦁','💫','🏙️','🌈','🧠','❤️','🎯'];

function EmojiPicker({ value, onChange }) {
  const [open, setOpen] = useState(false);
  return (
    <div style={{ position: 'relative' }}>
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        style={{
          width: 44, height: 44, fontSize: '1.4rem',
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', cursor: 'pointer', flexShrink: 0,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
        }}
      >
        {value}
      </button>
      {open && (
        <div style={{
          position: 'absolute', top: '100%', left: 0, zIndex: 20, marginTop: 4,
          background: 'var(--bg-elevated)', border: '1px solid var(--border)',
          borderRadius: 'var(--radius-md)', padding: 10,
          display: 'grid', gridTemplateColumns: 'repeat(4,1fr)', gap: 4,
          width: 180,
        }}>
          {GOAL_EMOJIS.map(e => (
            <button
              key={e}
              onClick={() => { onChange(e); setOpen(false); }}
              style={{
                fontSize: '1.3rem',
                border: 'none',
                cursor: 'pointer',
                padding: 6,
                borderRadius: 6,
                background: e === value ? 'var(--accent-dim)' : 'transparent',
              }}
            >
              {e}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

/* ── Goal Card ─────────────────────────────────── */
function GoalCard({ goal, onToggle, onDelete }) {
  return (
    <div
      className="card"
      style={{
        marginBottom: 10,
        opacity: goal.done ? 0.55 : 1,
        transition: 'opacity 0.2s',
      }}
    >
      <div className="flex items-center gap-3">
        {/* Emoji */}
        <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>{goal.emoji}</div>

        {/* Text */}
        <div style={{ flex: 1 }}>
          <p
            style={{
              fontSize: '0.95rem',
              color: 'var(--text-primary)',
              textDecoration: goal.done ? 'line-through' : 'none',
              lineHeight: 1.4,
            }}
          >
            {goal.text}
          </p>
          {goal.done && goal.doneAt && (
            <p className="text-muted text-xs" style={{ marginTop: 2 }}>
              Achieved ✓
            </p>
          )}
        </div>

        {/* Actions */}
        <div className="flex gap-1">
          <button
            onClick={() => onToggle(goal.id)}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: goal.done ? 'rgba(255,255,255,0.1)' : 'var(--bg-elevated)',
              border: `1px solid ${goal.done ? 'var(--border-bright)' : 'var(--border)'}`,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: goal.done ? 'var(--text-primary)' : 'var(--text-muted)',
              transition: 'all 0.15s',
            }}
          >
            <Check size={14} />
          </button>
          <button
            onClick={() => onDelete(goal.id)}
            style={{
              width: 34, height: 34, borderRadius: '50%',
              background: 'transparent', border: 'none',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              cursor: 'pointer', color: 'var(--text-muted)',
            }}
          >
            <Trash2 size={14} />
          </button>
        </div>
      </div>
    </div>
  );
}

/* ── Main Component ─────────────────────────────── */
export default function DreamGoals({ compact = false }) {
  const { goals, addGoal, toggleGoal, deleteGoal } = useGoalsStore();
  const [text, setText] = useState('');
  const [emoji, setEmoji] = useState('✨');
  const [adding, setAdding] = useState(false);

  const handleAdd = () => {
    if (!text.trim()) return;
    addGoal(text.trim(), emoji);
    setText('');
    setEmoji('✨');
    setAdding(false);
  };

  const active = goals.filter(g => !g.done);
  const done = goals.filter(g => g.done);

  const SUGGESTIONS = [
    'Fly over a city at night',
    'Breathe underwater',
    'Meet a dream character and ask them a question',
    'Teleport to another planet',
    'Make something appear from nothing',
    'Fight like a superhero',
    'Visit my childhood home',
    'Speak with someone who has passed away',
  ];

  if (compact) {
    // Dashboard widget version
    return (
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="flex items-center justify-between mb-3">
          <span className="section-title">Dream Goals</span>
          <span className="text-muted text-xs">{active.length} left</span>
        </div>
        {active.slice(0, 3).map(g => (
          <div key={g.id} className="flex items-center gap-2" style={{ marginBottom: 8 }}>
            <span style={{ fontSize: '1.1rem' }}>{g.emoji}</span>
            <span className="text-secondary text-sm" style={{ flex: 1 }}>{g.text}</span>
            <button
              onClick={() => toggleGoal(g.id)}
              style={{ background: 'none', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex' }}
            >
              <Check size={14} />
            </button>
          </div>
        ))}
        {active.length === 0 && (
          <p className="text-muted text-sm">No goals yet — add what you want to do in a lucid dream.</p>
        )}
      </div>
    );
  }

  return (
    <div>
      {/* Add form */}
      {adding ? (
        <div className="card" style={{ marginBottom: 16 }}>
          <div className="flex gap-2 mb-3" style={{ alignItems: 'flex-start' }}>
            <EmojiPicker value={emoji} onChange={setEmoji} />
            <textarea
              className="textarea"
              rows={2}
              placeholder="When I become lucid, I want to…"
              value={text}
              onChange={e => setText(e.target.value)}
              autoFocus
              onKeyDown={e => { if (e.key === 'Enter' && !e.shiftKey) { e.preventDefault(); handleAdd(); } }}
              style={{ flex: 1 }}
            />
          </div>
          {/* Suggestions */}
          {!text && (
            <div className="flex gap-2" style={{ flexWrap: 'wrap', marginBottom: 12 }}>
              {SUGGESTIONS.slice(0, 4).map(s => (
                <button
                  key={s}
                  onClick={() => setText(s)}
                  className="tag"
                  style={{ cursor: 'pointer', fontSize: '0.78rem' }}
                >
                  {s}
                </button>
              ))}
            </div>
          )}
          <div className="flex gap-2">
            <button className="btn btn-secondary" onClick={() => { setAdding(false); setText(''); }}>Cancel</button>
            <button className="btn btn-primary" style={{ flex: 1 }} onClick={handleAdd} disabled={!text.trim()}>
              Add Goal
            </button>
          </div>
        </div>
      ) : (
        <button
          className="btn btn-secondary btn-full"
          style={{ marginBottom: 16 }}
          onClick={() => setAdding(true)}
        >
          <Plus size={16} /> Add Dream Goal
        </button>
      )}

      {/* Active goals */}
      {active.length > 0 && (
        <div>
          {active.map(g => (
            <GoalCard key={g.id} goal={g} onToggle={toggleGoal} onDelete={deleteGoal} />
          ))}
        </div>
      )}

      {/* Empty state */}
      {goals.length === 0 && (
        <div className="card" style={{ borderStyle: 'dashed', textAlign: 'center', padding: '28px 16px' }}>
          <div style={{ fontSize: '2rem', marginBottom: 8 }}>🎯</div>
          <p className="text-secondary text-sm" style={{ lineHeight: 1.65 }}>
            Setting specific goals dramatically increases the chance of having a lucid dream. What do you want to do when you become lucid?
          </p>
          <div style={{ marginTop: 14 }}>
            <p className="text-muted text-xs" style={{ marginBottom: 8 }}>Examples:</p>
            {SUGGESTIONS.slice(0, 3).map(s => (
              <p key={s} className="text-muted text-xs" style={{ marginBottom: 4 }}>— {s}</p>
            ))}
          </div>
        </div>
      )}

      {/* Done goals */}
      {done.length > 0 && (
        <div style={{ marginTop: 24 }}>
          <div className="section-title mb-2">Achieved ✓</div>
          {done.map(g => (
            <GoalCard key={g.id} goal={g} onToggle={toggleGoal} onDelete={deleteGoal} />
          ))}
        </div>
      )}
    </div>
  );
}
