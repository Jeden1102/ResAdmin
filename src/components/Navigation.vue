<template>
    <div class="rel">
        <router-link v-if="navigationOpen" :to="{name:'Home'}"><img  class="logo" src="@/assets/logo.png" alt=""></router-link>
        <router-link v-else :to="{name:'Home'}"><img  class="logosmall" src="@/assets/logomale.png" alt=""></router-link>
        
        <!-- normal user -->
        <div class="items">
          <b-button @click="toggleWaiter" v-b-toggle.collapse-1 variant="primary" class="btn">
              <span v-if="navigationOpen">Waiter options</span>
              <span v-else>W</span>
                <p v-if="!waiterToggled" class="chevron-down">&#8249;</p> <p v-if="waiterToggled" class="chevron-up">&#8249;</p>
        </b-button>
            <b-collapse id="collapse-1" class="mt-2">
                <b-card class="links">
                    <p><router-link :class="[navigationOpen ? 'link' : 'link2']" :to="{name:'Home'}"><img class="icon" src="@/assets/home.png" alt=""> <span v-if="navigationOpen">Home</span>  </router-link></p>
                    <p><router-link :class="[navigationOpen ? 'link' : 'link2']" :to="{name:'WorkTime'}"><img class="icon" src="@/assets/back-in-time.png" alt=""> <span v-if="navigationOpen"> Work time</span></router-link></p>
                    <p><router-link :class="[navigationOpen ? 'link' : 'link2']" :to="{name:'Res'}"><img class="icon" src="@/assets/website.png" alt=""> <span v-if="navigationOpen">Restaurant</span></router-link></p>
                    <p><router-link :class="[navigationOpen ? 'link' : 'link2']" :to="{name:'Stats'}"><img class="icon" src="@/assets/stats.png" alt=""> <span v-if="navigationOpen">Statistics</span></router-link></p>
                    <p><router-link :class="[navigationOpen ? 'link' : 'link2']" :to="{name:'Delivery'}"><img class="icon" src="@/assets/delivery-man.png" alt=""> <span v-if="navigationOpen">Delivery</span></router-link></p>
                </b-card>
            </b-collapse>
        </div>
        <!-- admin -->
        <div class="items" v-if="this.$store.state.user.isAdmin">
          <b-button @click="toggleMenager" v-b-toggle.collapse-2 variant="primary" class="btn">
                <span v-if="navigationOpen">Menager options</span>
              <span v-else>M</span>
               <p v-show="!menagerToggled" class="chevron-down">&#8249;</p> <p v-show="menagerToggled" class="chevron-up">&#8249;</p>
        </b-button>
            <b-collapse id="collapse-2" class="mt-2">
                <b-card class="links">
                    <p><router-link :class="[navigationOpen ? 'link' : 'link2']" :to="{name:'Waiters'}"><img class="icon" src="@/assets/waiter.png" alt=""> <span v-if="navigationOpen">Waiters</span></router-link></p>
                    <p><router-link :class="[navigationOpen ? 'link' : 'link2']" :to="{name:'Menu'}"><img class="icon" src="@/assets/menu.png" alt=""> <span v-if="navigationOpen">Menu</span></router-link></p>
                    <!-- <p><router-link :class="[navOpen ? 'link' : 'link2']" to="#"><img class="icon" src="@/assets/pay.png" alt=""> <span v-if="navOpen">Pays</span></router-link></p> -->
                    <p><router-link :class="[navigationOpen ? 'link' : 'link2']" :to="{name:'View'}"><img class="icon" src="@/assets/view.png" alt=""> <span v-if="navigationOpen">Edit view</span></router-link></p>
                    <p><router-link :class="[navigationOpen ? 'link' : 'link2']" :to="{name:'SalesInfo'}"><img class="icon" src="@/assets/hand.png" alt=""> <span v-if="navigationOpen">Sales info</span></router-link></p>
                </b-card>
            </b-collapse>
        </div>
                <b-dropdown class="mx-auto">
        <template #button-content>
      <div class="avatar">
        <img v-if="profilePicture" :src="`${imgLink}/${profilePicture}`"  alt="">
        <img v-else src="@/assets/avata.png" alt="">
        
      </div>
        </template>
        <b-dropdown-item  ><router-link class="link" :to="{name:'Profile'}" ><img class="icon" src="@/assets/user.png" alt=""> Profile</router-link></b-dropdown-item>
        <b-dropdown-item  @click="signOut" ><img class="icon" src="@/assets/logout.png" alt=""> Logout</b-dropdown-item>
      </b-dropdown>
        <span class="hide-nav" @click="toggleNav">
            <span v-if="navigationOpen">&#8249;</span>
            <span v-else>&#8250;</span>
        </span>
    </div>
