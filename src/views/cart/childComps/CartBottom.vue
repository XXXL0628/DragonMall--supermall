<template>
  <div class="cart-bottom">
    <div class="check-content">
      <CheckButton class="check-botton" :value="isSelectAll" @click.native="checkBtnClick"></CheckButton>
      <span>全选</span>
    </div>

    <div class="price">
      合计:{{totalPrice}}
    </div>

    <div class="calculate" @click="calClick">
      去支付({{checkedLength}})
    </div>
  </div>
</template>

<script>
import CheckButton from "./CheckButton";

import {mapGetters} from 'vuex'
export default {
  name: "CartBottom",
  components: {
    CheckButton,
  },
  computed:{
    ...mapGetters(['cartList']),
    totalPrice(){
      return '￥' + this.cartList.filter(item=>{
        return item.checked
      }).reduce((preValue,item)=>{
        return preValue + item.price * item.count
      },0).toFixed(2)
    },
    checkedLength(){
      return this.cartList.filter(item=>item.checked).reduce((preValue,item)=>preValue+item.count,0)
    },
    isSelectAll(){
      if(this.cartList.length===0) return false
      return !this.cartList.find(item=> !item.checked)
    }
  },
  methods:{
    checkBtnClick(){
      if(this.isSelectAll){ //全部选中
        this.cartList.forEach(item => item.checked = false);
      }else{ //全部不选中或部分不选中
        this.cartList.forEach(item => item.checked = true);
      }
    },
    calClick(){
      if(!this.checkedLength){
        this.$toast.show('请选择相应商品',1500)
      }
    }
  }
};
</script>

<style scoped>
.cart-bottom {
  height: 40px;
  line-height: 40px;
  background-color: #eee;
  position: relative;
  display: flex;
  font-size: 14px;
}
.check-content {
  display: flex;
  align-items: center;
  margin-left: 10px;
  width: 80px;
}

.check-botton {
  width: 20px;
  height: 20px;
  line-height: 20px;
  margin-right: 5px;
}
.price{
  flex: 1;
}
.calculate{
  width: 90px;
  text-align: center;
  background-color: var(--color-tint);
  color: #fff;
}
</style>
