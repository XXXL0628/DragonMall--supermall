<template>
  <div class="cart">
    <!-- 导航 -->
    <nav-bar class="nav-bar">
      <div slot="center">购物车({{ checkedLength }})</div>
    </nav-bar>

    <!-- 商品列表 -->
    <scroll class="content" ref="scroll">
      <cart-list> </cart-list>
    </scroll>

    <!-- 底部汇总 -->
    <cart-bottom></cart-bottom>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar";
import CartList from "./childComps/CartList";
import CartBottom from "./childComps/CartBottom";

import Scroll from "components/common/scroll/Scroll";

import { mapGetters } from "vuex";
export default {
  name: "Cart",
  components: {
    NavBar,
    CartList,
    CartBottom,
    Scroll,
  },
  computed: {
    //两种写法，使用数组就是直接使用getters中的名字
    ...mapGetters(['cartList']),

    //使用对象就是自己起别名
    // ...mapGetters({
    //   length: "cartLength",
    // }),
    checkedLength(){
      return this.cartList.filter(item=>item.checked).reduce((preValue,item)=>preValue+item.count,0)
    }
  },
  // created(){
  //   console.log('----');
  // },
  activated() {
    this.$refs.scroll.refresh();
  },
};
</script>

<style scoped>
.cart {
  height: 100vh;
}
.nav-bar {
  background-color: var(--color-tint);
  color: #fff;
}
.content {
  height: calc(100% - 44px - 49px - 40px);
  overflow: hidden;
}
</style>
