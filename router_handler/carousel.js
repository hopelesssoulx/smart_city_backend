var path = require("path");
var fs = require('fs');
const db = require('../db/index')

// 获取首页轮播图地址
exports.getCarouselImages = (req, res) => {
    const sql = 'select * from carousel where status=1'
    db.query(sql, (e, rs) => {
        if (e) return res.cc(e)

        return res.send({
            status: 200,
            msg: '获取首页轮播图成功',
            total: rs.length,
            data: rs
        })
    })
}

// 获取首页轮播图图片
exports.getImages = (req, res) => {
    // const filePath = path.resolve(__dirname, `../assets/images/carousel/${req.params[0]}`)
    // if (fs.existsSync(filePath)) {
    //     res.set('content-type', { "png": "image/png", "jpg": "image/jpeg" })
    //     var stream = fs.createReadStream(filePath)
    //     var responseData = []
    //     if (stream) {
    //         stream.on('data', function (chunk) {
    //             responseData.push(chunk)
    //         })
    //         stream.on('end', function () {
    //             var finalData = Buffer.concat(responseData)
    //             res.write(finalData)
    //             res.end()
    //         })
    //     }
    // } else {
    //     res.cc('文件不存在')
    // }
    res.sendFile(path.join(__dirname, `../assets/images/carousel/${req.params[0]}`))
}

// 上传首页轮播图图片
exports.uploadImages = (req, res) => {
    let sql;
    sql = 'select user_type from users where username=?'
    db.query(sql, req.auth.username, (e, rs) => {
        if (e) return res.cc(e)
        if (rs.length === 0) return res.cc('用户不存在')
        if (rs[0].user_type !== 1) return res.cc('无上传权限')
        if (!req.file) return res.cc('未选择文件')

        upload()
    })

    const upload = () => {
        const date = new Date().toUTCString().replace(/\s+/g, '_').replace(/\:/g, '_').replace(',', '')
        const name = req.file.originalname
        const extname = path.extname(req.file.originalname).toLowerCase()

        const tempPath = req.file.path;
        const targetPath = path.join(__dirname, `../assets/images/carousel/${date}__${name}`);

        if (['.png', '.jpg'].includes(extname)) {
            fs.rename(tempPath, targetPath, e => {
                if (e) return res.cc(e);

                let sql = `insert into carousel (image) values ('${date}__${name}')`
                db.query(sql, (e, rs) => {
                    if (e) return res.cc(e)
                    if (rs.affectedRows !== 1) return res.cc(e)
                })

                res
                    .status(200)
                    .contentType("text/plain")
                    .end("图片上传成功");
            });
        } else {
            fs.unlink(tempPath, e => {
                if (e) return res.cc(e);

                res
                    .status(403)
                    .contentType("text/plain")
                    .end("Only .jpg & .png files are allowed!");
            });
        }
    }
}

// 删除首页轮播图图片
exports.deleteImages = (req, res) => {
    let sql;
    sql = 'select user_type from users where username=?'
    db.query(sql, req.auth.username, (e, rs) => {
        if (e) return res.cc(e)
        if (rs.length === 0) return res.cc('用户不存在')
        if (rs[0].user_type !== 1) return res.cc('无删除权限')

        del()
    })

    const del = () => {
        sql = 'update carousel set status=-1 where id=?'
        db.query(sql, req.body.id, (e, rs) => {
            if (e) return res.cc(e)
            if (rs.affectedRows !== 1) return res.cc(e)

            return res.send({
                status: 200,
                msg: '删除首页轮播图成功'
            })
        })
    }
}
