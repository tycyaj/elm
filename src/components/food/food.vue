<template>
  <transition name="move">
    <div class="food" v-show="showFlag" ref="foodWarpper">
      <div class="food-content">
        <div class="img-haed">
          <img :src="food.image" />
          <span class="icon" @click="back">
            <i class="icon-arrow_lift"></i>
          </span>
        </div>
        <div class="content">
          <h1 class="title">{{food.name}}</h1>
          <div class="detail">
            <span class="sell-count">月售{{food.sellCount}}份</span>
            <span class="rating">好评率{{food.rating}}</span>
          </div>
          <div class="price">
            <span class="now">￥{{food.price}}</span>
            <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
          </div>
          <div class="cartcontrol-wrapper">
            <cartcontrol @add="cartAdd" :food="food"></cartcontrol>
          </div>
          <transition name="fade">
            <div
              class="buy"
              @click.stop.prevent="addFirst"
              v-show="!food.count || food.count === 0"
            >加入购物车</div>
          </transition>
        </div>
        <split v-show="food.info"></split>
        <div class="info" v-show="food.info">
          <h1 class="title">商品信息</h1>
          <p class="text">{{food.info}}</p>
        </div>
        <split></split>
        <div class="rating">
          <h1 class="title">商品评价</h1>
          <ratingselect
            :select-type="selectType"
            :only-content="onlyContent"
            :desc="desc"
            :ratings="food.ratings"
            @selectRatingtype="selectRatingtype"
            @contentToggle='contentToggle'
          ></ratingselect>
          <div class="rating-warpper">
            <ul v-show="food.ratings && food.ratings.length">
              <li class="rating-item border-1px-bottom" v-show="needShow(rating.rateType,rating.text)" v-for="(rating,index) in food.ratings" :key="index">
                <div class="user">
                  <span class="name">{{rating.username}}</span>
                  <img class="avatar" :src="rating.avatar" />
                </div>
                <div class="time">{{rating.rateTime | formatDate}}</div>
                <p class="text">
                  <span
                    :class="{'icon-thumb_up':rating.rateType === 0,'icon-thumb_down':rating.rateType === 1}"
                  ></span>
                  {{rating.text}}
                </p>
              </li>
            </ul>
            <div class="no-rating" v-show="!food.ratings || !food.ratings.length">暂无评价</div>
          </div>
        </div>
      </div>
    </div>
  </transition>
