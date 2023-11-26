<template>
  <div>
    <el-scrollbar>
      <div style="margin-bottom: 5px;">
        <el-input v-model="bname" placeholder="请输入书名" style="width:250px;" suffix-icon="search"
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
        <!--        <el-button type="success" @click="resetParam()">重置</el-button>-->
        <el-button style="margin-left: 5px" type="primary" @click="add">新增</el-button>
      </div>
      <el-table :data="tableData"
                :header-cell-style="{background:'#f2f5fc', color:'#555555'}"
                border
      >
        <el-table-column label="书籍Id" prop="bid" width="120"/>
        <el-table-column label="书名" prop="bname" width="100"/>
        <el-table-column label="类别" prop="bclass" width="100"/>
        <el-table-column label="作者" prop="bauthor" width="100"/>
        <!--          <template #default="scope">-->
        <!--            <el-tag :type="scope.row.sex === '1' ? 'primary' : 'success'" disable-transitions>-->
        <!--              {{ scope.row.sex === '1' ? '男' : '女' }}-->
        <!--            </el-tag>-->
        <!--          </template>-->
        <!--        </el-table-column>-->
        <el-table-column label="出版时间" prop="bpubdate" width="140"/>
        <el-table-column label="入库时间" prop="bindate" width="250"/>
        <el-table-column label="操作" prop="operate">
          <template #default="scope">
            <el-button size="small" type="success" @click="mod(scope.row)">编辑</el-button>
            <el-config-provider :locale="zhCn">
              <el-popconfirm style="margin-left: 5px" title="是否确定删除？" @confirm="del(scope.row.bid)">
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
            <el-form-item label="书籍Id" prop="bid">
              <el-col :span="18">
                <el-input v-model="form.bid" :disabled="dis"/>
              </el-col>
            </el-form-item>
            <el-form-item label="书名" prop="bname">
              <el-col :span="18">
                <el-input v-model="form.bname"/>
              </el-col>
            </el-form-item>
            <el-form-item label="类别" prop="bclass">
              <el-col :span="18">
                <el-input v-model="form.bclass"/>
              </el-col>
            </el-form-item>
            <el-form-item label="作者" prop="bauthor">
              <el-col :span="18">
                <el-input v-model="form.bauthor"/>
              </el-col>
            </el-form-item>
            <el-form-item label="出版时间" prop="bpubdate">
              <el-col :span="18">
                <el-date-picker
                    v-model="form.bpubdate"
                    :size="size"
                    placeholder="选择出版时间"
                    type="date"
                />
                <!--                <el-input v-model="form.bpubdate"/>-->
              </el-col>
            </el-form-item>
            <el-form-item label="入库时间" prop="bindate">
              <el-col :span="18">
                <el-date-picker
                    v-model="form.bindate"
                    placeholder="选择入库时间"
                    type="datetime"
                />
                <!--                <el-input v-model="form.bindate"/>-->
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
  name: "MainBook",
  data() {
    let checkDuplicate = (rule, value, callback) => {
      if (this.form.bname) {
        return callback();
      }
      this.$axios.get(this.$httpUrl + "/book/findById?bid=" + this.form.bid).then(res => res.data).then(res => {
        if (res.code == 200) {
          callback(new Error('书籍id已经存在'))
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
      bname: '',
      bclass: '',
      // classes: [
      //   {
      //     value: '1',
      //     label: '男'
      //   },
      //   {
      //     value: '0',
      //     label: '女'
      //   }
      // ],
      dis: true,
      form: {
        bid: '',
        bname: '',
        bclass: '',
        bauthor: '',
        bpubdate: '',
        bindate: '',
      },
      dialogVisible: false,
      rules: {
        bid: [
          {required: true, message: '请输入书籍Id', trigger: 'blur'},
          // {min: 3, max: 8, message: '长度在3-8个字符', trigger: 'blur'},
          {validator: checkDuplicate, trigger: 'blur'}

        ],
        bname: [
          {required: true, message: '请输入书籍名称', trigger: 'blur'}
        ],
        bclass: [
          {required: true, message: '请输入书籍类别', trigger: 'blur'}
        ],
        bauthor: [
          {required: true, message: '请输入作者', trigger: 'blur'}
        ],
        bpubdate: [],
        bindate: [],
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
      this.dis = true
      this.dialogVisible = true
      this.$nextTick(() => {
        //赋值到表单
        this.form.bid = row.bid
        this.form.bname = row.bname
        this.form.bclass = row.bclass
        this.form.bauthor = row.bauthor
        this.form.bpubdate = row.bpubdate
        this.form.bindate = row.bindate
      })
    },
    del(bid) {
      this.$axios.get(this.$httpUrl + '/book/delete?bid=' + bid).then(res => res.data).then(res => {
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
      this.$axios.post(this.$httpUrl + '/book/save', this.form).then(res => res.data).then(res => {
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
      this.$axios.post(this.$httpUrl + '/book/update', this.form).then(res => res.data).then(res => {
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
          if (this.form.bid) {
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
      this.$axios.get(this.$httpUrl + '/book/listP').then(res => res.data).then(res => {
        console.log(res)
      }).catch((error) => {
        console.log(error)
      });
    },
    resetParam() {
      this.bname = ''
    },
    loadPost() {
      this.$axios.post(this.$httpUrl + '/book/listPageC', {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          bname: this.bname,

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
