/**
 * Created by Eamonn on 2015/10/20.
 */

var AbstractDao = require('../AbstractDao.js');
var utils = require('../_utils/utils.js');
var message = require('../_utils/messageGenerator.js');
var userDao = function(collectionName){
  AbstractDao.call(this,collectionName);
};

utils.extend(userDao,AbstractDao);

userDao.prototype.addUser = function (user,next) {
    this.dataCollection.insert({
      id: user.id,
      username: user.username,
      password: user.password,
      name: {
        firstName: user.name.firstName,
        lastName: user.name.lastName
      }
    }, function (err, data) {
      if (err) {
        next(message.genSimpFailedMsg(err.message, err.stack));
      } else {
        next(message.genSimpSuccessMsg(null, data));
      }
    });
};

module.exports = userDao;