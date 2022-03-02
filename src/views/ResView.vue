<template>
    <div class="rel">
        <SetViewModal class="modal-x" :data="saveViewJson" v-if="showModal" v-on:cancel="cancel"/>
        <LoadViewModal class="modal-x"  v-if="showLoadModal" v-on:cancel="cancel" v-on:preview-view="previewView" v-on:clear-preview="clearPreview"/>
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
        <b-button class="my-2" variant="success" @click="setAllTablesToDb" v-if="stolikiChanged">Save new view (set all tables positions)</b-button>
        <b-button class="my-2" variant="outline-primary" @click="setView" >Save this view as a template</b-button>
        <b-button variant="outline-info" @click="showLoadModalMethod">Load view</b-button>

        <b-card class="sala" v-if="previewStoliki.length==0">
            <Stolik  v-for="(stolik,index) of stoliki" :key="index" class="x" :stolik="stolik" v-on:remove-stolik="removeStolik" v-on:set-stolik="setStolik"/>
        </b-card>
        <b-card class="sala" v-else>
            <Stolik  v-for="(stolik,index) of previewStoliki" :key="index" class="x" :stolik="stolik" />
        </b-card>
    </div>
</template>

<script>
import axios from 'axios';
import Stolik from '@/components/Stolik.vue';
import SetViewModal from '@/components/SetViewModal.vue';
import LoadViewModal from '@/components/LoadViewModal.vue';
    export default {
        data() {
            return {
                xCoord:'',
                yCoord:'',
                stoliki:[],
                previewStoliki:[],
                stolikiChanged:false,
                showModal:false,
                saveViewJson:null,
                showLoadModal:false,
            }
        },
        components:{
            Stolik,
            SetViewModal,
            LoadViewModal
        },

        mounted() {
            this.getStoliki();
        },
        methods: {
            previewView(view){
                this.previewStoliki = JSON.parse(view.value);
                console.log(this.previewStoliki);
                console.log(this.previewStoliki.length);
            },
            clearPreview(){
                this.previewStoliki = [];
            },
            cancel(){
                console.log("ok");
                this.showLoadModal=false;
            },
            addStolik(){
                axios.post(`${process.env.VUE_APP_API_URL}/api/stoliki`,{
                    xCoord:this.xCoord,
                    yCoord:this.yCoord
                }).then(res=>{
                    console.log(res);
                        this.$notify({
                        group: 'foo',
                        title: 'Info',
                        text: `New table has been added succesfully!`,
                        });
                    this.getStoliki();
                })
            },
            getStoliki(){
                axios.get(`${process.env.VUE_APP_API_URL}/api/stoliki`).then(data=>{
                    this.stoliki = data.data;
                    console.log(this.stoliki);
                })
            },
            removeStolik(id){
                var foundIndex = this.stoliki.findIndex(x => x.id ==id);
                this.stoliki.splice(foundIndex,1)
                        this.$notify({
                        group: 'foo',
                        title: 'Info',
                        text: `New table has been removed succesfully!`,
                        });
            },
            setStolik(id,xCoord,yCoord){
                this.stolikiChanged = true;
                var foundIndex = this.stoliki.findIndex(x => x.id ==id);
                this.stoliki[foundIndex].xCoord = xCoord;
                this.stoliki[foundIndex].yCoord = yCoord;
                console.log(this.stoliki);
            },
            setAllTablesToDb(){
                this.stoliki.forEach(el=>{
                    axios.post(`${process.env.VUE_APP_API_URL}/api/stoliki/${el.id}?_method=PUT`,{
                    xCoord:el.xCoord,
                    yCoord:el.yCoord,
                    }).then(res=>{
                    console.log(res);
                    this.stolikiChanged = false;
                    this.$notify({
                        group: 'foo',
                        title: 'Info',
                        text: `New position has been set succesfully!`,
                        });

                    }).catch(err=>{
                    console.log(err)
                    })
                    })
            },
            setView(){
                let newData = [];
                 this.stoliki.forEach(el=>{
                     let obj = {};
                     obj.xCoord = el.xCoord;
                     obj.yCoord = el.yCoord;
                     newData.push(obj);
                })
                this.showLoadModal = false;
                this.showModal = true;
                let oldView = JSON.stringify(newData);
                this.saveViewJson = oldView;
            },
            showLoadModalMethod(){
                this.showModal = false;
                this.showLoadModal = true;
            }
        },

    }
</script>

<style lang="scss" scoped>

.rel{
    position:relative;
}
.modal-x{
    position: absolute;
left:50%;
top:50%;
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