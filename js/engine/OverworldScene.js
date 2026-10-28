/**
 * OSS Quest — Overworld Scene (Image-Based)
 * Displays the static overworld map with clickable village nodes.
 */

import { OVERWORLD } from '../data/village.js';
import { loadProgress, getLanguage } from '../services/progress.js';
import { Assets } from './AssetLoader.js';
import { TouchControls } from './TouchControls.js';

export class OverworldScene {
    constructor(sceneManager) {
        this.sceneManager = sceneManager;
        this.container = document.getElementById('village-container');
        this.canvas = document.getElementById('village-canvas');
        this.ctx = this.canvas.getContext('2d');
        
        this._running = false;
        this._onClick = this._handleClick.bind(this);
        this.progress = loadProgress();
        this.playerPos = { x: 0, y: 0 };
        
        this.hoverNode = null;
        this._onMouseMove = this._handleMouseMove.bind(this);

        this.keys = { w: false, a: false, s: false, d: false, ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
        this._keydownHandler = this._handleKeydown.bind(this);
        this._keyupHandler = this._handleKeyup.bind(this);
        
        this.speed = 150; // pixels per second
        this.facing = 'down';
        this.touchControls = null;

        this._langListener = () => this._updateHUD();
    }

    async start() {
        if (!this.container || !this.canvas) return;
        this.container.style.display = 'block';
        
        this._setupCanvas();
        window.addEventListener('resize', () => this._setupCanvas());
        this.canvas.addEventListener('click', this._onClick);
        this.canvas.addEventListener('mousemove', this._onMouseMove);
        window.addEventListener('keydown', this._keydownHandler);
        window.addEventListener('keyup', this._keyupHandler);
        window.addEventListener('language-changed', this._langListener);

        // Mobile / Touch controls
        this.touchControls = new TouchControls();
        this.touchControls.show();
        
        // Find highest unlocked chapter to place player marker
        let maxUnlocked = 0;
        for (let i = 1; i <= 6; i++) {
            if (this.progress.chapters[i] === 'done') maxUnlocked = i;
            else if (this.progress.chapters[i] === 'active') {
                if (maxUnlocked < i - 1) maxUnlocked = i - 1; 
                break;
            }
        }
        
        const startNodeId = maxUnlocked > 0 ? maxUnlocked : 1;
        const startNode = OVERWORLD.nodes.find(n => n.id === startNodeId) || OVERWORLD.nodes[0];
        
        this.playerPos.x = startNode.x;
        this.playerPos.y = startNode.y;

        this._updateHUD();

        this._running = true;
        this._lastTime = performance.now();
        this._loop();
    }

    _updateHUD() {
        this.progress = loadProgress();
        const lang = getLanguage();
        const titleEl = document.getElementById('quest-hud-title');
        const progEl = document.getElementById('quest-hud-progress');
        const fillEl = document.getElementById('quest-hud-energy-fill');
        
        let doneCount = 0;
        let activeChapterId = 1;
        for (let i = 1; i <= 6; i++) {
            if (this.progress?.chapters?.[i] === 'done') {
                doneCount++;
            } else if (this.progress?.chapters?.[i] === 'active') {
                if (activeChapterId === 1) activeChapterId = i;
            }
        }
        
        const pct = Math.round((doneCount / 6) * 100);
        if (fillEl) fillEl.style.width = `${pct}%`;

        if (titleEl && progEl) {
            if (lang === 'hi') {
                titleEl.textContent = `अध्याय ${activeChapterId}: विश्व मानचित्र`;
                progEl.textContent = `${doneCount}/6 गाँव पूरे · आगे बढ़ें`;
            } else if (lang === 'od') {
                titleEl.textContent = `ଅଧ୍ୟାୟ ${activeChapterId}: ବିଶ୍ୱ ମାନଚିତ୍ର`;
                progEl.textContent = `${doneCount}/6 ଗାଁ ସମ୍ପୂର୍ଣ୍ଣ · ଆଗକୁ ଚାଲନ୍ତୁ`;
            } else {
                titleEl.textContent = `Chapter ${activeChapterId}: World Map`;
                progEl.textContent = `${doneCount}/6 villages complete · Explore`;
            }
        }

        const hintBar = document.querySelector('.controls-hint-bar');
        const isTouch = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 840);
        if (hintBar) {
            if (isTouch) {
                if (lang === 'hi') hintBar.innerHTML = "D-pad — चलें &nbsp;&middot;&nbsp; E / टैप — प्रवेश करें";
                else if (lang === 'od') hintBar.innerHTML = "D-pad — ଚାଲନ୍ତୁ &nbsp;&middot;&nbsp; E / ଟ୍ୟାପ୍ — ପ୍ରବେଶ";
                else hintBar.innerHTML = "D-pad — move &nbsp;&middot;&nbsp; E / tap — enter";
            } else {
                if (lang === 'hi') hintBar.innerHTML = "WASD / तीर — चलें &nbsp;&middot;&nbsp; E — प्रवेश करें";
                else if (lang === 'od') hintBar.innerHTML = "WASD / ତୀର — ଚାଲନ୍ତୁ &nbsp;&middot;&nbsp; E — ପ୍ରବେଶ କରନ୍ତୁ";
                else hintBar.innerHTML = "WASD / arrows — move &nbsp;&middot;&nbsp; E — enter";
            }
        }

        // Overworld has no atmosphere toast; clear any leftover village atmosphere text
        const atmoEl = document.getElementById('atmosphere-text');
        if (atmoEl) {
            atmoEl.style.opacity = '0';
            atmoEl.textContent = '';
        }
    }

