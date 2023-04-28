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
                    const recip = 1 / (cluster[3] + 1);

                    cluster[0] = (cluster[0] * cluster[3] + r) * recip;
                    cluster[1] = (cluster[1] * cluster[3] + g) * recip;
                    cluster[2] = (cluster[2] * cluster[3] + b) * recip;
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
        if (distribution.length > 0) {
            for (let i = 0; i < distribution.length; i++) {
                const key = distribution[i];
                let j = i - 1;

                while (j >= 0 && distribution[j][3] < key[3]) {
                    distribution[j + 1] = distribution[j];
                    j--;
                }

                for (let k = 0; k < 3; k++)
                    key[k] = Math.round(key[k]);

                distribution[j + 1] = key;
            }

            return distribution;
        } else {
            return [];
        }
    } else if (hMode !== 4 && distribution.length > 0) {
        if (hMode === 3) {
            let [sumR, sumG, sumB, sumTally] = [0, 0, 0, 0];

            for (const [r, g, b, tally] of distribution) {
                sumTally += tally;
                sumR += r * tally;
                sumG += g * tally;
                sumB += b * tally;
            }

            primary = [
                sumR / sumTally,
                sumG / sumTally,
                sumB / sumTally
            ];
        } else {
            const scatterIndices = [
                0,
                (hCanvas.width - 1) * 4,
                (hCanvas.height - 1) * hCanvas.width * 4,
                (hCanvas.height - 1) * hCanvas.width * 4 + (hCanvas.width - 1) * 4
            ];
            const intersect = scatterIndices.map(index => [pixels[index], pixels[index + 1], pixels[index + 2]]);
            const masked = intersect.every(color => {
                return Math.abs(color[0] - intersect[0][0]) < 10 &&
                       Math.abs(color[1] - intersect[0][1]) < 10 &&
                       Math.abs(color[2] - intersect[0][2]) < 10;
            });
            const occlude = masked ? intersect[0] : null;
            let peak = 0;
            let maskPeak = 0;
            let secondary = [0, 0, 0];

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

                if (rating > maskPeak && occlude) {
                    if (Math.abs(r - occlude[0]) > 10 &&
                        Math.abs(g - occlude[1]) > 10 &&
                        Math.abs(b - occlude[2]) > 10) {
                        maskPeak = rating;
                        secondary = [r, g, b];
                    }
                }
            }

            if (maskPeak > 0)
                primary = secondary;
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