<template>
    <a-modal
            :title="this.title"
            :visible="visible"
            :okButtonProps='{props: {disabled: this.inputDisabled},}'
            @cancel="handleCancel"
            :destroyOnClose="true"
            :confirmLoading="confirmLoading"
            :afterClose='afterClose'
            :closable="true"
            :maskClosable="true"
            :keyboard="true"
            :width="1200"
            :footer="null"
    >
        <a-form :form="form" :style="{ marginTop: '8px' }">
            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="12" :sm='24'>
                    <a-form-item label="掘进工作面" v-bind="formItemLayout">
                        <a-select
                                showSearch
                                :disabled="this.inputDisabled === true ? this.inputDisabled:(this.flag === true ? this.flag : false)"
                                @search="drivingFaceSearch"
                                placeholder="请选择掘进工作面!"
                                :defaultActiveFirstOption="false"
                                :filterOption="false"
                                :notFoundContent="drivingFaceFetching? undefined : '暂无数据'"
                                v-decorator="['drillFaceId', { initialValue:formData.drillFaceId,rules: [{ required: true, message: '请选择掘进工作面' }] } ]"
                        >
                            <a-spin v-if="drivingFaceFetching" slot="notFoundContent" size="small"></a-spin>
                            <a-select-option v-for="d in drivingFaceData" :key="d.value">{{d.text}}</a-select-option>
                        </a-select>
                    </a-form-item>
                </a-col>
                <a-col :md="12" :sm="24">
                    <a-form-item label="日期" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-date-picker
                                :disabled="this.inputDisabled === true ? this.inputDisabled:(this.flag === true ? this.flag : false)"
                                v-decorator="['dailyTime',{ initialValue:formData.dailyTime,rules: [{ required: true, message: '请选择' }]}]"
                                :style="{width: '100%'}"
                                :disabledDate="disabledDate"
                        />
                    </a-form-item>
                </a-col>
            </a-row>
            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="24" :sm='24'>
                    <a-button
                            style="margin-top: 16px; margin-bottom: 8px"
                            :disabled="this.inputDisabled"
                            type="primary"
                            icon="plus"
                            @click="newMember"
                    >
                        新增数据
                    </a-button>
                    <a-table
                            :columns="columns"
                            :dataSource="data"
                            :pagination="false"
                            :loading="memberLoading"
                            bordered
                            :scroll="{ x: 1290}"
                    >
                        <span slot="shiftsTitle"><span style="color: red">*</span> 班次</span>
                        <span slot="drivingTeamIdTitle"><span style="color: red">*</span> 掘进队伍</span>
                        <span slot="doneLengthTitle"><span style="color: red">*</span> 进尺（m）</span>
                        <template slot="shifts" slot-scope="text,record">
                            <template v-if="inputDisabled">{{text}}</template>
                            <a-select
                                    :style="{minWidth:'80px'}"
                                    :disabled=inputDisabled
                                    v-else
                                    :defaultValue="text"
                                    @change="e => selectShifts(e,record)"
                            >
                                <a-select-option value="MORNING">早班</a-select-option>
                                <a-select-option value="NOON">中班</a-select-option>
                                <a-select-option value="EVENING">晚班</a-select-option>
                            </a-select>
                        </template>
                        <template slot="drivingTeamId" slot-scope="text, record">
                            <a-cascader
                                    :disabled=inputDisabled
                                    :options="departmentList"
                                    labelInValue
                                    :defaultValue="text"
                                    @change="e => selectDepartment(e, record)"
                                    changeOnSelect
                                    placeholder=""
                            />
                        </template>
                        <template slot="peopleNumber" slot-scope="text, record">
                            <template v-if="inputDisabled">{{text}}</template>
                            <a-input-number
                                    :min="0"
                                    v-else
                                    :value="text"
                                    :precision="0"
                                    :disabled=inputDisabled
                                    @change="e => peopleNumberChange(e, record.key)"
                            />
                        </template>
                        <template slot="output" slot-scope="text, record">
                            <template v-if="inputDisabled">{{text}}</template>
                            <a-input-number
                                    v-else
                                    :min="0"
                                    :value="text"
                                    :precision="2"
                                    :disabled=inputDisabled
                                    @change="e => outputChange(e, record.key)"
                            />
                        </template>
                        <template slot="doneLength" slot-scope="text, record">
                            <template v-if="inputDisabled">{{text}}</template>
                            <a-input-number
                                    v-else
                                    :min="0"
                                    :value="text"
                                    :precision="2"
                                    :disabled=inputDisabled
                                    @change="e => doneLengthChange(e, record.key)"
                            />
                        </template>
                        <template slot="workContent" slot-scope="text, record">
                            <template v-if="inputDisabled">{{text}}</template>
                            <a-input
                                    v-else
                                    :value="text"
                                    :disabled=inputDisabled
                                    @change="e => workContentChange(e.target.value, record.key)"
                            />
                        </template>
                        <template slot="operation" slot-scope="text, record">
                            <span>
                               <a :disabled=inputDisabled @click="saveRow(record)">保存</a>
                              </span>
                            <a-divider type="vertical"/>
                            <span>
                                <a-popconfirm title="是否要删除此行？" v-if="record.id" :disabled=inputDisabled
                                              @confirm="remove(record)">
                                    <a>删除</a>
                                </a-popconfirm>
                                 <a v-else href="javascript:;" @click="remove(record)">删除</a>
                              </span>
                        </template>
                        <template v-if="!inputDisabled" slot="footer" slot-scope="currentPageData">
                            <ul class="footerSum">
                                <li style="width: 130px;">合计</li>
                                <li style="width: 200px;"></li>
                                <li style="width: 123px;">{{renshu}}</li>
                                <li style="width: 130px;">{{jinchi}}</li>
                                <li style="width: 130px;">{{changliang}}</li>
                                <li style="width: 288px;"></li>
                                <li style="width: 150px;"></li>
                            </ul>
                        </template>
                        <template v-else></template>
                    </a-table>
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
    import moment from 'moment'
    import http from '../../../../../utils/http'
    import TableUtil from '../../../../../utils/TableUtil'
    import debounce from 'lodash/debounce'

    const dataUrl = {
        getAddData: '/api/produce-driving-daily/add',//新增数据
        getById: '/api/produce-driving-daily/get',//获取单条数据
        getUpdate: '/api/produce-driving-daily/update',//编辑数据
        getDelete: '/api/produce-driving-daily/delete',//删除
        getDrivingFaceByName: '/api/produce-driving-face/getByName',//根据名称搜索获取单条掘进面名称
        getDrivingFaceAll: '/api/produce-driving-face/getAllList',//获取全部掘进面名称
        getDrivingFaceById: '/api/produce-driving-face/get',//获取单条掘进面
        getDepartmentAll: '/api/system-department/getTree',//获取当前账号部门、队伍
        departmentById: '/api/system-department/getParentNodesJustIds',//获取部门详情
    };
    const dataMapping = {
        'id': 'String',
        'key': 'String',
        'shifts': 'Enum',//班次
        'peopleNumber': 'String',
        'doneLength': 'String',
        'drivingTeamId': 'String',
        'output': 'String',
        'workContent': 'String',
    };
    const columns = [{
        slots: {title: 'shiftsTitle'},
        dataIndex: 'shifts',
        key: 'shifts',
        width: 130,
        align: 'center',
        scopedSlots: {customRender: 'shifts'}
    },
        {
            slots: {title: 'drivingTeamIdTitle'},
            dataIndex: 'drivingTeamId',
            width: 200,
            align: 'center',
            scopedSlots: {customRender: 'drivingTeamId'}
        },
        {
            title: '人数',
            dataIndex: 'peopleNumber',
            width: 100,
            align: 'center',
            scopedSlots: {customRender: 'peopleNumber'}
        },
        {
            slots: {title: 'doneLengthTitle'},
            dataIndex: 'doneLength',
            key: 'doneLength',
            width: 130,
            align: 'center',
            scopedSlots: {customRender: 'doneLength'}
        },
        {
            title: '产量（t）',
            dataIndex: 'output',
            width: 130,
            align: 'center',
            scopedSlots: {customRender: 'output'}
        },
        {
            title: '其他工作内容',
            dataIndex: 'workContent',
            key: 'workContent',
            align: 'center',
            scopedSlots: {customRender: 'workContent'}
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 150,
            fixed: 'right',
            scopedSlots: {customRender: 'operation'}
        }];

    export default {
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        name: "DailyTunnellingEdit",
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
            this.drivingFaceSearch = debounce(this.drivingFaceSearch, 500);
            return {
                formData: {
                    id: null,
                    drillFaceId: null,
                    dailyTime: moment(new Date(), 'YYYY-MM-DD'),
                    shifts: {key: '早班'}
                },
                drivingFaceId: null,
                title: '新增掘进工作面日报',
                visible: false,
                confirmLoading: false,
                drivingFaceFetching: false,
                drivingFaceData: [],
                departmentList: [],
                inputDisabled: false,
                flag: false,
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
                renshu: '0',
                jinchi: '0',
                changliang: '0',
                memberLoading: false,
                columns,
                data: [{
                    key: 0,
                    shifts: 'MORNING',
                    shiftsName: '早班',
                }, {
                    key: 1,
                    shifts: 'NOON',
                    shiftsName: '中班',
                }, {
                    key: 2,
                    shifts: 'EVENING',
                    shiftsName: '晚班',
                }],
            }
        },
        mounted() {
        },
        methods: {
            //打开弹窗
            openModal(record, noEdit) {
                this.visible = true;
                if (record) {
                    this.formData.id = record.id;
                    //查看
                    if (this.inputDisabled) {
                        this.inputDisabled = noEdit;
                        this.loader(noEdit)
                    } else {
                        //编辑
                        this.inputDisabled = noEdit;
                        this.loader(noEdit);
                        this.initdrivingFace();
                        this.initDepartment()
                    }
                } else {
                    this.inputDisabled = false;
                    this.title = "新增掘进工作面日报";
                    this.initdrivingFace();
                    this.initDepartment()
                }
            },
            //日期限制禁选
            disabledDate(current) {
                return current && current > moment();
            },
            //加载数据
            loader(noEdit) {
                if (this.formData.id) {
                    http.post(dataUrl.getById, {id: this.formData.id}).then(res => {
                        if (res.state) {
                            if (noEdit) {
                                this.flag = true;
                                this.title = "查看" + res.data.drivingFace.drivingFaceName
                            } else {
                                this.flag = true;
                                this.title = "编辑" + res.data.drivingFace.drivingFaceName
                            }
                            this.formData = {
                                drillFaceId: res.data.drivingFace.drivingFaceName ? res.data.drivingFace.drivingFaceName : null,
                                dailyTime: res.data.dailyTime ? moment(res.data.dailyTime, 'YYYY-MM-DD') : null,
                            };
                            this.drivingFaceId = res.data.drivingFace.id;
                            this.renshu = res.data.peopleNumber;//回显合计人数
                            this.jinchi = res.data.doneLength;//回显合计进尺
                            this.changliang = res.data.output;//回显合计产量
                            let str = res.data.drivingTeam.path.split('-');//拆分路径
                            let strData = str;//去掉顶级父级
                            for (let i in strData) {
                                //去除空的数组
                                if (strData[i] === "" || strData[i] == null || typeof (strData[i]) == "undefined") {
                                    strData.splice(i, 1);
                                    i = i - 1;
                                }
                            }
                            let drivingTeamIdArr = [];
                            for (let j in strData) {
                                drivingTeamIdArr.push(Number(strData[j]))//字符串转Number类型
                            }
                            //获取部门id 请求接口返回部门数据
                            this.data = [];
                            let tableDate = [];
                            tableDate.push({
                                id: res.data.id,
                                key: res.data.id,
                                shifts: res.data.shifts,
                                drivingTeamId: drivingTeamIdArr,
                                peopleNumber: res.data.peopleNumber,
                                doneLength: res.data.doneLength,
                                output: res.data.output,
                                workContent: res.data.workContent
                            });
                            this.data = TableUtil.formatData(tableDate, dataMapping)

                        }
                    })
                }
            },
            selectShifts(value, record) {
                let key = record.key;
                const newData = [...this.data];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target.shifts = value;
                    this.data = newData
                }
            },
            //新增，保存
            saveRow(record) {
                let shifts = typeof record.shifts === "undefined" || record.shifts === null || record.shifts === "" ? true : false;
                let doneLength = typeof record.doneLength === "undefined" || record.doneLength === null || record.doneLength === "" ? true : false;
                let drivingTeamId = record.drivingTeamId ? (typeof record.drivingTeamId === "object" ? (record.drivingTeamId.length >= 0 ? false : true) : true) : true;
                this.form.validateFields(
                    (err, values) => {
                        if (!err) {
                            if (this.drivingFaceId) {
                                if (shifts || doneLength || drivingTeamId) {
                                    message.warning("班次/掘进队伍/进尺不能为空！")
                                } else {
                                    http.post(record.id ? dataUrl.getUpdate : (record.id === undefined ? dataUrl.getAddData : null), {
                                        id: record.id,
                                        drivingFaceId: this.drivingFaceId ? this.drivingFaceId : null,
                                        dailyTime: this.formData.dailyTime && this.formData.dailyTime instanceof moment ? this.formData.dailyTime.format('YYYY-MM-DD') : (this.formData.dailyTime ? this.formData.dailyTime : null),
                                        shifts: record.shifts === "早班" ? "MORNING" : (record.shifts === "MORNING" ? record.shifts : (record.shifts === "中班" ? "NOON" : (record.shifts === "NOON" ? record.shifts : (record.shifts === "晚班" ? "EVENING" : (record.shifts === 'EVENING' ? record.shifts : null))))),
                                        drivingTeamId: record.drivingTeamId ? record.drivingTeamId.slice(-1)[0] : null,
                                        doneLength: record.doneLength ? record.doneLength : null,
                                        peopleNumber: record.peopleNumber ? record.peopleNumber : null,
                                        output: record.output ? record.output : null,
                                        workContent: record.workContent ? record.workContent : null,
                                    }).then(res => {
                                        if (res.state) {
                                            this.formData = {
                                                drivingFaceId: res.data ? res.data.drivingFace.id : null,
                                                dailyTime: res.data ? res.data.dailyTime : null,
                                            };
                                            this.drivingFaceId = res.data ? res.data.drivingFace.id : null;
                                            this.initDepartment();
                                            let str = res.data.drivingTeam.path.split('-');//拆分路径
                                            let strData = str;//去掉顶级父级
                                            for (let i in strData) {
                                                //去除空的数组
                                                if (strData[i] === "" || strData[i] == null || typeof (strData[i]) == "undefined") {
                                                    strData.splice(i, 1);
                                                    i = i - 1;
                                                }
                                            }

                                            let drivingTeamIdArr = [];
                                            for (let j in strData) {
                                                drivingTeamIdArr.push(Number(strData[j]))//字符串转Number类型
                                            }
                                            //获取获取当前编辑的key
                                            for (let i in this.data) {
                                                if (Number(this.data[i].key) === record.key) {
                                                    let key = "id";
                                                    let value = res.data.id;
                                                    this.data[i][key] = value;
                                                }
                                            }
                                            message.success(res.message);
                                            this.$parent.loader();
                                        } else {
                                            message.warning(res.message);
                                        }
                                    })
                                }
                            } else {
                                if (shifts || doneLength || drivingTeamId) {
                                    message.warning("班次/掘进队伍/进尺不能为空！")
                                } else {
                                    http.post(dataUrl.getAddData, {
                                        drivingFaceId: typeof (values.drillFaceId) === "number" ? values.drillFaceId : (typeof (values.drillFaceId) != 'number' ? this.drivingFaceId : null),
                                        dailyTime: values.dailyTime instanceof moment ? values.dailyTime.format('YYYY-MM-DD') : null,
                                        shifts: record.shifts === "早班" ? "MORNING" : (record.shifts === "MORNING" ? record.shifts : (record.shifts === "中班" ? "NOON" : (record.shifts === "NOON" ? record.shifts : (record.shifts === "晚班" ? "EVENING" : (record.shifts === 'EVENING' ? record.shifts : null))))),
                                        drivingTeamId: record.drivingTeamId ? record.drivingTeamId.slice(-1)[0] : null,
                                        doneLength: record.doneLength ? record.doneLength : null,
                                        peopleNumber: record.peopleNumber ? record.peopleNumber : null,
                                        output: record.output ? record.output : null,
                                        workContent: record.workContent ? record.workContent : null,
                                    }).then(res => {
                                        if (res.state) {
                                            this.formData = {
                                                drillFaceId: res.data ? res.data.drivingFace.id : null,
                                                dailyTime: res.data ? res.data.dailyTime : null,
                                            };
                                            this.drivingFaceId = res.data ? res.data.drivingFace.id : null;
                                            for (let i in this.data) {
                                                if (this.data[i].key === record.key) {
                                                    let key = "id";
                                                    let value = res.data.id;
                                                    this.data[i][key] = value;
                                                }
                                            }
                                            message.success(res.message);
                                            this.$parent.loader()
                                        } else {
                                            message.warning(res.message)
                                        }
                                    })
                                }
                            }
                        }
                    })
            },
            //工作面搜索
            drivingFaceSearch(search) {
                http.post(dataUrl.getDrivingFaceByName, {name: search}).then(res => {
                    if (res.state) {
                        let drivingFaceData = [];
                        if (res.data) {
                            res.data.forEach((r) => {
                                drivingFaceData.push({
                                    value: r.id,
                                    text: r.name,
                                })
                            })
                        }
                        this.drivingFaceData = drivingFaceData
                    }
                })
            },
            //加载工作面信息
            initdrivingFace() {
                if (this.formData.id) {
                    let drivingFace;
                    let flag = true;
                    http.post(dataUrl.getDrivingFaceById, {id: this.formData.id}).then(res => {
                        if (res.state) {
                            if (res.data) {
                                drivingFace = res.data.name
                            }
                        }
                    }).then(() => {
                        http.post(dataUrl.getDrivingFaceAll, {}).then(res => {
                            if (res.state) {
                                res.data.forEach((r) => {
                                    if (drivingFace && r.id === drivingFace.id) {
                                        flag = false
                                    }
                                    this.drivingFaceData.push({
                                        value: r.id,
                                        text: r.name,
                                    })
                                })
                                // if (flag) {
                                //     this.drivingFaceData.push({
                                //         value: drivingFace.id,
                                //         text: drivingFace.name,
                                //     })
                                // } else {
                                // }
                            }
                        })
                    })
                } else {
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
                }
            },
            //掘进队伍选择
            initDepartment() {
                http.post(dataUrl.getDepartmentAll, {id: 0}).then(res => {
                    if (res.state) {
                        if (res.data.length > 0) {
                            let topLevel = res.data[0].parentId; // 获取顶级父级
                            this.departmentList = [];
                            let tData = res.data; //获取后台返回数据
                            let next = [...tData];//存入数据
                            let result = [];//定义空数组
                            //将数行数组转为一维数组
                            while (next.length) {
                                //遍历数组，重新赋值
                                result.push(...next.map(m => ({
                                    value: m.id,
                                    label: m.name,
                                    id: m.id,
                                    key: m.id,
                                    parentId: m.parentId,
                                })));
                                next = next
                                    .filter(m => Array.isArray(m.children))
                                    .reduce((all, m) => [...all, ...m.children], []);
                            }
                            //将重新定义的数组，转为树形数组
                            result.forEach(e => {
                                let parentId = e.parentId;//获取父级id
                                if (parentId === 0) {
                                    //判断如果为顶层id 0 不做操作
                                } else {
                                    result.forEach(d => {
                                        //遍历数组，如果id = 父级id
                                        if (d.id === parentId) {
                                            let childArray = d.children;//新建子级数组
                                            if (!childArray) {
                                                childArray = []
                                            }
                                            childArray.push(e);
                                            d.children = childArray
                                        }
                                    })
                                }
                            });
                            //去除重复元素
                            result = result.filter(e => e.parentId === topLevel);
                            this.departmentList = result;
                        }
                    }
                })
            },

            //新增数据
            newMember() {
                const length = this.data.length;
                this.data.push({
                    key: Number(length === 0 ? '1' : (parseInt(this.data[length - 1].key) + 1).toString()),
                    shifts: '',
                    peopleNumber: '',
                    doneLength: '',
                    output: '',
                    workContent: '',
                    position: '',
                    remuneration: '',
                    editable: true,
                    isNew: true
                })
            },
            //选择部门信息
            selectDepartment(value, record) {
                let key = record.key;
                const newData = [...this.data];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target.drivingTeamId = value;
                    this.data = newData
                }
            },
            //
            startTimeChange(value, key) {
                const newData = [...this.data];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target.drivingTeamId = value;
                    this.data = newData
                }
            },
            peopleNumberChange(value, key) {
                const newData = [...this.data];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target.peopleNumber = value;
                    this.data = newData
                }
                var strarr = [];//定义一个新的数组，用来存储遍历的数字
                for (let i in newData) {
                    strarr.push(newData[i]['peopleNumber'])
                }
                let sum = 0;
                for (let i = strarr.length - 1; i >= 0; i--) {
                    if (strarr[i] === undefined || strarr[i] === null || strarr[i] === "") {
                        strarr[i] = 0
                    }
                    sum += strarr[i];
                }
                this.renshu = sum
            },
            outputChange(value, key) {
                const newData = [...this.data];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target.output = value;
                    this.data = newData
                }
                var strarr = [];//定义一个新的数组，用来存储遍历的数字
                for (let i in newData) {
                    strarr.push(newData[i]['output'])
                }
                let sum = 0;
                for (let i = strarr.length - 1; i >= 0; i--) {
                    if (strarr[i] === undefined || strarr[i] === null || strarr[i] === "") {
                        strarr[i] = 0
                    }
                    sum += Number(strarr[i]);
                }
                this.changliang = sum.toFixed(2)
            },
            doneLengthChange(value, key) {
                const newData = [...this.data];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target.doneLength = value;
                    this.data = newData
                }
                var strarr = [];//定义一个新的数组，用来存储遍历的数字
                for (let i in newData) {
                    strarr.push(newData[i]['doneLength'])
                }
                let sum = 0;
                for (let i = strarr.length - 1; i >= 0; i--) {
                    if (strarr[i] === undefined || strarr[i] === null || strarr[i] === "") {
                        strarr[i] = 0
                    }
                    sum += Number(strarr[i]);
                }
                this.jinchi = sum.toFixed(2)
            },
            workContentChange(value, key) {
                const newData = [...this.data];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target.workContent = value;
                    this.data = newData;
                }
            },

            //删除此行
            remove(record) {
                if (record.id) {
                    http.post(dataUrl.getDelete, {id: record.id}).then(res => {
                        if (res.state) {
                            let key = record.key;
                            const newData = this.data.filter(item => item.key !== key);
                            this.data = newData;
                            this.$parent.loader();
                            let output = 0;
                            let peopleNumber = 0;
                            let doneLength = 0;
                            this.data.forEach(e => {
                                output += e.output ? e.output:0;
                                peopleNumber += e.peopleNumber ? e.peopleNumber:0;
                                doneLength += e.doneLength ? e.doneLength:0;
                            });
                            this.changliang = output;
                            this.jinchi = doneLength;
                            this.renshu = peopleNumber;
                            message.success(res.message)
                        } else {
                            message.warning(res.message)
                        }
                    })
                } else if (!record.id) {
                    let key = record.key;
                    const newData = this.data.filter(item => item.key !== key);
                    this.data = newData;
                    let output = 0;
                    let peopleNumber = 0;
                    let doneLength = 0;
                    this.data.forEach(e => {
                        output += e.output ? e.output:0;
                        peopleNumber += e.peopleNumber ? e.peopleNumber:0;
                        doneLength += e.doneLength ? e.doneLength:0;
                    });
                    this.changliang = output;
                    this.jinchi = doneLength;
                    this.renshu = peopleNumber;
                    message.success("操作成功！")
                }
            },
            //取消
            handleCancel() {
                this.visible = false;
            },
            //关闭
            afterClose() {
                //关闭置空表单
                this.inputDisabled = false;
                this.flag = false;
                this.formData.id = null;
                this.formData.drillFaceId = null;
                this.drivingFaceId = null;
                this.formData.dailyTime = moment(new Date(), 'YYYY-MM-DD');
                this.data = [{
                    key: 0,
                    shifts: 'MORNING',
                }, {
                    key: 1,
                    shifts: 'NOON',
                }, {
                    key: 2,
                    shifts: 'EVENING',
                }];
                this.renshu = "0";
                this.jinchi = "0";
                this.changliang = "0";
                this.drivingFaceData = [];
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

    .footerSum {
        display: flex;
        border: 1px solid #e8e8e8;
    }

    .footerSum li {
        height: 56px;
        line-height: 56px;
        list-style: none;
        text-align: center;
    }

    .footerSum li:not(:last-child) {
        border-right: 1px solid #e8e8e8;
    }
</style>
