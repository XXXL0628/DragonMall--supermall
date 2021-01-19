<template>
  <div class="recommond">
    <div v-for="(item,index) in recommonds" :key="index" class="recommond-item">
      <a :href="item.link">
        <img :src="item.image" alt="">
        <div>{{item.title}}</div>
      </a>
    </div>
  </div>
</template>

<script>
  export default {
    name: 'RecommondView',
    props:{
      recommonds:{
        type:Array,
        default(){
          return []
        }
      }
    }
  }
</script>

<style scoped>
.recommond{
  display: flex;
  width: 100%;
  text-align: center;
  font-size: 12px;
  padding: 15px 0 30px;
  border-bottom: 10px solid #eee;
}
.recommond-item{
  flex: 1;
}
.recommond-item img{
  width: 70px;
  height: 70px;
  margin-bottom: 10px;
}
</style>
