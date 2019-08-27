<template>
  <div class="raitings" ref="raitingsEl">
    <div class="raitings-content">
      <div class="overview">
        <div class="overview-left border-1px-right">
          <h1 class="score">{{seller.score}}</h1>
          <p class="title">综合评分</p>
          <p class="rank">高于周边商家{{seller.rankRate}}%</p>
        </div>
        <div class="overview-right">
          <div class="score-wrapper">
            <span class="title">服务态度</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.serviceScore}}</span>
          </div>
          <div class="score-wrapper">
            <span class="title">商品评分</span>
            <star :size="36" :score="seller.serviceScore"></star>
            <span class="score">{{seller.foodScore}}</span>
          </div>
          <div class="delivery-wrapper">
            <span class="title">送达时间</span>
            <span class="delivery">{{seller.deliveryTime}}分钟</span>
          </div>
        </div>
      </div>
      <split></split>
      <ratingselect
        :select-type="selectType"
        :only-content="onlyContent"
        :desc="desc"
        :ratings="ratings"
        @selectRatingtype="selectRatingtype"
        @contentToggle="contentToggle"
      ></ratingselect>
      <div class="ratings-wrapper">
        <ul>
          <li
            class="rating-item border-1px-bottom"
            v-for="(rating,index) in ratings"
            :key="index"
            v-show="needShow(rating.rateType,rating.text)"
          >
            <div class="avatar">
              <img :src="rating.avatar" />
            </div>
            <div class="content">
              <h1 class="name">{{rating.username}}</h1>
              <div class="star-wrapper">
                <star :size="24" :score="rating.score"></star>
                <span class="delivery" v-show="rating.deliveryTime">{{rating.deliveryTime}}分钟送达</span>
              </div>
              <p class="text">{{rating.text}}</p>
              <div class="recommend" v-show="rating.recommend && rating.recommend.length">
                <i class="icon-thumb_up"></i>
                <div class="recom">
                  <span v-for="(item,index) in rating.recommend" :key="index">{{item}}</span>
                </div>
              </div>
              <div class="time">{{rating.rateTime | formatDate }}</div>
            </div>
          </li>
        </ul>
      </div>
    </div>
  </div>
</template>
<script>
import star from "common/star";
import split from "components/split/split";
import ratingselect from "components/ratingselect/ratingselect";
import { filterDate } from "common/js/date";
import BSscroll from "better-scroll";
// 选择类型

