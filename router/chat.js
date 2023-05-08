const express = require("express")
const router = express.Router()


const chatHandler = require("../router_handler/chat")


// sse测试
router.get('/chat', chatHandler.chat)

// 监听
router.get('/getChat', chatHandler.getChat)

// 发送
router.post('/postChat', chatHandler.postChat)


module.exports = router
