<template>
    <div>
        <router-view></router-view>
    </div>
</template>

<script>
  export default {
    name: 'Resource',
    beforeCreate () {
      this.$store.dispatch('closeHomeFun')
    }
  }
</script>

<style scoped>

</style>
