<template>
  <div class="contract_1" ref="contractPdf"></div>
  <div class="float-btn" @click="downloadPdf(curViewPdf)">
    下载PDF
  </div>
  <div v-if="PDFLoading && toastMsg" class="toast">{{ toastMsg }}</div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, createApp } from 'vue';
import pdfurl1 from "@/assets/pdf/volserver.pdf";
import { localStorageMethods } from '@/utils/storage';
import { parseStyles } from '@/utils/utils';
import { generatePDF, initPdf } from '@/utils/pdfUtils';

const contractPdf = ref();
const markList = ref([
  {
    "name": "合同编号",
    "pageNum": "1",
    "keyParam": "contract_NO",
    "fillContentType": "text",
    "fillUserType": 2,
    "zIndex": 1,
    "value": "AHwhwhewehehwehhwewHHHGGGSGSSGGSGS1008611231122LLKS",
    "style": "bottom: 83.9558%; left: 64.8577%; z-index: 201; cursor: grab; height: 17px; width: 94px;"
  },
  {
    "name": "考生姓名",
    "pageNum": "1",
    "keyParam": "kaos_name",
    "fillContentType": "text",
    "fillUserType": 1,
    "zIndex": 1,
    "value": "王勇祥",
    "style": "bottom: 18.8316%; left: 41.8989%; z-index: 201; cursor: grab; height: 17px; width: 127px;"
  },
  {
    "name": "签订日期_年",
    "pageNum": "1",
    "keyParam": "qdDate_year",
    "fillContentType": "text",
    "fillUserType": 2,
    "zIndex": 1,
    "value": "2023",
    "style": "bottom: 11.0682%; left: 39.4794%; z-index: 201; cursor: grabbing; width: 51px; height: 17px;"
  },
  {
    "name": "签订日期_月",
    "pageNum": "1",
    "keyParam": "qdDate_month",
    "fillContentType": "text",
    "fillUserType": 2,
    "zIndex": 1,
    "value": "11",
    "style": "bottom: 11.0701%; left: 52.944%; z-index: 201; cursor: grabbing; height: 17px; width: 43px;"
  },
  {
    "name": "签订日期_日",
    "pageNum": "1",
    "keyParam": "qdDate_day",
    "fillContentType": "text",
    "fillUserType": 2,
    "zIndex": 1,
    "value": "30",
    "style": "bottom: 11.0701%; left: 63.1315%; z-index: 201; cursor: grabbing; width: 44px; height: 17px;"
  },
  {
    "name": "甲方考生家长",
    "pageNum": "2",
    "keyParam": "jia_kaos_parent",
    "fillContentType": "text",
    "fillUserType": 2,
    "zIndex": 1,
    "value": "王勇祥王勇祥王勇祥王勇祥王勇祥王勇王勇祥王勇祥王勇王勇祥王勇祥王勇",
    "style": "bottom: 86.26%; left: 41.0357%; z-index: 201; cursor: grab; width: 43px; height: 17px;"
  },
  {
    "name": "甲方考生家长身份证号",
    "pageNum": "2",
    "keyParam": "jia_kaos_parent_idcard",
    "fillContentType": "text",
    "fillUserType": 1,
    "zIndex": 1,
    "value": "430423000000000000",
    "style": "bottom: 82.7431%; left: 47.0775%; z-index: 201; cursor: grab; width: 128px; height: 17px;"
  },
  {
    "name": "甲方考生家长联系电话",
    "pageNum": "2",
    "keyParam": "jia_kaos_parent_phone",
    "fillContentType": "text",
    "fillUserType": 1,
    "zIndex": 1,
    "value": "13617100000",
    "style": "bottom: 79.1048%; left: 36.2023%; z-index: 201; cursor: grab; height: 17px; width: 97px;"
  },
  {
    "name": "乙方联系电话",
    "pageNum": "2",
    "keyParam": "yi_phone",
    "fillContentType": "text",
    "fillUserType": 2,
    "zIndex": 1,
    "value": "13612340123",
    "style": "bottom: 64.1881%; left: 36.3749%; z-index: 201; cursor: grab; width: 91px; height: 17px;"
  },
  {
    "name": "选择服务费用类型",
    "pageNum": "3",
    "keyParam": "select_server_type",
    "fillContentType": "text",
    "fillUserType": 1,
    "zIndex": 1,
    "value": "A",
    "style": "bottom: 35.3211%; left: 38.619%; z-index: 201; cursor: grabbing; width: 28px; height: 17px;"
  },
  {
    "name": "全部服务费用",
    "pageNum": "3",
    "keyParam": "all_server_money",
    "fillContentType": "text",
    "fillUserType": 2,
    "zIndex": 1,
    "value": "4980",
    "style": "bottom: 13.253%; left: 17.9042%; z-index: 201; cursor: grab; width: 65px; height: 17px;"
  },
  {
    "name": "全部服务费用_金额大写",
    "pageNum": "3",
    "keyParam": "all_server_money_daxie",
    "fillContentType": "text",
    "fillUserType": 2,
    "zIndex": 1,
    "value": "肆仟玖佰捌拾元整",
    "style": "bottom: 13.3743%; left: 40.5179%; z-index: 201; cursor: grab; height: 17px; width: 166px;"
  },
  // {
  //   "name": "甲方签章",
  //   "pageNum": "8",
  //   "keyParam": "jia_qianzhang",
  //   "fillContentType": "img",
  //   "fillUserType": 1,
  //   "zIndex": 1,
  //   "value": "https://gxs-common.oss-cn-shenzhen.aliyuncs.com/testpic/pic/3890506595015109.png",
  //   "style": "bottom: 44.1779%; left: 22.3924%; z-index: 201; height: 115px; width: 158px; cursor: grab;"
  // },
  {
    "name": "甲方签名",
    "pageNum": "8",
    "keyParam": "jia_qianming",
    "fillContentType": "img",
    "fillUserType": 1,
    "zIndex": 1,
    "value": "data:image/png;base64,iVBORw0KGgoAAAANSUhEUgAAArsAAAFXCAYAAACiDYbmAAAAAXNSR0IArs4c6QAAHbJJREFUeF7t3X3Md3VdB/C3EA+BCHjzUCryIIqJLnWm1haGJtVqrq3aNIkCWSvn5nJay625dJTiMBplf6RGkSX1Ty7Lakyx2sCyKSUBCgIZIs8PIko8db51rnV5dd/c1/W7rvvzO7/vef02Bvd9n/P7fD+vz/fe3pyd65wnxYcAAQIECBAgQIBApwJP6rQvbREgQIAAAQIECBCIsGsTECBAgAABAgQIdCsg7HY7Wo0RIECAAAECBAgIu/YAAQIECBAgQIBAtwLCbrej1RgBAgQIECBAgICwaw8QIECAAAECBAh0KyDsdjtajREgQIAAAQIECAi79gABAgQIECBAgEC3AsJut6PVGAECBAgQIECAgLBrDxAgQIAAAQIECHQrIOx2O1qNESBAgAABAgQICLv2AAECBAgQIECAQLcCwm63o9UYAQIECBAgQICAsGsPECBAgAABAgQIdCsg7HY7Wo0RIECAAAECBAgIu/YAAQIECBAgQIBAtwLCbrej1RgBAgQIECBAgICwaw8QIECAAAECBAh0KyDsdjtajREgQIAAAQIECAi79gABAgQIECBAgEC3AsJut6PVGAECBAgQIECAgLBrDxAgQIAAAQIECHQrIOx2O1qNESBAgAABAgQICLv2AAECBAgQIECAQLcCwm63o9UYAQIECBAgQICAsGsPECBAgAABAgQIdCsg7HY7Wo0RIECAAAECBAgIu/YAAQIECBAgQIBAtwLCbrej1RgBAgQIECBAgICwaw8QIECAAAECBAh0KyDsdjtajREgQIAAAQIECAi79gABAgQIECBAgEC3AsJut6PVGAECBAgQIECAgLBrDxAgQIAAAQIECHQrIOx2O1qNESBAgAABAgQICLv2AAECBAgQIECAQLcCwm63o9UYAQIECBAgQICAsGsPECBAgAABAgQIdCsg7HY7Wo0RIECAAAECBAgIu/YAAQIECBAgQIBAtwLCbrej1RgBAgQIECBAgICwaw8QIECAAAECBAh0KyDsdjtajREgQIAAAQIECAi79gABAgQIECBAgEC3AsJut6PVGAECBAgQIECAgLBrDxAgQIAAAQIECHQrIOx2O1qNESBAgAABAgQICLv2AAECBAgQIECAQLcCwm63o9UYAQIECBAgQICAsGsPECBAgAABAgQIdCsg7HY7Wo0RIECAAAECBAgIu/YAAQIECBAgQIBAtwLCbrej1RgBAgQIECBAgICwaw8QIECAAAECBAh0KyDsdjtajREgQIAAAQIECAi79gABAgQIECBAgEC3AsJut6PVGAECBAgQIECAgLBrDxAgQIAAAQIECHQrIOx2O1qNESBAgAABAgQICLv2AAECBAgQIECAQLcCwm63o9UYAQIECBAgQICAsGsPECBAgAABAgQIdCsg7HY7Wo0RIECAAAECBAgIu/YAAQIECBAgQIBAtwLCbrej1RgBAgQIECBAgICwaw8QIECAAAECBAh0KyDsdjtajREgQIAAAQIECAi79gABAgQIECBAgEC3AsJut6PVGAECBAgQIECAgLBrDxAgQIAAAQIECHQrIOx2O1qNESBAgAABAgQICLv2AAECBAgQIECAQLcCwm63o9UYAQIECBAgQICAsGsPECBAgAABAgQIdCsg7HY7Wo0RIECAAAECBAgIu/YAAQIECBAgQIBAtwLCbrej1RgBAgQIECBAgICwaw8QIECAAAECBAh0KyDsdjtajREgQIAAAQIECAi79gABAgQIECBAgEC3AsJut6PVGAECBAgQIECAgLBrDxAgQIAAAQIECHQrIOx2O1qNESBAgAABAgQICLv2AAECBAgQIECAQLcCwm63o9UYAQIECBAgQICAsGsPECBAgAABAgQIdCsg7HY7Wo0RIECAAAECBAgIu/YAAQIECBAgQIBAtwLCbrej1RgBAgQIECBAgICwaw8QIECAAAECBAh0KyDsdjtajREgQIAAAQIECAi79gABAgQIECBAgEC3AsJut6PVGAECBAgQIECAgLBrDxAgQIAAAQIECHQrIOx2O1qNESBAgAABAgQICLv2AAECBAgQIECAQLcCwm63o9UYAQIECBAgQICAsGsPECBAgAABAgQIdCsg7HY7Wo0RIECAAAECBAgIu/YAAQIECBAgQIBAtwLCbrej1RgBAgQIECBAgICwaw8QIECAAAECBAh0KyDsdjtajREgQIAAAQIECAi79gABAgQIECBAgEC3AsJut6PVGAECBAgQIECAgLBrDxAgQIAAAQIECHQrIOx2O1qNESBAgAABAgQICLv2AAECBAgQIECAQLcCwm63o9UYAQIECBAgQICAsGsP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9t2s8Lnja37Xfkht7ZAWRlt4/sKGc54+BtB2ZXf9D7AdkuTkMYgeukSJ9vSIS5dYX2kCBAgQIDA7AWF3diOffcPteb0tYLfw2/794iTfn+SO8eptC9EtTLeruLeOWu3Yh4b7j788XrVtPzDXAvgzkzxl3ZXddrX4O5PsGn/vkeHlF/cML7w4crxSfGaSf539BAAQIECAAIFCAWG3EFspAgQIECBAgACBWgFht9ZbNQIECBAgQIAAgUIBYbcQWykCBAgQIECAAIFaAWG31ls1AgQIECBAgACBQgFhtxBbKQIECBAgQIAAgVoBYbfWWzUCBAgQIECAAIFCAWG3EFspAgQIECBAgACBWgFht9ZbNQIECBAgQIAAgUIBYbcQWykCBAgQIECAAIFaAWG31ls1AgQIECBAgACBQgFhtxBbKQIECBAgQIAAgVoBYbfWWzUCBAgQIECAAIFCAWG3EFspAgQIECBAgACBWgFht9ZbNQIECBAgQIAAgUIBYbcQWykCBAgQIECAAIFaAWG31ls1AgQIECBAgACBQgFhtxBbKQIECBAgQIAAgVoBYbfWWzUCBAgQIECAAIFCAWG3EFspAgQIECBAgACBWgFht9ZbNQIECBAgQIAAgUIBYbcQWykCBAgQIECAAIFaAWG31ls1AgQIECBAgACBQgFhtxBbKQIECBAgQIAAgVoBYbfWWzUCBAgQIECAAIFCAWG3EFspAgQIECBAgACBWgFht9ZbNQIECBAgQIAAgUIBYbcQWykCBAgQIECAAIFaAWG31ls1AgQIECBAgACBQgFhtxBbKQIECBAgQIAAgVoBYbfWWzUCBAgQIECAAIFCAWG3EFspAgQIECBAgACBWgFht9ZbNQIECBAgQIAAgUIBYbcQWykCBAgQIECAAIFaAWG31ls1AgQIECBAgACBQgFhtxBbKQIECBAgQIAAgVoBYbfWWzUCBAgQIECAAIFCAWG3EFspAgQIECBAgACBWgFht9ZbNQIECBAgQIAAgUIBYbcQWykCBAgQIECAAIFaAWG31ls1AgQIECBAgACBQgFhtxBbKQIECBAgQIAAgVoBYbfWWzUCBAgQIECAAIFCAWG3EFspAgQIECBAgACBWgFht9ZbNQIECBAgQIAAgUIBYbcQWykCBAgQIECAAIFaAWG31ls1AgQIECBAgACBQgFhtxBbKQIECBAgQIAAgVoBYbfWWzUCBAgQIECAAIFCAWG3EFspAgQIECBAgACBWgFht9ZbNQIECBAgQIAAgUIBYbcQWykCBAgQIECAAIFaAWG31ls1AgQIECBAgACBQgFhtxBbKQIECBAgQIAAgVoBYbfWWzUCBAgQIECAAIFCAWG3EFspAgQIECBAgACBWgFht9ZbNQIECBAgQIAAgUIBYbcQWykCBAgQIECAAIFaAWG31ls1AgQIECBAgACBQgFhtxBbKQIECBAgQIAAgVoBYbfWWzUCBAgQIECAAIFCAWG3EFspAgQIECBAgACBWgFht9ZbNQIECBAgQIAAgUIBYbcQWykCBAgQIECAAIFaAWG31ls1AgQIECBAgACBQgFhtxBbKQIECBAgQIAAgVoBYbfWWzUCBAgQIECAAIFCAWG3EFspAgQIECBAgACBWgFht9ZbNQIECBAgQIAAgUIBYbcQWykCBAgQIECAAIFaAWG31ls1AgQIECBAgACBQgFhtxBbKQIECBAgQIAAgVoBYbfWWzUCBAgQIECAAIFCAWG3EFspAgQIECBAgACBWgFht9ZbNQIECBAgQIAAgUIBYbcQWykCBAgQIECAAIFaAWG31ls1AgQIECBAgACBQgFhtxBbKQIECBAgQIAAgVoBYbfWWzUCBAgQIECAAIFCAWG3EFspAgQIECBAgACBWgFht9ZbNQIECBAgQIAAgUIBYbcQWykCBAgQIECAAIFaAWG31ls1AgQIECBAgACBQgFhtxBbKQIECBAgQIAAgVoBYbfWWzUCBAgQIECAAIFCAWG3EFspAgQIECBAgACBWgFht9ZbNQIECBAgQIAAgUIBYbcQWykCBAgQIECAAIFaAWG31ls1AgQIECBAgACBQgFhtxBbKQIECBAgQIAAgVoBYbfWWzUCBAgQIECAAIFCAWG3EFspAgQIECBAgACBWgFht9ZbNQIECBAgQIAAgUIBYbcQWykCBAgQIECAAIFaAWG31ls1AgQIECBAgACBQgFhtxBbKQIECBAgQIAAgVoBYbfWWzUCBAgQIECAAIFCAWG3EFspAgQIECBAgACBWgFht9ZbNQIECBAgQIAAgUIBYbcQWykCBAgQIECAAIFaAWG31ls1AgQIECBAgACBQgFhtxBbKQIECBAgQIAAgVoBYbfWWzUCBAgQIECAAIFCAWG3EFspAgQIECBAgACBWgFht9ZbNQIECBAgQIAAgUIBYbcQWykCBAgQIECAAIFaAWG31ls1AgQIECBAgACBQgFhtxBbKQIECBAgQIAAgVoBYbfWWzUCBAgQIECAAIFCAWG3EFspAgQIECBAgACBWgFht9ZbNQIECBAgQIAAgUIBYbcQWykCBAgQIECAAIFaAWG31ls1AgQIECBAgACBQgFhtxBbKQIECBAgQIAAgVoBYbfWWzUCBAgQIECAAIFCAWG3EFspAgQIECBAgACBWgFht9ZbNQIECBAgQIAAgUIBYbcQWykCBAgQIECAAIFaAWG31ls1AgQIECBAgACBQgFhtxBbKQIECBAgQIAAgVoBYbfWWzUCBAgQIECAAIFCAWG3EFspAgQIECBAgACBWgFht9ZbNQIECBAgQIAAgUIBYbcQWykCBAgQIECAAIFaAWG31ls1AgQIECBAgACBQgFhtxBbKQIECBAgQIAAgVoBYbfWWzUCBAgQIECAAIFCAWG3EFspAgQIECBAgACBWgFht9ZbNQIECBAgQIAAgUIBYbcQWykCBAgQIECAAIFaAWG31ls1AgQIECBAgACBQgFhtxBbKQIECBAgQIAAgVqB/waYoXFnlEiO7gAAAABJRU5ErkJggg==",
    "style": "bottom: 40.9035%; left: 26.8806%; z-index: 201; cursor: grabbing; height: 108px; width: 111px;"
  },

]);
const newMarkList = ref([])
const PDFLoading = ref(false);
const curViewPdf = ref();
const toastMsg = ref('');
onBeforeMount(() => {
  getMarkList();
})

