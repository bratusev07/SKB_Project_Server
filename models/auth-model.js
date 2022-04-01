const {Schema, model} = require('mongoose');

const AuthSchema = new Schema({
    email: {type: String, unique: true, required: true},
    password: {type: String, required: true},
    userId: {type: String, unique: true, required: true}
}, {versionKey:false});

module.exports = model('Auth', AuthSchema);