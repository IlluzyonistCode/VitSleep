import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { ChevronRight, Eye, EyeOff, ExternalLink } from 'lucide-react';
import { useSettingsStore, useDreamStore, useToastStore } from '../store/index.js';
import { PinPad, hasPIN, clearPIN } from '../components/ui/PinLock.jsx';

function SettingRow({ icon, label, sublabel, right, onClick, danger }) {
  return (
    <div
      className="flex items-center gap-3"
      style={{
        padding: '14px 0',
        borderBottom: '1px solid var(--border)',
        cursor: onClick ? 'pointer' : 'default',
      }}
      onClick={onClick}
    >
      {icon && (
        <div style={{
          width: 36, height: 36, borderRadius: 10,
          background: danger ? 'rgba(255,80,80,0.12)' : 'var(--bg-elevated)',
          display: 'flex', alignItems: 'center', justifyContent: 'center',
          fontSize: '1rem', flexShrink: 0,
        }}>
          {icon}
        </div>
      )}
      <div style={{ flex: 1, overflow: 'hidden' }}>
        <div style={{ fontSize: '0.92rem', fontWeight: 500, color: danger ? '#ff7070' : 'var(--text-primary)' }}>
          {label}
        </div>
        {sublabel && (
          <div className="text-muted text-xs" style={{ marginTop: 2 }}>{sublabel}</div>
        )}
      </div>
      {right}
    </div>
  );
}

function Section({ title, children }) {
  return (
    <div style={{ marginBottom: 28 }}>
      <div className="section-title">{title}</div>
      <div className="card" style={{ padding: '0 16px' }}>{children}</div>
    </div>
  );
}

