<template>
    <div class="contract-view" v-html="htmlString"></div>
</template>

<script setup>
import ContractPage from "@/views/contract/components/ContractPage.vue";
import { ref } from "vue";

const htmlString = ref(``)
const pageWidth = window.innerWidth || document.documentElement.clientWidth || document.body.clientWidth;
console.log("页面宽度：" + pageWidth);
</script>

<style scoped>
.contract-view{
    width: 100%;
    height: 100vh;
    overflow-y: auto;
    /* margin: 0 10px; */
    box-sizing: border-box;
}
/* @page {
    size: A4;
    margin: 20mm;
} */
</style>