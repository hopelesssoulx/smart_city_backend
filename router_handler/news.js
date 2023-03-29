const db = require('../db/index')


const needTotal = true


// 获取新闻列表
exports.getNewsList = (req, res) => {
    const sql = 'select id, title, subtitle, cover from news_list'
    db.query(sql, (e, rs) => {
        if (e) return res.cc(e)

        return res.send({
            status: 200,
            total: rs.length,
            data: rs
        })
    })
}

// 获取新闻分类
exports.getNewsCategory = (req, res) => {
    const sql = 'select * from news_category'
    db.query(sql, (e, rs) => {
        if (e) return res.cc(e)

        return res.send({
            status: 200,
            total: rs.length,
            data: rs
        })
    })
}

// 获取新闻详情
exports.getNewsDetail = (req, res) => {
    const sql = 'select * from news_list where id=?'
    db.query(sql, req.params[0], (e, rs) => {
        if (e) return res.cc(e)

        return res.send({
            status: 200,
            data: rs
        })
    })
}
