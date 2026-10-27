/**
 * OSS Quest — Animal
 * Uses a sprite sheet for animation.
 */

import { Assets } from './AssetLoader.js';

export class Animal {
    constructor(x, y) {
        this.px = x;
        this.py = y;
        this.vx = 20; // slow walk
        
        // Animation state
        this.frameTimer = 0;
        this.frameIndex = 0;
        this.frameDuration = 250; // ms per frame
        
        this.startX = x;
    }

    update(dt) {
        this.px += this.vx * (dt/1000);
        
        // Simple pacing
        if (this.px > this.startX + 100) {
            this.vx = -20;
        } else if (this.px < this.startX - 100) {
            this.vx = 20;
        }
        
        this.frameTimer += dt;
        if (this.frameTimer >= this.frameDuration) {
            this.frameTimer -= this.frameDuration;
            this.frameIndex = (this.frameIndex + 1) % 3; // 3 frames
        }
    }

    draw(ctx) {
        const img = Assets.getImage('cat_sprite');
        if (!img) return;

        // Automatically calculate frame size (assume 3 frames horizontally)
        const frameW = img.width / 3;
        const frameH = img.height;
        const sx = this.frameIndex * frameW;
        
        ctx.save();
        ctx.translate(this.px, this.py);
        
        // Target height ~72px
        const scale = 72 / frameH;
        
        // Flip if walking left
        if (this.vx < 0) {
            ctx.scale(-1, 1);
        }
        
        ctx.drawImage(img, sx, 0, frameW, frameH, -frameW/2 * scale, -frameH/2 * scale, frameW * scale, frameH * scale);
        
        ctx.restore();
    }
}
