<template>
    <a-row :gutter="24" style="margin: 0px">
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <div class="monthly_inspection">
                <div class="monthly_inspection_left" >
                    <a-skeleton v-if="loading" active ></a-skeleton>
                    <div v-else>
                        <p>本月巡检总数</p>
                        <p>{{this.totalNumber}}</p>
                        <ul>
                            <li>
                                <div style="border-right: 1px solid #eceff4">
                                    <p>已整改</p>
                                    <p>{{this.yesNumber}}</p>
                                </div>
                            </li>
                            <li>
                                <div style="border-right: 1px solid #eceff4">
                                    <p>未整改</p>
                                    <p>{{this.noNumber}}</p>
                                </div>
                            </li>
                            <li>
                                <div>
                                    <p>整改率</p>
                                    <p>{{this.rate}}</p>
                                </div>
                            </li>
                        </ul>
                    </div>
                </div>
                <div class="monthly_inspection_right">
                    <p>月度巡检趋势</p>
                    <MonthlyInspectionChart></MonthlyInspectionChart>
                </div>
            </div>
        </a-col>
        <a-col :xl="12" :lg="24" :md="24" :sm="24" :xs="24">
            <div class="completion_schedule">
                <p>工作完成进度</p>
                <WorkProgress></WorkProgress>
            </div>
        </a-col>
    </a-row>
</template>

<script>
    import {Row, Col, Divider,Skeleton,} from 'ant-design-vue';
    import MonthlyInspectionChart from './MonthlyInspectionChart';
    import WorkProgress from './WorkProgress';
    import http from '../../../utils/http';

    const dataUrl = {
        getThisMonthStatusCount: '/api/safe-inspection/getThisMonthStatusCount',//本月巡检总数
    };
    export default {
        name: "ChartOne",
        components: {
            MonthlyInspectionChart,
            WorkProgress,
            ARow: Row,
            ACol: Col,
            ADivider: Divider,
            ASkeleton:Skeleton,
        },
        data() {
            return {
                loading:false,
                totalNumber: 0,//总数
                noNumber: 0,
                yesNumber: 0,
                rate: 0,
            }
        },
        mounted() {
            this.getThisMonthStatusCount()
        },
        methods: {
            getThisMonthStatusCount() {
                this.loading = true;
                http.post(dataUrl.getThisMonthStatusCount,{}).then(res => {
                    if (res.state) {
                        if (res.data) {
                            this.totalNumber = res.data.totalNumber ? res.data.totalNumber : 0;//总数
                            this.noNumber = res.data.noNumber ? res.data.noNumber : 0;
                            this.yesNumber = res.data.yesNumber ? res.data.yesNumber : 0;
                            this.rate = res.data.rate ? res.data.rate : 0;
                            this.loading = false;
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

    .completion_schedule {
        height: 360px;
        width: 100%;
        background: #ffffff;
        margin-top: 24px;
    }

    .completion_schedule p {
        padding-left: 5px;
        margin-top: 10px;
        font-size: 14px;
        margin-left: 20px;
        float: left;
        color: #333333;
        font-weight: bold;
        border-left: 4px solid #4390ff;
        font-family: "Microsoft YaHei";
    }
</style>
