<template>
    <div>
    <vue-resizable :active="handlers" @drag:start="movedMethod" @drag:end="setStolik" class="stolik" :dragSelector="dragSelector" :top="yCoord" :left="xCoord" >
        <div class="resizable-content">
            <div class="stol-id">{{ stolik.id }}</div>
            <div class="time" v-if="stolik.taken"><img src="@/assets/hourglass.png" style="width:15px;height:15px" alt="">{{stolik.taken_at}}</div>
            <img src="@/assets/table1.png" alt="">
            
            <div v-if="!waiter" class="drag-container-1"></div>
            <!-- admin -->
            <div class="flex" v-if="!waiter">
                <b-button class="btn" size="sm" @click="deleteStolik" variant="danger"><img src="@/assets/bin.png" style="height:22px;width:22px;" alt=""></b-button>
                <b-button v-if="moved" @click="setStolikToDb" size="sm" variant="primary">Set</b-button>
            </div>
            <!-- waiter -->
            <div class="flex" v-if="waiter">
                <b-button v-if="!stolik.taken" class="btn" size="sm" @click="startStolik" variant="success"><img src="@/assets/yes.png" style="height:25px;width:25px;" alt=""></b-button>
                <b-button v-else class="btn" size="sm"  @click="showOrder"  variant="primary"><img src="@/assets/menuWaiter.png" style="height:30px;width:30px;" alt=""></b-button>

            </div>
        </div>
    </vue-resizable>
    </div>
</template>

<script>
import VueResizable from 'vue-resizable'
import axios from 'axios'
    export default {
        props:["stolik","waiter"],
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
                user:this.$store.state.user,
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
            },
            startStolik(){
                axios.post(`${process.env.VUE_APP_API_URL}/api/stoliki/${this.stolik.id}?_method=PUT`,{
                waiterEdit:true,
                taken:1,
                waiter_id:this.user.id,
                waiter_name:this.user.name,
                taken_at:new Date().toLocaleTimeString()
                }).then(res=>{
                console.log(res);
                this.$emit('get-stoliki');
                this.$notify({
                    group: 'foo',
                    title: 'Info',
                    text: `Table has been taken!`,
                    });

                }).catch(err=>{
                console.log(err)
                })                
            },
            showOrder(){
                this.$emit('show-modal',this.stolik.id);
            },
            
        },


    }
</script>

<style lang="scss" scoped>
.stolik{
    width:100px !important;
    height:100px !important;
    color:black !important;
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
.time{
    position:absolute;
    right:0;
    top:0;
    background-color: #fff;
    padding:1px;
    border-radius:0 0 3px 0;
    font-size:12px;
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