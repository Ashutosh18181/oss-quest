/**
 * OSS Quest — BuildLog
 * Live narration overlay synced to the camp reveal sequence.
 * Shows typewriter-style entries as structures are discovered.
 */

export class BuildLog {
    constructor() {
        this.container = document.getElementById('build-log');
        this.entriesList = document.getElementById('build-log-entries');
        this.titleEl = this.container?.querySelector('.build-log-title');
        this.entries = [];
    }

    /** Show the build log overlay */
    show() {
        if (this.container) this.container.style.display = 'flex';
    }

    /** Hide the build log overlay */
    hide() {
        if (this.container) this.container.style.display = 'none';
    }

    /** Set the header title text. */
    setTitle(text) {
        if (this.titleEl) this.titleEl.textContent = text;
    }

    /** Clear all entries. */
    clear() {
        this.entries = [];
        if (this.entriesList) this.entriesList.innerHTML = '';
    }

    /**
     * Add a log entry with typewriter animation.
     * @param {string} icon — emoji icon
     * @param {string} text — log message
     * @param {boolean} [highlight=false] — if true, entry is highlighted
     * @returns {Promise} resolves after the typewriter effect completes
     */
    addEntry(icon, text, highlight = false) {
        return new Promise((resolve) => {
            const li = document.createElement('li');
            li.className = 'build-log-entry anim-slide-in-left';
            if (highlight) li.classList.add('active');

            const iconSpan = document.createElement('span');
            iconSpan.className = 'log-icon';
            iconSpan.textContent = icon;

            const textSpan = document.createElement('span');
            textSpan.className = 'log-text';

            li.appendChild(iconSpan);
            li.appendChild(textSpan);

            if (this.entriesList) {
                // Remove 'active' from previous entries
                this.entriesList.querySelectorAll('.active').forEach(el => el.classList.remove('active'));
                this.entriesList.appendChild(li);
                this.entriesList.scrollTop = this.entriesList.scrollHeight;
            }

            this.entries.push({ icon, text, element: li });

            // Typewriter effect
            this._typewrite(textSpan, text, 25).then(resolve);
        });
    }

    /**
     * Typewriter text animation.
     * @param {HTMLElement} el — target element
     * @param {string} text — text to type
     * @param {number} charDelay — ms per character
     * @returns {Promise}
     */
    _typewrite(el, text, charDelay = 25) {
        return new Promise((resolve) => {
            let i = 0;
            const cursor = document.createElement('span');
            cursor.className = 'typewriter-cursor';
            cursor.textContent = '▋';
            cursor.style.animation = 'cursorBlink 0.8s step-end infinite';
            cursor.style.marginLeft = '1px';
            cursor.style.color = 'var(--c-primary)';

            el.appendChild(cursor);

            const interval = setInterval(() => {
                if (i < text.length) {
                    // Insert text before cursor
                    el.insertBefore(document.createTextNode(text[i]), cursor);
                    i++;
                } else {
                    clearInterval(interval);
                    // Remove cursor after a brief pause
                    setTimeout(() => {
                        cursor.remove();
                        resolve();
                    }, 300);
                }
            }, charDelay);
        });
    }

    /**
     * Add a status/result entry (no typewriter, instant).
     * @param {string} icon
     * @param {string} text
     * @param {string} [className]
     */
    addStatus(icon, text, className = '') {
        const li = document.createElement('li');
        li.className = `build-log-entry anim-slide-in-left ${className}`;

        li.innerHTML = `<span class="log-icon">${icon}</span><span class="log-text" style="font-weight:700">${text}</span>`;

        if (this.entriesList) {
            this.entriesList.appendChild(li);
            this.entriesList.scrollTop = this.entriesList.scrollHeight;
        }
    }
}
