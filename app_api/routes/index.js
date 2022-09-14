const express = require('express');
const router = express.Router();
const jwt = require("jsonwebtoken");


const auth = (req, res, next) => {
    //console.log(req.headers.authorization);
    if (req.headers && req.headers.authorization && req.headers.authorization.split(' ')[0] === 'Bearer') {
        jwt.verify(req.headers.authorization.split(' ')[1], process.env.API_SECRET, function (err, decode) {
            if (decode)
                console.log(decode);
            next();
        });
    }

};


router.route('/')

module.exports = router;
