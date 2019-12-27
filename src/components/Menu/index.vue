<template>
    <a-menu
            theme="dark"
            mode="inline"
            :openKeys.sync="openKeys"
            :selectedKeys="[this.$route.matched[1].name]"
    >
        <a-menu-item key="home"
                     @click="changeBreadcrumb([{key: null,icon: null,title: null,name: null}])">
            <router-link :to="{ name: 'home'}">
                <a-icon type="home"/>
                <span>首页</span>
            </router-link>
        </a-menu-item>
        <a-sub-menu key="production"
                    v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('production')>-1|| this.$store.state.components.indexOf(2)>-1">
            <span slot="title"><a-icon type="cluster"/><span>生产管理</span></span>
            <a-sub-menu key="basicData" title="基础资料"
                        v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('basic-data')>-1|| this.$store.state.components.indexOf(3)>-1">
                <a-menu-item key="tunnelling"
                             v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('tunnelling')>-1"
                             @click="changeBreadcrumb([{ key: '2',title: '基础资料'},{ key: '3',title: '掘进工作面', name: 'tunnelling'}])">
                    <router-link :to="{ name: 'tunnelling'}">
                        <span>掘进工作面</span>
                    </router-link>
                </a-menu-item>
                <a-menu-item key="extraction"
                             v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('extraction')>-1"
                             @click="changeBreadcrumb([{ key: '2',title: '基础资料'},{ key: '3',title: '回采工作面', name: 'extraction'}])">
                    <router-link :to="{ name: 'extraction'}">
                        <span>回采工作面</span>
                    </router-link>
                </a-menu-item>
                <a-menu-item key="drilling"
                             v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('drilling')>-1"
                             @click="changeBreadcrumb([{ key: '2',title: '基础资料'},{ key: '3',title: '钻孔工作', name: 'drilling'}])">
                    <router-link :to="{ name: 'drilling'}">
                        <span>钻孔工作</span>
                    </router-link>
                </a-menu-item>
            </a-sub-menu>
            <a-sub-menu key="dailyProduction" title="生产日报"
                        v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('daily-production')>-1|| this.$store.state.components.indexOf(7)>-1">
                <a-menu-item key="dailyTunnelling"
                             v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('dailyTunnelling')>-1"
                             @click="changeBreadcrumb([{ key: '2',title: '生产日报'},{ key: '3',title: '掘进日报', name: 'dailyTunnelling'}])">
                    <router-link :to="{ name: 'dailyTunnelling'}">
                        <span>掘进日报</span>
                    </router-link>
                </a-menu-item>
                <a-menu-item key="dailyExtraction"
                             v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('dailyExtraction')>-1"
                             @click="changeBreadcrumb([{ key: '2',title: '生产日报'},{ key: '3',title: '回采日报', name: 'dailyExtraction'}])">
                    <router-link :to="{ name: 'dailyExtraction'}">
                        <span>回采日报</span>
                    </router-link>
                </a-menu-item>
                <a-menu-item key="dailyColliery"
                             v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('dailyColliery')>-1"
                             @click="changeBreadcrumb([{ key: '2',title: '生产日报'},{ key: '3',title: '煤矿生产日报', name: 'dailyColliery'}])">
                    <router-link :to="{ name: 'dailyColliery'}">
                        <span>煤矿生产日报</span>
                    </router-link>
                </a-menu-item>
            </a-sub-menu>
        </a-sub-menu>
        <a-sub-menu key="security"
                    v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('security')>-1|| this.$store.state.components.indexOf(11)>-1">
            <span slot="title"><a-icon type="security-scan"/><span>安全管理</span></span>
            <a-menu-item key="inspection"
                         v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('inspection')>-1"
                         @click="changeBreadcrumb([{ key: '2',title: '安全管理'},{ key: '3',title: '安全巡检', name: 'inspection'}])">
                <router-link :to="{ name: 'inspection'}">
                    <span>安全巡检</span>
                </router-link>
            </a-menu-item>
            <a-menu-item key="breakRules"
                         v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('breakRules')>-1"
                         @click="changeBreadcrumb([{ key: '2',title: '安全管理'},{ key: '3',title: '三违处理', name: 'breakRules'}])">
                <router-link :to="{ name: 'breakRules'}">
                    <span>三违处理</span>
                </router-link>
            </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="material" v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('material')>-1">
            <span slot="title"><a-icon type="gold" /><span>物资管理</span></span>
            <a-menu-item key="intoStorage"
                         v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('intoStorage')>-1"
                         @click="changeBreadcrumb([{ key: '2',title: '物资管理'},{ key: '3',title: '入库管理', name: 'intoStorage'}])">
                <router-link :to="{ name: 'intoStorage'}">
                    <a-icon type="export" />
                    <span>入库管理</span>
                </router-link>
            </a-menu-item>
            <a-menu-item key="outStorage"
                         v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('outStorage')>-1"
                         @click="changeBreadcrumb([{ key: '2',title: '物资管理'},{ key: '3',title: '出库管理', name: 'outStorage'}])">
                <router-link :to="{ name: 'outStorage'}">
                    <a-icon type="select" />
                    <span>出库管理</span>
                </router-link>
            </a-menu-item>
            <a-menu-item key="inventoryStatistics"
                         v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('inventoryStatistics')>-1"
                         @click="changeBreadcrumb([{ key: '2',title: '物资管理'},{ key: '3',title: '库存统计', name: 'inventoryStatistics'}])">
                <router-link :to="{ name: 'inventoryStatistics'}">
                    <a-icon type="area-chart" />
                    <span>库存统计</span>
                </router-link>
            </a-menu-item>
            <a-menu-item key="classMaterials"
                         v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('classMaterials')>-1"
                         @click="changeBreadcrumb([{ key: '2',title: '物资管理'},{ key: '3',title: '材料分类', name: 'classMaterials'}])">
                <router-link :to="{ name: 'classMaterials'}">
                    <a-icon type="ordered-list" />
                    <span>材料分类</span>
                </router-link>
            </a-menu-item>
            <a-menu-item key="warehouse"
                         v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('warehouse')>-1"
                         @click="changeBreadcrumb([{ key: '2',title: '物资管理'},{ key: '3',title: '仓库信息', name: 'warehouse'}])">
                <router-link :to="{ name: 'warehouse'}">
                    <a-icon type="profile" />
                    <span>仓库信息</span>
                </router-link>
            </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="equipment"
                    v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('equipment')>-1|| this.$store.state.components.indexOf(14)>-1">
            <span slot="title"><a-icon type="credit-card"/><span>设备管理</span></span>
            <a-menu-item key="equipments"
                         v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('equipments')>-1"
                         @click="changeBreadcrumb([{ key: '2',title: '设备管理'},{ key: '3',title: '设备列表', name: 'equipments'}])">
                <router-link :to="{ name: 'equipments'}">
                    <span>设备列表</span>
                </router-link>
            </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="datas"
                    v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('datas')>-1|| this.$store.state.components.indexOf(16)>-1">
            <span slot="title"><a-icon type="file-protect"/><span>资料管理</span></span>
            <a-menu-item key="basicInfo"
                         v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('cloudDisk')>-1"
                         @click="changeBreadcrumb([{ key: '2',title: '资料管理'},{ key: '3',title: '资料基本信息管理', name: 'basicInfo'}])">
                <router-link :to="{ name: 'basicInfo'}">
                    <span>资料基本信息管理</span>
                </router-link>
            </a-menu-item>
            <a-menu-item key="licence"
                         v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('licence')>-1"
                         @click="changeBreadcrumb([{ key: '2',title: '资料管理'},{ key: '3',title: '证照信息', name: 'licence'}])">
                <router-link :to="{ name: 'licence'}">
                    <span>证照信息</span>
                </router-link>
            </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="train"
                    v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('train')>-1|| this.$store.state.components.indexOf(19)>-1">
            <span slot="title"><a-icon type="switcher"/><span>培训管理</span></span>
            <a-menu-item key="record"
                         v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('record')>-1"
                         @click="changeBreadcrumb([{ key: '2',title: '培训管理'},{ key: '3',title: '培训记录', name: 'record'}])">
                <router-link :to="{ name: 'record'}">
                    <span>培训记录</span>
                </router-link>
            </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="personnel"
                    v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('personnel')>-1|| this.$store.state.components.indexOf(21)>-1">
            <span slot="title"><a-icon type="usergroup-add"/><span>人事管理</span></span>
            <a-menu-item key="entry"
                         v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('entry')>-1"
                         @click="changeBreadcrumb([{ key: '2',title: '人事管理'},{ key: '3',title: '入职管理', name: 'entry'}])">
                <router-link :to="{ name: 'entry'}">
                    <span>入职管理</span>
                </router-link>
            </a-menu-item>
            <a-menu-item key="leave"
                         v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('leave')>-1"
                         @click="changeBreadcrumb([{ key: '2',title: '人事管理'},{ key: '3',title: '离职管理', name: 'leave'}])">
                <router-link :to="{ name: 'leave'}">
                    <span>离职管理</span>
                </router-link>
            </a-menu-item>
            <a-menu-item key="positionManage"
                         v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('positionManage')>-1"
                         @click="changeBreadcrumb([{ key: '2',title: '人事管理'},{ key: '3',title: '职务管理', name: 'positionManage'}])">
                <router-link :to="{ name: 'positionManage'}">
                    <span>职务管理</span>
                </router-link>
            </a-menu-item>
        </a-sub-menu>
        <a-sub-menu key="setUp"
                    v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('setUp')>-1|| this.$store.state.components.indexOf(25)>-1">
            <span slot="title"><a-icon type="setting"/><span>系统管理</span></span>

            <a-menu-item key="user"
                         v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('user')>-1"
                         @click="changeBreadcrumb([{ key: '2',title: '系统管理'},{ key: '3',title: '用户管理', name: 'user'}])">
                <router-link :to="{ name: 'user'}">
                    <span>用户管理</span>
                </router-link>
            </a-menu-item>
            <a-menu-item key="department"
                         v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('department')>-1"
                         @click="changeBreadcrumb([{ key: '2',title: '系统管理'},{ key: '3',title: '部门管理', name: 'department'}])">
                <router-link :to="{ name: 'department'}">
                    <span>部门管理</span>
                </router-link>
            </a-menu-item>
            <a-menu-item key="resource"
                         v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('resource')>-1"
                         @click="changeBreadcrumb([{ key: '2',title: '系统管理'},{ key: '3',title: '资源管理', name: 'resource'}])">
                <router-link :to="{ name: 'resource'}">
                    <span>资源管理</span>
                </router-link>
            </a-menu-item>
            <a-menu-item key="roleManage"
                         v-show="!this.$store.state.isAuthority || this.$store.state.components.indexOf('roleManage')>-1"
                         @click="changeBreadcrumb([{ key: '2',title: '系统管理'},{ key: '3',title: '角色管理', name: 'roleManage'}])">
                <router-link :to="{ name: 'roleManage'}">
                    <span>角色管理</span>
                </router-link>
            </a-menu-item>
        </a-sub-menu>
    </a-menu>
