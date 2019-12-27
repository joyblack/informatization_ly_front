<template>
    <div id="MonthlyCoalProductionTrend" class="MonthlyCoalProductionTrend">
    </div>
</template>

<script>
    import {} from 'ant-design-vue'
    import echarts from 'echarts'
    import http from '../../../utils/http'

    const dataUrl = {
        getEveryMonth: '/api/statistic-output/getEveryMonth',//获取月产煤趋势
    }

    export default {
        name: "MonthlyCoalProductionTrend",
        components: {},
        data() {
            return {
                chart: null,
                drivingData: [],
                miningData: [],
                lastYearData:[],
                arrMonth: [],
            }
        },
        mounted() {
            this.initData();
        },
        methods: {
            initData() {
                http.post(dataUrl.getEveryMonth,).then(res => {
                    if (res.state) {
                        let drivingData = [];//掘进
                        let miningData = [];//回采
                        let arrMonth = [];//创建空数组，存入月份
                        if (res.data) {
                            //遍历掘进工作面
                            res.data.driving.forEach(e => {
                                arrMonth.push(e.month)
                                drivingData.push(e.value)
                            });
                            //遍历回采工作面
                            res.data.mining.forEach(e => {
                                miningData.push(e.value)
                            })
                        }
                        this.arrMonth = arrMonth; //月份
                        this.drivingData = drivingData;//掘进数据
                        this.miningData = miningData;//回采数据
                    }
                }).then(() => {
                    this.initChart()
                })
            },
            initChart() {
                // 基于准备好的dom，初始化echarts实例
                let myChart2 = echarts.init(document.getElementById('MonthlyCoalProductionTrend'));
                // 绘制图表
                myChart2.setOption({
                    tooltip: {
                        trigger: 'axis',
                        axisPointer: {
                            type: 'cross',
                            crossStyle: {
                                color: '#999'
                            }
                        }
                    },
                    legend: {
                        data: ['掘进', '回采', '去年同比']
                    },
                    xAxis: [
                        {
                            type: 'category',
                            data: this.arrMonth,
                            axisPointer: {
                                type: 'shadow'
                            }
                        }
                    ],
                    yAxis: [
                        {
                            type: 'value',
                            name: '吨',
                            min: 0,
                        },
                    ],
                    series: [
                        {
                            name: '掘进',
                            type: 'bar',
                            stack: '总量',
                            color: '#27c6db',
                            data: this.drivingData
                        },
                        {
                            name: '回采',
                            type: 'bar',
                            stack: '总量',
                            color: '#3aa1ff',
                            data: this.miningData
                        },
                        {
                            name: '去年同比',
                            type: 'line',
                            color: '#fd4b6d',
                            data: this.lastYearData
                        },
                    ]
                });
                //根据窗口的大小变动图表
                window.addEventListener("resize", function () {
                    myChart2.resize();
                })
            }
        }

    }
</script>

<style scoped>
    .MonthlyCoalProductionTrend {
        width: 100%;
        height: 90%;
    }
</style>
