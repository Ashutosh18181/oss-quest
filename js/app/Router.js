/**
 * OSS Quest — Router
 * Hash-based routing, updated for the village overhaul.
 */

import { renderLanding, destroyLanding } from '../pages/Landing.js';
import { renderOnboarding } from '../pages/Onboarding.js';
import { SceneManager } from '../engine/SceneManager.js';
import { renderProfile } from '../pages/Profile.js';
import { loadProgress } from '../services/progress.js';
import { isAuthenticated } from '../services/auth.js';

export class Router {
    constructor() {
        this.container = document.getElementById('app');
        this.currentRoute = null;
        this.sceneManager = null;
        this._onHashChange = this._onHashChange.bind(this);
    }

    init() {
        window.addEventListener('hashchange', this._onHashChange);
        if (!window.location.hash || window.location.hash === '#') {
            window.location.hash = '#/';
        }
        this._onHashChange();
    }

    _onHashChange() {
        const hash = window.location.hash.slice(1) || '/';
        
        if (hash === '/profile' && this.currentRoute === 'village') {
            renderProfile(this.container);
            return;
        }

        this._cleanup();

        if (hash === '/') {
            this._route('landing');
        } else if (hash === '/onboarding') {
            this._route('onboarding');
        } else if (hash === '/village' || hash === '/journey' || hash.startsWith('/chapter/')) {
            this._guardAuth(() => this._route('village'));
        } else if (hash === '/profile') {
            this._guardAuth(() => this._route('profile'));
        } else {
            window.location.hash = '#/';
        }
    }

    _route(page) {
        this.currentRoute = page;
        
        const topBar = document.getElementById('top-bar');
        const villageContainer = document.getElementById('village-container');
        const appUi = document.getElementById('app-ui-layer');

        if (page === 'village') {
            if (topBar) topBar.classList.add('hidden');
            this.container.style.display = 'none';
            if (appUi) appUi.style.display = 'block';
            
            if (!this.sceneManager) {
                this.sceneManager = new SceneManager();
            }
            
            // By default load the overworld to let the player choose/walk to the active chapter
            this.sceneManager.loadScene('overworld');
        } else {
            if (topBar) topBar.classList.remove('hidden');
            this.container.style.display = 'block';
            if (villageContainer) villageContainer.style.display = 'none';
            if (appUi) appUi.style.display = 'none';

            if (page === 'landing') renderLanding(this.container);
            else if (page === 'onboarding') renderOnboarding(this.container);
            else if (page === 'profile') renderProfile(this.container);
        }
    }

    _guardAuth(fn) {
        const progress = loadProgress();
        if (!isAuthenticated() || !progress.onboardingComplete) {
            window.location.hash = '#/onboarding';
            return;
        }
        fn();
    }

    _cleanup() {
        if (this.currentRoute === 'landing') {
            destroyLanding();
        }
        if (this.sceneManager && this.sceneManager.currentScene) {
            this.sceneManager.currentScene.destroy();
            this.sceneManager = null; // Forces a fresh load next time
        }
        const atmoEl = document.getElementById('atmosphere-text');
        if (atmoEl) {
            atmoEl.style.opacity = '0';
            atmoEl.textContent = '';
        }
        if (this.container) this.container.innerHTML = '';
    }

    destroy() {
        window.removeEventListener('hashchange', this._onHashChange);
    }
}
