<template>
    <div>
        <div class="flex">
                        <div class="box">
              <img src="@/assets/back-in-time.png" alt="">
              <h5>Summ worked</h5>
              <h2>{{workInfo.sumWorked}}</h2>
            </div>
            <div class="box">
              <img src="@/assets/waiter.png" alt="">
              <h5>Total orders</h5>
              <h2>{{totalOrders}}</h2>
            </div>
        </div>
                  <div class="filters-box">
            <div>
              <label for="lastWeekWork">Last Week</label>
              <input class="mx-2" type="radio" name="y" id="lastWeekWork" value="lastWeekWork" @change="filterWorkMethod" v-model="filterWork">
            </div>
            <div>
              <label for="monthsWork">By months</label>
              <input class="mx-2" type="radio" name="y" id="monthsWork" value="monthsWork" @change="filterWorkMethod" v-model="filterWork">
            </div>
            <div>
              <label for="yearsWork">By years</label>
              <input class="mx-2" type="radio" name="y" id="yearsWork" value="yearsWork" @change="filterWorkMethod" v-model="filterWork">
            </div>
          </div>
          <apexchart ref="workRef" v-if="showChart" id="chart" type="bar" height="350" :options="workChart.chartOptions" :series="workChart.series"></apexchart>

    </div>
</template>

<script>
import axios from 'axios';
import VueApexCharts from 'vue-apexcharts'

    export default {
        components:{
        apexchart: VueApexCharts,
        },  
        data() {
            return {
                workInfo:null,
                totalOrders:0,
            filterWork:'lastWeekWork',
            showChart:false,
                        workChart:{
                  series: [{
                    name: 'Worked hours:',
                    data: [],
                  }],
                  chartOptions: {
                    chart: {
                      height: 350,
                      type: 'bar',
                    },
                    plotOptions: {
                      bar: {
                        borderRadius: 10,
                        dataLabels: {
                          position: 'top', // top, center, bottom
                        },
                      }
                    },
                    dataLabels: {
                      enabled: true,

                      offsetY: -20,
                      style: {
                        fontSize: '12px',
                        colors: ["#304758"]
                      }
                    },
                    
                    xaxis: {
                      categories: [],
                      position: 'top',
                      axisBorder: {
                        show: false
                      },
                      axisTicks: {
                        show: false
                      },
                      crosshairs: {
                        fill: {
                          type: 'gradient',
                          gradient: {
                            colorFrom: '#D8E3F0',
                            colorTo: '#BED1E6',
                            stops: [0, 100],
                            opacityFrom: 0.4,
                            opacityTo: 0.5,
                          }
                        }
                      },
                      tooltip: {
                        enabled: true,
                      }
                    },
                    yaxis: {
                      axisBorder: {
                        show: false
                      },
                      axisTicks: {
                        show: false,
                      },
                      labels: {
                        show: false,

                      }
                    
                    },
                    title: {
                      text: 'Worked hours',
                      floating: true,
                      offsetY: 330,
                      align: 'center',
                      style: {
                        color: '#444'
                      }
                    }
                  },
            },
            }
        },
             mounted() {
                this.getWorkInfo();
            },
            methods: {
                getWorkInfo(){
                    axios.get(`${process.env.VUE_APP_API_URL}/api/sumWork/${this.$store.state.user.id}`).then(res=>{
                        this.workInfo = res.data;
                        this.totalOrders = this.workInfo.totalOrders[0].total_orders
                        this.workInfo.lastWeek.forEach(el=>{
                        this.workChart.series[0].data.push(el.hours_worked);
                        this.workChart.chartOptions.xaxis.categories.push(el.data)
                    })
                            this.showChart=true;
                    }).catch(err=>{
                        console.log(err);
                    })
                },
                filterWorkMethod(){
            let xAxis = [];
            let yAxis = [];
              if(this.filterWork == 'lastWeekWork'){
                this.workInfo.lastWeek.forEach(el=>{
                xAxis.push(el.hours_worked);
                yAxis.push(el.data)
              })
              }

              if(this.filterWork == 'monthsWork'){
                this.workInfo.worked_year_month.forEach(el=>{
                xAxis.push(el.hours_worked);
                yAxis.push(el.month_year)
              })
              }
              if(this.filterWork == 'yearsWork'){
                this.workInfo.worked_year.forEach(el=>{
                xAxis.push(el.hours_worked);
                yAxis.push(el.month_year)
              })
              }
            this.workChart.series = [{
              data: xAxis
            }]
              this.$refs.workRef.updateOptions( {
              xaxis: {
                categories: yAxis
              }
            });
                }
            },
    }
</script>

<style  scoped>
.flex{
  flex-wrap: wrap;
}
</style>