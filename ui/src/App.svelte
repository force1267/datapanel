<script>
	import Login from "./Login.svelte"
	export let user = false;
</script>

{#if user === false}
	<Login :user/>
{/if}