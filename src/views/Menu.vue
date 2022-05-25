<template>
    <div class="rel">
        <b-card>
            <h2>Menu</h2>
              <b-tabs content-class="mt-3">
                    <b-tab title="Products" active>
                        <Products/>
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
import Products from '@/components/Products.vue';
    export default {
  name: "Menu",

        components:{
            Categories,
            Products
        }

    }
</script>

<style lang="scss" scoped>
.rel{
    color:black;
}
</style>