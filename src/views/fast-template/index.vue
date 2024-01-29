<template>
    <div class="page-view">
        <h2>合同信息设置</h2>
        <div>
            <h3>更换合同模板文件（⚠刷新页面自动重置文件）</h3>
            <el-upload ref="upload" class="upload-demo" :limit="1" :on-exceed="handleExceed" :on-change="handleBeforeUpload"
                accept=".pdf" :auto-upload="false">
                <template #trigger>
                    <el-button type="primary">选择文件</el-button>
                </template>
            </el-upload>
        </div>
        <div class="container">
            <div class="set-body">
                <info-list @addMarker="addMarker" @removeMarker="removeMarker" :tableData="markList"></info-list>
            </div>
            <div class="phone">
                <div class="phone-container">
                    <div class="contract_1" ref="contractPdf"></div>
                </div>
            </div>
            <div class="set">

            </div>
        </div>
    </div>
</template>
  
<script setup>
import Pdfh5 from 'pdfh5';
import pdfurl1 from "@/assets/pdf/volserver.pdf";
import { ref, onMounted, createApp, onBeforeMount } from 'vue';
import InfoList from './info-list.vue';
import { localStorageMethods } from '@/utils/storage';
import { debounce } from '@/utils/utils';
import slotBox from './slot-box.vue';
import { genFileId } from 'element-plus';

const contractPdf = ref();
const currentPageNum = ref(1);
const markList = ref([]);
const isResized = ref(false);
const upload = ref();
let pdfh5 = null;
onBeforeMount(() => {
    getMarkList();
})

onMounted(() => {
    initPdf(contractPdf.value, {
        pdfurl: pdfurl1
    });
});

const getMarkList = () => {
    let data = localStorageMethods.getItem("ContractMakerList");
    markList.value = data || [];
}

const handleExceed = (files) => {
    upload.value.clearFiles()
    const file = files[0]
    file.uid = genFileId()
    upload.value.handleStart(file)
}

const handleBeforeUpload = (e) => {
    const fileReader = new FileReader();
    fileReader.onload = function (event) {
        const pdfData = event.target.result;
        console.log('pdfData',pdfData);
        initPdf(contractPdf.value, {
            data: pdfData
        });
    };
    fileReader.readAsArrayBuffer(e.raw);
}

/**初始化合同标记 */
const initContrctMark = () => {
    let len = markList.value.length;
    for (let i = 0; i < len; i++) {
        const item = markList.value[i];
        innerEditorModal(item);
    }
}

const addMarker = (data) => {
    pdfh5 && pdfh5.goto(data.pageNum);
    innerEditorModal(data);
    getMarkList();
}

const removeMarker = (keyParam) => {
    let targetMarkerDom = document.querySelector(`#${keyParam}`);
    targetMarkerDom.parentNode.removeChild(targetMarkerDom);
    getMarkList();
}

/**初始化合同Pdf阅读器 */
const initPdf = (el, opts) => {
    pdfh5 = new Pdfh5(el, {
        pageNum: true, //显示页码
        backTop: false, //显示返回顶部
        ...opts
    });
    pdfh5.on("ready", function () {
        // console.log("总页数：" + this.totalNum)
    })
    pdfh5.on("success", function () {
        isResized.value = true;
        initContrctMark();
    })
    pdfh5.on("scroll", function (scrollTop, currentNum) {
        if (currentNum) {
            currentPageNum.value = currentNum;
        }
    })
    pdfh5.on("render", function (currentNum, time, currentPageDom) {
        // 动态为容器添加 ondragover 和 ondrop 事件处理程序
        const draggableContainer = document.querySelector(`[name="page=${currentNum}"]`);
        draggableContainer.addEventListener('dragover', allowDrop);
        draggableContainer.addEventListener('drop', drop);
    })
}

/**插入Marker */
const innerEditorModal = (data) => {
    console.log("执行插入Marker:", data.keyParam);
    const { pageNum, keyParam, zIndex } = data;
    // 将内容组件动态插入指定位置
    const childApp = createApp(slotBox, {
        name: data?.name,
        value: data?.value,
        fillContentType: data?.fillContentType,
        fillUserType: data?.fillUserType,
    });
    let targetElement = document.querySelector(`[name="page=${pageNum}"]`); //目标节点
    let marker = document.createElement('div');
    //设置属性
    marker.className = 'draggable resizable';
    marker.draggable = true;
    marker.style = data?.style || '';
    marker.style.zIndex = 200 + Number(zIndex);
    marker.id = keyParam;
    marker.addEventListener('dragstart', function (event) {
        // 记录鼠标相对于拖拽元素左上角的偏移
        const markerRect = event.target.getBoundingClientRect();
        event.dataTransfer.setData('text/plain', event.target.id);
        event.dataTransfer.setData('offsetX', event.clientX - markerRect.left);
        event.dataTransfer.setData('offsetY', event.clientY - markerRect.top);
        event.dataTransfer.setData('markerW', markerRect.width);
        event.dataTransfer.setData('markerH', markerRect.height);
        event.target.style.cursor = 'grabbing';
    });
    marker.addEventListener('dragend', function (event) {
        event.target.style.cursor = 'grab';
    });

    // 创建 ResizeObserver 实例监听宽度和高度的变化
    const resizeObserver = new ResizeObserver(debounce(entries => {
        updateMarkStyle(entries[0].target.id, entries[0].target.style.cssText);
    }, 200));
    // 监听 resizableDiv 元素
    resizeObserver.observe(marker);
    targetElement.appendChild(marker);
    childApp.mount(marker);
}

