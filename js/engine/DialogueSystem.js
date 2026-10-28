/**
 * OSS Quest — Dialogue System
 * Manages the RPG dialogue box, typewriter effects, and dialogue flow.
 */

import { DIALOGUE_SCRIPTS, processDialogueText, getNodeText, getChoiceLabel, getLocalizedUI } from '../data/dialogues.js';

export class DialogueSystem {
    constructor() {
        this.container = document.getElementById('dialogue-box');
        this.nameEl = document.getElementById('dialogue-name');
        this.roleEl = document.getElementById('dialogue-role');
        this.textEl = document.getElementById('dialogue-text');
        this.choicesContainer = document.getElementById('dialogue-choices');
        this.closeBtn = document.getElementById('dialogue-close-btn');
        this.portraitEl = document.getElementById('dialogue-portrait');

        this.isOpen = false;
        this.currentNpc = null;
        this.script = null;
        this.currentNodeIdx = 0;
        this.isTyping = false;
        this.language = 'en';
        
        this.onComplete = null;
        this.onTriggerCamp = null;
        this.onTriggerTerminal = null;

        // Typewriter interval
        this._typeInterval = null;
        this._fullTextHtml = "";

        this._setupListeners();
    }

    _setupListeners() {
        if (this.closeBtn) {
            this.closeBtn.addEventListener('click', () => this.close());
        }
        
        // Keyboard handler for dialogue choices and closing
        window.addEventListener('keydown', (e) => {
            if (!this.isOpen) return;

            if (['ArrowUp', 'ArrowDown', 'ArrowLeft', 'ArrowRight', ' '].includes(e.key)) {
                e.preventDefault();
            }

            if (e.key === 'Escape') {
                this.close();
            }

            // Number keys for choices
            if (!this.isTyping && this.script && this.script.nodes[this.currentNodeIdx].choices) {
                const choices = this.script.nodes[this.currentNodeIdx].choices;
                const num = parseInt(e.key, 10);
                if (!isNaN(num) && num >= 1 && num <= choices.length) {
                    this._selectChoice(num - 1);
                }
            } else if (!this.isTyping && e.key === 'Enter') {
                // If no choices, Enter advances
                const node = this.script.nodes[this.currentNodeIdx];
                if (!node.choices) {
                    this._advance();
                }
            } else if (this.isTyping && (e.key === 'Enter' || e.key === ' ')) {
                // Skip typing
                this._skipTyping();
            }
        });
    }

    /** Open dialogue with an NPC. */
    open(npc, language = 'en') {
        if (!this.container) return;

        this.currentNpc = npc;
        this.script = DIALOGUE_SCRIPTS[npc.id];
        this.language = language || 'en';
        this.currentNodeIdx = 0;
        
        const ui = getLocalizedUI(this.language);
        this.nameEl.textContent = npc.name;
        this.roleEl.textContent = ui.roles[npc.id] || npc.role;
        
        if (this.closeBtn) {
            this.closeBtn.innerHTML = `${ui.escLeave} <span class="vol-icon">🔊</span>`;
        }

        if (this.portraitEl) {
            this.portraitEl.onerror = () => {
                this.portraitEl.src = 'assets/borin.png';
            };
            this.portraitEl.src = `assets/${npc.id}.png`;
        }
        
        this.container.classList.add('visible');
        this.isOpen = true;

        this._showNode(0);
    }

    /** Display a specific node in the conversation. */
    _showNode(idx) {
        if (!this.script || !this.script.nodes[idx]) {
            this.close();
            return;
        }

        this.currentNodeIdx = idx;
        const node = this.script.nodes[idx];
        const rawText = getNodeText(node, this.language);
        
        // Process text for jargon
        this._fullTextHtml = processDialogueText(rawText, this.language);
        this.choicesContainer.innerHTML = '';
        this.choicesContainer.style.display = 'none';
        
        this._typewrite(rawText, this._fullTextHtml).then(() => {
            this._showChoices(node);
        });
    }