onMounted(async () => {
  const pdfData = await generatePDF(pdfurl1,newMarkList.value);
  curViewPdf.value = pdfData;
  initPdf(contractPdf.value, {
    data:pdfData
  });
});

/**下载Pdf */
const downloadPdf = (dataByte) => {
  //下载pdf
  const blob = new Blob([dataByte], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = '合同.pdf';
  link.click();
}

/**获取填充标记列表 */
const getMarkList = () => {
  // let data = localStorageMethods.getItem("ContractMakerList");
  // markList.value = data || [];
  newMarkList.value = handleMarkerData(markList.value);
}

/**处理填充标记数据 */
const handleMarkerData = (data = []) => {
    let newData = [];
    for (let i = 0; i < data.length; i++) {
        const item = data[i];
        let body = {};
        let styleObj = parseStyles(item.style);
        body = {
            ...item,
            styleObj: styleObj
        }
        newData.push(body);
    }
    return newData;
}

/**以Html的方式插入Marker */
// const innerEditorModal = (data) => {
//   // console.log("执行插入Marker:", data.keyParam);
//   const { pageNum, keyParam, zIndex } = data;
//   // 将内容组件动态插入指定位置
//   const childApp = createApp(SlotBox, {
//     name: data?.name,
//     value: data?.value,
//     fillContentType: data?.fillContentType,
//     fillUserType: data?.fillUserType,
//   });
//   let targetElement = document.querySelector(`[name="page=${pageNum}"]`); //目标节点
//   let marker = document.createElement('div');
//   marker.className = 'draggable-mark';
//   marker.style = data?.style || '';
//   marker.id = keyParam;
//   targetElement.appendChild(marker);
//   childApp.mount(marker);
// }

// /**初始化合同标记 */
// const initContrctMark = () => {
//   // console.log('初始化合同标记:', markList.value);
//   let len = markList.value.length;
//   for (let i = 0; i < len; i++) {
//     const item = markList.value[i];
//     innerEditorModal(item);
//   }
// }

/**合成PDF文件 
 * 实现：采用Html转pdf
*/
// const generatePDF2 = async () => {
//   PDFLoading.value = true;
//   try {
//     const pdf = new jsPDF({
//       unit: 'mm',
//       format: 'a4',
//       compression: 'NONE',
//     });
//     console.log('pdfPageNum:', pdfPageNum.value);
//     // 循环遍历每个元素，生成图片并添加到 PDF
//     for (let i = 1; i <= pdfPageNum.value; i++) {
//       console.log('循环遍历每个元素:', i);
//       const pageHtmlDom = document.querySelector(`[name="page=${i}"]`); // 或者选择要生成 PDF 的特定元素
//       console.log('pageHtmlDom.offsetWidth', pageHtmlDom.offsetWidth);
//       console.log('pageHtmlDom.offsetHeight', pageHtmlDom.offsetHeight);
//       const canvas = await html2canvas(pageHtmlDom, {
//         width: pageHtmlDom.offsetWidth,
//         height: pageHtmlDom.offsetHeight,
//         scrollX: 0,
//         scrollY: 0,
//         x: 0,
//         y: 0,
//         allowTaint: true,
//         useCORS: true,
//         // scale: 5, // 调整分辨率
//         logging: true, // 打开日志
//       });
//       pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
//       if (i < pdfPageNum.value) {
//         pdf.addPage();
//       }
//     }
//     pdf.save('合同.pdf');
//     PDFLoading.value = false;
//   } catch (error) {
//     console.error('Error generating PDF:', error);
//     PDFLoading.value = false;
//   }
// };
</script>

<style lang='scss' scoped>
.contract_1 {
  position: relative;
  width: 100vw;
  height: 100vh;
}

.toast {
  position: fixed;
  top: 15%;
  left: 50%;
  transform: translate(-50%, -50%);
  min-width: 50px;
  // height: 20px;
  background-color: #FFFFFF;
  font-size: 12px;
  padding: 2px 8px;
  box-shadow: 0px 0px 2px 1px rgba(0, 0, 0, 0.2);
  border-radius: 15px;
  color: #666666;
  box-sizing: border-box;
  line-height: 20px;
}

.float-btn {
  position: fixed;
  top: 50%;
  left: 0;
  color: #FFFFFF;
  height: 60px;
  width: 60px;
  line-height: 22px;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 12px;
  background-color: #035DFF;
  border-radius: 50%;
  box-sizing: border-box;
  border: 2px solid #ffffff85;
}
</style>
<style lang='scss'>
.draggable-mark {
  width: 100px;
  height: 30px;
  z-index: 200;
  position: absolute;
  font-size: 10px;
}
</style>