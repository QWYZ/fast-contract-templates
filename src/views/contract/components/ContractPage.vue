<template>
    <div class="contract-page">
        <div class="page-header">
            <div class="page-header-img">
                <img src="../../../assets/contract/cp_logo.png" alt="logo" />
            </div>
            <div class="page-header-name">{{ "湖南云亮教育科技有限公司" }}</div>
        </div>
    </div>
</template>

<script setup>

</script>

<style lang='css' scoped>
.contract-page {
    position: relative;
}

.page-header {
    display: flex;
    justify-content: space-between;
    align-items: end;
    border-bottom: 1px solid gray;
}

.page-header-name{
    font-size: 12px;
}
.page-header-img {
    height: 30px;
}

.page-header-img>img {
    display: block;
    height: 100%;
    width: auto;
}
</style>