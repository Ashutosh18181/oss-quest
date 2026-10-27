/**
 * OSS Quest — Strands Agent SDK Wrapper
 * Handles scoring a GitHub issue against a user profile using Groq/OpenAI via Strands Agent SDK.
 */

import { Agent } from "@strands-agents/sdk";
import { OpenAIModel } from "@strands-agents/sdk/models/openai";

function getHeuristicScores(issueData, userProfile) {
    const lang = (userProfile.language || 'javascript').toLowerCase();
    const titleAndDesc = `${issueData.issueTitle} ${issueData.description}`.toLowerCase();
    
    let languageFit = 85;
    if (titleAndDesc.includes(lang) || (issueData.repoName && issueData.repoName.toLowerCase().includes(lang))) {
        languageFit = 95;
    }
    
    const beginnerFriendliness = issueData.hasContributing ? 92 : 82;
    const responsiveness = issueData.hasRecentActivity ? 88 : 75;

    const reasoning = [];
    reasoning.push(`Uses ${userProfile.language || 'JavaScript'}, matching your chosen quest track.`);
    if (issueData.hasContributing) {
        reasoning.push("Has a CONTRIBUTING.md guide welcoming first-time contributors.");
    }
    if (issueData.hasRecentActivity) {
        reasoning.push("Maintainers have pushed updates recently, ensuring prompt feedback.");
    } else {
        reasoning.push("Tagged with 'good first issue' label for low barrier to entry.");
    }

    return {
        languageFit,
        beginnerFriendliness,
        responsiveness,
        reasoning
    };
}

export async function scoreIssueWithAgent(issueData, userProfile) {
    console.log("[Strands Agent] Scoring issue:", issueData.issueTitle);

    const groqKey = process.env.GROQ_API_KEY;
    const openaiKey = process.env.OPENAI_API_KEY;

    if (!groqKey && !openaiKey) {
        console.log("[Strands Agent] No GROQ_API_KEY or OPENAI_API_KEY provided. Using heuristic scoring.");
        return getHeuristicScores(issueData, userProfile);
    }

    let model;
    if (groqKey) {
        model = new OpenAIModel({
            modelId: 'llama-3.3-70b-versatile',
            apiKey: groqKey,
            clientArgs: {
                baseURL: 'https://api.groq.com/openai/v1'
            }
        });
    } else {
        model = new OpenAIModel({
            modelId: 'gpt-4o-mini',
            apiKey: openaiKey
        });
    }

    const agent = new Agent({ 
        model,
        systemPrompt: `You are an AI assistant helping beginners find open source issues.
Your job is to score a GitHub issue for a beginner based on their profile.

Output JSON only in this exact format:
{
    "languageFit": number (0-100),
    "beginnerFriendliness": number (0-100),
    "responsiveness": number (0-100),
    "reasoning": string[]
}
Do not output any markdown formatting, just the raw JSON.` 
    });

    const prompt = `User Profile:
Language: ${userProfile.language}
Skill Level: ${userProfile.skillLevel}

GitHub Issue:
Title: ${issueData.issueTitle}
Description: ${issueData.description}
Labels: good first issue

Score this issue.`;

    try {
        const response = await agent.invoke(prompt);
        const responseText = response.toString();
        let cleanJson = responseText.trim();
        if (cleanJson.startsWith('```json')) cleanJson = cleanJson.replace(/```json/g, '').replace(/```/g, '');
        else if (cleanJson.startsWith('```')) cleanJson = cleanJson.replace(/```/g, '');
        
        const scores = JSON.parse(cleanJson);
        return scores;
    } catch (e) {
        console.error("Strands Agent failed to score, falling back to smart heuristic scoring:", e.message);
        return getHeuristicScores(issueData, userProfile);
    }
}

