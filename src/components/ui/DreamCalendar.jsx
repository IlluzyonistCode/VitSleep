import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronLeft, ChevronRight, Plus } from 'lucide-react';
import { format, startOfMonth, endOfMonth, eachDayOfInterval, isSameMonth, isSameDay, addMonths, subMonths } from 'date-fns';
import { useDreamStore } from '../../store/index.js';
import { LUCIDITY_LABELS, MOODS } from '../../data/content.js';

/* colour per lucidity */
function lucidColor(level) {
  return ['var(--lucid-0)', 'var(--lucid-1)', 'var(--lucid-2)', 'var(--lucid-3)'][level] ?? 'var(--lucid-0)';
}

export default function DreamCalendar() {
  const navigate = useNavigate();
  const { dreams } = useDreamStore();

  const [current, setCurrent] = useState(new Date());
  const [selected, setSelected] = useState(new Date());
  const [filterMode, setFilterMode] = useState('all'); // all | lucid | mood | signs

  const monthStart = startOfMonth(current);
  const monthEnd = endOfMonth(current);
  const days = eachDayOfInterval({ start: monthStart, end: monthEnd });

  // Pad so week starts on Monday
  const startPad = monthStart.getDay() === 0 ? 6 : monthStart.getDay() - 1;

  // Index dreams by date
  const byDate = {};
  dreams.forEach(d => {
    const key = d.date?.split('T')[0];
    if (!byDate[key]) byDate[key] = [];
    byDate[key].push(d);
  });

  const selectedKey = selected.toISOString().split('T')[0];
  const selectedDreams = byDate[selectedKey] || [];

  const getDayDot = (dateStr) => {
    const list = byDate[dateStr];
    if (!list?.length) return null;
    const maxLucid = Math.max(...list.map(d => d.lucidityLevel));
    return lucidColor(maxLucid);
  };

  const FILTER_TABS = [
    { id: 'all', icon: '•••', label: 'All' },
    { id: 'lucid', icon: '✨', label: 'Lucid' },
    { id: 'mood', icon: '😊', label: 'Mood' },
    { id: 'signs', icon: '🔮', label: 'Signs' },
  ];

  const filteredSelected = selectedDreams.filter(d => {
    if (filterMode === 'lucid') return d.lucidityLevel >= 2;
    if (filterMode === 'signs') return d.dreamSigns?.length > 0;
    return true;
  });

  return (
    <div>
      {/* Filter tabs */}
      <div className="flex gap-2 mb-4">
        {FILTER_TABS.map(t => (
          <button
            key={t.id}
            onClick={() => setFilterMode(t.id)}
            style={{
              flex: 1,
              padding: '8px 4px',
              borderRadius: 'var(--radius-full)',
              border: 'none',
              background: filterMode === t.id ? 'var(--text-primary)' : 'var(--bg-card)',
              color: filterMode === t.id ? 'var(--bg-primary)' : 'var(--text-muted)',
              cursor: 'pointer',
              fontSize: '0.8rem',
              fontFamily: 'var(--font-body)',
              fontWeight: 500,
              transition: 'all 0.15s',
            }}
          >
            {t.label}
          </button>
        ))}
      </div>

      {/* Month nav */}
      <div className="flex items-center justify-between mb-3">
        <button className="btn btn-ghost btn-icon" onClick={() => setCurrent(c => subMonths(c, 1))}>
          <ChevronLeft size={18} />
        </button>
        <span className="font-semibold" style={{ fontSize: '1rem' }}>
          {format(current, 'MMMM yyyy')}
        </span>
        <button className="btn btn-ghost btn-icon" onClick={() => setCurrent(c => addMonths(c, 1))}>
          <ChevronRight size={18} />
        </button>
      </div>

      {/* Day-of-week headers */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', marginBottom: 4 }}>
        {['Mo','Tu','We','Th','Fr','Sa','Su'].map(d => (
          <div key={d} style={{ textAlign: 'center', fontSize: '0.68rem', color: 'var(--text-muted)', padding: '4px 0' }}>{d}</div>
        ))}
      </div>

      {/* Day grid */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(7,1fr)', gap: 3, marginBottom: 20 }}>
        {/* Leading empty cells */}
        {Array.from({ length: startPad }).map((_, i) => <div key={`pad-${i}`} />)}

        {days.map(day => {
          const ds = day.toISOString().split('T')[0];
          const dot = getDayDot(ds);
          const isSelected = isSameDay(day, selected);
          const isToday = isSameDay(day, new Date());
          const hasDream = !!dot;

          return (
            <div
              key={ds}
              onClick={() => setSelected(day)}
              style={{
                aspectRatio: '1',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'center',
                justifyContent: 'center',
                borderRadius: 'var(--radius-sm)',
                cursor: hasDream ? 'pointer' : 'default',
                background: isSelected
                  ? 'var(--text-primary)'
                  : 'transparent',
                border: isToday && !isSelected
                  ? '1px solid var(--border-bright)'
                  : '1px solid transparent',
                transition: 'all 0.15s',
                position: 'relative',
              }}
            >
              <span style={{
                fontSize: '0.82rem',
                color: isSelected
                  ? 'var(--bg-primary)'
                  : isSameMonth(day, current)
                    ? 'var(--text-primary)'
                    : 'var(--text-muted)',
                fontWeight: hasDream ? 600 : 400,
              }}>
                {day.getDate()}
              </span>
              {/* Dream dot */}
              {dot && !isSelected && (
                <div style={{
                  width: 4, height: 4, borderRadius: '50%',
                  background: dot, position: 'absolute', bottom: 3,
                }} />
              )}
            </div>
          );
        })}
      </div>

      {/* Selected day dreams */}
      <div>
        <div className="flex items-center justify-between mb-3">
          <span className="section-title">
            {format(selected, 'MMMM d')}
            {isSameDay(selected, new Date()) ? ' — Today' : ''}
          </span>
          <button
            className="btn btn-ghost btn-sm"
            style={{ padding: '4px 8px', gap: 4, fontSize: '0.8rem' }}
            onClick={() => navigate('/dream/new')}
          >
            <Plus size={13} /> Add
          </button>
        </div>

        {filteredSelected.length > 0 ? (
          filteredSelected.map(d => {
            const lucidity = LUCIDITY_LABELS[d.lucidityLevel];
            const mood = MOODS.reduce((prev, curr) =>
              Math.abs(curr.value - (d.mood ?? 0.5)) < Math.abs(prev.value - (d.mood ?? 0.5)) ? curr : prev
            );
            return (
              <div
                key={d.id}
                className="card"
                style={{ marginBottom: 10, cursor: 'pointer' }}
                onClick={() => navigate(`/journal/dream/${d.id}`)}
              >
                <div className="flex items-center gap-2 mb-1">
                  <span className={`lucidity-badge lucidity-${d.lucidityLevel}`}>{lucidity.label}</span>
                  <span style={{ fontSize: '1rem' }}>{mood.emoji}</span>
                  {d.isFavorite && <span style={{ fontSize: '0.85rem' }}>⭐</span>}
                </div>
                <div className="font-semibold" style={{ fontSize: '0.95rem', marginBottom: 4 }}>
                  {d.title || 'Untitled Dream'}
                </div>
                {d.content && (
                  <p className="text-secondary text-sm"
                    style={{
                      display: '-webkit-box', WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical', overflow: 'hidden', lineHeight: 1.5,
                    }}>
                    {d.content}
                  </p>
                )}
                {d.dreamSigns?.length > 0 && (
                  <div className="flex gap-2 mt-2" style={{ flexWrap: 'wrap' }}>
                    {d.dreamSigns.slice(0, 3).map(s => (
                      <span key={s} className="tag" style={{ fontSize: '0.72rem' }}>{s}</span>
                    ))}
                  </div>
                )}
              </div>
            );
          })
        ) : (
          <div style={{ textAlign: 'center', padding: '24px 0' }}>
            <div style={{ fontSize: '2rem', opacity: 0.2, marginBottom: 8 }}>🌙</div>
            <p className="text-muted text-sm">
              {filterMode !== 'all'
                ? 'No matching dreams for this filter.'
                : 'No dreams recorded for this day.'}
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
