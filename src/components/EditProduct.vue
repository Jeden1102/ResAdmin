<template>
    <div>
            <b-form @submit.prevent="editProduct" >
              <div class="flex">
                <b-form-group  label="Product Name:" >
                    <b-form-input
                    v-model="name"
                    placeholder="Pizza"
                    ></b-form-input>
                </b-form-group>
                <b-form-group  label="Category:">
                    <select v-model="category" class="form-select" aria-label="Default select example">
                        <option selected>Select category</option>
                        <option v-for="category in categories" :key="category.id" :value="category.id">{{category.name}}</option>
                    </select>
                </b-form-group>
              </div>

                <b-form-group class="my-2">
                    <div class="form-floating">
                    <textarea v-model="desc" class="form-control" placeholder="Leave a comment here" id="floatingTextarea2" style="height: 100px"></textarea>
                    <label for="floatingTextarea2">Description</label>
                    </div>
                </b-form-group>
                <div class="flex">
                <b-form-group label="Price:">
                    <div class="input-group mb-3">
                    <span class="input-group-text">$</span>
                    <input v-model="price" type="text" class="form-control" aria-label="Amount (to the nearest dollar)">
                    </div>
                </b-form-group>
                <b-form-group label="Discount:">
                    <div class="input-group mb-3">
                    <span class="input-group-text">%</span>
                    <input v-model="discount" type="text" class="form-control" aria-label="Amount (to the nearest dollar)">
                    </div>
                </b-form-group>
                </div>

                <b-form-group class="my-2 " label="Addons:">
                    <div class="flex">
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
                </b-form-group>

                <b-form-group label="Image cover:">
                <label for="file-in" class="file-label">
                    <h3>Add a photo</h3>
                    <img v-if="!url" :src="`${imgLink}/${product.image_url}`" alt="">
                    <img v-if="url" :src="url" alt="">
                </label>
                <input type="file" id="file-in" class="hidden"  @change="previewPhoto">        
                </b-form-group>
                <div class="my-2">
                <b-button type="submit" variant="primary" class="mx-2">Submit</b-button>
                <b-button type="button" variant="danger" @click="closeModal">Cancel</b-button>
                </div>
                <p class="typo__p" v-if="submitStatus === 'ERROR'">Please fill the form correctly.</p>
            </b-form>
    </div>
</template>

<script>
import axios from 'axios'
    export default {
        props:['product'],
        data() {
            return {
                                //form
                name:this.product.name,
                category:1,
                desc:this.product.desc,
                price:this.product.price,
                discount:this.product.discount,
                chicken:this.product.chicken,
                cheese:this.product.cheese,
                tomato:this.product.tomato,
                paprika:this.product.paprika,
                beef:this.product.beef,
                special:this.product.special,
                size:this.product.size,
                //end form

                submitStatus:'',
                categories:[],

                showEditProduct:null,
                sizes:["small","medium","larget","x-larger","200","300","500","other"],
                url:null,
                imgCover:null,
                imgLink : "https://foodpenguinimages.s3.amazonaws.com/uploads",
                imgChanged:false,
            }
        },
        mounted(){
            this.getCategories();
        },
        methods: {
        closeModal(){
            this.$emit('close-modal');
          },
        getCategories(){
        axios.get(`${process.env.VUE_APP_API_URL}/api/categories`).then(data=>{
            this.categories = data.data;
            console.log(this.categories)
        })
        },
            editProduct(event){
                let existingObj = this;
                const config = {
                    headers: {
                        'content-type': 'multipart/form-data'
                    }
                }
                let data = new FormData();
                if(this.imgChanged){
                  data.append('file', this.imgCover);
                }
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
                axios.post(`${process.env.VUE_APP_API_URL}/api/products/${this.product.id}?_method=PUT`, data, config)
                    .then(function (res) {
                      console.log(res);
                        existingObj.success = res.data.success;
                        event.target.reset()
                        existingObj.variants = [];
                          existingObj.$notify({
                          group: 'foo',
                          title: 'Info',
                          text: 'Product has been edited succesfully!',
                        });
                        existingObj.$emit('close-modal');
                        existingObj.$emit('get-products');
                    })
                    .catch(function (err) {
                        existingObj.output = err;
                    });
            },
                    previewPhoto(e){
                      const file = e.target.files[0];
                      console.log(file);
                      this.imgCover = file;
                    this.url = URL.createObjectURL(file);
                    this.imgChanged = true;
            }
        },

    }
</script>

<style lang="scss" scoped>
.hidden{
  display:none;
}
.flex{
    display:Flex;
    gap:15px;
}
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