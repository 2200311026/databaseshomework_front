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
    <div style="width: 385px;float: right;" ></div>
    <div class="time"> 现在的时间是:{{nowTime}}</div>


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
      <el-table :data="tableData" style="width: 100%">
      <el-table-column prop="recordId" label="序号" width="60px"></el-table-column>
      <el-table-column prop="id" label="读者Id" width="70px"></el-table-column>
      <el-table-column prop="name" label="读者名" width="70px"></el-table-column>
      <el-table-column prop="isbn" label="isbn" width="57px" ></el-table-column>
      <el-table-column
          prop="bookNumber"
          label="书号(每本唯一标识)"
          width="148px">
      </el-table-column>
      <el-table-column prop="bookname" label="书名"></el-table-column>
      <el-table-column prop="requestId" label="单号" width="60px"></el-table-column>
      <el-table-column prop="borrowTime" label="借阅时间"></el-table-column>
      <el-table-column prop="returnTime" label="归还时间"></el-table-column>
      <el-table-column prop="returnState_C" label="归还状态"width="80px"></el-table-column>
      <el-table-column prop="isTimeOut" label="是否超时" width="80px"></el-table-column>
      <el-table-column prop="penalty" label="当前罚金" width="80px"></el-table-column>
      <el-table-column label="增加罚金">
        <template v-slot="scope">
          <el-button
              type="primary"
              value="return"
              @click="show1(scope.row)"
          >增加</el-button
          >
        </template>
      </el-table-column>
    </el-table>
      </div>
    </div>
  <div>

  </div>

  <el-dialog title="请设置超时罚金" v-model="dialogVisible" width="30%">
    <el-form :model="form" label-width="120px">
      <el-form-item label="罚金">
        <el-input v-model="form.penalty" style="width: 80%"></el-input>
      </el-form-item>
    </el-form>
    <template #footer>
<span class="dialog-footer">
<el-button @click="dialogVisible = false">取 消</el-button>
<el-button type="primary" @click="save">确 定</el-button>
</span>
    </template>
  </el-dialog>
</template>

<script>
// 引入axios对象 @代表src路径下的
import request from "@/utils/request";
import AboutView from "@/views/AboutView.vue";


