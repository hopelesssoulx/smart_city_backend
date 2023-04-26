const express = require('express')
const router = express.Router()


const multer = require('multer');


const carouselHandler = require('../router_handler/carousel')


// 获取首页轮播图地址
router.get('/getCarouselImages', carouselHandler.getCarouselImages)

// 获取首页轮播图图片
router.get('/getImages/*', carouselHandler.getImages)

// 上传首页轮播图图片
const upload = multer({
    dest: "./public/images/uploadsTemp/"
});
router.post('/uploadImages', upload.single("image"), carouselHandler.uploadImages)


module.exports = router
