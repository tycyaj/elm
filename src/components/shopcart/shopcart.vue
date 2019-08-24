<template>
  <div class="shopcart">
    <div class="content">
      <div class="content-left">
        <div class="logo-warpper">
          <div class="logo" :class="{'highliight':totalCount>0}">
            <i class="icon-shopping_cart" :class="{'highliight':totalCount>0}"></i>
          </div>
          <div class="num" v-show="totalCount>0">{{totalCount}}</div>
        </div>
        <div class="price" :class="{'highliight':totalPrice>0}">￥{{totalPrice}}元</div>
        <div class="desc">另需配送费 ￥{{deliveryPrice}}元</div>
      </div>
      <div class="content-right">
        <div class="pay" :class="payClass">{{payDesc}}</div>
      </div>
      <transition name="drop" @before-enter="beforeDrop" @enter="dropping" @after-enter="afterDrop">
        <div class="ball-container">
          <div class="ball" v-for="(ball, index) in balls" v-show="ball.show" :key="index">
            <div class="inner"></div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>
<script>
export default {
  data() {
    return {
      balls: [
        { show: false },
        { show: false },
        { show: false },
        { show: false },
        { show: false }
      ],
      dropBalls: []
    };
  },
  props: {
    selectFoods: {
      type: Array,
      default() {
        return [
          {
            price: 10,
            count: 2
          }
        ];
      }
    },
    //配送费
    deliveryPrice: {
      type: Number,
      default: 0
    },
    //最小起送费
    minPrice: {
      type: Number,
      default: 0
    }
  },
  methods: {
    drop(el) {
      //这里是通过父组件goods拿到cartcontrol组件传递的DOM元素
      // console.log(el);
      for (let i = 0; i < this.balls.length; i++) {
        let ball = this.balls[i];
        if (!ball.show) {
          ball.show = true;
          ball.el = el;
          this.dropBalls.push(ball);
          return;
        }
      }
    },
    beforeDrop(el) {
      console.log(el)
      // let count = this.balls.length;
      // while (count--) {
      //   let ball = this.balls[count];
      //   if (ball.show) {
      //     let rect = ball.el.getBoundingClientRect();
      //     let x = rect.left - 48;
      //     let y = -(window.innerHeight - rect.top - 22);
      //     el.style.display = "";
      //     el.style.webkitTransform = `translate3d(0,${y}px,0)`;
      //     el.style.transform = `translate3d(0,${y}px,0)`;
      //     let inner = el.getElementsByClassName("inner-hook")[0];
      //     inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
      //     inner.style.transform = `translate3d(${x}px,0,0)`;
      //   }
      // }
    },
    dropping(el, done) {
      /* eslint-disable no-unused-vars */
      // let rf = el.offsetHeight;
      // this.$nextTick(() => {
      //   el.style.webkitTransform = "translate3d(0,0,0)";
      //   el.style.transform = "translate3d(0,0,0)";
      //   let inner = el.getElementsByClassName("inner-hook")[0];
      //   inner.style.webkitTransform = "translate3d(0,0,0)";
      //   inner.style.transform = "translate3d(0,0,0)";
      //   el.addEventListener("transitionend", done);
      // });
    },
    afterDrop(el) {
      // let ball = this.dropBalls.shift();
      // if (ball) {
      //   ball.show = false;
      //   el.style.display = "none";
      // }
    }
  },
  computed: {
    totalPrice() {
      //总钱数
      let total = 0;
      this.selectFoods.forEach(food => {
        total += food.price * food.count;
      });
      return total;
    },
    totalCount() {
      //总数量
      let count = 0;
      this.selectFoods.forEach(food => {
        count += food.count;
      });
      return count;
    },
    payDesc() {
      // 计算是否有配送费
      if (this.totalPrice === 0) {
        return `￥${this.minPrice}元起送`;
      } else if (this.totalPrice < this.minPrice) {
        let diff = this.minPrice - this.totalPrice;
        return `还差￥${diff}元起送`;
      }
      return "去结算";
    },
    payClass() {
      if (this.totalPrice < this.minPrice) {
        return "not-enough";
      } else {
        return "enough";
      }
    }
  }
};
</script>

<style lang="stylus" scoped>
@import '../../assets/css/mixin.styl';

.shopcart {
  position: fixed;
  left: 0;
  bottom: 0;
  z-index: 50;
  width: 100%;
  height: 96px;
  background: #000;

  .content {
    display: flex;
    background: #141d27;
    color: rgba(225, 225, 225, 0.5);

    .content-left {
      flex: 1;
      padding-right: 24px;

      .logo-warpper {
        display: inline-block;
        position: relative;
        top: -20px;
        margin: 0 24px;
        padding: 12px;
        width: 112px;
        height: 112px;
        vertical-align: top;
        border-radius: 50%;
        background: #141d27;
        box-sizing: border-box;

        .logo {
          width: 100%;
          height: 100%;
          border-radius: 50%;
          background: #2b343c;
          text-align: center;

          .icon-shopping_cart {
            color: #80858a;
            font-size: 44px;
            line-height: 88px;

            &.highliight {
              color: #fff;
            }
          }

          &.highliight {
            background: rgb(0, 160, 220);
          }
        }

        .num {
          position: absolute;
          top: 0px;
          right: 0px;
          width: 48px;
          height: 32px;
          line-height: 32px;
          background: rgb(240, 20, 20);
          color: #fff;
          box-shadow: 0 4px 8px 0 rgba(0, 0, 0, 0.4);
          font-size: 18px;
          font-weight: 700;
          border-radius: 32px;
          text-align: center;
        }
      }

      .price {
        display: inline-block;
        vertical-align: top;
        margin-top: 24px;
        line-height: 48px;
        box-sizing: border-box;
        padding-right: 24px;
        border-right: 1px solid rgba(225, 225, 225, 0.2);
        font-size: 32px;
        font-weight: 700;

        &.highliight {
          color: #fff;
        }
      }

      .desc {
        display: inline-block;
        vertical-align: top;
        margin: 24px 0 0 24px;
        line-height: 48px;
        font-size: 20px;
      }
    }

    .content-right {
      flex: 0 0 210px;

      .pay {
        line-height: 96px;
        height: 96px;
        text-align: center;
        font-size: 24px;
        background: #2b333b;
        padding: 0 10px;

        &.not-enough {
          background: #2b333b;
        }

        &.enough {
          background: #00b43c;
          color: #fff;
        }
      }
    }
  }

  .ball-container {
    .ball {
      position: fixed;
      left: 64px;
      bottom: 44px;
      z-index: 200;

      &.drop-enter-active, .drop-leave-active {
        transition: all 0.4s;

        .inner {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgb(0, 160, 220);
          transition: all 0.4s;
        }
      }
    }
  }
}
</style>