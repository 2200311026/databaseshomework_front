<template>
  <!--页面头头下拉框-->
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

  <div>
<!-- 侧边栏和主体 -->
    <div style="display: flex">
      <!-- 侧边栏导航 -->
      <div style="width: 150px; min-height: calc(100vh - 62px); overflow: hidden;background-color: white; margin-right: 2px;float: left;">
        <el-menu :default-active="$route.path" router class="el-menu-demo" style="margin-bottom: 10px;" >
      <el-menu-item index="1" @click="return1() " >借阅管理
      </el-menu-item>

      <el-sub-menu index="2" >
      <template #title open>管理</template>
        <el-menu-item index="2-1" @click="adminpersonalInfo()">个人信息</el-menu-item>
        <el-menu-item index="2-2"@click="adminuserManagement()">借阅记录</el-menu-item>
        <el-menu-item index="2-3" @click="adminbookManagement()" >书籍管理</el-menu-item>
        <el-menu-item index="2-3" @click="changePassword_fun()">修改密码</el-menu-item>
        <el-menu-item index="2-4" @click="logout()">退出登录</el-menu-item>
      </el-sub-menu>
           </el-menu>

      </div>
      <div style="width: 100%;float: left;">
        <!-- 去掉字段的 width, 让其自适应 -->
    <el-table :data="tableData" >
      <el-table-column
          prop="requestId"
          label="单号" sortable
           width="80px"
      >
      </el-table-column>
      <el-table-column
          prop="name"
          label="借书人"
           width="100px"
          >
      </el-table-column>
      <el-table-column
          prop="mobile"
          label="联系方式"
           width="120px">
      </el-table-column>
      <el-table-column
          prop="isbn"
          label="isbn"
           width="60px">
      </el-table-column>
      <el-table-column
          prop="bookNumber"
          label="书号(每本唯一标识)"
           width="200px">
      </el-table-column>
      <el-table-column
          prop="bookname"
          label="书名">
      </el-table-column>
      <el-table-column
          prop="borrowState_true"
          label="请求状态">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope"> <!--scope.row获取当前行的所有信息 -->
          <el-popconfirm
              title="确定同意吗？" @confirm="agree(scope.row)">
            <template #reference>
              <el-button size="mini" type="text">同意</el-button>
            </template>
          </el-popconfirm>
          <el-popconfirm
              title="确定拒绝吗？" @confirm="disagree(scope.row)">
            <template #reference>
              <el-button size="mini" type="text">拒绝</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>
      </div>
    </div>



  </div>
</template>

<script>
// 引入axios对象 @代表src路径下的
import request from "@/utils/request";
import AboutView from "@/views/AboutView.vue";
import adminUserManagement from "@/views/adminUserManagement.vue";
import adminBookManagement from "@/views/adminBookManagement.vue";
import Color from "element-plus/es/components/color-picker/src/utils/color";


