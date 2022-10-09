<template>...</template>

<script>
import { useMessage,NMessageProvider } from 'naive-ui'
import { defineComponent } from 'vue'

// content
export default defineComponent({
  components: {
    useMessage,NMessageProvider
  },
  setup() {
    window.$message = useMessage()
  }
})
</script>