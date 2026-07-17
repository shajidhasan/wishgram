<script lang="ts">
	import { appState } from '$lib/state.svelte'
	import { Label } from '../ui/label'
	import { Switch } from '../ui/switch'
</script>

<div class="flex items-center gap-2">
	<Switch bind:checked={appState.settings.wishgramWatermark} id="wishgram-watermark" />
	<Label for="wishgram-watermark">Wishgram watermark</Label>
</div>
