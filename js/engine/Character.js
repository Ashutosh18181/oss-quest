/**
 * OSS Quest — Character (Image-Based)
 * Handles player movement logic and draws a portrait-badge top-down marker.
 */

import { Assets } from './AssetLoader.js';

// The generated player.png is a 4-pose sheet (front, back, left, left) at 1536x1024.
// Each pose is 384px wide. We use the front-facing pose (index 0) as a round badge
// for all directions — the sheet isn't true top-down art, so we don't attempt to
// swap poses by facing; a small direction arrow below still communicates movement.
const FRAME_W = 384;
const FRAME_H = 1024;

export class Character {
    constructor(x, y) {
        this.px = x;
        this.py = y;
        this.vx = 0;
        this.vy = 0;
        this.speed = 250;
        this.facing = 'down';
    }

    setVelocity(dx, dy) {
        // Normalize diagonal speed
        if (dx !== 0 && dy !== 0) {
            const length = Math.sqrt(dx*dx + dy*dy);
            dx /= length;
            dy /= length;
        }
        this.vx = dx * this.speed;
        this.vy = dy * this.speed;

        if (dx > 0) this.facing = 'right';
        else if (dx < 0) this.facing = 'left';
        else if (dy > 0) this.facing = 'down';
        else if (dy < 0) this.facing = 'up';
    }

    update(dt) {
        // Position update and boundary checking is now handled centrally in VillageScene
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.px, this.py);

        // Ground shadow so the badge reads as standing in the world, not floating
        ctx.beginPath();
        ctx.ellipse(0, 16, 16, 6, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.28)';
        ctx.fill();

        const img = Assets.getImage('player_sprite');
        
        if (img) {
            ctx.save();
            // Assuming 1024x1024 single sprite
            const targetH = 96;
            const scale = targetH / img.height;
            const targetW = img.width * scale;
            
            // Subtle bounce animation while moving
            let bounceY = 0;
            if (this.vx !== 0 || this.vy !== 0) {
                bounceY = Math.sin(performance.now() / 100) * 3;
            }
            
            // Flip horizontally if facing left
            if (this.facing === 'left') {
                ctx.scale(-1, 1);
            }
            
            ctx.drawImage(img, 0, 0, img.width, img.height, -targetW / 2, -targetH / 2 + bounceY, targetW, targetH);
            ctx.restore();
        } else {
            // Fallback if the image hasn't loaded for some reason
            ctx.beginPath();
            ctx.arc(0, 0, 12, 0, Math.PI * 2);
            ctx.fillStyle = '#6EB5D6';
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#21201C';
            ctx.stroke();
            
            // Small facing arrow beneath the badge so direction is still readable
            const radius = 17;
            ctx.fillStyle = '#21201C';
            const ax = 0, ay = radius + 8;
            if (this.facing === 'up') ctx.fillRect(-4, ay - 24, 8, 4);
            if (this.facing === 'down') ctx.fillRect(-4, ay, 8, 4);
            if (this.facing === 'left') ctx.fillRect(-radius - 8, -2, 4, 4);
            if (this.facing === 'right') ctx.fillRect(radius + 4, -2, 4, 4);
        }

        ctx.restore();
    }
}
