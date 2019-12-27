<template>
    <a-modal
            :title="formData.id ? '编辑职位' : '新增职位'"
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
                <a-col :span="24">
                    <a-form-item label="名称" v-bind="formItemLayout":label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
                    <a-input
                        v-decorator="['name',{ initialValue: formData.name,rules: [{ required: true, message: '请输入职位名称!' }] }]"
                    />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :span="24">
                    <a-form-item label="描述" v-bind="formItemLayout" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
                        <a-textarea :rows="4"
                            v-decorator="['describes',{ initialValue: formData.describes,rules: [] }]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

        </a-form>
    </a-modal>
</template>

<script>
    import {Modal, Form, Row, Col, Button, Input, message} from 'ant-design-vue'
    import http from '../../../../utils/http'

    const dataUrl = {
        getPosition: '/api/position/get',
        getPositionAdd: '/api/position/add',
        getPositionUpdate: '/api/position/update'
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
            ATextarea: Input.TextArea,
        },
        name: 'PositionManageEdit',
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        mounted() {
        },
        data() {
            return {
                formData: {
                    id: null,
                    name: null,
                    describes: null
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
                    http.post(dataUrl.getPosition, {
                        id: record.id
                    }).then(res => {
                        if (res.state) {
                            this.formData = {
                                id: record.id,
                                name: res.data ? res.data.name : null,
                                describes: res.data.describes ? res.data.describes : null
                            }
                        } else {
                            message.warning(res.message)
                        }
                    })
                }
            },
            //保存
            handleSubmit() {
                this.form.validateFields(
                    (err, values) => {
                        if (!err && values) {
                            this.confirmLoading = true
                            http.post(this.formData.id ? dataUrl.getPositionUpdate : dataUrl.getPositionAdd, {
                                id: this.formData.id ? this.formData.id : null,
                                name: values.name,
                                describes: values.describes
                            }).then(res => {
                                if (res.state) {
                                    message.success(res.message)
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
                this.formData.name = null;
                this.formData.describes = null;
                this.visible = false
                this.confirmLoading = false
            },

        }
    }
</script>

<style scoped>
    .gmsj-form-span {
        color: rgba(0, 0, 0, 0.45);
        font-style: normal;
    }
</style>
