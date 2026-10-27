/**
 * OSS Quest — Chapter Detail Page
 * Shows chapter content with jargon chips.
 * Chapter 5 triggers the camp reveal sequence.
 */

import { CHAPTERS } from '../data/chapters.js';
import { JARGON, getJargonDefinition } from '../data/jargon.js';
import { loadProgress, completeChapter, getLanguage } from '../services/progress.js';
import { getRecommendedRepo } from '../services/github.js';
import { CampScene } from '../engine/CampScene.js';

let activeCampScene = null;

export function renderChapter(container, chapterId) {
    const topBar = document.getElementById('top-bar');
    if (topBar) topBar.classList.remove('hidden');
    container.classList.remove('no-topbar');

    const id = parseInt(chapterId, 10);
    const chapter = CHAPTERS.find(c => c.id === id);
    if (!chapter) {
        container.innerHTML = `<div class="chapter-page"><h1>Chapter not found</h1></div>`;
        return;
    }

    const progress = loadProgress();
    const status = progress.chapters[id] || 'locked';
    const lang = progress.language || 'en';

    if (status === 'locked') {
        container.innerHTML = `
            <section class="chapter-page">
                <a href="#/journey" class="chapter-back">← Back to quest map</a>
                <div class="card" style="text-align:center; padding: var(--s-3xl)">
                    <h2>🔒 Chapter Locked</h2>
                    <p class="text-muted mt-md">Complete the previous chapter to unlock this one.</p>
                    <a href="#/journey" class="btn btn--ghost mt-lg">Return to Map</a>
                </div>
            </section>
        `;
        return;
    }

    // For Chapter 5 (camp chapter), show a launch button
    if (chapter.isCampChapter) {
        renderCampChapter(container, chapter, progress, lang);
        return;
    }

    // Regular chapter content
    const sectionsHTML = chapter.content.map((section, idx) => `
        <div class="chapter-section card card--flat anim-fade-in-up" style="animation-delay: ${idx * 100}ms">
            <h3>${section.heading}</h3>
            <div class="chapter-body">${processJargon(section.body, lang)}</div>
        </div>
    `).join('');

    const isDone = status === 'done';
    const nextChapter = CHAPTERS.find(c => c.id === id + 1);

    container.innerHTML = `
        <section class="chapter-page" id="chapter-page">
            <a href="#/journey" class="chapter-back">← Back to quest map</a>
            
            <div class="chapter-content anim-fade-in">
                <span class="chapter-number">Chapter ${chapter.id}</span>
                <h1>${chapter.icon} ${chapter.title}</h1>
                <p class="text-muted">${chapter.subtitle}</p>
            </div>

            ${sectionsHTML}

            <div class="chapter-actions">
                <span class="chapter-xp-reward">
                    ${isDone ? '✅ Completed' : `⚡ +${chapter.xpReward} XP`}
                </span>
                <div style="display: flex; gap: var(--s-md);">
                    ${!isDone ? `
                        <button class="btn btn--primary" id="chapter-complete-btn">
                            Mark Complete ✓
                        </button>
                    ` : ''}
                    ${nextChapter ? `
                        <a href="#/chapter/${nextChapter.id}" class="btn ${isDone ? 'btn--primary' : 'btn--ghost'}">
                            ${isDone ? 'Next Chapter →' : 'Skip →'}
                        </a>
                    ` : ''}
                </div>
            </div>
        </section>
    `;

    // Complete button handler
    const completeBtn = document.getElementById('chapter-complete-btn');
    if (completeBtn) {
        completeBtn.addEventListener('click', () => {
            const updated = completeChapter(id, chapter.xpReward);

            // Animate XP
            const xpEl = document.getElementById('xp-count');
            if (xpEl) {
                xpEl.textContent = updated.xp;
                xpEl.parentElement.classList.add('anim-xp-pop');
                setTimeout(() => xpEl.parentElement.classList.remove('anim-xp-pop'), 500);
            }
            document.getElementById('streak-count').textContent = updated.streak;

            // Re-render to show completed state
            renderChapter(container, chapterId);
        });
    }

    // Activate jargon tooltips
    activateJargonChips(container, lang);
}

/** Render the camp/matching chapter (Chapter 5). */
function renderCampChapter(container, chapter, progress, lang) {
    const isDone = progress.chapters[chapter.id] === 'done';

    const sectionsHTML = chapter.content.map((section, idx) => `
        <div class="chapter-section card card--flat anim-fade-in-up" style="animation-delay: ${idx * 100}ms">
            <h3>${section.heading}</h3>
            <div class="chapter-body">${processJargon(section.body, lang)}</div>
        </div>
    `).join('');

    container.innerHTML = `
        <section class="chapter-page" id="chapter-page">
            <a href="#/journey" class="chapter-back">← Back to quest map</a>
            
            <div class="chapter-content anim-fade-in">
                <span class="chapter-number">Chapter ${chapter.id}</span>
                <h1>${chapter.icon} ${chapter.title}</h1>
                <p class="text-muted">${chapter.subtitle}</p>
            </div>

            ${sectionsHTML}

            <div class="chapter-actions">
                <span class="chapter-xp-reward">
                    ${isDone ? '✅ Completed' : `⚡ +${chapter.xpReward} XP`}
                </span>
                <button class="btn btn--primary btn--large" id="launch-camp-btn">
                    ${isDone ? '🏕️ Replay Camp Reveal' : '🏕️ Find My Match'}
                </button>
            </div>
        </section>
    `;

    document.getElementById('launch-camp-btn').addEventListener('click', () => {
        launchCampReveal(container, chapter, progress);
    });

    activateJargonChips(container, lang);
}

