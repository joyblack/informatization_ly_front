<template>
    <a-form :form="form" @submit="search" layout='inline'>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
            <a-col :md="8" :sm='24'>
                <a-form-item label="违章部门" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-cascader 
                        :options="departmentList ? departmentList : null" 
                        placeholder="" 
                        v-decorator="[
                            'violationDepartmentId']"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="违章日期" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-range-picker style="width:100%;" @change="onChangeTime"
                        v-decorator="['violationTime']"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="违章人" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-input style="width:100%;"
                        v-decorator="['violationPeople']"
                    />
                </a-form-item>
            </a-col>
        </a-row>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginTop:'20px'}">
            <a-col :md="8" :sm='24'>
                <a-form-item label="违章地点" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-input style="width:100%;"
                        v-decorator="['violationPlace']"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="班次" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-select
                        v-decorator="['dailyShift']"
                    >
                        <a-select-option value="MORNING">早班</a-select-option>
                        <a-select-option value="NOON">中班</a-select-option>
                        <a-select-option value="EVENING">晚班</a-select-option>
                        <a-select-option value="OTHER">其他</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="检查人" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-input style="width:100%;"
                        v-decorator="['checkPeople']"
                    />
                </a-form-item>
            </a-col>
        </a-row>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginTop:'20px'}">
            <a-col :md="8" :sm='24'>
                <a-form-item label="违章类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-select
                        v-decorator="['threeViolationType']"
                    >
                        <a-select-option value="TASK">违章作业</a-select-option>
                        <a-select-option value="COMMAND">违章指挥</a-select-option>
                        <a-select-option value="LABOR_DISCIPLINE">违反劳动纪律</a-select-option>
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
    name: 'BreakRulesSearch',
    beforeCreate () {
      this.form = this.$form.createForm(this)
    },
    data () {
      return {
        expand: false,
        formData: {
            violationTimeStart: null,
            violationTimeEnd: null,
            violationDepartmentId: [],
            violationPeople: null,
            violationPlace: null,
            dailyShift: null,
            checkPeople: null,
            threeViolationType: null
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
      }
    },
    props: {
        departmentList: Array
    },
    mounted() {
    },
    methods: {
        search (e) {
            e.preventDefault();
            this.form.validateFields(
                (err, values) => {
                    this.formData.violationDepartmentId = values.violationDepartmentId;
                    this.formData.violationPeople = values.violationPeople;
                    this.formData.violationPlace = values.violationPlace;
                    this.formData.dailyShift = values.dailyShift;
                    this.formData.checkPeople = values.checkPeople;
                    this.formData.threeViolationType = values.threeViolationType;
                    this.$parent.searchItems(this.formData)
                },
            )
        },
        resetSearch () {
            this.form.resetFields()
            this.$parent.searchItems({});
            this.formData.violationTimeStart = null;
            this.formData.violationTimeEnd = null;
            this.formData.violationDepartmentId = [];
            this.formData.violationPeople = null;
            this.formData.violationPlace = null;
            this.formData.dailyShift = null;
            this.formData.checkPeople = null;
            this.formData.threeViolationType = null;
        },
        onChangeTime(date, dateString) {
            this.formData.violationTimeStart = dateString[0];
            this.formData.violationTimeEnd = dateString[1];
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
