<template>
    <div class="positionPage">
        <Search @searchName="searchName"></Search>

        <!-- <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{margin:'45px 0'}">
            <a-alert :message="'总计:'+pagination.total+'条'" type="info" showIcon></a-alert>
        </a-row> -->

        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{margin:'30px 0 20px'}">
            <a-col :style="{padding:'0'}">
                <a-button type="primary" @click="addPositionManage">
                    <a-icon type="plus" />
                    新增职位
                </a-button>
            </a-col>
        </a-row>

        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{margin:'0'}">
            <a-table :columns="columns" :dataSource="data" :loading="tableLoading" :pagination="pagination" bordered>
                <!--操作-->
                <template slot="edit" slot-scope="text, record">
                    <span>
                        <a @click="() => edit(record)">编辑</a>
                    </span>
                    <a-divider type="vertical"/>
                    <a-popconfirm
                        v-if="data.length"
                        title="确定要删除该条职务记录吗？"
                        @confirm="() => deleteData(record)">
                        <a href="javascript:;">删除</a>
                    </a-popconfirm>
                    <!-- <a href="javascript:;" @click="deleteData(record)">删除</a> -->
                </template>
            </a-table>
        </a-row>

        <PositionManageEdit ref="positionManageEdit" @comfirmAdd="comfirmAdd"></PositionManageEdit>
    </div>
</template>

<script>
    import {Table, Row, Alert, Button, Upload, Divider, Input, Select, Spin, Col, message,DatePicker, Icon, Popconfirm} from 'ant-design-vue'
    import moment from 'moment'
    import 'moment/locale/zh-cn'
    import debounce from 'lodash/debounce'
    import Search from './Search/index'
    import PositionManageEdit from './../Edit/PositionManageEdit'
    import TableUtil from '../../../../utils/TableUtil'
    import http from '../../../../utils/http'

    const dataUrl = {
        getPagerList: '/api/position/getPagerList',
        getPositionDelete: '/api/position/delete',
    }

    const columns = [
        {
            title: '名称',
            dataIndex: 'name',
            align: 'center',
            width: 300
        },
        {
            title: '描述',
            dataIndex: 'describes',
            align: 'center'
        },
        {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            width: 150,
            scopedSlots: {customRender: 'edit'},
        }
    ]

    const dataMapping = {
        'name': 'String',
        'describes': 'String'
    }

    export default {
        name: "PositionManageList",
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
            APopconfirm: Popconfirm,
            ADatePicker:DatePicker,
            AIcon: Icon,
            Search,
            PositionManageEdit
        },
        data() {
            //防抖动处理
            // this.unitSearch = debounce(this.unitSearch, 500)
            return {
                dateTime:moment(new Date(),'YYYY-MM'),
                visible: false,
                loading: false,
                tableLoading: false,
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
            //添加数据
            addPositionManage() {
                this.$refs.positionManageEdit.openModal();
            },
            comfirmAdd() {
                this.pagination.defaultCurrent = 1;
                this.pagination.current= 1;
                this.pagination.defaultPageSize = this.currentSize;
                this.pagination.pageSize = this.currentSize;
                this.loader();
            },
            //加载数据
            loader(params) {
                this.tableLoading = true;
                http.post(dataUrl.getPagerList, params ? params : {
                    name: this.searchValue ? this.searchValue.name : null,
                    page: this.pagination.current,
                    size: this.currentSize
                }).then((res) => {
                    if (res.state) {
                        this.data = TableUtil.formatData(res.data.content, dataMapping);
                        this.pagination.total = res.data.totalElements;
                        this.tableLoading = false;
                    } else {
                        message.warning(res.message);
                    }
                })
            },
            //搜索
            searchName(values) {
                this.searchValue = values;
                this.pagination.defaultCurrent = 1;
                this.pagination.current= 1;
                this.loader();
            },
            //编辑
            edit(record) {
                this.$refs.positionManageEdit.openModal(record);
            },
            //删除
            deleteData(record) {
                if (record) {
                    http.post(dataUrl.getPositionDelete, {
                        id: record.id
                    }).then(res => {
                        if (res.state) {
                            message.success('操作执行成功!')
                            let currentData = [];
                            currentData = this.data;
                            if(currentData.length === 1 && this.pagination.current > 1) {
                                this.pagination.current = this.pagination.current - 1;  
                            }
                            this.loader();
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