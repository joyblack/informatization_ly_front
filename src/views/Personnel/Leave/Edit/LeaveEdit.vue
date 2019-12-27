<template>
    <a-modal
            :title="type ? '查看离职' : formData.id ? '编辑离职' : '新增离职'"
            :width='900'
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
                <a-col :md="12" :sm='24'>
                    <a-form-item label="身份证号" v-bind="formItemLayout":label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
                        <a-input
                            :disabled="(type || formData.id) ? true : false"
                            @change="e => handleChangeIdNumber(e.target.value)"
                            v-decorator="['idNumber',{ initialValue:formData.idNumber,
                                rules: [{ 
                                    required: true, 
                                    pattern:/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/,
                                    message: '请输入正确的身份证号！' }] 
                                }]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="12" :sm='24'>
                    <a-form-item label="姓名" v-bind="formItemLayout":label-col="{ span: 5 }" :wrapper-col="{ span: 19 }">
                    <a-input
                        :disabled="true"
                        v-decorator="['username',{ initialValue:formData.username}]"
                    />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="12" :sm='24'>
                    <a-form-item label="入职部门" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-cascader 
                            :options="departmentList ? departmentList : null" 
                            placeholder="" 
                            :disabled="true"
                            v-decorator="[
                                'departmentId',
                                {
                                    initialValue: departmentId
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="12" :sm='24'>
                    <a-form-item label="入职职位" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-select
                            showSearch
                            :filterOption="filterOption"
                            :disabled="true"
                            v-decorator="[
                                'positionId',
                                {
                                    initialValue:formData.positionId
                                }
                            ]"
                        >
                            <a-select-option v-for="(item,index) in positionList" :value="item.id" :key="index">{{item.name}}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="7" :sm='24'>
                    <a-form-item label="离职类型" v-bind="formItemLayout" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }" style="margin-left:4px;">
                        <a-select
                            :disabled="type ? true : false"
                            v-decorator="[
                                'leaveType',
                                { 
                                    initialValue:formData.leaveType,
                                    rules: [{ required: true, message: '请选择离职类型！' }]
                                }
                            ]"
                        >
                            <a-select-option value="NORMAL">正常离职</a-select-option>
                            <a-select-option value="UN_AUTHORIZED">擅自离职</a-select-option>
                            <a-select-option value="ILLNESS">因病离职</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :md="10" :sm='24'>
                    <a-form-item label=" 离职手续是否齐全" v-bind="formItemLayout" :label-col="{ span: 12 }" :wrapper-col="{ span: 12 }">
                        <a-select
                            :disabled="type ? true : false"
                            v-decorator="[
                                'leaveOffice',
                                { 
                                    initialValue:formData.leaveOffice,
                                    rules: [{ required: true, message: '请选择 离职手续是否齐全！' }]
                                }
                            ]"
                        >
                            <a-select-option value="YES">是</a-select-option>
                            <a-select-option value="NO">否</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :md="7" :sm='24'>
                    <a-form-item label="离职时间" v-bind="formItemLayout" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }">
                        <a-date-picker style="width:100%;"
                            :disabled="type ? true : false"
                            v-decorator="[
                                'leaveTime',
                                { 
                                    initialValue:formData.leaveTime,
                                    rules: [{ required: true, message: '请选择离职时间！' }] 
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-form-item label="离职原因" v-bind="formItemLayout" :label-col="{ span: 3 }" :wrapper-col="{ span: 21 }" style="margin-right:20px;">
                    <a-textarea :rows="4"
                        :disabled="type ? true : false"
                        v-decorator="[
                            'leaveReason',
                            { 
                                initialValue:formData.leaveReason,
                                rules: [{ required: true, message: '请输入离职原因！' }]
                            }
                        ]"
                    />
                </a-form-item>
            </a-row>
        </a-form>
    </a-modal>
</template>

