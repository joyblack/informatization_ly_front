<template>
    <a-form :form="form" @submit="search" layout='inline'>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
            <a-col :md="8" :sm='24'>
                <a-form-item label="钻孔工作名称" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-select
                            showSearch
                            @search="drillWorkSearch"
                            placeholder="请选择钻孔工作名称!"
                            :defaultActiveFirstOption="false"
                            :filterOption="false"
                            :notFoundContent="drillWorkFetching? undefined : '暂无数据'"
                            v-decorator="['drillWorkId', { initialValue:formData.drillWorkId,rules: [] } ]"
                    >
                        <a-spin v-if="drillWorkFetching" slot="notFoundContent" size="small"></a-spin>
                        <a-select-option v-for="d in drillWorkData" :key="d.value">{{d.text}}</a-select-option>
                    </a-select>
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="打钻队伍" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-cascader
                            :options="departmentList"
                            v-decorator="['drillTeamId']"
                            @change="selectDepartment"
                            changeOnSelect
                            placeholder="请选择入掘进队伍"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="日期" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-range-picker v-decorator="['dailyTime']" :style="{width: '100%'}"/>
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
    import {Button, Form, Row, Col, Input, Icon, Select, DatePicker, Cascader} from 'ant-design-vue'
    import http from '../../../../../../utils/http'
    import debounce from 'lodash/debounce'

    const dataUrl = {
        getDepartmentAll: '/api/department/getCompanyTree',//获取当前账号部门、队伍
        getDrillWorkByName: '/api/produce-drill-work/getByName',//根据名称搜索获取单条钻孔工作名称
        getDrillWorkAll: '/api/produce-drill-work/getAllList',//获取全部钻孔工作名称
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
            ACascader: Cascader,
        },
        name: 'DailyDrillingSearch',
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        data() {
            //防抖动处理
            this.drillWorkSearch = debounce(this.drillWorkSearch, 500)
            return {
                formData: {
                    drillWorkId: null,
                },
                drillWorkFetching: false,
                drillWorkData: [],
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
            this.initDepartment()
            this.initdrillWork()
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
            //掘进队伍选择
            initDepartment() {
                http.post(dataUrl.getDepartmentAll).then(res => {
                    if (res.state) {
                        this.departmentList = JSON.parse(JSON.stringify(res.data).replace(/"departmentName"/g, '"lable"'));
                        this.filterItems(res.data);
                    }
                })
            },
            filterItems(obj) {
                for (var i in obj) {
                    obj[i].value = obj[i].id;
                    obj[i].label = obj[i].departmentName;
                    if (obj[i].children) {
                        this.filterItems(obj[i].children)
                    }
                }
                this.departmentList = obj;
            },
            selectDepartment(value) {
                // this.formData.drillTeamId = value.pop()

            },
            //工作面搜索
            drillWorkSearch(search) {
                http.post(dataUrl.getDrillWorkByName, {name: search}).then(res => {
                    console.log(res)
                    if (res.state) {
                        let drillWorkData = []
                        if (res.data) {
                            res.data.forEach((r) => {
                                drillWorkData.push({
                                    value: r.id,
                                    text: r.drillWorkName,
                                })
                            })
                        }
                        this.drillWorkData = drillWorkData
                    }
                })
            },
            //加载工作面信息
            initdrillWork() {
                http.post(dataUrl.getDrillWorkAll, {}).then(res => {
                    if (res.state) {
                        if (res.data){
                            res.data.forEach((r) => {
                                this.drillWorkData.push({
                                    value: r.id,
                                    text: r.drillWorkName,
                                })
                            })
                        }
                    }
                })
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
