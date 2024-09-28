<template>
  <div class="h-6" />
  <div class=""></div>
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
      <el-menu-item index="1" @click="return1()">借阅管理
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

      <div style="width: 100%;">
        <div>
          <!-- 这里可以展示all的值或其他与item和all相关的内容 -->
          <p>Sum: {{ all }}</p>
        </div>
        <el-button class="upload-btn" @click="addBook()">上传图书</el-button>
        <el-table :data="tableData" style="width: 160%" >
      <el-table-column prop="isbn" label="ISBN"  width="60px"></el-table-column>
      <el-table-column prop="bookname" label="书名" width="200px"></el-table-column>
      <el-table-column prop="category" label="分类"></el-table-column>
      <el-table-column prop="author" label="作者"></el-table-column>
      <el-table-column prop="publish" label="出版社"></el-table-column>
      <el-table-column prop="img" label="图片">
        <template #default="scope">
          <img :src="scope.row.img" alt="图书封面" style="width: 100px; height: auto;">
        </template>
      </el-table-column>
      <el-table-column prop="numss" label="剩余数量"></el-table-column>
      <el-table-column label="操作">
        <template v-slot="scope">
          <el-button type="primay" value="return" @click="show1(scope.row)">修改</el-button>

          <el-button type="primary" value="return" @click="downBook(scope.row)" class="c1">下架</el-button></template>
      </el-table-column>

    </el-table>
      </div>
    </div>

  <el-dialog title="修改图书信息" v-model="dialogVisible1" width="30%">
    <el-form :model="form1" label-width="120px">
      <el-form-item label="书名">
        <el-input v-model="form1.bookname" style="width: 80%"></el-input>
      </el-form-item>
      <el-form-item label="分类">
        <el-input v-model="form1.category" style="width: 80%"></el-input>
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="form1.author" style="width: 80%"></el-input>
      </el-form-item>
      <el-form-item label="出版社">
        <el-input v-model="form1.publish" style="width: 80%"></el-input>
      </el-form-item>
      <el-form-item label="封面">
          <el-upload
              class="avatar-uploader"
              action="/api/uploadAvatarBook"
              :show-file-list="false"
              :on-success="handleAvatarSuccess"
              :before-upload="beforeAvatarUpload"
              :data="{isbn:this.isbn}"
          >
            <img v-if="imageUrl" :src="imageUrl" class="avatar">
            <i v-else class="el-icon-plus avatar-uploader-icon"></i>
          </el-upload>
      </el-form-item>
      <el-form-item label="新增库存" >
        <el-input v-model="form1.addnums" style="width: 80%" placeholder="请输入增加数量"></el-input>
      </el-form-item>
      <el-form-item label="减少库存" >
        <el-input v-model="form1.subnums" style="width: 80%" placeholder="请输入减少数量"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
<span class="dialog-footer">
<el-button @click="dialogVisible1 = false">取消修改</el-button>
<el-button type="primary" @click="changeBookIfo">确 定</el-button>
</span>
    </template>
  </el-dialog>

  <el-dialog title="添加图书" v-model="dialogVisible" width="30%" >
    <el-form :model="form" label-width="120px" >
      <el-form-item label="书名">
        <el-input v-model="form.bookname" style="width: 80%"placeholder="请输入书名"></el-input>
      </el-form-item>
      <el-form-item label="分类">
        <el-input v-model="form.category" style="width: 80%" placeholder="请输入图书分类"></el-input>
      </el-form-item>
      <el-form-item label="作者">
        <el-input v-model="form.author" style="width: 80%" placeholder="请输入图书作者"></el-input>
      </el-form-item>
      <el-form-item label="出版社">
        <el-input v-model="form.publish" style="width: 80%" placeholder="请输入出版社"></el-input>
      </el-form-item>
      <el-form-item label="数量">
        <el-input v-model="form.allnums" style="width: 80%"  placeholder="请输入数量"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
<span class="dialog-footer">
<el-button @click="dialogVisible = false">取消添加</el-button>
<el-button type="primary" @click="save">提交</el-button>
</span>
    </template>
  </el-dialog>

</template>

<script>
import Cookies from 'js-cookie'
// 引入axios对象 @代表src路径下的
import request from "@/utils/request";
import AboutView from "@/views/AboutView.vue";
import {all} from "axios";

