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
};

module.exports = UsersController;