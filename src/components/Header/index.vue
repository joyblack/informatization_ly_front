<template>
    <a-layout-header id="gmsj-header">
        <div id="gmsj-logo">
            <router-link to="/">
                <div class="headerInfo">
                    <img src="../../assets/logo.png" style="width:48px;height:48px;margin-right:5px;">
                    龙鑫煤矿信息化平台
                </div>
            </router-link>
        </div>
        <div class="menuList">
            <a-dropdown placement="bottomRight">
                <a-avatar :style="{backgroundColor: '#1890ff', verticalAlign: 'middle',cursor:'pointer'}">
                    {{userName}}
                </a-avatar>
                <a-menu slot="overlay">
                    <a-menu-item style="padding:5px 20px;" @click="changePassword">
                        <a-icon type="sync"/>
                        <span>修改密码</span>
                    </a-menu-item>
                    <a-menu-item style="padding:5px 20px;" @click="loginOut">
                        <a-icon type="logout"/>
                        <span>退出登录</span>
                    </a-menu-item>
                </a-menu>
            </a-dropdown>
        </div>
        <ChangePassWord ref="changePassWord"/>
    </a-layout-header>
</template>

<script>
    import {Layout, Icon, Popover, Avatar, Menu, Dropdown, Badge, Tooltip} from 'ant-design-vue'
    import ChangePassWord from '../../views/SetUp/User/List/ChangePassWord/index'

    const dataUrl = {
        getMyInformation: '/api/account/getMyInformation',
    };

    export default {
        components: {
            ChangePassWord,
            ALayoutHeader: Layout.Header,
            AIcon: Icon,
            APopover: Popover,
            AAvatar: Avatar,
            AMenu: Menu,
            AMenuItem: Menu.Item,
            ADropdown: Dropdown,
            ABadge: Badge,
            ATooltip: Tooltip
        },
        name: 'GMSJHeader',

        data() {
            return {
                userName: null,
                userId: null,
                mineName: null,
            }
        },
        mounted() {
            this.userId = sessionStorage ? sessionStorage.id : null;
            this.userName = sessionStorage ? sessionStorage.loginName : null;
        },
        methods: {
            //修改密码
            changePassword() {
                if (this.userId) {
                    let userId = this.userId;
                    this.$refs.changePassWord.openModal(userId)
                } else {
                    message.warning('用户信息异常');
                    this.$store.dispatch('changeAuthFun', false);
                    this.$store.dispatch('restComponentsAndButtonsFun');
                    this.$store.dispatch('restStateFun');
                    this.$router.push({name: 'login'})
                }
            },
            //退出登录
            loginOut() {
                //session清空
                sessionStorage.clear();
                //本地缓存清空
                localStorage.clear();
                //关闭窗口
                this.$store.dispatch('changeAuthFun', false);
                this.$store.dispatch('restComponentsAndButtonsFun');
                this.$store.dispatch('restStateFun');
                //跳回登录界面
                this.$router.push({name: 'login'})
                //关闭库存警报消息提示
                this.$notification.destroy()
            },

        }
    }
</script>

<style scoped>
    #gmsj-header {
        padding: 0;
        position: fixed;
        width: 100%;
        display: flex;
        align-items: center;
        justify-content: space-between;
        background: #fff;
        box-shadow: 0 1px 4px rgba(0, 21, 41, .08);
        z-index: 99;
    }

    #gmsj-logo {
        position: relative;
        height: 64px;
        padding-left: 24px;
        overflow: hidden;
        line-height: 64px;
        transition: all .3s;
        z-index: 10
    }

    .headerInfo {
        display: flex;
        align-items: center;
        color: #666;
        font-size: 20px;
        letter-spacing: 3px;
    }
</style>
