<template>
    <a-modal
            title="变更参保状态"
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

            <a-row :gutter='{ md: 24, lg: 24, xl: 48 }'>
                <a-col :md="24" :sm='24'>
                    <a-form-item label="参保状态" v-bind="formItemLayout" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                        <a-select
                            @change="changeInsured"
                            v-decorator="[
                                'insured',
                                { 
                                    initialValue:formData.insured,
                                    rules: [{ required: true, message: '请选择参保状态！' }]
                                }
                            ]"
                        >
                            <a-select-option value="YES">是</a-select-option>
                            <a-select-option value="NO">否</a-select-option>
                            <a-select-option value="STOP">已停止</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 24, lg: 24, xl: 48 }'>
                <a-col :md="24" :sm='24'>
                    <a-form-item label="停保时间" v-bind="formItemLayout" :label-col="{ span: 6 }" :wrapper-col="{ span: 12 }">
                        <a-date-picker style="width:100%;"
                            :disabled="insuredStatus ? true : false"
                            v-decorator="[
                                'stopInsuredTime',
                                { 
                                    initialValue:formData.stopInsuredTime 
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
    import {Modal, Form, Row, Col, Button, Input, Select, DatePicker, message} from 'ant-design-vue'
    import http from '../../../../utils/http'
    import moment from 'moment'

    const dataUrl = {
        changeInsured: '/api/staff-leave/changeInsured'
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
            ASelect: Select,
            ASelectOption: Select.Option,
            ADatePicker: DatePicker
        },
        name: 'ChangeInsuredStatus',
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        mounted() {
        },
        data() {
            return {
                formData: {
                    ids: [],
                    insured: null,
                    stopInsuredTime: null
                },
                insuredStatus: false,
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
                }
            }
        },
        props: {
            selectedItems: Array
        },
        methods: {
            openModal() {
                this.visible = true;
                this.formData.ids = this.selectedItems.map(item => item.id);
            },
            changeInsured(e) {
                if(e == 'STOP') {
                    this.insuredStatus = false;
                    this.formData.stopInsuredTime = moment(new Date(), 'YYYY-MM-DD');
                } else {
                    this.insuredStatus = true;
                    this.formData.stopInsuredTime = null;
                }
            },
            //保存
            handleSubmit() {
                this.form.validateFields(
                    (err, values) => {
                        if (!err && values) {
                            this.confirmLoading = true;
                            http.post(dataUrl.changeInsured, {
                                ids: this.formData.ids,
                                insured: values.insured ? values.insured : null,
                                stopInsuredTime: values.stopInsuredTime ? values.stopInsuredTime.format('YYYY-MM-DD') : null
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
                this.formData.ids = [];
                this.formData.insured = null;
                this.formData.stopInsuredTime = null;
                this.positionStatus = false;
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
</style>
