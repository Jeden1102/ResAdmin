<template>
    <div class="container">
        <b-dropdown>
        <template #button-content>
      <div class="avatar">
        <img src="@/assets/avata.png" alt="">
      </div>
        </template>
        <b-dropdown-item ><router-link class="link" :to="{name:'Profile'}" ><img class="icon" src="@/assets/user.png" alt=""> Profile</router-link></b-dropdown-item>
        <b-dropdown-item @click="signOut" ><img class="icon" src="@/assets/logout.png" alt=""> Logout</b-dropdown-item>
      </b-dropdown>
    </div>
</template>

<script>
// import firebase from "firebase/app";
// import "firebase/auth";
    export default {
        methods: {
        signOut(){
            this.$router.push({name:"Login"});
            localStorage.removeItem("user");
            this.$store.state.user = null;
        }
        },
    }
</script>

<style lang="scss" scoped>
$primary-dark :#323031;
$primary-dark-blue : #084C61;
$primary-yellow:#FFC857;
.icon{
  width:13px;
  height:13px;
}
.container{
  display:flex;
  justify-content: flex-end;
  padding:10px 35px;
  margin-top:30px;
  margin-bottom:50px;
  z-index:10;
}
.link{
  color:black;
  text-decoration: none;
}
.avatar{
  width:35px;
  height:35px;
  background: $primary-dark-blue;
  display:grid;
  place-content: center;
  border-radius:50%;
  img{
    width:25px;
    height:25px
  }
}
</style>