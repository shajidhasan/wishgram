import { OutputType, Svg2Roughjs } from "svg2roughjs";
import { HEIGHT, WIDTH } from "$lib";
import type Konva from "konva";


export const getRoughTexts = (texts: { code: string, highlight?: boolean }[], highlightColor: string = '#ea5a47') => {
    const parser = new DOMParser()
    const serializer = new XMLSerializer()

    const textImages = []
    const texts_ = structuredClone(texts)

    for (const text of texts_) {
        let type = 'main'
        if (Object.prototype.hasOwnProperty.call(text, 'highlight')) {
            if (text.highlight) {
                type = 'highlight'
                text.code = text.code.replaceAll('<highlight>', highlightColor)
            }
        } else {
            type = 'additional'
        }

        const options = {
            roughness: 1,
            fillWeight: 1
        }

        if (type === 'additional') {
            options.roughness = 0.5
        }

        if (type === 'highlight') {
            options.fillWeight = 3
        }


        const svgDoc = parser.parseFromString(text.code, 'image/svg+xml')
        const svgElement = svgDoc.documentElement as unknown as SVGSVGElement
        const outputSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        const svg2Roughjs = new Svg2Roughjs(outputSVG, OutputType.SVG, {
            ...options,

        })
        svg2Roughjs.randomize = false
        svg2Roughjs.svg = svgElement
        svg2Roughjs.sketch()
        const svgString = serializer.serializeToString(outputSVG)
        const dataURI = 'data:image/svg+xml;base64,' + btoa(svgString)
        const image = new window.Image()
        image.src = dataURI

        const height = Number(outputSVG.getAttribute('height'))
        const width = Number(outputSVG.getAttribute('width'))


        textImages.push({
            image,
            height,
            width,
        })
    }

    return { textImages };
}


export const getRoughDecorations = (svgs: string[]) => {
    const parser = new DOMParser()
    const serializer = new XMLSerializer()

    const decorationImages = []
    const options = {
        roughness: 1,
        fillWeight: 1
    }

    const points = spread(WIDTH, WIDTH / 1.5, svgs.length);

    for (let i = 0; i < svgs.length; i++) {
        const svg = svgs[i]
        const svgDoc = parser.parseFromString(svg, 'image/svg+xml')
        const svgElement = svgDoc.documentElement as unknown as SVGSVGElement
        const outputSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
        const svg2Roughjs = new Svg2Roughjs(outputSVG, OutputType.SVG, {
            ...options,
        })
        svg2Roughjs.randomize = false
        svg2Roughjs.svg = svgElement
        svg2Roughjs.sketch()
        const svgString = serializer.serializeToString(outputSVG)
        const dataURI = 'data:image/svg+xml;base64,' + btoa(svgString)
        const image = new window.Image()
        image.src = dataURI

        const height = Number(outputSVG.getAttribute('height'))
        const width = Number(outputSVG.getAttribute('width'))
        const scale = getRandomNumber(1.2, 1.4);

        decorationImages.push({
            image,
            height,
            width,
            x: points[i][0],
            y: points[i][1],
            offsetX: width / 2,
            offsetY: height / 2,
            scale: { x: scale, y: scale },
            rotation: getRandomNumber(-5, 5),
            draggable: true
        })
    }

    return decorationImages;
}

export const getPositions = (images: Konva.ImageConfig[], offset: number = 0) => {
    let dy = 0
    type Attributes = { x: number, y: number }
    const attributesList: Attributes[] = []

    images.forEach(image => {
        if (image.height && image.width) {
            const attributes = {
                x: (WIDTH - image.width) / 2,
                y: dy
            }
            attributesList.push(attributes)
            dy += image.height
        }
    })

    attributesList.forEach(attributes => {
        attributes.y += (HEIGHT - dy) / 2 + offset
    })

    return attributesList
}

export const getRoughImage = (svg: string, roughness: number) => {
    const parser = new DOMParser()
    const serializer = new XMLSerializer()

    const svgDoc = parser.parseFromString(svg, 'image/svg+xml')
    const svgElement = svgDoc.documentElement as unknown as SVGSVGElement
    const outputSVG = document.createElementNS('http://www.w3.org/2000/svg', 'svg')
    const svg2Roughjs = new Svg2Roughjs(outputSVG, OutputType.SVG, { roughness })
    svg2Roughjs.randomize = false
    svg2Roughjs.svg = svgElement
    svg2Roughjs.sketch()
    const svgString = serializer.serializeToString(outputSVG)
    const dataURI = 'data:image/svg+xml;base64,' + btoa(svgString)
    const image = new window.Image()
    image.src = dataURI

    const height = Number(outputSVG.getAttribute('height'))
    const width = Number(outputSVG.getAttribute('width'))


    return {
        image,
        height,
        width,
        x: WIDTH / 2,
        y: HEIGHT - 100,
        offsetX: width / 2,
        offsetY: height / 2
    }
}

export const getRandomReal = (x: number) => {
    return Math.random() * x;
}

export const getRandomNumber = (a: number, b: number) => {
    return Math.random() < 0.5 ? a : b;
}

const spread = (largeSquareWidth: number, smallSquareWidth: number, n: number) => {
    const len = (largeSquareWidth + smallSquareWidth) / 2.0;
    const pathWidth = (largeSquareWidth - smallSquareWidth) / 2.0;
    const d = (4.0 * len) / n;
    const e = d - len * (2.0 * (n - 1) * n + 4.0 - 4.0 * n) / (n * (n * (n - 1)) / 2.0 - n * 1.0);
    const points = [];
    let walk = 0.5 * d;

    while (n--) {
        const mul = getRandomNumber(-1, 1);
        let x, y;

        if (walk <= len + pathWidth / 2.0) {
            y = walk + e * mul;
            x = getRandomReal(pathWidth);
        } else if (walk <= len + len + pathWidth / 2.0) {
            y = getRandomReal(pathWidth) + smallSquareWidth + pathWidth;
            x = walk - len + e * mul;
        } else if (walk <= len + len + len + pathWidth / 2.0) {
            y = largeSquareWidth - (walk - len - len + e * mul);
            x = pathWidth + smallSquareWidth + getRandomReal(pathWidth);
        } else {
            y = getRandomReal(pathWidth);
            x = largeSquareWidth - (walk - len - len - len + e * mul);
        }

        points.push([x, y]);
        walk += d;
    }
    return points;
}
