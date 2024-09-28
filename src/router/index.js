import { createRouter, createWebHistory } from 'vue-router'
import HomeView from '../views/userHomeView.vue'
import login from "@/views/login.vue";
import Register from "@/views/Register.vue";
import userHomeView from "@/views/userHomeView.vue";
import adminHomeView from "@/views/adminHomeView.vue";
import personalInfo from "@/views/personalInfo.vue";
import myBorrow from "@/views/myBorrow.vue";
import changePassword from "@/views/changePassword.vue";
import adminpersonalInfo from "@/views/adminpersonalInfo.vue";
import adminUserManagement from "@/views/adminUserManagement.vue";
import adminBookManagement from "@/views/adminBookManagement.vue";
import adminchangePassword from "@/views/adminchangePassword.vue";
import borrowRecord from "@/views/borrowRecord.vue";
// import index from "@/views/index.vue"; //这里一定要引入对不然路由不了

const routes = [
  {
    path: '/changePassword',
    name: 'changePassword',
    component: changePassword,
    meta: { title:'用户修改密码' } //给该页面的标签页设置名字属性
  },

  {
    path: '/myBorrow',
    name: 'myBorrow',
    component: myBorrow,
    meta: { title:'借阅书籍' } //给该页面的标签页设置名字属性
  },
  {
    path: '/personalInfo',
    name: 'personalInfo',
    component: personalInfo,
    meta: { title:'个人信息' } //给该页面的标签页设置名字属性
  },
  {
    path: '/adminhome',
    name: 'adminhome',
    component: adminHomeView,
    meta: { title: '管理员图书主页面' } //给该页面的标签页设置名字属性
  },
  {
    path: '/userhome',
    name: 'userhome',
    component: userHomeView,
    meta: { title: '用户图书主页面' } //给该页面的标签页设置名字属性
  },
  {
    path: '/about',
    name: 'about',
    // route level code-splitting
    // this generates a separate chunk (about.[hash].js) for this route
    // which is lazy-loaded when the route is visited.
    component: () => import(/* webpackChunkName: "about" */ '../views/AboutView.vue')
  },
  {
    path: '/',
    name: 'login',
    component: login,
    meta: { title: '图书馆登录' } //给该页面的标签页设置名字属性
  },
  {
    path: '/Register',
    name: 'Register',
    component: Register,
    meta: { title: '图书馆注册' } //给该页面的标签页设置名字属性
  },
  {
    path: '/adminpersonalInfo',
    name: 'adminpersonalInfo',
    component: adminpersonalInfo,
    meta: { title: '管理员信息' } //给该页面的标签页设置名字属性
  },
  {
    path: '/adminUserManagement',
    name: 'adminUserManagement',
    component: adminUserManagement,
    meta: { title: '用户管理' } //给该页面的标签页设置名字属性
  },
  {
    path: '/adminBookManagement',
    name: 'adminBookManagement',
    component: adminBookManagement,
    meta: { title: '书籍管理' } //给该页面的标签页设置名字属性
  } ,{
    path: '/adminchangePassword',
    name: 'adminchangePassword',
    component: adminchangePassword,
    meta: { title:'管理员修改密码' } //给该页面的标签页设置名字属性
  },
  {
    path: '/borrowRecord',
    name: 'borrowRecord',
    component: borrowRecord,
    meta: { title:'借阅记录' } //给该页面的标签页设置名字属性
  },
  // {
  //   path: '/index',
  //   name: 'index',
  //   component: index,
  //   meta: { title: 'test' } //给该页面的标签页设置名字属性
  // }
]

const router = createRouter({
  history: createWebHistory(process.env.BASE_URL),
  routes
})

router.beforeEach((to,from,next) => {
  document.title = to.meta.title //动态轮询给当前标签页赋值给当前页面
  next()
})


export default router
