<template>
    <!--    钻孔工作-打钻分析-->
    <a-form :form="form" :style="{ marginTop: '8px' }">
        <!--        //基础信息-->
        <DrillingAnalysisBasic ref="DrillingAnalysisBasicChild"></DrillingAnalysisBasic>
        <a-card title="钻孔详情" style="margin-top: 25px">
            <a-table
                    :columns="columns"
                    :dataSource="data"
                    :pagination="false"
                    :loading="memberLoading"
                    bordered
            >
                <template slot="completeTime" slot-scope="text, record,index">
                    <a-date-picker
                            :value="text"
                            @change="e => completeTimeChange(e, record.key)"
                            :disabledDate="disabledDate"
                    />
                </template>
                <template slot="realLength" slot-scope="text, record">
                    <a-input-number
                            :min="0"
                            :value="text"
                            :style="{minWidth:'190px'}"
                            @change="e => realLengthChange(e, record.key)"
                    />
                </template>
                <template slot="operation" slot-scope="text, record, index">
                    <div class="editable-row-operations">
                        <a @click="() => save(record)">保存</a>
                    </div>
                </template>
            </a-table>
        </a-card>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' style="margin-top: 4vh">
            <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10"></a-col>
            <a-col :xs="20" :sm="16" :md="12" :lg="8" :xl="4">
                <a-button type="primary" @click="cancel">返回</a-button>
            </a-col>
            <a-col :xs="2" :sm="4" :md="6" :lg="8" :xl="10"></a-col>
        </a-row>
    </a-form>
</template>

<script>
    import {
        Form,
        Row,
        Col,
        InputNumber,
        Card,
        Table,
        Divider,
        Button,
        Popconfirm,
        Input,
        DatePicker,
        message
    } from 'ant-design-vue'
    import DrillingAnalysisBasic from './DrillingAnalysisBasic/DrillingAnalysisBasic'
    import http from '../../../../../utils/http'
    import TableUtil from '../../../../../utils/TableUtil'
    import moment from 'moment'

    const dataUrl = {
        getAllByDrillWorkId: '/api/produce-drill-hole/getAllByDrillWorkId',//获取钻孔详情数据
        getDrillUpdate: '/api/produce-drill-hole/update',//钻孔详情单条编辑
    };
    const columns = [{
        title: '序号',
        dataIndex: 'key',
        align: 'center'
    }, {
        title: '钻孔编号',
        dataIndex: 'code',
        align: 'center',
    },
        {
            title: '倾角（°）',
            dataIndex: 'dipAngle',
            align: 'center',
        },
        {
            title: '夹角（°）',
            dataIndex: 'intersectionAngle',
            align: 'center',
        },
        {
            title: '钻孔设计长度（m）',
            dataIndex: 'totalLength',
            align: 'center',
        },
        {
            title: '成孔日期',
            dataIndex: 'completeTime',
            align: 'center',
            scopedSlots: {customRender: 'completeTime'}
        },
        {
            title: '钻孔实际长度(m)',
            dataIndex: 'realLength',
            align: 'center',
            scopedSlots: {customRender: 'realLength'}
        },
        {
            title: '操作',
            dataIndex: 'operation',
            align: 'center',
            scopedSlots: {customRender: 'operation'},
        },
    ];
    const dataMapping = {
        'id': 'String',
        'code': 'String',
        'dipAngle': 'String',//
        'intersectionAngle': 'String',//
        'completeTime': 'Date',
        'totalLength': 'String',//
        'realLength': 'String',
    };
    export default {
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        name: "DrillingAnalysis",
        components: {
            DrillingAnalysisBasic,
            AForm: Form,
            ACard: Card,
            ARow: Row,
            ACol: Col,
            ATable: Table,
            AInputNumber: InputNumber,
            ADivider: Divider,
            AButton: Button,
            APopconfirm: Popconfirm,
            AInput: Input,
            ADatePicker: DatePicker,
            ADatePickerRangePicker: DatePicker.RangePicker,
        },
        data() {
            return {
                id: this.$route.params.id,
                memberLoading: false,
                inputDisabled: true,
                columns,
                data: [],

            }
        },
        mounted() {
            this.initTableData()
        },
        methods: {
            //加载表格数据
            initTableData() {
                this.memberLoading = true;
                if (this.id) {
                    http.post(dataUrl.getAllByDrillWorkId, {
                        id: this.id
                    }).then((res => {
                        if (res.state) {
                            if (res.data) {
                                let newData = [];
                                res.data.forEach(e => {
                                    newData.push({
                                        id: e.id,
                                        code: e.code,
                                        key: e.key,
                                        completeTime: e.completeTime ? moment(e.completeTime, 'YYYY-MM-DD') : null,
                                        realLength: e.realLength,
                                        totalLength: e.totalLength,
                                        intersectionAngle: e.intersectionAngle,
                                        dipAngle: e.dipAngle,
                                    })
                                });
                                this.data = TableUtil.formatData(newData, dataMapping);
                                this.memberLoading = false
                            }

                        } else {
                            message.warning(res.message)
                        }
                    }))
                }
            },
            //日期限制禁选
            disabledDate(current) {
                return current && current > moment();
            },
            //成孔日期选择
            completeTimeChange(value, key) {
                const newData = [...this.data];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target.completeTime = value;
                    this.data = newData
                }
            },
            //钻孔实际长度
            realLengthChange(value, key) {
                const newData = [...this.data];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target.realLength = value;
                    this.data = newData;
                }
            },
            save(record) {
                const newData = [...this.data];
                const target = newData.filter(item => record.key === item.key)[0];
                if (target) {
                    http.post(dataUrl.getDrillUpdate, {
                        id: record.id,
                        code: record.code,
                        orderNumber: record.key,
                        completeTime: record.completeTime && record.completeTime instanceof moment ? record.completeTime.format('YYYY-MM-DD') : null,
                        realLength: record.realLength,
                        totalLength: record.totalLength,
                        intersectionAngle: record.intersectionAngle,
                        dipAngle: record.dipAngle,
                    }).then(res => {
                        if (res.state) {
                            message.success(res.message);
                            this.$refs.DrillingAnalysisBasicChild.loader();
                            delete target.editable;
                            this.data = newData;
                        } else {
                            message.warning(res.message)
                        }
                    })
                }
            },
            //取消
            cancel() {
                this.$router.push({name: 'drillingList'})
            },
        }
    }
</script>

<style scoped>
    .editable-row-operations a {
        margin-right: 8px;
    }
</style>
