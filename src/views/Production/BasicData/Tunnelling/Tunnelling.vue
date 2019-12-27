<template>
    <router-view></router-view>
</template>

<script>
    export default {
        name: "Tunnelling",
        beforeCreate() {
            this.$store.dispatch('closeHomeFun')
        }
    }
</script>

<style scoped>

</style>