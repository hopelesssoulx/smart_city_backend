const express = require('express')
const router = express.Router()


const newsHandler = require('../router_handler/news')


// 获取新闻列表
router.get('/getNewsList', newsHandler.getNewsList)

// 获取新闻分类
router.get('/getNewsCategory', newsHandler.getNewsCategory)

//获取新闻详情
router.get('/getNewsDetail/*', newsHandler.getNewsDetail)


module.exports = router;
