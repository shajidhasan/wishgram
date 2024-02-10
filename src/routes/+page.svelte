<script lang="ts">
	import { onMount } from 'svelte'
	import { shuffle } from '$lib/utils'
	import { goto } from '$app/navigation'
	import type { ActionData } from './$types'
	import { processedSVGs } from '$lib/stores'
	import { HERO_DECOR_LOCATIONS as locations } from '$lib'
	import wishgramLogo from '$lib/assets/wishgram-logo.svg'
	import Button from '$lib/components/ui/button/button.svelte'
	import { getProcessedSVGs } from '$lib/wishgram/text-to-svg'
	import WishgramPrompt from '$lib/components/WishgramPrompt.svelte'
	const decorationImports = import.meta.glob('$lib/assets/decorations/*.svg', { eager: true })

	export let form

	let getStarted: HTMLElement
	const names = shuffle(Object.keys(decorationImports))
	const decorations = names.map((name) => (decorationImports[name] as { default: string }).default)

	const onGetStarted = () => {
		getStarted.scrollIntoView({ behavior: 'smooth' })
	}

	const styleString = (style: Record<string, string>) => {
		return Object.entries(style)
			.map(([k, v]) => `${k}:${v}`)
			.join(';')
	}

	const onFormResponse = async (form: ActionData) => {
		if (!form) return
		if (!form.processedMessage) return
		const processedSVGs_ = await getProcessedSVGs(form.processedMessage, form.processedMessage.date as string)
		processedSVGs.set(processedSVGs_)
		goto('/canvas')
	}

	$: onFormResponse(form)

	onMount(() => {
		window.onbeforeunload = null
	})
</script>

<main class="h-screen snap-y snap-mandatory overflow-y-scroll">
	<section class="relative h-screen snap-start">
		{#each decorations.slice(0, 6) as decoration, i}
			<img
				src={decoration}
				alt="decoration"
				class="absolute"
				style={styleString(locations[i])}
				style:transform="rotate({-15 + Math.random() * 30}deg)"
				style:width="{4 + Math.random() * 1.5}rem"
			/>
		{/each}
		<div class="flex h-full flex-col items-center justify-center gap-4 px-4">
			<img src={wishgramLogo} alt="Wishgram logo" class="h-32 w-32" />

			<h1 class="text-center text-3xl font-extrabold sm:text-4xl md:text-6xl">
				Express Kindness.
				<br />
				Inspire Celebrations.
			</h1>

			<p class="max-w-xl text-center">
				Connect through Wishgram, crafting personalized wish cards for every occasion with an artful
				handwritten touch. Powered by AI.
			</p>

			<Button on:click={onGetStarted}>Get Started</Button>
		</div>
	</section>

	<section bind:this={getStarted} class="relative min-h-screen snap-start">
		{#each decorations.slice(6, 11) as decoration, i}
			<img
				src={decoration}
				alt="decoration"
				class="absolute -z-10"
				style={styleString(locations[5 + i])}
				style:transform="rotate({-15 + Math.random() * 30}deg)"
				style:width="{4 + Math.random() * 2}rem"
			/>
		{/each}
		<div class="flex h-full min-h-[inherit] flex-col items-center justify-center">
			<WishgramPrompt />
		</div>
	</section>
</main>
