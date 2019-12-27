<template>
    <a-modal
            :title="this.title"
            :visible="visible"
            @ok="handleSubmit"
            :okButtonProps='{props: {disabled: this.inputDisabled},}'
            @cancel="handleCancel"
            destroyOnClose
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
                                 allowClear
                                 :disabled="this.inputDisabled"
                                 v-decorator="['drivingFaceName',{ initialValue:formData.drivingFaceName,rules: [{ required: true, message: '请输入名称' }] }]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="设计长度(m)" v-bind="formItemLayout">
                        <a-input-number :min="0"
                                        placeholder="请输入设计长度！"
                                        :precision="2"
                                        :style="{minWidth:'100%'}"
                                        :disabled=inputDisabled
                                        @change="totalLength"
                                        v-decorator="['totalLength',{ initialValue:formData.totalLength,rules: [{ required: true, message: '请输入设计长度！', }] }]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="已掘长度(m)" v-bind="formItemLayout">
                        <a-input-number :min="0"
                                        placeholder="请输入已掘长度！"
                                        :precision="2"
                                        :style="{minWidth:'100%'}"
                                        :disabled=inputDisabled
                                        @change="doneLength"
                                        v-decorator="['doneLength',{ initialValue:formData.doneLength,rules: [{ required: true, message: '请输入已掘长度！' },{validator: doneLengthTrue,}] }]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item v-bind="formItemLayout">
                        <span slot="label">
                            剩余长度(m)
                        </span>
                        <a-input
                                disabled
                                :precision="2"
                                v-decorator="['leftLength',{ initialValue:formData.leftLength,rules:[] }]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                    <a-form-item label="开掘日期" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-date-picker :disabled="this.inputDisabled"
                                       v-decorator="['startTime',{ initialValue:formData.startTime,rules:[] }]"
                                       :disabledDate="disabledDate"
                                       :style="{width: '100%'}"/>
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                    <a-form-item v-bind="formItemLayout">
                        <span slot="label">
                            掘进高度(m)
                        </span>
                        <a-input-number :min="0"
                                        :precision="2"
                                        :style="{minWidth:'100%'}"
                                        :disabled=inputDisabled
                                        v-decorator="['drivingHigh',{ initialValue:formData.drivingHigh,rules: [] }]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item v-bind="formItemLayout">
                        <span slot="label">
                            坡度（°）
                        </span>
                        <a-input-number :min="-360"
                                        :max="360"
                                        :precision="2"
                                        :style="{minWidth:'100%'}"
                                        :disabled=inputDisabled
                                        v-decorator="['drivingSlope',{ initialValue:formData.drivingSlope,rules: [] }]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item v-bind="formItemLayout">
                        <span slot="label">
                            断面(㎡)
                        </span>
                        <a-input-number :min="0"
                                        :precision="2"
                                        :style="{minWidth:'100%'}"
                                        :disabled=inputDisabled
                                        v-decorator="['crossSection',{ initialValue:formData.crossSection,rules: [] }]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item v-bind="formItemLayout">
                        <span slot="label">
                            煤层厚度(m)
                        </span>
                        <a-input-number :min="0"
                                        :precision="2"
                                        :style="{minWidth:'100%'}"
                                        :disabled=inputDisabled
                                        v-decorator="['coalSeamThickness',{ initialValue:formData.coalSeamThickness,rules: [] }]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="断面形式" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-select style="width: 120px"
                                  :disabled="this.inputDisabled"
                                  labelInValue
                                  @change="crossSectionType"
                                  v-decorator="['crossSectionType',{ initialValue:formData.crossSectionType,rules: [] }]"
                                  :style="{width: '100%'}"
                        >
                            <a-select-option value="RECTANGLE">矩形</a-select-option>
                            <a-select-option value="TRAPEZIUM">梯形</a-select-option>
                            <a-select-option value="HALF_ROUND">半圆拱</a-select-option>
                            <a-select-option value="THREE_ARCH">三星拱</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="掘进工艺" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-select style="width: 120px"
                                  :disabled="this.inputDisabled"
                                  labelInValue
                                  v-decorator="['drivingTechnologyType',{ initialValue:formData.drivingTechnologyType,rules: [] }]"
                                  @change="drivingTechnologyTypes"
                                  :style="{width: '100%'}"
                        >
                            <a-select-option value="BLASTING_DRIVING">炮掘</a-select-option>
                            <a-select-option value="FULLY">综掘</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="支护方式" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-select style="width: 120px"
                                  :disabled="this.inputDisabled"
                                  labelInValue
                                  @change="supportMethod"
                                  v-decorator="['supportMethod',{initialValue:formData.supportMethod,rules:[]}]"
                                  :style="{width: '100%'}"
                        >
                            <a-select-option value="ANCHOR_SPRAY">锚喷</a-select-option>
                            <a-select-option value="ANCHOR_NET">锚网</a-select-option>
                            <a-select-option value="MASONRY">砌碹</a-select-option>
                            <a-select-option value="CER_MINUS">架棚</a-select-option>
                            <a-select-option value="COMBINED_SUPPORT">联合支护</a-select-option>
                            <a-select-option value="U_SHAPED_SHED">U型棚</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="岩性" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-select style="width: 120px"
                                  :disabled="this.inputDisabled"
                                  v-decorator="['rockCharacter',{initialValue:formData.rockCharacter,rules:[]}]"
                                  labelInValue
                                  @change="rockCharacter"
                                  :style="{width: '100%'}"
                        >
                            <a-select-option value="ALL_COAL">全煤</a-select-option>
                            <a-select-option value="ALL_ROCK">全岩</a-select-option>
                            <a-select-option value="HALF_COAL">半煤巷</a-select-option>
                        </a-select>
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
        getAddData: '/api/produce-driving-face/add',//新增数据
        getById: '/api/produce-driving-face/get',//获取单条数据
        getUpdate: '/api/produce-driving-face/update',//修改数据
    }

    export default {
        name: "TunnellingEdit",
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
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
                    drivingFaceName: null,
                    totalLength: null,
                    doneLength: null,
                    leftLength: null,
                    startTime: moment(new Date(), 'YYYY-MM-DD'),//时间,
                    drivingHigh: null,
                    drivingSlope: null,
                    crossSection: null,
                    coalSeamThickness: null,
                    crossSectionType: {key: 'RECTANGLE'},//
                    drivingTechnologyType: {key: 'BLASTING_DRIVING'},
                    supportMethod: {key: 'ANCHOR_SPRAY'},
                    rockCharacter: {key: 'ALL_COAL'},
                    remarks: null
                },
                title: '新增掘进工作面',
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
                        this.title = "查看" + record.drivingFaceName;
                        this.formData.id = record.id;
                        this.loader()
                    } else {
                        this.inputDisabled = false;
                        this.title = "编辑" + record.drivingFaceName;
                        this.formData.id = record.id;
                        this.loader()
                    }
                } else {
                    this.inputDisabled = false;
                    this.title = "新增掘进工作面"
                }
            },
            //日期限制禁选
            disabledDate(current) {
                return current && current > moment();
            },
            //设计长度
            totalLength(value) {
                this.formData.totalLength = value;
                let leftLength = this.formData.totalLength - this.formData.doneLength;
                if (leftLength < 0) {
                    this.formData.leftLength = "已掘长度不能大于设计长度"
                } else if (isNaN(leftLength)) {
                    this.formData.leftLength = this.formData.totalLength.toFixed(2)
                } else {
                    this.formData.leftLength = leftLength.toFixed(2)
                }
            },
            //已掘长度
            doneLength(value) {
                this.formData.doneLength = value;
                let leftLength = this.formData.totalLength - this.formData.doneLength;
                if (leftLength < 0) {
                    this.formData.leftLength = "已掘长度不能大于设计长度"
                } else if (isNaN(leftLength)) {
                    this.formData.leftLength = this.formData.totalLength.toFixed(2)
                } else {
                    this.formData.leftLength = leftLength.toFixed(2)
                }
            },
            //已掘长度不能大于设计长度验证
            doneLengthTrue(rule, value, callback) {
                const form = this.form;
                if (value && value > form.getFieldValue('totalLength')) {
                    callback('已掘长度不能大于设计长度!');
                } else {
                    callback();
                }
            },
            //加载数据
            loader() {
                if (this.formData.id) {
                    http.post(dataUrl.getById, {id: this.formData.id}).then(res => {
                        if (res.state) {
                            this.formData = {
                                id: res.data ? res.data.id : null,
                                drivingFaceName: res.data ? res.data.drivingFaceName : null,
                                totalLength: res.data ? res.data.totalLength : null,
                                doneLength: res.data ? res.data.doneLength : null,
                                leftLength: res.data ? res.data.leftLength : null,
                                startTime: res.data ? moment(res.data.startTime, 'YYYY-MM-DD') : null,
                                drivingHigh: res.data ? res.data.drivingHigh : null,
                                drivingSlope: res.data ? res.data.drivingSlope : null,
                                crossSection: res.data ? res.data.crossSection : null,
                                coalSeamThickness: res.data ? res.data.coalSeamThickness : null,
                                crossSectionType: {key: res.data.crossSectionType ? res.data.crossSectionType : null},
                                drivingTechnologyType: {key: res.data.drivingTechnologyType ? res.data.drivingTechnologyType : null},
                                supportMethod: {key: res.data.supportMethod ? res.data.supportMethod : null},
                                rockCharacter: {key: res.data.rockCharacter ? res.data.rockCharacter : null},
                                remarks: res.data ? res.data.remarks : null,
                            }
                        }
                    })
                }
            },
            //断面形式选择
            crossSectionType(value) {
                if (value) {
                    this.formData.crossSectionType = value
                }
            },
            //掘进工艺选择
            drivingTechnologyTypes(value) {
                if (value) {
                    this.formData.drivingTechnologyType = value
                }
            },
            //支护方式选择
            supportMethod(value) {
                if (value) {
                    this.formData.supportMethod = value
                }
            },
            //岩性
            rockCharacter(value) {
                if (value) {
                    this.formData.rockCharacter = value
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
                                    drivingFaceName: values ? values.drivingFaceName : null,
                                    totalLength: values ? values.totalLength : null,
                                    doneLength: values ? values.doneLength : null,
                                    leftLength: values ? values.leftLength : null,
                                    startTime: values.startTime && values.startTime instanceof moment ? values.startTime.format('YYYY-MM-DD') : null,
                                    drivingHigh: values ? values.drivingHigh : null,
                                    drivingSlope: values ? values.drivingSlope : null,
                                    crossSection: values ? values.crossSection : null,
                                    coalSeamThickness: values ? values.coalSeamThickness : null,
                                    crossSectionType: values.crossSectionType ? values.crossSectionType.key : null,
                                    drivingTechnologyType: values.drivingTechnologyType ? values.drivingTechnologyType.key : null,
                                    supportMethod: values.supportMethod ? values.supportMethod.key : null,
                                    rockCharacter: values.rockCharacter ? values.rockCharacter.key : null,
                                    remarks: values ? values.remarks : null,
                                }).then(res => {
                                    if (res.state) {
                                        this.formData = {
                                            id: res.data ? res.data.id : null,
                                            drivingFaceName: res.data ? res.data.drivingFaceName : null,
                                            totalLength: res.data ? res.data.totalLength : null,
                                            doneLength: res.data ? res.data.doneLength : null,
                                            leftLength: res.data ? res.data.leftLength : null,
                                            startTime: res.data ? moment(res.data.startTime, 'YYYY-MM-DD') : null,
                                            drivingHigh: res.data ? res.data.drivingHigh : null,
                                            drivingSlope: res.data ? res.data.drivingSlope : null,
                                            crossSection: res.data ? res.data.crossSection : null,
                                            coalSeamThickness: res.data ? res.data.coalSeamThickness : null,
                                            crossSectionType: res.data ? res.data.crossSectionType.key : null,
                                            drivingTechnologyType: res.data ? res.data.drivingTechnologyType.key : null,
                                            supportMethod: res.data ? res.data.supportMethod.key : null,
                                            rockCharacter: res.data ? res.data.rockCharacter.key : null,
                                            remarks: res.data ? res.data.remarks : null,
                                        }
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
                                    drivingFaceName: values ? values.drivingFaceName : null,
                                    totalLength: values ? values.totalLength : null,
                                    doneLength: values ? values.doneLength : null,
                                    leftLength: values ? values.leftLength : null,
                                    startTime: values.startTime && values.startTime instanceof moment ? values.startTime.format('YYYY-MM-DD') : null,
                                    drivingHigh: values ? values.drivingHigh : null,
                                    drivingSlope: values ? values.drivingSlope : null,
                                    crossSection: values ? values.crossSection : null,
                                    coalSeamThickness: values ? values.coalSeamThickness : null,
                                    crossSectionType: values.crossSectionType ? values.crossSectionType.key : null,
                                    drivingTechnologyType: values.drivingTechnologyType ? values.drivingTechnologyType.key : null,
                                    supportMethod: values.supportMethod ? values.supportMethod.key : null,
                                    rockCharacter: values.rockCharacter ? values.rockCharacter.key : null,
                                    remarks: values ? values.remarks : null,
                                }).then(res => {
                                    if (res.state) {
                                        this.formData = {
                                            id: res.data ? res.data.id : null,
                                            drivingFaceName: res.data ? res.data.drivingFaceName : null,
                                            totalLength: res.data ? res.data.totalLength : null,
                                            doneLength: res.data ? res.data.doneLength : null,
                                            leftLength: res.data ? res.data.leftLength : null,
                                            startTime: res.data ? moment(res.data.startTime, 'YYYY-MM-DD') : null,
                                            drivingHigh: res.data ? res.data.drivingHigh : null,
                                            drivingSlope: res.data ? res.data.drivingSlope : null,
                                            crossSection: res.data ? res.data.crossSection : null,
                                            coalSeamThickness: res.data ? res.data.coalSeamThickness : null,
                                            crossSectionType: res.data ? res.data.crossSectionType.key : null,
                                            drivingTechnologyType: res.data ? res.data.drivingTechnologyType.key : null,
                                            supportMethod: res.data ? res.data.supportMethod.key : null,
                                            rockCharacter: res.data ? res.data.rockCharacter.key : null,
                                            remarks: res.data ? res.data.remarks : null,
                                        }
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
                this.formData.id = null;
                this.formData.drivingFaceName = null;
                this.formData.totalLength = null;
                this.formData.doneLength = null;
                this.formData.leftLength = null;
                this.formData.drivingHigh = null;
                this.formData.drivingSlope = null;
                this.formData.crossSection = null;
                this.formData.coalSeamThickness = null;
                this.formData.remarks = null;
                this.formData.startTime = moment(new Date(),"YYYY-MM-DD");
                this.formData.crossSectionType = {key: 'RECTANGLE'};
                this.formData.drivingTechnologyType = {key: 'BLASTING_DRIVING'};
                this.formData.supportMethod = {key: 'ANCHOR_SPRAY'};
                this.formData.rockCharacter = {key: 'ALL_COAL'};
                this.visible = false;
                this.confirmLoading = false;
            },
        },
    }
</script>

<style scoped>

</style>
