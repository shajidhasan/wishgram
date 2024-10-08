import Root from "./toggle.svelte";
import { tv, type VariantProps } from "tailwind-variants";

export const toggleVariants = tv({
	base: "inline-flex items-center justify-center rounded-md text-sm font-medium transition-colors data-[state=on]:bg-primary/20 data-[state=on]:text-accent-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:pointer-events-none disabled:opacity-50 ring-offset-background hover:bg-muted hover:text-muted-foreground",
	variants: {
		variant: {
			default: "bg-transparent",
			outline:
				"bg-transparent border border-input hover:bg-accent hover:text-accent-foreground",
		},
	},
	defaultVariants: {
		variant: "default",
		size: "default",
	},
});

export type Variant = VariantProps<typeof toggleVariants>["variant"];

export {
	Root,
	//
	Root as Toggle,
};
