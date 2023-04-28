// const db = require('../db/index')


// exports.getGuidePageCarouselImages = (req, res) => {
//     const sql = 'select * from guide_page'
//     db.query(sql, (e, rs) => {
//         if (e) return res.cc(e)

//         return res.send({
//             status: 200,
//             msg: '获取引导页轮播图成功',
//             total: rs.length,
//             data: rs
//         })
//     })
// }




const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()


exports.getGuidePageCarouselImages = async (req, res) => {
    const drafts = await prisma.guide_page.findMany()
    return res.send({
        status: 200,
        msg: '获取引导页轮播图成功',
        total: drafts.length,
        data: drafts
    })
}
