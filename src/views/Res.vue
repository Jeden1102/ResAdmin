<template>
    <div class="rel">
        <Loading v-if="loadingData">Loading view...</Loading>
        <ShowOrderModal class="modal-x"  v-if="showModal" :id="stolId" :categories="categories" :products="products" v-on:cancel="cancel" v-on:get-stoliki="getStoliki"/>
        <b-card>
            <h2>Restaurant View</h2>
        </b-card>
        <b-card class="sala" >
            <Stolik  v-for="(stolik,index) of stoliki" :waiter="true" :key="index" v-on:get-stoliki="getStoliki" v-on:show-modal="showModalMethod" class="x" :stolik="stolik" />
        </b-card>

    </div>
</template>

<script>
import axios from 'axios';
import Stolik from '@/components/Stolik.vue';
import ShowOrderModal from '@/components/ShowOrderModal.vue';
import Loading from '@/components/Loading.vue';
    export default {
  name: "Res",

        components:{
            Stolik,
            ShowOrderModal,
            Loading
        },
        data() {
            return {
                stoliki:null,
                showModal:false,
                stolId:null,
                categories:null,
                products:null,
                loadingData:false,
            }
        },
        mounted() {
            this.getStoliki();
            this.getCategories();
            this.getProducts();
        },
        methods: {
            getStoliki(){
                this.loadingData=true;
                axios.get(`${process.env.VUE_APP_API_URL}/api/stoliki`).then(data=>{
                    this.stoliki = data.data;
                    this.loadingData=false;
                })
            },
            showModalMethod(id){
                this.showModal = true;
                this.stolId = id;
            },
            getCategories(){
                axios.get(`${process.env.VUE_APP_API_URL}/api/categories`).then(data=>{
                    this.categories = data.data;
                })
            },
            getProducts(){
                axios.get(`${process.env.VUE_APP_API_URL}/api/productsGrupped`).then(data=>{
                    this.products = data.data;
                })
            },
            cancel(){
                this.showModal = false;
            }
        },        
    }
</script>

<style lang="scss" scoped>
.rel{
    position:relative;
}
.modal-x{
    position: fixed;
    width:100%;
    height:100vh;
    overflow-y: scroll;
left:50%;
top:400px;
transform: translate(-50%,-50%);
background: rgba(0, 0, 0, 0.65);
box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
border-radius: 10px;
border: 1px solid rgba( 255, 255, 255, 0.18 );
padding:35px;
z-index:9991;
color:White;
}
.x{
    width:100px;
    height:100px;
    position:absolute;
}
.form-x{
    display: flex;
    gap:5px;
}
.sala{
    position:relative;
    width:90%;
    height:100vh;
    background:url("../assets/rzut.jpg");
    background-size: cover;
    background-position: center;
}
</style>