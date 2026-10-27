/**
 * OSS Quest — Terminal Minigame
 * Simulates a command-line interface for Chapter 6.
 * Guides the user through Git commands based on the matched GitHub issue.
 */

export class TerminalMinigame {
    constructor() {
        this._handleInput = this._handleInput.bind(this);

        const oldContainer = document.getElementById('terminal-overlay');
        if (oldContainer) oldContainer.remove();
        
        this._createDOM();
        
        this.isOpen = false;
        this.repo = null;
        this.onComplete = null;
        
        this.steps = [];
        this.currentStep = 0;
    }

    _createDOM() {
        this.container = document.createElement('div');
        this.container.id = 'terminal-overlay';
        this.container.className = 'terminal-overlay hidden';
        this.container.innerHTML = `
            <div class="terminal-window">
                <div class="terminal-header">
                    <span class="terminal-dot red"></span>
                    <span class="terminal-dot yellow"></span>
                    <span class="terminal-dot green"></span>
                    <span class="terminal-title">~/oss-quest/workspace</span>
                </div>
                <div class="terminal-body" id="terminal-body">
                    <div id="terminal-history"></div>
                    <div class="terminal-input-line">
                        <span class="prompt">$</span>
                        <input type="text" id="terminal-input" autocomplete="off" spellcheck="false" />
                    </div>
                </div>
            </div>
            
            <div class="terminal-instruction-panel" id="terminal-instructions">
                <h3 id="term-inst-title">Goal</h3>
                <p id="term-inst-desc">Description</p>
            </div>
        `;
        document.getElementById('app-ui-layer').appendChild(this.container);
        
        this.historyEl = document.getElementById('terminal-history');
        this.inputEl = document.getElementById('terminal-input');
        
        this.instTitle = document.getElementById('term-inst-title');
        this.instDesc = document.getElementById('term-inst-desc');
        
        this.inputEl.addEventListener('keydown', this._handleInput);
    }

    start(repoData, onComplete) {
        this.repo = repoData || { repoName: "example/repo", repoUrl: "https://github.com/example/repo" };
        this.onComplete = onComplete;
        this.isOpen = true;
        
        // Define the steps dynamically based on the repo data
        const repoBaseName = this.repo.repoName.split('/')[1] || "project";
        const escapedBase = repoBaseName.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
        
        this.steps = [
            {
                goal: "Clone the Repository",
                desc: `You've forked <strong>${this.repo.repoName}</strong>. Now, pull your fork down to your computer. Type:<br><code>git clone https://github.com/yourname/${repoBaseName}.git</code>`,
                expected: new RegExp(`^git clone https://github\\.com/[\\w.-]+/${escapedBase}(?:\\.git)?$`),
                successMsg: `Cloning into '${repoBaseName}'...\nremote: Enumerating objects: 1240, done.\nReceiving objects: 100% (1240/1240), done.`
            },
            {
                goal: "Enter the Directory",
                desc: `Move into the project folder. Type:<br><code>cd ${repoBaseName}</code>`,
                expected: new RegExp(`^cd ${escapedBase}$`),
                successMsg: null,
                action: () => {
                    document.querySelector('.terminal-title').textContent = `~/oss-quest/${repoBaseName}`;
                }
            },
            {
                goal: "Create a Branch",
                desc: `Never work on the main branch! Create a new branch for your fix. Type:<br><code>git checkout -b fix-issue</code>`,
                expected: /^git checkout -b fix-issue$/,
                successMsg: `Switched to a new branch 'fix-issue'`
            },
            {
                goal: "Commit Your Changes",
                desc: `Pretend you've fixed the issue. Save your changes with a commit message. Type:<br><code>git commit -m "fix: resolve issue"</code>`,
                expected: /^git commit -m ".+"$/,
                successMsg: `[fix-issue a1b2c3d] fix: resolve issue\n 1 file changed, 4 insertions(+), 1 deletion(-)`
            },
            {
                goal: "Push to GitHub",
                desc: `Send your new branch back up to your fork on GitHub. Type:<br><code>git push origin fix-issue</code>`,
                expected: /^git push origin fix-issue$/,
                successMsg: `Enumerating objects: 5, done.\nWriting objects: 100% (3/3), 324 bytes, done.\nTo https://github.com/yourname/${repoBaseName}.git\n * [new branch]      fix-issue -> fix-issue`
            }
        ];

        this.currentStep = 0;
        this.historyEl.innerHTML = `Welcome to the OSS Quest Terminal.\nConnected to workspace.\n\n`;
        this.inputEl.value = '';
        this.inputEl.disabled = false;
        this.container.classList.remove('hidden');
        
        // Timeout to allow display:block to apply before focus
        setTimeout(() => this.inputEl.focus(), 100);
        
        this._updateInstructions();
    }

