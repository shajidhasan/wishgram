<script lang="ts">
	import type Konva from 'konva'
	import { goto } from '$app/navigation'
	import { appState } from '$lib/state.svelte'
	import WishgramCanvas from '$lib/components/WishgramCanvas.svelte'
	import WishgramSettings from '$lib/components/settings/WishgramSettings.svelte'

	let stage: Konva.Stage | undefined = $state()

	if (!appState.processedSVGs) {
		goto('/')
	}

	window.onbeforeunload = function (_) {
		return confirm('Do you really want to close this page?')
	}

	const onDownload = () => {
		if (!stage) return
		const width = stage.width()
		const uri = stage.toDataURL({ pixelRatio: 1200 / width })
		const link = document.createElement('a')
		link.download = `wishgram-${new Date().getTime()}.png`
		link.href = uri
		document.body.appendChild(link)
		link.click()
	}
</script>

<main class="flex flex-col-reverse lg:h-screen lg:flex-row">
	<WishgramSettings ondownload={onDownload} />
	<WishgramCanvas bind:stage />
</main>
