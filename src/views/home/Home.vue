<template>
  <div id="home">
    <nav-bar class="home-nav"><div slot="center">购物街</div></nav-bar>
    <tab-control
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl1"
        v-show="isTabFixed"
        class="tab-control"
      ></tab-control>
    <scroll
      class="content"
      ref="scroll"
      :probe-type="3"
      @scroll="contentScroll"
      :pull-up-load="true"
      @pullingUp="loadMore"
    >
      <home-swiper
        :banners="banners"
        @swiperImageLoad="swiperImageLoad"
      ></home-swiper>
      <recommond-view :recommonds="recommends"></recommond-view>
      <feature-view></feature-view>
      <tab-control
        :titles="['流行', '新款', '精选']"
        @tabClick="tabClick"
        ref="tabControl2"
      ></tab-control>
      <goods-list :goods="showGoods"></goods-list>
    </scroll>
    <!-- 我们需要监听一个原生组件的事件时，必须加上.native修饰符才能监听得到-->
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
// 子组件
import HomeSwiper from "./childComps/HomeSwiper";
import RecommondView from "./childComps/RecommondView";
import FeatureView from "./childComps/FeatureView";

//公共组件
import NavBar from "components/common/navbar/NavBar";
import Scroll from "components/common/scroll/Scroll";

//业务相关组件
import TabControl from "components/content/tabControl/TabControl";
import GoodsList from "components/content/goods/GoodsList";

//网络请求方法
import { getHomeMultidata, getHomeGoods } from "network/home";
//防抖函数
import { debounce } from "common/utils";
import {itemListenerMixin,backTopMixin} from "common/mixin"

export default {
  name: "Home",

  components: {
    HomeSwiper,
    RecommondView,
    FeatureView,
    NavBar,
    Scroll,
    TabControl,
    GoodsList,
  },
  data() {
    return {
      banners: [],
      recommends: [],
      goods: {
        pop: { page: 0, list: [] },
        new: { page: 0, list: [] },
        sell: { page: 0, list: [] },
      },
      currentType: "pop",

      tabOffsetTop: 0,
      isTabFixed :false,
      saveY: 0
    };
  },
  //混入函数
  mixins:[itemListenerMixin,backTopMixin],

  computed: {
    showGoods() {
      return this.goods[this.currentType].list;
    },
  },
  //在组件创建完成之后马上发送网络请求
  created() {
    // console.log(this);
    //1、请求多个数据
    this._getHomeMultidata();
    //2、请求商品数据
    this._getHomeGoods("pop");
    this._getHomeGoods("new");
    this._getHomeGoods("sell");
  },
  mounted() {
    // //图片加载完成之后的刷新(防抖函数)
    // const refresh = debounce(this.$refs.scroll.refresh, 50);
    // //3、监听图片加载事件
    // this.$bus.$on("imgItemLoad", () => {
    //   refresh();
    // });
  },
  activated(){
    this.$refs.scroll.scrollTo(0,this.saveY)
    this.$refs.scroll.refresh()
  },
  deactivated(){
    this.saveY = this.$refs.scroll.getScrollY()
    this.$bus.$off('imgItemLoad',this.itemImgListener)
  },
  methods: {
    /**
     * 事件监听相关方法
     */
    tabClick(index) {
      switch (index) {
        case 0:
          this.currentType = "pop";
          break;
        case 1:
          this.currentType = "new";
          break;
        case 2:
          this.currentType = "sell";
      }
      this.$refs.tabControl1.currentIndex = index;
      this.$refs.tabControl2.currentIndex = index;
    },

    contentScroll(position) {
      //判断回到顶部backTop是否显示
      this.listenShowBackTop(position)

      //判断TabControl是否吸顶(position:fixed)
      this.isTabFixed = (-position.y) >  this.tabOffsetTop
    },
    loadMore() {
      this._getHomeGoods(this.currentType);
      setTimeout(() => {
        this.$refs.scroll.finishPullUp();
      }, 2000);
    },
    swiperImageLoad() {
      //获取tabControl的offsetTop属性---为了确定什么时候更换tabControl
      //所有的组件都有一个属性:$el用于获取组件中的元素
      this.tabOffsetTop = this.$refs.tabControl2.$el.offsetTop
    },

    /**
     * 网络请求相关方法
     */
    _getHomeMultidata() {
      getHomeMultidata().then((res) => {
        // console.log(res);
        this.banners = res.data.banner.list;
        this.recommends = res.data.recommend.list;
      });
    },
    _getHomeGoods(type) {
      const page = this.goods[type].page + 1;
      getHomeGoods(type, page).then((res) => {
        this.goods[type].list.push(...res.data.list);
        this.goods[type].page += 1;
      });
    },
  },
};
</script>

<style scoped>
/* scoped代表作用域，以下style旨在当前页面作用 */
#home {
  /* vh(viewport-height)代表可视区域 */
  height: 100vh;
  position: relative;
}
.home-nav {
  background-color: var(--color-tint);
  color: #fff;

  /* 浏览器使用原生滚动时，为了让导航不跟随一起滚动 */
  /* position: fixed;
  top: 0;
  left: 0;
  right: 0;
  z-index: 9; */
}

.content {
  /* height: calc(100%-93px);  */
  position: absolute;
  top: 44px;
  left: 0;
  right: 0;
  bottom: 49px;
  overflow: hidden;
}
.tab-control{
  position: relative;
  z-index: 9;
}

</style>
