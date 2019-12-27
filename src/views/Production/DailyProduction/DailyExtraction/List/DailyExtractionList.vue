<template>
    <div>
        <DailyExtractionSearch></DailyExtractionSearch>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginTop:'30px',marginLeft:'10px'}">
            <a-button type="primary" icon="plus" @click="addData">新增回采日报</a-button>
        </a-row>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{padding:'20px 30px'}">
            <a-table :columns="columns" :dataSource="data" :loading="loading" :pagination="pagination" bordered
                     :scroll="{ x: 1290}">
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
                </span>
            </a-table>
        </a-row>
        <DailyExtractionEdit ref="dailyExtractionEdit"></DailyExtractionEdit>
    </div>
</template>

<script>
    import {Row, Col, Table, Button, Alert, Modal, Divider, Progress,Popconfirm, message} from 'ant-design-vue'
    import DailyExtractionEdit from '../Edit/DailyExtractionEdit'
    import DailyExtractionSearch from './Search/index'
    import http from '../../../../../utils/http'
    import TableUtil from '../../../../../utils/TableUtil'
    import moment from 'moment'

    const dataUrl = {
        getAll: '/api/produce-back-mining-daily/getPagerList',
        getDelete: '/api/produce-back-mining-daily/delete',
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
            title: '回采工作面',
            width: 130,
            dataIndex: 'backMiningFace.backMiningFaceName',
            align: 'center'
        }, {
            title: '回采队伍',
            width: 130,
            dataIndex: 'team.name',
            align: 'center'
        }, {
            title: '日期',
            width: 130,
            dataIndex: 'dailyTime',
            align: 'center'
        }, {
            title: '回采人数',
            width: 130,
            dataIndex: 'peopleNumber',
            align: 'center'
        }, {
            title: '班次',
            width: 130,
            dataIndex: 'shifts',
            align: 'center'
        }, {
            title: '回采进尺（m）',
            width: 130,
            dataIndex: 'doneLength',
            align: 'center'
        }, {
            title: '产量（t）',
            width: 130,
            dataIndex: 'output',
            align: 'center'
        }, {
            title: '工作内容',
            dataIndex: 'workContent',
            align: 'center',
        }, {
            title: '操作',
            dataIndex: 'action',
            width: 160,
            fixed: 'right',
            align: 'center',
            scopedSlots: {customRender: 'edit'},
        }];
    const dataMapping = {
        'id': 'String',
        'shifts': 'Enum',//班次
        'backMiningFace.backMiningFaceName': 'Object',
        'team.name': 'Object',//队伍
        'dailyTime': 'Date',//日期
        'peopleNumber': 'String',//人数
        'doneLength': 'String',
        'output': 'String',
        'workContent': 'String',
    };
    export default {
        name: "DailyExtractionList",
        components: {
            DailyExtractionSearch,
            DailyExtractionEdit,
            ARow: Row,
            ACol: Col,
            ATable: Table,
            AButton: Button,
            AAlert: Alert,
            AModal: Modal,
            ADivider: Divider,
            AProgress: Progress,
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
                currentSize: 20,
                searchValue: {},
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
                this.pagination.current = 1;
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
                    backMiningFaceId: this.searchValue.backMiningFaceId ? this.searchValue.backMiningFaceId : null,
                    dailyTimeStart: this.searchValue.dailyTime && this.searchValue.dailyTime[0] instanceof moment ? this.searchValue.dailyTime[0].format('YYYY-MM-DD') : null,
                    dailyTimeEnd: this.searchValue.dailyTime && this.searchValue.dailyTime[1] instanceof moment ? this.searchValue.dailyTime[1].format('YYYY-MM-DD') : null,
                    shifts: this.searchValue.shifts ? this.searchValue.shifts : null,
                    teamId: this.searchValue.teamId && this.searchValue.teamId ? this.searchValue.teamId.slice(-1)[0] : null,
                    page: this.pagination.current,
                    size: this.currentSize
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
                this.$refs.dailyExtractionEdit.openModal()
            },
            //查看
            seeData(record) {
                if (record) {
                    let noEdit = true;
                    this.$refs.dailyExtractionEdit.openModal(record, noEdit)
                }
            },
            //编辑
            edit(record) {
                if (record) {
                    let noEdit = false;
                    this.$refs.dailyExtractionEdit.openModal(record, noEdit)
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
