// const KOA = require('koa')
// const path = require('path')
// const proxy = require('http-proxy-middleware')
// const axios = require('axios')
// const app = new KOA()

// app.use(async ctx=>{
//     // if (ctx.url.includes('/api/getQuestions')) {
//     //     return proxy({
//     //         target: 'http://hack.shebao.net', // 服务器地址
//     //         changeOrigin: true,
//     //         // secure: false,
//     //         // pathRewrite: {
//     //         //     '^/v1': '/mobile/v1'
//     //         // }
//     //     })(ctx.req, ctx.res, next)
//     // }else{
//     //     ctx.body = '嘿嘿'
//     // }
// })

// app.listen(3000,()=>{
//     let time = new Date().getTime()
//     getQ(1)
// })

const num = 5
const time = new Date().getTime()
// const arrTrans = require('./shudu');

// const request = require('request');
// request.get({url: `http://hack.shebao.net/api/getQuestions?group=JS2&quantity=${num}`},
//     function (error, response, body) {
//         console.log('---getTime----', new Date().getTime() - time);
//         // console.log(response);
//         // if (response.statusCode == 200) {
//         //     console.log(body);
//         // } else {
//         //     console.log(response.statusCode);
//         // }
//     }
// );

const http = require('http')
http.get(`http://hack.shebao.net/api/getQuestions?group=JS2&quantity=${num}`, (resp) => {
    console.log('---getTime----', new Date().getTime() - time);
    console.log(resp.req.response);
    console.log(resp.req.responseContent);
})
