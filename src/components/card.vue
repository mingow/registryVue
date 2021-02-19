<template>
  <div>
    <el-card class="box-card" >
      <div class="c-body">
        {{ title }}
        <!-- <el-button @click="more" icon="el-icon-info" circle></el-button> -->
        <i @click="more" class="el-icon-info big"></i>
      </div>
    </el-card>
  </div>
</template>
<script>
export default {
  name:'card',
  props: {
    title: String
  },
  methods:{
    more:function(){
      const self = this;
      this.$emit('click',self.title)
    }
  }
}
</script>
<style scoped>
  .box-card{
    margin:16px;
  }
  .big{
    font-size: 36px;
    cursor: pointer;
  }
</style>