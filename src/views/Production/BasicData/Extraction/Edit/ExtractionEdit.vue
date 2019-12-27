<template>
    <a-modal
            :title="this.title"
            :visible="visible"
            @ok="handleSubmit"
            :okButtonProps='{props: {disabled: this.inputDisabled},}'
            @cancel="handleCancel"
            :destroyOnClose="true"
            :confirmLoading="confirmLoading"
            :afterClose='afterClose'
            :closable="false"
            :maskClosable="true"
            :keyboard="true"
            :width="70+'%'"
    >
        <a-form :form="form" :style="{ marginTop: '8px' }">
            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="名称" v-bind="formItemLayout">
                        <a-input placeholder="请输入名称！"
                                 :disabled="this.inputDisabled"
                                 allowClear
                                 v-decorator="['backMiningFaceName',{ initialValue:formData.backMiningFaceName,rules: [{ required: true, message: '请输入名称！' }] }]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="采面斜长(m)" v-bind="formItemLayout">
                        <a-input-number
                                :min="0"
                                :precision="2"
                                :style="{minWidth:'100%'}"
                                placeholder="请输入采面斜长！"
                                :disabled="this.inputDisabled"
                                v-decorator="['slopeLength',{ initialValue:formData.slopeLength,rules: [{ required: true, message: '请输入采面斜长！'}] }]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="回风顺槽(m)" v-bind="formItemLayout">
                        <a-input-number
                                :min="0"
                                :precision="2"
                                :style="{minWidth:'100%'}"
                                placeholder="请输入回风顺槽长度！"
                                :disabled="this.inputDisabled"
                                v-decorator="['returnAirChute',{ initialValue:formData.returnAirChute,rules: [{ required: true, message: '请输入回风顺槽长度！'}] }]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="运输顺槽(m)" v-bind="formItemLayout">
                        <a-input-number
                                :min="0"
                                :precision="2"
                                :style="{minWidth:'100%'}"
                                placeholder="请输入运输顺槽！"
                                :disabled="this.inputDisabled"
                                v-decorator="['transportChute',{ initialValue:formData.transportChute,rules: [{ required: true, message: '请输入运输顺槽！'}] }]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item v-bind="formItemLayout">
                        <span slot="label">
                            已采长度(m)
                        </span>
                        <a-input
                                :min="0"
                                :precision="2"
                                :disabled="this.inputDisabled"
                                v-decorator="['doneLength',{ initialValue:formData.doneLength,rules:[] }]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item v-bind="formItemLayout">
                        <span slot="label">
                            采面走向长度(m)
                        </span>
                        <a-input-number
                                :min="0"
                                :precision="2"
                                :style="{minWidth:'100%'}"
                                :disabled="this.inputDisabled"
                                v-decorator="['trendLength',{ initialValue:formData.trendLength,rules: [] }]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm="24">
                    <a-form-item label="开采日期" v-bind="formItemLayout">
                        <a-date-picker :disabled="this.inputDisabled"
                                       v-decorator="['startTime',{initialValue:formData.startTime}]"
                                       :disabledDate="disabledDate"
                                       :style="{width: '100%'}"/>
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                    <a-form-item v-bind="formItemLayout">
                        <span slot="label">
                            煤层厚度(m)
                        </span>
                        <a-input-number
                                :min="0"
                                :precision="2"
                                :style="{minWidth:'100%'}"
                                :disabled="this.inputDisabled"
                                v-decorator="['coalSeamThickness',{ initialValue:formData.coalSeamThickness,rules: [] }]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item v-bind="formItemLayout">
                        <span slot="label">
                            煤层倾角（°）
                        </span>
                        <a-input-number
                                :min="-360"
                                :max="360"
                                :precision="2"
                                :style="{minWidth:'100%'}"
                                :disabled="this.inputDisabled"
                                v-decorator="['coalSeamDipAngle',{ initialValue:formData.coalSeamDipAngle,rules: [] }]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item v-bind="formItemLayout">
                        <span slot="label">
                            采高(㎡)
                        </span>
                        <a-input-number
                                :min="0"
                                :precision="2"
                                :style="{minWidth:'100%'}"
                                :disabled="this.inputDisabled"
                                v-decorator="['miningHigh',{ initialValue:formData.miningHigh,rules: [] }]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="通风方式" v-bind="formItemLayout">
                        <a-select
                                  :disabled="this.inputDisabled"
                                  labelInValue
                                  v-decorator="['ventilationMode',{ initialValue:formData.ventilationMode,rules: [] }]"
                                  :style="{width: '100%'}"
                        >
                            <a-select-option value="U">U型通风</a-select-option>
                            <a-select-option value="Y">Y型通风</a-select-option>
                            <a-select-option value="Z">Z型通风</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="回采方式" v-bind="formItemLayout">
                        <a-select
                                  :disabled="this.inputDisabled"
                                  labelInValue
                                  v-decorator="['backMiningMode',{ initialValue:formData.backMiningMode,rules: [] }]"
                                  :style="{width: '100%'}"
                        >
                            <a-select-option value="BLASTING_MINING">炮采</a-select-option>
                            <a-select-option value="HIGH_GRADE">高档普采</a-select-option>
                            <a-select-option value="INTEGRATION_MACHINE">综合机械化</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item v-bind="formItemLayout">
                        <span slot="label">
                            可采储量(t)
                        </span>
                        <a-input-number
                                :min="0"
                                :precision="2"
                                :style="{minWidth:'100%'}"
                                :disabled="this.inputDisabled"
                                v-decorator="['recoverReserves',{ initialValue:formData.recoverReserves,rules: [] }]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="24" :sm='24'>
                    <a-form-item>
                        <span slot="label">
                            备注
                            <span class="gmsj-form-span">
                             （选填）
                            </span>
                        </span>
                        <a-textarea placeholder="请输入备注" :rows="4"
                                    :disabled="this.inputDisabled"
                                    v-decorator="['remarks',{ initialValue:formData.remarks,rules: [] }]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </a-modal>
