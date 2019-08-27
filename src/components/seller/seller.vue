<template>
  <div class="seller" ref="sellerPage">
    <div>
      <div class="head-content">
        <div class="overview">
          <h1 class="title">{{seller.name}}</h1>
          <div class="star-wrapper">
            <star :size="36" :score="seller.score"></star>
            <span class="ratingCount">({{seller.ratingCount}})</span>
            <span>月售{{seller.sellCount}}单</span>
          </div>
        </div>
        <ul class="remark border-1px-top">
          <li class="block">
            <h2>起送价</h2>
            <div class="content">
              <span class="stress">
                {{seller.minPrice}}
                <i>元</i>
              </span>
            </div>
          </li>
          <li class="block">
            <h2>商家配送</h2>
            <div class="content">
              <span class="stress">
                {{seller.deliveryPrice}}
                <i>元</i>
              </span>
            </div>
          </li>
          <li class="block">
            <h2>平均配送时间</h2>
            <div class="content">
              <span class="stress">
                {{seller.deliveryTime}}
                <i>元</i>
              </span>
            </div>
          </li>
        </ul>
        <div class="favorite" @click="toggleFavorite($event)">
          <span class="icon-favorite" :class="{'active':favorite}"></span>
          <span class="text">{{favoriteText}}</span>
        </div>
      </div>
      <split></split>
      <div class="info">
        <h1 class="title">公告与活动</h1>
        <p class="text">{{seller.bulletin}}</p>
        <ul v-if="seller.supports" class="supports">
          <li
            class="supports-item border-1px-top"
            v-for="(item,index) in seller.supports"
            :key="index"
          >
            <span class="icon" :class="classMap[seller.supports[index].type]"></span>
            <span class="txt">{{seller.supports[index].description}}</span>
          </li>
        </ul>
      </div>
      <split></split>
      <div class="pics">
        <h1 class="title">商家实景</h1>
        <div class="pic-wrapper" ref="picWrapper">
          <ul class="pic-list" ref="picList">
            <li class="pic-item" v-for="(pic,index) in seller.pics" :key="index">
              <img :src="pic" class="picimg" />
            </li>
          </ul>
        </div>
      </div>
      <split></split>
      <div class="info-content">
        <h1 class="title border-1px-bottom">商家信息</h1>
        <li
          class="info-item border-1px-bottom"
          v-for="(item,index) in seller.infos"
          :key="index"
        >{{item}}</li>
      </div>
    </div>
  </div>
</template>
<script>
import BScroll from "better-scroll";
import star from "common/star";
import split from "components/split/split";
import {saveToLocal, loadFromLocal} from 'common/js/store'
export default {
  name: "seller",
  data() {
    return {
      scroll: null,
      picScroll: null,
      favorite: (() => {
				return loadFromLocal(this.seller.id,'favorite',false)
			})()
    };
  },
  props: {
    seller: {
      type: Object
    }
  },
  computed: {
    favoriteText() {
      return this.favorite ? "已收藏" : "未收藏";
    }
  },
  components: {
    star,
    split
  },
  watch: {
    seller() {
      this._initSeller();
      this._initPics();
    }
  },
  methods: {
    toggleFavorite(event) {
      if (!event._constructed) {
        return;
      }
			this.favorite = !this.favorite;
			saveToLocal(this.seller.id,'favorite',this.favorite);
    },
    _initSeller() {
      if (!this.scroll) {
        this.scroll = new BScroll(this.$refs.sellerPage, {
          click: true
        });
      } else {
        this.scroll.refresh();
      }
    },
    // 横向滚动
    _initPics() {
      if (this.seller.pics) {
        let picWidth = 240 / 37.5;
        let marginR = 12 / 37.5;
        let ulWidth = (picWidth + marginR) * this.seller.pics.length - marginR;
        this.$refs.picList.style.width = ulWidth + "rem";
        this.$nextTick(() => {
          if (!this.picScroll) {
            this.picScroll = new BScroll(this.$refs.picWrapper, {
              scrollX: true,
              // 忽略纵向滚动
              eventPassthrough: "vertical"
            });
          } else {
            this.picScroll.refresh();
          }
        });
      }
    }
  },
  created() {
    this.classMap = ["decrease", "discount", "special", "invoice", "guarantee"];
  },
  mounted() {
    this._initSeller();
    this._initPics();
  }
};
</script>
<style lang="stylus" scoped>
@import '../../assets/css/mixin.styl';

