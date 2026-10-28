/**
 * OSS Quest — Main Entry Point
 * Bootstraps the application.
 */

import { Router } from './Router.js';
import { loadProgress, initProgress, setLanguage } from '../services/progress.js';
import { Assets } from '../engine/AssetLoader.js';
import { AudioSys } from '../engine/AudioManager.js';

// Boot the app
document.addEventListener('DOMContentLoaded', async () => {
    console.log('⚔️ OSS Quest starting…');

    // Preload image assets
    await Assets.loadAll({
        tile_grass: 'assets/grass.png',
        tile_dirt: 'assets/dirt.png',
        player: 'assets/player.png',
        player_sprite: 'assets/player_sprite.png',
        borin: 'assets/borin.png',
        borin_sprite: 'assets/borin_sprite.png',
        animal: 'assets/animal.png',
        cat_sprite: 'assets/cat_sprite.png',
        campfire: 'assets/campfire.png',
        overworld: 'assets/overworld.png',
        bg_forge: 'assets/bg_forge.png',
        bg_copyworks: 'assets/bg_copyworks.png',
        bg_reading_grove: 'assets/bg_reading_grove.png',
        bg_speaking_well: 'assets/bg_speaking_well.png',
        bg_proving_grounds: 'assets/bg_proving_grounds.png',
        bg_gate: 'assets/bg_gate.png'
    });

    // Initialize progress from backend
    await initProgress();

    // Initialize router
    const router = new Router();
    router.init();

    // Sync language toggles with stored preference
    const langToggle = document.getElementById('lang-toggle');
    const hudLangToggle = document.getElementById('hud-lang-toggle');
    const progress = loadProgress();
    const currentLang = progress.language || 'en';

    if (langToggle) langToggle.value = currentLang;
    if (hudLangToggle) hudLangToggle.value = currentLang;

    function handleLangChange(newLang) {
        if (langToggle) langToggle.value = newLang;
        if (hudLangToggle) hudLangToggle.value = newLang;
        setLanguage(newLang);

        // Re-render current page if it's a chapter (to update jargon)
        const hash = window.location.hash;
        if (hash.startsWith('#/chapter/')) {
            window.dispatchEvent(new HashChangeEvent('hashchange'));
        }
    }

    if (langToggle) {
        langToggle.addEventListener('change', (e) => handleLangChange(e.target.value));
    }
    if (hudLangToggle) {
        hudLangToggle.addEventListener('change', (e) => handleLangChange(e.target.value));
    }

    window.addEventListener('language-changed', (e) => {
        const lang = e.detail?.language;
        if (lang) {
            if (langToggle && langToggle.value !== lang) langToggle.value = lang;
            if (hudLangToggle && hudLangToggle.value !== lang) hudLangToggle.value = lang;
            const landingToggle = document.getElementById('landing-lang-toggle');
            if (landingToggle && landingToggle.value !== lang) landingToggle.value = lang;
        }
    });

    const audioBtn = document.getElementById('audio-toggle-btn');
    const hudAudioBtn = document.getElementById('hud-audio-toggle');
    if (audioBtn) {
        audioBtn.addEventListener('click', () => AudioSys.toggleMute());
    }
    if (hudAudioBtn) {
        hudAudioBtn.addEventListener('click', () => AudioSys.toggleMute());
    }
    AudioSys.updateUI();

    console.log('⚔️ OSS Quest ready');
});
