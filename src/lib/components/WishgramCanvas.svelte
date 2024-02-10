<script lang="ts">
	import Konva from 'konva'
	import { HEIGHT, WIDTH } from '$lib'
	import { onMount, tick } from 'svelte'
	import type { MessagePart } from '$lib/types'
	import wishgramWatermark from '$lib/assets/wishgram-watermark.png'
	import { processedSVGs, wishgramSettings } from '$lib/stores'
	import { Stage, Layer, Image, Group, Rect, Text } from 'svelte-konva'
	import { getPositions, getRoughDecorations, getRoughTexts } from '$lib/wishgram/rough'

	export let stage: Konva.Stage
	let stageParent: HTMLDivElement
	let paper: Konva.Rect

	let mainImages: Konva.ImageConfig[] = []
	let additionalImages: Konva.ImageConfig[] = []
	let decorationImages: Konva.ImageConfig[] = []
	let otherImages: Konva.ImageConfig[] = []

	const watermark = new window.Image()
	watermark.src = wishgramWatermark

	const sketchMain = async (parts: (MessagePart & { code: string })[], highlightColor: string) => {
		const mainRough = getRoughTexts(parts, highlightColor)
		mainImages = mainRough.textImages
	}

	const sketchAdditional = async (parts: { code: string }[]) => {
		const additionalRough = getRoughTexts(parts)
		additionalImages = additionalRough.textImages
	}

	const sketchDecorations = async (decorations: string[]) => {
		decorationImages = getRoughDecorations(decorations)
	}

	const setAttributes = async () => {
		const mainPositions = getPositions(mainImages, -HEIGHT / 8)
		const additionalPositions = getPositions(additionalImages, HEIGHT / 8)
		const otherPositions = getPositions(otherImages)

		mainImages = mainImages.map((image, i) => ({
			...image,
			...mainPositions[i],
			draggable: true
		}))
		additionalImages = additionalImages.map((image, i) => ({
			...image,
			...additionalPositions[i],
			draggable: true
		}))
		otherImages = otherImages.map((image, i) => ({
			...image,
			...otherPositions[i],
			draggable: true
		}))
	}

	const sketchEverything = async () => {
		if (!$processedSVGs) return
		sketchMain($processedSVGs.main, $wishgramSettings.highlightColor)
		sketchAdditional($processedSVGs.additional)
		sketchDecorations($processedSVGs.decorations)
		setAttributes()

		await tick()
		if (paper) paper.cache()
	}

	const updatePaper = async (paperColor: string) => {
		if (!paper) return
		paper.fill(paperColor)

		await tick()
		if (paper) paper.cache()
	}

	const updateHighlight = async (highlightColor: string) => {
		if (!$processedSVGs) return
		sketchMain($processedSVGs.main, highlightColor)

		await tick()
		if (paper) paper.cache()
	}

	const fitCanvas = async () => {
		const parentWidth = stageParent.offsetWidth
		const parentHeight = stageParent.offsetHeight

		const min = Math.min(parentWidth, parentHeight)
		stage.scale({ x: min / WIDTH, y: min / HEIGHT })
		await tick()
		stage.height(min)
		stage.width(min)
	}

	onMount(() => {
		sketchEverything()
		fitCanvas()
	})

	$: updatePaper($wishgramSettings.paperColor)
	$: updateHighlight($wishgramSettings.highlightColor)
</script>

<svelte:window on:resize={fitCanvas} />
<div class="h-full w-full overflow-clip p-4 md:p-6 lg:flex-1">
	<div
		class="grid aspect-square h-full w-full place-items-center lg:aspect-auto"
		bind:this={stageParent}
	>
		<Stage
			class="overflow-clip rounded-lg"
			bind:handle={stage}
			config={{ width: WIDTH, height: HEIGHT }}
		>
			<Layer>
				<Rect
					bind:handle={paper}
					config={{
						x: 0,
						y: 0,
						width: WIDTH,
						height: HEIGHT,
						fill: $wishgramSettings.paperColor,
						filters: [Konva.Filters.Noise],
						noise: 0.2
					}}
				/>
			</Layer>
			<Layer>
				<Group>
					{#each otherImages as image}
						<Image config={{ ...image, draggable: true }} />
					{/each}
				</Group>
			</Layer>

			<Layer>
				<Group
					config={{
						width: WIDTH,
						height: HEIGHT,
						offsetX: WIDTH / 2,
						offsetY: HEIGHT / 2,
						x: WIDTH / 2,
						y: WIDTH / 2,
						scaleX: 0.8,
						scaleY: 0.8
					}}
				>
					{#each decorationImages as image}
						<Image config={image} />
					{/each}
				</Group>
			</Layer>
			<Layer>
				<Group>
					{#each mainImages as image}
						<Image bind:config={image} />
					{/each}
				</Group>

				<Group>
					{#each additionalImages as image}
						<Image bind:config={image} />
					{/each}
				</Group>
			</Layer>
			<Layer>
				{#if $wishgramSettings.wishgramWatermark}
					<Image
						config={{
							image: watermark,
							x: 20,
							y: 20,
							scaleX: 0.4,
							scaleY: 0.4
						}}
					/>
				{/if}
			</Layer>
		</Stage>
	</div>
</div>
