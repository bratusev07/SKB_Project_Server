const {Schema, model} = require('mongoose');
const UserSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    userName: {type: String, required: true},
    userLastName: {type: String, required: true},
    userPhoto: {type: String},
    userSetting: {type: String}
}, {versionKey:false});

module.exports = model('User', UserSchema);