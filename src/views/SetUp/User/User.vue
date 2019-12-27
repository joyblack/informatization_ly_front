<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script>
  export default {
    name: 'User',
    beforeCreate () {
      this.$store.dispatch('closeHomeFun')
    }
  }
</script>

<style scoped>

</style>
