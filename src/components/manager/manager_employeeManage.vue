<template>
  <div>
    <el-scrollbar>
      <div style="margin-bottom: 5px;">
        <el-input v-model="name" placeholder="请输入姓名或手机号" style="width:250px;" suffix-icon="search"
                  @keyup.enter="loadPost"></el-input>
        <!--        <el-config-provider :locale="zhCn">-->
        <!--          <el-select v-model="sex" filterable placeholder="请选择性别" style="margin-left: 5px">-->
        <!--            <el-option-->
        <!--                v-for="item in sexs"-->
        <!--                :key="item.value"-->
        <!--                :label="item.label"-->
        <!--                :value="item.value"-->
        <!--            />-->
        <!--          </el-select>-->
        <!--        </el-config-provider>-->
        <el-button style="margin-left: 5px" type="primary" @click="loadPost">查询</el-button>
        <el-button type="success" @click="resetParam()">重置</el-button>
        <el-button style="margin-left: 5px" type="primary" @click="add">新增</el-button>
      </div>
      <el-table :data="tableData"
                :header-cell-style="{background:'#f2f5fc', color:'#555555'}"
                border
      >
        <el-table-column label="Id" prop="id" width="120"/>
        <el-table-column label="姓名" prop="name" width="100"/>
        <el-table-column label="年龄" prop="age" width="100"/>
        <el-table-column label="性别" prop="sex" width="100">
          <template #default="scope">
            <el-tag :type="scope.row.sex === true ? 'primary' : 'success'" disable-transitions>
              {{ scope.row.sex === true ? '男' : '女' }}
            </el-tag>
          </template>
        </el-table-column>
        <el-table-column label="手机号" prop="phone" width="140"/>
        <!--        <el-table-column label="Password" prop="password" width="160"/>-->
        <el-table-column label="操作" prop="operate">
          <template #default="scope">
            <el-button size="small" type="success" @click="mod(scope.row)">编辑</el-button>
            <el-config-provider :locale="zhCn">
              <el-popconfirm style="margin-left: 5px" title="是否确定删除？" @confirm="del(scope.row.id)">
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
          <el-form ref="form" :model="form" :rules="rules" label-width="120px">
            <el-form-item label="姓名" prop="name">
              <el-col :span="18">
                <el-input v-model="form.name"/>
              </el-col>
            </el-form-item>
            <el-form-item label="密码" prop="password">
              <el-col :span="18">
                <el-input v-model="form.password"/>
              </el-col>
            </el-form-item>
            <el-form-item label="年龄" prop="age">
              <el-col :span="18">
                <el-input v-model="form.age"/>
              </el-col>
            </el-form-item>
            <el-form-item label="性别">
              <el-radio-group v-model="form.sex">
                <el-radio label=true>男</el-radio>
                <el-radio label=false>女</el-radio>
              </el-radio-group>
            </el-form-item>
            <el-form-item label="手机号" prop="phone">
              <el-col :span="18">
                <el-input v-model="form.phone"/>
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
import zhCn from 'element-plus/lib/locale/lang/zh-cn'</script>

<script>
export default {
  name: "manager_userManage",
  data() {
    let checkAge = (rule, value, callback) => {
      if (value > 150) {
        callback(new Error('年龄输入过大'));
      } else {
        callback();
      }
    };
    let checkDuplicate = (rule, value, callback) => {
      if (this.form.name) {
        return callback();
      }
      this.$axios.get(this.$httpUrl + "/user/findById?id=" + this.form.id).then(res => res.data).then(res => {
        if (res.code == 200) {
          callback(new Error('账号已经存在'))
        } else {
          callback(
              // new Error('账号已经存在')
          );
        }
      })
    };

    return {
      tableData: [],
      pageSize: 5,
      pageNum: 1,
      total: 0,
      name: '',
      roleid:'1',
      sexs: [
        {
          value: true,
          label: '男'
        },
        {
          value: false,
          label: '女'
        }
      ],
      dis: true,
      form: {
        id: '',
        name: '',
        password: '',
        age: '',
        sex: true,
        phone: '',
        roleid:'1'
      },
      dialogVisible: false,
      rules: {
        id: [
          {required: true, message: '请输入Id', trigger: 'blur'},
          {min: 3, max: 8, message: '长度在3-8个字符', trigger: 'blur'},
          {validator: checkDuplicate, trigger: 'blur'}

        ],
        name: [
          {required: true, message: '请输入姓名', trigger: 'blur'}
        ],
        password: [
          {required: true, message: '请输入密码', trigger: 'blur'},
          {min: 3, max: 8, message: '长度在3-8个字符', trigger: 'blur'}
        ],
        age: [
          {required: true, message: '请输入年龄', trigger: 'blur'},
          {min: 1, max: 3, message: '长度在1-3个位', trigger: 'blur'},
          {pattern: /^([1-9][0-9]*){1,3}$/, message: '年龄必须为正整数', trigger: 'blur'},
          {validator: checkAge, trigger: 'blur'}
        ],
        phone: [
          {required: true, message: '手机号不能为空', trigger: 'blur'},
          {pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur'},
        ],
      }
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
      // console.log(row)
      this.dialogVisible = true
      this.$nextTick(() => {
        //赋值到表单
        this.form.id = row.id
        this.form.name = row.name
        this.form.sex = row.sex + ''
        this.form.age = row.age + ''
        this.form.password = ''
        this.form.phone = row.phone
        this.form.roleid = '1'

      })
    },
    del(id) {
      this.$axios.get(this.$httpUrl + '/user/delete?id=' + id).then(res => res.data).then(res => {
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
      this.$axios.post(this.$httpUrl + '/user/save', this.form).then(res => res.data).then(res => {
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
      this.$axios.post(this.$httpUrl + '/user/update', this.form).then(res => res.data).then(res => {
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
          if (this.form.id) {
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
      this.$axios.get(this.$httpUrl + '/user/listP').then(res => res.data).then(res => {
        console.log(res)
      }).catch((error) => {
        console.log(error)
      });
    },
    resetParam() {
      this.name = ''
      // this.sex = ''
    },
    loadPost() {
      this.$axios.post(this.$httpUrl + '/user/listPageC', {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          name: this.name,
          roleid: '1' ,
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