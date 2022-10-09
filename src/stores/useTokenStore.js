import {defineStore} from 'pinia'


export const useTokenStore = defineStore('auther', {
    state: () => {
        return {token: localStorage.getItem('vbase_token')??''}
    },
    // could also be defined as
    // state: () => ({ count: 0 })
    actions: {
        setToken(s) {
            this.token = s
            localStorage.setItem('vbase_token', s)
        },
    },
})