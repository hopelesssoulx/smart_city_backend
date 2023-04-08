const db = require('../db/index')


// 获取新闻列表
exports.getNewsList = (req, res) => {
    let sql = 'select id, title, subtitle, cover from news_list where status=1 order by id desc'
    if (req.query.title)
        sql = 'select id, title, subtitle, cover from news_list where title like ' + `'%${req.query.title}%'` + ' and status=1 order by id desc'
    if (req.query.type)
        sql = 'select id, title, subtitle, cover from news_list where type=' + `'${req.query.type}'` + ' and status=1 order by id desc'
    db.query(sql, (e, rs) => {
        if (e) return res.cc(e)

        return res.send({
            status: 200,
            total: rs.length,
            data: rs
        })
    })
}

// 获取已删除新闻列表
exports.getDeletedNewsList = (req, res) => {
    const sql = 'select id, title, subtitle, cover from news_list where status=-1 order by id desc'
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

// 新闻发布
exports.newsPub = (req, res) => {
    let sql;
    sql = 'select user_type from users where username=?'
    db.query(sql, req.auth.username, (e, rs) => {
        if (e) return res.cc(e)
        if (rs.length === 0) return res.cc('用户不存在')
        if (rs[0].user_type !== 1) {
            return res.cc('无发布权限')
        }
        else {
            sql = 'insert into news_list (title, subtitle, content, cover, type, pub_date) values (?, ?, ?, ?, ?, ?)'
            db.query(sql, [
                req.body.title,
                req.body.subtitle,
                req.body.content,
                req.body.cover,
                req.body.type,
                new Date().toLocaleDateString()
            ], (e, rs) => {
                if (e) return res.cc(e)
                if (rs.affectedRows !== 1) return res.cc(e)

                return res.send({
                    status: 200,
                    msg: '新闻发布成功'
                })
            })
        }
    })
}

// 新闻删除
exports.newsDel = (req, res) => {
    let sql;
    sql = 'select user_type from users where username=?'
    db.query(sql, req.auth.username, (e, rs) => {
        if (e) return res.cc(e)
        if (rs.length === 0) return res.cc('用户不存在')
        if (rs[0].user_type !== 1) {
            return res.cc('无删除权限')
        }
        else {
            sql = 'update news_list set status=-1 where id=?'
            db.query(sql, req.body.id, (e, rs) => {
                if (e) return res.cc(e)
                if (rs.affectedRows !== 1) return res.cc(e)

                return res.send({
                    status: 200,
                    msg: '新闻删除成功'
                })
            })
        }
    })
}

// 新闻重发布
exports.newsRePub = (req, res) => {
    let sql;
    sql = 'select user_type from users where username=?'
    db.query(sql, req.auth.username, (e, rs) => {
        if (e) return res.cc(e)
        if (rs.length === 0) return res.cc('用户不存在')
        if (rs[0].user_type !== 1) {
            return res.cc('无重发布权限')
        }
        else {
            sql = 'update news_list set status=1 where id=?'
            db.query(sql, req.body.id, (e, rs) => {
                if (e) return res.cc(e)
                if (rs.affectedRows !== 1) return res.cc(e)

                return res.send({
                    status: 200,
                    msg: '新闻重发布成功'
                })
            })
        }
    })
}

// 新闻编辑
exports.newsEdit = (req, res) => {
    let sql;
    sql = 'select user_type from users where username=?'
    db.query(sql, req.auth.username, (e, rs) => {
        if (e) return res.cc(e)
        if (rs.length === 0) return res.cc('用户不存在')
        if (rs[0].user_type !== 1) {
            return res.cc('无编辑权限')
        }
        else {
            sql = 'update news_list set title=?, subtitle=?, content=?, cover=?, type=?, pub_date=? where id=?'
            db.query(sql, [
                req.body.title,
                req.body.subtitle,
                req.body.content,
                req.body.cover,
                req.body.type,
                new Date().toLocaleDateString(),
                req.body.id
            ], (e, rs) => {
                if (e) return res.cc(e)
                if (rs.affectedRows !== 1) return res.cc(e)

                return res.send({
                    status: 200,
                    msg: '新闻修改成功'
                })
            })
        }
    })
}
