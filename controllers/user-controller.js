const UserModel = require('../models/user-model');
const ApiError = require('../exeptions/api-error');
const UserDto = require('../dtos/user-dto');
const bcrypt = require('bcrypt');
const tokenService = require('../services/token-service');
const {validationResult} = require('express-validator');

class UserController{

    async registration(req, res, next){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const {email, password, userName, userLastName, userPhoto, userSetting} = req.body;
            const candidate = await UserModel.findOne({email});
            if(candidate){
                throw ApiError.BadRequest("Пользователь с таким мэйлом существует");
            }

            const hashPassword = await bcrypt.hash(password, 3);
            const user = await UserModel.create({email, password: hashPassword, userName, userLastName, userPhoto, userSetting});
            const userDto = new UserDto(user);
            return res.json(userDto);
        }catch (e){
            next(e);
        }
    }

    async getUser(req, res, next){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const {userID} = req.query;
            const user = await UserModel.findById(userID);
            return res.json(user);
        }catch (e){
            next(e);
        }
    }

    async remove(req, res, next){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const {userID} = req.query;
            await UserModel.findByIdAndRemove(userID);
            return res.json("User was removed");
        }catch (e){
            next(e);
        }
    }

    async login(req, res, next){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const {email, password} = req.body;
            const user = await UserModel.findOne({email});
            if (!user) {
                throw ApiError.BadRequest('Пользователь с таким мылом не найден');
            }
            const isPassEquals = await bcrypt.compare(password, user.password);
            if (!isPassEquals) {
                throw ApiError.BadRequest('Неверный пароль');
            }
            
            const userDto = new UserDto(user);
            const tokens = tokenService.generateToken({...userDto});
            await tokenService.saveToken(userDto.id, tokens.refreshToken);
            return res.json(tokens);
        }catch (e){
            next(e);
        }
    }

    async logout(req, res, next){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const {refreshToken} = req.query;
            const token = await tokenService.removeToken(refreshToken);
            return res.json(token);
        }catch (e){
            next(e);
        }
    }

    async getAllUsers(req, res, next){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const users = await UserModel.find();
            return res.json(users);
        }catch (e){
            next(e);
        }
    }

    async updateUser(req, res, next){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            const user = await UserModel.findByIdAndUpdate(req.body.userId, req.body, {new: true});
            return res.json(user);
        }catch (e){
            next(e);
        }
    }
}

module.exports = new UserController();