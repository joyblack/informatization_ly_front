<template>
    <div>
        <DrillingSearch></DrillingSearch>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginTop:'30px',marginLeft:'10px'}">
            <a-button type="primary" icon="plus" @click="addData">新增钻孔工作</a-button>
        </a-row>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{padding:'20px 30px'}">
            <a-table :columns="columns" :dataSource="data" :loading="loading" :pagination="pagination" bordered :scroll="{ x: 1520}">
                <span slot="edit" slot-scope="text, record">
                    <a href="javascript:;" @click="seeData(record)">查看</a>
                        <a-divider type="vertical"/>
                    <a href="javascript:;" @click="edit(record)">编辑</a>
                        <a-divider type="vertical"/>
                    <a-popconfirm
                            v-if="data.length"
                            title="确定要删除该条记录吗？"
                            @confirm="() => deleteData(record)">
                        <a href="javascript:;">删除</a>
                    </a-popconfirm>
                       <a-divider type="vertical"/>
                    <a href="javascript:;" @click="drillingAnalysis(record)">钻孔明细</a>
                </span>
            </a-table>
        </a-row>
        <DrillingEdit ref="drillingEdit"></DrillingEdit>
    </div>
</template>

<script>
    import {Row, Col, Table, Button, Alert, Modal, Divider,Popconfirm, message} from 'ant-design-vue'
    import DrillingEdit from '../Edit/DrillingEdit'
    import DrillingSearch from './Search/index'
    import http from '../../../../../utils/http'
    import TableUtil from '../../../../../utils/TableUtil'
    import moment from 'moment'

    const dataUrl = {
        getAll: '/api/produce-drill-work/getPagerList',//获取数据
        getDelete:'/api/produce-drill-work/delete'//删除
    };
    const confirm = Modal.confirm;
    const info = Modal.info;
    const columns = [
        {
            title: '序号',
            dataIndex: 'key',
            align: 'center',
            width: 100
        }, {
            title: '钻孔工作名称',
            dataIndex: 'drillWorkName',
            width: 130,
            align: 'center'
        }, {
            title: '开孔日期',
            dataIndex: 'drillTime',
            width: 130,
            align: 'center'
        }, {
            title: '钻孔类别',
            dataIndex: 'drillCategory',
            width: 130,
            align: 'center'
        }, {
            title: '钻孔类型',
            dataIndex: 'drillType',
            width: 130,
            align: 'center'
        }, {
            title: '钻孔岩性',
            dataIndex: 'drillRockCharacter',
            width: 130,
            align: 'center'
        }, {
            title: '钻孔设计总数',
            dataIndex: 'totalDrillHoleNumber',
            width: 130,
            align: 'center'
        }, {
            title: '已施工钻孔数',
            dataIndex: 'completedDrillHoleNumber',
            width: 130,
            align: 'center'
        }, {
            title: '钻孔总量(m)',
            dataIndex: 'totalLength',
            align: 'center'
        }, {
            title: '操作',
            dataIndex: 'action',
            width: 250,
            fixed: 'right',
            align: 'center',
            scopedSlots: {customRender: 'edit'},
        }];
    const dataMapping = {
        'id': 'String',
        'drillWorkName': 'String',
        'drillTime': 'Date',//
        'drillCategory': 'Enum',//用
        'drillType': 'Enum',//
        'drillRockCharacter': 'Enum',
        'totalDrillHoleNumber': 'String',//‘
        'completedDrillHoleNumber': 'String',//‘
        'totalLength': 'String',//‘

    };
    export default {
        name: "DrillingList",
        components: {
            DrillingSearch,
            DrillingEdit,
            ARow: Row,
            ACol: Col,
            ATable: Table,
            AButton: Button,
            AAlert: Alert,
            AModal: Modal,
            ADivider: Divider,
            APopconfirm:Popconfirm,
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
                this.loading = true
                http.post(dataUrl.getAll, params ? params : {
                    page: this.pagination.current,
                    size: this.currentSize,
                    drillWorkName: this.searchValue.drillWorkName ? this.searchValue.drillWorkName : null,
                    drillTimeStart:this.searchValue.dateTime && this.searchValue.dateTime[0] instanceof moment ? this.searchValue.dateTime[0].format('YYYY-MM-DD') : null,
                    drillTimeEnd:this.searchValue.dateTime && this.searchValue.dateTime[1] instanceof moment ? this.searchValue.dateTime[1].format('YYYY-MM-DD') : null,
                    drillCategory: this.searchValue.drillCategory ? this.searchValue.drillCategory : null,
                    drillType: this.searchValue.drillType ? this.searchValue.drillType : null,
                    drillRockCharacter: this.searchValue.drillRockCharacter ? this.searchValue.drillRockCharacter : null,
                }).then((res => {
                    if (res.state) {
                        this.data = TableUtil.formatData(res.data.content, dataMapping);
                        this.pagination.total = res.data.totalElements;
                        this.loading = false
                    } else {
                        message.warning(res.message)
                    }
                }))
            },

            //新建数据
            addData() {
                this.$refs.drillingEdit.openModal()
            },
            //查看
            seeData(record) {
                if (record) {
                    let noEdit = true;
                    this.$refs.drillingEdit.openModal(record, noEdit)
                }
            },
            //编辑
            edit(record) {
                if (record) {
                    this.$refs.drillingEdit.openModal(record)
                }
            },
            //打钻分析
            drillingAnalysis (record){
                if (record){
                    this.$router.push({name:'drillingAnalysis',params:{id:record.id}})
                }
            },
            //删除
            deleteData(record) {
                if (record) {
                    http.post(dataUrl.getDelete, {
                        id: record.id
                    }).then(res => {
                        if (res.state) {
                            message.success(res.message);
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
