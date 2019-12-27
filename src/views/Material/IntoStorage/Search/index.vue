<template>
    <a-form :form="form" @submit="search" layout='inline' v-else>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginBottom:'20px'}">
            <a-col :md="8" :sm='24'>
                <a-form-item label="材料名称" :label-col="{ span: 7 }" :wrapper-col="{ span: 17  }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-input placeholder=""
                        v-decorator="['name']"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="材料类别" :label-col="{ span: 7 }" :wrapper-col="{ span: 17  }" :style="{width: '100%'}" v-bind="formItemLayout">
                  <a-cascader 
                    :options="materialCategoryList ? materialCategoryList : null" 
                    placeholder="" 
                    v-decorator="[
                        'materialCategoryId']"
                  />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="型号" :label-col="{ span: 7 }" :wrapper-col="{ span: 17  }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-input placeholder=""
                             v-decorator="['modelNumber']"
                    />
                </a-form-item>
            </a-col>            
        </a-row>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginBottom:'20px'}">
            <a-col :md="8" :sm='24'>
                <a-form-item label="供货人/供货商" :label-col="{ span: 7 }" :wrapper-col="{ span: 17  }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-input placeholder=""
                      v-decorator="['supplier']"
                    />
                    <!-- <a-select v-decorator="['supplierId']">
                      <a-select-option 
                        :value="item.id" 
                        v-for="(item, index) in supplierList" :key="index">
                        {{item.name}}</a-select-option>
                    </a-select> -->
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="生产厂家" :label-col="{ span: 7 }" :wrapper-col="{ span: 17  }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-input placeholder=""
                        v-decorator="['producer']"
                    />                    
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="库房名称" :label-col="{ span: 7 }" :wrapper-col="{ span: 17  }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-select v-decorator="['storehouseId']">
                      <a-select-option 
                        :value="item.id" 
                        v-for="(item, index) in searchOption.storehouse" :key="index">
                        {{item.name}}</a-select-option>
                    </a-select>                    
                </a-form-item>
            </a-col>                                 
        </a-row>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginBottom:'20px'}">
            <a-col :md="8" :sm='24'>
                <a-form-item label="入库时间" :label-col="{ span: 7 }" :wrapper-col="{ span: 17  }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-range-picker style="width:100%;"
                        v-decorator="['inDate']"
                    />                    
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24' style="display: flex; align-items: center;">
                <a-form-item label="单价范围(元)" :label-col="{ span: 11 }" :wrapper-col="{ span: 12  }" v-bind="formItemLayout" style="width: 60%; margin-right: 0; display: flex; justify-content: flex-end;">
                  <a-input-number 
                    style="width: 100%; text-align: center; margin-right: 0;" 
                    placeholder="" 
                    :min="0"
                    :precision="2"
                    v-decorator="[
                      'unitPriceStart',
                      { 
                        initialValue: unitPriceStart 
                      }
                    ]"
                    @change="e => unitPriceStartChange(e)"
                  />                    
                </a-form-item>
                <a-input
                  style=" width: 40px; border: 0; text-align: center; pointer-events: none; backgroundColor: #fff"
                  placeholder="~"
                  disabled
                />
                <a-form-item style="width: 30%; margin-right: 0;">
                    <a-input-number 
                      style="width: 100%; text-align: center;" 
                      placeholder=""
                      :min="0" 
                      :precision="2"
                      v-decorator="[
                        'unitPriceEnd',
                        { 
                          initialValue: unitPriceEnd 
                        }
                      ]"
                      @change="e => unitPriceEndChange(e)"
                    />                    
                </a-form-item>
                <span class="errorTips" v-if="warnTips">该值不能小于"{{unitPriceStart}}"</span>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="签收人" :label-col="{ span: 7 }" :wrapper-col="{ span: 17  }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-input placeholder=""
                        v-decorator="['signPeople']"
                    />                    
                </a-form-item>
            </a-col>                               
        </a-row>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginBottom:'20px'}">
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
</template>

