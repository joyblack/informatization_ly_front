<template>
    <a-modal
            title="设置权限"
            :visible="visible"
            @ok="handleOk"
            @cancel="handleCancel"
            :destroyOnClose="true"
            :confirmLoading="confirmLoading"
            :afterClose='afterClose'
            :closable="false"
            :maskClosable="true"
            :keyboard="true"
    >
        <a-table
                :columns="columns"
                :dataSource="tableData"
                :loading="loading"
                :pagination="pagination"
                :rowSelection="{selectedRowKeys: selectedRowKeys, onChange: onSelectChange}"
                bordered>
        </a-table>
        <a-tree
                checkable
                :autoExpandParent="autoExpandParent"
                v-model="checkedKeys"
                @check="onCheck"
                :treeData="treeData"
                :defaultExpandAll="defaultExpandAll"
        />
    </a-modal>
</template>

<script>
    import {Table, Button, Input, message, Modal, Tree} from 'ant-design-vue'
    import http from '../../../../../utils/http'
    import TableUtil from '../../../../../utils/TableUtil'

    const columns = [
        {
            title: '序号',
            dataIndex: 'key',
            align: 'center'
        }, {
            title: '角色名称',
            dataIndex: 'name',
            align: 'center'
        }];
    const dataMapping = {
        'id': 'String',
        'name': 'String',
        'permissions': 'String',
    };

    const dataUrl = {
        getAll: '/api/system-role/getPagerList',
        getResource: '/api/system-resource/getTree',//获取权限资源
        getResourceByUserId: '/api/system-user/get',//获取用户权限资源
        setAuthority: '/api/system-user/updatePermission'//设置用户权限资源
    };
    export default {
        components: {
            ATable: Table,
            AButton: Button,
            AInput: Input,
            AModal: Modal,
            ATree: Tree,
        },
        name: 'SetResource',
        data() {
            return {
                visible: false,
                confirmLoading: false,
                data: {},
                treeData: [{title: '权限资源', key: 0, id: 0}],
                treeDataLenght: null,
                checkedKeys: [],
                halfCheckedKeys: [],
                autoExpandParent: true,
                defaultExpandAll: true,
                pagination: {
                    showQuickJumper: true,
                    showSizeChanger: true,
                    pageSizeOptions: ['20', '40', '60', '80', '100'],
                    defaultPageSize: 20,
                    defaultCurrent: 1,
                    pageSize: 20,
                    total: 0,
                    onChange: this.paginationChange,
                    onShowSizeChange: this.paginationSizeChange,
                    showTotal: this.showTotal,
                },
                columns,
                tableData: null,
                selectedRowKeys: [],
                loading: true,
            }
        },
        mounted() {
        },
        methods: {
            openModal(record) {
                this.visible = true;
                this.data = record;
                this.loadData();
                this.loader();
            },
            //分页改变
            paginationChange(page, pageSize) {
                if (page && pageSize) {
                    //只有两个参数不为空时才调用
                    this.loader({
                        page: page,
                        size: pageSize,
                        username: this.searchValue.username ? this.searchValue.username : null,
                        phone: this.searchValue.phone ? this.searchValue.phone : null,
                        loginName: this.searchValue.loginName ? this.searchValue.loginName : null,
                        idNumber: this.searchValue.idNumber ? this.searchValue.idNumber : null,
                        remark: this.searchValue.remark ? this.searchValue.remark : null,
                    })
                }
            },
            //分页条数改变(current当前页码，size分页数量)
            paginationSizeChange(current, size) {
                if (current && size) {
                    //只有两个参数都不为空时才调用
                    this.loader({
                        page: current,
                        size: size,
                        username: this.searchValue.username ? this.searchValue.username : null,
                        phone: this.searchValue.phone ? this.searchValue.phone : null,
                        loginName: this.searchValue.loginName ? this.searchValue.loginName : null,
                        idNumber: this.searchValue.idNumber ? this.searchValue.idNumber : null,
                        remark: this.searchValue.remark ? this.searchValue.remark : null,
                    })
                }
            },
            showTotal(total) {
                return `总计: ${total} 条`
            },
            //加载数据
            loader(params) {
                this.loading = true;
                http.post(dataUrl.getAll, params ? params : {
                    page: this.pagination.defaultCurrent,
                    size: this.pagination.defaultPageSize
                }).then((res) => {
                    if (res.state) {
                        this.tableData = TableUtil.formatData(res.data.content, dataMapping);
                        this.pagination.total = res.data.totalElements;
                        this.loading = false
                    } else {
                        message.warning(res.message)
                    }
                })
            },
            //表格选择
            onSelectChange(selectedRowKeys, record) {
                this.selectedRowKeys = selectedRowKeys;
                if (record) {
                    let permissionsData = [];//创建空数组，用来保存选择的权限
                    for (let i in record) {
                        permissionsData.push(record[i].permissions)
                    }
                    if (permissionsData.length > 0) {
                        let str = permissionsData.join(',');//合并数组为一个字符串
                        let strArr = str.split(',');//拆分为数组
                        let permissionsData1 = [];
                        for (let j in strArr) {
                            permissionsData1.push(Number(strArr[j]))//将字符串转为Number类型
                        }
                        let nerarr = Array.from(new Set(permissionsData1));//数组去重
                        this.checkedKeys = nerarr;
                        // this.halfCheckedKeys = this.checkedKeys
                    } else {
                        this.checkedKeys = []
                    }
                }
            },
            //新增、保存
            handleOk() {
                if (this.data.id) {
                    this.confirmLoading = true;
                    http.post(dataUrl.setAuthority, {
                        id: this.data.id,
                        permission: this.checkedKeys ? this.checkedKeys : null,
                        roles: this.selectedRowKeys
                    }).then(res => {
                        if (res.state) {
                            message.success(res.message);
                            this.visible = false
                        } else {
                            message.warning(res.message)
                        }
                    });
                    this.confirmLoading = false
                } else {
                    message.warning(res.message)
                }
            },
            //取消
            handleCancel() {
                this.data = {};
                this.treeData = [{title: '权限资源', key: 0, id: 0}];
                this.checkedKeys = [];
                this.selectedRowKeys = [];
                this.visible = false;
                this.confirmLoading = false
            },
            //关闭清空
            afterClose() {
                this.data = {};
                this.treeData = [{title: '权限资源', key: 0, id: 0}];
                this.checkedKeys = [];
                this.selectedRowKeys = [];
                this.visible = false;
                this.confirmLoading = false
            },
            //加载全部权限资源
            loadData() {
                http.post(dataUrl.getResource, {
                    id: 0
                }).then(res => {
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
                                userType: m.userType,
                            })));
                            next = next
                                .filter(m => Array.isArray(m.children))
                                .reduce((all, m) => [...all, ...m.children], []);
                        }
                        this.treeDataLenght = result;
                        let arr = [];//定义空数组
                        for (let i in result) {
                            arr.push({
                                id: result[i].id,
                                key: result[i].id,
                                title: result[i].title,
                                parentId: result[i].parentId,
                                userType: result[i].userType,
                            })
                        }
                        let disabledArr = [];
                        //根据id判断合并数组
                        for (let u of result) {
                            const temp = arr.filter(i => i.id === u.id)[0];
                            disabledArr.push({...u, ...temp});
                        }
                        //将重新定义的数组，转为树形数组
                        disabledArr.forEach(e => {
                            let parentId = e.parentId;//获取父级id
                            if (parentId === 0) {
                                //判断如果为顶层id 0 不做操作
                            } else {
                                disabledArr.forEach(d => {
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
                        disabledArr = disabledArr.filter(e => e.parentId === 0);
                        let data = [{title: '资源管理', key: 0, id: 0, children: disabledArr}];
                        this.treeData = data
                    }
                }).then(() => {
                    this.getResourceByUserId()
                });
            },
            //获取单条权限资源
            getResourceByUserId() {
                if (this.data.id) {
                    http.post(dataUrl.getResourceByUserId, {
                        id: this.data.id ? this.data.id : null
                    }).then(res => {
                        if (res.state) {
                            if (res.data) {
                                let tableData = this.tableData;
                                let rolesStr = res.data.roles ? res.data.roles.split('-') : null;
                                let selectedRowArr = [];
                                for (let i in tableData) {
                                    for (let j in rolesStr) {
                                        if (tableData[i].id === Number(rolesStr[j])) {
                                            selectedRowArr.push(Number(rolesStr[j]));
                                            this.selectedRowKeys = selectedRowArr;
                                        }
                                    }
                                }
                                let str = res.data.permissions ? res.data.permissions.split('-') : null;
                                let resourceData = [];
                                for (let i in str) {
                                    resourceData.push(Number(str[i]))//字符串转Number类型
                                }
                                this.checkedKeys = resourceData
                            }
                        }
                    })
                }
            },
            //资源数切换
            onCheck(checkedKeys, info) {
                this.checkedKeys = checkedKeys
                // this.checkedKeys = checkedKeys.checked
                // let checkedKeyss = [...checkedKeys, ...info.halfCheckedKeys];
                // if (checkedKeyss.length === this.treeData.length - 2) {//判断是否全选
                //     this.halfCheckedKeys = checkedKeyss
                // } else {
                //     this.halfCheckedKeys = checkedKeyss.filter(t => t !== 0)//如果不是全选，去掉爷爷级节点，0
                // }
            },
        }
    }
</script>

<style scoped>
</style>
