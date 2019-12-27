<template>
    <a-layout-content>
        <ListContent v-if="!this.$store.state.isHome"/>
        <ExhibitionContent v-else/>
    </a-layout-content>
</template>

<script>
    import {Layout} from 'ant-design-vue'
    import ListContent from './ListContent/index'
    import ExhibitionContent from './ExhibitionContent/index'

    export default {
        components: {
            ExhibitionContent,
            ListContent,
            ALayoutContent: Layout.Content,
        },
        name: 'GMSJContent',
        beforeCreate() {
            this.$store.dispatch('changeAuthFun', false)
        }
    }
</script>

<style scoped>

</style>
