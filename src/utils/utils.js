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