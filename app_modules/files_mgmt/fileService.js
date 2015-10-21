/**
 * Created by Eamonn on 2015/10/16.
 */
var fileDao = new (require('./fileDao.js'))('canvasData');
//var uuId = require('./_utils/uuidGenerator.js');
var message = require('./../_utils/messageGenerator.js');
exports.save = function(fileName,usersId,user,pathData,next){
    console.log("dradd");
    var drawData = {};
    drawData.fileName = fileName;
    drawData.usersId = usersId;
    drawData.createUserId = user.id;
    drawData.pathData = pathData;
    fileDao.insertOne(drawData, function (data) {
        if(data){
            next(data);
        }
    });
};

exports.update = function(query,updateData,next){
    fileDao.updateOneRecord(query,updateData,function(data){
        if(data){
            next(data);
        }
    });
};