// @ is an alias to /src
export default {
  name: 'adminUserManagement',
  components: {
  },
  data() {
    return{
      userId: this.$route.query.userId,//获取登录界面用户的id
      dialogVisible:false,
      tableData:[],
      form:{},
      recordId:"",
      penalty:"",
      nowTime: '',
      timerId: null, // 用于存储定时器的ID
    }
  },
  //在mounted钩子函数中调用nowTimes函数、在beforeDestroy钩子函数中调用clear函数
  mounted () {
    this.nowTimes()
    this.timerId = setInterval(this.echoFunction, 6000); // 设置定时器，每隔10秒调用echoFunction 1000=1s
  },
  beforeDestroy () {
    this.clear()
  },
  unmounted() {
    clearInterval(this.timerId); // 清除定时器
  },
  created() {
    this.list()
    },
  methods: {
    echoFunction() {
      // 你的回显函数逻辑 每10s调用一次 即10检测一次
      request.get("/api/getRecordsInfo").then(res => {
        res.data.forEach(item => {
          // alert(item.returnTime)
          if (item.returnTime!=null){ //即如果还书了走这套逻辑
            // 假设item.borrowTime和item.returnTime是有效的ISO 8601格式字符串
            let borrowTime = new Date(item.borrowTime); // 将字符串转换为Date对象
            let returnTime = new Date(item.returnTime); // 将字符串转换为Date对象
            // 检查日期是否有效
            if (isNaN(borrowTime.getTime()) || isNaN(returnTime.getTime())) {
              console.error('Invalid date string');
              return;
            }
            // 计算时间差（毫秒）
            let timeDiffInMilliseconds = borrowTime - returnTime;
            // 转换为秒
            let timeDiffInSeconds = Math.abs(timeDiffInMilliseconds / 2000); // 使用Math.abs来确保得到正数，如果returnTime在borrowTime之后
            // 显示结果（这里使用console.log而不是alert，因为alert会阻塞UI）
            // alert(`时间差（秒）：${timeDiffInSeconds}`);
            // 如果你需要在页面上显示这个值，可以将其设置为某个DOM元素的textContent或innerHTML
            // 例如：document.getElementById('timeDifference').textContent = timeDiffInSeconds;
            if(timeDiffInSeconds>6&&item.returnState===0){ //即如果归还了就不再继续计费
              // alert("超时") 时间如果大于30s就算超时
              //如果超时则通过item，records修改超时状态为1
              // alert("item.recordId"+item.recordId);
              request.put("/api/isTimeOut" ,null,{params:{recordId:item.recordId}}).then(res => {
                this.$message({
                  type:"info", message: "检测超时中"
                })
                request.put("/api/PenaltyAdd" ,null,{params:{recordId:item.recordId}}).then(res=>{
                  this.$message({
                    type:"success", message: "罚时计费更新"
                  })
                })
              })
              this.list()
            }

          }else{
            //未还书走这套逻辑
            // alert("书未还")
            // 将借书时间字符串转换为Date对象
            let borrowTime = new Date(item.borrowTime);
            // 获取当前时间的Date对象
            let currentTime = new Date();
            // 检查日期是否有效
            if (isNaN(borrowTime.getTime()) || isNaN(currentTime.getTime())) {
              console.error('Invalid date string');
              return null;
            }
            // 计算时间差（毫秒）
            let timeDiffInMilliseconds = currentTime - borrowTime;
            // 转换为秒
            let timeDiffInSeconds_0 = Math.abs(timeDiffInMilliseconds / 1000);
            // alert("currentTime"+ currentTime);
            // alert(`时间差（秒）：${timeDiffInSeconds}`);
            if(timeDiffInSeconds_0>6&&item.returnState===0){ //即如果归还了就不再继续计费
              // alert("超时") 时间如果大于30s就算超时
              //如果超时则通过item，records修改超时状态为1
              // alert("item.recordId"+item.recordId);
              request.put("/api/isTimeOut" ,null,{params:{recordId:item.recordId}}).then(res => {
                this.$message({
                  type:"info", message: "检测超时中"
                })
                request.put("/api/PenaltyAdd" ,null,{params:{recordId:item.recordId}}).then(res=>{
                  this.$message({
                    type:"success", message: "罚时计费更新"
                  })
                })
              })
              this.list()
            }

          }

        });

      }).catch(error => {
        // 处理请求错误
        console.error('Request failed:', error);
      });
    },
    //获取当前时间
    timeNow(timeStamp) {
      let year = new Date(timeStamp).getFullYear();
      let month =new Date(timeStamp).getMonth() + 1 < 10? "0" + (new Date(timeStamp).getMonth() + 1): new Date(timeStamp).getMonth() + 1;
      let date =new Date(timeStamp).getDate() < 10? "0" + new Date(timeStamp).getDate(): new Date(timeStamp).getDate();
      let hh =new Date(timeStamp).getHours() < 10? "0" + new Date(timeStamp).getHours(): new Date(timeStamp).getHours();
      let mm =new Date(timeStamp).getMinutes() < 10? "0" + new Date(timeStamp).getMinutes(): new Date(timeStamp).getMinutes();
      let ss =new Date(timeStamp).getSeconds() < 10? "0" + new Date(timeStamp).getSeconds(): new Date(timeStamp).getSeconds();
      this.nowTime = year + "年" + month + "月" + date +"日  "+"星期"+'日一二三四五六'.charAt(new Date().getDay())+" "+hh+":"+mm+':'+ss ;
    },
    // 实时刷新当前时间，格式化
    nowTimes(){
      this.timeNow(new Date());
      setInterval(this.nowTimes,1000);
      this.clear()
    },
    //清除定时器
    clear(){
      clearInterval(this.nowTimes)
      this.nowTimes = null;
    },
    // 将字符串转换为Date对象
// 注意：JavaScript的Date对象不直接支持ISO 8601格式的日期字符串，所以我们需要手动解析
parseISO8601(str) {
  var parts = str.split('T'),
      dateParts = parts[0].split('-'),
      timeParts = parts[1].split(':'),
      timePartsLen = timeParts.length;
  if (timePartsLen === 2) {
    timeParts.push('00'); // 添加秒（如果未提供）
  }
  return new Date(Date.UTC(
      parseInt(dateParts[0], 10),
      parseInt(dateParts[1], 10) - 1, // 注意：月份是从0开始的
      parseInt(dateParts[2], 10),
      parseInt(timeParts[0], 10),
      parseInt(timeParts[1], 10),
      parseInt(timeParts[2], 10)
  ));
},
save(){
          // alert(this.form.penalty)
          // alert(this.recordId)
      request.put("/api/changePenalty", null,{params:{penalty:this.form.penalty,recordId:this.recordId}}).then(res=>{
        this.$message({
          type: "success", message: "修改罚金成功"
        })
      })
      this.dialogVisible=false //弹窗关闭
      this.list() // 刷新列表
      this.list() // 刷新列表
      this.list() // 刷新列表

    },
    show1(row){
        this.dialogVisible = true;
        // alert(row.recordId)
      this.recordId=row.recordId;
    },
    list(){
      request.get("/api/getRecordsInfo").then(res => {
        console.log("================================1")
        console.log(res.data)

        // 创建一个新的数组来存储修改后的数据项
        let updatedData = res.data.map(item => {
          // 为每个项目创建一个 Promise 数组
          return Promise.all([
            request.get("/api/getName", { params: { id: item.id } }),
            request.get("/api/getBookName", { params: { isbn: item.isbn } })
          ]).then(([res1, res2]) => {
            // 当两个请求都完成时，更新项目并返回它
            item.name = res1.msg;
            item.bookname = res2.msg;
            if(item.returnState===0){
              item.returnState_C="未归还"
            }else if(item.returnState===1){
              item.returnState_C="已归还"
            }
            if(item.returnTime===null){
              item.returnTime="null"
            }
            if(item.isTimeOut===0){
              item.isTimeOut="未超时"
            }else if(item.isTimeOut===1){
              item.isTimeOut="超时"
            }
            return item; // 返回更新后的项目
          });
        });

        // 使用 Promise.all 等待所有项目都被更新
        Promise.all(updatedData).then(updatedItems => {
          // 当所有项目都被更新后，设置 tableData
          this.tableData = updatedItems;
          console.log("================================2")
          console.log(this.tableData) // 这将显示更新后的数据
        }).catch(error => {
          console.error("Error fetching data:", error);
        });

      }).catch(error => {
        console.error("Error fetching records info:", error);
      });

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
      console.log("返回主页点击")
      this.$router.push({path:'/adminBookManagement',query: { userId:this.userId}});
    }
  }
}
</script>
<style>
.time{
  width: 450px;
  font-size: 16px;
  color: white;
  float: right;
  margin: 30px 70px;
}
</style>
