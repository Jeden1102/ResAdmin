<template>
    <div class="flex">
        <div class="flex" v-if="!workStarted">
            <Image1 class="img"/>
            <h2>Hi {{ waiterName }} !  Start your work time.</h2>
            <b-button variant="outline-primary" @click="startWork">Start <img src="@/assets/rocket.png" class="small-img" alt=""></b-button>
        </div>
        <div class="flex" v-else>
            <Sleep class="img"/>
            <h2>Hi {{ waiterName }} ! Are u done?  End your work time.</h2>
            <b-button variant="outline-primary" @click="endWork">Stop <img src="@/assets/finish.png" class="small-img" alt=""></b-button>
        </div>
    </div>
</template>

<script>
import Image1 from '../assets/r1.svg';
import Sleep from '../assets/sleep.svg';
    export default {
        data() {
            return {
                workStarted:false,
            }
        },
        components:{
            Image1,
            Sleep
        },
        computed:{
            waiterName(){
                return this.$store.state.user.name
            }
        },
        methods: {
            startWork(){
                this.workStarted = true;
            }
        },
    }
</script>

<style lang="scss" scoped>
.img{
    transform: scale(.7);
}
.flex{
    display:flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.small-img{
    width:25px;
}
</style>