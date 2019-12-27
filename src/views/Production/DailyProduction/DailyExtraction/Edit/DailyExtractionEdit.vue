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
                    <a-form-item label="回采工作面" v-bind="formItemLayout">
                        <a-select
                                showSearch
                                :disabled="this.inputDisabled === true ? this.inputDisabled:(this.flag === true ? this.flag : false)"
                                @search="backMiningFaceSearch"
                                placeholder="请选择回采工作面!"
                                :defaultActiveFirstOption="false"
                                :filterOption="false"
                                :notFoundContent="backMiningFaceFetching? undefined : '暂无数据'"
                                v-decorator="['backMiningFaceId', { initialValue:formData.backMiningFaceId,rules: [{ required: true, message: '请选择回采工作面' }] } ]"
                        >
                            <a-spin v-if="backMiningFaceFetching" slot="notFoundContent" size="small"></a-spin>
                            <a-select-option v-for="d in backMiningFaceData" :key="d.value">{{d.text}}</a-select-option>
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
                        <span slot="teamIdTitle"><span style="color: red">*</span> 回采队伍</span>
                        <span slot="doneLengthTitle"><span style="color: red">*</span> 推进度（m）</span>
                        <template slot="shifts" slot-scope="text,record">
                            <template v-if="inputDisabled">{{text}}</template>
                            <a-select
                                    :style="{minWidth:'80px'}"
                                    :disabled=inputDisabled
                                    v-else
                                    :defaultValue="text"
                                    @change="e => selectShifts(e, record)"
                            >
                                <a-select-option value="MORNING">早班</a-select-option>
                                <a-select-option value="NOON">中班</a-select-option>
                                <a-select-option value="EVENING">晚班</a-select-option>
                            </a-select>
                        </template>
                        <template slot="teamId" slot-scope="text, record">
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
                               <a-popconfirm title="是否要删除此行？"   v-if="record.id" :disabled=inputDisabled @confirm="remove(record)">
                                    <a>删除</a>
                                </a-popconfirm>
                                 <a  v-else href="javascript:;" @click="remove(record)">删除</a>
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
        getAddData: '/api/produce-back-mining-daily/add',//新增数据
        getById: '/api/produce-back-mining-daily/get',//获取单条数据
        getUpdate: '/api/produce-back-mining-daily/update',//编辑数据
        getDelete: '/api/produce-back-mining-daily/delete',
        getBackMiningFaceByName: '/api/produce-back-mining-face/getByName',//根据名称搜索获取单条回采面名称
        getBackMiningFaceAll: '/api/produce-back-mining-face/getAllList',//获取全部回采面名称
        getBackMiningFaceById: '/api/produce-back-mining-face/get',//获取单条回采面
        getDepartmentAll: '/api/system-department/getTree',//获取当前账号部门、队伍
    };
    const dataMapping = {
        'id': 'String',
        'key': 'String',
        'shifts': 'Enum',//班次
        'peopleNumber': 'String',
        'doneLength': 'String',
        'teamId': 'String',
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
            slots: {title: 'teamIdTitle'},
            dataIndex: 'teamId',
            width: 200,
            align: 'center',
            scopedSlots: {customRender: 'teamId'}
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
        name: "DailyExtractionEdit",
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
            this.backMiningFaceSearch = debounce(this.backMiningFaceSearch, 500)
            return {
                formData: {
                    id: null,
                    backMiningFaceId: null,
                    dailyTime: moment(new Date(), 'YYYY-MM-DD'),
                    shifts: {key: '早班'}
                },
                title: '新增回采工作面日报',
                visible: false,
                confirmLoading: false,
                backMiningFaceFetching: false,
                backMiningFaceId: null,
                backMiningFaceData: [],
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
                    this.inputDisabled = noEdit;
                    if (this.inputDisabled) {
                        this.formData.id = record.id;
                        this.loader(noEdit);
                        this.initDepartment()

                    } else {
                        this.inputDisabled = false;
                        this.formData.id = record.id;
                        this.loader(noEdit);
                        this.initbackMiningFace();
                        this.initDepartment()
                    }
                } else {
                    this.inputDisabled = false;
                    this.title = "新增回采工作面日报";
                    this.initbackMiningFace();
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
                                this.title = "查看" + res.data.backMiningFace.backMiningFaceName + "回采工作面日报"
                            } else {
                                this.flag = true;
                                this.title = "编辑" + res.data.backMiningFace.backMiningFaceName + "回采工作面日报"
                            }
                            this.formData = {
                                backMiningFaceId: res.data.backMiningFace.backMiningFaceName ? res.data.backMiningFace.backMiningFaceName : null,
                                dailyTime: res.data.dailyTime ? moment(res.data.dailyTime, 'YYYY-MM-DD') : null,
                            };
                            this.renshu = res.data.peopleNumber;
                            this.jinchi = res.data.doneLength;
                            this.changliang = res.data.output;
                            this.backMiningFaceId = res.data.backMiningFace.id;
                            let str = res.data.team.path.split('-');//拆分路径
                            let strData = str;//去掉顶级父级
                            for (let i in strData) {
                                //去除空的数组
                                if (strData[i] === "" || strData[i] == null || typeof (strData[i]) == "undefined") {
                                    strData.splice(i, 1);
                                    i = i - 1;
                                }
                            }
                            let teamIdArr = [];
                            for (let j in strData) {
                                teamIdArr.push(Number(strData[j]))//字符串转Number类型
                            }
                            this.data = [];
                            let tableDate = [];
                            tableDate.push({
                                id: res.data.id,
                                key: res.data.id,
                                shifts: res.data.shifts,
                                teamId: teamIdArr,
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
                let teamId = record.teamId ? (typeof record.teamId === "object" ? (record.teamId.length >= 0 ? false : true) : true) : true;
                this.form.validateFields(
                    (err, values) => {
                        if (!err) {
                            if (this.backMiningFaceId) {
                                if (shifts || doneLength || teamId) {
                                    message.warning("班次/回采队伍/推进度不能为空")
                                } else {
                                    http.post(record.id ? dataUrl.getUpdate : (record.id === undefined ? dataUrl.getAddData : null), {
                                        id: record.id,
                                        backMiningFaceId: this.backMiningFaceId ? this.backMiningFaceId : null,
                                        dailyTime: this.formData.dailyTime && this.formData.dailyTime instanceof moment ? this.formData.dailyTime.format('YYYY-MM-DD') : (this.formData.dailyTime ? this.formData.dailyTime : null),
                                        shifts: record.shifts === "早班" ? "MORNING" : (record.shifts === "MORNING" ? record.shifts : (record.shifts === "中班" ? "NOON" : (record.shifts === "NOON" ? record.shifts : (record.shifts === "晚班" ? "EVENING" : (record.shifts === 'EVENING' ? record.shifts : null))))),
                                        teamId: record.teamId ? record.teamId.slice(-1)[0] : null,
                                        doneLength: record.doneLength ? record.doneLength : null,
                                        peopleNumber: record.peopleNumber ? record.peopleNumber : null,
                                        output: record.output ? record.output : null,
                                        workContent: record.workContent ? record.workContent : null,
                                    }).then(res => {
                                        if (res.state) {
                                            this.formData = {
                                                backMiningFaceId: res.data ? res.data.backMiningFaceId : null,
                                                dailyTime: res.data ? res.data.dailyTime : null,
                                            };
                                            this.backMiningFaceId = res.data.backMiningFace.id;
                                            let str = res.data.team.path.split('-');//拆分路径
                                            let strData = str.splice(1);//去掉顶级父级
                                            for (let i in strData) {
                                                //去除空的数组
                                                if (strData[i] === "" || strData[i] == null || typeof (strData[i]) == "undefined") {
                                                    strData.splice(i, 1);
                                                    i = i - 1;
                                                }
                                            }
                                            let teamIdArr = [];
                                            for (let j in strData) {
                                                teamIdArr.push(Number(strData[j]))//字符串转Number类型
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
                                            this.$parent.loader()
                                        } else {
                                            message.warning(res.message)
                                        }
                                    })
                                }
                            } else {
                                //判断班次，回采队伍，推进度是否为空
                                if (shifts || doneLength || teamId) {
                                    message.warning("班次/回采队伍/推进度不能为空")
                                } else {
                                    http.post(dataUrl.getAddData, {
                                        backMiningFaceId: typeof (values.backMiningFaceId) === "number" ? values.backMiningFaceId : (typeof (values.backMiningFaceId) != 'number' ? this.backMiningFaceId : null),
                                        dailyTime: values ? values.dailyTime : null,
                                        shifts: record.shifts === "早班" ? "MORNING" : (record.shifts === "MORNING" ? record.shifts : (record.shifts === "中班" ? "NOON" : (record.shifts === "NOON" ? record.shifts : (record.shifts === "晚班" ? "EVENING" : (record.shifts === 'EVENING' ? record.shifts : null))))),
                                        teamId: record.teamId ? record.teamId.slice(-1)[0] : null,
                                        doneLength: record.doneLength ? record.doneLength : null,
                                        peopleNumber: record.peopleNumber ? record.peopleNumber : null,
                                        output: record.output ? record.output : null,
                                        workContent: record.workContent ? record.workContent : null,
                                    }).then(res => {
                                        if (res.state) {
                                            this.formData = {
                                                backMiningFaceId: res.data ? res.data.backMiningFaceId : null,
                                                dailyTime: res.data ? res.data.dailyTime : null,
                                            };
                                            this.backMiningFaceId = res.data.backMiningFace.id;
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
                if (this.formData.id) {
                    let backMiningFace;
                    let flag = true
                    http.post(dataUrl.getBackMiningFaceById, {id: this.formData.id}).then(res => {
                        if (res.state) {
                            if (res.data) {
                                backMiningFace = res.data.backMiningFaceName
                            }
                        }
                    }).then(() => {
                        http.post(dataUrl.getBackMiningFaceAll, {}).then(res => {
                            if (res.state) {
                                res.data.forEach((r) => {
                                    if (backMiningFace && r.id === backMiningFace.id) {
                                        flag = false
                                    }
                                    this.backMiningFaceData.push({
                                        value: r.id,
                                        text: r.backMiningFaceName,
                                    })
                                })
                                // if (flag) {
                                //     this.backMiningFaceData.push({
                                //         value: backMiningFace.id,
                                //         text: backMiningFace.name,
                                //     })
                                // } else {
                                // }
                            }
                        })
                    })
                } else {
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
                }
            },
            //回采队伍选择
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
                    target.teamId = value;
                    this.data = newData
                }
            },
            //
            startTimeChange(value, key) {
                const newData = [...this.data];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target.teamId = value;
                    this.data = newData
                }
            },
            peopleNumberChange(value, key) {
                const newData = [...this.data];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target.peopleNumber = value;
                    this.data = newData;
                }
                var strarr = [];//定义一个新的数组，用来存储遍历的数字
                for (let i in newData) {
                    strarr.push(newData[i]['peopleNumber'])
                }
                let sum = 0;
                for (let i = strarr.length - 1; i >= 0; i--) {
                    if (strarr[i] === undefined || strarr[i] == null || strarr[i] === "") {
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
                    if (strarr[i] === undefined || strarr[i] == null || strarr[i] === "") {
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
                    if (strarr[i] === undefined || strarr[i] == null || strarr[i] === "") {
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
                    this.data = newData
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
                this.visible = false
            },
            //关闭
            afterClose() {
                this.inputDisabled = false;
                this.flag = false;
                //关闭置空表单
                this.formData = {
                    id: null,
                    backMiningFaceId: null,
                    dailyTime: moment(new Date(), 'YYYY-MM-DD'),
                };
                this.backMiningFaceId = null;
                this.renshu = "0";
                this.jinchi = "0";
                this.changliang = "0";
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
                this.backMiningFaceData = [];
                this.visible = false;
                this.confirmLoading = false
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
