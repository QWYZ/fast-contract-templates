<template>
    <div class="solt-body">
        <div class="img-body" v-if="fillContentType === 'img'">
            <img draggable="false" v-if="value" :src="value" alt="">
        </div>
        <div v-if="fillContentType === 'text'">
            {{ value }}
        </div>
    </div>
</template>

<script setup>
const props = defineProps({
    name: {
        type: String,
    },
    value:{
        type: String,
        default:''
    },
    fillContentType:{
        type:String,
        default:'text'
    }
})
// console.log('props:', props);
</script>

<style lang='scss' scoped>
.solt-body{
    position: relative;
    width: 100%;
    height: 100%;
    padding: 2px;
    // background-color: #a4d0ee88;
    .img-body{
        width: 100%;
        height: 100%;
        padding: 2px;
        // background-color: #b5eea488;
        background-color: #a4d0ee88;
        border-radius: 6%;
        img{
            display: block;
            width: 100%;
            height: auto;
        }
    }
}
</style>