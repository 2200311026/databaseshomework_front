<template>
  <!--页面头头下拉框-->
  <div class="h-6" />
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
<!-- 侧边栏和主体 -->
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
        <div style="height: 40px;width: 100%;margin: 10px 400px;">
          <el-input v-model="search" placeholder=" 请 输 入 关 键 字 " style="width:30%"></el-input>
    <el-button style="margin-left: 10px" type="primary" @click="Search(search)">查询</el-button>
          <el-button type="primary" round @click="addMoney()">充值</el-button>
          <el-text> <span>  当前账户余额: {{ accountBalance }}</span>  </el-text>
        </div>
        <el-table :data="tableData" style="width: 160% ;" >
      <!--    搜索框-->

    <!-- 去掉字段的 width, 让其自适应 -->
      <el-table-column
          prop="isbn"
          label="isbn" sortable
      >
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
          prop="nums"
          label="数量">
      </el-table-column>
      <el-table-column fixed="right" label="操作" width="100">
        <template #default="scope"> <!--scope.row获取当前行的所有信息 -->
          <el-popconfirm
              title="确定要借阅吗？" @confirm="borrow(scope.row)">
            <template #reference>
              <el-button size="mini" type="text">借阅</el-button>
            </template>
          </el-popconfirm>
        </template>
      </el-table-column>
    </el-table>


      </div>
    </div>
  <div>

<!--    引入分页组件-可以根据自己需要进行定制-->
    <div style="margin: 10px 0">
    <el-pagination
        @size-change="handlePageSizeChange"
        @current-change="handleCurrentChange"
        :current-page="currentPage"
        :page-sizes="[5,10]"
        :page-size="pageSize"
        layout="total, sizes, prev, pager, next, jumper"
        :total="total">  <!--数据的总数-->
    </el-pagination>
  </div>

  </div>

  <el-dialog v-model="dialogVisible1" width="30%">
    <el-form :model="form1" label-width="120px">
      <el-form-item label="充值金额">
        <el-input v-model="form1.addMoney" style="width: 80%"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
<span class="dialog-footer">
<el-button @click="dialogVisible1 = false">取消修改</el-button>
<el-button type="primary" @click="changeBookIfo">确 定</el-button>
</span>
    </template>
  </el-dialog>
</template>



<script>
// 引入axios对象 @代表src路径下的
import request from "@/utils/request";
import AboutView from "@/views/AboutView.vue";
import changePassword from "@/views/changePassword.vue";
import { v4 as uuidv4 } from 'uuid';//书号唯一

