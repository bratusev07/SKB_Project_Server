const UserModel = require('../models/user-model');
const ApiError = require('../exeptions/api-error');
const UserDto = require('../dtos/user-dto');

class UserController{

    async registration(req, res, next){
        try {
            const {email, password, userName, userLastName, userPhoto, userSetting} = req.body;
            const candidate = await UserModel.findOne({email});
            if(candidate){
                throw ApiError.BadRequest("Пользователь с таким мэйлом существует");
            }
            const user = await UserModel.create({email, password, userName, userLastName, userPhoto, userSetting});
            const userDto = new UserDto(user);
            return res.json(userDto);
        }catch (e){
            next(e);
        }
    }

    async getUser(req, res, next){
        try {
            const {userID} = req.query;
            const user = await UserModel.findById(userID);
            return res.json(user);
        }catch (e){
            next(e);
        }
    }

    async remove(req, res, next){
        try {
            const {userID} = req.query;
            await UserModel.findByIdAndRemove(userID);
            return res.json("User was removed");
        }catch (e){
            next(e);
        }
    }

    async login(req, res, next){
        try {

        }catch (e){
            next(e);
        }
    }

    async logout(req, res, next){
        try {

        }catch (e){
            next(e);
        }
    }

    async getAllUsers(req, res, next){
        try {
            const users = await UserModel.find();
            return res.json(users);
        }catch (e){
            next(e);
        }
    }

    async updateUser(req, res, next){
        try {
            const user = await UserModel.findByIdAndUpdate(req.body._id, req.body, {new: true});
            return res.json(user);
        }catch (e){
            next(e);
        }
    }
}

module.exports = new UserController();