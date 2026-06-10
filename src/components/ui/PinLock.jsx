import React, { useState } from 'react';
import { Delete } from 'lucide-react';

const PIN_KEY = 'vitsleep_pin';

export function getPIN()      { return localStorage.getItem(PIN_KEY) || null; }
export function savePIN(pin)  { localStorage.setItem(PIN_KEY, pin); }
export function clearPIN()    { localStorage.removeItem(PIN_KEY); }
export function hasPIN()      { return !!localStorage.getItem(PIN_KEY); }

/* ── Dot indicator ─────────────────────────────── */
function Dot({ filled }) {
  return (
    <div
      style={{
        width: 14,
        height: 14,
        borderRadius: '50%',
        background: filled ? 'var(--text-primary)' : 'transparent',
        border: '2px solid ' + (filled ? 'var(--text-primary)' : 'var(--border-bright)'),
        transition: 'all 0.15s var(--ease-dream)',
      }}
    />
  );
}

/* ── Numeric key ───────────────────────────────── */
function NumKey({ label, onClick }) {
  return (
    <button
      onClick={onClick}
      style={{
        background: 'none',
        border: 'none',
        color: 'var(--text-primary)',
        fontSize: '1.6rem',
        fontFamily: 'var(--font-display)',
        cursor: 'pointer',
        width: 72,
        height: 72,
        borderRadius: '50%',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        transition: 'background 0.1s',
        lineHeight: 1,
      }}
      onPointerDown={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
      onPointerUp={e => (e.currentTarget.style.background = 'none')}
      onPointerLeave={e => (e.currentTarget.style.background = 'none')}
    >
      {label}
    </button>
  );
}

/* ── PinPad ────────────────────────────────────────
   mode: 'unlock' | 'set' | 'change'
*/
export function PinPad({ mode = 'unlock', onSuccess, onCancel }) {
  // step: 'unlock' → verify old PIN
  //       'enter'  → choose new PIN
  //       'confirm'→ repeat new PIN
  const initialStep = mode === 'change' ? 'unlock' : mode === 'set' ? 'enter' : 'unlock';

  const [step, setStep] = useState(initialStep);
  const [pin, setPin] = useState('');       // new PIN being entered
  const [confirm, setConfirm] = useState(''); // confirmation of new PIN
  const [error, setError] = useState('');
  const [shake, setShake] = useState(false);

  const triggerShake = () => {
    setShake(true);
    setTimeout(() => setShake(false), 500);
  };

  // Which string are we currently building?
  const current = step === 'confirm' ? confirm : pin;
  const setCurrent = step === 'confirm' ? setConfirm : setPin;

  const handleDigit = (d) => {
    setError('');
    if (current.length >= 4) return;

    const next = current + d;
    setCurrent(next);

    if (next.length === 4) {
      // Small delay so the last dot animates before action
      setTimeout(() => evaluate(next), 100);
    }
  };

  const handleDelete = () => {
    setError('');
    setCurrent(c => c.slice(0, -1));
  };

  const evaluate = (value) => {
    if (step === 'unlock') {
      // Verifying existing PIN (unlock app or change-flow step 1)
      if (value === getPIN()) {
        if (mode === 'unlock') {
          onSuccess?.();
        } else {
          // mode === 'change': verified old PIN, now enter new one
          setPin('');
          setStep('enter');
        }
      } else {
        setError('Wrong PIN');
        triggerShake();
        setTimeout(() => setPin(''), 600);
      }

    } else if (step === 'enter') {
      // First entry of new PIN → go to confirm
      setStep('confirm');
      setConfirm('');

    } else if (step === 'confirm') {
      // Comparing confirmation to new PIN
      if (value === pin) {
        savePIN(pin);
        onSuccess?.();
      } else {
        setError("PINs don't match — try again");
        triggerShake();
        setTimeout(() => {
          setConfirm('');
          setPin('');
          setStep('enter');
        }, 700);
      }
    }
  };

  const displayValue = step === 'confirm' ? confirm : pin;

  const title = {
    unlock: 'Enter PIN',
    set:    step === 'confirm' ? 'Confirm PIN'   : 'Choose a PIN',
    change: step === 'unlock'  ? 'Enter current PIN'
           : step === 'enter'  ? 'Choose new PIN'
           :                     'Confirm new PIN',
  }[mode] ?? 'Enter PIN';

  return (
    <div
      style={{
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        padding: '32px 24px 28px',
      }}
    >
      <h3 style={{ marginBottom: 8, textAlign: 'center' }}>{title}</h3>

      {error && (
        <p style={{ color: '#ff7070', fontSize: '0.85rem', marginBottom: 8, textAlign: 'center' }}>
          {error}
        </p>
      )}

      {/* 4 dots */}
      <div
        className="flex gap-4"
        style={{
          margin: '16px 0 36px',
          animation: shake ? 'vs-shake 0.5s var(--ease-soft)' : 'none',
        }}
      >
        {[0, 1, 2, 3].map(i => (
          <Dot key={i} filled={displayValue.length > i} />
        ))}
      </div>

      {/* Keypad grid */}
      <div
        style={{
          display: 'grid',
          gridTemplateColumns: 'repeat(3, 1fr)',
          gap: 8,
          width: 252,
        }}
      >
        {[1, 2, 3, 4, 5, 6, 7, 8, 9].map(n => (
          <div key={n} style={{ display: 'flex', justifyContent: 'center' }}>
            <NumKey label={String(n)} onClick={() => handleDigit(String(n))} />
          </div>
        ))}

        {/* Bottom row: Cancel | 0 | Delete */}
        <div style={{ display: 'flex', justifyContent: 'center', alignItems: 'center' }}>
          {onCancel && (
            <button
              onClick={onCancel}
              style={{
                background: 'none',
                border: 'none',
                color: 'var(--text-muted)',
                cursor: 'pointer',
                fontSize: '0.85rem',
                fontFamily: 'var(--font-body)',
                padding: '12px 8px',
              }}
            >
              Cancel
            </button>
          )}
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <NumKey label="0" onClick={() => handleDigit('0')} />
        </div>

        <div style={{ display: 'flex', justifyContent: 'center' }}>
          <button
            onClick={handleDelete}
            style={{
              background: 'none',
              border: 'none',
              color: 'var(--text-secondary)',
              cursor: 'pointer',
              width: 72,
              height: 72,
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              borderRadius: '50%',
            }}
            onPointerDown={e => (e.currentTarget.style.background = 'rgba(255,255,255,0.08)')}
            onPointerUp={e => (e.currentTarget.style.background = 'none')}
            onPointerLeave={e => (e.currentTarget.style.background = 'none')}
          >
            <Delete size={20} />
          </button>
        </div>
      </div>

      <style>{`
        @keyframes vs-shake {
          0%, 100% { transform: translateX(0); }
          20%       { transform: translateX(-8px); }
          40%       { transform: translateX(8px); }
          60%       { transform: translateX(-5px); }
          80%       { transform: translateX(5px); }
        }
      `}</style>
    </div>
  );
}

/* ── Full-screen lock overlay ──────────────────── */
export function LockScreen({ onUnlock }) {
  return (
    <div
      style={{
        position: 'fixed',
        inset: 0,
        background: 'var(--bg-primary)',
        zIndex: 999,
        display: 'flex',
        flexDirection: 'column',
        alignItems: 'center',
        justifyContent: 'center',
      }}
    >
      <div style={{ fontSize: '2.8rem', marginBottom: 6 }}>🌙</div>
      <p className="text-muted text-sm" style={{ marginBottom: 24 }}>VitSleep is locked</p>
      <PinPad mode="unlock" onSuccess={onUnlock} />
    </div>
  );
}
