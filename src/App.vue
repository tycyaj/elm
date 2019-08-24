<template>
  <div id="app">
    <t-Header :seller="seller"></t-Header>
    <div class="tab border-1px">
      <router-link :seller="seller" tag="li" to="/goods">商品</router-link>
      <router-link tag="li" to="/ratings">评论</router-link>
      <router-link tag="li" to="/seller">商家</router-link>
    </div>
    <router-view :seller="seller"></router-view>
  </div>
</template>
<script>

import tHeader from 'components/header/tHeader'
const ERR_OK = 0;
export default {
  data () {
    return {
      seller: {}
    }
  },
  components: {
    tHeader
  },
  created () {
    this.$http.get('/api/seller').then((res) => {
      const data = res.data
      if (res.status === 200 && data.status === 1) {
        this.seller = data.data
      }
    }).catch((err) => {
      console.log(err)
    })
  }
}
</script>
<style lang="stylus" scoped>
@import './assets/css/mixin.styl';

.tab {
  display: flex;
  width: 100%;
  height: 80px;
  line-height: 80px;
  background #fff;
  border-1px(rgba(7, 17, 27, 0.1));

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
