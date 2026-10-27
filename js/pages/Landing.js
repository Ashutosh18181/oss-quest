/**
 * OSS Quest — Landing Page (Multilingual Support)
 */

import { isAuthenticated } from '../services/auth.js';
import { loadProgress, setLanguage, getLanguage } from '../services/progress.js';
import { AudioSys } from '../engine/AudioManager.js';

const LANDING_STRINGS = {
    en: {
        badge: "Open Source Quest",
        titleHtml: 'The first pull request<br>you\'ll <em>actually</em> make',
        subtitle: "Explore a rich RPG village. Talk to the locals, learn Git, and get matched to your first real open-source contribution.",
        startBtn: "Begin Your Quest ⚔️",
        moveHint: "to move",
        f1Title: "RPG World",
        f1Desc: "No boring tutorials. Explore the village, talk to NPCs, and accept quests.",
        f2Title: "In Your Language",
        f2Desc: "Every developer term explained in plain language — English, Hindi, or Odia.",
        f3Title: "Real Match, Real Scores",
        f3Desc: "Matched to a real GitHub issue with transparent confidence scores."
    },
    hi: {
        badge: "ओपन सोर्स क्वेस्ट",
        titleHtml: 'पहला पुल रिक्वेस्ट जो आप<br><em>वास्तव में</em> बनाएंगे',
        subtitle: "एक सजीव आरपीजी गाँव घूमें। स्थानीय लोगों से बात करें, गिट (Git) सीखें, और अपने पहले असली ओपन-सोर्स योगदान से जुड़ें।",
        startBtn: "अपनी यात्रा शुरू करें ⚔️",
        moveHint: "चलने के लिए",
        f1Title: "आरपीजी दुनिया (RPG World)",
        f1Desc: "कोई उबाऊ ट्यूटोरियल नहीं। गाँव घूमें, किरदारों (NPCs) से बात करें और क्वेस्ट स्वीकार करें।",
        f2Title: "आपकी अपनी भाषा में",
        f2Desc: "डेवलपर की हर शब्दावली सरल भाषा में समझाई गई है — अंग्रेज़ी, हिंदी या ओड़िया।",
        f3Title: "सटीक प्रोजेक्ट मिलान",
        f3Desc: "पारदर्शी कॉन्फिडेंस स्कोर के साथ एक वास्तविक GitHub इश्यू से मिलान।"
    },
    od: {
        badge: "ଓପନ ସୋର୍ସ କ୍ୱେଷ୍ଟ",
        titleHtml: 'ଆପଣଙ୍କର ପ୍ରଥମ ପୁଲ୍ ରିକ୍ୱେଷ୍ଟ ଯାହା ଆପଣ<br><em>ପ୍ରକୃତରେ</em> ତିଆରି କରିବେ',
        subtitle: "ଏକ ଆରପିଜି ଗାଁ ଭ୍ରମଣ କରନ୍ତୁ। ସ୍ଥାନୀୟ ଲୋକଙ୍କ ସହ କଥା ହୁଅନ୍ତୁ, Git ଶିଖନ୍ତୁ ଏବଂ ଆପଣଙ୍କର ପ୍ରଥମ ଓପନ୍-ସୋର୍ସ ଅବଦାନ ସହିତ ଯୋଡ଼ି ହୁଅନ୍ତୁ।",
        startBtn: "କ୍ୱେଷ୍ଟ୍ ଆରମ୍ଭ କରନ୍ତୁ ⚔️",
        moveHint: "ଚାଲିବା ପାଇଁ",
        f1Title: "RPG ଦୁନିଆ",
        f1Desc: "କୌଣସି ବିରକ୍ତିକର ଟ୍ୟୁଟୋରିଆଲ୍ ନାହିଁ। ଗାଁ ବୁଲନ୍ତୁ, NPC ସହ କଥା ହୁଅନ୍ତୁ ଏବଂ କ୍ୱେଷ୍ଟ୍ ଗ୍ରହଣ କରନ୍ତୁ।",
        f2Title: "ଆପଣଙ୍କ ନିଜ ଭାଷାରେ",
        f2Desc: "ପ୍ରତ୍ୟେକ ଡେଭଲପର ଶବ୍ଦ ସରଳ ଭାଷାରେ ବୁଝାଯାଇଛି — ଇଂରାଜୀ, ହିନ୍ଦୀ କିମ୍ବା ଓଡ଼ିଆ।",
        f3Title: "ସଠିକ୍ ମ୍ୟାଚ୍, ସ୍ପଷ୍ଟ ସ୍କୋର",
        f3Desc: "ସ୍ପଷ୍ଟ ସ୍କୋର ସହିତ ଏକ ପ୍ରକୃତ GitHub ଇସ୍ୟୁ ସହିତ ମ୍ୟାଚ୍।"
    }
};

