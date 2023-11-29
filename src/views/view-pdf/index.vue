<template>
  <div class="contract_1" ref="contractPdf"></div>
  <div class="float-btn" @click="generatePDF2">
    下载PDF
  </div>
  <div v-if="generatePDFLoading" class="toast">正在获取合同文件...</div>
</template>

<script setup>
import Pdfh5 from 'pdfh5';
import html2canvas from 'html2canvas';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
// import Fontmin from "fontmin";
import jsPDF from 'jspdf';
import pdfurl1 from "@/assets/pdf/volserver.pdf";
// import NotoSansCJKscFont from "../../assets/font/NotoSansCJKsc-VF.otf";
// import NotoSerifCJKscFont from "../../assets/font/NotoSerifCJKsc-VF.ttf";
import FantasqueSansMonoFont from "../../assets/font/FantasqueSansMono-Bold.ttf";
import NotoSansCJKscFont from "../../assets/font/NotoSansCJKsc-Regular.otf";
import { ref, onMounted, onBeforeMount, createApp } from 'vue';
import { localStorageMethods } from '@/utils/storage';
import SlotBox from '../fast-template/slot-box.vue';
import fontkit from '@pdf-lib/fontkit'

const contractPdf = ref();
const markList = ref([
  {
    "name": "合同编号",
    "pageNum": "1",
    "keyParam": "contract_NO",
    "fillContentType": "text",
    "fillUserType": 1,
    "zIndex": 1,
    "value": "10086111",
    "style": "top: 12.9944%; left: 64.2756%; z-index: 201; cursor: grabbing; height: 21px; width: 73px;"
  },
  {
    "name": "考生姓名",
    "pageNum": "1",
    "keyParam": "kaos_name",
    "fillContentType": "text",
    "fillUserType": 1,
    "zIndex": 1,
    "value": "王勇祥",
    "style": "top: 77.7732%; left: 44.4853%; z-index: 201; cursor: grabbing; height: 17px; width: 76px;"
  },
  {
    "name": "考生家长",
    "pageNum": "2",
    "keyParam": "kaos_parent",
    "fillContentType": "text",
    "fillUserType": 1,
    "zIndex": 1,
    "value": "考生家长",
    "style": "top: 10.7477%; left: 40.4788%; z-index: 201; height: 17px; width: 88px; cursor: grabbing;"
  },
  {
    "name": "考生家长身份证号",
    "pageNum": "2",
    "keyParam": "kaos_parent_idcard",
    "fillContentType": "text",
    "fillUserType": 1,
    "zIndex": 1,
    "value": "404231221212124314",
    "style": "top: 14.8666%; left: 45.559%; z-index: 201; cursor: grabbing; height: 18px; width: 97px;"
  },
  {
    "name": "家长联系电话",
    "pageNum": "2",
    "keyParam": "kaos_parent_phoneNo",
    "fillContentType": "text",
    "fillUserType": 1,
    "zIndex": 1,
    "value": "13611111111",
    "style": "top: 18.2366%; left: 34.329%; z-index: 201; height: 17px; width: 65px; cursor: grabbing;"
  },
  {
    "name": "客服经理联系电话",
    "pageNum": "2",
    "keyParam": "saleman_phoneNo",
    "fillContentType": "text",
    "fillUserType": 2,
    "zIndex": 1,
    "value": "13612312323",
    "style": "top: 32.6527%; left: 30.8531%; z-index: 201; cursor: grab; width: 97px; height: 17px;"
  },
  {
    "name": "甲方选择",
    "pageNum": "3",
    "keyParam": "jia_select_serverType",
    "fillContentType": "text",
    "fillUserType": 1,
    "zIndex": 1,
    "value": "A",
    "style": "top: 61.6721%; left: 38.6071%; z-index: 201; cursor: grabbing; width: 39px; height: 18px;"
  },
  {
    "name": "甲方签字",
    "pageNum": "8",
    "keyParam": "jia_qianzi",
    "fillContentType": "img",
    "fillUserType": 1,
    "zIndex": 1,
    "value": "https://gxs-common.oss-cn-shenzhen.aliyuncs.com/testpic/pic/2564667651498176.png",
    "style": "top: 45.7582%; left: 22.297%; z-index: 201; cursor: grabbing; height: 55px; width: 59px;"
  },
  {
    "name": "乙方签字",
    "pageNum": "8",
    "keyParam": "yi_qianzi",
    "fillContentType": "img",
    "fillUserType": 2,
    "zIndex": 1,
    "value": "https://gxs-common.oss-cn-shenzhen.aliyuncs.com/testpic/pic/2564667651498176.png",
    "style": "top: 43.6988%; left: 66.682%; z-index: 201; cursor: grab; width: 83px; height: 79px;"
  }
]);
const pdfPageNum = ref();
const generatePDFLoading = ref(false);
onBeforeMount(() => {
  // getMarkList();
})

onMounted(() => {
  initPdf();
  // console.log('devicePixelRatio:',window.devicePixelRatio);
  // generatePDF2();
});

