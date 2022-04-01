const Router = require('express').Router;
const router = new Router();
const userController = require('../controllers/user-controller');
const {body, query} = require('express-validator');

router.post('/registration', userController.registration);
router.post('/removeUser',
    query('userID').isMongoId(),
    userController.remove);
router.post('/login', userController.login);
router.post('/logout', userController.logout);
router.get('/getUser',
    query('userID').isMongoId(),
    userController.getUser);
router.get('/getAllUsers', userController.getAllUsers);
router.put('/updateUser', userController.updateUser);

module.exports = router;