<script>
    import {Modal, Form, Table, Row, Col, Button, Input, Select, Icon, DatePicker, Tooltip, Cascader, message} from 'ant-design-vue'
    import http from '../../../../utils/http'
    import moment from 'moment'
    import debounce from 'lodash/debounce'
    import TableUtil from '../../../../utils/TableUtil'

    const dataUrl = {
        getLeaveById: '/api/staff-leave/get',
        leaveAdd: '/api/staff-leave/add',
        leaveUpdate: '/api/staff-leave/update',
        getByIdNumber: '/api/staff-entry/getByIdNumber',
        getStatusByIdNumber: '/api/staff-personal/getStatusByIdNumber',//获取个人在系统中的状态（通过身份证）
    }

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
            ASelect: Select,
            ASelectOption: Select.Option,
            AIcon: Icon,
            ADatePicker: DatePicker,
            ATooltip: Tooltip,
            ACascader: Cascader
        },
        name: 'LeaveEdit',
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        props: {
            departmentList: Array,
            positionList: Array
        },
        mounted() {
        },
        data() {
            return {
                formData: {
                    id: null,
                    idNumber: null,
                    username: null,
                    departmentId: [],
                    positionId: null,
                    leaveType: null,
                    leaveOffice: null,
                    leaveTime: moment(new Date(), 'YYYY-MM-DD'),
                    leaveReason: null
                },
                departmentId: [],
                idNumber: null,
                type: null,
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
        methods: {
            openModal(record,type) {
                this.visible = true;
                if (record){
                    this.formData.id = record.id;
                    this.type = type ? type : null;
                    http.post(dataUrl.getLeaveById, {
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
                                id: res.data ? res.data.id : null,
                                username: res.data ? res.data.staffPersonal.username : null,
                                idNumber: res.data ? res.data.staffPersonal.idNumber : null,
                                positionId: res.data ? res.data.position.id : null,
                                leaveTime: res.data ? moment(res.data.leaveTime, 'YYYY-MM-DD') : null,
                                leaveType: res.data.leaveType ? res.data.leaveType : null,
                                leaveOffice: res.data.leaveOffice ? res.data.leaveOffice : null,
                                leaveReason: res.data ? res.data.leaveReason : null
                            }
                        } else {
                            message.warning(res.message)
                        }
                    })
                }
            },
            handleChangeIdNumber(value) {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    http.post(dataUrl.getByIdNumber, {
                        idNumber: value
                    }).then(res => {
                        if (res.state) {
                            if(res.data == null) {
                                http.post(dataUrl.getStatusByIdNumber, {
                                    idNumber: value
                                }).then(res => {
                                    if (res.state) {
                                        if(res.data == 'LEAVE') {
                                            message.warning('该员工已离职！')
                                        } else if(res.data == 'NEVER') {
                                            message.warning('此人未入职！')
                                        }
                                    }
                                })
                            } else {
                                this.formData.username = res.data.staffPersonal.username;
                                let deArr = [];
                                let str = res.data.department.path.split('-');
                                let r = str.filter(function (s) {
                                    return s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
                                });
                                let strData = r;
                                for (let j in strData) {
                                    this.departmentId.push(Number(strData[j]))//字符串转Number类型
                                }
                                this.formData.positionId = res.data.position ? res.data.position.id : null;
                            }
                        } else {
                            message.warning(res.detailMessage)
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
                        if (!err) {
                            this.confirmLoading = true;
                            if(this.formData.id) {
                                http.post(dataUrl.leaveUpdate, {
                                    id: this.formData.id,
                                    departmentId: null,
                                    positionId: null,
                                    leaveType: values.leaveType ? values.leaveType : null,
                                    leaveTime: values.leaveTime.format('YYYY-MM-DD'),
                                    leaveOffice: values.leaveOffice ? values.leaveOffice : null,
                                    leaveReason: values.leaveReason
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
                            } else {
                                http.post(dataUrl.leaveAdd, {
                                    idNumber: values.idNumber,
                                    leaveType: values.leaveType ? values.leaveType : null,
                                    leaveTime: values.leaveTime.format('YYYY-MM-DD'),
                                    leaveOffice: values.leaveOffice ? values.leaveOffice : null,
                                    leaveReason: values.leaveReason
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
                this.formData.idNumber = null;
                this.formData.username = null;
                this.formData.leaveType = null;
                this.formData.leaveTime = null;
                this.formData.leaveOffice = null;
                this.formData.leaveReason =null;
                this.formData.departmentId = [];
                this.departmentId = [];
                this.type = null;
                this.visible = false;
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

    .selsectLeave p {
        color: #333;
    }

    .selsectLeave p:before {
        display: inline-block;
        margin-right: 4px;
        content: '*';
        font-family: SimSun;
        line-height: 1;
        font-size: 14px;
        color: #f5222d;
    }

    .selsectLeave p span {
        color: #f5222d;
        padding-left: 10px;
    }
</style>
