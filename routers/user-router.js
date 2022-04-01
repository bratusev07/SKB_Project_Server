const Router = require('express').Router;
const router = new Router();
const userController = require('../controllers/user-controller');
const {body, query} = require('express-validator');
const authMiddleware = require('../middlewares/auth-middleware');

router.post('/registration',
    userController.registration);
router.post('/removeUser',
    query('userID').isMongoId(),
    authMiddleware,
    userController.remove);
router.post('/login',
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
    authMiddleware,
    userController.updateUser);

module.exports = router;