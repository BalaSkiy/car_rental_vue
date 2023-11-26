<template>
  <el-scrollbar>
    <el-menu
        active-text-color="#ffd04b"
        background-color="#545c64"
        class="el-menu-vertical-demo"
        default-active="/Home"
        text-color="#fff"
        style="height: 100vh"
        :collapse="isCollapse"
        :collapse-transition="false"
        router
    >
<!--      <el-menu-item index="/Home">-->
<!--        <el-icon><ElementPlus /></el-icon>-->
<!--        <template #title>首页</template>-->
<!--      </el-menu-item>-->
      <el-menu-item :index="'/'+item.menuclick" v-for="(item,i) in menu" :key="i">
        <el-icon><component :is="item.menuicon"></component></el-icon>
        <template #title>{{ item.menuname }}</template>
      </el-menu-item>
    </el-menu>
  </el-scrollbar>
</template>
<script setup>
import { useStore } from 'vuex' // 引入useStore 方法
const store = useStore()  // 该方法用于返回store 实例
console.log(store)  // store 实例对象

</script>
<script>

export default {
  name: "Aside",
  data() {
    return {
    }
  },
  computed: {
    "menu":{
      get(){
        return this.$store.state.menu
      }
    }
  },
  props: {
    isCollapse: Boolean
  }
}
</script>

<style scoped>

</style>