export const localStorageMethods = {
    getItem(key) {
        const value = localStorage.getItem(key);
        try {
            return JSON.parse(value); // 将存储的字符串解析为 JavaScript 对象或数组  
        } catch (error) {
            return value; // 如果解析失败，则返回原始字符串  
        }
    },
    setItem(key, value) {
        const stringValue = JSON.stringify(value); // 将 JavaScript 对象或数组转换为字符串  
        localStorage.setItem(key, stringValue); // 将字符串存储到 localStorage 中  
    },
    removeItem(key) {
        localStorage.removeItem(key); // 移除指定键值的存储项  
    },
    clear() {
        localStorage.clear(); // 清空所有存储项  
    }
};

export const sessionStorageMethods = {
    getItem(key) {
        const value = sessionStorage.getItem(key);
        try {
            return JSON.parse(value); // 将存储的字符串解析为 JavaScript 对象或数组  
        } catch (error) {
            return value; // 如果解析失败，则返回原始字符串  
        }
    },
    setItem(key, value) {
        const stringValue = JSON.stringify(value); // 将 JavaScript 对象或数组转换为字符串  
        sessionStorage.setItem(key, stringValue); // 将字符串存储到 sessionStorage 中  
    },
    removeItem(key) {
        sessionStorage.removeItem(key); // 移除指定键值的存储项  
    },
    clear() {
        sessionStorage.clear(); // 清空所有存储项  
    }
}; 