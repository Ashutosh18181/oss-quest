/**
 * OSS Quest — Onboarding Page
 * Step 1: Language selection
 * Step 2: Skill level
 */

import { signIn, requireAuth } from '../services/auth.js';
import { setOnboarding } from '../services/progress.js';
import { AudioSys } from '../engine/AudioManager.js';

export function renderOnboarding(container) {
    // Hide top bar during onboarding
    const topBar = document.getElementById('top-bar');
    if (topBar) topBar.classList.add('hidden');
    container.classList.add('no-topbar');

    let selectedLang = null;
    let step = 1;

    renderStep1();

    function renderStep1() {
        container.innerHTML = `
            <section class="onboarding" id="onboarding-page">
                <div class="card card--rounded onboarding-card anim-fade-in">
                    <div class="onboarding-step">Step 1 of 2</div>
                    <h2>Choose your language</h2>
                    <p class="onboarding-desc">
                        Developer terms will be explained in the language you pick.
                        You can change this later.
                    </p>
                    <div class="option-grid option-grid--3" id="lang-options">
                        <button class="option-btn" data-lang="en">
                            <span class="option-icon">🇬🇧</span>
                            <span class="option-label">English</span>
                        </button>
                        <button class="option-btn" data-lang="hi">
                            <span class="option-icon">🇮🇳</span>
                            <span class="option-label">हिंदी</span>
                            <span class="option-desc">Hindi</span>
                        </button>
                        <button class="option-btn" data-lang="od">
                            <span class="option-icon">🏛️</span>
                            <span class="option-label">ଓଡ଼ିଆ</span>
                            <span class="option-desc">Odia</span>
                        </button>
                    </div>
                    <button class="btn btn--primary btn--large btn--block" id="lang-next-btn" disabled>
                        Continue →
                    </button>
                </div>
            </section>
        `;

        // Language selection
        const options = container.querySelectorAll('.option-btn[data-lang]');
        const nextBtn = document.getElementById('lang-next-btn');

        options.forEach(btn => {
            btn.addEventListener('click', () => {
                options.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedLang = btn.dataset.lang;
                nextBtn.disabled = false;
            });
        });

        nextBtn.addEventListener('click', () => {
            if (selectedLang) renderStep2();
        });
    }

    function renderStep2() {
        container.innerHTML = `
            <section class="onboarding" id="onboarding-page">
                <div class="card card--rounded onboarding-card anim-fade-in">
                    <div class="onboarding-step">Step 2 of 2</div>
                    <h2>Your coding experience</h2>
                    <p class="onboarding-desc">
                        This helps us pick the right starting point for you.
                        Be honest — there are no wrong answers.
                    </p>
                    <div class="option-grid option-grid--1" id="skill-options">
                        <button class="option-btn" data-skill="none">
                            <span class="option-label">Never written code</span>
                            <span class="option-desc">I've never opened a code editor or terminal</span>
                        </button>
                        <button class="option-btn" data-skill="learning">
                            <span class="option-label">Learning the basics</span>
                            <span class="option-desc">I've done a tutorial or two but haven't built anything real</span>
                        </button>
                        <button class="option-btn" data-skill="reading">
                            <span class="option-label">Can read code</span>
                            <span class="option-desc">I can read simple code and understand what it does</span>
                        </button>
                    </div>
                    <div style="display: flex; gap: var(--s-md); margin-top: var(--s-lg);">
                        <button class="btn btn--ghost" id="skill-back-btn">← Back</button>
                        <button class="btn btn--primary btn--large" id="skill-start-btn" disabled style="flex:1">
                            Start My Quest ⚔️
                        </button>
                    </div>
                </div>
            </section>
        `;

        let selectedSkill = null;
        const options = container.querySelectorAll('.option-btn[data-skill]');
        const startBtn = document.getElementById('skill-start-btn');
        const backBtn = document.getElementById('skill-back-btn');

        options.forEach(btn => {
            btn.addEventListener('click', () => {
                options.forEach(b => b.classList.remove('selected'));
                btn.classList.add('selected');
                selectedSkill = btn.dataset.skill;
                startBtn.disabled = false;
            });
        });

        backBtn.addEventListener('click', () => {
            renderStep1();
        });

        startBtn.addEventListener('click', () => {
            if (!selectedSkill) return;

            // Unlock audio on click gesture
            AudioSys.playTheme('overworld_theme');

            // Sign in and save onboarding
            requireAuth();
            setOnboarding(true, { language: selectedLang, skillLevel: selectedSkill });

            // Update lang toggles
            const langToggle = document.getElementById('lang-toggle');
            if (langToggle) langToggle.value = selectedLang;
            const hudLangToggle = document.getElementById('hud-lang-toggle');
            if (hudLangToggle) hudLangToggle.value = selectedLang;

            // Navigate to journey
            window.location.hash = '#/journey';
        });
    }
}
