import { get, writable } from "svelte/store"
import type { Fonts, ProcessedSVGs, WishgramSettings } from "./types"
import normalFont from '$lib/assets/fonts/ChakraPetch-SemiBold.ttf'
import highlightFont from '$lib/assets/fonts/bungee-shade-latin-400-normal.woff'
import additionalFont from '$lib/assets/fonts/BungeeHairline-Regular.ttf'
import TextToSVG from "./wishgram/text-to-svg"
import { browser } from "$app/environment"

export const processedSVGs = writable<ProcessedSVGs>()
export const wishgramSettings = writable<WishgramSettings>({
    highlightColor: '#ea5a47',
    paperColor: '#f6eee3',
    wishgramWatermark: true
})


export const fonts = writable<Fonts>()

export const loadFonts = async () => {
    const normalRes = await fetch(normalFont)
    const normalBlob = await normalRes.blob()
    const normalBuffer = await normalBlob.arrayBuffer()

    const highlightRes = await fetch(highlightFont)
    const highlightBlob = await highlightRes.blob()
    const highlightBuffer = await highlightBlob.arrayBuffer()

    const additionalRes = await fetch(additionalFont)
    const additionalBlob = await additionalRes.blob()
    const additionalBuffer = await additionalBlob.arrayBuffer()

    fonts.set({ normal: TextToSVG.parse(normalBuffer), highlight: TextToSVG.parse(highlightBuffer), additional: TextToSVG.parse(additionalBuffer) })
    console.log("fonts loaded!")
}

if (!get(fonts) && browser) {
    loadFonts()
}
