<template>
    <router-view></router-view>
</template>

<script>
    export default {
        name: "BreakRules",
        beforeCreate() {
            this.$store.dispatch('closeHomeFun')
        }
    }
</script>

<style scoped>

</style>