<script lang="ts">
	import wishgramLogo from '$lib/assets/wishgram-logo.svg'

	import Watermark from './Watermark.svelte'
	import PaperColor from './PaperColor.svelte'
	import RearrangeTip from './RearrangeTip.svelte'
	import HighlightColor from './HighlightColor.svelte'
	import DonationMessage from './DonationMessage.svelte'
	import DownloadShare from './DownloadShare.svelte'
	import { createEventDispatcher } from 'svelte'

	const dispatch = createEventDispatcher()

	const onDownload = () => {
		dispatch('download')
	}
</script>

<div class="flex flex-col gap-6 p-6 shadow-xl md:p-4 lg:h-full lg:flex-shrink-0 lg:overflow-y-auto">
	<a href="/">
		<img src={wishgramLogo} alt="Wishgram Logo" class="w-12 lg:w-20" />
	</a>
	<RearrangeTip />
	<HighlightColor />
	<PaperColor />
	<Watermark />
	<!-- <DonationMessage /> -->
	<DownloadShare on:download={onDownload} />
</div>
