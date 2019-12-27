<template>
    <div>
        <Search></Search>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{padding:'30px 30px 10px 30px'}">
            <a-button type="primary" @click="handleAdd">
                <a-icon type="plus"/>
                新增出库
            </a-button>
            <a-button type="primary" style="margin-left: 20px;" :disabled="exportDisabled" @click="exportExcel">
                <a-icon type="select" />
                导出Excel
            </a-button>
        </a-row>

        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{padding:'0 30px'}">
            <a-table :columns="columns" :dataSource="data" :loading="tableLoading" :pagination="pagination" bordered
                     :scroll="{ x: 1570}">
                <!-- 序号 -->
                <template slot="index" slot-scope="text, record, index">
                    <span>{{index + 1}}</span>
                </template>
            </a-table>
        </a-row>
    </div>
</template>

<script>
    import {Table, Row, Alert, Button, Upload, Divider, Input, Select, Spin, Col, message, Icon} from 'ant-design-vue'
    import moment from 'moment'
    import 'moment/locale/zh-cn'
    import http from '@/utils/http'
    import TableUtil from '@/utils/TableUtil'
    import Search from './Search/index'

    const dataUrl = {
        getPagerList: '/api/gm-inventory-out/getPagerList', // 获取出库信息 - 分页
        exportExcel: '/api/gm-inventory-out/exportData2' // 导出excel表
    };

    const columns = [
        {
            title: '序号',
            width: 65,
            dataIndex: 'index',
            align: 'center',
            scopedSlots: {customRender: 'index'},
            fixed: 'left',
        },
        {
            title: '材料名称',
            dataIndex: 'material.name',
            align: 'center',
            width: 150
        }, {
            title: '型号',
            dataIndex: 'material.modelNumber',
            align: 'center',
            width: 150
        }, {
            title: '生产厂家',
            dataIndex: 'material.producer',
            align: 'center',
            width: 150
        }, {
            title: '材料类别',
            dataIndex: 'material.materialCategory.name',
            align: 'center',
            width: 150
        }, {
            title: '库存总数',
            dataIndex: 'amount',
            align: 'center',
            width: 120
        }, {
            title: '出库数量',
            dataIndex: 'outNumber',
            align: 'center',
            width: 120
        }, {
            title: '出库仓库',
            dataIndex: 'storehouse.name',
            align: 'center',
            width: 150
        }, {
            title: '出库后总数',
            dataIndex: 'afterAmount',
            align: 'center',
            width: 120
        }, {
            title: '出库时间',
            dataIndex: 'outDate',
            align: 'center',
            width: 120
        }, {
            title: '领用班组',
            dataIndex: 'usedTeam',
            align: 'center',
            width: 120,
            scopedSlots: {customRender: 'usedTeam'},
        }, {
            title: '备注',
            dataIndex: 'remarks',
            align: 'center',
            width: 150,
            scopedSlots: {customRender: 'remarks'},
        }
    ];

    const dataMapping = {
        'id': 'Number',
        'material.name': 'Object',
        'material.modelNumber': 'Object',
        'material.materialCategory.name': 'Object',
        'material.producer': 'Object',
        'amount': 'Number',
        'outNumber': 'Number',
        'storehouse.name': 'Object',
        'afterAmount': 'Number',
        'outDate': 'String',
        'usedTeam': 'String',
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
            AIcon: Icon,
            Search
        },
        name: 'OutStorageList',
        data() {
            return {
                dateTime: moment(new Date(), 'YYYY-MM'),
                visible: false,
                loading: false,
                tableLoading: false,
                title: '配置',
                subsystem: {},
                messageQueue: {},
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
                data: [],
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
                exportDisabled: false
            }
        },
        mounted() {
            this.loader()
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
            // 事件 - 添加数据
            handleAdd() {
                this.$router.push({name: 'outStorageAdd'})
            },
            //加载数据
            loader(params) {
                this.tableLoading = true;
                http.post(dataUrl.getPagerList, params ? params : {
                    name: this.searchValue.name ? this.searchValue.name : null,
                    modelNumber: this.searchValue.modelNumber ? this.searchValue.modelNumber : null,
                    producer: this.searchValue.producer ? this.searchValue.producer : null,
                    materialCategoryId: (this.searchValue && this.searchValue.materialCategoryId) ? parseInt(this.searchValue.materialCategoryId.slice(-1).toString()) : null,
                    storehouseId: this.searchValue.storehouseId ? this.searchValue.storehouseId : null,
                    outDateStart: this.searchValue.outDate && this.searchValue.outDate[0] instanceof moment ? this.searchValue.outDate[0].format('YYYY-MM-DD') : null,
                    outDateEnd: this.searchValue.outDate && this.searchValue.outDate[1] instanceof moment ? this.searchValue.outDate[1].format('YYYY-MM-DD') : null,
                    usedTeam: this.searchValue.usedTeam ? this.searchValue.usedTeam : null,
                    page: this.pagination.current,
                    size: this.currentSize
                }).then(res => {
                    if (res.state) {
                        this.data = TableUtil.formatData(res.data.content, dataMapping);
                        this.pagination.total = res.data.totalElements;
                        this.tableLoading = false
                    } else {
                        message.warning(res.message)
                    }
                })
            },
            //搜索
            search(values) {
                this.searchValue = values;
                this.pagination.defaultCurrent = 1;
                this.pagination.current = 1;
                this.loader()
            },
            // 请求 - 导出excel表
            exportExcel() {
                this.exportDisabled = true;
                let paramsItem = {
                    name: this.searchValue.name ? this.searchValue.name : null,
                    materialCategoryId: (this.searchValue && this.searchValue.materialCategoryId) ? parseInt(this.searchValue.materialCategoryId.slice(-1).toString()) : null,
                    modelNumber: this.searchValue.modelNumber ? this.searchValue.modelNumber : null,
                    producer: this.searchValue.producer ? this.searchValue.producer : null,
                    outDateStart: this.searchValue.outDate && this.searchValue.outDate[0] instanceof moment ? this.searchValue.outDate[0].format('YYYY-MM-DD') : null,
                    outDateEnd: this.searchValue.outDate && this.searchValue.outDate[1] instanceof moment ? this.searchValue.outDate[1].format('YYYY-MM-DD') : null,
                    usedTeam: this.searchValue.usedTeam ? this.searchValue.usedTeam : null
                };
                for (var key in paramsItem) {
                    if (!paramsItem[key]) {
                        delete paramsItem[key]
                    }
                }
                http.getFile(dataUrl.exportExcel, paramsItem).then(res => {
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
            }
        }
    }
</script>

<style scoped>

</style>
