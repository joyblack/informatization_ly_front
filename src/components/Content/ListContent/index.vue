<template>
    <div>
        <a-layout-content
                :style="{ margin: '88px 24px 24px', padding: '0 24px'}">
            <a-breadcrumb>
                <a-breadcrumb-item v-for="item in this.$store.state.breadcrumb" :key="item.key">
                    <router-link :to="{ name: item.name}" v-if="item.name!=null">
                        <a-icon :type="item.icon" v-if="item.icon!=null"/>
                        <span v-if="item.title!=null">{{item.title}}</span>
                    </router-link>
                    <label v-else>
                        <a-icon :type="item.icon" v-if="item.icon!=null"/>
                        <span v-if="item.title!=null">{{item.title}}</span>
                    </label>
                </a-breadcrumb-item>
            </a-breadcrumb>
        </a-layout-content>
        <a-layout-content
                :style="{ margin: '24px', padding: '24px', background: '#fff', minHeight: '695px' }">
            <router-view/>
        </a-layout-content>
    </div>
</template>

<script>
    import { Layout, Breadcrumb, Icon } from 'ant-design-vue'

    export default {
        components: {
            AIcon: Icon,
            ALayoutContent: Layout.Content,
            ABreadcrumb: Breadcrumb,
            ABreadcrumbItem: Breadcrumb.Item
        },
        name: 'ListContent'
    }
</script>

<style scoped>

</style>
