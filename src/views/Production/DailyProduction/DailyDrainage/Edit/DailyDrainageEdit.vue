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
            :width="1300"
    >
        <a-form :form="form" :style="{ marginTop: '8px' }">
            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="工作面类型" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-select
                                :disabled="this.inputDisabled"
                                v-decorator="['lithologyWay',{initialValue:formData.lithologyWay,rules:[{required:true,message:'请选择班次!'}]}]"
                        >
                            <a-select-option value="BULKCOAL">回采工作面</a-select-option>
                            <a-select-option value="TOTALROCK">掘进工作面</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="工作面" v-bind="formItemLayout">
                        <a-input placeholder="请输入工作面！"
                                 :disabled="this.inputDisabled"
                                 v-decorator="['cmName',{ initialValue:formData.cmName,rules: [{ required: true, message: '请输入工作面' }] }]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                    <a-form-item label="日期" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-date-picker
                                :disabled="this.inputDisabled"
                                :style="{width: '100%'}"
                                v-decorator="['dateTime',{initialValue:formData.dateTime,rules:[{required:true,message:'请选择时间!'}]}]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="测点编号" v-bind="formItemLayout">
                        <a-input placeholder="请输入测点编号！"
                                 :disabled="this.inputDisabled"
                                 v-decorator="['cmName',{ initialValue:formData.cmName,rules: [{ required: true, message: '请输入测点编号' }] }]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="抽采总量（m³/min)" v-bind="formItemLayout">
                        <a-input-number
                            :min="0"
                            :precision="2"
                            :style="{minWidth:'100%'}"
                            :disabled="this.inputDisabled"
                            v-decorator="['cmNames',{ initialValue:formData.cmNames,rules: [{ required: true, message: '请输入抽采总量' }] }]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="混合流量（m³/min)" v-bind="formItemLayout">
                        <a-input-number
                                :min="0"
                                :precision="2"
                                :style="{minWidth:'100%'}"
                                :disabled="this.inputDisabled"
                                v-decorator="['cmNamea',{ initialValue:formData.cmNamea,rules: [] }]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="纯流量（m³/min)" v-bind="formItemLayout">
                        <a-input-number
                                :min="0"
                                :precision="2"
                                :style="{minWidth:'100%'}"
                                :disabled="this.inputDisabled"
                                v-decorator="['cmNamec',{ initialValue:formData.cmNamec,rules: [] }]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="负压（Kpa)" v-bind="formItemLayout">
                        <a-input-number
                                :min="0"
                                :precision="2"
                                :style="{minWidth:'100%'}"
                                :disabled="this.inputDisabled"
                                v-decorator="['cmNamee',{ initialValue:formData.cmNamee,rules: [] }]"
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
    import {Modal,Form,Row,Col,Input,DatePicker,Select,Button,InputNumber,message} from 'ant-design-vue'
    import http from '../../../../../utils/http'
    const dataUrl = {
        getAll: '/api/',
    }
    export default {
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        name: "DailyDrainageEdit",
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
            AButton: Button,
        },
        data() {
            return {
                formData: {
                    id: null,
                    cmName: null,
                    loginName: null,
                    username: null,
                    phone: null,
                    remarks: null
                },
                title: '新增钻孔日报',
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
                },
            }
        },
        mounted() {

        },
        methods: {
            //打开弹窗
            openModal(record, noEdit) {
                this.visible = true;
                if (record) {
                    this.loader()
                    this.inputDisabled = noEdit
                    if (this.inputDisabled) {
                        this.title = "查看" + record.cmName
                    } else {
                        this.inputDisabled = false
                        this.title = "修改" + record.cmName
                    }
                } else {
                    this.inputDisabled = false
                    this.title = "新增钻孔日报"
                }
            },
            //加载数据
            loader() {
                if (this.formData.id) {
                    http.post(dataUrl.getAll, {id: this.formData.id}).then(res => {
                        if (res.state) {
                            this.formData = {
                                id: res.data ? res.data.id : null,
                                loginName: res.data ? res.data.user.loginName : null,
                                username: res.data ? res.data.user.username : null,
                                cmName: res.data ? res.data.cmName : null,
                                phone: res.data ? res.data.user.phone : null,
                                remarks: res.data ? res.data.remarks : null,
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
                                this.confirmLoading = true
                                http.post(dataUrl.getUpdateData, {
                                    id: this.formData ? this.formData.id : null,
                                    loginName: values ? values.loginName : null,
                                    username: values ? values.username : null,
                                    cmName: values ? values.cmName : null,
                                    phone: values ? values.phone : null,
                                    remarks: values ? values.remarks : null,
                                }).then(res => {
                                    if (res.state) {
                                        this.formData = {
                                            id: res.data ? res.data.id : null,
                                            loginName: res.data ? res.data.user.loginName : null,
                                            username: res.data ? res.data.user.username : null,
                                            cmName: res.data ? res.data.cmName : null,
                                            phone: res.data ? res.data.user.phone : null,
                                            remarks: res.data ? res.data.remarks : null,
                                        }
                                        message.success(res.message)
                                        this.$parent.loader()
                                        this.visible = false;
                                    } else {
                                        message.warning(res.message)
                                    }
                                    this.confirmLoading = false
                                })
                            } else {
                                this.confirmLoading = true
                                http.post(dataUrl.getAddData, {
                                    id: this.formData ? this.formData.id : null,
                                    loginName: values ? values.loginName : null,
                                    username: values ? values.userName : null,
                                    cmName: values ? values.cmName : null,
                                    phone: values ? values.phone : null,
                                    remarks: values ? values.remarks : null,
                                }).then(res => {
                                    if (res.state) {
                                        this.formData = {
                                            id: res.data ? res.data.id : null,
                                            loginName: res.data ? res.data.loginName : null,
                                            username: res.data ? res.data.userName : null,
                                            cmName: res.data ? res.data.cmName : null,
                                            phone: res.data ? res.data.phone : null,
                                            remarks: res.data ? res.data.remarks : null,
                                        }
                                        message.success(res.message)
                                        this.$parent.loader()
                                        this.visible = false;
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
                this.formData.loginName = null
                this.formData.username = null
                this.formData.cmName = null
                this.formData.phone = null
                this.formData.remarks = null
                this.visible = false
                this.confirmLoading = false
            },
        }
    }
</script>

<style>
</style>
