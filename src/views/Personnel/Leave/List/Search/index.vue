<template>
    <a-form :form="form" @submit="search" layout='inline'>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
            <a-col :md="8" :sm='24'>
                <a-form-item label="" :label-col="{ span: 0 }" :wrapper-col="{ span: 22 }" style="width:100%;display:flex;justify-content:flex-end;" v-bind="formItemLayout">
                    <a-input placeholder="请输入"
                        v-decorator="['inputValue']"
                    >
                        <a-select
                            slot="addonBefore"
                            @change="selectItem($event)"
                            v-decorator="[
                                    'prefix',
                                    { initialValue: 'username' }
                                ]"
                            style="width: 100px"
                        >
                            <a-select-option value="username">
                                姓名
                            </a-select-option>
                            <a-select-option value="idNumber">
                                身份证号
                            </a-select-option>
                            <a-select-option value="phone">
                                联系方式
                            </a-select-option>
                        </a-select>
                    </a-input>  
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="离职类型" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-select
                        @change="selectLeaveType($event)"
                        v-decorator="['leaveType']"
                    >
                        <a-select-option value="NORMAL">正常离职</a-select-option>
                        <a-select-option value="UN_AUTHORIZED">擅自离职</a-select-option>
                        <a-select-option value="ILLNESS">因病离职</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="离职日期" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-range-picker style="width:100%;" @change="onChangeDate"
                        v-decorator="['leaveTime']"
                    />
                </a-form-item>
            </a-col>
        </a-row>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginTop:'20px'}">
            <a-col :md="8" :sm='24'>
                <a-form-item label="离职手续是否齐全" v-bind="formItemLayout" :label-col="{ span: 10 }" :wrapper-col="{ span: 14 }" :style="{width: '100%'}">
                        <a-select
                            @change="changeLeave"
                            v-decorator="[
                                'leaveOffice'
                            ]"
                        >
                            <a-select-option value="YES">是</a-select-option>
                            <a-select-option value="NO">否</a-select-option>
                        </a-select>
                    </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="入职部门" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-cascader 
                        :options="departmentList ? departmentList : null" 
                        placeholder="" 
                        @change="selectDepartment"
                        v-decorator="[
                            'departmentId']"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="入职职位" :label-col="{ span: 9 }" :wrapper-col="{ span: 15 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-select
                        showSearch
                        :filterOption="filterOption"
                        @change="selectPosition($event)"
                        v-decorator="['positionId']"
                    >
                        <a-select-option v-for="(item,index) in positionList" :value="item.id" :key="index">{{item.name}}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
        </a-row>

        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginTop:'20px'}">
            <a-col style="position:absolute;top:5px;right:0;">
                <a-button type="primary" html-type="submit">
                    搜索
                </a-button>
                <a-button :style="{ marginLeft: '15px' }" @click="resetSearch">
                    重置
                </a-button>
            </a-col>
        </a-row>
    </a-form>
</template>

<script>
  import { Button, Form, Row, Col, Input, Icon, Radio, DatePicker, Select, Cascader } from 'ant-design-vue'
  import http from '../../../../../utils/http'

    const dataUrl = {
        // getDepartmentTree: '/api/department/getTree'
    }

  export default {
    components: {
        AForm: Form,
        AFormItem: Form.Item,
        ARow: Row,
        ACol: Col,
        AButton: Button,
        AInput: Input,
        AIcon: Icon,
        ARadio: Radio,
        ARadioGroup: Radio.Group,
        ADatePicker: DatePicker,
        ARangePicker: DatePicker.RangePicker,
        ASelect: Select,
        ASelectOption: Select.Option,
        ACascader: Cascader
    },
    name: 'LeaveSearch',
    beforeCreate () {
      this.form = this.$form.createForm(this)
    },
    data () {
      return {
        expand: false,
        formData: {
            username: null,
            idNumber: null,
            phone: null,
            leaveType: null,
            departmentId: null,
            positionId: null,
            leaveTimeStart: null,
            leaveTimeEnd: null,
            leaveOffice: null
        },
        departmentId: null,
        formItemLayout: {
            labelCol: {
                xs: { span: 24 },
                sm: { span: 4 },
            },
            wrapperCol: {
                xs: { span: 24 },
                sm: { span: 20 },
            }
        },
      }
    },
    props: {
        departmentList: Array,
        positionList: Array
    },
    mounted() {
    },
    methods: {
        search (e) {
            e.preventDefault();
            this.form.validateFields(
                (err, values) => {
                    if(values.prefix == 'username') {
                        this.formData.username = values.inputValue;
                        this.formData.idNumber = null;
                        this.formData.phone = null;
                    } else if(values.prefix == 'idNumber') {
                        this.formData.username = null;
                        this.formData.idNumber = values.inputValue;
                        this.formData.phone = null;
                    } else {
                        this.formData.username = null;
                        this.formData.idNumber = null;
                        this.formData.phone = values.inputValue;
                    }
                    this.formData.departmentId = this.departmentId ? this.departmentId : null;
                    this.$parent.searchItems(this.formData)
                },
            )
        },
        resetSearch () {
            this.form.resetFields()
            this.$parent.searchItems({});
            this.$parent.username = null;
            this.formData.idNumber = null;
            this.formData.phone = null;
            this.formData.leaveType = null;
            this.formData.departmentId = null;
            this.formData.positionId = null;
            this.formData.leaveTimeStart = null;
            this.formData.leaveTimeEnd = null;
            this.formData.leaveOffice = null;
            this.departmentId = null;
        },
        selectItem(e) {
            this.form.resetFields(`inputValue`,null); 
        },
        onChangeDate(date, dateString) {
            console.log(date, dateString);
            this.formData.leaveTimeStart = dateString[0];
            this.formData.leaveTimeEnd = dateString[1];
        },
        selectLeaveType(e) {
            this.formData.leaveType = e ? e : null;
        },
        selectDepartment(value) {
            this.departmentId = value ? value : null;
        },
        selectPosition(e) {
            this.formData.positionId = e ? e : null;
        },
        changeLeave(e) {
            this.formData.leaveOffice = e ? e : null;
        },
        toggle () {
            this.expand = !this.expand
        },
        //下拉框搜索
        filterOption(input, option) {
            return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
        }
    }
  }
</script>

<style scoped>

</style>
