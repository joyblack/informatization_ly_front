<template>
    <a-modal
            :title="type ? '查看安全巡检' : '编辑安全巡检'"
            :width='800'
            :visible="visible"
            @ok="!type ? handleSubmit() : handleCancel()"
            @cancel="handleCancel"
            :destroyOnClose="true"
            :confirmLoading="confirmLoading"
            :afterClose='afterClose'
            :closable="false"
            :maskClosable="true"
            :keyboard="true"
    >
        <a-form :form="form" :style="{ marginTop: '8px' }">
            <a-row :gutter='{ md: 12, lg: 24, xl: 48 }'>
                <a-col :md="12" :sm='24'>
                    <a-form-item label="巡检日期" v-bind="formItemLayout" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                        <a-date-picker style="width:100%;"
                            :disabled="type ? true : false"
                            v-decorator="[
                                'inspectTime',
                                {
                                    initialValue:formData.inspectTime,
                                    rules: [{ required: !type ? true : false, message: '请选择巡检日期！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="12" :sm='24'>
                    <a-form-item label="巡检部门" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-cascader
                            :options="departmentList ? departmentList : null"
                            placeholder=""
                            :disabled="type ? true : false"
                            v-decorator="[
                                'inspectDepartmentId',
                                {
                                    initialValue:inspectDepartmentId,
                                    rules: [{ required: !type ? true : false, message: '请选择巡检部门！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="12" :sm='24'>
                    <a-form-item label="巡检类型" v-bind="formItemLayout" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                        <a-select
                            :disabled="type ? true : false"
                            v-decorator="[
                                'inspectType',
                                {
                                    initialValue:formData.inspectType,
                                    rules: [{ required: !type ? true : false, message: '请选择巡检类型！' }]
                                }
                            ]"
                        >
                            <a-select-option value="GROUND">地面</a-select-option>
                            <a-select-option value="MACHINE">机电</a-select-option>
                            <a-select-option value="ONE_THROUGH_AND_THREE_PREVENTION">一通三防</a-select-option>
                            <a-select-option value="ROOF">顶板</a-select-option>
                            <a-select-option value="WATER_PREVENTION">防治水</a-select-option>
                            <a-select-option value="OTHER">其他</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :md="12" :sm='24'>
                    <a-form-item label="巡检地点" v-bind="formItemLayout" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" :style="{width: '100%'}">
                        <a-input
                            :disabled="type ? true : false"
                            v-decorator="[
                                'inspectPlace',
                                {
                                    initialValue:formData.inspectPlace,
                                    rules: [{ required: !type ? true : false, message: '请输入巡检地点！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-form-item label="问题描述" v-bind="formItemLayout" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" style="margin-left:15px;margin-right:22px;">
                    <a-textarea :rows="4"
                        :disabled="type ? true : false"
                        v-decorator="[
                            'problemDescribes',
                            {
                                initialValue:formData.problemDescribes,
                                rules: [{ required: !type ? true : false, message: '请输入问题描述！' }]
                            }
                        ]"
                    />
                </a-form-item>
            </a-row>

            <a-row :gutter='{ md: 12, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="责任人" v-bind="formItemLayout" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
                        <a-input
                            :disabled="type ? true : false"
                            v-decorator="[
                                'responsePeople',
                                {
                                    initialValue:formData.responsePeople,
                                    rules: [{ required: !type ? true : false, message: '请输入责任人！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="整改期限" v-bind="formItemLayout" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
                        <a-date-picker style="width:100%;"
                            :disabled="type ? true : false"
                            v-decorator="[
                                'deadTime',
                                {
                                    initialValue:formData.deadTime,
                                    rules: [{ required: !type ? true : false, message: '请选择整改期限！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="超时前提示天数" :label-col="{ span: 14 }" :wrapper-col="{ span: 10 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-input-number
                            :min="0"
                            :precision="0"
                            :disabled="type ? true : false"
                            v-decorator="[
                                'tipDays',
                                {
                                    initialValue:formData.tipDays,
                                    rules: [{ required: !type ? true : false, message: '请输入超时前提示天数！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

        </a-form>
    </a-modal>
</template>

<script>
    import {Modal, Form, Table, Row, Col, Button, Input, InputNumber, Select, Icon, DatePicker, Tooltip, Cascader, message} from 'ant-design-vue'
    import http from '../../../../utils/http'
    import moment from 'moment'

    const dataUrl = {
        getTrainById: '/api/safe-inspection/get',
        inspectionUpdate: '/api/safe-inspection/update'
    };

    export default {
        components: {
            AModal: Modal,
            AForm: Form,
            AFormItem: Form.Item,
            ATable: Table,
            ARow: Row,
            ACol: Col,
            AButton: Button,
            AInput: Input,
            AInputNumber: InputNumber,
            ATextarea: Input.TextArea,
            ASelect: Select,
            ASelectOption: Select.Option,
            AIcon: Icon,
            ADatePicker: DatePicker,
            ATooltip: Tooltip,
            ACascader: Cascader
        },
        name: 'InspectionEdit',
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        mounted() {
        },
        data() {
            return {
                formData: {
                    id: null,
                    inspectTime: null,
                    inspectDepartmentId: [],
                    inspectType: null,
                    inspectPlace: null,
                    problemDescribes: null,
                    responsePeople: null,
                    deadTime: null,
                    tipDays: null
                },
                type: null,
                loading: false,
                visible: false,
                companyStatus: false,
                confirmLoading: false,
                formItemLayout: {
                    labelCol: {
                        xs: {span: 24},
                        sm: {span: 7},
                    },
                    wrapperCol: {
                        xs: {span: 24},
                        sm: {span: 12},
                        md: {span: 10},
                    },
                },
                submitFormLayout: {
                    wrapperCol: {
                        xs: {span: 24, offset: 0},
                        sm: {span: 10, offset: 7},
                    },
                },
                data: [],
                inspectDepartmentId: []
            }
        },
        props: {
            departmentList: Array
        },
        methods: {
            openModal(record,type) {
                this.visible = true;
                if (record){
                    this.formData.id = record.id;
                    this.type = type ? type : null;
                    http.post(dataUrl.getTrainById, {
                        id: record.id
                    }).then(res => {
                        if (res.state) {
                            let deArr = [];
                            let str = res.data.inspectDepartment.path.split('-');
                            let r = str.filter(function (s) {
                                return s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
                            });
                            let strData = r;
                            for (let j in strData) {
                                this.inspectDepartmentId.push(Number(strData[j]))//字符串转Number类型
                            }
                            this.formData = {
                                id: res.data ? res.data.id : null,
                                inspectTime: res.data ? moment(res.data.inspectTime, 'YYYY-MM-DD') : null,
                                inspectType: res.data ? res.data.inspectType : null,
                                inspectPlace: res.data ? res.data.inspectPlace : null,
                                problemDescribes: res.data ? res.data.problemDescribes : null,
                                responsePeople: res.data ? res.data.responsePeople : null,
                                deadTime: res.data ? moment(res.data.deadTime, 'YYYY-MM-DD') : null,
                                tipDays: res.data ? res.data.tipDays : null
                            };
                        } else {
                            message.warning(res.message)
                        }
                    })
                }
            },
            //下拉框搜索
            filterOption(input, option) {
                return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            },
            //保存
            handleSubmit() {
                this.form.validateFields(
                    (err, values) => {
                        if (!err) {
                            this.confirmLoading = true;
                            http.post(dataUrl.inspectionUpdate, {
                                id: this.formData.id,
                                inspectTime: values.inspectTime.format('YYYY-MM-DD'),
                                inspectDepartmentId: parseInt(values.inspectDepartmentId.slice(-1).toString()),
                                inspectType: values.inspectType,
                                inspectPlace: values.inspectPlace,
                                problemDescribes: values.problemDescribes,
                                responsePeople: values.responsePeople,
                                deadTime: values.deadTime.format('YYYY-MM-DD'),
                                tipDays: values.tipDays
                            }).then(res => {
                                if (res.state) {
                                    message.success(res.message);
                                    this.visible = false;
                                    this.$emit("comfirmAdd");
                                } else {
                                    message.warning(res.message)
                                }
                                this.confirmLoading = false
                            })
                        }
                    }
                )
            },
            //取消
            handleCancel() {
                this.visible = false
            },
            afterClose() {
                this.formData.id = null;
                this.formData.inspectTime = null;
                this.formData.inspectDepartmentId = [];
                this.formData.inspectType = null;
                this.formData.inspectPlace = null;
                this.formData.problemDescribes = null;
                this.formData.responsePeople = null;
                this.formData.deadTime = null;
                this.formData.tipDays = null;
                this.inspectDepartmentId = [];
                this.type = null;
                this.visible = false;
                this.confirmLoading = false;
            },
        }
    }
</script>

<style scoped>
    .gmsj-form-span {
        color: rgba(0, 0, 0, 0.45);
        font-style: normal;
    }

    .selsectLeave p {
        color: #333;
    }

    .selsectLeave p:before {
        display: inline-block;
        margin-right: 4px;
        content: '*';
        font-family: SimSun;
        line-height: 1;
        font-size: 14px;
        color: #f5222d;
    }

    .selsectLeave p span {
        color: #f5222d;
        padding-left: 10px;
    }
</style>
