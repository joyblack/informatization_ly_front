<template>
    <a-form :form="form" @submit="search" layout='inline' v-else>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginBottom:'20px'}">
            <a-col :md="8" :sm='24'>
                <a-form-item label="材料名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-input placeholder="请输入"
                             v-decorator="['name']"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="材料类别" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}" v-bind="formItemLayout">
                  <a-cascader 
                      :options="materialCategoryList ? materialCategoryList : null" 
                      placeholder="" 
                      v-decorator="[
                          'materialCategoryId']"
                  />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="库房名称" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-select v-decorator="['storehouseId']">
                      <a-select-option 
                        :value="item.id" 
                        v-for="(item, index) in storeHouseList" :key="index">
                        {{item.name}}</a-select-option>
                    </a-select>                    
                </a-form-item>
            </a-col>
        </a-row>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginBottom:'20px'}">
            <a-col :md="8" :sm='24'>
                <a-form-item label="型号" :label-col="{ span: 5 }" :wrapper-col="{ span: 19 }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-input placeholder="请输入"
                             v-decorator="['modelNumber']"
                    />
                </a-form-item>
            </a-col>
            <a-col :md="8" :sm='24'>
                <a-form-item label="生产厂家" :label-col="{ span: 5 }" :wrapper-col="{ span: 19  }" :style="{width: '100%'}" v-bind="formItemLayout">
                    <a-input placeholder=""
                        v-decorator="['producer']"
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
</template>

<script>
  import http from '@/utils/http'
  import { Button, Form, Row, Col, Input, Icon, message, Select, Cascader } from 'ant-design-vue'

  const dataUrl = {
    getMaterialTree: '/api/gm-material-category/getTree' // 获取材料类型下拉列表
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
      AIcon: Icon,
      ASelect: Select,
      ASelectOption: Select.Option,
      ACascader: Cascader
    },
    name: 'InventoryStatisticsSearch',
    beforeCreate () {
      this.form = this.$form.createForm(this)
    },
    created () {
      this.getMaterialTree()
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
        searchValue: defaultSearchValue
      }
    },
    props: {
      storeHouseList: Array
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
      },
      toggle () {
        this.expand = !this.expand
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
      }      
    }
  }
</script>

<style scoped>

</style>