// @ is an alias to /src
export default {
  name: 'HomeView',
  computed: {
    adminBookManagement() {
      return adminBookManagement
    },
    adminUserManagement() {
      return adminUserManagement
    },
    AboutView() {
      return AboutView
    }
  },
  components: {
  },
  data(){
    //数据池
    return{
      userId: this.$route.query.userId,//获取登录界面用户的id
      currentPage:1,//当前页初始化为1
      pageSize:5,//每页显示几条记录 初始化5
      total:10,//共有多少条记录，会通过请求获取到表中对应的记录数

      form:{},//表单数据
      dialogVisible:false,//控制对话框弹窗是否显示，默认不显示。
      search:'',
      tableData: []
    }
  },
  created() {//在此方法中调用list(),完成表格数据的显示 此方法调用的时机是项目启动时数据渲染之前会自动调用
    this.list()
  },
  methods:{
    //方法
// 每页有多少条记录 pageSize的变化
    handlePageSizeChange(pageSize){
      this.pageSize=pageSize//即修改数据池里的pageSize
      this.list()
    },
//当前页 handleCurrentChange的变化
    handleCurrentChange(pageNum){
      this.currentPage=pageNum
      this.list()
    } ,


    disagree(row){
      // alert(row.requestId)
      // alert(row.borrowState)


      //拒绝请求则根据requestId把request表中对应的数据删了
      // alert(row.requestId)
      request.delete("/api/DeleteRequest",{ params: { requestId: row.requestId } }).then(res=>{
        this.$message({//弹出还书成功信息
          type: "success", message: "已取消请求"})
//当管理员拒绝请求 归还用户在申请阶段占用的 书本的数量
        request.put("/api/lastNumsAdd",null,{params:{isbn:row.isbn}}).then(res=>{
          this.$message({//弹出还书成功信息
            type: "success", message: "更新库存"})
        })

        this.list();//刷新表单
      })
    },
    agree(row){
      //同意借书的话 通过书的订单requestId修改borrowState的值变为1
      // alert("------------")
      // alert(row.requestId)
      // alert("------------")
      //因为用户在申请即在审核阶段就已经书的lastnums--了 所以当管理员同意借书的时候不用再--了
      request
          request.put("/api/updateBorrowState",null,{ params:{ requestId: row.requestId }}).then(res=>{
            this.$message({//弹出还书成功信息
              type: "success", message: "已同意"})
            this.list();//刷新表单
          })
    },
    list(){
      // request.get("/api/furns").then(res=>{
      //   //将返回的数据和tableData[]绑定
      //   this.tableData=res.data
      // })
      request.get("/api/adminRequest").then(res=>{
        console.log(res.data)
        if(res.code==="200"){
          res.data.forEach(item=>{
            console.log(item.borrowState);
            if(item.borrowState===0){ //判断后端传过来的书籍借阅状态的参数如果是0还在审核中
              item.borrowState_true="等待批准"
            }
          })
          this.tableData=res.data
        }else{
          this.$message({//弹出更新失败信息
            type: "error", message: res.msg})
        }
      })
    },
    //保存家居数据
    save(){
      if(this.form.id){
        //执行修改操作
        request.put("/api/update",this.form).then(res=>{
          if(res.code==="200"){
            //修改成功
            this.$message({ //弹出更新成功的消息框
              type: "success", message: "更新成功"
            })
          }else{
            //修改失败
            this.$message({//弹出更新失败信息
              type: "error", message: "更新失败"
            })
          }
          this.list() //刷新列表
          this.dialogVisible = false//关闭对话框
        })
      }else{
        //执行添加
        request.post("/api/save",this.form).then(//这里把form里的值变为json格式传到后端 细节底层已帮你做好
            res=>{//箭头函数
              // res即返回的结果
              console.log("res=",res)
              this.dialogVisible=false
              this.list()//新增后刷新回显显示刚刚新增的信息
            }
        )
      }
    },
    handleEdit(row){
      //这个方法是对row中行数据深拷贝，即表中的行数据和编辑回显的数据是独立的
      this.form=JSON.parse(JSON.stringify(row))
      this.dialogVisible=true
    },
    //add方法 点击添加标签会触发这个方法 用于显示添加的对话框
    add(){
      this.dialogVisible=true
      //每次显示添加对话框时，清空表单，为了清除因为双向绑定上次书写的信息还留着文本框里
      this.form={}
    },
    aboutView(){
      this.$router.push('/about')
    },
    adminpersonalInfo(){
      this.$router.push({path:'/adminpersonalInfo',query: { userId:this.userId}})
    },
    adminuserManagement(){
      this.$router.push({path:'/adminUserManagement',query: { userId:this.userId}})
    },return1() {
      console.log("返回主页点击")
      this.$router.push({path:'/adminhome',query: { userId:this.userId}});
    },adminbookManagement() {
      console.log("返回主页点击")
      this.$router.push({path:'/adminBookManagement',query: { userId:this.userId}});
    },changePassword_fun() {
      console.log("返回主页点击")
      this.$router.push({path:'/adminchangePassword',query: { userId:this.userId}});
    }, logout() {
      console.log("返回主页点击")
      this.$router.push({path:'/',query: { userId:this.userId}});
    }
  }
}
</script>
