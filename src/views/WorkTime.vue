<template>
    <div class="flex">
        <div class="flex" v-if="!workStarted">
            <img src="@/assets/start.png" alt="">
            <h2>Hi {{ waiterName }} !  Start your work time.</h2>
            <b-button variant="outline-primary" @click="startWork">Start <img src="@/assets/rocket.png" class="small-img" alt=""></b-button>
        </div>
        <div class="flex" v-else>
            <img src="@/assets/sleep.png" alt="">
            <h1>{{ seconds }}</h1>
            <h6>{{normalDate}}</h6>
            <h2>Hi {{ waiterName }} ! Are u done?  End your work time.</h2>
            <b-button variant="primary" @click="endWork">Stop <img src="@/assets/finish.png" class="small-img" alt=""></b-button>
        </div>
    </div>
</template>

<script>
import axios from 'axios';
    export default {
  name: "WorkTime",
        data() {
            return {
                workStarted:false,
                workInfo:null,
                secondsX:0,
            }
        },
        components:{

        },
        computed:{
            waiterName(){
                return this.$store.state.user.name
            },
            normalDate(){
                let  x  = this.workInfo.created_at;
                let y = new Date(x);
                return y.toLocaleDateString() + " " +  y.toLocaleTimeString() 
            },
            secBetween(){
            let t2 = new Date(this.workInfo.created_at).getTime();
            let t1 = new Date().getTime();
            var dif = t1 - t2
            var Seconds_from_T1_to_T2 = dif / 1000;
            var Seconds_Between_Dates = Math.round(Math.abs(Seconds_from_T1_to_T2));
            return Seconds_Between_Dates;
            },
            seconds(){
            var pad = function(num, size) { return ('000' + num).slice(size * -1); },
            time = parseFloat(this.secondsX).toFixed(3),
            hours = Math.floor(time / 60 / 60),
            minutes = Math.floor(time / 60) % 60,
            seconds = Math.floor(time - minutes * 60);
            return pad(hours, 2) + ':' + pad(minutes, 2) + ':' + pad(seconds, 2);
            }
        },
        mounted() {
            this.checkIfStarted();
        },
        methods: {
            checkIfStarted(){
                axios.get(`${process.env.VUE_APP_API_URL}/api/work/${this.$store.state.user.id}`).then(res=>{
                    if(res.data != "" && res.data.end_day == null){
                        this.workInfo = res.data;
                        this.workStarted = true;
                this.secondsX = this.secBetween;
                    setInterval(()=>{
                        this.secondsX++;
                    },1000)
                    }else{
                        this.workInfo = null;
                    }
                }).catch(err=>{
                    console.log(err);
                })
            },
            startWork(){
                axios.post(`${process.env.VUE_APP_API_URL}/api/work`,{
                    waiter_id:this.$store.state.user.id,
                }).then(res=>{
                    this.workStarted = true;
                    this.workInfo = res.data;
                    this.secondsX = this.secBetween;
                    setInterval(()=>{
                        this.secondsX++;
                    },1000)
                    this.$notify({
                    group: 'foo',
                    title: 'Info',
                    text: 'Work time started !',
                    });
                }).catch(err=>{
                    console.log(err)
                })
            },

            endWork(){
                this.workStarted = false;
                this.workInfo = null;
                axios.post(`${process.env.VUE_APP_API_URL}/api/work/${this.$store.state.user.id}?_method=PUT`,{
                    end_time: new Date().toLocaleTimeString('en-US', { hour12: false, 
                                             hour: "numeric", 
                                             minute: "numeric"}),
                    end_day:new Date().toLocaleDateString(),
                    hours_worked:this.seconds,
                }).then(res=>{
                    console.log(res);
                    this.$notify({
                    group: 'foo',
                    title: 'Info',
                    text: 'Work time ended ! See yaa',
                    });
                }).catch(err=>{
                    console.log(err)
                })
            }
        },
    }
</script>

<style lang="scss" scoped>
.img{
    width:500px;
}
@media(max-width:650px){
    img{
        width:200px;
    }
}
.flex{
    display:flex;
    justify-content: center;
    align-items: center;
    flex-direction: column;
}
.flex h2{
    overflow-wrap: break-word;
    width:30%;
}
.small-img{
    width:25px;
}
</style>