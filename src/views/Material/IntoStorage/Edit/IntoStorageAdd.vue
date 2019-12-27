<template>
    <div>
        <a-form :form="form" :style="{ marginTop: '8px' }">
            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }'>
                <a-col :md="24" :sm='24'>
                    <a-button
                        style="margin-top: 16px; margin-bottom: 8px"
                        type="primary"
                        @click="newMember"
                    >
                        新增数据
                    </a-button>
                    <span v-show="problemsStatus" class="errorTips">请将带有 * 的条目信息添加完整！</span>
                    <a-table
                        :columns="columns"
                        :dataSource="data"
                        :pagination="false"
                        :scroll="{ x: 2135}"
                        :loading="memberLoading"
                        bordered
                    >
                        <span slot="nameTitle"><span style="color: red">*</span> 材料名称</span>

                        <span slot="modelNumberTitle"><span style="color: red">*</span> 型号</span>

                        <span slot="supplierNameTitle"><span style="color: red">*</span> 供货单位/供货人</span>

                        <span slot="producerTitle"><span style="color: red">*</span> 生产厂家</span>

                        <span slot="materialCategoryIdTitle"><span style="color: red">*</span> 材料类别</span>

                        <span slot="amountTitle"><span style="color: red">*</span> 库存总数</span>

                        <span slot="inNumberTitle"><span style="color: red">*</span> 入库数量</span>

                        <span slot="storehouseIdTitle"><span style="color: red">*</span> 入库仓库</span>

                        <span slot="afterAmountTitle"><span style="color: red">*</span> 入库后总数</span>

                        <span slot="inDateTitle"><span style="color: red">*</span> 入库时间</span>

                        <span slot="unitPriceTitle"><span style="color: red">*</span> 单价(元)</span>

                        <span slot="signPeopleTitle"><span style="color: red">*</span> 签收人</span>

                        <template slot="name" slot-scope="text,record">
                            <a-auto-complete
                                :dataSource="record.dataSourceName"
                                @change="e => nameChange(e, record)"
                                @search="e => handleSearchName(e, record)"
                                placeholder=""
                            />
                        </template>

                        <template slot="modelNumber" slot-scope="text,record">
                            <a-auto-complete
                                :dataSource="record.dataSourceNumber"
                                @change="e => modelNumberChange(e, record)"
                                @search="e => handleSearchNumber(e, record)"
                                placeholder=""
                            />
                        </template>

                        <template slot="supplierName" slot-scope="text,record">
                            <a-auto-complete
                                :dataSource="record.dataSourceSupplier"
                                @change="e => supplierNameChange(e, record)"
                                placeholder=""
                            />
                        </template>

                        <template slot="producer" slot-scope="text,record">
                            <a-input 
                                :value="text" 
                                @change="e => producerChange(e.target.value, record)"
                            />
                        </template>

                        <template slot="materialCategoryId" slot-scope="text,record">
                            <a-cascader
                                :options="materialCategoryIdList"
                                @change="e => selectMaterialCategoryId(e, record)"
                                changeOnSelect
                                placeholder=""
                                :value="text"
                            />
                        </template>

                        <template slot="amount" slot-scope="text,record">
                            <a-input-number
                                :min="0"
                                :value="text"
                                :precision="0"
                                :disabled="true"
                            />
                        </template>

                        <template slot="inNumber" slot-scope="text,record">
                            <a-input-number
                                :min="0"
                                :value="text"
                                :precision="0"
                                @change="e => inNumberChange(e, record)"
                            />
                        </template>

                        <template slot="afterAmount" slot-scope="text,record">
                            <a-input-number 
                                :disabled="true" 
                                :min="0"
                                :value="text"
                                :precision="0"
                            />
                        </template>

                        <template slot="storehouseId" slot-scope="text,record">
                            <a-select 
                                style="width:100%" 
                                :value="text"
                                @change="e => storehouseIdChange(e, record)"
                            >
                                <a-select-option 
                                    v-for="(item,index) in storehouseIdList" 
                                    :key="index"
                                    :value='item.key'
                                >
                                    {{item.label}}
                                </a-select-option>
                            </a-select>
                        </template>

                        <template slot="inDate" slot-scope="text,record">
                            <a-date-picker 
                                :value="text" 
                                @change="e => inDateChange(e, record.key)"
                            >
                            </a-date-picker>
                        </template>

                        <template slot="unitPrice" slot-scope="text,record">
                            <a-input-number
                                :min="0"
                                :value="text"
                                :precision="2"
                                @change="e => unitPriceChange(e, record)"
                            />
                        </template>

                        <template slot="totalPrice" slot-scope="text,record">
                            <a-input-number
                                :min="0"
                                :value="text"
                                :precision="2"
                                :disabled="true"
                            />
                        </template>

                        <template slot="signPeople" slot-scope="text,record">
                            <a-input 
                                :value="text"
                                @change="e => signPeopleChange(e.target.value, record.key)"
                            />
                        </template>

                        <template slot="remarks" slot-scope="text,record">
                            <a-input 
                                :value="text" 
                                @change="e => remarksChange(e.target.value, record.key)"
                            />
                        </template>

                        <template slot="operation" slot-scope="text, record">
                            <a href="javascript:;" @click="remove(record.key)">删除</a>
                        </template>
                    </a-table>
                </a-col>
            </a-row>

            <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' style="text-align:center;margin-top:30px;">
                <a-button type="primary" @click="save">保存</a-button>
                <a-button style="margin-left:20px;" @click="backLastPage">返回</a-button>
            </a-row>
        </a-form>
    </div>
