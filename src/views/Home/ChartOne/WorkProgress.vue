{
<template>
    <div>
        <div class="workChange">
            <ul>
                <li
                        v-for="(item,index) in workMenuData"
                        :key="index"
                        @click="workMenuChange(index)"
                        :class="{'active':selectId === index}"
                >{{item.name}}
                </li>
            </ul>
        </div>
        <div class="workProgress">
            <ul>
                <li v-for="(item,index) in workProgressData" :key="index">
                    <p>
                        {{item.workName}}：全长{{item.totalLength}}米，完成{{item.progressUsePercent}}，剩余{{item.leftLength}}米</p>
                    <div class="progressBg">
                        <ul>
                            <li v-for="(items,index) in progressBgData" :key="index"></li>
                            <ul class="progressWidth" v-bind:style="{width: parseFloat(item.progress*100) + '%' }">
                                <li v-for="(itemss,index) in progressBgData" :key="index"
                                    style="background: #27c6db"></li>
                            </ul>
                        </ul>
                    </div>
                </li>
            </ul>
        </div>
    </div>
</template>

<script>
    import {Progress} from 'ant-design-vue'
    import http from '../../../utils/http'

    const dataUrl = {
        getDrivingFaceWorkProgress: '/api/produce-driving-face/getWorkProgress',//获取掘进工作面
        getBackMiningFaceWorkProgress: '/api/produce-back-mining-face/getWorkProgress',//获取采面工作面
    };
    export default {
        name: "WorkProgress",
        components: {
            AProgress: Progress,
        },
        data() {
            return {
                selectId: 0,
                index: 0,
                workName: null,//	工作名称
                totalLength: 0,//	总长度
                doneLength: 0,//	已完成长度
                progress: 0,//完成进度，小数表示，保留两位有效小数位。
                progressUsePercent: null,//	完成进度，百分数表示
                workProgressData: [],
                progressBgData: [],
                progressWidth: {},
                workMenuData: [{
                    id: 0,
                    name: '掘进工作'
                }, {
                    id: 1,
                    name: '采煤工作面'
                },],
            }
        },
        mounted() {
            this.initWorkProgress()
        },
        methods: {
            //工作面选择
            workMenuChange(index) {
                this.selectId = index;
                this.initWorkProgress()
            },
            initWorkProgress() {
                let arr = []
                for (let i = 1; i <= 50; i++) {
                    arr.push(i)
                }
                this.progressBgData = arr;
                if (this.selectId === 0) {
                    http.post(dataUrl.getDrivingFaceWorkProgress).then(res => {
                        if (res.state) {
                            if (res.data) {
                                let data = [];
                                res.data.forEach(e => {
                                    data.push({
                                        workName: e.workName ? e.workName : null,//	工作名称
                                        totalLength: e.totalLength ? e.totalLength : 0,//	总长度
                                        doneLength: e.doneLength ? e.doneLength : 0,//	已完成长度
                                        leftLength: e.leftLength ? e.leftLength : 0,//剩余长度
                                        progress: e.progress ? e.progress : 0,//完成进度，小数表示，保留两位有效小数位。
                                        progressUsePercent: e.progressUsePercent ? e.progressUsePercent : 0,//	完成进度，百分数表示
                                    });
                                    this.progressWidth = {
                                        width: parseFloat(e.progress * 100) + '%'
                                    }
                                });
                                this.workProgressData = data
                            }
                        }
                    })
                } else if (this.selectId === 1) {
                    http.post(dataUrl.getBackMiningFaceWorkProgress).then(res => {
                        if (res.state) {
                            if (res.data) {
                                let data = [];
                                res.data.forEach(e => {
                                    data.push({
                                        workName: e.workName ? e.workName : null,//	工作名称
                                        totalLength: e.totalLength ? e.totalLength : 0,//	总长度
                                        doneLength: e.doneLength ? e.doneLength : 0,//	已完成长度
                                        leftLength: e.leftLength ? e.leftLength : 0,//剩余长度
                                        progress: e.progress ? e.progress : 0,//完成进度，小数表示，保留两位有效小数位。
                                        progressUsePercent: e.progressUsePercent ? e.progressUsePercent : 0,//	完成进度，百分数表示
                                    })
                                });
                                this.workProgressData = data
                            }
                        }
                    })
                }
            }
        }

    }
</script>

<style scoped>
    .active {
        color: #ffffff;
        background: #2d83ff;
    }

    .progressWidth {
        position: absolute;
        width: 0%;
        height: 23px;
        overflow: hidden;
    }

    .workChange {
        position: absolute;
        right: 30px;
        top: 30px;
        width: 40%;
    }

    .workChange ul {
        list-style: none;
        width: 100%;
    }

    .workChange ul li {
        float: left;
        width: 33%;
        height: 30px;
        line-height: 30px;
        text-align: center;
        border: 1px solid #dedede;
        cursor: pointer;
        font-size: 0.7vw;
    }

    .workChange ul li:nth-child(1) {
        border-top-left-radius: 15px;
        border-bottom-left-radius: 15px;
    }

    .workChange ul li:nth-child(2) {
        border-top-right-radius: 15px;
        border-bottom-right-radius: 15px;
    }

    .workProgress {
        width: 90%;
        height: 285px;
        left: 50%;
        position: absolute;
        top: 8vh;
        margin-left: -45%;
        overflow: auto;
    }

    .workProgress ul {
        list-style: none;
        margin: 0px;
        padding: 0px;
        color: #666666;
    }

    .workProgress ul li {
        width: 100%;
        height: 50px;
        margin-bottom: 3vh;
        overflow: hidden;
    }

    .workProgress ul li p {
        margin: 0px;
    }

    .progressBg {
        width: 100%;
        height: 23px;
    }

    .progressBg ul li:nth-child(1) {
        margin-left: 0px;
    }

    .progressBg ul li {
        width: 0.6vw;
        height: 23px;
        float: left;
        margin-left: 0.1vw;
        background: #e1e4ea;
    }
</style>
