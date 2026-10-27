# OSS Quest — SPEC

## 1. Project Overview
OSS Quest is a gamified open-source contribution onboarding experience, built for a non-CS-background / regional-language (Hindi/Odia) first-time contributor. The player travels between six villages on a world map. Each village holds one NPC who teaches one real concept (Git, forking/cloning, reading a codebase, asking questions, attempting a fix, opening a pull request) through in-world dialogue and a quest.

The final village uses a real, live-fetched GitHub issue (matched and scored via a locally-run Strands agent) as the basis for a guided simulated-terminal walkthrough, ending with a real link to a real issue.

## 2. Technical Stack
- **Frontend:** Vanilla JavaScript & HTML5 Canvas. Custom rendering engine for high-resolution backgrounds and sprite sheet animations.
- **Backend:** Node.js Express server (port 3001).
- **Data Storage:** Local JSON file (`backend/data/progress.json`) for progress/XP/streak state.
- **Auth:** None — single local player session, no sign-in flow.
- **AI/ML Integration:** Strands Agents SDK running locally to match and score GitHub issues based on user profile.
- **External API:** GitHub REST API (Read-Only) to fetch open issues from beginner-friendly repositories.

## 3. World Structure & Assets
- **Overworld:** Six village nodes. The player freely walks using WASD/Arrow Keys and enters villages by pressing 'E' when nearby.
- **Villages:**
  1. The Forge
  2. The Old Copyworks
  3. The Reading Grove
  4. The Speaking Well
  5. The Proving Grounds
  6. The Gate of Merging
- **Player & NPCs:** Rendered as full dynamic sprites (auto-processed at runtime to remove white backgrounds).
- **Ambient Elements:** Sprite sheet animations (like cats and campfires) using dynamic frame-width calculation.

## 4. Current State
- The game is fully functional. 
- All character assets have been integrated.
- The player can travel seamlessly using WASD movement in both the Overworld and Villages.
- The Strands Agent SDK successfully integrates and scores real GitHub issues.

## 5. Next Steps
- Final playtesting and recording the live demo video for the AWS Code Conquest submission.
