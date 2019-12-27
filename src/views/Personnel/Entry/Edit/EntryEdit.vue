<template>
    <a-modal
            :title="type ? '查看入职' : formData.id ? '编辑入职' : '新增入职'"
            :width='1000'
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
            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="姓名" v-bind="formItemLayout":label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
                    <a-input
                        :disabled="type ? true : false "
                        v-decorator="['username',{ 
                            initialValue: formData.username,
                            rules: [{ required: !type ? true : false, message: '请输入姓名!' }] }]"
                    />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="入职部门" v-bind="formItemLayout" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
                        <a-cascader 
                            :disabled="type ? true : false"
                            :options="departmentList" 
                            placeholder="请选择入职部门" 
                            v-decorator="[
                                'departmentId',
                                { 
                                    initialValue: departmentId,
                                    rules: [{ required: !type ? true : false, message: '请选择入职部门！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="入职职位" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }" v-bind="formItemLayout">
                        <a-select
                            showSearch
                            :disabled="type ? true : false"
                            :filterOption="filterOption"
                            v-decorator="[
                                'positionId',
                                { 
                                    initialValue: formData.positionId,
                                    rules: [{ required: !type ? true : false, message: '请选择入职职位！' }]
                                }
                            ]"
                        >
                            <a-select-option v-for="(item,index) in positionList" :value="item.id" :key="index">{{item.name}}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="身份证号" v-bind="formItemLayout":label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
                        <a-input
                            :disabled="(type || formData.id) ? true : false "
                            @change="e => handleChangeIdNumber(e.target.value)"
                            v-decorator="['idNumber',{ 
                                initialValue: formData.idNumber,
                                rules: [{ 
                                    required: !type ? true : false, 
                                    pattern:/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/,
                                    message: '请输入正确的身份证号！' }] 
                                }]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="16" :sm='24'>
                    <a-form-item label="身份证号地址" :label-col="{ span: 4 }" :wrapper-col="{ span: 20 }" v-bind="formItemLayout">
                        <a-input
                            :disabled="type ? true : false"
                            v-decorator="[
                                'idNumberAddress',
                                { 
                                    initialValue: formData.idNumberAddress,
                                    rules: [{ required: !type ? true : false, message: '请输入身份证号地址！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="性別" v-bind="formItemLayout" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
                        <a-radio-group
                            :disabled="true"
                            v-decorator="[
                                'sex',
                                { 
                                    initialValue:formData.sex,
                                    rules: [{ required: !type ? true : false, message: '请选择性別！' }]
                                }
                            ]"
                        >
                            <a-radio value="MAN">男</a-radio>
                            <a-radio value="WOM">女</a-radio>
                        </a-radio-group>
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="出生日期" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }" v-bind="formItemLayout">
                        <a-date-picker style="width:100%;"
                            :disabled="true"
                            v-decorator="[
                                'birthDate',
                                { 
                                    initialValue:formData.birthDate,
                                    rules: [{ required: !type ? true : false, message: '请选择出生日期！' }] 
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="民族" v-bind="formItemLayout" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
                        <a-select
                            showSearch
                            :disabled="type ? true : false"
                            :filterOption="filterOption"
                            v-decorator="[
                                'nationality',
                                { 
                                    initialValue:formData.nationality,
                                    rules: [{ required: !type ? true : false, message: '请选择民族！' }] 
                                }
                            ]"
                        >
                            <a-select-option v-for="(item,index) in nationalityList" :value="item.name" :key="index">{{item.name}}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="婚姻状况" v-bind="formItemLayout" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
                        <a-select
                            :disabled="type ? true : false"
                            v-decorator="[
                                'marryStatus',
                                { 
                                    initialValue: formData.marryStatus,
                                    rules: [{ required: !type ? true : false, message: '请婚姻状况！' }]
                                }
                            ]"
                        >
                            <a-select-option value="MARRAY_NO">未婚</a-select-option>
                            <a-select-option value="MARRAY_YES">已婚</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="最高学历" v-bind="formItemLayout" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
                        <a-select
                            showSearch
                            :disabled="type ? true : false"
                            :filterOption="filterOption"
                            v-decorator="[
                                'education',
                                { 
                                    initialValue: formData.education,
                                    rules: [{ required: !type ? true : false, message: '请选择最高学历！' }]
                                }
                            ]"
                        >
                            <a-select-option v-for="(item,index) in eduData" :value="item.id" :key="index">{{item.eduName}}
                            </a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="毕业院校" v-bind="formItemLayout" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
                    <a-input
                        :disabled="type ? true : false"
                        v-decorator="[
                            'graduationCollege',
                            { 
                                initialValue: formData.graduationCollege
                            }
                        ]"
                    />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="专业" v-bind="formItemLayout" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
                    <a-input
                        :disabled="type ? true : false"
                        v-decorator="['profession',
                            { initialValue: formData.profession}
                        ]"
                    />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="联系电话" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }" v-bind="formItemLayout">
                        <a-input
                            :disabled="type ? true : false"
                            v-decorator="[
                                'phone',
                                { 
                                    initialValue: formData.phone,
                                    rules: [{
                                        required: !type ? true : false,
                                        pattern:/^1(3|4|5|6|7|8|9)\d{9}$/,
                                        message:'请输入正确的手机号'
                                    }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-form-item label="备注" v-bind="formItemLayout" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" style="margin-right:22px;">
                    <a-textarea :rows="4"
                        :disabled="type ? true : false"
                        v-decorator="['remarks',{ 
                            initialValue: formData.remarks
                        }]"
                    />
                </a-form-item>
            </a-row>
        </a-form>
    </a-modal>
