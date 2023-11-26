<template>
  <el-main>
    <el-scrollbar>
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
        <el-table-column prop="onshelf" label="状态" width="120">
        <template #default="scope">
          <el-tag :type="scope.row.onshelf === 1 ? 'primary' : 'success'" disable-transitions>
            {{ scope.row.onshelf === 1 ? '可预约' : '不可预约' }}
          </el-tag>
        </template>
        </el-table-column>
        <el-table-column prop="dayrate" label="日租价/天" width="120"/>
        <el-table-column label="操作">
          <template #default="scope">
            <el-button size="small" type="danger" @click="cancel(scope.row.cid)">取消收藏</el-button>
            <el-config-provider :locale="zhCn">
              <el-popconfirm style="margin-left: 5px" title="是否确定预约？" @confirm="book(scope.row)">
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
import zhCn from 'element-plus/lib/locale/lang/zh-cn'
</script>
<script>
export default {
  name: "user_star",
  data() {
    return {
      user: JSON.parse(sessionStorage.getItem('CurUser')),
      tableData: [],
      pageSize: 5,
      pageNum: 1,
      total: 0,
      id:'',
      nowTime: '',
      dis: true,
      form: {
        cid: '',
        img: '',
        vid: '',
        license: '',
        dayrate: '',
        brand: '',
        typename: '',
        typedescription: '',
        onshelf: '',
      },
      dialogVisible: false,
    }
  },
  methods: {
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
      })
    },
    book(row){
      if(row.onshelf===0){
        alert('该车暂不能预约');
      }else if(row.onshelf===1){
        this.form.vid=row.vid
        this.form.license = row.license
        this.form.typeid = row.typeid
        this.form.dayrate = row.dayrate
        this.form.onshelf=0,
        this.form.isRenting = row.isRenting
        this.form.repair = row.repair
        this.form.remark1 = row.remark1
        this.getDate()
        this.$axios.post(this.$httpUrl + '/ordder/save', {vid:row.vid,id:this.user.id,datetime:this.nowTime,isend:1})
        this.$axios.post(this.$httpUrl + '/vehicle/update',this.form).then(res => res.data).then(res => {
          console.log(res)
          if (res.code == 200) {
            alert('预约成功');
            this.loadPost()
          } else {
            alert('预约成功');
          }
        }).catch((error) => {
          console.log(error)
        });
      }
    },
    cancel(cid) {
      this.$axios.get(this.$httpUrl + '/userfavorite/delete?cid=' + cid).then(res => res.data).then(res => {
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
      this.$axios.post(this.$httpUrl + '/myfavorite/listPageC', {
        pageSize: this.pageSize,
        pageNum: this.pageNum,
        param: {
          id:this.user.id,
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

    //时间
    currentTime () {
      setInterval(this.getDate, 500)
    },
    getDate () {
      const year = new Date().getFullYear()
      const month = new Date().getMonth() + 1 < 10 ? '0' + (new Date().getMonth() + 1) : (new Date().getMonth() + 1)
      const date = new Date().getDate() < 10 ? '0' + new Date().getDate() : new Date().getDate()
      const hh = new Date().getHours() < 10 ? '0' + new Date().getHours() : new Date().getHours()
      const mm = new Date().getMinutes() < 10 ? '0' + new Date().getMinutes() : new Date().getMinutes()
      const ss = new Date().getSeconds() < 10 ? '0' + new Date().getSeconds() : new Date().getSeconds()
      this.nowTime = year + '-' + month + '-' + date + ' ' + hh + ':' + mm + ':' + ss
    },
  },
  mounted () {
    this.currentTime()
  },
  beforeMount() {
    // this.loadGet();
    this.loadPost()
  },
  beforeDestroy: function () {
    if (this.getDate) {
      clearInterval(this.getDate) // 在Vue实例销毁前，清除时间定时器
    }
  }
}
</script>

<style scoped>

</style>