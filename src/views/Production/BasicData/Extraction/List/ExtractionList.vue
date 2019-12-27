<template>
    <div>
        <ExtractionSearch></ExtractionSearch>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginTop:'30px',marginLeft:'10px'}">
            <a-button type="primary" icon="plus" @click="addData">新增回采工作面</a-button>
        </a-row>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{padding:'20px 30px'}">
            <a-table :columns="columns" :dataSource="data" :loading="loading" :pagination="pagination" bordered :scroll="{ x: 1560}">
                <span slot="progress" slot-scope="text">
                    <a-progress :percent="Math.floor(text*100)" size="small"/>
                </span>
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
        <ExtractionEdit ref="extractionEdit"></ExtractionEdit>
    </div>
</template>

<script>
    import {Row, Col, Table, Button, Alert, Modal, Divider, Progress,Popconfirm, message} from 'ant-design-vue'
    import ExtractionEdit from '../Edit/ExtractionEdit'
    import ExtractionSearch from './Search/index'
    import http from '../../../../../utils/http'
    import TableUtil from '../../../../../utils/TableUtil'
    import moment from 'moment'

    const dataUrl = {
        getAll: '/api/produce-back-mining-face/getPagerList',
        getDelete: '/api/produce-back-mining-face/delete',

    };
    const confirm = Modal.confirm;
    const info = Modal.info;
    const columns = [
        {
            title: '序号',
            dataIndex: 'key',
            width: 100,
            align: 'center'
        },{
            title: '名称',
            width: 130,
            dataIndex: 'backMiningFaceName',
            align: 'center'
        }, {
            title: '开采日期',
            width: 130,
            dataIndex: 'startTime',
            align: 'center'
        }, {
            title: '煤层厚度(m)',
            width: 130,
            dataIndex: 'coalSeamThickness',
            align: 'center'
        }, {
            title: '煤层倾角',
            width: 130,
            dataIndex: 'coalSeamDipAngle',
            align: 'center'
        }, {
            title: '采高(m)',
            width: 130,
            dataIndex: 'miningHigh',
            align: 'center'
        }, {
            title: '通风方式',
            width: 130,
            dataIndex: 'ventilationMode',
            align: 'center'
        }, {
            title: '回采方式',
            width: 130,
            dataIndex: 'backMiningMode',
            align: 'center'
        }, {
            title: '可采储量(t)',
            width: 130,
            dataIndex: 'recoverReserves',
            align: 'center'
        }, {
            title: '采面斜长(m）',
            width: 130,
            dataIndex: 'slopeLength',
            align: 'center'
        }, {
            title: '累计进度',
            width: 130,
            dataIndex: 'progress',
            align: 'center',
            scopedSlots: {customRender: 'progress'},
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
        'backMiningFaceName': 'String',
        'slopeLength': 'String',
        'returnAirChute': 'String',
        'transportChute': 'String',
        'progress': 'String',
        'trendLength': 'String',
        'startTime': 'Date',//‘
        'coalSeamThickness': 'String',//‘
        'coalSeamDipAngle': 'String',//‘
        'miningHigh': 'String',//‘
        'ventilationMode': 'Enum',//‘
        'backMiningMode': 'Enum',//‘
        'recoverReserves': 'String',//‘
        'remarks': 'String',//‘
    };
    export default {
        name: "ExtractionList",
        components: {
            ExtractionSearch,
            ExtractionEdit,
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
                    backMiningFaceName: this.searchValue.backMiningFaceName ? this.searchValue.backMiningFaceName : null,
                    startTimeStart: this.searchValue.startTimeStartEnd && this.searchValue.startTimeStartEnd[0] instanceof moment ? this.searchValue.startTimeStartEnd[0].format('YYYY-MM-DD') : null,
                    startTimeEnd: this.searchValue.startTimeStartEnd && this.searchValue.startTimeStartEnd[1] instanceof moment ? this.searchValue.startTimeStartEnd[1].format('YYYY-MM-DD') : null,
                    ventilationMode: this.searchValue.ventilationMode ? this.searchValue.ventilationMode : null,
                    backMiningMode: this.searchValue.backMiningMode ? this.searchValue.backMiningMode : null,
                }).then((res => {
                    if (res.state) {
                        this.data = TableUtil.formatData(res.data.content, dataMapping);
                        this.pagination.total = res.data.totalElements;
                        this.loading = false;
                    } else {
                        message.warning(res.message)
                    }
                }))
            },

            //新建数据
            addData() {
                this.$refs.extractionEdit.openModal()
            },
            //查看
            seeData(record) {
                if (record) {
                    let noEdit = true;
                    this.$refs.extractionEdit.openModal(record, noEdit)
                }
            },
            //编辑
            edit(record) {
                if (record) {
                    this.$refs.extractionEdit.openModal(record)
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
