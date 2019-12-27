<template>
    <div class="leavePage">
        <Search :departmentList="departmentList" @searchItems="searchItems"></Search>

        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{margin:'30px 0 20px'}">
            <a-col :style="{padding:'0'}">
                <!--                <a-button type="primary"  @click="downloadTemplate">-->
                <!--                    <a-icon type="download" />-->
                <!--                    下载导入模板-->
                <!--                </a-button>-->
                <!--                <a-button type="primary" style="margin:0 20px;"  @click="importData">-->
                <!--                    <a-icon type="export" />-->
                <!--                    导入-->
                <!--                </a-button>-->
                <a-button type="primary" @click="inspectionAdd">
                    <a-icon type="plus"/>
                    新增安全巡检
                </a-button>
                <a-button type="primary" @click="changeStatus" style="margin:0 20px;">
                    <a-icon type="form"/>
                    变更整改状态
                </a-button>
                <a-button type="primary" :disabled="exportDisabled" @click="exportData">
                    <a-icon type="select"/>
                    导出
                </a-button>
                <span v-if="selectedStatus" class="selectedStatus">请选择需要变更整改状态的问题项！</span>
            </a-col>
        </a-row>

        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{margin:'0'}">
            <a-table
                    :columns="columns"
                    :dataSource="data"
                    :scroll="{ x: 1890}"
                    :loading="tableLoading"
                    :pagination="pagination"
                    bordered
                    :rowSelection="rowSelection"
            >
                <!--操作-->
                <template slot="edit" slot-scope="text, record">
                        <span>
                            <a @click="() => view(record,true)">查看</a>
                        </span>
                    <a-divider type="vertical"/>
                    <span>
                            <a @click="() => edit(record)">编辑</a>
                        </span>
                    <a-divider type="vertical"/>
                    <a-popconfirm
                            v-if="data.length"
                            title="确定要删除该条巡检记录吗？"
                            @confirm="() => deleteData(record)">
                        <a href="javascript:;">删除</a>
                    </a-popconfirm>
                </template>
            </a-table>
        </a-row>
        <InspectionAdd ref="inspectionAdd" @comfirmAdd="comfirmAdd" :departmentList="departmentList"></InspectionAdd>
        <InspectionEdit ref="inspectionEdit" @comfirmAdd="comfirmAdd" :departmentList="departmentList"></InspectionEdit>
        <RectificationStatus ref="rectificationStatus" @comfirmAdd="comfirmAdd" :selectedItems="selectedItems"></RectificationStatus>
    </div>
</template>

