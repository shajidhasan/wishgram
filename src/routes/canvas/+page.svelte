<script lang="ts">
	import type Konva from 'konva'
	import { goto } from '$app/navigation'
	import { processedSVGs } from '$lib/stores'
	import WishgramCanvas from '$lib/components/WishgramCanvas.svelte'
	import WishgramSettings from '$lib/components/settings/WishgramSettings.svelte'

	let stage: Konva.Stage

	if (!$processedSVGs) {
		goto('/')
	}

	window.onbeforeunload = function (_) {
		return confirm('Do you really want to close this page?')
	}

	const onDownload = () => {
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
	<WishgramSettings on:download={onDownload} />
	<WishgramCanvas bind:stage />
</main>
