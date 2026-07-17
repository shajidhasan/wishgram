<script lang="ts">
	import { ToggleGroup as ToggleGroupPrimitive } from 'bits-ui'
	import type { Snippet } from 'svelte'
	import { cn } from '$lib/utils'
	import { getToggleGroupCtx, type ToggleVariants } from '.'
	import { toggleVariants } from '$lib/components/ui/toggle'

	type Props = {
		class?: string | null
		variant?: ToggleVariants['variant']
		value: string
		children?: Snippet
		[key: string]: unknown
	}

	let { class: className, variant = 'default', value, children, ...rest }: Props = $props()

	const ctx = getToggleGroupCtx()
</script>

<ToggleGroupPrimitive.Item
	class={cn(
		toggleVariants({
			variant: ctx.variant || variant
		}),
		className
	)}
	{value}
	{...rest}
>
	{@render children?.()}
</ToggleGroupPrimitive.Item>
