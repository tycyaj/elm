<template>
  <div>
    <div class="goods">
      <div class="menu-wrapper" ref="menuWrapper">
        <ul>
          <li
            class="menu-item"
            v-for="(item,index) in goods"
            :key="index"
            :class="{'current':currentIndex === index}"
            @click="selectMenu(index,$event)"
          >
            <span class="text border-1px-bottom">
              <span v-show="item.type > 0" class="icon" :class="classMap[item.type]"></span>
              {{item.name}}
            </span>
          </li>
        </ul>
      </div>
      <div class="foods-wrapper" ref="foodsWrapper">
        <ul>
          <li class="food-list" ref="foodListHook" v-for="(item,index) in goods" :key="index">
            <h1 class="title">{{item.name}}</h1>
            <ul>
              <li @click="selectFood(food,$event)"
                  class="food-item border-1px-bottom"
                  v-for="(food,index) in item.foods" 
                  :key="index"
              >
                <div class="icon">
                  <img :src="food.icon" />
                </div>
                <div class="food-content">
                  <h2 class="name">{{food.name}}</h2>
                  <p class="desc" v-show="food.description">{{food.description}}</p>
                  <div class="extra">
                    <span class="month">月售{{food.sellCount}}份</span>
                    <span>好评率{{food.rating}}%</span>
                  </div>
                  <div class="price">
                    <span class="now">￥{{food.price}}</span>
                    <span class="old" v-show="food.oldPrice">￥{{food.oldPrice}}</span>
                  </div>
                  <div class="cartcontrol-warpper">
                    <cartcontrol @add="cartAdd"  :food="food"></cartcontrol>
                  </div>
                </div>
              </li>
            </ul>
          </li>
        </ul>
      </div>
      <shopcart ref='shopCart' :select-foods="selectFoods" :delivery-price="seller.deliveryPrice" :min-price="seller.minPrice"></shopcart>
    
    </div>
    <food ref="foodCom" @add="cartAdd" :food="foodSelectFood"></food>
  </div>
</template>
<script>
import BScroll from "better-scroll";
import shopcart from "components/shopcart/shopcart";
import cartcontrol from "components/cartcontrol/cartcontrol";
import food from 'components/food/food'
export default {
  name: "goods",
  data() {
    return {
      goods: [],
      meunScroll: null,
      foodsScroll: null,
      listHeight: [], // 元素距离顶部的高度集合
      scrollY: 0,// 滑动时的高度
      //food组件
      foodSelectFood:{}
    };
  },
  components: {
    shopcart,
    cartcontrol,
    food
  },
  props: {
    seller: {
      type: Object
    }
  },
  created() {
    this.classMap = ["decrease", "discount", "special", "invoice", "guarantee"];
    this.$http
      .get("/api/goods")
      .then(res => {
        const data = res.data;
        if (res.status === 200 && data.status === 1) {
          this.goods = data.data;
          this.$nextTick(() => {
            this._initScroll();
            this._calculateHeight();
          });
        }
      })
      .catch(err => {
        console.log(err);
      });
  },
  methods: {
    // 向food组件传递数据
    selectFood(food,event){
       if (!event._constructed) {
        return;
      }
      this.foodSelectFood = food
      this.$refs.foodCom.show()
    },
    cartAdd(el){
      //el参数是子组件cartcontrol传递过来的DOM元素
      //通过ref拿到子组件shopcart的drop方法传递DOM元素
      this.$refs.shopCart.drop(el)
    },
    _initScroll() {
      this.meunScroll = new BScroll(this.$refs.menuWrapper, {
        click: true
      });
      this.foodsScroll = new BScroll(this.$refs.foodsWrapper, {
        probeType: 3,
        click: true
      });
      this.foodsScroll.on("scroll", pos => {
        // 滑动时的高度
        this.scrollY = Math.abs(Math.round(pos.y));
      });
    },
    _calculateHeight() {
      // 拿到每个元素li
      let foodList = this.$refs.foodListHook;
      let height = 0;
      this.listHeight.push(height);
      for (let i = 0; i < foodList.length; i++) {
        let item = foodList[i];
        //拿到foodList中每一项的高度
        height += item.clientHeight;
        this.listHeight.push(height);
      }
    },
    selectMenu(index, event) {
      if (!event._constructed) {
        return;
      }
      let foodList = this.$refs.foodListHook;
      let el = foodList[index];
      this.foodsScroll.scrollToElement(el, 300);
    }
  },
  computed: {
    // 当 this.scrollY 变化时改变
    currentIndex() {
      for (let i = 0; i < this.listHeight.length; i++) {
        let height1 = this.listHeight[i];
        let height2 = this.listHeight[i + 1];
        if (!height2 || (this.scrollY >= height1 && this.scrollY < height2)) {
          return i;
        }
      }
      return 0;
    },
    //根据cartcontrool组件$set的count属性,拿到当前选中的加入购物车的数据集合
    selectFoods() {
      let foods = [];
      this.goods.forEach(good => {
        good.foods.forEach(food => {
          if (food.count) {
            foods.push(food)
          }
        })
      })
      return foods
    }
  }
};
</script>
<style lang="stylus" scoped>
@import '../../assets/css/mixin.styl';

