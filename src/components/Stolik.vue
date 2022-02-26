<template>
    <div>
    <vue-resizable :active="handlers" @drag:start="movedMethod" @drag:end="setStolik" class="stolik" :dragSelector="dragSelector" :top="yCoord" :left="xCoord" >
        <div class="resizable-content">
            <div class="stol-id">{{ stolik.id }}</div>
            <img src="@/assets/table1.png" alt="">
            
            <div class="drag-container-1"></div>
            <div class="flex">
                <b-button class="btn" size="sm" @click="deleteStolik" variant="danger"><img src="@/assets/bin.png" style="height:22px;width:22px;" alt=""></b-button>
                <b-button v-if="moved" @click="setStolikToDb" size="sm" variant="primary">Set</b-button>
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
                xCoord:this.stolik.xCoord,
                yCoord:this.stolik.yCoord,
            }
        },
        methods: {
            deleteStolik(){
                axios.delete(`${process.env.VUE_APP_API_URL}/api/stoliki/${this.stolik.id}`).then(res=>{
                    console.log(res);
                    this.$emit('remove-stolik',this.stolik.id);
                })
            },
            movedMethod(){
                this.moved = true;
            },
            setStolik(data){
                this.xCoord = data.left;
                this.yCoord = data.top;
                this.$emit('set-stolik',this.stolik.id,data.left,data.top);
            },
            setStolikToDb(){
                axios.post(`${process.env.VUE_APP_API_URL}/api/stoliki/${this.stolik.id}?_method=PUT`,{
                xCoord:this.xCoord,
                yCoord:this.yCoord,
                }).then(res=>{
                console.log(res);
                this.moved = false;
                this.$notify({
                    group: 'foo',
                    title: 'Info',
                    text: `New position has been set succesfully!`,
                    });

                }).catch(err=>{
                console.log(err)
                })
            }
        },


    }
</script>

<style lang="scss" scoped>
.stolik{
    width:100px !important;
    height:100px !important;
}
.stol-id{
    position:absolute;
    left:0;
    top:0;
    background-color: #fff;
    padding:1px;
    border-radius:0 0 3px 0;
    font-weight: bold;
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