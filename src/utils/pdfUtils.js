import Pdfh5 from 'pdfh5';
import { PDFDocument, rgb } from 'pdf-lib';
import fontkit from '@pdf-lib/fontkit';
import NotoSansCJKscFont from "@/assets/font/NotoSansCJKsc-Regular.otf";
import { parseStyles, parseValue } from '@/utils/utils';
import opentype from 'opentype.js';


/**使用opentype实现字体子集化
 * @param fontBuffer  字体库数据
 * @param charactersToEmbed 需要子集化的字符
 */
export const embedSubsetFont = async (fontBuffer, charactersToEmbed) => {
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

/**初始化加载pdf 阅读器
 * @description 具体配置参考pdfh5：https://github.com/gjTool/pdfh5#readme
 */
export const initPdf = (el, opts) => {

    return new Promise((resolve, reject) => {
        let pdfh5 = new Pdfh5(el, {
            pageNum: true, //显示页码
            backTop: false, //显示返回顶部
            ...opts
        });
        pdfh5.on("ready", function () {

        })
        pdfh5.on("complete", function (status, msg, time) {
            resolve(status);
        })
    })


}

/**合成新的PDF文件 实现：直接操作修改pdf
 * @param {string|Uint8Array} pdfurl
 * @param {Array<{
 * value:string;
 * style:string;
 * pageNum:string|number;
 * fillContentType:'text'|'img';
 * zIndex?:string|number
 * }>} list
 * @example const list = [{
    "name": "合同编号",//插入标记名称
    "pageNum": "1",//插入pdf的页码
    "keyParam": "contract_NO",//插入标记的关键字
    "fillContentType": "text",//插入内容的类型
    "fillUserType": 2,//目标用户类型
    "zIndex": 1,//插入图层层级
    "value": "AHwhwhewehehwehhwewHHHGGGSGSSGGSGS1008611231122LLKS",//插入的内容
    "style": "bottom: 83.9558%; left: 64.8577%; z-index: 201; cursor: grab; height: 17px; width: 94px;"//插入的具体位置
  }] 
*/
export const generatePDF = async (pdfurl, list) => {
    let pdfBytes, pdfDoc;
    try {
        const response = await fetch(pdfurl);
        pdfBytes = await response.arrayBuffer();
        pdfDoc = await PDFDocument.load(pdfBytes);
        pdfDoc.registerFontkit(fontkit);
        // const font = await pdfDoc.embedFont(StandardFonts.Helvetica);
        // 选择支持中文的字体文件（这里使用思源宋体作为示例，请替换成你实际使用的字体文件）
        const serifFont = await fetch(NotoSansCJKscFont).then((res) => res.arrayBuffer());
        for (let i = 0; i < list.length; i++) {
            const item = list[i];
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

        return modifiedPdfBytes;
    } catch (error) {
        console.error('Error generate PDF:', error);
    }
}

export default {
    initPdf,
    generatePDF,
    parseValue,
    parseStyles,
} 