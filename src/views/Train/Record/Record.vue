<template>
    <router-view></router-view>
</template>

<script>
    export default {
        name: "Record",
        beforeCreate() {
            this.$store.dispatch('closeHomeFun')
        }
    }
</script>

<style scoped>

</style>