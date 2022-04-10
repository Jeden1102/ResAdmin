<template>
    <div class="w-full">
        <h2>Contact Details:</h2>
        <p>Name : {{order.name}}</p>
        <p>Email : {{order.email}}</p>
        <p>Phone : {{order.phone}}</p>
        <hr/>
        <h2>Address:</h2>
        <p>City : {{order.city}}</p>
        <p>Street : {{order.street}}</p>
        <p>Number : {{order.number}}</p>
        <hr/>
        <h2>Time&date:</h2>
        <p>Date : {{order.date}}</p>
        <p>Time : {{order.time}}</p>
        <hr/>
        <h2>Ordered items:</h2>
        <div v-if="JSON.parse(order.items.length>0)">
            <p v-for="(item,index) in JSON.parse(order.items)" :key="index">
                {{ item.name }} - {{ item.size }}
            </p>
        </div>
        <hr/>
        <label for="">Decision info (if needed)
        </label>
    <b-form-textarea
      id="textarea"
      v-model="info"
      placeholder="Enter something..."
      rows="3"
      max-rows="6"
    ></b-form-textarea>
        <b-button @click="menageOrder(2)" class="my-2" variant="danger">Reject</b-button>
        <b-button @click="menageOrder(1)"  class="mx-2" variant="success">Accept</b-button>
        <b-button @click="closeModal" variant="primary">Close</b-button>
    </div>
</template>

<script>
import axios from 'axios'
    export default {
        props:["order"],
        data() {
            return {
                info:null,
            }
        },
        methods: {
            closeModal(){
                this.$emit('close-modal');
            },
            menageOrder(dec){
              this.order.action=dec;
              this.order.info = this.info;
              console.log(this.order);
                axios.post(`${process.env.VUE_APP_API_URL}/api/ordersDelivery/${this.order.id}?_method=PUT`,{
                action:dec,
                info:this.info,
                email:this.order.email,
                orderDetails:this.order,
                }).then(res=>{
                console.log(res);
                this.$emit('close-modal');
                this.$emit('get-orders');
                this.$notify({
                    group: 'foo',
                    title: 'Info',
                    text: `Order has been accepted succesfully!`,
                    });

                }).catch(err=>{
                console.log(err)
                })
            }
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