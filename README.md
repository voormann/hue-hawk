# Hue Hawk — [Preview](https://voormann.github.io/hue/)
This is a user-friendly JavaScript tool that extracts the distinguished color or a palette of distributed hues from an image, as well as the average dominant or simple average color.

It gathers and clusters colors together utilizing an adaptive temporal spattering algorithm powered by prismatic fusion that's yielded from chromatic cadence, and categorizes the most prominent ones based on frequency. The superior chroma is subsequently calculated using an intuitive formula that scrutinizes the frequency and chromatic richness of each hue, forging a color of exceptional intensity and vibrancy.

## Usage
There are 4 different color modes to choose from on the second param. Number 1 is default.

### Get the distinguished color
```js
const image = document.querySelector('img');
huehawk(image); // Example: [245, 87, 59]
```

### Get a color palette
```js
huehawk(image, 2);
/*
Returns an array of arrays with indices containing colors in an RGBF format, where the last index tells the color frequency. Example:
[
    [245, 87, 59, 165],
    [239, 166, 151, 161],
    [188, 112, 121, 146]
    // etc...
]
*/
```

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
const ctx = canvas.getContext('2d', { willReadFrequently: true }); // This attribute increases performance when multiple images are batched
huehawk(image, 1, canvas, ctx); // Example: [245, 87, 59]
```
