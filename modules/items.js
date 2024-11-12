const express = require('express');
const db = require('./database');
const router = express.Router();
const uuid = require('uuid');
const moment = require("moment");

router.post('/newtargyak', (req, res) => {
    let { title, type, available } = req.body;

    if (!title || !type || !available) {
        req.session.msg = 'Missing data!';
        req.session.severity = 'danger';
        return res.redirect('/newtargyak');
    }

    db.query(
        `INSERT INTO items (title, type, available) VALUES (?, ?, ?)`,
        [title, type, available],
        (err) => {
            if (err) {
                req.session.msg = 'Database error!';
                req.session.severity = 'danger';
                return res.redirect('/newtargyak');
            }
            if(type != "könyv"){
                type = "film"
            }else{
                type = "könyv"
            }

            if(available != 1){
                available = 0
            }else{
                available = 1
            }

            req.session.msg = 'Item inserted!';
            req.session.severity = 'success';
            res.redirect('/newtargyak');
        }
    );
});

module.exports = router;