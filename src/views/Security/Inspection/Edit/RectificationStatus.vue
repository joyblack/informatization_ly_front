<template>
    <a-modal
            title="变更整改状态"
            :visible="visible"
            :width="680"
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
                <a-col :span="13">
                    <a-form-item label="验收结果" v-bind="formItemLayout":label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                        <a-radio-group
                            @change="changeStatus"
                            v-decorator="[
                                'rectificationStatus',
                                {
                                    initialValue:formData.rectificationStatus,
                                    rules: [{ required: true, message: '请选择验收结果！' }]
                                }
                            ]"
                        >
                            <a-radio value="RECTIFICATION_NO">未整改</a-radio>
                            <a-radio value="RECTIFICATION_YES">已整改</a-radio>
                        </a-radio-group>
                    </a-form-item>
                </a-col>
                <a-col :span="11" v-show="showItems">
                    <a-form-item label="整改资金" v-bind="formItemLayout":label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                        <a-input-number style="width:100%;" :precision="2"
                            v-decorator="[
                                'rectificationMoney',
                                {
                                    initialValue:formData.rectificationMoney
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' v-show="showItems">
                <a-col :span="24">
                    <a-form-item label="整改措施" v-bind="formItemLayout":label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
                        <a-textarea :rows="4"
                            v-decorator="[
                                'rectificationMethod',
                                { initialValue: formData.rectificationMethod}
                            ]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' v-show="showItems">
                <a-col :span="13">
                    <a-form-item label="验收时间" v-bind="formItemLayout":label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                        <a-date-picker style="width:100%;"
                            v-decorator="[
                                'examineDate',
                                {
                                    initialValue:formData.examineDate
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :span="11">
                    <a-form-item label="验收人" v-bind="formItemLayout":label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                        <a-input
                            v-decorator="[
                                'rectificationPeople',
                                {
                                    initialValue: formData.rectificationPeople
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :span="24">
                    <a-form-item label="备注" v-bind="formItemLayout" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }">
                        <a-textarea :rows="4"
                            v-decorator="[
                                'remarks',
                                { initialValue: formData.remarks}
                            ]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

        </a-form>
    </a-modal>
</template>

<script>
    import {Modal, Form, Row, Col, Button, Input, InputNumber, message, Radio, DatePicker} from 'ant-design-vue'
    import http from '../../../../utils/http'
    import moment from 'moment'

    const dataUrl = {
        changeRectificationStatus: '/api/safe-inspection/changeRectificationStatus'
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
            AInputNumber: InputNumber,
            ATextarea: Input.TextArea,
            ARadio: Radio,
            ARadioGroup: Radio.Group,
            ADatePicker: DatePicker
        },
        name: 'RectificationStatus',
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
                    rectificationStatus: 'RECTIFICATION_NO',
                    rectificationMoney: null,
                    rectificationMethod: null,
                    examineDate: null,
                    rectificationPeople: null,
                    remarks: null
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
                showItems: false
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
            changeStatus(e) {
                console.log(e);
                if(e.target.value === 'RECTIFICATION_YES') {
                    this.showItems = true;
                    this.formData.examineDate = moment(new Date(), 'YYYY-MM-DD');
                } else {
                    this.showItems = false;
                }
            },
            //保存
            handleSubmit() {
                this.form.validateFields(
                    (err, values) => {
                        if (!err && values) {
                            this.confirmLoading = true;
                            http.post(dataUrl.changeRectificationStatus, {
                                ids: this.formData.ids,
                                rectificationStatus: values.rectificationStatus,
                                rectificationMoney: values.rectificationMoney ? values.rectificationMoney : null,
                                rectificationMethod: values.rectificationMethod ? values.rectificationMethod : null,
                                examineDate: values.examineDate ? values.examineDate.format('YYYY-MM-DD') : null,
                                rectificationPeople: values.rectificationPeople,
                                remarks: values.remarks
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
                this.formData.rectificationStatus = 'RECTIFICATION_NO';
                this.formData.rectificationMoney = null;
                this.formData.rectificationMethod = null;
                this.formData.examineDate = null;
                this.formData.rectificationPeople = null;
                this.formData.remarks = null;
                this.showItems = false;
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
