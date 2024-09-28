<template>
  <div class="img_box"/> <!-- 背景图片 -->
  <div class="flex-center" > <!-- 添加 flex-center 类 -->
    <div>
      <el-card style="width: 800px; margin-top: 20px; margin-left: 20px; opacity: 0.9;" shadow="hover">
        <el-form label-width="80px" size="small">
          <el-upload
              class="avatar-uploader"
              action="/api/uploadAvatar"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :data="{id:this.userId}"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
          <el-form-item label="id" style="margin-left: 200px; margin-top: -150px;">
            <el-input v-model="form.id" disabled autocomplete="off" style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item label="用户名" style="margin-left: 200px">
            <el-input v-model="form.name" autocomplete="off" style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item label="性别" style="margin-left: 200px">
            <el-select v-model="form.gender" placeholder="请选择您的性别" style="width: 400px">
              <el-option
                  v-for="item in options"
                  :key="item.value"
                  :label="item.label"
                  :value="item.value">
              </el-option>
            </el-select>
          </el-form-item>
          <el-form-item label="邮箱" style="margin-left: 200px">
            <el-input v-model="form.email" autocomplete="off" style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item label="电话" style="margin-left: 200px">
            <el-input v-model="form.mobile" autocomplete="off" style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item label="地址" style="margin-left: 200px" >
            <el-input type="textarea" v-model="form.addr" autocomplete="off" style="width: 400px"></el-input>
          </el-form-item>
          <el-form-item>
            <el-button type="primary" @click="save">保 存</el-button>
            <!--          <el-button type="primary" @click="sign"><i class="el-icon-location" />定位</el-button>-->
            <el-button type="primary" @click="return1">返回主页</el-button>
          </el-form-item>
        </el-form>
      </el-card>
    </div>
  </div>
</template>

<script>

import request from "@/utils/request";
export default {
  name: "Person",
  components: {},
  data() {

    return {
      imageUrl: '', // 存储图片地址

      userId: this.$route.query.userId,//获取登录界面用户的id
      form: {
      },
      options: [{
        value: 1,
        label: '男'
      }, {
        value: 0,
        label: '女'
      }],
    }
  },
  created() {
    this.list()//回显函数
  },
  methods: {
    handleAvatarSuccess(response, file) {

      console.log(response)
      console.log(file)


      this.imageUrl = response.msg

      console.log(file.raw);
    },
    beforeAvatarUpload(file) {
      // 在上传之前的处理逻辑，例如文件大小限制、文件类型限制等
      const isJPG = file.type === 'image/jpeg';
      const isPNG = file.type === 'image/png';
      const isLt2M = file.size / 1024 / 1024 < 2;

      if (!(isJPG || isPNG)) {
        this.$message.error('上传头像图片只能是 JPG 或 PNG 格式!');
      }

      if (!isLt2M) {
        this.$message.error('上传头像图片大小不能超过 2MB!');
      }

      return (isJPG || isPNG) && isLt2M;
    },
    list(){
      request.get("/api/getUserInfo", { params: { id: this.userId } }).then(res=>{
        console.log(res.data);
        this.form=res.data//回显用户信息到表单
      })
      request.get("/api/getImgUrl", { params: { id: this.userId } }).then(res=>{
        this.imageUrl = res.msg;
        // alert("res.msg="+res.msg)
      }).catch(err=>{
        alert("没找到")
      })
    },
    save() {//修改表单信息然后同步到数据库再回显

      request.put("/api/changeUserInfo",this.form).then(res => {
        if (res.code==="200") {
          this.$message({
            type: "success", message: "更新成功"})
          this.list()
        } else {
          this.$message({
            type: "error", message: "更新失败"})
        }
      })
    },
    return1() {
      console.log("返回主页点击")
      this.$router.push({path:'/adminhome',query: { userId:this.userId}});
    }
  }
}
</script>

<style>

.img_box{ /*背景图片*/
  width: 100%;height: 100%;
  background-image: url(https://library-weibb.oss-cn-hangzhou.aliyuncs.com/Front/%E7%94%A8%E6%88%B7%E7%95%8C%E9%9D%A2.jpg);
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

.avatar-uploader {
  text-align: left;
  padding-bottom: 10px;
}
.avatar-uploader .el-upload {
  border: 1px dashed #d9d9d9;
  border-radius: 6px;
  cursor: pointer;
  position: relative;
  overflow: hidden;
}
.avatar-uploader .el-upload:hover {
  border-color: #409EFF;
}
.avatar-uploader-icon {
  font-size: 28px;
  color: #8c939d;
  width: 138px;
  height: 138px;
  line-height: 138px;
  text-align: center;
}
.avatar {
  width: 160px;
  height: 160px;
  display: block;
}
</style>
