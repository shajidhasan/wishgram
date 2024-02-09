<script lang="ts">
	import { wishgramSettings } from '$lib/stores'
	import * as ToggleGroup from '$lib/components/ui/toggle-group'
	import { Label } from '../ui/label'

	const colors = [
		{ code: '#f6eee3', name: 'Alabaster', className: 'bg-[#f6eee3]' },
		{ code: '#e3e8f0', name: 'Light Gray', className: 'bg-[#e3e8f0]' },
		{ code: '#e7e5e4', name: 'Light Platinum', className: 'bg-[#e7e5e4]' },
		{ code: '#f7fee7', name: 'Light Latte', className: 'bg-[#f7fee7]' },
		{ code: '#e1f2fe', name: 'Light Cyan', className: 'bg-[#e1f2fe]' }
	]
</script>

<div class="flex w-full max-w-sm flex-col gap-1.5">
	<Label for="paper">Paper color</Label>
	<ToggleGroup.Root
		bind:value={$wishgramSettings.paperColor}
		id="paper"
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
