<template>
    <a-form :form="form" @submit="search" layout='inline'>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
            <a-col :md="8" :sm='24'>
                <a-form-item label="巡检日期" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}"
                             v-bind="formItemLayout">
                    <a-range-picker style="width:100%;" @change="onChangeTime"
                                    v-decorator="['inspectTime']"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="巡检部门" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}"
                             v-bind="formItemLayout">
                    <a-cascader
                            :options="departmentList ? departmentList : null"
                            placeholder=""
                            v-decorator="[
                            'inspectDepartmentId']"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="巡检类型" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}"
                             v-bind="formItemLayout">
                    <a-select
                            v-decorator="['inspectType']"
                    >
                        <a-select-option value="GROUND">地面</a-select-option>
                        <a-select-option value="MACHINE">机电</a-select-option>
                        <a-select-option value="ONE_THROUGH_AND_THREE_PREVENTION">一通三防</a-select-option>
                        <a-select-option value="ROOF">顶板</a-select-option>
                        <a-select-option value="WATER_PREVENTION">防治水</a-select-option>
                        <a-select-option value="OTHER">其他</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginTop:'20px'}">
            <a-col :md="8" :sm='24'>
                <a-form-item label="整改期限" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}"
                             v-bind="formItemLayout">
                    <a-range-picker style="width:100%;" @change="onChangeDate"
                                    v-decorator="['deadTime']"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="验收结果" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}"
                             v-bind="formItemLayout">
                    <a-select
                            v-decorator="['rectificationStatus']"
                    >
                        <a-select-option value="RECTIFICATION_YES">已整改</a-select-option>
                        <a-select-option value="RECTIFICATION_NO">未整改</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="整改超时" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}"
                             v-bind="formItemLayout">
                    <a-select
                            v-decorator="['isOverTime']"
                    >
                        <a-select-option value="YES">是</a-select-option>
                        <a-select-option value="NO">否</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginTop:'20px', position: 'relative'}">
            <a-col :md="8" :sm='24'>
                <a-form-item label="巡检地点" v-bind="formItemLayout" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }"
                             :style="{width: '100%'}">
                    <a-input
                            v-decorator="['inspectPlace']"
                    />
                </a-form-item>
            </a-col>
            <a-col style="position:absolute;top:10px;right:0;">
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
    import {Button, Form, Row, Col, Input, Icon, Radio, DatePicker, Select, Cascader} from 'ant-design-vue'
    import http from '../../../../../utils/http'

    const dataUrl = {
        // getDepartmentTree: '/api/department/getTree'
    };

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
        name: 'InspectionSearch',
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        data() {
            return {
                expand: false,
                formData: {
                    inspectTimeStart: null,
                    inspectTimeEnd: null,
                    inspectDepartmentId: [],
                    inspectType: null,
                    deadTimeStart: null,
                    deadTimeEnd: null,
                    rectificationStatus: null,
                    isOverTime: null,
                    inspectPlace: null,
                },
                companyStatus: false,
                formItemLayout: {
                    labelCol: {
                        xs: {span: 24},
                        sm: {span: 4},
                    },
                    wrapperCol: {
                        xs: {span: 24},
                        sm: {span: 20},
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
            search(e) {
                e.preventDefault();
                this.form.validateFields(
                    (err, values) => {
                        this.formData.inspectDepartmentId = values.inspectDepartmentId;
                        this.formData.inspectType = values.inspectType;
                        this.formData.violationPlace = values.violationPlace;
                        this.formData.rectificationStatus = values.rectificationStatus;
                        this.formData.isOverTime = values.isOverTime;
                        this.formData.inspectPlace = values.inspectPlace;
                        this.$parent.searchItems(this.formData)
                    },
                )
            },
            resetSearch() {
                this.form.resetFields();
                this.$parent.searchItems({});
                this.formData.inspectTimeStart = null;
                this.formData.inspectTimeEnd = null;
                this.formData.inspectDepartmentId = null;
                this.formData.inspectType = null;
                this.formData.deadTimeStart = null;
                this.formData.deadTimeEnd = null;
                this.formData.rectificationStatus = null;
                this.formData.isOverTime = null;
                this.formData.inspectPlace = null;
            },
            onChangeTime(date, dateString) {
                this.formData.inspectTimeStart = dateString[0];
                this.formData.inspectTimeEnd = dateString[1];
            },
            onChangeDate(date, dateString) {
                this.formData.deadTimeStart = dateString[0];
                this.formData.deadTimeEnd = dateString[1];
            },
            toggle() {
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