<script>
    import {
        Table,
        Row,
        Alert,
        Button,
        Upload,
        Divider,
        Input,
        Select,
        Spin,
        Col,
        message,
        DatePicker,
        Popconfirm,
        Icon
    } from 'ant-design-vue'
    import moment from 'moment'
    import 'moment/locale/zh-cn'
    import Search from './Search/index'
    import InspectionAdd from './../Edit/InspectionAdd'
    import InspectionEdit from './../Edit/InspectionEdit'
    import RectificationStatus from './../Edit/RectificationStatus'
    import TableUtil from '../../../../utils/TableUtil'
    import http from '../../../../utils/http'

    const dataUrl = {
        getPagerList: '/api/safe-inspection/getPagerList',
        getDepartmentTree: '/api/system-department/getTree',
        deleteLeaveById: '/api/safe-inspection/delete',
        exportData: '/api/safe-inspection/exportData2',
        getPagerApproachRectification: '/api/safe-inspection/getPagerApproachRectification',//安全隐患详情跳转
    };

    const columns = [
        {
            title: '巡检日期',
            width: 130,
            dataIndex: 'inspectTime',
            align: 'center'
        },
        {
            title: '巡检部门',
            width: 130,
            dataIndex: 'inspectDepartment.name',
            align: 'center'
        },
        {
            title: '巡检类型',
            width: 130,
            dataIndex: 'inspectType',
            align: 'center'
        },
        {
            title: '巡检地点',
            width: 130,
            dataIndex: 'inspectPlace',
            align: 'center'
        },
        {
            title: '问题描述',
            width: 130,
            dataIndex: 'problemDescribes',
            align: 'center'
        },
        {
            title: '责任人',
            width: 130,
            dataIndex: 'responsePeople',
            align: 'center'
        },
        {
            title: '整改期限',
            width: 130,
            dataIndex: 'deadTime',
            align: 'center'
        },
        {
            title: '超时整改',
            width: 130,
            dataIndex: 'isOverTime',
            align: 'center'
        },
        {
            title: '验收结果',
            width: 130,
            dataIndex: 'rectificationStatus',
            align: 'center'
        },
        {
            title: '验收日期',
            width: 130,
            dataIndex: 'examineDate',
            align: 'center'
        },
        {
            title: '验收人',
            width: 130,
            dataIndex: 'rectificationPeople',
            align: 'center'
        },
        {
            title: '备注',
            // width: 130,
            dataIndex: 'remarks',
            align: 'center'
        },
        {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            fixed: 'right',
            width: 160,
            scopedSlots: {customRender: 'edit'}
        }
    ];

    const dataMapping = {
        'inspectTime': 'Date',
        'inspectDepartment.name': 'Object',
        'inspectType': 'Enum',
        'inspectPlace': 'String',
        'problemDescribes': 'String',
        'responsePeople': 'String',
        'deadTime': 'Date',
        'rectificationStatus': 'Enum',
        'isOverTime': 'Enum',
        'examineDate': 'Date',
        'rectificationPeople': 'String',
        'remarks': 'String'
    };

    export default {
        components: {
            ARow: Row,
            ACol: Col,
            AAlert: Alert,
            AButton: Button,
            ATable: Table,
            AUpload: Upload,
            ADivider: Divider,
            AInput: Input,
            ASelect: Select,
            ASelectOption: Select.Option,
            ASpin: Spin,
            ADatePicker: DatePicker,
            APopconfirm: Popconfirm,
            AIcon: Icon,
            Search,
            InspectionAdd,
            InspectionEdit,
            RectificationStatus
        },
        name: 'InspectionList',
        data() {
            return {
                securityDetails: this.$route.params.details,
                dateTime: moment(new Date(), 'YYYY-MM'),
                visible: false,
                loading: false,
                tableLoading: false,
                title: '配置',
                pagination: {
                    showQuickJumper: true,
                    showSizeChanger: true,
                    pageSizeOptions: ['20', '40', '60', '80', '100'],
                    defaultPageSize: 20,
                    defaultCurrent: 1,
                    pageSize: 20,
                    total: 0,
                    current: 1,
                    showTotal: this.showTotal,
                    onChange: this.paginationChange,
                    onShowSizeChange: this.paginationSizeChange,
                },
                currentSize: 20,
                columns,
                data: null,
                departmentList: [],
                searchValue: {},
                formItemLayout: {
                    labelCol: {
                        xs: {span: 24},
                        sm: {span: 8},
                    },
                    wrapperCol: {
                        xs: {span: 24},
                        sm: {span: 16},
                    },
                },
                selectedRowKeys: [],
                selectedItems: [],
                selectedStatus: false,
                exportDisabled: false
            }
        },
        computed: {
            rowSelection() {
                const {selectedRowKeys} = this;
                return {
                    selectedRowKeys,
                    fixed: true,
                    onChange: this.onSelectChange,
                    getCheckboxProps: this.getDefaultCheckbox
                }
            }
        },
        mounted() {
            this.loader();
            this.loaderDepartmentTree();
        },
        methods: {
            loaderDepartmentTree() {
                http.post(dataUrl.getDepartmentTree, {
                    id: 0
                }).then(res => {
                    if (res.state) {
                        this.filterItems(res.data);
                    }
                })
            },
            filterItems(obj) {
                for(var i in obj){
                    obj[i].value = obj[i].id;
                    obj[i].label = obj[i].name;
                    if(obj[i].children){
                        this.filterItems(obj[i].children)
                    }
                }
                this.departmentList = obj;
            },
            //分页改变
            paginationChange(page, pageSize) {
                if (page && pageSize) {
                    //只有两个参数不为空时才调用
                    this.pagination.current = page;
                    this.currentSize = pageSize;
                    this.pagination.defaultPageSize = this.currentSize;
                    this.pagination.pageSize = this.currentSize;
                    this.loader()
                }
            },
            //分页条数改变(current当前页码，size分页数量)
            paginationSizeChange(current, size) {
                if (current && size) {
                    //只有两个参数都不为空时才调用
                    this.pagination.current = current;
                    this.currentSize = size;
                    this.pagination.defaultPageSize = this.currentSize;
                    this.pagination.pageSize = this.currentSize;
                    this.loader()
                }
            },
            showTotal(total) {
                return `总计: ${total} 条`
            },

            //下载
            downloadTemplate() {
                // http.getFile(dataUrl.downloadImportTemplate, {}).then(res => {
                //     if (res.state) {
                //         message.warning(res.detailMessage)
                //     } else {
                //         message.warning(res.detailMessage)
                //     }
                // })
            },

            //导入
            importData() {

            },

            //导出
            exportData() {
                this.exportDisabled = true;
                let paramsItem = {
                    inspectTimeStart: this.searchValue.inspectTimeStart ? this.searchValue.inspectTimeStart : null,
                    inspectTimeEnd: this.searchValue.inspectTimeEnd ? this.searchValue.inspectTimeEnd : null,
                    inspectDepartmentId: (this.searchValue && this.searchValue.inspectDepartmentId) ? parseInt(this.searchValue.inspectDepartmentId.slice(-1).toString()) : null,
                    inspectType: this.searchValue.inspectType ? this.searchValue.inspectType : null,
                    deadTimeStart: this.searchValue.deadTimeStart ? this.searchValue.deadTimeStart : null,
                    deadTimeEnd: this.searchValue.deadTimeEnd ? this.searchValue.deadTimeEnd : null,
                    rectificationStatus: this.searchValue.rectificationStatus ? this.searchValue.rectificationStatus : null,
                    isOverTime: this.searchValue.isOverTime ? this.searchValue.isOverTime : null,
                    inspectPlace: this.searchValue.inspectPlace ? this.searchValue.inspectPlace : null
                };

                for (var key in paramsItem) {
                    if (paramsItem[key] === null) {
                        delete paramsItem[key]
                    }
                }
                http.getFile(dataUrl.exportData, paramsItem).then(res => {
                    if (res.state) {
                        message.warning(res.detailMessage)
                    } else {
                        message.warning(res.detailMessage)
                    }
                });
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    this.exportDisabled = false
                }, 2000);
            },

            //加载数据
            loader(params) {
                this.tableLoading = true;
                http.post(dataUrl.getPagerList, params ? params : {
                    inspectTimeStart: this.searchValue ? this.searchValue.inspectTimeStart : null,
                    inspectTimeEnd: this.searchValue ? this.searchValue.inspectTimeEnd : null,
                    inspectDepartmentId: (this.searchValue && this.searchValue.inspectDepartmentId) ? parseInt(this.searchValue.inspectDepartmentId.slice(-1).toString()) : null,
                    inspectType: this.searchValue ? this.searchValue.inspectType : null,
                    deadTimeStart: this.searchValue ? this.searchValue.deadTimeStart : null,
                    deadTimeEnd: this.searchValue ? this.searchValue.deadTimeEnd : null,
                    rectificationStatus: this.securityDetails ? 'RECTIFICATION_NO':(this.securityDetails === undefined ? this.searchValue.rectificationStatus:null),
                    isOverTime: this.searchValue ? this.searchValue.isOverTime : null,
                    inspectPlace: this.searchValue ? this.searchValue.inspectPlace : null,
                    page: this.pagination.current,
                    size: this.currentSize
                }).then(res => {
                    if (res.state) {
                        this.data = TableUtil.formatData(res.data.content, dataMapping);
                        this.pagination.total = res.data.totalElements;
                        this.tableLoading = false;
                        this.selectedItems = [];
                        this.selectedRowKeys = [];
                    } else {
                        message.warning(res.message)
                    }
                })
            },

            //获取公司列表
            getCompanyList(params) {
                http.post(dataUrl.getCompanyList, params ? params : {}).then(res => {
                    if (res.state) {
                        this.companyList = res.data;
                    }
                })
            },

            onSelectChange(selectedRowKeys, selected) {
                this.selectedRowKeys = selectedRowKeys;
                this.selectedItems = selected;
                if (this.selectedItems.length === 0) {
                    this.selectedStatus = true;
                } else {
                    this.selectedStatus = false;
                }
            },

            getDefaultCheckbox(record) {
                return ({
                    props: {
                        disabled: record.rectificationStatus === '已整改',
                        rectificationStatus: record.rectificationStatus,
                        // disabled: this.data.some(item => item.rectificationStatus == '已整改'),
                    }
                })
            },

            //搜索
            searchItems(values) {
                this.searchValue = values;
                this.pagination.defaultCurrent = 1;
                this.pagination.current = 1;
                this.securityDetails = undefined;
                this.loader();
            },

            //添加数据
            inspectionAdd() {
                this.$refs.inspectionAdd.openModal();
            },

            //变更整改状态
            changeStatus() {
                if (this.selectedItems.length === 0) {
                    this.selectedStatus = true;
                } else {
                    this.selectedStatus = false;
                    this.$refs.rectificationStatus.openModal();
                }
            },

            comfirmAdd() {
                this.pagination.defaultCurrent = 1;
                this.pagination.current = 1;
                this.pagination.defaultPageSize = this.currentSize;
                this.pagination.pageSize = this.currentSize;
                this.loader();
            },

            //查看
            view(record, type) {
                this.$refs.inspectionEdit.openModal(record, type);
            },

            //编辑
            edit(record) {
                this.$refs.inspectionEdit.openModal(record);
            },

            //删除
            deleteData(record) {
                if (record) {
                    http.post(dataUrl.deleteLeaveById, {
                        id: record.id
                    }).then(res => {
                        if (res.state) {
                            message.success('操作执行成功!');
                            let currentData = [];
                            currentData = this.data;
                            if(currentData.length === 1 && this.pagination.current > 1) {
                                this.pagination.current = this.pagination.current - 1;  
                            }
                            this.loader()
                        } else {
                            message.warning(res.message)
                        }
                    })
                }
            }
        }
    }
</script>

<style scoped>
    span.selectedStatus {
        color: #f5222d;
        padding-left: 10px;
    }
</style>
