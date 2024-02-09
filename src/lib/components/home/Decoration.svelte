<script lang="ts">
	import decoration1 from '$lib/assets/decorations/1.svg'
	import decoration2 from '$lib/assets/decorations/2.svg'
	import decoration3 from '$lib/assets/decorations/3.svg'
	import decoration4 from '$lib/assets/decorations/4.svg'
	import decoration5 from '$lib/assets/decorations/5.svg'
	import decoration6 from '$lib/assets/decorations/6.svg'
	import decoration7 from '$lib/assets/decorations/7.svg'
	import decoration8 from '$lib/assets/decorations/8.svg'
	import decoration9 from '$lib/assets/decorations/9.svg'
	import decoration10 from '$lib/assets/decorations/10.svg'
	import decoration11 from '$lib/assets/decorations/11.svg'
	import { shuffle } from '$lib/utils'
	import { HERO_DECOR_LOCATIONS as locations } from '$lib'

	const decorations = shuffle([
		decoration1,
		decoration2,
		decoration3,
		decoration4,
		decoration5,
		decoration6,
		decoration7,
		decoration8,
		decoration9,
		decoration10,
		decoration11
	])

	const styleString = (style: Record<string, string>) => {
		return Object.entries(style)
			.map(([k, v]) => `${k}:${v}`)
			.join(';')
	}
</script>

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