</template>

<script>
    import {Modal, Form, Row, Col, Input, DatePicker, Select, InputNumber, message} from 'ant-design-vue'
    import moment from 'moment'
    import http from '../../../../../utils/http'

    const dataUrl = {
        getAddData: '/api/produce-back-mining-face/add',//新增数据
        getById: '/api/produce-back-mining-face/get',//获取单条数据
        getUpdate: '/api/produce-back-mining-face/update',//新增数据
    };
    export default {
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        name: "ExtractionEdit",
        components: {
            AModal: Modal,
            AForm: Form,
            ARow: Row,
            ACol: Col,
            AFormItem: Form.Item,
            AInput: Input,
            AInputNumber: InputNumber,
            ATextarea: Input.TextArea,
            ADatePicker: DatePicker,
            ASelect: Select,
            ASelectOption: Select.Option,
        },
        data() {
            return {
                formData: {
                    id: null,
                    backMiningFaceName: null,
                    slopeLength: null,
                    returnAirChute: null,
                    transportChute: null,
                    doneLength: null,
                    trendLength: null,
                    startTime: moment(new Date(), 'YYYY-MM-DD'),
                    coalSeamThickness: null,
                    coalSeamDipAngle: null,
                    miningHigh: null,
                    ventilationMode: {key: 'U'},
                    backMiningMode: {key: 'BLASTING_MINING'},
                    recoverReserves: null,
                    remarks: null
                },
                title: '新增回采工作面',
                visible: false,
                confirmLoading: false,
                inputDisabled: false,
                formItemLayout: {
                    labelCol: {
                        xs: {span: 24},
                        sm: {span: 8},
                        md: {span: 8},
                    },
                    wrapperCol: {
                        xs: {span: 24},
                        sm: {span: 16, offset: 0},
                        md: {span: 16, offset: 0},
                    },
                },
                submitFormLayout: {
                    wrapperCol: {
                        xs: {span: 24, offset: 0},
                        sm: {span: 20, offset: 0},
                    },
                }
            }
        },
        mounted() {

        },
        methods: {
            //打开弹窗
            openModal(record, noEdit) {
                this.visible = true;
                if (record) {
                    this.inputDisabled = noEdit;
                    if (this.inputDisabled) {
                        this.title = "查看" + record.backMiningFaceName;
                        this.formData.id = record.id;
                        this.loader()
                    } else {
                        this.inputDisabled = false;
                        this.title = "编辑" + record.backMiningFaceName;
                        this.formData.id = record.id;
                        this.loader()
                    }
                } else {
                    this.inputDisabled = false;
                    this.title = "新增回采工作面"
                }
            },
            //日期限制禁选
            disabledDate(current) {
                return current && current > moment();
            },
            //加载数据
            loader() {
                if (this.formData.id) {
                    http.post(dataUrl.getById, {id: this.formData.id}).then(res => {
                        if (res.state) {
                            this.formData = {
                                id: res.data ? res.data.id : null,
                                backMiningFaceName: res.data.backMiningFaceName ? res.data.backMiningFaceName : null,
                                slopeLength: res.data ? res.data.slopeLength : null,
                                returnAirChute: res.data.returnAirChute ? res.data.returnAirChute : null,
                                transportChute: res.data.transportChute ? res.data.transportChute : null,
                                doneLength: res.data.doneLength ? res.data.doneLength : null,
                                trendLength: res.data.trendLength ? res.data.trendLength : null,
                                startTime: res.data ? moment(res.data.startTime, 'YYYY-MM-DD') : null,
                                coalSeamThickness: res.data.coalSeamThickness ? res.data.coalSeamThickness : null,
                                coalSeamDipAngle: res.data.coalSeamDipAngle ? res.data.coalSeamDipAngle : null,
                                miningHigh: res.data.miningHigh ? res.data.miningHigh : null,
                                ventilationMode: {key: res.data.ventilationMode ? res.data.ventilationMode : null},
                                backMiningMode: {key: res.data.backMiningMode ? res.data.backMiningMode : null},
                                recoverReserves: res.data.recoverReserves ? res.data.recoverReserves : null,
                                remarks: res.data.remarks ? res.data.remarks : null,
                            }
                        }
                    })
                }
            },
            //新增、修改
            handleSubmit() {
                this.form.validateFields(
                    (err, values) => {
                        if (!err) {
                            //判断是否存在id
                            if (this.formData.id) {
                                this.confirmLoading = true;
                                http.post(dataUrl.getUpdate, {
                                    id: this.formData ? this.formData.id : null,
                                    backMiningFaceName: values.backMiningFaceName ? values.backMiningFaceName : null,
                                    slopeLength: values ? values.slopeLength : null,
                                    returnAirChute: values ? values.returnAirChute : null,
                                    transportChute: values ? values.transportChute : null,
                                    doneLength: values.doneLength ? values.doneLength : null,
                                    trendLength: values ? values.trendLength : null,
                                    startTime: values.startTime && values.startTime instanceof moment ? values.startTime.format('YYYY-MM-DD') : null,
                                    coalSeamThickness: values.coalSeamThickness ? values.coalSeamThickness : null,
                                    coalSeamDipAngle: values.coalSeamDipAngle ? values.coalSeamDipAngle : null,
                                    miningHigh: values.miningHigh ? values.miningHigh : null,
                                    ventilationMode: values.ventilationMode ? values.ventilationMode.key : null,
                                    backMiningMode: values.backMiningMode ? values.backMiningMode.key : null,
                                    recoverReserves: values.recoverReserves ? values.recoverReserves : null,
                                    remarks: values.remarks ? values.remarks : null,
                                }).then(res => {
                                    if (res.state) {
                                        this.formData = {
                                            id: res.data ? res.data.id : null,
                                            backMiningFaceName: res.data.backMiningFaceName ? res.data.backMiningFaceName : null,
                                            slopeLength: res.data ? res.data.slopeLength : null,
                                            returnAirChute: res.data.returnAirChute ? res.data.returnAirChute : null,
                                            transportChute: res.data.transportChute ? res.data.transportChute : null,
                                            doneLength: res.data.doneLength ? res.data.doneLength : null,
                                            trendLength: res.data.trendLength ? res.data.trendLength : null,
                                            startTime: res.data.startTime && res.data.startTime instanceof moment ? res.data.startTime.format('YYYY-MM-DD') : null,
                                            coalSeamThickness: res.data.coalSeamThickness ? res.data.coalSeamThickness : null,
                                            coalSeamDipAngle: res.data.coalSeamDipAngle ? res.data.coalSeamDipAngle : null,
                                            miningHigh: res.data.miningHigh ? res.data.miningHigh : null,
                                            ventilationMode: res.data.ventilationMode ? res.data.ventilationMode.key : null,
                                            backMiningMode: res.data.backMiningMode ? res.data.backMiningMode.key : null,
                                            recoverReserves: res.data.recoverReserves ? res.data.recoverReserves : null,
                                            remarks: res.data.remarks ? res.data.remarks : null,
                                        };
                                        message.success(res.message);
                                        this.visible = false;
                                        this.$parent.loader()
                                    } else {
                                        message.warning(res.message)
                                    }
                                    this.confirmLoading = false
                                })
                            } else {
                                this.confirmLoading = true;
                                http.post(dataUrl.getAddData, {
                                    id: this.formData ? this.formData.id : null,
                                    backMiningFaceName: values.backMiningFaceName ? values.backMiningFaceName : null,
                                    slopeLength: values ? values.slopeLength : null,
                                    returnAirChute: values ? values.returnAirChute : null,
                                    transportChute: values ? values.transportChute : null,
                                    doneLength: values.doneLength ? values.doneLength : null,
                                    trendLength: values ? values.trendLength : null,
                                    startTime: values.startTime && values.startTime instanceof moment ? values.startTime.format('YYYY-MM-DD') : null,
                                    coalSeamThickness: values.coalSeamThickness ? values.coalSeamThickness : null,
                                    coalSeamDipAngle: values.coalSeamDipAngle ? values.coalSeamDipAngle : null,
                                    miningHigh: values.miningHigh ? values.miningHigh : null,
                                    ventilationMode: values.ventilationMode ? values.ventilationMode.key : null,
                                    backMiningMode: values.backMiningMode ? values.backMiningMode.key : null,
                                    recoverReserves: values.recoverReserves ? values.recoverReserves : null,
                                    remarks: values.remarks ? values.remarks : null,
                                }).then(res => {
                                    if (res.state) {
                                        this.formData = {
                                            id: res.data ? res.data.id : null,
                                            backMiningFaceName: res.data.backMiningFaceName ? res.data.backMiningFaceName : null,
                                            slopeLength: res.data ? res.data.slopeLength : null,
                                            returnAirChute: res.data.returnAirChute ? res.data.returnAirChute : null,
                                            transportChute: res.data.transportChute ? res.data.transportChute : null,
                                            doneLength: res.data.doneLength ? res.data.doneLength : null,
                                            trendLength: res.data.trendLength ? res.data.trendLength : null,
                                            startTime: res.data.startTime && res.data.startTime instanceof moment ? res.data.startTime.format('YYYY-MM-DD') : null,
                                            coalSeamThickness: res.data.coalSeamThickness ? res.data.coalSeamThickness : null,
                                            coalSeamDipAngle: res.data.coalSeamDipAngle ? res.data.coalSeamDipAngle : null,
                                            miningHigh: res.data.miningHigh ? res.data.miningHigh : null,
                                            ventilationMode: res.data.ventilationMode ? res.data.ventilationMode.key : null,
                                            backMiningMode: res.data.backMiningMode ? res.data.backMiningMode.key : null,
                                            recoverReserves: res.data.recoverReserves ? res.data.recoverReserves : null,
                                            remarks: res.data.remarks ? res.data.remarks : null,
                                        };
                                        message.success(res.message);
                                        this.visible = false;
                                        this.$parent.loader()
                                    } else {
                                        message.warning(res.message)
                                    }
                                    this.confirmLoading = false
                                })
                            }

                        }
                    },
                )
            },
            //取消
            handleCancel() {
                this.visible = false
            },
            //关闭
            afterClose() {
                //关闭置空表单
                this.formData.id = null,
                this.formData.backMiningFaceName = null,
                this.formData.startTime= moment(new Date(), 'YYYY-MM-DD'),
                this.formData.slopeLength = null,
                this.formData.returnAirChute = null,
                this.formData.transportChute = null,
                this.formData.doneLength = null,
                this.formData.trendLength = null,
                this.formData.coalSeamThickness = null,
                this.formData.coalSeamDipAngle = null,
                this.formData.miningHigh = null,
                this.formData.recoverReserves = null,
                this.formData.remarks = null,
                this.formData.ventilationMode = {key: 'U'},
                this.formData.backMiningMode = {key: 'BLASTING_MINING'},
                this.visible = false,
                this.confirmLoading = false
            },
        },

    }
</script>

<style scoped>

</style>