.seller {
  position: absolute;
  top: 345px;
  left: 0;
  bottom: 0;
  width: 100%;
  overflow: hidden;
  background: #fff;

  .head-content {
    padding: 36px;
    position: relative;

    .title {
      font-size: 28px;
      color: rgb(7, 17, 27);
      line-height: 28px;
      margin-bottom: 16px;
    }

    .star-wrapper {
      font-size: 0;
      display: flex;
      margin-bottom: 36px;

      span {
        font-size: 20px;
        color: rgb(77, 85, 93);
        line-height: 36px;
      }

      span.ratingCount {
        margin: 0 16px 0 3px;
      }
    }

    .remark {
      width: 100%;
      border-1px-top(rgba(7, 17, 27, 0.1));
      padding-top: 36px;
      display: flex;
      justify-content: space-between;

      .block {
        flex: 1;
        text-align: center;
        border-right: 1px solid rgba(7, 17, 27, 0.1);

        &:last-child {
          border: 0;
        }

        h2 {
          font-size: 20px;
          color: rgb(147, 153, 159);
          margin-bottom: 8px;
        }

        .content {
          .stress {
            font-size: 24px;
            color: rgb(7, 17, 27);
            line-height: 48px;
          }

          i {
            font-style: inherit;
            font-size: 20px;
          }
        }
      }
    }

    .favorite {
      position: absolute;
      right: 36px;
      top: 36px;
      text-align: center;

      .icon-favorite {
        line-height: 48px;
        font-size: 48px;
        display: block;
        color: #d4d6d9;
        margin-bottom: 6px;

        &.active {
          color: rgb(240, 20, 20);
        }
      }

      .text {
        font-size: 20px;
        line-height: 20px;
        color: rgb(77, 85, 93);
      }
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
      color: rgb(240, 20, 20);
      line-height: 48px;
      padding: 0 24px;
      font-size: 24px;
      padding-bottom: 32px;
    }

    .supports {
      width: 100%;
      margin: auto;

      .supports-item {
        padding: 32px 24px;
        border-1px-top(rgba(7, 17, 27, 0.1));

        .icon {
          display: inline-block;
          width: 32px;
          height: 32px;
          background-size: 32px 32px;
          background-repeat: no-repeat;
          vertical-align: middle;
          padding-right: 12px;

          &.decrease {
            bg-image(decrease_4);
          }

          &.discount {
            bg-image(discount_4);
          }

          &.special {
            bg-image(special_4);
          }

          &.invoice {
            bg-image(invoice_4);
          }

          &.guarantee {
            bg-image(guarantee_4);
          }
        }

        .txt {
          font-size: 24px;
          line-height: 24px;
          color: rgb(7, 17, 27);
          font-weight: 200;
        }
      }
    }
  }

  .pics {
    padding: 36px;

    .title {
      margin-bottom: 24px;
      line-height: 28px;
      color: rgb(7, 17, 27);
      font-size: 24px;
    }

    .pic-wrapper {
      width: 100%;
      overflow: hidden;
      white-space: nowrap;

      .pic-list {
        font-size: 0;

        .pic-item {
          display: inline-block;
          margin-right: 12px;
          width: 240px;
          height: 180px;

          &:last-child {
            margin-right: 0;
          }

          .picimg {
            width: 100%;
            height: 100%;
          }
        }
      }
    }
  }

  .info-content {
    padding: 36px 36px 0 36px;

    .title {
      padding-bottom: 24px;
      line-height: 28px;
      color: rgb(7, 17, 27);
      font-size: 24px;
      border-1px-bottom(rgba(7, 17, 27, 0.1));
    }

    .info-item {
      border-1px-bottom(rgba(7, 17, 27, 0.1));
      padding: 32px 24px;
      color: rgb(7, 17, 27);
      line-height: 40px;
      font-size: 24px;
    }
  }
}
</style>