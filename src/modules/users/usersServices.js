const { UserStatus, ConfirmCodeStatus } = require('@prisma/client');
const AuthService = require('../../utils/auth');
const createCode = require('../../utils/createCode');
const prisma = require('../../utils/database');
const MailService = require('../../utils/mail');

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
    const existsUser = await prisma.user.findFirst({
      where: { email: data.email },
    });

    if (existsUser && existsUser.status === UserStatus.ACTIVE)
      throw new Error('Já existe usuário com este e-mail!');

    const user =
      existsUser ||
      (await prisma.user.create({
        data: {
          name: data.name,
          email: data.email,
          password: data.password,
        },
      }));

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

  async findByEmail(email) {
    return await prisma.user.findFirst({ where: { email } });
  },

  async register(data) {
    const user = await UsersServices.create(data);

    await prisma.confirmCode.updateMany({
      where: { userId: user.id },
      data: { status: ConfirmCodeStatus.EXPIRED },
    });

    const code = createCode().withLetters().withNumbers().create(8);
    await prisma.confirmCode.create({ data: { code, userId: user.id } });

    return { user, code };
  },

  async confirmRegister(email, code) {
    const user = await UsersServices.findByEmail(email);
    if (!user) throw new Error('Usuário não encontrado!');

    const confirmCode = await prisma.confirmCode.findFirst({
      where: {
        userId: user.id,
        code,
        // status: ConfirmCodeStatus.PENDING,
      },
    });

    if (!confirmCode) throw new Error('Código não encontrado!');
    if (confirmCode.status !== ConfirmCodeStatus.PENDING)
      throw new Error('Código expirado!');

    await prisma.confirmCode.update({
      where: { id: confirmCode.id },
      data: { status: ConfirmCodeStatus.USED },
    });
    await prisma.user.update({
      where: { id: user.id },
      data: { status: UserStatus.ACTIVE },
    });
    return user;
  },

  async sendConfirmRegisterMail(data) {
    const html = MailService.template('register', {
      name: data.name,
      code: data.code,
    });
    MailService.sendMail(data.email, 'Confirmação do Registro!', html);
  },

  async login(data) {
    const user = await UsersServices.findByEmail(data.email);

    if (!user) throw new Error('E-mail não encontrado!');
    if (user.status !== UserStatus.ACTIVE) throw new Error('Usuário inválido');
    if (user.password !== data.password) throw new Error('Senha incorreta!');

    const token = AuthService.createToken({ id: user.id });
    return { user, token };
  },

  async findByToken(token) {
    const payload = AuthService.verifyToken(token);
    if (!payload || !payload.id) throw new Error('Token inválido!');
    const user = await UsersServices.findOne(payload.id);
    return user;
  },
};

module.exports = UsersServices;