const UserModel = require('../models/user-model');
const AuthModel = require('../models/auth-model');
const ApiError = require('../exeptions/api-error');
const UserDto = require('../dtos/user-dto');
const AuthDto = require('../dtos/auth-dto');
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
            const candidate = await AuthModel.findOne({email});
            if(candidate){
                throw ApiError.BadRequest("Пользователь с таким мэйлом существует");
            }

            const hashPassword = await bcrypt.hash(password, 3);
            const user = await UserModel.create({userName, userLastName, userPhoto, userSetting});
            const auth = await AuthModel.create({email, password: hashPassword, userId: user.id});
            const userData = {user, auth};
            return res.json(userData);
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
            const auth = await AuthModel.findOne({userId: userID});
            const userData = {user, auth};
            return res.json(userData);
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
            await AuthModel.findOneAndRemove({userId: userID});
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
            const auth = await AuthModel.findOne({email});
            const authDto = new AuthDto(auth);
            const user = await UserModel.findById(authDto.userId);
            if (!auth) {
                throw ApiError.BadRequest('Пользователь с таким мылом не найден');
            }
            const isPassEquals = await bcrypt.compare(password, authDto.password);
            if (!isPassEquals) {
                throw ApiError.BadRequest('Неверный пароль');
            }
            
            const userDto = new UserDto(user);
            const tokens = tokenService.generateToken({...userDto});
            await tokenService.saveToken(userDto.id, tokens.refreshToken);

            return res.json([userDto, tokens]);
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

    async uploadVisit(req, res, next){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }

            const {userId, date, startTime, endTime} = req.body;
            const user = await UserModel.findById(userId);
            const visit = { date: date, startTime: startTime, endTime: endTime };
            user.visits.push(visit);
            user.save();

            return res.json(visit);
        }catch (e){
            next(e);
        }
    }

    async generateCode(req, res, next){
        try {
            const errors = validationResult(req);
            if (!errors.isEmpty()) {
                return next(ApiError.BadRequest('Ошибка при валидации', errors.array()));
            }
            return res.json(process.env.VERIFICATION_CODE);
        }catch (e){
            next(e);
        }
    }
}

module.exports = new UserController();