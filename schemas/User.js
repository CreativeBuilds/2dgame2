var mongoose = require('mongoose');
var Schema = mongoose.Schema;

var UserSchema = new Schema({
  username:String,
  email:String
});

var User = mongoose.model('User', UserSchema);

//export User;