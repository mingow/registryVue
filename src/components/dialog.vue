<template>
  <el-dialog custom-class="dialog" :title="`详情${param}`" :visible.sync="show" @close="clear">
    <el-collapse class="collapse" v-loading="false" v-model="activeName" accordion>
      <el-collapse-item :key="i" v-for="(n,i) in clips" :title="`版本:${n.tag}`" :name="i">
        <div class="inner">
          <div class="header-flex">
            <div class="left-flex">
              <div>平台:{{n.architecture}}</div>
              <div>作者:{{n.more.author?n.more.author:'none'}}</div>
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
              <div><el-tag type="info">{{`docker pull 172.18.100.52:5000/${param}:${n.tag}`}}</el-tag><el-button class="smallBtn" size="small" type="primary" icon="el-icon-document-copy"></el-button></div>
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
    param:function(val){
      if(!val){return val;}
      let data = {}
      const self = this;
      self.loading = true;
      self.clips = [];
      axois.get(`/v2/${val}/tags/list`).then(res=>{
        data.name = res.data.name;
        data.tags = res.data.tags
        self.show = true;
        res.data.tags.map((i,index)=>{   
          let tag = {
            tag:i
          }
          axois.get(`/v2/${val}/manifests/${i}`).then(res=>{
            tag.architecture = res.data.architecture
            tag.more =JSON.parse(res.data.history[0].v1Compatibility)
            self.clips.push(tag)
            console.log(res);
          }).catch(self.handleErr)
          data.tags[index]=tag
        })
        
      }).catch(self.handleErr)
    }
  },methods:{
    handleErr:function(){
      this.show =false;
      console.error('get Info error');
    },
    clear:function(){
      this.$emit('close')
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