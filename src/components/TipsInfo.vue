<template>
    <div>
<div class="flex">
            <div class="box">
              <img src="@/assets/hand.png" alt="">
              <h5>Average tip</h5>
              <h3>{{avgTip}}$</h3>
            </div>
            <div class="box">
              <img src="@/assets/hand.png" alt="">
              <h5>Summ tips</h5>
              <h3>{{sumTip}}$</h3>
            </div>
            <div class="box">
              <img src="@/assets/hand.png" alt="">
              <h5>Heighest tip</h5>
              <h3>{{maxTip}}$</h3>
            </div>
            <div class="box">
              <img src="@/assets/hand.png" alt="">
              <h5>Lowest tip</h5>
              <h3>{{lowestTip}}$</h3>
            </div>
            
          </div>
          <div class="filters-box">
            <div>
              <label for="lastWeek">Last Week</label>
              <input class="mx-2" type="radio" name="x" id="lastWeek" value="lastWeek" @change="filterDataMethod" v-model="filterData">
            </div>
            <div>
              <label for="months">By months</label>
              <input class="mx-2" type="radio" name="x" id="months" value="months" @change="filterDataMethod" v-model="filterData">
            </div>
            <div>
              <label for="years">By years</label>
              <input class="mx-2" type="radio" name="x" id="years" value="years" @change="filterDataMethod" v-model="filterData">
            </div>
          </div>


          <apexchart ref="tipsRecentChartRef" v-if="showChart" id="chart" type="bar" height="350" :options="tipsRecentChart.chartOptions" :series="tipsRecentChart.series"></apexchart>
          <apexchart ref="tipsPie" type="pie" width="380" :options="pieTipsChart.chartOptions" :series="pieTipsChart.series"></apexchart>
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
            tipsData:null,
            avgTip:0,
            heighestTip:0,
            sumTip:0,
            maxTip:0,
            lowestTip:0,
            chartData:null,
            showChart:false,
            filterData:'lastWeek',
            tipsRecentChart:{
                  series: [{
                    name: 'Tip sum:',
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
                      formatter: function (val) {
                        return val + "$";
                      },
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
                        formatter: function (val) {
                          return val + "$";
                        }
                      }
                    
                    },
                    title: {
                      text: 'Tips diaghram',
                      floating: true,
                      offsetY: 330,
                      align: 'center',
                      style: {
                        color: '#444'
                      }
                    }
                  },
            },
            dayWithTip:0,
            dayWithoutTip:0,
          pieTipsChart:{
          series: [],
          chartOptions: {
            chart: {
              width: 380,
              type: 'pie',
            },
            labels: ['With tip $$$', 'Without tip :('],
            responsive: [{
              breakpoint: 480,
              options: {
                chart: {
                  width: 200
                },
                legend: {
                  position: 'bottom'
                }
              }
            }]
          },
          }
        }
        },
        mounted() {
          this.getTipsData();
          this.getChartData();
        },
        methods: {
          getTipsData(){
            this.$emit('change-loading');
            axios.get(`${process.env.VUE_APP_API_URL}/api/tipData/${this.$store.state.user.id}`).then(res=>{
              this.tipsData = res.data;
                        this.$emit('change-loading');
              this.avgTips();
            }).catch(err=>{
              console.log(err);
            })
          },
          avgTips(){
            //avg
            let  avgTipx =  this.tipsData.reduce((a, b) => Number(a) + (Number(b.tip)|| 0), 0) / this.tipsData.length;
            this.avgTip = !isNaN(avgTipx) ?   avgTipx.toFixed(2) : 0;
            //sum
            let sumTip = this.tipsData.reduce((a, b) => Number(a) + (Number(b.tip)|| 0), 0);
            this.sumTip = sumTip;
            //max
            const max = this.tipsData.reduce(function(prev, current) {
              return (prev.tip > current.tip) ? prev : current
            }) 
            let maxTip = max.tip;
            this.maxTip = maxTip;
            //min
            const min = this.tipsData.reduce(function(prev, current) {
              return (prev.tip < current.tip) ? prev : current
            }) 
            let minTip = min.tip;
            this.lowestTip = minTip;
          },
          getChartData(){
            axios.get(`${process.env.VUE_APP_API_URL}/api/tipByDate/${this.$store.state.user.id}`).then(res=>{
              this.chartData = res.data;
              this.chartData.lastWeek.forEach(el=>{
                this.tipsRecentChart.series[0].data.push(el.total_tips);
                this.tipsRecentChart.chartOptions.xaxis.categories.push(el.data)
                //pie
                this.dayWithTip ++ ? el.total_tips >0 : this.dayWithoutTip++;
              })
              this.pieTipsChart.series.push(this.dayWithTip);
              this.pieTipsChart.series.push(this.dayWithoutTip);
              this.showChart=true;
            }).catch(err=>{
              console.log(err);
            })
          },
          filterDataMethod(){
            // this.showChart = false;
            let xAxis = [];
            let yAxis = [];
            // //pie chart
            let dayWithoutTip = 0;
            let dayWithTip = 0;
              if(this.filterData == 'lastWeek'){
                this.chartData.lastWeek.forEach(el=>{
                xAxis.push(el.total_tips);
                yAxis.push(el.data)
                //pie
                dayWithTip ++ ? el.total_tips >0 : dayWithoutTip++;
              })
              }

              if(this.filterData == 'months'){
                this.chartData.tipsByMonthYear.forEach(el=>{
                xAxis.push(el.total_tips);
                yAxis.push(el.month_year)
                //pie
                dayWithTip ++ ? el.total_tips >0 : dayWithoutTip++;
              })
              }
              if(this.filterData == 'years'){
                this.chartData.tipsByYear.forEach(el=>{
                xAxis.push(el.total_tips);
                yAxis.push(el.month_year)
                //pie
                dayWithTip ++ ? el.total_tips >0 : dayWithoutTip++;
              })
              }
            let dayTips = [];
            dayTips.push(dayWithTip);
            dayTips.push(dayWithoutTip);
            this.tipsRecentChart.series = [{
              data: xAxis
            }]
              this.$refs.tipsRecentChartRef.updateOptions( {
              xaxis: {
                categories: yAxis
              }
            });
            //pie
            this.pieTipsChart.series = dayTips

            }
        },
    }
</script>

<style  scoped>
.flex{
  flex-wrap:wrap;
}
</style>