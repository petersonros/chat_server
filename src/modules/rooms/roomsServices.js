const prisma = require("../../utils/database");
const { v4 } = require("uuid");
const MessagesServices = require("../messages/messagesServices");

const RoomsServices = {
  async findAll() {
    const rooms = await prisma.room.findMany();
    return rooms;
  },

  async findOne(id) {
    const room = await prisma.room.findUnique({
      where: { id },
    });
    return room;
  },

  async create(data) {
    const code = v4().split("-")[0];
    const room = await prisma.room.create({
      data: {
        code,
        name: data.name,
      },
    });
    return room;
  },

  async update(id, data) {
    const room = await prisma.room.update({
      where: { id },
      data: {
        name: data.name,
      },
    });
    return room;
  },

  async delete(id) {
    const room = await prisma.room.delete({
      where: { id },
    });
    return room;
  },

  async findMessages(id) {
    const messages = MessagesServices.findAll({ roomId: id });
    return messages;
  },
};

module.exports = RoomsServices;