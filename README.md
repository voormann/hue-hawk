# Hue Hawk — [Preview](https://voormann.github.io/hue/)
This is a user-friendly JavaScript tool that extracts the distinguished color or a palette of distributed hues from an image, as well as the average dominant or simple average color.

It gathers and clusters colors together utilizing an adaptive temporal spattering algorithm powered by prismatic fusion that's yielded from chromatic cadence, while categorizing the most prominent varieties based on frequency. The superior chroma is subsequently calculated using an intuitive formula that scrutinizes the frequency and chromatic richness of each hue, forging a color of exceptional intensity and vibrancy.

## Usage
The only required parameter is the first which references the image. There are 4 different modes to choose from on the second (defaults to 1 if not specified).

### Get the distinguished color
```js
const image = document.querySelector('img');
huehawk(image); // Example: [245, 87, 59]
```

### Get a color palette
```js
huehawk(image, 2);
/*
Example:
[
    [245, 87, 59, 165],
    [239, 166, 151, 161],
    [188, 112, 121, 146]
    // etc...
]
*/
```
*Note: Returns an array of arrays where indices contain colors in an RGBF format, with the last index indicating the color frequency. Unlike the other modes that have fallbacks to handle cases where no significant color is found, this mode may return an empty array if the entire input image has very low chroma (grayscale or black and white).*

### Get the average dominant color
```js
huehawk(image, 3); // Example: [98, 58, 57]
```

### Get the simple average color
```js
huehawk(image, 4); // Example: [201, 116, 114]
```

### Use your own canvas and context instead
```js
const canvas = document.createElement('canvas');
const ctx = canvas.getContext('2d', { willReadFrequently: true });
huehawk(image, 1, canvas, ctx); // Example: [245, 87, 59]
```
*Note: Utilizing an external canvas and context will significantly improve performance when batch analyzing a large number of images. The `willReadFrequently` attribute can further improve performance. Additionally, grouping images of the same size and color mode instances during a batch helps minimize state changes.*
