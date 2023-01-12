const UserServices = require("./usersServices");

/* 
    CRUD

    READ_ALL    GET     /
    READ_ONE    GET     /:id
    CREATE      POST    /
    UPDATE      PUT     /:id
    DELETE      DELETE  /:id
*/

const UsersController = {
  async findAll(req, res) {
    const users = await UserServices.findAll();
    return res.json(users);
  },

  async findOne({ params }, res) {
    const user = await UsersServices.findOne(Number(params,id));
    return res.json(user);
  },

  async create({ body }, res) {
    const user = await UserServices.create(body);
    return res.json(user);
  },

  async update({ body, params }, res) {
    const user = await UserServices.update(Number(params,id), body);
    return res.json(user);
  },

  async delete({ params }, res) {
    const user = await UsersServices.delete(Number(params,id));
    return res.json(user);
  },
}

module.exports = UsersController;