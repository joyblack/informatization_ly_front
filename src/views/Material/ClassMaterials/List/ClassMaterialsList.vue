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
                    placeholder="搜索"
                    style="width:50%;margin-top: 15px;margin-bottom: 20px;margin-left: 15px"
                    @change="onChange"
                />
                <a-tree
                    :treeData="treeData"
                    @select="onSelect"
                    :defaultExpandAll="true"
                    @expand="onExpand"
                    :expandedKeys="expandedKeys"
                    :autoExpandParent="autoExpandParent"
                    :defaultSelectedKeys="defaultSelectedKeys"
                >
                    <template slot="title" slot-scope="{title}">
                        <span v-if="title.indexOf(searchValue) > -1">
                            {{title.substr(0, title.indexOf(searchValue))}}
                            <span style="color: #f50">{{searchValue}}</span>
                            {{title.substr(title.indexOf(searchValue) + searchValue.length)}}
                        </span>
                        <span v-else>{{title}}</span>
                    </template>
                </a-tree>
            </a-card>
        </a-row>
        <ClassMaterialsAdd ref="classMaterialsAdd"/>
        <ClassMaterialsEdit ref="classMaterialsEdit"/>
    </div>
</template>

<script>
    import ClassMaterialsAdd from './Add/index'
    import ClassMaterialsEdit from './Edit/index'
    import {Row, Card, Button, Input, Tree, message, Modal, confirm} from 'ant-design-vue'
    import http from '@/utils/http'

    const dataUrl = {
        getTree: '/api/gm-material-category/getTree', // 获取从传入id节点开始的整科树
        deleteNode: '/api/gm-material-category/delete', // 根据id删除节点
    } 
    export default {
        name: "ClassMaterialsList",
        components: {
            ClassMaterialsAdd,
            ClassMaterialsEdit,
            ARow: Row,
            ACard: Card,
            AButton: Button,
            AInput: Input,
            AInputSearch: Input.Search,
            ATree: Tree
        },
        data() {
            return {
                searchValue: {},
                loading: true,
                treeData: [
                    {title: '材料分类', key: 0, id: 0},
                ],
                expandedKeys: [0],
                selectedKeys: [],
                autoExpandParent: true,
                defaultSelectedKeys: [],
                searchValue: null,
                selectData: null,
                dataList: []
            }
        },
        mounted() {
            this.onLoadData()
        },
        methods: {
            // 新增子节点
            add(selectedKeys) {
                if (selectedKeys[0] != undefined) {
                    this.$refs.classMaterialsAdd.openAddModal(selectedKeys)
                } else {
                    message.warning('请先选择节点！')
                }
            },
            onLoadData(params) {
                let parentId = 0
                http.post(dataUrl.getTree, params ? params : {
                    id: 0,
                    // search: this.searchValue ? this.searchValue : null
                }).then(res => {
                    if (res.state) {
                        this.treeData = []
                        let tData = res.data //获取后台返回数据
                        let next = [...tData];//存入数据
                        let result = [];//定义空数组
                        //将数行数组转为一维数组
                        while (next.length) {
                            //遍历数组，重新赋值
                            result.push(...next.map(m => ({
                                id: m.id,
                                key: m.id,
                                title: m.name,
                                scopedSlots: {title: 'title'},
                                parentId: m.parentId,
                            })));
                            next = next
                            .filter(m => Array.isArray(m.children))
                            .reduce((all, m) => [...all, ...m.children], []);
                        }
                        //将重新定义的数组，转为树形数组
                        result.forEach(e => {
                            let parentId = e.parentId//获取父级id
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
                        })
                        //去除重复元素
                        result = result.filter(e => e.parentId === 0);
                        let data = [{title: '材料分类', key: 0, id: 0, children: result}]
                        this.treeData = data;
                        this.generateList(this.treeData);
                    }
                })
            },
            filterItems(data) {
                const arr = []; 
                let obj = {};             
                data.forEach(item => {             
                    const tmp = { ...item };
                    obj = {             
                        key: tmp.id,             
                        title: tmp.title,
                        scopedSlots: {title: 'title'}               
                    }             
                    if (tmp.children) {            
                        tmp.children = this.filterItems(tmp.children); 
                        obj['children'] = tmp.children;                         
                    }             
                    arr.push(obj);             
                })             
                return arr;
            },
            onSelect(selectedKeys, e) {
                this.selectedKeys = selectedKeys;
                if(selectedKeys[0] != undefined) {
                    this.selectData = {
                        title: e.nativeEvent.target.innerText
                    }
                }
                this.defaultSelectedKeys = this.selectedKeys;
            },
            generateList(data) {
                const dataList = []
                for (let i = 0; i < data.length; i++) {
                    const node = data[i]
                    const key = node.key
                    this.dataList.push({ key, title: node.title })
                    if (node.children) {
                        this.generateList(node.children, node.title)
                    }
                }
            },

            getParentKey(title,tree) {
              let parentKey
              for (let i = 0; i < tree.length; i++) {
                const node = tree[i]
                if (node.children) {
                  if (node.children.some(item => item.title === title)) {
                    parentKey = node.key
                  } else if (this.getParentKey(title, node.children)) {
                    parentKey = this.getParentKey(title, node.children)
                  }
                }
              }
              return parentKey
            },
            onExpand(expandedKeys) {
                if(expandedKeys.length == 0) {
                    this.expandedKeys = [0];
                } else {
                    this.expandedKeys = expandedKeys
                }
            },
            //搜索
            onChange(e) {
                const value = e.target.value;
                const expandedKeys = this.dataList.map((item) => {
                    if (item.title.indexOf(value) > -1) {
                        return this.getParentKey(item.title, this.treeData)
                    }
                    return null
                }).filter((item, i, self) => item && self.indexOf(item) === i)
                this.onExpand(expandedKeys);
                this.searchValue = value;
                this.autoExpandParent = true;
            },
            //修改
            edit(selectedKeys) {
                if (selectedKeys[0] != undefined) {
                    if (selectedKeys[0] === 0) {
                        message.warning('顶级节点不可修改！')
                    } else {
                        this.$refs.classMaterialsEdit.openEditModal(selectedKeys)
                    }
                } else {
                    message.warning('请先选择节点！')
                }
            },
            //删除
            deleteData(selectedKeys) {
                let _this = this
                const deleId = this.selectedKeys[0]
                if (selectedKeys[0] != undefined) {
                    if (selectedKeys[0] == 0) {
                        message.warning('顶级节点不可删除！')
                    } else {
                        console.log(_this)
                        Modal.confirm({
                            title: '操作确认',
                            content: '确定要删除该记录?',
                            okText: '确认',
                            okType: 'danger',
                            cancelText: '取消',
                            onOk() {
                                http.post(dataUrl.deleteNode, {
                                    id: deleId
                                }).then((result) => {
                                    if (result) {
                                        if (result.state) {
                                            message.success('操作成功')
                                            _this.onLoadData()
                                        } else {
                                            message.warning(result.message)
                                        }
                                    }
                                })
                            },
                            onCancel() {
                                console.log('Cancel');
                            },
                        });
                    }
                } else {
                    message.warning('请先选择节点！')
                }
            }
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
