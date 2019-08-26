<template>
  <div class="cartcontrol">
    <transition name="move">
      <div class="cart-reduce" @click.stop="reduceCart($event)" v-show="food.count>0">
         <span class="inner icon-remove_circle_outline"></span>
      </div>
    </transition>
    <div class="cart-count" v-show="food.count>0">{{food.count}}</div>
    <div class="cart-add icon-add_circle" @click.stop="addCart($event)"></div>
  </div>
</template>
<script>
export default {
  props: {
    // 传入的是那个商品
    food: {
      type: Object
    }
  },
  methods: {
    addCart(event) {
      if (!event._constructed) {
        return;
      }
      if (!this.food.count) {
        this.$set(this.food, "count", 1);
      } else {
        this.food.count++;
      }
      //传递事件并带参到父组件 goods
      this.$emit("add",event.target)
    },
    reduceCart(event) {
      if (!event._constructed) {
        return;
      }
      if (this.food.count) {
        this.food.count--;
      }
    }
  }
};
</script>
<style lang="stylus" scoped>
.cartcontrol {
  font-size: 0;

  .cart-reduce {
    display: inline-block;
    padding: 12px;
    .inner{
      display: inline-block
      line-height: 48px
      font-size: 48px
      color: rgb(0, 160, 220)
      transition: all 0.4s linear
      transform: rotate(0)
    }
    &.move-enter-active, &.move-leave-active{
      transition: all 0.4s linear
    }
    &.move-enter, &.move-leave-to{
      opacity: 0
      transform: translate3d(48px, 0, 0)
      .inner{
        transform: rotate(180deg) 
      }
    }
  }
  .cart-count {
    display: inline-block;
    vertical-align: top;
    width: 24px;
    padding-top: 24px;
    line-height: 24px;
    font-size: 20px;
    text-align: center;
    color: rgb(147, 153, 159);
  }

  .cart-add {
    display: inline-block;
    line-height: 48px;
    font-size: 48px;
    padding: 12px;
    padding-right 30px
    color: rgb(0, 160, 220);
  }
}
</style>