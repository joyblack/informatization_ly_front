<template>
    <a-skeleton :loading="loading" :paragraph="{rows: 8}">
        <div id="MonthlyInspectionChart">
        </div>
    </a-skeleton>
</template>

<script>
    import {Skeleton} from 'ant-design-vue'
    import G2 from '@antv/g2/build/g2'
    import http from '../../../utils/http'

    const dataUrl = {
        getPerMonthTotalCount: '/api/safe-inspection/getPerMonthTotalCount'
    };

    export default {
        name: "MonthlyInspectionChart",
        components: {ASkeleton: Skeleton},
        data() {
            return {
                loading: false,
                data: [],
                chart: null,

            }
        },
        mounted() {
            this.getPerMonthTotalCount()
        },
        methods: {
            getPerMonthTotalCount() {
                this.loading = true;
                http.post(dataUrl.getPerMonthTotalCount).then(res => {
                    if (res.state) {
                        let data = [];
                        if (res.data) {
                            res.data.forEach(e => {
                                data.push({
                                    ct: e.ct ? e.ct : null,
                                    month: e.month ? e.month : null,
                                    name: "巡检总数",
                                })
                            })
                        }
                        this.loading = false;
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
                const chart = new G2.Chart({
                    container: 'MonthlyInspectionChart',
                    forceFit: true,
                    height: 350
                });
                chart.clear();
                chart.source(this.data);
                chart.scale('ct', {
                    tickInterval: 20,
                    alias: '巡检数'
                });
                chart.interval().position('month*ct').color("name");
                chart.legend({
                    position: 'top-center'
                });
                chart.render();
                this.chart = chart
            }
        }

    }
</script>

<style scoped>

</style>
