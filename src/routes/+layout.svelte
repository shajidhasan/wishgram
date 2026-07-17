<script lang="ts">
	import '@fontsource-variable/inter'
	import '../app.css'
	import { onNavigate } from '$app/navigation'
	import { prefersReducedMotion } from 'svelte/motion'
	import { Toaster } from '$lib/components/ui/sonner'
	import type { Snippet } from 'svelte'

	let { children }: { children?: Snippet } = $props()

	onNavigate((navigation) => {
		if (!document.startViewTransition || prefersReducedMotion.current) return

		return new Promise((resolve) => {
			document.startViewTransition(async () => {
				resolve()
				await navigation.complete
			})
		})
	})
</script>

<Toaster />
{@render children?.()}
