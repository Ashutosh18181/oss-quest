import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import https from 'https';
import path from 'path';
import { fileURLToPath } from 'url';
import { getProgress, saveProgress } from './store.mjs';
import { scoreIssueWithAgent } from './strands_agent.mjs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const ROOT_DIR = path.join(__dirname, '..');

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors()); // Allow frontend to talk to backend
app.use(express.json());
// Serve frontend assets and pages statically
app.use(express.static(ROOT_DIR));

// Curated fallbacks if GitHub rate limit is reached or network is unavailable
const FALLBACK_ISSUES = {
    javascript: {
        repoName: 'freeCodeCamp/freeCodeCamp',
        repoUrl: 'https://github.com/freeCodeCamp/freeCodeCamp',
        issueTitle: 'Fix typo and add helpful comment in JavaScript challenge',
        issueUrl: 'https://github.com/freeCodeCamp/freeCodeCamp/issues/54821',
        description: 'The JavaScript curriculum challenge has a small typo and could use clearer guidance for beginners completing step 12.',
        openIssueCount: 248,
        hasReadme: true,
        hasContributing: true,
        hasRecentActivity: true,
        ciPassing: true
    },
    python: {
        repoName: 'firstcontributions/first-contributions',
        repoUrl: 'https://github.com/firstcontributions/first-contributions',
        issueTitle: 'Add your name to the contributors list in Python',
        issueUrl: 'https://github.com/firstcontributions/first-contributions/issues/1',
        description: 'Practice making a contribution by adding your name to Contributors.md and running the python validation script.',
        openIssueCount: 15,
        hasReadme: true,
        hasContributing: true,
        hasRecentActivity: true,
        ciPassing: true
    },
    default: {
        repoName: 'EddieHubCommunity/LinkFree',
        repoUrl: 'https://github.com/EddieHubCommunity/LinkFree',
        issueTitle: 'Add social link icon and improve accessibility for profile badges',
        issueUrl: 'https://github.com/EddieHubCommunity/LinkFree/issues/120',
        description: 'Update the profile card component to include aria-label tags and support the new icon format for beginner contributors.',
        openIssueCount: 42,
        hasReadme: true,
        hasContributing: true,
        hasRecentActivity: true,
        ciPassing: true
    }
};

// Helper to fetch from GitHub API
function fetchGitHubAPI(path, token) {
    return new Promise((resolve, reject) => {
        const headers = {
            'User-Agent': 'OSS-Quest-Local-Backend/1.0',
            'Accept': 'application/vnd.github.v3+json'
        };
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }

        const req = https.request({
            hostname: 'api.github.com',
            port: 443,
            path: path,
            method: 'GET',
            headers: headers
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode === 404) {
                    resolve(null); // Return null for 404s (e.g. file not found)
                } else if (res.statusCode >= 200 && res.statusCode < 300) {
                    try {
                        resolve(JSON.parse(data));
                    } catch (parseErr) {
                        resolve(null);
                    }
                } else {
                    reject(new Error(`GitHub API Error: ${res.statusCode} - ${data}`));
                }
            });
        });
        req.on('error', reject);
        req.end();
    });
}

// --- API ENDPOINTS ---

/**
 * GET /api/progress
 * Fetches the user's progress.
 */
