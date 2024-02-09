<script lang="ts">
	import { wishgramSettings } from '$lib/stores'
	import { Label } from '../ui/label'
	import { Switch } from '../ui/switch'
</script>

<div class="flex items-center gap-2">
	<Switch bind:checked={$wishgramSettings.wishgramWatermark} id="wishgram-watermark" />
	<Label for="wishgram-watermark">Wishgram watermark</Label>
</div>
