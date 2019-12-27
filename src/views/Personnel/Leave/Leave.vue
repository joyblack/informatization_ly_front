<template>
    <router-view></router-view>
</template>

<script>
    export default {
        name: "Leave",
        beforeCreate() {
            this.$store.dispatch('closeHomeFun')
        }
    }
</script>

<style scoped>

</style>