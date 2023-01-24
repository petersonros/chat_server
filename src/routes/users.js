const { Router } = require('express');
const UsersController = require('../modules/users/usersController');
const upload = require('../utils/upload');

const router = Router();

router.get('/me', UsersController.me);
router.post('/register', UsersController.register);
router.post('/confirm-register', UsersController.confirmRegister);
router.post('/login', UsersController.login);
router.post('/forget-password', UsersController.forgetPassword);
router.post('/reset-password', UsersController.resetPassword);
router.put('/:id/password', UsersController.updatePassword);
router.put(
  '/:id/avatar',
  upload.single('avatar'),
  UsersController.updateAvatar
);

router.get('/', UsersController.findAll);
router.get('/:id', UsersController.findOne);
router.post('/', UsersController.create);
router.put('/:id', UsersController.update);
router.delete('/:id', UsersController.delete);

module.exports = router;