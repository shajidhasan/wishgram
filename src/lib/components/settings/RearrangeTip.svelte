<script lang="ts">
	import * as Alert from '$lib/components/ui/alert'
	import { Pointer } from 'lucide-svelte'
</script>

<Alert.Root>
	<Pointer class="h-4 w-4" />
	<Alert.Title>Rearrange things</Alert.Title>
	<Alert.Description>Try moving things around by dragging.</Alert.Description>
</Alert.Root>
