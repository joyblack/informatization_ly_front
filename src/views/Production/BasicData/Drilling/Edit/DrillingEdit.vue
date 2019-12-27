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
            :maskClosable="true"
            :keyboard="true"
            closable
            :width="80+'%'"
    >
        <a-form :form="form" :style="{ marginTop: '8px' }">
            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="钻孔工作名称" v-bind="formItemLayout">
                        <a-input placeholder="请输入钻孔工作名称！"
                                 :disabled="this.inputDisabled"
                                 allowClear
                                 v-decorator="['drillWorkName',{ initialValue:formData.drillWorkName,rules: [{ required: true, message: '请输入钻孔工作名称' }] }]"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm="24">
                    <a-form-item label="开孔日期" v-bind="formItemLayout">
                        <a-date-picker :disabled="this.inputDisabled"
                                       v-decorator="['drillTime',{ initialValue:formData.drillTime,rules: [] }]"
                                       :style="{width: '100%'}"
                                       :disabledDate="disabledDate"
                        />
                    </a-form-item>
                </a-col>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="钻孔类别" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-select style="width: 120px"
                                  :disabled="this.inputDisabled"
                                  labelInValue
                                  v-decorator="['drillCategory',{ initialValue:formData.drillCategory,rules: [] }]"
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

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="8" :sm='24'>
                    <a-form-item label="钻孔类型" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-select style="width: 120px"
                                  :disabled="this.inputDisabled"
                                  labelInValue
                                  v-decorator="['drillType',{ initialValue:formData.drillType,rules: [] }]"
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
                        <a-select style="width: 120px"
                                  :disabled="this.inputDisabled"
                                  labelInValue
                                  v-decorator="['drillRockCharacter',{ initialValue:formData.drillRockCharacter,rules: [] }]"
                                  :style="{width: '100%'}"
                        >
                            <a-select-option value="COAL_LAYER">煤层</a-select-option>
                            <a-select-option value="ROCK_LAYER">岩层</a-select-option>
                        </a-select>
                    </a-form-item>
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
            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="24" :sm='24'>
                    <a-card title="钻孔详情">
                        <p style="color:#999999">注：请至少填一条</p>
                        <a-table
                                :columns="columns"
                                :dataSource="data"
                                :pagination="false"
                                :loading="memberLoading"
                                bordered
                        >
                            <span slot="codeTitle"><span style="color: red">*</span>钻孔编号</span>
                            <span slot="drivingTeamIdTitle"><span style="color: red">*</span> 掘进队伍</span>
                            <span slot="totalLengthTitle"><span style="color: red">*</span> 钻孔设计长度（m）</span>
                            <template slot="code" slot-scope="text, record">
                                <a-input
                                        :value="text"
                                        allowClear
                                        :disabled=inputDisabled
                                        @change="e => codeChange(e.target.value, record.key)"
                                />
                            </template>
                            <template slot="dipAngle" slot-scope="text, record">
                                <template v-if="inputDisabled">{{text}}</template>
                                <a-input-number
                                        :min="-360"
                                        :max="360"
                                        v-else
                                        :value="text"
                                        :precision="0"
                                        :disabled=inputDisabled
                                        @change="e => dipAngleChange(e, record.key)"
                                />
                            </template>
                            <template slot="intersectionAngle" slot-scope="text, record">
                                <template v-if="inputDisabled">{{text}}</template>
                                <a-input-number
                                        :min="-360"
                                        :max="360"
                                        v-else
                                        :value="text"
                                        :precision="0"
                                        :disabled=inputDisabled
                                        @change="e => intersectionAngleChange(e, record.key)"
                                />
                            </template>
                            <template slot="totalLength" slot-scope="text, record">
                                <template v-if="inputDisabled">{{text}}</template>
                                <a-input-number
                                        v-else
                                        :min="0"
                                        :value="text"
                                        :precision="2"
                                        :disabled=inputDisabled
                                        @change="e => totalLengthChange(e, record.key)"
                                />
                            </template>

                            <template slot="operation" slot-scope="text, record">
                            <span>
                               <a :disabled=inputDisabled @click="saveRow(record)">保存</a>
                              </span>
                                <a-divider type="vertical"/>
                                <span>
                                <a-popconfirm title="是否要删除此行？" :disabled=inputDisabled @confirm="remove(record)">
                                    <a>删除</a>
                                </a-popconfirm>
                              </span>
                            </template>
                        </a-table>
                        <a-button
                                style="width: 40%; position: relative;left: 50%; margin-left: -20%; margin-top: 16px; margin-bottom: 8px"
                                :disabled="this.addBtnDisabled"
                                type="primary"
                                icon="plus"
                                @click="newMember"
                        >
                            添加钻孔
                        </a-button>
                    </a-card>
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
        Card,
        Table,
        Button,
        Popconfirm,
        Divider,
        Icon,
        InputNumber,
        message
    } from 'ant-design-vue'
    import moment from 'moment'
    import http from '../../../../../utils/http'
    import TableUtil from '../../../../../utils/TableUtil'

    const dataUrl = {
        getAddData: '/api/produce-drill-work/add',//新增数据
        getById: '/api/produce-drill-work/get',//获取单条数据
        getUpdateData: '/api/produce-drill-work/update',//修改数据

        getByIdAddData: '/api/produce-drill-hole/add',//新增钻孔详情数据
        getAllByDrillWorkId: '/api/produce-drill-hole/getAllByDrillWorkId',//获取钻孔详情数据
        getDrillWorkDelete: '/api/produce-drill-hole/delete',//钻孔详情删除
        getDrillUpdate: '/api/produce-drill-hole/update',//钻孔详情单条编辑
    };
    const columns = [{
        title: "序号",
        dataIndex: 'key',
        align: 'center',
    }, {
        slots: {title: 'codeTitle'},
        dataIndex: 'code',
        key: 'code',
        align: 'center',
        scopedSlots: {customRender: 'code'}
    },
        {
            title: '倾角（°）',
            dataIndex: 'dipAngle',
            align: 'center',
            scopedSlots: {customRender: 'dipAngle'}
        },
        {
            title: '夹角（°）',
            dataIndex: 'intersectionAngle',
            align: 'center',
            scopedSlots: {customRender: 'intersectionAngle'}
        },
        {
            slots: {title: 'totalLengthTitle'},
            dataIndex: 'totalLength',
            align: 'center',
            scopedSlots: {customRender: 'totalLength'}
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            scopedSlots: {customRender: 'operation'}
        }];
    const dataMapping = {
        'id': 'String',
        'code': 'String',
        'dipAngle': 'String',//
        'intersectionAngle': 'String',//
        'totalLength': 'String',//
    };
    export default {
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        name: "DrillingEdit",
        components: {
            AModal: Modal,
            AForm: Form,
            ARow: Row,
            ACol: Col,
            AFormItem: Form.Item,
            AInput: Input,
            ATextarea: Input.TextArea,
            ADatePicker: DatePicker,
            ASelect: Select,
            ASelectOption: Select.Option,
            ACard: Card,
            ATable: Table,
            AButton: Button,
            APopconfirm: Popconfirm,
            ADivider: Divider,
            AIcon: Icon,
            AInputNumber: InputNumber,
        },
        data() {
            return {
                formData: {
                    id: null,
                    drillWorkName: null,
                    drillTime: moment(new Date(), 'YYYY-MM-DD'),
                    drillCategory: {key: 'THROUGH_LAYER_CATEGORY'},
                    drillType: {key: 'GAS_TYPE'},//
                    drillRockCharacter: {key: 'COAL_LAYER'},
                    remarks: null
                },
                title: '新增钻孔工作',
                visible: false,
                confirmLoading: false,
                inputDisabled: false,
                addBtnDisabled: true,
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
                    this.inputDisabled = noEdit;
                    if (this.inputDisabled) {
                        this.title = "查看" + record.drillWorkName;
                        this.addBtnDisabled = true;
                        this.formData.id = record.id;
                        this.loader();
                        this.initTableData()
                    } else {
                        this.inputDisabled = false;
                        this.title = "修改" + record.drillWorkName;
                        this.formData.id = record.id;
                        this.addBtnDisabled = false;
                        this.loader();
                        this.initTableData()
                    }
                } else {
                    this.inputDisabled = false;
                    this.addBtnDisabled = true;
                    this.title = "新增钻孔工作"
                }
            },
            //加载数据
            loader() {
                if (this.formData.id) {
                    http.post(dataUrl.getById, {id: this.formData.id}).then(res => {
                        if (res.state) {
                            this.formData = {
                                id: res.data ? res.data.id : null,
                                drillWorkName: res.data.drillWorkName ? res.data.drillWorkName : null,
                                drillTime: res.data ? moment(res.data.drillTime, 'YYYY-MM-DD') : null,
                                drillCategory: {key: res.data.drillCategory ? res.data.drillCategory : null},
                                drillType: {key: res.data.drillType ? res.data.drillType : null},
                                drillRockCharacter: {key: res.data.drillRockCharacter ? res.data.drillRockCharacter : null},
                                remarks: res.data ? res.data.remarks : null,
                            }
                        }
                    })
                }
            },
            //日期限制禁选
            disabledDate(current) {
                return current && current > moment();
            },
            //加载表格数据
            initTableData() {
                this.memberLoading = true;
                http.post(dataUrl.getAllByDrillWorkId, {
                    id: this.formData.id
                }).then((res => {
                    if (res.state) {
                        this.data = TableUtil.formatData(res.data, dataMapping);
                        this.memberLoading = false
                    } else {
                        message.warning(res.message)
                    }
                }))
            },
            //表格新增数据
            newMember() {
                const length = this.data.length;
                this.data.push({
                    key: length === 0 ? '1' : (parseInt(this.data[length - 1].key) + 1).toString(),
                    code: '',
                    totalLength: '',
                    intersectionAngle: '',
                    dipAngle: '',
                    editable: true,
                    isNew: true
                })
            },
            //钻孔详情保存
            saveRow(record) {
                if (!record.code || !record.totalLength) {
                    message.warning("钻孔编号或钻孔设计长度不能为空")
                } else {
                    if (record.id) {
                        http.post(dataUrl.getDrillUpdate, {
                            id: record.id,
                            drillWorkId: this.formData.id,
                            orderNumber: record.key,
                            code: record.code,
                            totalLength: record.totalLength,
                            intersectionAngle: record.intersectionAngle,
                            dipAngle: record.dipAngle,
                        }).then(res => {
                            if (res.state) {
                                message.success(res.message);
                                this.$parent.loader()
                            } else {
                                message.warning(res.message)
                            }
                        })
                    } else {
                        http.post(dataUrl.getByIdAddData, {
                            drillWorkId: this.formData.id,
                            orderNumber: record.key,
                            code: record.code,
                            totalLength: record.totalLength,
                            intersectionAngle: record.intersectionAngle,
                            dipAngle: record.dipAngle,
                        }).then(res => {
                            if (res.state) {
                                for (let i in this.data){
                                    if (this.data[i].key === record.key){
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
            },
            //钻孔编号
            codeChange(value, key) {
                const newData = [...this.data];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target.code = value;
                    this.data = newData
                }
            },
            //倾角
            dipAngleChange(value, key) {
                const newData = [...this.data];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target.dipAngle = value;
                    this.data = newData
                }
            },
            //夹角
            intersectionAngleChange(value, key) {
                const newData = [...this.data];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target.intersectionAngle = value;
                    this.data = newData
                }
            },
            totalLengthChange(value, key) {
                const newData = [...this.data];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target.totalLength = value;
                    this.data = newData
                }
            },

            //删除此行
            remove(record) {
                if (record.id) {
                    http.post(dataUrl.getDrillWorkDelete, {
                        id: record.id
                    }).then(res => {
                        if (res.state) {
                            message.success(res.message);
                            let key = record.key;
                            const newData = this.data.filter(item => item.key !== key);
                            this.data = newData;
                        } else {
                            message.warning(res.message)
                        }
                    })
                }else if (record.key){
                    let key = record.key;
                    const newData = this.data.filter(item => item.key !== key);
                    this.data = newData;
                    message.success("操作成功！")
                }
            },
            //新增、修改
            handleSubmit() {
                this.form.validateFields(
                    (err, values) => {
                        if (!err) {
                            //判断是否存在id
                            if (this.formData.id) {
                                this.confirmLoading = true;
                                http.post(dataUrl.getUpdateData, {
                                    id: this.formData ? this.formData.id : null,
                                    drillWorkName: values ? values.drillWorkName : null,
                                    drillTime: values.drillTime && values.drillTime instanceof moment ? values.drillTime.format('YYYY-MM-DD') : null,
                                    drillCategory: values.drillCategory ? values.drillCategory.key : null,
                                    drillType: values.drillType ? values.drillType.key : null,
                                    drillRockCharacter: values.drillRockCharacter ? values.drillRockCharacter.key : null,
                                    remarks: values ? values.remarks : null,
                                }).then(res => {
                                    if (res.state) {
                                        this.formData = {
                                            id: res.data ? res.data.id : null,
                                            drillWorkName: res.data.drillWorkName ? res.data.drillWorkName : null,
                                            drillTime: res.data ? moment(res.data.drillTime, 'YYYY-MM-DD') : null,
                                            drillCategory: {key: res.data.drillCategory ? res.data.drillCategory : null},
                                            drillType: {key: res.data.drillType ? res.data.drillType : null},
                                            drillRockCharacter: {key: res.data.drillRockCharacter ? res.data.drillRockCharacter : null},
                                            remarks: res.data ? res.data.remarks : null,
                                        };
                                        message.success(res.message);
                                        this.visible = false;
                                        this.$parent.loader()
                                    } else {
                                        message.warning(res.message)
                                    }
                                    this.confirmLoading = false
                                })
                            } else {
                                this.confirmLoading = true;
                                http.post(dataUrl.getAddData, {
                                    id: this.formData ? this.formData.id : null,
                                    drillWorkName: values ? values.drillWorkName : null,
                                    drillTime: values ? moment(values.drillTime, 'YYYY-MM-DD') : null,
                                    drillCategory: values.drillCategory ? values.drillCategory.key : null,
                                    drillType: values.drillType ? values.drillType.key : null,
                                    drillRockCharacter: values.drillRockCharacter ? values.drillRockCharacter.key : null,
                                    remarks: values ? values.remarks : null,
                                }).then(res => {
                                    if (res.state) {
                                        this.formData = {
                                            id: res.data ? res.data.id : null,
                                            drillWorkName: res.data.drillWorkName ? res.data.drillWorkName : null,
                                            drillTime: res.data ? moment(res.data.drillTime, 'YYYY-MM-DD') : null,
                                            drillCategory: {key: res.data.drillCategory ? res.data.drillCategory : null},
                                            drillType: {key: res.data.drillType ? res.data.drillType : null},
                                            drillRockCharacter: {key: res.data.drillRockCharacter ? res.data.drillRockCharacter : null},
                                            remarks: res.data ? res.data.remarks : null,
                                        };
                                        if (this.formData.id) {
                                            this.addBtnDisabled = false
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
            //取消
            handleCancel() {
                this.visible = false
            },
            //关闭
            afterClose() {
                //关闭置空表单
                this.formData = {
                    id: null,
                    drillWorkName: null,
                    drillTime: moment(new Date(), 'YYYY-MM-DD'),
                    drillCategory: {key: 'THROUGH_LAYER_CATEGORY'},
                    drillType: {key: 'GAS_TYPE'},//
                    drillRockCharacter: {key: 'COAL_LAYER'},
                    remarks: null
                };
                this.data = [];
                this.visible = false;
                this.confirmLoading = false
            },
        },
    }
</script>

<style scoped>
</style>
