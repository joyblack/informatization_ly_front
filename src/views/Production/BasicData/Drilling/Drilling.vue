<template>
    <router-view></router-view>
</template>

<script>
    export default {
        name: "Drilling",
        beforeCreate() {
            this.$store.dispatch('closeHomeFun')
        }
    }
</script>

<style scoped>

</style>