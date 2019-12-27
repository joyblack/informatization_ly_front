<template>
    <a-form :form="form" @submit="search" layout='inline'>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
            <a-col :md="8" :sm='24'>
                <a-form-item label="设备名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-input style="width:100%;"
                        v-decorator="['deviceName']"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="型号" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-input style="width:100%;"
                        v-decorator="['deviceModel']"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="生产厂家" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-input style="width:100%;"
                        v-decorator="['manufacture']"
                    />
                </a-form-item>
            </a-col>
        </a-row>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginTop:'20px'}">
            <a-col :md="8" :sm='24'>
                <a-form-item label="使用部门" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-cascader
                        :labelInValue="true"
                        :options="departmentList ? departmentList : null"
                        placeholder=""
                        v-decorator="['useDepartmentId']"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="领用人" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-input style="width:100%;"
                        v-decorator="['usePeople']"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="领用日期" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-range-picker style="width:100%;"
                        v-decorator="['useDate']"
                    />
                </a-form-item>
            </a-col>
        </a-row>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginTop:'20px'}">
            <a-col :md="8" :sm='24'>
                <a-form-item label="安装地点" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-input style="width:100%;"
                        v-decorator="['installPlace']"
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
    name: 'EquipmentsSearch',
    beforeCreate () {
      this.form = this.$form.createForm(this)
    },
    data () {
      return {
        expand: false,
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
        departmentList: Array
    },
    methods: {
        search (e) {
            e.preventDefault();
            this.form.validateFields(
                (err, values) => {
                    this.$parent.searchItems(values)
                },
            )
        },
        resetSearch () {
            this.form.resetFields()
            this.$parent.searchItems({});
        },
        toggle () {
            this.expand = !this.expand
        },
        //下拉框搜索
        filter(inputValue, path) {
            return (path.some(option => (option.label).toLowerCase().indexOf(inputValue.toLowerCase()) > -1));
        }
    }
  }
</script>

<style scoped>

</style>
