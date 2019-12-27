<template>
    <a-row :gutter="24" style="margin: 0px">
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <div class="monthly_inspection">
                <div class="monthly_inspection_left">
                    <p>今日累计产煤</p>
                    <p>{{this.todayOutput}}吨</p>
                    <ul>
                        <li>
                            <div style="border-right: 1px solid #eceff4">
                                <p>夜班</p>
                                <p>{{this.eveningOutput}}吨</p>
                            </div>
                        </li>
                        <li>
                            <div style="border-right: 1px solid #eceff4">
                                <p>早班</p>
                                <p>{{this.morningOutput}}吨</p>
                            </div>
                        </li>
                        <li>
                            <div>
                                <p>中班</p>
                                <p>{{this.noonOutput}}吨</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="monthly_inspection_right">
                    <p>最近15日产煤趋势</p>
                    <Near15DayChart></Near15DayChart>
                </div>
            </div>
        </a-col>
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <div class="monthlyCoalProductionTrend">
                <div class="monthlyCoalProductionTrend_left">
                    <p>本月累计产煤</p>
                    <p>{{this.totalOutputs}}吨</p>
                    <ul>
                        <li>
                            <div style="border-right: 1px solid #eceff4">
                                <p>掘进产煤</p>
                                <p>{{this.drivingOutput}}吨</p>
                            </div>
                        </li>
                        <li>
                            <div >
                                <p>回采产煤</p>
                                <p>{{this.miningOutput}}吨</p>
                            </div>
                        </li>
                    </ul>
                </div>
                <div class="monthlyCoalProductionTrend_right">
                    <p>月度产煤趋势</p>
                    <MonthlyCoalProductionTrend></MonthlyCoalProductionTrend>
                </div>
            </div>
        </a-col>
    </a-row>
</template>

<script>
    import {Row, Col, Divider} from 'ant-design-vue'
    import Near15DayChart from './Near15DayChart'
    import MonthlyCoalProductionTrend from './MonthlyCoalProductionTrend'
    import http from '../../../utils/http'

    const dataUrl = {
        getToday: '/api/statistic-output/getToday',//今日累计产煤
        getThisMonth:'/api/statistic-output/getThisMonth',//本月累计产煤
    }
    export default {
        name: "ChartTwo",
        components: {
            Near15DayChart,
            MonthlyCoalProductionTrend,
            ARow: Row,
            ACol: Col,
            ADivider: Divider,
        },
        data() {
            return {
                todayOutput: 0,
                morningOutput: 0,
                noonOutput: 0,
                eveningOutput: 0,
                totalOutputs: 0,//本月累计产煤
                drivingOutput: 0,
                miningOutput: 0
            }
        },
        mounted() {
            this.getToday()
            this.getThisMonth()
        },
        methods: {
            getToday() {
                http.post(dataUrl.getToday).then(res => {
                    if (res.state) {
                        if (res.data){
                            this.todayOutput = res.data.todayOutput ? res.data.todayOutput : 0;
                            this.morningOutput = res.data.morningOutput ? res.data.morningOutput : 0;
                            this.noonOutput = res.data.noonOutput ? res.data.noonOutput : 0;
                            this.eveningOutput = res.data.eveningOutput ? res.data.eveningOutput : 0;
                        }
                    }
                })
            },
            getThisMonth(){
                http.post(dataUrl.getThisMonth).then(res => {
                    if (res.state) {
                        if (res.data){
                            this.totalOutputs = res.data.totalOutput ? res.data.totalOutput : 0;
                            this.drivingOutput = res.data.drivingOutput ? res.data.drivingOutput : 0;
                            this.miningOutput = res.data.miningOutput ? res.data.miningOutput : 0;
                        }
                    }
                })
            }
        }
    }
</script>

<style scoped>
    .monthly_inspection {
        height: 360px;
        width: 100%;
        background: #ffffff;
        margin-top: 24px;
    }

    .monthly_inspection_left {
        width: 26%;
        height: 268px;
        border: 1px solid #e1e4ea;
        position: absolute;
        bottom: 30px;
        left: 30px;
    }

    .monthly_inspection_left p:nth-child(1) {
        text-align: center;
        color: #333333;
        font-size: 14px;
        margin-top: 4vh;
    }

    .monthly_inspection_left p:nth-child(2) {
        text-align: center;
        color: #4390ff;
        font-size: 18px;
        font-weight: bold;
    }

    .monthly_inspection_left ul {
        list-style: none;
        position: absolute;
        width: 11vw;
        bottom: 1vh;
    }

    .monthly_inspection_left ul li {
        float: left;
        width: 33%;
        color: #333333;
    }

    .monthly_inspection_left ul li div p {
        color: #333333 !important;
    }

    .monthly_inspection_right {
        width: 70%;
        height: 100%;
        float: right;
    }

    .monthly_inspection_right p {
        padding-left: 5px;
        margin-top: 10px;
        font-size: 14px;
        color: #333333;
        font-weight: bold;
        border-left: 4px solid #4390ff;
        font-family: "Microsoft YaHei";
    }

    .monthlyCoalProductionTrend {
        height: 360px;
        width: 100%;
        background: #ffffff;
        margin-top: 24px;
    }

    .monthlyCoalProductionTrend_left {
        width: 26%;
        height: 268px;
        border: 1px solid #e1e4ea;
        position: absolute;
        bottom: 30px;
        left: 30px;
    }

    .monthlyCoalProductionTrend_left p:nth-child(1) {
        text-align: center;
        color: #333333;
        font-size: 14px;
        margin-top: 4vh;
    }

    .monthlyCoalProductionTrend_left p:nth-child(2) {
        text-align: center;
        color: #4390ff;
        font-size: 18px;
        font-weight: bold;
    }

    .monthlyCoalProductionTrend_left ul {
        list-style: none;
        position: absolute;
        width: 11vw;
        bottom: 1vh;
    }

    .monthlyCoalProductionTrend_left ul li {
        float: left;
        width: 50%;
        color: #333333;
    }

    .monthlyCoalProductionTrend_left ul li div p {
        color: #333333 !important;
    }

    .monthlyCoalProductionTrend_right {
        width: 70%;
        height: 100%;
        float: right;
    }

    .monthlyCoalProductionTrend_right p {
        padding-left: 5px;
        margin-top: 10px;
        font-size: 14px;
        color: #333333;
        font-weight: bold;
        border-left: 4px solid #4390ff;
        font-family: "Microsoft YaHei";
    }
</style>
