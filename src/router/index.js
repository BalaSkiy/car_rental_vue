import {createRouter, createWebHistory} from 'vue-router'

const routes = [
    {
        path: '/',
        name: 'login',
        component: () => import('../components/Login')
    },
    {
        path: '/Register',
        name: 'register',
        component: () => import('../components/Register')
    },
    {
        path: '/Index',
        name: 'index',
        component: () => import('../components/Index'),
        children: [
            {
                path: '/Home',
                name: 'home',
                meta: {
                    title: 'home'
                },
                component: () => import('../components/Home')
            },
        ]
    },
]

const router = createRouter({
    history: createWebHistory(),
    routes
})

export default router;