<template>
    <a-form :form="form" @submit="search" layout='inline'>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
            <a-col :md="8" :sm='24'>
                <a-form-item label="钻孔工作名称" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-input placeholder="钻孔工作名称"
                             v-decorator="['drillWorkName']"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="开孔日期" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-range-picker v-decorator="['dateTime']" :style="{width: '100%'}" :disabledDate="disabledDate"/>
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="钻孔类别" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-select style="width: 120px"
                              v-decorator="['drillCategory']"
                              :style="{width: '100%'}"
                    >
                        <a-select-option value="THROUGH_LAYER_CATEGORY">穿层钻孔</a-select-option>
                        <a-select-option value="BEDDING_CATEGORY">顺层钻孔</a-select-option>
                        <a-select-option value="HIGH_POSITION_CATEGORY">高位钻孔</a-select-option>
                        <a-select-option value="GEOLOGY_CATEGORY">地质钻孔</a-select-option>
                        <a-select-option value="OTHER_CATEGORY">其他钻孔</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginTop:'20px'}">
            <a-col :md="8" :sm='24'>
                <a-form-item label="钻孔类型" :label-col="{ span: 8 }" :wrapper-col="{ span: 16 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-select  style="width: 120px"
                               v-decorator="['drillType']"
                               :style="{width: '100%'}"
                    >
                        <a-select-option value="GAS_TYPE">瓦斯</a-select-option>
                        <a-select-option value="GEOLOGY_TYPE">地质</a-select-option>
                        <a-select-option value="WATER_DETECTION_TYPE">探水</a-select-option>
                        <a-select-option value="OTHER_TYPE">其他</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="钻孔岩性" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-select  style="width: 120px"
                               v-decorator="['drillRockCharacter']"
                               :style="{width: '100%'}"
                    >
                        <a-select-option value="COAL_LAYER">煤层</a-select-option>
                        <a-select-option value="ROCK_LAYER">岩层</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'v-bind="formItemLayout" style="position:absolute;top:5px;right:0;text-align:right;">
                <a-button type="primary" html-type="submit" >
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
            ADatePicker:DatePicker,
            ARangePicker:DatePicker.RangePicker
        },
        name: 'DrillingSearch',
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        data() {
            return {
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
            //日期限制禁选
            disabledDate(current){
                return current && current > moment();
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
