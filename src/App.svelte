<script>
    import LoginComponent from "./LoginComponent.svelte";
    let value = "world";
</script>

<style>
h1 {
    color: red;
}
</style>

<h1>Hello {value} !</h1>
<LoginComponent/>