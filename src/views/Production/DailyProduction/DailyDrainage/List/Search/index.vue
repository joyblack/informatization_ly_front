<template>
    <a-form :form="form" @submit="search" layout='inline'>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
            <a-col :md="5" :sm='24' >
                <a-form-item label="工作面类型" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-select style="width: 120px"
                              v-decorator="['lithologyWay']"
                              :style="{width: '100%'}"
                    >
                        <a-select-option value="BULKCOAL">回采工作面</a-select-option>
                        <a-select-option value="TOTALROCK">掘进工作面</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :md="5" :sm='24'>
                <a-form-item label="工作面" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-input placeholder="工作面"
                             v-decorator="['cmName']"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="5" :sm='24'>
                <a-form-item label="日期" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-date-picker v-decorator="['dateTime']" :style="{width: '100%'}"/>
                </a-form-item>
            </a-col>
            <a-col :md="5" :sm='24'>
                <a-form-item label="测点编号" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-input placeholder="测点编号"
                             v-decorator="['cmName']"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="4" :sm='24'>
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
        },
        name: 'DailyDrainageSearch',
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        data() {
            return {
                cmName: null,
                loginName: null,
                dateTime: moment(new Date(), 'YYYY-MM-DD'),//时间
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
        methods: {
            search(e) {
                e.preventDefault();
                this.form.validateFields(
                    (err, values) => {
                        this.$parent.search(values)
                    },
                )
            },
            resetSearch() {
                this.form.resetFields()
                this.$parent.search({})
            },
        }
    }
</script>

<style scoped>

</style>
