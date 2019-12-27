<template>
    <a-form :form="form" @submit="search" layout='inline'>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
            <a-col :md="8" :sm='24'>
                <a-form-item label="名称" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-input placeholder="名称"
                             v-decorator="['backMiningFaceName']"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="开采日期" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-range-picker v-decorator="['startTimeStartEnd']" :style="{width: '100%'}" :disabledDate="disabledDate"/>
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24' :style="{marginTop:'4px'}">
                <a-form-item label="通风方式" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-select style="width: 120px"
                              v-decorator="['ventilationMode']"
                              :style="{width: '100%'}"
                    >
                        <a-select-option value="U">U型通风</a-select-option>
                        <a-select-option value="Y">Y型通风</a-select-option>
                        <a-select-option value="Z">Z型通风</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginTop:'20px'}">
            <a-col :md="8" :sm='24'>
                <a-form-item label="回采方式" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-select  style="width: 120px"
                               v-decorator="['backMiningMode']"
                               :style="{width: '100%'}"
                    >
                        <a-select-option value="BLASTING_MINING">炮采</a-select-option>
                        <a-select-option value="HIGH_GRADE">高档普采</a-select-option>
                        <a-select-option value="INTEGRATION_MACHINE">综合机械化</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24' style="position:absolute;top:5px;right:0;text-align:right;">
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
    import {Button, Form, Row, Col, Input, Icon, Select, DatePicker} from 'ant-design-vue'
    import moment from 'moment'
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
            ADatePicker: DatePicker,
            ARangePicker:DatePicker.RangePicker,
        },
        name: 'ExtractionSearch',
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        data() {
            return {
                cmName: null,
                loginName: null,
                dateTime:moment(new Date(),'YYYY-MM-DD'),//时间
                formItemLayout: {
                    labelCol: {
                        xs: {span: 24},
                        sm: {span: 6},
                    },
                    wrapperCol: {
                        xs: {span: 24},
                        sm: {span: 18},
                    },
                }
            }
        },
        methods: { //日期限制禁选
            disabledDate(current) {
                return current && current > moment();
            },
            search(e) {
                e.preventDefault();
                this.form.validateFields(
                    (err, values) => {
                        this.$parent.search(values)
                    },
                )
            },
            resetSearch() {
                this.form.resetFields();
                this.$parent.search({})
            },
        }
    }
</script>

<style scoped>

</style>
