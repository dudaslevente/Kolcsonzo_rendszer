const express = require('express');
const db = require('./database');
const router = express.Router();
const uuid = require('uuid');
const moment = require("moment");

router.post('/reg', (req, res) => {
    db.query(`INSERT INTO items (item_id, title, type, avalable) VALUES(?, ?, ?, ?)`, 
	[uuid.v4(),title, type, available], 
        (err)=>{
        if (err){
            req.session.msg = 'Database error!';
            req.session.severity = 'danger';
            res.redirect('/newtargyak');
            return
        }
        req.session.msg = 'Item registered!';
        req.session.severity = 'success';
        res.redirect('/newtargyak');
        return
    })
});
router.get('/itemdatas', (req, res) => {

    console.log(req.session.userID);
    db.query(`SELECT * FROM stepdatas WHERE userID=?`, [req.session.userID,], (err, results)=>{
        if (err) {
            res.send(err);
        }

        else{
            results.forEach(item => {
                item.date = moment(results.date).format("YYYY-MM-DD")
            });
            res.send(results);
        }
    });
 

});