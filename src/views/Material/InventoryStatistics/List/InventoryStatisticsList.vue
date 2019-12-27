<template>
    <div>
        <InventoryStatisticsSearch :storeHouseList="storeHouseList"></InventoryStatisticsSearch>

        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{padding:'10px 30px 10px 30px'}">
            <a-button type="primary" @click="dataList(null)">
                <a-icon type="retweet" />
                全部
            </a-button>
            <a-button type="primary" @click="dataList(true)" style="margin: 0 20px;">
                <a-icon type="info-circle" />
                库存下限报警（{{warningCount}}）
            </a-button>
            <a-button type="primary" :disabled="exportDisabled" @click="exportExcel">
                <a-icon type="select" />
                导出Excel
            </a-button>
        </a-row>

        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{padding:'0 30px 10px 30px'}">
            <a-table :columns="columns" :dataSource="data" :loading="tableLoading" :pagination="pagination" bordered>
                <template slot="title" slot-scope="text, record">
                    <h3 style="display:flex;align-items:center;justify-content:center;margin-bottom:0;color:#333;">{{(warningStatus == true || warningStatus == 'true') ? '库存下限报警列表' : '库存全部列表'}}</h3>
                </template>
                <!-- 序号 -->
                <template slot="index" slot-scope="text, record, index">
                    <span>{{index + 1}}</span>
                </template>

                <template slot="storehouses" slot-scope="text, record">
                    <p style="word-break: break-word;">{{record.storehouses | getStoreHousesString}}</p>
                </template>

                <template slot="warningAmount" slot-scope="text, record">
                    <a-editable-cell :text="text | getWarningAmountValue" @change="(val) => { edit(record, val, 'warningAmount') }"/>
                </template> 

                <template slot="material.remarks" slot-scope="text, record">
                    <a-editable-cell :text="text | getWarningAmountValue" @change="(val) => { edit(record, val, 'remarks') }"/>
                </template>

                <!--操作-->
                <template slot="edit" slot-scope="text, record">
                    <span>
                        <a @click="() => outStorage(record)">出库</a>
                    </span>
                </template>               
            </a-table>
        </a-row>
        <OutStorageAdd ref="outStorageAdd" :storeHouseList="storeHouseList" @comfirmAdd="comfirmAdd"></OutStorageAdd>

        <a-modal title="提示信息" v-model="visible" @ok="handleOk">
            <p style="display:flex;align-items:center;justify-content:center;"><a-icon type="info-circle" style="margin-right: 5px;font-size:18px;color:#ff6600;" />该材料库存不足，不支持出库！</p>
        </a-modal>
    </div>
</template>

