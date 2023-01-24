const UsersServices = require('../modules/users/usersServices');
const { logger } = require('../utils/logger');

function authenticate() {
  return async (req, res, next) => {
    const returnError = () =>
      res.status(403).json({ success: false, msg: 'Token inválido' });

    const authorization = req.headers.authorization;
    if (!authorization) return returnError();

    const token = authorization.replace('Bearer ', '');

    try {
      const user = await UsersServices.findByToken(token);

      if (!user) return returnError();

      req.user = user;
      next();
    } catch (error) {
      logger.error(error);
      return returnError();
    }
  };
}

module.exports = authenticate;