<template>
    <div class="entryPage">
        <Search :departmentList="departmentList" :positionList="positionList" :nationalityList="nationalityList" @searchItems="searchItems"></Search>

        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{margin:'30px 0 20px'}">
            <a-col :style="{padding:'0'}">
                <!-- <a-button type="primary"  @click="downloadTemplate">
                    <a-icon type="download" />
                    下载导入模板
                </a-button>
                <a-upload name="file" :showUploadList="false" :accept="acceptFiles" @change="importData">
                    <a-button type="primary" style="margin:0 20px;">
                        <a-icon type="export" />
                        导入
                    </a-button>
                </a-upload> -->
                <a-button type="primary" @click="addEntry">
                    <a-icon type="plus" />
                    新增入职
                </a-button>
                <a-button type="primary" :disabled="exportDisabled" @click="exportData" style="margin:0 20px;">
                    <a-icon type="select" />
                    导出
                </a-button>
            </a-col>
        </a-row>

        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{margin:'0'}">
            <a-table 
                :columns="columns" 
                :dataSource="data" 
                :scroll="{ x: 1800}"
                :loading="tableLoading" 
                :pagination="pagination" 
                bordered 
                class="entryTable"
            >
                <!-- 序号 -->
                <template slot="index" slot-scope="text, record, index">
                    <span>{{index + 1}}</span>
                </template>

                <!-- 出生日期 -->
                <template slot="birthDate" slot-scope="text, record">
                    <span>{{text}}</span>
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
                        title="确定要删除该条入职记录吗？"
                        @confirm="() => deleteData(record)">
                        <a href="javascript:;">删除</a>
                    </a-popconfirm>
                    <a-divider type="vertical"/>
                    <span>
                        <a @click="() => leave(record)">离职</a>
                    </span>
                </template>
            </a-table>
        </a-row>
        
        <EntryEdit ref="entryEdit" @comfirmAdd="comfirmAdd" :departmentList="departmentList" :positionList="positionList" :nationalityList="nationalityList"></EntryEdit>

        <LeaveEdit ref="leaveEdit" @comfirmAdd="comfirmAdd"></LeaveEdit>

        <!-- 导入时错误信息提示 -->
        <a-modal title="导入结果" v-model="errorVisible" @ok="handleOk" class="errorModal">
            <p v-for="(item,index) in importDatas" :key="index">{{(index+1) + '、' + item}}</p>
        </a-modal>
    </div>
</template>

