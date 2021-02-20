<template>
  <el-dialog custom-class="dialog" :title="`详情${param}`" :visible.sync="show" @close="clear">
    <el-collapse class="collapse" v-loading="loading" v-model="activeName" accordion>
      <el-collapse-item :key="i" v-for="(n,i) in clips" :title="`版本:${n.tag}`" :name="i">
        <template slot="title">
          {{`版本:${n.tag}`}}
          <!-- <i class="header-icon el-icon-info" :style="{display:i==0?'inline-block':'none'}"></i> -->
        </template>
        <div class="inner">
          <div class="header-flex">
            <div class="left-flex">
              <div>平台:{{n.architecture}}</div>
              <div>作者:{{n.more.author?n.more.author:'none'}}</div>
              <div>大小:{{n.size}}</div>
              <div>操作系统:{{n.more.os}}</div>
              <div class="port">端口:
                <el-tag v-for="(item,key) in n.more.container_config.ExposedPorts" :key="key" size="small" effect="dark">{{ key }}</el-tag>
              </div>
              <div class="port">Entry:
                <el-tag v-for="(item,key) in n.more.container_config.Entrypoint" :key="key" size="small" effect="dark">{{ item }}</el-tag>
              </div>
            </div>
            <div class="right-flex">
              <p>获取镜像：遇到问题？</p>
              <div><el-tag type="info">{{`docker pull 172.18.100.52:5000/${param}:${n.tag}`}}</el-tag><el-button class="smallBtn" @click="clip(param,n.tag)" size="small" type="primary" icon="el-icon-document-copy"></el-button></div>
            </div>
          </div>
          <div>创建时间:{{new Date(n.more.created)}}</div>
          <div>DIGEST:{{n.more.container_config.Image}}</div>
          <div>环境变量:
            <div class="env">
              <el-tag class="cols" v-for="(item,key) in n.more.container_config.Env" :key="key" type="info" size="small" effect="dark">{{ item }}</el-tag>
            </div>
          </div>
          <div>卷:
            <div class="env">
              <el-tag class="cols" v-for="(item,key) in n.more.container_config.Volumes" :key="key" type="warning" size="small" effect="dark">{{ key }}</el-tag>
            </div>
          </div>
        </div>  
      </el-collapse-item>
    </el-collapse>
  </el-dialog>
</template>
<script>
import axois from 'axios'
export default {
  name:'more',
  props:{
    param:String
  },
  data:()=>{
    return ({
      show:false,
      loading:true,
      clips:[],
      activeName: 0,
    })
  },
  watch:{
    param:async function(val){
      if(!val){return val;}
      let data = {}
      const self = this;
      self.loading = true;
      self.clips = [];
      await axois.get(`/v2/${val}/tags/list`).then(res=>{
        data.name = res.data.name;
        data.tags = res.data.tags
        self.show = true;
        res.data.tags.map((i,index)=>{   
          let tag = {
            tag:i
          }
          axois.get(`/v2/${val}/manifests/${i}?dc=${new Date().getTime()}`,{
            headers:{
              Accept:'*/*'
            }
          }).then(res=>{
            console.log(res);
            tag.architecture = res.data.architecture
            tag.more =JSON.parse(res.data.history[0].v1Compatibility)
          }).then(()=>{
            axois.get(`/v2/${val}/manifests/${i}?dc=${new Date().getTime()}`,{
              headers:{
                Accept:'application/vnd.docker.distribution.manifest.v2+json'
              }
            }).then(res=>{
              tag.layers=res.data.layers
              let sum = self.sumSize(tag.layers);
              sum = self.calcSize(sum);
              tag.size = sum;
              self.clips.push(tag)
            }).catch(self.handleErr)
          }).catch(self.handleErr)
          data.tags[index]=tag
        })
        console.log(data);
      }).catch(self.handleErr)
      self.loading = false;
    }
  },methods:{
    handleErr:function(){
      this.show =false;
      console.error('get Info error');
      this.$message.error('获取数据错误');
    },
    clear:function(){
      this.$emit('close')
    },
    sumSize:function(layers){
      let sum = 0
      layers.map((i)=>{
        sum += i.size
      })
      return sum
    },
    calcSize:function(current){
      if(typeof current == 'number'){current = `${current} B`}
      const unit = ['B','KB','MB','GB','TB']
      const regex = /(\d+)\s(\w+)/
      let res = current.match(regex);
      if(res&&res.length){
        let num = Number(res[1]);
        let currentUnit = res[2];
        while (num/1024>1&&unit.indexOf(currentUnit)+1<unit.length) {
          num = num / 1024
          currentUnit = unit[unit.indexOf(currentUnit)+1]
        }
        current = `${num.toFixed(2)} ${currentUnit}`
      }
      return current;
    },
    clip:function(param,tag){
      let res = `docker pull 172.18.100.52:5000/${param}:${tag}`;
      this.$copyText(res).then(()=>{
        this.$message('已复制到剪切板');
      },()=>{
        this.$message.error('无法复制到剪切板');
      })
      console.log(res);
    }
  }
}
</script>
<style>
  .dialog{
    height:650px;
    overflow-y: auto;
    min-width: 660px;
  }
  .inner{
    text-align: left;
    margin: 0 12px;
  }
  .left-flex div{
    margin: 6px 0;
  }
  .port span{
    margin:0 2px;
  }
  .env{
    display: flex;
    flex-direction: row;
    flex-wrap:wrap;
  }
  .cols{
    display: block;
    margin: 2px;
  }
  .collapse{
    height: 100%;
  }
  .float{
    position:absolute;
    right: 24px;
    display: flex;
    flex-direction: column;
  }
  .shell{
    display: flex;
    flex-direction: row-reverse;
    margin: 10px 0;
  }
  .smallBtn{
    margin: 6px!important
  }
  .right-flex{
    display:flex;
    flex-direction: column;
    text-align: right;
  }
  .right-flex p{
    margin:6px 0;
  }
  .header-flex{
    display: flex;
    flex-wrap:wrap;
    justify-content: space-between;
  }
</style>