    _updateInstructions() {
        const step = this.steps[this.currentStep];
        this.instTitle.textContent = `${this.currentStep + 1}/${this.steps.length}: ${step.goal}`;
        this.instDesc.innerHTML = step.desc;
    }

    _handleInput(e) {
        if (e.key === 'Enter') {
            const val = this.inputEl.value.trim();
            if (!val) return;
            
            this._print(`$ ${val}`);
            this.inputEl.value = '';
            
            const step = this.steps[this.currentStep];
            
            if (step.expected.test(val)) {
                // Success
                this._playSFX('success');
                if (step.action) step.action();
                if (step.successMsg) this._print(step.successMsg, 'success');
                
                this.currentStep++;
                if (this.currentStep >= this.steps.length) {
                    this._finish();
                } else {
                    this._updateInstructions();
                }
            } else {
                // Error
                this._playSFX('error');
                this._print(`Command not recognized or incorrect. Read the instructions carefully.`, 'error');
            }
            
            this.historyEl.scrollTop = this.historyEl.scrollHeight;
        }
    }

    _print(text, type = '') {
        const div = document.createElement('div');
        div.className = `term-line ${type}`;
        div.textContent = text;
        this.historyEl.appendChild(div);
    }

    _playSFX(type) {
        // Simple AudioContext synthetic beeps
        try {
            const actx = new (window.AudioContext || window.webkitAudioContext)();
            const osc = actx.createOscillator();
            const gain = actx.createGain();
            osc.connect(gain);
            gain.connect(actx.destination);
            
            if (type === 'success') {
                osc.frequency.setValueAtTime(600, actx.currentTime);
                osc.frequency.exponentialRampToValueAtTime(1200, actx.currentTime + 0.1);
                gain.gain.setValueAtTime(0.1, actx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 0.1);
                osc.start();
                osc.stop(actx.currentTime + 0.1);
            } else {
                osc.type = 'square';
                osc.frequency.setValueAtTime(150, actx.currentTime);
                gain.gain.setValueAtTime(0.1, actx.currentTime);
                gain.gain.exponentialRampToValueAtTime(0.01, actx.currentTime + 0.2);
                osc.start();
                osc.stop(actx.currentTime + 0.2);
            }
        } catch (e) {
            // Audio context not supported or blocked, ignore
        }
    }

    _finish() {
        const targetUrl = this.repo.issueUrl || this.repo.repoUrl || 'https://github.com';
        this.instTitle.textContent = "Pull Request Ready! ⚔️";
        this.instDesc.innerHTML = `You've mastered the Git workflow in simulation! Now take on the real quest:<br><br>
        <div style="display:flex; flex-direction:column; gap:12px; margin-top:14px;">
            <a href="${targetUrl}" target="_blank" rel="noopener" class="btn btn--primary" style="display:inline-block; text-align:center; text-decoration:none;">
                Open Real Issue on GitHub ↗
            </a>
            <button id="term-close-btn" class="btn btn--ghost">Return to Captain Voss</button>
        </div>`;
        
        this.inputEl.disabled = true;
        
        document.getElementById('term-close-btn').addEventListener('click', () => {
            this.close();
            if (this.onComplete) this.onComplete();
        });
    }

    close() {
        this.isOpen = false;
        if (this.container) {
            this.container.classList.add('hidden');
        }
    }
}
