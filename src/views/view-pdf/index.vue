<template>
  <div class="contract_1" ref="contractPdf"></div>
  <div class="float-btn" @click="downloadPdf(curViewPdf)">
    下载PDF
  </div>
  <div v-if="PDFLoading && toastMsg" class="toast">{{ toastMsg }}</div>
</template>

<script setup>
import { ref, onMounted, onBeforeMount, createApp } from 'vue';
import Pdfh5 from 'pdfh5';
import html2canvas from 'html2canvas';
import fontkit from '@pdf-lib/fontkit';
import opentype from 'opentype.js';
import { PDFDocument, StandardFonts, rgb } from 'pdf-lib';
import jsPDF from 'jspdf';
import pdfurl1 from "@/assets/pdf/volserver.pdf";
import NotoSansCJKscFont from "../../assets/font/NotoSansCJKsc-Regular.otf";
import { localStorageMethods } from '@/utils/storage';
import { parseStyles, parseValue } from '@/utils/utils';

import SlotBox from '../fast-template/slot-box.vue';

// import Fontmin from "fontmin";

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
  {
    "name": "甲方签章",
    "pageNum": "8",
    "keyParam": "jia_qianzhang",
    "fillContentType": "img",
    "fillUserType": 1,
    "zIndex": 1,
    "value": "https://gxs-common.oss-cn-shenzhen.aliyuncs.com/testpic/pic/3890506595015109.png",
    "style": "bottom: 44.1779%; left: 22.3924%; z-index: 201; height: 115px; width: 158px; cursor: grab;"
  },
  {
    "name": "甲方签名",
    "pageNum": "8",
    "keyParam": "jia_qianming",
    "fillContentType": "img",
    "fillUserType": 1,
    "zIndex": 1,
    "value": "https://gxs-common.oss-cn-shenzhen.aliyuncs.com/testpic/pic/2218568152030558.png",
    "style": "bottom: 40.9035%; left: 26.8806%; z-index: 201; cursor: grabbing; height: 108px; width: 111px;"
  },

]);
const newMarkList = ref([])
const pdfPageNum = ref();
const PDFLoading = ref(false);
const curViewPdf = ref();
const toastMsg = ref('');
onBeforeMount(() => {
  getMarkList();
  handleMarkerData();
})

onMounted(async () => {
  // initPdf(pdfurl1);
  const pdfData = await generatePDF();
  curViewPdf.value = pdfData;
  initPdf('', pdfData);
});



/**合成新的PDF文件 
 * 实现：直接操作修改pdf
*/
const generatePDF = async () => {
  let pdfBytes, pdfDoc;
  PDFLoading.value = true;
  toastMsg.value = "合同文件加载中...";
  try {
    const response = await fetch(pdfurl1);
    pdfBytes = await response.arrayBuffer();
    pdfDoc = await PDFDocument.load(pdfBytes);
    pdfDoc.registerFontkit(fontkit);
    // const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
    // 选择支持中文的字体文件（这里使用思源宋体作为示例，请替换成你实际使用的字体文件）
    const serifFont = await fetch(NotoSansCJKscFont).then((res) => res.arrayBuffer());
    for (let i = 0; i < newMarkList.value.length; i++) {
      const item = newMarkList.value[i];
      const curPage = pdfDoc.getPage(Number(item.pageNum) - 1);
      const { width, height } = curPage.getSize();
      if (item?.fillContentType === 'text') {
        const value = item?.value || '';
        const subFont = await embedSubsetFont(serifFont, value);
        const font = await pdfDoc.embedFont(subFont);
        // 添加文字到指定位置
        curPage.drawText(value, {
          x: width * parseValue(item.styleObj.left) / 100, // 10% from left
          y: height * parseValue(item.styleObj.bottom) / 100, // 10% from top
          maxWidth: parseValue(item.styleObj.width),
          lineHeight: 15,
          font: font,
          size: 15,
          color: rgb(0, 0, 0), // Black color
        });
      } else if (item?.fillContentType === 'img') {
        const imageUrl = item?.value;
        const imageBytes = await fetch(imageUrl).then((res) => res.arrayBuffer());
        console.log('jpgImageBytes', imageBytes);
        const jpgImage = await pdfDoc.embedPng(imageBytes);
        curPage.drawImage(jpgImage, {
          blendMode: 'Overlay',
          x: width * parseValue(item.styleObj.left) / 100, // 10% from left
          y: height * parseValue(item.styleObj.bottom) / 100, // 10% from top
          width: parseValue(item.styleObj.width),
          height: parseValue(item.styleObj.height)
        })
      }

    }
    const modifiedPdfBytes = await pdfDoc.save();
    PDFLoading.value = false;
    console.log('PDF loaded successfully!');

    return modifiedPdfBytes;
  } catch (error) {
    console.error('Error loading PDF:', error);
  }
}

