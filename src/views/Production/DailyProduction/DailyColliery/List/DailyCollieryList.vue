<template>
    <div>
        <a-form :form="form" :style="{ marginTop: '8px' }">
            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="4" :sm='24'>
                    <a-form-item>
                        <a-date-picker
                                v-decorator="['times',{ initialValue:formData.times,rules:[{ required: true, message: '请选择时间！' }] }]"
                                @change="onChangeTime"
                                :disabledDate="disabledDate"
                                :style="{width: '100%'}"/>
                    </a-form-item>
                </a-col>
                <a-col :md="6" :sm='24'>
                    <a-button icon="download" :style="{marginLeft: '10px'}" @click="exportData">导出</a-button>
                </a-col>
            </a-row>
            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="24" :sm='24'>
                    <!-- 掘进面-->
                    <a-table
                            :columns="drivingStatistic"
                            :dataSource="drivingStatisticData"
                            bordered
                            :pagination="false"
                    >

                    </a-table>
                </a-col>
                <!--                回采面-->
                <a-col :md="24" :sm='24'>
                    <a-table
                            :columns="backMiningStatistic"
                            :dataSource="backMiningStatisticData"
                            bordered
                            :pagination="false"
                            style="margin-top: 5vh"
                    >
                    </a-table>
                </a-col>
            </a-row>
            <!--                钻孔工作-->
            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <!--                <a-col :md="12" :sm='24'>-->
                <!--                    <a-table-->
                <!--                            :columns="drillStatistic"-->
                <!--                            :dataSource="drillStatisticData"-->
                <!--                            bordered-->
                <!--                            :pagination="false"-->
                <!--                            style="margin-top: 5vh"-->
                <!--                    >-->
                <!--                    </a-table>-->
                <!--                </a-col>-->
                <a-col :md="24" :sm='24'>
                    <a-form-item>
                        <span slot="label">
                            备注
                            <span class="gmsj-form-span">
                             （选填）
                            </span>
                        </span>
                        <a-textarea
                                placeholder="请输入备注" :rows="4"
                                v-decorator="['remarks',{ initialValue:formData.remarks,rules: [] }]"
                        />
                    </a-form-item>
                    <div class="preserveBtn">
                        <a-button type="primary" :style="{marginLeft: '10px'}" @click="preserve">保存</a-button>
                    </div>
                </a-col>
            </a-row>

        </a-form>
    </div>
</template>

