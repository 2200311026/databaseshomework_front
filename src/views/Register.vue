<template>
  <div class="img_box"/> <!-- 背景图片 -->
  <div class="flex-center"> <!-- 添加 flex-center 类 -->
    <el-form class="login-container">
      <h1 class="title">用户注册</h1>
      <el-form-item >
        <el-input type="text" v-model="name"  placeholder="请输入账号" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item >
        <el-input type="password" v-model="pwd" placeholder="请输入密码" show-password autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item >
        <el-input type="text" v-model="mobile" placeholder="输入手机号" autocomplete="off"></el-input>
      </el-form-item>

      <el-form-item >
        <el-input type="text" v-model="email" placeholder="输入邮箱"  autocomplete="off"></el-input>
      </el-form-item>




      <el-form-item label="请选择性别" style="margin-left: 20px;color: #eee;">
        <el-radio-group v-model="gender">
          <el-radio style="margin-right: 20px"  label="1">男</el-radio>
          <el-radio  label="0">女</el-radio>
        </el-radio-group>
      </el-form-item>

      <el-form-item style="margin-top: 30px;">
        <el-button type="primary" style="width:100%;"
                   @click="Register()">注&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;&nbsp;册</el-button>
      </el-form-item>
      <el-row style="text-align: center;margin-top:-10px">
        <el-link style="margin-right: 150px"  type="primary" @click="forgetPass()">忘记密码</el-link>
        <el-link type="primary" @click="Login()">用户登入</el-link>
      </el-row>
    </el-form>
  </div>
</template>

<script>
import { h } from 'vue'
import { ElMessage } from 'element-plus'
import request from "@/utils/request";
export default {
  name: 'Register',
  data() {
    return {
      name: "",
      pwd: "",
      mobile: '',
      gender: 0, //1男 0女 默认女
      email: '',

      msg: '嗨！嗨！嗨！',
      rules: {
        realname: [{
          required: true,
          message: '请输入账号名称',
          trigger: 'blur'
        },
          {
            min: 3,
            max: 18,
            message: '长度在 3 到 18 个字符',
            trigger: 'blur'
          }
        ]
      }
    }

  },
  methods: {
    forgetPass(){
      this.$message({ // 弹出登录成功信息
        type: "info", message: "该功能未开发"
      })
    },
    open() {
      console.log('open')
      ElMessage('This is a message666.')
    },
    Login() {
      this.$router.push('/');
    },
    Register() {
      let  Register= {
        name: this.name,
        pwd:this.pwd,
        mobile: this.mobile,
        gender: this.gender,
        email: this.email,
      };
      if(this.name===""||this.pwd===""||this.email===""||this.mobile===""||this.gender===""){
        this.$message({
          type: "error", message: "存在没有输入的条件"
        })}else
        {
          request.post("/api/register",Register).then(res=>{
            console.log(Register);
            if(res.code==="200"){
              this.$message({//弹出登录成功信息
                type: "success", message: res.msg})
              this.$router.push({ path: '/userhome', query: { name: this.name } });//当点击触发这个函数的时候路由到主页面
            }
          else{
            this.$message({//弹出更新失败信息
              type: "error", message: "注册失败"})
          }
        }).catch(error=>{
        console.log(Register);
        console.log(this.name+this.pwd);
        console.log(error);
      })
        }


    }
  }
}
</script>

<style scoped>

.img_box{ /*背景图片*/
  width: 100%;height: 100%;
  background-image: url(https://library-weibb.oss-cn-hangzhou.aliyuncs.com/Front/%E6%B3%A8%E5%86%8C%E7%8C%AB%E7%8C%AB.jpg);
  background-size: cover; /* 使图片平铺满整个浏览器（从宽和高的最大需求方面来满足，会使某些部分无法显示在区域中） */
  position: absolute; /* 不可缺少 */
  /* overflow: hidden; */
  /* overflow: auto; */
  z-index: -1;
  background-repeat: no-repeat;
}
/* 注释部分要不要都一样 */

/*保持登录页面居中*/
.flex-center {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 100vh; /* 设置为视口高度以填充整个屏幕 */
}

.login-container {
  border-radius: 10px;
  margin: 0px auto;
  width: 350px;
  padding: 30px 35px 15px 35px;
  background-color: rgba(255, 255, 255, 0.7); /* 半透明背景 */
  border: 1px solid #eaeaea;
  text-align: left;
  box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
}

.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: dodgerblue;;
}
</style>
