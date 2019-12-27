<template>
    <a-modal
            title="修改资源"
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
                <a-input placeholder="请输入名称"
                         v-decorator="['resourceName',{ initialValue:formData.resourceName,rules: [{ required: true, message: '请输入名称' }] }]"
                />
            </a-form-item>
            <a-form-item label="路径" v-bind="formItemLayout">
                <a-input placeholder="请输入路径"
                         v-decorator="['resourceUrl',{ initialValue:formData.resourceUrl,rules: [{ required: true, message: '请输入路径' }] }]"
                />
            </a-form-item>
            <a-form-item label="资源类型" v-bind="formItemLayout">
                <a-radio-group
                        @change="onChangeResourceType"
                        v-decorator="['resourceType',{ initialValue:formData.resourceType,rules: [{ required: true, message: '请选择资源类型' }] }]"
                >
                    <a-radio value="RESOURCE_TYPE_MENU">菜单资源</a-radio>
                    <a-radio value="RESOURCE_TYPE_BUTTON">按钮资源</a-radio>
                </a-radio-group>
            </a-form-item>
            <a-form-item label="资源名称" v-bind="formItemLayout">
                <a-input placeholder="请输入资源名称"
                         v-decorator="['resourceAliasName',{ initialValue:formData.resourceAliasName,rules: [{ required: true, message: '请输入资源名称' }] }]"
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
    import {Form, Button, Input, message, Modal, Radio,} from 'ant-design-vue'
    import http from '../../../../../utils/http'

    const dataUrl = {
        updateData: '/api/system-role/update',
        getDataById: '/api/system-role/get',
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
        name: 'ResourceAdd',
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        mounted() {
        },
        data() {
            return {
                formData: {
                    name: null,
                    url: null,
                    resourceType: 'RESOURCE_TYPE_MENU',
                    resourceName: null,
                    paterId: null,
                    path: null,
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
                data: {},
                selectedKeys: [],
            }
        },
        methods: {
            openEditModal(selectedKeys) {
                this.selectedKeys = selectedKeys[0],
                    this.visible = true
                this.loader()
            },
            //加载数据
            loader(selectedKeys) {
                if (this.selectedKeys) {
                    http.post(dataUrl.getDataById, {id: this.selectedKeys}).then(res => {
                        if (res.state) {
                            this.formData = {
                                id: this.selectedKeys,
                                resourceUrl: res.data.resourceUrl,
                                resourceType: res.data.resourceType,
                                resourceName: res.data.resourceName,
                                resourceAliasName: res.data.resourceAliasName,
                                path: res.data.path,
                                parentId: res.data.parentId,
                            }
                        }
                    })
                }
            },
            handleOk() {
                this.form.validateFields(
                    (err, values, callback) => {
                        if (!err) {
                            this.confirmLoading = true
                            http.post(dataUrl.updateData, {
                                id: this.selectedKeys,
                                resourceUrl: values.resourceUrl,
                                userType: 'CM_ADMIN',
                                resourceType: values.resourceType,
                                resourceName: values.resourceName,
                                resourceAliasName: values.resourceAliasName,
                            }).then(res => {
                                if (res.state) {
                                    message.success(res.message)
                                    this.visible = false
                                    this.confirmLoading = false
                                    this.$parent.onLoadData()
                                } else {
                                    message.warning(res.message)
                                }
                            })
                            this.confirmLoading = false
                        }
                    },
                )
            },
            //取消
            handleCancel() {
                this.visible = false
                this.confirmLoading = false
            },
            afterClose() {
                this.visible = false
                this.confirmLoading = false
                this.formData = {
                    id: null,
                    name: null,
                    url: null,
                    resourceType: 'ASSEMBLY',
                    resourceName: null,
                    paterId: null,
                    path: null,
                }
            },
            onChangeResourceType() {

            },
        }
    }
</script>

<style scoped>
</style>
