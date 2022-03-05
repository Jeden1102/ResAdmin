<template>
    <div class="rel">
        <Loading v-if="addingWaiter">Category is being added...</Loading>
      <Loading v-if="deletingWaiter">Category is being deleted...</Loading>
      <Loading v-if="editingWaiter">Category is being edited...</Loading>

            <Transition name="fade">
              <EditProduct  class="edit-waiter" :product="showEditProduct" v-if="showEditProduct" v-on:close-modal="closeModal" v-on:get-products="getProducts" v-on:edit-product-loading="editingProduct = !editingProduct" v-on:editing="editingWaiterMethod"/>
            </Transition>
    <h5>Products</h5>
        <b-card class="rel">
                <Loading v-if="addingProduct">Product is being added...</Loading>
      <Loading v-if="deletingProduct">Product is being deleted...</Loading>
      <Loading v-if="editingProduct">Product is being edited...</Loading>
        <h3>Products list</h3>
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
                <tr v-for="product in products" :key="product.id">
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
                        <b-button variant="primary" class="mx-2" @click="showEdit(product)">Edit</b-button> 
                        <b-button variant="danger" @click="deleteProduct(product.id)">Delete</b-button>
                    </td>
                </tr>
            </table>
        </b-card>
        <b-card>
            <h4>Add Procduct</h4>
             <b-form @submit.prevent="addProduct" >
                <b-form-group  label="Product Name:" >
                    <b-form-input
                    v-model="name"
                    placeholder="Pizza"
                    ></b-form-input>
                    <div class="error" v-if="!$v.name.required && $v.name.$dirty">Field is required</div>
                    <div class="error" v-if="!$v.name.minLength">Name must have at least {{$v.name.$params.minLength.min}} letters.</div>
                </b-form-group>
                <b-form-group  label="Category:">
                    <select v-model="category" class="form-select" aria-label="Default select example">
                        <option selected>Select category</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">{{category.name}}</option>
                    </select>
                    <div class="error" v-if="!$v.category.required && $v.category.$dirty">Field is required</div>
                </b-form-group>
                <b-form-group class="my-2">
                    <div class="form-floating">
                    <textarea v-model="desc" class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100px"></textarea>
                    <label for="floatingTextarea2">Description</label>
                    </div>
                </b-form-group>
                <b-form-group label="Price:">
                    <div class="input-group mb-3">
                    <span class="input-group-text">$</span>
                    <input v-model="price" type="text" class="form-control" aria-label="Amount (to the nearest dollar)">
                    </div>
                    <div class="error" v-if="!$v.price.required && $v.price.$dirty">Field is required</div>
                    <div class="error" v-if="!$v.price.minLength">Price must have at least {{$v.price.$params.minLength.min}} digit.</div>
                </b-form-group>
                <b-form-group label="Discount:">
                    <div class="input-group mb-3">
                    <span class="input-group-text">%</span>
                    <input v-model="discount" type="text" class="form-control" aria-label="Amount (to the nearest dollar)">
                    </div>
                </b-form-group>
                <b-form-group class="my-2 flex-my" label="Addons:">
                    <div class="my-2">
                    <input v-model="chicken" id="s1"  type="checkbox" class="switch">
                    <label for="s1">Chicken</label>                        
                    </div>
                    <div class="my-2">
                    <input v-model="cheese" id="s2"   type="checkbox" class="switch">
                    <label for="s2">Cheese</label>                        
                    </div>
                    <div class="my-2">
                    <input v-model="tomato"  id="s3"  type="checkbox" class="switch">
                    <label for="s3">Tomato</label>                        
                    </div>
                    <div class="my-2">
                    <input v-model="beef" id="s4"  type="checkbox" class="switch">
                    <label for="s4">Beef</label>                        
                    </div>
                    <div class="my-2">
                    <input v-model="paprika" id="s5"  type="checkbox" class="switch">
                    <label for="s5">Paprika</label>                        
                    </div>
                </b-form-group>
                <b-form-group label="Special:">
                    <div class="my-2">
                    <input v-model="special" id="s6"  type="checkbox" class="switch">
                    <label for="s6">Special</label>                        
                    </div>
                </b-form-group>
                <b-form-group label="Size:">
                    <select v-model="size" class="form-select" aria-label="Default select example">
                        <option selected>Select size</option>
                        <option v-for="size in sizes" :key="size" :value="size">{{size}}</option>
                    </select>
                    <div class="error" v-if="!$v.size.required && $v.size.$dirty">Field is required</div>

                </b-form-group>
                <b-card class="my-2">
                <b-form-group label="Variants:">
                  <input type="checkbox" id="var" v-model="showAddVariants">
                  <label for="var">Add Variants</label><br>
                  <div v-if="showAddVariants">
                    <label for="">Variant price:</label>
                    <div class="input-group mb-3">
                      <span class="input-group-text">$</span>
                      <input v-model="priceVariant" type="text" class="form-control" aria-label="Amount (to the nearest dollar)">
                    </div>
                    <label for="">Variant size:</label>
                      <select v-model="sizeVariant" class="form-select" aria-label="Default select example">
                          <option selected>Select size</option>
                          <option v-for="size in sizes" :key="size" :value="size">{{size}}</option>
                      </select>    
                         
                  <b-button @click="addVariant"  variant="primary" class="my-2">Add Variant</b-button>
                  <p v-for="(variant,index) in variants" :key="index">Size :{{variant.size}}, Price :  {{variant.price}}$ <b-button size="sm" @click="removeVariant(index)" variant="danger">Remove</b-button></p>
                  </div>

                </b-form-group>
                </b-card>

                <b-form-group label="Image cover:">
                <label for="file-in" class="file-label">
                    <h3>Add a photo</h3>
                    <img v-if="!url" src="@/assets/upload.png" alt="">
                    <img v-if="url" :src="url" alt="">
                </label>
                <input type="file" id="file-in" class="hidden"  @change="previewPhoto">        
                </b-form-group>
                <div class="my-2">
                <b-button type="submit" variant="primary" class="mx-2">Submit</b-button>
                <b-button type="reset" variant="danger">Reset</b-button>
                </div>
                <p class="typo__p" v-if="submitStatus === 'ERROR'">Please fill the form correctly.</p>
            </b-form>
        </b-card>
    </div>
