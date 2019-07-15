const MongoClient = require('mongodb');
const URL = 'mongodb://localhost:27017';

function _connect(cal){
    MongoClient.connect(URL,{useNewUrlParser:true},(error,db)=>{
        if (error) throw error;
        const dbo = db.db('node_project');
        cal(error,dbo);
        db.close();
    });
};

module.exports.find = function(collectionName,condition,cal){
    _connect((error,dbo)=>{
        if (error) throw error;
        dbo.collection(collectionName).find(condition).toArray((err,result)=>{
            if (err) throw err;
            cal(err,result);
        });
    });
};

module.exports.insert = function(collectionName,dataInsert,cal){
    _connect((error,dbo)=>{
        if(error) throw error;
        dbo.collection(collectionName).insertOne(dataInsert,(err,result)=>{
            if (err) throw err;
            cal(err,result);
        });
    });
};

module.exports.update = function(collectionName,condition,dataUpdate,cal){
    _connect((error,dbo)=>{
        if(error) throw error;
        dbo.collection(collectionName).updateOne(condition,{$set:dataUpdate},(err,result)=>{
            if (err) throw err;
            cal(err,result);
        });
    });
};

module.exports.delete = function(collectionName,condition,cal){
    _connect((error,dbo)=>{
        if(error) throw error;
        dbo.collection(collectionName).deleteOne(condition,(err,result)=>{
            if (err) throw err;
            cal(err,result);
        });
    });
};