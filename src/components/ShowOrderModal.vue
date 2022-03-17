<template>
    <div>
         
          <b-button variant="primary" v-b-toggle.collapse-25 class="m-1">Show Order</b-button>
           <b-collapse id="collapse-25" class="my-2" >
                <b-card class="text-black">
                    <div v-if="orderedProducts">
                        <div class="table-responsive">
                      <table class="styled-table" >
                                <tr>
                                    <td>#</td>
                                    <td>Name</td>
                                    <td>size</td>
                                    <td>price</td>
                                    <td>Actions</td>
                                </tr>
                                <tr v-for="(product,index) in orderedProducts[0].items" :key="index" >
                                    <td>{{product.id}}</td>
                                    <td>{{ product.name }}</td>
                                    <td>{{ product.name }}</td>
                                    <td>{{ product.price }}</td>
                                    <td>
                                        <b-button variant="danger" @click="deleteItem(index)">Delete</b-button>
                                    </td>
                                </tr>
                            </table>
                        </div>
  
                            <h3>Sum price : {{sumPrice}}$</h3>
                            <b-form-group class="my-2">
                                    <div class="form-floating">
                                    <textarea v-model="notes" class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100px"></textarea>
                                    <label for="floatingTextarea2">Notes</label>
                                    </div>
                                </b-form-group>
                                    <b-input-group  prepend="$" class="mb-2 mr-sm-2 mb-sm-0 my-2">
                                    <b-form-input v-model="tip" id="inline-form-input-username" placeholder="Tip"></b-form-input>
                                    </b-input-group>
                              <b-button variant="primary" class="my-2" v-b-modal.modal-1>Checkout</b-button>

                            <b-modal ref="modal-1" hide-footer id="modal-1" title="BootstrapVue">
                                <p class="my-4">Are you sure your want to checkout this table ? After that you cant change any details about it's order!</p>
                                <b-button variant="outline-success" @click="checkout">Checkout</b-button>
                                <b-button class="mx-2" variant="outline-danger" @click="hideModal">Cancel</b-button>
                            </b-modal>
                    </div>

                        <p v-else>There's nothing to see here, add a product first.</p>
                </b-card>
           </b-collapse>
          <b-card no-body>
            <b-tabs card>
                
            <b-tab v-for="category in categories" :key="category.id" :title="category.name" active>
                <b-card-text class="text-black">
                        <table class="styled-table">
                            <tr>
                                <td>#</td>
                                <td>Name</td>
                                <td>size</td>
                                <td>price</td>
                                <td>image</td>
                                <td>discount</td>
                                <td>Actions</td>
                            </tr>
                            <tr v-for="product in products[category.id]" :key="product.id" >
                                <td>{{product.id}}</td>
                                <td>{{ product.name }}</td>
                                <td>{{ product.size }}</td>
                                <td>{{ product.price }}</td>
                                <td>
                                <img class="small-img" v-if="product.image_url != 'x'" :src="`${imgLink}/${product.image_url}`" alt="">
                                <img class="small-img" v-else src="@/assets/no-pictures.png" alt="">
                                </td>
                                <td>{{ product.discount }}</td>
                                <td>
                                    <b-button variant="success" class="mx-2" @click="addProduct(product)">Add</b-button> 
                                </td>
                            </tr>
                        </table>
                </b-card-text>
            </b-tab>
            </b-tabs>
        </b-card>
        <b-button @click="cancel">Cancel</b-button>
    </div>
</template>

<script>
import axios from 'axios';
    export default {
        props:["id","categories","products"],
        components:{
        },
        data() {
            return{
                imgLink : "https://foodpenguinimages.s3.amazonaws.com/uploads",
                orderedProducts:null,
                notes:'',
                tip:0
            }
        },
        computed:{
            sumPrice(){
                return this.orderedProducts[0].items.reduce((a, b) => Number(a) + (Number(b.price)|| 0), 0);
            }
        },
        methods: {
            hideModal(){
                this.$refs['modal-1'].hide()
            },
            checkout(){
                //wysyłka do bazy + usunięcie z local storage
                console.log(this.$store.state.user.id);
                axios.post(`${process.env.VUE_APP_API_URL}/api/orders`,{
                    sum_price:this.sumPrice,
                    notes:this.notes,
                    waiter_id:this.$store.state.user.id,
                    table_id:this.id,
                    tip:this.tip,
                    products:JSON.stringify(this.orderedProducts[0].items)
                }).then(res=>{
                    console.log(res)
                    this.$refs['modal-1'].hide()
                    let products = JSON.parse(localStorage.getItem("orders"));
                    products = products.filter(el=>el.id != this.id);
                    localStorage.setItem("orders",JSON.stringify(products));
                    this.getOrderedProducts();        
                    this.$notify({
                    group: 'foo',
                    title: 'Info',
                    text: 'Order has been set succesfully!',
                    });            
                    this.releaseTable();
                }).catch(err=>{
                    console.log(err)
                })
            },
            releaseTable(){
                axios.post(`${process.env.VUE_APP_API_URL}/api/stoliki/${this.id}?_method=PUT`,{
                release:true,
                }).then(res=>{
                console.log(res);
                console.log("jajca");
                this.$emit('get-stoliki');
                this.cancel();
                this.$notify({
                    group: 'foo',
                    title: 'Info',
                    text: `Table has been released!`,
                    });

                }).catch(err=>{
                console.log(err)
                })     
            },
            getOrderedProducts(){
                this.orderedProducts = [];
                this.orderedProducts = JSON.parse(localStorage.getItem('orders'))
                if(this.orderedProducts){
                    this.orderedProducts = this.orderedProducts.filter(el=>el.id==this.id);
                }
            },
            addProduct(product){
                if(localStorage.getItem("orders")){
                    let products = JSON.parse(localStorage.getItem("orders"));
                    let x = products.filter(el=>el.id == this.id);
                    if(x.length>0){
                        console.log("stół już obsługiwany")
                        x[0].items.push(product);
                        localStorage.removeItem("orders");
                        localStorage.setItem("orders",JSON.stringify(products));
                    }else{
                        products.push({id:this.id,items:[product]});
                        localStorage.removeItem("orders");
                        localStorage.setItem("orders",JSON.stringify(products));
                    }
                }else{
                   localStorage.setItem("orders",JSON.stringify([{id:this.id,items:[product]}]));
                }
                this.getOrderedProducts();
            },
            cancel(){
                this.$emit('cancel');
            },
            deleteItem(idx){
                if(localStorage.getItem("orders")){
                    let products = JSON.parse(localStorage.getItem("orders"));
                    let x = products.filter(el=>el.id == this.id);
                    if(x.length>0){
                        console.log("stół już obsługiwany")
                        x[0].items.splice(idx,1);
                        localStorage.removeItem("orders");
                        localStorage.setItem("orders",JSON.stringify(products));
                    }
                }
                this.getOrderedProducts();
            }            
        },
    mounted() {
            this.getOrderedProducts();
    },
    }
</script>

<style lang="scss" scoped>
.small-img{
  width:100px;
  height:100px;
}
.text-black{
    color:black;
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
</style>