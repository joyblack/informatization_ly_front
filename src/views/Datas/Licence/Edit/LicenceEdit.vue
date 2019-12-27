<template>
    <a-modal
            :title="formData.id ? '编辑证照' : '新增证照'"
            :width='1000'
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
            <a-row :gutter='{ md: 12, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="证件类型" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }" style="width:100%;" v-bind="formItemLayout">
                        <a-select
                            :disabled="formData.id ? true : false"
                            @change="selectLicenceType"
                            v-decorator="[
                                'licenceType',
                                { 
                                    initialValue:formData.licenceType,
                                    rules: [{ required: true, message: '请选择证件类型！' }] 
                                }
                            ]"
                        >
                            <a-select-option value="LICENCE_MINING">采矿许可证</a-select-option>
                            <a-select-option value="LICENCE_SAFE_PRODUCE">安全许可证</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item :label="licenceType == 'LICENCE_MINING' ? '采矿许可证号' : '安全许可证号'" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-input style="width:100%;"
                            v-decorator="[
                                'licenceNumber',
                                { 
                                    initialValue:formData.licenceNumber
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="有效期限" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-date-picker style="width:100%;"
                            v-decorator="[
                                'expiryTime',
                                { 
                                    initialValue:formData.expiryTime
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="颁证日期" :label-col="{ span: 6 }" :wrapper-col="{ span: 17 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-date-picker style="width:100%;"
                            v-decorator="[
                                'issueTime',
                                { 
                                    initialValue:formData.issueTime
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' v-if="licenceType == 'LICENCE_MINING'">
                <a-col :md="8" :sm='24'>
                    <a-form-item label="矿井规模" :label-col="{ span: 8 }" :wrapper-col="{ span: 14 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-input-number style="width:100%;" :precision="2"
                            v-decorator="[
                                'mineScale',
                                { 
                                    initialValue:formData.mineScale
                                }
                            ]"
                        />
                        <span class="unitStyle">万吨/年</span>
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="矿区面积" :label-col="{ span: 6 }" :wrapper-col="{ span: 16 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-input-number style="width:100%;" :precision="2"
                            v-decorator="[
                                'mineArea',
                                { 
                                    initialValue:formData.mineArea
                                }
                            ]"
                        />
                        <span class="unitStyle">km²</span>
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="准采标高" :label-col="{ span: 6 }" :wrapper-col="{ span: 17 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-input style="width:100%;" :precision="2"
                            v-decorator="[
                                'mineElevation',
                                { 
                                    initialValue:formData.mineElevation
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="发证机关" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-input style="width:100%;"
                            :disabled="true"
                            v-decorator="[
                                'issueOffice',
                                { 
                                    initialValue:formData.issueOffice
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="6" :sm='24'>
                </a-col>
                <a-col :md="10" :sm='24'>
                    <a-form-item label="有效期超时前提示天数" :label-col="{ span: 10 }" :wrapper-col="{ span: 13 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-input-number style="width:100%;" :precision="0"
                            v-decorator="[
                                'tipDays',
                                { 
                                    initialValue:formData.tipDays
                                }
                            ]"
                        />
                        <span class="unitStyle">天</span>
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </a-modal>
</template>

<script>
    import {Modal, Form, Row, Col, Button, Input, InputNumber, Select, Icon, DatePicker, Tooltip, message} from 'ant-design-vue'
    import http from '../../../../utils/http'
    import moment from 'moment'

    const dataUrl = {
        getLicence: '/api/document-licence/get',
        licenceAdd: '/api/document-licence/add',
        licenceUpdate: '/api/document-licence/update'
    }

    export default {
        components: {
            AModal: Modal,
            AForm: Form,
            AFormItem: Form.Item, 
            ARow: Row,
            ACol: Col,
            AButton: Button,
            AInput: Input,
            AInputNumber: InputNumber,
            AIcon: Icon,
            ADatePicker: DatePicker,
            ATooltip: Tooltip,
            ASelect: Select,
            ASelectOption: Select.Option,
        },
        name: 'LicenceEdit',
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        mounted() {
        },
        data() {
            return {
                formData: {
                    id: null,
                    belongCompanyId: null,
                    licenceType: 'LICENCE_MINING',
                    licenceNumber: null,
                    expiryTime: null,
                    mineScale: null,
                    issueTime: null,
                    mineArea: null,
                    mineElevation: null,
                    issueOffice: '贵州省国土资源厅',
                    tipDays: 30
                },
                loading: false,
                visible: false,
                confirmLoading: false,
                licenceType: 'LICENCE_MINING',
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
        methods: {
            openModal(id) {
                this.visible = true;
                if (id){
                    this.formData.id = id;
                    http.post(dataUrl.getLicence, {
                        id: id
                    }).then(res => {
                        if (res.state) {
                            this.licenceType = res.data ? res.data.licenceType : null;
                            this.formData = {
                                id: id,
                                licenceType: res.data ? res.data.licenceType : null,
                                licenceNumber: res.data ? res.data.licenceNumber : null,
                                expiryTime: res.data.expiryTime ? moment(res.data.expiryTime, 'YYYY-MM-DD') : null,
                                mineScale: res.data ? res.data.mineScale : null,
                                issueTime: res.data.issueTime ? moment(res.data.issueTime, 'YYYY-MM-DD') : null,
                                mineArea: res.data ? res.data.mineArea : null,
                                mineElevation: res.data ? res.data.mineElevation : null,
                                issueOffice: res.data ? res.data.issueOffice : null,
                                tipDays: res.data ? res.data.tipDays : null,
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
            selectLicenceType(value) {
                this.licenceType = value;
                if(licenceType == 'LICENCE_MINING') {
                    this.formData.issueOffice = "贵州省国土资源厅";
                } else {
                    this.formData.issueOffice = "贵州煤矿安全监察局";
                }
            },
            //保存
            handleSubmit() {
                this.form.validateFields(
                    (err, values) => {
                        if (!err) {
                            this.confirmLoading = true
                            http.post(this.formData.id ? dataUrl.licenceUpdate : dataUrl.licenceAdd, {
                                id: this.formData.id ? this.formData.id : null,
                                licenceType: values.licenceType,
                                licenceNumber: values.licenceNumber,
                                expiryTime: values.expiryTime ? values.expiryTime.format('YYYY-MM-DD') : null,
                                mineScale: values.mineScale,
                                issueTime: values.issueTime ? values.issueTime.format('YYYY-MM-DD') : null,
                                mineArea: values.mineArea,
                                mineElevation: values.mineElevation,
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
                    },
                )
            },
            //取消
            handleCancel() {
                this.visible = false
            },
            afterClose() {
                this.formData.id = null;
                this.formData.licenceType = 'LICENCE_MINING';
                this.formData.licenceNumber = null;
                this.formData.expiryTime = null;
                this.formData.mineScale = null;
                this.formData.issueTime = null;
                this.formData.mineArea = null;
                this.formData.mineElevation = null;
                this.formData.issueOffice = '贵州省国土资源厅';
                this.formData.tipDays = 30;
                this.licenceType = 'LICENCE_MINING';
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

    .unitStyle {
        position: absolute;
        width: 48px;
        margin-left: 3px;
        color: #999;
    }
</style>
