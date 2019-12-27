<template>
    <a-modal
            title="修改材料分类"
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
            <a-form-item label="材料分类名称" v-bind="formItemLayout">
                <a-input placeholder="请输入材料分类名称！"
                         v-decorator="['name',{ initialValue:formData.name,rules: [{ required: true, message: '请输入材料分类名称！' }] }]"
                />
            </a-form-item>
            <!---
            <a-form-item label="材料分类编码" v-bind="formItemLayout">
                <a-input placeholder="请输入材料分类编码！"
                         v-decorator="['lead',{ initialValue:formData.lead,rules: [{ required: true, message: '请输入材料分类编码！' }] }]"
                />
            </a-form-item>
            --->
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
    import http from '@/utils/http'

    const dataUrl = {
        getDataById: '/api/gm-material-category/get',
        updateData: '/api/gm-material-category/update',
    }
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
        name: 'ClassMaterialsEdit',
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        mounted() {
        },
        data() {
            return {
                formData: {
                    name: null,
                    phone: null,
                    lead: null,
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
                console.log(selectedKeys[0])
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
                                name: res.data.name,
                                parentId: res.data.parentId,
                                remarks: res.data.remarks
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
                                id: this.formData.id,
                                name: values.name,
                                remarks: values.remarks
                            }).then(res => {
                                if (res.state) {
                                    message.success('提交成功')
                                    this.visible = false
                                    this.confirmLoading = false
                                    this.$parent.onLoadData()
                                } else {
                                    message.warning(res.message)
                                }
                            })
                            this.confirmLoading = false
                        }
                    }
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
                    phone: null,
                    lead: null,
                    paterId: null,
                    remarks: null,
                }
            },
            onChangeResourceType() {

            },
            onChangeResourceStatus() {

            }

        }
    }
</script>

<style scoped>
</style>
