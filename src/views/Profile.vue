<template>
    <div>
          <b-card no-body class="rel">
              <Loading v-if="profileChanging">Changing proflile details...</Loading>
              <Loading v-if="pwdChanging">Changing password ...</Loading>
            <b-tabs pills card vertical>
            <b-tab active>
                <template #title>
                    Profile <img class="icon" src="@/assets/resume.png" alt="">
                </template>
                <b-card-text>
                    <div class="heading">
                        <div class="content">
                        <img v-if="profilePicture" :src="`${imgLink}/${profilePicture}`"  alt="">
                                <img v-else src="@/assets/avata.png" alt="">
                        <div class="flex-col">
                            <h2>{{name}} {{surname}}</h2>
                            <p>Update your photo and personal details.</p>
                        </div>
                        </div>

                    </div>
                        <b-form @submit.prevent="editProfile">
                            <div class="flex">
                            <b-form-group
                                label="Name:"
                            >
                                <b-form-input
                                v-model="name"
                                type="text"
                                placeholder="John"
                                required
                                ></b-form-input>
                            </b-form-group>
                            <b-form-group
                                label="Surname:"
                                class="mx-2"
                            >
                                <b-form-input
                                v-model="surname"
                                type="text"
                                placeholder="Doe"
                                required
                                ></b-form-input>
                            </b-form-group>
                            </div>
                            <b-form-group
                                label="Email:"
                            >
                                <b-form-input
                                v-model="email"
                                type="text"
                                placeholder="Doe"
                                required
                                ></b-form-input>
                            </b-form-group>

                <b-form-group label="Profile image:">
                <label for="file-in" class="file-label">
                    <h3>Change profile image</h3>
                    <img v-if="!url" src="@/assets/upload.png" alt="">
                    <img v-if="url" :src="url" alt="">
                </label>
                <input type="file" id="file-in" class="hidden"   @change="previewPhoto">        
                </b-form-group>

                            <b-button type="submit" variant="primary">Edit</b-button>
                        </b-form>
                </b-card-text>
            </b-tab>
            <b-tab >
                <template #title>
                    Password <img class="icon" src="@/assets/password.png" alt="">
                </template>
                <b-card-text>
                    <div class="flex-img">
                   <img src="@/assets/pwd-icon.png" alt="">
                    </div>
                    <b-form @submit.prevent="changePassword">
                        <b-form-group
                            label="Old password:"
                        >
                            <b-form-input
                            v-model="oldPwd"
                            type="password"
                            placeholder="*******"
                            required
                            ></b-form-input>
                        </b-form-group>
                        <b-form-group
                            label="New password:"
                        >
                            <b-form-input
                            v-model="newPwd"
                            type="password"
                            placeholder="*******"
                            required
                            ></b-form-input>
                        </b-form-group>
                        <b-form-group
                            label="Retype new password:"
                        >
                            <b-form-input
                            v-model="newPwdRepeat"
                            type="password"
                            placeholder="*******"
                            required
                            ></b-form-input>
                        </b-form-group>
                        <b-button type="submit" class="my-2" variant="primary">Set </b-button>
                    </b-form>
                    
                </b-card-text>
            </b-tab>

            </b-tabs>
        </b-card>
    </div>
</template>

<script>
import axios from 'axios'
import Loading from '@/components/Loading.vue';
    export default {
  name: "Profile",

        data() {
            return {
                user:null,
                name:'',
                surname:'',
                email:'',
                url:null,
                profilePicture:null,
                imgCover:null,
                imgLink : "https://foodpenguinimages.s3.amazonaws.com/uploads/avatars",
                imgChanged:false,
                oldPwd:'',
                newPwd:'',
                newPwdRepeat:'',
                profileChanging:false,
                pwdChanging:false,
            }
        },
        components:{
            Loading,
        },
        beforeMount() {
            this.user = this.$store.state.user;
            this.getFreshData();
        },
        methods: {
            getFreshData(){
                let userData = JSON.parse(localStorage.getItem('user'));
                this.name=userData.name
                this.surname=userData.surname
                this.email = userData.email
                this.profilePicture = userData.photo_url
            },
              previewPhoto(e){
                const file = e.target.files[0];
                console.log(file);
                this.imgCover = file;
                this.url = URL.createObjectURL(file);
                this.imgChanged = true;
            },
            editProfile(){
                this.profileChanging = true;
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
                data.append('surname', this.surname);
                data.append('email', this.email);
                axios.post(`${process.env.VUE_APP_API_URL}/api/profile/${this.$store.state.user.id}?_method=PUT`, data, config)
                    .then(function (res) {
                      console.log(res);
                      existingObj.profilePicture = res.data[0].photo_url
                        existingObj.success = res.data.success;
                          existingObj.$notify({
                          group: 'foo',
                          title: 'Info',
                          text: 'Personail details has been edited succesfully!',
                        });
                        existingObj.profileChanging = false;
                    localStorage.setItem('user',JSON.stringify(res.data[0]));
                    self.$store.dispatch("getCurrentUser")
                    })
                    .catch(function (err) {
                        existingObj.output = err;
                    });
            },
            changePassword(){
                this.pwdChanging = true;
                axios.post(`${process.env.VUE_APP_API_URL}/api/changePassword/${this.$store.state.user.id}?_method=PUT`,{
                    oldPwd:this.oldPwd,
                    newPwd:this.newPwd,
                    newPwdRepeat:this.newPwdRepeat,
                }).then(res=>{
                    console.log(res)
                         this.$notify({
                          group: 'foo',
                          title: 'Info',
                          text: 'Password has been edited succesfully!',
                        });
                        this.pwdChanging = false;
                }).catch(err=>{
                        this.$notify({
                          group: 'foo',
                          title: 'Info',
                          text: `${err.response.data.info}!`,
                        });
                        this.pwdChanging = false;
                })
            }
        },

    }
</script>

<style lang="scss" scoped>
.pwd-img{
    width:300px;
    height:300px;
}
.icon{
    width:25px;
}
.heading{
    .content{
    display:flex;
    align-items: center;
    gap:20px;
    background-color: rgba(0,0,0,.4);
    border-top:1px dashed white;
    border-bottom:1px dashed white;
    padding:15px;
    width:100%;
    color:white;
    }
    display:flex;
    align-items: center;
    background: url('../assets/bg-heading2.jpg');
    background-position: center;
    background-size: cover;
    height: 250px;
    img{
        width:150px;
        height:150px;
        border:2px solid white;
        border-radius:50%;
    }
    margin:10px 0;
}
.flex{
    display:flex;
}
.small-img{
  width:100px;
  height:100px;
}
.file-label{
    width:100%;
    height:200px;
    border:1px dashed black;
    margin:10px 0;
    border-radius: 5px;
    display:flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
    cursor: pointer;
    &:hover{
    background-color: rgba(0, 0, 0,.1)

    }
    img{
        width:150px;
        height: 150px;
        border-radius:50%;
    }
}
.hidden{
    display:none;
}
.flex-img{
    width:100%;
    display:flex;
    justify-content: center;
}
</style>