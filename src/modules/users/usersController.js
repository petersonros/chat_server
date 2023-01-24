const UsersServices = require('./usersServices');

const UsersController = {
  async findAll(req, res) {
    const users = await UsersServices.findAll();
    return res.json(users);
  },

  async findOne({ params }, res) {
    const user = await UsersServices.findOne(Number(params.id));
    return res.json(user);
  },

  async create({ body }, res) {
    const user = await UsersServices.create(body);
    return res.json(user);
  },

  async update({ body, params }, res) {
    const user = await UsersServices.update(Number(params.id), body);
    return res.json(user);
  },

  async delete({ params }, res) {
    const user = await UsersServices.delete(Number(params.id));
    return res.json(user);
  },

  async register({ body }, res) {
    try {
      const { user, code } = await UsersServices.register(body);
      UsersServices.sendConfirmRegisterMail({ name: user.name, code });
      return res.json(user);
    } catch (error) {
      return res.status(400).json({ success: false, msg: error.message });
    }
  },

  async confirmRegister({ body }, res) {
    try {
      const user = await UsersServices.confirmRegister(body.email, body.code);
      return res.json(user);
    } catch (error) {
      return res.status(400).json({ success: false, msg: error.message });
    }
  },

  async login({ body }, res) {
    try {
      const { user, token } = await UsersServices.login(body);
      return res.json({ user, token });
    } catch (error) {
      return res.status(400).json({ success: false, msg: error.message });
    }
  },
};

module.exports = UsersController;