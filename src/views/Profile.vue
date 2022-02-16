<template>
    <div>
        <h2>Hi {{user}} !</h2>
    </div>
</template>

<script>
    export default {
        data() {
            return {
                user:null
            }
        },
        mounted() {
            this.user = this.$store.state.user;
        },
    }
</script>

<style lang="scss" scoped>

</style>