const express = require('express')
const app = express()


const cors = require('cors')
app.use(cors())


app.use(express.json({ limit: '25mb' }));

// 响应数据的中间件
app.use((req, res, next) => {
    res.cc = function (e, status = -1) {
        res.send({
            status,
            msg: e instanceof Error ? e.msg : e,
        })
    }
    next()
})


// 错误中间件
const joi = require('@hapi/joi')
app.use((e, req, res, next) => {
    // 数据验证失败
    if (e instanceof joi.ValidationError) return res.send(e)
    // 未知错误
    return res.send(e)
})


// token中间件
const { expressjwt: expressJWT } = require('express-jwt')
const jwtConfig = require('./jwt_config')
app.use(expressJWT({ secret: jwtConfig.jwtKey, algorithms: ['HS256'] })
    .unless({
        path: [
            // /^\//,
            /^\/api\/user\/register/,
            /^\/api\/user\/login/,
            /^\/api\/news\/getNewsList/,
            /^\/api\/news\/getDeletedNewsList/,
            /^\/api\/news\/getNewsCategory/,
            /^\/api\/news\/getNewsDetail/,
            /^\/api\/guidePage/,
            /^\/api\/carousel\/getCarouselImages/,
            /^\/api\/carousel\/getImages\/*/,
        ]
    }))


const guidePageRouter = require('./router/guide_page')
app.use('/api/guidePage', guidePageRouter)
const carouselRouter = require('./router/carousel')
app.use('/api/carousel', carouselRouter)
const newsRouter = require('./router/news')
app.use('/api/news', newsRouter)
const userRouter = require('./router/user')
app.use('/api/user', userRouter)



app.listen(3001, function () {
    console.log('smart city server running at http://127.0.0.1:3001/')
})