/**使用opentype实现字体子集化 */
const embedSubsetFont = async (fontBuffer, charactersToEmbed) => {
  // console.log('子集化传值:',fontBuffer, charactersToEmbed);
  try {
    // 解析原始字体
    const font = opentype.parse(fontBuffer);
    // 获取子集化的字形
    const subsetGlyphs = Array.from(new Set(charactersToEmbed))
      .map(char => font.charToGlyph(char))
      .filter(glyph => glyph);

    // 创建一个包含子集的新字体
    const subsetFont = new opentype.Font({
      familyName: font.names.fontFamily,
      styleName: font.names.fontSubfamily,
      unitsPerEm: font.unitsPerEm,
      ascender: font.ascender,
      descender: font.descender,
      glyphs: subsetGlyphs,
    });

    // 将新字体转为 ArrayBuffer
    const subsetFontBuffer = new Uint8Array(subsetFont.toArrayBuffer());

    return subsetFontBuffer;
  } catch (error) {
    console.log('子集化失败：', error);
  }

}

/**下载Pdf */
const downloadPdf = (dataByte) => {
  //下载pdf
  const blob = new Blob([dataByte], { type: 'application/pdf' });
  const link = document.createElement('a');
  link.href = URL.createObjectURL(blob);
  link.download = '合同.pdf';
  link.click();
}

/**Fontmin字体子集化
 * 该方案目测有兼容性问题，半天没解决
*/
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

/**处理填充标记数据 */
const handleMarkerData = (data = []) => {
  let newData = [];
  for (let i = 0; i < markList.value.length; i++) {
    const item = markList.value[i];
    let body = {};
    let styleObj = parseStyles(item.style);
    // console.log('styleObj:',styleObj);
    body = {
      ...item,
      styleObj: styleObj
    }
    newData.push(body);
  }
  newMarkList.value = newData;
  // console.log(newMarkList.value);
}

/**获取填充标记列表 */
const getMarkList = () => {
  let data = localStorageMethods.getItem("ContractMakerList");
  markList.value = data || [];
}



/**初始化加载pdf 阅读器 */
const initPdf = (pdfurl, data) => {
  let pdfh5 = new Pdfh5(contractPdf.value, {
    pdfurl: pdfurl,
    data: data
  });
  pdfh5.on("ready", function () {
    pdfPageNum.value = this.totalNum;
    // console.log("总页数：" + this.totalNum)
  })
  pdfh5.on("success", function () {
    // console.log("initPdf-success");
    // initContrctMark();
  })
}

/**以Html的方式插入Marker */
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

/**初始化合同标记 */
const initContrctMark = () => {
  // console.log('初始化合同标记:', markList.value);
  let len = markList.value.length;
  for (let i = 0; i < len; i++) {
    const item = markList.value[i];
    innerEditorModal(item);
  }
}

/**合成PDF文件 
 * 实现：采用Html转pdf
*/
const generatePDF2 = async () => {
  PDFLoading.value = true;
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
    PDFLoading.value = false;
  } catch (error) {
    console.error('Error generating PDF:', error);
    PDFLoading.value = false;
  }
};
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