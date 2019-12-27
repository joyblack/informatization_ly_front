<template>
    <div class="leavePage">
        <Search @searchItems="searchItems"></Search>

        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{margin:'30px 0 20px'}">
            <a-col :style="{padding:'0'}">
                <a-button type="primary" @click="addInfo">
                    <a-icon type="plus" />
                    新增基本信息
                </a-button>
            </a-col>
        </a-row>

        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{margin:'0'}">
            <a-table 
                :columns="columns" 
                :dataSource="data" 
                :loading="tableLoading" 
                :pagination="pagination" 
                bordered 
            >
                <!--操作-->
                <template slot="edit" slot-scope="text, record">
                        <a-divider type="vertical"/>
                        <span>
                            <a @click="() => edit(record)">编辑</a>
                        </span>
                    <a-divider type="vertical"/>
                    <a-popconfirm
                        v-if="data.length"
                        title="确定要删除该条信息记录吗？"
                        @confirm="() => deleteData(record)">
                        <a href="javascript:;">删除</a>
                    </a-popconfirm>
                </template>
            </a-table>
        </a-row>
        <BasicInfoEdit ref="basicInfoEdit" @comfirmAdd="comfirmAdd"></BasicInfoEdit>
    </div>
</template>

<script>
    import {Table, Row, Alert, Button, Upload, Divider, Input, Select, Spin, Col, message, DatePicker, Popconfirm, Icon} from 'ant-design-vue'
    import moment from 'moment'
    import 'moment/locale/zh-cn'
    import debounce from 'lodash/debounce'
    import Search from './Search/index'
    import BasicInfoEdit from './../Edit/BasicInfoEdit'
    import TableUtil from '../../../../utils/TableUtil'
    import http from '../../../../utils/http'

    const dataUrl = {
        getPagerList: '/api/document-info/getPagerList',
        deleteBorrowById: '/api/document-info/delete'
    }

    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            align: 'center'
        },
        {
            title: '类型',
            dataIndex: 'type',
            align: 'center'
        },
        {
            title: '描述',
            dataIndex: 'illustration',
            align: 'center'
        },
        {
            title: '创建日期',
            dataIndex: 'createTime',
            align: 'center'
        },
        {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            width: 160,
            scopedSlots: {customRender: 'edit'}
        }
    ]

    const dataMapping = {
        'name': 'String',
        'type': 'String',
        'illustration': 'String',
        'createTime': 'Date'
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
            BasicInfoEdit
        },
        name: 'BasicInfoList',
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
        },
        methods: {
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
                    name: this.searchValue.name ? this.searchValue.name : null,
                    type: this.searchValue.type ? this.searchValue.type : null,
                    createTimeStart: this.searchValue.createTimeStart ? this.searchValue.createTimeStart : null,
                    createTimeEnd: this.searchValue.createTimeEnd ? this.searchValue.createTimeEnd : null,
                    page: this.pagination.current,
                    size: this.currentSize
                }).then(res => {
                    if (res.state) {
                        this.data = TableUtil.formatData(res.data.content, dataMapping)
                        this.pagination.total = res.data.totalElements
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
                this.pagination.current= 1;
                this.loader();
            },
            //添加数据
            addInfo() {
                this.$refs.basicInfoEdit.openModal();
            },
            comfirmAdd() {
                this.pagination.defaultCurrent = 1;
                this.pagination.current= 1;
                this.pagination.defaultPageSize = this.currentSize;
                this.pagination.pageSize = this.currentSize;
                this.loader();
            },
            //编辑
            edit(record) {
                this.$refs.basicInfoEdit.openModal(record);
            },
            //删除
            deleteData(record) {
                if (record) {
                    http.post(dataUrl.deleteBorrowById, {
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