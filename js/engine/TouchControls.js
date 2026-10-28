/**
 * OSS Quest — Touch Controls
 * Virtual D-pad and Action button for mobile and touch devices.
 */

export class TouchControls {
    constructor() {
        this.container = null;
        this.activeKeys = new Set();
        this._isTouchDevice = ('ontouchstart' in window) || (navigator.maxTouchPoints > 0) || (window.innerWidth <= 840);
        this._dialogueObserver = null;
        this._createDOM();
    }

    _createDOM() {
        const existing = document.getElementById('touch-controls-layer');
        if (existing) existing.remove();

        this.container = document.createElement('div');
        this.container.id = 'touch-controls-layer';
        this.container.className = 'touch-controls-layer';

        this.container.innerHTML = `
            <div class="virtual-dpad" id="virtual-dpad" aria-label="Movement D-Pad">
                <button type="button" class="dpad-btn dpad-up" data-key="w" aria-label="Up">▲</button>
                <div class="dpad-middle-row">
                    <button type="button" class="dpad-btn dpad-left" data-key="a" aria-label="Left">◀</button>
                    <div class="dpad-center"></div>
                    <button type="button" class="dpad-btn dpad-right" data-key="d" aria-label="Right">▶</button>
                </div>
                <button type="button" class="dpad-btn dpad-down" data-key="s" aria-label="Down">▼</button>
            </div>

            <div class="virtual-action" id="virtual-action">
                <button type="button" class="action-btn" id="virtual-action-btn" aria-label="Action / Interact">
                    <span class="action-icon">💬</span>
                    <span class="action-label">E</span>
                </button>
            </div>
        `;

        document.body.appendChild(this.container);
        this._bindEvents();
        this._observeDialogue();
    }

    _bindEvents() {
        if (!this.container) return;

        // D-Pad buttons
        const dpadBtns = this.container.querySelectorAll('.dpad-btn');
        dpadBtns.forEach(btn => {
            const key = btn.dataset.key;

            const startPress = (e) => {
                e.preventDefault();
                e.stopPropagation();
                btn.classList.add('active');
                this.activeKeys.add(key);
                window.dispatchEvent(new KeyboardEvent('keydown', { key, bubbles: true }));
            };

            const endPress = (e) => {
                e.preventDefault();
                e.stopPropagation();
                btn.classList.remove('active');
                if (this.activeKeys.has(key)) {
                    this.activeKeys.delete(key);
                    window.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }));
                }
            };

            btn.addEventListener('touchstart', startPress, { passive: false });
            btn.addEventListener('touchend', endPress, { passive: false });
            btn.addEventListener('touchcancel', endPress, { passive: false });

            btn.addEventListener('mousedown', startPress);
            btn.addEventListener('mouseup', endPress);
            btn.addEventListener('mouseleave', endPress);
        });

        // Action button [E]
        const actionBtn = document.getElementById('virtual-action-btn');
        if (actionBtn) {
            const triggerAction = (e) => {
                e.preventDefault();
                e.stopPropagation();
                actionBtn.classList.add('active');
                window.dispatchEvent(new KeyboardEvent('keydown', { key: 'e', bubbles: true }));
                setTimeout(() => {
                    actionBtn.classList.remove('active');
                    window.dispatchEvent(new KeyboardEvent('keyup', { key: 'e', bubbles: true }));
                }, 120);
            };

            actionBtn.addEventListener('touchstart', triggerAction, { passive: false });
            actionBtn.addEventListener('click', triggerAction);
        }
    }

    _observeDialogue() {
        // Automatically hide touch buttons when dialogue box or terminal is open
        const dialogueBox = document.getElementById('dialogue-box');
        if (dialogueBox) {
            this._dialogueObserver = new MutationObserver(() => {
                const isOpen = dialogueBox.classList.contains('visible');
                if (this.container) {
                    if (isOpen) this.container.classList.add('hidden');
                    else this.container.classList.remove('hidden');
                }
            });
            this._dialogueObserver.observe(dialogueBox, { attributes: true, attributeFilter: ['class'] });
        }
    }

    show() {
        if (this.container && this._isTouchDevice) {
            this.container.style.display = 'block';
        }
    }

    hide() {
        if (this.container) {
            this.container.style.display = 'none';
        }
        // Release any held keys
        this.activeKeys.forEach(key => {
            window.dispatchEvent(new KeyboardEvent('keyup', { key, bubbles: true }));
        });
        this.activeKeys.clear();
    }

    destroy() {
        this.hide();
        if (this._dialogueObserver) {
            this._dialogueObserver.disconnect();
            this._dialogueObserver = null;
        }
        if (this.container) {
            this.container.remove();
            this.container = null;
        }
    }
}
