/**
 * OSS Quest — Matching Service
 * Scores repo match quality using heuristics.
 * Bedrock-ready: in production, this sends data to Lambda → Bedrock.
 */

const USE_MOCK = true; // Toggle to false when Bedrock endpoint is available

/**
 * Score a repository match for a learner.
 * @param {object} signals — from extractSignals()
 * @param {object} learnerProfile — { language, skillLevel }
 * @returns {Promise<object>} — match scores
 */
export async function scoreMatch(signals, learnerProfile = {}) {
    if (!USE_MOCK) {
        // In production: call Lambda endpoint
        try {
            const res = await fetch('/api/match', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify({ signals, learnerProfile }),
            });
            if (res.ok) return await res.json();
        } catch (e) {
            console.warn('Bedrock scoring failed, using heuristic fallback:', e);
        }
    }

    // --- Heuristic scoring (client-side fallback) ---
    await delay(500); // Simulate processing time

    return computeHeuristicScores(signals, learnerProfile);
}


/**
 * Compute match scores from repo signals using simple heuristics.
 */
function computeHeuristicScores(signals, profile) {
    // Language Fit (0-100)
    let languageFit = 60; // Base score
    if (signals.language) {
        const repoLang = signals.language.toLowerCase();
        // Boost if it's a beginner-friendly language
        const beginnerLangs = ['javascript', 'python', 'typescript', 'html', 'css', 'markdown'];
        if (beginnerLangs.includes(repoLang)) languageFit += 25;
        // Extra boost if it matches learner's stated interest (when available)
        if (profile.preferredLanguage && repoLang.includes(profile.preferredLanguage.toLowerCase())) {
            languageFit += 15;
        }
    }
    languageFit = Math.min(languageFit, 100);

    // Difficulty (0-100, lower = easier = better for beginners)
    let difficulty = 50;
    if (signals.goodFirstIssueCount > 0) difficulty -= 15;
    if (signals.goodFirstIssueCount >= 3) difficulty -= 10;
    if (signals.hasContributing) difficulty -= 10;
    if (signals.hasReadme) difficulty -= 5;
    if (signals.openIssueCount > 100) difficulty += 10; // Large issue count can be overwhelming
    difficulty = Math.max(10, Math.min(difficulty, 100));

    // Invert: show as "beginner friendliness" (higher = more beginner-friendly)
    const beginnerFriendliness = 100 - difficulty;

    // Maintainer Responsiveness (0-100)
    let responsiveness = 40;
    if (signals.maintainerActive) responsiveness += 30;
    if (signals.daysSinceLastCommit <= 1) responsiveness += 20;
    else if (signals.daysSinceLastCommit <= 3) responsiveness += 15;
    else if (signals.daysSinceLastCommit <= 7) responsiveness += 10;
    if (signals.ciPassing) responsiveness += 10;
    responsiveness = Math.min(responsiveness, 100);

    // Overall confidence
    const overall = Math.round((languageFit + beginnerFriendliness + responsiveness) / 3);

    return {
        languageFit: Math.round(languageFit),
        beginnerFriendliness: Math.round(beginnerFriendliness),
        responsiveness: Math.round(responsiveness),
        overall,
        recommendation: overall >= 70 ? 'strong' : overall >= 50 ? 'moderate' : 'weak',
        reasoning: generateReasoning(signals, { languageFit, beginnerFriendliness, responsiveness }),
    };
}


/** Generate human-readable reasoning for the match. */
function generateReasoning(signals, scores) {
    const reasons = [];

    if (scores.languageFit >= 80) {
        reasons.push(`Uses ${signals.language}, which is beginner-friendly and widely documented.`);
    } else if (scores.languageFit >= 60) {
        reasons.push(`Uses ${signals.language} — accessible for learners with some programming exposure.`);
    }

    if (signals.goodFirstIssueCount > 0) {
        reasons.push(`Has ${signals.goodFirstIssueCount} issue${signals.goodFirstIssueCount > 1 ? 's' : ''} tagged "good first issue" — maintainers actively welcome newcomers.`);
    }

    if (signals.hasContributing) {
        reasons.push('Has a contributing guide with clear instructions for new contributors.');
    }

    if (signals.maintainerActive) {
        reasons.push(`Maintainers were active ${signals.daysSinceLastCommit} day${signals.daysSinceLastCommit === 1 ? '' : 's'} ago — you'll likely get a response.`);
    }

    if (signals.ciPassing) {
        reasons.push('CI is passing — the project is stable and well-maintained.');
    }

    return reasons;
}


function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
}
