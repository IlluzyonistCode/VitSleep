import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ArrowLeft, ChevronRight, Check, Lock, Star } from 'lucide-react';
import { LESSONS } from '../data/content.js';
import { useOnboardingStore, useSettingsStore, useToastStore } from '../store/index.js';

function renderMd(text) {
  return text.split(/(\*\*.*?\*\*)/g).map((p, i) =>
    p.startsWith('**') && p.endsWith('**')
      ? <strong key={i}>{p.slice(2, -2)}</strong>
      : p
  );
}

function DayCard({ lesson, unlocked, complete, onClick }) {
  return (
    <div
      className="card"
      onClick={unlocked ? onClick : undefined}
      style={{
        marginBottom: 10,
        cursor: unlocked ? 'pointer' : 'default',
        opacity: unlocked ? 1 : 0.4,
        position: 'relative',
        overflow: 'hidden',
        paddingLeft: complete ? 20 : 16,
      }}
    >
      {complete && (
        <div style={{
          position: 'absolute', left: 0, top: 0, bottom: 0, width: 3,
          background: 'var(--text-primary)',
        }} />
      )}
      <div className="flex items-center gap-3">
        <div style={{
          width: 48, height: 48, borderRadius: 'var(--radius-md)',
          background: 'var(--bg-elevated)',
          border: `1px solid ${complete ? 'rgba(255,255,255,0.18)' : 'var(--border)'}`,
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: complete ? '1.1rem' : '1.5rem', flexShrink: 0,
        }}>
          {complete ? '✓' : unlocked ? lesson.icon : <Lock size={16} color="var(--text-muted)" />}
        </div>
        <div style={{ flex: 1 }}>
          <div className="flex items-center gap-2 mb-1">
            <span className="text-muted text-xs" style={{ letterSpacing: '0.06em' }}>DAY {lesson.day}</span>
            {complete && <span className="tag" style={{ padding: '2px 8px', fontSize: '0.68rem' }}>Done</span>}
          </div>
          <div className="font-semibold" style={{ fontSize: '0.95rem' }}>{lesson.title}</div>
          <div className="text-secondary text-sm">{lesson.subtitle}</div>
        </div>
        {unlocked && <ChevronRight size={16} color="var(--text-muted)" />}
      </div>
    </div>
  );
}

