/**
 * OSS Quest — Village Scene (Image-Based)
 * Loads a specific village background and confines the player to walkable bounds.
 */

import { Character } from './Character.js';
import { NPC } from './NPC.js';
import { Renderer } from './Renderer.js';
import { DialogueSystem } from './DialogueSystem.js';
import { QuestHUD } from './QuestHUD.js';
import { Structure } from './Structure.js';
import { Animal } from './Animal.js';

import { VILLAGES, NPCS } from '../data/village.js';
import { loadProgress, completeChapter, getLanguage } from '../services/progress.js';
import { getRecommendedRepo } from '../services/github.js';
import { CHAPTERS } from '../data/chapters.js';
import { TerminalMinigame } from './TerminalMinigame.js';
import { AudioSys } from './AudioManager.js';

export class VillageScene {
    constructor(sceneManager, villageId) {
        this.sceneManager = sceneManager;
        this.villageId = villageId;
        this.villageDef = VILLAGES[villageId];
        
        this.container = document.getElementById('village-container');
        this.canvas = document.getElementById('village-canvas');
        
        this.player = null;
        this.renderer = null;
        this.dialogue = new DialogueSystem();
        this.hud = new QuestHUD();
        this.terminal = new TerminalMinigame();
        
        this.npcs = [];
        this.structures = []; 
        this.animals = []; // Add an animal or two here if needed
        
        this.keys = { w: false, a: false, s: false, d: false, ArrowUp: false, ArrowDown: false, ArrowLeft: false, ArrowRight: false };
        this._keydownHandler = this._handleKeydown.bind(this);
        this._keyupHandler = this._handleKeyup.bind(this);
        
        this.progress = loadProgress();
        this._activeNpc = null;
        this._isRevealingCamp = false;
        
        window.matchedRepoInfo = window.matchedRepoInfo || null;
    }

