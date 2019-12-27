<template>
    <div>
        <Search></Search>

        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{padding:'30px 30px 10px 30px'}">
            <a-button type="primary" @click="handleAdd">
                <a-icon type="plus" />
                新增入库
            </a-button>
            <a-button type="primary" style="margin: 0 20px;" @click="cancelLists">
                <a-icon type="file-search" />
                历史作废记录
            </a-button>
            <a-button type="primary" :disabled="exportDisabled" @click="exportExcel">
                <a-icon type="select" />
                导出Excel
            </a-button>
        </a-row>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{padding:'0 30px'}">
            <a-table :columns="columns" :dataSource="data" :loading="tableLoading" :pagination="pagination" bordered :scroll="{ x: 2000}">
                <!-- 序号 -->
                <template slot="index" slot-scope="text, record, index">
                    <span>{{index + 1}}</span>
                </template>

                <!--操作-->
                <template slot="edit" slot-scope="text, record">
                    <span>
                        <a @click="() => cancelData(record)">作废</a>
                    </span>
                </template>
            </a-table>
        </a-row>
        <CancelDatas ref="cancelDatas" @comfirmAdd="comfirmAdd"></CancelDatas>
        <a-modal title="提示信息" v-model="visible" @ok="handleOk">
            <p style="display:flex;align-items:center;justify-content:center;"><a-icon type="info-circle" style="margin-right: 5px;font-size:18px;color:#ff6600;" />该材料库存不足，不支持该材料信息作废！</p>
        </a-modal>
    </div>
</template>

