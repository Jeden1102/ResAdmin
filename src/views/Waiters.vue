<template>
    <div>
        <h2>Waiters</h2>
        <b-card>
            <h3>Waiters list</h3>
            <table v-if="usersList.length>0">
                <tr>
                    <td>#</td>
                    <td>Name</td>
                    <td>Second Name</td>
                    <td>Email</td>
                    <td>Salary</td>
                    <td>Admin</td>
                    <td>Added</td>
                    <td>Actions</td>
                </tr>
                <tr v-for="(user,index) in usersList" :key="index">
                    <td>{{user.id}}</td>
                    <td>{{ user.name }}</td>
                    <td>{{ user.surname }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.password }}</td>
                    <td>{{ new Date(user.created_at).toLocaleDateString() }}</td>
                    <td>{{ user.isAdmin }}</td>
                    <td>
                        <b-button variant="primary" class="mx-2">Edit</b-button>
                        <b-button variant="danger" @click="deleteUser(user.id)">Delete</b-button>
                    </td>
                </tr>
            </table>
            <div v-else>
              <h4>There are no users</h4>
            </div>
        </b-card>
        <b-card>
            <h3>Add waiter</h3>
             <b-form @submit.prevent="onSubmit" >

      <b-form-group  label="E-mail:" >
        <b-form-input
          v-model="email"
          placeholder="johndoe@gmail.com"
          required
        ></b-form-input>
      </b-form-group>
      <b-form-group  label="Password:" >
        <b-form-input
          v-model="pwd"
          type="password"
          placeholder="********"
          required
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


      <b-button type="submit" variant="primary">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
            </b-form>
        </b-card>
    </div>
</template>

<script>
import db from '../firebase/firebaseInit';
// import firebase from "firebase/app";
import axios from 'axios';
// import "firebase/auth";
    export default {
        data() {
            return {
                    email:'',
                    pwd:'',
                    name:'',
                    secondName:'',
                    salary:'',
                    admin:false,
                    usersList:null,
            }
        },
        mounted() {
          this.getUsers();
        },
        methods: {
            deleteUser(id){
              console.log(db);
              console.log(id);
              axios.delete(`https://resturant-api-xx.herokuapp.com/api/users/${id}`).then(res=>{
                console.log(res);
              this.getUsers();
              })
            },
            getUsers(){

            axios.get("https://resturant-api-xx.herokuapp.com/api/users").then(res=>{
              this.usersList = res.data;
            }).catch(err=>{
              console.log(err);
            })
            },
            onSubmit(){
              axios.post("https://resturant-api-xx.herokuapp.com/api/addUser",{
                    id:null,
                    email:this.email,
                    password:this.pwd,
                    name:this.name,
                    surname:this.secondName,
                    salary:this.salary,
                    isAdmin:this.admin,
                    created_at:Date.now(),
              }).then(res=>{  
                console.log(res);
                this.getUsers();
              })
                // let res  = await firebase.auth().createUserWithEmailAndPassword(this.email,this.pwd);
                // db.collection("users").doc(res.user.uid).set({
                //     email:this.email,
                //     name:this.name,
                //     surname:this.secondName,
                //     salary:this.salary,
                //     admin:this.admin,
                //     created_at:Date.now(),
                // })
                // this.$router.push({name:"Profile.vue"})
            }
        },
    }
</script>

<style lang="scss" scoped>
table{
    border:1px solid black;
    td,tr{
    border:1px solid black;
padding:5px;
    }
}
</style>