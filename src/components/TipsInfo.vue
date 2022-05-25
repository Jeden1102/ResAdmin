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

<style lang="scss" scoped>
.flex{
  flex-wrap:wrap;
}
.rel{
  position: relative;
  background:rgb(238, 238, 238);
  color:black;
}
.filters-box{
  display:flex;
  justify-content: center;
  gap:15px;
  margin:10px 0;
}
.flex{
  display:Flex;
  justify-content: space-around;
}
.box{
  width:200px;
  height:200px;
    background:#F28843;
  color:white;
  display:flex;
  justify-content: center;
  align-items: center;
  flex-direction: column;
  padding:10px;
  margin:5px;
  border-radius: 5px;
  img{
    width:100px;
    height:100px;
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
.clear-btn,.clear-btn-2{
  background-color: white;
  color:rgb(59, 112, 224);
  border:none;
  width:100px !important;
  height:30px !important;
  font-weight: bold;
}
</style>