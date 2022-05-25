<template>
    <div class="rel">
      <Loading v-if="loadingData">Delivery data is being loaded....</Loading>
              <ManageOrder class="edit-waiter" :order="showOrder" v-if="showOrder" v-on:close-modal="closeModal" v-on:get-orders="getOrders"/>
        <h2>Delivery</h2>
          <b-tabs content-class="mt-3">
            <b-tab title="Not managed" active>
                <p>Not managed</p>
                <div v-if="ordersToMange.length>0" class="table-responsive">
                    <table  class="styled-table ">
                        <tr>
                            <td>#</td>
                            <td>Date</td>
                            <td>Time</td>
                            <td>City</td>
                            <td>Street</td>
                            <td>Email</td>
                            <td>Name</td>
                            <td>Items</td>
                            <td>Status</td>
                        </tr>
                        <tr v-for="(order,index) in ordersToMange" :key="index">
                            <td>{{order.id}}</td>
                            <td>{{ order.date }}</td>
                            <td>{{ order.time }}</td>
                            <td>{{ order.city }}</td>
                            <td>{{ order.street }} {{ order.number }}</td>
                            <td>{{ order.email }}</td>
                            <td>{{ order.name }}</td>
                            <td v-if="JSON.parse(order.items.length>0)">
                                <p v-for="(item,index) in JSON.parse(order.items)" :key="index">
                                    {{ item.name }} - {{ item.size }}
                                </p>
                            </td>
                            <td>{{ order.status }}</td>
                            <td>
                                <b-button variant="primary" class="mx-2" @click="manageOrder(order)">Manage</b-button>
                            </td>
                        </tr>
                    </table>
                </div>
                <div v-else>
                  There's no data
                </div>
            </b-tab>
            <b-tab title="Accepted">
                <p>Accepted</p>
                <div v-if="ordersAccpeted.length>0" class="table-responsive">
                    <table  class="styled-table ">
                        <tr>
                            <td>#</td>
                            <td>Date</td>
                            <td>Time</td>
                            <td>City</td>
                            <td>Street</td>
                            <td>Email</td>
                            <td>Name</td>
                            <td>Items</td>
                            <td>Status</td>
                            <td>Status info</td>
                            <td>Action</td>
                        </tr>
                        <tr v-for="(order,index) in ordersAccpeted" :key="index">
                            <td>{{order.id}}</td>
                            <td>{{ order.date }}</td>
                            <td>{{ order.time }}</td>
                            <td>{{ order.city }}</td>
                            <td>{{ order.street }} {{ order.number }}</td>
                            <td>{{ order.email }}</td>
                            <td>{{ order.name }}</td>
                            <td v-if="JSON.parse(order.items.length>0)">
                                <p v-for="(item,index) in JSON.parse(order.items)" :key="index">
                                    {{ item.name }} - {{ item.size }}
                                </p>
                            </td>
                            <td>{{ order.status }}</td>
                            <td>{{order.statusInfo}}</td>
                            <td>
                                <b-button variant="success" class="mx-2" @click="sendOrder(order)">Send Order <img class="icon" src="@/assets/delivery-man.png" alt=""> </b-button>
                            </td>
                        </tr>
                    </table>
                </div>
                <div v-else>
                  There's no data
                </div>
            </b-tab>
            <b-tab title="Rejected" >
              <p>Rejeceted</p>
                <div v-if="ordersRejected.length>0" class="table-responsive">
                    <table  class="styled-table ">
                        <tr>
                            <td>#</td>
                            <td>Date</td>
                            <td>Time</td>
                            <td>City</td>
                            <td>Street</td>
                            <td>Email</td>
                            <td>Name</td>
                            <td>Items</td>
                            <td>Status</td>
                            <td>Status Info</td>
                        </tr>
                        <tr v-for="(order,index) in ordersRejected" :key="index">
                            <td>{{order.id}}</td>
                            <td>{{ order.date }}</td>
                            <td>{{ order.time }}</td>
                            <td>{{ order.city }}</td>
                            <td>{{ order.street }} {{ order.number }}</td>
                            <td>{{ order.email }}</td>
                            <td>{{ order.name }}</td>
                            <td v-if="JSON.parse(order.items.length>0)">
                                <p v-for="(item,index) in JSON.parse(order.items)" :key="index">
                                    {{ item.name }} - {{ item.size }}
                                </p>
                            </td>
                            <td>{{ order.status }}</td>
                            <td>
                                {{ order.statusInfo }}
                            </td>
                        </tr>
                    </table>
                </div>
                <div v-else>
                  There's no data
                </div>
            </b-tab>
            <b-tab title="Finished">
                <p>Finished</p>
                <div v-if="ordersFinished.length>0" class="table-responsive">
                    <table  class="styled-table ">
                        <tr>
                            <td>#</td>
                            <td>Date</td>
                            <td>Time</td>
                            <td>City</td>
                            <td>Street</td>
                            <td>Email</td>
                            <td>Name</td>
                            <td>Items</td>
                            <td>Status</td>
                            <td>Status Info</td>
                        </tr>
                        <tr v-for="(order,index) in ordersFinished" :key="index">
                            <td>{{order.id}}</td>
                            <td>{{ order.date }}</td>
                            <td>{{ order.time }}</td>
                            <td>{{ order.city }}</td>
                            <td>{{ order.street }} {{ order.number }}</td>
                            <td>{{ order.email }}</td>
                            <td>{{ order.name }}</td>
                            <td v-if="JSON.parse(order.items.length>0)">
                                <p v-for="(item,index) in JSON.parse(order.items)" :key="index">
                                    {{ item.name }} - {{ item.size }}
                                </p>
                            </td>
                            <td>{{ order.status }}</td>
                            <td>
                                {{ order.statusInfo }}
                            </td>
                        </tr>
                    </table>
                </div>
                <div v-else>
                  There's no data
                </div>
            </b-tab>
        </b-tabs>

    </div>
