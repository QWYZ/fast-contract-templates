<template>
  <div class="g-relative">
    <div class="g-flex g-row-center">
      <input type="file" @change="handleFileChange" />
      <div style="display: flex;">
        <img style="width: 300px; height: auto;" :src="imgurl" alt="">
        <div style="width: 300px;white-space: wrap;" v-if="loading || ocrResult">{{ loading ? '加载中...' : ocrResult }}</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount } from 'vue';
import { createWorker, TesseractWorker } from 'tesseract.js';
const ocrResult = ref();
const imgurl = ref();
const loading = ref(false);

const handleFileChange = async (event) => {
  loading.value = true;
  const file = event.target.files[0];
  if (file) {
    const reader = new FileReader();
    reader.onload = function (e) {
      imgurl.value = e.target.result;
    };

    reader.readAsDataURL(file);
  }
  imgurl.value = file;
  if (!file) return;
  const worker = await createWorker(['chi_sim'],1);
  try {
    // 使用worker进行OCR识别  
    const { data: { text } } = await worker.recognize(file);
    ocrResult.value = text;
    console.log("ocrResult.value:", ocrResult.value);
  } catch (err) {
    console.error('OCR failed:', err);
  } finally {
    // 终止worker  
    worker.terminate();
    loading.value = false;
  }
}
</script>

<style lang='scss' scoped></style>