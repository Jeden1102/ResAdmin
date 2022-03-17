<template>
    <div class="rel">
        <Loading v-if="addingWaiter">Category is being added...</Loading>
      <Loading v-if="deletingWaiter">Category is being deleted...</Loading>
      <Loading v-if="editingWaiter">Category is being edited...</Loading>
            <Transition name="fade">
              <EditCategory class="edit-waiter" :user="showEditUser" v-if="showEditUser" v-on:close-modal="closeModal" v-on:get-users="getCategories" v-on:editing="editingWaiterMethod"/>
            </Transition>
    <h5>Categories</h5>
        <b-card>
        <h3>Categories list</h3>
        <div class="table-responsive">
            <table class="styled-table">
                <tr>
                    <td>#</td>
                    <td>Name</td>
                    <td>Actions</td>
                </tr>
                <tr v-for="category in categories" :key="category.id">
                    <td>{{category.id}}</td>
                    <td>{{ category.name }}</td>
                    <td>
                        <b-button variant="primary" class="mx-2" @click="showEdit(category)">Edit</b-button> 
                        <b-button variant="danger" @click="deleteCategory(category.id)">Delete</b-button>
                    </td>
                </tr>
            </table>
        </div>

        </b-card>
        <b-card>
            <h4>Add Category</h4>
             <b-form @submit.prevent="addCategory" >
                <b-form-group  label="Category Name:" >
                    <b-form-input
                    v-model="categoryName"
                    placeholder="Pizza"
                    ></b-form-input>
                    <div class="error" v-if="!$v.categoryName.required && $v.categoryName.$dirty">Field is required</div>
                    <div class="error" v-if="!$v.categoryName.minLength">Categroy name must have at least {{$v.categoryName.$params.minLength.min}} letters.</div>
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
import EditCategory from '@/components/EditCategory.vue';
    export default {
        data() {
            return {
                categoryName:'',
                submitStatus:'',
                categories:[],
                deletingWaiter:false,
                addingWaiter:false,
                editingWaiter:false,
                showEditUser:null,

            }
        },
        components:{
            Loading,
            EditCategory
        },
        validations: {
          categoryName: {
            required,
            minLength: minLength(3)
          },
        },
        mounted() {
            this.getCategories();
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
            addCategory(){
                let self = this;
            if (this.$v.categoryName.$invalid) {
              this.submitStatus = 'ERROR'
              return;
            }
            this.addingWaiter = true;
            axios.post(`${process.env.VUE_APP_API_URL}/api/categories`,{
              name:this.categoryName  
            }).then(res=>{
                console.log(res);
                this.getCategories();
                this.categoryName = '';
                this.addingWaiter = false;
                                self.$notify({
                    group: 'foo',
                    title: 'Info',
                    text: `Category ${self.name} has been added succesfully!`,
                    });
            }) 
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
        },
    }
</script>

<style lang="scss" scoped>
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
</style>