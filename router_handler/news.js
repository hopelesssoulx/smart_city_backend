const db = require('../db/index')


// 获取新闻列表
exports.getNewsList = (req, res) => {
    const sql = 'select id, title, subtitle, cover, type, pubdate from news_list'
    db.query(sql, (e, rs) => {
        if (e) res.send(e)
        if (rs.length === 0) res.send(e)

        res.send(rs)
    })
}
