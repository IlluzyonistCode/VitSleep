import React, { useState, useMemo } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, Plus, Star, X, Calendar } from 'lucide-react';
import { format } from 'date-fns';
import { useDreamStore } from '../store/index.js';
import { LUCIDITY_LABELS } from '../data/content.js';
import DreamCalendar from '../components/ui/DreamCalendar.jsx';

function formatDate(iso) {
  const d = new Date(iso);
  const today = new Date();
  const yesterday = new Date(today);
  yesterday.setDate(today.getDate() - 1);
  if (d.toDateString() === today.toDateString()) return 'Today';
  if (d.toDateString() === yesterday.toDateString()) return 'Yesterday';
  return format(d, 'MMM d, yyyy');
}

function DreamListItem({ dream, onClick }) {
  const lucidity = LUCIDITY_LABELS[dream.lucidityLevel];

  return (
    <div
      className="card"
      onClick={onClick}
      style={{ cursor: 'pointer', marginBottom: 10, transition: 'all 0.15s' }}
    >
      <div className="flex items-center justify-between mb-1">
        <span className="text-muted text-xs">{formatDate(dream.date)}</span>
        <div className="flex items-center gap-2">
          {dream.isFavorite && <Star size={13} color="#fff" fill="#fff" />}
          <span className={`lucidity-badge lucidity-${dream.lucidityLevel}`}>
            {lucidity.label}
          </span>
        </div>
      </div>
      <div
        className="font-semibold"
        style={{ marginBottom: 4, fontSize: '1rem' }}
      >
        {dream.title || 'Untitled Dream'}
      </div>
      {dream.content && (
        <p
          className="text-secondary text-sm"
          style={{
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            lineHeight: 1.55,
          }}
        >
          {dream.content}
        </p>
      )}
      {dream.tags?.length > 0 && (
        <div className="flex gap-2 mt-2" style={{ flexWrap: 'wrap' }}>
          {dream.tags.slice(0, 4).map(t => (
            <span key={t} className="tag">{t}</span>
          ))}
        </div>
      )}
    </div>
  );
}

export default function Journal() {
  const navigate = useNavigate();
  const { dreams, searchDreams } = useDreamStore();
  const [query, setQuery] = useState('');
  const [filterLucid, setFilterLucid] = useState(null);
  const [showFav, setShowFav] = useState(false);
  const [view, setView] = useState('list'); // list | calendar

  const filtered = useMemo(() => {
    let list = query ? searchDreams(query) : [...dreams];
    if (filterLucid !== null) list = list.filter(d => d.lucidityLevel === filterLucid);
    if (showFav) list = list.filter(d => d.isFavorite);
    return list;
  }, [dreams, query, filterLucid, showFav]);

  const hasFilters = filterLucid !== null || showFav;

  return (
    <div className="page">
      <div className="page-header" style={{ paddingBottom: 16 }}>
        <div className="flex items-center justify-between mb-4">
          <h1>Journal</h1>
          <div className="flex gap-2">
            {/* List / Calendar toggle */}
            <button
              className={`btn btn-icon ${view === 'calendar' ? 'btn-primary' : 'btn-secondary'}`}
              style={{ width: 38, height: 38 }}
              onClick={() => setView(v => v === 'list' ? 'calendar' : 'list')}
              title="Calendar view"
            >
              <Calendar size={16} />
            </button>
            <button
              className="btn btn-primary btn-sm"
              onClick={() => navigate('/dream/new')}
              style={{ borderRadius: 'var(--radius-full)' }}
            >
              <Plus size={16} /> Dream
            </button>
          </div>
        </div>

        {/* Calendar view */}
        {view === 'calendar' && (
          <div className="anim-fade">
            <DreamCalendar />
          </div>
        )}

        {/* List view controls */}
        {view === 'list' && (
          <>
            <div style={{ position: 'relative', marginBottom: 10 }}>
              <Search size={16} style={{ position: 'absolute', left: 14, top: '50%', transform: 'translateY(-50%)', color: 'var(--text-muted)' }} />
              <input
                className="input"
                style={{ paddingLeft: 40, paddingRight: query ? 40 : 16 }}
                placeholder="Search dreams…"
                value={query}
                onChange={e => setQuery(e.target.value)}
              />
              {query && (
                <button onClick={() => setQuery('')} style={{ position: 'absolute', right: 12, top: '50%', transform: 'translateY(-50%)', background: 'none', border: 'none', cursor: 'pointer', color: 'var(--text-muted)', display: 'flex' }}>
                  <X size={16} />
                </button>
              )}
            </div>
            <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
              <button
                className={`btn btn-sm ${showFav ? 'btn-primary' : 'btn-secondary'}`}
                style={{ borderRadius: 'var(--radius-full)', padding: '6px 14px' }}
                onClick={() => setShowFav(f => !f)}
              >
                <Star size={13} fill={showFav ? 'currentColor' : 'none'} /> Favorites
              </button>
              {LUCIDITY_LABELS.map(l => (
                <button key={l.level}
                  className={`btn btn-sm ${filterLucid === l.level ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 'var(--radius-full)', padding: '6px 14px', fontSize: '0.78rem' }}
                  onClick={() => setFilterLucid(filterLucid === l.level ? null : l.level)}
                >
                  {l.label}
                </button>
              ))}
              {(filterLucid !== null || showFav) && (
                <button className="btn btn-ghost btn-sm" style={{ borderRadius: 'var(--radius-full)', padding: '6px 12px', fontSize: '0.78rem' }}
                  onClick={() => { setFilterLucid(null); setShowFav(false); }}>
                  <X size={12} /> Clear
                </button>
              )}
            </div>
          </>
        )}
      </div>

      {/* Calendar view - no list below */}
      {view === 'calendar' && null}

      {/* Dream list */}
      {view === 'list' && (filtered.length > 0 ? (
        <div className="anim-fade">
          {filtered.map(d => (
            <DreamListItem
              key={d.id}
              dream={d}
              onClick={() => navigate(`/journal/dream/${d.id}`)}
            />
          ))}
        </div>
      ) : (
        <div className="empty-state">
          <div className="empty-state-icon">🌙</div>
          {dreams.length === 0 ? (
            <>
              <h3>Your journal is empty</h3>
              <p>Record your first dream to begin building your dream life.</p>
              <button
                className="btn btn-primary mt-4"
                onClick={() => navigate('/dream/new')}
              >
                <Plus size={16} /> Record Dream
              </button>
            </>
          ) : (
            <>
              <h3>No results</h3>
              <p>Try different search terms or clear the filters.</p>
            </>
          )}
        </div>
      ))}
    </div>
  );
}
