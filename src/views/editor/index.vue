<script setup>
import Editor from '@tinymce/tinymce-vue'
import { ref } from "vue";

const htmlString = ref("");
const init = ref({
  selector: '#textarea1',
  toolbar_mode: 'sliding',
  plugins: 'code preview mentions anchor autolink charmap codesample emoticons image link lists media searchreplace table visualblocks wordcount checklist mediaembed casechange export formatpainter pageembed permanentpen footnotes advtemplate advtable advcode editimage tableofcontents mergetags powerpaste tinymcespellchecker autocorrect a11ychecker typography inlinecss',
  toolbar: 'code | undo redo | blocks fontfamily fontsize | bold italic underline strikethrough | link image media table mergetags | align lineheight | tinycomments | checklist numlist bullist indent outdent | emoticons charmap | removeformat',
  language: 'zh_CN',
  setup: function (editor) {
    console.log("ID为: " + editor.id + " 的编辑器即将初始化.");
  },
  width: '100%',
  // content_css:"",
  branding:false,
})
</script>

<template>
  <main id="rich-editor">
    <Editor api-key="8n9wvidf3n4195gg5c7juhwc5d1e4siv16b8n3a1sj4gcxm7" :init="init" :initial-value="htmlString" />
  </main>
</template>
<style scoped>
#rich-editor {
  display: flex;
  justify-content: center;
  max-width: 600px;
  width: 100%;
  height: 100vh;
  margin: 0 auto;
  /* .tox-menubar {
    button {
      width: auto !important;
    }
  } */

}
</style>