<template>
    <div class="rel">

      <Loading v-if="addingWaiter">Waiter is being added...</Loading>
      <Loading v-if="deletingWaiter">Waiter is being deleted...</Loading>
      <Loading v-if="editingWaiter">Waiter is being edited...</Loading>
      <Loading v-if="loadingData">Getting waiters data..</Loading>
        <h2 class="text-white">Waiters</h2>
        
        <b-card>
            <Transition name="fade">
              <EditWaiter class="edit-waiter" :user="showEditUser" v-if="showEditUser" v-on:close-modal="closeModal" v-on:get-users="getUsers" v-on:editing="editingWaiterMethod"/>
            </Transition>
            <h3>Waiters list</h3>
            <div v-if="usersList.length>0" class="table-responsive">
            <table  class="styled-table ">
                <tr>
                    <td>#</td>
                    <td>Name</td>
                    <td>Second Name</td>
                    <td>Email</td>
                    <td>Salary</td>
                    <td>Added</td>
                    <td>Admin</td>
                    <td>Actions</td>
                </tr>
                <tr v-for="(user,index) in usersList" :key="index">
                    <td>{{user.id}}</td>
                    <td>{{ user.name }}</td>
                    <td>{{ user.surname }}</td>
                    <td>{{ user.email }}</td>
                    <td>{{ user.salary }}$</td>
                    <td>{{ user.created_at }}</td>
                    <td>{{ user.isAdmin }}</td>
                    <td>
                      <div v-if="user.email != 'admin@o2.pl' && user.email != 'dominik@o2.pl'">
                        <b-button variant="primary" class="mx-2" @click="showEdit(user)">Edit</b-button>
                        <b-button variant="danger" @click="deleteUser(user.id)">Delete</b-button>
                      </div>
                      <div v-else>
                        Nie można ingerować
                      </div>

                    </td>
                </tr>
            </table>
            </div>

            <div v-else>
              <h4>There are no users</h4>
            </div>
        </b-card>
        <b-card class="my-2">
            <h3>Add waiter</h3>
             <b-form @submit.prevent="onSubmit" >

      <b-form-group  label="E-mail:" >
        <b-form-input
          v-model="email"
          placeholder="johndoe@gmail.com"
        ></b-form-input>
          <div class="error" v-if="!$v.email.required && $v.email.$dirty">Field is required</div>
          <div class="error" v-if="!$v.email.minLength">Email must have at least {{$v.email.$params.minLength.min}} letters.</div>            
          <div class="error" v-if="!$v.email.email">It has to be an valid email</div>            
      </b-form-group>
      <b-form-group  label="Password:" >
        <b-form-input
          v-model="pwd"
          type="password"
          placeholder="********"
        ></b-form-input>
          <div class="error" v-if="!$v.pwd.required && $v.pwd.$dirty">Field is required</div>
          <div class="error" v-if="!$v.pwd.minLength">Password must have at least {{$v.pwd.$params.minLength.min}} letters.</div>        
      </b-form-group>
      <b-form-group  label="Waiter Name:" >
        <b-form-input
          v-model="name"
          placeholder="Enter name"
        ></b-form-input>
          <div class="error" v-if="!$v.name.required && $v.name.$dirty">Field is required</div>
          <div class="error" v-if="!$v.name.minLength">Name must have at least {{$v.name.$params.minLength.min}} letters.</div>
      </b-form-group>
      <b-form-group  label="Waiter Second Name:" >
        <b-form-input
          v-model="secondName"
          placeholder="Enter name"
        ></b-form-input>
          <div class="error" v-if="!$v.secondName.required && $v.secondName.$dirty">Field is required</div>
          <div class="error" v-if="!$v.secondName.minLength">Surname must have at least {{$v.secondName.$params.minLength.min}} letters.</div>
      </b-form-group>
      <b-form-group  label="Waiter Salary" >
            <b-input-group prepend="$" class="mb-2 mr-sm-2 mb-sm-0">
            <b-form-input v-model="salary"  placeholder="25"></b-form-input>
            </b-input-group>
                      <div class="error" v-if="!$v.salary.required && $v.salary.$dirty">Field is required</div>
      </b-form-group>

      <b-form-group class="my-2">
        <input v-model="admin" id="s1" type="checkbox" class="switch">
        <label for="s1">Menagment optionss</label>
      </b-form-group>

      <b-button type="submit" variant="primary" class="mx-2">Submit</b-button>
      <b-button type="reset" variant="danger">Reset</b-button>
      <p class="typo__p" v-if="submitStatus === 'ERROR'">Please fill the form correctly.</p>
            </b-form>
        </b-card>
    </div>
