<template>
    <div>
        <DailyDrainageSearch></DailyDrainageSearch>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginTop:'20px',marginLeft:'10px'}">
            <a-button type="primary" icon="plus" @click="addData">新增抽放日报</a-button>
        </a-row>
        <!-- <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{padding:'20px 30px 0px 30px'}">
            <a-alert :message="'总计:'+pagination.total+'条'" type="info" showIcon></a-alert>
        </a-row> -->
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{padding:'20px 30px'}">
            <a-table :columns="columns" :dataSource="data" :loading="loading" :pagination="pagination" bordered>
                <span slot="edit" slot-scope="text, record">
                    <a href="javascript:;" @click="seeData(record)">查看</a>
                        <a-divider type="vertical"/>
                    <a href="javascript:;" @click="edit(record)">编辑</a>
                        <a-divider type="vertical"/>
                    <a href="javascript:;" @click="deleteData(record)">删除</a>
                </span>
            </a-table>
        </a-row>
        <DailyDrainageEdit ref="dailyDrainageEdit"></DailyDrainageEdit>
    </div>
</template>

<script>
    import {Row, Col, Table, Button, Alert, Modal, Divider, Progress, message} from 'ant-design-vue'
    import DailyDrainageEdit from '../Edit/DailyDrainageEdit'
    import DailyDrainageSearch from './Search/index'
    import http from '../../../../../utils/http'
    import TableUtil from '../../../../../utils/TableUtil'
    import moment from 'moment'

    const dataUrl = {
        getAll: '/api/cm-platform/getPagerList',
    }

    const confirm = Modal.confirm
    const info = Modal.info

    const columns = [
        {
            title: '序号',
            dataIndex: 'key',
            align: 'center'
        }, {
            title: '工作面类型',
            dataIndex: 'cmName',
            align: 'center'
        }, {
            title: '工作面',
            dataIndex: 'user.loginName',
            align: 'center'
        }, {
            title: '日期',
            dataIndex: 'user.username',
            align: 'center'
        }, {
            title: '测点编号',
            dataIndex: 'user.phone',
            align: 'center'
        }, {
            title: '负压',
            dataIndex: 'd',
            align: 'center'
        }, {
            title: '混合流量',
            dataIndex: 'c',
            align: 'center'
        }, {
            title: '纯流量',
            dataIndex: 'b',
            align: 'center'
        }, {
            title: '总流量',
            dataIndex: 'a',
            align: 'center'
        }, {
            title: '操作',
            dataIndex: 'action',
            align: 'center',
            scopedSlots: {customRender: 'edit'},
        }]
    const dataMapping = {
        'id': 'String',
        'status': 'Enum',//用户状态
        'cmName': 'String',
        'user.username': 'Object',//姓名
        'user.loginName': 'Object',//用户名
        'user.phone': 'Object',//电话
        'remarks': 'String',//‘
        'name': 'String'
    }
    export default {
        name: "DailyDrainageList",
        components: {
            DailyDrainageSearch,
            DailyDrainageEdit,
            ARow: Row,
            ACol: Col,
            ATable: Table,
            AButton: Button,
            AAlert: Alert,
            AModal: Modal,
            ADivider: Divider,
            AProgress: Progress,
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
                searchValue: {},
                currentSize: 20,
                columns,
                data: null,
                loading: false,
            }
        },
        mounted() {
            this.loader()
        },
        methods: {
            //搜索
            search(values) {
                this.searchValue = values
                this.pagination.defaultCurrent = 1;
                this.pagination.current= 1;
                this.loader();
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
            //加载数据
            loader(params) {
                this.loading = true
                http.post(dataUrl.getAll, params ? params : {
                    username: this.searchValue.username ? this.searchValue.username : null,
                    page: this.pagination.current,
                    size: this.currentSize
                }).then((res => {
                    if (res.state) {
                        this.data = TableUtil.formatData(res.data.content, dataMapping)
                        this.pagination.total = res.data.totalElements
                        this.loading = false
                    } else {
                        message.warning(res.message)
                    }
                }))
            },

            //新建数据
            addData() {
                this.$refs.dailyDrainageEdit.openModal()
            },
            //查看
            seeData(record) {
                if (record) {
                    let noEdit = true
                    this.$refs.dailyDrainageEdit.openModal(record, noEdit)
                }
            },
            //编辑
            edit(record) {
                if (record) {
                    this.$refs.dailyDrainageEdit.openModal(record)
                }
            },
            //删除
            deleteData(record) {
                if (record) {
                    let _this = this
                    confirm({
                        title: '您确认要删除该数据吗?',
                        content: '单击确认按钮将执行删除操作',
                        onOk() {
                            http.post(dataUrl.getDeleteData, {id: record.id}).then((res) => {
                                if (res.state) {
                                    message.success(res.message)
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
            }
        }
    }
</script>

<style scoped>

</style>
