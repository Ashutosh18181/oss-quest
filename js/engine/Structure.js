/**
 * OSS Quest — Structure
 * Buildable structures on the camp, each representing a real data signal.
 * Drawn as pixel-art buildings seen from above with grow-in animation.
 */

const STRUCTURE_DEFS = {
    readme: {
        name: 'README',
        icon: '📖',
        baseColor: '#8B6914',
        roofColor: '#6B4F12',
        accentColor: '#C89B3C',
        width: 120, 
        height: 120,
    },
    issues: {
        name: 'Issues',
        icon: '📋',
        baseColor: '#6B5B4A',
        roofColor: '#4A3F35',
        accentColor: '#B4502A',
        width: 120,
        height: 120,
    },
    goodFirstIssue: {
        name: 'Good First Issue',
        icon: '🏳️',
        baseColor: '#7B5EA7',
        roofColor: '#5A4080',
        accentColor: '#A88BCC',
        width: 120,
        height: 120,
    },
    contributing: {
        name: 'Contributing Guide',
        icon: '🪧',
        baseColor: '#5A7A5E',
        roofColor: '#3D5A40',
        accentColor: '#88B08C',
        width: 120,
        height: 120,
    },
    maintainerActivity: {
        name: 'Maintainer Activity',
        icon: '🔥',
        baseColor: '#8B4513',
        roofColor: '#6B3410',
        accentColor: '#FF8C42',
        width: 120,
        height: 120,
    },
    ciStatus: {
        name: 'CI Status',
        icon: '🗼',
        baseColor: '#4A6E8B',
        roofColor: '#345570',
        accentColor: '#6EB5D6',
        width: 120,
        height: 120,
    },
};

export class Structure {
    constructor(type, px, py, size, data = {}) {
        this.type = type;
        this.def = STRUCTURE_DEFS[type] || STRUCTURE_DEFS.readme;
        this.px = px;
        this.py = py;
        this.w = this.def.width;
        this.h = this.def.height;
        this.data = data;

        this.revealed = false;
        this.scale = 0;
        this.targetScale = 1;
        this._animating = false;
        this._animDuration = 500;
        this._animElapsed = 0;

        this.label = data.label || this.def.name;
        this.sublabel = data.sublabel || '';
    }

    reveal() {
        return new Promise((resolve) => {
            this.revealed = true;
            this._animating = true;
            this._animElapsed = 0;
            this._onRevealed = resolve;
        });
    }

    update(dt) {
        if (!this._animating) return;

        this._animElapsed += dt;
        const progress = Math.min(this._animElapsed / this._animDuration, 1);
        this.scale = bounceEaseOut(progress) * this.targetScale;

        if (progress >= 1) {
            this.scale = this.targetScale;
            this._animating = false;
            if (this._onRevealed) this._onRevealed();
        }
    }

    draw(ctx) {
        if (!this.revealed || this.scale <= 0) return;

        const cx = this.px;
        const cy = this.py;

        ctx.save();
        ctx.translate(cx, cy);
        ctx.scale(this.scale, this.scale);
        ctx.translate(-cx, -cy);

        this._drawBuilding(ctx);
        this._drawLabel(ctx);

        ctx.restore();
    }

    _drawBuilding(ctx) {
        const px = this.px - this.w / 2;
        const py = this.py - this.h / 2;
        const w = this.w;
        const h = this.h;
        const ox = 4;
        const oy = 4;

        ctx.fillStyle = 'rgba(0,0,0,0.2)';
        ctx.fillRect(px + ox + 3, py + oy + 3, w, h);

        ctx.fillStyle = this.def.baseColor;
        ctx.fillRect(px + ox, py + oy, w, h);

        ctx.strokeStyle = '#21201C';
        ctx.lineWidth = 2;
        ctx.strokeRect(px + ox, py + oy, w, h);

        ctx.fillStyle = this.def.roofColor;
        ctx.fillRect(px + ox, py + oy, w, h * 0.35);

        ctx.strokeStyle = '#21201C';
        ctx.lineWidth = 1;
        ctx.beginPath();
        ctx.moveTo(px + ox, py + oy + h * 0.35);
        ctx.lineTo(px + ox + w, py + oy + h * 0.35);
        ctx.stroke();

        this._drawDetail(ctx, px + ox, py + oy, w, h);

        ctx.fillStyle = this.def.accentColor;
        ctx.fillRect(px + ox + w - 8, py + oy + 2, 6, 6);
    }

