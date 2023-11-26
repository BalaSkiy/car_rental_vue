<template>
  <div>
    <el-scrollbar>
      <div style="margin-bottom: 5px;">
        <el-input v-model="name" placeholder="请输入信息" style="width:250px;" suffix-icon="search"
                  @keyup.enter="loadPost"></el-input>
        <el-button style="margin-left: 5px" type="primary" @click="loadPost">查询</el-button>
        <el-button type="success" @click="resetParam()">重置</el-button>
      </div>
      <el-table :data="tableData"
                :header-cell-style="{background:'#f2f5fc', color:'#555555'}"
                border
      >
        <el-table-column label="新闻" prop="newsinfo" width=""/>
        <el-table-column label="发布时间" prop="newstime" width="200"/>
      </el-table>
      <el-config-provider :locale="zhCn">
        <el-pagination
            v-model:current-page="pageNum"
            v-model:page-size="pageSize"
            :page-sizes="[5, 10, 20, 30]"
            :total="total"
            layout="total, sizes, prev, pager, next, jumper"
            @size-change="handleSizeChange"
            @current-change="handleCurrentChange">
        </el-pagination>
      </el-config-provider>
    </el-scrollbar>
  </div>
</template>

<script setup>
// const tableData = ref(Array.from({ length: 20 }).fill(item))
import {ElConfigProvider} from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
</script>

<script>
export default {
  name: "user_news",
  data() {
    return {
      tableData: [],
      pageSize: 5,
      pageNum: 1,
      total: 0,
      name: '',
      dis: true,
      form: {
        newsinfo: '',
        newstime: '',
        newsid: '',
      },
      dialogVisible: false,
    }
  },
  methods: {
    resetForm() {
      this.$refs.form.resetFields();
    },
    loadGet() {
      this.$axios.get(this.$httpUrl + '/news/listP').then(res => res.data).then(res => {
        console.log(res)
      }).catch((error) => {
        console.log(error)
      });
    },
    resetParam() {
      this.name = ''
    },
    loadPost() {
      this.$axios.post(this.$httpUrl + '/news/listPageC', {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          name: this.name,
        }
      }).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {
          this.tableData = res.data
          this.total = res.total
        } else {
          alert('获取数据失败')
        }
      }).catch((error) => {
        console.log(error)
      });
    },
    handleSizeChange(val) {
      console.log(`每页${val}条`)
      this.pageNum = 1
      this.pageSize = val
      this.loadPost()
    },
    handleCurrentChange(val) {
      console.log(`当前页: ${val}`)
      this.pageNum = val
      this.loadPost()
    },
  },
  beforeMount() {
    // this.loadGet();
    this.loadPost()
  }
}
</script>

<style scoped>

</style>
