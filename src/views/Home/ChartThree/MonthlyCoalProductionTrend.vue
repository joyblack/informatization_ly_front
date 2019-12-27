<template>
    <div id="MonthlyCoalProductionTrendThree" class="monthlyCoalProductionTrendThree">
    </div>
</template>

<script>
    import {} from 'ant-design-vue'
    import echarts from 'echarts'
    import http from '../../../utils/http'

    const dataUrl = {
        getEveryMonth: '/api/statistic-length/getEveryMonth',//月度掘进回采趋势
    }

    export default {
        name: "MonthlyCoalProductionTrend",
        components: {},
        data() {
            return {
                chart: null,
                drivingData: [],//今年掘进
                miningData: [],//今年回采
                lastYearDrivingData:[],//去年掘进
                lastYearMiningData:[],//去年回采
                arrMonth: [],
            }
        },
        mounted() {
            this.initData()
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
                let myChart3 = echarts.init(document.getElementById('MonthlyCoalProductionTrendThree'));
                // 绘制图表
                myChart3.setOption({
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
                        data: ['今年掘进', '去年掘进', '今年回采', '去年回采']
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
                            name: 'm',
                            min: 0,
                        },

                    ],
                    series: [
                        {
                            name: '今年掘进',
                            type: 'bar',
                            color: '#4cc971',
                            data: this.drivingData
                        },
                        {
                            name: '去年掘进',
                            type: 'bar',
                            color: '#3aa1ff',
                            data: this.lastYearDrivingData
                        },
                        {
                            name: '今年回采',
                            type: 'line',
                            color: '#6753e8',
                            data: this.miningData
                        },
                        {
                            name: '去年回采',
                            type: 'line',
                            color: '#fd4b6d',
                            data: this.lastYearMiningData
                        }
                    ]
                });
                window.addEventListener("resize", function(){
                    myChart3.resize();
                })
            }
        }

    }
</script>

<style scoped>
    .monthlyCoalProductionTrendThree {
        width: 100%;
        height: 90%;
    }
</style>
