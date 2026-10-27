/**
 * OSS Quest — CampScene
 * Orchestrates the full camp reveal sequence:
 *   1. Character spawns at entrance
 *   2. For each data signal: walk → reveal structure → log entry
 *   3. After all structures: show scored match card
 */

import { TileGrid } from './TileGrid.js';
import { Character } from './Character.js';
import { Structure } from './Structure.js';
import { BuildLog } from './BuildLog.js';
import { Renderer } from './Renderer.js';

// Structure placements on the grid
const STRUCTURE_LAYOUT = [
    { type: 'readme',             tileX: 3,  tileY: 2, signalKey: 'readme' },
    { type: 'issues',             tileX: 10, tileY: 2, signalKey: 'issues' },
    { type: 'contributing',       tileX: 5,  tileY: 5, signalKey: 'contributing' },
    { type: 'goodFirstIssue',     tileX: 9,  tileY: 5, signalKey: 'goodFirstIssue' },
    { type: 'maintainerActivity', tileX: 3,  tileY: 7, signalKey: 'maintainerActivity' },
    { type: 'ciStatus',           tileX: 10, tileY: 7, signalKey: 'ciStatus' },
];

// Character start position
const CHAR_START = { x: 7, y: 9 };

export class CampScene {
    /**
     * @param {object} signals — data signals from extractSignals()
     * @param {object} [options]
     * @param {Function} [options.onComplete] — called when reveal finishes
     * @param {boolean} [options.autoPlay=true] — start reveal automatically
     */
    constructor(signals, options = {}) {
        this.signals = signals;
        this.onComplete = options.onComplete || null;
        this.autoPlay = options.autoPlay !== false;

        this.tileSize = 48;
        this.grid = null;
        this.character = null;
        this.structures = [];
        this.buildLog = null;
        this.renderer = null;
        this._isRunning = false;
    }

    /** Initialize and start the scene. */
    async start() {
        const container = document.getElementById('camp-container');
        const canvas = document.getElementById('camp-canvas');
        if (!container || !canvas) {
            console.error('Camp container or canvas not found');
            return;
        }

        container.style.display = 'flex';

        // Create components
        this.grid = new TileGrid(14, 10, this.tileSize);
        this.character = new Character(CHAR_START.x, CHAR_START.y, this.tileSize);
        this.buildLog = new BuildLog();
        this.buildLog.clear();
        this.buildLog.setTitle(`Scanning ${this.signals.repoName}…`);

        // Create structures from signals
        this._createStructures();

        // Set up renderer
        this.renderer = new Renderer(canvas, this.grid.widthPx, this.grid.heightPx);
        this.renderer.layers.tiles = this.grid;
        this.renderer.layers.character = this.character;
        this.renderer.layers.structures = this.structures;

        // Update loop: update character + structures
        this.renderer.onUpdate((dt) => {
            this.character.update(dt);
            for (const s of this.structures) s.update(dt);
        });

        // Handle resize
        this._resizeHandler = () => this.renderer.handleResize();
        window.addEventListener('resize', this._resizeHandler);

        // Start rendering
        this.renderer.start();
        this._isRunning = true;

        // Auto-play the reveal sequence
        if (this.autoPlay) {
            await this._delay(600); // Brief pause before starting
            await this._runRevealSequence();
        }
    }

    /** Create structure instances from signal data. */
    _createStructures() {
        const s = this.signals;

        for (const layout of STRUCTURE_LAYOUT) {
            let data = {};
            let skip = false;

            switch (layout.signalKey) {
                case 'readme':
                    data = {
                        label: 'README',
                        sublabel: s.hasReadme ? `${(s.readmeSize / 1024).toFixed(1)}KB` : 'Not found',
                    };
                    break;
                case 'issues':
                    data = {
                        label: `${s.openIssueCount} Issues`,
                        sublabel: 'open',
                        count: Math.min(Math.ceil(s.openIssueCount / 50), 5),
                    };
                    break;
                case 'contributing':
                    data = {
                        label: 'CONTRIBUTING',
                        sublabel: s.hasContributing ? 'Found' : 'Missing',
                    };
                    break;
                case 'goodFirstIssue':
                    data = {
                        label: `${s.goodFirstIssueCount} Beginner`,
                        sublabel: 'issues tagged',
                    };
                    break;
                case 'maintainerActivity':
                    data = {
                        label: 'Maintainer',
                        sublabel: s.maintainerActive
                            ? `Active ${s.daysSinceLastCommit}d ago`
                            : `Inactive ${s.daysSinceLastCommit}d`,
                    };
                    break;
                case 'ciStatus':
                    data = {
                        label: 'CI',
                        sublabel: s.ciPassing ? 'Passing ✅' : 'Failing ❌',
                        passing: s.ciPassing,
                    };
                    break;
            }

            const structure = new Structure(layout.type, layout.tileX, layout.tileY, this.tileSize, data);
            this.structures.push(structure);
        }
    }

