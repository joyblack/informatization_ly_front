<template>
    <a-modal
        title="新增安全巡检"
        :width='1100'
        :visible="visible"
        @ok="handleSubmit"
        @cancel="handleCancel"
        :destroyOnClose="true"
        :confirmLoading="confirmLoading"
        :afterClose='afterClose'
        :closable="false"
        :maskClosable="true"
        :keyboard="true"
    >
        <a-form :form="form" :style="{ marginTop: '8px' }">

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="巡检日期" v-bind="formItemLayout" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                        <a-date-picker style="width:100%;"
                            v-decorator="[
                                'inspectTime',
                                {
                                    initialValue:formData.inspectTime,
                                    rules: [{ required: true, message: '请选择巡检日期！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="巡检部门" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-cascader
                            :options="departmentList ? departmentList : null"
                            placeholder=""
                            v-decorator="[
                                'inspectDepartmentId',
                                {
                                    initialValue:formData.inspectDepartmentId,
                                    rules: [{ required: true, message: '请选择巡检部门！' }]
                                }
                            ]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="巡检类型" v-bind="formItemLayout" :label-col="{ span: 6 }" :wrapper-col="{ span: 18 }">
                        <a-select
                            v-decorator="[
                                'inspectType',
                                {
                                    initialValue:formData.inspectType,
                                    rules: [{ required: true, message: '请选择巡检类型！' }]
                                }
                            ]"
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

            <a-row class="selsectInspection" style="margin:0 0 30px;">
                <p>问题项:
                    <a-button type="primary" @click="addItem" style="margin-left:15px;"><a-icon type="plus" />添加问题项</a-button>
                    <span v-show="problemsStatus">带有 * 的问题项数据不能为空！</span>
                </p>
                <a-table
                    :columns="columns"
                    :dataSource="dataSource"
                    :pagination="false"
                    :bordered="true"
                    class="inspectionTable"
                >
                    <!-- 巡检地点-->
                    <template slot="inspectPlace" slot-scope="text, record, index">
                        <a-input
                            :value="text"
                            @change="e => handleChangePlace(e.target.value, record.key)"
                        />
                    </template>

                    <!-- 问题描述-->
                    <template slot="problemDescribes" slot-scope="text, record, index">
                        <a-input
                            :value="text"
                            @change="e => handleChangeDes(e.target.value, record.key)"
                        />
                    </template>

                    <!-- 负责人-->
                    <template slot="responsePeople" slot-scope="text, record, index">
                        <a-input
                            :value="text"
                            @change="e => handleChangeResponsePeople(e.target.value, record.key)"
                        />
                    </template>

                    <!-- 整改期限-->
                    <template slot="deadTime" slot-scope="text, record, index">
                        <a-date-picker
                            :value="text"
                            @change="e => handleChangeDeadTime(e, record.key)"
                        />
                    </template>

                    <!-- 超时前提示天数-->
                    <template slot="tipDays" slot-scope="text, record">
                        <a-input-number
                            :min="0"
                            :precision="0"
                            :value="text"
                            @change="e => handleChangeTipDays(e, record.key)"
                        />
                    </template>
                    <template slot="edit" slot-scope="text, record, index">
                        <div class='editable-row-operations'>
                            <span>
                                <a @click="() => save(record.key)">保存</a>
                                <!-- <a @click="() => cancel(record.key)" style="margin-left: 10px;">取消</a> -->
                                <a-popconfirm
                                    v-if="dataSource.length"
                                    title="确定要删除该问题项吗?"
                                    @confirm="() => onDelete(record.key)">
                                    <a href="javascript:;" style="margin-left: 10px;">删除</a>
                                </a-popconfirm>
                            </span>
                        </div>
                    </template>
                </a-table>
            </a-row>
        </a-form>
    </a-modal>
</template>

<script>
    import {Modal, Form, Table, Row, Col, Button, Input, InputNumber, Select, Icon, DatePicker, Tooltip, message, Cascader, Popconfirm} from 'ant-design-vue'
    import http from '../../../../utils/http'

    const dataUrl = {
        inspectionAdd: '/api/safe-inspection/batchAdd'
    };

    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            align: 'center',
            width: 75,
            scopedSlots: {customRender: 'index'}
        },
        {
            title: '巡检地点',
            dataIndex: 'inspectPlace',
            align: 'center',
            width: 160,
            scopedSlots: {customRender: 'inspectPlace'}
        },
        {
            title: '问题描述',
            dataIndex: 'problemDescribes',
            align: 'center',
            scopedSlots: {customRender: 'problemDescribes'}
        },
        {
            title: '责任人',
            dataIndex: 'responsePeople',
            align: 'center',
            width: 120,
            scopedSlots: {customRender: 'responsePeople'}
        },
        {
            title: '整改期限',
            dataIndex: 'deadTime',
            align: 'center',
            width: 160,
            scopedSlots: {customRender: 'deadTime'}
        },
        {
            title: '超时前提示天数',
            dataIndex: 'tipDays',
            align: 'center',
            width: 150,
            scopedSlots: {customRender: 'tipDays'}
        },
        {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            width: 120,
            scopedSlots: {customRender: 'edit'}
        }
    ];

    const dataMapping = {
        'index': 'Number',
        'inspectPlace': 'String',
        'problemDescribes': 'String',
        'responsePeople': 'String',
        'deadTime': 'Date',
        'tipDays': 'Number'
    };

    export default {
        components: {
            AModal: Modal,
            AForm: Form,
            AFormItem: Form.Item,
            ATable: Table,
            ARow: Row,
            ACol: Col,
            AButton: Button,
            AInput: Input,
            AInputNumber: InputNumber,
            ATextarea: Input.TextArea,
            ASelect: Select,
            ASelectOption: Select.Option,
            AIcon: Icon,
            ADatePicker: DatePicker,
            ATooltip: Tooltip,
            ACascader: Cascader,
            APopconfirm: Popconfirm
        },
        name: 'InspectionEdit',
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        mounted() {
        },
        data() {
            return {
                formData: {
                    inspectTime: null,
                    inspectDepartmentId: [],
                    inspectType: null,
                    problemItems: [],
                },
                companyStatus: false,
                problemsStatus: false,
                loading: false,
                visible: false,
                confirmLoading: false,
                formItemLayout: {
                    labelCol: {
                        xs: {span: 24},
                        sm: {span: 7},
                    },
                    wrapperCol: {
                        xs: {span: 24},
                        sm: {span: 12},
                        md: {span: 10},
                    },
                },
                submitFormLayout: {
                    wrapperCol: {
                        xs: {span: 24, offset: 0},
                        sm: {span: 10, offset: 7},
                    },
                },
                dataSource: [],
                columns,
                count: 1
            }
        },
        props: {
            departmentList: Array
        },
        methods: {
            openModal() {
                this.visible = true;
            },
            hasSelected(length) {
                if(length === 0) {
                    this.problemsStatus = true;
                } else {
                    this.problemsStatus = false;
                }
            },
            //下拉框搜索
            filterOption(input, option) {
                return option.componentOptions.children[0].text.toLowerCase().indexOf(input.toLowerCase()) >= 0
            },
            addItem() {
                const { count, dataSource } = this;
                const newData = {
                    key: count,
                    index: count,
                    inspectPlace: null,
                    problemDescribes: null,
                    responsePeople: null,
                    deadTime: null,
                    tipDays: 3
                };
                this.dataSource = [...dataSource, newData];
                this.count = count + 1;
                // this.edit(count);
            },
            handleChangePlace(value, key) {
                const newData = [...this.dataSource];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target.inspectPlace = value;
                    this.dataSource = newData
                }
            },
            handleChangeDes(value, key) {
                const newData = [...this.dataSource];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target.problemDescribes = value;
                    this.dataSource = newData;
                }
            },
            handleChangeResponsePeople(value, key) {
                const newData = [...this.dataSource];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target.responsePeople = value;
                    this.dataSource = newData
                }
            },
            handleChangeDeadTime(value, key) {
                const newData = [...this.dataSource];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target.deadTime = value;
                    this.dataSource = newData
                }
            },
            handleChangeTipDays(value, key) {
                const newData = [...this.dataSource];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target.tipDays = value;
                    this.dataSource = newData
                }
            },
            edit(key) {
                const newData = [...this.dataSource];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target.editable = true;
                    this.dataSource = newData
                }
            },
            save(key) {
                const newData = [...this.dataSource];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    delete target.editable;
                    if(target.inspectPlace && target.problemDescribes && target.responsePeople && target.deadTime && target.tipDays) {
                        this.dataSource = newData;
                        this.cacheData = newData.map(item => ({ ...item }));
                        this.formData.problemItems = this.dataSource;
                        this.problemsStatus = false;
                        message.success("保存成功！");
                    } else {
                        this.problemsStatus = true;
                    }
                }
            },
            cancel(key) {
                const newData = [...this.dataSource];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    Object.assign(target, this.cacheData.filter(item => key === item.key)[0]);
                    delete target.editable;
                    this.dataSource = newData
              }
            },
            onDelete (key) {
                const dataSource = [...this.dataSource];
                this.dataSource = dataSource.filter(item => item.key !== key);
                this.count = 1;
                this.formData.problemItems = this.dataSource;
            },
            //保存
            handleSubmit() {
                this.hasSelected(this.formData.problemItems.length);
                this.form.validateFields(
                    (err, values) => {
                        if (!err && this.formData.problemItems.length > 0) {
                            this.confirmLoading = true;
                            this.formData.problemItems = this.formData.problemItems.map(item => ({
                                inspectPlace: item.inspectPlace,
                                problemDescribes: item.problemDescribes,
                                responsePeople: item.responsePeople,
                                deadTime: item.deadTime.format('YYYY-MM-DD'),
                                tipDays: item.tipDays
                            }));
                            http.post(dataUrl.inspectionAdd, {
                                inspectTime: values.inspectTime.format('YYYY-MM-DD'),
                                inspectDepartmentId: parseInt(values.inspectDepartmentId.slice(-1).toString()),
                                inspectType: values.inspectType,
                                problemItems: this.formData.problemItems,
                            }).then(res => {
                                if (res.state) {
                                    message.success(res.message);
                                    this.visible = false;
                                    this.$emit("comfirmAdd");
                                } else {
                                    message.warning(res.message)
                                }
                                this.confirmLoading = false
                            })
                        }
                    },
                )
            },
            //取消
            handleCancel() {
                this.visible = false
            },
            afterClose() {
                this.formData.inspectTime = null;
                this.formData.inspectDepartmentId = [];
                this.formData.inspectType = null;
                this.formData.problemItems = [];
                this.dataSource = [];
                this.count = 1;
                this.problemsStatus = false;
                this.visible = false;
                this.confirmLoading = false;
            },
        }
    }
</script>

<style scoped>
    .gmsj-form-span {
        color: rgba(0, 0, 0, 0.45);
        font-style: normal;
    }

    .selsectInspection p {
        color: #333;
    }

    .selsectInspection p:before {
        display: inline-block;
        margin-right: 4px;
        content: '*';
        font-family: SimSun;
        line-height: 1;
        font-size: 14px;
        color: #f5222d;
    }

    .selsectInspection p span {
        color: #f5222d;
        padding-left: 10px;
    }
</style>
