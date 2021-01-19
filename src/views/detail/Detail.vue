<template>
  <div class="detail">
    <detail-nav-bar
      class="detail-nav-bar"
      @titleClick="titleClick"
      ref="nav"
    ></detail-nav-bar>
    <scroll class="content" ref="scroll" :probe-type="3" @scroll="contentScroll">
      <detail-swiper :top-images="topImages"></detail-swiper>
      <detail-base-info :goods="goods"></detail-base-info>
      <detail-shop-info :shop="shop"></detail-shop-info>
      <detail-goods-info
        :detail-info="detailInfo"
        @imageLoad="imageLoad"
      ></detail-goods-info>
      <detail-param-info
        :param-info="paramInfo"
        ref="param"
      ></detail-param-info>
      <detail-comment-info
        :comment-info="commentInfo"
        ref="comment"
      ></detail-comment-info>
      <goods-list :goods="GoodsList" ref="goodslist"></goods-list>

    </scroll>
    <detail-bottom-bar @addToCart="addToCart"></detail-bottom-bar>
    <back-top @click.native="backClick" v-show="isShowBackTop"></back-top>
  </div>
</template>

<script>
import DetailNavBar from "./childComps/DetailNavBar";
import DetailSwiper from "./childComps/DetailSwiper";
import DetailBaseInfo from "./childComps/DetailBaseInfo";
import DetailShopInfo from "./childComps/DetailShopInfo";
import DetailGoodsInfo from "./childComps/DetailGoodsInfo";
import DetailParamInfo from "./childComps/DetailParamInfo";
import DetailCommentInfo from "./childComps/DetailCommentInfo";
import GoodsList from "components/content/goods/GoodsList";
import DetailBottomBar from "./childComps/DetailBottomBar"

import Scroll from "components/common/scroll/Scroll";

import {
  getDetail,
  getRecommend,
  GoodsInfo,
  Shop,
  GoodsParam,
} from "network/detail";

import { itemListenerMixin,backTopMixin } from "common/mixin";
import { debounce } from "common/utils";

import {mapActions} from 'vuex'

export default {
  name: "Detail",
  data() {
    return {
      iid: null,
      topImages: [],
      goods: {},
      shop: {},
      detailInfo: {},
      paramInfo: {},
      commentInfo: {},
      GoodsList: [],
      themeTopYs: [],
      getThemeTopYs: null,
      currentIndex:0

    };
  },
  mixins: [itemListenerMixin,backTopMixin],
  components: {
    DetailNavBar,
    DetailSwiper,
    DetailBaseInfo,
    DetailShopInfo,
    DetailGoodsInfo,
    DetailParamInfo,
    DetailCommentInfo,
    GoodsList,
    DetailBottomBar,
    Scroll,
  },
  created() {
    // console.log(this.$route.params.iid);
    // 1、保存传入的iid
    // this.iid = this.$route.params.iid;
    this.iid = this.$route.query.iid;
    //2、根据iid请求详情数据
    getDetail(this.iid).then((res) => {
      console.log(res);
      const data = res.result;
      //1、保存轮播图图片
      this.topImages = data.itemInfo.topImages;

      //2、获取商品信息
      this.goods = new GoodsInfo(
        data.itemInfo,
        data.columns,
        data.shopInfo.services
      );

      //3、获取商家信息
      this.shop = new Shop(data.shopInfo);

      //4、获取商品详情数据
      this.detailInfo = data.detailInfo;

      //5、获取参数数据
      this.paramInfo = new GoodsParam(
        data.itemParams.info,
        data.itemParams.rule
      );

      //6、获取评论信息
      if (data.rate.cRate !== 0) {
        this.commentInfo = data.rate.list[0];
      }

      //nextTick是指下一帧
      // this.$nextTick(() => {
      //   //在请求完数据时，会进行一次nextTick的回调，但是这个时候不代表图片渲染完成
      //   //根据最新的数据，对应的DOM时已经被渲染出来
      //   //但是图片依然是没有加载完(目前获取到的offsetTop不包含其中的图片)
      //   //offsetTop值不对，都是图片的问题
      //   this.themeTopYs.push(0);
      //   this.themeTopYs.push(this.$refs.param.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      //   this.themeTopYs.push(this.$refs.goodslist.$el.offsetTop);
      //   console.log(this.themeTopYs);
      // });
    });

    //3、请求推荐数据
    getRecommend().then((res) => {
      // console.log(res);
      this.GoodsList = res.data.list;
    });

    //4、获取各个组件的offsetTop值(对this.themeTopYs赋值操作的防抖)
    this.getThemeTopYs = debounce(() => {
      this.themeTopYs.push(0);
      this.themeTopYs.push(this.$refs.param.$el.offsetTop);
      this.themeTopYs.push(this.$refs.comment.$el.offsetTop);
      this.themeTopYs.push(this.$refs.goodslist.$el.offsetTop);
      //JS中的最大值--Number.MAX_VALUE
      this.themeTopYs.push(Number.MAX_VALUE)
      // console.log(this.themeTopYs);
    },100);
  },
  methods: {
    ...mapActions(['addCart']),
    imageLoad() {
      this.$refs.scroll.refresh();
      this.getThemeTopYs();
    },
    titleClick(index) {
      this.$refs.scroll.scrollTo(0, -this.themeTopYs[index], 500);
    },
    contentScroll(position){
      //1、获取y值
      const positionY = -position.y;
      //2、与themeTopYs中的值作比较
      let length = this.themeTopYs.length;
      // for(let i = 0;i<length;i++){
      //   //第一种做法(普通做法)通过添加判断语句进行判断
      //   if(this.currentIndex!==i && ((i<length-1&& positionY>=this.themeTopYs[i]&&positionY<this.themeTopYs[i+1]) || (i===length-1 && positionY>=this.themeTopYs[i]))){
      //     this.currentIndex = i
      //     this.$refs.nav.currentIndex = this.currentIndex
      //   }
      // }
      for(let i = 0;i<length-1;i++){
        //第二种做法，通过在最后添加一个最大值，进行相同的判断，但是最后要少进行一次遍历，避免遍历时数组越界
        if(this.currentIndex!==i && (positionY>=this.themeTopYs[i]&&positionY<this.themeTopYs[i+1])){
          this.currentIndex = i
          this.$refs.nav.currentIndex = this.currentIndex
        }
      }
      //判断回到顶部backTop是否显示
      this.listenShowBackTop(position)
    },
    addToCart(){
      //1、获取购物车需要展示的信息
      const product = {}
      product.image = this.topImages[0]
      product.title = this.goods.title
      product.desc = this.goods.desc
      product.price = this.goods.realPrice
      product.iid = this.iid

      //2、将商品添加到购物车
      //可使用mapActions方法调用action中的方法
      this.addCart(product).then(res=>{
        this.$toast.show(res,2000)
      })
      // this.$store.dispatch('addCart',product)
    }
  },
  destroyed() {
    this.$bus.$off("imgItemLoad", this.itemImgListener);
  },
};
</script>

<style scoped>
.detail {
  position: relative;
  z-index: 9;
  background-color: #fff;
  height: 100vh;
}
.detail-nav-bar {
  position: relative;
  z-index: 9;
  background-color: #fff;
}
.content {
  height: calc(100% - 44px - 58px);
}
</style>
