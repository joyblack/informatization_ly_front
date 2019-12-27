<template>
    <div>
        <RoleManageSearch></RoleManageSearch>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginTop:'20px',marginLeft:'10px'}">
            <a-button type="primary" icon="plus" @click="add">新建</a-button>
        </a-row>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{padding:'20px 30px'}">
            <a-table :columns="columns" :dataSource="data" :loading="loading" :pagination="pagination" bordered>
                <span slot="edit" slot-scope="text, record">
                  <a href="javascript:;" @click="edit(record)">编辑</a>
                    <a-divider type="vertical"/>
                  <a href="javascript:;" @click="deleteData(record)">删除</a>
                </span>
            </a-table>
        </a-row>
        <RoleManageEdit ref="roleManageEdit"></RoleManageEdit>
    </div>
</template>

<script>
    import RoleManageEdit from '../Edit/RoleManageEdit'
    import RoleManageSearch from './Search/index'
    import {Table, Row, Col, Button, Divider, Upload, Modal, Alert, message} from 'ant-design-vue'
    import TableUtil from '../../../../utils/TableUtil'
    import http from '../../../../utils/http'

    const confirm = Modal.confirm;
    const info = Modal.info;

    const columns = [
        {
            title: '序号',
            dataIndex: 'key',
            align: 'center'
        }, {
            title: '角色名称',
            dataIndex: 'name',
            align: 'center'
        }, {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            scopedSlots: {customRender: 'edit'},
        }];

    const dataUrl = {
        getAll: '/api/system-role/getPagerList',
        getDeleteData: '/api/system-role/delete',
    };

    const dataMapping = {
        'id': 'String',
        'name': 'String',
    };

    export default {
        components: {
            RoleManageEdit,
            RoleManageSearch,
            ATable: Table,
            ARow: Row,
            ACol: Col,
            AButton: Button,
            ADivider: Divider,
            AUpload: Upload,
            AAlert: Alert,
            AModal: Modal,
        },
        name: 'RoleManageList',
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
                    onChange: this.paginationChange,
                    onShowSizeChange: this.paginationSizeChange,
                    showTotal:this.showTotal,
                },
                currentSize: 20,
                searchValue: {},
                columns,
                data: null,
                loading: true,
            }
        },
        mounted() {
            this.loader()
        },
        methods: {
            //搜索数据
            search(values) {
                this.searchValue = values;
                this.pagination.defaultCurrent = 1;
                this.pagination.current= 1;
                this.loader()
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
                this.loading = true;
                http.post(dataUrl.getAll, params ? params : {
                    name: this.searchValue.name ? this.searchValue.name : null,
                    page: this.pagination.current,
                    size: this.currentSize
                }).then((res) => {
                    if (res.state) {
                        this.data = TableUtil.formatData(res.data.content, dataMapping);
                        this.pagination.total = res.data.totalElements;
                        this.loading = false
                    } else {
                        message.warning(res.message)
                    }
                })
            },
            //删除数据
            deleteData(record) {
                if (record) {
                    let _this = this;
                    confirm({
                        title: '您确认要删除该数据吗?',
                        content: '单击确认按钮将执行删除操作',
                        onOk() {
                            http.post(dataUrl.getDeleteData, {id: record.id}).then((res) => {
                                if (res.state) {
                                    message.success(res.message);
                                    let currentData = [];
                                    currentData = _this.data;
                                    if(currentData.length === 1 && _this.pagination.current > 1) {
                                        _this.pagination.current = _this.pagination.current - 1;  
                                    }
                                    _this.loader()
                                } else {
                                    message.warning(res.message)
                                }
                            })
                        },
                        onCancel() {
                        },
                    })
                }
            },
            //编辑数据
            edit(record) {
                if (record) {
                    this.$refs.roleManageEdit.openModal(record)
                }
            },
            //新增
            add() {
                this.$refs.roleManageEdit.openModal()
            },
        }
    }
</script>

<style scoped>

</style>
