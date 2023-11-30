/**深拷贝 */
export const deepclone = (obj) => {
  let targetObj = obj instanceof Array ? [] : {}
  for (const key in obj) {
    const value = obj[key];
    if (value instanceof Array || value instanceof Object) {
      targetObj[key] = deepclone(value)
    } else {
      targetObj[key] = value
    }
  }
  return targetObj
}

/**防抖 */
export function debounce(fn, delay) {
  let timer = null
  // 所以这个函数就可以使用...运算符收集js自动添加的参数到一个数组中
  return function _debounce(...arg) {
    if (timer) clearTimeout(timer)
    timer = setTimeout(() => {
      // 通过apply绑定this和传递参数，apply第二个参数正好是传数组嘛
      fn.apply(this, arg)
    }, delay)
  }
}

/**将css的样式字符串转成对象
 * @example "bottom: 83.9558%; left: 64.8577%; z-index: 201; cursor: grab; height: 17px; width: 94px;"
*/
export const parseStyles = (stylesString) => {
  // 首先按照分号分割字符串
  var styleArray = stylesString.split(';');

  // 创建一个对象来存储解析后的样式
  var stylesObject = {};

  // 遍历每个样式项
  styleArray.forEach(function(style) {
      // 对每个样式项按照冒号分割
      var pair = style.split(':');

      // 如果成功分割成键值对，添加到样式对象中
      if (pair.length === 2) {
          // 去除空格并存储
          var key = pair[0].trim();
          var value = pair[1].trim();
          stylesObject[key] = value;
      }
  });

  return stylesObject;
}


/**将属性值转换为数值的辅助函数*/ 
export const parseValue = (value) => {
  // 尝试解析为浮点数
  var floatValue = parseFloat(value);

  // 如果解析成功，且值包含 '%' 或 'px'，则返回浮点数，否则返回原始字符串
  if (!isNaN(floatValue)) {
      return (value.includes('%') || value.includes('px')) ? floatValue : parseInt(floatValue, 10);
  }

  // 如果无法解析为浮点数，返回原始字符串
  return value;
}