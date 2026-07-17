<script lang="ts">
	import { ToggleGroup as ToggleGroupPrimitive } from 'bits-ui'
	import type { Snippet } from 'svelte'
	import { setToggleGroupCtx, type ToggleVariants } from '.'
	import { cn } from '$lib/utils'

	// the app only uses single-value groups; typing this directly sidesteps
	// bits-ui's single/multiple union which breaks bind:value inference
	type Props = {
		class?: string | null
		variant?: ToggleVariants['variant']
		value?: string
		children?: Snippet
		[key: string]: unknown
	}

	let {
		class: className,
		variant = 'default',
		value = $bindable(),
		children,
		...rest
	}: Props = $props();

	// svelte-ignore state_referenced_locally
	setToggleGroupCtx({ variant })
</script>

<ToggleGroupPrimitive.Root
	type="single"
	class={cn('flex items-center justify-center gap-1', className)}
	bind:value
	{...rest}
>
	{@render children?.()}
</ToggleGroupPrimitive.Root>
