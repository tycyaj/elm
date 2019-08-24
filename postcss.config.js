module.exports = {
  plugins: {
    autoprefixer: {},
    'postcss-pxtorem':{
      rootValue:37.5,
      propList:['*'],  
      mediaQuery:false, 
      minPixelValue:1
    }
  }
}
