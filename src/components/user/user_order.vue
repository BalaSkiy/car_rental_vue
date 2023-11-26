<template>
  <el-scrollbar>
    <el-table :data="tableData">

      <el-table-column prop="datetime" label="下单时间" width="160"/>
      <el-table-column prop="begintime" label="取车时间" width="160"/>
      <el-table-column prop="endtime" label="还车时间" width="160"/>
      <el-table-column prop="license" label="租借车辆" width="120"/>
      <el-table-column prop="brand" label="品牌" width="80"/>
      <el-table-column prop="typename" label="车型名称" width="150"/>
      <el-table-column prop="isend" label="订单状态" width="100">
        <template #default="scope">
          <el-tag  v-if="scope.row.isend===0" type="danger">已取消</el-tag>
          <el-tag  v-else-if="scope.row.isend===1" type="success">待取车</el-tag>
          <el-tag  v-else-if="scope.row.isend===2" type="primary">待还车</el-tag>
          <el-tag  v-else-if="scope.row.isend===3" type="info">待评价</el-tag>
          <el-tag  v-else-if="scope.row.isend===4" type="success">已完结</el-tag>
        </template>
      </el-table-column>
      <el-table-column prop="amount" label="订单金额" width="120"/>
      <el-table-column label="操作" prop="operate">
        <template #default="scope">
          <el-button v-if="scope.row.isend===3" size="small" type="success" @click="mod(scope.row)">评价</el-button>
          <el-config-provider :locale="zhCn">
            <el-popconfirm style="margin-left: 5px" title="确定取消？" @confirm="quit(scope.row)">
              <template #reference>
                <el-button v-if="scope.row.isend===1" size="small" type="danger">取消订单</el-button>
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
          <el-form-item label="请输入评价" prop="mark">
            <el-col :span="18">
              <el-input v-model="form.mark" />
            </el-col>
          </el-form-item>
        </el-form>
        <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="markorder">确定</el-button>
        </span>
        </template>
      </el-dialog>
    </el-config-provider>
  </el-scrollbar>
</template>

<script setup>
// const tableData = ref(Array.from({ length: 20 }).fill(item))
import {ElConfigProvider} from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
</script>

<script>
export default {
  name: "user_order",
  data() {


    return {
      user: JSON.parse(sessionStorage.getItem('CurUser')),
      tableData: [],
      pageSize: 5,
      pageNum: 1,
      total: 0,
      name: '',
      dis: true,
      form: {
        name: '',
        phone: '',
        datetime: '',
        license: '',
        brand: '',
        typename: '',
        isend: '',
        amount: '',
        oid: '',
      },
      dialogVisible: false,
    }
  },
  methods: {
    quit(row) {
      row.isend=0
      this.$axios.post(this.$httpUrl + '/ordder/update',row).then(res => res.data).then(res => {
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
    mod(row) {
      // console.log(row)
      this.dialogVisible = true
      this.$nextTick(() => {
        //赋值到表单
        this.form.oid = row.oid
        this.form.id = row.id
        this.form.vid = row.vid
        this.form.datetime = row.datetime
        this.form.begintime = row.begintime
        this.form.endtime = row.endtime
        this.form.rentaldays = row.rentaldays
        this.form.amount = row.amount
        this.form.mark = row.mark
        this.form.isend = row.isend
      })
    },
    markorder() {
      this.form.isend = 4
      this.$axios.post(this.$httpUrl + '/ordder/update',this.form).then(res => res.data).then(res => {
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
    loadPost() {
      this.$axios.post(this.$httpUrl + '/orderview/listPageUser', {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          id: this.user.id,
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