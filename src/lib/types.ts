export interface MessagePart {
    text: string;
    highlight: boolean;
}

export interface ProcessedMessage {
    main: MessagePart[]
    decorations: string[];
    additional: string
}

export interface ProcessedSVGs {
    main: (MessagePart & { code: string })[];
    decorations: string[];
    additional: {
        text: string;
        code: string;
    }[],
    date?: string
    name?: string
}

export interface WishgramSettings {
    highlightColor: string;
    paperColor: string;
    wishgramWatermark: boolean;
}
