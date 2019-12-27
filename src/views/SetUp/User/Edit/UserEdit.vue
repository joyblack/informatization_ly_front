<template>
    <a-modal
            :title="this.title"
            :visible="visible"
            @ok="handleSubmit"
            @cancel="cancel"
            :destroyOnClose="true"
            :confirmLoading="confirmLoading"
            :afterClose='afterClose'
            :closable="false"
            :maskClosable="true"
            :keyboard="true"
            :width="800"
    >
        <a-form :form="form" :style="{ marginTop: '8px' }">
            <a-form-item label="用户登陆名" v-bind="formItemLayout">
                <a-input placeholder="请输入用户登陆名"
                         allowClear
                         v-decorator="['loginName',{ initialValue:formData.loginName,rules: [{ required: true, message: '请输入用户登陆名' }] }]"
                />
            </a-form-item>
            <a-form-item v-bind="formItemLayout" v-if="!this.formData.id">
                <span slot="label">
                    密码
                    <span class="gmsj-form-span">
                     （选填）
                    </span>
                </span>
                <a-input placeholder="请输入密码"
                         allowClear
                         v-decorator="['password',{ initialValue:formData.password,rules: [] }]"
                />
            </a-form-item>
            <a-form-item v-bind="formItemLayout" v-if="!this.formData.id">
                <span slot="label">
                    确认密码
                    <span class="gmsj-form-span">
                     （选填）
                    </span>
                </span>
                <a-input placeholder="请输入确认密码"
                         allowClear
                         v-decorator="['affirmPassword',{ initialValue:formData.affirmPassword,rules: [{validator: affirmPassword,}] }]"
                />
            </a-form-item>
            <a-form-item v-bind="formItemLayout">
                <span slot="label">
                    部门
                    <span class="gmsj-form-span">
                     <a-tooltip title="部门">
                        <a-icon type="exclamation-circle"/>
                    </a-tooltip>
                    </span>
                </span>
                <a-cascader
                        :options="departmentList"
                        v-decorator="['departmentId',{initialValue:formData.departmentId,rules:[{required:true,message:'请选择部门!'}]}]"
                        @change="selectDepartment"
                        changeOnSelect
                        placeholder="请选择部门"
                />
            </a-form-item>
            <a-form-item v-bind="formItemLayout">
                <span slot="label">
                    电话号码
                    <span class="gmsj-form-span">
                     （选填）
                    </span>
                </span>
                <a-input placeholder="请输入电话号码"
                         allowClear
                         v-decorator="['phone',{ initialValue:formData.phone,rules: [{pattern:/(^1\d{10}$)|(^0\d{2,3}-?\d{7,8}$)/,
                                    message:'请输入正确电话号码！',}] }]"
                />
            </a-form-item>

            <a-form-item v-bind="formItemLayout">
            <span slot="label">
                用户姓名
                <span class="gmsj-form-span">
                 （选填）
                </span>
            </span>
                <a-input placeholder="请输入用户姓名"
                         allowClear
                         v-decorator="['username',{ initialValue:formData.username,rules:[] }]"
                />
            </a-form-item>

            <a-form-item v-bind="formItemLayout">
            <span slot="label">
                身份证号
                <span class="gmsj-form-span">
                 （选填）
                </span>
            </span>
                <a-input placeholder="请输入身份证号"
                         allowClear
                         v-decorator="['idNumber',{ initialValue:formData.idNumber,rules:[{pattern:/(^[1-9]\d{5}(18|19|([23]\d))\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{3}[0-9Xx]$)|(^[1-9]\d{5}\d{2}((0[1-9])|(10|11|12))(([0-2][1-9])|10|20|30|31)\d{2}[0-9Xx]$)/,
                                    message:'请输入正确身份证号！'}] }]"
                />
            </a-form-item>

            <a-form-item v-bind="formItemLayout">
            <span slot="label">
                备注
                <span class="gmsj-form-span">
                 （选填）
                </span>
            </span>
                <a-textarea placeholder="请输入备注" :rows="4"
                            v-decorator="['remarks',{ initialValue:formData.remarks,rules: [] }]"
                />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
    import {Modal, Form, Button, Input, Select, Icon, Tooltip, Radio, Cascader, message} from 'ant-design-vue'
    import http from '../../../../utils/http'
    import AInputPassword from "ant-design-vue/es/input/Password";

    const dataUrl = {
        getUpdateData: '/api/system-user/update',
        getDataById: '/api/system-user/get',//获取单条数据
        getAddData: '/api/system-user/add',//添加数据
        getDepartmentData: '/api/system-department/getTree',//获取部门
        departmentById: '/api/system-department/get',//获取部门详情
    };
    export default {
        components: {
            AInputPassword,
            AModal: Modal,
            AForm: Form,
            AFormItem: Form.Item,
            AButton: Button,
            AInput: Input,
            ATextarea: Input.TextArea,
            ASelect: Select,
            ASelectOption: Select.Option,
            AIcon: Icon,
            ATooltip: Tooltip,
            ARadio: Radio,
            ARadioGroup: Radio.Group,
            ACascader: Cascader,
        },
        name: 'UserEdit',
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        mounted() {
            this.loader();
            this.initDepartment()
        },
        data() {
            return {
                formData: {
                    id: this.$route.params.id,
                    loginName: null,
                    username: null,
                    password: null,
                    affirmPassword: null,
                    phone: null,
                    idNumber: null,
                    remarks: null,
                    userType: 'null',
                    department: {},//部门
                },
                title: '',
                visible: false,
                confirmLoading: false,
                departmentFetching: false,
                departmentList: [],
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
                }
            }
        },
        methods: {
            openModal(record) {
                this.visible = true;
                if (record) {
                    this.title = "修改" + record.loginName + "信息";
                    this.formData.id = record.id;
                    this.loader();
                    this.initDepartment()
                } else {
                    this.title = "新增";
                    this.initDepartment()

                }
            },
            //加载数据
            loader() {
                if (this.formData.id) {
                    http.post(dataUrl.getDataById, {id: this.formData.id}).then(res => {
                        if (res.state) {
                            let str = res.data.department ? res.data.department.path.split('-') : null;//拆分路径
                            // let strData = str.splice(1);//去掉顶级父级
                            for (let i in str) {
                                //去除空的数组
                                if (str[i] === "" || str[i] == null || typeof (str[i]) == "undefined") {
                                    str.splice(i, 1);
                                    i = i - 1;
                                }
                            }
                            let departmentArr = [];
                            for (let j in str) {
                                departmentArr.push(Number(str[j]))//字符串转Number类型
                            }

                            this.formData = {
                                id: res.data ? res.data.id : null,
                                loginName: res.data ? res.data.loginName : null,
                                departmentId: departmentArr ? departmentArr : null,
                                username: res.data ? res.data.username : null,
                                phone: res.data ? res.data.phone : null,
                                idNumber: res.data ? res.data.idNumber : null,
                                remarks: res.data ? res.data.remarks : null,
                            }
                        }
                    })
                }
            },
            //保存
            handleSubmit() {
                this.form.validateFields(
                    (err, values) => {
                        if (!err) {
                            if (this.formData.id) {
                                this.confirmLoading = true;
                                http.post(dataUrl.getUpdateData, {
                                    id: this.formData ? this.formData.id : null,
                                    loginName: values ? values.loginName : null,
                                    departmentId: values ? values.departmentId.slice(-1)[0] : null,
                                    username: values ? values.username : null,
                                    phone: values ? values.phone : null,
                                    idNumber: values ? values.idNumber : null,
                                    remarks: values ? values.remarks : null,
                                }).then(res => {
                                    if (res.state) {
                                        this.formData = {
                                            id: res.data ? res.data.id : null,
                                            loginName: res.data ? res.data.loginName : null,
                                            username: res.data ? res.data.username : null,
                                            phone: res.data ? res.data.phone : null,
                                            idNumber: res.data ? res.data.idNumber : null,
                                            remarks: res.data ? res.data.remarks : null,
                                        };
                                        message.success(res.message);
                                        this.$parent.loader();
                                        this.visible = false;

                                    } else {
                                        message.warning(res.message)
                                    }
                                    this.confirmLoading = false
                                })
                            } else {
                                this.confirmLoading = true;
                                http.post(dataUrl.getAddData, {
                                    id: this.formData ? this.formData.id : null,
                                    loginName: values ? values.loginName : null,
                                    departmentId: values ? values.departmentId.slice(-1)[0] : null,
                                    username: values ? values.username : null,
                                    password: values ? values.password : null,
                                    affirmPassword: values ? values.affirmPassword : null,
                                    phone: values ? values.phone : null,
                                    idNumber: values ? values.idNumber : null,
                                    remarks: values ? values.remarks : null,
                                }).then(res => {
                                    if (res.state) {
                                        this.formData = {
                                            id: res.data ? res.data.id : null,
                                            loginName: res.data ? res.data.loginName : null,
                                            username: res.data ? res.data.username : null,
                                            password: res.data ? res.data.password : null,
                                            affirmPassword: res.data ? res.data.affirmPassword : null,
                                            phone: res.data ? res.data.phone : null,
                                            idNumber: res.data ? res.data.idNumber : null,
                                            remarks: res.data ? res.data.remarks : null,
                                        };
                                        message.success(res.message);
                                        this.$parent.loader();
                                        this.visible = false;

                                    } else {
                                        message.warning(res.message)
                                    }
                                    this.confirmLoading = false
                                })
                            }
                        }
                    },
                )
            },
            //确认密码
            affirmPassword(rule, value, callback) {
                const form = this.form;
                if (value && value !== form.getFieldValue('password')) {
                    callback('确认密码与新密码不一致');
                } else {
                    callback();
                }
            },
            //部门选择
            initDepartment() {
                http.post(dataUrl.getDepartmentData, {
                    id: '0'
                }).then(res => {
                    if (res.state) {
                        if (res.state) {
                            if (res.data) {
                                let topLevel = res.data[0] ? res.data[0].parentId : null; // 获取顶级父级
                                this.departmentList = [];
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
                                    if (parentId === 0) {
                                        //判断如果为顶层id 0 不做操作
                                    } else {
                                        result.forEach(d => {
                                            //遍历数组，如果id = 父级id
                                            if (d.id === parentId) {
                                                let childArray = d.children;//新建子级数组
                                                if (!childArray) {
                                                    childArray = []
                                                }
                                                childArray.push(e);
                                                d.children = childArray
                                            }
                                        })
                                    }
                                });
                                //去除重复元素
                                result = result.filter(e => e.parentId === topLevel);
                                this.departmentList = result;
                            }
                        }
                    }
                })
            },
            selectDepartment(value) {
                // this.formData.drillTeamId = value.pop()
            },
            //取消
            cancel() {
                this.visible = false
            },
            afterClose() {
                //关闭置空表单
                this.formData.id = null;
                this.formData.departmentId = [];
                this.formData.loginName = null;
                this.formData.username = null;
                this.formData.idNumber = null;
                this.formData.password = null;
                this.formData.affirmPassword = null;
                this.formData.phone = null;
                this.formData.remarks = null;
                this.visible = false;
                this.confirmLoading = false
            }
        }
    }
</script>

<style scoped>
    .gmsj-form-span {
        color: rgba(0, 0, 0, 0.45);
        font-style: normal;
    }
</style>
