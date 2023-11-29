<template>
    <el-dialog v-model="dialogVisible" title="新增填充标记" width="40%" :before-close="handleClose" :destroy-on-close="true">
        <div class="form-list">
            <el-form label-width="90px">
                <el-form-item label="标记名称">
                    <el-input v-model="form.name" placeholder="标记名称" />
                </el-form-item>
                <el-form-item label="位置">
                    <el-input v-model="form.pageNum" placeholder="添加标记的页码" />
                </el-form-item>
                <el-form-item label="关键字">
                    <el-input v-model="form.keyParam" placeholder="关键字" />
                </el-form-item>
                <el-form-item label="填充类型">
                    <el-select v-model="form.fillContentType" placeholder="请选择" style="width: 100%;">
                        <el-option label="文字填充" value="text"></el-option>
                        <el-option label="签字/签章" value="img"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="填充方">
                    <el-select v-model="form.fillUserType" placeholder="请选择" style="width: 100%;">
                        <el-option label="甲方" :value="1"></el-option>
                        <el-option label="乙方" :value="2"></el-option>
                    </el-select>
                </el-form-item>
                <el-form-item label="覆盖层级">
                    <el-input-number style="width: 100%;" v-model="form.zIndex" class="mx-4" :min="1" :max="10" controls-position="right"/>
                </el-form-item>
                <el-form-item label="默认值">
                    <el-input v-model="form.value" placeholder="默认值" />
                </el-form-item>
            </el-form>
        </div>
        <template #footer>
            <span class="dialog-footer">
                <el-button @click="handleClose">取消</el-button>
                <el-button type="primary" @click="sumbitMarkInfo">
                    确认添加
                </el-button>
            </span>
        </template>
    </el-dialog>
</template>

<script setup>
import { computed, ref } from 'vue';
import { localStorageMethods } from "@/utils/storage"
const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    }
})
const emits = defineEmits(['close', 'update:visible', 'confirmAdd'])

const dialogVisible = computed({
    get() {
        return props.visible
    },
    set(value) {
        emits('update:visible', value)
    }
})

const form = ref({
    name: '',
    pageNum: '',
    keyParam: '',
    fillContentType: '',
    fillUserType: '',
    zIndex: 1,
    value:''
    // maxLength: '',
    // type: '',
})
const handleClose = () => {
    emits('close')
}
const sumbitMarkInfo = () => {
    emits('confirmAdd', form.value);
}
</script>

<style lang='scss' scoped></style>