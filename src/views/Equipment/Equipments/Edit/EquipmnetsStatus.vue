<template>
    <a-modal
            title="变更设备状态"
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
                <a-col>
                    <a-form-item label="设备状态" v-bind="formItemLayout":label-col="{ span: 4 }" :wrapper-col="{ span: 18 }">
                        <a-select
                            v-decorator="[
                                'deviceStatus',
                                {
                                    initialValue:formData.deviceStatus,
                                    rules: [{ required: true, message: '请选择设备状态！' }]
                                }
                            ]"
                        >
                            <a-select-option value="DEVICE_STATUS_USING">在用</a-select-option>
                            <a-select-option value="DEVICE_STATUS_MAINTAINING">维保中</a-select-option>
                            <a-select-option value="DEVICE_STATUS_TRANSFER">外调</a-select-option>
                            <a-select-option value="DEVICE_STATUS_BORROW">外借</a-select-option>
                            <a-select-option value="DEVICE_STATUS_SCRAP">报废</a-select-option>
                            <a-select-option value="DEVICE_STATUS_BACKUP">备用</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>

        </a-form>
    </a-modal>
</template>

<script>
    import {Modal, Form, Row, Col, Button, Input, message, Select} from 'ant-design-vue'
    import http from '../../../../utils/http'

    const dataUrl = {
        changeDeviceStatus: '/api/device-info/changeDeviceStatus'
    };

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
            ASelect: Select,
            ASelectOption: Select.Option
        },
        name: 'EquipmentsStatus',
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        mounted() {
        },
        props: {
            editData: Object
        },
        data() {
            return {
                formData: {
                    ids: [],
                    deviceStatus: ''
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
        props: {
            selectedItems: Array
        },
        methods: {
            openModal() {
                this.visible = true;
                this.formData.ids = this.selectedItems.map(item => item.id);
            },
            //保存
            handleSubmit() {
                this.form.validateFields(
                    (err, values) => {
                        if (!err && values) {
                            this.confirmLoading = true;
                            http.post(dataUrl.changeDeviceStatus, {
                                ids: this.formData.ids,
                                deviceStatus: values.deviceStatus
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
                this.formData.ids = null;
                this.formData.deviceStatus = '';
                this.visible = false;
                this.confirmLoading = false;
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
