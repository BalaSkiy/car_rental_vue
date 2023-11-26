<template>
  <div>
    <el-scrollbar>
      <div style="margin-bottom: 5px;">
        <el-input v-model="name" placeholder="请输入信息" style="width:250px;" suffix-icon="search"
                  @keyup.enter="loadPost"></el-input>
        <el-button style="margin-left: 5px" type="primary" @click="loadPost">查询</el-button>
        <el-button type="success" @click="resetParam()">重置</el-button>
        <el-button style="margin-left: 5px" type="primary" @click="add">新增</el-button>
      </div>
      <el-table :data="tableData"
                :header-cell-style="{background:'#f2f5fc', color:'#555555'}"
                border
      >
        <el-table-column label="新闻" prop="newsinfo" width=""/>
        <el-table-column label="发布时间" prop="newstime" width="200"/>
        <el-table-column label="操作" prop="operate" width="200" >
          <template #default="scope">
            <el-button size="small" type="success" @click="mod(scope.row)">编辑</el-button>
            <el-config-provider :locale="zhCn">
              <el-popconfirm style="margin-left: 5px" title="是否确定删除？" @confirm="del(scope.row.newsid)">
                <template #reference>
                  <el-button size="small" type="danger">删除</el-button>
                </template>
              </el-popconfirm>
            </el-config-provider>
          </template>
        </el-table-column>
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

      <el-config-provider :locale="zhCn">
        <el-dialog
            v-model="dialogVisible"
            :before-close="handleClose"
            title="提示"
            width="30%"
        >
          <el-form ref="form" :model="form" label-width="120px">
            <el-form-item label="新闻内容" prop="newsinfo" >
              <el-col :span="18">
                <el-input v-model="form.newsinfo" type="textarea"/>
              </el-col>
            </el-form-item>
            <el-form-item label="发布时间" prop="newstime">
              <el-col :span="18">
                <el-input v-model="form.newstime"/>
              </el-col>
            </el-form-item>
          </el-form>
          <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确定</el-button>
        </span>
          </template>
        </el-dialog>
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
  name: "manager_newsManage",
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
    add() {
      this.dis = false
      this.dialogVisible = true
      this.$nextTick(() => {
        this.resetForm();
      })
    },
    mod(row) {
      this.dialogVisible = true
      this.$nextTick(() => {
        //赋值到表单
        this.form.newsinfo = row.newsinfo
        this.form.newstime = row.newstime
        this.form.newsid = row.newsid
      })
    },
    del(newsid) {
      this.$axios.get(this.$httpUrl + '/news/?newsid=' + newsid).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {
          alert('操作成功');
          this.loadPost()
        } else {
          alert('操作失败');
        }
      }).catch((error) => {
        console.log(error)
      });
    },
    doSave() {
      this.$axios.post(this.$httpUrl + '/news/save', this.form).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {
          alert('操作成功');
          this.dialogVisible = false
          this.loadPost()
          this.resetForm()
        } else {
          alert('操作失败');
        }
      }).catch((error) => {
        console.log(error)
      });
    },
    doMod() {
      this.$axios.post(this.$httpUrl + '/news/update', this.form).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {
          alert('操作成功');
          this.dialogVisible = false
          this.loadPost()
          this.resetForm()
        } else {
          alert('操作失败');
        }
      }).catch((error) => {
        console.log(error)
      });
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.newsid) {
            this.doMod();
          } else {
            this.doSave();
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    // getAxios:function(){
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