/**
 * OSS Quest — Journey Map Page
 * Vertical chapter path with connected nodes and status indicators.
 */

import { CHAPTERS } from '../data/chapters.js';
import { loadProgress } from '../services/progress.js';

export function renderJourney(container) {
    const topBar = document.getElementById('top-bar');
    if (topBar) topBar.classList.remove('hidden');
    container.classList.remove('no-topbar');

    const progress = loadProgress();

    // Update top bar stats
    document.getElementById('xp-count').textContent = progress.xp;
    document.getElementById('streak-count').textContent = progress.streak;
    document.getElementById('lang-toggle').value = progress.language;

    const chaptersHTML = CHAPTERS.map((ch, idx) => {
        const status = progress.chapters[ch.id] || 'locked';
        const statusLabel = status === 'done' ? '✅ Complete'
            : status === 'active' ? '⭐ Ready'
            : '🔒 Locked';
        const statusIcon = status === 'done' ? '✅'
            : status === 'active' ? '⭐'
            : '🔒';

        const nodeClass = `chapter-node ${status}`;
        const bodyClass = status === 'active' ? 'chapter-node-body anim-pulse-glow' : 'chapter-node-body';
        
        const connector = idx < CHAPTERS.length - 1
            ? `<div class="chapter-connector ${status === 'done' ? 'done' : ''}"></div>`
            : '';

        return `
            <div class="${nodeClass}" data-chapter="${ch.id}" role="button" tabindex="${status !== 'locked' ? '0' : '-1'}" aria-label="Chapter ${ch.id}: ${ch.title}">
                <div class="chapter-node-number">${ch.icon}</div>
                <div class="${bodyClass}">
                    <div class="chapter-node-title">${ch.title}</div>
                    <p class="chapter-node-desc">${ch.description}</p>
                    <div class="chapter-node-status">${statusLabel}</div>
                </div>
            </div>
            ${connector}
        `;
    }).join('');

    container.innerHTML = `
        <section class="journey" id="journey-page">
            <div class="journey-header anim-fade-in">
                <h1>Your Quest</h1>
                <p>Follow the path from Chapter 1 to your first real pull request.</p>
            </div>
            <div class="chapter-path stagger">
                ${chaptersHTML}
            </div>
        </section>
    `;

    // Click handlers for chapter nodes
    container.querySelectorAll('.chapter-node:not(.locked)').forEach(node => {
        node.addEventListener('click', () => {
            const id = node.dataset.chapter;
            window.location.hash = `#/chapter/${id}`;
        });
        node.addEventListener('keydown', (e) => {
            if (e.key === 'Enter' || e.key === ' ') {
                e.preventDefault();
                node.click();
            }
        });
    });
}
