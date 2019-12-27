<template>
    <a-form :form="form" @submit="search" layout='inline'>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
            <a-col :md="8" :sm='24'>
                <a-form-item label="名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-input style="width:100%;"
                        v-decorator="['name']"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <!-- <a-range-picker style="width:100%;" @change="onChangeTime"
                        v-decorator="['violationTime']"
                    /> -->
                    <a-input style="width:100%;"
                        v-decorator="['type']"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="创建时间" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-range-picker style="width:100%;" @change="onChangeTime"
                        v-decorator="['createTime']"
                    />
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
    name: 'BasicInfoSearch',
    beforeCreate () {
      this.form = this.$form.createForm(this)
    },
    data () {
      return {
        expand: false,
        formData: {
            name: null,
            type: null,
            createTimeStart: null,
            createTimeEnd: null
        },
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
    methods: {
        search (e) {
            e.preventDefault();
            this.form.validateFields(
                (err, values) => {
                    this.formData.name = values.name;
                    this.formData.type = values.type;
                    this.$parent.searchItems(this.formData)
                },
            )
        },
        resetSearch () {
            this.form.resetFields()
            this.$parent.searchItems({});
            this.formData.createTimeStart = null;
            this.formData.createTimeEnd = null;
            this.formData.name = null;
            this.formData.type = null;
        },
        onChangeTime(date, dateString) {
            console.log(date, dateString);
            this.formData.createTimeStart = dateString[0];
            this.formData.createTimeEnd = dateString[1];
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
