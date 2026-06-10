import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { X, Plus, Check, Sparkles } from 'lucide-react';
import { useDreamStore, useToastStore, useSettingsStore } from '../store/index.js';
import { LUCIDITY_LABELS, MOODS, DREAM_SIGNS } from '../data/content.js';

// ── Tag Input ────────────────────────────────────────
function TagInput({ tags, onChange, placeholder, suggestions = [] }) {
  const [input, setInput] = useState('');
  const [open, setOpen]   = useState(false);

  const filtered = suggestions.filter(
    s => s.toLowerCase().includes(input.toLowerCase()) && !tags.includes(s)
  );

  const add = (tag) => {
    const t = tag.trim();
    if (t && !tags.includes(t)) onChange([...tags, t]);
    setInput('');
    setOpen(false);
  };

  const remove = (tag) => onChange(tags.filter(t => t !== tag));

  return (
    <div>
      <div className="flex gap-2" style={{ flexWrap: 'wrap', marginBottom: 8 }}>
        {tags.map(t => (
          <span key={t} className="tag">
            {t}
            <button className="tag-remove" onClick={() => remove(t)}>
              <X size={11} />
            </button>
          </span>
        ))}
      </div>

      <div style={{ position: 'relative' }}>
        <input
          className="input"
          style={{ paddingRight: 40 }}
          placeholder={placeholder}
          value={input}
          onChange={e => { setInput(e.target.value); setOpen(true); }}
          onKeyDown={e => {
            if ((e.key === 'Enter' || e.key === ',') && input) {
              e.preventDefault();
              add(input);
            }
            if (e.key === 'Backspace' && !input && tags.length) {
              remove(tags[tags.length - 1]);
            }
          }}
          onFocus={() => setOpen(true)}
          onBlur={() => setTimeout(() => setOpen(false), 150)}
        />
        {input && (
          <button
            className="btn btn-icon"
            style={{ position: 'absolute', right: 6, top: '50%', transform: 'translateY(-50%)', width: 32, height: 32 }}
            onClick={() => add(input)}
          >
            <Plus size={14} />
          </button>
        )}
        {open && filtered.length > 0 && (
          <div style={{
            position: 'absolute', top: '100%', left: 0, right: 0,
            marginTop: 4,
            background: 'var(--bg-elevated)',
            border: '1px solid var(--border)',
            borderRadius: 'var(--radius-md)',
            zIndex: 20,
            maxHeight: 180,
            overflowY: 'auto',
          }}>
            {filtered.slice(0, 8).map(s => (
              <div
                key={s}
                onClick={() => add(s)}
                style={{ padding: '10px 14px', cursor: 'pointer', fontSize: '0.9rem' }}
                onMouseEnter={e => e.currentTarget.style.background = 'var(--bg-card-hover)'}
                onMouseLeave={e => e.currentTarget.style.background = 'transparent'}
              >
                {s}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}

// ── Lucidity Picker ──────────────────────────────────
const LUCIDITY_ICONS = ['💤', '🌫️', '👁️', '✨'];

function LucidityPicker({ value, onChange }) {
  return (
    <div className="flex gap-2">
      {LUCIDITY_LABELS.map((l, i) => (
        <button
          key={l.level}
          onClick={() => onChange(l.level)}
          style={{
            flex: 1,
            padding: '10px 4px',
            borderRadius: 'var(--radius-md)',
            border: `1px solid ${value === l.level ? 'var(--border-bright)' : 'var(--border)'}`,
            background: value === l.level ? 'var(--bg-card-hover)' : 'var(--bg-card)',
            color: value === l.level ? 'var(--text-primary)' : 'var(--text-muted)',
            cursor: 'pointer',
            fontSize: '0.7rem',
            fontWeight: 600,
            textAlign: 'center',
            transition: 'all 0.15s',
            fontFamily: 'var(--font-body)',
          }}
        >
          <div style={{ fontSize: '1.3rem', marginBottom: 4 }}>{LUCIDITY_ICONS[i]}</div>
          {l.label}
        </button>
      ))}
    </div>
  );
}

// ── Mood Slider ──────────────────────────────────────
function MoodSlider({ value, onChange }) {
  const mood = MOODS.reduce((p, c) =>
    Math.abs(c.value - value) < Math.abs(p.value - value) ? c : p
  );

  return (
    <div>
      <div className="flex items-center gap-3 mb-2">
        <span style={{ fontSize: '1.4rem' }}>{mood.emoji}</span>
        <span className="text-secondary" style={{ fontSize: '0.9rem' }}>{mood.label}</span>
      </div>
      <input
        type="range"
        min="0" max="1" step="0.01"
        value={value}
        onChange={e => onChange(parseFloat(e.target.value))}
        style={{ width: '100%', accentColor: 'var(--text-primary)', cursor: 'pointer' }}
      />
      <div className="flex justify-between mt-1">
        <span className="text-muted text-xs">Nightmare</span>
        <span className="text-muted text-xs">Wonderful</span>
      </div>
    </div>
  );
}

// ── Dream Characteristics ────────────────────────────
const CHARACTERISTICS = [
  { id: 'recurring',       icon: '🔁', label: 'Recurring' },
  { id: 'nightmare',       icon: '👻', label: 'Nightmare' },
  { id: 'sleep_paralysis', icon: '😶', label: 'Sleep Paralysis' },
  { id: 'false_awakening', icon: '⏰', label: 'False Awakening' },
  { id: 'prophetic',       icon: '🔮', label: 'Prophetic' },
  { id: 'vivid',           icon: '🎨', label: 'Very Vivid' },
];

function CharacteristicsPicker({ value = [], onChange }) {
  const toggle = (id) =>
    onChange(value.includes(id) ? value.filter(x => x !== id) : [...value, id]);

  return (
    <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
      {CHARACTERISTICS.map(c => {
        const active = value.includes(c.id);
        return (
          <button
            key={c.id}
            onClick={() => toggle(c.id)}
            style={{
              padding: '8px 14px',
              borderRadius: 'var(--radius-full)',
              border: `1px solid ${active ? 'var(--border-bright)' : 'var(--border)'}`,
              background: active ? 'rgba(255,255,255,0.1)' : 'var(--bg-card)',
              color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
              cursor: 'pointer',
              fontSize: '0.85rem',
              fontFamily: 'var(--font-body)',
              display: 'flex',
              alignItems: 'center',
              gap: 6,
              transition: 'all 0.15s',
            }}
          >
            {c.icon} {c.label}
          </button>
        );
      })}
    </div>
  );
}

// ── Symbol Categories ────────────────────────────────
const SYMBOL_CATEGORIES = [
  { id: 'characters', icon: '👤', label: 'Characters', placeholder: 'e.g. mother, stranger, old friend…' },
  { id: 'locations',  icon: '🏛️', label: 'Locations',  placeholder: 'e.g. school, old house, forest…'  },
  { id: 'objects',    icon: '🧊', label: 'Objects',    placeholder: 'e.g. mirror, key, phone, car…'     },
  { id: 'other',      icon: '🔮', label: 'Other Signs', placeholder: 'any other recurring symbols…'     },
];

function SymbolsTab({ form, update, onAIExtract, extracting }) {
  return (
    <div>
      <div className="flex items-center justify-between mb-4">
        <p className="text-muted text-sm" style={{ lineHeight: 1.5, flex: 1 }}>
          Categorise what appeared in your dream to build your personal symbol library.
        </p>
        {form.content && (
          <button
            className="btn btn-secondary btn-sm"
            style={{ flexShrink: 0, marginLeft: 12 }}
            onClick={onAIExtract}
            disabled={extracting}
          >
            {extracting ? '…' : <><Sparkles size={13} /> Extract</>}
          </button>
        )}
      </div>

      {SYMBOL_CATEGORIES.map(cat => (
        <div key={cat.id} style={{ marginBottom: 20 }}>
          <div className="flex items-center gap-2 mb-2">
            <span style={{ fontSize: '1.1rem' }}>{cat.icon}</span>
            <span className="font-semibold" style={{ fontSize: '0.9rem' }}>{cat.label}</span>
          </div>
          <TagInput
            tags={form[cat.id] || []}
            onChange={v => update(cat.id, v)}
            placeholder={cat.placeholder}
          />
        </div>
      ))}

      {/* Dream signs */}
      <div style={{ marginBottom: 20 }}>
        <div className="flex items-center gap-2 mb-2">
          <span style={{ fontSize: '1.1rem' }}>🌀</span>
          <span className="font-semibold" style={{ fontSize: '0.9rem' }}>Dream Signs</span>
        </div>
        <p className="text-muted text-xs" style={{ marginBottom: 10 }}>
          Personal triggers that can remind you that you're dreaming.
        </p>
        <div className="flex gap-2" style={{ flexWrap: 'wrap', marginBottom: 10 }}>
          {DREAM_SIGNS.slice(0, 12).map(sign => {
            const active = (form.dreamSigns || []).includes(sign);
            return (
              <button
                key={sign}
                onClick={() => {
                  const current = form.dreamSigns || [];
                  update('dreamSigns',
                    active ? current.filter(s => s !== sign) : [...current, sign]
                  );
                }}
                style={{
                  padding: '6px 12px',
                  borderRadius: 'var(--radius-full)',
                  border: `1px solid ${active ? 'var(--border-bright)' : 'var(--border)'}`,
                  background: active ? 'rgba(255,255,255,0.1)' : 'var(--bg-card)',
                  color: active ? 'var(--text-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.82rem',
                  fontFamily: 'var(--font-body)',
                  transition: 'all 0.15s',
                }}
              >
                {sign}
              </button>
            );
          })}
        </div>
        <TagInput
          tags={(form.dreamSigns || []).filter(s => !DREAM_SIGNS.includes(s))}
          onChange={v =>
            update('dreamSigns', [
              ...(form.dreamSigns || []).filter(s => DREAM_SIGNS.includes(s)),
              ...v,
            ])
          }
          placeholder="Add custom dream sign…"
        />
      </div>
    </div>
  );
}

// ── Main Form ────────────────────────────────────────
const TABS = [
  { id: 'dream',   label: 'Dream'   },
  { id: 'details', label: 'Details' },
  { id: 'symbols', label: 'Symbols' },
];

export default function DreamForm({ editMode = false }) {
  const navigate = useNavigate();
  const { id }   = useParams();

  const { addDream, updateDream, getDreamById } = useDreamStore();
  const { show }                                = useToastStore();
  const { openRouterKey, aiModel, autoAnalyze } = useSettingsStore();

  const [tab,        setTab]        = useState('dream');
  const [saving,     setSaving]     = useState(false);
  const [extracting, setExtracting] = useState(false);

  const [form, setForm] = useState({
    title: '', content: '',
    date: new Date().toISOString(),
    lucidityLevel: 0, mood: 0.5,
    characteristics: [],
    tags: [], dreamSigns: [],
    characters: [], locations: [],
    objects: [], other: [],
    isFavorite: false,
  });

  const autosaveRef = useRef(null);

  // Load existing dream or draft
  useEffect(() => {
    if (editMode && id) {
      const dream = getDreamById(id);
      if (dream) setForm({ objects: [], other: [], characteristics: [], ...dream });
    } else {
      const draft = localStorage.getItem('vitsleep_draft');
      if (draft) {
        try { setForm(f => ({ ...f, ...JSON.parse(draft) })); } catch {}
      }
    }
  }, [editMode, id]);

  // Autosave draft every 10s
  useEffect(() => {
    if (autosaveRef.current) clearTimeout(autosaveRef.current);
    autosaveRef.current = setTimeout(() => {
      if (form.content || form.title) {
        localStorage.setItem('vitsleep_draft', JSON.stringify(form));
      }
    }, 10000);
    return () => clearTimeout(autosaveRef.current);
  }, [form]);

  const update = (key, val) => setForm(f => ({ ...f, [key]: val }));

  // Save
  const handleSave = async () => {
    if (!form.content && !form.title) { show('Write something first.'); return; }
    setSaving(true);
    try {
      let saved;
      if (editMode && id) {
        saved = await updateDream(id, form);
        show('Dream updated ✓');
      } else {
        saved = await addDream(form);
        localStorage.removeItem('vitsleep_draft');
        show('Dream recorded ✓');
      }
      if (!editMode && autoAnalyze && openRouterKey && saved?.id) {
        triggerAutoAnalyze(saved);
      }
      navigate(-1);
    } finally {
      setSaving(false);
    }
  };

  // Background AI analysis
  const triggerAutoAnalyze = async (dream) => {
    try {
      const prompt = `You are a professional oneirologist and Jungian analyst. Analyze the following dream and return ONLY valid JSON with no extra text:
{"summary":"one sentence summary","psychological_interpretation":"paragraph on possible meanings","symbols_analysis":[{"symbol":"example","meaning":"explanation"}],"lucidity_opportunities":"what could trigger lucidity if this dream recurs","actionable_advice":"one concrete action for today"}

Dream Title: ${dream.title || 'Untitled'}
Dream: ${dream.content}
Dream Signs: ${dream.dreamSigns?.join(', ') || 'none'}`;

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openRouterKey}`,
          'HTTP-Referer': 'https://vitsleep.app',
        },
        body: JSON.stringify({
          model: aiModel || 'anthropic/claude-3.5-sonnet',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 800,
        }),
      });

      const data = await res.json();
      const text = data.choices?.[0]?.message?.content || '';
      if (text) {
        await updateDream(dream.id, {
          aiInterpretation: text,
          aiInterpretationDate: new Date().toISOString(),
        });
        show('AI analysis ready ✨');
      }
    } catch {
      // Silent — user can trigger manually from dream detail
    }
  };

  // AI symbol extraction
  const handleExtract = async () => {
    if (!openRouterKey || !form.content) return;
    setExtracting(true);
    try {
      const prompt = `Extract symbols from this dream text. Return ONLY JSON with no extra text:
{"characters":["list"],"locations":["list"],"objects":["list"],"dreamSigns":["unusual/recurring elements"]}

Dream: ${form.content}`;

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openRouterKey}`,
          'HTTP-Referer': 'https://vitsleep.app',
        },
        body: JSON.stringify({
          model: aiModel || 'anthropic/claude-3.5-sonnet',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 300,
        }),
      });

      const data    = await res.json();
      const text    = data.choices?.[0]?.message?.content || '';
      const clean   = text.replace(/```json|```/g, '').trim();
      const parsed  = JSON.parse(clean);

      setForm(f => ({
        ...f,
        characters: [...new Set([...(f.characters || []), ...(parsed.characters || [])])],
        locations:  [...new Set([...(f.locations  || []), ...(parsed.locations  || [])])],
        objects:    [...new Set([...(f.objects    || []), ...(parsed.objects    || [])])],
        dreamSigns: [...new Set([...(f.dreamSigns || []), ...(parsed.dreamSigns || [])])],
      }));
      show('Symbols extracted ✓');
    } catch {
      show('Extraction failed — check AI settings');
    } finally {
      setExtracting(false);
    }
  };

  return (
    <div className="page" style={{ paddingBottom: 100 }}>
      {/* Sticky header */}
      <div style={{
        position: 'sticky',
        top: 0,
        background: 'var(--bg-primary)',
        paddingTop: 'env(safe-area-inset-top, 12px)',
        zIndex: 30,
        marginBottom: 8,
      }}>
        <div className="flex items-center justify-between" style={{ padding: '10px 0' }}>
          <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)}>
            <X size={20} />
          </button>

          <div className="flex gap-2">
            {TABS.map(t => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                style={{
                  padding: '6px 14px',
                  borderRadius: 'var(--radius-full)',
                  border: 'none',
                  background: tab === t.id ? 'var(--text-primary)' : 'var(--bg-card)',
                  color: tab === t.id ? 'var(--bg-primary)' : 'var(--text-secondary)',
                  cursor: 'pointer',
                  fontSize: '0.85rem',
                  fontWeight: 500,
                  fontFamily: 'var(--font-body)',
                  transition: 'all 0.15s',
                }}
              >
                {t.label}
              </button>
            ))}
          </div>

          <button
            className="btn btn-primary btn-sm"
            onClick={handleSave}
            disabled={saving}
            style={{ borderRadius: 'var(--radius-full)', minWidth: 64 }}
          >
            {saving ? '…' : <><Check size={15} /> Save</>}
          </button>
        </div>
      </div>

      {/* Dream tab */}
      {tab === 'dream' && (
        <div className="anim-fade">
          <input
            className="input"
            placeholder="Title (optional)"
            value={form.title}
            onChange={e => update('title', e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              fontSize: '1.25rem',
              fontFamily: 'var(--font-display)',
              padding: '6px 0',
              marginBottom: 10,
              color: 'var(--text-primary)',
            }}
          />
          <textarea
            className="textarea"
            rows={18}
            placeholder={'Write your dream here…\n\nTip: write in present tense — "I am flying" not "I was flying". It keeps the dream vivid.'}
            value={form.content}
            onChange={e => update('content', e.target.value)}
            style={{
              background: 'transparent',
              border: 'none',
              padding: 0,
              fontSize: '0.95rem',
              lineHeight: 1.75,
            }}
            autoFocus={!editMode}
          />
        </div>
      )}

      {/* Details tab */}
      {tab === 'details' && (
        <div className="anim-fade">
          <div className="section">
            <label className="input-label">Lucidity Level</label>
            <LucidityPicker value={form.lucidityLevel} onChange={v => update('lucidityLevel', v)} />
          </div>

          <div className="section">
            <label className="input-label">Dream Mood</label>
            <MoodSlider value={form.mood} onChange={v => update('mood', v)} />
          </div>

          <div className="section">
            <label className="input-label">Characteristics</label>
            <CharacteristicsPicker
              value={form.characteristics}
              onChange={v => update('characteristics', v)}
            />
          </div>

          <div className="section">
            <label className="input-label">Tags</label>
            <TagInput
              tags={form.tags}
              onChange={v => update('tags', v)}
              placeholder="Add tags (e.g. flying, water, school)…"
            />
          </div>

          <div className="section">
            <label className="input-label">Date &amp; Time</label>
            <input
              type="datetime-local"
              className="input"
              value={form.date ? form.date.slice(0, 16) : ''}
              onChange={e => update('date', new Date(e.target.value).toISOString())}
            />
          </div>
        </div>
      )}

      {/* Symbols tab */}
      {tab === 'symbols' && (
        <div className="anim-fade">
          <SymbolsTab
            form={form}
            update={update}
            onAIExtract={handleExtract}
            extracting={extracting}
          />
        </div>
      )}
    </div>
  );
}