<script>
  import http from '@/utils/http'
  import { Button, Form, Row, Col, Input, InputNumber, Icon, message, Select, Cascader, DatePicker } from 'ant-design-vue'

  const dataUrl = {
    getMaterialTree: '/api/gm-material-category/getTree', // 获取材料类型下拉列表
    getStorehouse: '/api/gm-storehouse/getAllList', // 获取仓库下拉列表
    getSupplier: '/api/gm-supplier/getAllList', // 获取仓库下拉列表
  } 

  const defaultSearchValue = {
    name: null,
    modelNumber: null,
    storehouseId: null,
    materialCategoryId: null
  }

  const defaultOption = {
    storehouse: [],
    materialCategory: []
  }


  export default {
    components: {
      AForm: Form,
      AFormItem: Form.Item,
      ARow: Row,
      ACol: Col,
      AButton: Button,
      AInput: Input,
      AInputGroup: Input.Group,
      AInputNumber: InputNumber,
      AIcon: Icon,
      ASelect: Select,
      ASelectOption: Select.Option,
      ACascader: Cascader,
      ADatePicker: DatePicker,
      ARangePicker: DatePicker.RangePicker
    },
    name: 'InventoryStatisticsSearch',
    beforeCreate () {
      this.form = this.$form.createForm(this)
    },
    data () {
      return {
        expand: false,
        formItemLayout: {
          labelCol: {
            xs: { span: 24 },
            sm: { span: 4 },
          },
          wrapperCol: {
            xs: { span: 24 },
            sm: { span: 20 },
          },
        },
        materialCategoryList: [],
        supplierList: [],
        searchValue: defaultSearchValue,
        searchOption: defaultOption,
        unitPriceStart: null,
        unitPriceEnd: null,
        warnTips: false
      }
    },
    mounted () {
      this.getMaterialTree()
      this.getStorehouse()
    },
    methods: {
      search (e) {
        e.preventDefault();
        this.form.validateFields(
          (err, values) => {
            this.$parent.search(values)
          },
        )
      },
      resetSearch () {
        this.form.resetFields()
        this.$parent.search({})
        this.unitPriceStart = null
        this.unitPriceEnd = null
        this.warnTips = false
      },
      toggle () {
        this.expand = !this.expand
      },
      unitPriceStartChange(e) {
        this.unitPriceStart = e ? e : null;
        if(e > this.unitPriceEnd) {
          this.warnTips = true;
        } else {
          this.warnTips = false;
        }
      },
      unitPriceEndChange(e) {
        this.unitPriceEnd = e ? e : null;
        if(e < this.unitPriceStart) {
          this.warnTips = true;
        } else {
          this.warnTips = false;
        }
      },
      // 仓库信息下拉列表 - 全部
      getStorehouse () {
        http.post(dataUrl.getStorehouse, {}).then(res=>{
          if (res.state) {
            this.searchOption.storehouse = res.data
          } else {
            message.warning('获取仓库列表信息失败!')
          }
        })        
      },
      // 供应商
      getSupplier () {
        http.post(dataUrl.getSupplier, {}).then(res=>{
          if (res.state) {
            this.supplierList = res.data
          } else {
            message.warning(res.message)
          }
        })        
      },
      getMaterialTree() {
        http.post(dataUrl.getMaterialTree,{
            id: 0
        }).then(res => {
            if (res.state) {
                let data = this.filterItems(res.data);
                this.materialCategoryList = data;
            }
        })
      },
      filterItems(data) {
        const arr = []; 
        let obj = {};             
        data.forEach(item => {             
            const tmp = { ...item };
            obj = {             
                value: tmp.id,             
                label: tmp.name,               
            }             
            if (tmp.children) {            
                tmp.children = this.filterItems(tmp.children); 
                obj['children'] = tmp.children;                         
            }             
            arr.push(obj);             
        })             
        return arr;
      },      
    }
  }
</script>

<style scoped>
  .errorTips {
    position: absolute;
    top: 40px;
    right: 22px;
    color: #f5222d;
    padding-left: 20px;
  }
</style>
