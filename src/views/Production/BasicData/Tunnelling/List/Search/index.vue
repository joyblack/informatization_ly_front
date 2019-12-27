<template>
    <a-form :form="form" @submit="search" layout='inline'>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
            <a-col :md="8" :sm='24'>
                <a-form-item label="名称" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-input placeholder="名称"
                             v-decorator="['drivingFaceName']"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="开掘日期" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-range-picker v-decorator="['startTimeStartEnd']" :style="{width: '100%'}" :disabledDate="disabledDate"/>
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24' :style="{marginTop:'4px'}">
                <a-form-item label="岩性" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-select style="width: 120px"
                              v-decorator="['rockCharacter']"
                              :style="{width: '100%'}"
                    >
                        <a-select-option value="ALL_COAL">全煤</a-select-option>
                        <a-select-option value="ALL_ROCK">全岩</a-select-option>
                        <a-select-option value="HALF_COAL">半煤巷</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginTop:'20px'}">
            <a-col :md="8" :sm='24'>
                <a-form-item label="支护方式" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-select style="width: 120px"
                              v-decorator="['supportMethod']"
                              :style="{width: '100%'}"
                    >
                        <a-select-option value="ANCHOR_SPRAY">锚喷</a-select-option>
                        <a-select-option value="ANCHOR_NET">锚网</a-select-option>
                        <a-select-option value="MASONRY">砌碹</a-select-option>
                        <a-select-option value="CER_MINUS">架棚</a-select-option>
                        <a-select-option value="COMBINED_SUPPORT">联合支护</a-select-option>
                        <a-select-option value="U_SHAPED_SHED">U型棚</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="断面形式" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-select style="width: 120px"
                              v-decorator="['crossSectionType']"
                              :style="{width: '100%'}"
                    >
                        <a-select-option value="RECTANGLE">矩形</a-select-option>
                        <a-select-option value="TRAPEZIUM">梯形</a-select-option>
                        <a-select-option value="HALF_ROUND">半圆拱</a-select-option>
                        <a-select-option value="THREE_ARCH">三星拱</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="掘进工艺" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-select style="width: 120px"
                              v-decorator="['drivingTechnologyType']"
                              :style="{width: '100%'}"
                    >
                        <a-select-option value="BLASTING_DRIVING">炮掘</a-select-option>
                        <a-select-option value="FULLY">综掘</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginTop:'20px',height: '35px'}">
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
            ARangePicker: DatePicker.RangePicker
        },
        name: 'TunnellingSearch',
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

            //日期限制禁选
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
                this.form.resetFields()
                this.$parent.search({})
            },
        }
    }
</script>

<style scoped>

</style>
