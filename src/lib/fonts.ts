import type { Fonts } from './types'
import TextToSVG from './wishgram/text-to-svg'
import normalFont from '$lib/assets/fonts/ChakraPetch-SemiBold.ttf'
import highlightFont from '$lib/assets/fonts/bungee-shade-latin-400-normal.woff'
import additionalFont from '$lib/assets/fonts/BungeeHairline-Regular.ttf'

let promise: Promise<Fonts> | undefined

const load = async (url: string) => {
	const res = await fetch(url)
	return TextToSVG.parse(await res.arrayBuffer())
}

// Fonts are fetched and parsed once, on first demand; callers can invoke this
// early (e.g. on form submit) so parsing overlaps the network round-trip.
export const ensureFonts = (): Promise<Fonts> =>
	(promise ??= Promise.all([load(normalFont), load(highlightFont), load(additionalFont)]).then(
		([normal, highlight, additional]) => ({ normal, highlight, additional })
	))
