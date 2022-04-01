const jwt = require('jsonwebtoken');
const tokenModel = require('../models/token-model');

class TokenService {

    generateToken(payload) {
        const accessToken = jwt.sign(payload,
            process.env.JWT_ACCESS_SECRET, {expiresIn: process.env.ACCESS_TOKEN_TTL});
        const refreshToken = jwt.sign(payload,
            process.env.JWT_REFRESH_SECRET, {expiresIn: process.env.REFRESH_TOKEN_TTL});
        return {
            accessToken, refreshToken
        }
    }

    async saveToken(userId, refreshToken) {
        const tokenData = await tokenModel.findOne({user: userId});
        if (tokenData) {
            tokenData.refreshToken = refreshToken;
            return tokenData.save();
        }

        const token = await tokenModel.create({user: userId, refreshToken})
        return token;
    }

    async removeToken(refreshToken) {
        const tokenData = await tokenModel.deleteOne({refreshToken});
        return tokenData;
    }

    async findToken(refreshToken) {
        const tokenData = await tokenModel.findOne({refreshToken});
        return tokenData;
    }

    validateAccessToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_ACCESS_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }

    validateRefreshToken(token) {
        try {
            const userData = jwt.verify(token, process.env.JWT_REFRESH_SECRET);
            return userData;
        } catch (e) {
            return null;
        }
    }
}

module.exports = new TokenService();