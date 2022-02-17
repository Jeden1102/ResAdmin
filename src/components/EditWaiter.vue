<template>
    <div>
        <h2>Edit Waiter</h2>
                     <b-form @submit.prevent="onSubmit" >

      <b-form-group  label="E-mail:" >
        <b-form-input
          v-model="email"
          placeholder="johndoe@gmail.com"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group  label="Password(If don't want to change - leave blank):" >
        <b-form-input
          v-model="pwd"
          type="password"
          placeholder="********"
        ></b-form-input>
      </b-form-group>
      <b-form-group  label="Waiter Name:" >
        <b-form-input
          v-model="name"
          placeholder="Enter name"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group  label="Waiter Second Name:" >
        <b-form-input
          v-model="secondName"
          placeholder="Enter name"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group  label="Waiter Salary" >
            <b-input-group prepend="$" class="mb-2 mr-sm-2 mb-sm-0">
            <b-form-input v-model="salary"  placeholder="25"></b-form-input>
            </b-input-group>
      </b-form-group>

            <b-form-checkbox
      v-model="admin"
    >
      Menagment options
    </b-form-checkbox>


      <b-button type="submit" variant="primary">Save changes</b-button>
      <b-button type="reset" class="mx-2" variant="warning" @click="closeModal">Cancel</b-button>
            </b-form>
    </div>
</template>

<script>
import axios from 'axios';
    export default {
        name:"EditWaiter",
        props:["user"],
        components:{
        },
        data() {
            return {
                    email:this.user.email,
                    pwd:'',
                    name:this.user.name,
                    secondName:this.user.surname,
                    salary:this.user.salary,
                    admin:this.user.isAdmin,
            }
        },
        methods: {
          closeModal(){
            this.$emit('close-modal');
          },
          onSubmit(){
            this.$emit('editing');
            axios.post(`https://resturant-api-xx.herokuapp.com/api/users/${this.user.id}?_method=PUT`,{
                    email:this.email,
                    password:this.pwd,
                    name:this.name,
                    surname:this.secondName,
                    salary:this.salary,
                    isAdmin:this.admin,
            }).then(res=>{
              console.log(res);
              this.$emit('get-users');
            this.$emit('editing');
            this.$emit('close-modal');


            }).catch(err=>{
              console.log(err)
            })
          },

        },
    }
</script>

<style lang="scss" scoped>

</style>