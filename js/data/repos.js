/**
 * OSS Quest — Curated Repository List + Mock GitHub API Data
 * These repos are beginner-friendly and actively maintained.
 * Mock data matches the real GitHub REST API response shape.
 */

export const CURATED_REPOS = [
    { owner: 'firstcontributions', repo: 'first-contributions', languages: ['markdown'], difficulty: 'beginner' },
    { owner: 'freeCodeCamp',      repo: 'freeCodeCamp',         languages: ['javascript', 'typescript'], difficulty: 'beginner' },
    { owner: 'EddieHubCommunity', repo: 'LinkFree',             languages: ['javascript', 'typescript'], difficulty: 'beginner' },
    { owner: 'appwrite',          repo: 'appwrite',             languages: ['javascript', 'php', 'dart'], difficulty: 'intermediate' },
    { owner: 'godotengine',       repo: 'godot',                languages: ['c++', 'gdscript'],          difficulty: 'intermediate' },
    { owner: 'mdn',               repo: 'content',              languages: ['markdown', 'html'],         difficulty: 'beginner' },
    { owner: 'python',            repo: 'cpython',              languages: ['python', 'c'],              difficulty: 'advanced' },
    { owner: 'microsoft',         repo: 'vscode',               languages: ['typescript'],               difficulty: 'intermediate' },
    { owner: 'flutter',           repo: 'flutter',              languages: ['dart'],                     difficulty: 'intermediate' },
    { owner: 'facebook',          repo: 'react',                languages: ['javascript'],               difficulty: 'intermediate' },
];


/**
 * Mock GitHub API response for a single repo.
 * Shape mirrors the real GitHub REST API so swapping in live calls is seamless.
 */
