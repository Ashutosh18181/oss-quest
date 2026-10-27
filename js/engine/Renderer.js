/**
 * OSS Quest — Renderer (Image-Based Rewrite)
 * Handles rendering the village background image with a moving camera viewport.
 * Supports layers: background, structures, NPCs, player, animals, overlays.
 */

import { Assets } from './AssetLoader.js';

export class Renderer {
    /**
     * @param {HTMLCanvasElement} canvas
     */
    constructor(canvas) {
        this.canvas = canvas;
        this.ctx = canvas.getContext('2d');
        
        this.villageDef = null; // Passed from VillageScene
        
        // Render layers
        this.layers = {
            npcs: [],         // NPC[]
            player: null,     // Character
            structures: [],   // Structure[]
            animals: []       // Animal[]
        };

        this._running = false;
        this._lastTime = 0;
        this._updateCallbacks = [];
        this._drawCallbacks = [];
        
        this.camX = 0;
        this.camY = 0;

        this._setupCanvas();
        window.addEventListener('resize', () => this._setupCanvas());
    }

    /** Set up canvas size and HiDPI scaling to fill viewport. */
    _setupCanvas() {
        const dpr = window.devicePixelRatio || 1;
        const displayW = window.innerWidth;
        const displayH = window.innerHeight;

        this.canvas.style.width = displayW + 'px';
        this.canvas.style.height = displayH + 'px';

        this.canvas.width = displayW * dpr;
        this.canvas.height = displayH * dpr;

        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.ctx.imageSmoothingEnabled = true; // Enabled for beautiful generated backgrounds
    }

    setCameraTarget(px, py) {
        const displayW = window.innerWidth;
        const displayH = window.innerHeight;
        
        let targetX = px - displayW / 2;
        let targetY = py - displayH / 2;
        
        // Clamp camera to image boundaries
        if (this.villageDef) {
            const maxX = this.villageDef.width - displayW;
            const maxY = this.villageDef.height - displayH;
            
            if (targetX < 0) targetX = 0;
            if (targetX > maxX) targetX = Math.max(0, maxX);
            if (targetY < 0) targetY = 0;
            if (targetY > maxY) targetY = Math.max(0, maxY);
        }
        
        // Smooth camera follow
        this.camX += (targetX - this.camX) * 0.1;
        this.camY += (targetY - this.camY) * 0.1;
    }

    /** Register an update callback. */
    onUpdate(fn) {
        this._updateCallbacks.push(fn);
    }
    
    /** Register an extra draw callback (e.g. for interaction prompts). */
    onDraw(fn) {
        this._drawCallbacks.push(fn);
    }

    /** Start the render loop. */
    start() {
        if (this._running) return;
        this._running = true;
        this._lastTime = performance.now();
        this._setupCanvas(); 
        this._loop();
    }

    /** Stop the render loop. */
    stop() {
        this._running = false;
    }

    /** Main loop. */
    _loop() {
        if (!this._running) return;

        const now = performance.now();
        const dt = now - this._lastTime;
        this._lastTime = now;

        const safeDt = Math.min(dt, 50);

        for (const cb of this._updateCallbacks) {
            cb(safeDt);
        }

        this._render();
        requestAnimationFrame(() => this._loop());
    }

    /** Render all layers. */
    _render() {
        const ctx = this.ctx;

        // 1. Clear background
        ctx.fillStyle = '#000';
        ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);

        ctx.save();
        
        // 2. Apply Camera Transform
        const camX = Math.round(this.camX);
        const camY = Math.round(this.camY);
        ctx.translate(-camX, -camY);

        // 3. Draw Background Image
        if (this.villageDef) {
            const bgImg = Assets.getImage(this.villageDef.image);
            if (bgImg) {
                ctx.drawImage(bgImg, 0, 0);
            }
        }
        
        // For debugging boundaries (can comment out later)
        // if (this.villageDef && this.villageDef.bounds) {
        //    const b = this.villageDef.bounds;
        //    ctx.strokeStyle = 'red';
        //    ctx.strokeRect(b.minX, b.minY, b.maxX - b.minX, b.maxY - b.minY);
        // }

        // 4. Sort and Draw Entities (Animals, Structures, NPCs, Player) by Y position
        const entities = [...this.layers.npcs, ...this.layers.animals, ...this.layers.structures];
        if (this.layers.player) {
            entities.push(this.layers.player);
        }
        
        entities.sort((a, b) => a.py - b.py);
        
        for (const entity of entities) {
            entity.draw(ctx);
        }

        // 5. Draw extra overlays (interaction prompts)
        for (const cb of this._drawCallbacks) {
            cb(ctx);
        }

        ctx.restore();
    }

    destroy() {
        this.stop();
        this._updateCallbacks = [];
        this._drawCallbacks = [];
    }
}
