<script lang="ts">
	import { Coffee } from 'lucide-svelte'
	import * as Card from '$lib/components/ui/card'
	import { Button } from '$lib/components/ui/button'
</script>

<Card.Root>
	<Card.Header>
		<Card.Title>Enjoyed Wishgram?</Card.Title>
		<Card.Description>Help keep Wishgram magical with a donation.</Card.Description>
	</Card.Header>
	<Card.Content>
		<Button variant="secondary" href="https://www.buymeacoffee.com/sh4jid">
			<Coffee class="mr-2 h-4 w-4" />
			<span>Buy me a coffee</span>
		</Button>
	</Card.Content>
</Card.Root>
