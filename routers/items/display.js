const express = require('express');
const DB = require('../../modules/db');

const router = express.Router();

router.get('/list',(req,res)=>{
    DB.find('items',{},(error,result)=>{
        if (error) throw error;
        res.render('list',{username:req.session.username,items:result});
    });
});

module.exports = router;