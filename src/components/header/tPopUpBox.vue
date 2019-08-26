<template>
  <div class="box-warpper">
    <div class="box-content clearfix">
      <div class="box-main">
        <p class="top-title">{{seller.name}}</p>
        <!-- 传递的size 星图片的大小  -->
        <div style="text-align:center">
          <star :size="48" :score="seller.score"></star>
        </div>
        <div class="title">
          <div class="line"></div>
          <div class="text">优惠信息</div>
          <div class="line"></div>
        </div>
        <ul v-if="seller.supports" class="supports">
          <li class="supports-item" v-for="(item,index) in seller.supports" :key="index">
            <span class="icon" :class="classMap[seller.supports[index].type]"></span>
            <span class="text">{{seller.supports[index].description}}</span>
          </li>
        </ul>
        <div class="title">
          <div class="line"></div>
          <div class="text">商家公告</div>
          <div class="line"></div>
        </div>
        <div class="info">
          <p>{{seller.bulletin}}</p>
        </div>
      </div>
    </div>
    <div class="box-close">
      <i class="icon-close" @click="closeBox"></i>
    </div>
  </div>
</template>
<script>
import star from "common/star";
export default {
  props: {
    seller: {
      type: Object
    },
    classMap: {
      type: Array
    }
  },
  components: {
    star
  },
  data() {
    return {};
  },
  methods: {
    closeBox() {
      this.$emit("colseBox");
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '../../assets/css/mixin.styl';

.box-warpper {
  position: fixed;
  top: 0px;
  left: 0px;
  bottm: 0px;
  right: 0px;
  width: 100%;
  height: 100%;
  z-index: 100;
  background: rgba(7, 17, 27, 0.8);
  overflow-y: auto
  .box-content {
    min-height: 100%;
    width: 100%;

    .box-main {
      margin-top: 128 px;
      padding-bottom: 64px;

      .top-title {
        font-size: 34px;
        font-weight: 700;
        line-height: 32px;
        color: #fff;
        text-align: center;
        margin-bottom: 32px;
      }

      .title {
        display: flex;
        width: 80%;
        margin: 60px auto 48px;

        .line {
          flex: 1;
          position: relative;
          top: -12px;
          border-bottom: 1px solid rgba(225, 225, 225, 0.4);
        }

        .text {
          padding: 0 24px;
          font-size: 28px;
        }
      }

      .supports {
        width: 80%;
        margin: auto;

        .supports-item {
          padding: 0 24px;
          margin-bottom: 24px;

          .icon {
            display: inline-block;
            width: 32px;
            height: 32px;
            background-size: 32px 32px;
            background-repeat: no-repeat;
            vertical-align: middle;
            padding-right: 12px;

            &.decrease {
              bg-image(decrease_1)
            }

            &.discount {
              bg-image(discount_1)
            }

            &.special {
              bg-image(special_1)
            }

            &.invoice {
              bg-image(invoice_1)
            }

            &.guarantee {
              bg-image(guarantee_1)
            }
          }

          .text {
            font-size: 24px
            line-height: 24px
            color: #fff;
            font-weight: 200
          }
        }
      }
      .info {
        width: 80%
        margin: auto
        p {
          padding 0 24px
          font-size: 24px;
          line-height: 48px
          color: #fff
          font-weight: 200
        }
      }
    }
  }

  .box-close {
    position: relative;
    width: 64px;
    height: 64px;
    margin: -128px auto;
    clear: both;
    font-size: 64px;
  }
}
</style>