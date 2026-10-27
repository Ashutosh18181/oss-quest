/**
 * OSS Quest — QuestHUD
 * Persistent UI overlay for quests, stats, and atmosphere.
 */

export class QuestHUD {
    constructor() {
        this.titleEl = document.getElementById('quest-hud-title');
        this.progressEl = document.getElementById('quest-hud-progress');
        this.xpEl = document.getElementById('quest-hud-xp');
        this.atmosphereEl = document.getElementById('atmosphere-text');
        
        this.currentAtmosphere = "";
        this._atmoTimeout = null;
    }

    /**
     * Update the quest tracker display.
     * @param {string} title 
     * @param {string} progress 
     * @param {number} xp 
     */
    updateQuest(title, progress, xp) {
        if (this.titleEl) this.titleEl.textContent = title;
        if (this.progressEl) this.progressEl.textContent = progress;
        
        const energyFill = document.getElementById('quest-hud-energy-fill');
        if (energyFill) {
            // Max XP is ~1000 for all 6 chapters.
            const percentage = Math.min((xp / 1000) * 100, 100);
            energyFill.style.width = percentage + '%';
        }
    }

    /**
     * Clear atmosphere banner immediately.
     */
    clearAtmosphere() {
        if (this._atmoTimeout) clearTimeout(this._atmoTimeout);
        this.currentAtmosphere = "";
        if (this.atmosphereEl) {
            this.atmosphereEl.style.opacity = '0';
            this.atmosphereEl.textContent = '';
        }
    }

    /**
     * Update the atmosphere text (fades in and auto-fades out after duration).
     * @param {string} text 
     * @param {number} autoHideMs - time before auto hiding in ms (default 4000)
     */
    setAtmosphere(text, autoHideMs = 4000) {
        if (!this.atmosphereEl) return;
        if (this._atmoTimeout) clearTimeout(this._atmoTimeout);

        if (!text) {
            this.clearAtmosphere();
            return;
        }
        
        this.currentAtmosphere = text;
        this.atmosphereEl.style.opacity = '0';
        
        setTimeout(() => {
            if (this.currentAtmosphere === text && this.atmosphereEl) {
                this.atmosphereEl.textContent = text;
                this.atmosphereEl.style.opacity = '1';

                if (autoHideMs > 0) {
                    this._atmoTimeout = setTimeout(() => {
                        if (this.atmosphereEl) {
                            this.atmosphereEl.style.opacity = '0';
                            setTimeout(() => {
                                if (this.atmosphereEl && this.atmosphereEl.style.opacity === '0') {
                                    this.atmosphereEl.textContent = '';
                                    this.currentAtmosphere = '';
                                }
                            }, 400);
                        }
                    }, autoHideMs);
                }
            }
        }, 200);
    }
}
