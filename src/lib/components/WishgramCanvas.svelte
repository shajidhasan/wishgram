<script lang="ts">
	import Konva from 'konva'
	import { HEIGHT, WIDTH } from '$lib'
	import { onMount, tick, untrack } from 'svelte'
	import type { MessagePart } from '$lib/types'
	import wishgramWatermark from '$lib/assets/wishgram-watermark.png'
	import { appState } from '$lib/state.svelte'
	import { Stage, Layer, Image, Group, Rect } from 'svelte-konva'
	import { getPositions, getRoughDecorations, getRoughTexts } from '$lib/wishgram/rough'

	let { stage = $bindable() }: { stage?: Konva.Stage } = $props()

	let stageComponent: ReturnType<typeof Stage> | undefined = $state()
	let paperComponent: ReturnType<typeof Rect> | undefined = $state()
	let stageParent: HTMLDivElement | undefined = $state()

	let mainImages: Konva.ImageConfig[] = $state([])
	let additionalImages: Konva.ImageConfig[] = $state([])
	let decorationImages: Konva.ImageConfig[] = $state([])
	let otherImages: Konva.ImageConfig[] = $state([])

	const watermark = new window.Image()
	watermark.src = wishgramWatermark

	const sketchMain = (parts: (MessagePart & { code: string })[], highlightColor: string) => {
		const { textImages } = getRoughTexts(parts, highlightColor)
		// re-sketched images carry no x/y — keep the previous positions (drags included);
		// untrack so the highlight $effect doesn't loop on its own write
		const previous = untrack(() => mainImages)
		mainImages =
			previous.length === textImages.length
				? previous.map((image, i) => ({ ...image, ...textImages[i] }))
				: textImages
	}

	const sketchAdditional = (parts: { code: string }[]) => {
		additionalImages = getRoughTexts(parts).textImages
	}

	const sketchDecorations = (decorations: string[]) => {
		decorationImages = getRoughDecorations(decorations)
	}

	const sketchOther = (code: string) => {
		otherImages = getRoughTexts([{ code }]).textImages
	}

	const setAttributes = () => {
		const mainPositions = getPositions(mainImages, -HEIGHT / 10)
		const additionalPositions = getPositions(additionalImages, HEIGHT / 8)
		const otherPositions = getPositions(otherImages, HEIGHT / 2 - 100)

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
		if (!appState.processedSVGs) return
		sketchMain(appState.processedSVGs.main, appState.settings.highlightColor)
		sketchAdditional(appState.processedSVGs.additional)
		sketchDecorations(appState.processedSVGs.decorations)
		if (appState.processedSVGs.date) sketchOther(appState.processedSVGs.date)
		setAttributes()

		await tick()
		paperComponent?.node.cache()
	}

	const updatePaper = async (_paperColor: string) => {
		// fill is a reactive prop; the cached paper just needs a re-cache to repaint
		await tick()
		paperComponent?.node.cache()
	}

	const updateHighlight = (highlightColor: string) => {
		if (!appState.processedSVGs) return
		sketchMain(appState.processedSVGs.main, highlightColor)
	}

	const fitCanvas = async () => {
		if (!stageParent || !stage) return
		const min = Math.min(stageParent.offsetWidth, stageParent.offsetHeight)
		stage.scale({ x: min / WIDTH, y: min / HEIGHT })
		await tick()
		stage.height(min)
		stage.width(min)
	}

	onMount(() => {
		stage = stageComponent!.node
		sketchEverything()
		fitCanvas()
	})

	$effect(() => {
		updatePaper(appState.settings.paperColor)
	})
	$effect(() => {
		updateHighlight(appState.settings.highlightColor)
	})
</script>

<svelte:window onresize={fitCanvas} />
<div class="h-full w-full overflow-clip p-4 md:p-6 lg:flex-1">
	<div
		class="grid aspect-square h-full w-full place-items-center lg:aspect-auto"
		bind:this={stageParent}
	>
		<Stage
			bind:this={stageComponent}
			width={WIDTH}
			height={HEIGHT}
			divWrapperProps={{ class: 'overflow-clip rounded-lg' }}
		>
			<Layer>
				<Rect
					bind:this={paperComponent}
					x={0}
					y={0}
					width={WIDTH}
					height={HEIGHT}
					fill={appState.settings.paperColor}
					filters={[Konva.Filters.Noise]}
					noise={0.2}
				/>
			</Layer>
			<Layer>
				<Group>
					{#each otherImages as image}
						<Image {...image} draggable staticConfig />
					{/each}
				</Group>
			</Layer>

			<Layer>
				<Group
					width={WIDTH}
					height={HEIGHT}
					offsetX={WIDTH / 2}
					offsetY={HEIGHT / 2}
					x={WIDTH / 2}
					y={WIDTH / 2}
					scaleX={0.8}
					scaleY={0.8}
				>
					{#each decorationImages as image}
						<Image {...image} staticConfig />
					{/each}
				</Group>
			</Layer>
			<Layer>
				<Group>
					{#each mainImages as image}
						<Image {...image} staticConfig />
					{/each}
				</Group>

				<Group>
					{#each additionalImages as image}
						<Image {...image} staticConfig />
					{/each}
				</Group>
			</Layer>
			<Layer>
				{#if appState.settings.wishgramWatermark}
					<Image image={watermark} x={20} y={20} scaleX={0.4} scaleY={0.4} />
				{/if}
			</Layer>
		</Stage>
	</div>
</div>
