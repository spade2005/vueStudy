import {createRouter, createWebHashHistory} from "vue-router";
import {useTokenStore} from "@/stores/useTokenStore"

const routes = [
    {
        path: '/', name: 'home', component: () => import("@/views/home/home.vue"), redirect: '/welcome',
        children: [
            {path: '/welcome', name: 'welcome', component: () => import("@/views/home/welcome.vue")},
            {path: '/user', name: 'user', component: () => import("@/views/home/user.vue")},

            {path: '/config/list', name: 'config_list', component: () => import("@/views/config/list.vue")},
            {path: '/config/create', name: 'config_create', component: () => import("@/views/config/create.vue")},
            {path: '/config/update', name: 'config_update', component: () => import("@/views/config/update.vue")},

            {path: '/menu/list', name: 'menu_list', component: () => import("@/views/menu/list.vue")},
            {path: '/menu/create', name: 'menu_create', component: () => import("@/views/menu/create.vue")},
            {path: '/menu/update', name: 'menu_update', component: () => import("@/views/menu/update.vue")},

            {path: '/role/list', name: 'role_list', component: () => import("@/views/role/list.vue")},
            {path: '/role/create', name: 'role_create', component: () => import("@/views/role/create.vue")},
            {path: '/role/update', name: 'role_update', component: () => import("@/views/role/update.vue")},
            {path: '/role/menus', name: 'role_menus', component: () => import("@/views/role/menus.vue")},

            {path: '/user/list', name: 'user_list', component: () => import("@/views/user/list.vue")},
            {path: '/user/create', name: 'user_create', component: () => import("@/views/user/create.vue")},
            {path: '/user/update', name: 'user_update', component: () => import("@/views/user/update.vue")},
        ],

    },


    {path: '/login', name: 'login', component: () => import("@/views/auth/login.vue")},
    {path: '/logout', name: 'logout', component: () => import("@/views/auth/logout.vue")},


]


const router = createRouter({
    // 4. 内部提供了 history 模式的实现。为了简单起见，我们在这里使用 hash 模式。
    history: createWebHashHistory(),
    routes, // `routes: routes` 的缩写
})
router.beforeEach((to, from, next) => {
    if (to.name == 'login') {
        next()
    } else {
        const tokener = useTokenStore()
        // console.log(tokener.token, "next checked token")
        if (tokener.token == "") {
            next({name: 'login', query: {redirect: to.fullPath}})
        } else {
            next()
        }
    }
})

export default router