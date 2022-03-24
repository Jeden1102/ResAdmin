<template>
    <div>   
        <div class="flex">
            <div class="box">
              <img src="@/assets/pay.png" alt="">
              <h5>Average order </h5>
              <h3>{{salesData.avgOrderPrice}}$</h3>
            </div>
            <div class="box">
              <img src="@/assets/pay.png" alt="">
              <h5>Heighest order </h5>
              <h3>{{salesData.maxOrderPrice}}$</h3>
            </div>
            <div class="box">
              <img src="@/assets/table1.png" alt="">
              <h5>Orders total</h5>
              <h3>{{salesData.orderCount}}</h3>
            </div>
            <div class="box">
              <img src="@/assets/stats.png" alt="">
              <h5>Summary income</h5>
              <h3>{{salesData.sumPrice}}$</h3>
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
    export default {
    components:{
        apexchart: VueApexCharts,
      },
        data() {
            return {
            filterData:'lastWeek',
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
                axios(`${process.env.VUE_APP_API_URL}/api/salesInfo`).then(res=>{
                    this.salesData = res.data;
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
}
</style>