<template>
    <div>
        <h2>Load View</h2>
        {{ views }}
        <div v-for="(view,index) of views" :key="index">
            {{ view.name }}
            <b-button>Previews</b-button>
        </div>

    </div>
</template>

<script>
import axios from 'axios';
    export default {
        data() {
            return {
                views:[],
            }
        },
        mounted() {
            this.getViews();
        },
        methods: {
            getViews(){
                axios.get(`${process.env.VUE_APP_API_URL}/api/views`).then(res=>{
                    this.views = res.data;
                })
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>