<script>
    import {Form, Row, Col, Table, Input, Button, Upload, Icon, DatePicker, message} from 'ant-design-vue'
    import TableUtil from '../../../../../utils/TableUtil'
    import http from '../../../../../utils/http'
    import moment from 'moment'

    const dataUrl = {
        getAll: '/api/produce-cm-statistic/getStatisticData',
        exportData: '/api/produce-cm-statistic/exportData',
        setRemarks: '/api/produce-cm-statistic/setRemarks'
    };
    const dataMapping = {
        'id': 'String',
        'workName': 'String',//
        'morningLength': 'String',
        'noonLength': 'String',
        'eveningLength': 'String',
        'shiftTotalLength': 'String',
        'morningPeople': 'String',
        'noonPeople': 'String',
        'eveningPeople': 'String',
        'shiftTotalPeople': 'String',
        'dayOutput': 'String',
        'monthOutput': 'String',
        'monthLength': 'String',
    };
    //掘进面
    const drivingStatistic = [{
        title: '掘进面名称',
        dataIndex: 'workName',
        align: 'center',
    }, {
        title: '掘进进尺（米）',
        children: [{
            title: '早班',
            dataIndex: 'morningLength',
            align: 'center',
        }, {
            title: '中班',
            dataIndex: 'noonLength',
            align: 'center',
        }, {
            title: '晚班',
            dataIndex: 'eveningLength',
            align: 'center',
        }, {
            title: '日合计',
            dataIndex: 'shiftTotalLength',
            align: 'center',
        }],
    }, {
        title: '月累计进尺（米）',
        dataIndex: 'monthLength',
        align: 'center',
    }, {
        title: '入井人数',
        children: [{
            title: '早班',
            dataIndex: 'morningPeople',
            align: 'center',
        }, {
            title: '中班',
            dataIndex: 'noonPeople',
            align: 'center',
        }, {
            title: '晚班',
            dataIndex: 'eveningPeople',
            align: 'center',
        }, {
            title: '日合计',
            dataIndex: 'shiftTotalPeople',
            align: 'center',
        }],
    }, {
        title: '今日产煤（吨）',
        dataIndex: 'dayOutput',
        align: 'center',
    }, {
        title: '月累计产煤（吨）',
        dataIndex: 'monthOutput',
        align: 'center',
    }];

    const drillStatistic = [{
        title: '钻孔工作',
        dataIndex: 'workName',
        key: 'workName',
        align: 'center',
    }, {
        title: '打钻进尺（米）',
        children: [{
            title: '早班',
            dataIndex: 'morningLength',
            key: 'morningLength',
            align: 'center',
        }, {
            title: '中班',
            dataIndex: 'noonLength',
            key: 'noonLength',
            align: 'center',
        }, {
            title: '晚班',
            dataIndex: 'eveningLength',
            key: 'eveningLength',
            align: 'center',
        }, {
            title: '日合计',
            dataIndex: 'shiftTotalLength',
            key: 'shiftTotalLength',
            align: 'center',
        }],
    }, {
        title: '月累计进尺（米）',
        dataIndex: 'monthLength',
        key: 'monthLength',
        align: 'center',
    }];

    const backMiningStatistic = [{
        title: '回采面名称',
        dataIndex: 'workName',
        key: 'workName',
        align: 'center',
    }, {
        title: '采煤进尺（米）',
        children: [{
            title: '早班',
            dataIndex: 'morningLength',
            key: 'morningLength',
            align: 'center',
        }, {
            title: '中班',
            dataIndex: 'noonLength',
            key: 'noonLength',
            align: 'center',
        }, {
            title: '晚班',
            dataIndex: 'eveningLength',
            key: 'eveningLength',
            align: 'center',
        }, {
            title: '日合计',
            dataIndex: 'shiftTotalLength',
            key: 'shiftTotalLength',
            align: 'center',
        }],
    }, {
        title: '月累计进尺（米）',
        dataIndex: 'monthLength',
        key: 'monthLength',
        align: 'center',
    }, {
        title: '入井人数',
        children: [{
            title: '早班',
            dataIndex: 'morningPeople',
            key: 'morningPeople',
            align: 'center',
        }, {
            title: '中班',
            dataIndex: 'noonPeople',
            key: 'noonPeople',
            align: 'center',
        }, {
            title: '晚班',
            dataIndex: 'eveningPeople',
            key: 'eveningPeople',
            align: 'center',
        }, {
            title: '日合计',
            dataIndex: 'shiftTotalPeople',
            key: 'shiftTotalPeople',
            align: 'center',
        }],
    }, {
        title: '今日产煤（吨）',
        dataIndex: 'dayOutput',
        key: 'dayOutput',
        align: 'center',
    }, {
        title: '月累计产煤（吨）',
        dataIndex: 'monthOutput',
        key: 'monthOutput',
        align: 'center',
    }];

    export default {
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        name: "DailyCollieryList",
        components: {
            AForm: Form,
            AFormItem: Form.Item,
            ARow: Row,
            ACol: Col,
            ATable: Table,
            AInput: Input,
            ATextarea: Input.TextArea,
            AButton: Button,
            ADatePicker: DatePicker,
            AUpload: Upload,
            AIcon: Icon,
        },

        data() {
            return {
                formData: {
                    times: moment(new Date(), 'YYYY-MM-DD'),
                    remarks: null,
                },
                drivingStatisticData: [],
                drivingStatistic,
                backMiningStatisticData: [],
                backMiningStatistic,
                drillStatisticData: [],
                drillStatistic,
            }
        },
        mounted() {
            this.loader()
        },
        methods: {
            loader() {
                http.post(dataUrl.getAll, {
                    time: this.formData.times && this.formData.times instanceof moment ? this.formData.times.format('YYYY-MM-DD') : null,
                }).then(res => {
                    if (res.state) {
                        this.drivingStatisticData = TableUtil.formatData(res.data.drivingStatistic, dataMapping); //掘进面
                        this.backMiningStatisticData = TableUtil.formatData(res.data.backMiningStatistic, dataMapping);//回采面
                        // this.drillStatisticData = TableUtil.formatData(res.data.drillStatistic, dataMapping);//钻孔工作
                        this.formData.remarks = res.data.remarks ? res.data.remarks : null
                    } else {
                        message.warning(res.message)
                    }
                })
            },
            onChangeTime(date) {
                if (date) {
                    this.formData.times = date;
                    this.form.resetFields();//重置组件的值
                    this.loader()
                }
            },
            preserve(values) {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        http.post(dataUrl.setRemarks, {
                            time: values.times && values.times instanceof moment ? values.times.format('YYYY-MM-DD') : null,
                            remarks: values.remarks ? values.remarks : null
                        }).then(res => {
                            if (res.state) {
                                time: res.data ? moment(res.data.times, 'YYYY-MM-DD') : null;
                                remarks:res.data.remarks ? res.data.remarks : null;
                                message.success(res.message)
                            } else {
                                message.warning(res.message)
                            }
                        })
                    }
                })

            },
            //日期限制禁选
            disabledDate(current) {
                return current && current > moment();
            },
            //导出
            exportData() {
                this.form.validateFields((err, values) => {
                    if (!err) {
                        http.getFile(dataUrl.exportData, {
                            time: values.times && values.times instanceof moment ? values.times.format('YYYY-MM-DD') : null,
                        }).then(res => {
                            if (res.state) {
                                time: res.data ? moment(res.data.times, 'YYYY-MM-DD') : null
                            } else {
                                message.warning(res.message)
                            }
                        })
                    }
                })
            },
        }
    }
</script>

<style scoped>
.preserveBtn{
    position: relative;
    left: 50%;
    margin-left: -23px;
}
</style>