</template>

<script>
    import {Modal, Form, Row, Col, Input, DatePicker, Select, Table, Button, Divider, Popconfirm,InputNumber, Cascader, message, AutoComplete} from 'ant-design-vue'
    import moment from 'moment'
    import http from '../../../../utils/http'
    import TableUtil from '../../../../utils/TableUtil'
    import debounce from 'lodash/debounce'

    const dataUrl = {
        getAddData: '/api/gm-inventory-in/batchAdd',//新增数据
        getMaterialCategoryId: '/api/gm-material-category/getTree',//获取材料分类
        getStorehouseId: '/api/gm-storehouse/getAllList',//获取仓库信息
        getModelNumberList: '/api/gm-inventory/getModelNumberList',//通过材料名称获取型号数据
        getDataBySearch: '/api/gm-inventory/getAllList',//通过材料名称获取相应数据
        getSupplierByMaterial: '/api/gm-inventory-in/getSupplierByMaterial'//通过材料名称和型号获取供应商信息
    };
    
    const columns = [
        {
            title: '序号',
            width: 65,
            dataIndex: 'key',
            align: 'center',
            fixed: 'left',
            render: (text, record, index) => `${index + 1}`
        },
        {
            slots: {title: 'nameTitle'},
            dataIndex: 'name',
            key: 'name',
            align: 'center',
            width: 175,
            scopedSlots: {customRender: 'name'}
        },
        {
            slots: {title: 'modelNumberTitle'},
            dataIndex: 'modelNumber',
            key: 'modelNumber',
            align: 'center',
            width: 150,
            scopedSlots: {customRender: 'modelNumber'}
        },
        {
            slots: {title: 'supplierNameTitle'},
            dataIndex: 'supplierName',
            key: 'supplierName',
            align: 'center',
            width: 160,
            scopedSlots: {customRender: 'supplierName'}
        },
        {
            slots: {title: 'producerTitle'},
            dataIndex: 'producer',
            key: 'producer',
            align: 'center',
            width: 160,
            scopedSlots: {customRender: 'producer'}
        },
        {
            slots: {title: 'materialCategoryIdTitle'},
            dataIndex: 'materialCategoryId',
            key: 'materialCategoryId',
            align: 'center',
            width: 150,
            scopedSlots: {customRender: 'materialCategoryId'}
        },
        {
            slots: {title: 'amountTitle'},
            dataIndex: 'amount',
            key: 'amount',
            align: 'center',
            width: 120,
            scopedSlots: {customRender: 'amount'}
        },
        {
            slots: {title: 'inNumberTitle'},
            dataIndex: 'inNumber',
            key: 'inNumber',
            align: 'center',
            width: 120,
            scopedSlots: {customRender: 'inNumber'}
        },
        {
            slots: {title: 'storehouseIdTitle'},
            dataIndex: 'storehouseId',
            key: 'storehouseId',
            align: 'center',
            width: 150,
            scopedSlots: {customRender: 'storehouseId'}
        },
        {
            slots: {title: 'afterAmountTitle'},
            dataIndex: 'afterAmount',
            key: 'afterAmount',
            align: 'center',
            width: 150,
            scopedSlots: {customRender: 'afterAmount'}
        },
        {
            slots: {title: 'inDateTitle'},
            dataIndex: 'inDate',
            key: 'inDate',
            align: 'center',
            width: 150,
            scopedSlots: {customRender: 'inDate'}
        },
        {
            slots: {title: 'unitPriceTitle'},
            dataIndex: 'unitPrice',
            key: 'unitPrice',
            align: 'center',
            width: 120,
            scopedSlots: {customRender: 'unitPrice'}
        },
        {
            title: '总价(元)',
            dataIndex: 'totalPrice',
            key: 'totalPrice',
            align: 'center',
            width: 120,
            scopedSlots: {customRender: 'totalPrice'}
        },
        {
            slots: {title: 'signPeopleTitle'},
            dataIndex: 'signPeople',
            key: 'signPeople',
            align: 'center',
            width: 120,
            scopedSlots: {customRender: 'signPeople'}
        },
        {
            title: '备注',
            dataIndex: 'remarks',
            key: 'remarks',
            align: 'center',
            width: 150,
            scopedSlots: {customRender: 'remarks'}
        },
        {
            title: '操作',
            key: 'action',
            align: 'center',
            width: 70,
            fixed: 'right',
            scopedSlots: {customRender: 'operation'}
        }];

    export default {
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        name: "IntoStorageAdd",
        components: {
            AModal: Modal,
            AForm: Form,
            ARow: Row,
            ACol: Col,
            AFormItem: Form.Item,
            AInput: Input,
            AInputNumber: InputNumber,
            ATextarea: Input.TextArea,
            ADatePicker: DatePicker,
            ASelect: Select,
            ASelectOption: Select.Option,
            AButton: Button,
            ATable: Table,
            ADivider: Divider,
            APopconfirm: Popconfirm,
            ACascader: Cascader,
            AAutoComplete: AutoComplete
        },
        data() {
            return {
                materialCategoryIdList: [],//材料类别
                storehouseIdList: [],//入库仓库
                memberLoading: false,
                columns,
                data: [{
                    key: '1',
                    name: null,
                    modelNumber: null,
                    supplierName: null,
                    producer: null,
                    unitPrice: null,
                    materialCategoryId: null,
                    storehouseId: null,
                    amount: 0,
                    inNumber: null,
                    totalPrice: 0,
                    signPeople: null,
                    afterAmount: null,
                    inDate: moment(new Date(), 'YYYY-MM-DD'),
                    editable: true,
                    isNew: true,
                    dataSourceName: [],
                    dataSourceNumber: [],
                    dataSourceSupplier: []
                }],
                problemItems: [],
                problemsStatus: false
            }
        },
        mounted() {
            this.initMaterialCategoryId();//获取材料类别
            this.storehouseIdData();//获取仓库信息
        },
        methods: {
            //材料名称
            nameChange(value, record) {
                const newData = [...this.data];
                const target = newData.filter(item => record.key === item.key)[0];
                console.log("==value==",value)
                if (target) {
                    target.name = value;
                    this.data = newData;
                    record.modelNumber = null;
                    record.materialCategoryId = null;
                    record.supplierName = null;
                    record.producer = null;
                    record.unitPrice = null;
                    record.totalPrice = 0;
                    record.amount = 0;
                    record.inNumber = null;
                    record.afterAmount = null;
                    record.storehouseId = null;
                    record.dataSourceName = [];
                    record.dataSourceNumber = [];
                    record.dataSourceSupplier = [];
                    // clearTimeout(this.timeout);
                    this.timeout = setTimeout(() => {
                        http.post(dataUrl.getModelNumberList, {
                            name: value
                        }).then(res => {
                            if (res.state && res.data.length > 0) {
                                record.dataSourceNumber = this.filterItemsNumber(res.data);
                                if(record.dataSourceNumber.length === 1) {
                                    record.modelNumber = record.dataSourceNumber[0];
                                    this.modelNumberChange(record.modelNumber, record);
                                }
                            }
                        })
                    }, 500);
                }
            },
            handleSearchName(value, record) {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    http.post(dataUrl.getDataBySearch, {
                        name: value
                    }).then(res => {
                        if (res.state && res.data.length > 0) {
                            let data = this.filterItems(res.data);
                            //去重
                            let newArr = new Set(data);
                            record.dataSourceName = [...newArr];
                        }
                    })
                }, 100);
            },
            filterItems(data) {
                const arr = [];              
                data.forEach(item => {             
                    const tmp = { ...item };                        
                    arr.push(tmp.material.name);             
                })             
                return arr;
            },
            filterItemsNumber(data) {
                const arr = [];              
                data.forEach(item => {             
                    const tmp = { ...item };                        
                    arr.push(tmp.modelNumber);             
                })             
                return arr;
            },
            handleSearchNumber(value,record) {
                clearTimeout(this.timeout);
                this.timeout = setTimeout(() => {
                    http.post(dataUrl.getDataBySearch, {
                        modelNumber: value.trim()
                    }).then(res => {
                        if (res.state && res.data.length > 0) {
                            let data = this.filterItemsNumber(res.data);
                            record.dataSourceNumber = data;
                        }
                    })
                }, 300);
            },
            //型号
            modelNumberChange(value, record) {
                const newData = [...this.data];
                const target = newData.filter(item => record.key === item.key)[0];
                if (target) {
                    target.modelNumber = value;
                    this.data = newData;
                    if(record.name && record.modelNumber) {
                        record.materialCategoryId = null;
                        record.supplierName = null;
                        record.amount = 0;
                        record.producer = null;
                        record.unitPrice = null;
                        record.totalPrice = 0;
                        record.inNumber = null;
                        record.afterAmount = null;
                        record.storehouseId = null;
                        record.key = record.key
                        // record.dataSourceName = [];
                        // record.dataSourceNumber = [];
                        record.dataSourceSupplier = [];
                        clearTimeout(this.timeout);
                        this.timeout = setTimeout(() => {
                            http.post(dataUrl.getDataBySearch, {
                                name: record.name,
                                modelNumber: record.modelNumber
                            }).then(res => {
                                if (res.state && res.data.length > 0) {
                                    res.data.forEach(item => {             
                                        const tmp = { ...item }; 
                                        if(tmp.material.name == record.name && tmp.material.modelNumber == record.modelNumber) {
                                            let str = tmp.material.materialCategory.path.split('-');
                                            let r = str.filter(function (s) {
                                                return s && s.trim(); // 注：IE9(不包含IE9)以下的版本没有trim()方法
                                            });
                                            let strData = r;
                                            let mId = [];
                                            for (let j in strData) {
                                                mId.push(Number(strData[j]))//字符串转Number类型
                                            }

                                            record.materialCategoryId = mId;
                                            record.amount = tmp.material.amount;
                                            record.afterAmount = tmp.material.amount;
                                            record.storehouseId = tmp.storehouses[0].storehouse.id;
                                            record.key = record.key;
                                        }                                    
                                    })
                                }
                            })
                            http.post(dataUrl.getSupplierByMaterial, {
                                name: record.name,
                                modelNumber: record.modelNumber
                            }).then(res => {
                                if (res.state && res.data && res.data.material && res.data.supplier) {
                                    record.producer = res.data.material.producer ? res.data.material.producer : null;
                                    res.data.supplier.forEach(item => {             
                                        const tmp = { ...item }; 
                                        let data = this.filterItemsSupplier(res.data.supplier);
                                        //去重
                                        let newArr = new Set(data);
                                        record.dataSourceSupplier = [...newArr];
                                        if(record.dataSourceSupplier.length === 1) {
                                            record.supplierName = record.dataSourceSupplier[0];
                                        }                                  
                                    })
                                }
                            })
                        }, 300);
                    }
                }
            },
            filterItemsSupplier(data) {
                const arr = [];              
                data.forEach(item => {             
                    const tmp = { ...item };                        
                    arr.push(tmp.name);             
                })             
                return arr;
            },
            //供货单位
            supplierNameChange(value, record) {
                const newData = [...this.data];
                const target = newData.filter(item => record.key === item.key)[0];
                if (target) {
                    target.supplierName = value;
                    this.data = newData;
                }
            },
            // handleSearchSupplier(value) {
            //     clearTimeout(this.timeout);
            //     this.timeout = setTimeout(() => {
            //         http.post(dataUrl.getDataBySearch, {
            //             modelNumber: value.trim()
            //         }).then(res => {
            //             if (res.state) {
            //                 let data = this.filterItemsSupplier(res.data);
            //                 this.dataSourceSupplier = data;
            //             }
            //         })
            //     }, 300);
            // },
            producerChange(value, record) {
                const newData = [...this.data];
                const target = newData.filter(item => record.key === item.key)[0];
                if (target) {
                    target.producer = value;
                    this.data = newData;
                }
            },
            unitPriceChange(value, record) {
                const newData = [...this.data]
                const target = newData.filter(item => record.key === item.key)[0]
                if (target && value) {
                    target.unitPrice = value
                    record.totalPrice = record.inNumber * value;
                    this.data = newData
                }
            },
            //加载材料类别
            initMaterialCategoryId() {
                http.post(dataUrl.getMaterialCategoryId, {id: 0}).then(res => {
                    if (res.state) {
                        if (res.data.length > 0) {
                            let topLevel = res.data[0].parentId; // 获取顶级父级
                            this.materialCategoryIdList = [];
                            let tData = res.data; //获取后台返回数据
                            let next = [...tData];//存入数据
                            let result = [];//定义空数组
                            //将数行数组转为一维数组
                            while (next.length) {
                                //遍历数组，重新赋值
                                result.push(...next.map(m => ({
                                    value: m.id,
                                    label: m.name,
                                    id: m.id,
                                    key: m.id,
                                    parentId: m.parentId,
                                })));
                                next = next
                                    .filter(m => Array.isArray(m.children))
                                    .reduce((all, m) => [...all, ...m.children], []);
                            }
                            //将重新定义的数组，转为树形数组
                            result.forEach(e => {
                                let parentId = e.parentId;//获取父级id
                                if (parentId == 0) {
                                    //判断如果为顶层id 0 不做操作
                                } else {
                                    result.forEach(d => {
                                        //遍历数组，如果id = 父级id
                                        if (d.id == parentId) {
                                            let childArray = d.children;//新建子级数组
                                            if (!childArray) {
                                                childArray = []
                                            }
                                            childArray.push(e)
                                            d.children = childArray
                                        }
                                    })
                                }
                            });
                            //去除重复元素
                            result = result.filter(e => e.parentId === topLevel);
                            this.materialCategoryIdList = result;
                        }
                    }
                })
            },
            //选择材料类别
            selectMaterialCategoryId(value, record) {
                let key = record.key;
                const newData = [...this.data];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target.materialCategoryId = value;
                    this.data = newData
                }
            },
            //入库数量
            inNumberChange(value, record) {
                console.log(value)
                const newData = [...this.data]
                const target = newData.filter(item => record.key === item.key)[0]
                if (target && value) {
                    target.inNumber = value
                    record.afterAmount = record.amount + value;
                    record.totalPrice = record.unitPrice * value;
                    this.data = newData
                }
            },
            //获取仓库信息
            storehouseIdData() {
                http.post(dataUrl.getStorehouseId, {}).then(res => {
                    console.log(res)
                    if (res.state) {
                        if (res.data) {
                            let data = [];
                            res.data.forEach(e => {
                                data.push({
                                    key: e.id,
                                    label: e.name,
                                })
                            });
                            this.storehouseIdList = data;
                        }
                    }
                })
            },
            //入库仓库
            storehouseIdChange(value, record){
                console.log(value)
                let key = record.key;
                const newData = [...this.data];
                const target = newData.filter(item => key === item.key)[0];
                if (target) {
                    target.storehouseId = value;
                    this.data = newData
                }
            },
            //入库时间
            inDateChange(value, key) {
                const newData = [...this.data]
                const target = newData.filter(item => key === item.key)[0]
                if (target) {
                    target.inDate = value;
                    this.data = newData
                }
            },
            //签收人
            signPeopleChange(value, key) {
                const newData = [...this.data]
                const target = newData.filter(item => key === item.key)[0]
                if (target) {
                    target.signPeople = value
                    this.data = newData
                }
            },
            //备注
            remarksChange(value, key) {
                const newData = [...this.data]
                const target = newData.filter(item => key === item.key)[0]
                if (target) {
                    target.remarks = value
                    this.data = newData
                }
            },
            //新增数据
            newMember() {
                const length = this.data.length;
                this.data.push({
                    key: length === 0 ? '1' : (parseInt(this.data[length - 1].key) + 1).toString(),
                    name: null,
                    modelNumber: null,
                    supplierName: null,
                    producer: null,
                    unitPrice: null,
                    materialCategoryId: null,
                    storehouseId: null,
                    amount: 0,
                    inNumber: null,
                    signPeople: null,
                    afterAmount: null,
                    totalPrice: 0,
                    inDate: moment(new Date(), 'YYYY-MM-DD'),
                    editable: true,
                    isNew: true,
                    dataSourceName: [],
                    dataSourceNumber: [],
                    dataSourceSupplier: []
                });
            },
            //删除此行
            remove(key) {
                const data = [...this.data]
                this.data = data.filter(item => item.key !== key);
                // this.count = this.count - 1;
            },
            checkDatas(paramsItem) {
                console.log(paramsItem);
                for ( var key in paramsItem ){
                    if (!paramsItem[key].name || !paramsItem[key].modelNumber || !paramsItem[key].supplierName || !paramsItem[key].materialCategoryId || !paramsItem[key].storehouseId || !paramsItem[key].inNumber || !paramsItem[key].inDate || !paramsItem[key].signPeople || !paramsItem[key].producer || !paramsItem[key].unitPrice){
                        this.problemsStatus = true;
                    } else  {
                       this.problemsStatus = false; 
                    }
                }
            },
            //保存
            save() {
                const paramsItem = [...this.data]
                this.checkDatas(paramsItem);
                if (this.problemsStatus == false && paramsItem.length > 0) {
                    let paramsData = paramsItem.map(item => ({
                        name: item.name,
                        modelNumber: item.modelNumber,
                        supplierName: item.supplierName,
                        producer: item.producer,
                        unitPrice: item.unitPrice,
                        materialCategoryId: parseInt(item.materialCategoryId.slice(-1).toString()),
                        storehouseId: item.storehouseId,
                        inNumber: item.inNumber,
                        inDate: item.inDate.format('YYYY-MM-DD'),
                        signPeople: item.signPeople,
                        remarks: item.remarks ? item.remarks : null
                    }));
                    http.post(dataUrl.getAddData,paramsData).then(res => {
                        if (res.state) {
                            message.success('保存成功');
                            clearTimeout(this.timeout);
                            this.timeout = setTimeout(() => {
                                this.$router.push({name:'intoStorageList',params:{}})
                            }, 300);
                        } else {
                            message.warning(res.message)
                        }
                    })
                }
            },
            backLastPage() {
                this.$router.push({name:'intoStorageList',params:{}})
            }
        }
    }
</script>

<style>
    .ant-table.ant-table-bordered .ant-table-footer {
        border: none;
        padding: 0px;
    }

    .errorTips {
        color: #f5222d;
        padding-left: 20px;
    }
</style>
