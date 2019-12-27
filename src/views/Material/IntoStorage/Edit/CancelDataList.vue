<template>
    <div>
        <a-form :form="form" @submit="search" layout='inline'>
            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginBottom:'20px'}">
                <a-col :md="8" :sm='24'>
                    <a-form-item label="作废日期" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}" v-bind="formItemLayout">
                        <a-range-picker style="width:100%;"
                            v-decorator="['cancelDate']"
                        />
                    </a-form-item>
                </a-col>
                <a-col style="position:absolute;right:0;top:5px;">
                    <a-button type="primary" html-type="submit">
                        搜索
                    </a-button>
                    <a-button :style="{ marginLeft: '8px' }" @click="resetSearch">
                        重置
                    </a-button>
                </a-col>
            </a-row>
        </a-form>

        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' style="margin:30px 0 10px;">
            <a-button type="primary" style="margin-left:8px;" @click="backLastPage">
                <a-icon type="arrow-left" />返回上一页
            </a-button>
        </a-row>

        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{padding:'0 30px'}">
            <a-table :columns="columns" :dataSource="data" :loading="tableLoading" :pagination="pagination" bordered :scroll="{ x: 2260}">
                <!-- 序号 -->
                <template slot="index" slot-scope="text, record, index">
                    <span>{{index + 1}}</span>
                </template>
            </a-table>
        </a-row>
    </div>
</template>

<script>
    import {Table, Row, Alert, Button, Form, Spin, Col, message, DatePicker, Icon} from 'ant-design-vue'
    import moment from 'moment'
    import 'moment/locale/zh-cn'
    import debounce from 'lodash/debounce'
    import http from '@/utils/http'
    import TableUtil from '@/utils/TableUtil'

    const dataUrl = {
        getPagerList: '/api/gm-inventory-in-cancel/getAllList', // 获取入库信息 - 分页
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
            dataIndex: 'materialName',
            align: 'center',
            width: 150
        }, {
            title: '型号',
            dataIndex: 'modelNumber',
            align: 'center',
            width: 150
        }, {
            title: '供货单位/供货人',
            dataIndex: 'supplierName',
            align: 'center',
            width: 150
        }, {
            title: '生产厂家',
            dataIndex: 'producer',
            align: 'center',
            width: 150
        },{
            title: '材料类别',
            dataIndex: 'materialCategory',
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
            dataIndex: 'inStorehouse',
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
            title: '作废原因',
            dataIndex: 'cancelReason',
            align: 'center',
            width: 150
        }, {
            title: '作废日期',
            dataIndex: 'cancelDate',
            align: 'center',
            width: 120
        }, {
            title: '备注',
            dataIndex: 'remarks',
            align: 'center',
            width: 150
        }
    ];

    const dataMapping = {
        'id': 'Number',
        'materialName': 'String',
        'modelNumber': 'String',
        'materialCategory': 'String',
        'supplierName': 'String',
        'producer': 'String',
        'unitPrice': 'Number',
        'amount': 'Number',
        'inNumber': 'Number',
        'inStorehouse': 'String',
        'afterAmount': 'Number',
        'inDate': 'String',
        'totalPrice': 'Number',
        'signPeople': 'String',
        'cancelReason': 'String',
        'cancelDate': 'Date',
        'remarks': 'String'
    };

    export default {
        components: {
            ARow: Row,
            ACol: Col,
            AAlert: Alert,
            AButton: Button,
            ATable: Table,
            AForm: Form,
            AFormItem: Form.Item,
            ASpin: Spin,
            ADatePicker:DatePicker,
            ARangePicker:DatePicker.RangePicker,
            AIcon: Icon
        },
        name: 'CancelDataList',
        beforeCreate () {
            this.form = this.$form.createForm(this)
        },
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
                    showTotal: this.showTotal,
                    onChange: this.paginationChange,
                    onShowSizeChange: this.paginationSizeChange,
                },
                currentSize: 20,
                columns,
                data: [],
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
                }
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
                    cancelDateStart: this.searchValue.cancelDate && this.searchValue.cancelDate[0] instanceof moment ? this.searchValue.cancelDate[0].format('YYYY-MM-DD') : null,
                    cancelDateEnd: this.searchValue.cancelDate && this.searchValue.cancelDate[1] instanceof moment ? this.searchValue.cancelDate[1].format('YYYY-MM-DD') : null,
                    page: this.pagination.current,
                    size: this.currentSize
                }).then(res => {
                    console.log(res)
                    if (res.state) {
                        this.data = TableUtil.formatData(res.data, dataMapping)
                        this.pagination.total = res.data.totalElements
                        this.tableLoading = false
                    } else {
                        message.warning(res.message)
                    }
                })
            },
            //搜索
            search(e){
                e.preventDefault();
                this.form.validateFields(
                  (err, values) => {
                    this.searchValue = values
                    this.pagination.defaultCurrent = 1;
                    this.pagination.current= 1;
                    this.loader()
                  },
                )
            },
            resetSearch () {
                this.form.resetFields()
                this.searchValue = {}
                this.pagination.defaultCurrent = 1
                this.pagination.current= 1
                this.loader()
            },
            backLastPage() {
                this.$router.push({name:'intoStorageList',params:{}})
            }
        }
    }
</script>

<style scoped>

</style>
