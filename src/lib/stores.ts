import { writable } from "svelte/store";
import type { ProcessedSVGs, WishgramSettings } from "./types";

export const processedSVGs = writable<ProcessedSVGs>()
export const wishgramSettings = writable<WishgramSettings>({
    highlightColor: '#ea5a47',
    paperColor: '#f6eee3',
    wishgramWatermark: true
})
