import { openDB } from 'idb';

const DB_NAME = 'vitsleep_db';
const DB_VERSION = 1;

let dbPromise = null;

export function getDB() {
  if (!dbPromise) {
    dbPromise = openDB(DB_NAME, DB_VERSION, {
      upgrade(db) {
        // Dreams store
        if (!db.objectStoreNames.contains('dreams')) {
          const dreamsStore = db.createObjectStore('dreams', { keyPath: 'id' });
          dreamsStore.createIndex('date', 'date');
          dreamsStore.createIndex('lucidityLevel', 'lucidityLevel');
          dreamsStore.createIndex('isFavorite', 'isFavorite');
        }
        // Reality checks store
        if (!db.objectStoreNames.contains('reality_checks')) {
          const rcStore = db.createObjectStore('reality_checks', { keyPath: 'id' });
          rcStore.createIndex('date', 'date');
        }
        // Settings store
        if (!db.objectStoreNames.contains('settings')) {
          db.createObjectStore('settings', { keyPath: 'key' });
        }
        // Achievements store
        if (!db.objectStoreNames.contains('achievements')) {
          db.createObjectStore('achievements', { keyPath: 'id' });
        }
        // Onboarding progress
        if (!db.objectStoreNames.contains('onboarding')) {
          db.createObjectStore('onboarding', { keyPath: 'day' });
        }
      }
    });
  }
  return dbPromise;
}

// ── Dreams ──────────────────────────────────
export async function saveDream(dream) {
  const db = await getDB();
  await db.put('dreams', dream);
}

export async function getDream(id) {
  const db = await getDB();
  return db.get('dreams', id);
}

export async function getAllDreams() {
  const db = await getDB();
  return db.getAllFromIndex('dreams', 'date');
}

export async function deleteDream(id) {
  const db = await getDB();
  await db.delete('dreams', id);
}

// ── Reality Checks ──────────────────────────
export async function saveRealityCheck(check) {
  const db = await getDB();
  await db.put('reality_checks', check);
}

export async function getRealityChecksByDate(dateStr) {
  const db = await getDB();
  const all = await db.getAll('reality_checks');
  return all.filter(c => c.date.startsWith(dateStr));
}

export async function getAllRealityChecks() {
  const db = await getDB();
  return db.getAll('reality_checks');
}

// ── Settings ────────────────────────────────
export async function getSetting(key) {
  const db = await getDB();
  const row = await db.get('settings', key);
  return row ? row.value : null;
}

export async function setSetting(key, value) {
  const db = await getDB();
  await db.put('settings', { key, value });
}

export async function getAllSettings() {
  const db = await getDB();
  const all = await db.getAll('settings');
  return Object.fromEntries(all.map(s => [s.key, s.value]));
}

// ── Onboarding ──────────────────────────────
export async function getOnboardingDay(day) {
  const db = await getDB();
  return db.get('onboarding', day);
}

export async function setOnboardingDay(day, data) {
  const db = await getDB();
  await db.put('onboarding', { day, ...data });
}

export async function getAllOnboardingProgress() {
  const db = await getDB();
  return db.getAll('onboarding');
}

// ── Achievements ─────────────────────────────
export async function getAchievement(id) {
  const db = await getDB();
  return db.get('achievements', id);
}

export async function unlockAchievement(id, data) {
  const db = await getDB();
  await db.put('achievements', { id, unlockedAt: new Date().toISOString(), ...data });
}

export async function getAllAchievements() {
  const db = await getDB();
  return db.getAll('achievements');
}
