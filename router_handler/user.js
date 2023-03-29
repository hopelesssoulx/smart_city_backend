const db = require("../db");
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtConfig = require('../jwt_config')

needTotal = false


// 注册
exports.register = (req, res) => {
    const sql1 = 'select username from users where username=?'
    db.query(sql1, req.body.username, (e, rs) => {
        if (e) return res.cc(e)
        if (rs.length > 0) return res.cc('已注册')

        const sql2 = 'insert into users set ?'
        db.query(
            sql2, {
            username: req.body.username,
            password: bcrypt.hashSync(req.body.password, 10)
        },
            (e, rs) => {
                if (e) return res.cc(e)
                if (rs.affectedRows !== 1) return res.cc(e)

                return res.send({
                    code: 200
                })
            }
        )
    })
}

// 登录
exports.login = (req, res) => {
    const sql = 'select * from users where username=?'
    db.query(sql, req.body.username, (e, rs) => {
        if (e) return res.cc(e)
        if (rs.length !== 1) res.cc(e)
        if (!bcrypt.compareSync(req.body.password, rs[0].password)) return res.cc('用户名或密码错误')

        return res.send({
            code: 200,
            token: 'Bearer ' + jwt.sign(
                { ...rs[0], password: '' },         // req.auth
                jwtConfig.jwtKey,
                { expiresIn: jwtConfig.expiresIn }
            )
        })
    })
}

// 获取个人信息
exports.getUserInfo = (req, res) => {
    const sql = 'select username, email from users where username=?'
    db.query(sql, req.auth.username, (e, rs) => {
        if (e) return res.cc(e)
        if (rs.length !== 1) return res.cc('用户不存在')

        return res.send({
            code: 200,
            data: rs
        })
    })
}

// 更新密码
exports.updateUserPassword = (req, res) => {
    const sql = 'select * from users where id=?'
    db.query(sql, req.auth.id, (e, rs) => {
        if (e) return res.cc(e)
        if (rs.length !== 1) return res.cc('用户不存在')
        if (!bcrypt.compareSync(req.body.oldPassword, rs[0].password)) return res.cc('旧密码错误')

        const sql = 'update users set password=? where id=?'
        db.query(
            sql, [
            bcrypt.hashSync(req.body.newPassword, 10),
            req.auth.id],
            (e, rs) => {
                if (e) return res.cc(e)

                return res.send({
                    code: 200
                })
            }
        )
    })
}