    _drawDetail(ctx, x, y, w, h) {
        const centerX = x + w / 2;
        const detailY = y + h * 0.45;

        switch (this.type) {
            case 'readme':
                ctx.fillStyle = '#e8d8b0';
                ctx.fillRect(x + 10, detailY, w - 20, 6);
                ctx.fillRect(x + 10, detailY + 12, w - 24, 6);
                ctx.fillRect(x + 10, detailY + 24, w - 20, 6);
                break;
            case 'issues':
                ctx.fillStyle = '#e8d8b0';
                const count = Math.min(this.data.count || 3, 5);
                for (let i = 0; i < count; i++) {
                    ctx.fillRect(x + 12 + i * 12, detailY, 6, 24);
                }
                break;
            case 'goodFirstIssue':
                ctx.fillStyle = '#A88BCC';
                ctx.fillRect(centerX - 2, detailY - 4, 6, 32);
                ctx.fillStyle = '#7B5EA7';
                ctx.fillRect(centerX + 4, detailY, 20, 14);
                break;
            case 'contributing':
                ctx.fillStyle = '#88B08C';
                ctx.fillRect(centerX - 2, detailY, 6, 28);
                ctx.fillRect(centerX - 16, detailY + 4, 32, 12);
                break;
            case 'maintainerActivity':
                ctx.fillStyle = '#FF8C42';
                ctx.fillRect(centerX - 8, detailY + 8, 6, 12);
                ctx.fillRect(centerX, detailY + 4, 6, 16);
                ctx.fillRect(centerX + 8, detailY + 10, 6, 10);
                ctx.fillStyle = '#FFD700';
                ctx.fillRect(centerX - 4, detailY + 12, 4, 6);
                ctx.fillRect(centerX + 4, detailY + 10, 4, 8);
                break;
            case 'ciStatus':
                ctx.fillStyle = this.data.passing ? '#4C6650' : '#C44B3F';
                ctx.fillRect(centerX - 2, detailY, 6, 28);
                ctx.fillRect(centerX + 4, detailY, 16, 10);
                break;
        }
    }

    _drawLabel(ctx) {
        if (this.scale < 0.9) return;

        const cx = this.px;
        const bottom = this.py + this.h / 2 + 10;

        ctx.font = 'bold 12px "Space Mono", monospace';
        ctx.textAlign = 'center';
        const metrics = ctx.measureText(this.label);
        const lw = metrics.width + 16;
        const lh = 20;

        ctx.fillStyle = 'rgba(250,248,244,0.92)';
        ctx.fillRect(cx - lw/2, bottom, lw, lh);
        ctx.strokeStyle = '#21201C';
        ctx.lineWidth = 1;
        ctx.strokeRect(cx - lw/2, bottom, lw, lh);

        ctx.fillStyle = '#21201C';
        ctx.fillText(this.label, cx, bottom + 14);

        if (this.sublabel) {
            ctx.font = '10px "Space Mono", monospace';
            ctx.fillStyle = '#6a6a6a';
            ctx.fillText(this.sublabel, cx, bottom + lh + 14);
        }
    }
}

function bounceEaseOut(t) {
    const n1 = 7.5625;
    const d1 = 2.75;
    if (t < 1 / d1) {
        return n1 * t * t;
    } else if (t < 2 / d1) {
        return n1 * (t -= 1.5 / d1) * t + 0.75;
    } else if (t < 2.5 / d1) {
        return n1 * (t -= 2.25 / d1) * t + 0.9375;
    } else {
        return n1 * (t -= 2.625 / d1) * t + 0.984375;
    }
}