</template>

<script>

    export default {
        data() {
            return {
                waiterToggled : false,
                menagerToggled : false,
                profilePicture:this.$store.state.user.photo_url,
                imgLink : "https://foodpenguinimages.s3.amazonaws.com/uploads/avatars",
                navigationOpen:false,
            }
        },
        computed: {

        },
        mounted(){
            this.checkWidth();
        },
        methods: {
            toggleWaiter(){
                this.waiterToggled = !this.waiterToggled;
            },
            toggleMenager(){
                this.menagerToggled = !this.menagerToggled;
            },
            toggleNav(){
                this.navigationOpen = !this.navigationOpen
                this.$store.commit("changeNav");
                this.$emit('hide-nav')
                console.log("ok")
            },
            signOut(){
                this.$router.push({name:"Login"});
                localStorage.removeItem("user");
                this.$store.state.user = null;
            },
            checkWidth(){
            if(window.screen.availWidth<600){
                this.navigationOpen = false;
            }else{
                this.navigationOpen = this.$store.state.navOpen;
            }
            console.log(window.screen.width)
            }
        },
    }
</script>

<style lang="scss" scoped>
$primary-dark :#323031;
$primary-dark-blue : #084C61;
$primary-yellow:#FFC857;
$primary-dark :#323031;
$primary-dark-blue : #084C61;
$primary-yellow:#FFC857;
.mx-auto{
    margin:0 auto;
}
.icon{
  width:13px;
  height:13px;
}
.header-box{
  display:flex;
  justify-content: flex-start;
  padding:10px 35px;
  margin-top:30px;
  margin-bottom:50px;
  z-index:90;
  width:100px;
}
.link{
  color:black;
  text-decoration: none;
}
.avatar{
  width:35px;
  height:35px;
  display:grid;
  place-content: center;
  border-radius:50%;
  img{
    width:35px;
    height:35px;
    border-radius:50%;
  }
}
.rel{
    position:relative;
    transition: .3s;
}
.hide-nav{
    position:absolute;
    right:35px;
    bottom:15px;
    color:white;
    font-size:40px;
    cursor: pointer;
    &:hover{
        font-weight: bold;
    }
}
@media(max-width:600px){
    .hide-nav{
        display:none !important;
    }
}
.icon{
    width:25px;
    height:25px
}
.chevron-down{
    width:25px;
    height:25px;
    font-size:20px;
    transform: rotate(-90deg);
}
.chevron-up{
    width:25px;
    height:25px;
    font-size:20px;
    transform: rotate(90deg);
}
.logo{
    width:200px;
    height:90px;
    background: white;
}
.logosmall{
    width:100%;
    height:65px;
    background-color: #fff;
}
.btn{
    background:$primary-dark;
    font-weight: 600;
    display:flex;
    color:$primary-yellow;
    border:none;
    box-shadow:none;
    &:focus{
        background-color: $primary-yellow;
        color:black;
            border:none;
    box-shadow:none;
    }
    &:active{
        background-color: $primary-yellow;
        color:black;
            border:none;
    box-shadow:none;
    }
    &:hover{
    background-color: $primary-yellow;
    color:black;
    border:none;
    box-shadow:none;
    }
}
.items{
    padding:30px 10px;
}
.links{
    display:flex;
    gap:15px;
    flex-direction: column;
}
.link:hover{
    color:black;
}
.link{

}
.link2{
    display:flex;
    align-items: center;
    justify-content: center;
}
p{
    width:100%;
    height:100%;
    position:relative;
    &::after{
        width:0%;
        height:1px;
        background-color:$primary-yellow;
        content:'';
        position:absolute;
        left:0;
        bottom:-3px;
        transition: .3s;
    }
    &:hover{
        color:black;
        font-weight: 600;
    }
    &:hover::after{
        width:100%;
    }
}
</style>