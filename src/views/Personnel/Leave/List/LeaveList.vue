<template>
    <div class="leavePage">
        <Search :departmentList="departmentList" :positionList="positionList" @searchItems="searchItems"></Search>

        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{margin:'50px 0 20px'}">
            <a-col :style="{padding:'0'}">
                <!-- <a-button type="primary"  @click="downloadTemplate">
                    <a-icon type="download" />
                    下载导入模板
                </a-button>
                <a-button type="primary" @click="importData" style="margin: 0 20px;">
                    <a-icon type="export" />
                    导入
                </a-button> -->
                <!-- <a-button type="primary" @click="addLeave">
                    <a-icon type="plus" />
                    新增离职
                </a-button> -->
                <!-- <a-button type="primary" @click="changeStatus" style="margin: 0 20px;">
                    <a-icon type="form" />
                    变更参保状态
                </a-button> -->
                <a-button type="primary" :disabled="exportDisabled" @click="exportData">
                    <a-icon type="select" />
                    导出
                </a-button>
            </a-col>
        </a-row>

        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{margin:'0'}">
            <a-table 
                :columns="columns" 
                :dataSource="data" 
                :scroll="{ x: 1470}"
                :loading="tableLoading" 
                :pagination="pagination"
                bordered
            >
                <!-- 序号 -->
                <template slot="index" slot-scope="text, record, index">
                    <span>{{index + 1}}</span>
                </template>

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
                        title="确定要删除该条离职记录吗？"
                        @confirm="() => deleteData(record)">
                        <a href="javascript:;">删除</a>
                    </a-popconfirm>
                    <!-- <a href="javascript:;" @click="deleteData(record)">删除</a> -->
                </template>
            </a-table>
        </a-row>

        <LeaveEdit ref="leaveEdit" :departmentList="departmentList" :positionList="positionList" @comfirmAdd="comfirmAdd"></LeaveEdit>
    </div>
</template>

