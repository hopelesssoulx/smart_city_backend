const express = require('express')
const app = express()


const newsRouter = require('./router/news')
app.use('/news', newsRouter)


app.listen(3001, function () {
    console.log('smart city server running at http://127.0.0.1:3001/')
})
