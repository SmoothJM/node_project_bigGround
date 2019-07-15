const express = require('express');
const DB = require('../../modules/db');
const ObjectID = require('mongodb').ObjectID;
const router = express.Router();
const multiparty = require('multiparty');
const fs = require('fs');
const path = require('path');

router.get('/add',(req,res)=>{
    res.render('add',{username:req.session.username});
});

router.post('/doAdd',(req,res)=>{
    const form = new multiparty.Form();
    form.uploadDir = 'public/upload';
    form.parse(req, function(err, fields, files) {
        if(err) throw err;
        var imgPathSp = files.img[0].path.split("\\");
        var imgPath = path.join(imgPathSp[1],imgPathSp[2]);
        DB.insert('items',{
            title:fields.title[0],
            price:fields.price[0],
            img:imgPath,
            desc:fields.desc[0],
        },(error,result)=>{
            if(error) throw error;
            if(result.result.n===1){
                res.send("<script>location.href='/add';alert('添加成功！');</script>");
            }else{
                res.send("<script>location.href='/add';alert('添加失败！');</script>");
            }
        });
    });
});
router.get('/doDelete/_id/:_id',(req,res)=>{
    // res.send(req.params._id);
    DB.delete('items',{_id:ObjectID(req.params._id)},(error,result)=>{
        if (error) throw error;
        if(result.result.n===1){
            res.send("<script>location.href='/list';alert('删除成功！');</script>");
        }else{
            res.send("<script>location.href='/list';alert('删除失败！');</script>");
        }
    });
});

router.get('/edit/_id/:_id',(req,res)=>{
    var _id = req.params._id;
    DB.find('items',{_id:ObjectID(_id)},(error,result)=>{
        if (error) throw error;
        res.render('edit',{username:req.session.username,item:result[0]});
    });
});
router.post('/edit/_id/doEdit',(req,res)=>{
    const form = new multiparty.Form();
    form.uploadDir = 'public/upload';
    form.parse(req,(err,fields,files)=>{
        if (err) throw err;
        var imgPathSp = files.img[0].path.split('\\');
        var imgPath = path.join(imgPathSp[1],imgPathSp[2]);
        if(files.img[0].originalFilename){
            var setData = {
                title:fields.title[0],
                price:fields.price[0],
                img:imgPath,
                desc:fields.desc[0]
            }
        }else {
            var setData = {
                title:fields.title[0],
                price:fields.price[0],
                desc:fields.desc[0]
            }
            fs.unlink('public\\'+imgPath,(err) => {
                if (err) throw err;
              });
        }
        DB.update('items',{_id:ObjectID(fields._id[0])},setData,(error,result)=>{
            if(error) throw error;
            if(result.result.n===1){
                res.send("<script>location.href='/list';alert('更新成功！');</script>");
            }else{
                res.send("<script>location.href='/list';alert('更新失败！');</script>");
            }
        });
    });
});
module.exports = router;