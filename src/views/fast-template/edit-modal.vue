<template>
    <el-dialog class="edit-marker" v-model="dialogVisible" append-to-body :before-close="handleClose"
        @opened="onOpen" @close="onClose" :append-to-body="true" destroy-on-close>
        <div class="close-btn close-btn-position" title="关闭" @click="handleClose"></div>
        <div class="body">
            <div class="header">
                <div class="header-title">{{ dialogTitle }}</div>
            </div>
            <div class="form-body">
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
                    <el-form-item label="填写方">
                        <el-select v-model="form.fillUserType" placeholder="请选择" style="width: 100%;">
                            <el-option label="甲方" :value="1"></el-option>
                            <el-option label="乙方" :value="2"></el-option>
                        </el-select>
                    </el-form-item>
                    <el-form-item label="覆盖层级">
                        <el-input-number v-model="form.zIndex" class="mx-4" :min="1" :max="10" controls-position="right" />
                    </el-form-item>
                    <el-form-item label="默认值">
                        <el-input v-model="form.value" placeholder="默认值" />
                    </el-form-item>
                    <el-form-item label="标记样式" v-if="editData">
                        <el-input type="textarea" v-model="form.style" placeholder="标记样式" />
                    </el-form-item>
                </el-form>
            </div>
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
import { computed, onMounted, ref } from 'vue';
import { localStorageMethods } from "@/utils/storage"
const props = defineProps({
    visible: {
        type: Boolean,
        default: false,
    },
    editType: {
        type: String,
        default: "add"
    },
    editData: {
        type: Object,
        default: () => { }
    }
})
const dialogTitle = ref('新增填充标记');
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
    value: ''
    // maxLength: '',
    // type: '',
})

/**模态框打开时触发 */
const onOpen = () => {
    // console.log('编辑opened：', props.editData);
    if (props.editData) {
        dialogTitle.value = "修改填充标记";
        form.value = props.editData.data;
    }else{
        dialogTitle.value = "新增填充标记";
    }
}

/**模态框关闭触发 */
const onClose = () => {
    //初始化form缓存信息
    form.value = {
        name: '',
        pageNum: '',
        keyParam: '',
        fillContentType: '',
        fillUserType: '',
        zIndex: 1,
        value: ''
        // maxLength: '',
        // type: '',
    }
}

/**关闭模态框 */
const handleClose = () => {
    emits('close');
}

/**提交标记信息 */
const sumbitMarkInfo = () => {
    if (props.editData) {
        emits('confirmChange', form.value, props.editData.index);
    }else{
        emits('confirmAdd', form.value);
    }
}
</script>

<style lang='scss' scoped>
.body {
    width: 100%;
    padding-top: 10px;
    padding-bottom: 10px;
    margin: 0 18px;
}

.header {
    .header-title {
        font-size: 20px;
        font-family: PingFangSC-Semibold, PingFang SC;
        font-weight: 600;
        color: #333333;
        line-height: 33px;
        letter-spacing: 1px;
    }
}

.form-body {
    width: 100%;
    margin-top: 22px;
    padding-right: 25px;

    :deep(.el-input__wrapper) {
        border-radius: 8px;
        background-color: #FAFAFB;
    }

    :deep(.el-checkbox__label) {
        font-size: 14px;
        font-family: PingFangSC-Regular, PingFang SC;
        font-weight: 400;
        color: #333333;
        line-height: 20px;
    }
}


.close-btn-position {
    position: absolute;
    top: 15px;
    right: 15px;
}

.close-btn {
    width: 25px;
    height: 25px;
    background-image: url("@/assets/images/common/close-modal-gray.png");
    background-size: 100% 100%;
    display: inline-block;
    cursor: pointer;

    &:hover {
        background-image: url("@/assets/images/common/close-modal-d.png");
    }
}
</style>

<style lang="scss">
.el-dialog.edit-marker {
    width: 450px;
    height: auto;
    background: #FFFFFF;
    border-radius: 16px;
    position: relative;

    .el-dialog__header {
        display: none;
    }

    .el-dialog__body {
        padding: 0;
        overflow: hidden;
        display: flex;
        align-items: center;
    }
}
</style>