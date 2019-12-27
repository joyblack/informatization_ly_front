<template>
    <a-row :gutter="24" style="margin: 0px">
        <p style="font-weight: bold;padding-left: 0.9vw;color: #000;">待办事项</p>
        <a-col :sm="24" :md="12" :xl="12">
            <a-card :loading="loading" :bordered="false" class="card-aqyh" >
                <div class="aqyh">
                    <div class="title_right">
                        <p style="margin-left: 6vw;width: 100%;">安全隐患</p>
                    </div>
                    <div class="title_left">
                        <p>{{this.approachRectificationNum}}</p>
                        <p>临近整改期</p>
                    </div>
                    <div class="details_bottom" @click="security">
                        <span>详情</span>
                        <a-icon type="right-circle"/>
                    </div>
                </div>
            </a-card>
        </a-col>
        <a-col :sm="24" :md="12" :xl="12">
            <a-card :loading="loading" :bordered="false" class="card-zzxx">
                <div class="zzxx">
                    <div class="title_right">
                        <p style="margin-left: 6vw;width: 100%;">证照信息</p>
                    </div>
                    <div class="title_left">
                        <p>{{this.documentLicenceApproachNum}}</p>
                        <p>临近有效期</p>
                    </div>
                    <div class="details_bottom" style="background: #8d7ef5" @click="licenceList">
                        <span>详情</span>
                        <a-icon type="right-circle"/>
                    </div>
                </div>
            </a-card>
        </a-col>
    </a-row>
</template>

<script>
    import {Row, Col, Card, Icon, message} from 'ant-design-vue';
    import http from "../../../utils/http";

    const dataUrl = {
        getApproachRectificationNum: '/api/safe-inspection/getApproachRectificationNum',//安全隐患
        getPagerApproachRectification: '/api/safe-inspection/getPagerApproachRectification',//安全隐患详情跳转

        getDocumentLicenceApproachNum: '/api/document-licence/getApproachNum',//证照信息
        getApproach: '/api/document-licence/getApproach'
    };
    export default {
        name: "ToDoItems",
        components: {
            ARow: Row,
            ACol: Col,
            ACard: Card,
            AIcon: Icon,
        },
        data() {
            return {
                loading: false,
                approachRectificationNum: 0,//安全隐患
                documentLicenceApproachNum: 0,//证照信息
                baseBreadcrumb: [{
                    key: '1',
                    icon: 'home',
                    title: null,
                    name: 'home'
                }],
            }
        },
        mounted() {
            this.getApproachRectificationNum();
            this.getDocumentLicenceApproachNum();
        },
        methods: {
            //获取安全隐患
            getApproachRectificationNum() {
                this.loading = true;
                http.post(dataUrl.getApproachRectificationNum).then(res => {
                    if (res.state) {
                        this.approachRectificationNum = res.data ? res.data : 0;
                        this.loading = false
                    }
                })
            },
            //获取证照信息
            getDocumentLicenceApproachNum() {
                this.loading = true;
                http.post(dataUrl.getDocumentLicenceApproachNum).then(res => {
                    if (res.state) {
                        this.documentLicenceApproachNum = res.data ? res.data : 0;
                        this.loading = false
                    }
                })
            },
            //临近整改期详情跳转
            security() {
                if (this.$store.state.components.indexOf('security') > -1 && this.$store.state.components.indexOf('inspection') > -1) {
                    if (this.approachRectificationNum > 0) {
                        let details = true;
                        this.$router.push({name: 'inspectionList', params: {details: details}});
                        let data = this.baseBreadcrumb;
                        let arr = [{key: '2', title: '安全管理'}, {key: '3', title: '安全巡检', name: 'inspection'}];
                        data = data.concat(arr);
                        this.$store.dispatch('changeBreadcrumbFun', data)//面包屑切换
                    }
                } else {
                    message.warning("该账号暂无安全巡检页面权限！")
                }
            },
            //证照信息详情跳转
            licenceList() {
                if (this.$store.state.components.indexOf('material') > -1 && this.$store.state.components.indexOf('licence') > -1) {
                    if (this.documentLicenceApproachNum > 0) {
                        let details = true;
                        this.$router.push({name: 'licenceList', params: {details: details}});
                        let data = this.baseBreadcrumb;
                        let arr = [{key: '2', title: '资料管理'}, {key: '3', title: '证照信息', name: 'licence'}];
                        data = data.concat(arr);
                        this.$store.dispatch('changeBreadcrumbFun', data)//面包屑切换
                    }
                } else {
                    message.warning("该账号暂无证照信息页面权限！")
                }
            },
        },
    }
</script>

<style scoped>
    .card-aqyh{
        background:url('../../../assets/bj_1.jpg');
        background-repeat:no-repeat;
        background-size: 100% 100%;
        height: 190px;
    }
    .card-zzxx{
        background:url('../../../assets/bj_2.jpg');
        background-repeat:no-repeat;
        background-size: 100% 100%;
        height: 190px;
    }
    .aqyh .title_right {
        background: url("../../../assets/aq_1.png");
        background-repeat: no-repeat;
    }


    .zzxx .title_right {
        background: url("../../../assets/zj_1.png");
        background-repeat: no-repeat;
    }

    .zljy .title_right {
        background: url("../../../assets/zljy.png");
        background-repeat: no-repeat;
    }

    .title_right {
        width: 82px;
        height: 82px;
        text-align: center;
        line-height: 82px;
        position: absolute;
        top: 4vh;
        color: #eceff4;
        font-size: 16px;
        font-family: "Microsoft YaHei";
        font-weight: bold;
    }

    .title_left {
        position: absolute;
        right: 2vw;
        top: 5vh;
        color: #eceff4;
    }

    .title_left p:nth-child(1) {
        font-size: 24px;
        font-family: "Microsoft YaHei";
        font-weight: bold;
        margin: 0px;
    }

    .title_left p:nth-child(2) {
        font-size: 14px;
        font-family: "Microsoft YaHei";
    }

    .details_bottom {
        position: absolute;
        cursor: pointer;
        bottom: 0px;
        left: 0px;
        height: 40px;
        background: #4ca7ee;
        width: 100%;
        color: #eceff4;
    }

    .details_bottom span {
        float: left;
        line-height: 40px;
        margin-left: 2vw;
    }

    .details_bottom i {
        float: right;
        line-height: 40px;
        margin-right: 2vw;
    }
</style>