app.get('/api/progress', async (req, res) => {
    try {
        const authHeader = req.headers.authorization || '';
        const userId = authHeader.replace('Bearer ', '').trim();
        
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        const progress = await getProgress(userId);
        res.json(progress || {});
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

/**
 * POST /api/progress
 * Saves the user's progress.
 */
app.post('/api/progress', async (req, res) => {
    try {
        const authHeader = req.headers.authorization || '';
        const userId = authHeader.replace('Bearer ', '').trim();
        
        if (!userId) return res.status(401).json({ error: "Unauthorized" });

        await saveProgress(userId, req.body);
        res.json({ success: true });
    } catch (e) {
        console.error(e);
        res.status(500).json({ error: "Internal Server Error" });
    }
});

/**
 * POST /api/match
 * Fetches a GitHub issue and scores it using the local Strands Agent.
 * Expects { language, skillLevel } in body.
 */
app.post('/api/match', async (req, res) => {
    try {
        // 1. Get user profile details
        const { language = 'javascript', skillLevel = 'beginner' } = req.body;
        
        // Support both GITHUB_PAT and GITHUB_TOKEN
        let token = process.env.GITHUB_PAT || process.env.GITHUB_TOKEN;
        if (token === 'your_github_personal_access_token_here' || token === 'your_github_personal_access_token' || !token) {
            token = null;
        }

        if (!token) {
            console.warn("No valid GITHUB_PAT or GITHUB_TOKEN found. GitHub API calls will be unauthenticated and may be rate-limited.");
        }

        let issueData = null;

        try {
            // 2. Query GitHub for a "good first issue"
            const q = encodeURIComponent(`is:issue is:open label:"good first issue" language:${language}`);
            const githubData = await fetchGitHubAPI(`/search/issues?q=${q}&sort=updated&order=desc&per_page=10`, token);
            
            if (githubData && githubData.items && githubData.items.length > 0) {
                // Pick a random issue from the top results
                const issue = githubData.items[Math.floor(Math.random() * githubData.items.length)];
                const repoUrlParts = issue.repository_url.split('/');
                const repoName = `${repoUrlParts[repoUrlParts.length - 2]}/${repoUrlParts[repoUrlParts.length - 1]}`;

                // Fetch repo metadata
                const repoData = await fetchGitHubAPI(`/repos/${repoName}`, token);
                
                // Fetch contents to check for README and CONTRIBUTING
                const readmeData = await fetchGitHubAPI(`/repos/${repoName}/contents/README.md`, token) || await fetchGitHubAPI(`/repos/${repoName}/contents/readme.md`, token);
                const contributingData = await fetchGitHubAPI(`/repos/${repoName}/contents/CONTRIBUTING.md`, token) || await fetchGitHubAPI(`/repos/${repoName}/contents/contributing.md`, token) || await fetchGitHubAPI(`/repos/${repoName}/contents/.github/CONTRIBUTING.md`, token);
                
                const lastUpdated = repoData?.updated_at ? new Date(repoData.updated_at) : new Date();
                const daysSinceUpdate = (new Date() - lastUpdated) / (1000 * 60 * 60 * 24);
                const hasRecentActivity = daysSinceUpdate < 30;

                issueData = {
                    repoName,
                    repoUrl: `https://github.com/${repoName}`,
                    issueTitle: issue.title,
                    issueUrl: issue.html_url,
                    description: issue.body ? issue.body.substring(0, 200) + '...' : 'No description provided.',
                    openIssueCount: repoData ? repoData.open_issues_count : 0,
                    hasReadme: !!readmeData,
                    hasContributing: !!contributingData,
                    hasRecentActivity,
                    ciPassing: true
                };
            }
        } catch (apiErr) {
            console.warn("Live GitHub API query failed or rate-limited. Using curated starter issue:", apiErr.message);
        }

        // Use curated fallback if API didn't return an issue
        if (!issueData) {
            const fallback = FALLBACK_ISSUES[language.toLowerCase()] || FALLBACK_ISSUES.default;
            issueData = { ...fallback };
        }

        // 4. Pass to Local Strands Agent SDK wrapper for scoring
        const scores = await scoreIssueWithAgent(issueData, { language, skillLevel });
        
        // 5. Combine and return
        res.json({ ...issueData, matchScore: scores.languageFit, scores });

    } catch (e) {
        console.error("Match error:", e);
        res.status(500).json({ error: "Failed to generate match." });
    }
});

if (process.env.NODE_ENV !== 'production' && !process.env.VERCEL) {
    app.listen(PORT, () => {
        console.log(`⚔️ OSS Quest Local Backend running on http://localhost:${PORT}`);
    });
}

export default app;
