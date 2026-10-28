/**
 * OSS Quest — NPC (Image-Based)
 */

import { Assets } from './AssetLoader.js';

export class NPC {
    constructor(def) {
        this.id = def.id;
        this.name = def.name;
        this.chapterId = def.chapterId;
        this.px = def.x;
        this.py = def.y;
        this.colors = def.colors || {};
        
        this.questState = 'locked'; // 'locked', 'available', 'complete'
        this.isPlayerNear = false;
        
        this.markerTimer = 0;
    }

    updateNPC(dt, player) {
        this.markerTimer += dt;
        
        // Check proximity using pixel distance (not tile distance)
        const dx = player.px - this.px;
        const dy = player.py - this.py;
        const dist = Math.sqrt(dx*dx + dy*dy);
        
        // Generous interaction radius so player doesn't have to overlap NPC sprite
        this.isPlayerNear = dist < 110; // 110px interaction radius (increased from 60px)
    }

    draw(ctx) {
        ctx.save();
        ctx.translate(this.px, this.py);

        // Ground shadow so the badge reads as standing in the world
        ctx.beginPath();
        ctx.ellipse(0, 16, 16, 6, 0, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(0,0,0,0.28)';
        ctx.fill();

        const radius = 17;
        // Attempt to load NPC-specific sprite (e.g. 'borin_sprite')
        let img = Assets.getImage(this.id + '_sprite');
        if (!img) img = Assets.getImage('borin_sprite'); // Fallback to borin_sprite

        if (img) {
            ctx.save();
            const targetH = 96;
            const scale = targetH / img.height;
            const targetW = img.width * scale;
            
            // Subtle idle breathing animation
            const breathe = Math.sin(performance.now() / 300) * 1.5;
            
            ctx.drawImage(img, 0, 0, img.width, img.height, -targetW / 2, -targetH / 2 + breathe, targetW, targetH);
            ctx.restore();
        } else {
            ctx.beginPath();
            ctx.arc(0, 0, 14, 0, Math.PI * 2);
            ctx.fillStyle = this.colors.shirt || '#B4502A';
            ctx.fill();
            ctx.lineWidth = 2;
            ctx.strokeStyle = '#21201C';
            ctx.stroke();
        }

        // Quest Indicator
        const bounce = Math.sin(this.markerTimer / 200) * 4;
        if (this.questState === 'available') {
            ctx.fillStyle = '#FFD700'; // Gold
            ctx.beginPath();
            ctx.arc(0, -radius - 13 + bounce, 5, 0, Math.PI*2);
            ctx.fill();
            ctx.strokeStyle = '#21201C';
            ctx.stroke();
        } else if (this.questState === 'complete') {
            ctx.fillStyle = '#C0C0C0'; // Silver
            ctx.beginPath();
            ctx.arc(0, -radius - 13, 4, 0, Math.PI*2);
            ctx.fill();
        }

        ctx.restore();
    }
}
