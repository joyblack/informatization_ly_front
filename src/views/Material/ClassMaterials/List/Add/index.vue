<template>
    <a-modal
            title="新增分类"
            :visible="visible"
            @ok="preserve"
            @cancel="handleCancel"
            :destroyOnClose="true"
            :confirmLoading="confirmLoading"
            :afterClose='afterClose'
            :closable="false"
            :maskClosable="true"
            :keyboard="false"
    >
        <a-form :form="form" :style="{ marginTop: '8px' }">
            <a-form-item label="材料分类名称" v-bind="formItemLayout">
                <a-input placeholder="请输入材料分类名称！"
                         v-decorator="['name',{ initialValue:formData.name,rules: [{ required: true, message: '请输入材料分类名称！' }] }]"
                />
            </a-form-item>
            <!--- 暂时屏蔽
            <a-form-item label="材料分类编码" v-bind="formItemLayout">
                <a-input placeholder="请输入材料分类编码！"
                         v-decorator="['lead',{ initialValue:formData.lead,rules: [{ required: true, message: '请输入材料分类编码！' }] }]"
                />
            </a-form-item> --->
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
        addNode: '/api/gm-material-category/add', // 添加节点
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
        name: 'ClassMaterialsAdd',
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
                    lead: null,//负责人
                    remarks: null,
                },
                formItemLayout: {
                    labelCol: {
                        xs: {span: 24},
                        sm: {span: 8},
                    },
                    wrapperCol: {
                        xs: {span: 24},
                        sm: {span: 12},
                        md: {span: 12},
                    },
                },
                visible: false,
                confirmLoading: false,
                selectedKeys: [],
                editValue: true
            }
        },
        methods: {
            openAddModal(selectedKeys) {
                this.selectedKeys = selectedKeys[0]
                this.visible = true
            },
            //保存
            preserve () {
                this.form.validateFields(
                    (err, values, callback) => {
                        if (!err) {
                            this.confirmLoading = true
                            http.post(dataUrl.addNode, {
                                name: values.name,
                                parentId: this.selectedKeys,
                                remarks: values.remarks,
                            }).then(res => {
                                if (res.state) {
                                    message.success('添加成功!')
                                    this.visible = false
                                    this.confirmLoading = false
                                    this.$parent.onLoadData({id: 0})
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
                    lead: null,
                    parentId: null,
                    phone: null,
                    remarks: null,
                }
            },
            onChangeDepartmentType() {

            },
            onChangeDepartmentStatus() {

            }
        }
    }
</script>

<style scoped>
</style>