// @ is an alias to /src
export default {
  name: 'adminBookManagement',
  components: {
  },
  data() {
    return{
      all: 0,
      form:{},//新增书弹窗的数据
      form1:{},//修改书弹窗
      isbn: '',//点击修改标签获得isbn先保存起来 等到 提交信息时候触发 另一个方法的时候 另一个方法可以通过数据池获取该isbn
      dialogVisible:false,
      dialogVisible1:false,
      tableData: [],
      userId: this.$route.query.userId,//获取登录界面用户的id
      imageUrlshow: '',
      imageUrl: ''

    }
  },
  created() {
    this.list()
  },
  methods: {
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
    handleAvatarSuccess(response, file) {
      // 图片上传成功的处理逻辑
      // alert("res:"+response)
      // alert("file:"+file)
      this.$message({
        type: "success", message: "图片上传成功"
      })
      console.log(response)
      console.log(file)
      // alert("this.isbn1="+this.isbn)
      // alert("response.data="+response.data)
      // alert("response.msg:"+response.msg)
      // this.imageUrl = "http://localhost:9090/f74b28a2-5fae-4438-87e2-004edc4d7797猥琐猫.jpg";
      // this.imageUrl = "http://localhost:9090/ktcat.jpg";//有用
      // this.imageUrl = URL.createObjectURL(file.raw);//图片回显
      this.imageUrl = response.msg
      // alert("this.imageUrl:"+this.imageUrl);
      // console.log(file)
      console.log(file.raw);
    },
    beforeAvatarUpload(file) {
      // alert("this.isbn2="+this.isbn)
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
    downBook(row){
      // alert(row.isbn)
      //只有图书全部还完了 即borrow等于0才能下架图书
          request.get("/api/getBorrow", { params: { isbn: row.isbn } }).then(res=>{
            // alert(res.data)
            if(res.data<=0){
              request.delete("/api/deleteBook",{params:{isbn:row.isbn}}).then(res=> {
                this.list()
                this.$message({
                  type: "success", message: "成功下架"
                })
              })

            }else{
              this.list()
              this.$message({
                type:"warning", message: "存在还没归还的书"
              })
              this.$message({
                type:"error", message: "不能下架"
              })
            }
          })
    },
    show1(row){

      this.isbn=row.isbn;
      // alert(row.imageUrl)
      //
      // this.imageUrl=row.imageUrl;
      // alert("数据池ISBN-"+this.isbn)
      this.dialogVisible1=true;
      this.form1=JSON.parse(JSON.stringify(row))//当打开弹窗 row会读取相关数据变成json格式赋值给form1
    },
    changeBookIfo(){
      //新增库存的时候 数据库的lastnums和allnums数量同时添加
      //通过当前isbn 调用接口 获取lastnums和allnums和borrownums的值进行数据逻辑处理好 再赋给book1 再更新数据库 再回显
      request.post("/api/getNums",null,{params:{isbn:this.isbn}}).then(res=>{
        //得到返回的数据
       // alert( this.form1.addnums)
       //  alert(res.data.lastnums)
       //  alert(res.data.allnums)
        if(this.form1.addnums===undefined)
        {
          // alert("没有输入增加")
          this.form1.addnums=0
        }
        if(this.form1.subnums===undefined)
        {
          this.form1.subnums=0
        }
        // alert(this.form1.subnums)   //增加库存 allnums+addnums 而对于减少库存 只有lastnums-subnums 计算完后先判断是否合规
        let addlastnum=(Number(res.data.lastnums)+Number(this.form1.addnums)-Number(this.form1.subnums)).toString();//计算原来结果
        let addallnums=(Number(res.data.allnums)+Number(this.form1.addnums)-Number(this.form1.subnums)).toString();//计算原来结果
        if(addlastnum<0){
          this.$message({
                    type:"warning", message: "库存已达到借书数"
                  })
          this.$message({
            type: "error", message: "库存减少失败"
          })
        }else{
          let book1={
            isbn:this.isbn,
            category:this.form1.category,
            bookname:this.form1.bookname,
            author:this.form1.author,
            publish:this.form1.publish,
            img:this.imageUrl,
            lastnums :addlastnum,
            allnums  :addallnums,
            borrownums : res.data.borrownums
          }//把修改好后的数据更新数据库
          // alert(book1.lastnums)
          // alert(book1.allnums)
          // alert(book1.borrownums)
          request.put("/api/changeBookInfo",book1 ).then(res=>{
            if (res.code === "200") {
              this.$message({
                type: "success", message: "修改书籍成功"
              })
            } else {
              this.$message({
                type: "error", message: "修改书籍失败"
              })}
            this.dialogVisible1=false //弹窗关闭
            this.list() // 刷新列表
          })
        }
      })
    },
    save(){
      //新增图书
      this.form.lastnums=this.form.allnums
      this.form.borrownums=0
      // alert(this.form.allnums)
      // alert("--------能获取到输入的数量值---------")
      // alert(this.form.lastnums)
      //所以添加书籍的时候allnums==lastnums borrownums=0 把修改好后的form传给后端 新增图书
            request.put("/api/addBook",this.form).then(res=>{
              if (res.code === "200") {
                this.$message({
                  type: "success", message: "添加书籍成功"
                })
              } else {
                this.$message({
                  type: "error", message: "添加书籍失败"
                })}
              this.dialogVisible=false //弹窗关闭
              this.list() // 刷新列表
            })
    },
    addBook(){
      //点击按钮触发该方法
      this.dialogVisible = true;//对话框显示
    },
    list(){

      this.all=0
        //回显book数据展示
      request.get("/api/showBook").then(res=> {
        res.data.forEach(item=>{//遍历返回的lastnums和allnums然后拼接在一起
                // console.log(item.allnums);
          item.numss = item.lastnums+"/"+item.allnums //显示 9/10的效果
          // alert(item.lastnums);

          // alert(item.lastnums)
          this.all+=parseInt(item.lastnums)
          // this.all+=item.lastnums

          console.log("-----------------------")
           console.log(item)

          console.log("------------------------")
          //还需要判断 当lastnums=0时不可以借阅
        })
        // alert("111"+this.all)
        //将返回的数据和tableData[]绑定
        this.tableData = res.data
      })
      // alert(this.all)
      // this.tableData.img="http://localhost:9090/b52215cf-451d-49e8-b560-375af9e4db96猥琐猫.jpg"
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
    },
    adminpersonalInfo(){
      this.$router.push({path:'/adminpersonalInfo',query: { userId:this.userId}})
    },
    adminuserManagement(){
      this.$router.push({path:'/adminUserManagement',query: { userId:this.userId}})
    },adminbookManagement() {
      this.$router.push({path:'/adminBookManagement',query: { userId:this.userId}});
    }
  }
}
</script>
<style>
  .logoIn{
  color: white;
  font-size: 25px;
  margin: 10px 50px;
  }

</style>
