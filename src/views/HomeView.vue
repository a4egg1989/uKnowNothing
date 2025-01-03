<template>
  <main class="main">
      <v-btn @click="test()">連線測試</v-btn>
      <v-row class="justify-center">
        <v-col cols="6">
          <v-row>
            <v-col cols="4" class="d-flex">
              <v-select label="股票代號" :items="stockList" v-model="selectedStock" density="compact"></v-select>
            </v-col>
            <v-col>
              <VueDatePicker v-model="startDate" placeholder="開始日期" :enable-time-picker="false" auto-apply></VueDatePicker>
            </v-col>
            <v-col>
              <VueDatePicker v-model="endDate" placeholder="結束日期" :enable-time-picker="false" auto-apply></VueDatePicker>
            </v-col>
            <v-btn @click="getStockData()">查</v-btn>
            <v-btn @click="getStockData()">清</v-btn>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col cols="8">
          <v-data-table :headers="headers" :items="tableItems"></v-data-table>
        </v-col>
      </v-row>
  </main>
</template>

<script>

import stockSrv from '@/service/stock.js'  
import VueDatePicker from '@vuepic/vue-datepicker';
import helper from '../utils/helper';
import '@vuepic/vue-datepicker/dist/main.css'


export default {
  components: {
    VueDatePicker
  },
  data() {
    return {
      headers: [
        { title: '日期', key: 'date' },
        { title: '成交股數', key: 'volume' },
        { title: '成交金額', key: 'value' },
        { title: '開盤價', key: 'openPrice' },
        { title: '最高價', key: 'highPrice' },
        { title: '最低價', key: 'lowPrice' },
        { title: '收盤價', key: 'closePrice' },
        { title: '漲跌價差', key: 'priceChange' },
        { title: '成交筆數', key: 'transactions' },
      ],
      originalData: [],
      tableItems: [],
      startDate: '',
      endDate: '',
      selectedStock: '',
      stockList: [],
    };
  },
  watch: {
  },
  mounted() {
    this.getStockList()
  },
  methods: {
    async test() {
      const res = await stockSrv.test().then(res => {
        console.log(res)
      })
    },
    async getStockList() {
      const res = await stockSrv.getStockList().then(res => {
        if(res.isSuccess){
          this.stockList = res.data.data.stockNumbers
        }
      })
    },
    async getStockData() {
      try{
        const obj = {
          stockNumber: this.selectedStock,
          startDate: helper.convertDate(this.startDate),
          endDate: helper.convertDate(this.endDate),
        }
        const res = await stockSrv.getStockData(obj).then(res => {
          console.log(res)
          if(res.isSuccess){
            this.originalData = res.data.data.stockData
            this.tableItems = res.data.data.stockData
            this.tableItems.forEach(item => {
              item.date = helper.adDate(item.date)
            })
            console.log(this.tableItems)
          }
        })
      }catch(e){
        console.log(e)
      }
      
    }
  },
}
</script>