    async start() {
        if (!this.container || !this.canvas) return;
        this.container.style.display = 'block';

        this.player = new Character(this.villageDef.spawn.x, this.villageDef.spawn.y);
        this.player.speed = 250;
        
        // Spawn NPC
        if (this.villageDef.npcId) {
            const npcDef = NPCS[this.villageDef.npcId];
            const npc = new NPC({ ...npcDef, x: this.villageDef.npcPos.x, y: this.villageDef.npcPos.y });
            this.npcs.push(npc);
        }
        
        // Spawn an ambient animal as a test (e.g. at spawn + 100)
        this.animals.push(new Animal(this.villageDef.spawn.x + 100, this.villageDef.spawn.y - 100));

        this._updateNPCStates();
        
        this.renderer = new Renderer(this.canvas);
        this.renderer.villageDef = this.villageDef; // Pass def for bg rendering
        this.renderer.layers.player = this.player;
        this.renderer.layers.npcs = this.npcs;
        this.renderer.layers.structures = this.structures;
        this.renderer.layers.animals = this.animals;

        this.renderer.onUpdate((dt) => {
            if (this.dialogue.isOpen || this._isRevealingCamp || this.terminal.isOpen) {
                this.player.setVelocity(0, 0);
            } else {
                this._processInput();
            }
            
            // Custom bounds checking update
            this._updatePlayer(dt);
            
            let activeInteractable = null;
            for (const npc of this.npcs) {
                npc.updateNPC(dt, this.player);
                if (npc.isPlayerNear && npc.questState !== 'locked') {
                    activeInteractable = npc;
                }
            }
            this._activeNpc = activeInteractable;

            for (const s of this.structures) {
                s.update(dt);
            }
            for (const a of this.animals) {
                a.update(dt);
            }
            
            this.renderer.setCameraTarget(this.player.px, this.player.py);

            // Exit Zone Logic
            this._checkExitZone();
        });

        this.renderer.onDraw((ctx) => {
            this._drawExitMarker(ctx);
            if (this._activeNpc && !this.dialogue.isOpen && !this.terminal.isOpen) {
                this._drawInteractionPrompt(ctx, this._activeNpc);
            } else if (this._nearExit && !this.dialogue.isOpen && !this.terminal.isOpen) {
                this._drawExitPrompt(ctx);
            }
        });

        window.addEventListener('keydown', this._keydownHandler);
        window.addEventListener('keyup', this._keyupHandler);
        
        this.dialogue.onComplete = (npc, xp) => this._onQuestComplete(npc, xp);
        this.dialogue.onTriggerCamp = (npc) => this._runCampReveal(npc);
        this.dialogue.onTriggerTerminal = (npc) => this._runTerminal(npc);

        this._langListener = () => {
            this.progress = loadProgress();
            this._updateHUD();
            const currentLang = getLanguage();
            let atmo = `Welcome to ${this.villageDef.name}.`;
            if (currentLang === 'hi') atmo = `${this.villageDef.name_hi || this.villageDef.name} में आपका स्वागत है।`;
            else if (currentLang === 'od') atmo = `${this.villageDef.name_od || this.villageDef.name} କୁ ସ୍ୱାଗତ।`;
            this.hud.setAtmosphere(atmo);

            const hintBar = document.querySelector('.controls-hint-bar');
            if (hintBar) {
                if (currentLang === 'hi') hintBar.innerHTML = "WASD / तीर — चलें &nbsp;&middot;&nbsp; E — बात करें / बाहर";
                else if (currentLang === 'od') hintBar.innerHTML = "WASD / ତୀର — ଚାଲନ୍ତୁ &nbsp;&middot;&nbsp; E — କଥା ହୁଅନ୍ତୁ / ବାହାର";
                else hintBar.innerHTML = "WASD / arrows — move &nbsp;&middot;&nbsp; E — enter / talk";
            }

            if (this.dialogue.isOpen && this.dialogue.currentNpc) {
                this.dialogue.open(this.dialogue.currentNpc, currentLang);
            }
        };
        window.addEventListener('language-changed', this._langListener);

        this._updateHUD();
        const currentLang = getLanguage();
        let atmo = `Welcome to ${this.villageDef.name}.`;
        if (currentLang === 'hi') atmo = `${this.villageDef.name_hi || this.villageDef.name} में आपका स्वागत है।`;
        else if (currentLang === 'od') atmo = `${this.villageDef.name_od || this.villageDef.name} କୁ ସ୍ୱାଗତ।`;
        this.hud.setAtmosphere(atmo);

        const hintBar = document.querySelector('.controls-hint-bar');
        if (hintBar) {
            if (currentLang === 'hi') hintBar.innerHTML = "WASD / तीर — चलें &nbsp;&middot;&nbsp; E — बात करें / बाहर";
            else if (currentLang === 'od') hintBar.innerHTML = "WASD / ତୀର — ଚାଲନ୍ତୁ &nbsp;&middot;&nbsp; E — କଥା ହୁଅନ୍ତୁ / ବାହାର";
            else hintBar.innerHTML = "WASD / arrows — move &nbsp;&middot;&nbsp; E — enter / talk";
        }

        this.renderer.start();
    }
    
    _updatePlayer(dt) {
        // Move player (dt is in milliseconds, speed is in pixels/second)
        const dx = this.player.vx * (dt / 1000);
        const dy = this.player.vy * (dt / 1000);
        
        let newX = this.player.px + dx;
        let newY = this.player.py + dy;
        
        // Bounds checking
        const bounds = this.villageDef.bounds;
        if (newX < bounds.minX) newX = bounds.minX;
        if (newX > bounds.maxX) newX = bounds.maxX;
        if (newY < bounds.minY) newY = bounds.minY;
        if (newY > bounds.maxY) newY = bounds.maxY;
        
        this.player.px = newX;
        this.player.py = newY;
    }
    
    _checkExitZone() {
        if (this.dialogue.isOpen) return;

        const b = this.villageDef.bounds;
        const p = this.player;

        // Compute a fixed exit-marker position at the edge matching this village's
        // exitZone, then check proximity — same interaction pattern as talking to
        // an NPC (walk near, press E), rather than auto-triggering on edge touch.
        let ex, ey;
        if (this.villageDef.exitZone === 'bottom') { ex = (b.minX + b.maxX) / 2; ey = b.maxY; }
        else if (this.villageDef.exitZone === 'bottom-left') { ex = b.minX; ey = b.maxY; }
        else if (this.villageDef.exitZone === 'left') { ex = b.minX; ey = (b.minY + b.maxY) / 2; }
        else { ex = (b.minX + b.maxX) / 2; ey = b.maxY; }

        this._exitMarkerPos = { x: ex, y: ey };
        const dist = Math.sqrt((p.px - ex) ** 2 + (p.py - ey) ** 2);
        this._nearExit = dist < 55;
    }

