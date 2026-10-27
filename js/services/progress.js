/**
 * OSS Quest — Progress Service (Local Pivot)
 * Syncs progress with the local Node.js backend instead of localStorage.
 */

import { requireAuth } from './auth.js';

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
    skillLevel: null,
    onboardingComplete: false,
};

let localCache = { ...DEFAULT_PROGRESS };

/** Update persistent top-bar counter elements */
export function updateTopBarUI() {
    const xpEl = document.getElementById('xp-count');
    const streakEl = document.getElementById('streak-count');
    if (xpEl) xpEl.textContent = localCache.xp;
    if (streakEl) streakEl.textContent = localCache.streak;
}

/** Initialize progress from the local backend on app boot */
export async function initProgress() {
    const user = requireAuth();
    if (!user) {
        updateTopBarUI();
        return localCache;
    }

    try {
        const response = await fetch(BACKEND_URL, {
            headers: { 'Authorization': `Bearer ${user.id}` }
        });
        if (response.ok) {
            const data = await response.json();
            localCache = { ...DEFAULT_PROGRESS, ...data };
            
            // DEMO HACK: Force unlock all chapters if they are locked
            for (let i = 1; i <= 6; i++) {
                if (localCache.chapters[i] === 'locked') {
                    localCache.chapters[i] = 'active';
                }
            }
        }
    } catch (e) {
        console.warn("Failed to load progress from backend, using default cache.", e);
    }
    updateTopBarUI();
    return localCache;
}

/** Synchronously return the loaded progress cache for UI rendering */
export function loadProgress() {
    return localCache;
}

/** Save progress to the local backend */
export async function saveProgress(progress) {
    localCache = { ...localCache, ...progress };
    updateTopBarUI();
    const user = requireAuth();
    if (!user) return;

    try {
        await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
                'Authorization': `Bearer ${user.id}`
            },
            body: JSON.stringify(localCache)
        });
    } catch (e) {
        console.warn("Failed to save progress to backend.", e);
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
    // Mark as done
    localCache.chapters[chapterId] = 'done';

    // Unlock next chapter
    const nextId = chapterId + 1;
    if (nextId <= 6 && localCache.chapters[nextId] === 'locked') {
        localCache.chapters[nextId] = 'active';
    }

    // Award XP
    localCache.xp += xpReward;
    localCache.streak += 1; // Simplify streak logic for demo
    localCache.lastActiveDate = new Date().toISOString();

    updateTopBarUI();
    await saveProgress(localCache);
}

export function getLanguage() {
    return localCache.language || 'en';
}

export async function setLanguage(lang) {
    localCache.language = lang;
    if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('language-changed', { detail: { language: lang } }));
    }
    await saveProgress({ language: lang });
}

export async function setOnboarding(complete, profileData = {}) {
    localCache.onboardingComplete = complete;
    localCache = { ...localCache, ...profileData };
    if (typeof window !== 'undefined' && profileData.language) {
        window.dispatchEvent(new CustomEvent('language-changed', { detail: { language: profileData.language } }));
    }
    await saveProgress(localCache);
}

export async function resetProgress() {
    localCache = { ...DEFAULT_PROGRESS };
    await saveProgress(localCache);
}
