const db = require('../db/index')


exports.getGuidePageCarouselImages = (req, res) => {
    const sql = 'select * from guide_page'
    db.query(sql, (e, rs) => {
        if (e) return res.cc(e)

        return res.send({
            status: 200,
            total: rs.length,
            data: rs
        })
    })
}
