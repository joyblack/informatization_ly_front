<template>
    <router-view></router-view>
</template>

<script>
    export default {
        name: "RoleManage",
        beforeCreate() {
            this.$store.dispatch('closeHomeFun')
        }
    }
</script>

<style scoped>

</style>