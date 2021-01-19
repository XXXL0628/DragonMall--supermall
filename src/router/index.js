import Vue from 'vue'
import VueRouter from 'vue-router'

const Home = () => import("views/home/Home")
const Category = () => import('views/category/Category')
const Cart = () => import('views/cart/Cart')
const Profile = () => import('views/profile/Profile')
const Detail = ()=> import('views/detail/Detail')
const Login =()=>import('views/login/Login')

//1、安装插件
Vue.use(VueRouter)

const routes = [
  {
    path: '',
    redirect: '/home'
  },
  {
    path: '/home',
    component: Home
  },
  {
    path: '/cart',
    component: Cart
  },
  {
    path: '/category',
    component: Category
  },
  {
    path: '/profile',
    component: Profile
  },
  // {
  //   //动态路由
  //   path:'/detail/:iid',
  //   component: Detail
  // },
  {
    //query模式
    path:'/detail',
    component: Detail
  },
  {
    path:'/login',
    component:Login
  }
]
//2、创建router
const router = new VueRouter({
  routes,
  mode: "history"
})

//3、导出
export default router
