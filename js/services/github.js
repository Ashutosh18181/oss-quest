/**
 * OSS Quest — GitHub API Service
 * Fetches repository data securely via the local backend.
 */

import { getLanguage } from './progress.js';

const BACKEND_BASE = (typeof window !== 'undefined' && window.location.port && window.location.port !== '3001' && (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1'))
    ? `${window.location.protocol}//${window.location.hostname}:3001`
    : '';

// URL for the Node.js Express backend
const BACKEND_URL = `${BACKEND_BASE}/api/match`;

/**
 * Fetch a "good first issue" using the user's language preference.
 * Communicates with our secure backend to avoid leaking the GitHub PAT.
 */
export async function getRecommendedRepo() {
    const lang = getLanguage() || 'javascript';
    const skillLevel = 'beginner'; // We can fetch this from progress if needed

    try {
        const response = await fetch(BACKEND_URL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ language: lang, skillLevel })
        });
        
        if (!response.ok) {
            throw new Error(`Backend returned ${response.status}`);
        }

        const data = await response.json();
        return data; // { repoName, issueTitle, matchScore, scores, etc. }
    } catch (e) {
        console.error("Failed to fetch from backend:", e);
        // Fallback on failure so the game doesn't break during demo
        return {
            repoName: 'example/repo',
            repoUrl: 'https://github.com/example/repo',
            issueTitle: 'Example Good First Issue',
            description: 'Make sure your local backend is running on port 3001!',
            matchScore: 85,
            scores: {
                languageFit: 85,
                beginnerFriendliness: 90,
                responsiveness: 80,
                reasoning: ['Local backend is unreachable, showing placeholder data.']
            }
        };
    }
}
