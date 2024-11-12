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
        res.redirect('/newtargyak');
        return
    }

    db.query(`SELECT * FROM items WHERE item_id=?`, [req.session.item_id, title, type, available], (err, results) => {
        if (err){
            req.session.msg = 'Database error!';
            req.session.severity = 'danger';
            res.redirect('/newtargyak');
            return
        }

        db.query(`INSERT INTO items (item_id, title, type, available) VALUES(?,?,?,?)`, [req.session.item_id, title, type, available], (err, results)=>{
            if (err){
                req.session.msg = 'Database error!';
                req.session.severity = 'danger';
                res.redirect('/newtargyak');
                return
            }
            req.session.msg = 'Item inserted!';
            req.session.severity = 'success';
            res.redirect('/newtargyak');
            return
        });
        return
    });
});

module.exports = router;