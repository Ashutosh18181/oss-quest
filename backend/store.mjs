import fs from 'fs/promises';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const DATA_DIR = path.join(__dirname, 'data');
const DB_FILE = path.join(DATA_DIR, 'progress.json');

/**
 * Ensures the data directory and db file exist.
 */
async function initStore() {
    try {
        await fs.access(DATA_DIR);
    } catch {
        await fs.mkdir(DATA_DIR, { recursive: true });
    }
    
    try {
        await fs.access(DB_FILE);
    } catch {
        // Create empty db object
        await fs.writeFile(DB_FILE, JSON.stringify({}), 'utf-8');
    }
}

/**
 * Gets the progress for a user ID.
 */
export async function getProgress(userId) {
    await initStore();
    const data = await fs.readFile(DB_FILE, 'utf-8');
    const db = JSON.parse(data);
    return db[userId] || null;
}

/**
 * Saves the progress for a user ID.
 */
export async function saveProgress(userId, progressData) {
    await initStore();
    const data = await fs.readFile(DB_FILE, 'utf-8');
    const db = JSON.parse(data);
    
    db[userId] = {
        ...db[userId],
        ...progressData,
        updatedAt: new Date().toISOString()
    };
    
    await fs.writeFile(DB_FILE, JSON.stringify(db, null, 2), 'utf-8');
    return db[userId];
}
