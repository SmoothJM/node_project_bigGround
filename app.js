const express = require('express');
const session = require('express-session');
const uuu = require('url');
const app = express();
const loginManage = require('./routers/users/loginManage');
const display = require('./routers/items/display');
const itemManage = require('./routers/items/itemManage');

app.set('view engine','ejs');
app.set('views',__dirname+'/views');

app.use(express.static('public'));
app.use('/public',express.static('upload'));
app.use(session({
    secret:'I am Jim',
    resave:false,
    saveUninitialized:true,
    cookie:{
        maxAge:1000*60*60*24
    }
}));

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

app.get('/',loginManage);
app.get('/doLogin',loginManage);
app.get('/logout',loginManage);
app.get('/list',display);
app.get('/add',itemManage);
app.post('/doAdd',itemManage);
app.get('/doDelete/_id/:_id',itemManage);
app.get('/edit/_id/:_id',itemManage);
app.post('/edit/_id/doEdit',itemManage);

app.listen(8008);