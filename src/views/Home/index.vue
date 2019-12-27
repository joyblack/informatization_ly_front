<template>
    <div class="homePage">
        <!-- 待办事项-->
        <ToDoItems></ToDoItems>
        <!-- 图表-->
        <ChartOne></ChartOne>
        <ChartTwo></ChartTwo>
        <ChartThree></ChartThree>
    </div>
</template>

<script>
    import {} from 'ant-design-vue'
    import ToDoItems from './ToDoItems/ToDoItems'
    import ChartOne from './ChartOne/ChartOne'
    import ChartTwo from './ChartTwo/ChartTwo'
    import ChartThree from './ChartThree/ChartThree'

    export default {
        name: 'Home',
        components: {
            ToDoItems,
            ChartOne,
            ChartTwo,
            ChartThree,
        },
        beforeCreate() {
            this.$store.dispatch('openHomeFun')
        },
        data() {
            return {
            }
        },
        mounted() {
        },
        methods: {
        }
    }
</script>

<style scoped>
    .homePage {
        min-height: 680px;
        margin-top: 8vh;
    }
</style>
