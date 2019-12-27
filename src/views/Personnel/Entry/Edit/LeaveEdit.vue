<template>
    <a-modal
            :title="'新增离职'"
            :width='900'
            :visible="visible"
            @ok="handleSubmit"
            @cancel="handleCancel"
            :destroyOnClose="true"
            :confirmLoading="confirmLoading"
            :afterClose='afterClose'
            :closable="false"
            :maskClosable="true"
            :keyboard="true"
    >
        <a-form :form="form" :style="{ marginTop: '8px' }">
            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="7" :sm='24'>
                    <a-form-item label="离职类型" v-bind="formItemLayout" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }" style="margin-left:4px;">
                        <a-select
                            v-decorator="[
                                'leaveType',
                                { 
                                    initialValue:formData.leaveType,
                                    rules: [{ required: true, message: '请选择离职类型！' }]
                                }
                            ]"
                        >
                            <a-select-option value="NORMAL">正常离职</a-select-option>
                            <a-select-option value="UN_AUTHORIZED">擅自离职</a-select-option>
                            <a-select-option value="ILLNESS">因病离职</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :md="10" :sm='24'>
                    <a-form-item label=" 离职手续是否齐全" v-bind="formItemLayout" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }">
                        <a-select
                            v-decorator="[
                                'leaveOffice',
                                { 
                                    initialValue:formData.leaveOffice,
                                    rules: [{ required: true, message: '请选择 离职手续是否齐全！' }]
                                }
                            ]"
                        >
                            <a-select-option value="YES">是</a-select-option>
                            <a-select-option value="NO">否</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :md="7" :sm='24'>
                    <a-form-item label="离职时间" v-bind="formItemLayout" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
                        <a-date-picker style="width:100%;"
                            v-decorator="[
                                'leaveTime',
                                { 
                                    initialValue:formData.leaveTime,
                                    rules: [{ required: true, message: '请选择离职时间！' }] 
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-form-item label="离职原因" v-bind="formItemLayout" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" style="margin-right:20px;">
                    <a-textarea :rows="4"
                        v-decorator="[
                            'leaveReason',
                            { 
                                initialValue:formData.leaveReason,
                                rules: [{ required: true, message: '请输入离职原因！' }]
                            }
                        ]"
                    />
                </a-form-item>
            </a-row>
        </a-form>
    </a-modal>
</template>

<script>
    import {Modal, Form, Table, Row, Col, Button, Input, Select, Icon, DatePicker, Tooltip, Cascader, message} from 'ant-design-vue'
    import http from '../../../../utils/http'
    import moment from 'moment'
    import debounce from 'lodash/debounce'
    import TableUtil from '../../../../utils/TableUtil'

    const dataUrl = {
        leaveAdd: '/api/staff-leave/add2'
    }

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
            ATextarea: Input.TextArea,
            ASelect: Select,
            ASelectOption: Select.Option,
            AIcon: Icon,
            ADatePicker: DatePicker,
            ATooltip: Tooltip,
            ACascader: Cascader
        },
        name: 'LeaveEdit',
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        mounted() {
        },
        data() {
            return {
                formData: {
                    id: null,
                    leaveType: null,
                    leaveOffice: null,
                    leaveTime: moment(new Date(), 'YYYY-MM-DD'),
                    leaveReason: null
                },
                loading: false,
                visible: false,
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
            }
        },
        methods: {
            openModal(record) {
                this.visible = true;
                if (record){
                    this.formData.id = record.id;
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
                                http.post(dataUrl.leaveAdd, {
                                    id: this.formData.id,
                                    leaveType: values.leaveType ? values.leaveType : null,
                                    leaveTime: values.leaveTime.format('YYYY-MM-DD'),
                                    leaveOffice: values.leaveOffice ? values.leaveOffice : null,
                                    leaveReason: values.leaveReason
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
                    },
                )
            },
            //取消
            handleCancel() {
                this.visible = false
            },
            afterClose() {
                this.formData.id = null;
                this.formData.leaveType = null;
                this.formData.leaveTime = null;
                this.formData.leaveOffice = null;
                this.formData.leaveReason =null;
                this.visible = false;
                this.confirmLoading = false;
            }
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
