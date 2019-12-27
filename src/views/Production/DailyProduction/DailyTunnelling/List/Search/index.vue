<template>
    <a-form :form="form" @submit="search" layout='inline'>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
            <a-col :md="8" :sm='24'>
                <a-form-item label="掘进工作面" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-select
                            showSearch
                            @search="drivingFaceSearch"
                            placeholder="请选择掘进工作面!"
                            :defaultActiveFirstOption="false"
                            :filterOption="false"
                            :notFoundContent="drivingFaceFetching? undefined : '暂无数据'"
                            v-decorator="['drivingFaceId', { initialValue:formData.drivingFaceId,rules: [] } ]"
                    >
                        <a-spin v-if="drivingFaceFetching" slot="notFoundContent" size="small"></a-spin>
                        <a-select-option v-for="d in drivingFaceData" :key="d.value">{{d.text}}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="掘进队伍" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-cascader
                            :options="departmentList"
                            v-decorator="['drivingTeamId']"
                            @change="selectDepartment"
                            changeOnSelect
                            placeholder="请选择入掘进队伍"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="日期" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-range-picker v-decorator="['dailyTime']" :style="{width: '100%'}" :disabledDate="disabledDate"/>
                </a-form-item>
            </a-col>
        </a-row>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginTop:'20px'}">
            <a-col :md="8" :sm='24'>
                <a-form-item label="班次" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-select style="width: 120px"
                              v-decorator="['shifts']"
                              :style="{width: '100%'}"
                    >
                        <a-select-option value="MORNING">早班</a-select-option>
                        <a-select-option value="NOON">中班</a-select-option>
                        <a-select-option value="EVENING">晚班</a-select-option>
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
    import {Button, Form, Row, Col, Input, Icon, Select, DatePicker,Cascader} from 'ant-design-vue'
    import debounce from 'lodash/debounce'
    import http from '../../../../../../utils/http'
    import moment from 'moment'

    const dataUrl = {
        getDrivingFaceByName: '/api/produce-driving-face/getByName',//根据名称搜索获取单条掘进面名称
        getDrivingFaceAll: '/api/produce-driving-face/getAllList',//获取全部掘进面名称
        getDepartmentAll: '/api/system-department/getTree',//获取当前账号部门、队伍
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
            ASelect: Select,
            ASelectOption: Select.Option,
            ADatePicker: DatePicker,
            ARangePicker: DatePicker.RangePicker,
            ACascader:Cascader,
        },
        name: 'DailyTunnellingSearch',
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        data() {
            //防抖动处理
            this.drivingFaceSearch = debounce(this.drivingFaceSearch, 500)
            return {
                formData:{
                    drivingFaceId:null,
                    drivingTeamId:null,
                    dailyTime: moment(new Date(), 'YYYY-MM-DD'),//时间
                    shifts:null
                },
                drivingFaceFetching: false,
                drivingFaceData: [],
                departmentList: [],
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
        mounted() {
            this.initdrivingFace();
            this.initDepartment()
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
            //工作面搜索
            drivingFaceSearch(search) {
                http.post(dataUrl.getDrivingFaceByName, {name: search}).then(res => {
                    if (res.state) {
                        let drivingFaceData = []
                        if (res.data) {
                            res.data.forEach((r) => {
                                drivingFaceData.push({
                                    value: r.id,
                                    text: r.drivingFaceName,
                                })
                            })
                        }
                        this.drivingFaceData = drivingFaceData
                    }
                })
            },
            //加载工作面信息
            initdrivingFace() {
                http.post(dataUrl.getDrivingFaceAll, {}).then(res => {
                    if (res.state) {
                        res.data.forEach((r) => {
                            this.drivingFaceData.push({
                                value: r.id,
                                text: r.drivingFaceName,
                            })
                        })
                    }
                })
            },
            //掘进队伍选择
            initDepartment() {
                http.post(dataUrl.getDepartmentAll,{id:0}).then(res => {
                    if (res.state) {
                        this.departmentList = JSON.parse(JSON.stringify(res.data).replace(/"departmentName"/g, '"lable"'));
                        this.filterItems(res.data);
                    }
                })
            },
            filterItems(obj) {
                for (var i in obj) {
                    obj[i].value = obj[i].id;
                    obj[i].label = obj[i].name;
                    if (obj[i].children) {
                        this.filterItems(obj[i].children)
                    }
                }
                this.departmentList = obj;
            },
            selectDepartment(value) {
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
