const Router = require('express').Router;
const router = new Router();
const userController = require('../controllers/user-controller');
const {body, query} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/registration',
    body('email').isEmail(),
    body('password').isLength({
            min: process.env.PASSWORD_MIN_LENGTH,
            max: process.env.PASSWORD_MAX_LENGTH
        }),
    userController.registration);

router.post('/removeUser',
    query('userID').isMongoId(),
    authMiddleware,
    userController.remove);

router.post('/login',
    body('email').isEmail(),
    body('password').isLength({
        min: process.env.PASSWORD_MIN_LENGTH,
        max: process.env.PASSWORD_MAX_LENGTH
    }),
    userController.login);

router.post('/logout',
    authMiddleware,
    userController.logout);

router.get('/getUser',
    query('userID').isMongoId(),
    authMiddleware,
    userController.getUser);

router.get('/getAllUsers',
    authMiddleware,
    userController.getAllUsers);

router.put('/updateUser',
    body('userId').isMongoId(),
    body('email').isEmail(),
    body('password').isLength({
        min: process.env.PASSWORD_MIN_LENGTH,
        max: process.env.PASSWORD_MAX_LENGTH
    }),
    authMiddleware,
    userController.updateUser);

router.post('/uploadVisit',
    body('userId').isMongoId(),
    body('date').isString(),
    body('startTime').isString(),
    body('endTime').isString(),
    authMiddleware,
    userController.uploadVisit);

router.get('/newsfeed', userController.getNews)

router.get('/getCSV', userController.getCSV)

router.get('/code', userController.generateCode)
module.exports = router;