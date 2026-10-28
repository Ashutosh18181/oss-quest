/**
 * OSS Quest — Progress Service
 * Fully persists progress to localStorage (and syncs with backend when available).
 * Restores language preference, skill level, XP, and completed chapters on reload.
 */

import { requireAuth } from './auth.js';

const STORAGE_KEY = 'oss_quest_progress_v2';

const BACKEND_BASE = (typeof window !== 'undefined' && window.location.port && window.location.port !== '3001' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
    ? `${window.location.protocol}//${window.location.hostname}:3001`
    : '';

const BACKEND_URL = `${BACKEND_BASE}/api/progress`;

const DEFAULT_PROGRESS = {
    chapters: {
        1: 'active',
        2: 'active',
        3: 'active',
        4: 'active',
        5: 'active',
        6: 'active',
    },
    xp: 0,
    streak: 0,
    lastActiveDate: null,
    language: 'en',
    codeLanguage: 'javascript',
    skillLevel: 'beginner',
    onboardingComplete: false,
};

/** Load initial progress synchronously from localStorage to prevent flash of reset state */
function loadFromStorage() {
    if (typeof window === 'undefined') return { ...DEFAULT_PROGRESS };
    try {
        const raw = localStorage.getItem(STORAGE_KEY);
        if (raw) {
            const parsed = JSON.parse(raw);
            return {
                ...DEFAULT_PROGRESS,
                ...parsed,
                chapters: { ...DEFAULT_PROGRESS.chapters, ...(parsed.chapters || {}) }
            };
        }
    } catch (e) {
        console.warn("Failed to read progress from localStorage:", e);
    }
    return { ...DEFAULT_PROGRESS };
}

/** Save progress state synchronously to localStorage */
function persistToStorage(data) {
    if (typeof window === 'undefined') return;
    try {
        localStorage.setItem(STORAGE_KEY, JSON.stringify(data));
    } catch (e) {
        console.warn("Failed to write progress to localStorage:", e);
    }
}

let localCache = loadFromStorage();

/** Micro-toast indicating progress was saved */
export function showSaveIndicator(msg) {
    if (typeof document === 'undefined') return;
    const lang = localCache.language || 'en';
    let defaultMsg = 'Progress saved ✓';
    if (lang === 'hi') defaultMsg = 'प्रगति सहेजी गई ✓';
    else if (lang === 'od') defaultMsg = 'ପ୍ରଗତି ସଞ୍ଚିତ ହେଲା ✓';

    let el = document.getElementById('save-indicator');
    if (!el) {
        el = document.createElement('div');
        el.id = 'save-indicator';
        el.className = 'save-indicator';
        document.body.appendChild(el);
    }
    el.textContent = msg || defaultMsg;
    el.classList.add('visible');
    clearTimeout(el._hideTimer);
    el._hideTimer = setTimeout(() => {
        el.classList.remove('visible');
    }, 1800);
}

/** Update persistent top-bar counter elements */
export function updateTopBarUI() {
    const xpEl = document.getElementById('xp-count');
    const streakEl = document.getElementById('streak-count');
    if (xpEl) xpEl.textContent = localCache.xp;
    if (streakEl) streakEl.textContent = localCache.streak;
}

/** Initialize progress: combines localStorage cache and optionally merges backend updates */
export async function initProgress() {
    localCache = loadFromStorage();
    updateTopBarUI();

    const user = requireAuth();
    if (!user) return localCache;

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 1500);

        const response = await fetch(BACKEND_URL, {
            headers: { 'Authorization': `Bearer ${user.id}` },
            signal: controller.signal
        });
        clearTimeout(timeout);

        if (response.ok) {
            const data = await response.json();
            if (data && typeof data === 'object') {
                localCache = {
                    ...localCache,
                    ...data,
                    chapters: { ...localCache.chapters, ...(data.chapters || {}) }
                };
                persistToStorage(localCache);
                updateTopBarUI();
            }
        }
    } catch (e) {
        // Backend offline — localStorage cache remains primary
    }

    return localCache;
}

/** Synchronously return the loaded progress cache for UI rendering */
export function loadProgress() {
    return localCache;
}

/** Save progress to localStorage (and asynchronously sync with backend) */
export async function saveProgress(progress, showToast = true) {
    localCache = {
        ...localCache,
        ...progress,
        chapters: {
            ...localCache.chapters,
            ...(progress.chapters || {})
        }
    };
    persistToStorage(localCache);
    updateTopBarUI();
    if (showToast) showSaveIndicator();

    const user = requireAuth();
    if (!user) return;

    try {
        const controller = new AbortController();
        const timeout = setTimeout(() => controller.abort(), 2000);
        await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.id}`
            },
            body: JSON.stringify(localCache),
            signal: controller.signal
        });
        clearTimeout(timeout);
    } catch (e) {
        // Backend offline
    }
}

/** Get chapter status. */
export function getChapterStatus(chapterId) {
    return localCache.chapters[chapterId] || 'locked';
}

/**
 * Complete a chapter — updates status, awards XP, unlocks next.
 * @param {number} chapterId
 * @param {number} xpReward
 */
export async function completeChapter(chapterId, xpReward = 0) {
    localCache.chapters[chapterId] = 'done';

    // Unlock next chapter
    const nextId = chapterId + 1;
    if (nextId <= 6 && localCache.chapters[nextId] === 'locked') {
        localCache.chapters[nextId] = 'active';
    }

    localCache.xp += xpReward;
    localCache.streak = Math.max(localCache.streak, 1);
    localCache.lastActiveDate = new Date().toISOString();

    persistToStorage(localCache);
    updateTopBarUI();
    showSaveIndicator(`+${xpReward} XP Earned · Progress saved ✓`);

    await saveProgress(localCache, false);
}

export function getLanguage() {
    return localCache.language || 'en';
}

export async function setLanguage(lang) {
    localCache.language = lang;
    persistToStorage(localCache);
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('language-changed', { detail: { language: lang } }));
    }
    await saveProgress({ language: lang }, false);
}

export async function setOnboarding(complete, profileData = {}) {
    localCache.onboardingComplete = complete;
    localCache = { ...localCache, ...profileData };
    persistToStorage(localCache);
    if (typeof window !== 'undefined' && profileData.language) {
        window.dispatchEvent(new CustomEvent('language-changed', { detail: { language: profileData.language } }));
    }
    await saveProgress(localCache, false);
}

export async function resetProgress() {
    localCache = { ...DEFAULT_PROGRESS };
    persistToStorage(localCache);
    updateTopBarUI();
    await saveProgress(localCache, true);
}

