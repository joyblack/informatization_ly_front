<template>
    <router-view></router-view>
</template>

<script>
    export default {
        name: "PositionManage",
        beforeCreate() {
            this.$store.dispatch('closeHomeFun')
        }
    }
</script>

<style scoped>

</style>