const allowDrop = (event) => {
    event.preventDefault();
}

/**结束拖拽回调 */
const drop = (event) => {
    event.preventDefault();
    const draggedElementId = event.dataTransfer.getData('text/plain');
    const offsetX = parseFloat(event.dataTransfer.getData('offsetX'));
    const offsetY = parseFloat(event.dataTransfer.getData('offsetY'));
    const markerW = parseFloat(event.dataTransfer.getData('markerW'));
    const markerH = parseFloat(event.dataTransfer.getData('markerH'));
    const draggedElement = document.getElementById(draggedElementId);
    if (draggedElement && draggedElement.classList.contains('draggable')) {
        const containerRect = draggedElement.parentElement.getBoundingClientRect();
        let x = event.clientX - containerRect.left - offsetX;
        let y = containerRect.height - (event.clientY - containerRect.top - offsetY) - markerH;
        // 限制元素在可视区域内
        x = Math.min(Math.max(x, 0), containerRect.width - markerW);
        y = Math.min(Math.max(y, 0), containerRect.height - markerH);
        // 确保拖拽元素只在其所属容器内拖拽
        draggedElement.style.left = x / containerRect.width * 100 + '%';
        draggedElement.style.bottom = y / containerRect.height * 100 + '%';
    }
    updateMarkStyle(draggedElementId, draggedElement.style.cssText);
}

/**更新指定标记样式 */
const updateMarkStyle = (keyParam, style) => {
    if (!isResized.value) { return }
    // console.log('更新指定标记样式:', style);
    markList.value.map((item) => {
        if (item.keyParam == keyParam) {
            item['style'] = style;
        }
    })
    localStorageMethods.setItem("ContractMakerList", markList.value);
}
</script>
  
<style lang='scss' scoped>
/* 媒体查询示例 */


@media only screen and (min-width: 601px) {
    .page-view {
        height: 100vh;
        padding: 10px;

        .container {
            display: flex;
            justify-content: space-between;

            .set-body {
                padding: 20px;
                min-width: 620px;

                .form-list {
                    margin-top: 20px;
                }
            }
        }
    }

    /* 在中等屏幕上的样式 */
    .phone {
        position: relative;
        width: 605px;
        height: 810px;
        border: 2px solid #333333;
        border-radius: 20px;
        margin: auto;
        overflow: hidden;
    }

    .phone-container {
        width: 595.3px;
        height: 800px;

        /* 宽度和高度 */
        ::-webkit-scrollbar {
            width: 0px;
            /* 滚动条宽度 */
            height: 10px;
            /* 滚动条高度 */
        }

        /* 轨道（背景） */
        ::-webkit-scrollbar-track {
            background-color: #f1f1f1;
        }

        /* 滑块（滚动条上的可拖动部分） */
        ::-webkit-scrollbar-thumb {
            background-color: #888;
            border-radius: 5px;
            /* 圆角 */
        }

        /* 鼠标悬停在滑块上的样式 */
        ::-webkit-scrollbar-thumb:hover {
            background-color: #555;
        }
    }
}

@media only screen and (max-width: 600px) {
    .page-view {
        width: 100vw;
        height: 100vh;

        .phone {
            width: 100%;
            height: 100%;

            .phone-container {
                width: 100%;
                height: 100%;
            }
        }
    }

    /* 在小屏幕上的样式 */
    .set-body {
        display: none;
    }

}

.opt-btn {
    padding: 2px;
}


.contract_1 {
    position: relative;
    width: 100%;
    height: 100%;
    font-size: 10px;
}

.editor-modal {
    position: absolute;
    top: 8%;
    left: 65%;
    width: 60px;
    height: 30px;
    z-index: 200;
    background-color: rgba(34, 235, 235, 0.89);
}

input {
    background-color: transparent;
}
</style>
  
<style lang='scss'>
.draggable {
    width: 100px;
    height: 30px;
    z-index: 200;
    border: 1px solid #3498dbb2;
    position: absolute;
    cursor: grab;
    border-radius: 6%;

    img.mark-close-img {
        width: 16px;
        height: 16px;
        position: absolute;
        z-index: 201;
    }
}

.resizable {
    width: 100px;
    height: 30px;
    box-sizing: border-box;
    resize: both;
    overflow: hidden;
    position: absolute;

    // &::before {
    //     content: "";
    //     position: absolute;
    //     width: 5px;
    //     height: 5px;
    //     top: 0;
    //     right: 0;
    //     z-index: 202;
    //     cursor: nesw-resize;
    // }
}
</style>