import {debounce} from "./utils"
import BackTop from "components/content/backtop/BackTop";


export const itemListenerMixin ={
  data(){
    return {
      itemImgListener:null
    }
  },
  mounted(){
    //图片加载完成之后的刷新(防抖函数)
    const refresh = debounce(this.$refs.scroll.refresh, 50);
    //3、监听图片加载事件
    this.itemImgListener =() => {
      refresh();
    }
    this.$bus.$on("imgItemLoad", this.itemImgListener);
  }
}

export const backTopMixin = {
  components:{
    BackTop
  },
  data(){
    return {
      isShowBackTop: false,
    }
  },
  methods:{
    backClick() {
      // scrollTo方法，将滚动区域滚动到想要的位置，第三个参数是滚动时间(在多少毫秒内滚动完成)
      // 父访问子中的方法(利用refs取到子组件，再调用里面的方法)
      this.$refs.scroll.scrollTo(0, 0, 500);
    },
    listenShowBackTop(position){
      this.isShowBackTop = (-position.y) > 1000;
    }
  }
}
