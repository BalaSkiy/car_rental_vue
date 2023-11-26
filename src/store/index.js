import { createStore } from 'vuex'
import router from "../router"
import createPersisoyedState from 'vuex-persistedstate'

function addNewRoute(menuList) {
    let routes =router.options.routes
    routes.forEach(routeItem=>{
        if (routeItem.path=="/Index"){
            routes=[]
            menuList.forEach(menu=>{
                let childRoute={
                    path: '/'+menu.menuclick,
                    name: menu.menuname,
                    meta: {
                        title: menu.menuname
                    },
                    component: () => import('../components/'+menu.menucomponent)
                }
                router.addRoute('index', childRoute)
            })
        }
    })
}
// 设置flag，防止非权限路由，页面死循环重定向
let flag = 0
router.beforeEach((to, from, next) => {
    if (flag === 0 && to.matched.length == 0) {
        flag++
        router.push(to.path);
    } else if (flag !== 0 && to.matched.length == 0) {
        next('/')
    } else {
        next()
    }
})

export default createStore({
    state: {
        menu:[]
    },
    mutations: {
        setMenu(state,menuList){
            state.menu=menuList
            addNewRoute(menuList)
        },
        setRouter(state,menuList){
            addNewRoute(menuList)
        },
    },
    getters:{
        getMenu(state){
            return state.menu
        }
    },
    plugins:[createPersisoyedState()]
})