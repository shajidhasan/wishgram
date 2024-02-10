<script lang="ts">
	import Button from "$lib/components/ui/button/button.svelte"
	import TextToSVG from "$lib/wishgram/text-to-svg"
    import fontPath from '$lib/assets/fonts/ChakraPetch-SemiBold.ttf'

    const debug = async () => {
        const res = await fetch(fontPath);
        const blob = await res.blob()
        const buffer = await blob.arrayBuffer()
        const normal = TextToSVG.parse(buffer)
    }
</script>


<div class="h-screen grid place-items-center">
    <Button on:click={debug}>Hello</Button>
</div>