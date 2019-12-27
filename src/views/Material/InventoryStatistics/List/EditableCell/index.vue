<template>
  <div class="editable-cell">
    <div
      v-if="editable"
      class="editable-cell-input-wrapper edit-input-wapper"
    >
      <a-input
        :value="value"
        @change="handleChange"
        @pressEnter="check"
      /><a-icon
        type="check"
        class="editable-cell-icon-check"
        @click="check"
      />
    </div>
    <div
      v-else
      class="editable-cell-text-wrapper"
    >
      {{ value || ' ' }}
      <a-icon
        type="edit"
        class="editable-cell-icon edit-icon"
        @click="edit"
      />
    </div>
  </div>
</template>
<script>
import {Input, Icon} from 'ant-design-vue'
export default {
  props: {
    text: String,
  },
  data () {
    return {
      value: this.text,
      editable: false,
    };
  },
  components: {
      AInput: Input,
      AIcon: Icon,
  },
  methods: {
    handleChange (e) {
      const value = e.target.value;
      this.value = value;
    },
    check () {
      this.editable = false;
      this.$emit('change', this.value);
    },
    edit () {
      this.editable = true;
    },
  },
};
</script>
<style scoped>
    .edit-input-wapper {
        display: flex;
        justify-content: space-between;
        align-items: center;
    }
    .ant-input {
        width: 80%;
    }

    .editable-cell {
        position: relative;
    }
    .edit-icon {
        position: absolute;
        right: 0;
        top: 50%;
        transform: translateY(-50%)
    }
</style>