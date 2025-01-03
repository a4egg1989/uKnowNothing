<template>
  <main class="main pt-10">
      <!-- <v-btn @click="test()">連線測試</v-btn> -->
      <v-row class="justify-center">
        <v-col cols="11">
          <v-row>
            <v-col cols="3">
              <v-text-field v-model="stockFilter" color="white" variant="solo" density="compact" hide-details clearable></v-text-field>
            </v-col>
            <v-col>
              <div class="btn-hover" @click="showAddStock = true">
                <v-icon icon="mdi mdi-plus" color="white"></v-icon>
              </div>
            </v-col>
          </v-row>
        </v-col>
      </v-row>
      <v-row class="justify-center">
        <v-col cols="11">
          <v-card class="customCard">
            <v-table width="100%" class="table">
              <thead>
                <th v-for="header in headers" class="pa-4" width="10%">
                  <span class="d-block w-100 text-start">{{ header.title }}</span>
                  <!-- <td class="d-block w-100 text-start">{{ header.title }}</td> -->
                  
                </th>
              </thead>
              <tbody>
                <template v-for="stockItem in tableItems">
                  <tr class="table-hover" @click="goToStock(stockItem.stockNumber)">
                    <td><span>{{ stockItem.stockNumber }}</span></td>
                    <td><span>{{ stockItem.date }}</span></td>
                    <td><span>{{ stockItem.volume }}</span></td>
                    <td><span>{{ stockItem.value }}</span></td>
                    <td><span>{{ stockItem.openPrice }}</span></td>
                    <td><span>{{ stockItem.highPrice }}</span></td>
                    <td><span>{{ stockItem.lowPrice }}</span></td>
                    <td><span>{{ stockItem.closePrice }}</span></td>
                    <td><span>{{ stockItem.priceChange }}</span></td>
                    <td><span>{{ stockItem.transactions }}</span></td>
                  </tr>
                </template>
              </tbody>
            </v-table>
          </v-card>
        </v-col>
      </v-row>
  </main>
  <loadingComponent v-if="loading"></loadingComponent>
  <v-dialog max-width="600" v-model="showAddStock" persistent>
    <addStockComponent @close="showAddStock = false"></addStockComponent>
  </v-dialog>
  
</template>

<script>

import stockSrv from '@/service/stock.js'  
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import loadingComponent from '@/components/loadingComponent.vue';
import addStockComponent from '@/components/addStockComponent.vue';

export default {
  components: {
    VueDatePicker,
    loadingComponent,
    addStockComponent
  },
  data() {
    return {
      headers: [
        { title: '股票編號', key: 'stockNumber' },
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
      selectedStock: null,
      stockList: [],
      loading: false,
      showAddStock: false,
      stockFilter: ''
    };
  },
  watch: {
    stockFilter(val) {
      if(val === null || val === ''){
        this.tableItems = this.originalData
      }else{
        this.tableItems = this.originalData.filter(item => item.stockNumber.includes(val))
      }
    }
  },
  mounted() {
    this.getCurrentAll()
  },
  methods: {
    async test() {
      const res = await stockSrv.test().then(res => {
        console.log(res)
      })
    },
    async getCurrentAll() {
      try{
        this.loading = true
        const res = await stockSrv.getCurrentAll().then(res => {
          if(res.isSuccess){
            this.tableItems = res.data.data.stockData
            this.originalData = res.data.data.stockData
            this.loading = false
          }
        })
      }catch(e){
        console.log(e)
      }
    },
    goToStock(stockNumber) {
      this.$router.push({
        name: 'stocksView', // 使用路由的名稱
        query: { 'stockNumber': stockNumber },
      });
    }
  },
}
</script>

<style lang="scss" scoped>
@import '@/assets/scss/all.scss';

.table{
  background-color: transparent;
  color: rgba($color: #ffffff, $alpha: .7);
}

.table-hover{
  cursor: pointer;
  &:hover{
    transition: 0.5s;
    background-color: rgba($color: #000000, $alpha: .1);
    color: rgba($color: #ffffff, $alpha: 1);
  }
}

.btn-hover{
  cursor: pointer;
  padding: 4px 12px;
  border-radius: 4px;
  display: flex;
  background-color: rgba($color: #ffffff, $alpha: .1);
  width: fit-content;
  height: 100%;
  align-items: center;
  &:hover{
    transition: 0.5s;
    background-color: #14BAE3;
    color: rgba($color: #ffffff, $alpha: 1);
  }
}
</style>