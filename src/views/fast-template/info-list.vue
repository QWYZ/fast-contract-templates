<template>
    <div class="info-list">
        <div class="opts-row">
            <button class="opt-btn" @click="openEditModal">添加填充标记</button>
        </div>
        <el-table :data="tableData" stripe style="width: 100%">
            <el-table-column prop="name" label="标记名称" />
            <el-table-column prop="keyParam" label="关键字" />
            <el-table-column prop="fillContentType" label="填充类型" />
            <el-table-column prop="pageNum" label="位置" />
            <el-table-column label="操作">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click="viewDetail(scope.$index, scope.row)">详情</el-button>
                    <el-button link type="primary" size="small" @click="delMarker(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <edit-modal v-if="showAddModal" v-model:visible="showAddModal" @close="showAddModal = false" @confirmAdd="confirmAdd"></edit-modal>
    </div>
</template>

<script setup>
import { ref } from 'vue';
import editModal from './edit-modal.vue';
import { localStorageMethods } from '@/utils/storage';
const props = defineProps({
    tableData: {
        type: Object,
        default: () => []
    },

})
const emits = defineEmits(['addMarker','removeMarker'])
const showAddModal = ref(false);
const openEditModal = () =>{
    showAddModal.value = true;
}
const confirmAdd = (data) =>{
    console.log('confirmAdd:',data);
    data['style']=`bottom:50%; left:40%;`;
    localStorageMethods.setItem('ContractMakerList',[...props.tableData,data]);
    emits("addMarker",data);
    showAddModal.value = false;
}

const viewDetail = (i,data) =>{
    console.log(i,data);
}

const delMarker = (i,data) =>{
    // console.log(i,data);
    props.tableData.splice(i,1);
    localStorageMethods.setItem('ContractMakerList',props.tableData);
    emits("removeMarker",data.keyParam);
}
</script>

<style lang='scss' scoped>
.info-list {
    .opts-row {
        margin-top: 10px;
    }

    .opt-btn {
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
</style>