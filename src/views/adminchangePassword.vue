<template>
  <!-- <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      @select="handleSelect"
  >
    <el-menu-item index="1" @click="return1()">首页</el-menu-item>
    <el-sub-menu index="2">
      <template #title>用户</template>
      <el-menu-item index="2-1" @click="personalInfo()" >个人信息</el-menu-item>
      <el-menu-item index="2-3" @click="changePassword_fun()">修改密码</el-menu-item>
      <el-menu-item index="2-4" @click="logout()">退出登录</el-menu-item>
    </el-sub-menu>
  </el-menu> -->
  <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo "
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"

      @select="handleSelect"
  >
  <div class="logoIn">图书信息管理系统</div>
  </el-menu>

  <div class="img_box"/>
  <div class="container">
    <el-form :model="form" :rules="rules" ref="form" label-width="120px" class="demo-ruleForm login-container">
      <el-form-item label="旧密码" prop="oldPassword">
        <el-input type="password" v-model="form.oldPassword" placeholder="请输入旧密码"></el-input>
      </el-form-item>
      <el-form-item label="新密码" prop="newPassword">
        <el-input type="password" v-model="form.newPassword" placeholder="请输入新密码"></el-input>
      </el-form-item>
      <el-form-item>
        <el-button type="primary" @click="submitForm('form')">修改密码</el-button>
        <el-button @click="resetForm('form')">重置</el-button>
        <el-button @click="retuenmain()">返回</el-button>
      </el-form-item>
    </el-form>
  </div>
</template>

<script>
import request from "@/utils/request";
export default {
  data() {
    return {
      userId: this.$route.query.userId,//获取登录界面用户的id
      form: {
        oldPassword: '',
        newPassword: '',
        // 这里我们没有使用 confirm 字段，但为了演示 validatePass2 函数，我保留了它
        // confirm: '',
      }
    };
  },
  methods: {
    submitForm(){
      if(this.form.newPassword === ""){
        this.$message({
          type: "error", message: "未输入新密码"
        })
      }else if(this.form.oldPassword===""){
        this.$message({
          type: "error", message: "未输入旧密码"
        })
      }else {
        //输入密码后 通过id找到老密码在后端判断你输入的oldpassword是否一样 如果一样返回前端true false 则通过id去更改老密码
        request.get("/api/getUserPassword",{params:{id:this.userId,oldPassword:this.form.oldPassword}}).then(res => {
          if (res.data===false)
          {
            this.$message({
              type: "error", message: "你输入的旧密码有误"
            })
          }else{
            request.put("/api/updatePassword",null,{params:{id:this.userId,newPassword:this.form.newPassword}}).then(res=>{
              this.$message({
                type: "success", message: "修改密码成功"
              })
            }).catch(err=>{
              this.$message({
                type: "error", message: "修改密码失败"
              })
            })
          }
        })
      }
    },
    resetForm(formName) {
      this.$refs[formName].resetFields();
    },
    personalInfo(){ //跳转到用户信息页面
      this.$router.push({path:'/adminpersonalInfo',query: { userId:this.userId}})

    },
    return1() {
      console.log("返回主页点击")
      this.$router.push({path:'/adminhome',query: { userId:this.userId}});
    },
    changePassword_fun() {
      console.log("返回主页点击")
      this.$router.push({path:'/adminchangePassword',query: { userId:this.userId}});
    },
    logout() {
      console.log("返回主页点击")
      this.$router.push({path:'/',query: { userId:this.userId}});
    }  ,adminpersonalInfo(){
      this.$router.push({path:'/adminpersonalInfo',query: { userId:this.userId}})
    },
    adminuserManagement(){
      this.$router.push({path:'/adminUserManagement',query: { userId:this.userId}})
    },adminbookManagement() {
      console.log("返回主页点击")
      this.$router.push({path:'/adminBookManagement',query: { userId:this.userId}});
    },retuenmain() {
      console.log("返回主页点击")
      this.$router.push({path:'/adminhome',query: { userId:this.userId}});
    }
  }
};
</script>

<style scoped>

.container {
  display: flex;
  justify-content: center; /* 水平居中 */
  align-items: center; /* 垂直居中 */
  height: 100vh; /* 设置为视口高度以确保垂直居中 */
  /* 还可以添加其他样式，比如背景色、内边距等 */
  background-color: rgba(255, 255, 255, 0.3); /* 示例背景色 */
  padding: 20px; /* 示例内边距 */
}

.img_box{ /*背景图片*/
  width: 100%;
  height: 100%;
  background-image: url(https://library-weibb.oss-cn-hangzhou.aliyuncs.com/Front/%E4%BF%AE%E6%94%B9%E5%AF%86%E7%A0%81%E7%8C%AB.jpg);
  background-size: cover; /* 使图片平铺满整个浏览器（从宽和高的最大需求方面来满足，会使某些部分无法显示在区域中） */
  position: absolute; /* 不可缺少 */
  /* overflow: hidden; */
  /* overflow: auto; */
  /* z-index: -1; */
  background-repeat: no-repeat;
}
.login-container {
  border-radius: 10px;
  margin: 1px auto;
  width: 450px;
  padding: 20px 25px 15px 1px;
  background-color: rgba(255, 255, 255, 0.6);
  border: 1px solid #eaeaea;
  text-align: left;
  box-shadow: 0 0 20px 2px rgba(0, 0, 0, 0);
}
  .logoIn{
    margin: 10px 10px;
  }
</style>
