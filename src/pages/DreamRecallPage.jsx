import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, Mic, Square, Play, Trash2, BookOpen } from 'lucide-react';
import { useToastStore } from '../store/index.js';

// ── Effectiveness comparison ──────────────────────────
const METHODS = [
  {
    rank: 1,
    title: 'Written Journal',
    icon: '✍️',
    effectiveness: 100,
    color: 'rgba(180,255,180,0.7)',
    summary: 'Best results. 3–5 days to noticeable improvement.',
    detail: 'Writing engages motor memory, visual memory, and analytical thinking simultaneously — three separate memory systems. The brain receives the strongest possible signal that dreams are worth preserving. Most people go from remembering fragments to full dream sequences within a week.',
    howto: [
      'Keep notebook and pen on nightstand — not your phone',
      'On waking: don\'t move, don\'t open eyes fully',
      'Wait 30 seconds, let fragments surface',
      'Write anything — even one word or a colour',
      'If nothing: write "no recall" and the date anyway',
    ],
  },
  {
    rank: 2,
    title: 'Voice Recorder',
    icon: '🎙️',
    effectiveness: 60,
    color: 'rgba(255,220,100,0.7)',
    summary: 'Good compromise. Review and note key points later.',
    detail: 'Speaking dream memories immediately after waking creates an external record before working memory fades. Review the recording later that day and write 3–5 key points. Less effective than writing because it doesn\'t engage the analytical memory system — but far better than mental review alone.',
    howto: [
      'Tap record immediately on waking — before any movement',
      'Speak whatever surfaces: images, emotions, names, places',
      'Don\'t try to narrate in order — grab whatever is there',
      'Later that day: listen back and write the key moments',
      'The act of writing from the recording doubles the retention',
    ],
  },
  {
    rank: 3,
    title: 'Mental Review Only',
    icon: '🧠',
    effectiveness: 15,
    color: 'rgba(255,130,130,0.5)',
    summary: 'Better than nothing. Forget in 10–30 seconds.',
    detail: 'Working memory holds dream content for only 10–30 seconds after waking. A single distraction — a sound, a notification, rolling over — erases it permanently. Mental review alone does not create the external record or send the brain the signal needed to improve recall over time. Use this only when the other options are genuinely unavailable.',
    howto: [
      'Lie still and run through the dream from end to beginning',
      'Anchor key images: a face, a colour, a feeling',
      'Move to the recorder or journal as soon as possible',
      'Even a 30-second voice note immediately beats 10 minutes of mental review later',
    ],
  },
];

