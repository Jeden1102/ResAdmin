<template>
    <div>
        <h2>Edit Waiter <img src="@/assets/view.png" alt=""></h2>
       
                     <b-form @submit.prevent="onSubmit" >

      <b-form-group  label="E-mail:" >
        <b-form-input
          v-model="email"
          placeholder="johndoe@gmail.com"
          required
        ></b-form-input>
          <div class="error" v-if="!$v.email.required && $v.email.$dirty">Field is required</div>
          <div class="error" v-if="!$v.email.minLength">Email must have at least {{$v.email.$params.minLength.min}} letters.</div>            
          <div class="error" v-if="!$v.email.email">It has to be an valid email</div>               
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
          <div class="error" v-if="!$v.name.required && $v.name.$dirty">Field is required</div>
          <div class="error" v-if="!$v.name.minLength">Name must have at least {{$v.name.$params.minLength.min}} letters.</div>        
      </b-form-group>
      <b-form-group  label="Waiter Second Name:" >
        <b-form-input
          v-model="secondName"
          placeholder="Enter name"
          required
        ></b-form-input>
          <div class="error" v-if="!$v.secondName.required && $v.secondName.$dirty">Field is required</div>
          <div class="error" v-if="!$v.secondName.minLength">Surname must have at least {{$v.secondName.$params.minLength.min}} letters.</div>        
      </b-form-group>
      <b-form-group  label="Waiter Salary" >
            <b-input-group prepend="$" class="mb-2 mr-sm-2 mb-sm-0">
            <b-form-input v-model="salary"  placeholder="25"></b-form-input>
            </b-input-group>

      </b-form-group>

      <b-form-group class="my-2">
        <input v-model="admin" id="s1" type="checkbox" class="switch">
        <label for="s1">Menagment options</label>
      </b-form-group>


      <b-button type="submit" variant="primary">Save changes</b-button>
      <b-button type="reset" class="mx-2" variant="warning" @click="closeModal">Cancel</b-button>
      <p class="typo__p" v-if="submitStatus === 'ERROR'">Please fill the form correctly.</p>

            </b-form>
    </div>
</template>

<script>
import axios from 'axios';
import { required, minLength,email } from 'vuelidate/lib/validators'

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
                    submitStatus:'',
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
          email: {
            required,
            minLength: minLength(3),
            email
          },
        },  
        methods: {
          closeModal(){
            this.$emit('close-modal');
          },
          onSubmit(){
            //validation
            let self = this;
            this.$v.$touch()
            if (this.$v.$invalid) {
              this.submitStatus = 'ERROR'
              return;
            } 
            this.$emit('editing');
            axios.post(`${process.env.VUE_APP_API_URL}/api/users/${this.user.id}?_method=PUT`,{
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
            self.$notify({
                  group: 'foo',
                  title: 'Info',
                  text: `User ${self.name} has been edited succesfully!`,
                });

            }).catch(err=>{
              console.log(err)
            })
          },

        },
    }
</script>

<style lang="scss" scoped>
img{
  height:50px;
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