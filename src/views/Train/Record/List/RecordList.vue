<template>
    <div class="trainPage">
        <Search :departmentList="departmentList" @searchItems="searchItems"></Search>

        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{margin:'20px 0'}">
            <a-col :style="{padding:'0'}">
                <a-button type="primary" @click="addTrain">
                    <a-icon type="plus" />
                    新增培训
                </a-button>
            </a-col>
        </a-row>

        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{margin:'0'}">
            <a-table :columns="columns" :dataSource="data" :loading="tableLoading" :pagination="pagination" bordered>
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
                        title="确定要删除该条培训记录吗？"
                        @confirm="() => deleteData(record)">
                        <a href="javascript:;">删除</a>
                    </a-popconfirm>
                </template>
            </a-table>
        </a-row>

        <TrainEdit ref="trainEdit" :departmentList="departmentList" @comfirmAdd="comfirmAdd"></TrainEdit>
    </div>
</template>

<script>
    import {Table, Row, Alert, Button, Upload, Divider, Input, Select, Spin, Col, message, DatePicker, Popconfirm, Icon} from 'ant-design-vue'
    import moment from 'moment'
    import 'moment/locale/zh-cn'
    import debounce from 'lodash/debounce'
    import Search from './Search/index'
    import TrainEdit from './../Edit/TrainEdit'
    import TableUtil from '../../../../utils/TableUtil'
    import http from '../../../../utils/http'

    const dataUrl = {
        getPagerList: '/api/training-info/getPagerList',
        getDepartmentTree: '/api/system-department/getTree',
        deleteTrainById: '/api/training-info/delete'
    }

    const columns = [
        {
            title: '培训日期',
            width: 130,
            dataIndex: 'trainingTime',
            align: 'center'
        },
        {
            title: '培训名称',
            dataIndex: 'trainingName',
            align: 'center'
        },
        {
            title: '培训人',
            dataIndex: 'trainingUsername',
            align: 'center'
        },
        {
            title: '受训部门',
            dataIndex: 'department.name',
            align: 'center'
        }, 
        {
            title: '培训内容',
            dataIndex: 'trainingContent',
            align: 'center'
        },
        {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            width: 160,
            scopedSlots: {customRender: 'edit'},
        }
    ]

    const dataMapping = {
        'trainingTime': 'Date',
        'trainingName': 'String',
        'trainingUsername': 'String',
        'department.name': 'Object',
        'trainingContent': 'String'
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
            TrainEdit
        },
        name: 'RecordList',
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
                }
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
            //加载数据
            loader(params) {
                this.tableLoading = true
                http.post(dataUrl.getPagerList, params ? params : {
                    trainingTimeStart: this.searchValue.trainingTimeStart ? this.searchValue.trainingTimeStart : null,
                    trainingTimeEnd: this.searchValue.trainingTimeEnd ? this.searchValue.trainingTimeEnd : null,
                    trainingUsername: this.searchValue.trainingUsername ? this.searchValue.trainingUsername : null,
                    trainingName: this.searchValue.trainingName ? this.searchValue.trainingName : null,
                    departmentId: (this.searchValue && this.searchValue.departmentId) ? parseInt(this.searchValue.departmentId.slice(-1).toString()) : null,
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
            addTrain() {
                this.$refs.trainEdit.openModal();
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
                this.$refs.trainEdit.openModal(record,type);
            },
            //编辑
            edit(record) {
                this.$refs.trainEdit.openModal(record);
            },
            //删除
            deleteData(record) {
                if (record) {
                    http.post(dataUrl.deleteTrainById, {
                        ids: [record.id]
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