//引入axios
import axios from "axios";
// 通过 axios 创建对象
const request = axios.create({ //request此时为axios对象
    timeout: 5000
})

// request 拦截器
// 1. 可以对请求做一些处理
// 2. 比如统一加 token，Content-Type 等
request.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/json;charset=utf-8';
    return config //这里对前端的请求做拦截 即把所有前端请求的请求头的Content-Type
    // 变成application/json;charset=utf-8 这样以来传给后端的数据都是json格式 不再担心@ResquestBody
    // 接受到除json外其他值了
}, error => {
    return Promise.reject(error)
});
//导出request对象，这样就可以在其他组件中使用
export default request


//response拦截器 拦截后端发过来的信息
// response 拦截器
// 可以在接口响应后统一处理结果
request.interceptors.response.use(
response => {
    let res = response.data; //取出返回 data 的内容
// 如果是返回的文件
    if (response.config.responseType === 'blob') {
        return res
    }
// 如果返回的是 string ,就转成 json 对象
    if (typeof res === 'string') {
        res = res ? JSON.parse(res) : res
    }
    return res;
},error => {
    console.log('err' + error) // 输出错误信息
    return Promise.reject(error)
}
)
