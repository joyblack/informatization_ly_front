<template>
    <a-form :form="form" @submit="search" layout='inline' v-else>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginBottom:'20px'}">
            <a-col :md="8" :sm='24'>
                <a-form-item label="名称" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-input placeholder="请输入名称"
                             v-decorator="['name']"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="编号" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-input placeholder="请输入编号"
                             v-decorator="['code']"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="管理员" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-input placeholder="请输入管理员"
                             v-decorator="['admin']"
                    />
                </a-form-item>
            </a-col>
        </a-row>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginBottom:'20px', position:'relative'}">
            <a-col :md="8" :sm='24'>
                <a-form-item label="状态" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-select v-decorator="['status']">
                        <a-select-option value="START">启用</a-select-option>
                        <a-select-option value="STOP">停用</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>

            <a-col style="position:absolute;right:0;top:5px;">
                <a-button type="primary" html-type="submit">
                    搜索
                </a-button>
                <a-button :style="{ marginLeft: '8px' }" @click="resetSearch">
                    重置
                </a-button>
            </a-col>
        </a-row>
    </a-form>
</template>

<script>
  import { Button, Form, Row, Col, Input, Icon, Select } from 'ant-design-vue'

  export default {
    components: {
      AForm: Form,
      AFormItem: Form.Item,
      ARow: Row,
      ACol: Col,
      AButton: Button,
      AInput: Input,
      AIcon: Icon,
      ASelect: Select,
      ASelectOption: Select.Option,
    },
    name: 'WarehouseSearch',
    beforeCreate () {
      this.form = this.$form.createForm(this)
    },
    data () {
      return {
        expand: false,
        userType: null,
        userStatus: null,
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
    methods: {
      search (e) {
        e.preventDefault();
        this.form.validateFields(
          (err, values) => {
            this.$parent.search(values)
          },
        )
      },
      resetSearch () {
        this.form.resetFields()
        this.$parent.search({})
      },
      toggle () {
        this.expand = !this.expand
      },
    }
  }
</script>

<style scoped>

</style>
