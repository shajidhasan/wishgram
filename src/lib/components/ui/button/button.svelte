<script lang="ts">
	import { cn } from '$lib/utils'
	import { buttonVariants, type Props } from '.'

	let {
		class: className,
		variant = 'default',
		size = 'default',
		href = undefined,
		type = 'button',
		children,
		...rest
	}: Props = $props()
</script>

{#if href}
	<a {href} class={cn(buttonVariants({ variant, size }), className)} {...rest}>
		{@render children?.()}
	</a>
{:else}
	<button {type} class={cn(buttonVariants({ variant, size }), className)} {...rest}>
		{@render children?.()}
	</button>
{/if}
