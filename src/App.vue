<template>
<!--<div>-->
<!--&lt;!&ndash;  引用组件&ndash;&gt;-->
<!--&lt;!&ndash;  头部&ndash;&gt;-->
<!--  <Header/>-->
<!--&lt;!&ndash;  主体&ndash;&gt;-->
<!--  <div style="display:flex">-->
<!--&lt;!&ndash;  侧边栏&ndash;&gt;-->
<!--    <Aside/>-->
<!--&lt;!&ndash;    内容区域是从HomeView组件路由机制来的&ndash;&gt;-->
<!--    <router-view style="flex:1"/>-->
<!--  </div>-->
<!--</div>-->
  <div>
    <router-view style="flex:1"/> <!--路由默认到"/"先默认显示login页面-->
  </div>
</template>


<style>

</style>

<script>
import Header  from "@/components/Header.vue"; //使用一个组件导入导出都需要 如果配置一个组件只需导出
import Aside from "./components/Aside.vue";
export default {
  name: "Layout",
  components: {
    Header,
    Aside
  }
}
</script>


