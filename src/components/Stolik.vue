<template>
    <div>
    <vue-resizable :active="handlers" class="stolik" :dragSelector="dragSelector" :top="stolik.yCoord" :left="stolik.xCoord" >
        <div class="resizable-content">
            <img src="@/assets/table1.png" alt="">
            <div class="drag-container-1"></div>
            <div class="flex">
                <b-button class="btn" size="sm" @click="deleteStolik" variant="danger"><img src="@/assets/bin.png" style="height:22px;width:22px;" alt=""></b-button>
                <b-button v-if="moved" @drag:start="movedMethod" size="sm" variant="primary">Set</b-button>
            </div>
        </div>
    </vue-resizable>
    </div>
</template>

<script>
import VueResizable from 'vue-resizable'
import axios from 'axios'
    export default {
        props:["stolik"],
        components:{
            VueResizable
        },
        data() {
            return {
                dragSelector: ".drag-container-1, .drag-container-2",
                handlers:[],
                moved:false,
            }
        },
        methods: {
            deleteStolik(){
                axios.delete(`${process.env.VUE_APP_API_URL}/api/stoliki/${this.stolik.id}`).then(res=>{
                    console.log(res)
                    this.$emit('get-stoliks');
                })
            },
            movedMethod(){
                this.moved = true;
            }
        },
    }
</script>

<style lang="scss" scoped>
.stolik{
    width:100px !important;
    height:100px !important;
}
.resizable-content{
    width:100px;
    height:100px;
    background: url("../assets/panele.jpg");
    border-radius:5px;
    position:relative;
    display:flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    gap:5px;
    img{
        height:50px;
    }
    .flex{
        display:flex;
        gap:10px;
    }
}
.btn{
    z-index:20;
}
.drag-container-1{
    width:100px;
    height:100px;
    cursor: pointer;
    z-index:10;
    position:absolute;
    left:0;
    top:0;
}
</style>