const express = require('express');
const db = require('./database');
var CryptoJS = require("crypto-js");
const uuid = require('uuid');
const moment = require('moment');
const router = express.Router();
const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

router.post('/reg',(req , res)=>{
    
    let { name, email, passwd, confirm } = req.body;
    if (!name || !email || !passwd || !confirm) {
        req.session.msg = 'Missing data!';
        req.session.severity = 'danger';
        res.redirect('/reg');
        return
    }
    if (passwd != confirm){
        req.session.msg = 'Passwords dont match!';
        req.session.severity = 'danger';
        res.redirect('/reg');
        return
    }
    if (!passwd.match(passwdRegExp)){
        req.session.msg = 'Password is weak!';
        req.session.severity = 'danger';
        res.redirect('/reg'); 
        return
    }

    db.query(`SELECT * FROM users WHERE email=?`, [email], (err, results)=>{
        if (err){
            console.error('Database query error:', err);
            req.session.msg = 'This e-mail already registered!';
            req.session.severity = 'danger';
            res.redirect('/reg');
            return
        }
        // Az aktuális dátum beállítása
        const membershipDate = moment().format('YYYY-MM-DD');

        db.query(`INSERT INTO users (user_id, name, email, passwd ,membership_date , role) VALUES(?, ?, ?, SHA1(?), ?,'user')`, 
            [uuid.v4(), name, email, passwd ,membershipDate ], (err, results)=>{
            if (err){
                console.error('Database query error:', err);
                req.session.msg = 'Database error!';
                req.session.severity = 'danger';
                res.redirect('/reg');
                return
            }
            req.session.msg = 'User registered!';
            req.session.severity = 'success';
            res.redirect('/');
            return
            
        })
        
    });
})

router.post('/login',(req , res)=>{
    let { email, passwd } = req.body;

    if (!email || !passwd) {
        req.session.msg = 'Missing data!';
        req.session.severity = 'danger';
        res.redirect('/');
        return
    }
    db.query(`SELECT * FROM users WHERE email=? AND passwd=?`, [email, CryptoJS.SHA1(passwd).toString(), role], (err, results)=>{
        if (err){
            req.session.msg = 'Database error!';
            req.session.severity = 'danger';
            res.redirect('/');
            return
        }
        if (results == 0){
            req.session.msg = 'Invalid credentials!';
            req.session.severity = 'danger';
            res.redirect('/');  
            return
        }
        req.session.msg = 'You are logged in!';
        req.session.severity = 'info';

        req.session.isLoggedIn = true;
        req.session.userID = results[0].user_id;
        req.session.userName = results[0].name;
        req.session.userEmail = results[0].email;
        req.session.userMembershipD = results[0].membership_date;
        req.session.userRole = results[0].role;

        console.log(req.session);
        if(req.session.userRole =='user'){
            res.redirect('/targyak');
        }
        else{
            res.redirect('/newtargyak');
        }
        
        return
    });

})
module.exports = router;