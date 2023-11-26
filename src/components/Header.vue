<template>
  <div class="toolbar" style="display: flex;line-height: 60px">
    <div>
      <el-icon style="margin-left: 8px;margin-top: 20px;font-size: 20px" @click="collapse">
        <Fold/>
      </el-icon>
    </div>
    <div style="flex: 1;text-align: center;font-size: 34px">
      <span>欢迎登录汽车租赁系统</span>
    </div>
    <span>{{ user.name }}</span>
    <el-dropdown>
      <el-icon style="margin-right: 8px; margin-top: 1px;font-size: 20px">
        <Remove/>
      </el-icon>
      <template #dropdown>
        <el-dropdown-menu>
          <el-dropdown-item v-on:click="logout">退出登录</el-dropdown-item>
        </el-dropdown-menu>
      </template>
    </el-dropdown>
  </div>
</template>
<script setup>
import {Fold, Remove} from '@element-plus/icons-vue'</script>

<script>

import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "Header",
  data() {
    return {
      user: JSON.parse(sessionStorage.getItem('CurUser'))
    }
  },
  methods: {
    toUser() {
      console.log('toUser')
      this.$router.push("/Home")
    },
    logout() {
      console.log('logout')
      ElMessageBox.confirm(
          '确定退出登录？',
          '提示',
          {
            confirmButtonText: '确定',
            cancelButtonText: '取消',
            type: 'warning',
            center: true
          }
      )
          .then(() => {
            ElMessage({
              type: 'success',
              message: '退出登录成功！'
            })
            this.$router.push("/")
            sessionStorage.clear()
          })
          .catch(() => {
            ElMessage({
              type: 'info',
              message: '已取消退出登录'
            })
          })
    },
    collapse() {
      this.$emit('doCollapse')
    }
  },
  created() {
    this.$router.push('/Home')
  }
}
</script>

<style scoped>

</style>