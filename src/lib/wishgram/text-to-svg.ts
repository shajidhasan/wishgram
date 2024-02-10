import opentype from "opentype.js";
import { fonts } from "$lib/stores"
import type { ProcessedMessage, ProcessedSVGs } from "$lib/types"
import { get } from "svelte/store"



interface FontOptions {
    x?: number;
    y?: number;
    fontSize?: number;
    kerning?: boolean;
    letterSpacing?: number;
    tracking?: number;
    attributes?: Record<string, string>;
}

export default class TextToSVG {
    font: opentype.Font

    constructor(font: opentype.Font) {
        this.font = font;
    }

    static parse(file: ArrayBuffer) {
        return new TextToSVG(opentype.parse(file));
    }

    static loadSync(file: string) {
        return new TextToSVG(opentype.loadSync(file));
    }

    getWidth(text: string, options: FontOptions) {
        const fontSize = options.fontSize || 72;
        const kerning = 'kerning' in options ? options.kerning : true;
        const fontScale = 1 / this.font.unitsPerEm * fontSize;

        let width = 0;
        const glyphs = this.font.stringToGlyphs(text);
        for (let i = 0; i < glyphs.length; i++) {
            const glyph = glyphs[i];

            if (glyph.advanceWidth) {
                width += glyph.advanceWidth * fontScale;
            }

            if (kerning && i < glyphs.length - 1) {
                const kerningValue = this.font.getKerningValue(glyph, glyphs[i + 1]);
                width += kerningValue * fontScale;
            }

            if (options.letterSpacing) {
                width += options.letterSpacing * fontSize;
            } else if (options.tracking) {
                width += (options.tracking / 1000) * fontSize;
            }
        }
        return width;
    }

    getHeight(fontSize: number) {
        const fontScale = 1 / this.font.unitsPerEm * fontSize;
        return (this.font.ascender - this.font.descender) * fontScale;
    }

    getMetrics(text: string, options: FontOptions = {}) {
        const fontSize = options.fontSize || 72;

        const width = this.getWidth(text, options);
        const height = this.getHeight(fontSize);

        const fontScale = 1 / this.font.unitsPerEm * fontSize;
        const ascender = this.font.ascender * fontScale;
        const descender = this.font.descender * fontScale;

        const x = options.x || 0;
        const y = options.y || 0;

        const baseline = y + ascender;

        return {
            x,
            y,
            baseline,
            width,
            height,
            ascender,
            descender,
        };
    }

    getD(text: string, options: FontOptions = {}) {
        const fontSize = options.fontSize || 72;
        const kerning = 'kerning' in options ? options.kerning : true;
        const letterSpacing = 'letterSpacing' in options ? options.letterSpacing : false;
        const tracking = 'tracking' in options ? options.tracking : false;
        const metrics = this.getMetrics(text, options);
        const path = this.font.getPath(text, metrics.x, metrics.baseline, fontSize, { kerning, letterSpacing: letterSpacing as number, tracking: tracking as number });

        return path.toPathData(1);
    }

    getPath(text: string, options: FontOptions = {}) {
        const attributes = []

        if (options.attributes) {
            for (const key in options.attributes) {
                if (Object.prototype.hasOwnProperty.call(options.attributes, key)) {
                    const value = options.attributes[key];
                    attributes.push(`${key}="${value}"`)
                }
            }
        }

        const d = this.getD(text, options);

        if (attributes) {
            return `<path ${attributes.join(' ')} d="${d}"/>`;
        }

        return `<path d="${d}"/>`;
    }

    getSVG(text: string, options: FontOptions = {}) {
        const metrics = this.getMetrics(text, options);
        let svg = `<svg xmlns="http://www.w3.org/2000/svg" xmlns:xlink="http://www.w3.org/1999/xlink" viewBox="0 0 ${metrics.width} ${metrics.height}">`;
        svg += this.getPath(text, options);
        svg += '</svg>';

        return svg;
    }
}


const getEmojiHexCodes = (emoji: string): string[] => {
    const codePoints = Array.from(emoji)
        .map(char => char.codePointAt(0)?.toString(16).toUpperCase())
        .filter(codePoint => codePoint !== undefined)

    if (codePoints.length === 0) {
        return []
    }

    const lastCodePoint = codePoints[codePoints.length - 1]

    if (lastCodePoint === 'FE0F') {
        return [codePoints.join('-'), codePoints.slice(0, codePoints.length - 1).join('-')]
    } else {
        return [codePoints.join('-'), [...codePoints, 'FE0F'].join('-')]
    }
}

const wrapText = (input: string, characterLimit: number): string[] => {
    if (input.length <= characterLimit) {
        return [input]
    }

    const i = Math.round(input.length / 2)
    let charL = input[i]
    let charR = input[i]
    let j = 0

    while (charL !== ' ' && charR !== ' ') {
        j++
        if (i - j >= 0) {
            charL = input[i - j]
        }
        if (i + j < input.length) {
            charR = input[i + j]
        }
    }
    if (charR === ' ') {
        return [input.substring(0, i + j), input.substring(i + j + 1)]
    }
    if (charL === ' ') {
        return [input.substring(0, i - j), input.substring(i - j + 1)]
    }
    return [input]
}

export const getProcessedSVGs = async (processedMessage: ProcessedMessage, date: string = '', name: string = ''): Promise<ProcessedSVGs> => {
    const fonts_ = get(fonts)
    const { normal, highlight, additional } = fonts_

    const processedSVGs: ProcessedSVGs = {
        main: [],
        decorations: [],
        additional: []
    }

    const main: typeof processedMessage.main = []
    processedMessage.main.forEach(part => {
        if (part.highlight) {
            if (part.text.length > 12) {
                part.text.split(' ').forEach(p => {
                    main.push({ text: p, highlight: true })
                })
            } else {
                main.push({ text: part.text, highlight: true })
            }
        } else {
            main.push({ text: part.text, highlight: false })
        }
    })

    processedMessage.main = main

    processedMessage.main.forEach(part => {
        const attributes = {
            fill: part.highlight ? '<highlight>' : '#1a1a2',
            stroke: '#1a1a2f',
        }
        part.text = part.text.toUpperCase()
        let fontSize = part.highlight ? 72 : 60
        while ((part.highlight ? highlight : normal).getWidth(part.text, { fontSize }) > 500) {
            fontSize -= 5
        }
        processedSVGs.main.push({
            ...part,
            code: (part.highlight ? highlight : normal).getSVG(part.text, { fontSize, attributes })
        })
    })

    const additionalTexts = wrapText(processedMessage.additional, 40)
    let fontSize = 50
    const biggestLine = [...additionalTexts].sort((a, b) => b.length - a.length)[0]
    while (additional.getWidth(biggestLine, { fontSize }) > 600) {
        fontSize -= 5
    }

    additionalTexts.forEach(text => {
        processedSVGs.additional.push({
            text,
            code: additional.getSVG(text, { fontSize })
        })
    })

    for (const emoji of processedMessage.decorations) {
        const hexCodes = getEmojiHexCodes(emoji)

        for (const hexCode of hexCodes) {
            try {
                const svg = (await import(`$lib/assets/emojis/${hexCode}.svg?raw`)).default
                processedSVGs.decorations.push(svg)
                break
            } catch (e) {
                // pass
            }
        }
    }


    if (date) {
        processedSVGs.date = additional.getSVG(date, { fontSize: 20 })
    }

    if (name) {
        processedSVGs.name = additional.getSVG(name, { fontSize: 20 })
    }

    return processedSVGs
}