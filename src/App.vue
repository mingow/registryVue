<template>
  <div id="app">
    <div class="header">
        <Logo @click="download" class="logo"></Logo>
        <el-button type="danger" icon="el-icon-download" round>下载Docker</el-button>
        <div class="content">
          <p class="intro">
            这是一个Docker仓库，用来保存内网使用的Docker镜像文件。
          </p>
          <el-input v-model="input" placeholder="请输入需要下载的docker镜像名"></el-input>
        </div>
    </div>
    <div class="list">
      <Card @click="more" class="card" :key="i" :title="k" v-for="(k,i) in repositories"></Card>
    </div>
    <el-pagination background :page-size="n" @current-change="paging"
      layout="prev, pager, next"
      :total="totalcount">
    </el-pagination>
    <div class="footer">技术支持：通讯工程</div>
    <More :param="param" @close="param = ''"></More>
  </div>
</template>

<script>

import Logo from './components/logo'
import Card from './components/card'
import More from './components/dialog'
import axois from 'axios'
import UA from 'ua-device'
export default {
  name: 'app',
  components: {
    Logo,Card,More
  },
  data:()=>{
    return ({
      input:'',
      repositories:[],
      currentPage:-1,
      totalcount:0,
      n:15,
      rawData:[],
      ua:null,
      param:'',
    })
  },
  watch:{
    currentPage:function(val){
      const self = this
      self.repositories = []
      val = val - 1;
      for(let i = val*self.n;i<self.n*(val+1);i++){
        if(self.rawData[i]){
          self.repositories.push(self.rawData[i])
        }
      }
    }
  },
  methods:{
    paging:function(current){
      this.currentPage = current
    },
    download:function(){
      const ua = this.ua;
      if(ua.os){
        let param = `${ua.os.name}-${ua.os.version.original}`;
        console.log(param);
      }
    },
    more:function(val){
      this.param = val
      // let data = {}
      // axois.get(`/v2/${val}/tags/list`).then(res=>{
      //   data.name = res.data.name;
      //   data.tags = res.data.tags
      //   res.data.tags.map((i,index)=>{   
      //     let tag = {
      //       tag:i
      //     }      
      //     axois.get(`/v2/${val}/manifests/${i}`).then(res=>{
      //       tag.architecture = res.data.architecture
      //       tag.more =JSON.parse(res.data.history[0].v1Compatibility)
      //     })
      //     data.tags[index]=tag
      //   })
      //   console.log(data);
      // })
    }
  },
  mounted:function(){
    const self = this;
    //get totalcount
    axois.get('/v2/_catalog').then(res=>{
      if(res.status == 200){
        self.totalcount = res.data.repositories.length
        self.rawData = res.data.repositories
        self.currentPage = 1
      }
    })
    const ua = UA(navigator.userAgent)
    self.ua = ua
  }
}
</script>

<style>
body{
  margin:0;
  padding:0;
  background-color: #f4f4f5;
}
#app {
  font-family: 'Avenir', Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  
}
.header{
  width:100%;
  padding:50px 0 16px;
  width:100%;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items:center;
  background-image:url('./assets/homepage-banner-bg.svg');
  background-size: cover;
  background-repeat: no-repeat;
  min-height: 150px;
}
.logo{
  width:10%;
  fill:#fff;
  margin:24px;
  min-width: 200px;
}
.micro{
  margin:0;
  font-size: 14px;
  color:#17496f;
}
.content{
  width:30%;
  min-width: 450px;
}
.intro{
  color:#fff;
}
.input{
  height:50px;
}
.list{
  min-width:450px;
  display: flex;
  flex-direction: row;
  align-items:center;
  justify-content:center;
  flex-wrap:wrap;
}

.footer{
  font-size: 12px;
  color: #2c3e50;
  margin:16px 0;
}
.c-body{
  display: flex;
  justify-content: space-between;
}
.card{
  width:33%;
  min-width: 450px;
}
</style>
