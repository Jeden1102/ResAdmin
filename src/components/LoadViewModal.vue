<template>
    <div>
        <h2 v-if="!previewing">Load View</h2>
        <table v-if="views.length>0 && previewing==false">
            <tr>
                <td>Name</td>
                <td>Action</td>
            </tr>
            <tr v-for="(view,index) of views" :key="index">
                <td>{{ view.name }}</td>
                <td>
                    <b-button variant="primary" @click="previewView(view)">Preview</b-button>
                    <b-button variant="danger" class="mx-2" @click="deleteView(view.id)">Delete</b-button>
                </td>
            </tr>
        </table>
        <h3 v-if="views.length==0 && previewing==false">No views has been saved yet...</h3>
        <div v-if="previewing">
            <h2>Save {{ previewName }} view</h2>
            
              <b-button  variant="success" v-b-modal.modal-1>Save</b-button>
 
                <b-modal ref="my-modal" hide-footer id="modal-1" title="Warning">
                    <p class="my-4">Are you sure?</p>
                    <p class="my-4">You are chaning the view, which means, all your current data about taken tables, time etc. will be lost.</p>
                    <b-button class="mt-3" variant="outline-primary" block @click="hideModal">Close Me</b-button>
                    <b-button class="mt-3 mx-2" variant="outline-success" block @click="hideAndSave">Save</b-button>
                </b-modal>
            <b-button class="mx-2" variant="warning" @click="cancelPreview">Cancel</b-button>
        </div>
        <b-button variant="warning" @click="closeModal" v-if="!previewing" class="mt-4">Cancel</b-button>

    </div>
</template>

<script>
import axios from 'axios';
    export default {
        data() {
            return {
                views:[],
                previewing:false,
                previewName:'',
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
            },
            hideModal() {
                this.$refs['my-modal'].hide()
            },
            hideAndSave(){
                this.$refs['my-modal'].hide()
                this.$emit('save-view');
                this.previewing = false;
            },
            previewView(view){
                this.$emit('preview-view',view);
                this.previewing = true;
                this.previewName = view.name
            },
            deleteView(id){
                console.log(id)
                axios.delete(`${process.env.VUE_APP_API_URL}/api/views/${id}`).then(res=>{
                    console.log(res);
                    this.views = this.views.filter(el=>el.id != id);
                })
            },
            cancelPreview(){
                this.previewing = false;
                this.$emit('clear-preview');
            },
            closeModal(){
                this.$emit('cancel');
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>