    _updateNPCStates() {
        for (const npc of this.npcs) {
            const status = this.progress.chapters[npc.chapterId];
            if (status === 'done') npc.questState = 'complete';
            else if (status === 'active') npc.questState = 'available';
            else npc.questState = 'locked';
        }
    }

    _processInput() {
        let dx = 0; let dy = 0;
        if (this.keys.w || this.keys.ArrowUp) dy -= 1;
        if (this.keys.s || this.keys.ArrowDown) dy += 1;
        if (this.keys.a || this.keys.ArrowLeft) dx -= 1;
        if (this.keys.d || this.keys.ArrowRight) dx += 1;
        this.player.setVelocity(dx, dy);
    }

    _handleKeydown(e) {
        if (this.keys.hasOwnProperty(e.key)) this.keys[e.key] = true;
        
        if (e.key.toLowerCase() === 'e') {
            if (this._activeNpc && !this.dialogue.isOpen && !this._isRevealingCamp && !this.terminal.isOpen) {
                this.dialogue.open(this._activeNpc, getLanguage());
                this.player.setVelocity(0,0);
            } else if (this._nearExit && !this.dialogue.isOpen && !this._isRevealingCamp && !this.terminal.isOpen) {
                this.sceneManager.loadScene('overworld');
            }
        }
    }

    _handleKeyup(e) {
        if (this.keys.hasOwnProperty(e.key)) this.keys[e.key] = false;
    }

    _drawInteractionPrompt(ctx, npc) {
        const lang = getLanguage();
        let text = "E — talk to " + npc.name;
        if (lang === 'hi') text = `E — ${npc.name} से बात करें`;
        else if (lang === 'od') text = `E — ${npc.name} ସହ କଥା ହୁଅନ୍ତୁ`;

        ctx.font = 'bold 12px "Space Mono", monospace';
        const w = ctx.measureText(text).width + 16;
        const x = npc.px - w/2;
        const y = npc.py - 30;

        ctx.fillStyle = '#21201C';
        ctx.fillRect(x, y, w, 24);
        ctx.fillStyle = '#FAF8F4';
        ctx.textAlign = 'center';
        ctx.fillText(text, npc.px, y + 16);
    }

    _drawExitMarker(ctx) {
        if (!this._exitMarkerPos) return;
        const { x: ex, y: ey } = this._exitMarkerPos;

        ctx.beginPath();
        ctx.arc(ex, ey, 14, 0, Math.PI * 2);
        ctx.fillStyle = 'rgba(232, 163, 61, 0.85)';
        ctx.fill();
        ctx.lineWidth = 2;
        ctx.strokeStyle = '#21201C';
        ctx.stroke();
        ctx.fillStyle = '#21201C';
        ctx.font = 'bold 14px "Space Mono", monospace';
        ctx.textAlign = 'center';
        ctx.textBaseline = 'middle';
        ctx.fillText('↩', ex, ey + 1);
        ctx.textBaseline = 'alphabetic';
    }

    _drawExitPrompt(ctx) {
        if (!this._exitMarkerPos) return;
        const { x: ex, y: ey } = this._exitMarkerPos;
        const lang = getLanguage();
        let text = "E — return to the map";
        if (lang === 'hi') text = "E — नक्शे पर लौटें";
        else if (lang === 'od') text = "E — ମାନଚିତ୍ରକୁ ଫେରନ୍ତୁ";

        ctx.font = 'bold 12px "Space Mono", monospace';
        const w = ctx.measureText(text).width + 16;
        ctx.fillStyle = '#21201C';
        ctx.fillRect(ex - w/2, ey - 40, w, 24);
        ctx.fillStyle = '#FAF8F4';
        ctx.textAlign = 'center';
        ctx.fillText(text, ex, ey - 24);
    }

