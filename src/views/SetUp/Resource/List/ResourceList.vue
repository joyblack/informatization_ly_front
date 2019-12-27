<template>
    <div>
        <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{padding:'20px 30px'}">
            <a-card class="acard">
                <a-row :gutter='{ md: 8, lg: 24, xl: 48 }' :style="{marginTop:'10px',marginLeft:'10px'}">
                    <a-button type="primary" icon="plus" @click="add(selectedKeys)">新增</a-button>
                    <a-button icon="edit" :style="{marginLeft: '10px'}" @click="edit(selectedKeys)">修改</a-button>
                    <a-button icon="delete" :style="{marginLeft: '10px'}" @click="deleteData(selectedKeys)">删除
                    </a-button>
                </a-row>
                <a-input-search
                        placeholder="输入搜索文本"
                        style="width:50%;margin-top: 15px;margin-bottom: 20px"
                        @search="onSearch"
                        enterButton
                />
                <a-tree
                        :treeData="treeData"
                        @select="onSelect"
                        :defaultExpandAll="true"
                />
            </a-card>

        </a-row>
        <ResourceAdd ref="resourceAdd"/>
        <ResourceEdit ref="resourceEdit"/>
    </div>
</template>

<script>
    import ResourceAdd from './Add/index.vue'
    import ResourceEdit from './Edit/index.vue'
    import {Table, Row, Col, Button, Divider, Upload, Modal, Alert, Tree, Card, Input, message} from 'ant-design-vue'
    import http from '../../../../utils/http'

    const confirm = Modal.confirm;

    const dataUrl = {
        getAll: '/api/system-role/getPagerList',
        deleteById: '/api/system-role/delete',
    };

    export default {
        components: {
            ResourceAdd,
            ResourceEdit,
            ATable: Table,
            ARow: Row,
            ACol: Col,
            AButton: Button,
            ADivider: Divider,
            AUpload: Upload,
            AAlert: Alert,
            AModal: Modal,
            ATree: Tree,
            ACard: Card,
            AInput: Input,
            AInputSearch: Input.Search,
        },
        name: 'ResourceList',
        data() {
            return {
                loading: true,
                treeData: [
                    {title: '资源管理', key: 0, id: 0},
                ],
                selectedKeys: [],
                searchValue: null,
            }
        },
        mounted() {
            this.onLoadData()
        },
        methods: {
            //新增
            add(selectedKeys) {
                if (selectedKeys.length > 0) {
                    this.$refs.resourceAdd.openAddModal(selectedKeys)
                } else {
                    message.warning('请先选择节点！')
                }
            },
            //修改
            edit(selectedKeys) {
                if (selectedKeys[0] === 0){
                    message.warning('顶级节点不允许修改！')
                } else {
                    if (selectedKeys.length > 0) {
                        this.$refs.resourceEdit.openEditModal(selectedKeys)
                    } else {
                        message.warning('请先选择节点！')
                    }
                }
            },
            //删除
            deleteData(selectedKeys) {
                let _this = this
                const deleId = this.selectedKeys[0]
                if (selectedKeys.length>0) {
                    if (selectedKeys[0] === 0) {
                        message.warning('顶级节点不可删除')
                    } else {
                        confirm({
                            title: '操作确认',
                            content: '确定要删除该记录?',
                            onOk() {
                                http.post(dataUrl.deleteById, {
                                    id: deleId
                                }).then((res) => {
                                    if (res.state) {
                                        message.success(res.message);
                                        _this.onLoadData()
                                    } else {
                                        message.warning(res.message)
                                    }
                                })
                            },
                            onCancel() {
                            },
                        })
                    }
                } else {
                    message.warning('请先选择节点')
                }
            },
            //搜索
            onSearch(value) {
                this.searchValue = value
                this.onLoadData()
            },
            onSelect(selectedKeys, e) {
                this.selectedKeys = selectedKeys
            },
            onLoadData() {
                http.post(dataUrl.getAll, {
                    id: '0',
                    search : this.searchValue ? this.searchValue : null
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
                                        childArray.push(e);
                                        d.children = childArray
                                    }
                                })
                            }
                        })
                        //去除重复元素
                        result = result.filter(e => e.parentId === 0);
                        let data = [{title: '资源管理', key: 0, id: 0, children: result}];
                        this.treeData = data
                    }
                })
            },
        }
    }
</script>

<style scoped>
    .acard {
        width: 40%;
        position: relative;
        left: 50%;
        top: 50%;
        transform: translate(-50%, 0%);
    }
</style>