</template>

<script>
    import {Modal, Form, Row, Col, Button, Input, Select, Icon, DatePicker, Cascader, Tooltip, Radio, message} from 'ant-design-vue'
    import http from '../../../../utils/http'
    import moment from 'moment'

    const dataUrl = {
        entryAdd: '/api/staff-entry/add',
        entryUpload: '/api/staff-entry/update',
        EditEntryById: '/api/staff-entry/get',
        getByIdNumber: '/api/staff-personal/getByIdNumber' ,//获取个人在系统中的信息（通过身份证）
        departmentById: '/api/department/getParentNodesJustIds'
    }

    const eduData = [
        {
            id: 'DOCTOR',
            eduName: '博士'
        },
        {
            id: 'MASTER',
            eduName: '硕士'
        },
        {
            id: 'BACHELOR',
            eduName: '本科'
        },
        {
            id: 'COLLEGE',
            eduName: '大专'
        },
        {
            id: 'SENIOR_MIDDLE_SCHOOL',
            eduName: '高中'
        },
        {
            id: 'SECONDARY',
            eduName: '中专'
        },
        {
            id: 'POLYTECHNIC',
            eduName: '中技'
        },
        {
            id: 'JUNIOR_MIDDLE_SCHOOL',
            eduName: '初中'
        },
        {
            id: 'PRIMARY_SCHOOL_AND_DOWN',
            eduName: '初中及以下'
        }
    ]
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
            ASelectOption: Select.Option,
            AIcon: Icon,
            ADatePicker: DatePicker,
            ACascader: Cascader,
            ATooltip: Tooltip,
            ARadio: Radio,
            ARadioGroup: Radio.Group
        },
        name: 'EntryEdit',
        props: {
            departmentList: Array,
            positionList: Array,
            nationalityList: Array
        },
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        mounted() {
        },
        data() {
            return {
                formData: {
                    id: null,
                    username: null,
                    idNumber: null,
                    birthDate: null,
                    sex: null,
                    nationality: null,
                    idNumberAddress: null,
                    marryStatus: null,
                    education: null,
                    phone: null,
                    graduationCollege: null,
                    departmentId: [],
                    positionId: null,
                    profession: null,
                    remarks: null
                },
                companyStatus: false,
                type: null,
                idNumber: null,
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
                eduData,
                editData: null,
                personInfo: {},
                departmentId: []
            }
        },
        mounted() {
        },
        methods: {
            openModal(record,type) {
                this.visible = true;
                if (record){
                    this.formData.id = record.id;
                    this.type = type ? type : null;
                    http.post(dataUrl.EditEntryById, {
                        id: record.id
                    }).then(res => {
                        if (res.state) {
                            let deArr = [];
                            let str = res.data.department.path.split('-');
                            let r = str.filter(function (s) {
                                return s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
                            });
                            let strData = r;
                            for (let j in strData) {
                                this.departmentId.push(Number(strData[j]))//字符串转Number类型
                            }
                            this.formData = {
                                id: record.id,
                                username: res.data ? res.data.staffPersonal.username : null,
                                idNumber: res.data ? res.data.staffPersonal.idNumber : null,
                                birthDate: res.data ? moment(res.data.staffPersonal.birthDate, 'YYYY-MM-DD') : null,
                                sex: res.data ? res.data.staffPersonal.sex : null,
                                nationality: res.data ? res.data.staffPersonal.nationality : null,
                                idNumberAddress: res.data ? res.data.staffPersonal.idNumberAddress : null,
                                education: res.data.staffPersonal.education ? res.data.staffPersonal.education : null,
                                phone: res.data ? res.data.staffPersonal.phone : null,
                                graduationCollege: res.data.staffPersonal.graduationCollege ? res.data.staffPersonal.graduationCollege : null,
                                positionId: res.data ? res.data.position.id : null,
                                marryStatus: res.data.staffPersonal.marryStatus ? res.data.staffPersonal.marryStatus : null,
                                profession: res.data.staffPersonal.profession ? res.data.staffPersonal.profession : null,
                                remarks: res.data ? res.data.remarks : null
                            }
                        } else {
                            message.warning(res.message)
                        }
                    })
                }
            },
            //身份证获取信息
            handleChangeIdNumber(value) {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    http.post(dataUrl.getByIdNumber, {
                        idNumber: value
                    }).then(res => {
                        if (res.state) {
                            this.personInfo = res.data;
                            if(this.personInfo) {
                                this.formData.username = this.personInfo.username ? this.personInfo.username : null;
                                this.formData.birthDate = this.personInfo.birthDate ? moment(this.personInfo.birthDate, 'YYYY-MM-DD') : null;
                                this.formData.sex = this.personInfo.sex ? this.personInfo.sex : null;
                                this.formData.nationality = this.personInfo.nationality ? this.personInfo.nationality : null;
                                this.formData.idNumberAddress = this.personInfo.idNumberAddress ? this.personInfo.idNumberAddress : null;
                                this.formData.education = this.personInfo.education ? this.personInfo.education : null;
                                this.formData.phone = this.personInfo.phone ? this.personInfo.phone : null;
                                this.formData.marryStatus = this.personInfo.marryStatus ? this.personInfo.marryStatus : null;
                                this.formData.graduationCollege = this.personInfo.graduationCollege ? this.personInfo.graduationCollege : null;
                                this.formData.profession = this.personInfo.profession ? this.personInfo.profession : null;
                            } else {
                                this.formData.username = null;
                                this.formData.birthDate = null;
                                this.formData.sex = null;
                                this.formData.nationality = null;
                                this.formData.idNumberAddress = null;
                                this.formData.insured = null;
                                this.formData.education = null;
                                this.formData.phone = null;
                                this.formData.marryStatus = null;
                                this.formData.graduationCollege = null;
                                this.formData.profession = null;
                                if (value.length==18) {
                                    this.formData.birthDate = moment(value.substr(6,8).replace(/(.{4})(.{2})/,"$1-$2-"), 'YYYY-MM-DD');
                                    value.charAt(16)%2 == 0 ? this.formData.sex = "WOM" : this.formData.sex = "MAN";
                                } else if(value.length==15){
                                    this.formData.birthDate = moment("19"+value.substr(6,6).replace(/(.{2})(.{2})/,"$1-$2-"), 'YYYY-MM-DD');
                                    value.charAt(14)%2 == 0 ? this.formData.sex = "WOM" : this.formData.sex = "MAN";
                                }else{
                                    return ""; 
                                }
                            }
                        }
                    })
                }, 100);
            },
            //下拉框搜索
            filterOption(input, option) {
                return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            },
            //保存
            handleSubmit() {
                this.form.validateFields(
                    (err, values) => {
                        if (!err && values) {
                            this.confirmLoading = true
                            http.post(this.formData.id ? dataUrl.entryUpload : dataUrl.entryAdd, {
                                id: this.formData.id ? this.formData.id : null,
                                username: values.username,
                                idNumber: values.idNumber,
                                birthDate: values.birthDate.format('YYYY-MM-DD'),
                                sex: values.sex,
                                nationality: values.nationality ? values.nationality : null,
                                idNumberAddress: values.idNumberAddress,
                                education: values.education ? values.education : null,
                                phone: values.phone,
                                marryStatus: values.marryStatus,
                                departmentId: parseInt(values.departmentId.slice(-1).toString()),
                                positionId: values.positionId,
                                graduationCollege: values.graduationCollege ? values.graduationCollege : null,
                                profession: values.profession ? values.profession : null,                    
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
                this.formData.username = null;
                this.formData.idNumber = null;
                this.formData.birthDate = null;
                this.formData.sex = null;
                this.formData.nationality = null;
                this.formData.idNumberAddress = null;
                this.formData.education = null;
                this.formData.phone = null;
                this.formData.marryStatus = null;
                this.formData.departmentId = [];
                this.formData.positionId = null;
                this.formData.graduationCollege = null;
                this.formData.profession = null;                               
                this.formData.remarks = null;
                this.departmentId = [];
                this.type = null;
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