    /** Run the full reveal sequence. */
    async _runRevealSequence() {
        const s = this.signals;

        // --- 1. README ---
        await this.buildLog.addEntry('📡', `Connecting to ${s.repoName}…`);
        await this._delay(400);

        const readmePath = this._pathTo(STRUCTURE_LAYOUT[0]);
        await this.character.walkPath(readmePath);
        await this.structures[0].reveal();
        await this.buildLog.addEntry('📖', s.hasReadme
            ? `README.md found — ${(s.readmeSize / 1024).toFixed(1)}KB`
            : 'README.md not found');
        await this._delay(500);

        // --- 2. Issues ---
        const issuesPath = this._pathTo(STRUCTURE_LAYOUT[1]);
        await this.character.walkPath(issuesPath);
        await this.structures[1].reveal();
        await this.buildLog.addEntry('📋', `Found ${s.openIssueCount} open issues`);
        await this._delay(500);

        // --- 3. Contributing Guide ---
        const contribPath = this._pathTo(STRUCTURE_LAYOUT[2]);
        await this.character.walkPath(contribPath);
        await this.structures[2].reveal();
        await this.buildLog.addEntry('🪧', s.hasContributing
            ? 'Contributing guide found'
            : 'No contributing guide found');
        await this._delay(500);

        // --- 4. Good First Issues ---
        const gfiPath = this._pathTo(STRUCTURE_LAYOUT[3]);
        await this.character.walkPath(gfiPath);
        await this.structures[3].reveal();
        await this.buildLog.addEntry('🏳️', `${s.goodFirstIssueCount} issues tagged "good first issue"`);
        await this._delay(500);

        // --- 5. Maintainer Activity ---
        const maintPath = this._pathTo(STRUCTURE_LAYOUT[4]);
        await this.character.walkPath(maintPath);
        await this.structures[4].reveal();
        await this.buildLog.addEntry('🔥', s.maintainerActive
            ? `Maintainer active ${s.daysSinceLastCommit} day${s.daysSinceLastCommit === 1 ? '' : 's'} ago`
            : `Last activity ${s.daysSinceLastCommit} days ago — inactive`);
        await this._delay(500);

        // --- 6. CI Status ---
        const ciPath = this._pathTo(STRUCTURE_LAYOUT[5]);
        await this.character.walkPath(ciPath);
        await this.structures[5].reveal();
        await this.buildLog.addEntry('🗼', s.ciPassing
            ? `CI passing — ${s.ciRunName}`
            : `CI failing — ${s.ciRunName}`);
        await this._delay(600);

        // --- Done ---
        this.buildLog.addStatus('✅', 'Scan complete — generating match scores…', 'active');
        await this._delay(1000);

        // Show match card
        if (this.onComplete) {
            this.onComplete(this.signals);
        }
    }

    /**
     * Generate a simple walk path from the character's current position to a structure.
     * Uses L-shaped path (walk X first, then Y — or via the main path).
     */
    _pathTo(layout) {
        const path = [];
        let cx = this.character.tileX;
        let cy = this.character.tileY;
        const tx = layout.tileX;
        const ty = layout.tileY;

        // Walk to main path column (7) first if not there
        if (cx !== 7) {
            const dir = cx < 7 ? 1 : -1;
            while (cx !== 7) {
                cx += dir;
                path.push([cx, cy]);
            }
        }

        // Walk vertically to target row
        if (cy !== ty) {
            const dir = cy < ty ? 1 : -1;
            while (cy !== ty) {
                cy += dir;
                path.push([cx, cy]);
            }
        }

        // Walk horizontally to target column
        if (cx !== tx) {
            const dir = cx < tx ? 1 : -1;
            while (cx !== tx) {
                cx += dir;
                path.push([cx, cy]);
            }
        }

        return path;
    }

    /** Utility delay. */
    _delay(ms) {
        return new Promise(resolve => setTimeout(resolve, ms));
    }

    /** Clean up the scene. */
    destroy() {
        if (this.renderer) this.renderer.destroy();
        if (this._resizeHandler) window.removeEventListener('resize', this._resizeHandler);
        this._isRunning = false;

        const container = document.getElementById('camp-container');
        if (container) container.style.display = 'none';
    }
}
