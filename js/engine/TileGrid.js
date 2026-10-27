/**
 * OSS Quest — TileGrid (Update 04: Image Refactor)
 * Renders the tile map using image assets.
 */

import { TILE, TILE_COLORS, VILLAGES } from '../data/village.js';
import { Assets } from './AssetLoader.js';

// Seeded PRNG
function mulberry32(seed) {
    return function() {
        seed |= 0; seed = seed + 0x6D2B79F5 | 0;
        let t = Math.imul(seed ^ seed >>> 15, 1 | seed);
        t = t + Math.imul(t ^ t >>> 7, 61 | t) ^ t;
        return ((t ^ t >>> 14) >>> 0) / 4294967296;
    };
}

export class TileGrid {
    constructor(mapDef) {
        this.cols = mapDef.width;
        this.rows = mapDef.height;
        this.tileSize = 48;
        this.tiles = [];
        this.collisionMap = [];
        this.rng = mulberry32(42);
        this.mapDef = mapDef;
        this.colors = {
            base: '#4A6B3A',
            dirt: '#8B6914',
            stone: '#5b5952',
            obstacle: '#2a5a18',
            water: '#3A5B8B'
        };

        // Camera
        this.camX = 0;
        this.camY = 0;
        this.camTargetX = 0;
        this.camTargetY = 0;
        this.viewportW = 0;
        this.viewportH = 0;

        this._generate();
    }

    get widthPx() { return this.cols * this.tileSize; }
    get heightPx() { return this.rows * this.tileSize; }

    _generate() {
        const rng = this.rng;
        const base = this.mapDef.baseTile !== undefined ? this.mapDef.baseTile : TILE.GRASS_1;

        // Initialize with base tile
        for (let y = 0; y < this.rows; y++) {
            this.tiles[y] = [];
            this.collisionMap[y] = [];
            for (let x = 0; x < this.cols; x++) {
                let type = base;
                if (base === TILE.GRASS_1) {
                    const r = rng();
                    type = r < 0.7 ? TILE.GRASS_1 : r < 0.9 ? TILE.GRASS_2 : TILE.GRASS_3;
                }
                
                this.tiles[y][x] = {
                    type,
                    variant: Math.floor(rng() * 4),
                    x, y,
                    detail: rng() > 0.85 ? 'pebble' : null,
                };
                this.collisionMap[y][x] = false;
            }
        }

        // Draw paths for overworld if defined
        if (this.mapDef.paths) {
            for (const path of this.mapDef.paths) {
                this._layPath(path.points, TILE.DIRT);
            }
        }

        // Collision for building
        if (this.mapDef.building) {
            const b = this.mapDef.building;
            for (let dy = 0; dy < b.h; dy++) {
                for (let dx = 0; dx < b.w; dx++) {
                    const tx = b.x + dx;
                    const ty = b.y + dy;
                    if (this._inBounds(tx, ty)) {
                        this.collisionMap[ty][tx] = true;
                    }
                }
            }
            const doorTX = b.x + b.doorX;
            const doorTY = b.y + b.doorY + 1;
            if (this._inBounds(doorTX, doorTY)) {
                this.collisionMap[doorTY][doorTX] = false;
            }
        }

        // Collision for props
        if (this.mapDef.props) {
            const solidProps = ['barrel', 'crate', 'well', 'rock', 'tree', 'cart', 'anvil', 'statue', 'fire'];
            for (const p of this.mapDef.props) {
                if (solidProps.includes(p.type) && this._inBounds(p.x, p.y)) {
                    this.collisionMap[p.y][p.x] = true;
                }
            }
        }

        // Overworld Nodes
        if (this.mapDef.nodes) {
            for (const n of this.mapDef.nodes) {
                this.collisionMap[n.y][n.x] = false; 
            }
        }

        // Map edges collision
        for (let x = 0; x < this.cols; x++) {
            this.collisionMap[0][x] = true;
            this.collisionMap[this.rows - 1][x] = true;
        }
        for (let y = 0; y < this.rows; y++) {
            this.collisionMap[y][0] = true;
            this.collisionMap[y][this.cols - 1] = true;
        }
    }

