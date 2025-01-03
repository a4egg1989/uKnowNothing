import { api } from '../utils/axios.js';

export default {
    async test() {
        const res = await api.get('/test')
        return res
    },
    async getStockList() {
        const res = await api.get('/get_stock_numbers')
        if (res.data.rtnCode === '0000') {
            const data = {
                isSuccess: true,
                data: res.data,
            }
            return data
        } else {
            const data = {
                isSuccess: false,
            }
            return data
        }
    },
    async getStockData(obj) {
        const res = await api.post('/get_stock_data', obj)
        if (res.data.rtnCode === '0000') {
            const data = {
                isSuccess: true,
                data: res.data,
            }
            return data
        } else {
            const data = {
                isSuccess: false,
            }
            return data
        }
    },
    async addStock(obj) {
        const res = await api.post('/add_stock_data', obj)
        if (res.data.rtnCode === '0000') {
            const data = {
                isSuccess: true,
                data: res.data,
            }
            return data
        } else {
            const data = {
                isSuccess: false,
            }
            return data
        }
    },
    async getCurrentAll() {
        const res = await api.get('/get_current_all')
        if (res.data.rtnCode === '0000') {
            const data = {
                isSuccess: true,
                data: res.data,
            }
            return data
        } else {
            const data = {
                isSuccess: false,
            }
            return data
        }
    }
}