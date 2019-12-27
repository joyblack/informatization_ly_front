<template>
    <div>
        <UserListSearch></UserListSearch>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginTop:'20px',marginLeft:'10px'}">
            <a-button type="primary" icon="plus" @click="add">新建</a-button>
        </a-row>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{padding:'20px 30px'}">
            <a-table :columns="columns" :dataSource="data" :loading="loading" :pagination="pagination" bordered >
            <span slot="edit" slot-scope="text, record">
              <a href="javascript:;" @click="edit(record)">编辑</a>
               <span v-if="record.status === '启用'">
                    <a-divider type="vertical"/>
                    <a href="javascript:;" @click="stop(record)">禁用</a>
               </span>
                <span v-else>
                   <a-divider type="vertical"/>
                     <a href="javascript:;" @click="start(record)">启用</a>
                </span>
                <a-divider type="vertical"/>
              <a href="javascript:;" @click="setResource(record)">设置权限</a>
                <a-divider type="vertical"/>
              <a href="javascript:;" @click="resetPassWord(record)">重置密码</a>
                <a-divider type="vertical"/>
              <a href="javascript:;" @click="changePassWord(record)">修改密码</a>
              <a-divider type="vertical"/>
              <a href="javascript:;" @click="deleteData(record)">删除</a>
            </span>
            </a-table>
        </a-row>
        <UserEdit ref="userEdit"></UserEdit>
        <ChangePassWord ref="changePassWord"/>
        <SetResource ref="setResource"/>
    </div>
</template>

<script>
    import UserEdit from '../Edit/UserEdit'
    import UserListSearch from './Search/index'
    import ChangePassWord from './ChangePassWord/index.vue'
    import SetResource from './SetResource/index.vue'
    import {Table, Row, Col, Button, Divider, Upload, Modal, message, Alert} from 'ant-design-vue'
    import TableUtil from '../../../../utils/TableUtil'
    import http from '../../../../utils/http'

    const confirm = Modal.confirm;
    const info = Modal.info;

    const columns = [
        {
            title: '序号',
            dataIndex: 'key',
            align: 'center',
        },
        {
            title: '登录名',
            dataIndex: 'loginName',
            align: 'center'
        }, {
            title: '用户姓名',
            dataIndex: 'username',
            align: 'center'
        }, {
            title: '电话号码',
            dataIndex: 'phone',
            align: 'center'
        }, {
            title: '部门',
            dataIndex: 'department.name',
            align: 'center'
        }, {
            title: '用户状态',
            dataIndex: 'status',
            align: 'center'
        }, {
            title: '备注',
            dataIndex: 'remarks',
            align: 'center'
        }, {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            width: 380,
            scopedSlots: {customRender: 'edit'},
        }];

    const dataUrl = {
        getAll: '/api/system-user/getPagerList',
        getDeleteData: '/api/system-user/delete',
        getResetPassword: '/api/system-user/resetPassword',
        getEnable: '/api/system-user/enable',//启用用户账号
        getDisable: '/api/system-user/disable',//禁用账户
    };

    const dataMapping = {
        'id': 'String',
        'status': 'Enum',//用户状态
        'username': 'String',//姓名
        'loginName': 'String',//用户名
        'phone': 'String',//电话
        'department.name': 'Object',//身份证号
        'remarks': 'String',//
        'userType': 'String'
    };

    export default {
        components: {
            UserEdit,
            UserListSearch,
            ChangePassWord,
            SetResource,
            ATable: Table,
            ARow: Row,
            ACol: Col,
            AButton: Button,
            ADivider: Divider,
            AUpload: Upload,
            AAlert: Alert,
            AModal: Modal,
        },
        name: 'UserList',
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
                    showTotal: this.showTotal,
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
                    page: this.pagination.current,
                    size: this.currentSize,
                    search: this.searchValue.search ? this.searchValue.search : null,
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

            //启用
            start(record) {
                if (record) {
                    let _this = this;
                    confirm({
                        title: '您确认要启用此用户吗?',
                        content: '单击确认按钮将执行启用操作',
                        onOk() {
                            http.post(dataUrl.getEnable, {id: record.id}).then((res) => {
                                if (res.state) {
                                    message.success(res.message);
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
            //禁用
            stop(record) {
                if (record) {
                    let _this = this;
                    confirm({
                        title: '您确认要禁用此用户吗?',
                        content: '单击确认按钮将执行禁用操作',
                        onOk() {
                            http.post(dataUrl.getDisable, {id: record.id}).then((res) => {
                                if (res.state) {
                                    message.success(res.message);
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
            //重置密码
            resetPassWord(record) {
                if (record) {
                    let _this = this;
                    confirm({
                        title: '您确认要重置密码吗?',
                        content: '单击确认按钮将执行启动操作',
                        onOk() {
                            http.post(dataUrl.getResetPassword, {id: record.id}).then((res) => {
                                if (res.state) {
                                    message.success(res.message);
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
            //修改密码
            changePassWord(record) {
                if (record) {
                    this.$refs.changePassWord.openModal(record)
                }
            },
            //设置权限
            setResource(record) {
                if (record) {
                    this.$refs.setResource.openModal(record)
                }
            },
            //编辑数据
            edit(record) {
                if (record) {
                    this.$refs.userEdit.openModal(record)
                }
            },
            //新增数据
            add() {
                this.$refs.userEdit.openModal()
            },
        }
    }
</script>

<style scoped>

</style>
