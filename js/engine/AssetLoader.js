/**
 * OSS Quest — Asset Loader
 * Preloads image assets to replace the previous canvas shapes.
 */

export class AssetLoader {
    constructor() {
        this.images = {};
        this.loaded = 0;
        this.total = 0;
    }

    /**
     * @param {Object} assetMap - Dictionary of key to URL
     */
    async loadAll(assetMap) {
        this.total = Object.keys(assetMap).length;
        this.loaded = 0;

        const promises = Object.entries(assetMap).map(([key, src]) => {
            return new Promise((resolve, reject) => {
                const img = new Image();
                img.crossOrigin = "Anonymous"; // just in case
                img.onload = () => {
                    // Remove white background for generated sprites
                    if (key.includes('sprite')) {
                        const tempCanvas = document.createElement('canvas');
                        tempCanvas.width = img.width;
                        tempCanvas.height = img.height;
                        const tempCtx = tempCanvas.getContext('2d');
                        tempCtx.drawImage(img, 0, 0);
                        const imgData = tempCtx.getImageData(0, 0, tempCanvas.width, tempCanvas.height);
                        const data = imgData.data;
                        
                        for (let i = 0; i < data.length; i += 4) {
                            const r = data[i];
                            const g = data[i + 1];
                            const b = data[i + 2];
                            // If pixel is very close to white, make it transparent
                            if (r > 240 && g > 240 && b > 240) {
                                data[i + 3] = 0; // alpha = 0
                            }
                        }
                        tempCtx.putImageData(imgData, 0, 0);
                        
                        const transparentImg = new Image();
                        transparentImg.onload = () => {
                            this.images[key] = transparentImg;
                            this.loaded++;
                            resolve();
                        };
                        transparentImg.src = tempCanvas.toDataURL();
                    } else {
                        this.images[key] = img;
                        this.loaded++;
                        resolve();
                    }
                };
                img.onerror = () => {
                    console.error(`Failed to load asset: ${src}`);
                    // Fallback to empty image to prevent crash
                    this.images[key] = new Image(); 
                    this.loaded++;
                    resolve();
                };
                img.src = src;
            });
        });

        await Promise.all(promises);
        console.log(`[AssetLoader] Loaded ${this.loaded} assets.`);
    }

    getImage(key) {
        return this.images[key];
    }
}

// Create a singleton instance for global access
export const Assets = new AssetLoader();
