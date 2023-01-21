const { logger } = require('../../utils/logger');
const RoomsServices = require('./roomsServices');

const RoomsController = {
  async findAll(req, res) {
    const rooms = await RoomsServices.findAll();
    return res.json(rooms);
  },

  async findOne({ params }, res) {
    const room = await RoomsServices.findOne(Number(params.id));
    return res.json(room);
  },

  async create({ body }, res) {
    const room = await RoomsServices.create(body);
    return res.json(room);
  },

  async update({ body, params }, res) {
    const room = await RoomsServices.update(Number(params.id), body);
    return res.json(room);
  },

  async delete({ params }, res) {
    const room = await RoomsServices.delete(Number(params.id));
    return res.json(room);
  },

  async findMessages({ params }, res) {
    logger.debug('Está caindo aqui!');
    const messages = await RoomsServices.findMessages(Number(params.id));
    return res.json(messages);
  },
};

module.exports = RoomsController;