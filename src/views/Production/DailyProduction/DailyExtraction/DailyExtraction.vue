<template>
    <router-view></router-view>
</template>

<script>
    export default {
        name: "DailyExtraction",
        beforeCreate() {
            this.$store.dispatch('closeHomeFun')
        }
    }
</script>

<style scoped>

</style>