    _layPath(points, tileType) {
        for (let i = 0; i < points.length - 1; i++) {
            const [x1, y1] = points[i];
            const [x2, y2] = points[i + 1];
            const dx = Math.sign(x2 - x1);
            const dy = Math.sign(y2 - y1);
            let cx = x1, cy = y1;
            while (cx !== x2 || cy !== y2) {
                if (this._inBounds(cx, cy)) {
                    this.tiles[cy][cx].type = tileType;
                    this.tiles[cy][cx].variant = Math.floor(this.rng() * 4);
                }
                if (cx !== x2) cx += dx;
                else if (cy !== y2) cy += dy;
            }
            if (this._inBounds(x2, y2)) {
                this.tiles[y2][x2].type = tileType;
            }
        }
    }

    _inBounds(x, y) {
        return x >= 0 && x < this.cols && y >= 0 && y < this.rows;
    }

    isWalkable(px, py) {
        const tx = Math.floor(px / this.tileSize);
        const ty = Math.floor(py / this.tileSize);
        if (!this._inBounds(tx, ty)) return false;
        return !this.collisionMap[ty][tx];
    }

    setCameraTarget(px, py) {
        this.camTargetX = px - this.viewportW / 2;
        this.camTargetY = py - this.viewportH / 2;
        this.camTargetX = Math.max(0, Math.min(this.camTargetX, this.widthPx - this.viewportW));
        this.camTargetY = Math.max(0, Math.min(this.camTargetY, this.heightPx - this.viewportH));
    }

    updateCamera(dt) {
        const lerp = 1 - Math.pow(0.001, dt / 1000);
        this.camX += (this.camTargetX - this.camX) * lerp;
        this.camY += (this.camTargetY - this.camY) * lerp;
    }

    setViewport(w, h) {
        this.viewportW = w;
        this.viewportH = h;
    }

    draw(ctx) {
        const ts = this.tileSize;
        
        // 1. Draw solid background
        const drawLeft = Math.max(0, this.camX);
        const drawTop = Math.max(0, this.camY);
        const drawRight = Math.min(this.widthPx, this.camX + this.viewportW);
        const drawBottom = Math.min(this.heightPx, this.camY + this.viewportH);

        const grassImg = Assets.getImage('tile_grass');
        if (grassImg && this.mapDef.id !== 'overworld') {
            const pattern = ctx.createPattern(grassImg, 'repeat');
            ctx.fillStyle = pattern;
            ctx.fillRect(drawLeft, drawTop, drawRight - drawLeft, drawBottom - drawTop);
        } else {
            ctx.fillStyle = this.colors.base;
            ctx.fillRect(drawLeft, drawTop, drawRight - drawLeft, drawBottom - drawTop);
        }

        // 2. Draw specific tiles
        const startC = Math.max(0, Math.floor(this.camX / ts) - 1);
        const endC = Math.min(this.cols, Math.ceil((this.camX + this.viewportW) / ts) + 1);
        const startR = Math.max(0, Math.floor(this.camY / ts) - 1);
        const endR = Math.min(this.rows, Math.ceil((this.camY + this.viewportH) / ts) + 1);

        const dirtImg = Assets.getImage('tile_dirt');
        const stoneImg = Assets.getImage('tile_stone');

        for (let r = startR; r < endR; r++) {
            for (let c = startC; c < endC; c++) {
                const tile = this.tiles[r][c];
                const px = c * ts;
                const py = r * ts;
                
                if (tile.type === TILE.DIRT) {
                    if (dirtImg) ctx.drawImage(dirtImg, px, py, ts, ts);
                    else { ctx.fillStyle = this.colors.dirt; ctx.fillRect(px, py, ts, ts); }
                } else if (tile.type === TILE.STONE) {
                    if (stoneImg) ctx.drawImage(stoneImg, px, py, ts, ts);
                    else { ctx.fillStyle = this.colors.stone; ctx.fillRect(px, py, ts, ts); }
                } else if (tile.type === TILE.OBSTACLE) {
                    ctx.fillStyle = this.colors.obstacle; ctx.fillRect(px, py, ts, ts);
                } else if (tile.type === TILE.WATER) {
                    ctx.fillStyle = this.colors.water; ctx.fillRect(px, py, ts, ts);
                }
            }
        }
    }