<script>
    import {Table, Row, Alert, Button, Upload, Divider, Input, Spin, Col, message, Modal, Icon} from 'ant-design-vue'
    import moment from 'moment'
    import 'moment/locale/zh-cn'
    import debounce from 'lodash/debounce'
    import http from '@/utils/http'
    import TableUtil from '@/utils/TableUtil'
    import Search from '../Search/index'
    import CancelDatas from './../Edit/CancelDatas'

    const dataUrl = {
        getPagerList: '/api/gm-inventory-in/getPagerList', // 获取入库信息 - 分页
        exportExcel: '/api/gm-inventory-in/exportData2', // 导出excel表
        getCanCancel: '/api/gm-inventory-in-cancel/canCancel' // 判断是否可以作废
    }

    const columns = [
        {
            title: '序号',
            width: 65,
            dataIndex: 'index',
            align: 'center',
            scopedSlots: {customRender: 'index'},
            fixed: 'left'
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
            title: '供货单位/供货人',
            dataIndex: 'supplier.name',
            align: 'center',
            width: 150
        }, {
            title: '生产厂家',
            dataIndex: 'material.producer',
            align: 'center',
            width: 150
        },{
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
            title: '入库数量',
            dataIndex: 'inNumber',
            align: 'center',
            width: 120
        }, {
            title: '入库仓库',
            dataIndex: 'storehouse.name',
            align: 'center',
            width: 150
        }, {
            title: '入库后总数',
            dataIndex: 'afterAmount',
            align: 'center',
            width: 120
        }, {
            title: '入库时间',
            dataIndex: 'inDate',
            align: 'center',
            width: 120
        },{
            title: '单价(元)',
            dataIndex: 'unitPrice',
            align: 'center',
            width: 120
        },{
            title: '总价(元)',
            dataIndex: 'totalPrice',
            align: 'center',
            width: 150
        }, {
            title: '签收人',
            dataIndex: 'signPeople',
            align: 'center',
            width: 120
        }, {
            title: '备注',
            dataIndex: 'remarks',
            align: 'center',
            width: 150
        },
        {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            width: 80,
            fixed: 'right',
            scopedSlots: {customRender: 'edit'}
        }
    ];

    const dataMapping = {
        'id': 'Number',
        'material.name': 'Object',
        'material.modelNumber': 'Object',
        'material.materialCategory.name': 'Object',
        'supplier.name': 'Object',
        'material.producer': 'Object',
        'unitPrice': 'Number',
        'amount': 'Number',
        'inNumber': 'Number',
        'storehouse.name': 'Object',
        'afterAmount': 'Number',
        'inDate': 'String',
        'totalPrice': 'Number',
        'signPeople': 'String',
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
            AInputSearch: Input,
            ASpin: Spin,
            AModal:Modal,
            CancelDatas,
            AIcon: Icon,
            Search
        },
        name: 'IntoStorageList',
        data() {
            return {
                dateTime:moment(new Date(),'YYYY-MM'),
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
                    showTotal:this.showTotal,
                    onChange: this.paginationChange,
                    onShowSizeChange: this.paginationSizeChange
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
                // 材料名搜索匹配数据源
                nameDataSource: [],
                exportDisabled: false
            }
        },
        mounted(){
            this.loader()
        },
        methods: {
            showTotal(total) {
                return `总计: ${total} 条`
            },
            // 请求 - 分页改变
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
            // 请求 - 分页条数改变(current当前页码，size分页数量)
            paginationSizeChange(current, size) {
                if (current && size) {
                    this.pagination.current = current;
                    this.currentSize = size;
                    this.pagination.defaultPageSize = this.currentSize;
                    this.pagination.pageSize = this.currentSize;
                    this.loader()
                }
            },
            // 请求 - 获取分页数据
            loader (params) {
                this.tableLoading = true
                http.post(dataUrl.getPagerList, params ? params : {
                    name: this.searchValue.name ? this.searchValue.name : null,
                    materialCategoryId: (this.searchValue && this.searchValue.materialCategoryId) ? parseInt(this.searchValue.materialCategoryId.slice(-1).toString()) : null,
                    modelNumber: this.searchValue.modelNumber ? this.searchValue.modelNumber : null,
                    storehouseId: this.searchValue.storehouseId ? this.searchValue.storehouseId : null,
                    supplier: this.searchValue.supplier ? this.searchValue.supplier : null,
                    producer: this.searchValue.producer ? this.searchValue.producer : null,
                    inDateStart: this.searchValue.inDate && this.searchValue.inDate[0] instanceof moment ? this.searchValue.inDate[0].format('YYYY-MM-DD') : null,
                    inDateEnd: this.searchValue.inDate && this.searchValue.inDate[1] instanceof moment ? this.searchValue.inDate[1].format('YYYY-MM-DD') : null,
                    signPeople: this.searchValue.signPeople ? this.searchValue.signPeople : null,
                    unitPriceStart: this.searchValue.unitPriceStart ? this.searchValue.unitPriceStart : null,
                    unitPriceEnd: this.searchValue.unitPriceEnd ? this.searchValue.unitPriceEnd : null,
                    page: this.pagination.current,
                    size: this.currentSize
                }).then(res => {
                    console.log(res)
                    if (res.state) {
                        this.data = TableUtil.formatData(res.data.content, dataMapping)
                        this.pagination.total = res.data.totalElements
                        this.tableLoading = false
                    } else {
                        message.warning(res.message)
                    }
                })
            },
            cancelData(record) {
                http.get(dataUrl.getCanCancel+'/'+record.id).then(res => {
                    if (res.state) {
                        if(res.data === true) {
                            this.$refs.cancelDatas.openModal(record.id)
                        } else {
                            this.visible = true;
                        }
                    }
                })
            },
            comfirmAdd() {
                this.loader()
            },
            //搜索
            search(values){
                this.searchValue = values
                this.pagination.defaultCurrent = 1;
                this.pagination.current= 1;
                this.loader()
            },
            // 事件 - 添加数据
            handleAdd () {
                this.$router.push({ name: 'intoStorageAdd' })
            },
            //作废记录
            cancelLists() {
                this.$router.push({ name: 'cancelDataList' })
            },
            // 请求 - 导出excel表
            exportExcel () {
                this.exportDisabled = true;
                let paramsItem = {
                    name: this.searchValue.name ? this.searchValue.name : null,
                    materialCategoryId: (this.searchValue && this.searchValue.materialCategoryId) ? parseInt(this.searchValue.materialCategoryId.slice(-1).toString()) : null,
                    modelNumber: this.searchValue.modelNumber ? this.searchValue.modelNumber : null,
                    storehouseId: this.searchValue.storehouseId ? this.searchValue.storehouseId : null,
                    supplier: this.searchValue.supplier ? this.searchValue.supplier : null,
                    producer: this.searchValue.producer ? this.searchValue.producer : null,
                    inDateStart: this.searchValue.inDate && this.searchValue.inDate[0] instanceof moment ? this.searchValue.inDate[0].format('YYYY-MM-DD') : null,
                    inDateEnd: this.searchValue.inDate && this.searchValue.inDate[1] instanceof moment ? this.searchValue.inDate[1].format('YYYY-MM-DD') : null,
                    signPeople: this.searchValue.signPeople ? this.searchValue.signPeople : null,
                    unitPriceStart: this.searchValue.unitPriceStart ? this.searchValue.unitPriceStart : null,
                    unitPriceEnd: this.searchValue.unitPriceEnd ? this.searchValue.unitPriceEnd : null,
                }
                for ( var key in paramsItem ){
                    if ( !paramsItem[key] ){
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
            },
            //取消
            handleCancel() {
                this.visible = false
            },
            afterClose() {
                this.visible = false
            },
            handleOk() {
                this.visible = false;
            }
        }
    }
</script>

<style scoped>

</style>
