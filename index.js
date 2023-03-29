const express = require('express')
const app = express()


app.use(express.json());


// 响应数据的中间件
app.use((req, res, next) => {
    res.cc = function (e, status = -1) {
        res.send({
            status,
            message: e instanceof Error ? e.message : e,
        })
    }
    next()
})


// 错误中间件
const joi = require('@hapi/joi')
app.use((e, req, res, next) => {
    // 数据验证失败
    if (e instanceof joi.ValidationError) return res.cc(e)
    // 未知错误
    res.cc(e)
})


// token中间件
const { expressjwt: expressJWT } = require('express-jwt')
const jwtConfig = require('./jwt_config')
app.use(expressJWT({ secret: jwtConfig.jwtKey, algorithms: ['HS256'] })
    .unless({
        path: [
            /^\/api\/user\/register/,
            /^\/api\/user\/login/,
            /^\/api\/news\/getNewsList/,
            /^\/api\/news\/getNewsCategory/,
            /^\/api\/news\/getNewsDetail/,
            /^\/api\/guidePage/]
    }))


const guidePageRouter = require('./router/guide_page')
app.use('/api/guidePage', guidePageRouter)
const newsRouter = require('./router/news')
app.use('/api/news', newsRouter)
const userRouter = require('./router/user');
app.use('/api/user', userRouter)


app.listen(3001, function () {
    console.log('smart city server running at http://127.0.0.1:3001/')
})
