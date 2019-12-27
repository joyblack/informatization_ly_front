<template>
    <div>
        <WarehouseSearch></WarehouseSearch>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginTop:'30px',marginLeft:'10px'}">
            <a-button type="primary" icon="plus" @click="add">新建</a-button>
        </a-row>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{padding:'10px 30px'}">
            <a-table :columns="columns" :dataSource="data" :loading="loading" :pagination="pagination" bordered>
                <template slot="index" slot-scope="text, record, index">
                    <span>{{index + 1}}</span>
                </template>
                <span slot="edit" slot-scope="text, record">
                    <a href="javascript:;" @click="edit(record)">编辑</a>
                    <span v-if="record.status == 'START'">
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="editStatus(record)">停用</a>
                    </span>
                    <span v-else>
                        <a-divider type="vertical"/>
                        <a href="javascript:;" @click="editStatus(record)">启用</a>
                    </span>
                    <a-divider type="vertical"/>
                    <!-- <a href="javascript:;" @click="deleteOne(record)">删除</a> -->
                    <a-popconfirm
                        title="确定要删除该条仓库信息记录吗？"
                        @confirm="() => deleteOne(record)">
                        <a href="javascript:;">删除</a>
                    </a-popconfirm>
                </span>
                <template slot="status" slot-scope="text">
                    <span :style="{ color: [text === 'START' ? '#67C23A' : '#F56C6C']}"
                    >{{text === 'START' ? '启用' : '停用'}}</span>
                </template>  
                <template slot="isDefault" slot-scope="text">
                    <span :style="{ color: [text === 'YES' ? '#409EFF' : '#E6A23C']}"
                    >{{text === 'YES' ? '是' : '否'}}</span>
                </template>                  
            </a-table>
        </a-row>
    </div>
</template>

<script>
    import WarehouseSearch from './Search/index'
    import http from '@/utils/http'
    import TableUtil from '../../../../utils/TableUtil'
    import {Row, Button, Alert, Table, Divider, message, Popconfirm} from 'ant-design-vue'

    const dataUrl = {
        getListData: '/api/gm-storehouse/getPagerList', // 获取仓库分页信息 
        updateData: '/api/gm-storehouse/update', // 更新单条仓库信息 - 复用于启/停仓库
        deleteData: '/api/gm-storehouse/delete' // 删除单条仓库信息
    }
    const columns = [
        {
            title: '序号',
            dataIndex: 'index',
            align: 'center',
            scopedSlots: {customRender: 'index'}
        },
        {
            title: '仓库',
            dataIndex: 'name',
            align: 'center'
        }, {
            title: '仓库编号',
            dataIndex: 'code',
            align: 'center'
        }, {
            title: '管理员',
            dataIndex: 'admin',
            align: 'center'
        }, {
            title: '仓库负责人',
            dataIndex: 'responsePeople',
            align: 'center'
        }, {
            title: '状态',
            dataIndex: 'status',
            align: 'center',
            scopedSlots: {customRender: 'status'}
        }, {
            title: '默认仓库',
            dataIndex: 'isDefault',
            align: 'center',
            scopedSlots: {customRender: 'isDefault'}
        }, {
            title: '备注',
            dataIndex: 'remarks',
            align: 'center'
        }, {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            width: 155,
            scopedSlots: {customRender: 'edit'},
        }]
    const dataMapping = {
        'name': 'String',
        'code': 'String',
        'admin': 'String',  
        'status': 'String',
        'remarks': 'String',
        'isDefault': 'String',
        'responsePeople': 'String'
    }

    export default {
        name: "WarehouseList",
        components: {
            WarehouseSearch,
            ARow: Row,
            AButton: Button,
            AAlert: Alert,
            ATable: Table,
            ADivider: Divider,
            APopconfirm: Popconfirm
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
                columns,
                data: [],
                loading: false,
                searchValue: {}
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
            //搜索
            search(value) {
                this.searchValue = value
                this.pagination.defaultCurrent = 1;
                this.pagination.current= 1;
                this.loader()
            },
            //加载数据
            loader(params) {
                this.loading = true
                http.post(dataUrl.getListData,params ? params: {
                    name: this.searchValue.name ? this.searchValue.name : null,
                    code: this.searchValue.code ? this.searchValue.code : null,
                    admin: this.searchValue.admin ? this.searchValue.admin : null,
                    status: this.searchValue.status ? this.searchValue.status : null,
                    page: this.pagination.current,
                    size: this.currentSize
                }).then(res=>{
                    if (res.state){
                        this.data = TableUtil.formatData(res.data.content, dataMapping)
                        this.pagination.total = res.data.totalElements
                        this.loading = false
                    }
                })
            },
            // 启动 & 停用仓库
            editStatus (record) {
                let params = Object.assign({}, record)
                params.status = params.status === 'START' ? 'STOP' : 'START'
  
                http.post(dataUrl.updateData, params).then(res=>{
                    if (res.state) {
                        message.success(res.message)
                        this.loader()
                    }else {
                        message.warning(res.message)
                    }
                })
            },      
            // 删除
            deleteOne (record) {  
                http.post(dataUrl.deleteData, { id: record.id }).then(res=>{
                    if (res.state) {
                        message.success(res.message)
                        let currentData = [];
                        currentData = this.data;
                        if(currentData.length === 1 && this.pagination.current > 1) {
                            this.pagination.current = this.pagination.current - 1;  
                        }
                        this.loader()
                    }else {
                        message.warning(res.message)
                    }
                })                
            },              
            //新增
            add() {
                this.$router.push({name: 'warehouseEdit'})
            },
            // 更新
            edit (record) {
                this.$router.push({ name: 'warehouseEdit', query: { id: record.id } })
            }                 
        },
    }
</script>

<style scoped>

</style>
