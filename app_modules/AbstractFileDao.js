/**
 * Created by Eamonn on 2015/10/16.
 */
var dataSource = require('../app_db/dataSource.js');
var uuid = require('node-uuid');
var message = require('./_utils/messageGenerator.js');

var AbstractFileDao = function(collectionName){
    this.dataCollection = dataSource.getDB().collection(collectionName);
};
AbstractFileDao.prototype.prepareNewObj = function(obj){
    if(obj === undefined || obj === null){
        obj = {};
    }
    obj.id = uuid.v1(); // -> '6c84fb90-12c4-11e1-840d-7b25c5ee775a'
    obj.createTime = new Date();
    obj.lastModify = obj.createTime;
    return obj;
};
AbstractFileDao.prototype.insertOne = function(data,next){
    data = this.prepareNewObj(data);
    this.dataCollection.insert(data,function(err,result){
        if(err){
            next(message.genSimpFailedMsg(err.message, err.stack));
        }else{
            next(message.genSimpSuccessMsg(null, data.id));
        }
    })
};

module.exports = AbstractFileDao;