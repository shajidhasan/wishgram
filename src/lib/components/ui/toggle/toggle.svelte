<script lang="ts">
	import { Toggle as TogglePrimitive } from 'bits-ui'
	import type { Snippet } from 'svelte'
	import { toggleVariants, type Variant } from '.'
	import { cn } from '$lib/utils'

	type Props = {
		class?: string | null
		variant?: Variant
		pressed?: boolean
		children?: Snippet
		[key: string]: unknown
	}

	let {
		class: className,
		variant = 'default',
		pressed = $bindable(false),
		children,
		...rest
	}: Props = $props()
</script>

<TogglePrimitive.Root bind:pressed class={cn(toggleVariants({ variant }), className)} {...rest}>
	{@render children?.()}
</TogglePrimitive.Root>
