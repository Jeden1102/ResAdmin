<template>
    <div>
        <b-card>
            <h2>Restaurant View</h2>
              <b-form inline class="form-x" @submit.prevent="addStolik">
                  <div>
                    <label class="sr-only" for="inline-form-input-username">Username</label>
                    <b-input-group prepend="X" class="mb-2 mr-sm-2 mb-sm-0">
                    <b-form-input id="inline-form-input-username" placeholder="Enter X Coord" v-model="xCoord"></b-form-input>
                    </b-input-group>
                  </div>
                  <div>
                        <label class="sr-only" for="inline-form-input-username">Username</label>
                        <b-input-group prepend="Y" class="mb-2 mr-sm-2 mb-sm-0">
                        <b-form-input id="inline-form-input-username" placeholder="Enter Y Coord" v-model="yCoord"></b-form-input>
                        </b-input-group>
                  </div>
                <b-button type="submit" variant="primary">Add</b-button>
            </b-form>
        </b-card>
        <b-card class="sala">
            <Stolik v-for="(stolik,index) of stoliki" :key="index" class="x" :stolik="stolik" v-on:get-stoliks="getStoliki"/>
        </b-card>
    </div>
</template>

<script>
import axios from 'axios';
import Stolik from '@/components/Stolik.vue';
    export default {
        data() {
            return {
                xCoord:'',
                yCoord:'',
                stoliki:[],
            }
        },
        components:{
            Stolik,
        },

        mounted() {
            this.getStoliki();
        },
        methods: {
            addStolik(){
                axios.post(`${process.env.VUE_APP_API_URL}/api/stoliki`,{
                    xCoord:this.xCoord,
                    yCoord:this.yCoord
                }).then(res=>{
                    console.log(res);
                    this.getStoliki();
                })
            },
            getStoliki(){
                axios.get(`${process.env.VUE_APP_API_URL}/api/stoliki`).then(data=>{
                    this.stoliki = data.data;
                    console.log(this.stoliki);
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
.x{
    width:100px;
    height:100px;
}
.form-x{
    display: flex;
    gap:5px;
}
.sala{
    position:relative;
    width:90%;
    min-height:100vh;
    background:url("../assets/rzut.jpg");
    background-size: cover;
    background-position: center;
}

</style>