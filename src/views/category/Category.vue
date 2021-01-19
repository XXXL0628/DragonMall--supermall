<template>
  <div>
    <div class="wrapper">
      <!-- 无论click的值是否设置为true，button都可以点击 -->
      <button @click="btnClick">按钮</button>
      <!-- 只有click的值为true，div才能触发点击 -->
      <div @click="divClick">点击</div>
    </div>
  </div>
</template>

<script>
import BScroll from 'better-scroll'
  export default {
    name: 'Category',
    data(){
      return {
        scroll:null
      }
    },
    methods:{
      btnClick(){
        console.log('btnClick');
      },
      divClick(){
        console.log('divClick');
      }
    },
    // 在组建创建完之后调用BScroll调用不到，因为那个时候DOM还没有挂载上去
    created(){

    },
    //需要在mouted之后调用
    mounted(){
      //默认情况下BScroll是不可以实时的监听滚动位置
      this.scroll = new BScroll('.wrapper',{
        //监听实施滚动：0和1不能监听，2监听手指滚动区域，3监听所有滚动区域(包括惯性滚动的时间)
        probeType:3,
        //上拉加载更多
        pullUpLoad:true,
        //滚轮可使用
        mouseWheel:true,
        click:true
      })
      this.scroll.on('scroll',(position)=>{
        // console.log(position);
      })
      this.scroll.on('pullingUp',()=>{
        console.log('上拉加载更多');
        setTimeout(() => {
          this.scroll.finishPullUp()
        }, 2000);
      })
    }
  }
</script>

<style scoped>
.wrapper{
  height: 150px;
  background-color: #f00;
  overflow: hidden;
  /* 原生js滚动 */
  /* overflow-y: scroll; */
}
</style>
