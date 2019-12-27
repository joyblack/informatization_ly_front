<template>
    <a-row :gutter="24" style="margin: 0px">
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <div class="monthly_inspection">
                <div class="monthly_inspection_left">
                    <div class="driving">
                        <p>今日累计掘进</p>
                        <p>{{this.tunnelling.todayLength}}米</p>
                        <ul>
                            <li>
                                <div style="border-right: 1px solid #eceff4">
                                    <p>夜班</p>
                                    <p>{{this.tunnelling.eveningLength}}米</p>
                                </div>
                            </li>
                            <li>
                                <div style="border-right: 1px solid #eceff4">
                                    <p>早班</p>
                                    <p>{{this.tunnelling.morningLength}}米</p>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>中班</p>
                                    <p>{{this.tunnelling.noonLength}}米</p>
                                </div>
                            </li>
                        </ul>
                        <span></span>
                    </div>
                    <div class="stoping">
                        <p>
                            今日累计回采
                        </p>
                        <p>{{this.extraction.todayLength}}米</p>
                        <ul>
                            <li>
                                <div style="border-right: 1px solid #eceff4">
                                    <p>夜班</p>
                                    <p>{{this.extraction.eveningLength}}米</p>
                                </div>
                            </li>
                            <li>
                                <div style="border-right: 1px solid #eceff4">
                                    <p>早班</p>
                                    <p>{{this.extraction.morningLength}}米</p>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>中班</p>
                                    <p>{{this.extraction.noonLength}}米</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="monthly_inspection_right">
                    <p>最近15日掘进回采趋势</p>
                    <Near15DayChart></Near15DayChart>
                </div>
            </div>
        </a-col>
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <div class="monthlyCoalProductionTrend">
                <div class="monthlyCoalProductionTrend_left">
                    <div>
                        <p>本月累计掘进</p>
                        <p>{{this.drivingLength}}米</p>
                    </div>
                    <div>
                        <p>本月累计回采</p>
                        <p>{{this.miningLength}}米</p>
                    </div>
                </div>
                <div class="monthlyCoalProductionTrend_right">
                    <p>月度掘进回采趋势</p>
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
        getToday: '/api/statistic-length/getToday',//今日累计掘进、回采
        getThisMonth:'/api/statistic-length/getThisMonth'//本月累计掘进回采
    }
    export default {
        name: "ChartThree",
        components: {
            Near15DayChart,
            MonthlyCoalProductionTrend,
            ARow: Row,
            ACol: Col,
            ADivider: Divider,
        },
        data() {
            return {
                tunnelling: {
                    todayLength: 0,
                    morningLength: 0,
                    noonLength: 0,
                    eveningLength: 0
                },
                extraction: {
                    todayLength: 0,
                    morningLength: 0,
                    noonLength: 0,
                    eveningLength: 0
                },
                drivingLength: 0,
                miningLength: 0,
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
                        if (res.data) {
                            res.data.forEach(r => {
                                if (r.name === "掘进") {
                                    this.tunnelling = {
                                        todayLength: r.todayLength ? r.todayLength : 0,
                                        morningLength: r.morningLength ? r.morningLength : 0,
                                        noonLength: r.noonLength ? r.noonLength : 0,
                                        eveningLength: r.eveningLength ? r.eveningLength : 0,
                                    };
                                } else {
                                    this.extraction = {
                                        todayLength: r.todayLength ? r.todayLength : 0,
                                        morningLength: r.morningLength ? r.morningLength : 0,
                                        noonLength: r.noonLength ? r.noonLength : 0,
                                        eveningLength: r.eveningLength ? r.eveningLength : 0,
                                    };
                                }
                            })
                        }
                    }
                })
            },
            getThisMonth(){
                http.post(dataUrl.getThisMonth).then(res=>{
                    if (res.state){
                        if (res.data){
                            this.drivingLength= res.data.drivingLength ? res.data.drivingLength :0;
                            this.miningLength= res.data.miningLength ? res.data.miningLength :0;
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

    .monthly_inspection_left .driving {
        height: 50%;
    }

    .driving span {
        width: 80%;
        height: 1px;
        border-top: 1px solid #e1e4ea;
        display: inline-block;
        position: relative;
        left: 50%;
        margin-left: -40%;
        top: 1vh;
    }

    .monthly_inspection_left p:nth-child(1) {
        text-align: center;
        color: #333333;
        font-size: 14px;
        margin-top: 1vh;
        margin-bottom: 0px;
    }

    .monthly_inspection_left p:nth-child(2) {
        text-align: center;
        color: #4390ff;
        font-size: 18px;
        font-weight: bold;
        margin-bottom: 0px;
    }

    .monthly_inspection_left ul {
        list-style: none;
        width: 11vw;
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
