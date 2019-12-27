<template>
    <a-locale-provider :locale="locale">
        <a-layout>
            <a-layout-sider
                    id="gmsj-sider"
                    breakpoint="lg"
                    :trigger="null"
                    collapsible
                    :collapsed="this.$store.state.menuCollapsed"
                    theme="dark"
                    :style="this.$store.state.menuCollapsed?{overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }:{minWidth:'256px',maxWidth:'256px',overflow: 'auto', height: '100vh', position: 'fixed', left: 0 }"
            >
                <a-icon
                    class="trigger"
                    :type="this.$store.state.menuCollapsed ? 'menu-unfold' : 'menu-fold'"
                    @click="changeCollapsedFun"
                />
                <GMSJMenu/>
            </a-layout-sider>
            <a-layout :style="this.$store.state.menuCollapsed?{marginLeft:'80px'}:{marginLeft:'256px'}">
                <GMSJHeader/>
                <GMSJContent/>
                <a-layout-footer style="text-align: center">
                    贵州省煤矿设计研究院有限公司 ©2019
                </a-layout-footer>
            </a-layout>
        </a-layout>
    </a-locale-provider>
</template>

<script>
    import { LocaleProvider, Layout, Icon } from 'ant-design-vue'
    import zhCN from 'ant-design-vue/lib/locale-provider/zh_CN'
    import GMSJMenu from '../../components/Menu/index'
    import GMSJContent from '../../components/Content/index'
    import GMSJHeader from '../../components/Header/index'

    export default {
        components: {
            GMSJHeader,
            GMSJContent,
            GMSJMenu,
            ALocaleProvider: LocaleProvider,
            ALayout: Layout,
            ALayoutSider: Layout.Sider,
            ALayoutFooter: Layout.Footer,
            AIcon: Icon
        },
        name: 'Main',
        created () {
            /**
             * 保存当前store信息到localStorage-保证页面刷新store不刷新
             */
            sessionStorage.getItem('userStore') && this.$store.replaceState(Object.assign(this.$store.state, JSON.parse(sessionStorage.getItem('userStore'))))
            window.addEventListener('beforeunload', () => {
                sessionStorage.setItem('userStore', JSON.stringify(this.$store.state))
            })
        },
        data () {
            return {
                locale: zhCN,
            }
        },
        methods: {
            changeCollapsedFun() {
                this.$store.dispatch('changeCollapsedFun')
            },
        }
    }
</script>

<style scoped>
    #gmsj-sider {
        box-shadow: 2px 0 6px rgba(0, 21, 41, .35);
        z-index: 10
    }

    #gmsj-sider .trigger {
        font-size: 18px;
        line-height: 64px;
        padding: 0 24px;
        cursor: pointer;
        color: #fff;
        transition: color .3s;
    }

    #gmsj-sider .trigger:hover {
        color: #1890ff;
    }
</style>
