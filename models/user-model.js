const {Schema, model} = require('mongoose');
const UserSchema = new Schema({
    userName: {type: String, required: true},
    userLastName: {type: String, required: true},
    userPhoto: {type: String},
    userSetting: {type: String}
}, {versionKey:false});

module.exports = model('User', UserSchema);