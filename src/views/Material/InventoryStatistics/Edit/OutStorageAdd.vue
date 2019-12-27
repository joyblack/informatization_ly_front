<template>
    <a-modal
            :title="'出库'"
            :width='800'
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
        <div style="display:flex;margin-left: 7px;color: #666;">当前库存总数: 
            <span style="margin: 0 5px; color: #333">{{amount}}</span>
                <ul style="display:flex;">(
                        &nbsp;
                        <li v-for="(item,index) in storeHouseList" style="margin-right:8px;list-style:none;">{{item.storehouse.name}}: <span style="color: #333">{{item.amount}}</span></li>
                    )
                </ul>
        </div>

        <a-form :form="form" :style="{ marginTop: '8px' }">
            <a-row :gutter='{ md: 12, lg: 24, xl: 48 }'>
                <a-col :md="12" :sm='24'>
                    <a-form-item label="出库数量" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-input-number
                            :min="0"
                            :max="amount"
                            :precision="0"
                            style="width:100%;"
                            @change="outNumberChange"
                            v-decorator="[
                                'outNumber',
                                { 
                                    initialValue:formData.outNumber,
                                    rules: [{ required: true, message: '请输入出库数量！' }] 
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="12" :sm='24'>
                    <a-form-item label="出库仓库" v-bind="formItemLayout" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }">
                        <a-select 
                                style="width:100%" 
                                v-decorator="[
                                    'storehouseId',
                                    { 
                                        initialValue:formData.storehouseId,
                                        rules: [{ required: true, message: '请选择出库仓库！' }] 
                                    }
                                ]"
                            >
                                <a-select-option 
                                    v-for="(item,index) in storeHouseList" 
                                    :key="index"
                                    :value='item.storehouse.id'
                                >
                                    {{item.storehouse.name}}
                                </a-select-option>
                            </a-select>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="12" :sm='24'>
                    <a-form-item label="出库后总数" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-input-number
                            :min="0"
                            :max="amount"
                            :precision="0"
                            :disabled="true"
                            style="width:100%;"
                            v-decorator="[
                                'afterAmount',
                                { 
                                    initialValue:formData.afterAmount 
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="12" :sm='24'>
                    <a-form-item label="出库时间" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-date-picker style="width:100%;"
                            v-decorator="[
                                'outDate',
                                {
                                    initialValue:formData.outDate,
                                    rules: [{ required: true, message: '请选择出库时间！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="12" :sm='24'>
                    <a-form-item label="领用班组" :label-col="{ span: 7 }" :wrapper-col="{ span: 17 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-input style="width:100%;"
                            v-decorator="[
                                'usedTeam',
                                { 
                                    initialValue:formData.usedTeam,
                                    rules: [{ required: true, message: '请输入领用班组！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-form-item label="备注" v-bind="formItemLayout" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" style="margin-right:22px;">
                    <a-textarea :rows="4"
                        v-decorator="['remarks',{ initialValue:formData.remarks}]"
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
        getAdd: '/api/gm-inventory-out/add2'
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
            AInputNumber: InputNumber,
            ATextarea: Input.TextArea,
            AIcon: Icon,
            ADatePicker: DatePicker,
            ASelect: Select,
            ASelectOption: Select.Option
        },
        name: 'OutStorageAdd',
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        mounted() {
        },
        data() {
            return {
                formData: {
                    id: null,
                    outNumber: null,
                    storehouseId: null,
                    afterAmount: null,
                    outDate: null,
                    usedTeam: null,
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
                amount: null,
                storeHouseList: []
            }
        },
        methods: {
            openModal(material,storehouses) {
                this.visible = true
                this.formData.id = material.id
                this.amount = material.amount
                this.storeHouseList = storehouses
                if(this.storeHouseList.length === 1) {
                    this.formData.storehouseId = this.storeHouseList[0].storehouse.id
                }
            },
            outNumberChange(e) {
                if(e) {
                    this.formData.afterAmount = this.amount - e
                }
            },
            //保存
            handleSubmit() {
                this.form.validateFields(
                    (err, values) => {
                        if (!err) {
                            this.confirmLoading = true
                            http.post(dataUrl.getAdd, {
                                materialId: this.formData.id,
                                outNumber: values.outNumber ? values.outNumber : null,
                                storehouseId: values.storehouseId ? values.storehouseId : null,
                                outDate: values.outDate ? values.outDate.format('YYYY-MM-DD') : null,
                                usedTeam: values.usedTeam ? values.usedTeam : null,
                                remarks: values.remarks ? values.remarks : null
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
                this.formData.outNumber = null
                this.formData.storehouseId = null
                this.formData.afterAmount = null
                this.formData.outDate = null
                this.formData.usedTeam = null
                this.formData.remarks = null
                this.amount = null
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