export const MOCK_REPO_DATA = {
    // Repository metadata (GET /repos/{owner}/{repo})
    repo: {
        id: 174836492,
        full_name: 'freeCodeCamp/freeCodeCamp',
        html_url: 'https://github.com/freeCodeCamp/freeCodeCamp',
        description: "freeCodeCamp.org's open-source codebase and curriculum. Learn to code for free.",
        language: 'TypeScript',
        stargazers_count: 394000,
        forks_count: 36200,
        open_issues_count: 248,
        topics: ['education', 'javascript', 'learn-to-code', 'nonprofits', 'react', 'typescript'],
        license: { spdx_id: 'BSD-3-Clause', name: 'BSD 3-Clause "New" or "Revised" License' },
        created_at: '2014-12-24T17:49:19Z',
        updated_at: '2026-09-18T08:22:11Z',
        pushed_at: '2026-09-17T21:44:03Z',
        has_wiki: true,
        has_issues: true,
        archived: false,
        default_branch: 'main',
        owner: {
            login: 'freeCodeCamp',
            avatar_url: 'https://avatars.githubusercontent.com/u/9892522?v=4',
        }
    },

    // README check (GET /repos/{owner}/{repo}/readme)
    readme: {
        name: 'README.md',
        size: 8420,
        encoding: 'base64',
        html_url: 'https://github.com/freeCodeCamp/freeCodeCamp/blob/main/README.md',
        _decoded_excerpt: "# freeCodeCamp.org's open-source codebase and curriculum\n\nfreeCodeCamp.org is a friendly community where you can learn to code for free..."
    },

    // Contributing guide check (GET /repos/{owner}/{repo}/contents/CONTRIBUTING.md)
    contributing: {
        name: 'CONTRIBUTING.md',
        size: 14230,
        html_url: 'https://github.com/freeCodeCamp/freeCodeCamp/blob/main/CONTRIBUTING.md',
    },

    // Open issues with "good first issue" label (GET /repos/{owner}/{repo}/issues?labels=good+first+issue&state=open)
    goodFirstIssues: [
        {
            number: 54821,
            title: 'Fix typo in JavaScript certification challenge',
            html_url: 'https://github.com/freeCodeCamp/freeCodeCamp/issues/54821',
            labels: [
                { name: 'good first issue', color: '7057ff' },
                { name: 'scope: curriculum', color: 'fbca04' }
            ],
            created_at: '2026-09-10T14:32:00Z',
            updated_at: '2026-09-15T09:18:22Z',
            comments: 3,
            user: { login: 'contributor-abc', avatar_url: '' }
        },
        {
            number: 54798,
            title: 'Update Hindi translation for basic HTML lessons',
            html_url: 'https://github.com/freeCodeCamp/freeCodeCamp/issues/54798',
            labels: [
                { name: 'good first issue', color: '7057ff' },
                { name: 'language: Hindi', color: 'c5def5' },
                { name: 'scope: curriculum', color: 'fbca04' }
            ],
            created_at: '2026-09-08T11:05:44Z',
            updated_at: '2026-09-14T16:42:10Z',
            comments: 5,
            user: { login: 'hindi-learner', avatar_url: '' }
        },
        {
            number: 54756,
            title: 'Add alt text to images in Responsive Web Design project',
            html_url: 'https://github.com/freeCodeCamp/freeCodeCamp/issues/54756',
            labels: [
                { name: 'good first issue', color: '7057ff' },
                { name: 'scope: learn', color: '0e8a16' }
            ],
            created_at: '2026-09-05T08:44:12Z',
            updated_at: '2026-09-12T13:20:55Z',
            comments: 2,
            user: { login: 'a11y-enthusiast', avatar_url: '' }
        }
    ],

    // Recent commits (GET /repos/{owner}/{repo}/commits?per_page=5)
    recentCommits: [
        {
            sha: 'a1b2c3d4e5f6',
            commit: {
                message: 'fix(curriculum): update JavaScript challenge instructions',
                author: { name: 'Maintainer One', date: '2026-09-17T21:44:03Z' },
            },
            html_url: 'https://github.com/freeCodeCamp/freeCodeCamp/commit/a1b2c3d4e5f6'
        },
        {
            sha: 'b2c3d4e5f6a7',
            commit: {
                message: 'chore(deps): update dependency versions',
                author: { name: 'Maintainer Two', date: '2026-09-17T18:30:15Z' },
            },
            html_url: 'https://github.com/freeCodeCamp/freeCodeCamp/commit/b2c3d4e5f6a7'
        }
    ],

    // CI / Actions status (GET /repos/{owner}/{repo}/actions/runs?per_page=1)
    ciStatus: {
        total_count: 12480,
        workflow_runs: [
            {
                id: 98765432,
                name: 'CI - Node.js Tests',
                status: 'completed',
                conclusion: 'success',
                created_at: '2026-09-17T21:44:10Z',
                updated_at: '2026-09-17T21:52:33Z',
                html_url: 'https://github.com/freeCodeCamp/freeCodeCamp/actions/runs/98765432'
            }
        ]
    }
};


/**
 * Derived signals from mock data — these feed the camp reveal.
 * In production, these are computed from real GitHub API responses.
 */
export function extractSignals(data = MOCK_REPO_DATA) {
    const now = Date.now();
    const lastCommitDate = new Date(data.recentCommits[0]?.commit.author.date);
    const daysSinceCommit = Math.floor((now - lastCommitDate) / (1000 * 60 * 60 * 24));

    return {
        repoName: data.repo.full_name,
        repoUrl: data.repo.html_url,
        description: data.repo.description,
        language: data.repo.language,
        stars: data.repo.stargazers_count,

        // Signals for structures
        hasReadme: !!data.readme,
        readmeSize: data.readme?.size || 0,

        openIssueCount: data.repo.open_issues_count,

        goodFirstIssueCount: data.goodFirstIssues.length,
        goodFirstIssues: data.goodFirstIssues,

        hasContributing: !!data.contributing,

        maintainerActive: daysSinceCommit <= 7,
        daysSinceLastCommit: daysSinceCommit,
        lastCommitMessage: data.recentCommits[0]?.commit.message || '',

        ciPassing: data.ciStatus.workflow_runs[0]?.conclusion === 'success',
        ciRunName: data.ciStatus.workflow_runs[0]?.name || '',
    };
}
