<template>
    <div>
         {{ orderedProducts }}
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
    export default {
        props:["id","categories","products"],
        components:{
        },
        data() {
            return{
                imgLink : "https://foodpenguinimages.s3.amazonaws.com/uploads",
                orderedProducts:null,
            }
        },

        methods: {
            getOrderedProducts(){
                this.orderedProducts = [];
                this.orderedProducts = JSON.parse(localStorage.getItem('orders')).filter(el=>el.id==this.id);
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