export default function SettingsPage() {
  const navigate = useNavigate();
  const s = useSettingsStore();
  const { dreams, loadDreams } = useDreamStore();
  const { show } = useToastStore();

  const [showKey, setShowKey]         = useState(false);
  const [clearConfirm, setClearConfirm] = useState(false);
  const [pinModal, setPinModal]       = useState(null);
  const [pinEnabled, setPinEnabled]   = useState(hasPIN());
  const [importing, setImporting]     = useState(false);

  const handleExport = () => {
    const data = {
      version: '1.1',
      exportedAt: new Date().toISOString(),
      dreams,
      settings: { username: s.username, aiModel: s.aiModel },
    };
    const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' });
    const url  = URL.createObjectURL(blob);
    const a    = document.createElement('a');
    a.href     = url;
    a.download = `vitsleep-${new Date().toISOString().split('T')[0]}.json`;
    a.click();
    URL.revokeObjectURL(url);
    show('Journal exported ✓');
  };

  const handleImport = () => {
    const input    = document.createElement('input');
    input.type     = 'file';
    input.accept   = '.json';
    input.onchange = async (e) => {
      const file = e.target.files[0];
      if (!file) return;
      setImporting(true);
      try {
        const text = await file.text();
        const data = JSON.parse(text);
        if (!data.dreams || !Array.isArray(data.dreams)) {
          show('Invalid backup file — no dreams found');
          return;
        }
        // Import each dream to IndexedDB
        const { saveDream } = await import('../utils/db.js');
        let imported = 0;
        for (const dream of data.dreams) {
          if (dream.id && dream.date) {
            await saveDream(dream);
            imported++;
          }
        }
        await loadDreams();
        show(`Imported ${imported} dream${imported !== 1 ? 's' : ''} ✓`);
      } catch (err) {
        show('Import failed — file may be corrupted');
      } finally {
        setImporting(false);
      }
    };
    input.click();
  };

  const handleClearAll = async () => {
    try {
      const { getDB } = await import('../utils/db.js');
      const db = await getDB();
      const tx = db.transaction('dreams', 'readwrite');
      await tx.objectStore('dreams').clear();
      await tx.done;
      await loadDreams();
      show('All dreams deleted');
      setClearConfirm(false);
    } catch {
      show('Could not clear dreams — try again');
    }
  };

  return (
    <div className="page">
      <div className="page-header"><h1>Settings</h1></div>

      {/* Security */}
      <Section title="Security">
        <SettingRow
          icon="🔒"
          label="PIN Protection"
          sublabel={pinEnabled ? 'App is locked — tap to change or remove' : 'Lock the app with a 4-digit PIN'}
          right={
            <div className="flex items-center gap-2">
              <label className="toggle" onClick={e => e.stopPropagation()}>
                <input
                  type="checkbox"
                  checked={pinEnabled}
                  onChange={e => {
                    if (e.target.checked) setPinModal('set');
                    else { clearPIN(); setPinEnabled(false); show('PIN removed'); }
                  }}
                />
                <span className="toggle-slider" />
              </label>
              {pinEnabled && <ChevronRight size={16} color="var(--text-muted)" />}
            </div>
          }
          onClick={pinEnabled ? () => setPinModal('change') : undefined}
        />
      </Section>

      {/* PIN Modal */}
      {pinModal && (
        <div className="modal-overlay" onClick={() => setPinModal(null)}>
          <div className="modal-sheet" onClick={e => e.stopPropagation()}>
            <div className="modal-handle" />
            <PinPad
              mode={pinModal}
              onSuccess={() => { setPinModal(null); setPinEnabled(true); show(pinModal === 'set' ? 'PIN set ✓' : 'PIN changed ✓'); }}
              onCancel={() => setPinModal(null)}
            />
          </div>
        </div>
      )}

      {/* Profile */}
      <Section title="Profile">
        <div style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
          <label className="input-label">Display Name</label>
          <input
            className="input"
            style={{ marginTop: 6 }}
            value={s.username}
            onChange={e => s.set({ username: e.target.value })}
            placeholder="How should VitSleep call you?"
          />
        </div>
        <SettingRow
          icon="🎓"
          label="7-Day Program"
          sublabel={s.onboardingComplete ? 'Completed' : `Day ${s.currentOnboardingDay || 1} of 7`}
          right={<ChevronRight size={16} color="var(--text-muted)" />}
          onClick={() => navigate('/onboarding')}
        />
      </Section>

      {/* Notifications */}
      <Section title="Notifications">
        <SettingRow
          icon="🌅"
          label="Morning Reminder"
          sublabel={s.morningReminder ? `Daily at ${s.morningTime}` : 'Off — record dreams right after waking'}
          right={
            <label className="toggle" onClick={e => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={s.morningReminder}
                onChange={e => {
                  if (e.target.checked && 'Notification' in window) {
                    Notification.requestPermission().then(r => {
                      if (r === 'granted') s.set({ morningReminder: true });
                      else show('Enable notifications in browser settings');
                    });
                  } else {
                    s.set({ morningReminder: e.target.checked });
                  }
                }}
              />
              <span className="toggle-slider" />
            </label>
          }
        />
        {s.morningReminder && (
          <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <input type="time" className="input" value={s.morningTime}
              onChange={e => s.set({ morningTime: e.target.value })} />
          </div>
        )}
        <SettingRow
          icon="🌙"
          label="Evening Reminder"
          sublabel={s.eveningReminder ? `Daily at ${s.eveningTime}` : 'Off — remind yourself to review dreams'}
          right={
            <label className="toggle" onClick={e => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={s.eveningReminder}
                onChange={e => s.set({ eveningReminder: e.target.checked })}
              />
              <span className="toggle-slider" />
            </label>
          }
        />
        {s.eveningReminder && (
          <div style={{ padding: '10px 0', borderBottom: '1px solid var(--border)' }}>
            <input type="time" className="input" value={s.eveningTime}
              onChange={e => s.set({ eveningTime: e.target.value })} />
          </div>
        )}
        <SettingRow
          icon="🤚"
          label="Reality Check Reminders"
          sublabel="Configure frequency & schedule"
          right={<ChevronRight size={16} color="var(--text-muted)" />}
          onClick={() => navigate('/techniques/reality-checks')}
        />
      </Section>

      {/* AI */}
      <Section title="AI Analysis">
        <div style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
          <label className="input-label">OpenRouter API Key</label>
          <div style={{ position: 'relative', marginTop: 6 }}>
            <input
              className="input"
              type={showKey ? 'text' : 'password'}
              style={{ paddingRight: 44 }}
              value={s.openRouterKey}
              onChange={e => s.set({ openRouterKey: e.target.value })}
              placeholder="sk-or-v1-…"
              autoComplete="off"
            />
            <button
              onClick={() => setShowKey(v => !v)}
              style={{
                position: 'absolute', right: 12, top: '50%',
                transform: 'translateY(-50%)',
                background: 'none', border: 'none', cursor: 'pointer',
                color: 'var(--text-muted)', display: 'flex', alignItems: 'center',
              }}
            >
              {showKey ? <EyeOff size={16} /> : <Eye size={16} />}
            </button>
          </div>
          <a
            href="https://openrouter.ai/keys"
            target="_blank"
            rel="noopener noreferrer"
            style={{ display: 'inline-flex', alignItems: 'center', gap: 4, marginTop: 8, color: 'var(--text-muted)', fontSize: '0.75rem', textDecoration: 'none' }}
          >
            Get a free key at openrouter.ai <ExternalLink size={11} />
          </a>
        </div>
        <div style={{ padding: '14px 0', borderBottom: '1px solid var(--border)' }}>
          <label className="input-label">Model</label>
          <select
            className="select"
            style={{ marginTop: 6 }}
            value={s.aiModel}
            onChange={e => s.set({ aiModel: e.target.value })}
          >
            <option value="anthropic/claude-3.5-sonnet">Claude 3.5 Sonnet (Recommended)</option>
            <option value="anthropic/claude-3-haiku">Claude 3 Haiku (Fast &amp; cheap)</option>
            <option value="google/gemini-flash-1.5">Gemini Flash 1.5 (Budget)</option>
            <option value="openai/gpt-4o-mini">GPT-4o Mini</option>
          </select>
        </div>
        <SettingRow
          icon="⚡"
          label="Auto-analyze new dreams"
          sublabel="Generate AI interpretation when a dream is saved"
          right={
            <label className="toggle" onClick={e => e.stopPropagation()}>
              <input
                type="checkbox"
                checked={s.autoAnalyze}
                onChange={e => s.set({ autoAnalyze: e.target.checked })}
              />
              <span className="toggle-slider" />
            </label>
          }
        />
      </Section>

      {/* Data */}
      <Section title="Data">
        <SettingRow
          icon="📤"
          label="Export Journal"
          sublabel={`${dreams.length} dream${dreams.length !== 1 ? 's' : ''} — saves as JSON`}
          right={<ChevronRight size={16} color="var(--text-muted)" />}
          onClick={handleExport}
        />
        <SettingRow
          icon="📥"
          label="Import Data"
          sublabel={importing ? 'Importing…' : 'Restore dreams from a VitSleep backup'}
          right={<ChevronRight size={16} color="var(--text-muted)" />}
          onClick={importing ? undefined : handleImport}
        />
      </Section>

      {/* About */}
      <Section title="About">
        <SettingRow icon="🌙" label="VitSleep" sublabel="Version 1.0.0" />
        <SettingRow icon="🔒" label="Privacy first" sublabel="All data stored locally on your device. No accounts, no tracking." />
        <SettingRow icon="✨" label="Based on" sublabel="Oniri & Lucidity — reimagined, free forever" />
      </Section>

      {/* Danger */}
      <Section title="Danger Zone">
        {!clearConfirm ? (
          <SettingRow
            icon="🗑️"
            label="Clear All Dreams"
            sublabel={`Permanently delete all ${dreams.length} entries`}
            right={<ChevronRight size={16} color="#ff7070" />}
            onClick={() => setClearConfirm(true)}
            danger
          />
        ) : (
          <div style={{ padding: '16px 0' }}>
            <p className="text-secondary text-sm" style={{ marginBottom: 14, lineHeight: 1.6 }}>
              This will permanently erase all {dreams.length} dream entries and cannot be undone.
            </p>
            <div className="flex gap-3">
              <button className="btn btn-secondary btn-full" onClick={() => setClearConfirm(false)}>Cancel</button>
              <button className="btn btn-danger btn-full" onClick={handleClearAll}>
                Delete All
              </button>
            </div>
          </div>
        )}
      </Section>
    </div>
  );
}
