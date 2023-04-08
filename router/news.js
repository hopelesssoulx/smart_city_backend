const express = require('express')
const router = express.Router()


const newsHandler = require('../router_handler/news')


// 获取新闻列表
router.get('/getNewsList', newsHandler.getNewsList)

// 获取已删除新闻列表
router.get('/getDeletedNewsList', newsHandler.getDeletedNewsList)

// 获取新闻分类
router.get('/getNewsCategory', newsHandler.getNewsCategory)

// 获取新闻详情
router.get('/getNewsDetail/*', newsHandler.getNewsDetail)

// 新闻发布
router.post('/newsPub', newsHandler.newsPub)

// 新闻删除
router.post('/newsDel', newsHandler.newsDel)

// 新闻发布
router.post('/newsRePub', newsHandler.newsRePub)

// 新闻编辑
router.post('/newsEdit', newsHandler.newsEdit)


module.exports = router
