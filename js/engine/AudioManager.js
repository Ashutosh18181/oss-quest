/**
 * OSS Quest — Audio Manager
 * Handles ambient looping background music.
 */

export class AudioManager {
    constructor() {
        this.bgm = new Audio('assets/background.mp3');
        this.bgm.loop = true;
        this.bgm.volume = 1.0;
        this.isPlaying = false;
        
        // Robust fallback: if audio was blocked on load, this will start it 
        // the moment the user clicks or presses any key.
        const unlock = () => {
            if (this.isPlaying) return;
            this.bgm.play().then(() => {
                this.isPlaying = true;
                // Success! We can remove these listeners now.
                document.removeEventListener('click', unlock);
                document.removeEventListener('keydown', unlock);
            }).catch(() => {}); // If it still fails, keep the listeners active
        };
        document.addEventListener('click', unlock);
        document.addEventListener('keydown', unlock);
    }
    
    playTheme(themeName) {
        console.log(`[Audio] Playing background track: ${themeName}`);
        if (!this.isPlaying) {
            this.bgm.play().then(() => {
                this.isPlaying = true;
            }).catch(e => {
                console.warn("Browser blocked autoplay:", e);
                // DO NOT set isPlaying = true here, so the 'unlock' listeners can handle it!
                this.isPlaying = false;
            });
        }
    }
    
    playSound(soundId) {
        console.log(`[Audio] Playing sound effect: ${soundId}`);
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
