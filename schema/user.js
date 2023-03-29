const joi = require('joi')


const username = joi.string().alphanum().min(1).max(10).required()
const password = joi.string().pattern(/^[\S]{6,12}$/).required()

// 注册
// 登录
exports.register_login_schema = {
    body: {
        username,
        password
    }
}

// 更新密码
exports.updateUserPassword_schema = {
    body: {
        oldPassword: password,
        newPassword: joi.not(joi.ref('oldPassword')).concat(password)
    }
}
