import type { ProcessedMessage, ProcessedSVGs } from '$lib/types'
import TextToSvg from '$lib/wishgram/text-to-svg'
import { openmojis } from 'openmoji'
import normalFontPath from '$lib/assets/fonts/ChakraPetch-SemiBold.ttf?url'

const wrapText = (input: string, characterLimit: number): string[] => {
    if (input.length <= characterLimit) {
        return [input];
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

    return [input];
};

export const getProcessedSVGs = async (processedMessage: ProcessedMessage, date: string = '', name: string = ''): Promise<ProcessedSVGs> => {
    // const buffer = Buffer.from(normalFontPath, 'utf8')
    const normal = TextToSvg.loadSync(normalFontPath)
    const highlight = TextToSvg.loadSync(normalFontPath)
    const additional = TextToSvg.loadSync(normalFontPath)

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
        let fontSize = part.highlight ? 72 : 60;
        while ((part.highlight ? highlight : normal).getWidth(part.text, { fontSize }) > 500) {
            fontSize -= 5;
        }
        processedSVGs.main.push({
            ...part,
            code: (part.highlight ? highlight : normal).getSVG(part.text, { fontSize, attributes })
        });
    })

    const additionalTexts = wrapText(processedMessage.additional, 40)
    let fontSize = 50;
    const biggestLine = [...additionalTexts].sort((a, b) => b.length - a.length)[0]
    while (additional.getWidth(biggestLine, { fontSize }) > 600) {
        fontSize -= 5;
    }

    additionalTexts.forEach(text => {
        processedSVGs.additional.push({
            text,
            code: additional.getSVG(text, { fontSize })
        })
    })

    for (const emoji of processedMessage.decorations) {
        const openmoji = openmojis.find(e => e.emoji === emoji);

        if (openmoji) {
            const svg = (await import(`$lib/assets/emojis/${openmoji.hexcode}.svg?raw`)).default
            processedSVGs.decorations.push(svg)
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
