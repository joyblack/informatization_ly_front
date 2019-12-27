<template>
    <div class="leavePage">
        <Search @searchItems="searchItems" :departmentList="departmentList"></Search>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{margin:'40px 0 20px'}">
            <a-col :style="{padding:'0'}">
                <!-- <a-button type="primary" @click="changeDownloadMould">
                    <a-icon type="download"/>
                    下载导入模板
                </a-button>
                <a-upload name="file" :showUploadList="false" :accept="acceptFiles" @change="importData">
                    <a-button type="primary" style="margin:0 20px;">
                        <a-icon type="export" />
                        导入
                    </a-button>
                </a-upload> -->
                <a-button type="primary" @click="equipmentsAdd">
                    <a-icon type="plus"/>
                    新增设备
                </a-button>
                <!-- <a-button type="primary" @click="changeStatus" style="margin:0 20px;">
                    <a-icon type="form"/>
                    变更设备状态
                </a-button>
                <a-button type="primary" :disabled="exportDisabled" @click="changeDownload">
                    <a-icon type="select"/>
                    导出
                </a-button>
                <span v-if="selectedStatus" class="selectedStatus">请选择需要变更状态的设备项！</span> -->
            </a-col>
        </a-row>

        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{margin:'0'}">
            <a-table
                    :columns="columns"
                    :dataSource="data"
                    :scroll="{ x: 1330}"
                    :loading="tableLoading"
                    :pagination="pagination"
                    bordered
                    class="equipmentsTable"
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
                            title="确定要删除该条设备记录吗？"
                            @confirm="() => deleteData(record)">
                        <a href="javascript:;">删除</a>
                    </a-popconfirm>
                </template>
            </a-table>
        </a-row>
        <EquipmentsEdit ref="equipmentsEdit" @comfirmAdd="comfirmAdd" :departmentList="departmentList"></EquipmentsEdit>
        <!-- 导入时错误信息提示 -->
        <a-modal title="导入结果" v-model="errorVisible" @ok="handleOk" class="errorModal">
            <p v-for="(item,index) in importDatas" :key="index">{{(index+1) + '、' + item}}</p>
        </a-modal>
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
        Icon,
        Modal,
        Tooltip
    } from 'ant-design-vue'
    import moment from 'moment'
    import 'moment/locale/zh-cn'
    import Search from './Search/index'
    import EquipmentsEdit from './../Edit/EquipmentsEdit'
    import EquipmnetsStatus from './../Edit/EquipmnetsStatus'
    import TableUtil from '../../../../utils/TableUtil'
    import http from '../../../../utils/http'

    const dataUrl = {
        getPagerList: '/api/device-info/getPagerList',
        deleteLeaveById: '/api/device-info/delete',
        getDepartmentTree: '/api/system-department/getTree',
        getImportData:'/api/device-info/importData',//导入
        getExportData:'/api/device-info/exportData2',//导出
        getDownloadImportTemplate:'/api/device-info/downloadImportTemplate',//下载导入模板
    };

    const columns = [
        {
            title: '设备名称',
            width: 130,
            dataIndex: 'deviceName',
            align: 'center'
        },
        {
            title: '型号',
            width: 130,
            dataIndex: 'deviceModel',
            align: 'center'
        },
        {
            title: '技术参数',
            width: 150,
            dataIndex: 'technicalData',
            align: 'center',
            scopedSlots: {customRender: 'technicalData'}
        },

        {
            title: '生产厂家',
            width: 130,
            dataIndex: 'manufacture',
            align: 'center'
        },
        {
            title: '使用部门',
            width: 130,
            dataIndex: 'useDepartment.name',
            align: 'center'
        },
        {
            title: '领用人',
            width: 120,
            dataIndex: 'usePeople',
            align: 'center'
        },
        {
            title: '领用日期',
            width: 120,
            dataIndex: 'useDate',
            align: 'center'
        },
        {
            title: '安装地点',
            width: 130,
            dataIndex: 'installPlace',
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
        'deviceName': 'String',
        'deviceModel': 'String',
        'technicalData': 'String',
        'manufacture': 'String',
        'useDepartment.name': 'Object',
        'usePeople': 'String',
        'useDate': 'Date',
        'installPlace': 'String',
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
            AModal:Modal,
            ATooltip: Tooltip,
            Search,
            EquipmentsEdit
        },
        name: 'EquipmentsList',
        data() {
            return {
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
                treeData: [],
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
                importDatas: [],
                acceptFiles: '.xls,.xlsx',
                errorVisible: false,
                exportDisabled: false,
                departmentList: []
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
            //加载数据
            loader(params) {
                this.tableLoading = true;
                http.post(dataUrl.getPagerList, params ? params : {
                    deviceName: this.searchValue.deviceName ? this.searchValue.deviceName : null,
                    deviceModel: this.searchValue.deviceModel ? this.searchValue.deviceModel : null,
                    manufacture: this.searchValue.manufacture ? this.searchValue.manufacture : null,
                    useDepartmentId: (this.searchValue && this.searchValue.useDepartmentId) ? parseInt(this.searchValue.useDepartmentId.slice(-1).toString()) : null,
                    usePeople: this.searchValue.usePeople ? this.searchValue.usePeople : null,
                    useDateStart: this.searchValue.useDate && this.searchValue.useDate[0] instanceof moment ? this.searchValue.useDate[0].format('YYYY-MM-DD') : null,
                    useDateEnd: this.searchValue.useDate && this.searchValue.useDate[1] instanceof moment ? this.searchValue.useDate[1].format('YYYY-MM-DD') : null,
                    installPlace: this.searchValue.installPlace ? this.searchValue.installPlace : null,
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
            //搜索
            searchItems(values) {
                this.searchValue = values;
                this.pagination.defaultCurrent = 1;
                this.pagination.current = 1;
                this.loader();
            },
            //添加数据
            equipmentsAdd() {
                this.$refs.equipmentsEdit.openModal();
            },
            //导入
            importData(info) {
                if(info.file.status !== 'uploading') {
                    this.importDatas = [];
                    this.errorVisible = false;
                    const formData = new FormData();
                    formData.append('file', info.file.originFileObj);
                    http.postFile(dataUrl.getImportData, formData).then(res => {
                        if (res.state) {
                            if(res.data.length === 0) {
                                message.success('导入成功！');
                                this.loader();
                            } else {
                                this.importDatas = res.data;
                                this.errorVisible = true;
                            }
                        } else {
                            message.warning(res.message)
                        }
                    });
                    return false
                }
            },
            handleOk(e) {
                this.errorVisible = false;
                this.loader();
            },
            //导出
            changeDownload() {
                this.exportDisabled = true;
                let paramsItem = {
                    deviceName: this.searchValue.deviceName ? this.searchValue.deviceName : null,
                    deviceModel: this.searchValue.deviceModel ? this.searchValue.deviceModel : null,
                    manufacture: this.searchValue.manufacture ? this.searchValue.manufacture : null,
                    useDepartmentId: (this.searchValue && this.searchValue.useDepartmentId) ? parseInt(this.searchValue.useDepartmentId.slice(-1).toString()) : null,
                    usePeople: this.searchValue.usePeople ? this.searchValue.usePeople : null,
                    useDateStart: this.searchValue.useDate && this.searchValue.useDate[0] instanceof moment ? this.searchValue.useDate[0].format('YYYY-MM-DD') : null,
                    useDateEnd: this.searchValue.useDate && this.searchValue.useDate[1] instanceof moment ? this.searchValue.useDate[1].format('YYYY-MM-DD') : null,
                    installPlace: this.searchValue.installPlace ? this.searchValue.installPlace : null,
                };
                for ( var key in paramsItem ){
                    if ( paramsItem[key] === null ){
                        delete paramsItem[key]
                    }
                }
                http.getFile(dataUrl.getExportData).then(res=>{
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
            //导入模板下载
            changeDownloadMould() {

                http.getFile(dataUrl.getDownloadImportTemplate).then(res=>{
                    console.log(res)
                    // if (res.state){
                    //     message.warning(res.detailMessage)
                    // } else {
                    //     message.warning(res.detailMessage)
                    // }
                })
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
                this.$refs.equipmentsEdit.openModal(record, type);
            },
            //编辑
            edit(record) {
                this.$refs.equipmentsEdit.openModal(record);
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
