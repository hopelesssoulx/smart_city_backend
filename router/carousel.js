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
    dest: "./assets/images/uploadsTemp/"
});
router.post('/uploadImages', upload.single("image"), carouselHandler.uploadImages)

// 删除首页轮播图图片
router.post('/deleteImages', carouselHandler.deleteImages)


module.exports = router
