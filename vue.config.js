const path = require('path');
function resolve(dir) {
    return path.join(__dirname, dir);
}
const appData = require("./data.json")
const seller = appData.seller
const goods = appData.goods
const ratings = appData.ratings

module.exports = {
    publicPath: '/',
    outputDir: 'dist',
    assetsDir: '',
    indexPath: 'index.html',
    filenameHashing: true,
    lintOnSave: false,
    // lintOnSave: process.env.NODE_ENV !== 'production',
    productionSourceMap: false,
    chainWebpack: (config) => {
        config.resolve.alias
            .set('@', resolve('src'))
            .set('components', resolve('src/components'))
            .set('common', resolve('src/common'))
        config.module
            .rule('images')
            .use('url-loader')
            .loader('url-loader')
            .tap(options => Object.assign(options, { limit: 1 }))
    },
    devServer: {
        open: process.platform === 'darwin',
        host: '0.0.0.0',
        port: 8080,
        https: false,
        hotOnly: false,
        open: true,
        overlay: {
            warnings: false,
            errors: false
        },
        before(app) {
            app.get('/api/seller', function (req, res) {
                res.json({
                    status: 1,
                    data: seller
                })
            })
            app.get('/api/goods', function (req, res) {
                res.json({
                    status: 1,
                    data: goods
                })
            })
            app.get('/api/ratings', function (req, res) {
                res.json({
                    status: 1,
                    data: ratings
                })
            })
        }
    }
}