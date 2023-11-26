<template>
  <div class="loginBody">
    <div class="loginDiv">
      <div class="login-content">
        <h1 class="login-title">用户登录</h1>
        <el-form ref="loginForm" :model="loginForm"
                 :rules="rules" label-width="100px">
          <el-form-item label="手机号" prop="phone">
            <el-input v-model="loginForm.phone"></el-input>
          </el-form-item>
          <el-form-item label="密码" prop="password">
            <el-input v-model="loginForm.password" auto-complete="off" type="password"
                      @keydown.enter="confirm"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button :disabled="confirm_disabled" type="primary" @click="confirm">登录</el-button>
            <el-button :disabled="confirm_disabled" @click="register" >注册</el-button>
          </el-form-item>
        </el-form>
      </div>
    </div>
  </div>
</template>

<script>
// import Register from '@/components/Register';

export default {
  components: {
    // Register
  },
  data() {
    return {
      confirm_disabled: false,
      loginForm: {
        phone: '',
        password: '',
      },
      rules: {
        password: [{required: true, message: '请输入密码', trigger: 'blur'}],
        phone: [
          {required: true, message: '手机号不能为空', trigger: 'blur'},
          {pattern: /^1[3|4|5|6|7|8|9][0-9]\d{8}$/, message: '请输入正确的手机号码', trigger: 'blur'},
        ],
      }
    };
  },

  methods: {
    register(){
      this.$router.push('/Register')
    },
    confirm() {
      this.confirm_disabled = true;
      this.$refs.loginForm.validate((valid) => {
        if (valid) {//valid成功为true，失败为false
          //去后台验证用户名密码
          this.$axios.post(this.$httpUrl + '/user/login', this.loginForm).then(res => res.data).then(res => {
            console.log(res)
            if (res.code == 200) {
              console.log(JSON.stringify(res.data.user))
              //存储
              sessionStorage.setItem("CurUser", JSON.stringify(res.data.user))
              console.log(res.data.menu)
              this.$store.commit("setMenu", res.data.menu)
              //跳转到主页
              this.$router.replace('Index');
            } else {
              this.confirm_disabled = false;
              console.log('校验失败');
              alert("用户名或密码错误")
              return false;
            }
          })
        }
      })
    }
  }
}
</script>

<style scoped>
.loginBody {
  position: absolute;
  width: 100%;
  height: 100%;
  background-color: #B3C0D1;
}

.loginDiv {
  position: absolute;
  top: 50%;
  left: 50%;
  margin-top: -200px;
  margin-left: -250px;
  width: 450px;
  height: 330px;
  background: #fff;
  border-radius: 5%;
}

.login-title {
  margin: 20px 0;
  text-align: center;
}

.login-content {
  width: 400px;
  height: 250px;
  position: absolute;
  top: 25px;
  left: 25px;
}
</style>


