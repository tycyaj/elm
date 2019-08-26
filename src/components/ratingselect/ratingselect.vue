<template>
  <div class="ratingselect">
    <div class="rating-type border-1px-bottom">
      <span @click.stop="selectActive(2,$event)" :class="{'select':selectTyped === 2}">
        {{desc.all}}
        <i>{{ratings.length}}</i>
      </span>
      <span @click.stop="selectActive(0,$event)" :class="{'select':selectTyped === 0}">
        {{desc.positive}}
        <i>{{positive.length}}</i>
      </span>
      <span @click.stop="selectActive(1,$event)" :class="{'select':selectTyped === 1}">
        {{desc.negative}}
        <i>{{negative.length}}</i>
      </span>
    </div>
    <div class="switch border-1px-bottom" @click.stop="toggleContent" :class="{'on':onlyContented}">
      <i class="icon-check_circle"></i>
      <span class="text">只看有内容的评价</span>
    </div>
  </div>
</template>
<script>
import BScroll from 'better-scroll'
// 选择类型
const POSITIVE = 0; //正向评价
const NEGATIVE = 1; //负面评价
const ALL = 2; //全部评价
export default {
  data() {
    return {
      scroll:null,
      // 子组件不能直接更改父组件传来的props需先在data中定义
      selectTyped: this.selectType,
      onlyContented: this.onlyContent
    };
  },
  props: {
    //评价信息
    ratings: {
      type: Array,
      default() {
        return [];
      }
    },
    //选择类型
    selectType: {
      type: Number,
      default: ALL
    },
    //是否读内容
    onlyContent: {
      type: Boolean,
      default: false
    },
    desc: {
      type: Object,
      default() {
        return {
          all: "全部",
          positive: "满意",
          negative: "不满意"
        };
      }
    }
  },
  computed: {
    positive() {
      return this.ratings.filter(rating => {
        return rating.rateType === POSITIVE;
      });
    },
    negative() {
      return this.ratings.filter(rating => {
        return rating.rateType === NEGATIVE;
      });
    }
  },
  methods: {
    //点击是否只看内容
    toggleContent(event) {
      if (!event._constructed) {
        return;
      }
      this.onlyContented = !this.onlyContented;
      this.$emit("contentToggle", this.onlyContented);
    },
    // 点击查看的类型
    selectActive(type, event) {
      if (!event._constructed) {
        return;
      }
      this.selectTyped = type;
      this.$emit("selectRatingtype", type);
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '../../assets/css/mixin.styl';

.ratingselect {
  .rating-type {
    display: flex;
    padding: 36px 0;
    margin 0 36px
    border-1px-bottom(rgba(7, 17, 27, 0.1));

    span {
      display: inline-block;
      padding: 16px 24px;
      text-align: center;
      border-radius: 2px;
      color: rgb(77, 85, 93);
      font-size: 24px;
      margin-right: 16px;
      background: rgba(0, 160, 220, 0.2);

      &:nth-child(3) {
        background: rgba(77, 85, 93, 0.2);
      }

      &:last-child {
        margin-right: 0;
      }

      &.select {
        color: #fff;
        background: rgb(0, 160, 220);
      }

      i {
        font-style: inherit;
        font-size: 12px;
        margin-left: 3px;
      }
    }
  }

  .switch {
    padding: 24px 36px;
    border-1px-bottom(rgba(7, 17, 27, 0.1));
    &.on {
      i.icon-check_circle {
        color: #00c850;
      }
    }

    i.icon-check_circle {
      font-size: 32px;
      color: rgb(147, 153, 159);
      line-height: 48px;
      margin-right: 8px;
      vertical-align: middle;
    }

    .text {
      font-size: 24px;
      color: rgb(147, 153, 159);
      line-height: 48px;
    }
  }
}
</style>