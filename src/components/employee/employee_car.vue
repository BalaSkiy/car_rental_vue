<template>
  <el-main>
    <el-scrollbar>
      <!--      顶部搜索框-->
      <div style="margin-bottom: 5px;">
        <el-input v-model="name" placeholder="请输入车辆信息" style="width:250px;" suffix-icon="search"
                  @keyup.enter="loadPost"></el-input>
        <el-button style="margin-left: 5px" type="primary" @click="loadPost">查询</el-button>
        <el-button type="success" @click="resetParam()">重置</el-button>
      </div>
      <el-table :data="tableData">
        <el-table-column prop="img" label="图片" align="center" width="150" >
          <template>
            <img src="" width="16" height="16"/>
          </template>
        </el-table-column>
        <el-table-column prop="vid" label="车辆id" width="80" />
        <el-table-column prop="license" label="车牌号" width="120" />
        <el-table-column prop="brand" label="品牌" width="120" />
        <el-table-column prop="typename" label="车型" width="120" />
        <el-table-column prop="typedescription" label="概况" width="200" />
        <el-table-column prop="onshelf" label="是否上架中" width="120" >
          <template #default="scope">
            <el-tag :type="scope.row.onshelf === 1 ? 'primary' : 'success'" disable-transitions>
              {{ scope.row.onshelf === 1 ? '可预约' : '不可预约' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="isrenting" label="是否出租中" width="120">
          <template #default="scope">
            <el-tag :type="scope.row.isrenting === 1 ? 'primary' : 'success'" disable-transitions>
              {{ scope.row.isrenting === 1 ? '出租中' : '未出租' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="repair" label="维修状态" width="120" >
          <template #default="scope">
            <el-tag size="small" v-if="scope.row.repair===0">不需维修</el-tag>
            <el-tag size="small" v-else-if="scope.row.repair===1">待送修</el-tag>
            <el-tag size="small" v-else-if="scope.row.repair===2">维修中</el-tag>
          </template>
        </el-table-column>
        <el-table-column prop="dayrate" label="日租价/天" width="120"/>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" type="success" @click="mod(scope.row)">修改状态</el-button>
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
            <el-form-item label="车辆Id" prop="vid">
              <el-col :span="18">
                <el-input v-model="form.vid" :disabled="dis"/>
              </el-col>
            </el-form-item>
            <el-form-item label="车牌号" prop="license">
              <el-col :span="18">
                <el-input v-model="form.license"  :disabled="dis" />
              </el-col>
            </el-form-item>
            <el-form-item label="车型Id" prop="typeid" >
              <el-col :span="18">
                <el-input v-model="form.typeid" :disabled="dis"/>
              </el-col>
            </el-form-item>
            <el-form-item label="日租价" prop="dayrate" >
              <el-col :span="18">
                <el-input v-model="form.dayrate" :disabled="dis"/>
              </el-col>
            </el-form-item>
            <el-form-item label="是否上架">
              <el-radio-group v-model="form.onshelf">
                <el-radio label="1">是</el-radio>
                <el-radio label="0">否</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="维修状态">
              <el-radio-group v-model="form.repair">
                <el-radio label="0">无需维修</el-radio>
                <el-radio label="1">待送修</el-radio>
                <el-radio label="2">修理中</el-radio>
                <!--                <el-radio label="3">否</el-radio>-->
              </el-radio-group>
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
  </el-main>

</template>

<script setup>
// const tableData = ref(Array.from({ length: 20 }).fill(item))
import {ElConfigProvider} from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
</script>

<script>
export default {
  name: "employee_car",
  data() {
    return {
      tableData: [],
      pageSize: 5,
      pageNum: 1,
      total: 0,
      name: '',
      dis: true,
      form: {
        vid: '',
        license: '',
        typeid: '',
        dayrate: '',
        onshelf: '',
        repair: '',
        isrenting: '',
      },
      dialogVisible: false,
    }
  },
  methods:{
    add() {
      this.dis = false
      this.dialogVisible = true
      this.$nextTick(() => {
        this.resetForm();
      })
    },
    resetParam() {
      this.name = ''
    },
    resetForm() {
      this.$refs.form.resetFields();
    },
    mod(row) {
      // console.log(row)
      this.dialogVisible = true
      this.$nextTick(() => {
        //赋值到表单
        this.form.vid = row.vid
        this.form.license = row.license
        this.form.typeid = row.typeid
        this.form.dayrate = row.dayrate
        this.form.onshelf = row.onshelf
        this.form.isrenting = row.isrenting
        this.form.repair = row.repair
      })
    },
    doSave() {
      this.$axios.post(this.$httpUrl + '/vehicle/save', this.form).then(res => res.data).then(res => {
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
      this.$axios.post(this.$httpUrl + '/vehicle/update', this.form).then(res => res.data).then(res => {
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
          if (this.form.vid) {
            this.doMod();
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    del(id) {
      this.$axios.get(this.$httpUrl + '/vehicle/delete?vid=' + vid).then(res => res.data).then(res => {
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
    loadPost() {
      this.$axios.post(this.$httpUrl + '/managercar/listPageC', {
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