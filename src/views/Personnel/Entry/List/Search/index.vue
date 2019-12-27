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
                <a-form-item label="出生日期" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-range-picker style="width:100%;" @change="onChangeBirthDate"
                        v-decorator="['birthDate']"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="性别" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-radio-group
                        @change="selectSex($event)"
                        v-decorator="['sex']"
                    >
                        <a-radio value="MAN">男</a-radio>
                        <a-radio value="WOM">女</a-radio>
                    </a-radio-group>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginTop:'20px'}">
            <a-col :md="8" :sm='24'>
                <a-form-item label="民族" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-select
                        showSearch
                        :filterOption="filterOption"
                        @change="selectNationality($event)"
                        v-decorator="['nationality']"
                    >
                        <a-select-option v-for="(item,index) in nationalityList" :value="item.name" :key="index">{{item.name}}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="婚姻状况" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-select
                        :filterOption="filterOption"
                        @change="selectMarryStatus($event)"
                        v-decorator="['marryStatus']"
                    >
                        <a-select-option value="MARRAY_NO">未婚</a-select-option>
                        <a-select-option value="MARRAY_YES">已婚</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="最高学历" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-select
                        showSearch
                        :filterOption="filterOption"
                        @change="selectEducation($event)"
                        v-decorator="['education']"
                    >
                        <a-select-option v-for="(item,index) in eduData" :value="item.id" :key="index">{{item.eduName}}
                        </a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginTop:'20px'}">
            <a-col :md="8" :sm='24'>
                <a-form-item label="入职部门" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-cascader
                        :options="departmentList ? departmentList : null"
                        placeholder=""
                        @change="selectDepartment($event)"
                        v-decorator="['departmentId']"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="入职职位" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" :style="{width: '100%'}" v-bind="formItemLayout">
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
  import moment from 'moment'


  const dataUrl = {
    getDepartmentTree: '/api/department/getTree',
  };


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
    name: 'EntrySearch',
    props: {
        departmentList: Array,
        positionList: Array,
        nationalityList: Array
    },
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
            birthDateStart: null,
            birthDateEnd: null,
            sex: null,
            nationality: null,
            education: null,
            departmentId: null,
            positionId: null,
            marryStatus: null
        },
        companyStatus: false,
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
        eduData: [
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
        ],
      }
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
            this.formData.birthDateStart = null;
            this.formData.birthDateEnd = null;
            this.formData.sex = null;
            this.formData.nationality = null;
            this.formData.education = null;
            this.formData.nationality = null;
            this.formData.departmentId = null;
            this.formData.positionId = null;
            this.formData.marryStatus = null;
        },
        selectItem(e) {
            this.form.resetFields(`inputValue`,null);
        },
        selectSex(e) {
            this.formData.sex = e.target.value ? e.target.value : null;
        },
        onChangeBirthDate(date, dateString) {
            this.formData.birthDateStart = dateString[0];
            this.formData.birthDateEnd = dateString[1];
        },
        selectNationality(e) {
            this.formData.nationality = e ? e : null;
        },
        //选择学历
        selectEducation(e) {
            this.formData.education = e ? e : null;
        },
        selectDepartment(e) {
            this.formData.departmentId = e ? e : null;
        },
        selectPosition(e) {
            this.formData.positionId = e ? e : null;
        },
        selectMarryStatus(e) {
            this.formData.marryStatus = e ? e : null;
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
