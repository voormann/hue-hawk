function huehawk(gImg, hMode = 1, gCanvas = null, gCtx = null) {
    const hCanvas = gCanvas || document.createElement('canvas');

    hCanvas.width = Math.floor(gImg.width / 8);
    hCanvas.height = Math.floor(gImg.height / 8);

    const hCtx = gCtx || hCanvas.getContext('2d');

    hCtx.drawImage(gImg, 0, 0, hCanvas.width, hCanvas.height);

    const pixels = hCtx.getImageData(0, 0, hCanvas.width, hCanvas.height).data;
    const distribution = [];

    if (hMode !== 4) {
        for (let i = 0; i < pixels.length; i += 4) {
            const r = pixels[i];
            const g = pixels[i + 1];
            const b = pixels[i + 2];

            if (Math.max(r, g, b) - Math.min(r, g, b) < 20)
                continue;

            let indexed = false;

            for (let j = 0; j < distribution.length; j++) {
                const cluster = distribution[j];
                
                if (Math.pow(cluster[0] - r, 2) + Math.pow(cluster[1] - g, 2) + Math.pow(cluster[2] - b, 2) < 5000) {
                    cluster[0] = (cluster[0] * cluster[3] + r) / (cluster[3] + 1);
                    cluster[1] = (cluster[1] * cluster[3] + g) / (cluster[3] + 1);
                    cluster[2] = (cluster[2] * cluster[3] + b) / (cluster[3] + 1);
                    cluster[3]++;
                    indexed = true;

                    break;
                }
            }

            if (!indexed)
                distribution.push([r, g, b, 1]);
        }
    }

    let primary = [0, 0, 0];

    if (hMode === 2) {
        return distribution;
    } else if (hMode === 3) {
        let [sumR, sumG, sumB, totalTally] = [0, 0, 0, 0];

        for (const [r, g, b, tally] of distribution) {
            totalTally += tally;
            sumR += r * tally;
            sumG += g * tally;
            sumB += b * tally;
        }

        primary = [
            sumR / totalTally,
            sumG / totalTally,
            sumB / totalTally
        ];
    } else if (distribution.length > 0 && hMode !== 4) {
        let peak = 0;

        for (const [r, g, b, tally] of distribution) {
            const max = Math.max(r, g, b);
            const min = Math.min(r, g, b);
            const chroma = max - min;
            const normalize = max === 0 ? 1 : max;
            const vibrancy = chroma === 0 ? 0 : chroma / normalize;
            const rating = tally * vibrancy;

            if (rating > peak) {
                peak = rating;
                primary = [r, g, b];
            }
        }
    } else {
        let [r, g, b] = [0, 0, 0];

        for (let i = 0; i < pixels.length; i += 4) {
            r += pixels[i];
            g += pixels[i + 1];
            b += pixels[i + 2];
        }

        const samples = pixels.length / 4;

        primary = [
            r / samples,
            g / samples,
            b / samples
        ];
    }

    return primary.map(x => Math.round(x));
}