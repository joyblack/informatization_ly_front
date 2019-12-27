<template>
    <a-form :form="form" @submit="search" layout='inline'>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
            <a-col :md="8" :sm='24'>
                <a-form-item label="回采工作面" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-select
                            showSearch
                            @search="backMiningFaceSearch"
                            placeholder="请选择回采工作面!"
                            :defaultActiveFirstOption="false"
                            :filterOption="false"
                            :notFoundContent="backMiningFaceFetching? undefined : '暂无数据'"
                            v-decorator="['backMiningFaceId', { initialValue:formData.backMiningFaceId,rules: [] } ]"
                    >
                        <a-spin v-if="backMiningFaceFetching" slot="notFoundContent" size="small"></a-spin>
                        <a-select-option v-for="d in backMiningFaceData" :key="d.value">{{d.text}}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="回采队伍" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-cascader
                            :options="departmentList"
                            v-decorator="['teamId']"
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
    import moment from 'moment'
    import http from '../../../../../../utils/http'

    const dataUrl = {
        getBackMiningFaceByName: '/api/produce-back-mining-face/getByName',//根据名称搜索获取单条回采面名称
        getBackMiningFaceAll: '/api/produce-back-mining-face/getAllList',//获取全部回采面名称
        getDepartmentAll: '/api/system-department/getTree',//获取当前账号部门、队伍
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
            ASelect: Select,
            ASelectOption: Select.Option,
            ADatePicker: DatePicker,
            ARangePicker: DatePicker.RangePicker,
            ACascader:Cascader,
        },
        name: 'DailyExtractionSearch',
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        data() {
            //防抖动处理
            this.backMiningFaceSearch = debounce(this.backMiningFaceSearch, 500)
            return {
                formData:{
                    backMiningFaceId:null,
                    teamId:null,
                    dailyTime: null,//时间
                    shifts:null
                },
                backMiningFaceFetching: false,
                backMiningFaceData: [],
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
            this.initbackMiningFace();
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
            disabledDate(current) {
                return current && current > moment();
            },
            //工作面搜索
            backMiningFaceSearch(search) {
                http.post(dataUrl.getBackMiningFaceByName, {name: search}).then(res => {
                    if (res.state) {
                        let backMiningFaceData = [];
                        if (res.data) {
                            res.data.forEach((r) => {
                                backMiningFaceData.push({
                                    value: r.id,
                                    text: r.backMiningFaceName,
                                })
                            })
                        }
                        this.backMiningFaceData = backMiningFaceData
                    }
                })
            },
            //加载工作面信息
            initbackMiningFace() {
                http.post(dataUrl.getBackMiningFaceAll, {}).then(res => {
                    if (res.state) {
                        res.data.forEach((r) => {
                            this.backMiningFaceData.push({
                                value: r.id,
                                text: r.backMiningFaceName,
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
                // this.formData.drillTeamId = value.pop()

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
