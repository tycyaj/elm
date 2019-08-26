<template>
  <div>
    <div class="shopcart">
      <div class="content">
        <div class="content-left" @click="toggleList()">
          <div class="logo-warpper">
            <div class="logo" :class="{'highliight':totalCount>0}">
              <i class="icon-shopping_cart" :class="{'highliight':totalCount>0}"></i>
            </div>
            <div class="num" v-show="totalCount>0">{{totalCount}}</div>
          </div>
          <div class="price" :class="{'highliight':totalPrice>0}">￥{{totalPrice}}元</div>
          <div class="desc">{{deliPrice}}</div>
        </div>
        <div class="content-right" @click="goPay">
          <div class="pay" :class="payClass">{{payDesc}}</div>
        </div>
        <div class="ball-container">
          <div v-for="(ball, index) in balls" :key="index">
            <transition
              name="drop"
              @before-enter="beforeDrop"
              @enter="dropping"
              @after-enter="afterDrop"
            >
              <div class="ball" v-show="ball.show">
                <div class="inner inner-hook"></div>
              </div>
            </transition>
          </div>
        </div>
        <transition name="fold">
          <div class="shopcart-list" v-show="listShow">
            <div class="header">
              <h1 class="title">购物车</h1>
              <span class="empty" @click="empty">清空</span>
            </div>
            <div class="list-content" ref="listContent">
              <ul>
                <li class="food" v-for="(food,index) in selectFoods" :key="index">
                  <span class="name">{{food.name}}</span>
                  <div class="price">
                    <span>￥{{food.price * food.count}}</span>
                  </div>
                  <div class="cartcontrol-warpper">
                    <cartcontrol :food="food"></cartcontrol>
                  </div>
                </li>
              </ul>
            </div>
          </div>
        </transition>
      </div>
    </div>
    <transition name="fade">
      <div class="list-mask" @click="hideList" v-show="listShow"></div>
    </transition>
  </div>
</template>
<script>
import cartcontrol from "components/cartcontrol/cartcontrol";
import BScroll from "better-scroll";

export default {
  components: {
    cartcontrol
  },
  data() {
    return {
      balls: [{ show: false }, { show: false }, { show: false }],
      dropBalls: [],
      fold: true
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
      let ball = this.dropBalls[this.dropBalls.length - 1];
      if (ball.show) {
        let rect = ball.el.getBoundingClientRect();
        let x = rect.left - 40;
        let y = -(window.innerHeight - rect.top - 36);
        el.style.display = "";
        el.style.webkitTransform = `translate3d(0,${y}px,0)`;
        el.style.transform = `translate3d(0,${y}px,0)`;
        let inner = el.getElementsByClassName("inner-hook")[0];
        inner.style.webkitTransform = `translate3d(${x}px,0,0)`;
        inner.style.transform = `translate3d(${x}px,0,0)`;
      }
    },
    dropping(el, done) {
      let rf = el.offsetHeight;
      this.$nextTick(() => {
        el.style.webkitTransform = "translate3d(0,0,0)";
        el.style.transform = "translate3d(0,0,0)";
        let inner = el.getElementsByClassName("inner-hook")[0];
        inner.style.webkitTransform = "translate3d(0,0,0)";
        inner.style.transform = "translate3d(0,0,0)";
        el.addEventListener("transitionend", done);
      });
    },
    afterDrop(el) {
      let ball = this.dropBalls.shift();
      if (ball) {
        ball.show = false;
        el.style.display = "none";
      }
    },
    toggleList() {
      if (!this.totalCount) {
        return;
      }
      this.fold = !this.fold;
    },
    empty() {
      this.selectFoods.forEach(food => {
        food.count = 0;
      });
    },
    hideList() {
      this.fold = true;
    },
    goPay() {
      if (!this.totalPrice) {
        alert(`选择商品先,满${this.minPrice}元免配送费哦`);
      } else if (this.totalPrice < this.minPrice) {
        let totalDeli = this.totalPrice + this.deliveryPrice;
        alert(`需要支付${totalDeli}元,(含配送费${this.deliveryPrice}元)`);
      } else {
        alert(`需要支付${this.totalPrice}元`);
      }
    }
  },
  computed: {
    listShow() {
      if (!this.totalCount) {
        this.fold = true;
        return false;
      }
      let show = !this.fold;
      if (show) {
        this.$nextTick(() => {
          if (!this.scroll) {
            this.scroll = new BScroll(this.$refs.listContent, { click: true });
            console.log(this.scroll);
          } else {
            this.scroll.refresh();
          }
        });
      }
      return show;
    },
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
    deliPrice() {
      if (this.totalPrice >= this.minPrice) {
        return `另需配送费￥${0}元`;
      } else {
        return `另需配送费￥${this.deliveryPrice}元`;
      }
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
    position: relative;
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

    .ball-container {
      .ball {
        position: fixed;
        left: 64px;
        bottom: 44px;
        z-index: 200;
        transition: all 0.4s cubic-bezier(0.49, -0.29, 0.75, 0.41);

        .inner {
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgb(0, 160, 220);
          transition: all 0.4s linear;
        }
      }
    }

    .shopcart-list {
      position: absolute;
      left: 0;
      top: 0;
      z-index: -1;
      width: 100%;
      transform: translate3d(0, -100%, 0);

      &.fold-enter-active, &.fold-leave-active {
        transition: all 0.3s ease;
      }

      &.fold-enter, &.fold-leave-active {
        transform: translate3d(0, 0, 0);
      }

      .header {
        height: 80px;
        line-height: 80px;
        padding: 0 36px;
        background: #f3f5f7;
        border-1px-bottom(rgba(7, 17, 27, 0.1));

        .title {
          font-size: 28px;
          float: left;
          color: rgb(7, 17, 27);
        }

        .empty {
          float: right;
          font-size: 24px;
          color: rgb(0, 160, 220);
        }
      }

      .list-content {
        padding: 0 36px;
        padding-right: 16px;
        max-height: 434px;
        background: #ffffff;
        overflow: hidden;

        .food {
          position: relative;
          padding: 24px 0;
          box-sizing: border-box;
          border-1px(rgba(7, 17, 27, 0.1));

          .name {
            color: rgb(7, 17, 27);
            line-height: 48px;
            font-size: 28px;
          }

          .price {
            position: absolute;
            right: 210px;
            bottom: 24px;
            line-height: 48px;
            color: rgb(240, 20, 20);
            font-weight: 700;

            span {
              font-size: 28px;
            }
          }

          .cartcontrol-warpper {
            position: absolute;
            right: 0;
            bottom: 12px;
          }
        }
      }
    }
  }
}

.list-mask {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  z-index: 40;
  backdrop-filter: blur(10px);
  background: rgba(7, 17, 27, 0.6);
  transition: all 0.5s;
  opacity: 1;

  &.fade-enter-active. &.fade-leave-active {
    transition: all 0.5s;
  }

  &.fade-enter, &.fade-leave {
    opacity: 0;
    background: rgba(7, 17, 27, 0);
  }
}
</style>