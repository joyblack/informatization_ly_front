<template>
    <a-modal
            :title="type ? '查看违章' : formData.id ? '编辑违章' : '新增违章'"
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
                    <a-form-item label="违章日期" v-bind="formItemLayout" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                        <a-date-picker style="width:100%;"
                            :disabled="type ? true : false"
                            v-decorator="[
                                'violationTime',
                                { 
                                    initialValue:formData.violationTime,
                                    rules: [{ required: !type ? true : false, message: '请选择违章日期！' }] 
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="12" :sm='24'>
                    <a-form-item label="违章类型" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-select
                            :disabled="type ? true : false"
                            v-decorator="[
                                'threeViolationType',
                                { 
                                    initialValue:formData.threeViolationType,
                                    rules: [{ required: !type ? true : false, message: '请选择违章类型！' }] 
                                }
                            ]"
                        >
                            <a-select-option value="TASK">违章作业</a-select-option>
                            <a-select-option value="COMMAND">违章指挥</a-select-option>
                            <a-select-option value="LABOR_DISCIPLINE">违反劳动纪律</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="12" :sm='24'>
                    <a-form-item label="违章部门" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-cascader 
                            :options="departmentList ? departmentList : null" 
                            placeholder="" 
                            :disabled="type ? true : false"
                            v-decorator="[
                                'violationDepartmentId',
                                { 
                                    initialValue:violationDepartmentId,
                                    rules: [{ required: !type ? true : false, message: '请选择违章部门！' }] 
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="12" :sm='24'>
                    <a-form-item label="违章人" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-input style="width:100%;"
                            :disabled="type ? true : false"
                            v-decorator="[
                                'violationPeople',
                                { 
                                    initialValue:formData.violationPeople,
                                    rules: [{ required: !type ? true : false, message: '请输入违违章人！' }] 
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="12" :sm='24'>
                    <a-form-item label="违章地点" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-input style="width:100%;"
                            :disabled="type ? true : false"
                            v-decorator="[
                                'violationPlace',
                                { 
                                    initialValue:formData.violationPlace,
                                    rules: [{ required: !type ? true : false, message: '请输入违章地点！' }] 
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="12" :sm='24'>
                    <a-form-item label="班次" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-select
                            :disabled="type ? true : false"
                            v-decorator="[
                                'dailyShift',
                                { 
                                    initialValue:formData.dailyShift,
                                    rules: [{ required: !type ? true : false, message: '请输入违章地点！' }] 
                                }
                            ]"
                        >
                            <a-select-option value="MORNING">早班</a-select-option>
                            <a-select-option value="NOON">中班</a-select-option>
                            <a-select-option value="EVENING">晚班</a-select-option>
                            <a-select-option value="OTHER">其他</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="12" :sm='24'>
                    <a-form-item label="检查人" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-input style="width:100%;"
                            :disabled="type ? true : false"
                            v-decorator="['checkPeople',{ initialValue:formData.checkPeople}]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-form-item label="违章详情" v-bind="formItemLayout" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" style="margin: 0 22px 25px 18px;">
                    <a-textarea :rows="4"
                        :disabled="type ? true : false"
                        v-decorator="['violationContent',{ initialValue:formData.violationContent}]"
                    />
                </a-form-item>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-form-item label="备注" v-bind="formItemLayout" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" style="margin: 0 22px 0 18px;">
                    <a-textarea :rows="4"
                        :disabled="type ? true : false"
                        v-decorator="['remarks',{ initialValue:formData.remarks}]"
                    />
                </a-form-item>
            </a-row>
        </a-form>
    </a-modal>
</template>

<script>
    import {Modal, Form, Table, Row, Col, Button, Input, Select, Icon, DatePicker, Tooltip, Radio, Upload, message, Cascader} from 'ant-design-vue'
    import http from '../../../../utils/http'
    import moment from 'moment'

    const dataUrl = {
        getViolation: '/api/safe-three-violation/get',
        violationAdd: '/api/safe-three-violation/add',
        violationUpdate: '/api/safe-three-violation/update'
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
            AIcon: Icon,
            ADatePicker: DatePicker,
            ATooltip: Tooltip,
            ASelect: Select,
            ASelectOption: Select.Option,
            ACascader: Cascader
        },
        name: 'BreakRulesEdit',
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        mounted() {
        },
        data() {
            return {
                formData: {
                    id: null,
                    violationTime: null,
                    threeViolationType: null,
                    violationDepartmentId: [],
                    violationPeople: null,
                    violationPlace: null,
                    dailyShift: null,
                    checkPeople: null,
                    violationContent: null,
                    remarks: null
                },
                loading: false,
                visible: false,
                idNumber: null,
                companyStatus: false,
                confirmLoading: false,
                violationDepartmentId: [],
                type: null,
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
                }
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
                    http.post(dataUrl.getViolation, {
                        id: record.id
                    }).then(res => {
                        if (res.state) {
                            let deArr = [];
                            let str = res.data.violationDepartment.path.split('-');
                            let r = str.filter(function (s) {
                                return s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
                            });
                            let strData = r;
                            for (let j in strData) {
                                this.violationDepartmentId.push(Number(strData[j]))//字符串转Number类型
                            }
                            this.formData = {
                                id: record.id,
                                violationTime: res.data ? moment(res.data.violationTime, 'YYYY-MM-DD') : null,
                                threeViolationType: res.data ? res.data.threeViolationType : null,
                                violationPeople: res.data ? res.data.violationPeople : null,
                                dailyShift: res.data ? res.data.dailyShift : null,
                                checkPeople: res.data ? res.data.checkPeople : null,
                                violationPlace: res.data ? res.data.violationPlace : null,
                                violationContent: res.data ? res.data.violationContent : null,
                                remarks: res.data ? res.data.remarks : null
                            }
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
                            this.confirmLoading = true
                            http.post(this.formData.id ? dataUrl.violationUpdate : dataUrl.violationAdd, {
                                id: this.formData.id ? this.formData.id : null,
                                violationTime: values.violationTime.format('YYYY-MM-DD'),
                                threeViolationType: values.threeViolationType,
                                violationDepartmentId: parseInt(values.violationDepartmentId.slice(-1).toString()),
                                violationPeople: values.violationPeople,
                                dailyShift: values.dailyShift,
                                checkPeople: values.checkPeople,
                                violationPlace: values.violationPlace,
                                violationContent: values.violationContent,
                                remarks: values.remarks
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
                this.formData.violationTime = null;
                this.formData.threeViolationType = null;
                this.formData.violationDepartmentId = [];
                this.formData.violationPeople = null;
                this.formData.violationPlace = null;
                this.formData.dailyShift= null;
                this.formData.checkPeople = null;
                this.formData.violationContent = null;
                this.formData.remarks = null;
                this.violationDepartmentId = [];
                this.visible = false;
                this.type = null;
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
</style>
