const express = require('express');
const md5 = require('md5');
const DB = require('../../modules/db');

const router = express.Router();



router.get('/',(req,res)=>{
    res.render('login',{warning:'',errorClass:''});
});

router.get('/doLogin',(req,res)=>{
    var username = req.query.username;
    req.query.password=md5(req.query.password);
    DB.find('users',req.query,(error,data)=>{
        if (error) throw error;
        if(data[0]){
            req.session.username = username;
            res.redirect('/list');
        }else{
            var warning = "<span style='color:brown'>Incorrect account</span>";
            res.render('login',{warning:warning,errorClass:'has-error'});
        }
    });
});

router.get('/logout',(req,res)=>{
    res.render('login',{warning:'',errorClass:''});
    req.session.destroy();
});

module.exports = router;