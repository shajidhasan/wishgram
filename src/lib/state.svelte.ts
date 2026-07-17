import type { ProcessedSVGs, WishgramSettings } from './types'

export const appState = $state({
	settings: {
		highlightColor: '#ea5a47',
		paperColor: '#f6eee3',
		wishgramWatermark: true
	} as WishgramSettings,
	processedSVGs: undefined as ProcessedSVGs | undefined
})
