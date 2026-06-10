import React, { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Edit2, Trash2, Star, Sparkles } from 'lucide-react';
import { format } from 'date-fns';
import { useDreamStore, useToastStore, useSettingsStore } from '../store/index.js';
import { LUCIDITY_LABELS, MOODS } from '../data/content.js';

function AIAnalysis({ dream, onGenerate, loading }) {
  const { openRouterKey, aiModel } = useSettingsStore();

  if (!openRouterKey) {
    return (
      <div className="card" style={{ marginTop: 20, borderStyle: 'dashed' }}>
        <div className="flex items-center gap-3">
          <span style={{ fontSize: '1.4rem' }}>🤖</span>
          <div>
            <div className="font-medium" style={{ marginBottom: 2 }}>AI Dream Analysis</div>
            <p className="text-muted text-sm">Add your OpenRouter API key in Settings to enable AI interpretation.</p>
          </div>
        </div>
      </div>
    );
  }

  if (dream.aiInterpretation) {
    let parsed = null;
    try { parsed = JSON.parse(dream.aiInterpretation); } catch {}

    return (
      <div className="card" style={{ marginTop: 20 }}>
        <div className="flex items-center justify-between mb-3">
          <div className="flex items-center gap-2">
            <span style={{ fontSize: '1.1rem' }}>✨</span>
            <span className="font-semibold">AI Analysis</span>
          </div>
          <button className="btn btn-ghost btn-sm" onClick={onGenerate} disabled={loading}>
            Regenerate
          </button>
        </div>
        {parsed ? (
          <div style={{ display: 'flex', flexDirection: 'column', gap: 16 }}>
            {parsed.summary && (
              <p className="text-secondary" style={{ fontStyle: 'italic', lineHeight: 1.6 }}>"{parsed.summary}"</p>
            )}
            {parsed.psychological_interpretation && (
              <div>
                <div className="section-title mb-2">Psychological Reading</div>
                <p className="text-secondary text-sm" style={{ lineHeight: 1.7 }}>{parsed.psychological_interpretation}</p>
              </div>
            )}
            {parsed.symbols_analysis?.length > 0 && (
              <div>
                <div className="section-title mb-2">Symbols</div>
                {parsed.symbols_analysis.map((s, i) => (
                  <div key={i} style={{ marginBottom: 8, padding: '8px 12px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-sm)' }}>
                    <span className="font-medium" style={{ fontSize: '0.9rem' }}>{s.symbol}</span>
                    <span className="text-muted text-sm"> — {s.meaning}</span>
                  </div>
                ))}
              </div>
            )}
            {parsed.lucidity_opportunities && (
              <div>
                <div className="section-title mb-2">Lucidity Opportunities</div>
                <p className="text-secondary text-sm" style={{ lineHeight: 1.7 }}>{parsed.lucidity_opportunities}</p>
              </div>
            )}
            {parsed.actionable_advice && (
              <div style={{ background: 'rgba(255,255,255,0.04)', borderRadius: 'var(--radius-md)', padding: 14, borderLeft: '2px solid var(--border-bright)' }}>
                <div className="section-title mb-1">Today's Action</div>
                <p className="text-secondary text-sm" style={{ lineHeight: 1.6 }}>{parsed.actionable_advice}</p>
              </div>
            )}
          </div>
        ) : (
          <p className="text-secondary text-sm" style={{ lineHeight: 1.7, whiteSpace: 'pre-wrap' }}>{dream.aiInterpretation}</p>
        )}
      </div>
    );
  }

  return (
    <div className="card" style={{ marginTop: 20, borderStyle: 'dashed' }}>
      <div className="flex items-center gap-3 mb-3">
        <span style={{ fontSize: '1.4rem' }}>🤖</span>
        <div>
          <div className="font-medium">AI Dream Analysis</div>
          <p className="text-muted text-sm">Jungian interpretation powered by {aiModel.split('/')[1] || 'AI'}</p>
        </div>
      </div>
      <button
        className="btn btn-secondary btn-full"
        onClick={onGenerate}
        disabled={loading}
      >
        {loading ? 'Analysing…' : <><Sparkles size={15} /> Generate Analysis</>}
      </button>
    </div>
  );
}