function LessonView({ lesson, onBack, onComplete, done }) {
  const [localDone, setLocalDone] = useState(done);
  const navigate = useNavigate();

  const handleMark = async () => {
    await onComplete(lesson.day);
    setLocalDone(true);
  };

  return (
    <div className="anim-slide">
      <div className="flex items-center gap-3" style={{ paddingTop: 12, marginBottom: 20 }}>
        <button className="btn btn-ghost btn-icon" onClick={onBack}>
          <ArrowLeft size={20} />
        </button>
        <div>
          <span className="text-muted text-xs" style={{ letterSpacing: '0.06em' }}>DAY {lesson.day} OF 7</span>
          <div className="font-semibold">{lesson.title}</div>
        </div>
      </div>

      {/* Hero block */}
      <div style={{
        textAlign: 'center', padding: '28px 16px',
        background: 'var(--bg-card)', borderRadius: 'var(--radius-xl)',
        border: '1px solid var(--border)', marginBottom: 16,
      }}>
        <div style={{ fontSize: '3.2rem', marginBottom: 10 }}>{lesson.icon}</div>
        <h2 style={{ marginBottom: 6 }}>{lesson.title}</h2>
        <p className="text-secondary" style={{ lineHeight: 1.5 }}>{lesson.subtitle}</p>
      </div>

      {/* Theory */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="section-title mb-3">Why This Matters</div>
        {lesson.theory.split('\n\n').map((para, i) => (
          <p key={i} className="text-secondary" style={{ lineHeight: 1.72, marginBottom: 10, fontSize: '0.93rem' }}>
            {renderMd(para)}
          </p>
        ))}
      </div>

      {/* Technique steps */}
      <div className="card" style={{ marginBottom: 12 }}>
        <div className="section-title mb-3">Technique — {lesson.technique.name}</div>
        {lesson.technique.steps.map((step, i) => (
          <div key={i} style={{ display: 'flex', gap: 12, marginBottom: 12, alignItems: 'flex-start' }}>
            <div style={{
              width: 24, height: 24, borderRadius: '50%',
              background: 'var(--bg-elevated)', border: '1px solid var(--border)',
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              fontSize: '0.7rem', fontWeight: 700, color: 'var(--text-secondary)',
              flexShrink: 0, marginTop: 2,
            }}>{i + 1}</div>
            <p className="text-secondary" style={{ lineHeight: 1.65, fontSize: '0.9rem', flex: 1 }}>
              {renderMd(step)}
            </p>
          </div>
        ))}
      </div>

      {/* Tip */}
      <div style={{
        display: 'flex', gap: 12, padding: '14px 16px', marginBottom: 16,
        background: 'rgba(255,255,255,0.025)',
        border: '1px dashed var(--border-bright)',
        borderRadius: 'var(--radius-md)',
      }}>
        <span style={{ fontSize: '1.1rem', flexShrink: 0 }}>💡</span>
        <p className="text-secondary text-sm" style={{ lineHeight: 1.65 }}>
          <strong style={{ color: 'var(--text-primary)' }}>Tip: </strong>{lesson.tip}
        </p>
      </div>

      {/* Task */}
      <div className="card" style={{
        marginBottom: 20,
        border: localDone ? '1px solid rgba(255,255,255,0.18)' : '1px solid var(--border)',
      }}>
        <div className="section-title mb-2">Tonight's Task</div>
        <p className="text-secondary" style={{ lineHeight: 1.65, marginBottom: 14, fontSize: '0.93rem' }}>
          {lesson.task.text}
        </p>

        {/* Shortcut buttons */}
        {!localDone && lesson.task.type === 'journal' && (
          <button className="btn btn-secondary btn-full" style={{ marginBottom: 10 }}
            onClick={() => navigate('/dream/new')}>
            ✍️ Open Dream Journal
          </button>
        )}
        {!localDone && lesson.task.type === 'reality_checks' && (
          <button className="btn btn-secondary btn-full" style={{ marginBottom: 10 }}
            onClick={() => navigate('/techniques/reality-checks')}>
            🤚 Set Up Reality Checks
          </button>
        )}
        {!localDone && lesson.task.type === 'alarm' && (
          <button className="btn btn-secondary btn-full" style={{ marginBottom: 10 }}
            onClick={() => navigate('/techniques/wbtb')}>
            ⏰ Set WBTB Alarm
          </button>
        )}

        <button
          className={`btn btn-full ${localDone ? 'btn-secondary' : 'btn-primary'}`}
          onClick={localDone ? undefined : handleMark}
          style={{ cursor: localDone ? 'default' : 'pointer' }}
        >
          {localDone ? <><Check size={16} /> Completed</> : 'Mark as Done'}
        </button>
      </div>
    </div>
  );
}

export default function OnboardingPage() {
  const navigate = useNavigate();
  const { completeTask, isDayComplete, isDayUnlocked } = useOnboardingStore();
  const { set: setSettings, onboardingComplete } = useSettingsStore();
  const { show } = useToastStore();
  const [selectedDay, setSelectedDay] = useState(null);

  const completedCount = LESSONS.filter(l => isDayComplete(l.day)).length;
  const allDone = completedCount === LESSONS.length;

  const handleComplete = async (day) => {
    await completeTask(day);
    const next = day + 1;
    if (next <= 7) setSettings({ currentOnboardingDay: next });
    else setSettings({ onboardingComplete: true });
    show(day === 7 ? '🎉 All 7 days complete! You are a dreamer.' : `Day ${day} done — Day ${next} unlocked ✓`);
  };

  /* ─ Detail view ─ */
  if (selectedDay !== null) {
    const lesson = LESSONS.find(l => l.day === selectedDay);
    return (
      <div className="page">
        <LessonView
          lesson={lesson}
          onBack={() => setSelectedDay(null)}
          onComplete={handleComplete}
          done={isDayComplete(selectedDay)}
        />
      </div>
    );
  }

  /* ─ List view ─ */
  return (
    <div className="page">
      <div className="page-header">
        <button className="btn btn-ghost btn-icon" style={{ marginBottom: 16 }} onClick={() => navigate(-1)}>
          <ArrowLeft size={20} />
        </button>
        <h1>7-Day Journey</h1>
        <p className="text-secondary mt-2" style={{ lineHeight: 1.55, fontSize: '0.95rem' }}>
          A structured program to your first lucid dream — one night at a time.
        </p>
      </div>

      {/* Progress bar */}
      <div className="card" style={{ marginBottom: 20 }}>
        <div className="flex justify-between mb-2">
          <span className="font-semibold">Progress</span>
          <span className="text-secondary text-sm">{completedCount} / 7 days</span>
        </div>
        <div style={{ height: 6, background: 'var(--border)', borderRadius: 3, overflow: 'hidden' }}>
          <div style={{
            height: '100%',
            width: `${(completedCount / 7) * 100}%`,
            background: allDone
              ? 'linear-gradient(90deg, rgba(160,160,255,0.9), #fff)'
              : 'var(--text-primary)',
            borderRadius: 3,
            transition: 'width 0.6s var(--ease-dream)',
          }} />
        </div>
        {allDone && (
          <p className="text-secondary text-sm" style={{ marginTop: 10, textAlign: 'center' }}>
            🎉 Program complete. Keep dreaming.
          </p>
        )}
      </div>

      {/* Day cards */}
      <div className="anim-fade">
        {LESSONS.map(l => (
          <DayCard
            key={l.day}
            lesson={l}
            unlocked={isDayUnlocked(l.day)}
            complete={isDayComplete(l.day)}
            onClick={() => setSelectedDay(l.day)}
          />
        ))}
      </div>

      {/* Footer note */}
      <div className="card" style={{ marginTop: 8, marginBottom: 20, borderStyle: 'dashed' }}>
        <div className="flex gap-3 items-start">
          <Star size={15} color="var(--text-muted)" style={{ flexShrink: 0, marginTop: 2 }} />
          <p className="text-muted text-sm" style={{ lineHeight: 1.65 }}>
            Complete each day's task before unlocking the next. The habit-building is the technique — don't skip it.
          </p>
        </div>
      </div>
    </div>
  );
}
