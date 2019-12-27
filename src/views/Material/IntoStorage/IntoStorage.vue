<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script>
    export default {
        name: "IntoStorage",
        beforeCreate() {
            this.$store.dispatch('closeHomeFun')
        }
    }
</script>

<style scoped>

</style>
