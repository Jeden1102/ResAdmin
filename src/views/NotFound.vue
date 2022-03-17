<template>
    <div class="container">
        <img src="@/assets/404.png" alt="">
        <h1>Page not found</h1>
        <h3>Ooopssss...sorry we can't find that page. Check your url once again.</h3>
        <h5>Either something went wrong or you spelled the url incoreclty.</h5>
        <b-button  @click="goBack" variant="primary">BACK</b-button>
    </div>
</template>

<script>
    export default {    
        methods: {
            goBack(){
                this.$router.back();
            }
        },
        
    }
</script>

<style lang="scss" scoped>
.container{
    display:flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
</style>