    _setupCanvas() {
        const dpr = window.devicePixelRatio || 1;
        this.canvas.style.width = window.innerWidth + 'px';
        this.canvas.style.height = window.innerHeight + 'px';
        this.canvas.width = window.innerWidth * dpr;
        this.canvas.height = window.innerHeight * dpr;
        this.ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
        this.ctx.imageSmoothingEnabled = true;
    }

    _isUnlocked(nodeId) {
        return true; // DEMO HACK: all villages unlocked
    }

    _getScaleAndOffset() {
        // Fit image into canvas maintaining aspect ratio
        const img = Assets.getImage('overworld');
        if (!img) return { scale: 1, ox: 0, oy: 0 };
        
        const scale = Math.min(window.innerWidth / img.width, window.innerHeight / img.height);
        const ox = (window.innerWidth - img.width * scale) / 2;
        const oy = (window.innerHeight - img.height * scale) / 2;
        
        return { scale, ox, oy };
    }

    _handleMouseMove(e) {
        // Kept for backward compatibility, though not used for movement anymore
        const rect = this.canvas.getBoundingClientRect();
        const mouseX = e.clientX - rect.left;
        const mouseY = e.clientY - rect.top;
        
        const { scale, ox, oy } = this._getScaleAndOffset();
        const imgX = (mouseX - ox) / scale;
        const imgY = (mouseY - oy) / scale;
        
        this.hoverNode = null;
        for (const node of OVERWORLD.nodes) {
            const dist = Math.sqrt((imgX - node.x)**2 + (imgY - node.y)**2);
            if (dist < 40) {
                this.hoverNode = node;
                break;
            }
        }
        
        if (this.hoverNode && this._isUnlocked(this.hoverNode.id)) {
            this.canvas.style.cursor = 'pointer';
        } else {
            this.canvas.style.cursor = 'default';
        }
    }

    _handleClick(e) {
        // Direct click to enter any unlocked node on the world map
        if (this.hoverNode && this._isUnlocked(this.hoverNode.id)) {
            this._running = false;
            this.sceneManager.loadScene('village', { villageId: this.hoverNode.id });
        }
    }

