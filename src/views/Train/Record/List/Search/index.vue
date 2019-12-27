<template>
    <a-form :form="form" @submit="search" layout='inline' style="position:relative">
        <!-- <a class="expandBtn" @click="toggle"
           onselectstart="return false;">
            {{expand?'收起':'展开'}}
            <a-icon :type="expand ? 'up' : 'down'"/>
        </a> -->
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
            <a-col :md="8" :sm='24'>
                <a-form-item label="培训日期" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-range-picker style="width:100%;" @change="onChangeDate"
                        v-decorator="['trainingTime']"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="受训部门" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}" v-bind="formItemLayout">
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
                <a-form-item label="培训名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-input
                        v-decorator="['trainingName']"
                    /> 
                </a-form-item>
            </a-col>
        </a-row>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginTop:'20px'}">
            <a-col :md="8" :sm='24'>
                <a-form-item label="培训人" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-input
                        v-decorator="['trainingUsername']"
                    /> 
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
    name: 'TrainSearch',
    beforeCreate () {
      this.form = this.$form.createForm(this)
    },
    data () {
      return {
        expand: false,
        formData: {
            trainingTimeStart: null,
            trainingTimeEnd: null,
            companyId: null,
            trainingUsername: null,
            trainingName: null,
            departmentId: null
        },
        companyStatus: false,
        departmentId: null,
        formItemLayout: {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 20 },
          },
        }
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
                    this.formData.trainingUsername = values.trainingUsername ? values.trainingUsername : null;
                    this.formData.trainingName = values.trainingName ? values.trainingName : null;
                    this.formData.departmentId = this.departmentId ? this.departmentId : null;
                    this.$parent.searchItems(this.formData)
                },
            )
        },
        resetSearch () {
            this.form.resetFields();
            this.$parent.searchItems({});
            this.departmentId = null;
            // this.departmentList = null;
            this.formData.trainingTimeStart = null;
            this.formData.trainingTimeEnd = null;
            // this.formData.companyId = null;
            this.formData.trainingUsername = null;
            this.formData.trainingName = null;
            this.formData.departmentId = null;
        },
        onChangeDate(date, dateString) {
            console.log(date, dateString);
            this.formData.trainingTimeStart = dateString[0];
            this.formData.trainingTimeEnd = dateString[1];
        },
        selectDepartment(value) {
            this.departmentId = value ? value : null;
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
    .expandBtn {
        position: absolute;
        top: -20px;
        right: 0;
        z-index: 2;
    }
</style>
