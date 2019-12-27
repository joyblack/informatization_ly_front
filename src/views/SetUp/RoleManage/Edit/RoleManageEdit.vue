<template>
    <a-modal
            :title="this.title"
            :visible="visible"
            @ok="handleSubmit"
            @cancel="handleCancel"
            :destroyOnClose="true"
            :confirmLoading="confirmLoading"
            :afterClose='afterClose'
            :closable="false"
            :maskClosable="true"
            :keyboard="true"
    >
        <a-form :form="form" :style="{ marginTop: '8px' }">
            <a-form-item label="角色名称" v-bind="formItemLayout">
                <a-input placeholder="请输入角色名称！"
                         allowClear
                         v-decorator="['name',{ initialValue:formData.name,rules: [{ required: true, message: '请输入角色名称！' }] }]"
                />
            </a-form-item>
            <a-form-item>
                <a-tree
                        checkable
                        :autoExpandParent="autoExpandParent"
                        v-model="checkedKeys"
                        @check="onCheck"
                        :treeData="treeData"
                        :defaultExpandAll="defaultExpandAll"
                        v-decorator="['permissions',{ initialValue:formData.permissions,rules: [] }]"
                />
            </a-form-item>
        </a-form>
    </a-modal>
</template>

<script>
    import {Modal, Form, Button, Input, Select, Icon, Tooltip, Radio, Tree, message} from 'ant-design-vue'
    import http from '../../../../utils/http'

    const dataUrl = {
        getTree: '/api/system-resource/getTree',//获取资源权限
        getAddData: '/api/system-role/add',//添加角色
        getById: '/api/system-role/get',//根据id获取数据
        getUpdate: '/api/system-role/update'//编辑数据

    };
    export default {
        components: {
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
            ATree: Tree,
        },
        name: 'RoleManageEdit',
        beforeCreate() {
            this.form = this.$form.createForm(this)
        },
        mounted() {
        },
        data() {
            return {
                formData: {
                    id: null,
                    name: null,
                    permissions: null,
                },
                title: '新增角色',
                visible: false,
                confirmLoading: false,
                treeData: [{title: '权限资源', key: 0, id: 0}],
                checkedKeys: [],
                halfCheckedKeys: [],
                autoExpandParent: true,
                defaultExpandAll: true,
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
            //打开弹窗
            openModal(record) {
                this.visible = true;
                if (record) {
                    this.title = "编辑" + record.name + "信息";
                    this.formData.id = record.id;
                    this.loadTreeData();
                } else {
                    this.title = "新建角色";
                    this.loadTreeData()
                }
            },

            //新增、修改
            handleSubmit() {

                this.form.validateFields(
                    (err, values) => {
                        if (!err) {
                            //判断是否存在id
                            if (this.formData.id) {
                                this.confirmLoading = true;
                                http.post(dataUrl.getUpdate, {
                                    id: this.formData ? this.formData.id : null,
                                    name: values ? values.name : null,
                                    permissions: this.checkedKeys instanceof Array ? this.checkedKeys : null,
                                }).then(res => {
                                    if (res.state) {
                                        this.formData = {
                                            id: res.data ? res.data.id : null,
                                            name: res.data ? res.data.name : null,
                                            permissions: res.data ? res.data.permissions : null,
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
                                    name: values ? values.name : null,
                                    permissions: this.checkedKeys instanceof Array ? this.checkedKeys : null,
                                }).then(res => {
                                    if (res.state) {
                                        this.formData = {
                                            id: res.data ? res.data.id : null,
                                            name: res.data ? res.data.name : null,
                                            permissions: res.data ? res.data.permissions : null,
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
            loadTreeData() {
                http.post(dataUrl.getTree, {
                    id: '0',
                }).then((res) => {
                    if (res.state) {
                        this.treeData = [];
                        let tData = res.data; //获取后台返回数据
                        let next = [...tData];//存入数据
                        let result = [];//定义空数组
                        //将数行数组转为一维数组
                        while (next.length) {
                            //遍历数组，重新赋值
                            result.push(...next.map(m => ({
                                id: m.id,
                                key: m.id,
                                title: m.resourceAliasName,
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
                        result = result.filter(e => e.parentId === 0);
                        let data = [{title: '权限资源', key: 0, id: 0, children: result}];
                        this.treeData = data
                    }
                }).then(() => {
                    this.loader()
                })
            },
            //加载数据
            loader() {
                if (this.formData.id) {
                    http.post(dataUrl.getById, {id: this.formData.id}).then(res => {
                        if (res.state) {
                            let str = res.data.permissions ? res.data.permissions.split(',') : null;
                            let resourceData = [];
                            for (let i in str) {
                                resourceData.push(Number(str[i]))//字符串转Number类型
                            }
                            this.checkedKeys = resourceData;
                            this.formData = {
                                id: res.data ? res.data.id : null,
                                name: res.data ? res.data.name : null,
                            };
                        }
                    })
                }
            },
            //选择资源
            onCheck(checkedKeys) {
                this.checkedKeys = checkedKeys;

                // this.checkedKeys = checkedKeys.checked;
                // let halfCheckedKeys = info.halfCheckedKeys; //获取当前选中父级节点ID
                // let resourceArr = this.checkedKeys.concat(halfCheckedKeys);//合并当前选择选择及父级节点
                // if (resourceArr.length === 40) {//判断是否全选
                //     this.halfCheckedKeys = resourceArr
                // } else {
                //     this.halfCheckedKeys = resourceArr.filter(t => t !== 0)//如果不是全选，去掉爷爷级节点，0
                // }
            },
            //取消
            handleCancel() {
                this.visible = false
            },
            //关闭
            afterClose() {
                //关闭置空表单
                this.formData.id = null;
                this.formData.name = null;
                this.formData.permissions = [];
                this.checkedKeys = [];
                this.visible = false;
                this.confirmLoading = false
            },

        }
    }
</script>

<style scoped>
    .gmsj-form-span {
        color: rgba(0, 0, 0, 0.45);
        font-style: normal;
    }
</style>
