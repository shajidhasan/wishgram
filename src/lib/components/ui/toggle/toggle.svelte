<script lang="ts">
	import { Toggle as TogglePrimitive } from 'bits-ui'
	import { toggleVariants, type Variant } from '.'
	import { cn } from '$lib/utils'

	type $$Props = TogglePrimitive.Props & {
		variant?: Variant
	}
	type $$Events = TogglePrimitive.Events

	let className: $$Props['class'] = undefined
	export let variant: $$Props['variant'] = 'default'
	export let pressed: $$Props['pressed'] = undefined
	export { className as class }
</script>

<TogglePrimitive.Root
	bind:pressed
	class={cn(toggleVariants({ variant, className }))}
	{...$$restProps}
	on:click
>
	<slot />
</TogglePrimitive.Root>
