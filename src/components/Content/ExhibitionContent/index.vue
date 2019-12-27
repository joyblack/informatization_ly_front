<template>
    <a-layout-content
            :style="{ margin: '24px 28px', minHeight: '706px' }">
        <router-view/>
    </a-layout-content>
</template>

<script>
  import { Layout } from 'ant-design-vue'

  export default {
    components: {
      ALayoutContent: Layout.Content,
    },
    name: 'ExhibitionContent'
  }
</script>

<style scoped>

</style>
