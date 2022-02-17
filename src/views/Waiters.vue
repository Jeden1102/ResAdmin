<template>
    <div class="rel">
      <Loading v-if="addingWaiter">Waiter is being added...</Loading>
      <Loading v-if="deletingWaiter">Waiter is being deleted...</Loading>
      <Loading v-if="editingWaiter">Waiter is being edited...</Loading>
        <h2>Waiters</h2>
        <b-card>
            <EditWaiter class="edit-waiter" :user="showEditUser" v-if="showEditUser" v-on:close-modal="closeModal" v-on:get-users="getUsers" v-on:editing="editingWaiterMethod"/>
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
                        <b-button variant="primary" class="mx-2" @click="showEdit(user)">Edit</b-button>
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
import axios from 'axios';
import EditWaiter from '@/components/EditWaiter.vue';
import Loading from '@/components/Loading.vue';
    export default {
      components:{
        EditWaiter,
        Loading,
        
      },
        data() {
            return {
                    email:'',
                    pwd:'',
                    name:'',
                    secondName:'',
                    salary:'',
                    admin:false,
                    usersList:null,
                    showEditUser:null,
                    addingWaiter:false,
                    deletingWaiter:false,
                    editingWaiter:false,
            }
        },
        mounted() {
          this.getUsers();

        },
        methods: {
          showEdit(user){
            this.showEditUser = user;
            console.log(this.showEditUser);
          },
          closeModal(){
            this.showEditUser=null;
          },
          editingWaiterMethod(){
            this.editingWaiter = !this.editingWaiter;
          },
            deleteUser(id){
              console.log(db);
              console.log(id);
              this.deletingWaiter = true;
              let self = this;
              axios.delete(`https://resturant-api-xx.herokuapp.com/api/users/${id}`).then(res=>{
                console.log(res);
                self.deletingWaiter = false;
            self.$notify({
              group: 'foo',
              title: 'Info',
              text: 'User has been deleted succesfully!',
            });
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
              this.addingWaiter = true;
              let self = this;
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
                self.addingWaiter = false;
                self.$notify({
                  group: 'foo',
                  title: 'Info',
                  text: `User ${self.name} has been added succesfully!`,
                });
                this.getUsers();
              })
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
.rel{
  position:relative;
}
.edit-waiter{
position: absolute;
left:50%;
top:50%;
transform: translate(-50%,-50%);
background: rgba( 255, 255, 255, 0.25 );
box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
backdrop-filter: blur( 4px );
-webkit-backdrop-filter: blur( 4px );
border-radius: 10px;
border: 1px solid rgba( 255, 255, 255, 0.18 );
padding:15px;
z-index:11;
}
</style>