const express = require('express');
const db = require('./database');
var CryptoJS = require("crypto-js");
const uuid = require('uuid');
const router = express.Router();
const passwdRegExp = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;

module.exports = router;