<script>
    import InventoryStatisticsSearch from './Search/index'
    import EditableCell from './EditableCell/index'
    import OutStorageAdd from './../Edit/OutStorageAdd'
    import {Row, Col, Table, Input, Popconfirm, Alert, Icon, Button, Modal} from 'ant-design-vue'
    import http from '@/utils/http'
    import TableUtil from '../../../../utils/TableUtil'
    const dataUrl = {
        getPagerList: '/api/gm-inventory/getPagerList', // 获取库存信息 - 分页
        updateInfo: '/api/gm-inventory/update', // 更新库存统计信息,
        exportExcel: '/api/gm-inventory/exportData2', // 导出excel表
        getStorehouse: '/api/gm-storehouse/getAllList', // 获取仓库下拉列表
        getAllCount: '/api/gm-inventory/getAllCount' // 获取库存下限报警数量
    }

    const columns = [{
        title: '序号',
        dataIndex: 'index',
        align: 'center',
        width: 65,
        scopedSlots: {customRender: 'index'},
    }, {
        title: '材料名称',
        dataIndex: 'material.name',
        align: 'center'
    }, {
        title: '材料类别',
        dataIndex: 'material.materialCategory.name',
        align: 'center'
    }, {
        title: '型号',
        dataIndex: 'material.modelNumber',
        align: 'center'
    }, {
        title: '生产厂家',
        dataIndex: 'material.producer',
        align: 'center'
    },{
        title: '所在库房',
        dataIndex: 'storehouses',
        align: 'center',
        width: 140,
        scopedSlots: {customRender: 'storehouses'}
    }, {
        title: '库存总数',
        dataIndex: 'material.amount',
        align: 'center',
        width: 110
    }, {
        title: '下限报警值',
        dataIndex: 'material.warningAmount',
        align: 'center',
        width: 110,
        scopedSlots: {customRender: 'warningAmount'}
    }, {
        title: '备注',
        dataIndex: 'material.remarks',
        align: 'center',
        width: 120,
        scopedSlots: {customRender: 'material.remarks'}
    },
    {
        title: '操作',
        dataIndex: 'action',
        align: 'center',
        width: 80,
        scopedSlots: {customRender: 'edit'}
    }]

    const dataMapping = {
        'material.id': 'Object',
        'material.name': 'Object',
        'material.materialCategory.name': 'Object',
        'material.modelNumber': 'Object',
        'material.producer': 'Object',
        'material.amount': 'Object',
        'material.warningAmount': 'Object',
        'material': 'Object',
        'storehouses': 'Array',
        'material.remarks': 'Object'
    }

    export default {
        name: "InventoryStatisticsList",
        components: {
            OutStorageAdd,
            InventoryStatisticsSearch,
            ARow: Row,
            ACol: Col,
            ATable: Table,
            AInput: Input,
            APopconfirm: Popconfirm,
            AAlert: Alert,
            AIcon: Icon,
            AButton: Button,
            AModal:Modal,
            AEditableCell: EditableCell
        },
        data() {
            return {
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
                tableLoading: false,
                data: [],
                columns,
                searchValue:{},
                editOption: {
                    warningAmount: false,
                    remarks: false
                },
                visible: false,
                exportDisabled: false,
                storeHouseList: [],
                warningCount: null,
                warningStatus: this.$route.query.warningStatus ? this.$route.query.warningStatus : null
            }
        },
        mounted() {
            this.loader()
            this.getStorehouse()
            this.getAllCount()
            // this.$router.push({ query:{}})
        },
        filters: {
            getStoreHousesString (arr) {
                let temp = ''
                arr.map((item, index) => {
                    if (index === 0) {
                        temp = temp + `${item.storehouse.name}(${item.amount})`
                    } else {
                        temp = temp + `,${item.storehouse.name}(${item.amount})`
                    }
                })
                return temp
            },
            getWarningAmountValue (val) {
                return val ? val.toString() : ''
            }
        },
        methods: {
            loader(params){
                this.tableLoading = true
                this.data = []
                http.post(dataUrl.getPagerList,params ? params : {
                    name: this.searchValue.name ? this.searchValue.name : null,
                    modelNumber: this.searchValue.modelNumber ? this.searchValue.modelNumber : null,
                    storehouseId: this.searchValue.storehouseId ? this.searchValue.storehouseId : null,
                    materialCategoryId: (this.searchValue && this.searchValue.materialCategoryId) ? parseInt(this.searchValue.materialCategoryId.slice(-1).toString()) : null,
                    producer: this.searchValue.producer ? this.searchValue.producer : null,
                    warning: this.warningStatus,
                    page: this.pagination.current,
                    size: this.currentSize
                }).then(res=>{
                    if (res.state){
                        this.data = TableUtil.formatData(res.data.content, dataMapping)
                        this.pagination.total = res.data.totalElements
                        this.tableLoading = false
                    } else {
                        message.warning(res.message)
                    }
                })
            },
            // 仓库信息下拉列表 - 全部
            getStorehouse () {
                http.post(dataUrl.getStorehouse, {}).then(res=>{
                  if (res.state) {
                    this.storeHouseList = res.data
                  } else {
                    message.warning('获取仓库列表信息失败!')
                  }
                })        
            },
            // 下限报警值
            getAllCount () {
                http.post(dataUrl.getAllCount,{
                    warning: true,
                }).then(res=>{
                    if (res.state) {
                        this.warningCount = res.data
                        this.$notification.destroy()
                        if(this.warningCount > 0 && !this.$route.query.warningStatus) {
                            this.openNotification()
                        }
                    }
                })        
            },
            openNotification() {
                this.$notification.destroy()
                this.$notification['warning']({
                    duration: null,
                    placement: 'bottomRight',
                    message: '消息提醒',
                    description: '您有'+this.warningCount+'条库存下限预警信息',
                    btn: h => {
                        return h(
                          'button',
                          {
                            props: {
                              type: 'primary',
                              size: 'small',
                            },
                            style: {
                                display: 'block',
                                width: '100px',
                                height: '30px',
                                background: '#1890ff',
                                border: 'none',
                                color: '#fff',
                                cursor: 'pointer',
                                // border-radius: '6px'
                            },
                            on: {
                                    click: () => {
                                        this.warningStatus = true
                                        this.$notification.destroy()
                                        this.loader()
                                    }
                            },
                          },
                          '查看详情'
                        );
                    }
                });
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
            //搜索
            search(values){
                this.searchValue = values
                this.pagination.defaultCurrent = 1;
                this.pagination.current= 1;
                this.loader()
            },
            //编辑
            edit (record, text, name) {
                let params
                switch (name) {
                    case 'warningAmount': 
                        params = { id: record.id, warningAmount: parseInt(text) } 
                        break
                    case 'remarks':
                        params = { id: record.id, remarks: text } 
                        break
                    default:
                        console.log(`超出${name}修改范围，请检查!`)   
                        return 
                }

                http.post(dataUrl.updateInfo,params).then(res=>{
                    if (res.state){
                        this.loader()
                    } else {
                        message.warning(res.message)
                    }
                })                
            },
            outStorage(record) {
                if(record.material.amount > 0) {
                    this.$refs.outStorageAdd.openModal(record.material,record.storehouses);
                } else {
                    this.visible = true;
                }
            },
            comfirmAdd() {
                this.loader();
            },
            dataList(type) {
                this.warningStatus = type
                this.loader()
            },
            // 请求 - 导出excel表
            exportExcel() {
                this.exportDisabled = true;
                let paramsItem = {
                    name: this.searchValue.name ? this.searchValue.name : null,
                    modelNumber: this.searchValue.modelNumber ? this.searchValue.modelNumber : null,
                    storehouseId: this.searchValue.storehouseId ? this.searchValue.storehouseId : null,
                    materialCategoryId: (this.searchValue && this.searchValue.materialCategoryId) ? parseInt(this.searchValue.materialCategoryId.slice(-1).toString()) : null,
                    producer: this.searchValue.producer ? this.searchValue.producer : null,
                    warning: this.warningStatus ? this.warningStatus : null
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
    .editable-row-operations a {
        margin-right: 8px;
    }
</style>
