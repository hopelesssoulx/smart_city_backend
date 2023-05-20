const express = require("express")
const router = express.Router()


const multer = require('multer');


const userHandler = require('../router_handler/user')


const expressJoi = require('@escook/express-joi')
const {
    register_login_schema,
    updateUserPassword_schema } = require('../schema/user')


// 注册
router.post('/register', expressJoi(register_login_schema), userHandler.register)

// 登录
router.post('/login', expressJoi(register_login_schema), userHandler.login)

// 获取个人信息
router.get('/getUserInfo', userHandler.getUserInfo)

// 更新个人信息
router.post('/updateUserInfo', userHandler.updateUserInfo)

// 更新密码
router.post('/updateUserPassword', expressJoi(updateUserPassword_schema), userHandler.updateUserPassword)

// 获取用户头像
router.get('/getAvatar/*', userHandler.getAvatar)

// 上传用户头像
const upload = multer({
    dest: "./assets/images/uploadsTemp/"
});
router.post('/uploadAvatar', upload.single("avatar"), userHandler.uploadAvatar)


module.exports = router