</template>

<script>
    import {Menu, Icon} from 'ant-design-vue'
    import http from '../../utils/http'

    const dataUrl = {
        getMyInformation: '/api/account/getMyInformation',
        getAuthority: '/api/account/getMyResource',
        getAllCount:'/api/gm-inventory/getAllCount'
    };

    export default {
        components: {
            AMenu: Menu,
            AMenuItem: Menu.Item,
            ASubMenu: Menu.SubMenu,
            AIcon: Icon,
        },
        name: 'GMSJMenu',
        data() {
            return {
                baseBreadcrumb: [{
                    key: '1',
                    icon: 'home',
                    title: null,
                    name: 'home'
                }],
                openKeys: [],
                resourceId: null,
            }
        },
        mounted() {
            this.authority();
        },
        methods: {
            openNotification(count) {
                this.$notification.destroy()
                this.$notification['warning']({
                    duration: null,
                    placement: 'bottomRight',
                    message: '消息提醒',
                    description: '您有'+count+'条库存下限预警信息',
                    btn: h => {
                        return h(
                          'button',
                          {
                            props: {
                              type: 'primary',
                              size: 'small',
                            },
                            style: {
                                display: 'block',
                                width: '100px',
                                height: '30px',
                                background: '#1890ff',
                                border: 'none',
                                color: '#fff',
                                cursor: 'pointer'
                            },
                            on: {
                                click: () => {
                                    this.$router.push({ name: 'inventoryStatistics', query:{ warningStatus: true}})
                                    this.$notification.destroy()
                                }
                            },
                          },
                          '查看详情'
                        );
                    }
                });
            },
            warningCountInfo() {
                http.post(dataUrl.getAllCount,{
                    warning: true
                }).then(res=>{
                    if (res.state){
                        if (res.data > 0){
                            localStorage.setItem("warningCount",res.data);
                            this.openNotification(res.data)
                        }
                    }
                })
            },
            changeBreadcrumb(value) {
                let data = this.baseBreadcrumb;
                data = data.concat(value);
                let breadcrumbData = [];
                if (data.length === 2) {
                    if (data[1].key === null) {
                        data = breadcrumbData
                    }
                }
                this.$store.dispatch('changeBreadcrumbFun', data)
                if(this.$router.history.current.name === 'intoStorageList' || this.$router.history.current.name === 'outStorageList' || this.$router.history.current.name === 'classMaterialsList' || this.$router.history.current.name === 'warehouseList') {
                    this.warningCountInfo()
                } else {
                    this.$notification.destroy()
                }
            },
            //获取菜单权限
            authority() {
                if (eval(sessionStorage.isAuth) === true) {
                    this.$store.dispatch('restComponentsAndButtonsFun');
                    http.post(dataUrl.getAuthority, {}).then(res => {
                        if (res.state) {
                            let openKeysData = this.$route.matched[1].path.split('/');//获取当前选择的菜单
                            for (var i = 0; i < openKeysData.length; i++) {//判断是否为空，去掉空的元素
                                if (openKeysData[i] === "" || openKeysData[i] == null || typeof (openKeysData[i]) == "undefined") {
                                    openKeysData.splice(i, 1);
                                    i = i - 1;
                                }
                            }
                            this.openKeys = openKeysData;//刷新后展开当前选中菜单
                            let components = [];
                            let component = [];
                            let resourceArrs = []
                            res.data.data.forEach(e => {
                                let resourceArr = [];
                                if (e.path.split('-').length >= 4) {
                                    resourceArr = e.path ? e.path.split('-').filter(i => i) : null;
                                    resourceArr.forEach(e => {
                                        resourceArrs.push(Number(e))
                                    })
                                }
                                component.push(e.resourceName, e.parentId)
                            });
                            components = component.concat(resourceArrs);
                            components.forEach(e => {
                                this.$store.dispatch('addComponentsFun', e)
                            });
                        } else {
                            message.warning('用户数据异常');
                            this.$store.dispatch('changeAuthFun', false);
                            this.$router.push({name: 'login'});
                        }
                        if(this.$router.history.current.name === 'intoStorageList' || this.$router.history.current.name === 'outStorageList' || this.$router.history.current.name === 'classMaterialsList' || this.$router.history.current.name === 'warehouseList') {
                            this.warningCountInfo()
                        } else {
                            this.$notification.destroy()
                        }
                    })
                }
            },

        }
    }
</script>

<style scoped>

</style>
