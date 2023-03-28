const express = require('express')
const router = express.Router()


const newsHandler = require('../router_handler/news')


// 获取新闻列表
router.get('/getNewsList', newsHandler.getNewsList)


module.exports = router;
