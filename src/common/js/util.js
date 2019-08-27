/**
 * 解析url参数
 * @example ?id=123&a=b
 * @return Object {id:123,a:b}
 */
export function urlParse() {
  let url = window.location.search;
  let obj = {};
  // 包含?或者&字符
  let reg = /[?&][^?&]+=[^?&]+/g;
  let arr = url.match(reg)
  //['?id=123','&a=b']
  if (arr) {
    arr.forEach((item) => {
      //item ?id=123  &a=b
      let tempArr = item.substring(1).split('=')
      // tempArr ["id", "123"]
      let key = decodeURIComponent(tempArr[0])
      let val = decodeURIComponent(tempArr[1])
      obj[key] = val;
    })
  }
  return obj
}