<template>
    <a-skeleton :loading="loading" :paragraph="{rows: 8}">
        <div id="Near15DayChartThree">
        </div>
    </a-skeleton>
</template>

<script>
    import {Skeleton} from 'ant-design-vue'
    import G2 from '@antv/g2'
    import DataSet from '@antv/data-set'
    import http from '../../../utils/http'

    const dataUrl = {
        getNear15Day: '/api/statistic-length/getNear15Day',//获取最近15日产煤趋势
    };
    export default {
        name: 'Near15DayChart',
        components: {
            ASkeleton: Skeleton
        },
        mounted() {
            this.loader()
        },
        data() {
            return {
                loading: true,
                chart: null,
                data: [],
                arrDate: [],
            }
        },
        methods: {
            loader() {
                this.loading = true;
                http.post(dataUrl.getNear15Day,).then(res => {
                    if (res.state) {
                        let dataTime = []; //创建空数组，用来存储遍历出来的时间
                        let arrDate = [];//创建空数组，用来存储遍历出来需要用的时间数组
                        let data = [];
                        if (res.data) {
                            res.data.forEach(e => {
                                for (let i in e) {
                                    dataTime.push(i)
                                }
                            });
                            //去重
                            for (let j in dataTime) {
                                if (arrDate.indexOf(dataTime[j]) === -1) {
                                    arrDate.push(dataTime[j]);
                                }
                            }
                            arrDate.splice(0, 1);//去掉name元素
                            data = res.data
                        }
                        this.loading = false;
                        this.arrDate = arrDate;
                        this.data = data
                    }
                }).then(() => {
                    if (!this.loading) {
                        this.initChart()
                    }
                })
            },
            initChart() {
                if (this.chart) {
                    this.chart.destroy()
                }
                let ds = new DataSet();//引入官方组件，对数据进行加工 npm install @antv/data-set
                let dv = ds.createView().source(this.data);
                dv.transform({
                    type: 'fold',
                    fields: this.arrDate, // 展开字段集
                    key: 'month', // key字段
                    value: 'value' // value字段
                });

                var chart = new G2.Chart({
                    container: 'Near15DayChartThree',
                    forceFit: true,
                    height: 350
                });
                chart.source(dv);
                chart.line().position('month*value').color('name', ['#fd4b6d', '#6753e8']);
                chart.point().position('month*value').color('name', ['#fd4b6d', '#6753e8']).size(4).shape('circle').style({
                    stroke: '#fff',
                    lineWidth: 1
                });
                chart.legend({
                    position: 'top-center'
                });
                chart.render();
                this.chart = chart
            }
        }
    }
</script>

<style>

</style>
