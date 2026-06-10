import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import {
  saveDream, getAllDreams, deleteDream as dbDeleteDream,
  saveRealityCheck, getRealityChecksByDate, getAllRealityChecks,
  getSetting, setSetting, getAllSettings,
  getAllOnboardingProgress, setOnboardingDay
} from '../utils/db.js';

// ── Helpers ──────────────────────────────────
function uuid() {
  return crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).slice(2) + Date.now().toString(36);
}

function todayStr() {
  return new Date().toISOString().split('T')[0];
}

// ── Dream Store ──────────────────────────────
export const useDreamStore = create((set, get) => ({
  dreams: [],
  loading: true,

  loadDreams: async () => {
    const dreams = await getAllDreams();
    set({ dreams: dreams.reverse(), loading: false });
  },

  addDream: async (dreamData) => {
    const dream = {
      id: uuid(),
      createdAt: new Date().toISOString(),
      updatedAt: new Date().toISOString(),
      date: new Date().toISOString(),
      lucidityLevel: 0,
      mood: 0.5,
      tags: [],
      dreamSigns: [],
      characters: [],
      locations: [],
      isFavorite: false,
      aiInterpretation: null,
      ...dreamData,
    };
    await saveDream(dream);
    set(s => ({ dreams: [dream, ...s.dreams] }));
    return dream;
  },

  updateDream: async (id, updates) => {
    const dreams = get().dreams;
    const idx = dreams.findIndex(d => d.id === id);
    if (idx === -1) return;
    const updated = { ...dreams[idx], ...updates, updatedAt: new Date().toISOString() };
    await saveDream(updated);
    const next = [...dreams];
    next[idx] = updated;
    set({ dreams: next });
    return updated;
  },

  deleteDream: async (id) => {
    await dbDeleteDream(id);
    set(s => ({ dreams: s.dreams.filter(d => d.id !== id) }));
  },

  toggleFavorite: async (id) => {
    const dream = get().dreams.find(d => d.id === id);
    if (!dream) return;
    await get().updateDream(id, { isFavorite: !dream.isFavorite });
  },

  getDreamById: (id) => get().dreams.find(d => d.id === id),

  searchDreams: (query) => {
    if (!query.trim()) return get().dreams;
    const q = query.toLowerCase();
    return get().dreams.filter(d =>
      d.title?.toLowerCase().includes(q) ||
      d.content?.toLowerCase().includes(q) ||
      d.tags?.some(t => t.toLowerCase().includes(q)) ||
      d.dreamSigns?.some(s => s.toLowerCase().includes(q))
    );
  },

  // Stats computed
  getStats: () => {
    const dreams = get().dreams;
    const lucidDreams = dreams.filter(d => d.lucidityLevel >= 2);
    const today = todayStr();

    // Streak: count consecutive days with dreams going backwards from
    // the most recent dream date (not necessarily today)
    let streak = 0;
    if (dreams.length > 0) {
      const sorted = [...dreams].sort((a, b) =>
        new Date(b.date) - new Date(a.date)
      );
      // Start from the date of the most recent dream
      let cursor = new Date(sorted[0].date);
      cursor.setHours(0, 0, 0, 0);

      while (true) {
        const ds = cursor.toISOString().split('T')[0];
        const hasDream = dreams.some(d => d.date?.startsWith(ds));
        if (hasDream) {
          streak++;
          cursor.setDate(cursor.getDate() - 1);
        } else {
          break;
        }
      }
    }

    return {
      total: dreams.length,
      lucid: lucidDreams.length,
      streak,
      todayCount: dreams.filter(d => d.date?.startsWith(today)).length,
      lucidPercent: dreams.length
        ? Math.round((lucidDreams.length / dreams.length) * 100)
        : 0,
    };
  },
}));

// ── Reality Check Store ───────────────────────
export const useRCStore = create((set, get) => ({
  todayChecks: [],
  allChecks: [],

  loadToday: async () => {
    const checks = await getRealityChecksByDate(todayStr());
    set({ todayChecks: checks });
  },

  loadAll: async () => {
    const all = await getAllRealityChecks();
    set({ allChecks: all });
  },

  addCheck: async () => {
    const check = {
      id: uuid(),
      date: new Date().toISOString(),
    };
    await saveRealityCheck(check);
    set(s => ({ todayChecks: [...s.todayChecks, check], allChecks: [...s.allChecks, check] }));
  },

  todayCount: () => get().todayChecks.length,
}));

// ── Settings Store ────────────────────────────
export const useSettingsStore = create(
  persist(
    (set, get) => ({
      username: 'Dreamer',
      rcEnabled: false,
      rcInterval: 60, // minutes
      rcStart: '09:00',
      rcEnd: '21:00',
      morningReminder: false,
      morningTime: '07:00',
      eveningReminder: false,
      eveningTime: '22:00',
      openRouterKey: '',
      aiModel: 'anthropic/claude-3.5-sonnet',
      autoAnalyze: false,
      onboardingComplete: false,
      currentOnboardingDay: 1,

      set: (updates) => set(updates),
    }),
    { name: 'vitsleep-settings' }
  )
);

// ── Onboarding Store ──────────────────────────
export const useOnboardingStore = create((set, get) => ({
  progress: {}, // { 1: { taskDone: true, ... }, 2: { ... } }

  load: async () => {
    const rows = await getAllOnboardingProgress();
    const progress = {};
    rows.forEach(r => { progress[r.day] = r; });
    set({ progress });
  },

  completeTask: async (day) => {
    await setOnboardingDay(day, { taskDone: true, completedAt: new Date().toISOString() });
    set(s => ({ progress: { ...s.progress, [day]: { ...s.progress[day], taskDone: true } } }));
  },

  isDayComplete: (day) => !!get().progress[day]?.taskDone,
  isDayUnlocked: (day) => day === 1 || !!get().progress[day - 1]?.taskDone,
}));

// ── Toast Store ───────────────────────────────
export const useToastStore = create((set) => ({
  toasts: [],
  show: (msg, duration = 2500) => {
    const id = uuid();
    set(s => ({ toasts: [...s.toasts, { id, msg }] }));
    setTimeout(() => set(s => ({ toasts: s.toasts.filter(t => t.id !== id) })), duration);
  }
}));