const ALL = 2; //全部评价
export default {
  name: "raitings",
  data() {
    return {
      scroll: null,
      ratings: [],
      //ratingselect 组件数据
      selectType: ALL,
      onlyContent: true,
      desc: {
        all: "全部",
        positive: "满意",
        negative: "不满意"
      }
    };
  },
  methods: {
    needShow(type, text) {
      if (this.onlyContent && !text) {
        return false;
      }
      if (this.selectType === ALL) {
        return true;
      } else {
        return type === this.selectType;
      }
    },
    selectRatingtype(type) {
      this.selectType = type;
      this.$nextTick(() => {
        this.scroll.refresh();  
      });
    },
    contentToggle(onlyContented) {
      this.onlyContent = onlyContented;
      this.$nextTick(() => {
        this.scroll.refresh();
      });
    }
  },
  filters: {
    formatDate(time) {
      let date = new Date(time);
      let addyear = date.setFullYear(date.getFullYear() + 2);
      let addlate = new Date(addyear);
      return filterDate(addlate, "yyyy-MM-dd hh:mm");
    }
  },
  created() {
    this.$http
      .get("/api/ratings")
      .then(res => {
        const data = res.data;
        if (res.status === 200 && data.status === 1) {
          this.ratings = data.data;

          this.$nextTick(() => {
            this.scroll = new BSscroll(this.$refs.raitingsEl, {
              click: true
            });
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  props: {
    seller: {
      type: Object
    }
  },
  components: {
    star,
    split,
    ratingselect
  }
};
</script>
<style lang="stylus" scoped>
@import '../../assets/css/mixin.styl';

.raitings {
  background: #fff;
  position: absolute;
  top: 345px;
  bottom: 0;
  left: 0;
  width: 100%;
  overflow: hidden;

  .raitings-content {
    .overview {
      display: flex;
      padding: 36px 0;

      .overview-left {
        flex: 0 0 290px;
        width: 290px;
        padding: 12px 0;
        border-right: 1px solid rgba(7, 17, 27, 0.1);
        text-align: center;

        @media only screen and (max-width: 320px) {
          flex: 0 0 280px;
          width: 280px;
        }

        .score {
          margin-bottom: 12px;
          line-height: 56px;
          font-size: 48px;
          color: rgb(225, 153, 0);
        }

        .title {
          font-size: 24px;
          color: rgb(7, 17, 27);
          margin-bottom: 16px;
        }

        .rank {
          font-size: 20px;
          color: rgb(147, 153, 159);
        }
      }

      .overview-right {
        flex: 1;
        padding: 12px 0 12px 48px;

        @media only screen and (max-width: 320px) {
          padding-left: 24px;
        }

        .score-wrapper {
          margin-bottom: 8px;
          font-size: 0;

          .title {
            display: inline-block;
            vertical-align: top;
            font-size: 24px;
            line-height: 36px;
            color: rgb(7, 17, 27, );
          }

          .star {
            display: inline-block;
            vertical-align: top;
            margin: 0 24px;
          }

          .score {
            display: inline-block;
            vertical-align: top;
            line-height: 36px;
            color: rgb(225, 153, 0);
            font-size: 24px;
          }
        }

        .delivery-wrapper {
          .title {
            font-size: 24px;
            line-height: 36px;
            color: rgb(7, 17, 27, );
          }

          .delivery {
            font-size: 24px;
            margin: 0 24px;
            color: rgb(147, 153, 159);
          }
        }
      }
    }

    .ratings-wrapper {
      padding: 0 36px;

      .rating-item {
        display: flex;
        padding: 36px 0;
        border-1px-bottom(rgba(7, 17, 27, 0.1));

        .avatar {
          flex: 0 0 56px;
          height: 56px;
          margin-right: 24px;

          img {
            width: 100%;
            border-radius: 50%;
          }
        }

        .content {
          flex: 1;

          h1.name {
            font-size: 20px;
            color: rgb(7, 17, 27);
            margin-top: 5px;
            line-height: 24px;
          }

          .star-wrapper {
            display: flex;
            font-size: 0;
            margin: 8px 0 12px 0;

            .delivery {
              display: inline-block;
              margin-left: 12px;
              color: rgb(147, 153, 159);
              font-size: 14px;
            }
          }

          p.text {
            font-size: 24px;
            color: rgb(7, 17, 27);
            line-height: 36px;
            margin-bottom: 16px;
          }

          .recommend {
            display: flex;
            font-size: 0;

            i.icon-thumb_up {
              flex: 0 0 30px;
              font-size: 30px;
              margin-top: 5px;
              color: rgb(0, 160, 220);
              line-height: 32px;
            }

            .recom {
              flex: 1;

              span {
                display: inline-block;
                padding: 4px 12px;
                border: 1px solid rgba(7, 17, 27, 0.1);
                // border-1px-all(rgba(7, 17, 27, 0.1));
                background: #fff;
                border-radius: 2px;
                font-size: 18px;
                color: rgb(147, 153, 159);
                line-height: 32px;
                margin: 0 0 8px 14px;
              }
            }
          }
        }

        .time {
          position: absolute;
          right: 0;
          top: 36px;
          font-size: 20px;
          font-weight: 200;
          line-height: 36px;
          color: rgb(147, 153, 159);
        }
      }
    }
  }
}
</style>