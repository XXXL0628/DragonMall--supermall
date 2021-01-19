<template>
  <!-- ref /children  如果ref绑定的是组件/(元素)对象，那么$this.refs.refname拿到的就是组件/(元素)对象-->
  <div class="wrapper" ref="wrapper">
    <div class="content">
      <slot></slot>
    </div>
  </div>
</template>

<script>
import BScroll from "better-scroll";
export default {
  name: "Scroll",
  props: {
    probeType: {
      type: Number,
      default: 0,
    },
    pullUpLoad: {
      type: Boolean,
      default: true,
    },
  },
  data() {
    return {
      scroll: null,
    };
  },
  mounted() {
    //1、创建BScroll对象
    this.scroll = new BScroll(this.$refs.wrapper, {
      mouseWheel: true,
      click: true,
      probeType: this.probeType,
      pullUpLoad: this.pullUpLoad,
    });
    //2、监听滚动的位置
    this.scroll.on("scroll", (position) => {
      this.$emit("scroll", position);
    });
    //3、上拉加载更多
    this.scroll.on("pullingUp", () => {
      this.$emit("pullingUp");
    });
  },
  methods: {
    //回到顶部
    scrollTo(x, y, time = 500) {
      this.scroll && this.scroll.scrollTo(x, y, time);
    },
    //加载更多
    finishPullUp() {
      this.scroll && this.scroll.finishPullUp();
    },
    refresh() {
      this.scroll && this.scroll.refresh();
    },
    getScrollY(){
      return this.scroll ? this.scroll.y : 0
    }
  },
};
</script>

<style scoped>
</style>
