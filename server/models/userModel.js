// server/models/userModel.js

// load the things we need
var mongoose = require('mongoose');
var bcrypt = require('bcrypt-nodejs');

// define the schema for our user model
var userSchema = mongoose.Schema({
  // For now we will forget about local and facebook and focus on google login
google: {
    id:         String,
    token:      String,
    email:      String,
    name:       String,
    givenName:  String,
    familyName: String,
    picture:    String,
    locale:     String,
    link:       String,
    callSign:   String
  },
tank : {
  speed:        Number,
  damage:       Number,
  HP:           Number,
  bulletFreq:   Number
  },
player: {
  kills:        Number,
  killed:       Number,
  date:         String,
  rank:         Number,
  level:        String,
  firstDate:    String,
  fired:        Number,
  onTarget:     Number
  }

}); 

// methods
// generating a hash
userSchema.methods.generateHash = function(password) {
  return bcrypt.hashSync(password, bcrypt.genSaltSync(8), null);
};

// checking if password is valid
userSchema.methods.validPassword = function(password) {
  return bcrypt.compareSync(password, this.local.password);
};

// create the model for users and expose it to our app
module.exports = mongoose.model('User', userSchema);