</template>

<script>
import db from '../firebase/firebaseInit';
import axios from 'axios';
import EditWaiter from '@/components/EditWaiter.vue';
import Loading from '@/components/Loading.vue';
import { required, minLength,email } from 'vuelidate/lib/validators'
    export default {
  name: "Waiters",

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
                    submitStatus:'',
                    loadingData:false,
            }
        },
        validations: {
          name: {
            required,
            minLength: minLength(3)
          },
          secondName: {
            required,
            minLength: minLength(3)
          },
          pwd: {
            required,
            minLength: minLength(6)
          },
          email: {
            required,
            minLength: minLength(3),
            email
          },
          salary:{
            required,
          }
        },        
        mounted() {
          this.getUsers();
        },
        methods: {
          showEdit(user){
            this.showEditUser = user;
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
              axios.delete(`${process.env.VUE_APP_API_URL}/api/users/${id}`).then(res=>{
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
              this.loadingData=true;
            axios.get(`${process.env.VUE_APP_API_URL}/api/users`).then(res=>{
              this.usersList = res.data;
              this.loadingData=false;
            }).catch(err=>{
              console.log(err);
              this.loadingData=false;
            })
            },
            onSubmit(){
              //validation
            this.$v.$touch()
            if (this.$v.$invalid) {
              this.submitStatus = 'ERROR'
              return;
            } 
              this.addingWaiter = true;
              let self = this;
              var todayDate = new Date().toISOString().slice(0, 10);
              var today = new Date();
              var time = today.getHours() + ":" + today.getMinutes() + ":" + today.getSeconds();
              axios.post(`${process.env.VUE_APP_API_URL}/api/addUser`,{
                    id:null,
                    email:this.email,
                    password:this.pwd,
                    name:this.name,
                    surname:this.secondName,
                    salary:this.salary,
                    isAdmin:this.admin,
                    created_at:`${todayDate} ${time}`,
              }).then(res=>{  
                console.log(res);
                self.addingWaiter = false;
                self.$notify({
                  group: 'foo',
                  title: 'Info',
                  text: `User ${self.name} has been added succesfully!`,
                });
                this.getUsers();
              }).catch(err=>{
                console.log(err);
                self.addingWaiter = false;
              })
            }
        },
    }
</script>

<style lang="scss" scoped>
.rel{
  color:black;
}
$primary-dark-blue : #084C61;
$primary-yellow:#FFC857;
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.5s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
.styled-table {
    border-collapse: collapse;
    margin: 25px 0;
    font-size: 0.9em;
    font-family: sans-serif;
    min-width: 400px;
    box-shadow: 0 0 20px rgba(0, 0, 0, 0.15);
}

.styled-table thead tr {
    background-color: #009879;
    color: #ffffff;
    text-align: left;
}
.styled-table th,
.styled-table td {
    padding: 12px 15px;
}
.styled-table  tr {
    border-bottom: 1px solid #dddddd;
}

.styled-table  tr:nth-of-type(even) {
    background-color: #f3f3f3;
}

.styled-table  tr:last-of-type {
    border-bottom: 2px solid #009879;
}
.styled-table  tr.active-row {

}
.styled-table tr:hover{
    color: #009879;
}
.rel{
  position:relative;
}
.edit-waiter{
position: absolute;
left:50%;
top:50%;
transform: translate(-50%,-50%);
background: rgba(0, 0, 0, 0.85);
box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
border-radius: 10px;
border: 1px solid rgba( 255, 255, 255, 0.18 );
padding:35px;
z-index:11;
color:White;
}
@supports(-webkit-appearance: none) or (-moz-appearance: none) {
  input[type='checkbox'],
  input[type='radio'] {
    --active: #275EFE;
    --active-inner: #fff;
    --focus: 2px rgba(39, 94, 254, .3);
    --border: #BBC1E1;
    --border-hover: #275EFE;
    --background: #fff;
    --disabled: #F6F8FF;
    --disabled-inner: #E1E6F9;
    -webkit-appearance: none;
    -moz-appearance: none;
    height: 21px;
    outline: none;
    display: inline-block;
    vertical-align: top;
    position: relative;
    margin: 0;
    cursor: pointer;
    border: 1px solid var(--bc, var(--border));
    background: var(--b, var(--background));
    transition: background .3s, border-color .3s, box-shadow .2s;
    &:after {
      content: '';
      display: block;
      left: 0;
      top: 0;
      position: absolute;
      transition: transform var(--d-t, .3s) var(--d-t-e, ease), opacity var(--d-o, .2s);
    }
    &:checked {
      --b: var(--active);
      --bc: var(--active);
      --d-o: .3s;
      --d-t: .6s;
      --d-t-e: cubic-bezier(.2, .85, .32, 1.2);
    }
    &:disabled {
      --b: var(--disabled);
      cursor: not-allowed;
      opacity: .9;
      &:checked {
        --b: var(--disabled-inner);
        --bc: var(--border);
      }
      & + label {
        cursor: not-allowed;
      }
    }
    &:hover {
      &:not(:checked) {
        &:not(:disabled) {
          --bc: var(--border-hover);
        }
      }
    }
    &:focus {
      box-shadow: 0 0 0 var(--focus);
    }
    &:not(.switch) {
      width: 21px;
      &:after {
        opacity: var(--o, 0);
      }
      &:checked {
        --o: 1;
      }
    }
    & + label {
      font-size: 14px;
      line-height: 21px;
      display: inline-block;
      vertical-align: top;
      cursor: pointer;
      margin-left: 4px;
    }
  }
  input[type='checkbox'] {
    &:not(.switch) {
      border-radius: 7px;
      &:after {
        width: 5px;
        height: 9px;
        border: 2px solid var(--active-inner);
        border-top: 0;
        border-left: 0;
        left: 7px;
        top: 4px;
        transform: rotate(var(--r, 20deg));
      }
      &:checked {
        --r: 43deg;
      }
    }
    &.switch {
      width: 38px;
      border-radius: 11px;
      &:after {
        left: 2px;
        top: 2px;
        border-radius: 50%;
        width: 15px;
        height: 15px;
        background: var(--ab, var(--border));
        transform: translateX(var(--x, 0));
      }
      &:checked {
        --ab: var(--active-inner);
        --x: 17px;
      }
      &:disabled {
        &:not(:checked) {
          &:after {
            opacity: .6;
          }
        }
      }
    }
  }
  input[type='radio'] {
    border-radius: 50%;
    &:after {
      width: 19px;
      height: 19px;
      border-radius: 50%;
      background: var(--active-inner);
      opacity: 0;
      transform: scale(var(--s, .7));
    }
    &:checked {
      --s: .5;
    }
  }
}

// Demo

ul {
  margin: 12px;
  padding: 0;
  list-style: none;
  width: 100%;
  max-width: 320px;
  li {
    margin: 16px 0;
    position: relative;
  }
}

html {
  box-sizing: border-box;
}

* {
  box-sizing: inherit;
  &:before,
  &:after {
    box-sizing: inherit;
  }
}

// Center & dribbble
body {
  min-height: 100vh;
  font-family: 'Inter', Arial, sans-serif;
  color: #8A91B4;
  display: flex;
  justify-content: center;
  align-items: center;
  background: #F6F8FF;
  @media(max-width: 800px) {
    flex-direction: column;
  }
}
</style>