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
        <el-table-column prop="dayrate" label="日租价/天" width="120"/>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button type="warning" :icon="Star" circle @click="iscollect(scope.row)"/>
            <el-config-provider :locale="zhCn">
              <el-popconfirm style="margin-left: 5px" title="是否确定预约？" @confirm="addorder(scope.row)">
                <template #reference>
                  <el-button size="small" type="success">预约</el-button>
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
    </el-scrollbar>
  </el-main>
</template>


<script setup>
import {ElConfigProvider} from 'element-plus'
import {Star} from '@element-plus/icons-vue'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
</script>

<script>
export default {
  name: "user_bookcar",

  data() {
    return {
      user: JSON.parse(sessionStorage.getItem('CurUser')),
      tableData: [],
      pageSize: 5,
      pageNum: 1,
      total: 0,
      vid: '',
      name:'',

      dis: true,
      form: {
        img: '',
        vid: '',
        license: '',
        dayrate: '',
        brand: '',
        typename: '',
        typedescription: '',

      },
      dialogVisible: false,

    }
  },

  methods: {
    resetParam() {
      this.name = ''
    },
    addorder(e){
      this.$axios.post(this.$httpUrl + '/ordder/save', {
        id:this.user.id,
        vid:e.vid,

      }).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {
          alert('预约成功');
          this.dialogVisible = false
          this.loadPost()
          // this.resetForm()
        } else {
          alert('预约失败');
        }
      }).catch((error) => {
        console.log(error)
      });

    },
    // resetForm() {
    //   this.$refs.form.resetFields();
    //   this.loadPost()
    // },
    // loadSearch() {
    //   this.$axios.post(this.$httpUrl + '/usercar/search', {
    //     pageSize: this.pageSize,
    //     pageNum: this.pageNum,
    //     param: {
    //       name: this.name,
    //     }
    //   }).then(res => res.data).then(res => {
    //     console.log(res)
    //     if (res.code == 200) {
    //       this.tableData = res.data
    //       this.total = res.total
    //     } else {
    //       alert('获取数据失败')
    //     }
    //   }).catch((error) => {
    //     console.log(error)
    //   });
    // },
    loadPost() {
      this.$axios.post(this.$httpUrl + '/usercar/listPageC', {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          name: this.name,
          onshelf: 1,
          isrenting:0,
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
    //收藏功能
    iscollect(e) {
      this.$axios.post(this.$httpUrl + '/userfavorite/save', {vid:e.vid,id:this.user.id}).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {
          alert('收藏成功');
          this.dialogVisible = false
          this.loadPost()
          // this.resetForm()
        } else {
          alert('收藏失败');
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
