const MessagesServices = require('./messagesServices');

const MessagesController = {
  async findAll(req, res) {
    const messages = await MessagesServices.findAll();
    return res.json(messages);
  },

  async findOne({ params }, res) {
    const message = await MessagesServices.findOne(Number(params.id));
    return res.json(message);
  },

  async create({ body }, res) {
    const message = await MessagesServices.create(body);
    return res.json(message);
  },

  async update({ body, params }, res) {
    const message = await MessagesServices.update(Number(params.id), body);
    return res.json(message);
  },

  async delete({ params }, res) {
    const message = await MessagesServices.delete(Number(params.id));
    return res.json(message);
  },
};
