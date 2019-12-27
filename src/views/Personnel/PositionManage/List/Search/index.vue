<template>
    <a-form :form="form" @submit="search" layout='inline'>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
            <a-col :md="8" :sm='24'>
                <a-form-item label="名称" :label-col="{ span: 3 }" :wrapper-col="{ span: 18 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-input
                        v-decorator="['name']"
                    /> 
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
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
  import { Button, Form, Row, Col, Input, Icon, Radio, DatePicker, Select } from 'ant-design-vue'

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
        ASelectOption: Select.Option
    },
    name: 'PositionMaSearch',
    beforeCreate () {
      this.form = this.$form.createForm(this)
    },
    data () {
      return {
        expand: false,
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
            this.$emit("searchName",values);
          },
        )
      },
      resetSearch () {
        this.form.resetFields()
        this.$parent.searchName({})
      },
      toggle () {
        this.expand = !this.expand
      }
    }
  }
</script>

<style scoped>

</style>
