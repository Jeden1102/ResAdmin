<template>
    <div>
        <h2>Load View</h2>
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
              <b-button  variant="success" v-b-modal.modal-1>Save</b-button>
 
                <b-modal ref="my-modal" hide-footer id="modal-1" title="Warning">
                    <p class="my-4">Are you sure?</p>
                    <p class="my-4">You are chaning the view, which means, all your current data about taken tables, time etc. will be lost.</p>
                    <b-button class="mt-3" variant="outline-primary" block @click="hideModal">Close Me</b-button>
                    <b-button class="mt-3 mx-2" variant="outline-success" block @click="hideAndSave">Save</b-button>
                </b-modal>
            <b-button class="mx-2" variant="warning" @click="cancelPreview">Cancel</b-button>
        </div>
        <b-button variant="warning" @click="closeModal" class="mt-4">Cancel</b-button>

    </div>
</template>

<script>
import axios from 'axios';
    export default {
        data() {
            return {
                views:[],
                previewing:false,
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
                console.log("TUTAJ ref do zmiany stolików + do bazy");
            },
            previewView(view){
                this.$emit('preview-view',view);
                this.previewing = true;
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