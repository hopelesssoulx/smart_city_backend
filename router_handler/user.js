const db = require("../db")
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')
const jwtConfig = require('../jwt_config')
var path = require("path");
var fs = require('fs');
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

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
                    code: 200,
                    msg: '注册成功'
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
        if (rs.length !== 1) return res.cc('用户不存在')
        if (!bcrypt.compareSync(req.body.password, rs[0].password)) return res.cc('用户名或密码错误')

        return res.send({
            code: 200,
            msg: '登录成功',
            username: rs[0].username,
            user_type: rs[0].user_type,
            id: rs[0].id,
            avatar: rs[0].avatar,
            token: 'Bearer ' + jwt.sign(
                { ...rs[0], password: '', avatar: '' },         // req.auth
                jwtConfig.jwtKey,
                { expiresIn: jwtConfig.expiresIn }
            )
        })
    })
}

// 获取个人信息
exports.getUserInfo = (req, res) => {
    const sql = 'select username, email, user_type, avatar from users where username=?'
    db.query(sql, req.auth.username, (e, rs) => {
        if (e) return res.cc(e)
        if (rs.length !== 1) return res.cc('用户不存在')

        return res.send({
            code: 200,
            msg: '获取个人信息成功',
            data: rs
        })
    })
}

// 更新个人信息
exports.updateUserInfo = async (req, res) => {
    try {
        await prisma.users.update({
            where: {
                id: req.auth.id
            },
            data: {
                email: req.body.email,
                avatar: req.body.avatar
            }
        })
    } catch (e) {
        console.log(e);
        return res.cc('更新个人信息失败')
    }

    return res.send({
        code: 200,
        msg: '更新个人信息成功'
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
                    code: 200,
                    msg: '更新密码成功'
                })
            }
        )
    })
}

// 获取用户头像
exports.getAvatar = (req, res) => {
    res.sendFile(path.join(__dirname, `../assets/images/userAvatar/${req.params[0]}`))
}

// 上传用户头像
exports.uploadAvatar = (req, res) => {
    const date = new Date().toUTCString().replace(/\s+/g, '_').replace(/\:/g, '_').replace(',', '')
    const name = req.file.originalname
    const extname = path.extname(req.file.originalname).toLowerCase()

    const tempPath = req.file.path;
    const targetPath = path.join(__dirname, `../assets/images/userAvatar/${date}__${name}`);

    if (['.jpg', '.png', 'jpeg', 'webp'].includes(extname)) {
        fs.rename(tempPath, targetPath, e => {
            if (e) return res.cc(e);

            let sql = `update users set avatar='${date}__${name}' where id=?`
            db.query(sql, req.auth.id, (e, rs) => {
                if (e) return res.cc(e)
                if (rs.affectedRows !== 1) return res.cc(e)
            })

            return res.send({
                status: 200,
                avatar: `${date}__${name}`,
                msg: '修改头像成功'
            })
        });
    } else {
        fs.unlink(tempPath, e => {
            if (e) return res.cc(e);

            return res.cc('修改头像失败')
        });
    }
}
