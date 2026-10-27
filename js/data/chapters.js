/**
 * OSS Quest — Chapter Definitions
 * 6 chapters taking a learner from zero to first PR.
 */

export const CHAPTERS = [
    {
        id: 1,
        title: 'What Is Git & GitHub?',
        title_hi: 'Git और GitHub क्या हैं?',
        title_od: 'Git ଏବଂ GitHub କ’ଣ?',
        subtitle: 'The notebook that remembers everything',
        subtitle_hi: 'वह नोटबुक जो सब कुछ याद रखती है',
        subtitle_od: 'ସବୁକିଛି ମନେ ରଖୁଥିବା ଡାଏରୀ',
        xpReward: 50,
        icon: '📓',
        description: 'Understand what version control means and why developers use Git and GitHub — no coding required.',
        content: [
            {
                heading: 'Version control in plain words',
                body: `Imagine you're writing a story with friends. Everyone has their own copy, but you need one "true" version you all agree on. That's what <span class="jargon" data-term="version-control">version control</span> does for code — it keeps one shared history so nobody overwrites anyone else's work.`
            },
            {
                heading: 'Git: the history machine',
                body: `<span class="jargon" data-term="git">Git</span> is a tool that runs on your computer. Every time you save a snapshot of your work, Git remembers exactly what changed, when, and who did it. These snapshots are called <span class="jargon" data-term="commit">commits</span>. You can always go back to any earlier snapshot — nothing is ever truly lost.`
            },
            {
                heading: 'GitHub: the shared shelf',
                body: `<span class="jargon" data-term="github">GitHub</span> is a website where people store their Git projects so others can see, copy, and contribute to them. Think of it as a public library shelf — anyone can read the books, and if you want to suggest an edit, there's a process for that.`
            },
            {
                heading: 'Repository = project folder',
                body: `A <span class="jargon" data-term="repository">repository</span> (or "repo") is just a project folder tracked by Git. It contains the code files, a history of every change, and usually a <span class="jargon" data-term="readme">README</span> file that explains what the project is about.`
            }
        ]
    },
    {
        id: 2,
        title: 'Forking & Cloning',
        title_hi: 'फ़ोर्किंग और क्लोनिंग',
        title_od: 'ଫୋର୍କିଂ ଏବଂ କ୍ଲୋନିଂ',
        subtitle: 'Making your own copy to play with',
        subtitle_hi: 'सीखने के लिए अपनी प्रतिलिपि बनाना',
        subtitle_od: 'ଶିଖିବା ପାଇଁ ନିଜର ଏକ କପି ତିଆରି କରିବା',
        xpReward: 75,
        icon: '🍴',
        description: 'Learn how to make your own copy of a project and get it onto your computer.',
        content: [
            {
                heading: 'What is a fork?',
                body: `A <span class="jargon" data-term="fork">fork</span> is your personal copy of someone else's repository on GitHub. It lives under your own account, so you can change anything you want without affecting the original project. It's like photocopying a library book — the original stays on the shelf.`
            },
            {
                heading: 'Cloning: download to your machine',
                body: `<span class="jargon" data-term="clone">Cloning</span> downloads a copy of a repository from GitHub to your own computer. After cloning, you have all the files and the full history right on your machine, ready to explore and edit.`
            },
            {
                heading: 'The fork-clone workflow',
                body: `Here's the typical beginner flow:\n\n1. Find a project you want to contribute to\n2. Click "Fork" on GitHub — now you have your own copy online\n3. Clone your fork to your computer\n4. Make changes locally\n5. Push your changes back up to your fork\n6. Ask the original project to accept your changes`
            },
            {
                heading: 'Try it yourself',
                body: `Don't worry about doing this for real yet — Chapter 5 will match you to a specific project, and Chapter 6 will walk you through every step. For now, just understand the idea: fork = your online copy, clone = your local copy.`
            }
        ]
    },
    {
        id: 3,
        title: 'Reading an Unfamiliar Codebase',
        title_hi: 'अनजान कोडबेस को समझना',
        title_od: 'ନୂତନ କୋଡବେସ୍ ପଢ଼ିବା',
        subtitle: 'Finding your way in someone else\'s project',
        subtitle_hi: 'किसी और के प्रोजेक्ट में अपना रास्ता खोजना',
        subtitle_od: 'ଅନ୍ୟର ପ୍ରୋଜେକ୍ଟରେ ନିଜ ରାସ୍ତା ଖୋଜିବା',
        xpReward: 100,
        icon: '🗺️',
        description: 'Real projects have thousands of files. Learn where to look first and how to make sense of code you didn\'t write.',
        content: [
            {
                heading: 'Start with the README',
                body: `Every well-maintained project has a <span class="jargon" data-term="readme">README</span> file. This is your map. It usually explains what the project does, how to set it up, and how to contribute. Always read this first.`
            },
            {
                heading: 'Look at the file structure',
                body: `Before reading any code, look at the folder names. Most projects organize code into folders like "src" (source code), "tests", "docs" (documentation), and "config". The folder names tell you where things live.`
            },
            {
                heading: 'Find the entry point',
                body: `Every program has a starting point — the file that runs first. In a web project, it might be "index.html" or "app.js". In Python, look for "main.py" or "__main__.py". Finding the entry point shows you how the pieces connect.`
            },
            {
                heading: 'Read issues, not just code',
                body: `<span class="jargon" data-term="issue">Issues</span> on GitHub are where people report bugs and request features. Reading open issues tells you what's broken or missing — and what might be a good place for you to help.`
            }
        ]
    },
    {
        id: 4,
        title: 'Talking to a Maintainer',
        title_hi: 'मेंटेनर से बातचीत करना',
        title_od: 'ମେଣ୍ଟେନରଙ୍କ ସହ କଥାବାର୍ତ୍ତା',
        subtitle: 'How to ask a question without being annoying',
        subtitle_hi: 'सही शिष्टाचार से प्रश्न कैसे पूछें',
        subtitle_od: 'ସଠିକ୍ ଉପାୟରେ ପ୍ରଶ୍ନ କିପରି ପଚାରିବେ',
        xpReward: 100,
        icon: '💬',
        description: 'Maintainers are busy humans. Learn the etiquette of asking for help on open-source projects.',
        content: [
            {
                heading: 'Who is a maintainer?',
                body: `A <span class="jargon" data-term="maintainer">maintainer</span> is the person (or team) who manages a project — they review contributions, merge changes, and keep things running. They're usually volunteers doing this in their free time.`
            },
            {
                heading: 'Read the contributing guide first',
                body: `Most projects have a <span class="jargon" data-term="contributing-guide">CONTRIBUTING.md</span> file that explains how they want you to contribute. Reading this before asking a question shows respect for their time and process.`
            },
            {
                heading: 'How to write a good comment',
                body: `When commenting on an issue:\n\n• Say what you tried and what happened\n• Be specific — "it doesn't work" isn't helpful\n• Show the exact error message if there is one\n• Be polite and patient — responses can take days\n• Say thank you when someone helps`
            },
            {
                heading: 'Claiming an issue',
                body: `If you want to work on an issue, leave a comment saying "I'd like to work on this." Some projects use labels like <span class="jargon" data-term="good-first-issue">"good first issue"</span> to mark tasks suitable for newcomers. Wait for a maintainer to acknowledge before starting.`
            }
        ]
    },
    {
        id: 5,
        title: 'Finding Your Match',
        title_hi: 'अपने लिए सही प्रोजेक्ट ढूँढना',
        title_od: 'ଆପଣଙ୍କ ପାଇଁ ଉପଯୁକ୍ତ ପ୍ରୋଜେକ୍ଟ',
        subtitle: 'A real repository, matched to you',
        subtitle_hi: 'एक असली रिपॉजिटरी, आपके कौशल के अनुसार',
        subtitle_od: 'ଏକ ପ୍ରକୃତ ରିପୋଜିଟୋରୀ',
        xpReward: 150,
        icon: '🏕️',
        description: 'We scan real GitHub repositories and find one that fits your skill level and language. Watch your camp build itself.',
        isCampChapter: true,
        content: [
            {
                heading: 'How matching works',
                body: `We look at real, active projects on GitHub and score them on three things:\n\n• <strong>Language fit</strong> — does the project use a language you know or are learning?\n• <strong>Difficulty</strong> — are there issues labeled for beginners?\n• <strong>Maintainer responsiveness</strong> — does someone actually respond when contributors ask questions?`
            },
            {
                heading: 'Your camp builds itself',
                body: `When we find a match, you'll see it unfold as a camp — each piece of data becomes a structure on your map. Watch as we read the README, count the issues, check for beginner labels, and verify that the maintainers are active.`
            },
            {
                heading: 'Your scored result',
                body: `After the camp builds, you'll see a confidence card showing exactly why this project was chosen for you. No black box — every score is visible.`
            }
        ]
    },
    {
        id: 6,
        title: 'Your First Pull Request',
        title_hi: 'आपका पहला पुल रिक्वेस्ट (PR)',
        title_od: 'ଆପଣଙ୍କର ପ୍ରଥମ ପୁଲ୍ ରିକ୍ୱେଷ୍ଟ',
        subtitle: 'Ship it — for real',
        subtitle_hi: 'असली बदलाव सबमिट करें',
        subtitle_od: 'ପ୍ରକୃତ ପରିବର୍ତ୍ତନ ସବମିଟ୍ କରନ୍ତୁ',
        xpReward: 200,
        icon: '🚀',
        description: 'Follow the step-by-step guide to fork the matched repo, make a change, and open your very first pull request.',
        content: [
            {
                heading: 'The PR checklist',
                body: `A <span class="jargon" data-term="pull-request">pull request</span> (PR) is how you suggest your changes to the original project. Here's the step-by-step:\n\n1. Fork the repository\n2. Clone your fork to your computer\n3. Create a new <span class="jargon" data-term="branch">branch</span> for your change\n4. Make your edit\n5. <span class="jargon" data-term="commit">Commit</span> your change with a clear message\n6. Push to your fork\n7. Open a pull request on the original repo`
            },
            {
                heading: 'Writing a good PR description',
                body: `Your PR description should explain:\n\n• What you changed and why\n• Which issue it fixes (reference it with "#" and the issue number)\n• Any questions you have for the reviewer\n\nKeep it simple and clear. Maintainers read dozens of PRs — make theirs easy.`
            },
            {
                heading: 'What happens next',
                body: `After you open your PR, the maintainer will review it. They might:\n\n• Approve and merge it ✅\n• Ask for changes 🔄\n• Leave comments with suggestions 💬\n\nThis is normal! Even experienced developers get review feedback. Respond politely, make requested changes, and push again.`
            },
            {
                heading: 'You did it 🎉',
                body: `Once your PR is merged, your contribution is part of the project forever. You'll appear in the contributors list, and you'll have made your first real open-source contribution. Welcome to the community.`
            }
        ]
    }
];
