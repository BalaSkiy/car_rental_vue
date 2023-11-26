<template>

  <el-descriptions
      :column="2"
      :size="40"
      :title="'欢迎你！'+user.name"
      border
      class="margin-top"
  >
    <template #extra>
      <el-button type="primary" @click="mod()">修改个人信息</el-button>
    </template>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <user/>
          </el-icon>
          账户ID
        </div>
      </template>
      {{ user.id }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <iphone/>
          </el-icon>
          手机号
        </div>
      </template>
      {{ user.phone }}
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <component :is="Male" v-if="user.sex === true "></component>
            <component :is="Female" v-if="user.sex === false "></component>
          </el-icon>
          性别
        </div>
      </template>
        <el-tag :type="user.sex === true ? 'primary' : 'success'" disable-transitions>
          {{ user.sex === true ? '男' : '女' }}
        </el-tag>
    </el-descriptions-item>
    <el-descriptions-item>
      <template #label>
        <div class="cell-item">
          <el-icon :style="iconStyle">
            <tickets/>
          </el-icon>
          用户权限
        </div>
      </template>
      <el-tag size="small" v-if="user.roleid===0">超级管理员</el-tag>
      <el-tag size="small" v-else-if="user.roleid===1">员工</el-tag>
      <el-tag size="small" v-else-if="user.roleid===2">普通用户</el-tag>
    </el-descriptions-item>
<!--    <el-descriptions-item>-->
<!--      <template #label>-->
<!--        <div class="cell-item">-->
<!--          <el-icon :style="iconStyle">-->
<!--            <office-building/>-->
<!--          </el-icon>-->
<!--          信息-->
<!--        </div>-->
<!--      </template>-->
<!--      已预约车辆：辆，      待取：辆，     待还：辆，     待评价订单： 。-->
<!--    </el-descriptions-item>-->
  </el-descriptions>
  <span class="times">现在是{{ time }}</span>
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
          <el-radio-group v-model="form.sex" prop="sex">
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
</template>

<script setup>
import {Iphone, OfficeBuilding, Tickets, User,Male,Female} from '@element-plus/icons-vue'
import {computed, ref} from 'vue'
import {ElConfigProvider} from 'element-plus'
import zhCn from 'element-plus/lib/locale/lang/zh-cn'

const size = ref('')
const iconStyle = computed(() => {
  const marginMap = {
    large: '8px',
    default: '6px',
    small: '4px',
  }
  return {
    marginRight: marginMap[size.value] || marginMap.default,
  }
})
const blockMargin = computed(() => {
  const marginMap = {
    large: '32px',
    default: '28px',
    small: '24px',
  }
  return {
    marginTop: marginMap[size.value] || marginMap.default,
  }
})
</script>

<script>
import {ElMessage, ElMessageBox} from "element-plus";

export default {
  name: "Home",
  data() {
    let checkAge = (rule, value, callback) => {
      if (value > 150) {
        callback(new Error('年龄输入过大'));
      } else {
        callback();
      }
    };
    return {
      user: JSON.parse(sessionStorage.getItem('CurUser')),
      time: "2020年08月31日 10:29",
      tableData: [],
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
        roleid:'',
      },
      dialogVisible: false,
      rules: {
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
    };
  },
  mounted() {
    this.currentTime();
  },
  methods: {
    init() {
      this.user = JSON.parse(sessionStorage.getItem('CurUser'))
    },
    mod() {
      // console.log(row)
      this.dialogVisible = true
      this.$nextTick(() => {
        //赋值到表单
        this.form.id = this.user.id
        this.form.name = this.user.name
        this.form.sex = this.user.sex
        this.form.age = this.user.age + ''
        this.form.password = ''
        this.form.phone = this.user.phone
        this.form.roleid = this.user.roleid
      })
    },
    save() {
      this.$refs.form.validate((valid) => {
        if (valid) {
          if (this.form.id) {
            this.doMod();
          }
        } else {
          console.log('error submit!!');
          return false;
        }
      });
    },
    doMod() {
      this.$axios.post(this.$httpUrl + '/user/update', this.form).then(res => res.data).then(res => {
        console.log(res)
        if (res.code == 200) {
          alert('操作成功');
          this.dialogVisible = false
          alert('请重新登录！');
          this.$router.push("/")
          sessionStorage.clear()
        } else {
          alert('操作失败');
        }
      }).catch((error) => {
        console.log(error)
      });
    },
    //   时间
    currentTime() {
      setInterval(this.getTime, 500);
    },
    getTime() {
      let yy = new Date().getFullYear();
      let mm = new Date().getMonth() + 1;
      let dd = new Date().getDate();
      let hh = new Date().getHours();
      let mf =
          new Date().getMinutes() < 10
              ? "0" + new Date().getMinutes()
              : new Date().getMinutes();
      let ss =
          new Date().getSeconds() < 10
              ? "0" + new Date().getSeconds()
              : new Date().getSeconds();
      this.time =
          yy + "年 " + mm + "月" + dd + "日 " + hh + ":" + mf + ":" + ss;
    }
  }
}

</script>

<style scoped>
.el-descriptions {
  margin-top: 20px;
}

.cell-item {
  display: flex;
  align-items: center;
}

.margin-top {
  margin-top: 20px;
}
</style>