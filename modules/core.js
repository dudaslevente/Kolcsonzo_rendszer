const express = require('express');
const ejs = require('ejs');
//const { route } = require('./users');
const router = express.Router();
const db = require('./database');
const moment = require('moment');

router.get('/', (req, res) => {
    ejs.renderFile('./views/index.ejs', { session: req.session }, (err, html)=>{
        if (err){
            console.log(err);
            return
        }
        req.session.msg = '';
        res.send(html);
    });
});

router.get('/login', (req, res) => {
    ejs.renderFile('./views/login.ejs', { session: req.session }, (err, html)=>{
        if (err){
            console.log(err);
            return
        }
        req.session.msg = '';
        res.send(html);
    });
});

router.get('/reg', (req, res) => {
    ejs.renderFile('./views/regist.ejs', { session: req.session }, (err, html)=>{
        if (err){
            console.log(err);
            return
        }
        req.session.msg = '';
        res.send(html);
    });
});


router.get('/logout', (req, res)=>{

    req.session.isLoggedIn = false;
    req.session.userID = null;
    req.session.userName = null;
    req.session.userEmail = null;
    req.session.userRole = null;
    req.session.msg = 'You are logged out!';
    req.session.severity = 'info';
    res.redirect('/');

});


router.get('/targyak', (req, res) => {
    if (req.session.isLoggedIn) {
        db.query(`SELECT * FROM items`,(err, results) => {
            if (err) {
                console.log(err);
                return;
            }
            results.forEach(item => {
                item.title = item.title
                item.available = item.available
                item.item_id = item.item_id
            });
 
            ejs.renderFile('./views/targyak.ejs', { session: req.session, results }, (err, html) => {
                if (err) {
                    console.log(err);
                    return;
                }
                req.session.msg = '';
                res.send(html);
            });
        });
        return;
    }
});

router.get('/newtargyak', (req, res) => {
    ejs.renderFile('./views/newtargyak.ejs', { session: req.session }, (err, html)=>{
        if (err){
            console.log(err);
            return
        }
        req.session.msg = '';
        res.send(html);
    });
});

router.get('/allUser', (req, res) => {
    if (req.session.isLoggedIn) {
        db.query(`SELECT * FROM users`,(err, results) => {
            //const membership_date = moment().format('YYYY-MM-DD');
            if (err) {
                console.log(err);
                return;
            }
            results.forEach(user => {
                user.name = user.name
                user.email = user.email
                user.role = user.role
                user.membership_date = moment().format('YYYY-MM-DD')
            });
 
            ejs.renderFile('./views/allUser.ejs', { session: req.session, results }, (err, html)=>{
                if (err){
                    console.log(err);
                    return
                }
                req.session.msg = '';
                res.send(html);
            });
        });
        return;
    }
});


module.exports = router;