</template>
<script>
import BScroll from "better-scroll";
import cartcontrol from "components/cartcontrol/cartcontrol";
import split from "components/split/split";
import ratingselect from "components/ratingselect/ratingselect";
import {filterDate} from 'common/js/date' 
// 选择类型
const POSITIVE = 0; //正向评价
const NEGATIVE = 1; //负面评价
const ALL = 2; //全部评价
export default {
  data() {
    return {
      showFlag: false,
      scroll: null,
      //ratingselect 组件数据
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: "全部",
        positive: "推荐",
        negative: "吐槽"
      }
    };
  },
  props: {
    food: {
      type: Object
    }
  },
  components: {
    cartcontrol,
    ratingselect,
    split
  },
  filters:{
    formatDate(time){
      let date = new Date(time)
      let addyear = date.setFullYear(date.getFullYear() + 2)
      let addlate = new Date(addyear)
      return filterDate(addlate,'yyyy-MM-dd hh:mm')
    }
  },
  methods: {
    needShow(type,text){
      if(this.onlyContent && !text){
        return false
      }
      if(this.selectType === ALL){
        return true
      }else{
        return type === this.selectType
      }
    },
    selectRatingtype(type){
      this.selectType = type
      this.$nextTick(()=>{
        this.scroll.refresh();
      })
    },
    contentToggle(onlyContented){
      console.log(onlyContented)
      this.onlyContent = onlyContented
      this.$nextTick(()=>{
        this.scroll.refresh();
      })
    },
    addFirst(event) {
      if (!event._constructed) {
        return;
      }
      this.$set(this.food, "count", 1);
      this.$emit("add", event.target);
    },
    cartAdd(target) {
      this.$emit("add", target);
    },
    show() {
      //ratingselect 组件数据初始化
      this.selectType = ALL;
      this.onlyContent = true;

      this.showFlag = true;
      this.$nextTick(() => {
        if (!this.scroll) {
          this.scroll = new BScroll(this.$refs.foodWarpper, {
            click: true
          });
        } else {
          this.scroll.refresh();
        }
      });
    },
    back() {
      this.showFlag = false;
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '../../assets/css/mixin.styl';

.food {
  position: fixed;
  left: 0;
  top: 0;
  bottom: 96px;
  z-index: 30;
  width: 100%;
  background: #fff;

  &.move-enter-active, &.move-leave-active {
    transition: all 0.3s linear;
  }

  &.move-enter, &.move-leave-active {
    transition: all 0.3s linear;
    transform: translate3d(100%, 0, 0);
  }

  .img-haed {
    position: relative;
    width: 100%;
    height: 0;
    padding-top: 60%;

    img {
      position: absolute;
      top: 0;
      left: 0;
      width: 100%;
      height: 100%;
    }

    .icon {
      position: absolute;
      top: 25px;
      left: 0px;

      i {
        display: black;
        padding: 18px;
        font-size: 40px;
        color: #fff;
        font-weight 200
      }
    }
  }

  .content {
    padding: 36px;
    position: relative;

    .title {
      font-size: 28px;
      margin-bottom: 16px;
      color: rgb(7, 17, 27);
    }

    .detail {
      margin-bottom: 36px;
      font-size: 0;

      .sell-count, .rating {
        font-size: 20px;
        color: rgb(147, 153, 159);
      }

      .sell-count {
        margin-right: 24px;
      }
    }

    .price {
      color: rgb(147, 153, 159);
      font-weight: normal;
      margin-top: 16px;

      .now {
        font-size: 28px;
        color: rgb(240, 20, 20);
        font-weight: 700;
        margin-right: 12px;
        line-height: 48px;
      }

      .old {
        text-decoration: line-through;
        font-size: 18px;
        line-height: 48px;
      }
    }
  }

  .cartcontrol-wrapper {
    position: absolute;
    right: 24px;
    bottom: 24px;
  }

  .buy {
    position: absolute;
    right: 36px;
    bottom: 36px;
    z-index: 10;
    height: 48px;
    line-height: 56px;
    padding: 0 24px;
    box-sizing: border-box;
    font-size: 20px;
    border-radius: 24px;
    color: #ffffff;
    background: rgb(0, 160, 220);
    opacity: 1;

    &.fade-enter-active, &.fade-leave-active {
      transition: all 0.3s;
    }

    &.fade-enter, &.fade-leave-active {
      opacity: 0;
      z-index: -1;
    }
  }

  .info {
    padding: 36px;
    background: #ffffff;

    .title {
      line-height: 28px;
      margin-bottom: 24px;
      font-size: 28px;
      color: rgb(7, 17, 27);
    }

    .text {
      color: rgb(77, 85, 93);
      line-height: 48px;
      padding: 0 16px;
      font-size: 24px;
    }
  }

  .rating {
    padding-top: 36px;

    .title {
      font-size: 28px;
      color: rgb(7, 17, 27);
      padding: 0 36px;
    }

    .rating-warpper {
      padding: 0 36px;

      .rating-item {
        position: relative;
        padding: 32px 0;
        border-1px-bottom(rgba(7, 17, 27, 0.1));

        .user {
          position: absolute;
          right: 0px;
          top: 32px;
          font-size: 0;
          line-height: 24px;

          .name {
            display: inline-block;
            font-size: 20px;
            color: rgb(147, 153, 159);
            margin-right: 12px;
          }

          .avatar {
            border-radius: 12px;
            width: 24px;
            height: 24px;
            vertical-align: baseline;
          }
        }

        .time {
          line-height: 24px;
          font-size: 20px;
          color: rgb(147, 153, 159);
          margin-bottom: 12px;
        }
        .text{
          line-height 32px
          font-size 24px
          color rgb(7,17,27)
          span.icon-thumb_up,span.icon-thumb_down{
            margin-right 8px
            line-height 48px
            font-size 24px
          }
          span.icon-thumb_up{
            color rgb(0,160,220)
          }
          span.icon-thumb_down{
            color rgb(147,153,159)
          }
        }
      }
    }
    .no-rating{
      padding 32px 0
      font-size 24px
      color rgb(147,153,159)
    }
  }
}
</style>