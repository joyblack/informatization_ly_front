<template>
    <a-modal
            :title="'作废'"
            :width="580"
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
                <a-form-item label="作废原因" v-bind="formItemLayout" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" style="margin-right:22px;">
                    <a-textarea :rows="4"
                        v-decorator="[
                            'cancelReason',
                            { 
                                initialValue:formData.cancelReason,
                                rules: [{ required: true, message: '请输入作废原因！' }]
                            }
                        ]"
                    />
                </a-form-item>
            </a-row>
        </a-form>
    </a-modal>
</template>

<script>
    import {Modal, Form, Row, Col, Button, Input, InputNumber, Icon, DatePicker, Select, message} from 'ant-design-vue'
    import http from '../../../../utils/http'

    const dataUrl = {
        getAdd: '/api/gm-inventory-in-cancel/add'
    }

    export default {
        components: {
            AModal: Modal,
            AForm: Form,
            AFormItem: Form.Item,
            ARow: Row,
            ACol: Col,
            AButton: Button,
            ATextarea: Input.TextArea,
            AIcon: Icon
        },
        name: 'CancelDatas',
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        mounted() {
        },
        data() {
            return {
                formData: {
                    id: null,
                    cancelReason: null
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
                }
            }
        },
        methods: {
            openModal(id,material) {
                this.visible = true
                this.formData.id = id
            },
            //保存
            handleSubmit() {
                this.form.validateFields(
                    (err, values) => {
                        if (!err) {
                            this.confirmLoading = true
                            http.post(dataUrl.getAdd, {
                                inventoryInId: this.formData.id,
                                cancelReason: values.cancelReason ? values.cancelReason : null
                            }).then(res => {
                                if (res.state) {
                                    message.success(res.message)
                                    this.visible = false
                                    this.$emit("comfirmAdd")
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
                this.formData.id = null
                this.formData.cancelReason = null
                this.visible = false
                this.confirmLoading = false
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
