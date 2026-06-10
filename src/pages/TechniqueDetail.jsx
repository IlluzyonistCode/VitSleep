import React, { useState, useEffect, useRef } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { ArrowLeft, Play, Pause, RotateCcw, Check } from 'lucide-react';
import { TECHNIQUES } from '../data/content.js';
import { useSettingsStore, useRCStore, useToastStore } from '../store/index.js';

// ─────────────────────────────────────────────────────────
//  SSILD Timer
//  Based on original CosmicIron protocol:
//  Phase 1 — 5 quick warm-up cycles (8s per sense)
//  Phase 2 — 4 slow deep cycles (30s per sense)
//  Then fall asleep naturally. No trying to hold consciousness.
// ─────────────────────────────────────────────────────────
function SSILDTimer() {
  const PHASES = [
    {
      name: 'Vision',
      icon: '👁️',
      desc: 'Observe whatever appears behind your eyelids. Don\'t try to see anything — just receive passively.',
    },
    {
      name: 'Hearing',
      icon: '👂',
      desc: 'Listen to all sounds, near and far, internal and external. No analysis — just receiving.',
    },
    {
      name: 'Body',
      icon: '🫀',
      desc: 'Feel weight, warmth, tingling, contact with the bed. Passive observation only — don\'t move.',
    },
  ];

  const QUICK_CYCLES = 5;
  const SLOW_CYCLES  = 4;
  const QUICK_DUR    = 8;
  const SLOW_DUR     = 30;

  const [mode, setMode]         = useState('quick');
  const [cycle, setCycle]       = useState(0);
  const [phaseIdx, setPhaseIdx] = useState(0);
  const [seconds, setSeconds]   = useState(QUICK_DUR);
  const [running, setRunning]   = useState(false);
  const [done, setDone]         = useState(false);
  const [started, setStarted]   = useState(false);

  const intervalRef = useRef(null);
  const cycleRef    = useRef(0);
  const phaseRef    = useRef(0);
  const modeRef     = useRef('quick');

  const totalCycles = QUICK_CYCLES + SLOW_CYCLES;
  const globalCycle = mode === 'slow' ? QUICK_CYCLES + cycle : cycle;

  const advance = () => {
    const nextPhase = (phaseRef.current + 1) % 3;

    if (nextPhase === 0) {
      const nextCycle = cycleRef.current + 1;

      if (modeRef.current === 'quick' && nextCycle >= QUICK_CYCLES) {
        modeRef.current = 'slow';
        setMode('slow');
        cycleRef.current = 0;
        setCycle(0);
        phaseRef.current = 0;
        setPhaseIdx(0);
        setSeconds(SLOW_DUR);
        return;
      }

      if (modeRef.current === 'slow' && nextCycle >= SLOW_CYCLES) {
        setRunning(false);
        setDone(true);
        return;
      }

      cycleRef.current = nextCycle;
      setCycle(nextCycle);
    }

    const dur = modeRef.current === 'slow' ? SLOW_DUR : QUICK_DUR;
    phaseRef.current = nextPhase;
    setPhaseIdx(nextPhase);
    setSeconds(dur);
  };

  useEffect(() => {
    if (!running) { clearInterval(intervalRef.current); return; }
    intervalRef.current = setInterval(() => {
      setSeconds(s => {
        if (s <= 1) {
          advance();
          return modeRef.current === 'slow' ? SLOW_DUR : QUICK_DUR;
        }
        return s - 1;
      });
    }, 1000);
    return () => clearInterval(intervalRef.current);
  }, [running]);

  const reset = () => {
    clearInterval(intervalRef.current);
    setMode('quick');   modeRef.current = 'quick';
    setCycle(0);        cycleRef.current = 0;
    setPhaseIdx(0);     phaseRef.current = 0;
    setSeconds(QUICK_DUR);
    setRunning(false);
    setDone(false);
    setStarted(false);
  };

  const phase   = PHASES[phaseIdx];
  const curDur  = mode === 'slow' ? SLOW_DUR : QUICK_DUR;
  const progress = ((curDur - seconds) / curDur) * 100;

  // Pre-start screen
  if (!started) {
    return (
      <div>
        <div className="card" style={{ marginBottom: 12, borderLeft: '2px solid var(--border-bright)' }}>
          <div className="font-semibold text-sm mb-2">When you wake up at night</div>
          <p className="text-secondary text-sm" style={{ lineHeight: 1.7 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Do not get up.</strong> Stay lying down. Don't open your eyes fully. Don't check your phone.
          </p>
          <p className="text-secondary text-sm" style={{ lineHeight: 1.7, marginTop: 8 }}>
            If you feel very heavy and groggy — you woke from deep sleep. Get up for just 5 minutes (bathroom, sip of water), then lie back and start. Otherwise stay still and begin immediately.
          </p>
          <p className="text-muted text-xs" style={{ marginTop: 8 }}>
            Note: SSILD doesn't require a specific phase. Any waking after 4–6 hours works. The deep-sleep grogginess is the only case where getting up briefly helps.
          </p>
        </div>

        <div className="card" style={{ marginBottom: 16 }}>
          <div className="section-title mb-3">Protocol</div>
          {[
            { n: 1, label: `Quick warm-up × ${QUICK_CYCLES}`, sub: `${QUICK_DUR}s per sense — light, fast passes to prime awareness` },
            { n: 2, label: `Slow deep cycles × ${SLOW_CYCLES}`, sub: `${SLOW_DUR}s per sense — deep passive observation` },
            { n: 3, label: 'Fall asleep naturally', sub: 'After the last cycle, roll over and let go. Do not try to stay conscious.' },
          ].map(step => (
            <div key={step.n} className="flex gap-3" style={{ marginBottom: 12 }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                background: 'var(--bg-elevated)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.72rem', fontWeight: 700, color: 'var(--text-secondary)',
                flexShrink: 0, marginTop: 1,
              }}>{step.n}</div>
              <div>
                <div className="font-medium text-sm">{step.label}</div>
                <p className="text-muted text-xs" style={{ marginTop: 2 }}>{step.sub}</p>
              </div>
            </div>
          ))}
        </div>

        <button
          className="btn btn-primary btn-full btn-lg"
          style={{ borderRadius: 'var(--radius-lg)' }}
          onClick={() => { setStarted(true); setRunning(true); }}
        >
          <Play size={18} /> Start SSILD
        </button>
      </div>
    );
  }

  // Done screen
  if (done) {
    return (
      <div style={{ textAlign: 'center', padding: '32px 0' }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>🌙</div>
        <h3 style={{ marginBottom: 8 }}>All cycles complete</h3>
        <p className="text-secondary text-sm" style={{ marginBottom: 8, lineHeight: 1.6 }}>
          Roll over and fall asleep. Don't evaluate whether it "worked." Don't try to hold onto awareness. Let go completely.
        </p>
        <p className="text-muted text-xs" style={{ marginBottom: 24 }}>
          Losing track mid-cycle is a good sign — it means you were close to sleep.
        </p>
        <button className="btn btn-secondary" onClick={reset}>Start Over</button>
      </div>
    );
  }

  // Running screen
  return (
    <div style={{ textAlign: 'center' }}>
      <div style={{ marginBottom: 12 }}>
        <span style={{
          padding: '4px 12px',
          borderRadius: 'var(--radius-full)',
          fontSize: '0.72rem',
          fontWeight: 600,
          letterSpacing: '0.06em',
          textTransform: 'uppercase',
          background: mode === 'slow' ? 'rgba(180,180,255,0.12)' : 'var(--bg-card)',
          color: mode === 'slow' ? 'rgba(180,180,255,0.9)' : 'var(--text-muted)',
          border: '1px solid var(--border)',
          transition: 'all 0.4s',
        }}>
          {mode === 'quick'
            ? `Warm-up · ${QUICK_CYCLES - cycle} cycle${QUICK_CYCLES - cycle !== 1 ? 's' : ''} left`
            : `Deep · ${SLOW_CYCLES - cycle} cycle${SLOW_CYCLES - cycle !== 1 ? 's' : ''} left`}
        </span>
      </div>

      {/* Progress dots */}
      <div className="flex gap-2 justify-center mb-5" style={{ flexWrap: 'wrap' }}>
        {Array.from({ length: totalCycles }).map((_, i) => {
          const isDone    = i < globalCycle;
          const isCurrent = i === globalCycle;
          const isSlow    = i >= QUICK_CYCLES;
          return (
            <div key={i} style={{
              width: isSlow ? 22 : 14,
              height: 4,
              borderRadius: 2,
              background: isDone
                ? 'var(--text-primary)'
                : isCurrent
                  ? 'rgba(255,255,255,0.5)'
                  : 'var(--border)',
              transition: 'all 0.3s',
            }} />
          );
        })}
      </div>

      {/* Ring timer */}
      <div style={{ position: 'relative', width: 160, height: 160, margin: '0 auto 20px' }}>
        <svg width="160" height="160" style={{ transform: 'rotate(-90deg)', position: 'absolute' }}>
          <circle cx="80" cy="80" r="70" fill="none" stroke="var(--border)" strokeWidth="4" />
          <circle
            cx="80" cy="80" r="70"
            fill="none"
            stroke={mode === 'slow' ? 'rgba(180,180,255,0.9)' : 'var(--text-primary)'}
            strokeWidth="4"
            strokeDasharray={2 * Math.PI * 70}
            strokeDashoffset={2 * Math.PI * 70 * (1 - progress / 100)}
            strokeLinecap="round"
            style={{ transition: 'stroke-dashoffset 0.9s linear' }}
          />
        </svg>
        <div style={{
          position: 'absolute', inset: 0,
          display: 'flex', flexDirection: 'column',
          alignItems: 'center', justifyContent: 'center',
        }}>
          <div style={{ fontSize: '2rem', marginBottom: 4 }}>{phase.icon}</div>
          <div style={{ fontFamily: 'var(--font-display)', fontSize: '1.8rem', lineHeight: 1 }}>{seconds}</div>
          <div className="text-muted text-xs" style={{ marginTop: 4 }}>{phase.name}</div>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 20, textAlign: 'left' }}>
        <p className="text-secondary text-sm" style={{ lineHeight: 1.65 }}>{phase.desc}</p>
      </div>

      <div className="flex gap-3 justify-center">
        <button className="btn btn-icon btn-secondary" onClick={reset} title="Reset">
          <RotateCcw size={18} />
        </button>
        <button
          className="btn btn-primary"
          style={{ minWidth: 120, borderRadius: 'var(--radius-full)' }}
          onClick={() => setRunning(r => !r)}
        >
          {running ? <><Pause size={16} /> Pause</> : <><Play size={16} /> Resume</>}
        </button>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  Reality Check Settings
// ─────────────────────────────────────────────────────────
function RCSettings() {
  const { rcEnabled, rcInterval, rcStart, rcEnd, set } = useSettingsStore();
  const { addCheck, todayChecks } = useRCStore();
  const { show } = useToastStore();

  const requestPermission = async () => {
    if (!('Notification' in window)) {
      show('Notifications not supported in this browser');
      return;
    }
    const result = await Notification.requestPermission();
    if (result === 'granted') {
      set({ rcEnabled: true });
      show('Reality check reminders enabled ✓');
    } else {
      show('Permission denied — enable notifications in browser settings');
    }
  };

  return (
    <div>
      {/* Habit anchor tip */}
      <div className="card" style={{ marginBottom: 12, borderLeft: '2px solid var(--border-bright)' }}>
        <p className="text-secondary text-sm" style={{ lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--text-primary)' }}>Anchor to actions, not timers.</strong> Do a check every time you walk through a door, pick up your phone, or look in a mirror. This builds a more genuine reflex than alarm-triggered checks.
        </p>
        <p className="text-muted text-xs" style={{ marginTop: 6 }}>
          Reminders below are a backup — but the habit loop works better when tied to your own actions.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium mb-1">Periodic Reminders</div>
            <p className="text-muted text-xs">Get notified to check reality during the day</p>
          </div>
          <label className="toggle" onClick={e => e.stopPropagation()}>
            <input
              type="checkbox"
              checked={rcEnabled}
              onChange={e => {
                if (e.target.checked) requestPermission();
                else set({ rcEnabled: false });
              }}
            />
            <span className="toggle-slider" />
          </label>
        </div>
      </div>

      {rcEnabled && (
        <>
          <div className="card" style={{ marginBottom: 12 }}>
            <label className="input-label">Interval</label>
            <div className="flex gap-2" style={{ flexWrap: 'wrap', marginTop: 8 }}>
              {[30, 60, 90, 120].map(m => (
                <button
                  key={m}
                  className={`btn btn-sm ${rcInterval === m ? 'btn-primary' : 'btn-secondary'}`}
                  style={{ borderRadius: 'var(--radius-full)' }}
                  onClick={() => set({ rcInterval: m })}
                >
                  {m < 60 ? `${m}min` : `${m / 60}hr`}
                </button>
              ))}
            </div>
          </div>

          <div className="card" style={{ marginBottom: 12 }}>
            <label className="input-label">Active Hours</label>
            <div className="flex gap-3 items-center" style={{ marginTop: 8 }}>
              <input
                type="time"
                className="input"
                value={rcStart}
                onChange={e => set({ rcStart: e.target.value })}
                style={{ flex: 1 }}
              />
              <span className="text-muted">to</span>
              <input
                type="time"
                className="input"
                value={rcEnd}
                onChange={e => set({ rcEnd: e.target.value })}
                style={{ flex: 1 }}
              />
            </div>
          </div>
        </>
      )}

      <div className="card">
        <div className="flex items-center justify-between">
          <div>
            <div className="font-medium mb-1">Today's Checks</div>
            <div style={{ fontFamily: 'var(--font-display)', fontSize: '2rem', lineHeight: 1 }}>
              {todayChecks.length}
            </div>
          </div>
          <button
            className="btn btn-primary"
            onClick={async () => { await addCheck(); show('Reality check logged ✓'); }}
          >
            + Log Now
          </button>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  WBTB Settings
//  Corrected: 5–10 min awake (not 20), no bright light,
//  fall back asleep within 5 minutes for best results.
// ─────────────────────────────────────────────────────────
function WBTBSettings() {
  const [alarmSet, setAlarmSet]   = useState(false);
  const [sleepTime, setSleepTime] = useState('23:00');
  const [hoursAfter, setHoursAfter] = useState(5);
  const { show } = useToastStore();

  const computeAlarm = () => {
    const [h, m] = sleepTime.split(':').map(Number);
    const d = new Date();
    d.setHours(h, m, 0, 0);
    d.setTime(d.getTime() + hoursAfter * 3600000);
    return `${String(d.getHours()).padStart(2, '0')}:${String(d.getMinutes()).padStart(2, '0')}`;
  };

  const handleSet = () => {
    setAlarmSet(true);
    show(`WBTB alarm set for ${computeAlarm()} ✓`);

    if ('Notification' in window && Notification.permission === 'granted') {
      const [h, m] = sleepTime.split(':').map(Number);
      const d = new Date();
      d.setHours(h, m, 0, 0);
      const alarmTime = d.getTime() + hoursAfter * 3600000;
      const delay = alarmTime - Date.now();
      if (delay > 0) {
        setTimeout(() => {
          new Notification('VitSleep — Wake Back to Bed', {
            body: 'Stay up 5–10 min only. No bright light. No phone screen. Then MILD or SSILD — fall back asleep within 5 minutes.',
            icon: '/icon-192.png',
          });
        }, delay);
      }
    }
  };

  return (
    <div>
      {/* Key rule card */}
      <div className="card" style={{ marginBottom: 12, borderLeft: '2px solid var(--border-bright)' }}>
        <div className="font-semibold text-sm mb-2">The 5-minute rule</div>
        <p className="text-secondary text-sm" style={{ lineHeight: 1.7 }}>
          After returning to bed, falling back asleep within <strong style={{ color: 'var(--text-primary)' }}>5 minutes</strong> is the single strongest predictor of WBTB success. Do MILD or SSILD immediately on lying down — don't wait until alert.
        </p>
        <p className="text-muted text-xs" style={{ marginTop: 8 }}>
          Stay up for <strong>5–10 minutes only</strong>. Bathroom, sip of water. No bright lights. No phone screen. Bright light suppresses melatonin and delays re-sleep.
        </p>
      </div>

      {/* Mutually exclusive warning */}
      <div className="card" style={{
        marginBottom: 12,
        background: 'rgba(255,180,80,0.05)',
        border: '1px solid rgba(255,180,80,0.18)',
      }}>
        <div className="flex gap-3">
          <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>⚠️</span>
          <p className="text-secondary text-sm" style={{ lineHeight: 1.65 }}>
            <strong style={{ color: 'var(--text-primary)' }}>WBTB and Audio Cues are mutually exclusive.</strong> If you use WBTB tonight, don't also schedule audio cues. Choose one strategy per night.
          </p>
        </div>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <label className="input-label">I plan to sleep at</label>
        <input
          type="time"
          className="input"
          value={sleepTime}
          onChange={e => setSleepTime(e.target.value)}
          style={{ marginTop: 6 }}
        />
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <label className="input-label">Wake me after</label>
        <div className="flex gap-2" style={{ marginTop: 8 }}>
          {[4, 4.5, 5, 5.5, 6].map(h => (
            <button
              key={h}
              className={`btn btn-sm ${hoursAfter === h ? 'btn-primary' : 'btn-secondary'}`}
              style={{ flex: 1, borderRadius: 'var(--radius-md)' }}
              onClick={() => setHoursAfter(h)}
            >
              {h}h
            </button>
          ))}
        </div>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="text-secondary text-sm">
          WBTB alarm:{' '}
          <strong style={{ color: 'var(--text-primary)', fontFamily: 'var(--font-display)', fontSize: '1.1rem' }}>
            {computeAlarm()}
          </strong>
        </div>
      </div>

      <button
        className={`btn ${alarmSet ? 'btn-secondary' : 'btn-primary'} btn-full`}
        onClick={handleSet}
      >
        {alarmSet
          ? <><Check size={16} /> Alarm Set — {computeAlarm()}</>
          : '⏰ Set WBTB Alarm'}
      </button>

      {/* SaA configuration guide — shown after alarm is set */}
      {alarmSet && (
        <div className="card" style={{ marginTop: 16 }}>
          <div className="section-title mb-3">Sleep as Android — after WBTB</div>
          <p className="text-muted text-xs" style={{ marginBottom: 12, lineHeight: 1.6 }}>
            When you return to bed, open SaA and configure Lucid Dreaming before pressing the moon:
          </p>
          {[
            { label: 'Later (Не сейчас)', value: '1 hour', note: 'Hours from when you press start — there are no minutes. 1h gives time to fall asleep before tracking begins.' },
            { label: 'Sensitivity', value: 'Medium or High', note: 'Higher = more frequent cue attempts' },
            { label: 'Vibrate', value: 'ON', note: 'Vibration reaches the dream even when sound doesn\'t' },
            { label: 'Repeat', value: '3×', note: 'Plays the cue three times per REM detection' },
            { label: 'Force headphones', value: 'ON (if wearing)', note: 'Keeps the cue closer to the ear, less likely to wake a partner' },
          ].map(item => (
            <div key={item.label} style={{ marginBottom: 10 }}>
              <div className="flex items-center justify-between mb-1">
                <span className="text-secondary text-sm">{item.label}</span>
                <span
                  className="tag"
                  style={{ fontSize: '0.75rem', color: 'var(--text-primary)', background: 'rgba(255,255,255,0.07)' }}
                >
                  {item.value}
                </span>
              </div>
              <p className="text-muted text-xs" style={{ lineHeight: 1.5 }}>{item.note}</p>
            </div>
          ))}
          <div
            style={{
              marginTop: 12,
              padding: '10px 12px',
              background: 'rgba(255,255,255,0.03)',
              borderRadius: 'var(--radius-md)',
              border: '1px solid var(--border)',
            }}
          >
            <p className="text-secondary text-xs" style={{ lineHeight: 1.6 }}>
              <strong style={{ color: 'var(--text-primary)' }}>Sequence after returning to bed: </strong>
              Start SaA tracking → put phone face-down → SSILD (3–4 cycles) → MILD (5–10×) → fall asleep within 5 min.
            </p>
          </div>
        </div>
      )}
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  Audio Cue Trainer
//  Uses SpeechSynthesis to play "You are dreaming"
//  User responds with a physical reality check each time.
// ─────────────────────────────────────────────────────────
function AudioCueTrainer() {
  const [reps, setReps]       = useState(0);
  const [playing, setPlaying] = useState(false);
  const { show }              = useToastStore();
  const TARGET = 20;

  const playAndRespond = () => {
    if (playing) return;
    setPlaying(true);

    if ('speechSynthesis' in window) {
      const u   = new SpeechSynthesisUtterance('You are dreaming');
      u.rate    = 0.8;
      u.pitch   = 0.9;
      u.volume  = 0.7;
      u.onend   = () => setPlaying(false);
      speechSynthesis.speak(u);
    } else {
      setTimeout(() => setPlaying(false), 1500);
    }

    setReps(r => {
      const next = r + 1;
      if (next === TARGET) show('Training session complete ✓ Repeat daily for 1–2 weeks.');
      return next;
    });
  };

  const pct = Math.min(100, (reps / TARGET) * 100);

  return (
    <div>
      <div className="card" style={{ marginBottom: 12, borderLeft: '2px solid var(--border-bright)' }}>
        <p className="text-secondary text-sm" style={{ lineHeight: 1.7 }}>
          Each tap plays the cue. <strong style={{ color: 'var(--text-primary)' }}>Respond immediately:</strong> pinch your nose closed and try to breathe in, then look at your hands. Say aloud: <em>"When I hear this in a dream, I will know I am sleeping."</em>
        </p>
        <p className="text-muted text-xs" style={{ marginTop: 8 }}>
          20 reps per day, every day for 1–2 weeks. The conditioned reflex builds gradually — don't expect results in the first few nights.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 16 }}>
        <div className="flex items-center justify-between mb-2">
          <span className="font-medium text-sm">Today's reps</span>
          <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.4rem', lineHeight: 1 }}>
            {reps}/{TARGET}
          </span>
        </div>
        <div style={{ height: 4, background: 'var(--border)', borderRadius: 2, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${pct}%`,
            background: pct >= 100 ? 'rgba(180,255,180,0.7)' : 'var(--text-primary)',
            borderRadius: 2,
            transition: 'width 0.3s var(--ease-dream)',
          }} />
        </div>
      </div>

      <button
        className="btn btn-primary btn-full btn-lg"
        onClick={playAndRespond}
        disabled={playing}
        style={{
          borderRadius: 'var(--radius-lg)',
          opacity: playing ? 0.7 : 1,
          marginBottom: 12,
        }}
      >
        {playing ? '🔊 Hearing it — respond now…' : '▶  Play Cue + Respond'}
      </button>

      <p className="text-muted text-xs" style={{ textAlign: 'center', lineHeight: 1.6, marginBottom: 20 }}>
        After the cue: pinch nose → check hands → say the phrase. Make it automatic.
      </p>

      <div className="card" style={{
        background: 'rgba(255,180,80,0.05)',
        border: '1px solid rgba(255,180,80,0.18)',
      }}>
        <div className="flex gap-3">
          <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>⚠️</span>
          <p className="text-secondary text-sm" style={{ lineHeight: 1.65 }}>
            <strong style={{ color: 'var(--text-primary)' }}>On nights you use audio cues:</strong> do not set a WBTB alarm. These are mutually exclusive strategies — WBTB disrupts the precise sleep architecture that audio cues depend on.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  Stabilisation Guide
//  The first 10–15 seconds of a lucid dream are the
//  most likely moment to lose it. This protocol prevents that.
// ─────────────────────────────────────────────────────────
function StabilisationGuide() {
  const STEPS = [
    { label: 'Freeze',          icon: '🧊', desc: 'Do not celebrate or shout. Complete stillness. Let the reality of the dream settle around you.',       duration: 3 },
    { label: 'Rub your palms', icon: '🙌', desc: 'Rub your hands together vigorously. Feel every detail of the friction. This is the most effective single stabilisation act.',    duration: 8 },
    { label: 'Look at hands',  icon: '👀', desc: 'Hold your dream hands in front of you. Count the fingers. Really see them — their shape, texture, colour.', duration: 5 },
    { label: 'Touch the floor', icon: '🤲', desc: 'Crouch and press your palm to the nearest surface. Feel the texture in full detail. Ground yourself in the dreamscape.', duration: 5 },
    { label: 'Say: Stabilise', icon: '🗣️', desc: 'Say calmly, out loud in the dream: "Stabilise" or "Clarity now." The dream tends to respond to verbal intention.', duration: 3 },
    { label: 'You\'re stable', icon: '⚓', desc: 'Wait here calmly. You now have time. Explore slowly before attempting anything complex.',                   duration: 0 },
  ];

  const [step, setStep]       = useState(0);
  const [running, setRunning] = useState(false);
  const [elapsed, setElapsed] = useState(0);
  const timerRef              = useRef(null);

  const currentStep = STEPS[step];

  useEffect(() => {
    if (!running) { clearInterval(timerRef.current); return; }
    timerRef.current = setInterval(() => {
      setElapsed(e => {
        if (e >= currentStep.duration - 1) {
          clearInterval(timerRef.current);
          if (step < STEPS.length - 1) {
            setTimeout(() => {
              setStep(s => s + 1);
              setElapsed(0);
              setRunning(true);
            }, 400);
          } else {
            setRunning(false);
          }
          return currentStep.duration;
        }
        return e + 1;
      });
    }, 1000);
    return () => clearInterval(timerRef.current);
  }, [running, step]);

  const reset = () => {
    clearInterval(timerRef.current);
    setStep(0);
    setElapsed(0);
    setRunning(false);
  };

  const start = () => {
    reset();
    setTimeout(() => setRunning(true), 100);
  };

  return (
    <div>
      <p className="text-secondary text-sm" style={{ marginBottom: 16, lineHeight: 1.65 }}>
        Rehearse this now, awake. The more automatic it becomes while conscious, the more reliably it fires when you actually become lucid.
      </p>

      {/* Current step */}
      <div className="card" style={{
        textAlign: 'center', padding: '28px 20px', marginBottom: 16,
        minHeight: 170, display: 'flex', flexDirection: 'column',
        alignItems: 'center', justifyContent: 'center',
      }}>
        <div style={{ fontSize: '2.5rem', marginBottom: 10 }}>{currentStep.icon}</div>
        <div className="font-semibold" style={{ fontSize: '1.1rem', marginBottom: 8 }}>
          {step + 1}. {currentStep.label}
        </div>
        <p className="text-secondary text-sm" style={{ lineHeight: 1.65, maxWidth: 280 }}>
          {currentStep.desc}
        </p>
        {running && currentStep.duration > 0 && (
          <div style={{
            marginTop: 14,
            fontSize: '1.6rem',
            fontFamily: 'var(--font-display)',
            color: 'var(--text-muted)',
          }}>
            {currentStep.duration - elapsed}
          </div>
        )}
      </div>

      {/* Step dots */}
      <div className="flex gap-2 justify-center mb-4">
        {STEPS.map((_, i) => (
          <div key={i} style={{
            width: 24, height: 4, borderRadius: 2,
            background: i < step
              ? 'var(--text-primary)'
              : i === step
                ? 'rgba(255,255,255,0.45)'
                : 'var(--border)',
            transition: 'all 0.3s',
          }} />
        ))}
      </div>

      {/* Controls */}
      {running ? (
        <button className="btn btn-secondary btn-full" onClick={() => setRunning(false)}>Pause</button>
      ) : step === STEPS.length - 1 ? (
        <button className="btn btn-secondary btn-full" onClick={reset}>Start Over</button>
      ) : (
        <button className="btn btn-primary btn-full" onClick={start}>
          {step === 0 ? 'Run Protocol' : 'Continue'}
        </button>
      )}

      {/* Critical warning */}
      <div className="card" style={{
        marginTop: 20,
        background: 'rgba(255,100,100,0.05)',
        border: '1px solid rgba(255,100,100,0.15)',
      }}>
        <div className="flex gap-3">
          <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>⚡</span>
          <p className="text-secondary text-sm" style={{ lineHeight: 1.65 }}>
            <strong style={{ color: 'var(--text-primary)' }}>Critical: </strong>
            Never think about your physical body lying in bed during a lucid dream. That single thought causes immediate waking — without exception.
          </p>
        </div>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  Sleep Tracker Info
//  Explains how SaA/accelerometer works, accuracy numbers,
//  and practical placement guidance.
// ─────────────────────────────────────────────────────────
function SleepTrackerInfo() {
  return (
    <div>
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="section-title mb-3">How Sleep as Android detects phases</div>
        <p className="text-secondary text-sm" style={{ lineHeight: 1.7, marginBottom: 10 }}>
          Without a bracelet, SaA uses your phone's accelerometer to detect micro-movements. During deep sleep you move very rarely (~1 movement per 5 minutes). During REM and light sleep, more (~2.6 movements). The algorithm uses this pattern — plus knowledge of typical 90-minute sleep cycles — to estimate your phase.
        </p>
        <p className="text-secondary text-sm" style={{ lineHeight: 1.7 }}>
          With a smartwatch (pulse + movement), accuracy rises significantly because REM causes a distinctive heart rate pattern that movement alone can't detect.
        </p>
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <div className="section-title mb-3">Accuracy numbers</div>
        {[
          { label: 'Smart alarm (not waking in deep sleep)', value: '96%', note: 'The alarm\'s main job — it does this well' },
          { label: 'Catching REM with audio cue signal', value: '~50%', note: 'Better than random (20%), but not precise' },
          { label: 'Smartwatch + accelerometer accuracy', value: '80–90%', note: 'Pulse data makes a large difference' },
        ].map(item => (
          <div key={item.label} style={{ marginBottom: 14 }}>
            <div className="flex items-center justify-between mb-1">
              <span className="text-secondary text-sm">{item.label}</span>
              <span style={{ fontFamily: 'var(--font-display)', fontSize: '1.1rem', color: 'var(--text-primary)' }}>
                {item.value}
              </span>
            </div>
            <p className="text-muted text-xs">{item.note}</p>
          </div>
        ))}
      </div>

      <div className="card" style={{ marginBottom: 12 }}>
        <div className="section-title mb-3">Placing your phone</div>
        <div style={{ display: 'flex', flexDirection: 'column', gap: 10 }}>
          {[
            { mode: 'Accelerometer', where: 'On the mattress, beside your shoulder/torso. Not under the pillow (heat). Not on the nightstand (too far).' },
            { mode: 'Sonar mode', where: 'On the nightstand, 20–50cm away. Lower mic (charging port end) facing toward your chest. Same height as mattress ±10cm.' },
          ].map(item => (
            <div key={item.mode} style={{ padding: '10px 14px', background: 'var(--bg-elevated)', borderRadius: 'var(--radius-md)' }}>
              <div className="font-medium text-sm mb-1">{item.mode}</div>
              <p className="text-muted text-xs" style={{ lineHeight: 1.6 }}>{item.where}</p>
            </div>
          ))}
        </div>
      </div>

      <div className="card" style={{
        background: 'rgba(255,255,255,0.03)',
        borderStyle: 'dashed',
      }}>
        <p className="text-secondary text-sm" style={{ lineHeight: 1.7 }}>
          <strong style={{ color: 'var(--text-primary)' }}>Honest take:</strong> A plain timer or accelerometer-only is enough to start your practice. SSILD and MILD don't require phase detection — they work from any waking after 4–6 hours of sleep. The smartwatch improves audio cue precision, but is not a prerequisite for lucid dreaming.
        </p>
      </div>
    </div>
  );
}

// ─────────────────────────────────────────────────────────
//  Main TechniqueDetail page
// ─────────────────────────────────────────────────────────
export default function TechniqueDetail() {
  const navigate  = useNavigate();
  const { id }    = useParams();
  const technique = TECHNIQUES.find(t => t.id === id);

  if (!technique) {
    return (
      <div className="page">
        <div style={{ paddingTop: 'env(safe-area-inset-top, 16px)' }}>
          <button
            className="btn btn-ghost btn-icon"
            style={{ marginTop: 12, marginBottom: 8 }}
            onClick={() => navigate(-1)}
          >
            <ArrowLeft size={20} />
          </button>
        </div>
        <div className="empty-state"><h3>Technique not found</h3></div>
      </div>
    );
  }

  const renderMd = (text) =>
    text.split(/(\*\*(.*?)\*\*)/).map((part, i) =>
      part.startsWith('**') && part.endsWith('**')
        ? <strong key={i} style={{ color: 'var(--text-primary)' }}>{part.slice(2, -2)}</strong>
        : part
    );

  return (
    <div className="page">
      {/* Back button */}
      <div style={{ paddingTop: 'env(safe-area-inset-top, 12px)' }}>
        <button
          className="btn btn-ghost btn-icon"
          style={{ marginTop: 12, marginBottom: 8 }}
          onClick={() => navigate(-1)}
        >
          <ArrowLeft size={20} />
        </button>
      </div>

      {/* Hero */}
      <div style={{
        background: 'var(--bg-card)',
        borderRadius: 'var(--radius-xl)',
        padding: '28px 20px',
        textAlign: 'center',
        marginBottom: 20,
        border: '1px solid var(--border)',
      }}>
        <div style={{ fontSize: '3rem', marginBottom: 12 }}>{technique.icon}</div>
        <h2 style={{ marginBottom: 8 }}>{technique.name}</h2>
        <p className="text-secondary" style={{ lineHeight: 1.6, marginBottom: 14 }}>
          {technique.details.split('\n')[0]}
        </p>
        <div className="flex justify-center gap-2" style={{ flexWrap: 'wrap' }}>
          <span className="tag">Best: {technique.bestTime}</span>
          <span className="tag">
            {'★'.repeat(technique.difficulty)}{'☆'.repeat(5 - technique.difficulty)}
          </span>
        </div>
      </div>

      {/* Nuance / extra detail */}
      {technique.details.split('\n').length > 1 && (
        <div className="card" style={{ marginBottom: 16 }}>
          {technique.details.split('\n\n').slice(1).map((para, i) => (
            <p key={i} className="text-secondary text-sm" style={{ lineHeight: 1.7, marginBottom: 8 }}>
              {renderMd(para)}
            </p>
          ))}
        </div>
      )}

      {/* Steps */}
      {technique.steps.length > 0 && (
        <div className="section">
          <div className="section-title">How to do it</div>
          {technique.steps.map((step, i) => (
            <div key={i} style={{ display: 'flex', gap: 14, marginBottom: 14 }}>
              <div style={{
                width: 26, height: 26, borderRadius: '50%',
                background: 'var(--bg-card)', border: '1px solid var(--border)',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                fontSize: '0.72rem', fontWeight: 600, color: 'var(--text-secondary)',
                flexShrink: 0, marginTop: 2,
              }}>
                {i + 1}
              </div>
              <p className="text-secondary" style={{ lineHeight: 1.65, fontSize: '0.92rem', flex: 1 }}>
                {renderMd(step)}
              </p>
            </div>
          ))}
        </div>
      )}

      {/* Interactive tool sections */}
      <div className="divider" />

      {(id === 'ssild' || id === 'ssild-timer') && (
        <div className="section">
          <div className="section-title">SSILD Timer</div>
          <SSILDTimer />
        </div>
      )}

      {id === 'reality-checks' && (
        <div className="section">
          <div className="section-title">Settings & Log</div>
          <RCSettings />
        </div>
      )}

      {id === 'wbtb' && (
        <div className="section">
          <div className="section-title">Set WBTB Alarm</div>
          <WBTBSettings />
        </div>
      )}

      {id === 'audio-cue' && (
        <div className="section">
          <div className="section-title">Training Session</div>
          <AudioCueTrainer />
        </div>
      )}

      {id === 'stabilisation' && (
        <div className="section">
          <div className="section-title">Practice the Protocol</div>
          <StabilisationGuide />
        </div>
      )}

      {id === 'sleep-tracker' && (
        <div className="section">
          <SleepTrackerInfo />
        </div>
      )}
    </div>
  );
}