/** Launch the full camp reveal sequence. */
async function launchCampReveal(container, chapter, progress) {
    // Hide the chapter page content
    container.innerHTML = '';

    // Show camp container
    const campContainer = document.getElementById('camp-container');
    if (campContainer) campContainer.style.display = 'flex';

    // Fetch repo data & scores combined from the backend
    const matchData = await getRecommendedRepo();
    
    const signals = {
        repoName: matchData.repoName,
        repoUrl: matchData.repoUrl,
        description: matchData.description,
        hasReadme: matchData.hasReadme,
        readmeSize: 4096,
        openIssueCount: matchData.openIssueCount,
        hasContributing: matchData.hasContributing,
        goodFirstIssueCount: 12,
        maintainerActive: matchData.hasRecentActivity,
        daysSinceLastCommit: 2,
        ciPassing: matchData.ciPassing,
        ciRunName: "build-and-test"
    };

    const scores = matchData.scores;

    // Create and start the camp scene
    activeCampScene = new CampScene(signals, {
        autoPlay: true,
        onComplete: async (s) => {
            // Show match card
            showMatchCard(s, scores, chapter);
        }
    });

    await activeCampScene.start();
}

/** Show the scored match result card. */
function showMatchCard(signals, scores, chapter) {
    const card = document.getElementById('match-card');
    if (!card) return;

    const reasonsHTML = scores.reasoning.map(r => `<li>• ${r}</li>`).join('');

    card.innerHTML = `
        <div class="match-card-header">
            <div class="match-card-title">${signals.repoName}</div>
            <div class="match-card-subtitle">${signals.description}</div>
        </div>
        
        <div class="match-card-scores">
            <div class="score-row">
                <span class="score-label">Language Fit</span>
                <div class="score-bar-bg">
                    <div class="score-bar-fill lang" style="width: 0%" data-target="${scores.languageFit}"></div>
                </div>
                <span class="score-value">${scores.languageFit}%</span>
            </div>
            <div class="score-row">
                <span class="score-label">Beginner Friendly</span>
                <div class="score-bar-bg">
                    <div class="score-bar-fill diff" style="width: 0%" data-target="${scores.beginnerFriendliness}"></div>
                </div>
                <span class="score-value">${scores.beginnerFriendliness}%</span>
            </div>
            <div class="score-row">
                <span class="score-label">Responsiveness</span>
                <div class="score-bar-bg">
                    <div class="score-bar-fill resp" style="width: 0%" data-target="${scores.responsiveness}"></div>
                </div>
                <span class="score-value">${scores.responsiveness}%</span>
            </div>
        </div>

        <div class="card card--flat" style="margin-bottom: var(--s-lg); padding: var(--s-md);">
            <h4 style="margin-bottom: var(--s-sm); font-size: var(--fs-sm);">Why this match?</h4>
            <ul style="font-size: var(--fs-sm); color: var(--c-ink-light); line-height: 1.8;">
                ${reasonsHTML}
            </ul>
        </div>

        <div class="match-card-actions">
            <a href="${signals.repoUrl}" target="_blank" rel="noopener" class="btn btn--primary">
                View Repository →
            </a>
            <button class="btn btn--ghost" id="match-card-close">
                Continue Quest
            </button>
        </div>
    `;

    card.style.display = 'block';

    // Animate in
    requestAnimationFrame(() => {
        card.classList.add('visible');

        // Animate score bars
        setTimeout(() => {
            card.querySelectorAll('.score-bar-fill').forEach(bar => {
                bar.style.width = bar.dataset.target + '%';
            });
        }, 300);
    });

    // Close handler
    document.getElementById('match-card-close').addEventListener('click', () => {
        card.classList.remove('visible');
        setTimeout(() => {
            card.style.display = 'none';
            card.innerHTML = '';

            // Complete chapter
            const updated = completeChapter(chapter.id, chapter.xpReward);
            document.getElementById('xp-count').textContent = updated.xp;
            document.getElementById('streak-count').textContent = updated.streak;

            // Destroy camp scene
            if (activeCampScene) {
                activeCampScene.destroy();
                activeCampScene = null;
            }

            // Navigate to journey or next chapter
            window.location.hash = '#/journey';
        }, 400);
    });
}

/**
 * Process content HTML to wrap jargon terms with tooltip markup.
 * Assumes jargon spans are already in the HTML with data-term attributes.
 */
function processJargon(html, lang) {
    // The chapter content already has <span class="jargon" data-term="..."> markup
    // We just need to add tooltip spans
    return html.replace(
        /<span class="jargon" data-term="([^"]+)">([^<]+)<\/span>/g,
        (match, termKey, displayText) => {
            const def = getJargonDefinition(termKey, lang);
            return `<span class="jargon" data-term="${termKey}" tabindex="0">${displayText}<span class="jargon-tip">${def.definition}</span></span>`;
        }
    );
}

/** Activate jargon chip click/tap behavior for mobile. */
function activateJargonChips(container, lang) {
    container.querySelectorAll('.jargon[data-term]').forEach(chip => {
        chip.addEventListener('click', (e) => {
            // Toggle active class for mobile tap
            const wasActive = chip.classList.contains('active');
            container.querySelectorAll('.jargon.active').forEach(c => c.classList.remove('active'));
            if (!wasActive) chip.classList.add('active');
            e.stopPropagation();
        });
    });

    // Close jargon tips on click outside
    document.addEventListener('click', () => {
        container.querySelectorAll('.jargon.active').forEach(c => c.classList.remove('active'));
    }, { once: false });
}

export function destroyChapter() {
    if (activeCampScene) {
        activeCampScene.destroy();
        activeCampScene = null;
    }
    const card = document.getElementById('match-card');
    if (card) {
        card.classList.remove('visible');
        card.style.display = 'none';
        card.innerHTML = '';
    }
}
