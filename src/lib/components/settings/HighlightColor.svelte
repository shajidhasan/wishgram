<script lang="ts">
	import { wishgramSettings } from '$lib/stores'
	import * as ToggleGroup from '$lib/components/ui/toggle-group'
	import { Label } from '../ui/label'

	const colors = [
		{ code: '#ea5a47', name: 'Red', className: 'bg-[#ea5a47]' },
		{ code: '#b1cc33', name: 'Green', className: 'bg-[#b1cc33]' },
		{ code: '#92d3f5', name: 'Blue', className: 'bg-[#92d3f5]' },
		{ code: '#f1b31c', name: 'Orange', className: 'bg-[#f1b31c]' },
		{ code: '#ffa7c0', name: 'Pink', className: 'bg-[#ffa7c0]' }
	]
</script>

<div class="flex w-full max-w-sm flex-col gap-1.5">
	<Label for="highlight">Highlight color</Label>
	<ToggleGroup.Root
		bind:value={$wishgramSettings.highlightColor}
		id="highlight"
		type="single"
		variant="outline"
		class="justify-start"
	>
		{#each colors as color}
			<ToggleGroup.Item value={color.code} aria-label={color.name} class="p-2">
				<div class="h-8 w-8 rounded {color.className}"></div>
			</ToggleGroup.Item>
		{/each}
	</ToggleGroup.Root>
</div>
