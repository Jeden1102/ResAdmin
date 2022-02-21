<template>
    <div>
        <b-card>
            <h2>Menu</h2>
              <b-tabs content-class="mt-3">
                    <b-tab title="Products" active>
                        <h5>Products</h5>
                    </b-tab>
                    <b-tab title="Categories">
                        <Categories/>
                    </b-tab>
                </b-tabs>
        </b-card>
    </div>
</template>

<script>
import Categories from '@/components/Categories.vue';
    export default {
        components:{
            Categories,
        }

    }
</script>

<style lang="scss" scoped>

</style>