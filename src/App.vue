<template>
  <div id="app">
    <t-Header :seller="seller"></t-Header>
    <div class="tab border-1px-bottom">
      <router-link :seller="seller" tag="li" to="/goods">商品</router-link>
      <router-link tag="li" to="/ratings">评论</router-link>
      <router-link tag="li" to="/seller">商家</router-link>
    </div>
    <keep-alive>
      <router-view :seller="seller"></router-view>
    </keep-alive>
    <div>{{this.seller.id}}</div>
  </div>
</template>
<script>
import { urlParse } from "common/js/util";
import tHeader from "components/header/tHeader";
export default {
  data() {
    return {
      seller: {
        id: (() => {
          let queryParam = urlParse();
          return queryParam.id;
        })()
      }
    };
  },
  components: {
    tHeader
  },
  created() {
    this.$http
      .get("/api/seller?id" + this.seller.id)
      // .get("/api/seller", {
      //   params: {
      //     id: 12325
      //   }
      // })
      .then(response => {
        const data = response.data;
        if (response.status === 200 && data.status === 1) {
          this.seller = data.data;
          //多此一举 util格式化url方法
          this.seller = Object.assign({}, this.seller,{id:"123"});
        }
      })
      .catch(err => {
        console.log(err);
      });
  }
};
</script>
<style lang="stylus" scoped>
@import './assets/css/mixin.styl';

.tab {
  display: flex;
  width: 100%;
  height: 80px;
  line-height: 80px;
  background: #fff;
  border-1px-bottom(rgba(7, 17, 27, 0.1));

  li {
    width: 100%;
    flex: 1;
    text-align: center;
    font-size: 28px;
    color: rgb(77, 85, 93);
  }

  .active {
    color: rgb(240, 20, 20);
  }
}
</style>
