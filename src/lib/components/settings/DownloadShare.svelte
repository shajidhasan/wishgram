<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { Download } from 'lucide-svelte'
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	const onDownload = () => {
		dispatch('download')
	}
</script>

<div class="flex justify-end">
	<Button on:click={onDownload}>
		<Download class="mr-2 h-4 w-4" />
		<span>Download</span>
	</Button>
</div>