export default function DreamDetail() {
  const navigate = useNavigate();
  const { id } = useParams();
  const { getDreamById, deleteDream, toggleFavorite, updateDream } = useDreamStore();
  const { show } = useToastStore();
  const { openRouterKey, aiModel } = useSettingsStore();

  const [showDelete, setShowDelete] = useState(false);
  const [aiLoading, setAiLoading] = useState(false);

  const dream = getDreamById(id);

  if (!dream) {
    return (
      <div className="page">
        <div className="page-header">
          <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)}><ArrowLeft size={20} /></button>
        </div>
        <div className="empty-state">
          <h3>Dream not found</h3>
        </div>
      </div>
    );
  }

  const lucidity = LUCIDITY_LABELS[dream.lucidityLevel];
  const mood = MOODS.reduce((prev, curr) =>
    Math.abs(curr.value - dream.mood) < Math.abs(prev.value - dream.mood) ? curr : prev
  );

  const handleDelete = async () => {
    await deleteDream(dream.id);
    show('Dream deleted');
    navigate(-1);
  };

  const handleAI = async () => {
    if (!openRouterKey || aiLoading) return;
    setAiLoading(true);
    try {
      const prompt = `You are a professional oneirologist and Jungian analyst. Analyze the following dream.

Dream Title: ${dream.title || 'Untitled'}
Dream Content: ${dream.content}
Mood: ${mood.label}
Dream Signs: ${dream.dreamSigns?.join(', ') || 'none'}
Characters: ${dream.characters?.join(', ') || 'none'}
Locations: ${dream.locations?.join(', ') || 'none'}
Tags: ${dream.tags?.join(', ') || 'none'}

Provide your analysis in this exact JSON structure with no extra text:
{"summary":"one sentence summary","psychological_interpretation":"paragraph on possible meanings","symbols_analysis":[{"symbol":"example","meaning":"explanation"}],"lucidity_opportunities":"what dream signs could trigger lucidity","actionable_advice":"one concrete action for today"}`;

      const res = await fetch('https://openrouter.ai/api/v1/chat/completions', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${openRouterKey}`,
          'HTTP-Referer': 'https://vitsleep.app',
          'X-Title': 'VitSleep',
        },
        body: JSON.stringify({
          model: aiModel || 'anthropic/claude-3.5-sonnet',
          messages: [{ role: 'user', content: prompt }],
          max_tokens: 800,
        })
      });

      const data = await res.json();
      if (data.error) throw new Error(data.error.message);
      const text = data.choices?.[0]?.message?.content || '';

      await updateDream(dream.id, {
        aiInterpretation: text,
        aiInterpretationDate: new Date().toISOString()
      });
      show('Analysis complete ✓');
    } catch (err) {
      show('AI analysis failed: ' + (err.message || 'unknown error'));
    } finally {
      setAiLoading(false);
    }
  };

  return (
    <div className="page">
      {/* Header */}
      <div style={{
        position: 'sticky', top: 0,
        background: 'var(--bg-primary)',
        paddingTop: 'env(safe-area-inset-top, 16px)',
        zIndex: 30, paddingBottom: 8
      }}>
        <div className="flex items-center justify-between" style={{ paddingTop: 12 }}>
          <button className="btn btn-ghost btn-icon" onClick={() => navigate(-1)}>
            <ArrowLeft size={20} />
          </button>
          <div className="flex gap-2">
            <button
              className={`star-btn${dream.isFavorite ? ' active' : ''}`}
              onClick={() => toggleFavorite(dream.id)}
            >
              <Star size={20} fill={dream.isFavorite ? 'currentColor' : 'none'} />
            </button>
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => navigate(`/dream/edit/${dream.id}`)}
            >
              <Edit2 size={18} />
            </button>
            <button
              className="btn btn-ghost btn-icon"
              onClick={() => setShowDelete(true)}
              style={{ color: '#ff7070' }}
            >
              <Trash2 size={18} />
            </button>
          </div>
        </div>
      </div>

      {/* Meta */}
      <div style={{ marginBottom: 8 }}>
        <div className="flex items-center gap-2 mb-3">
          <span className={`lucidity-badge lucidity-${dream.lucidityLevel}`}>{lucidity.label}</span>
          <span style={{ fontSize: '1.2rem' }}>{mood.emoji}</span>
          <span className="text-muted text-sm">{format(new Date(dream.date), "MMMM d, yyyy 'at' HH:mm")}</span>
        </div>

        <h1 style={{ marginBottom: 8, fontSize: 'clamp(1.6rem, 6vw, 2.2rem)' }}>
          {dream.title || 'Untitled Dream'}
        </h1>
      </div>

      {/* Content */}
      <p style={{ lineHeight: 1.8, color: 'var(--text-secondary)', marginBottom: 24, fontSize: '0.97rem', whiteSpace: 'pre-wrap' }}>
        {dream.content || <em style={{ color: 'var(--text-muted)' }}>No content recorded.</em>}
      </p>

      {/* Tags & Signs */}
      {(dream.tags?.length > 0 || dream.dreamSigns?.length > 0 || dream.characters?.length > 0 || dream.locations?.length > 0) && (
        <div style={{ marginBottom: 24, display: 'flex', flexDirection: 'column', gap: 12 }}>
          {dream.tags?.length > 0 && (
            <div>
              <span className="text-muted text-xs" style={{ marginRight: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Tags</span>
              <div className="flex gap-2 mt-1" style={{ flexWrap: 'wrap' }}>
                {dream.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          )}
          {dream.dreamSigns?.length > 0 && (
            <div>
              <span className="text-muted text-xs" style={{ marginRight: 8, letterSpacing: '0.06em', textTransform: 'uppercase' }}>Dream Signs</span>
              <div className="flex gap-2 mt-1" style={{ flexWrap: 'wrap' }}>
                {dream.dreamSigns.map(s => <span key={s} className="tag" style={{ background: 'rgba(255,255,255,0.07)' }}>{s}</span>)}
              </div>
            </div>
          )}
          {dream.characters?.length > 0 && (
            <div>
              <span className="text-muted text-xs" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>Characters</span>
              <div className="flex gap-2 mt-1" style={{ flexWrap: 'wrap' }}>
                {dream.characters.map(c => <span key={c} className="tag">👤 {c}</span>)}
              </div>
            </div>
          )}
          {dream.locations?.length > 0 && (
            <div>
              <span className="text-muted text-xs" style={{ letterSpacing: '0.06em', textTransform: 'uppercase' }}>Locations</span>
              <div className="flex gap-2 mt-1" style={{ flexWrap: 'wrap' }}>
                {dream.locations.map(l => <span key={l} className="tag">📍 {l}</span>)}
              </div>
            </div>
          )}
        </div>
      )}

      {/* AI Analysis */}
      <AIAnalysis dream={dream} onGenerate={handleAI} loading={aiLoading} />

      {/* Delete Confirm */}
      {showDelete && (
        <div className="modal-overlay" onClick={() => setShowDelete(false)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <div className="modal-content">
              <h3 style={{ marginBottom: 8 }}>Delete this dream?</h3>
              <p className="text-secondary text-sm" style={{ marginBottom: 24 }}>
                This action cannot be undone. The dream and any AI analysis will be permanently removed.
              </p>
              <div className="flex gap-3">
                <button className="btn btn-secondary btn-full" onClick={() => setShowDelete(false)}>Cancel</button>
                <button className="btn btn-danger btn-full" onClick={handleDelete}>Delete</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
