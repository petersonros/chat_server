const { Router } = require('express');
const UsersController = require('../modules/users/usersController');

const router = Router();

router.get('/', UsersController.findAll);
router.get('/:id', UsersController.findOne);
router.post('/', UsersController.create);
router.put('/:id', UsersController.update);
router.delete('/:id', UsersController.delete);

router.post('/register', UsersController.register);
router.post('/confirm-register', UsersController.confirmRegister);
router.post('/login', UsersController.login);

module.exports = router;