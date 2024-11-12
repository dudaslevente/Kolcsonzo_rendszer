const express = require('express');
const db = require('./database');
const router = express.Router();
const uuid = require('uuid');
const moment = require("moment");

router.post('/newtargyak', (req, res) => {
    let { title, type, available } = req.body;

    if (!title || type=== undefined || available === undefined) {
        req.session.msg = 'Missing data!';
        req.session.severity = 'danger';
        return res.redirect('/newtargyak');
    }

    db.query(`INSERT INTO items (title, type, available) VALUES (?, ?, ?)`,
        [title, type ? 'könyv' : 'film', available ? 1 : 0],
        (err) => {
            if (err) {
                req.session.msg = 'Database error!';
                req.session.severity = 'danger';
                return res.redirect('/newtargyak');
            }

            req.session.msg = 'Item inserted!';
            req.session.severity = 'success';
            res.redirect('/newtargyak');
        }
    );
});

module.exports = router;