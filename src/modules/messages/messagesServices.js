const prisma = require('../../utils/database');

const MessagesServices = {
  async findAll(filter = {}) {
    const query = {};

    if (filter.roomId) {
      if (!query.where) query.where = {};

      query.where.roomId = filter.roomId;
    }

    const messages = await prisma.message.findMany(query);
    return messages;
  },

  async findOne(id) {
    const message = await prisma.message.findUnique({
      where: { id },
    });

    return message;
  },

  async create(data) {
    const message = await prisma.message.create({
      data: {
        content: data.content,
        userId: data.userId,
        roomId: data.roomId,
      },
    });

    return message;
  },

  async update(id, data) {
    const message = await prisma.message.update({
      where: { id },
      data: {
        content: data.content,
        userId: data.userId,
        roomId: data.roomId,
      },
    });

    return message;
  },

  async delete(id) {
    const message = await prisma.message.delete({
      where: { id },
    });

    return message;
  },
};

module.exports = MessagesServices;