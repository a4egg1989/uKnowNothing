<template>
    <v-card class="customCard">
        <v-card-title class="text-white">走勢</v-card-title>
        <v-card-text>
            <div ref="chart" class="chart"></div>
            <div ref="transactions" class="transactions"></div>
        </v-card-text>
        
    </v-card>
  
</template>

<script>
import * as d3 from "d3";
import helper from "@/utils/helper";

export default {
    props:{
        stockData: {
            type: Array,
            required: true,
        },
        chartWidth: {
            type: Number,
            default: 1000,
        },
    },
    name: "D3Chart",
    data() {
        return {
            convertData: [],
            avgPrice: 0,
            lowestPrice: 0,
            highestPrice: 0,
            latestData: {},
        };
    },
    watch:{
        stockData(val){
            this.initData()
        }
    },
    mounted() {
    },
    methods: {
        initData(){
            // 計算平均值
            this.avgPrice = this.stockData.reduce((acc, cur) => acc + cur.closePrice, 0) / this.stockData.length;

            this.convertData = this.stockData.map((item) => ({
                date: d3.timeParse("%Y/%m/%d")(item.date), // 格式化日期
                closePrice: item.closePrice,
                highPrice: item.highPrice,
                lowPrice: item.lowPrice,
                openPrice: item.openPrice,
            }));

            
            // 找出最高和最低的 closePrice
            this.highestPrice = Math.max(...this.convertData.map(item => item.closePrice));
            this.lowestPrice = Math.min(...this.convertData.map(item => item.closePrice));
            
            this.drawChart()
            this.drawTransactions()
        },
        
        drawChart() {
            const margin = { top: 20, right: 30, bottom: 50, left: 60 };
            const width = this.chartWidth - 150;
            const height = 400

            const chartContainer = d3.select(this.$refs.chart);
                if (!chartContainer.select("svg").empty()) {
                chartContainer.select("svg").remove();
            }

            const svg = d3
                .select(this.$refs.chart)
                .append("svg")
                .attr("width", '100%')
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);


            // 設定 X 軸和 Y 軸比例尺
            const x = d3 
                .scaleTime()
                .domain(d3.extent(this.convertData, (d) => d.date))
                .range([0, width])

            const lowFall = this.lowestPrice * 0.9
            const highRise = this.highestPrice * 1.1

            const y = d3
                .scaleLinear()
                .domain([lowFall, highRise])
                .range([height, 0])

            // 繪製 X 軸
            const data = this.convertData; // 假設資料已經存在
            const ticksAmount = data.length;

            // 計算資料範圍
            const minDate = d3.min(data, d => new Date(d.date)); // 假設日期欄位是 `date`
            const maxDate = d3.max(data, d => new Date(d.date));
            const timeDiff = maxDate - minDate; // 毫秒數
            const twoMonths = 60 * 24 * 60 * 60 * 1000; // 兩個月的毫秒數

            let tickDates;
            let dateFormat;

            // 設定 ticks 和日期格式
            if (timeDiff > twoMonths) {
                // 時間範圍超過兩個月：取每月的第一天
                tickDates = data.filter((d, i, arr) => {
                    const currentDate = new Date(d.date);
                    const previousDate = i === 0 ? null : new Date(arr[i - 1].date);
                    return !previousDate || currentDate.getMonth() !== previousDate.getMonth();
                }).map(d => new Date(d.date));

                dateFormat = "%Y/%m";
            } else {
                // 時間範圍在兩個月以內：顯示所有資料
                tickDates = data.map(d => new Date(d.date));
                dateFormat = "%Y/%m/%d";
            }
            
            // 繪製 X 軸
            svg
                .append("g")
                .attr("transform", `translate(0,${height})`)
                .call(
                    d3.axisBottom(x)
                        .tickValues(tickDates) // 設定自訂 tick 值
                        .tickFormat(d3.timeFormat(dateFormat)) // 設定日期格式
                )
                .selectAll(".domain, line") // 正確選擇基線與 ticks 的線
                .attr("stroke", "rgba(255, 255, 255, 0.4)"); // 設定線條顏色

            // 設定文字顏色和旋轉
            svg.selectAll("g.tick text")
                .style("text-anchor", "end")
                .attr("transform", "rotate(-45)")
                .attr("fill", "rgba(255, 255, 255, 0.4)");


            // 繪製 Y 軸
            svg
                .append("g")
                .call(d3.axisLeft(y))
                .selectAll(".domain, line") // 正確選擇基線與 ticks 的線
                .attr("stroke", "rgba(255, 255, 255, 0.4)"); // 設定線條顏色

            svg.selectAll("g.tick text")
                .attr("fill", "rgba(255, 255, 255, 0.4)");

            // 繪製折線
            const strokeColor = 'rgba(255, 255, 255, 0.4)'
            const line = d3.line()
                .x((d) => x(d.date))
                .y((d) => y(d.closePrice));

                // 繪製分段折線
                this.convertData.forEach((d, i, arr) => {
                if (i === 0) return; // 跳過第一個點，因為沒有前一個點連線

                svg.append("line")
                    .attr("x1", x(arr[i - 1].date))
                    .attr("y1", y(arr[i - 1].closePrice))
                    .attr("x2", x(d.date))
                    .attr("y2", y(d.closePrice))
                    .attr("stroke", strokeColor) // 使用當前點的顏色
                    .attr("stroke-width", 2);
            });
            
            const dashData = []
            tickDates.forEach((date) => {
                const currentDate = helper.formatDate(date)
                const closePrice = this.convertData.find((d) => helper.formatDate(d.date) === currentDate).closePrice
                
                dashData.push({
                    date,
                    closePrice: closePrice,
                });
            });
            
            svg
                .selectAll(".vert-line")
                .data(dashData)
                .enter()
                .append("line")
                .attr("class", "vert-line")
                .attr("x1", (d) => x(d.date))
                .attr("y1", height)
                .attr("x2", (d) => x(d.date))
                .attr("y2", (d) => y(d.closePrice))
                .attr("stroke", "rgba(255,255,255, 0.2)")
                .attr("stroke-dasharray", "4,2");

            // 添加數據點
            svg
                .selectAll(".dot")
                .data(this.convertData)
                .enter()
                .append("circle")
                .attr("class", "dot")
                .attr("cx", (d) => x(d.date))
                .attr("cy", (d) => y(d.closePrice))
                .attr("r", 3)
                .attr("fill", 'rgba(255, 255, 255, 0.4)')

            svg.append("line")
                .attr("x1", 0)
                .attr("x2", width)
                .attr("y1", y(this.avgPrice))
                .attr("y2", y(this.avgPrice))
                .attr("stroke", strokeColor)
                .attr("stroke-dasharray", "4"); // 虛線樣式
            
            svg.append("text")
                .attr("x", -40) // 靠近左邊的距離
                .attr("y", y(this.avgPrice)) // 位於水平線上方一點
                .attr("fill", 'rgba(255,255,255,1)') // 文字顏色
                .attr("font-size", "12px") // 文字大小
                .text(`${this.avgPrice.toFixed(2)}`); // 顯示 avgPrice 值，保留小數點兩位

        },
        drawTransactions() {
            const transactions = this.stockData.map((item) => ({
                date: d3.timeParse("%Y/%m/%d")(item.date), // 格式化日期
                transactions: item.transactions,
            }));

            const margin = { top: 20, right: 30, bottom: 50, left: 60 };
            const width = this.chartWidth - 150; // 基礎寬度
            const height = 200; // 基礎高度

            const chartContainer = d3.select(this.$refs.transactions);
            
            // 清除舊的 svg
            if (!chartContainer.select("svg").empty()) {
                chartContainer.select("svg").remove();
            }

            // 創建 svg 並設定寬度和高度
            const svg = chartContainer
                .append("svg")
                .attr("width", "100%") // 寬度百分比填滿父容器
                .attr("height", height + margin.top + margin.bottom)
                .append("g")
                .attr("transform", `translate(${margin.left},${margin.top})`);

            // 設定 X 軸和 Y 軸比例尺
            const x = d3
                .scaleTime()
                .domain(d3.extent(transactions, (d) => d.date)) // X 軸範圍
                .range([0, width]);

            const y = d3
                .scaleLinear()
                .domain([0, d3.max(transactions, (d) => d.transactions)]) // Y 軸範圍
                .range([height, 0]);

            // 繪製 X 軸
            const ticksAmount = this.stockData.length
            svg
                .append("g")
                .attr("transform", `translate(0, ${height})`) // 移動到底部
                // .call(d3.axisBottom(x).tickFormat(d3.timeFormat("%m/%d"))) // 日期格式
                .call(d3.axisBottom(x).ticks(ticksAmount).tickFormat(d3.timeFormat("%Y/%m/%d")))
                .selectAll("text")
                .style("text-anchor", "end")
                .attr("dx", "-0.8em")
                .attr("dy", "0.15em")
                .attr("transform", "rotate(-45)") // 文字旋轉
                .selectAll(".domain, line") // 正確選擇基線與 ticks 的線
                .attr("stroke", "rgba(255, 255, 255, 0.4)"); // 設定線條顏色

            // 繪製 Y 軸
            svg.append("g").call(d3.axisLeft(y).ticks(5));

            // 繪製 Bar
            svg
                .selectAll(".bar")
                .data(transactions)
                .enter()
                .append("rect")
                .attr("class", "bar")
                .attr("x", (d) => x(d.date)) // X 位置
                .attr("y", (d) => y(d.transactions)) // Y 位置
                .attr("width", 8) // 每個 bar 寬度
                .attr("height", (d) => height - y(d.transactions)) // 高度
                .attr("fill", "#69b3a2") // 顏色
                .append("title") // 提示文字
                .text((d) => `日期: ${d3.timeFormat("%Y/%m/%d")(d.date)}\n交易量: ${d.transactions}`);
        }

    },
};
</script>

<style>
.chart {
  margin: 20px auto;
}
</style>