<script>
    import {Table, Row, Alert, Button, Upload, Divider, Input, Select, Spin, Col, message, DatePicker, Popconfirm, Tooltip, Icon, Modal} from 'ant-design-vue'
    import moment from 'moment'
    import 'moment/locale/zh-cn'
    import debounce from 'lodash/debounce'
    import Search from './Search/index'
    import EntryEdit from './../Edit/EntryEdit'
    import LeaveEdit from './../Edit/LeaveEdit'
    import TableUtil from '../../../../utils/TableUtil'
    import http from '../../../../utils/http'

    const dataUrl = {
        getPagerList: '/api/staff-entry/getPagerList',
        getDepartmentTree: '/api/system-department/getTree',
        getPositionAll: '/api/position/getAllList',
        getNationalityList: '/api/static-nationality/getAllList',
        deleteEntryById: '/api/staff-entry/delete',
        exportData: '/api/staff-entry/exportData2',
        importData: '/api/staff-entry/import',
        downloadTemplate: '/api/staff-entry/downloadImportTemplate'
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
            title: '部门',
            width: 130,
            dataIndex: 'department.name',
            align: 'center'
        }, 
        {
            title: '职位',
            width: 130,
            dataIndex: 'position.name',
            align: 'center'
        },
        {
            title: '性别',
            width: 100,
            dataIndex: 'staffPersonal.sex',
            align: 'center'
        }, 
        {
            title: '民族',
            width: 100,
            dataIndex: 'staffPersonal.nationality',
            align: 'center'
        }, 
        {
            title: '婚姻状况',
            width: 130,
            dataIndex: 'staffPersonal.marryStatus',
            align: 'center'
        },
        {
            title: '最高学历',
            width: 110,
            dataIndex: 'staffPersonal.education',
            align: 'center'
        },
        {
            title: '身份证号',
            width: 120,
            dataIndex: 'staffPersonal.idNumber',
            align: 'center'
        },
        {
            title: '身份证地址',
            width: 150,
            dataIndex: 'staffPersonal.idNumberAddress',
            align: 'center'
        },
        {
            title: '出生日期',
            width: 120,
            dataIndex: 'staffPersonal.birthDate',
            align: 'center',
            scopedSlots: {customRender: 'birthDate'}
        },  
        {
            title: '联系方式',
            width: 130,
            dataIndex: 'staffPersonal.phone',
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
            width: 200,
            fixed: 'right',
            dataIndex: 'action',
            align: 'center',
            scopedSlots: {customRender: 'edit'}
        }
    ]

    const dataMapping = {
        'staffPersonal.username': 'Object',
        'department.name': 'Object',
        'position.name': 'Object',
        'staffPersonal.sex': 'ObjectEnum',
        'staffPersonal.nationality': 'Object',
        'staffPersonal.marryStatus': 'ObjectEnum',
        'staffPersonal.education': 'ObjectEnum',
        'staffPersonal.idNumber': 'Object',
        'staffPersonal.idNumberAddress': 'Object',
        'staffPersonal.birthDate': 'Object',
        'staffPersonal.phone': 'Object',
        'remarks': 'String'
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
            ATooltip: Tooltip,
            AIcon: Icon,
            AModal: Modal,
            Search,
            EntryEdit,
            LeaveEdit
        },
        name: 'EntryList',
        data() {
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
                companyList: null,
                positionList: null,
                unitData: [],
                unitFetching: false,
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
                errorVisible: false,
                importDatas: [],
                acceptFiles: '.xls,.xlsx',
                type: null,
                exportDisabled: false,
                departmentList: [],
                nationalityList: []
            }
        },
        mounted(){
            this.loaderDepartmentTree();
            this.getPositionAll();
            this.getNationalityList();
            this.loader();
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
            //获取民族列表
            getNationalityList(params) {
                http.post(dataUrl.getNationalityList, {
                    name: ''
                }).then(res => {
                    if (res.state) {
                        this.nationalityList = res.data;
                        this.editData = res.data;
                    }
                })
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
                    birthDateStart: this.searchValue.birthDateStart ? this.searchValue.birthDateStart : null,
                    birthDateEnd: this.searchValue.birthDateEnd ? this.searchValue.birthDateEnd : null,
                    sex: this.searchValue.sex ? this.searchValue.sex : null,
                    nationality: this.searchValue.nationality ? this.searchValue.nationality : null,
                    education: this.searchValue.education ? this.searchValue.education : null,
                    departmentId: (this.searchValue && this.searchValue.departmentId) ? parseInt(this.searchValue.departmentId.slice(-1).toString()) : null,
                    positionId: this.searchValue.positionId ? this.searchValue.positionId : null,
                    marryStatus: this.searchValue.marryStatus ? this.searchValue.marryStatus : null,
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
            hovre(record) {
                console.log("==record==",record);
            },
            //搜索
            searchItems(values) {
                this.searchValue = values;
                this.pagination.defaultCurrent = 1;
                this.pagination.current= 1;
                this.loader();
            },
            //添加数据
            addEntry() {
                this.$refs.entryEdit.openModal();
            },
            //离职
            leave(record) {
                this.$refs.leaveEdit.openModal(record);
            },
            comfirmAdd() {
                this.pagination.defaultCurrent = 1;
                this.pagination.current= 1;
                this.pagination.defaultPageSize = this.currentSize;
                this.pagination.pageSize = this.currentSize;
                this.loader();
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
            importData(info) {
                if(info.file.status !== 'uploading') {
                    this.importDatas = [];
                    this.errorVisible = false;
                    const formData = new FormData();
                    formData.append('file', info.file.originFileObj);
                    http.postFile(dataUrl.importData, formData).then(res => {
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
                    })
                    return false
                }
            },
            handleOk(e) {
                console.log(e);
                this.errorVisible = false;
                this.loader();
            },
            //导出
            exportData() {
                this.exportDisabled = true;
                let paramsItem = {
                    username: this.searchValue.username ? this.searchValue.username : null,
                    idNumber: this.searchValue.idNumber ? this.searchValue.idNumber : null,
                    phone: this.searchValue.phone ? this.searchValue.phone : null,
                    birthDateStart: this.searchValue.birthDateStart ? this.searchValue.birthDateStart : null,
                    birthDateEnd: this.searchValue.birthDateEnd ? this.searchValue.birthDateEnd : null,
                    sex: this.searchValue.sex ? this.searchValue.sex : null,
                    nationality: this.searchValue.nationality ? this.searchValue.nationality : null,
                    education: this.searchValue.education ? this.searchValue.education : null,
                    departmentId: (this.searchValue && this.searchValue.departmentId) ? parseInt(this.searchValue.departmentId.slice(-1).toString()) : null,
                    positionId: this.searchValue.positionId ? this.searchValue.positionId : null,
                    marryStatus: this.searchValue.marryStatus ? this.searchValue.marryStatus : null,
                };
                for ( var key in paramsItem ){
                    if ( paramsItem[key] === null ){
                        delete paramsItem[key]
                    }
                }
                http.getFile(dataUrl.exportData, paramsItem).then(res => {
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
            //查看
            view(record,type) {
                this.$refs.entryEdit.openModal(record,type);
            },
            //编辑
            edit(record) {
                // this.editData = record;
                this.$refs.entryEdit.openModal(record);
            },
            //删除
            deleteData(record) {
                if (record) {
                    http.post(dataUrl.deleteEntryById, {
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
</style>