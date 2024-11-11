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
            res.redirect('/newdata');
            return
        }
        req.session.msg = 'Steps registered!';
        req.session.severity = 'success';
        res.redirect('/newdata');
        return
    })
 

});