    _updateHUD() {
        const lang = getLanguage();
        const activeChapter = CHAPTERS.find(c => c.id === this.villageId);
        if (activeChapter && this.progress.chapters[this.villageId] === 'active') {
            let chLabel = `Chapter ${activeChapter.id}`;
            let chStatus = "Quest Available";
            if (lang === 'hi') {
                chLabel = `अध्याय ${activeChapter.id}`;
                chStatus = "क्वेस्ट उपलब्ध";
            } else if (lang === 'od') {
                chLabel = `ଅଧ୍ୟାୟ ${activeChapter.id}`;
                chStatus = "କ୍ୱେଷ୍ଟ୍ ଉପଲବ୍ଧ";
            }
            this.hud.updateQuest(`${chLabel}: ${this.villageDef.name}`, chStatus, this.progress.xp);
        } else if (this.progress.chapters[this.villageId] === 'done') {
            let chLabel = `Chapter ${this.villageId}`;
            let chStatus = "Quest Complete";
            if (lang === 'hi') {
                chLabel = `अध्याय ${this.villageId}`;
                chStatus = "क्वेस्ट पूरा हुआ ✅";
            } else if (lang === 'od') {
                chLabel = `ଅଧ୍ୟାୟ ${this.villageId}`;
                chStatus = "କ୍ୱେଷ୍ଟ୍ ସମ୍ପୂର୍ଣ୍ଣ ✅";
            }
            this.hud.updateQuest(`${chLabel}`, chStatus, this.progress.xp);
        }
    }

    _onQuestComplete(npc, xpReward) {
        completeChapter(npc.chapterId, xpReward);
        this.progress = loadProgress();
        AudioSys.playSound('unlock');
        this._updateNPCStates();
        this._updateHUD();
    }

    // --- CHAPTER 5 CAMP REVEAL ---
    async _runCampReveal(npc) {
        this._isRevealingCamp = true;
        this.hud.setAtmosphere("Scanning repository signals...");

        const s = await getRecommendedRepo();
        window.matchedRepoInfo = s; 
        
        // Spawn dynamically around the map center
        const cx = 800;
        const cy = 600;
        const spacing = 150;

        const layout = [];
        if (s.hasReadme) layout.push({ type: 'readme', px: cx - spacing, py: cy, data: { label: 'README', sublabel: 'Found' } });
        layout.push({ type: 'issues', px: cx + spacing, py: cy, data: { label: 'Issues', sublabel: `${s.openIssueCount} open`, count: Math.min(s.openIssueCount || 3, 5) } });
        if (s.hasContributing) layout.push({ type: 'contributing', px: cx - spacing, py: cy + spacing, data: { label: 'CONTRIBUTING', sublabel: 'Found' } });
        layout.push({ type: 'goodFirstIssue', px: cx + spacing, py: cy + spacing, data: { label: 'Beginner', sublabel: 'issues tagged' } });
        if (s.hasRecentActivity) layout.push({ type: 'maintainerActivity', px: cx, py: cy - spacing, data: { label: 'Maintainer', sublabel: 'Active' } });
        if (s.ciPassing) layout.push({ type: 'ciStatus', px: cx, py: cy + spacing, data: { label: 'CI', sublabel: 'Passing ✅', passing: true } });

        const { BuildLog } = await import('./BuildLog.js');
        const buildLog = new BuildLog();
        buildLog.show();
        buildLog.clear();
        buildLog.setTitle(`Scanning ${s.repoName}…`);

        const delay = ms => new Promise(r => setTimeout(r, ms));
        await delay(500);

        for (const item of layout) {
            // Repurpose Structure to use raw px coords instead of grid tiles
            const structure = new Structure(item.type, item.px, item.py, 100, item.data);
            structure.isPixelCoord = true;
            this.structures.push(structure);
            AudioSys.playSound('build');
            await structure.reveal();
            const icon = item.type === 'readme' ? '📖' : item.type === 'issues' ? '📋' : item.type === 'contributing' ? '🪧' : item.type === 'goodFirstIssue' ? '🏳️' : item.type === 'maintainerActivity' ? '🔥' : '🗼';
            await buildLog.addEntry(icon, `${item.data.label} — ${item.data.sublabel}`);
            await delay(500);
        }

        buildLog.addStatus('✅', 'Scan complete — generating match scores…', 'active');
        await delay(1000);

        const scores = s.scores || {
            languageFit: s.matchScore,
            beginnerFriendliness: Math.min(s.matchScore + 5, 100),
            responsiveness: Math.min(s.matchScore + 10, 100),
            reasoning: [
                "Matches your preferred language",
                "Has recent activity",
                "Contains 'good first issue' tags"
            ]
        };

        this._showMatchCard(s, scores, npc, buildLog);
    }

