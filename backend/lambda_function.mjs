import https from 'https';
import { DynamoDBClient } from '@aws-sdk/client-dynamodb';
import { DynamoDBDocumentClient, GetCommand, PutCommand } from '@aws-sdk/lib-dynamodb';

// Initialize DynamoDB Client
const client = new DynamoDBClient({});
const docClient = DynamoDBDocumentClient.from(client);
const TABLE_NAME = 'OSSQuestProgress';

/**
 * Main Lambda Handler for OSS Quest API
 * Handles saving progress and fetching GitHub issues.
 */
export const handler = async (event) => {
    // Enable CORS
    const headers = {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Headers": "Content-Type,Authorization",
        "Access-Control-Allow-Methods": "OPTIONS,POST,GET"
    };

    if (event.requestContext.http.method === 'OPTIONS') {
        return { statusCode: 200, headers, body: '' };
    }

    const path = event.requestContext.http.path;
    const method = event.requestContext.http.method;

    try {
        // --- 1. PROGRESS ENDPOINTS ---
        if (path === '/progress') {
            // Very simple auth mock parsing for Hackathon:
            // The frontend sends a user ID in the Authorization header.
            // In a production app, you would verify a Cognito JWT token here.
            const authHeader = event.headers.authorization || '';
            const userId = authHeader.replace('Bearer ', '').trim();

            if (!userId) {
                return { statusCode: 401, headers, body: JSON.stringify({ error: "Unauthorized" }) };
            }

            if (method === 'GET') {
                const response = await docClient.send(new GetCommand({
                    TableName: TABLE_NAME,
                    Key: { userId }
                }));
                return {
                    statusCode: 200,
                    headers,
                    body: JSON.stringify(response.Item || { error: "No progress found" })
                };
            }

            if (method === 'POST') {
                const body = JSON.parse(event.body);
                await docClient.send(new PutCommand({
                    TableName: TABLE_NAME,
                    Item: {
                        userId: userId,
                        ...body,
                        updatedAt: new Date().toISOString()
                    }
                }));
                return { statusCode: 200, headers, body: JSON.stringify({ success: true }) };
            }
        }

        // --- 2. GITHUB MATCHING ENDPOINT ---
        if (path === '/match' && method === 'GET') {
            const token = process.env.GITHUB_PAT;
            if (!token) {
                return { statusCode: 500, headers, body: JSON.stringify({ error: "Missing GITHUB_PAT env variable." }) };
            }

            const queryParams = event.queryStringParameters || {};
            const lang = queryParams.language || 'javascript';
            const q = encodeURIComponent(`is:issue is:open label:"good first issue" language:${lang}`);

            const data = await fetchGitHubAPI(`/search/issues?q=${q}&sort=updated&order=desc&per_page=10`, token);
            
            if (!data.items || data.items.length === 0) {
                return { statusCode: 404, headers, body: JSON.stringify({ error: "No issues found." }) };
            }

            // Pick a random issue from the top 10 recent ones
            const issue = data.items[Math.floor(Math.random() * data.items.length)];
            const repoUrlParts = issue.repository_url.split('/');
            const repoName = `${repoUrlParts[repoUrlParts.length - 2]}/${repoUrlParts[repoUrlParts.length - 1]}`;

            // Return mock Bedrock scores for now (easy to replace later)
            return {
                statusCode: 200,
                headers,
                body: JSON.stringify({
                    repoName,
                    repoUrl: `https://github.com/${repoName}`,
                    issueTitle: issue.title,
                    issueUrl: issue.html_url,
                    description: issue.body ? issue.body.substring(0, 200) + '...' : 'No description provided.',
                    matchScore: Math.floor(Math.random() * 20) + 80,
                    openIssueCount: 42,
                    ciPassing: true
                })
            };
        }

        return { statusCode: 404, headers, body: JSON.stringify({ error: "Not Found" }) };

    } catch (error) {
        console.error("Internal Server Error:", error);
        return {
            statusCode: 500,
            headers,
            body: JSON.stringify({ error: "Internal Server Error", details: error.message })
        };
    }
};

/** Helper to fetch from GitHub securely */
function fetchGitHubAPI(path, token) {
    return new Promise((resolve, reject) => {
        const req = https.request({
            hostname: 'api.github.com',
            port: 443,
            path: path,
            method: 'GET',
            headers: {
                'User-Agent': 'OSS-Quest-Backend/1.0',
                'Authorization': `Bearer ${token}`,
                'Accept': 'application/vnd.github.v3+json'
            }
        }, (res) => {
            let data = '';
            res.on('data', chunk => data += chunk);
            res.on('end', () => {
                if (res.statusCode >= 200 && res.statusCode < 300) resolve(JSON.parse(data));
                else reject(new Error(`GitHub API Error: ${res.statusCode} - ${data}`));
            });
        });
        req.on('error', reject);
        req.end();
    });
}
