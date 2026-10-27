/**
 * OSS Quest — SceneManager
 * Manages transitions between Village scenes and the Overworld scene.
 */

import { OverworldScene } from './OverworldScene.js';
import { VillageScene } from './VillageScene.js';
import { VILLAGES } from '../data/village.js';
import { AudioSys } from './AudioManager.js';

export class SceneManager {
    constructor() {
        this.currentScene = null;
        this.overlay = document.createElement('div');
        this.overlay.className = 'scene-transition-overlay';
        document.body.appendChild(this.overlay);
    }

    /**
     * Load a scene with a fade-in/out transition.
     * @param {string} sceneType — 'village' or 'overworld'
     * @param {object} params — e.g. { villageId: 1 }
     */
    async loadScene(sceneType, params = {}) {
        // Fade out
        this.overlay.classList.add('active');
        await new Promise(r => setTimeout(r, 400));

        // Destroy old scene
        if (this.currentScene) {
            this.currentScene.destroy();
            this.currentScene = null;
        }

        // Wait a beat while black
        await new Promise(r => setTimeout(r, 200));

        // Instantiate new scene
        if (sceneType === 'overworld') {
            this.currentScene = new OverworldScene(this);
            AudioSys.playTheme('overworld_theme');
        } else if (sceneType === 'village') {
            const vId = params.villageId || 1;
            this.currentScene = new VillageScene(this, vId);
        }

        if (this.currentScene) {
            await this.currentScene.start();
        }

        // Fade in
        this.overlay.classList.remove('active');
    }
}
