<template>
  <div class="h-6" />
  <el-menu
      :default-active="activeIndex2"
      class="el-menu-demo"
      mode="horizontal"
      background-color="#545c64"
      text-color="#fff"
      active-text-color="#ffd04b"
      @select="handleSelect"
  >
    <div class="logoIn">图书信息管理系统</div>
  </el-menu>
  <div style="display: flex;">
      <!-- 侧边栏导航 -->
      <div style="width: 150px; min-height: calc(100vh - 62px); overflow: hidden;background-color: white; margin-right: 2px;float: left;">
        <el-menu :default-active="$route.path" router class="el-menu-demo" style="margin-bottom: 10px;" >
      <el-menu-item index="1" @click="return1()">
      首页
      </el-menu-item>

      <el-sub-menu index="2" >
      <template #title open>管理</template>
        <el-menu-item index="2-1" @click="personalInfo()" >个人信息</el-menu-item>
        <el-menu-item index="2-2" @click="myBorrow()">请求状态</el-menu-item>
        <el-menu-item index="2-2" @click="borrowRecord()">借阅记录</el-menu-item>
        <el-menu-item index="2-3" @click="changePassword_fun()">修改密码</el-menu-item>
        <el-menu-item index="2-4" @click="logout()">退出登录</el-menu-item>
      </el-sub-menu>
           </el-menu>

      </div>
      <div style="width: 100%;">

        <el-table :data="tableData" style="width: 160% ;" >
    <el-table-column
        prop="isbn"
        label="isbn" sortable
    >
    </el-table-column>
    <el-table-column
        prop="requestId"
        label="单号"
    >
    </el-table-column>
    <el-table-column
        prop="bookNumber"
        label="书号(每本唯一标识)"
d    >
    </el-table-column>
    <el-table-column
        prop="category"
        label="书籍类别" >
    </el-table-column>
    <el-table-column
        prop="bookname"
        label="书名">
    </el-table-column>
    <el-table-column
        prop="author"
        label="作者">
    </el-table-column>
    <el-table-column
        prop="publish"
        label="出版社">
    </el-table-column>
    <el-table-column prop="img" label="图片">
      <template #default="scope">
        <img :src="scope.row.img" alt="图书封面" style="width: 100px; height: auto;">
      </template>
    </el-table-column>
    <el-table-column
        prop="borrowState_ture"
        label="当前状态">  <!--0 为下架 1为上架-->
    </el-table-column>
    <el-table-column fixed="right" label="操作" width="100">
      <template #default="scope"> <!--scope.row获取当前行的所有信息 -->
        <el-popconfirm
            title="确定要还书吗？" @confirm="borrowreturn(scope.row)">
          <template #reference>
            <el-button size="mini" type="text">还书</el-button>
          </template>
        </el-popconfirm>
      </template>
    </el-table-column>
  </el-table>
      </div>
    </div>
  <div></div>

</template>

<script>
// 引入axios对象 @代表src路径下的
import request from "@/utils/request";
import AboutView from "@/views/AboutView.vue";


// @ is an alias to /src
export default {
  name: 'myBorrowBook',
  components: {
  },
  data() {
    return{
      tableData: [],
      userId:this.$route.query.userId//获取主页传来的用户id 在所有页面都要设置页面跳转来的id 这样才能接收别的页面传来的id 并再传出去
    }
  },
  created() {//在此方法中调用list(),完成表格数据的显示 此方法调用的时机是项目启动时数据渲染之前会自动调用
    // this.list()
    // const userId = this.$route.query.userId;//获取登录界面用户的id
    // alert("myBorrow的id="+userId);
    this.list();

  },
  methods: {
    list(){
      //回显借阅信息
      request.get("/api/getMyborrow", { params: { id: this.userId } }).then(res=>{
        if(res.code==="200"){
          res.data.forEach(item=>{
            console.log(item.borrowState);
            if(item.borrowState===0){ //判断后端传过来的书籍借阅状态的参数如果是0还在审核中
              item.borrowState_ture="待审核"
            }else if(item.borrowState===1){
              item.borrowState_ture="已借阅"
            }
          })
          this.tableData=res.data
        }else{
          this.$message({//弹出更新失败信息
            type: "error", message: res.msg})
        }
      })
    },
    borrowreturn(row){
      //还书的同时把对应isbn书的lastnums++
      // alert(row.isbn)
      //还书的时候通过请求表的id把request请求表中数据删掉
      //   alert(row.requestId)
      request.delete("/api/DeleteRequest",{ params: { requestId: row.requestId } }).then(res=>{
             this.$message({//弹出还书成功信息
                 type: "success", message: res.msg})

        request.put("/api/lastNumsAdd",null,{params:{isbn:row.isbn}}).then(res=>{
          this.$message({
            type: "success", message: "库存更新"})
        })
        this.list();
      })
    },
    personalInfo(){ //跳转到用户信息页面
      this.$router.push({path:'/personalInfo',query: { userId:this.userId}})

    },
    myBorrow(){ //跳转到用户信息页面
      this.$router.push({path:'/myBorrow',query: { userId:this.userId}})
    },
    return1() {
      console.log("返回主页点击")
      this.$router.push({path:'/userhome',query: { userId:this.userId}});
    },
    changePassword_fun() {
      console.log("返回主页点击")
      this.$router.push({path:'/changePassword',query: { userId:this.userId}});
    },
    logout() {
      console.log("返回主页点击")
      this.$router.push({path:'/',query: { userId:this.userId}});
    },  borrowRecord(){
      console.log("返回主页点击")
      this.$router.push({path: '/borrowRecord', query: {userId: this.userId}});
    }
  }
}
</script>
