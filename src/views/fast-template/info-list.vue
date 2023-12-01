<template>
    <div class="info-list">
        <div class="opts-row">
            <button class="opt-btn" @click="openEditModal">添加填充标记</button>
        </div>
        <el-table :data="tableData" stripe style="width: 100%; height: 85vh;">
            <el-table-column prop="name" label="标记名称" />
            <el-table-column prop="keyParam" label="关键字" />
            <el-table-column prop="fillUserType" label="填写方">
                <template #default="scope">
                    <span v-if="scope.row.fillUserType == 1">甲方</span>
                    <span v-if="scope.row.fillUserType == 2">乙方</span>
                </template>
            </el-table-column>
            <el-table-column prop="fillContentType" label="填充类型">
                <template #default="scope">
                    <span v-if="scope.row.fillContentType == 'text'">文字填充</span>
                    <span v-if="scope.row.fillContentType == 'img'">签字/签章</span>
                </template>
            </el-table-column>
            <el-table-column prop="pageNum" label="位置">
                <template #default="scope">
                    {{ `第${scope.row.pageNum}页 `}}
                </template>
            </el-table-column>
            <el-table-column label="操作" :width="96">
                <template #default="scope">
                    <el-button link type="primary" size="small" @click="editDetail(scope.$index, scope.row)">编辑</el-button>
                    <el-button link type="primary" size="small" @click="delMarker(scope.$index, scope.row)">删除</el-button>
                </template>
            </el-table-column>
        </el-table>
        <edit-modal :editData="editData" v-model:visible="showAddModal" @close="showAddModal = false" @confirmAdd="confirmAdd" @confirmChange="confirmChange"></edit-modal>
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
const showAddModal = ref(false);//编辑模态框状态
const editData = ref({}); //编辑数据
const openEditModal = () =>{
    editData.value = null;
    showAddModal.value = true;
}
/**执行新增 */
const confirmAdd = (data) =>{
    // console.log('confirmAdd:',data);
    data['style']=`bottom:50%; left:40%;`;
    localStorageMethods.setItem('ContractMakerList',[...props.tableData,data]);
    emits("addMarker",data);
    showAddModal.value = false;
}

/**执行修改 */
const confirmChange = (data,i) =>{
    emits("removeMarker",data.keyParam);
    props.tableData[i] = data;
    localStorageMethods.setItem('ContractMakerList',props.tableData);
    emits("addMarker",data);
    showAddModal.value = false;
}

/**编辑 */
const editDetail = (i,data) =>{
    editData.value = {
        data:{...data},
        index:i
    };
    showAddModal.value = true;
    // console.log(i,data);
}

/**删除 */
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