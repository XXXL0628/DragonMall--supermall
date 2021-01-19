<template>
  <div>
    <nav-bar>
      <div slot="left" @click="back">
        <img src="~assets/img/common/back.svg" alt="" class="back">
      </div>
      <div slot="center" class="title">
        <div
          v-for="(item, index) in titles"
          :key="index"
          class="title-item"
          :class="{ active: index === currentIndex }"
          @click="colorClick(index)"
        >
          {{ item }}
        </div>
      </div>
    </nav-bar>
  </div>
</template>

<script>
import NavBar from "components/common/navbar/NavBar.vue";
export default {
  name: "DetailNavBar",
  data() {
    return {
      titles: ["商品", "参数", "评论", "推荐"],
      currentIndex: 0,
    };
  },
  components: {
    NavBar,
  },
  methods:{
    colorClick(index){
      this.currentIndex = index
      this.$emit('titleClick',index)
    },
    back(){
      this.$router.back()
    }
  }
};
</script>

<style scoped>

.title {
  display: flex;
  font-size: 13px;
}
.title-item {
  flex: 1;
}
.active {
  color: var(--color-high-text);
}
.back{
  margin-top: 10px;
}
</style>