/**生成PDF文件 */
const generatePDF = async () => {
  generatePDFLoading.value = true;
  try {
    const pdf = new jsPDF({
      unit: 'mm',
      format: 'a4',
      compression: 'NONE',
    });
    console.log('pdfPageNum:', pdfPageNum.value);
    // 循环遍历每个元素，生成图片并添加到 PDF
    for (let i = 1; i <= pdfPageNum.value; i++) {
      console.log('循环遍历每个元素:', i);
      const pageHtmlDom = document.querySelector(`[name="page=${i}"]`); // 或者选择要生成 PDF 的特定元素
      console.log('pageHtmlDom.offsetWidth', pageHtmlDom.offsetWidth);
      console.log('pageHtmlDom.offsetHeight', pageHtmlDom.offsetHeight);
      const canvas = await html2canvas(pageHtmlDom, {
        width: pageHtmlDom.offsetWidth,
        height: pageHtmlDom.offsetHeight,
        scrollX: 0,
        scrollY: 0,
        x: 0,
        y: 0,
        allowTaint: true,
        useCORS: true,
        // scale: 5, // 调整分辨率
        logging: true, // 打开日志
      });
      pdf.addImage(canvas.toDataURL('image/jpeg', 1.0), 'JPEG', 0, 0, pdf.internal.pageSize.getWidth(), pdf.internal.pageSize.getHeight());
      if (i < pdfPageNum.value) {
        pdf.addPage();
      }
    }
    pdf.save('合同.pdf');
    generatePDFLoading.value = false;
  } catch (error) {
    console.error('Error generating PDF:', error);
    generatePDFLoading.value = false;
  }
};

/**生成PDF文件 */
const generatePDF2 = async () => {
  let pdfBytes, pdfDoc;
  try {
    const response = await fetch(pdfurl1);
    pdfBytes = await response.arrayBuffer();
    pdfDoc = await PDFDocument.load(pdfBytes);
    pdfDoc.registerFontkit(fontkit);
    // const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    // 选择支持中文的字体文件（这里使用思源宋体作为示例，请替换成你实际使用的字体文件）
    const serifFont = await fetch(FantasqueSansMonoFont).then((res) => res.arrayBuffer());
    // 嵌入字体
    const font = await pdfDoc.embedFont(serifFont);
    for (let i = 0; i <= pdfPageNum.value - 1; i++) {
      const curPage = pdfDoc.getPage(i);
      const { width, height } = curPage.getSize();
      const value = "ht合同10086123";
      // 添加文字到指定位置
      curPage.drawText(value, {
        x: width * 64.8577 / 100, // 10% from left
        y: height * 83.9558 / 100, // 10% from top
        font: font,
        size: 15,
        color: rgb(0, 0, 0), // Black color
        fontWeight: 'bold',
      });
    }
    const modifiedPdfBytes = await pdfDoc.save();
    const blob = new Blob([modifiedPdfBytes], { type: 'application/pdf' });
    const link = document.createElement('a');
    link.href = URL.createObjectURL(blob);
    link.download = '合同.pdf';
    link.click();
    console.log('PDF loaded successfully!');
  } catch (error) {
    console.error('Error loading PDF:', error);
  }
}

/**字体子集化*/
// const embedSubsetFont = async (fontBuffer, charactersToEmbed) => {
//   // 使用 fontmin 创建实例
//   const fontmin = new Fontmin()
//     .src({ buffer: fontBuffer })
//     .use(Fontmin.glyph({ text: charactersToEmbed }));

//   // 运行子集化
//   const files = await fontmin.run();

//   // 获取子集字体文件
//   const subsetFontBuffer = files[0].contents;

//   // 嵌入子集字体
//   // const font = await pdfDoc.embedFont(subsetFontBuffer);
//   return subsetFontBuffer
// }

/**获取填充标记列表 */
const getMarkList = () => {
  let data = localStorageMethods.getItem("ContractMakerList");
  markList.value = data || [];
}

/**初始化合同标记 */
const initContrctMark = () => {
  // console.log('初始化合同标记:', markList.value);
  let len = markList.value.length;
  for (let i = 0; i < len; i++) {
    const item = markList.value[i];
    innerEditorModal(item);
  }
}

/**初始化加载pdf 阅读器 */
const initPdf = () => {
  let pdfh5 = new Pdfh5(contractPdf.value, {
    pdfurl: pdfurl1,
  });
  pdfh5.on("ready", function () {
    pdfPageNum.value = this.totalNum;
    // console.log("总页数：" + this.totalNum)
  })
  pdfh5.on("success", function () {
    // console.log("initPdf-success");
    initContrctMark();
  })
}

/**插入Marker */
const innerEditorModal = (data) => {
  // console.log("执行插入Marker:", data.keyParam);
  const { pageNum, keyParam, zIndex } = data;
  // 将内容组件动态插入指定位置
  const childApp = createApp(SlotBox, {
    name: data?.name,
    value: data?.value,
    fillContentType: data?.fillContentType,
    fillUserType: data?.fillUserType,
  });
  let targetElement = document.querySelector(`[name="page=${pageNum}"]`); //目标节点
  let marker = document.createElement('div');
  marker.className = 'draggable-mark';
  marker.style = data?.style || '';
  marker.id = keyParam;
  targetElement.appendChild(marker);
  childApp.mount(marker);
}
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