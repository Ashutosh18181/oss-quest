import https from 'https';

/**
 * OSS Quest — AWS Lambda Backend
 * Handles fetching GitHub issues securely without exposing the PAT.
 */
export const handler = async (event) => {
    // Enable CORS for API Gateway
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    };

    if (event.httpMethod === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    const token = process.env.GITHUB_PAT;
    if (!token) {
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Server misconfiguration: missing PAT." })
        };
    }

    try {
        const queryParams = event.queryStringParameters || {};
        const lang = queryParams.language || 'javascript';
        const q = encodeURIComponent(`is:issue is:open label:"good first issue" language:${lang}`);

        const data = await fetchGitHubAPI(`/search/issues?q=${q}&sort=updated&order=desc&per_page=10`, token);
        
        if (!data.items || data.items.length === 0) {
            return {
                statusCode: 404,
                headers,
                body: JSON.stringify({ error: "No issues found." })
            };
        }

        // Return a randomly selected issue from the top 10
        const randomIssue = data.items[Math.floor(Math.random() * data.items.length)];
        
        // Extract repo owner/name from repository_url
        const repoUrlParts = randomIssue.repository_url.split('/');
        const repoName = `${repoUrlParts[repoUrlParts.length - 2]}/${repoUrlParts[repoUrlParts.length - 1]}`;

        return {
            statusCode: 200,
            headers,
            body: JSON.stringify({
                repoName,
                repoUrl: `https://github.com/${repoName}`,
                issueTitle: randomIssue.title,
                issueUrl: randomIssue.html_url,
                description: randomIssue.body ? randomIssue.body.substring(0, 200) + '...' : 'No description provided.',
                matchScore: Math.floor(Math.random() * 20) + 80 // Synthetic score for game feel
            })
        };

    } catch (error) {
        console.error(error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Failed to fetch from GitHub." })
        };
    }
};

/** Helper to make HTTPS requests to GitHub API */
function fetchGitHubAPI(path, token) {
    return new Promise((resolve, reject) => {
        const options = {
            hostname: 'api.github.com',
            port: 443,
            path: path,
            method: 'GET',
            headers: {
                'User-Agent': 'OSS-Quest-Backend/1.0',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        };

        const req = https.request(options, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) {
                    resolve(JSON.parse(data));
                } else {
                    reject(new Error(`GitHub API Error: ${res.statusCode} - ${data}`));
                }
            });
        });

        req.on('error', reject);
        req.end();
    });
}