    _showMatchCard(signals, scores, npc, buildLog) {
        const card = document.getElementById('match-card');
        if (!card) return;
        const reasonsHTML = scores.reasoning.map(r => `<li>• ${r}</li>`).join('');

        card.innerHTML = `
            <div class="match-card-header">
                <div class="match-card-title">${signals.repoName}</div>
                <div class="match-card-subtitle">${signals.description}</div>
            </div>
            <div class="match-card-scores">
                <div class="score-row">
                    <span class="score-label">Language Fit</span>
                    <div class="score-bar-bg"><div class="score-bar-fill lang" style="width: 0%" data-target="${scores.languageFit}"></div></div>
                    <span class="score-value">${scores.languageFit}%</span>
                </div>
                <div class="score-row">
                    <span class="score-label">Beginner Friendly</span>
                    <div class="score-bar-bg"><div class="score-bar-fill diff" style="width: 0%" data-target="${scores.beginnerFriendliness}"></div></div>
                    <span class="score-value">${scores.beginnerFriendliness}%</span>
                </div>
                <div class="score-row">
                    <span class="score-label">Responsiveness</span>
                    <div class="score-bar-bg"><div class="score-bar-fill resp" style="width: 0%" data-target="${scores.responsiveness}"></div></div>
                    <span class="score-value">${scores.responsiveness}%</span>
                </div>
            </div>
            <div class="card card--flat" style="margin-bottom: var(--s-lg); padding: var(--s-md);">
                <h4 style="margin-bottom: var(--s-sm); font-size: var(--fs-sm);">Why this match?</h4>
                <ul style="font-size: var(--fs-sm); color: var(--c-ink-light); line-height: 1.8;">${reasonsHTML}</ul>
            </div>
            <div class="match-card-actions">
                <a href="${signals.repoUrl}" target="_blank" rel="noopener" class="btn btn--primary">View Repository →</a>
                <button class="btn btn--ghost" id="match-card-close">Continue Quest</button>
            </div>
        `;

        card.style.display = 'block';
        requestAnimationFrame(() => {
            card.classList.add('visible');
            setTimeout(() => card.querySelectorAll('.score-bar-fill').forEach(bar => bar.style.width = bar.dataset.target + '%'), 300);
        });

        document.getElementById('match-card-close').addEventListener('click', () => {
            card.classList.remove('visible');
            setTimeout(() => {
                card.style.display = 'none';
                card.innerHTML = '';
                this._onQuestComplete(npc, 150);
                this._isRevealingCamp = false;
                this.structures = [];
                if (buildLog) buildLog.hide();
                const bl = document.getElementById('build-log-entries'); if(bl) bl.innerHTML = '';
                const bt = document.querySelector('.build-log-title'); if(bt) bt.textContent = '';
            }, 400);
        });
    }

    _runTerminal(npc) {
        const repo = window.matchedRepoInfo || { repoName: "facebook/react", repoUrl: "https://github.com/facebook/react" };
        this.terminal.start(repo, () => {
            this._onQuestComplete(npc, 200);
            // Reopen Voss's dialogue for the concluding wrap-up and issue handoff
            this.dialogue.open(npc, this.progress.language);
            this.dialogue._showNode(3);
        });
    }

    destroy() {
        if (this.renderer) this.renderer.destroy();
        this.dialogue.close();
        if (this.terminal) this.terminal.close();
        if (this.hud) this.hud.clearAtmosphere();
        const atmoEl = document.getElementById('atmosphere-text');
        if (atmoEl) {
            atmoEl.style.opacity = '0';
            atmoEl.textContent = '';
        }
        window.removeEventListener('keydown', this._keydownHandler);
        window.removeEventListener('keyup', this._keyupHandler);
        if (this._langListener) {
            window.removeEventListener('language-changed', this._langListener);
        }
        if (this.container) this.container.style.display = 'none';
    }
}
