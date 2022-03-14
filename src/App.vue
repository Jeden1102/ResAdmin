<template>
  <div class="app-wrapper">
    <Navigation v-if="navigation" :class="[navOpen ? 'navi' : 'navi-small']"/>
    <div class="app">
      <Header v-if="navigation"/>
      <router-view class="container" />
      <notifications position="bottom right" width="500" group="foo" />
      
    </div>
  </div>
</template>

<script>
import Navigation from '@/components/Navigation.vue';
import Header from '@/components/Header.vue';
import { mapState } from 'vuex';
// import firebase from "firebase/app";
// import "firebase/auth";
export default {
  name: "app",
  components: {
    Navigation,
    Header
  },
  data() {
    return {
      navigation:true,
    };
  },
    computed: {
  ...mapState([
      'navOpen',
  ])
  },
  created() {},
  mounted() {
    this.checkRoute();
        this.$store.dispatch("getCurrentUser");
  },
  methods: {
    checkRoute(){
      let name = this.$route.name
      if(name === "Login"){
        this.navigation = false;
        return;
      }
      this.navigation = true;
    }
  },
  watch: {
    $route(){
      this.checkRoute();
    }
  },
};
</script>

<style lang="scss">
@import url("https://fonts.googleapis.com/css2?family=Quicksand:wght@300;400;500;600;700&display=swap");
* {
  margin: 0;
  padding: 0;
  box-sizing: border-box;
  font-family: "Quicksand", sans-serif;
}
.vue-notification{
  font-size:16px !important;
}
.error{
  color:Red;
  font-size:14px;
  font-weight: 400;
}
.container{
  background: rgba( 255, 255, 255, 0.25 );
box-shadow: 0 3px 12px 0 rgba( 31, 38, 135, 0.37 );
backdrop-filter: blur( 4px );
-webkit-backdrop-filter: blur( 4px );
border-radius: 10px;
border: 1px solid rgba( 255, 255, 255, 0.18 );
padding:15px;
}
$primary-dark :#323031;
$primary-dark-blue : #084C61;
$primary-yellow:#FFC857;
.app-wrapper{
  display:flex;
  position:relative;
}
.navi{
  height:100vh;
  width:200px;
  background-color: #323031;
  position:fixed;
  left:0;
  top:0;
}
.navi-small{
    height:100vh;
  width:80px;
  background-color: #323031;
  position:relative;
}
.app {
  display: flex;
  flex-direction: column;
  min-height: 100vh;
  background-color: white;
  width:100%;
}

.container {
  max-width: 1440px;
  margin: 0 auto;
}

.link {
  cursor: pointer;
  text-decoration: none;
  text-transform: uppercase;
  color: black;
}

.link-light {
  color: #fff;
}
</style>