    _handleKeydown(e) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }
        if (this.keys.hasOwnProperty(e.key)) this.keys[e.key] = true;
        
        if (e.key.toLowerCase() === 'e') {
            for (const node of OVERWORLD.nodes) {
                const dist = Math.sqrt((node.x - this.playerPos.x)**2 + (node.y - this.playerPos.y)**2);
                if (dist < 50 && this._isUnlocked(node.id)) {
                    this._running = false;
                    this.sceneManager.loadScene('village', { villageId: node.id });
                    break;
                }
            }
        }
    }

    _handleKeyup(e) {
        if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
            e.preventDefault();
        }
        if (this.keys.hasOwnProperty(e.key)) this.keys[e.key] = false;
    }

    _loop() {
        if (!this._running) return;
        
        const now = performance.now();
        const dt = now - this._lastTime;
        this._lastTime = now;
        
        this._update(dt);
        this._draw();
        
        requestAnimationFrame(() => this._loop());
    }

    _update(dt) {
        let dx = 0; let dy = 0;
        if (this.keys.w || this.keys.ArrowUp) dy -= 1;
        if (this.keys.s || this.keys.ArrowDown) dy += 1;
        if (this.keys.a || this.keys.ArrowLeft) dx -= 1;
        if (this.keys.d || this.keys.ArrowRight) dx += 1;

        if (dx !== 0 && dy !== 0) {
            const length = Math.sqrt(dx*dx + dy*dy);
            dx /= length;
            dy /= length;
        }

        if (dx > 0) this.facing = 'right';
        else if (dx < 0) this.facing = 'left';
        else if (dy > 0) this.facing = 'down';
        else if (dy < 0) this.facing = 'up';

        this.playerPos.x += dx * this.speed * (dt / 1000);
        this.playerPos.y += dy * this.speed * (dt / 1000);
        
        // Clamp to image bounds
        const img = Assets.getImage('overworld');
        if (img) {
            if (this.playerPos.x < 0) this.playerPos.x = 0;
            if (this.playerPos.x > img.width) this.playerPos.x = img.width;
            if (this.playerPos.y < 0) this.playerPos.y = 0;
            if (this.playerPos.y > img.height) this.playerPos.y = img.height;
        }
    }

    _draw() {
        const { scale, ox, oy } = this._getScaleAndOffset();
        const img = Assets.getImage('overworld');
        
        this.ctx.fillStyle = '#111';
        this.ctx.fillRect(0, 0, this.canvas.width, this.canvas.height);
        
        if (!img) return;
        
        this.ctx.save();
        this.ctx.translate(ox, oy);
        this.ctx.scale(scale, scale);
        
        this.ctx.drawImage(img, 0, 0);
        
        let nearestNode = null;
        let nearestDist = Infinity;

        // Draw Nodes
        for (const node of OVERWORLD.nodes) {
            const unlocked = this._isUnlocked(node.id);
            const isDone = this.progress.chapters[node.id] === 'done';
            
            const dist = Math.sqrt((node.x - this.playerPos.x)**2 + (node.y - this.playerPos.y)**2);
            if (dist < 50 && unlocked) {
                nearestNode = node;
                nearestDist = dist;
            }

            // Soft glow behind the badge so it pops against busy background art
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, 22, 0, Math.PI * 2);
            this.ctx.fillStyle = unlocked ? 'rgba(232, 163, 61, 0.35)' : 'rgba(20, 20, 20, 0.35)';
            this.ctx.fill();

            // Main badge — always a solid, visible fill (never near-invisible dark blob)
            this.ctx.beginPath();
            this.ctx.arc(node.x, node.y, 16, 0, Math.PI * 2);
            this.ctx.fillStyle = isDone ? '#5B9468' : (unlocked ? '#E8A33D' : '#6b7280');
            this.ctx.fill();
            this.ctx.lineWidth = 3;
            this.ctx.strokeStyle = '#FAF8F4';
            this.ctx.stroke();
            this.ctx.lineWidth = 1.5;
            this.ctx.strokeStyle = '#21201C';
            this.ctx.stroke();

            // Icon: checkmark / number / lock, so state reads at a glance
            this.ctx.fillStyle = '#21201C';
            this.ctx.font = 'bold 14px "Space Mono", monospace';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            if (isDone) {
                this.ctx.fillText('✓', node.x, node.y + 1);
            } else if (unlocked) {
                this.ctx.fillText(String(node.id), node.x, node.y + 1);
            } else {
                this.ctx.fillText('🔒', node.x, node.y + 1);
            }

            // Always-visible label pill below the node (not hover-only)
            const lang = getLanguage();
            let labelText = node.name;
            if (lang === 'hi' && node.name_hi) labelText = node.name_hi;
            else if (lang === 'od' && node.name_od) labelText = node.name_od;

            this.ctx.font = 'bold 12px "Space Mono", monospace';
            const w = this.ctx.measureText(labelText).width + 18;
            this.ctx.fillStyle = 'rgba(33, 32, 28, 0.85)';
            this.ctx.fillRect(node.x - w / 2, node.y + 22, w, 22);
            this.ctx.fillStyle = unlocked ? '#FAF8F4' : '#c9c4b6';
            this.ctx.fillText(labelText, node.x, node.y + 33);
            this.ctx.textBaseline = 'alphabetic';

            // Extra highlight ring on hover, on top of the always-visible badge
            if ((this.hoverNode === node || nearestNode === node) && unlocked) {
                this.ctx.beginPath();
                this.ctx.arc(node.x, node.y, 20, 0, Math.PI * 2);
                this.ctx.lineWidth = 2;
                this.ctx.strokeStyle = '#FAF8F4';
                this.ctx.setLineDash([4, 3]);
                this.ctx.stroke();
                this.ctx.setLineDash([]);
            }
        }

        // Demo-Friendly Guide: Highlight The Forge (Node 1) if Chapter 1 is active/pending
        const forgeNode = OVERWORLD.nodes.find(n => n.id === 1);
        const isForgePending = this.progress?.chapters?.[1] !== 'done';
        if (forgeNode && isForgePending) {
            const time = performance.now();
            const pulse = (time % 1600) / 1600;

            this.ctx.save();
            // 1. Pulsing golden radar wave around The Forge
            this.ctx.beginPath();
            this.ctx.arc(forgeNode.x, forgeNode.y, 16 + pulse * 32, 0, Math.PI * 2);
            this.ctx.strokeStyle = `rgba(255, 215, 0, ${1 - pulse})`;
            this.ctx.lineWidth = 2.5;
            this.ctx.stroke();

            // 2. Animated floating beacon arrow
            const bounce = Math.sin(time / 180) * 6;
            const arrowY = forgeNode.y - 42 + bounce;
            this.ctx.fillStyle = '#FFD700';
            this.ctx.beginPath();
            this.ctx.moveTo(forgeNode.x - 10, arrowY - 14);
            this.ctx.lineTo(forgeNode.x + 10, arrowY - 14);
            this.ctx.lineTo(forgeNode.x, arrowY);
            this.ctx.closePath();
            this.ctx.fill();
            this.ctx.strokeStyle = '#21201C';
            this.ctx.lineWidth = 2;
            this.ctx.stroke();

            // 3. Floating quest banner: "Start by talking to Borin the Blacksmith"
            const lang = getLanguage();
            let guideText = "⚔️ Start by talking to Borin the Blacksmith at The Forge";
            if (lang === 'hi') guideText = "⚔️ फ़ोर्ज में लोहार बोरिन से बात करके शुरुआत करें";
            else if (lang === 'od') guideText = "⚔️ ଫୋର୍ଜରେ କମାର ବୋରିନ୍ ସହ କଥା ହୋଇ ଆରମ୍ଭ କରନ୍ତୁ";

            this.ctx.font = 'bold 12px "Space Mono", monospace';
            const gw = this.ctx.measureText(guideText).width + 24;
            const gx = forgeNode.x - gw / 2;
            const gy = arrowY - 42;

            // Banner shadow
            this.ctx.fillStyle = 'rgba(0, 0, 0, 0.45)';
            if (this.ctx.roundRect) this.ctx.roundRect(gx + 2, gy + 3, gw, 28, 8);
            else this.ctx.rect(gx + 2, gy + 3, gw, 28);
            this.ctx.fill();

            // Banner background
            this.ctx.fillStyle = '#21201C';
            if (this.ctx.roundRect) this.ctx.roundRect(gx, gy, gw, 28, 8);
            else this.ctx.rect(gx, gy, gw, 28);
            this.ctx.fill();

            // Golden border
            this.ctx.strokeStyle = '#FFD700';
            this.ctx.lineWidth = 1.8;
            this.ctx.stroke();

            // Banner text
            this.ctx.fillStyle = '#FFD700';
            this.ctx.textAlign = 'center';
            this.ctx.textBaseline = 'middle';
            this.ctx.fillText(guideText, forgeNode.x, gy + 14);
            this.ctx.restore();
        }
        
        // Draw Player Marker using player_sprite
        this.ctx.save();
        this.ctx.translate(this.playerPos.x, this.playerPos.y);

        this.ctx.beginPath();
        this.ctx.ellipse(0, 16, 16, 6, 0, 0, Math.PI * 2);
        this.ctx.fillStyle = 'rgba(0,0,0,0.28)';
        this.ctx.fill();

        const playerImg = Assets.getImage('player_sprite');
        if (playerImg) {
            const targetH = 80;
            const targetW = playerImg.width * (targetH / playerImg.height);
            
            let bounceY = 0;
            if (this.keys.w || this.keys.a || this.keys.s || this.keys.d || this.keys.ArrowUp || this.keys.ArrowDown || this.keys.ArrowLeft || this.keys.ArrowRight) {
                bounceY = Math.sin(performance.now() / 100) * 3;
            }

            if (this.facing === 'left') {
                this.ctx.scale(-1, 1);
            }
            this.ctx.drawImage(playerImg, 0, 0, playerImg.width, playerImg.height, -targetW / 2, -targetH / 2 + bounceY, targetW, targetH);
        } else {
            this.ctx.beginPath();
            this.ctx.arc(0, 0, 10, 0, Math.PI*2);
            this.ctx.fillStyle = '#6EB5D6';
            this.ctx.fill();
            this.ctx.strokeStyle = '#21201C';
            this.ctx.lineWidth = 3;
            this.ctx.stroke();
        }
        this.ctx.restore();

        // Draw interaction prompt if near a node
        if (nearestNode) {
            const lang = getLanguage();
            let nodeName = nearestNode.name;
            if (lang === 'hi' && nearestNode.name_hi) nodeName = nearestNode.name_hi;
            else if (lang === 'od' && nearestNode.name_od) nodeName = nearestNode.name_od;

            let text = "E — Enter " + nodeName;
            if (lang === 'hi') text = `E — ${nodeName} में प्रवेश करें`;
            else if (lang === 'od') text = `E — ${nodeName} ରେ ପ୍ରବେଶ କରନ୍ତୁ`;

            this.ctx.font = 'bold 12px "Space Mono", monospace';
            const w = this.ctx.measureText(text).width + 16;
            this.ctx.fillStyle = '#21201C';
            this.ctx.fillRect(this.playerPos.x - w/2, this.playerPos.y - 45, w, 24);
            this.ctx.fillStyle = '#FAF8F4';
            this.ctx.textAlign = 'center';
            this.ctx.fillText(text, this.playerPos.x, this.playerPos.y - 29);
        }

        this.ctx.restore();
    }

    destroy() {
        this._running = false;
        this.canvas.removeEventListener('click', this._onClick);
        this.canvas.removeEventListener('mousemove', this._onMouseMove);
        window.removeEventListener('keydown', this._keydownHandler);
        window.removeEventListener('keyup', this._keyupHandler);
        if (this.touchControls) {
            this.touchControls.destroy();
            this.touchControls = null;
        }
        if (this._langListener) {
            window.removeEventListener('language-changed', this._langListener);
        }
    }
}
