<script setup>
import { RouterLink, RouterView } from 'vue-router'
</script>

<template>
  <el-config-provider :locale="zhCn">
    <RouterView />
  </el-config-provider>
</template>

<style scoped>

</style>
