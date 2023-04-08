const express = require('express')
const router = express.Router()


const guidePageHandler = require('../router_handler/guide_page')


// 获取轮播图
router.get('/getGuidePageCarouselImages', guidePageHandler.getGuidePageCarouselImages)


module.exports = router
