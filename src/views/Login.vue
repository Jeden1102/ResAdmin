<template>
<div class="container">
    <div class="img">
        <div class="content">
            <h1><span class="orange">Food</span><span>Penguin</span></h1>
            <p>Menagment system</p>
            
            <h2>Designed for individuals, with passion and heart.</h2>
            <h1>TUTAJ SLIDER Z FUNKCJONALNOŚCIAMI + SCREEN JAK TU https://dribbble.com/shots/17193380-Dashboard-Login-Page</h1>
        </div>
    </div>
    <div class="login-box">
        <h2>Login</h2>
    <b-form @submit.prevent="onSubmit"  >
      <b-form-group
        id="input-group-1"
        label="Email address:"
        label-for="input-1"
        description="We'll never share your email with anyone else."
      >
        <b-form-input
          id="input-1"
          v-model="email"
          type="email"
          placeholder="Enter email"
          required
        ></b-form-input>
        <div class="error" v-if="!$v.email.required && $v.email.$dirty">Field is required</div>
          <div class="error" v-if="!$v.email.minLength">Email must have at least {{$v.email.$params.minLength.min}} letters.</div>            
          <div class="error" v-if="!$v.email.email">It has to be an valid email</div>    
      </b-form-group>
          <b-form-group
        id="input-group-2"
        label="Password:"
        label-for="input-2"
      >
        <b-form-input
          id="input-1"
          v-model="password"
          type="password"
          placeholder="******"
          required
        ></b-form-input>
                  <div class="error" v-if="!$v.password.required && $v.password.$dirty">Field is required</div>
          <div class="error" v-if="!$v.password.minLength">Password must have at least {{$v.password.$params.minLength.min}} letters.</div>            
      </b-form-group>

      <b-button class="btn" type="submit" variant="primary">Login</b-button>
      <p class="typo__p" v-if="submitStatus === 'ERROR'">Please fill the form correctly.</p>
    </b-form>
    <b-alert show variant="danger" v-if="error">{{ errorMsg }}</b-alert>
    
    </div>
</div>
</template>

<script>
// import db from '../firebase/firebaseInit';
// import firebase from "firebase/app";
// import "firebase/auth";
import axios from 'axios';
import { required, minLength,email } from 'vuelidate/lib/validators'

    export default {
        components:{
        },
        data() {
            return {
                email:'',
                password:'',
                error:false,
                errorMsg:'',
                submitStatus:'',
            }
        },
        validations: {
          password: {
            required,
            minLength: minLength(6)
          },
          email: {
            required,
            minLength: minLength(3),
            email
          },
        },  
        methods: {
            onSubmit(){
            this.$v.$touch()
            if (this.$v.$invalid) {
              this.submitStatus = 'ERROR'
              return;
            } 
                let self = this;
                axios.post(`${process.env.VUE_APP_API_URL}/api/login`, {
                    email: this.email,
                    password:this.password
                })
                .then(function (response) {
                    console.log(response);
                    self.$router.push({name:"Home"});
                    localStorage.setItem('user',JSON.stringify(response.data.user[0]));
                    self.$store.dispatch("getCurrentUser");
                })
                .catch(function (error) {
                    console.log(error);
                });
            }
        },
    }
</script>

<style lang="scss" scoped>
.orange{
    color:#F28843;
}
.btn{
    margin-top:15px;
}
.container{
    display:flex;
    margin-top:50px;
    min-height: 70vh;
}
.img{
    background:url('../assets/login1.jpg');
    background-size: cover;
    background-position: center;
    flex:1;
    display:flex;
    justify-content: center;
    align-items: center;
    .content{
        background: rgba( 255, 255, 255, 0.25 );
        box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
        backdrop-filter: blur( 4px );
        -webkit-backdrop-filter: blur( 4px );
        border-radius: 10px;
        border: 1px solid rgba( 255, 255, 255, 0.18 );
        padding:15px;
        margin:0 30px;
        h1{
            text-align: center;
        }
        p{
            text-align: center;
        }
    }
}
.login-box{
    flex:1;
    padding:20px;
    display:flex;
    justify-content: center;
    flex-direction: column;
}
</style>