.goods {
  display: flex;
  position: absolute;
  top: 345px;
  bottom: 94px;
  width: 100%;
  overflow: hidden;

  .menu-wrapper {
    flex: 0 0 160px;
    width: 160px;
    background: #f3f5f7;

    .menu-item {
      display: table;
      width: 118px;
      height: 110px;
      line-height: 28px;
      padding: 0 22px;
      margin-top: -1PX;

      &.current {
        position: relative;
        z-index: 10;
        background: #fff;
        margin-top: -1PX;

        .text {
          border-none($color);
        }
      }

      .icon {
        display: inline-block;
        vertical-align: text-top;
        width: 28px;
        height: 28px;
        margin-right: 0px;
        background-size: 28px 28px;
        background-repeat: no-repeat;

        &.decrease {
          bg-image('decrease_3');
        }

        &.discount {
          bg-image('discount_3');
        }

        &.special {
          bg-image('special_3');
        }

        &.invoice {
          bg-image('invoice_3');
        }

        &.guarantee {
          bg-image('guarantee_3');
        }
      }

      .text {
        display: table-cell;
        font-size: 24px;
        line-height: 30px;
        width: 112px;
        vertical-align: middle;
        border-1px-bottom(rgba(7, 17, 27, 0.1));
      }
    }
  }

  .foods-wrapper {
    flex: 1;
    background: #fff;

    .food-list {
      .title {
        padding-left: 28px;
        height: 60px;
        line-height: 60px;
        border-left: 1px solid rgba(7, 17, 27, 0.1);
        font-size: 24px;
        color: rgb(143, 153, 159);
        background: #f3f5f7;
      }

      .food-item {
        padding: 30px;
        display: flex;
        border-1px-bottom(rgba(7, 17, 27, 0.1));

        &:last-child {
          border-none($color);
        }

        .icon {
          flex: 0 0 120px;
          padding-right: 20px;

          img {
            width: 100%;
          }
        }

        .food-content {
          flex: 1;

          .name {
            margin-top: 4px;
            margin-bottom: 16px;
            font-size: 28px;
            line-height: 28px;
            color: rgb(7, 17, 27);
          }

          .desc {
            font-size: 20px;
            color: rgb(147, 153, 159);
            margin-bottom: 16px;
          }

          .extra {
            font-size: 20px;
            color: rgb(147, 153, 159);

            .month {
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
            }

            .old {
              text-decoration: line-through;
              font-size: 18px;
            }
          }

          .cartcontrol-warpper {
            position: absolute;
            bottom: 0px;
            right: 0px;
          }
        }
      }
    }
  }
}
</style>