// ── Voice Recorder component ──────────────────────────
function VoiceRecorder() {
  const [recording, setRecording] = useState(false);
  const [recordings, setRecordings] = useState([]);
  const [playing, setPlaying]     = useState(null);
  const [duration, setDuration]   = useState(0);
  const [hasPermission, setHasPermission] = useState(null);

  const mediaRecorderRef = useRef(null);
  const chunksRef        = useRef([]);
  const timerRef         = useRef(null);
  const audioRef         = useRef(null);
  const { show }         = useToastStore();

  const requestAndRecord = async () => {
    try {
      const stream = await navigator.mediaDevices.getUserMedia({ audio: true });
      setHasPermission(true);

      const mr = new MediaRecorder(stream);
      mediaRecorderRef.current = mr;
      chunksRef.current = [];

      mr.ondataavailable = e => { if (e.data.size > 0) chunksRef.current.push(e.data); };

      mr.onstop = () => {
        const blob = new Blob(chunksRef.current, { type: 'audio/webm' });
        const url  = URL.createObjectURL(blob);
        const ts   = new Date();
        setRecordings(prev => [
          {
            id: Date.now(),
            url,
            blob,
            duration,
            timestamp: ts.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
          },
          ...prev,
        ]);
        stream.getTracks().forEach(t => t.stop());
        clearInterval(timerRef.current);
        setDuration(0);
      };

      mr.start(100);
      setRecording(true);
      setDuration(0);
      timerRef.current = setInterval(() => setDuration(d => d + 1), 1000);
    } catch {
      setHasPermission(false);
      show('Microphone access denied — check browser settings');
    }
  };

  const stopRecording = () => {
    if (mediaRecorderRef.current && recording) {
      mediaRecorderRef.current.stop();
      setRecording(false);
    }
  };

  const playRecording = (rec) => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current = null;
    }
    if (playing === rec.id) {
      setPlaying(null);
      return;
    }
    const audio = new Audio(rec.url);
    audioRef.current = audio;
    audio.onended = () => setPlaying(null);
    audio.play();
    setPlaying(rec.id);
  };

  const deleteRecording = (id) => {
    setRecordings(prev => prev.filter(r => r.id !== id));
    if (playing === id && audioRef.current) {
      audioRef.current.pause();
      setPlaying(null);
    }
  };

  const fmtDur = (s) => `${Math.floor(s / 60)}:${String(s % 60).padStart(2, '0')}`;

  return (
    <div>
      {/* Record button */}
      {!recording ? (
        <button
          className="btn btn-primary btn-full btn-lg"
          style={{ borderRadius: 'var(--radius-lg)', marginBottom: 16 }}
          onClick={requestAndRecord}
        >
          <Mic size={20} /> Record Dream Note
        </button>
      ) : (
        <div style={{ marginBottom: 16 }}>
          <div className="card" style={{
            textAlign: 'center', padding: '20px',
            border: '1px solid rgba(255,100,100,0.3)',
            background: 'rgba(255,100,100,0.05)',
          }}>
            <div className="flex items-center justify-center gap-3 mb-3">
              <div style={{
                width: 10, height: 10, borderRadius: '50%',
                background: '#ff5555',
                animation: 'pulse-glow 1s infinite',
              }} />
              <span className="font-semibold" style={{ color: '#ff7070' }}>Recording</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.2rem' }}>
                {fmtDur(duration)}
              </span>
            </div>
            <button
              className="btn btn-full"
              style={{
                background: '#ff5555',
                color: '#fff',
                borderRadius: 'var(--radius-full)',
                border: 'none',
              }}
              onClick={stopRecording}
            >
              <Square size={16} /> Stop
            </button>
          </div>
        </div>
      )}

      {hasPermission === false && (
        <div className="card" style={{ marginBottom: 16, borderColor: 'rgba(255,100,100,0.3)' }}>
          <p className="text-secondary text-sm" style={{ lineHeight: 1.6 }}>
            Microphone access denied. Enable it in your browser settings, then reload the page.
          </p>
        </div>
      )}

      {/* Recordings list */}
      {recordings.length > 0 && (
        <div>
          <div className="section-title mb-2">Today's recordings</div>
          {recordings.map(rec => (
            <div key={rec.id} className="card" style={{ marginBottom: 8 }}>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => playRecording(rec)}
                  style={{
                    width: 40, height: 40, borderRadius: '50%',
                    background: playing === rec.id ? 'var(--text-primary)' : 'var(--bg-elevated)',
                    border: '1px solid var(--border)',
                    display: 'flex', alignItems: 'center', justifyContent: 'center',
                    cursor: 'pointer', color: playing === rec.id ? 'var(--bg-primary)' : 'var(--text-secondary)',
                    flexShrink: 0,
                  }}
                >
                  <Play size={15} />
                </button>
                <div style={{ flex: 1 }}>
                  <div className="font-medium text-sm">
                    Dream note — {rec.timestamp}
                  </div>
                  <div className="text-muted text-xs">{fmtDur(rec.duration)}</div>
                </div>
                <button
                  onClick={() => deleteRecording(rec.id)}
                  style={{
                    background: 'none', border: 'none', cursor: 'pointer',
                    color: 'var(--text-muted)', display: 'flex', padding: 4,
                  }}
                >
                  <Trash2 size={16} />
                </button>
              </div>
            </div>
          ))}
          <p className="text-muted text-xs" style={{ marginTop: 8, lineHeight: 1.6 }}>
            Recordings are session-only — they don't persist after closing the app. Listen back and write key points in your dream journal.
          </p>
        </div>
      )}
    </div>
  );
}

