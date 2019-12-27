<template>
    <a-modal
            title="修改密码"
            :visible="visible"
            @ok="handleOk"
            @cancel="handleCancel"
            :destroyOnClose="true"
            :confirmLoading="confirmLoading"
            :afterClose='afterClose'
            :closable="false"
            :maskClosable="true"
            :keyboard="true"
    >
        <a-form :form="form" :style="{ marginTop: '8px' }">
            <a-form-item label="旧密码" v-bind="formItemLayout">
                <a-input placeholder="请输入旧密码"
                         allowClear
                         v-decorator="['password',{ initialValue:formData.password,rules: [{ required: true, message: '请输入旧密码' }] }]"
                />
            </a-form-item>
            <a-form-item label="新密码" v-bind="formItemLayout">
                <a-input placeholder="请输入新密码"
                         allowClear
                         v-decorator="['newPassword',{ initialValue:formData.newPassword,rules: [{ required: true, message: '请输入新密码' }] }]"
                />
            </a-form-item>
            <a-form-item label="确认密码" v-bind="formItemLayout">
                <a-input placeholder="请输入确认密码"
                         allowClear
                         v-decorator="['affirmPassword',{ initialValue:formData.affirmPassword,rules: [{ required: true, message: '请输入确认密码' },{validator: affirmPassword,}] }]"
                />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
    import {Form, Button, Input, message, Modal} from 'ant-design-vue'
    import http from '../../../../../utils/http'

    const dataUrl = {
        updataPassWord: '/api/system-user/changePassword',
    };
    export default {
        components: {
            AForm: Form,
            AFormItem: Form.Item,
            AButton: Button,
            AInput: Input,
            AModal: Modal,
        },
        name: 'ChangePassWord',
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        mounted() {
        },
        data() {
            return {
                formData: {
                    password: null,
                    newPassword: null
                },
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
                visible: false,
                confirmLoading: false,
                data: {}
            }
        },
        methods: {
            openModal(record) {
                this.visible = true;
                this.data = typeof record === 'object' ?record.id:(typeof record === 'string'?record:null);//用户信息id
            },
            handleOk() {
                this.form.validateFields(
                    (err, values, callback) => {
                        if (!err) {
                            http.post(dataUrl.updataPassWord, {
                                id: this.data ? this.data : null,
                                password: values.password,
                                newPassword: values.newPassword,
                                affirmPassword: values.affirmPassword,
                            }).then(res => {
                                if (res.state) {
                                    message.success(res.message);
                                    this.visible = false;
                                    this.confirmLoading = false
                                } else {
                                    message.warning(res.message)
                                }
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
                this.formData.password = null;
                this.formData.newPassword = null;
                this.formData.affirmPassword = null;
                this.visible = false;
                this.confirmLoading = false;
            },
            affirmPassword(rule, value, callback) {
                const form = this.form;
                if (value && value !== form.getFieldValue('newPassword')) {
                    callback('确认密码与新密码不一致');
                } else {
                    callback();
                }
            },
        }
    }
</script>

<style scoped>
</style>