</template>

<script>
import axios from 'axios'
import ManageOrder from '@/components/ManageOrder.vue';
import Loading from '@/components/Loading.vue';
    export default {
        components:{
            ManageOrder,
            Loading,
        },
        data() {
            return {
                ordersToMange:null,
                ordersAccpeted:null,
                ordersRejected:null,
                ordersFinished:null,
                showOrder:null,
                loadingData:false,
            }
        },
        mounted() {
            this.getOrders();
        },
        methods: {
            closeModal(){
                this.showOrder=null;
            },
            getOrders(){
              this.loadingData=true;
            axios.get(`${process.env.VUE_APP_API_URL}/api/ordersDelivery`).then(res=>{
              this.ordersToMange = res.data[0] ? res.data[0] : [];
              this.ordersAccpeted = res.data[1] ? res.data[1] : [];
              this.ordersRejected =  res.data[2] ? res.data[2] : [];
              this.ordersFinished =  res.data[3] ? res.data[3] : [];
              this.loadingData=false;
            }).catch(err=>{
              console.log(err);
              this.loadingData=false;
            })
            },
            manageOrder(order){
                this.showOrder=order;
                console.log(this.showOrder);
            },
            sendOrder(order){
              let data = order;
              data.action=3;
              let self = this;
              console.log(data);
                axios.post(`${process.env.VUE_APP_API_URL}/api/ordersDelivery/${order.id}?_method=PUT`,{
                action:3,
                email:order.email,
                info:data,
                }).then(res=>{
                console.log(res);
                this.getOrders();
                self.$notify({
                    group: 'foo',
                    title: 'Info',
                    text: `Order has been send succesfully!`,
                    });

                }).catch(err=>{
                console.log(err)
                })
            }
        },
    }
</script>

<style lang="scss"  scoped>
.rel{
  background-color: rgb(236, 236, 236);
  color:black;
}
$primary-dark-blue : #084C61;
$primary-yellow:#FFC857;
.icon{
  width:30px;
  height:30px;
}
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
width:40vw;
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