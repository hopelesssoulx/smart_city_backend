const { PrismaClient } = require("@prisma/client")
const prisma = new PrismaClient()
var path = require('path');


var connections = []


// sse测试
exports.chat = (req, res) => {
    // res.sendFile(path.join(__dirname, '..', 'test', 'sse.html'))
    res.sendFile(path.join(__dirname, '../test/sse.html'))
}

// 监听
exports.getChat = async (req, res) => {
    res.writeHead(200, {
        "Content-type": "text/event-stream",
        "Cache-Control": "no-cache",
        Connection: "keep-alive",
    });

    connections.push({ res })
    setTimeout(() => {
        connections.shift()
    }, 1000 * 60 * 60);

    res.write("data: " + "chat init" + "\n\n")

    req.on("close", () => { })
};

// 发送
exports.postChat = async (req, res) => {
    connections.forEach((i) => {
        i.res.write('data: ' + `${req.body.msg}` + '\n\n')
    })

    return res.send({
        status: 200,
        msg: '消息发送成功'
    })
}