<script>
    import {Table, Row, Alert, Button, Upload, Divider, Input, Select, Spin, Col, message, DatePicker, Popconfirm, Icon, Modal} from 'ant-design-vue'
    import moment from 'moment'
    import 'moment/locale/zh-cn'
    import debounce from 'lodash/debounce'
    import Search from './Search/index'
    import LeaveEdit from './../Edit/LeaveEdit'
    import ChangeInsuredStatus from './../Edit/ChangeInsuredStatus'
    import TableUtil from '../../../../utils/TableUtil'
    import http from '../../../../utils/http'
    import UploadComfirm from './../Edit/UploadComfirm'

    const dataUrl = {
        getPagerList: '/api/staff-leave/getPagerList',
        getDepartmentTree: '/api/system-department/getTree',
        getPositionAll: '/api/position/getAllList',
        deleteLeaveById: '/api/staff-leave/delete',
        exportData: '/api/staff-leave/exportData2',
        downloadTemplate: '/api/staff-leave/downloadImportTemplate'
    }

    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            align: 'center',
            fixed: 'left',
            width: 80,
            scopedSlots: {customRender: 'index'},
        },
        {
            title: '姓名',
            dataIndex: 'staffPersonal.username',
            align: 'center',
            width: 130
        },
        {
            title: '身份证号',
            width: 130,
            dataIndex: 'staffPersonal.idNumber',
            align: 'center'
        },
        {
            title: '联系电话',
            width: 130,
            dataIndex: 'staffPersonal.phone',
            align: 'center'
        }, 
        {
            title: '入职部门',
            width: 130,
            dataIndex: 'department.name',
            align: 'center'
        }, 
        {
            title: '入职职位',
            width: 130,
            dataIndex: 'position.name',
            align: 'center'
        },
        {
            title: '离职类型',
            width: 130,
            dataIndex: 'leaveType',
            align: 'center'
        }, 
        {
            title: '离职日期',
            width: 130,
            dataIndex: 'leaveTime',
            align: 'center'
        }, 
        {
            title: '离职手续是否齐全',
            width: 150,
            dataIndex: 'leaveOffice',
            align: 'center'
        }, 
        {
            title: '离职原因',
            // width: 130,
            dataIndex: 'leaveReason',
            align: 'center'
        },
        {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            width: 160,
            fixed: 'right',
            scopedSlots: {customRender: 'edit'},
        }
    ]

    const dataMapping = {
        'staffPersonal.username': 'Object',
        'staffPersonal.idNumber': 'Object',
        'staffPersonal.phone': 'Object',
        'department.name': 'Object',
        'position.name': 'Object',
        'leaveType': 'Enum',
        'leaveTime': 'Date',
        'leaveOffice': 'Enum',
        'leaveReason': 'String'
    }

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
            ADatePicker:DatePicker,
            APopconfirm: Popconfirm,
            AIcon: Icon,
            AModal: Modal,
            Search,
            LeaveEdit
        },
        name: 'LeaveList',
        data() {
            //防抖动处理
            //this.unitSearch = debounce(this.unitSearch, 500)
            return {
                dateTime:moment(new Date(),'YYYY-MM'),
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
                positionList: null,
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
                exportDisabled: false,
                departmentList: []
            }
        },
        mounted(){
            this.loader();
            this.loaderDepartmentTree();
            this.getPositionAll();
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
            //加载数据
            loader(params) {
                this.tableLoading = true
                http.post(dataUrl.getPagerList, params ? params : {
                    username: this.searchValue.username ? this.searchValue.username : null,
                    idNumber: this.searchValue.idNumber ? this.searchValue.idNumber : null,
                    phone: this.searchValue.phone ? this.searchValue.phone : null,
                    leaveType: this.searchValue.leaveType ? this.searchValue.leaveType : null,
                    departmentId: (this.searchValue && this.searchValue.departmentId) ? parseInt(this.searchValue.departmentId.slice(-1).toString()) : null,
                    positionId: this.searchValue.positionId ? this.searchValue.positionId : null,
                    leaveTimeStart: this.searchValue.leaveTimeStart ? this.searchValue.leaveTimeStart : null,
                    leaveTimeEnd: this.searchValue.leaveTimeEnd ? this.searchValue.leaveTimeEnd : null,
                    leaveOffice: this.searchValue.leaveOffice ? this.searchValue.leaveOffice : null,
                    page: this.pagination.current,
                    size: this.currentSize
                }).then(res => {
                    if (res.state) {
                        this.data = TableUtil.formatData(res.data.content, dataMapping)
                        this.pagination.total = res.data.totalElements
                        this.tableLoading = false
                    } else {
                        message.warning(res.message)
                    }
                })
            },
            //获取职位列表
            getPositionAll(params) {
                http.post(dataUrl.getPositionAll, params ? params : {
                }).then(res => {
                    if (res.state) {
                        this.positionList = res.data;
                        this.editData = res.data;
                    }
                })
            },
            //下载
            downloadTemplate() {
                http.getFile(dataUrl.downloadTemplate, {}).then(res => {
                    if (res.state) {
                        message.warning(res.detailMessage)
                    } else {
                        message.warning(res.detailMessage)
                    }
                })
            },
            //导入
            importData() {
                // if(info.file.status !== 'uploading') {
                //     this.importDatas = [];
                //     this.errorVisible = false;
                //     const formData = new FormData();
                //     formData.append('file', info.file.originFileObj);
                //     http.postFile(dataUrl.importLeaveData, formData).then(res => {
                //         if (res.state) {
                //             if(res.data.length === 0) {
                //                 message.success('导入成功！');
                //                 this.loader();
                //             } else {
                //                 this.importDatas = res.data;
                //                 this.errorVisible = true;
                //             }                   
                //         } else {
                //             message.warning(res.message)
                //         }
                //     })
                //     return false
                // }
                this.$refs.uploadComfirm.openModal();
            },
            //导出
            exportData() {
                this.exportDisabled = true;
                http.getFile(dataUrl.exportData).then(res => {
                    if (res.state) {
                        message.warning(res.detailMessage)
                    } else {
                        message.warning(res.detailMessage)
                    }
                })
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    this.exportDisabled = false
                }, 2000);
            },
            //搜索
            searchItems(values) {
                this.searchValue = values;
                this.pagination.defaultCurrent = 1;
                this.pagination.current= 1;
                this.loader();
            },
            //添加数据
            addLeave() {
                this.$refs.leaveEdit.openModal();
            },
            comfirmAdd() {
                this.pagination.defaultCurrent = 1;
                this.pagination.current= 1;
                this.pagination.defaultPageSize = this.currentSize;
                this.pagination.pageSize = this.currentSize;
                this.loader();
                this.selectedRowKeys = [];
                this.selectedItems = [];
            },
            //查看
            view(record,type) {
                this.$refs.leaveEdit.openModal(record,type);
            },
            //编辑
            edit(record) {
                this.$refs.leaveEdit.openModal(record);
            },
            //删除
            deleteData(record) {
                if (record) {
                    http.post(dataUrl.deleteLeaveById, {
                        id: record.id
                    }).then(res => {
                        if (res.state) {
                            message.success('操作执行成功!')
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