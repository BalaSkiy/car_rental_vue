<template>
  <el-scrollbar>
    <div style="margin-bottom: 5px;">
      <el-input v-model="name" placeholder="请输入车辆类别信息" style="width:250px;" suffix-icon="search"
                @keyup.enter="loadPost"></el-input>
      <el-button style="margin-left: 5px" type="primary" @click="loadPost">查询</el-button>
      <el-button type="success" @click="resetParam()">重置</el-button>
      <el-button style="margin-left: 5px" type="primary" @click="add">新增</el-button>
    </div>
    <el-table :data="tableData">
      <el-table-column prop="typeid" label="车型Id" width="120" />
      <el-table-column prop="brand" label="品牌" width="120" />
      <el-table-column prop="typename" label="车型名称" width="160"/>
      <el-table-column prop="typedescription" label="车型概况" />
      <el-table-column label="操作" prop="operate">
        <template #default="scope">
          <el-button size="small" type="success" @click="mod(scope.row)">编辑</el-button>
          <el-config-provider :locale="zhCn">
            <el-popconfirm style="margin-left: 5px" title="是否确定删除？" @confirm="del(scope.row.typeid)">
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
          <el-form-item label="车型Id" prop="typeid">
            <el-col :span="18">
              <el-input v-model="form.typeid" :disabled="dis"/>
            </el-col>
          </el-form-item>
          <el-form-item label="品牌" prop="brand">
            <el-col :span="18">
              <el-input v-model="form.brand"/>
            </el-col>
          </el-form-item>
          <el-form-item label="车型名称" prop="typename">
            <el-col :span="18">
              <el-input v-model="form.typename"/>
            </el-col>
          </el-form-item>
          <el-form-item label="车型概况" prop="typedescription">
            <el-col :span="18">
              <el-input v-model="form.typedescription"/>
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
</template>

<script setup>
import {ElConfigProvider} from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
</script>

<script>
export default {
  name: "manager_vehicletype",
  data() {

    return {
      tableData: [],
      pageSize: 5,
      pageNum: 1,
      total: 0,
      name: '',
      dis: true,
      form: {
        typeid: '',
        brand: '',
        typename: '',
        typedescription: '',
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
        this.form.typeid = row.typeid
        this.form.brand = row.brand
        this.form.typename = row.typename
        this.form.typedescription = row.typedescription
      })
    },
    doSave() {
      this.$axios.post(this.$httpUrl + '/vehicletype/save', this.form).then(res => res.data).then(res => {
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
      this.$axios.post(this.$httpUrl + '/vehicletype/update', this.form).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {
          alert('修改成功');
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
          if (this.form.typeid) {
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
    del(typeid) {
      this.$axios.get(this.$httpUrl + '/vehicletype/delete?typeid=' + typeid).then(res => res.data).then(res => {
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
    resetParam() {
      this.typename = ''
    },
    loadPost() {
      this.$axios.post(this.$httpUrl + '/vehicletype/listPageC', {
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