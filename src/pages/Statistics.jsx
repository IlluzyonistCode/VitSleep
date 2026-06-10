import React, { useState, useMemo } from 'react';
import {
  LineChart, Line, XAxis, YAxis, Tooltip, ResponsiveContainer,
} from 'recharts';
import { format, subDays, eachDayOfInterval } from 'date-fns';
import { useDreamStore, useRCStore } from '../store/index.js';
import { LUCIDITY_LABELS } from '../data/content.js';

// ── Heatmap ────────────────────────────────────────
function HeatmapCalendar({ dreams }) {
  const today = new Date();
  const days = eachDayOfInterval({ start: subDays(today, 83), end: today });

  const dreamsByDate = useMemo(() => {
    const map = {};
    dreams.forEach(d => {
      const key = d.date?.split('T')[0];
      if (!map[key]) map[key] = [];
      map[key].push(d);
    });
    return map;
  }, [dreams]);

  const getColor = (dateStr) => {
    const list = dreamsByDate[dateStr];
    if (!list?.length) return 'var(--border)';
    const maxLucid = Math.max(...list.map(d => d.lucidityLevel));
    if (maxLucid === 3) return 'rgba(200,200,255,0.9)';
    if (maxLucid === 2) return 'rgba(150,150,220,0.7)';
    if (maxLucid === 1) return 'rgba(100,100,160,0.6)';
    return 'rgba(70,70,100,0.5)';
  };

  // Build weeks grid
  const weeks = [];
  let week = [];
  const startPad = days[0].getDay() === 0 ? 6 : days[0].getDay() - 1;
  for (let i = 0; i < startPad; i++) week.push(null);
  days.forEach(d => {
    week.push(d);
    if (week.length === 7) { weeks.push(week); week = []; }
  });
  if (week.length) weeks.push(week);

  const todayStr = today.toISOString().split('T')[0];

  return (
    <div>
      <div className="flex gap-1 mb-1">
        {['M','T','W','T','F','S','S'].map((d, i) => (
          <div key={i} style={{ flex: 1, textAlign: 'center', fontSize: '0.62rem', color: 'var(--text-muted)' }}>{d}</div>
        ))}
      </div>
      <div style={{ display: 'flex', gap: 3 }}>
        {weeks.map((w, wi) => (
          <div key={wi} style={{ display: 'flex', flexDirection: 'column', gap: 3, flex: 1 }}>
            {w.map((d, di) => {
              if (!d) return <div key={di} style={{ aspectRatio: '1', borderRadius: 3 }} />;
              const ds = d.toISOString().split('T')[0];
              return (
                <div
                  key={di}
                  style={{
                    aspectRatio: '1', borderRadius: 3,
                    background: getColor(ds),
                    border: ds === todayStr ? '1px solid rgba(255,255,255,0.5)' : 'none',
                  }}
                />
              );
            })}
          </div>
        ))}
      </div>
      <div className="flex items-center gap-3 mt-3" style={{ flexWrap: 'wrap' }}>
        {[
          { color: 'var(--border)', label: 'None' },
          { color: 'rgba(70,70,100,0.5)', label: 'Normal' },
          { color: 'rgba(100,100,160,0.6)', label: 'Pre-lucid' },
          { color: 'rgba(150,150,220,0.7)', label: 'Lucid' },
          { color: 'rgba(200,200,255,0.9)', label: 'Full lucid' },
        ].map(l => (
          <div key={l.label} className="flex items-center gap-1">
            <div style={{ width: 9, height: 9, borderRadius: 2, background: l.color, flexShrink: 0 }} />
            <span style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{l.label}</span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ── Line Chart ─────────────────────────────────────
function LucidityChart({ dreams, range }) {
  const data = useMemo(() => {
    const days = range === '3m' ? 90 : range === '1y' ? 365 : 730;
    const step = Math.max(7, Math.floor(days / 20));
    const points = [];
    for (let i = days - 1; i >= 0; i -= step) {
      const d = subDays(new Date(), i);
      const ds = d.toISOString().split('T')[0];
      const from = subDays(d, step).toISOString().split('T')[0];
      const slice = dreams.filter(dr => {
        const x = dr.date?.split('T')[0];
        return x >= from && x <= ds;
      });
      points.push({
        date: format(d, 'MMM d'),
        total: slice.length,
        lucid: slice.filter(dr => dr.lucidityLevel >= 2).length,
      });
    }
    return points;
  }, [dreams, range]);

  const Tip = ({ active, payload, label }) => {
    if (!active || !payload?.length) return null;
    return (
      <div style={{
        background: 'var(--bg-elevated)', border: '1px solid var(--border)',
        borderRadius: 'var(--radius-sm)', padding: '8px 12px', fontSize: '0.8rem'
      }}>
        <div className="text-muted mb-1">{label}</div>
        <div>All: <strong>{payload[0]?.value}</strong></div>
        <div style={{ color: 'rgba(180,180,255,0.9)' }}>Lucid: <strong>{payload[1]?.value}</strong></div>
      </div>
    );
  };

  return (
    <ResponsiveContainer width="100%" height={150}>
      <LineChart data={data} margin={{ top: 4, right: 4, left: -24, bottom: 0 }}>
        <XAxis dataKey="date" tick={{ fill: 'var(--text-muted)', fontSize: 9 }} tickLine={false} axisLine={false} interval="preserveStartEnd" />
        <YAxis tick={{ fill: 'var(--text-muted)', fontSize: 9 }} tickLine={false} axisLine={false} allowDecimals={false} />
        <Tooltip content={<Tip />} />
        <Line type="monotone" dataKey="total" stroke="rgba(255,255,255,0.25)" strokeWidth={1.5} dot={false} />
        <Line type="monotone" dataKey="lucid" stroke="rgba(180,180,255,0.9)" strokeWidth={2} dot={false} />
      </LineChart>
    </ResponsiveContainer>
  );
}

// ── Mood Distribution ─────────────────────────────
function MoodChart({ dreams }) {
  const buckets = useMemo(() => {
    const b = [
      { label: '😰', count: 0, color: '#ff4444' },
      { label: '😟', count: 0, color: '#ff8844' },
      { label: '😐', count: 0, color: '#aaaacc' },
      { label: '🙂', count: 0, color: '#88aaff' },
      { label: '😊', count: 0, color: '#88ffcc' },
    ];
    dreams.forEach(d => {
      const i = Math.min(4, Math.floor((d.mood ?? 0.5) * 5));
      b[i].count++;
    });
    return b;
  }, [dreams]);

  const max = Math.max(...buckets.map(b => b.count), 1);

  return (
    <div className="flex gap-2 items-end" style={{ height: 80 }}>
      {buckets.map((b, i) => {
        const h = Math.max(6, (b.count / max) * 68);
        return (
          <div key={i} style={{ flex: 1, display: 'flex', flexDirection: 'column', alignItems: 'center', gap: 4 }}>
            {b.count > 0 && <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>{b.count}</div>}
            <div style={{
              width: '100%', height: h, borderRadius: 4,
              background: b.color, opacity: b.count ? 0.7 : 0.12,
              transition: 'height 0.5s var(--ease-dream)',
              marginTop: 'auto',
            }} />
            <div style={{ fontSize: '1rem' }}>{b.label}</div>
          </div>
        );
      })}
    </div>
  );
}

// ── Signs Cloud ───────────────────────────────────
function SignsCloud({ dreams }) {
  const signs = useMemo(() => {
    const map = {};
    dreams.forEach(d => {
      [...(d.dreamSigns || []), ...(d.tags || [])].forEach(s => { map[s] = (map[s] || 0) + 1; });
    });
    return Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 24);
  }, [dreams]);

  if (!signs.length) return <p className="text-muted text-sm">Add dream signs and tags to your entries to see patterns here.</p>;

  const max = signs[0][1];
  return (
    <div className="flex gap-2" style={{ flexWrap: 'wrap' }}>
      {signs.map(([sign, count]) => {
        const scale = 0.7 + (count / max) * 0.55;
        return (
          <span key={sign} className="tag" style={{
            fontSize: `${scale * 0.85}rem`,
            opacity: 0.45 + (count / max) * 0.55,
            padding: `${Math.round(4 * scale)}px ${Math.round(10 * scale)}px`,
            background: `rgba(255,255,255,${0.03 + (count / max) * 0.07})`,
          }}>
            {sign}
          </span>
        );
      })}
    </div>
  );
}

// ── Main ──────────────────────────────────────────
export default function Statistics() {
  const { dreams, getStats } = useDreamStore();
  const { allChecks } = useRCStore();
  const [range, setRange] = useState('3m');
  const [tab, setTab] = useState('stats');
  const stats = getStats();
  const todayStr = new Date().toISOString().split('T')[0];

  const RANGES = [{ id: '3m', label: '3 months' }, { id: '1y', label: '1 year' }, { id: 'all', label: 'All time' }];

  return (
    <div className="page">
      <div className="page-header" style={{ paddingBottom: 16 }}>
        <div className="flex items-center gap-3 mb-4">
          {[['stats', 'Statistics'], ['symbols', 'Symbols']].map(([t, l]) => (
            <button key={t} onClick={() => setTab(t)} style={{
              padding: '8px 20px', borderRadius: 'var(--radius-full)', border: 'none',
              background: tab === t ? 'var(--text-primary)' : 'var(--bg-card)',
              color: tab === t ? 'var(--bg-primary)' : 'var(--text-secondary)',
              cursor: 'pointer', fontSize: '0.9rem', fontWeight: 500,
              fontFamily: 'var(--font-body)', transition: 'all 0.15s',
            }}>{l}</button>
          ))}
        </div>
        <h1>{tab === 'stats' ? 'Your Progress' : 'Dream Symbols'}</h1>
      </div>

      {/* STATS */}
      {tab === 'stats' && (
        <div className="anim-fade">
          {/* KPI grid */}
          <div style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', gap: 10, marginBottom: 20 }}>
            {[
              { label: 'Total Dreams', value: stats.total, icon: '🌙' },
              { label: 'Lucid Dreams', value: stats.lucid, icon: '✨' },
              { label: 'Day Streak', value: `${stats.streak}`, icon: '🔥' },
              { label: 'Lucidity Rate', value: `${stats.lucidPercent}%`, icon: '👁️' },
            ].map(s => (
              <div key={s.label} className="card" style={{ textAlign: 'center', padding: '18px 12px' }}>
                <div style={{ fontSize: '1.5rem', marginBottom: 6 }}>{s.icon}</div>
                <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', lineHeight: 1 }}>{s.value}</div>
                <div className="text-muted text-xs" style={{ marginTop: 4 }}>{s.label}</div>
              </div>
            ))}
          </div>

          {/* Reality checks */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="section-title mb-3">Reality Checks</div>
            <div className="flex gap-4">
              {[
                { label: 'Total', value: allChecks.length },
                { label: 'Today', value: allChecks.filter(c => c.date?.startsWith(todayStr)).length },
                { label: 'Avg/day', value: stats.streak ? Math.round(allChecks.length / Math.max(stats.streak, 1)) : 0 },
              ].map(s => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', lineHeight: 1 }}>{s.value}</div>
                  <div className="text-muted text-xs" style={{ marginTop: 4 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* Heatmap */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="section-title mb-3">Activity — Last 12 Weeks</div>
            <HeatmapCalendar dreams={dreams} />
          </div>

          {/* Line chart */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="flex items-center justify-between mb-3">
              <div className="section-title">Dream Frequency</div>
              <div className="flex gap-1">
                {RANGES.map(r => (
                  <button key={r.id} onClick={() => setRange(r.id)} style={{
                    padding: '3px 9px', borderRadius: 'var(--radius-full)', border: 'none',
                    background: range === r.id ? 'var(--bg-elevated)' : 'transparent',
                    color: range === r.id ? 'var(--text-primary)' : 'var(--text-muted)',
                    fontSize: '0.72rem', cursor: 'pointer', fontFamily: 'var(--font-body)',
                  }}>{r.label}</button>
                ))}
              </div>
            </div>
            {dreams.length > 0 ? (
              <>
                <LucidityChart dreams={dreams} range={range} />
                <div className="flex gap-4 mt-2">
                  <div className="flex items-center gap-2"><div style={{ width: 18, height: 2, background: 'rgba(255,255,255,0.3)' }} /><span className="text-muted text-xs">All dreams</span></div>
                  <div className="flex items-center gap-2"><div style={{ width: 18, height: 2, background: 'rgba(180,180,255,0.9)' }} /><span className="text-muted text-xs">Lucid</span></div>
                </div>
              </>
            ) : <p className="text-muted text-sm">Record dreams to see your chart.</p>}
          </div>

          {/* Mood */}
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="section-title mb-3">Dream Moods</div>
            {dreams.length ? <MoodChart dreams={dreams} /> : <p className="text-muted text-sm">No mood data yet.</p>}
          </div>
        </div>
      )}

      {/* SYMBOLS */}
      {tab === 'symbols' && (
        <div className="anim-fade">
          <div className="card" style={{ marginBottom: 16 }}>
            <div className="section-title mb-3">Signs & Tags Cloud</div>
            <SignsCloud dreams={dreams} />
          </div>

          <div className="card" style={{ marginBottom: 16 }}>
            <div className="section-title mb-3">Lucidity Breakdown</div>
            {LUCIDITY_LABELS.map(l => {
              const count = dreams.filter(d => d.lucidityLevel === l.level).length;
              const pct = dreams.length ? (count / dreams.length) * 100 : 0;
              return (
                <div key={l.level} style={{ marginBottom: 14 }}>
                  <div className="flex justify-between mb-1">
                    <span className={`lucidity-badge lucidity-${l.level}`}>{l.label}</span>
                    <span className="text-muted text-sm">{count}</span>
                  </div>
                  <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
                    <div style={{ height: '100%', width: `${pct}%`, background: `var(--lucid-${l.level})`, borderRadius: 2, transition: 'width 0.6s var(--ease-dream)' }} />
                  </div>
                </div>
              );
            })}
          </div>

          {(() => {
            const map = {};
            dreams.forEach(d => d.characters?.forEach(c => { map[c] = (map[c] || 0) + 1; }));
            const chars = Object.entries(map).sort((a, b) => b[1] - a[1]).slice(0, 10);
            if (!chars.length) return null;
            return (
              <div className="card" style={{ marginBottom: 16 }}>
                <div className="section-title mb-3">Dream Characters</div>
                {chars.map(([name, count]) => (
                  <div key={name} className="flex items-center justify-between" style={{ marginBottom: 8 }}>
                    <span className="text-secondary text-sm">👤 {name}</span>
                    <span className="tag">{count}×</span>
                  </div>
                ))}
              </div>
            );
          })()}
        </div>
      )}
    </div>
  );
}
