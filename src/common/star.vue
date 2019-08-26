<template>
  <div class="star" :class="starType">
      <span
        v-for="(itemClass,index) in itemClasses"
        :key="index"
        :class="itemClass"
        class="star-item"
      ></span>
  </div>
</template>
<script>

const starlen = 5;
const clson = "on";
const clshalr = "half";
const clsoff = "off";

export default {
  props: {
    size: {
      type: Number
    },
    score: {
      type: Number
    }
  },
  data() {
    return {};
  },
  computed: {
    starType() {
      return "star-" + this.size; //star-48  star-36
    },
    itemClasses() {
      let result = [];
      //拿到传入的星星数值*2后 上下取整
      let starNum = Math.floor(this.score * 2) / 2;
      // console.log(starNum);
      //判断是否有小数(半颗星) 4.5  true or false
      let hasHalfStar = starNum % 1 !== 0;
      //判断有几个整颗星
      let integer = Math.floor(this.score);
      // console.log(integer);
      for (let i = 0; i < integer; i++) {
        result.push(clson);
      }
      hasHalfStar && result.push(clshalr);
      
      while(result.length < starlen) {
          result.push(clsoff);
      }
      return result;
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '../assets/css/mixin.styl';

.star {
  .star-item {
    display: inline-block;
    background-repeat: no-repeat;
  }

  &.star-48 {
    .star-item {
      width: 40px;
      height: 40px;
      margin-right: 44px;
      background-size: 40px 40px;

      &.last-child {
        margin-right: 0;
      }

      &.on {
        bg-image-1('star48_on');
      }

      &.half {
        bg-image-1('star48_half');
      }

      &.off {
        bg-image-1('star48_off');
      }
    }
  }

  &.star-36 {
    .star-item {
      width: 30px;
      height: 30px;
      margin-right: 24px;
      background-size: 30px 30px;
      @media screen and (max-width 320px){
        margin-right: 14px;
      }
      &.last-child {
        margin-right: 0;
      }

      &.on {
        bg-image-1('star36_on');
      }

      &.half {
        bg-image-1('star36_half');
      }

      &.off {
        bg-image-1('star36_off');
      }
    }
  }

  &.star-24 {
    .star-item {
      width: 20px;
      height: 20px;
      margin-right: 6px;
      background-size: 20px 20px;

      &.last-child {
        margin-right: 0;
      }

      &.on {
        bg-image-1('star24_on');
      }

      &.half {
        bg-image-1('star24_half');
      }

      &.off {
        bg-image-1('star24_off');
      }
    }
  }
}
</style>