    /** Typewriter effect. */
    _typewrite(plainText, fullHtml) {
        return new Promise(resolve => {
            this.isTyping = true;
            this.textEl.innerHTML = '';
            
            let i = 0;
            const textToType = plainText.replace(/~/g, ''); // strip jargon markers for typing
            
            clearInterval(this._typeInterval);
            
            this._typeInterval = setInterval(() => {
                if (i < textToType.length) {
                    this.textEl.textContent += textToType[i];
                    i++;
                } else {
                    this._skipTyping();
                    resolve();
                }
            }, 20); // 20ms per char

            // Save resolve for skip
            this._currentResolve = resolve;
        });
    }

    _skipTyping() {
        if (!this.isTyping) return;
        clearInterval(this._typeInterval);
        this.isTyping = false;
        // Swap to the full HTML (with jargon chips)
        this.textEl.innerHTML = this._fullTextHtml;
        this._activateJargonChips();
        if (this._currentResolve) {
            this._currentResolve();
            this._currentResolve = null;
        }
    }

    /** Show response options or continue button. */
    _showChoices(node) {
        this.choicesContainer.style.display = 'flex';
        const ui = getLocalizedUI(this.language);
        
        if (node.choices) {
            this.choicesContainer.innerHTML = node.choices.map((choice, i) => `
                <button class="dialogue-choice-btn" data-index="${i}">
                    <span class="choice-number">${i + 1}.</span> ${getChoiceLabel(choice, this.language)}
                </button>
            `).join('');
            
            const btns = this.choicesContainer.querySelectorAll('.dialogue-choice-btn');
            btns.forEach(btn => {
                btn.addEventListener('click', (e) => {
                    const idx = parseInt(e.currentTarget.dataset.index, 10);
                    this._selectChoice(idx);
                });
            });
        } else {
            // Check if end of quest or triggers camp
            let btnText = ui.continueBtn;
            if (node.questComplete) btnText = ui.completeQuestBtn;
            else if (node.triggerCamp) btnText = ui.scanRepoBtn;
            else if (node.triggerTerminal) btnText = ui.openTerminalBtn;

            this.choicesContainer.innerHTML = `
                <button class="btn btn--primary" id="dialogue-continue-btn">
                    ${btnText}
                </button>
            `;
            
            document.getElementById('dialogue-continue-btn').addEventListener('click', () => {
                this._advance();
            });
        }
    }

    _selectChoice(idx) {
        const node = this.script.nodes[this.currentNodeIdx];
        if (node.choices && node.choices[idx]) {
            this._showNode(node.choices[idx].next);
        }
    }

    _advance() {
        const node = this.script.nodes[this.currentNodeIdx];
        
        if (node.triggerCamp && this.onTriggerCamp) {
            this.close();
            this.onTriggerCamp(this.currentNpc);
            return;
        }

        if (node.triggerTerminal && this.onTriggerTerminal) {
            this.close();
            this.onTriggerTerminal(this.currentNpc);
            return;
        }

        if (node.questComplete) {
            if (this.onComplete) this.onComplete(this.currentNpc, this.script.xpReward);
            this.close();
            return;
        }

        // Default advance to next sequential node if no choices
        this._showNode(this.currentNodeIdx + 1);
    }

    _activateJargonChips() {
        const chips = this.textEl.querySelectorAll('.jargon-inline[data-term]');
        chips.forEach(chip => {
            chip.addEventListener('click', (e) => {
                const wasActive = chip.classList.contains('active');
                this.textEl.querySelectorAll('.jargon-inline.active').forEach(c => c.classList.remove('active'));
                if (!wasActive) chip.classList.add('active');
                e.stopPropagation();
            });
        });
        
        // Close jargon tips on click outside
        document.addEventListener('click', () => {
            if(this.textEl) {
                this.textEl.querySelectorAll('.jargon-inline.active').forEach(c => c.classList.remove('active'));
            }
        }, { once: false });
    }

    close() {
        if (!this.isOpen) return;
        this.isOpen = false;
        if (this.container) {
            this.container.classList.remove('visible');
        }
        clearInterval(this._typeInterval);
    }
}
