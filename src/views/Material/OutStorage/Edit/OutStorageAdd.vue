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
                        :scroll="{ x: 1800}"
                        :loading="memberLoading"
                        bordered
                        class="outStorageTable"
                    >
                        <span slot="nameTitle"><span style="color: red">*</span> 材料名称</span>

                        <span slot="modelNumberTitle"><span style="color: red">*</span> 型号</span>

                        <span slot="producerTitle"><span style="color: red">*</span> 生产厂家</span>

                        <span slot="materialCategoryIdTitle"><span style="color: red">*</span> 材料类别</span>

                        <span slot="amountTitle"><span style="color: red">*</span> 库存总数</span>

                        <span slot="outNumberTitle"><span style="color: red">*</span> 出库数量</span>

                        <span slot="storehouseIdTitle"><span style="color: red">*</span> 出库仓库</span>

                        <span slot="afterAmountTitle"><span style="color: red">*</span> 出库后总数</span>

                        <span slot="outDateTitle"><span style="color: red">*</span> 出库时间</span>

                        <span slot="usedTeamTitle"><span style="color: red">*</span> 领用班组</span>

                        <template slot="name" slot-scope="text,record">
                            <a-select 
                                style="width:100%" 
                                :value="text"
                                showSearch
                                placeholder=""
                                :defaultActiveFirstOption="false"
                                :showArrow="false"
                                :filterOption="false"
                                :notFoundContent="null"
                                @search="handleSearchName"
                                @change="e => nameChange(e, record)"
                            >
                                <a-select-option 
                                    v-for="(item,index) in dataSourceName" 
                                    :key="index"
                                    :value='item'
                                >
                                    {{item}}
                                </a-select-option>
                            </a-select>
                        </template>

                        <template slot="modelNumber" slot-scope="text,record">
                            <a-select 
                                style="width:100%" 
                                :value="text"
                                showSearch
                                placeholder=""
                                :showArrow="false"
                                @change="e => modelNumberChange(e, record)"
                            >
                                <a-select-option 
                                    v-for="(item,index) in dataSourceNumber" 
                                    :key="index"
                                    :value='item.label'
                                >
                                    {{item.label}}
                                </a-select-option>
                            </a-select>
                        </template>

                        <template slot="producer" slot-scope="text,record">
                            <a-input 
                                :value="text" 
                                :disabled="true"
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
                                :disabled="true"
                            />
                        </template>

                        <template slot="amount" slot-scope="text,record" class="amounts">
                            <a-input-number
                                :min="0"
                                :value="text"
                                :precision="0"
                                :disabled="true"
                                style="width:90%;"
                            />
                            <a-popover placement="bottom">
                                <template slot="content">
                                    <p v-for="(item,index) in record.amountDatas" :key="index" style="line-height:20px; margin-bottom:10px;">{{item.storehouse.name}}: {{item.amount}}</p>
                                </template>
                                <a-icon type="info-circle" v-show="record.amountDatas.length > 1" style="color: #ff6600;padding-left:5px;cursor:pointer;" />
                            </a-popover>
                        </template>

                        <template slot="outNumber" slot-scope="text,record">
                            <a-input-number
                                :min="0"
                                :max="maxOutNumber"
                                :value="text"
                                :precision="0"
                                @change="e => outNumberChange(e, record)"
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
                                    v-for="(item,index) in record.storehouseIdList" 
                                    :key="index"
                                    :value='item.key'
                                >
                                    {{item.label}}
                                </a-select-option>
                            </a-select>
                        </template>

                        <template slot="outDate" slot-scope="text,record">
                            <a-date-picker 
                                :value="text" 
                                @change="e => outDateChange(e, record.key)"
                            >
                            </a-date-picker>
                        </template>

                        <template slot="usedTeam" slot-scope="text,record">
                            <a-input 
                                :value="text"
                                @change="e => usedTeamChange(e.target.value, record.key)"
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
    import {
        Modal,
        Form,
        Row,
        Col,
        Input,
        DatePicker,
        Select,
        Table,
        Button,
        Divider,
        Popconfirm,
        InputNumber,
        Cascader,
        message,
        AutoComplete,
        Popover,
        Icon
    } from 'ant-design-vue'
    import moment from 'moment'
    import http from '../../../../utils/http'
    import TableUtil from '../../../../utils/TableUtil'
    import debounce from 'lodash/debounce'

    const dataUrl = {
        getAddData: '/api/gm-inventory-out/batchAdd',//新增数据
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
            width: 185,
            scopedSlots: {customRender: 'name'}
        },
        {
            slots: {title: 'modelNumberTitle'},
            dataIndex: 'modelNumber',
            align: 'center',
            width: 150,
            scopedSlots: {customRender: 'modelNumber'}
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
            width: 160,
            scopedSlots: {customRender: 'materialCategoryId'}
        },
        {
            slots: {title: 'amountTitle'},
            dataIndex: 'amount',
            align: 'center',
            width: 150,
            scopedSlots: {customRender: 'amount'}
        },
        {
            slots: {title: 'outNumberTitle'},
            dataIndex: 'outNumber',
            key: 'outNumber',
            align: 'center',
            width: 120,
            scopedSlots: {customRender: 'outNumber'}
        },
        {
            slots: {title: 'storehouseIdTitle'},
            dataIndex: 'storehouseId',
            key: 'storehouseId',
            align: 'center',
            width: 160,
            scopedSlots: {customRender: 'storehouseId'}
        },
        {
            slots: {title: 'afterAmountTitle'},
            dataIndex: 'afterAmount',
            key: 'afterAmount',
            align: 'center',
            width: 120,
            scopedSlots: {customRender: 'afterAmount'}
        },
        {
            slots: {title: 'outDateTitle'},
            dataIndex: 'outDate',
            key: 'outDate',
            align: 'center',
            width: 150,
            scopedSlots: {customRender: 'outDate'}
        },
        {
            slots: {title: 'usedTeamTitle'},
            dataIndex: 'usedTeam',
            key: 'usedTeam',
            align: 'center',
            width: 150,
            scopedSlots: {customRender: 'usedTeam'}
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
            width: 75,
            fixed: 'right',
            scopedSlots: {customRender: 'operation'}
        }];

    export default {
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        name: "OutStorageAdd",
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
            AAutoComplete: AutoComplete,
            APopover: Popover,
            AIcon: Icon
        },
        data() {
            return {
                materialCategoryIdList: [],//材料类别
                memberLoading: false,
                columns,
                data: [{
                    key: '1',
                    name: null,
                    modelNumber: null,
                    producer: null,
                    materialCategoryId: null,
                    storehouseId: null,
                    amount: 0,
                    outNumber: null,
                    afterAmount: null,
                    outDate: moment(new Date(), 'YYYY-MM-DD'),
                    usedTeam: null,
                    editable: true,
                    isNew: true,
                    amountDatas: [],
                    storehouseIdList: []//入库仓库
                }],
                maxOutNumber: 0,
                problemItems: [],
                problemsStatus: false,
                dataSourceName: [],
                dataSourceNumber: []
            }
        },
        mounted() {
            // this.loader();
            this.initMaterialCategoryId();//获取材料类别
            // this.storehouseIdData();//获取仓库信息
        },
        methods: {

            nameChange(value, record) {
                const newData = [...this.data];
                const target = newData.filter(item => record.key === item.key)[0];
                if (target) {
                    target.name = value;
                    this.data = newData;
                    if(value.trim().length > 0) {
                        record.modelNumber = null;
                        record.producer = null;
                        record.materialCategoryId = null;
                        record.amount = 0;
                        this.maxOutNumber = 0;
                        record.afterAmount = null;
                        record.storehouseId = null;
                        record.amountDatas = [];
                        record.storehouseIdList = [];
                        clearTimeout(this.timeout);
                        this.timeout = setTimeout(() => {
                            http.post(dataUrl.getModelNumberList, {
                                name: value
                            }).then(res => {
                                if (res.state) {
                                    let data = [];
                                    res.data.forEach((e,index) => {
                                        data.push({
                                            key: index,
                                            label: e.modelNumber,
                                        })
                                    });
                                    this.dataSourceNumber = data;
                                    if(this.dataSourceNumber.length === 1) {
                                        record.modelNumber = this.dataSourceNumber[0].label;
                                        this.modelNumberChange(record.modelNumber, record);
                                    }
                                }
                            })
                        }, 100);
                    }
                }
            },
            handleSearchName(value) {
                if(value.trim().length > 0) {
                    clearTimeout(this.timeout);
                    this.timeout = setTimeout(() => {
                        http.post(dataUrl.getDataBySearch, {
                            name: value
                        }).then(res => {
                            if (res.state) {
                                let data = this.filterItems(res.data);
                                //去重
                                let newArr = new Set(data);
                                this.dataSourceName = [...newArr];
                            }
                        })
                    }, 100);
                }
            },
            filterItems(data) {
                const arr = [];              
                data.forEach(item => {          
                    const tmp = { ...item };                        
                    arr.push(tmp.material.name);             
                })             
                return arr;
            },
            //型号
            modelNumberChange(value, record) {
                const newData = [...this.data];
                const target = newData.filter(item => record.key === item.key)[0];
                if (target) {
                    target.modelNumber = value;
                    this.data = newData;
                    if(record.name.trim() && record.modelNumber.trim()) {
                        record.materialCategoryId = null;
                        record.producer = null;
                        record.amount = 0;
                        this.maxOutNumber = 0;
                        record.afterAmount = null;
                        record.storehouseId = null;
                        record.key = record.key
                        record.amountDatas = [];
                        record.storehouseIdList = [];
                        clearTimeout(this.timeout);
                        this.timeout = setTimeout(() => {
                            http.post(dataUrl.getDataBySearch, {
                                name: record.name,
                                modelNumber: record.modelNumber
                            }).then(res => {
                                if (res.state) {
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
                                            this.storehouseIdData(tmp.storehouses,record);
                                            record.amountDatas = tmp.storehouses;
                                            record.materialCategoryId = mId;
                                            record.amount = tmp.material.amount;
                                            record.afterAmount = tmp.material.amount;
                                            record.storehouseId = tmp.storehouses[0].storehouse.id;
                                            record.key = record.key;
                                            this.maxOutNumber = tmp.material.amount;
                                        }                                    
                                    })
                                }
                            })
                            http.post(dataUrl.getSupplierByMaterial, {
                                name: record.name,
                                modelNumber: record.modelNumber
                            }).then(res => {
                                if (res.state && res.data && res.data.material) {
                                    record.producer = res.data.material.producer ? res.data.material.producer : null;
                                }
                            })
                        }, 300);
                    }
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
            //出库数量
            outNumberChange(value, record) {
                console.log(value)
                const newData = [...this.data]
                const target = newData.filter(item => record.key === item.key)[0]
                if (target && value) {
                    target.outNumber = value
                    record.afterAmount = record.amount - value;
                    this.data = newData
                }
            },
            //获取仓库信息
            storehouseIdData(datas,record) {
                let data = [];
                datas.forEach(e => {
                    data.push({
                        key: e.storehouse.id,
                        label: e.storehouse.name,
                    })
                });
                record.storehouseIdList = data;
            },
            //出库仓库
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
            //出库时间
            outDateChange(value, key) {
                const newData = [...this.data]
                const target = newData.filter(item => key === item.key)[0]
                if (target) {
                    target.outDate = value;
                    this.data = newData
                }
            },
            //签收人
            usedTeamChange(value, key) {
                const newData = [...this.data]
                const target = newData.filter(item => key === item.key)[0]
                if (target) {
                    target.usedTeam = value
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
                    producer: null,
                    materialCategoryId: null,
                    storehouseId: null,
                    amount: 0,
                    outNumber: null,
                    afterAmount: null,
                    outDate: moment(new Date(), 'YYYY-MM-DD'),
                    usedTeam: null,
                    editable: true,
                    isNew: true,
                    amountDatas: [],
                    storehouseIdList: []
                });
            },
            //删除此行
            remove(key) {
                const data = [...this.data]
                this.data = data.filter(item => item.key !== key);
            },
            checkDatas(paramsItem) {
                console.log(paramsItem);
                for ( var key in paramsItem ){
                    if (!paramsItem[key].name || !paramsItem[key].modelNumber || !paramsItem[key].materialCategoryId || !paramsItem[key].storehouseId || !paramsItem[key].outNumber || !paramsItem[key].outDate || !paramsItem[key].usedTeam){
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
                        materialCategoryId: parseInt(item.materialCategoryId.slice(-1).toString()),
                        storehouseId: item.storehouseId,
                        outNumber: item.outNumber,
                        outDate: item.outDate.format('YYYY-MM-DD'),
                        usedTeam: item.usedTeam,
                        remarks: item.remarks ? item.remarks : null
                    }));
                    http.post(dataUrl.getAddData,paramsData).then(res => {
                        if (res.state) {
                            message.success('保存成功');
                            clearTimeout(this.timeout);
                            this.timeout = setTimeout(() => {
                                this.$router.push({name:'outStorageList',params:{}})
                            }, 300);
                        } else {
                            message.warning(res.message)
                        }
                    })
                }
            },
            backLastPage() {
                this.$router.push({name:'outStorageList',params:{}})
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
