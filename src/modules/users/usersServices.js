const prisma = require('../../utils/database');

const UsersServices = {
  async findAll() {
    const users = await prisma.user.findMany();
    return users;
  },

  async findOne(id) {
    const user = await prisma.user.findUnique({
      where: { id },
    });
    return user;
  },

  async create(data) {
    const user = await prisma.user.create({
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
    return user;
  },

  async update(id, data) {
    const user = await prisma.user.update({
      where: { id },
      data: {
        name: data.name,
        email: data.email,
        password: data.password,
      },
    });
    return user;
  },

  async delete(id) {
    const user = await prisma.user.delete({
      where: { id },
    });
    return user;
  },
};

module.exports = UsersServices;