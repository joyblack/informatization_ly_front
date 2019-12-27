<template>
    <a-modal
            title="新增部门"
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
        addData: '/api/system-department/add',
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
                    id: null,
                    name: null,
                    code: null,
                    responseUser: null,//负责人
                    phone: null,
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
                this.selectedKeys = selectedKeys[0];
                this.visible = true
            },
            //保存
            preserve() {
                this.form.validateFields(
                    (err, values, callback) => {
                        if (!err) {
                            this.confirmLoading = true;
                            http.post(dataUrl.addData, {
                                name: values.name,
                                parentId: this.selectedKeys === '0' ? this.selectedKeys : (this.selectedKeys !== '0' ? this.selectedKeys : null),
                                responseUser: values.responseUser,
                                phone: values.phone,
                                remarks: values.remarks,
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
                    },
                )
            },
            //取消
            handleCancel() {
                this.visible = false;
                this.confirmLoading = false
            },
            //关闭置空
            afterClose() {
                this.visible = false;
                this.confirmLoading = false;
                this.formData = {
                    id: null,
                    name: null,
                    responseUser: null,
                    parentId: null,
                    phone: null,
                    remarks: null,
                }
            },
        }
    }
</script>
<style scoped>
</style>
