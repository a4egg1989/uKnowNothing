<template>
   <v-card>
        <v-card-text>
            <v-row>
                <v-col cols="12" class="d-flex">
                    <v-select :items="stockList" v-model="selectedStock" density="compact" color="white" variant="outlined" bg-color="white" placeholder="股票代號" hide-details></v-select>
                </v-col>
                <v-col cols="6">
                    <VueDatePicker class="h-100" v-model="startDate" placeholder="開始日期" :enable-time-picker="false" auto-apply :teleport="true" :format="formatDate"></VueDatePicker>
                </v-col>
                <v-col cols="6">
                    <VueDatePicker class="h-100" v-model="endDate" placeholder="結束日期" :enable-time-picker="false" auto-apply :teleport="true" :format="formatDate"></VueDatePicker>
                </v-col>
                <v-col cols="12" class="text-center">
                    <v-btn-group>
                        <v-btn @click="clear()" color="grey" flat size="small">關閉</v-btn>
                        <v-btn @click="addStock()" color="success" flat size="small">送出</v-btn>
                    </v-btn-group>
                </v-col>
            </v-row>
        </v-card-text>
        <loadingComponent v-if="loading"></loadingComponent>
   </v-card>
   
</template>

<script>
import VueDatePicker from '@vuepic/vue-datepicker';
import '@vuepic/vue-datepicker/dist/main.css'
import stockSrv from '@/service/stock.js'  
import helper from '@/utils/helper';
import loadingComponent from '@/components/loadingComponent.vue';
import swal from 'sweetalert2';

export default {
    components: {
        VueDatePicker,
        loadingComponent,
    },
    data() {
        return {
            stockList: [],
            selectedStock: null,
            startDate: '',
            endDate: '',
            loading: false,
        };
    },
    mounted() {
        this.getStockList();
    },
    methods: {
        formatDate(dateStr){
            return helper.formatDate(dateStr);
        },
        clear() {
            this.$emit('close');
        },
        async getStockList() {
            const res = await stockSrv.getStockList().then(res => {
                if(res.isSuccess){
                    this.stockList = res.data.data.stockNumbers
                }
            })
            },
        async addStock() {
            try{
                this.loading = true;
                const obj = {
                    stockNumber: this.selectedStock,
                    startMonth: helper.convertMonth(this.startDate),
                    endMonth: helper.convertMonth(this.endDate),
                }
                const res = await stockSrv.addStock(obj).then(res => {
                    this.loading = false;
                    console.log(res)
                    if(res.isSuccess){
                        swal.fire({
                            title: '新增成功',
                            icon: 'success',
                            confirmButtonText: '確定',
                        }).then((result) => {
                            if(result.isConfirmed) {
                                this.$emit('close');
                            }
                        })
                    }
                })
            }catch(e){
                console.log(e)
            }
        },
    },
};
</script>
<style scoped></style>