    drawBuildings(ctx, maxUnlockedChapter = 1) {
        let buildingsToDraw = [];
        
        if (this.mapDef.nodes) {
            // It's the Overworld map, pull buildings from VILLAGES
            for (const node of this.mapDef.nodes) {
                if (node.id <= maxUnlockedChapter + 1) {
                    const vDef = VILLAGES[node.id];
                    if (vDef && vDef.building) {
                        // Offset building relative to the node position
                        const b = { ...vDef.building };
                        // In the overworld, node is a single point, so center the building above it
                        b.x = node.x - Math.floor(b.w / 2);
                        b.y = node.y - Math.floor(b.h / 2) - 1;
                        buildingsToDraw.push(b);
                    }
                }
            }
        } else if (this.mapDef.building) {
            // It's a single village
            buildingsToDraw.push(this.mapDef.building);
        }

        const ts = this.tileSize;

        for (const b of buildingsToDraw) {
            const px = b.x * ts;
            const py = b.y * ts;
            const w = b.w * ts;
            const h = b.h * ts;

            ctx.save();
        ctx.fillStyle = 'rgba(0,0,0,0.3)';
        ctx.fillRect(px + 4, py + 4, w, h);
        ctx.fillStyle = b.wallColor;
        ctx.fillRect(px, py, w, h);
        ctx.strokeStyle = '#21201C';
        ctx.lineWidth = 2;
        ctx.strokeRect(px + 1, py + 1, w - 2, h - 2);
        
        const roofH = h * 0.4;
        ctx.fillStyle = b.roofColor;
        ctx.fillRect(px, py, w, roofH);
        
        const doorPx = px + b.doorX * ts + ts / 4;
        const doorPy = py + h - ts * 0.8;
        ctx.fillStyle = '#3a2a1a';
        ctx.fillRect(doorPx, doorPy, ts / 2, ts * 0.7);
        
        ctx.restore();
        }
    }

    drawProps(ctx) {
        if (this.mapDef.props) {
            for (const p of this.mapDef.props) {
                this._drawProp(ctx, p);
            }
        }
        
        if (this.mapDef.nodes) {
            const ts = this.tileSize;
            for (const n of this.mapDef.nodes) {
                const px = n.x * ts;
                const py = n.y * ts;
                
                ctx.fillStyle = '#B4502A';
                ctx.beginPath();
                ctx.arc(px + ts/2, py + ts/2, 12, 0, Math.PI*2);
                ctx.fill();
                ctx.strokeStyle = '#21201C';
                ctx.lineWidth = 2;
                ctx.stroke();
                
                ctx.font = 'bold 10px "Space Mono", monospace';
                ctx.textAlign = 'center';
                ctx.fillStyle = '#21201C';
                ctx.fillText(n.name, px + ts/2, py - 6);
            }
        }
    }

    _drawProp(ctx, p) {
        const ts = this.tileSize;
        const px = p.x * ts;
        const py = p.y * ts;
        
        ctx.fillStyle = '#555';
        if (p.type === 'tree') {
            ctx.fillStyle = '#2a5a18';
            ctx.beginPath(); ctx.arc(px + ts/2, py + ts/2, ts/1.5, 0, Math.PI*2); ctx.fill();
        } else if (p.type === 'rock') {
            ctx.fillStyle = '#7a7868';
            ctx.beginPath(); ctx.arc(px + ts/2, py + ts/2, ts/2, 0, Math.PI*2); ctx.fill();
        } else if (p.type === 'fire') {
            // Placeholder for flickering fire until animated sprites are ready
            ctx.fillStyle = (Date.now() % 400 < 200) ? '#ff5000' : '#ff9900';
            ctx.beginPath(); ctx.arc(px + ts/2, py + ts/2, ts/3, 0, Math.PI*2); ctx.fill();
        } else {
            ctx.fillRect(px + 8, py + 8, ts - 16, ts - 16);
            ctx.strokeStyle = '#222';
            ctx.strokeRect(px + 8, py + 8, ts - 16, ts - 16);
        }
    }
}
