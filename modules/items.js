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


router.post('/kolcsonzes', (req, res) => {
    const userId = req.body.user_id;
    const itemId = req.body.item_id;
    const rentalDate = moment().format('YYYY-MM-DD');
    const returnDate = moment().add(3, 'days').format('YYYY-MM-DD');

    
    db.query(
        `INSERT INTO rentals (user_id, item_id, rental_date, return_date) VALUES (?, ?, ?, NULL)`,
        [userId, itemId, rentalDate],
        (err, results) => {
            if (err) {
                req.session.msg = 'Database error while creating rental!';
                req.session.severity = 'danger';
                return res.redirect('/');
            }

            // Update item to set available = false
            db.query(
                `UPDATE items SET available = false WHERE item_id = ?`,
                [itemId],
                (err) => {
                    if (err) {
                        req.session.msg = 'Database error while updating item availability!';
                        req.session.severity = 'danger';
                        return res.redirect('/');
                    }

                    // Success
                    req.session.msg = 'Item rented successfully!';
                    req.session.severity = 'info';
                    res.redirect('/targyak');
                }
            );
        }
    );
});
router.post('/return', (req, res) => {
    const rentalId = req.body.rental_id;
    const itemId = req.body.item_id;
    const returnDate = moment().format('YYYY-MM-DD');

    
    db.query(
        `UPDATE rentals SET return_date = ? WHERE rental_id = ?`,
        [returnDate, rentalId],
        (err) => {
            if (err) {
                req.session.msg = 'Database error while processing return!';
                req.session.severity = 'danger';
                return res.redirect('/targyak');
            }

            // Update item to set available = true
            db.query(
                `UPDATE items SET available = true WHERE item_id = ?`,
                [itemId],
                (err) => {
                    if (err) {
                        req.session.msg = 'Database error while updating item availability!';
                        req.session.severity = 'danger';
                        return res.redirect('/targyak');
                    }

                    
                    req.session.msg = 'Item returned successfully!';
                    req.session.severity = 'info';
                    res.redirect('/targyak');
                }
            );
        }
    );
});

module.exports = router;