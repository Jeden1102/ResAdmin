<template>
    <div class="rel">   
      <Loading v-if="loadingData">Data is being loaded</Loading>
        <div class="flex">
            <div class="box">
              <img src="@/assets/pay.png" alt="">
              <h5>Average order </h5>
              <h3>{{salesData.avgOrderPrice.toFixed(2)}}$</h3>
            </div>
            <div class="box">
              <img src="@/assets/pay.png" alt="">
              <h5>Heighest order </h5>
              <h3>{{salesData.maxOrderPrice.toFixed(2)}}$</h3>
            </div>
            <div class="box">
              <img src="@/assets/table1.png" alt="">
              <h5>Orders total</h5>
              <h3>{{salesData.orderCount}}</h3>
            </div>
            <div class="box">
              <img src="@/assets/stats.png" alt="">
              <h5>Summary income</h5>
              <h3>{{salesData.sumPrice.toFixed(2)}}$</h3>
            </div>
        </div>
          <div class="filters-box">
            <div>
              <label for="lastWeek">Last Week</label>
              <input class="mx-2" type="radio" name="x" id="lastWeek" value="lastWeek" @change="addDataToChart(true)" v-model="filterData">
            </div>
            <div>
              <label for="months">By months</label>
              <input class="mx-2" type="radio" name="x" id="months" value="months" @change="addDataToChart(true)" v-model="filterData">
            </div>
            <div>
              <label for="years">By years</label>
              <input class="mx-2" type="radio" name="x" id="years" value="years" @change="addDataToChart(true)" v-model="filterData">
            </div>
          </div>
        <apexchart ref="salesChart" type="bar" height="350" :options="chartOptions" :series="series"></apexchart>
    </div>
</template>

<script>
import axios from 'axios'
import VueApexCharts from 'vue-apexcharts'
import Loading from '@/components/Loading.vue';
    export default {
    components:{
        apexchart: VueApexCharts,
        Loading
      },
        data() {
            return {
            filterData:'lastWeek',
            loadingData:false,
            filtering:false,
                salesData:null,
                         series: [{
            name: 'Total income',
            type: 'column',
            data: [440, 505, 414, 671, 227, 413, 201, 352, 752, 320, 257, 160]
          }, {
            name: 'Total orders',
            type: 'column',
            data: [23, 42, 35, 27, 43, 22, 17, 31, 22, 22, 12, 16]
          }],
          chartOptions: {
            chart: {
              height: 350,
              type: 'line',
            },
            stroke: {
              width: [0, 4]
            },
            title: {
              text: 'Income/orders data'
            },
            dataLabels: {
              enabled: true,
              enabledOnSeries: [1]
            },
            labels: ['01 Jan 2001', '02 Jan 2001', '03 Jan 2001', '04 Jan 2001', '05 Jan 2001', '06 Jan 2001', '07 Jan 2001', '08 Jan 2001', '09 Jan 2001', '10 Jan 2001', '11 Jan 2001', '12 Jan 2001'],
            xaxis: {
            },
            yaxis: [{
              title: {
                text: 'Income($)',
              },
            
            }, {
              opposite: true,
              title: {
                text: 'Total orders'
              }
            }]
          },
            }
        },
        mounted() {
            this.getSalesData();
        },
        methods: {

            getSalesData(){
              this.loadingData=true;
                axios(`${process.env.VUE_APP_API_URL}/api/salesInfo`).then(res=>{
                    this.salesData = res.data;
              this.loadingData=false;
                    this.addDataToChart(false);
                })
            },
            addDataToChart(filter){
                if(filter){
                  this.filtering=true;
                }else{
                  this.filtering=false;
                }
                let orders = [];
                let income = [];
                let xaxis = [];
                let objToSort = null;
                if(this.filterData == "lastWeek"){
                  objToSort = 'orderLastWeek';
                }
                if(this.filterData == "months"){
                  objToSort = 'orderByMonthYear';
                }
                if(this.filterData == "years"){
                  objToSort = 'orderByYear';
                }
                this.salesData[objToSort].forEach(element => {
                    orders.push(element.total_orders);
                    income.push(element.total_income);
                    xaxis.push(element.data);
                });
            this.series = [
              {
            name: 'Total income',
            type: 'column',
            data: income,
          }, {
            name: 'Total orders',
            type: 'column',
            data: orders,
          }
            ]
            if(this.filtering){
              this.$refs.salesChart.updateOptions( {
                labels: xaxis
            });
            }else{
            this.chartOptions.labels = xaxis;
            }

            }
        },

    }
</script>

<style lang="scss" scoped>
.flex{
    display:flex;
    flex-wrap: wrap;
}
.rel{
  position: relative;
}
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