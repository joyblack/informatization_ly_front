<template>
    <a-modal
            :title="this.title"
            :visible="visible"
            @ok="handleSubmit"
            :okButtonProps='{props: {disabled: this.inputDisabled},}'
            @cancel="handleCancel"
            :destroyOnClose="true"
            :confirmLoading="confirmLoading"
            :afterClose='afterClose'
            :closable="true"
            :maskClosable="true"
            :keyboard="true"
            :width="80+'%'"
    >
        <a-form :form="form" :style="{ marginTop: '8px' }">
            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="钻孔工作名称" v-bind="formItemLayout">
                        <a-select
                                showSearch
                                :disabled="this.inputDisabled == true ? this.inputDisabled:(this.flag == true ? this.flag : false)"
                                @search="drillWorkSearch"
                                placeholder="请选择钻孔工作名称!"
                                :defaultActiveFirstOption="false"
                                :filterOption="false"
                                :notFoundContent="drillWorkFetching? undefined : '暂无数据'"
                                v-decorator="['drillWorkId', { initialValue:formData.drillWorkId,rules: [{ required: true, message: '请选择钻孔工作名称' }] } ]"
                        >
                            <a-spin v-if="drillWorkFetching" slot="notFoundContent" size="small"></a-spin>
                            <a-select-option v-for="d in drillWorkData" :key="d.value">{{d.text}}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                    <a-form-item label="日期" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-date-picker
                                :disabled="this.inputDisabled == true ? this.inputDisabled:(this.flag == true ? this.flag : false)"
                                :style="{width: '100%'}"
                                v-decorator="['dailyTime',{initialValue:formData.dailyTime,rules:[{required:true,message:'请选择时间!'}]}]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="班次" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-select
                                :disabled="this.inputDisabled == true ? this.inputDisabled:(this.flag == true ? this.flag : false)"
                                labelInValue
                                v-decorator="['shifts',{initialValue:formData.shifts,rules:[{required:true,message:'请选择班次!'}]}]"
                        >
                            <a-select-option value="MORNING">早班</a-select-option>
                            <a-select-option value="NOON">中班</a-select-option>
                            <a-select-option value="EVENING">晚班</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="打钻队伍" v-bind="formItemLayout">
                        <a-cascader
                                :options="departmentList"
                                v-decorator="['drillTeamId',{initialValue:formData.drillTeamId,rules:[{required:true,message:'请选择打钻队伍!'}]}]"
                                @change="selectDepartment"
                                changeOnSelect
                                :disabled="this.inputDisabled == true ? this.inputDisabled:(this.flag == true ? this.flag : false)"
                                placeholder="请选择入打钻队伍"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="打钻人数" v-bind="formItemLayout">
                        <a-input-number
                                placeholder="请输入打钻人数！"
                                :min="0"
                                :precision="0"
                                style="width: 100%"
                                :disabled="this.inputDisabled"
                                v-decorator="['peopleNumber',{ initialValue:formData.peopleNumber,rules: [{ required: true, message: '请输入打钻人数' }] }]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="24" :sm='24'>
                    <a-table
                            :columns="columns"
                            :dataSource="data"
                            :pagination="false"
                            :loading="memberLoading"
                            bordered
                    >
                        <span slot="doneLengthTitle"><span style="color: red">*</span> 当日打孔长度（m）</span>
                        <template slot="drillHoleId" slot-scope="text,record">
                            <template v-if="inputDisabled == true ? inputDisabled:(flag == true ? flag : false)">
                                {{text}}
                            </template>
                            <a-select
                                    v-else
                                    :disabled=inputDisabled
                                    placeholder="请选择钻孔编号!"
                                    :defaultActiveFirstOption="false"
                                    :filterOption="false"
                                    :notFoundContent="drillHoleIdFetching? undefined : '暂无数据'"
                                    @change="e => drillHoleIdChange(e, record)"
                            >
                                <a-spin v-if="drillHoleIdFetching" slot="notFoundContent" size="small"></a-spin>
                                <a-select-option v-for="d in drillHoleIdData" :key="d.value">{{d.text}}
                                </a-select-option>
                            </a-select>
                        </template>
                        <template slot="doneLength" slot-scope="text, record">
                            <template v-if="inputDisabled">{{text}}</template>
                            <a-input
                                    v-else
                                    :value="text"
                                    :disabled=inputDisabled
                                    @change="e => doneLengthChange(e.target.value, record.key)"
                            />
                        </template>
                        <template slot="operation" slot-scope="text, record">
                            <span>
                                <a :disabled=inputDisabled @click="saveRow(record)">保存</a>
                            </span>
                            <a-divider type="vertical"/>
                            <span>
                                <a-popconfirm title="是否要删除此行？" :disabled=inputDisabled
                                              @confirm="remove(record,record.key)">
                                    <a>删除</a>
                                </a-popconfirm>
                            </span>
                        </template>
                    </a-table>
                    <a-button
                            style="margin-top: 16px; margin-bottom: 8px;width: 15%;position: relative;left: 50%;margin-left: -7.5%"
                            :disabled="this.addBtnDisabled"
                            type="primary"
                            icon="plus"
                            @click="newMember"
                    >
                        新增钻孔
                    </a-button>
                </a-col>
            </a-row>
            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="24" :sm='24'>
                    <a-form-item>
                        <span slot="label">
                            备注
                            <span class="gmsj-form-span">
                             （选填）
                            </span>
                        </span>
                        <a-textarea placeholder="请输入备注" :rows="4"
                                    :disabled="this.inputDisabled"
                                    v-decorator="['remarks',{ initialValue:formData.remarks,rules: [] }]"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
        </a-form>
    </a-modal>
