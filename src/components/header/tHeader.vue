<template>
  <div class="header">
    <div class="index-bg">
      <img :src="seller.avatar" class="bjimg" />
    </div>
    <div class="content-wrapper">
      <img :src="seller.avatar" class="logo" />
      <div class="title">
        <div class="row-1">
          <span class="brand"></span>
          <span class="name">{{seller.name}}</span>
        </div>
        <div class="row-2">
          <span>{{seller.description}}/{{seller.deliveryTime}}分钟送达</span>
        </div>
        <div class="row-3" v-if="seller.supports">
          <span class="icon" :class="classMap[seller.supports[0].type]"></span>
          <span class="txt">{{seller.supports[0].description}}</span>
        </div>
      </div>
      <div class="supports-count" v-if="seller.supports" @click="showBox">
        <span class="count">{{seller.supports.length}}个</span>
        <i class="icon-keyboard_arrow_right icon_right_1"></i>
      </div>
    </div>
    <div class="hf-wrapper" @click="showBox">
      <div class="hf">
        <span class="gz"></span>
        <span class="txt">{{seller.bulletin}}</span>
        <i class="icon-keyboard_arrow_right icon_right_2"></i>
      </div>
    </div>
    <transition name="fade">
      <tPopUpBox  @colseBox="colseBox" v-show="boxShow" :seller="seller" :classMap="classMap"></tPopUpBox>
    </transition>
  </div>
</template>
<script>
import tPopUpBox from "./tPopUpBox";
export default {
  name: "tHeader",
  props: {
    seller: {
      type: Object
    }
  },
  data() {
    return {
      boxShow: false,
      classMap: []
    }
  },
  methods: {
    showBox() {
      this.boxShow = true;
    },
    colseBox() {
      this.boxShow = false;
    }
  },
  components: {
    tPopUpBox
  },
  created() {
    this.classMap = ["decrease", "discount", "special", "invoice", "guarantee"];
  }
};
</script>
<style lang="stylus" scoped>
@import '../../assets/css/mixin.styl';

.header {
  background: rgba(7, 17, 17, 0.5);
  width: 100%;
  color: #fff;
  position: relative;
  overflow: hidden;

  .content-wrapper {
    position: relative;
    padding: 48px 24px 32px 48px;
    display: flex;

    .logo {
      width: 128px;
      height: 128px;
      border-radius: 4px;
    }

    .title {
      padding-left: 32px;
      flex: 1;

      .row-1 {
        .brand {
          bg-image('brand');
          display: inline-block;
          vertical-align: top;
          width: 60px;
          height: 36px;
          background-size: 60px 36px;
          background-repeat: no-repeat;
          margin-right: 12px;
        }

        .name {
          font-size: 32px;
          font-weight: bold;
          line-height: 36px;
          color: #fff;
        }
      }

      .row-2 {
        span {
          display: inline-block;
          font-size: 24px;
          line-height: 24px;
          color: #fff;
          font-weight: 200;
          margin-top: 15px;
          margin-bottom: 13px;
        }
      }

      .row-3 {
        .icon {
          display: inline-block;
          vertical-align: middle;
          width: 24px;
          height: 24px;
          margin-right: 8px;
          background-size: 24px 24px;
          background-repeat: no-repeat;

          &.decrease {
            bg-image('decrease_1');
          }

          &.discount {
            bg-image('discount_1');
          }

          &.special {
            bg-image('special_1');
          }

          &.invoice {
            bg-image('invoice_1');
          }

          &.guarantee {
            bg-image('guarantee_1');
          }
        }

        .txt {
          font-size: 20px;
          line-height: 24px;
        }
      }
    }

    .supports-count {
      position: absolute;
      right: 24px;
      bottom: 36px;
      padding: 0 18px;
      padding-right: 14px;
      line-height: 48px;
      border-radius: 28px;
      background: rgba(0, 0, 0, 0.2);
      text-align: center;

      .count {
        font-size: 18px;
        margin-right: 4px;
      }

      i.icon_right_1 {
        font-size: 20px;
      }
    }
  }

  .hf-wrapper {
    width: 100%;
    height: 56px;
    line-height: 56px;
    background: rgba(7, 17, 27, 0.2);

    .hf {
      padding: 0 44px 0 68px;
      overflow: hidden;
      white-space: nowrap;
      text-overflow: ellipsis;
      position: relative;

      .gz {
        display: inline-block;
        width: 44px;
        height: 24px;
        bg-image(bulletin);
        background-repeat: no-repeat;
        background-size: 44px 24px;
        position: absolute;
        top: 16px;
        left: 24px;
      }

      .txt {
        margin-left: 8px;
        font-size: 18px;
        color: #fff;
        line-height: 56px;
        vertical-align: middle;
      }

      .icon_right_2 {
        font-size: 20px;
        position: absolute;
        top: 18px;
        right: 24px;
      }
    }
  }

  .index-bg {
    position: absolute;
    top: 0px;
    left: 0px;
    width: 100%;
    height: 100%;
    z-index: -1;
    filter: blur(10px);

    .bjimg {
      width: 100%;
      height: 100%;
    }
  }
  .fade-enter-active, .fade-leave-active{
    transition:opacity 0.5s
  }
  .fade-enter, .fade-leave-to{
    opacity: 0
  }
}
</style>