let currentLangListener = null;

export function renderLanding(container) {
    const topBar = document.getElementById('top-bar');
    if (topBar) topBar.classList.add('hidden');
    container.classList.add('no-topbar');

    const lang = getLanguage();
    const t = LANDING_STRINGS[lang] || LANDING_STRINGS.en;

    container.innerHTML = `
        <section class="landing" id="landing-page">
            <div style="display: flex; justify-content: space-between; align-items: center; margin-bottom: 2rem;">
                <div class="landing-badge anim-fade-in">${t.badge}</div>
                <select id="landing-lang-toggle" class="lang-toggle anim-fade-in" aria-label="Select Language">
                    <option value="en" ${lang === 'en' ? 'selected' : ''}>English</option>
                    <option value="hi" ${lang === 'hi' ? 'selected' : ''}>हिंदी (Hindi)</option>
                    <option value="od" ${lang === 'od' ? 'selected' : ''}>ଓଡ଼ିଆ (Odia)</option>
                </select>
            </div>
            
            <h1 class="anim-fade-in" style="animation-delay: 100ms">
                ${t.titleHtml}
            </h1>
            
            <p class="landing-subtitle anim-fade-in" style="animation-delay: 200ms">
                ${t.subtitle}
            </p>
            
            <div class="landing-cta anim-fade-in" style="animation-delay: 300ms">
                <button class="btn btn--primary btn--large" id="landing-start-btn">
                    ${t.startBtn}
                </button>
                <div class="controls-hint mt-sm text-sm text-muted">
                    <span class="key-hint">W</span><span class="key-hint">A</span><span class="key-hint">S</span><span class="key-hint">D</span> ${t.moveHint}
                </div>
            </div>

            <!-- Hero image: real generated overworld art -->
            <div class="landing-preview anim-fade-in" style="animation-delay: 400ms; border: 4px solid #21201C; border-radius: 8px; overflow: hidden; height: 320px; position: relative;">
                <img src="assets/overworld.png" alt="OSS Quest world map" style="width: 100%; height: 100%; object-fit: cover; object-position: center 30%; display: block;">
            </div>

            <div class="landing-features stagger" style="animation-delay: 500ms">
                <div class="card feature-card anim-fade-in-up">
                    <div class="feature-icon">🗺️</div>
                    <div class="feature-title">${t.f1Title}</div>
                    <p class="feature-desc">
                        ${t.f1Desc}
                    </p>
                </div>
                <div class="card feature-card anim-fade-in-up">
                    <div class="feature-icon">🌍</div>
                    <div class="feature-title">${t.f2Title}</div>
                    <p class="feature-desc">
                        ${t.f2Desc}
                    </p>
                </div>
                <div class="card feature-card anim-fade-in-up">
                    <div class="feature-icon">🎯</div>
                    <div class="feature-title">${t.f3Title}</div>
                    <p class="feature-desc">
                        ${t.f3Desc}
                    </p>
                </div>
            </div>
        </section>
    `;

    document.getElementById('landing-start-btn').addEventListener('click', () => {
        AudioSys.playTheme('overworld_theme');
        const progress = loadProgress();
        if (isAuthenticated() && progress.onboardingComplete) {
            window.location.hash = '#/village';
        } else {
            window.location.hash = '#/onboarding';
        }
    });

    const langToggle = document.getElementById('landing-lang-toggle');
    if (langToggle) {
        langToggle.addEventListener('change', async (e) => {
            await setLanguage(e.target.value);
            renderLanding(container);
        });
    }

    if (!currentLangListener) {
        currentLangListener = () => {
            renderLanding(container);
        };
        window.addEventListener('language-changed', currentLangListener);
    }
}

export function destroyLanding() {
    if (currentLangListener) {
        window.removeEventListener('language-changed', currentLangListener);
        currentLangListener = null;
    }
}
