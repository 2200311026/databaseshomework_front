<template>
  <div class="img_box"/>
  <div class="login">
    <div class="flex-center"> <!-- 添加 flex-center 类 -->
      <el-form class="login-container">
      <h1 class="title" style="color: dodgerblue;">用户登录</h1>

      <el-form-item label="" >
        <el-form :model="admin" :rules="rules" ref="loginForm"></el-form>
        <el-input  type="text" v-model="name" placeholder="请输入用户名" autocomplete="off"></el-input>
      </el-form-item>
      <el-form-item label="">
        <el-input type="password" v-model="pwd" placeholder="请输入密码" autocomplete="off" size="medium" ></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" style="width:100%;" @click="doSubmit()">提交</el-button>
      </el-form-item>
      <el-row style="text-align: center;margin-top:10px">
        <el-link style="color: dodgerblue; margin-right: 160px " type="primary" @click="forgetPass()">忘记密码</el-link>
        <el-link style="color: dodgerblue" type="primary" @click="gotoRegister()">用户注册</el-link>
      </el-row>
    </el-form>
    </div>
  </div>
</template>

<script>
/* import axios from 'axios'
 import qs from 'qs' */
import { h } from 'vue'
import {ElMessage} from "element-plus";
import request from "@/utils/request";
import Cookies from 'js-cookie'

export default {
  name: 'Login',
  data(){ //数据池与上面标签的数据是双向绑定的
    return {
      userId: this.$route.query.userId,//获取登录界面用户的id
      name:'',
      pwd:''
    }
  },
  //页面跳转
  methods:{
    forgetPass(){
      this.$message({ // 弹出登录成功信息
        type: "info", message: "该功能未开发"
      })
    },

    gotoRegister(){
      this.$router.push('/Register');//当点击触发这个函数的时候路由到注册
    },
    doSubmit() {
      let userid;
      // alert(this.name + this.pwd);
//http:///8.135.237.176:80/api/login
      // 向数据库发送账号密码 如果账号密码存在即登录成功i
      request.post("/api/login", { name: this.name, pwd: this.pwd }).then(res => {
        console.log(res);
        if (res.code === "200") {
          this.$message({ // 弹出登录成功信息
            type: "success", message: res.msg
          });

          // 先通过name获取id接口 得到当前用户Id
          request.get("/api/getUserId", { params: { username: this.name } }).then(res => {
            if (res.data) { // 确保res.data存在且不为空
              // alert("当前login用户id1=" + res.data);
              userid = res.data;
              // alert("userid1=" + userid);
              //这里先判断是管理员登录还是用户 进行不同的页面跳转
            request.get("/api/Getadmin",{ params: { id: userid } }).then(res => {
               if (res.data==0) {
                 this.$message({ // 弹出登录成功信息
                   type: "success", message: "普通用户"
                 });
                 // 现在userid已经赋值，可以路由到主页面并带上用户ID
                 this.$router.push({ path: '/userhome', query: { userId: userid } });
               }else if(res.data==1){
                 this.$message({ // 弹出登录成功信息
                   type: "success", message: "管理员"
                 });
                 // 现在userid已经赋值，可以路由到主页面并带上用户ID
                 this.$router.push({ path: '/adminhome', query: { userId: userid } });
               }
            })

            } else {
              this.$message({ // 弹出登录成功信息
                type: "error", message: "无法获取用户id"
              });
            }
          }).catch(err => {
            console.log(err);
            this.$message({ // 弹出登录成功信息
              type: "error", message: "无法获取用户id"
            });
          });
        }else {
          this.$message({ // 弹出登录成功信息
            type: "error", message: "你输入的账号或密码有误"
          });
        }
      }).catch(err => {
        // 处理登录失败的情况
        console.log(err);
        this.$message({ // 弹出登录成功信息
          type: "error", message: "登录失败"
        });
      });

    }
  }
}
</script>


<style scoped>

.img_box{ /*背景图片*/
width: 100%;height: 100%;
background-image: url(https://library-weibb.oss-cn-hangzhou.aliyuncs.com/Front/%E7%99%BB%E5%BD%95%E7%8C%AB%E7%8C%AB.jpg);
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
  background-color: rgba(255, 255, 255, 0.6); /* 半透明背景 */
  border: 1px solid #eaeaea;
  text-align: left;
  box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0.1);
}

.title {
  margin: 0px auto 40px auto;
  text-align: center;
  color: #505458;
}
</style>