// @ is an alias to /src
export default {
  name: 'HomeView',
  computed: {
    changePassword() {
      return changePassword
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
      accountBalance: null,//当前用户余额

      currentPage:1,//当前页初始化为1
      pageSize:5,//每页显示几条记录 初始化5
      total:'',//共有多少条记录，会通过请求获取到表中对应的记录数

      form:{},//表单数据
      dialogVisible:false,//控制对话框弹窗是否显示，默认不显示。
      search:'',
      tableData: [],

      registerName:this.$route.query.name,//获取注册页面传过来的name
      userId: this.$route.query.userId,//获取登录界面用户的id
      isbn: '',
      borrowState: 0,
      bookNumber:"",
      dialogVisible1:false,
      form1:{}
    }
  },
  created() {//在此方法中调用list(),完成表格数据的显示 此方法调用的时机是项目启动时数据渲染之前会自动调用

    const registerName = this.registerName;//获取注册页面传过来的id
    // alert("外面-"+registerName)
    if(registerName!=null) {
      //如果注册传过来的id有值 才调用注册getid方法 即通过注册名获取到用户id
      // alert("注册id有值为")
      // alert(registerName)
      this.registerGetId(registerName)
    }
    if(this.userId !=null){
      this.list()
    }

    // alert("得到登录用户的id="+userId);
  },
  methods:{
    showMoney(){ //回显用户金额
      // alert(this.userId);
        request.get("/api/getMoney",{params:{id:this.userId}}).then(res=>{
          request.get("/api/allPenalty",{params:{id:this.userId}}).then(res1=>{
                  // alert("罚金="+res1.data)
                  //  alert(res.data)
            var num1 = +res.data;
            var num2 = +res1.data;
            var result = num1 - num2;
            // alert("总金减去罚金=" + result);
            this.accountBalance=result;
          })
        })
    },
    changeBookIfo(){
        // alert(this.form1.addMoney)
      request.put("/api/addMoney",null,{params:{id:this.userId,money: this.form1.addMoney}}).then(res=>{
        this.$message({
          type: "success", message: "充值成功"
        })
        this.showMoney()
        this.dialogVisible1 = false
      })
    },
    addMoney(){
      this.dialogVisible1=true
    },
    Search(search){
      // alert("search="+search)
      if (search===null||search===""){
        this.$message({//弹出更新失败信息
          type: "warning", message: "请输入搜索内容"})
      }else {
        request.post("/api/selectBooksByName",null,{params:{bookname:search}}).then((res)=>{
          this.tableData=res.data;
        })
      }
    },
    registerGetId(registerName){
      // alert("注册用户名字="+registerName)
      request.get("/api/getUserId", { params: { username: registerName } }).then(res => {
        // alert("注册用户id="+res.data)
        if (res.data) { // 确保res.data存在且不为空
          // alert("通过注册当前login用户id1=" + res.data);
          this.userId = res.data;
        }
        this.list()
      }).catch(err => {
        console.log(err);
        // alert("通过注册不能获取用户id");
      });
    },

    //方法
// 每页有多少条记录 pageSize的变化
    handlePageSizeChange(pageSize){

        this.pageSize=pageSize//即修改数据池里的pageSize
        this.list()
    },
//当前页 handleCurrentChange的变化
    handleCurrentChange(currentPage){

      this.currentPage=currentPage//即修改数据池里的pageSize
      this.list()
    } ,

    handleEdit2(row){
      request.get("/api/find/"+row.id).then(res=>{
        if(res.code==="200"){
          //查询成功
          this.form=res.data
        }else{
          this.$message({//弹出更新失败信息
            type: "error", message: res.msg})
        }
      })
      // this.dialogVisible=true//显示对话框
    },
    //借阅图书
    borrow(row){
      // alert("你借阅的书isbn是"+row.isbn)
      // // alert("你借阅的书isbn是"+row.id)
      // alert("userHomeView你的id是"+this.userId)
      // alert("你借阅的书剩余数量是"+row.lastnums)
      // alert("你借阅的书总数是"+row.allnums)
      // 生成完整的UUID，然后可以截取或转换它
      const fullUuid = uuidv4(); // "xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx"
      // 如果需要10位，你可以考虑截取前10个字符（但这样会降低唯一性）
      // 或者使用其他方法来从UUID生成10位的唯一ID
      const shortId = fullUuid.substring(0, 8);
      // alert(row.isbn)
      // alert("当前借阅的书号(唯一标识):"+row.isbn+"-"+shortId)
      let requestbook={
          id:this.userId,
          isbn:row.isbn,
          borrowState:0,
          bookNumber:row.isbn+"-"+shortId
      }
        //这里判断书的剩余数量如果为0则不再可以借阅
       if(row.lastnums<=0||row.allnums<=0){
         this.$message({
           type: "error", message: "不好意思,没书了"
         })
       }else {
         request.post("/api/request",requestbook ).then(res => {
           if (res.code === "200") {
             this.$message({
               type: "success", message: "借阅申请成功"
             })
             // alert("isbn"+row.isbn)
             //如果借阅成功就减少书籍并且增加该书的借阅数
             request.put("/api/lastNumsSub",null,{ params:{isbn:row.isbn}}).then(res=>{
               if (res.code === "200") {
                 this.$message({
                   type: "success", message: "库存更新"
                 })
               }
               this.list()//刷新数据
             }).catch(err => {
               this.$message({
                 type: "error", message: "库存未更新"
               })
             })
           } else {
             this.$message({
               type: "error", message: "借阅申请失败"
             })}
           this.list() // 刷新列表
         })
       }
    },
    //显示图书信息
    list(){

      request.get("/api/booksNums").then(res=>{
         this.total=res.data
      })
      request.get("/api/getbookByPag2", { params: {pageNum:this.currentPage, pageSize:this.pageSize} }).then(res=>{
        //将返回的数据和tableData[]绑定
        console.log("22222");
        console.log(res.data);
        res.data.forEach(item=>{//遍历返回的lastnums和allnums然后拼接在一起

          item.nums = item.lastnums+"/"+item.allnums //显示 9/10的效果
          //还需要判断 当lastnums=0时不可以借阅
        })
        this.tableData=res.data
      })
      //list()要改为分页查询+带条件查询
      // request.get("/api/furnsBySearchPage", {
      //   params:
      //       {pageNum:this.currentPage,
      //         pageSize:this.pageSize,
      //         search:this.search//这里会带着你输入框中输入的条件
      //       }
      //     }).then(res=>{
      //   //将返回的数据和tableData[]绑定
      //   this.tableData=res.data.records
      //   //修改数据总数
      //   this.total = res.data.total
      // })
      this.showMoney()
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
    personalInfo(){ //跳转到用户信息页面 注意在所有跳转的页面都要携带id 不然返回的时候根据id获取信息就不行
      this.$router.push({path:'/personalInfo',query: { userId:this.userId}})

    },
    myBorrow(){ //跳转到用户信息页面 并且携带用户id
      this.$router.push({path: '/myBorrow',query: { userId:this.userId} })
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
},
    aboutView(){
      this.$router.push('/about')
    },  borrowRecord(){
      console.log("返回主页点击")
      this.$router.push({path: '/borrowRecord', query: {userId: this.userId}});
    }
  }
}
</script>
