<template>
    <a-modal
            :title="type ? '查看设备' : formData.id ? '编辑设备' : '新增设备'"
            :width='1100'
            :visible="visible"
            @ok="!type ? handleSubmit() : handleCancel()"
            @cancel="handleCancel"
            :destroyOnClose="true"
            :confirmLoading="confirmLoading"
            :afterClose='afterClose'
            :closable="false"
            :maskClosable="true"
            :keyboard="true"
    >
        <a-form :form="form" :style="{ marginTop: '8px' }">
            <a-row :gutter='{ md: 12, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="设备名称" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }"
                                 :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-input style="width:100%;"
                                 :disabled="type ? true : false"
                                 v-decorator="[
                                'deviceName',
                                {
                                    initialValue:formData.deviceName,
                                    rules: [{ required: !type ? true : false, message: '请输入设备名称！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="型号" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-input style="width:100%;"
                            :disabled="type ? true : false"
                            v-decorator="[
                                'deviceModel',
                                {
                                    initialValue:formData.deviceModel,
                                    rules: [{ required: !type ? true : false, message: '请输入设备型号！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="生产厂家" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-input style="width:100%;"
                            :disabled="type ? true : false"
                            v-decorator="[
                                'manufacture',
                                {
                                    initialValue:formData.manufacture,
                                    rules: [{ required: !type ? true : false, message: '请输入生产厂家！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="重量" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }"
                                 :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-input style="width:100%;"
                            :disabled="type ? true : false"
                            v-decorator="[
                                'weight',
                                {
                                    initialValue:formData.weight,
                                    rules: [{ required: !type ? true : false, message: '请输入重量！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="出厂日期" v-bind="formItemLayout" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }" :style="{width: '100%'}">
                        <a-date-picker style="width:100%;"
                            :disabled="type ? true : false"
                            v-decorator="[
                                'manufactureTime',
                                {
                                    initialValue:formData.manufactureTime,
                                    rules: [{ required: !type ? true : false, message: '请选择出厂日期！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="产品制造编号" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-input style="width:100%;"
                            :disabled="type ? true : false"
                            v-decorator="[
                                'createNumber',
                                {
                                    initialValue:formData.createNumber,
                                    rules: [{ required: !type ? true : false, message: '请输入产品制造编号！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="防爆合格证号" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-input style="width:100%;"
                            :disabled="type ? true : false"
                            v-decorator="[
                                'explosionNumber',
                                {
                                    initialValue:formData.explosionNumber,
                                    rules: [{ required: !type ? true : false, message: '请输入防爆合格证号！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="安全标志准用证号" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-input style="width:100%;"
                            :disabled="type ? true : false"
                            v-decorator="[
                                'safeNumber',
                                {
                                    initialValue:formData.safeNumber,
                                    rules: [{ required: !type ? true : false, message: '请输入安全标准用证号！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="生产许可证号" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-input style="width:100%;"
                            :disabled="type ? true : false"
                            v-decorator="[
                                'produceNumber',
                                {
                                    initialValue:formData.produceNumber,
                                    rules: [{ required: !type ? true : false, message: '请输入生产许可证号！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="标准编号" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-input style="width:100%;"
                            :disabled="type ? true : false"
                            v-decorator="[
                                'standardNumber',
                                {
                                    initialValue:formData.standardNumber,
                                    rules: [{ required: !type ? true : false, message: '请输入标准证号！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="产品执行标准" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-input style="width:100%;"
                            :disabled="type ? true : false"
                            v-decorator="[
                                'produceRunningStandard',
                                {
                                    initialValue:formData.produceRunningStandard,
                                    rules: [{ required: !type ? true : false, message: '请输入产品执行标准！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="防爆标志" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-input style="width:100%;"
                            :disabled="type ? true : false"
                            v-decorator="[
                                'explosionMark',
                                {
                                    initialValue:formData.explosionMark,
                                    rules: [{ required: !type ? true : false, message: '请输入防爆标志！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="检验单位标志" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-input style="width:100%;"
                            :disabled="type ? true : false"
                            v-decorator="[
                                'examineCompanyMark',
                                {
                                    initialValue:formData.examineCompanyMark,
                                    rules: [{ required: !type ? true : false, message: '请输入检验单位标志！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="领用部门" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-cascader
                            :labelInValue="true"
                            :disabled="type ? true : false"
                            :options="departmentList ? departmentList : null"
                            placeholder=""
                            v-decorator="[
                                'useDepartmentId',
                                {
                                    initialValue:useDepartmentId,
                                    rules: [{ required: !type ? true : false, message: '请输入领用部门！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="领用人" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-input style="width:100%;"
                            :disabled="type ? true : false"
                            v-decorator="[
                                'usePeople',
                                {
                                    initialValue:formData.usePeople,
                                    rules: [{ required: !type ? true : false, message: '请输入领用人！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="领用日期" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-date-picker style="width:100%;"
                            :disabled="type ? true : false"
                            v-decorator="[
                                'useDate',
                                {
                                    initialValue:formData.useDate,
                                    rules: [{ required: !type ? true : false, message: '请选择领用日期！' }]
                                } 
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="回收日期" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-date-picker style="width:100%;"
                            :disabled="type ? true : false"
                            v-decorator="[
                                'recoverDate',
                                {
                                    initialValue:formData.recoverDate,
                                    rules: [{ required: !type ? true : false, message: '请选择回收日期！' }]
                                } 
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="安装地点" v-bind="formItemLayout" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }">
                        <a-input style="width:100%;"
                            :disabled="type ? true : false"
                            v-decorator="[
                                'installPlace',
                                {
                                    initialValue:formData.installPlace,
                                    rules: [{ required: !type ? true : false, message: '请输入安装地点！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="用途" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-input style="width:100%;"
                            :disabled="type ? true : false"
                            v-decorator="[
                                'purpose',
                                {
                                    initialValue:formData.purpose,
                                    rules: [{ required: !type ? true : false, message: '请输入用途！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-form-item label="技术数据" v-bind="formItemLayout" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" style="margin:0 20px 20px 20px;">
                    <a-textarea :rows="4"
                        :disabled="type ? true : false"
                        v-decorator="[
                            'technicalData',
                            { 
                                initialValue:formData.technicalData,
                                rules: [{ required: !type ? true : false, message: '请输入技术参数！' }]
                            }
                        ]"
                    />
                </a-form-item>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-form-item label="备注" v-bind="formItemLayout" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" style="margin:0 20px 20px 20px;">
                    <a-textarea :rows="4"
                        :disabled="type ? true : false"
                        v-decorator="['remarks',{ initialValue:formData.remarks}]"
                    />
                </a-form-item>
            </a-row>
        </a-form>
    </a-modal>
</template>

<script>
    import {
        Modal,
        Form,
        Table,
        Row,
        Col,
        Button,
        Input,
        Select,
        Icon,
        DatePicker,
        Tooltip,
        Radio,
        Upload,
        message,
        InputNumber,
        Cascader
    } from 'ant-design-vue'
    import http from '../../../../utils/http'
    import moment from 'moment'

    const dataUrl = {
        getDevice: '/api/device-info/get',
        deviceAdd: '/api/device-info/add',
        deviceUpdate: '/api/device-info/update'
    };

    const confirm = Modal.confirm;

    export default {
        components: {
            AModal: Modal,
            AForm: Form,
            AFormItem: Form.Item,
            ATable: Table,
            ARow: Row,
            ACol: Col,
            AButton: Button,
            AInput: Input,
            ATextarea: Input.TextArea,
            AIcon: Icon,
            ADatePicker: DatePicker,
            ATooltip: Tooltip,
            ASelect: Select,
            ASelectOption: Select.Option,
            AInputNumber: InputNumber,
            ACascader: Cascader
        },
        name: 'EquipmentsEdit',
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        mounted() {
        },
        data() {
            return {
                formData: {
                    id: null,
                    deviceName: null,
                    deviceModel: null,
                    manufacture: null,
                    weight: null,
                    manufactureTime: null,
                    createNumber: null,
                    explosionNumber: null,
                    safeNumber: null,
                    produceNumber: null,
                    standardNumber: null,
                    produceRunningStandard: null,
                    explosionMark: null,
                    examineCompanyMark: null,
                    useDepartmentId: [],
                    usePeople: null,
                    useDate: null,
                    recoverDate: null,
                    installPlace: null,
                    purpose: null,
                    technicalData: null,
                    remarks: null
                },
                useDepartmentId: [],
                loading: false,
                visible: false,
                confirmLoading: false,
                type: null,
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
                }
            }
        },
        props: {
            departmentList: Array
        },
        methods: {
            openModal(record, type) {
                this.visible = true;
                if (record) {
                    this.formData.id = record.id;
                    this.type = type ? type : null;
                    http.post(dataUrl.getDevice, {
                        id: record.id
                    }).then(res => {
                        if (res.state) {
                            this.formData = {
                                id: record.id,
                                deviceName: res.data ? res.data.deviceName : null,
                                deviceModel: res.data ? res.data.deviceModel : null,
                                manufacture: res.data ? res.data.manufacture : null,
                                weight: res.data ? res.data.weight : null,
                                manufactureTime: res.data.manufactureTime ? moment(res.data.manufactureTime, 'YYYY-MM-DD') : null,
                                createNumber: res.data ? res.data.createNumber : null,
                                explosionNumber: res.data ? res.data.explosionNumber : null,
                                safeNumber: res.data ? res.data.safeNumber : null,
                                produceNumber: res.data ? res.data.produceNumber : null,
                                standardNumber: res.data ? res.data.standardNumber : null,
                                produceRunningStandard: res.data ? res.data.produceRunningStandard : null,
                                explosionMark: res.data ? res.data.explosionMark : null,
                                examineCompanyMark: res.data ? res.data.examineCompanyMark : null,
                                usePeople: res.data ? res.data.usePeople : null,
                                useDate: res.data.useDate ? moment(res.data.useDate, 'YYYY-MM-DD') : null,
                                recoverDate: res.data.recoverDate ? moment(res.data.recoverDate, 'YYYY-MM-DD') : null,
                                installPlace: res.data ? res.data.installPlace : null,
                                purpose: res.data ? res.data.purpose : null,
                                technicalData: res.data ? res.data.technicalData : null,
                                remarks: res.data ? res.data.remarks : null
                            }
                            if(this.departmentList.length > 0) {
                                let str = res.data.useDepartment.path.split('-');
                                let r = str.filter(function (s) {
                                    return s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
                                });
                                let strData = r;
                                for (let j in strData) {
                                    this.useDepartmentId.push(Number(strData[j]))//字符串转Number类型
                                }
                            }
                        } else {
                            message.warning(res.message)
                        }
                    })
                }
            },
            //下拉框搜索
            filter(inputValue, path) {
                return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
            },
            //保存
            handleSubmit() {
                this.form.validateFields(
                    (err, values) => {
                        if (!err) {
                            this.confirmLoading = true;
                            http.post(this.formData.id ? dataUrl.deviceUpdate : dataUrl.deviceAdd, {
                            // http.post(dataUrl.deviceAdd, {
                                id: this.formData.id ? this.formData.id : null,
                                deviceName: values.deviceName,
                                deviceModel: values.deviceModel,
                                manufacture: values.manufacture,
                                weight: values.weight,
                                manufactureTime: values.manufactureTime ? values.manufactureTime.format('YYYY-MM-DD') : null,
                                createNumber: values.createNumber,
                                explosionNumber: values.explosionNumber,
                                safeNumber: values.safeNumber,
                                produceNumber: values.produceNumber,
                                standardNumber: values.standardNumber,
                                produceRunningStandard: values.produceRunningStandard,
                                explosionMark: values.explosionMark,
                                examineCompanyMark: values.examineCompanyMark,
                                useDepartmentId: parseInt(values.useDepartmentId.slice(-1).toString()),
                                usePeople: values.usePeople,
                                useDate: values.useDate ? values.useDate.format('YYYY-MM-DD') : null,
                                recoverDate: values.recoverDate ? values.recoverDate.format('YYYY-MM-DD') : null,
                                installPlace: values.installPlace,
                                purpose: values.purpose,
                                technicalData: values.technicalData,
                                remarks: values.remarks ? values.remarks : null
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
                this.formData.id = null;
                this.formData.deviceName = null;
                this.formData.deviceModel = null;
                this.formData.manufacture = null;
                this.formData.weight = null;
                this.formData.manufactureTime = null;
                this.formData.createNumber = null;
                this.formData.explosionNumber = null;
                this.formData.safeNumber = null;
                this.formData.produceNumber = null;
                this.formData.standardNumber = null;
                this.formData.produceRunningStandard = null;
                this.formData.explosionMark = null;
                this.formData.examineCompanyMark = null;
                this.useDepartmentId = [];
                this.formData.usePeople = null;
                this.formData.useDate = null;
                this.formData.recoverDate = null;
                this.formData.installPlace = null;
                this.formData.purpose = null;
                this.formData.technicalData = null;
                this.formData.remarks = null;
                this.visible = false;
                this.type = null;
                this.confirmLoading = false;
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
