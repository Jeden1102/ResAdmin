<template>
    <div>
        <h2>Save View</h2>
        <b-form-group class="my-2" id="input-group-2" label="View Name:" label-for="input-2">
        <b-form-input
          id="input-2"
          v-model="name"
          placeholder="Enter name"
          required
        ></b-form-input>
      </b-form-group>
      <b-button class="mx-2" @click="setView" variant="info">Save</b-button>
      <b-button @click="cancel" variant="warning">Cancel</b-button>
    </div>
</template>

<script>
import axios from 'axios';
    export default {
        props:["data"],
        data() {
            return {
                name:'',
            }
        },
        methods: {
            setView(){
                axios.post(`${process.env.VUE_APP_API_URL}/api/views`,{
                name:this.name,
                value:this.data,
                }).then(res=>{
                console.log(res);
                this.cancel();
                this.$notify({
                    group: 'foo',
                    title: 'Info',
                    text: `New view has been saved succesfully!`,
                });
                }).catch(err=>{
                console.log(err)
                })
            },
            cancel(){
                this.$emit('cancel');
            }
        },
    }
</script>

<style lang="scss" scoped>

</style>