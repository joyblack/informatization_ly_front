<template>
    <a-modal
            title="修改部门"
            :visible="visible"
            @ok="handleOk"
            @cancel="handleCancel"
            :destroyOnClose="true"
            :confirmLoading="confirmLoading"
            :afterClose='afterClose'
            :closable="false"
            :maskClosable="false"
            :keyboard="false"
    >
        <a-form :form="form" :style="{ marginTop: '8px' }">
            <a-form-item label="名称" v-bind="formItemLayout">
                <a-input placeholder="请输入名称！"
                         allowClear
                         v-decorator="['name',{ initialValue:formData.name,rules: [{ required: true, message: '请输入名称！' }] }]"
                />
            </a-form-item>
            <a-form-item v-bind="formItemLayout">
             <span slot="label">
                负责人
                <span class="gmsj-form-span">
                 （选填）
                </span>
            </span>
                <a-input placeholder="请输入负责人！"
                         allowClear
                         v-decorator="['responseUser',{ initialValue:formData.responseUser,rules: [] }]"
                />
            </a-form-item>
            <a-form-item v-bind="formItemLayout">
             <span slot="label">
                联系电话
                <span class="gmsj-form-span">
                 （选填）
                </span>
            </span>
                <a-input placeholder="请输入联系电话！"
                         allowClear
                         v-decorator="['phone',{ initialValue:formData.phone,rules: [{
                                     pattern:/(^1\d{10}$)|(^0\d{2,3}-?\d{7,8}$)/,
                                    message:'请输入正确手机号',}] }]"
                />
            </a-form-item>
            <a-form-item v-bind="formItemLayout">
            <span slot="label">
                备注
                <span class="gmsj-form-span">
                 （选填）
                </span>
             </span>
                <a-textarea placeholder="请输入备注！" :rows="4"
                            v-decorator="['remarks',{ initialValue:formData.remarks,rules: [] }]"
                />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
    import {Form, Button, Input, message, Modal, Radio} from 'ant-design-vue'
    import http from '../../../../../utils/http'

    const dataUrl = {
        getDataById: '/api/system-department/get',
        getUpdateData: '/api/system-department/update',
    };
    export default {
        components: {
            AForm: Form,
            AFormItem: Form.Item,
            AButton: Button,
            AInput: Input,
            AModal: Modal,
            ARadio: Radio,
            ARadioGroup: Radio.Group,
            ATextarea: Input.TextArea,
        },
        name: 'DepartmentEdit',
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        mounted() {
        },
        data() {
            return {
                formData: {
                    name: null,
                    code: null,
                    phone: null,
                    responseUser: null,
                    parentId: null,
                    remarks: null,
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
                selectedKeys: [],
            }
        },
        methods: {
            openEditModal(selectedKeys) {
                this.selectedKeys = selectedKeys[0];
                this.visible = true;
                this.loader()
            },
            //加载数据
            loader(selectedKeys) {
                if (this.selectedKeys) {
                    http.post(dataUrl.getDataById, {id: this.selectedKeys}).then(res => {
                        if (res.state) {
                            this.formData = {
                                id: this.selectedKeys,
                                name: res.data.name ? res.data.name : null,
                                code: res.data ? res.data.code : null,
                                parentId: res.data ? res.data.parentId : null,
                                phone: res.data.phone ? res.data.phone : null,
                                responseUser: res.data.responseUser ? res.data.responseUser : null,
                                remarks: res.data.remarks ? res.data.remarks : null,
                            }
                        }
                    })
                }
            },
            handleOk() {

                this.form.validateFields(
                    (err, values, callback) => {
                        if (!err) {
                            this.confirmLoading = true;
                            http.post(dataUrl.getUpdateData, {
                                id: this.formData.id,
                                name: values ? values.name : null,
                                code: values ? values.code : null,
                                parentId: this.formData.parentId,
                                responseUser: values ? values.responseUser : null,
                                phone: values ? values.phone : null,
                                remarks: values ? values.remarks : null,
                            }).then(res => {
                                if (res.state) {
                                    message.success(res.message);
                                    this.visible = false;
                                    this.confirmLoading = false;
                                    this.$parent.onLoadData()
                                } else {
                                    message.warning(res.message)
                                }
                            });
                            this.confirmLoading = false
                        }
                    }
                )
            },
            //取消
            handleCancel() {
                this.visible = false;
                this.confirmLoading = false;
            },
            afterClose() {
                this.visible = false;
                this.confirmLoading = false;
                this.formData = {
                    id: null,
                    name: null,
                    code:null,
                    phone: null,
                    responseUser: null,
                    paterId: null,
                    remarks: null,
                }
            },
        }
    }
</script>

<style scoped>
</style>