</template>

<script>
import { required, minLength } from 'vuelidate/lib/validators'
import axios from 'axios';
import Loading from '@/components/Loading.vue';
import EditProduct from '@/components/EditProduct.vue';
    export default {
        data() {
            return {
                //form
                name:'',
                category:'',
                desc:'',
                price:'',
                discount:'',
                chicken:false,
                cheese:false,
                tomato:false,
                paprika:false,
                beef:false,
                special:false,
                size:'',
                //end form
                //variants
                showAddVariants:false,
                priceVariant:'',
                sizeVariant:'',
                variants:[],
                //end variant
                submitStatus:'',
                products:[],
                categories:[],
                deletingWaiter:false,
                addingWaiter:false,
                editingWaiter:false,
                deletingProduct:false,
                addingProduct:false,
                editingProduct:false,
                showEditProduct:null,
                sizes:["small","medium","larget","x-larger","200","300","500","other"],
                url:null,
                imgCover:null,
                imgLink : "https://foodpenguinimages.s3.amazonaws.com/uploads",
            }
        },
        components:{
            Loading,
            EditProduct
        },
        validations: {
          name: {
            required,
            minLength: minLength(3)
          },
          category: {
            required,
          },
          price: {
            required,
            minLength: minLength(1)
          },
          size: {
            required,
          },
        },
        mounted() {
            this.getCategories();
            this.getProducts();
        },          
        methods: {
          addVariant(){
            const obj = {price:this.priceVariant,size:this.sizeVariant};
            this.variants.push(obj);
          },
          removeVariant(index){
            this.variants.splice(index,1);
          },
          getProducts(){
            axios.get(`${process.env.VUE_APP_API_URL}/api/products`).then(data=>{
              this.products = data.data;
              console.log(this.products)
            })
          },
          deleteProduct(id){
            this.deletingProduct=true;
            let self = this;
            axios.delete(`${process.env.VUE_APP_API_URL}/api/products/${id}`).then(res=>{
              console.log(res);
            this.deletingProduct=false;
              self.getProducts();
              self.$notify({
              group: 'foo',
              title: 'Info',
              text: 'Product has been deleted succesfully!',
            });              
            })
          },
        showEdit(user){
            this.showEditProduct = user;
          },
          closeModal(){
            this.showEditProduct=null;
          },
          editingWaiterMethod(){
            this.editingWaiter = !this.editingWaiter;
          },
            addProduct(event){
                this.$v.$touch()
                if (this.$v.$invalid) {
                this.submitStatus = 'ERROR'
                return;
                } 
                this.addingProduct=true;
                let existingObj = this;
                const config = {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                }
                let data = new FormData();
                data.append('file', this.imgCover);
                data.append('name', this.name);
                data.append('desc', this.desc);
                data.append('price', this.price);
                data.append('discount', this.discount);
                data.append('category_id', this.category);
                data.append('chicken', this.chicken);
                data.append('cheese', this.cheese);
                data.append('size', this.size);
                data.append('tomato', this.tomato);
                data.append('paprika', this.paprika);
                data.append('beef', this.beef);
                data.append('special', this.special);
                if(this.variants.length>0){
                data.append('variants', JSON.stringify(this.variants));
                }
                axios.post(`${process.env.VUE_APP_API_URL}/api/addProduct`, data, config)
                    .then(function (res) {
                      console.log(res);
                        existingObj.success = res.data.success;
                        event.target.reset()
                          existingObj.$notify({
                          group: 'foo',
                          title: 'Info',
                          text: 'Product has been added succesfully!',
                        });
                        existingObj.getProducts();
                        existingObj.addingProduct=false;
                    })
                    .catch(function (err) {
                        existingObj.output = err;
                    });
            },
            getCategories(){
            axios.get(`${process.env.VUE_APP_API_URL}/api/categories`).then(data=>{
                this.categories = data.data;
                console.log(this.categories)
            })
            },
            deleteCategory(id){
              this.deletingWaiter = true;
              let self = this;
              axios.delete(`${process.env.VUE_APP_API_URL}/api/categories/${id}`).then(res=>{
                console.log(res);
                self.deletingWaiter = false;
            self.$notify({
              group: 'foo',
              title: 'Info',
              text: 'Category has been deleted succesfully!',
            });
              this.getCategories();
              })
            },
            previewPhoto(e){
                      const file = e.target.files[0];
                      this.imgCover = file;
                    this.url = URL.createObjectURL(file);
            }
        },
    }
</script>

<style lang="scss" scoped>
.small-img{
  width:100px;
  height:100px;
}
.file-label{
    width:100%;
    height:200px;
    border:1px dashed blue;
    display:flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
    img{
        width:70px;
        max-height:150px;
    }
}
.hidden{
    display:none;
}
.flex-my{
    display: flex;
    flex-direction: column;
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
.rel{
    position: relative;
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
.edit-waiter{
position: sticky;
left:40%;
top:0%;
transform: translateX(0%);
background: rgba(0, 0, 0, 0.85);
box-shadow: 0 8px 32px 0 rgba( 31, 38, 135, 0.37 );
border-radius: 10px;
border: 1px solid rgba( 255, 255, 255, 0.18 );
padding:15px;
z-index:11;
color:White;
max-height:90vh;
}
</style>