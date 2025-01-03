<template>
  <main class="main pt-10">
      <!-- <v-btn @click="test()">連線測試</v-btn> -->
    <v-row class="justify-center">
      <v-col cols="11">
        <v-row>
          <v-col cols="3">
            <v-select label="股票代號" :items="stockList" v-model="selectedStock" density="compact" variant="solo" bg-color="white" hide-details></v-select>
          </v-col>
          <v-col cols="3">
            <VueDatePicker v-model="endDate" placeholder="開始日期" :enable-time-picker="false" auto-apply :format="formatDate"></VueDatePicker>
            <div class="btn-group mt-2">
              <template v-for="time in timeList">
                <div class="btn" :class="time.type === currentEndType ? 'active' : ''" @click="setTime('endDate', time.type, time.val)">
                  {{ time.title }}
                </div>
              </template>
            </div>
            
          </v-col>
          <v-col cols="3">
            <VueDatePicker v-model="startDate" placeholder="結束日期" :enable-time-picker="false" auto-apply :format="formatDate"></VueDatePicker>
            <div class="btn-group mt-2">
              <template v-for="time in timeList">
                <div class="disableOverlay" :class="endDate === '' ? '' : 'd-none' "></div>
                <div class="btn" :class="time.type === currentStartType ? 'active' : ''" @click="setTime('startDate', time.type, time.val)">
                  {{ time.title }}
                </div>
              </template>
            </div>
          </v-col>
          <v-col cols="2" class="d-flex">
            <v-btn @click="clear()" color="normal">清</v-btn>
            <v-btn @click="getStockData()" color="primary">查</v-btn>
          </v-col>
        </v-row>
      </v-col>
    </v-row>

    <v-row class="justify-center">
      <v-col cols="11">
        <v-row>
          <v-col cols="9" class="chartContainer">
            <lineComponent :chartWidth="chartWidth" :stockData="stockData"></lineComponent>
          </v-col>
          <v-col cols="3">
            <v-card class="customCard">
              <v-card-title class="text-white">資訊</v-card-title>
              <v-card-text class="py-4">
                <ul>
                  <li v-for="(value, key) in latestData" :key="key" class="list-unstyled latestDataListItem">
                    <v-row>
                      <v-col cols="4" class="latestDataLabel px-8">{{ keyConvert(key) }}</v-col>
                      <v-col class="latestDataValue">{{ value }}</v-col>
                    </v-row>
                  </li>
                </ul>
              </v-card-text>
            </v-card>
          </v-col>
        </v-row>
      </v-col>
    </v-row>
  </main>
</template>

<script>

import stockSrv from '@/service/stock.js'  
import VueDatePicker from '@vuepic/vue-datepicker';
import helper from '../utils/helper';
import '@vuepic/vue-datepicker/dist/main.css'
import lineComponent from '@/components/line.vue'

export default {
  components: {
    VueDatePicker,
    lineComponent
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
      stockData:[],
      chartWidth: 0,
      timeList: [
        { title: '今', val: 0, type: 'today' },
        { title: '週', val: 7, type: 'week' },
        { title: '月', val: 30, type: 'month' },
        { title: '季', val: 90, type: 'season' },
        { title: '年', val: 365, type: 'year' },
      ],
      currentStartType: '',
      currentEndType: '',
      latestData: {},
      showDisableOverlay: true,
    };
  },
  watch: {
  },
  mounted() {
    this.getStockList()
    this.initStock()
  },
  methods: {
    formatDate(dateStr){
      return helper.formatDate(dateStr)
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
          const chartWidth = document.querySelector('.chartContainer').clientWidth
          this.chartWidth = chartWidth
          if(res.isSuccess){
            this.originalData = res.data.data.stockData
            this.stockData = res.data.data.stockData
            this.stockData.forEach(item => {
              item.date = helper.adDate(item.date)
            })
            this.latestData = this.stockData[0]
          }
        })
      }catch(e){
        console.log(e)
      }
    },
    initStock(){
      const stockNumber = this.$route.query.stockNumber
      this.selectedStock = stockNumber
    },
    setTime(model, type, val){

      let date = null
      
      if(model === 'endDate'){
        date = new Date()
        this.currentEndType = type
      }else{
        date = new Date(this.endDate)
        this.currentStartType = type
      }
      switch(type){
        case 'today':
          date.setDate(date.getDate())
          break
        case 'week':
          date.setDate(date.getDate() - 7)
          break
        case 'month':
          date.setMonth(date.getMonth() - 1)
          break
        case 'season':
          date.setMonth(date.getMonth() - 3)
          break
        case 'year':
          date.setFullYear(date.getFullYear() - 1)
          break
      }
      this[model] = date
    },
    clear(){
      this.startDate = ''
      this.endDate = ''
      this.selectedStock = ''
      // this.stockData = []
    },
    keyConvert(key){
      return helper.keyConvert(key)
    }
  },
}
</script>
<style lang="scss" scoped>
.btn-group{
  display: flex;
  position: relative;

  .btn{
    cursor: pointer;
    padding: 4px 12px;
    display: flex;
    background-color: rgba($color: #ffffff, $alpha: .1);
    width: fit-content;
    height: 100%;
    align-items: center;
    font-size: 0.875rem;

    &:first-child{
      border-top-left-radius: 4px;
      border-bottom-left-radius: 4px;
    }
    &:last-child{
      border-top-right-radius: 4px;
      border-bottom-right-radius: 4px;
    }

    &:hover{
      transition: 0.5s;
      background-color: #14BAE3;
      color: rgba($color: #ffffff, $alpha: 1);
    }
    &.active{
      background-color: #14BAE3;
      color: rgba($color: #ffffff, $alpha: 1);
    }
  }
}
.latestDataListItem{

  &:hover{
    transition: 0.5s;
    background-color: rgba($color: #000000, $alpha: .4);
    cursor: default;

    .latestDataLabel{
      color: rgba($color: #ffffff, $alpha: 1);
    }
    .latestDataValue{
      color: rgba($color: #ffffff, $alpha: 1);
    }
  }

  .latestDataLabel{
    color: rgba($color: #ffffff, $alpha: .4);
    font-size: 1rem;
  }
  .latestDataValue{
    color: rgba($color: #ffffff, $alpha: .4);
    font-size: 1rem;
  }
}

.disableOverlay{
  background-color: rgba($color: #ffffff, $alpha: .1);
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
}
</style>