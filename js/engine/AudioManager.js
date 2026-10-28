/**
 * OSS Quest — Audio Manager
 * Handles ambient looping background music with persistent mute/unmute preference.
 */

const AUDIO_STORAGE_KEY = 'oss_quest_audio_muted';

export class AudioManager {
    constructor() {
        this.bgm = new Audio('assets/background.mp3');
        this.bgm.loop = true;
        this.bgm.volume = 0.7;
        this.isPlaying = false;
        
        // Restore mute preference
        this.isMuted = false;
        try {
            this.isMuted = localStorage.getItem(AUDIO_STORAGE_KEY) === 'true';
        } catch (e) {}

        this.bgm.muted = this.isMuted;
        
        // Autoplay unlock fallback
        const unlock = () => {
            if (this.isPlaying || this.isMuted) return;
            this.bgm.play().then(() => {
                this.isPlaying = true;
                document.removeEventListener('click', unlock);
                document.removeEventListener('keydown', unlock);
            }).catch(() => {});
        };
        document.addEventListener('click', unlock, { once: true });
        document.addEventListener('keydown', unlock, { once: true });

        // Update UI buttons on boot
        setTimeout(() => this.updateUI(), 100);
    }
    
    playTheme(themeName) {
        if (this.isMuted) return;
        if (!this.isPlaying) {
            this.bgm.play().then(() => {
                this.isPlaying = true;
            }).catch(e => {
                this.isPlaying = false;
            });
        }
    }
    
    playSound(soundId) {
        // Sound effect hook (reserved for future SFX)
    }
    
    toggleMute() {
        this.isMuted = !this.isMuted;
        this.bgm.muted = this.isMuted;

        try {
            localStorage.setItem(AUDIO_STORAGE_KEY, String(this.isMuted));
        } catch (e) {}

        if (this.isMuted) {
            this.bgm.pause();
            this.isPlaying = false;
        } else {
            this.bgm.play().then(() => {
                this.isPlaying = true;
            }).catch(() => {});
        }

        this.updateUI();
        return this.isMuted;
    }

    updateUI() {
        const icon = this.isMuted ? '🔇' : '🔊';
        const topIcon = document.getElementById('audio-icon');
        const hudBtn = document.getElementById('hud-audio-toggle');
        if (topIcon) topIcon.textContent = icon;
        if (hudBtn) hudBtn.textContent = icon;
    }
    
    stop() {
        if (this.bgm) {
            this.bgm.pause();
            this.bgm.currentTime = 0;
        }
        this.isPlaying = false;
    }
}

export const AudioSys = new AudioManager();

