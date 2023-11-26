<template>
  <el-scrollbar>
    <div style="margin-bottom: 5px;">
      <el-input v-model="name" placeholder="请输入客户姓名或手机号" style="width:250px;" suffix-icon="search"
                @keyup.enter="loadPost"></el-input>
      <el-button style="margin-left: 5px" type="primary" @click="loadPost">查询</el-button>
      <el-button type="success" @click="resetParam()">重置</el-button>
      <!--      <el-button style="margin-left: 5px" type="primary" @click="add">新增</el-button>-->
    </div>
    <el-table :data="tableData">
      <el-table-column prop="name" label="客户姓名" width="120" />
      <el-table-column prop="phone" label="联系方式" width="140" />
      <el-table-column prop="datetime" label="订单生成时间" width="160"/>
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
<!--      <el-table-column prop="mark" label="订单评价" width="120"/>-->
      <el-table-column label="操作" prop="operate">
        <template #default="scope">
          <el-button size="small" type="success" @click="mod(scope.row)">出库</el-button>
          <el-config-provider :locale="zhCn">
            <el-popconfirm style="margin-left: 5px" title="确定取消？" @confirm="quit(scope.row)">
              <template #reference>
                <el-button size="small" type="danger">取消订单</el-button>
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
          <el-form-item label="客户姓名" prop="name">
            <el-col :span="18">
              <el-input v-model="form.name" :disabled="dis"/>
            </el-col>
          </el-form-item>
          <el-form-item label="联系方式" prop="phone">
            <el-col :span="18">
              <el-input v-model="form.phone" :disabled="dis"/>
            </el-col>
          </el-form-item>
          <el-form-item label="订单生成时间" prop="datetime">
            <el-col :span="18">
              <el-input v-model="form.datetime" :disabled="dis"/>
            </el-col>
          </el-form-item>
          <el-form-item label="租借车辆" prop="license">
            <el-col :span="18">
              <el-input v-model="form.license" :disabled="dis"/>
            </el-col>
          </el-form-item>
          <el-form-item label="品牌" prop="brand">
            <el-col :span="18">
              <el-input v-model="form.brand" :disabled="dis"/>
            </el-col>
          </el-form-item>
          <el-form-item label="车型名称" prop="typename">
            <el-col :span="18">
              <el-input v-model="form.typename" :disabled="dis"/>
            </el-col>
          </el-form-item>
          <el-form-item label="出库时间" prop="begintime">
            <el-col :span="18">
              <el-input v-model="form.begintime"/>
            </el-col>
          </el-form-item>
        </el-form>
        <template #footer>
        <span class="dialog-footer">
          <el-button @click="dialogVisible = false">取消</el-button>
          <el-button type="primary" @click="save">确定出库</el-button>
        </span>
        </template>
      </el-dialog>
    </el-config-provider>
  </el-scrollbar>
</template>

<script setup>
import {ElConfigProvider} from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
</script>

<script>
export default {
  name: "employee_carin",
  data() {

    return {
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
        mark: '',
        endtime:'',
        begintime:'',
      },
      dialogVisible: false,
    }
  },

  methods: {
    resetForm() {
      this.$refs.form.resetFields();
    },
    doMod() {
      this.form.isend=2
      this.$axios.post(this.$httpUrl + '/ordder/update', this.form).then(res => res.data).then(res => {
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
          if (this.form.oid) {
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
    quit(row) {
      this.row.isend=0
      this.$axios.get(this.$httpUrl + '/ordder/update' + this.row).then(res => res.data).then(res => {
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
    del(oid) {
      this.$axios.get(this.$httpUrl + '/orderview/delete?oid=' + oid).then(res => res.data).then(res => {
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
        this.form.id=row.id
        this.form.vid=row.vid
        this.form.name = row.name
        this.form.phone = row.phone
        this.form.datetime = row.datetime
        this.form.begintime = row.begintime
        this.form.endtime = row.endtime
        this.form.license = row.license
        this.form.brand = row.brand
        this.form.typename = row.typename
        this.form.isend=row.isend
        this.form.amount=row.amount
        this.form.oid=row.oid
        this.form.mark=row.mark
        this.form.retaldays=row.retaldays
      })
    },
    resetParam() {
      this.name = ''
    },
    loadPost() {
      this.$axios.post(this.$httpUrl + '/orderview/listPageEout', {
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
