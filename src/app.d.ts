// See https://kit.svelte.dev/docs/types#app
// for information about these interfaces
declare global {
	namespace App {
		// interface Error {}
		// interface Locals {}
		// interface PageData {}
		// interface PageState {}
		// interface Platform {}


	}
}

// default export
declare module 'svelte-konva?client' {
	import all from 'svelte-konva'
	export = all
}

// default export
declare module 'svg2roughjs?client' {
	import all from 'svg2roughjs'
	export = all
}

// fallback
declare module '*?client'
declare module '*?server'