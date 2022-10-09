import axios from 'axios'
import qs from 'Qs'
import {useTokenStore} from "@/stores/useTokenStore"
import router from '@/route/index'


axios.defaults.timeout = 20000
axios.defaults.baseURL = 'http://localhost:8881';
// axios.defaults.headers.common['Authorization'] = AUTH_TOKEN;
axios.defaults.headers.post['Content-Type'] = 'application/x-www-form-urlencoded';


const tokener = useTokenStore()


axios.interceptors.request.use(config => {
    config.headers['Content-Type'] = 'application/x-www-form-urlencoded'
    if (tokener.token != "") {
        config.headers['token'] = tokener.token
    }
    return config
}, error => {
    return Promise.reject(error)
})

axios.interceptors.response.use(response => {
    // ...
    // console.log(response, "i am interceptiors")
    if (response.data.code == "401" || (response.data.code === 1 && response.data.message == "token check error")) {
        tokener.setToken("")
        router.replace({name: 'login', query: {redirect: router.currentRoute.value.fullPath}})
    }
    return response
}, error => {
    return Promise.reject(error)
})


export default {
    httpGet(url, params) {
        return axios.get(url, {params: params})
    },
    httpPost(url, params) {
        return axios.post(url, qs.stringify(params))
    }
}