</template>

<script>
    import {
        Modal,
        Form,
        Row,
        Col,
        Input,
        DatePicker,
        Select,
        Table,
        Button,
        Divider,
        Popconfirm,
        InputNumber,
        Cascader,
        message
    } from 'ant-design-vue'
    import http from '../../../../../utils/http'
    import TableUtil from '../../../../../utils/TableUtil'
    import moment from 'moment'
    import debounce from 'lodash/debounce'

    const dataUrl = {
        getDrillAddData: '/api/produce-drill-daily/add',//新增钻孔工作日报数据
        getDrillById: '/api/produce-drill-daily/get',//获取单条钻孔工作日报数据
        getDrillUpdate: '/api/produce-drill-daily/update',//编辑钻孔工作日报数据

        getDrillDetailAddData: '/api/produce-drill-daily-detail/add',//新增钻孔工作日报详情数据
        getDrillDetailById: '/api/produce-drill-daily-detail/get',//获取单条钻孔工作日报详情数据
        getDrillDetailUpdate: '/api/produce-drill-daily-detail/update',//编辑钻孔工作日报详情数据
        getDrillDetailDelete: '/api/produce-drill-daily-detail/delete',//删除钻孔工作日报详情数据
        getDrillDetailAll: '/api/produce-drill-daily-detail/get',//获取钻孔工作日报详情表格数据
        getNotCompleteByDrillWorkId: '/api/produce-drill-hole/getNotCompleteByDrillWorkId',//获取钻孔详细信息列表,钻孔编号

        getDrillWorkByName: '/api/produce-drill-work/getByName',//根据名称搜索获取单条钻孔工作名称
        getDrillWorkAll: '/api/produce-drill-work/getAllList',//获取全部钻孔工作名称
        getDrillWorkById: '/api/produce-drill-work/get',//获取单条钻孔工作名称
        getDelete: '/api/produce-drill-daily-detail/delete',//删除单条钻孔工作详情
        getDepartmentAll: '/api/department/getCompanyTree',//获取当前账号部门、队伍
        departmentById: '/api/department/getParentNodesJustIds',//获取部门详情

    }
    const dataMapping = {
        'id': 'String',
        'orderNumber': 'String',
        'doneLength': 'String',
        'drillHoleId': 'String',
    }
    const columns = [{
        title: '序号',
        dataIndex: 'key',
        align: 'center',
    }, {
        title: '钻孔编号',
        dataIndex: 'drillHoleId',
        align: 'center',
        scopedSlots: {customRender: 'drillHoleId'}
    },
        {
            slots: {title: 'doneLengthTitle'},
            dataIndex: 'doneLength',
            key: 'doneLength',
            align: 'center',
            scopedSlots: {customRender: 'doneLength'}
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            scopedSlots: {customRender: 'operation'}
        }]
    export default {
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        name: "DailyDrillingEdit",
        components: {
            AModal: Modal,
            AForm: Form,
            ARow: Row,
            ACol: Col,
            AFormItem: Form.Item,
            AInput: Input,
            AInputNumber: InputNumber,
            ATextarea: Input.TextArea,
            ADatePicker: DatePicker,
            ASelect: Select,
            ASelectOption: Select.Option,
            AButton: Button,
            ATable: Table,
            ADivider: Divider,
            APopconfirm: Popconfirm,
            ACascader: Cascader,
        },
        data() {
            //防抖动处理
            this.drillWorkSearch = debounce(this.drillWorkSearch, 500)
            return {
                formData: {
                    id: null,
                    drillWorkId: null,
                    dailyTime: moment(new Date(), '  YYYY-MM-DD'),
                    shifts: {key: 'MORNING'},
                    drillTeamId: [],
                    peopleNumber: null
                },
                detailId: null,
                drillWorkId: null,
                title: '新增钻孔日报',
                visible: false,
                drillWorkFetching: false,
                drillWorkData: [],
                drillHoleIdFetching: false,
                drillHoleIdData: [],
                confirmLoading: false,
                departmentList: [],
                inputDisabled: false,
                flag: false,
                addBtnDisabled: false,
                formItemLayout: {
                    labelCol: {
                        xs: {span: 24},
                        sm: {span: 8},
                        md: {span: 8},
                    },
                    wrapperCol: {
                        xs: {span: 24},
                        sm: {span: 16, offset: 0},
                        md: {span: 16, offset: 0},
                    },
                },
                submitFormLayout: {
                    wrapperCol: {
                        xs: {span: 24, offset: 0},
                        sm: {span: 20, offset: 0},
                    },
                },
                memberLoading: false,
                columns,
                data: [],
            }
        },
        mounted() {

        },
        methods: {
            //打开弹窗
            openModal(record, noEdit) {
                this.visible = true;
                if (record) {
                    this.formData.id = record.id
                    this.inputDisabled = noEdit
                    if (this.inputDisabled) {
                        this.title = "查看" + record
                        this.addBtnDisabled = true
                        this.loader(noEdit)
                        // this.initDrillWorkData()
                        this.initdrillWork()
                        this.initdrillHoleId()
                        this.initDepartment()
                    } else {
                        this.inputDisabled = false
                        this.title = "修改" + record
                        this.addBtnDisabled = false
                        this.loader(noEdit)
                        // this.initDrillWorkData()
                        this.initdrillWork()
                        this.initdrillHoleId()
                        this.initDepartment()
                    }
                } else {
                    this.inputDisabled = false
                    this.title = "新增钻孔日报"
                    this.addBtnDisabled = true
                    this.initdrillWork()
                    this.initDepartment()
                }
            },
            //加载钻孔工作数据
            loader(noEdit) {
                if (this.formData.id) {
                    http.post(dataUrl.getDrillById, {id: this.formData.id}).then(res => {
                        if (res.state) {
                            if (noEdit) {
                                this.flag = true
                                this.title = "查看" + res.data.drillWork.drillWorkName
                            } else {
                                this.flag = true
                                this.title = "编辑" + res.data.drillWork.drillWorkName
                            }
                            this.formData = {
                                id: res.data ? res.data.id : null,
                                drillWorkId: res.data.drillWork.drillWorkName,
                                dailyTime: res.data.dailyTime ? moment(res.data.dailyTime, 'YYYY-MM-DD') : null,
                                shifts: {key: res.data.shifts},
                                peopleNumber: res.data.peopleNumber,
                                remarks: res.data ? res.data.remarks : null,
                            };
                            //获取部门id 请求接口返回部门数据
                            http.post(dataUrl.departmentById, {
                                id: res.data ? res.data.drillTeam.id : null
                            }).then(res => {
                                if (res.state) {
                                    this.formData.drillTeamId = res.data ? res.data : null;
                                }
                            });
                            let detailIds;
                            detailIds = res.data.drillWork.id
                            this.drillWorkId = res.data.drillWork.id
                            // this.initDrillWorkData(detailIds)
                            this.initdrillHoleId(detailIds)
                            let drillDailyDetailData = []
                            res.data.drillDailyDetail.forEach((r) => {
                                drillDailyDetailData.push({
                                    key: r.orderNumber,
                                    id: r.id,
                                    doneLength: r.doneLength,
                                    drillHoleId: r.drillHole.code,
                                })
                            });
                            this.data = TableUtil.formatData(drillDailyDetailData, dataMapping)
                        }
                    })
                }
            },
            //加载钻孔工作日报详情信息
            initDrillWorkData(detailIds) {
                if (detailIds) {
                    http.post(dataUrl.getDrillDetailAll, {
                        id: detailIds
                    }).then(res => {
                        if (res.data) {
                            let tableDate = []
                            tableDate.push({
                                id: res.data ? res.data.id : null,
                                orderNumber: res.data.orderNumber ? res.data.orderNumber : null,
                                doneLength: res.data.doneLength ? res.data.doneLength : null,
                                drillHoleId: res.data.drillHole.code ? res.data.drillHole.code : null,
                            });
                            this.data = TableUtil.formatData(tableDate, dataMapping)
                        }
                    })
                }
            },
            //工作面搜索
            drillWorkSearch(search) {
                http.post(dataUrl.getDrillWorkByName, {name: search}).then(res => {
                    if (res.state) {
                        let drillWorkData = [];
                        if (res.data) {
                            res.data.forEach((r) => {
                                drillWorkData.push({
                                    value: r.id,
                                    text: r.backMiningFaceName,
                                })
                            })
                        }
                        this.drillWorkData = drillWorkData
                    }
                })
            },
            //加载工作面信息
            initdrillWork() {
                if (this.formData.id) {
                    let drillWork
                    let flag = true
                    http.post(dataUrl.getDrillWorkById, {id: this.formData.id}).then(res => {
                        if (res.state) {
                            if (res.data) {
                                drillWork = res.data.drillWorkName
                            }
                        }
                    }).then(() => {
                        http.post(dataUrl.getDrillWorkAll, {}).then(res => {
                            if (res.state) {
                                if (res.data) {
                                    res.data.forEach((r) => {
                                        if (drillWork && r.id == drillWork.id) {
                                            flag = false
                                        }
                                        this.drillWorkData.push({
                                            value: r.id,
                                            text: r.drillWorkName,
                                        })
                                    })
                                }
                                if (flag) {
                                    if (drillWork) {
                                        this.drillWorkData.push({
                                            value: drillWork.id,
                                            text: drillWork.name,
                                        })
                                    }
                                } else {
                                }
                            }
                        })
                    })
                } else {
                    http.post(dataUrl.getDrillWorkAll, {}).then(res => {
                        if (res.state) {
                            if (res.data) {
                                res.data.forEach((r) => {
                                    this.drillWorkData.push({
                                        value: r.id,
                                        text: r.drillWorkName,
                                    })
                                })
                            }
                        }
                    })
                }
            },
            //加载钻孔编号
            initdrillHoleId(detailIds) {
                if (detailIds) {
                    http.post(dataUrl.getNotCompleteByDrillWorkId, {id: detailIds}).then(res => {
                        if (res.state) {
                            res.data.forEach((r) => {
                                this.drillHoleIdData.push({
                                    value: r.id,
                                    text: r.code,
                                })
                            })
                        }
                    })
                }
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
            //新增、修改
            handleSubmit() {
                this.form.validateFields(
                    (err, values) => {
                        if (!err) {
                            //判断是否存在id
                            if (this.formData.id) {
                                this.confirmLoading = true
                                http.post(dataUrl.getDrillUpdate, {
                                    id: this.formData.id ? this.formData.id : null,
                                    drillWorkId: this.drillWorkId ? this.drillWorkId : null,
                                    dailyTime: values.dailyTime && values.dailyTime instanceof moment ? values.dailyTime.format('YYYY-MM-DD') : null,
                                    shifts: values ? values.shifts.key : null,
                                    drillTeamId: values ? values.drillTeamId.slice(-1)[0] : null,
                                    peopleNumber: values ? values.peopleNumber : null,
                                    remarks: values ? values.remarks : null,
                                }).then(res => {
                                    if (res.state) {
                                        //部门
                                        http.post(dataUrl.departmentById, {
                                            id: res.data ? res.data.drillTeam.id : null
                                        }).then(res => {
                                            if (res.state) {
                                                this.formData.drillTeamId = res.data ? res.data : null;
                                            }
                                        });
                                        this.formData = {
                                            id: res.data ? res.data.id : null,
                                            drillWorkId: res.data ? res.data.drillWorkId : null,
                                            dailyTime: res.data ? res.data.dailyTime : null,
                                            shifts: res.data ? res.data.shifts : null,
                                            drillTeamId: res.data ? res.data.drillTeamId : null,
                                            peopleNumber: res.data ? res.data.peopleNumber : null,
                                            remarks: res.data ? res.data.remarks : null,
                                        }
                                        message.success(res.message)
                                        this.$parent.loader()
                                        this.visible = false;
                                    } else {
                                        message.warning(res.message)
                                    }
                                    this.confirmLoading = false
                                })
                            } else {
                                this.confirmLoading = true
                                http.post(dataUrl.getDrillAddData, {
                                    drillWorkId: values ? values.drillWorkId : null,
                                    dailyTime: values ? values.dailyTime : null,
                                    shifts: values ? values.shifts.key : null,
                                    drillTeamId: values ? values.drillTeamId.slice(-1)[0] : null,
                                    peopleNumber: values ? values.peopleNumber : null,
                                    remarks: values ? values.remarks : null,
                                }).then(res => {
                                    if (res.state) {
                                        //部门
                                        http.post(dataUrl.departmentById, {
                                            id: res.data ? res.data.drillTeam.id : null
                                        }).then(res => {
                                            if (res.state) {
                                                this.formData.drillTeamId = res.data ? res.data : null;
                                            }
                                        });
                                        this.formData = {
                                            id: res.data ? res.data.id : null,
                                            drillWorkId: res.data ? res.data.drillWorkId : null,
                                            dailyTime: res.data ? res.data.dailyTime : null,
                                            shifts: res.data ? res.data.shifts : null,
                                            drillTeamId: res.data ? res.data.drillTeamId : null,
                                            peopleNumber: res.data ? res.data.peopleNumber : null,
                                            remarks: res.data ? res.data.remarks : null,
                                        }
                                        if (this.formData.id) {
                                            let detailIds;
                                            detailIds = res.data.drillWork.id;
                                            this.initdrillHoleId(detailIds);
                                            this.addBtnDisabled = false;
                                        }
                                        message.success(res.message);
                                        this.$parent.loader()

                                    } else {
                                        message.warning(res.message)
                                    }
                                    this.confirmLoading = false
                                })
                            }
                        }
                    },
                )
            },
            //新增数据
            newMember() {
                this.flag = false;
                const length = this.data.length;
                this.data.push({
                    key: length === 0 ? '1' : (parseInt(this.data[length - 1].key) + 1).toString(),
                    drillHoleId: '',
                    doneLength: "",
                    editable: true,
                    isNew: true
                })
            },
            //保存,编辑钻孔工作日报详情
            saveRow(record) {
                // //判断钻孔工作日报是否存在
                if (this.formData.id) {
                    //判断钻孔工作日报详情内容是否为空，是：新增，否：编辑
                    if (record.id) {
                        http.post(dataUrl.getDrillDetailUpdate, {
                            id: record.id,
                            orderNumber: record.key,
                            doneLength: record.doneLength,
                        }).then(res => {
                            if (res.state) {
                                message.success(res.message);
                                this.$parent.loader()

                            } else {
                                message.warning(res.message)
                            }
                            this.confirmLoading = false
                        })
                    } else {
                        http.post(dataUrl.getDrillDetailAddData, {
                            drillDailyId: this.formData.id ? this.formData.id : null,
                            orderNumber: record.key ? record.key : null,
                            drillHoleId: record.drillHoleId ? record.drillHoleId : null,
                            doneLength: record.doneLength ? record.doneLength : null,
                        }).then(res => {
                            if (res.state) {
                                let arr = [];
                                this.data.forEach(e => {
                                    arr.push({
                                        doneLength: e.doneLength,
                                        drillHoleId: e.drillHoleId,
                                        editable: e.editable,
                                        isNew: e.isNew,
                                        key: e.key,
                                        id: res.data.id,
                                    })
                                });
                                this.data = arr;
                                message.success(res.message);
                                this.$parent.loader()
                            } else {
                                message.warning(res.message)
                            }
                            this.confirmLoading = false
                        })
                    }
                }
            },
            //	 当日打孔长度
            doneLengthChange(value, key) {
                const newData = [...this.data];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target.doneLength = value;
                    this.data = newData
                }
            },
            //钻孔编号
            drillHoleIdChange(value, record) {
                let key = record.key;
                const newData = [...this.data];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target.drillHoleId = value;
                    this.data = newData
                }
            },

            //删除此行
            remove(record, key) {
                const newData = this.data.filter(item => item.key !== key);
                this.data = newData;
                if (record) {
                    http.post(dataUrl.getDelete, {id: record.id}).then(res => {
                        if (res.state) {
                            message.success(res.message);
                            this.$parent.loader()
                        } else {
                            message.warning(res.message)
                        }
                    })
                }
            },
            //取消
            handleCancel() {
                this.visible = false
            },
            //关闭
            afterClose() {
                //关闭置空表单
                this.formData = {
                    id: null,
                    drillWorkId: null,
                    dailyTime: moment(new Date(), '  YYYY-MM-DD'),
                    shifts: {key: 'MORNING'},
                    drillTeamId: [],
                    peopleNumber: null,
                };
                this.data = [];
                this.drillWorkData = [];
                this.drillHoleIdData = [];
                this.flag = false;
                this.inputDisabled = false;
                this.visible = false;
                this.confirmLoading = false;
            },
        }
    }
</script>

<style>
    .ant-table.ant-table-bordered .ant-table-footer {
        border: none;
        padding: 0px;
    }
</style>
