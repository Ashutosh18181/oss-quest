/**
 * OSS Quest — Profile Page
 * Shows XP, streak, language setting, and chapter progress.
 */

import { loadProgress, setLanguage, resetProgress } from '../services/progress.js';
import { getCurrentUser, signOut } from '../services/auth.js';
import { CHAPTERS } from '../data/chapters.js';

export function renderProfile(container) {
    const topBar = document.getElementById('top-bar');
    if (topBar) topBar.classList.remove('hidden');
    container.classList.remove('no-topbar');

    const progress = loadProgress();
    const user = getCurrentUser();

    // Calculate chapter completion
    const totalChapters = CHAPTERS.length;
    const doneChapters = Object.values(progress.chapters).filter(s => s === 'done').length;
    const progressPct = Math.round((doneChapters / totalChapters) * 100);

    // Skill level display
    const skillLabels = {
        none: 'Never written code',
        learning: 'Learning the basics',
        reading: 'Can read code',
    };

    const langLabels = {
        en: 'English',
        hi: 'हिंदी (Hindi)',
        od: 'ଓଡ଼ିଆ (Odia)',
    };

    container.innerHTML = `
        <section class="profile" id="profile-page">
            <a href="#/journey" class="chapter-back">← Back to quest map</a>
            
            <h1 class="anim-fade-in">Your Profile</h1>

            <div class="profile-stats stagger">
                <div class="card profile-stat anim-fade-in-up">
                    <div class="profile-stat-value">${progress.xp}</div>
                    <div class="profile-stat-label">Total XP</div>
                </div>
                <div class="card profile-stat anim-fade-in-up">
                    <div class="profile-stat-value">${progress.streak}</div>
                    <div class="profile-stat-label">Day Streak</div>
                </div>
                <div class="card profile-stat anim-fade-in-up">
                    <div class="profile-stat-value">${doneChapters}/${totalChapters}</div>
                    <div class="profile-stat-label">Chapters</div>
                </div>
            </div>

            <div class="profile-progress card anim-fade-in" style="animation-delay: 300ms">
                <h3>Quest Progress</h3>
                <div style="display: flex; align-items: center; gap: var(--s-md); margin-top: var(--s-md);">
                    <div class="progress-bar-bg" style="flex:1">
                        <div class="progress-bar-fill anim-bar-fill" style="width: ${progressPct}%"></div>
                    </div>
                    <span class="text-mono text-sm" style="font-weight: 700">${progressPct}%</span>
                </div>
                <div style="margin-top: var(--s-md);">
                    ${CHAPTERS.map(ch => {
                        const s = progress.chapters[ch.id] || 'locked';
                        const icon = s === 'done' ? '✅' : s === 'active' ? '⭐' : '🔒';
                        const chTitle = (progress.language === 'hi' && ch.title_hi) ? ch.title_hi : (progress.language === 'od' && ch.title_od) ? ch.title_od : ch.title;
                        return `<div style="display: flex; align-items: center; gap: var(--s-sm); margin-bottom: var(--s-xs); font-size: var(--fs-sm);">
                            <span>${icon}</span>
                            <span style="color: ${s === 'locked' ? 'var(--c-locked)' : 'var(--c-ink)'}">
                                Ch ${ch.id}: ${chTitle}
                            </span>
                        </div>`;
                    }).join('')}
                </div>
            </div>

            <div class="profile-section card anim-fade-in" style="animation-delay: 400ms">
                <h3>Settings</h3>
                <div style="margin-top: var(--s-md);">
                    <label class="text-mono text-sm" style="display: block; margin-bottom: var(--s-xs); font-weight: 700;">
                        Language
                    </label>
                    <select id="profile-lang" class="lang-toggle" style="width: 100%; padding: var(--s-sm);">
                        <option value="en" ${progress.language === 'en' ? 'selected' : ''}>English</option>
                        <option value="hi" ${progress.language === 'hi' ? 'selected' : ''}>हिंदी (Hindi)</option>
                        <option value="od" ${progress.language === 'od' ? 'selected' : ''}>ଓଡ଼ିଆ (Odia)</option>
                    </select>
                </div>
                <div style="margin-top: var(--s-md);">
                    <span class="text-mono text-sm" style="font-weight: 700;">Skill Level:</span>
                    <span class="text-sm text-muted">${skillLabels[progress.skillLevel] || 'Not set'}</span>
                </div>
                ${user ? `
                <div style="margin-top: var(--s-md);">
                    <span class="text-mono text-sm" style="font-weight: 700;">Account:</span>
                    <span class="text-sm text-muted">${user.email}</span>
                </div>
                ` : ''}
            </div>

            <div style="display: flex; gap: var(--s-md); margin-top: var(--s-lg);">
                <button class="btn btn--ghost" id="profile-reset-btn" style="color: var(--c-error);">
                    Reset Progress
                </button>
                <button class="btn btn--ghost" id="profile-signout-btn">
                    Sign Out
                </button>
            </div>
        </section>
    `;

    // Language change handler
    document.getElementById('profile-lang').addEventListener('change', async (e) => {
        await setLanguage(e.target.value);
        renderProfile(container);
    });

    // Reset handler
    document.getElementById('profile-reset-btn').addEventListener('click', () => {
        if (confirm('Reset all progress? This cannot be undone.')) {
            resetProgress();
            signOut();
            window.location.hash = '#/';
        }
    });

    // Sign out handler
    document.getElementById('profile-signout-btn').addEventListener('click', () => {
        signOut();
        window.location.hash = '#/';
    });
}
