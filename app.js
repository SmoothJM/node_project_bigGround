const express = require('express');
const session = require('express-session');
const uuu = require('url');
const md5 = require('md5');
const DB = require('./modules/db');
const ObjectID = require('mongodb').ObjectID;
const bodyParser = require('body-parser');
const app = express();


app.set('view engine','ejs');
app.set('views',__dirname+'/views');

app.use(express.static('public'));
app.use(session({
    secret:'I am Jim',
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge:1000*60*60*24
    }
}));
app.use(bodyParser.urlencoded({extended:false}));
app.use(bodyParser.json());
app.use((req,res,next)=>{
    if(req.url!='/' && req.url!='/favicon.ico' && uuu.parse(req.url).pathname!='/doLogin'){
        if(req.session.username){
            next();
        }else{
            var warning = "<span style='color:brown'>Login first</span>";
            res.render('login',{warning:warning,errorClass:''});
        }
    }else{
        next();
    }
});

app.get('/',(req,res)=>{
    res.render('login',{warning:'',errorClass:''});
});

app.get('/doLogin',(req,res)=>{
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
    /*下面是封装数据库操作前写法*/ 
    // MongoClient.connect(URL,{useNewUrlParser:true},(errorDB,db)=>{
    //     if(errorDB) throw errorDB;
    //     const dbo = db.db('node_project');
    //     dbo.collection('users').find(req.query,(errFind,result)=>{//{$and:[{username:username},{password:password}]}
    //         if(errFind) throw errFind;
    //         result.toArray((errResult,data)=>{
    //             if (errResult) throw errResult;
    //             if(data[0]){
    //                 req.session.username = username;
    //                 res.redirect('/add');
    //             }else{
    //                 var warning = "<span style='color:brown'>Incorrect account</span>";
    //                 res.render('login',{warning:warning,errorClass:'has-error'});
    //             }
    //         });
    //     });
    //     db.close();
    // }); 
});

app.get('/add',(req,res)=>{
    res.render('add',{username:req.session.username});
});

app.post('/doAdd',(req,res)=>{
    DB.insert('items',req.body,(error,result)=>{
        if(error) throw error;
        if(result.result.n===1){
            res.send("<script>location.href='/add';alert('添加成功！');</script>");
        }else{
            res.send("<script>location.href='/add';alert('添加失败！');</script>");
        }
       
    });
    
});

app.get('/list',(req,res)=>{
    DB.find('items',{},(error,result)=>{
        if (error) throw error;
        res.render('list',{username:req.session.username,items:result});
    });

    /*下面是封装数据库操作前写法*/ 
    // MongoClient.connect(URL,{useNewUrlParser:true},(error,db)=>{
    //     if (error) throw error;
    //     const dbo = db.db('node_project');
    //     dbo.collection('items').find().toArray((errFind,result)=>{
    //         if(errFind) throw errFind;
    //         res.render('list',{username:req.session.username,items:result});
    //     });
    //     db.close();
    // });
});

app.get('/doDelete/_id/:_id',(req,res)=>{
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
app.get('/edit/_id/:_id',(req,res)=>{
    var _id = req.params._id;
    DB.find('items',{_id:ObjectID(_id)},(error,result)=>{
        if (error) throw error;
        res.render('edit',{username:req.session.username,item:result[0]});
    });
});
app.post('/edit/_id/doEdit',(req,res)=>{
    DB.update('items',{_id:ObjectID(req.body._id)},{
        title:req.body.title,
        price:req.body.price,
        img:req.body.img,
        desc:req.body.desc,
    },(error,result)=>{
        if(error) throw error;
        if(result.result.n===1){
            res.send("<script>location.href='/list';alert('更新成功！');</script>");
        }else{
            res.send("<script>location.href='/list';alert('更新失败！');</script>");
        }
    });
    // res.send(req.body);
});
app.get('/logout',(req,res)=>{
    res.render('login',{warning:'',errorClass:''});
    req.session.destroy();
});

app.listen(8008);