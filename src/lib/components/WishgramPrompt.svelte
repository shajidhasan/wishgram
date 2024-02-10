<script lang="ts">
	import { Input } from './ui/input'
	import { Label } from './ui/label'
	import { enhance } from '$app/forms'
	import { toast } from 'svelte-sonner'
	import { slide } from 'svelte/transition'
	import Button from './ui/button/button.svelte'
	import * as Card from '$lib/components/ui/card'
	import type { SubmitFunction } from '@sveltejs/kit'
	import { Eye, EyeOff, Loader, Wand } from 'lucide-svelte'

	let processing = false
	let moreOptions = false

	const abracadabra: SubmitFunction = () => {
		processing = true
		return async ({ result, update }) => {
			if (result.type === 'failure' && result.data) {
				if (result.status === 498) {
					toast(`Cloudflare error: ${result.data.message}`)
				} else {
					toast('Could not process at the moment')
				}
				processing = false
			}
			await update()
		}
	}
</script>

<!-- <svelte:head>
	<script src="https://challenges.cloudflare.com/turnstile/v0/api.js" async defer></script>
</svelte:head> -->

<Card.Root class="mb-12 w-11/12 max-w-[32rem] shadow-lg md:mb-0">
	<Card.Header>
		<Card.Title>Create a wish</Card.Title>
		<Card.Description>Generate a beautiful wish card in one click.</Card.Description>
	</Card.Header>
	<form use:enhance={abracadabra} method="post">
		<!-- <div>
			<div class="cf-turnstile" data-sitekey="0x4AAAAAAARe0g6HV1mKNslW"></div>
		</div> -->
		<Card.Content>
			<div class="flex w-full flex-col gap-1.5">
				<Label for="message">Type your wish/message</Label>
				<Input type="text" id="message" name="message" minlength={5} maxlength={40} />
				<p class="text-sm text-muted-foreground">Example: Happy birthday Afsana!</p>
			</div>

			{#if moreOptions}
				<div transition:slide class="flex flex-col gap-4 py-4">
					<div class="flex w-full max-w-sm flex-col gap-1.5">
						<Label for="context">Context</Label>
						<Input type="text" id="context" />
						<p class="text-sm text-muted-foreground">
							Example: She is my best friend. She loves cats.
						</p>
					</div>

					<div class="flex w-full flex-col gap-1.5">
						<Label for="date">Include a date</Label>
						<Input type="text" id="date" name="date" />
						<p class="text-sm text-muted-foreground">Example: 12/04/2024</p>
					</div>
				</div>
			{/if}
		</Card.Content>

		<Card.Footer class="flex justify-between">
			<Button
				on:click={() => {
					moreOptions = !moreOptions
				}}
				variant={moreOptions ? 'secondary' : 'outline'}
			>
				{#if moreOptions}
					<EyeOff class="mr-2 h-5 w-5" />
				{:else}
					<Eye class="mr-2 h-5 w-5" />
				{/if}
				<span> More Options </span>
			</Button>
			<Button type="submit" disabled={processing} class={processing ? 'animate-pulse' : ''}>
				{#if processing}
					<Loader class="h-5 w-5 animate-spin" />
				{:else}
					<Wand class="h-5 w-5" />
				{/if}
				<span class="w-2"></span>
				<span>Abracadabra</span>
			</Button>
		</Card.Footer>
	</form>
</Card.Root>
