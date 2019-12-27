<template>
    <div class="leavePage">
        <Search :departmentList="departmentList" @searchItems="searchItems"></Search>

        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{margin:'30px 0 20px'}">
            <a-col :style="{padding:'0'}">
                <!-- <a-button type="primary"  @click="downloadTemplate">
                    <a-icon type="download" />
                    下载导入模板
                </a-button>
                <a-button type="primary" style="margin:0 20px;"  @click="importData">
                    <a-icon type="export" />
                    导入
                </a-button> -->
                <a-button type="primary" @click="breakRulesAdd">
                    <a-icon type="plus" />
                    新增违章
                </a-button>
                <!-- <a-button type="primary" :disabled="exportDisabled" @click="exportData" style="margin:0 20px;">
                    <a-icon type="select" />
                    导出
                </a-button> -->
            </a-col>
        </a-row>

        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{margin:'0'}">
            <a-table :columns="columns" :dataSource="data" :loading="tableLoading" :pagination="pagination" bordered :scroll="{ x: 1320}">
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
                        title="确定要删除该条违章记录吗？"
                        @confirm="() => deleteData(record)">
                        <a href="javascript:;">删除</a>
                    </a-popconfirm>
                </template>
            </a-table>
        </a-row>
        <BreakRulesEdit ref="breakRulesEdit" @comfirmAdd="comfirmAdd" :departmentList="departmentList"></BreakRulesEdit>
    </div>
</template>

<script>
    import {Table, Row, Alert, Button, Upload, Divider, Input, Select, Spin, Col, message, DatePicker, Popconfirm, Icon} from 'ant-design-vue'
    import moment from 'moment'
    import 'moment/locale/zh-cn'
    import debounce from 'lodash/debounce'
    import Search from './Search/index'
    import BreakRulesEdit from './../Edit/BreakRulesEdit'
    import TableUtil from '../../../../utils/TableUtil'
    import http from '../../../../utils/http'

    const dataUrl = {
        getPagerList: '/api/safe-three-violation/getPagerList',
        getDepartmentTree: '/api/system-department/getTree',
        deleteBreakRulesById: '/api/safe-three-violation/delete',
        exportData: '/api/safe-three-violatio/exportData2'
    }

    const columns = [
        {
            title: '违章部门',
            width: 130,
            dataIndex: 'violationDepartment.name',
            align: 'center'
        },
        {
            title: '违章日期',
            width: 130,
            dataIndex: 'violationTime',
            align: 'center'
        },
        {
            title: '违章人',
            width: 130,
            dataIndex: 'violationPeople',
            align: 'center'
        },
        {
            title: '违章地点',
            width: 130,
            dataIndex: 'violationPlace',
            align: 'center'
        },
        {
            title: '班次',
            width: 130,
            dataIndex: 'dailyShift',
            align: 'center'
        },
        {
            title: '检查人',
            width: 130,
            dataIndex: 'checkPeople',
            align: 'center'
        },
        {
            title: '违章类型',
            width: 130,
            dataIndex: 'threeViolationType',
            align: 'center'
        },  
        {
            title: '违章详情',
            // width: 130,
            dataIndex: 'violationContent',
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
    ]

    const dataMapping = {
        'violationDepartment.name': 'Object',
        'violationTime': 'Date',
        'violationPeople': 'String',
        'violationPlace': 'String',
        'dailyShift': 'Enum',
        'checkPeople': 'String',
        'threeViolationType': 'Enum',
        'violationContent': 'String'
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
            Search,
            BreakRulesEdit
        },
        name: 'BreakRulesList',
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
                exportDisabled: false
            }
        },
        mounted(){
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
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    let paramsItem = {
                        violationTimeStart: this.searchValue.violationTimeStart ? this.searchValue.violationTimeStart : null,
                        violationTimeEnd: this.searchValue.violationTimeEnd ? this.searchValue.violationTimeEnd : null,
                        violationDepartmentId: (this.searchValue && this.searchValue.violationDepartmentId) ? parseInt(this.searchValue.violationDepartmentId.slice(-1).toString()) : null,
                        violationPeople: this.searchValue.violationPeople ? this.searchValue.violationPeople : null,
                        violationPlace: this.searchValue.violationPlace ? this.searchValue.violationPlace : null,
                        dailyShift: this.searchValue.dailyShift ? this.searchValue.dailyShift : null,
                        checkPeople: this.searchValue.checkPeople ? this.searchValue.checkPeople : null,
                        threeViolationType: this.searchValue.threeViolationType ? this.searchValue.threeViolationType : null
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
                    this.exportDisabled = false
                }, 2000);
            },

            //加载数据
            loader(params) {
                this.tableLoading = true
                http.post(dataUrl.getPagerList, params ? params : {
                    violationTimeStart: this.searchValue ? this.searchValue.violationTimeStart : null,
                    violationTimeEnd: this.searchValue ? this.searchValue.violationTimeEnd : null,
                    violationDepartmentId: (this.searchValue && this.searchValue.violationDepartmentId) ? parseInt(this.searchValue.violationDepartmentId.slice(-1).toString()) : null,
                    violationPeople: this.searchValue ? this.searchValue.violationPeople : null,
                    violationPlace: this.searchValue ? this.searchValue.violationPlace : null,
                    dailyShift: this.searchValue ? this.searchValue.dailyShift : null,
                    checkPeople: this.searchValue ? this.searchValue.checkPeople : null,
                    threeViolationType: this.searchValue ? this.searchValue.threeViolationType : null,
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
            //获取公司列表
            getCompanyList(params) {
                http.post(dataUrl.getCompanyList, params ? params : {
                }).then(res => {
                    if (res.state) {
                        this.companyList = res.data;
                    }
                })
            },
            //搜索
            searchItems(values) {
                this.searchValue = values;
                this.pagination.defaultCurrent = 1;
                this.pagination.current= 1;
                this.loader();
            },
            //添加数据
            breakRulesAdd() {
                this.$refs.breakRulesEdit.openModal();
            },
            comfirmAdd() {
                this.pagination.defaultCurrent = 1;
                this.pagination.current= 1;
                this.pagination.defaultPageSize = this.currentSize;
                this.pagination.pageSize = this.currentSize;
                this.loader();
            },
            //查看
            view(record,type) {
                this.$refs.breakRulesEdit.openModal(record,type);
            },
            //编辑
            edit(record) {
                this.$refs.breakRulesEdit.openModal(record);
            },
            //删除
            deleteData(record) {
                if (record) {
                    http.post(dataUrl.deleteBreakRulesById, {
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