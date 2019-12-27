<template>
    <a-form :form="form" :style="{ marginTop: '8px' }" @submit="handleSubmit">
        <a-form-item label="仓库名" v-bind="formItemLayout">
            <a-input placeholder="请输入仓库名"
                     v-decorator="['name',{ initialValue:formData.name,rules: [{ required: true, message: '请输入仓库名' }] }]"
            />
        </a-form-item>
        <a-form-item label="仓库编码" v-bind="formItemLayout">
            <a-input placeholder="请输入仓库编码"
                     v-decorator="['code',{ initialValue:formData.code,rules: [{ required: true, message: '请输入仓库编码' }] }]"
            />
        </a-form-item>
        <a-form-item label="负责人信息" v-bind="formItemLayout">
            <a-input placeholder="请输入负责人信息"
                     v-decorator="['responsePeople',{ initialValue:formData.responsePeople,rules: [{ required: true, message: '请输入负责人信息' }] }]"
            />
        </a-form-item>
        <a-form-item label="管理员" v-bind="formItemLayout">
            <a-input placeholder="请输入管理员"
                     v-decorator="['admin',{ initialValue:formData.admin,rules: [{ required: true, message: '请输入管理员' }] }]"
            />
        </a-form-item>
        <a-form-item label="是否启用仓库" v-bind="formItemLayout">
            <a-radio-group
                    @change="onChangeUserType"
                    v-decorator="['status',{ initialValue:formData.status,rules: [{ required: true, message: '请选择是否启用仓库' }] }]"
            >
                <a-radio value='START'>启用</a-radio>
                <a-radio value='STOP'>停止</a-radio>
            </a-radio-group>
        </a-form-item>
        <a-form-item label="是否是默认仓库（默认仓库是唯一的）" v-bind="formItemLayout">
            <a-radio-group
                    @change="onChangeDefault"
                    v-decorator="['isDefault',{ initialValue:formData.isDefault,rules: [{ required: true, message: '请选择是否是默认仓库' }] }]"
            >
                <a-radio value='YES'>是</a-radio>
                <a-radio value='NO'>否</a-radio>
            </a-radio-group>
        </a-form-item>        
        <a-form-item v-bind="submitFormLayout" :style="{marginTop:'8px'}">
            <a-button type="primary" htmlType="submit" :loading="submitting">提交</a-button>
            <a-button :style="{marginLeft:'20px'}" @click="cancel">返回</a-button>
        </a-form-item>
    </a-form>
</template>

<script>
    import {Form,Input,Radio,Button,message} from 'ant-design-vue'
    import http from '@/utils/http'
    const dataUrl = {
        getDataById: '/api/gm-storehouse/get',
        getAddData: '/api/gm-storehouse/add',
        getUpdateData: '/api/gm-storehouse/update',
    }
    export default {
        name: "WarehouseEdit",
        components:{
            AForm:Form,
            AFormItem:Form.Item,
            AInput:Input,
            ARadio:Radio,
            ARadioGroup:Radio.Group,
            AButton:Button
        },
        data (){
            return{
                formItemLayout: {
                    labelCol: {
                        xs: {span: 24},
                        sm: {span: 7},
                    },
                    wrapperCol: {
                        xs: {span: 24},
                        sm: {span: 12},
                        md: {span: 10},
                    },
                },
                submitFormLayout: {
                    wrapperCol: {
                        xs: {span: 24, offset: 0},
                        sm: {span: 10, offset: 7},
                    },
                },
                formData:{
                    id: this.$route.query.id,
                    name:null,
                    code:null,
                    responsePeople:null,
                    admin:null,
                    status:'START',
                    isDefault: 'NO'
                },
                submitting:false,
                visible: false
            }
        },
        beforeCreate(){
            this.form  = this.$form.createForm(this)
        },
        mounted() {
            // 存在id则表明是更新编辑不是新增
            if (this.$route.query.id) {
                this.loader()
            }
        },
        methods:{
            //加载数据
            loader() {
                if (this.formData.id) {
                    http.post(dataUrl.getDataById, {id: this.formData.id}).then(res => {
                        if (res.state) {
                            this.formData = {
                                id: res.data ? res.data.id : null,
                                name: res.data.name || null,
                                code: res.data.code || null,
                                status: res.data.status || 'START',
                                isDefault: res.data.isDefault || 'NO',
                                admin: res.data.admin ? res.data.admin :null,                                
                                responsePeople: res.data.responsePeople || null,
                            }
                        } else {
                            message.warning(res.message)
                        }
                    })
                }
            },
            //保存
            handleSubmit(){
                this.form.validateFields((err,values)=>{
                    if (!err){
                        this.submitting = false
                        // 存在id表示编辑跟新， 不存在表示新增
                        let url = this.formData.id ? dataUrl.getUpdateData : dataUrl.getAddData
                        http.post(url,{
                            id: this.formData.id || null,
                            name: values.name || null,
                            code: values.code || null,
                            admin: values.admin || null,
                            status: values.status || null,
                            isDefault: values.isDefault || null,                            
                            responsePeople: values.responsePeople || null
                        }).then(res=>{
                            if (res.state) {
                                message.success(res.message)
                                this.$router.push({ name: 'warehouseList' })
                            }else {
                                message.warning(res.message)
                            }
                            this.submitting = false
                        })
                    }
                })
            },
            onChangeUserType(e) {
                this.formData.type = e.target.value
            },
            onChangeDefault(e) {
                this.formData.isDefault = e.target.value;
            },
            //返回
            cancel (){
                this.$router.push({name:'warehouseList'})
            }
        }
    }
</script>

<style scoped>

</style>
