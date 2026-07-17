<script lang="ts">
	import { Button } from '$lib/components/ui/button'
	import { Download } from '@lucide/svelte'

	let { ondownload }: { ondownload?: () => void } = $props()
</script>

<div class="flex justify-end">
	<Button onclick={ondownload}>
		<Download class="mr-2 h-4 w-4" />
		<span>Download</span>
	</Button>
</div>
