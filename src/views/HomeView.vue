<template>
<div class="home-view">
  <nav class="nav-list">
    <RouterLink class="nav" to="/fast-template">创建合同模板</RouterLink>
    <RouterLink class="nav" to="/view-pdf">预览合同</RouterLink>
  </nav>
</div>
</template>

<script setup>

</script>

<style lang="scss" scoped>
.home-view{
  height: 100vh;
  width: 100%;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
  .nav-list{
    display: flex;
    flex-wrap: wrap;
    .nav{
      margin-right: 10px;
      padding: 2px 6px;
        color: #FFFFFF;
        height: 26px;
        line-height: 22px;
        display: flex;
        align-items: center;
        font-size: 14px;
        background-color: #035DFF;
        border-radius: 5px;
        box-sizing: border-box;
        letter-spacing: 1px;

        &:hover {
            filter: grayscale(40%);
            cursor: pointer;
        }
    }
  }
}
</style>