# ⚔️ OSS Quest

**A Gamified Onboarding Experience for First-Time Open Source Contributors**


## 📖 Project Overview
Making your very first open-source contribution is terrifying. Beginners are often overwhelmed by massive codebases, complex setups, and undocumented issues. OSS Quest solves this by turning the learning journey into a familiar, engaging retro RPG. 

You explore villages, talk to NPCs, and learn essential Git workflows in a safe, simulated environment. Finally, our intelligent backend matches you with a real "good first issue" on GitHub that fits your skill level and language preference, providing a guided handoff to make your first real pull request.

## ✨ Features
- **Interactive RPG World:** 6 beautifully crafted villages connected by an open overworld, featuring WASD movement and full sprite animations.
- **Gamified Learning:** Dialogue-driven quests that teach you Git, forking, and codebase navigation.
- **Simulated Terminal:** A safe space to practice terminal commands before doing them for real.
- **AI-Powered Issue Matching:** Uses the Strands Agent SDK to dynamically scan real GitHub repositories and score open issues based on your selected coding experience.

## 🛠️ Technology Stack
- **Frontend:** Vanilla JavaScript, HTML5 Canvas, Vanilla CSS.
- **Backend:** Node.js, Express.
- **Data Storage:** Local JSON-based caching (`progress.json`).
- **AI & ML:** Strands Agent SDK (Local Execution), OpenAI.
- **APIs:** GitHub REST API (Read-only access).

## 🚀 Setup Instructions

### Prerequisites
- [Node.js](https://nodejs.org/en/) (v18 or higher recommended)
- A GitHub Personal Access Token (PAT) with read-only access to public repositories.
- An OpenAI API Key (for the Strands Agent SDK).

### 1. Backend Setup
1. Open a terminal and navigate to the backend directory:
   ```bash
   cd backend
   ```
2. Install dependencies:
   ```bash
   npm install --legacy-peer-deps
   ```
3. Create a `.env` file in the `backend` folder and add your API keys (see `Environment Variables` below).
4. Start the backend server:
   ```bash
   npm start
   ```
   *The backend will run on `http://localhost:3001`.*

### 2. Frontend Setup
1. Open a new terminal in the root directory.
2. Run a local web server (using `serve`, `http-server`, or similar). For example:
   ```bash
   npx serve -p 8080
   ```
3. Open your browser and navigate to `http://localhost:8080`.

## 🔐 Environment Variables
You must create a `.env` file in the `backend/` directory. For security, never commit your real keys. An example `.env.example` has been provided:

```env
# backend/.env
GITHUB_TOKEN=your_github_personal_access_token
OPENAI_API_KEY=your_openai_api_key
```

## 🙏 Acknowledgements
- **GitHub API** for providing real-world issue data.
- **Strands Agent SDK** for the AI orchestration.
- All AI-generated art assets were created and uniquely prompted by the solo developer for this project.
