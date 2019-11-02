<script>
    export let user
    let username = ""
    let password = ""
    let register = false

    function login() {
        
        register = true
    }
    function confirm() {

    }
</script>


<div>
    {#if !register}
        <input type="text" bind:value={username} placeholder="نام کاربری"/>
        <input type="password" bind:value={password} placeholder="کلمه عبور"/>
        <button on:click={login()}>ورود</button>
    {:else}
        <input type="password" :value=password placeholder="کلمه عبور">
        <button on:click={confirm()}>تایید</button>
    {/if}
</div>