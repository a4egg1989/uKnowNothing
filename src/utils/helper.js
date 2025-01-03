export default {
    convertDate(date) {
        const year = date.getFullYear();
        let month = date.getMonth() + 1;  // 月份是從 0 開始計算的，所以需要加 1
        let day = date.getDate();

        // 確保月份和日期是兩位數
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        return `${year}/${month}/${day}`;
    },
    convertMonth(date) {
        const year = date.getFullYear();
        let month = date.getMonth() + 1;  // 月份是從 0 開始計算的，所以需要加 1
        let day = date.getDate();

        // 確保月份和日期是兩位數
        month = month < 10 ? '0' + month : month;
        day = day < 10 ? '0' + day : day;

        return `${year}/${month}/01`;
    },
    adDate(date) {
        const dateParts = date.split('/');
        const twYear = parseInt(dateParts[0]) + 1911;

        return `${twYear}/${dateParts[1]}/${dateParts[2]}`;
    },
    keyConvert(key) {
        switch (key) {
            case 'date':
                return '日期';
            case 'volume':
                return '成交股數';
            case 'value':
                return '成交金額';
            case 'openPrice':
                return '開盤價';
            case 'highPrice':
                return '最高價';
            case 'lowPrice':
                return '最低價';
            case 'closePrice':
                return '收盤價';
            case 'priceChange':
                return '漲跌價差';
            case 'transactions':
                return '成交筆數';
            default:
                return key;
        }
    },
    formatDate(dateStr) {
        const date = new Date(dateStr);
        const day = date.getDate();
        const month = date.getMonth() + 1;
        const year = date.getFullYear();
        return `${year}/${month}/${day}`;
    }

}