// ── Main page ─────────────────────────────────────────
export default function DreamRecallPage() {
  const navigate    = useNavigate();
  const [expanded, setExpanded] = useState(null);

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
        <h1>Dream Recall</h1>
        <p className="text-secondary mt-2" style={{ lineHeight: 1.55, fontSize: '0.95rem' }}>
          How you record matters almost as much as whether you record. The method directly affects how fast your recall improves.
        </p>
      </div>

      {/* Method cards */}
      <div style={{ marginBottom: 28 }}>
        <div className="section-title">Methods ranked by effectiveness</div>

        {METHODS.map(m => (
          <div
            key={m.rank}
            className="card"
            style={{ marginBottom: 10, cursor: 'pointer' }}
            onClick={() => setExpanded(expanded === m.rank ? null : m.rank)}
          >
            {/* Header */}
            <div className="flex items-center gap-3">
              <div style={{ fontSize: '1.5rem', flexShrink: 0 }}>{m.icon}</div>
              <div style={{ flex: 1 }}>
                <div className="flex items-center gap-2 mb-1">
                  <span className="font-semibold" style={{ fontSize: '0.95rem' }}>
                    {m.rank}. {m.title}
                  </span>
                </div>
                <p className="text-muted text-xs">{m.summary}</p>
              </div>
              <div style={{ flexShrink: 0 }}>
                <div style={{
                  width: 48,
                  height: 6,
                  background: 'var(--border)',
                  borderRadius: 3,
                  overflow: 'hidden',
                }}>
                  <div style={{
                    height: '100%',
                    width: `${m.effectiveness}%`,
                    background: m.color,
                    borderRadius: 3,
                    transition: 'width 0.5s var(--ease-dream)',
                  }} />
                </div>
                <div className="text-muted text-xs" style={{ textAlign: 'right', marginTop: 3 }}>
                  {m.effectiveness}%
                </div>
              </div>
            </div>

            {/* Expanded detail */}
            {expanded === m.rank && (
              <div style={{ marginTop: 14, paddingTop: 14, borderTop: '1px solid var(--border)' }}>
                <p className="text-secondary text-sm" style={{ lineHeight: 1.7, marginBottom: 12 }}>
                  {m.detail}
                </p>
                <div className="section-title mb-2">How to do it</div>
                {m.howto.map((step, i) => (
                  <div key={i} className="flex gap-2" style={{ marginBottom: 8 }}>
                    <span className="text-muted text-xs" style={{ flexShrink: 0, marginTop: 1 }}>
                      {i + 1}.
                    </span>
                    <p className="text-secondary text-sm" style={{ lineHeight: 1.6 }}>{step}</p>
                  </div>
                ))}
              </div>
            )}
          </div>
        ))}
      </div>

      {/* Key facts */}
      <div className="card" style={{ marginBottom: 24 }}>
        <div className="section-title mb-3">What the research shows</div>
        {[
          { stat: '3–5 days', desc: 'Time until written journal noticeably improves recall for most people' },
          { stat: '30 seconds', desc: 'How long working memory holds a dream after waking — one distraction resets it' },
          { stat: '2–3 dreams/night', desc: 'What most dedicated journal-keepers remember within 2 weeks (from near zero)' },
          { stat: '10 min', desc: 'Morning journal time that outperforms 1 hour of mental review done later' },
        ].map(item => (
          <div key={item.stat} className="flex gap-4 items-center" style={{ marginBottom: 14 }}>
            <div style={{
              fontFamily: 'var(--font-display)',
              fontSize: '1.1rem',
              color: 'var(--text-primary)',
              flexShrink: 0,
              minWidth: 70,
            }}>
              {item.stat}
            </div>
            <p className="text-secondary text-sm" style={{ lineHeight: 1.5 }}>{item.desc}</p>
          </div>
        ))}
      </div>

      {/* Voice recorder */}
      <div style={{ marginBottom: 24 }}>
        <div className="section-title mb-3">Quick Voice Note</div>
        <p className="text-secondary text-sm" style={{ marginBottom: 14, lineHeight: 1.6 }}>
          Tap record immediately on waking — even before you open your eyes fully. Then listen back later and write the key details in your journal.
        </p>
        <VoiceRecorder />
      </div>

      {/* Journal shortcut */}
      <button
        className="btn btn-secondary btn-full"
        style={{ marginBottom: 20 }}
        onClick={() => navigate('/dream/new')}
      >
        <BookOpen size={16} /> Open Dream Journal
      </button>
    </div>
  );
}
