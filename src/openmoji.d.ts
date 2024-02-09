// openmoji.d.ts

declare module 'openmoji' {
    export interface EmojiData {
        emoji: string;
        hexcode: string;
        group: string;
        subgroup: string;
        annotation: string;
        tags: string;
        openmoji_tags: string;
        openmoji_author: string;
        openmoji_date: string;
        skintone: string;
        skintone_combination: string;
        skintone_base_emoji: string;
        skintone_base_hexcode: string;
        unicode: string;
        order: string;
        openmoji_images: {
            black: {
                svg: string;
            };
            color: {
                svg: string;
            };
        };
    }

    export interface ColorPalette {
        [key: string]: string;
    }

    export const version: string;
    export const openmojis: EmojiData[];
    export const color_palette: ColorPalette;
}
